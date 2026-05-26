// Regressão Linear Múltipla via Equações Normais: β = (XᵀX)⁻¹ Xᵀy
// Implementação from-scratch (sem libs externas) para o PI-III.
// Features: senioridade (ordinal), área (one-hot), modelo de trabalho (one-hot),
// nº de skills (numérica) e indicadores binários das top-skills.

import { JOBS, ALL_AREAS, type Seniority, type WorkModel } from "@/data/jobs";

const SENIORITY_RANK: Record<Seniority, number> = {
  "Estágio": 0, "Júnior": 1, "Pleno": 2, "Sênior": 3,
};
const WORK_MODELS: WorkModel[] = ["Remoto", "Híbrido", "Presencial"];

// Top-N skills usadas como features binárias do modelo
const skillFreq = new Map<string, number>();
for (const j of JOBS) for (const s of j.skills) skillFreq.set(s, (skillFreq.get(s) ?? 0) + 1);
export const MODEL_SKILLS = Array.from(skillFreq.entries())
  .sort((a, b) => b[1] - a[1]).slice(0, 10).map(([s]) => s);

export interface FeatureInput {
  seniority: Seniority;
  area: string;
  workModel: WorkModel;
  skills: string[];
}

export function featureNames(): string[] {
  return [
    "Intercepto",
    "Senioridade (ordinal)",
    "Nº de skills",
    ...ALL_AREAS.map((a) => `Área: ${a}`),
    ...WORK_MODELS.map((m) => `Modelo: ${m}`),
    ...MODEL_SKILLS.map((s) => `Skill: ${s}`),
  ];
}

export function buildFeatureVector(input: FeatureInput): number[] {
  const v: number[] = [1]; // intercepto
  v.push(SENIORITY_RANK[input.seniority]);
  v.push(input.skills.length);
  for (const a of ALL_AREAS) v.push(input.area === a ? 1 : 0);
  for (const m of WORK_MODELS) v.push(input.workModel === m ? 1 : 0);
  const set = new Set(input.skills.map((s) => s.toLowerCase()));
  for (const s of MODEL_SKILLS) v.push(set.has(s.toLowerCase()) ? 1 : 0);
  return v;
}

// ---------- Álgebra linear mínima ----------
type Mat = number[][];

function transpose(A: Mat): Mat {
  const r = A.length, c = A[0].length;
  const T: Mat = Array.from({ length: c }, () => new Array(r).fill(0));
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) T[j][i] = A[i][j];
  return T;
}
function matmul(A: Mat, B: Mat): Mat {
  const r = A.length, c = B[0].length, k = B.length;
  const C: Mat = Array.from({ length: r }, () => new Array(c).fill(0));
  for (let i = 0; i < r; i++)
    for (let j = 0; j < c; j++) {
      let s = 0;
      for (let p = 0; p < k; p++) s += A[i][p] * B[p][j];
      C[i][j] = s;
    }
  return C;
}
// Inversa via Gauss-Jordan, com regularização (ridge λI) para estabilidade numérica
function inverse(A: Mat, ridge = 1e-6): Mat {
  const n = A.length;
  const M: Mat = A.map((row, i) => {
    const r = row.slice();
    r[i] += ridge;
    const id = new Array(n).fill(0); id[i] = 1;
    return r.concat(id);
  });
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    if (Math.abs(M[pivot][col]) < 1e-12) throw new Error("Matriz singular");
    [M[col], M[pivot]] = [M[pivot], M[col]];
    const div = M[col][col];
    for (let j = 0; j < 2 * n; j++) M[col][j] /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col];
      if (f === 0) continue;
      for (let j = 0; j < 2 * n; j++) M[r][j] -= f * M[col][j];
    }
  }
  return M.map((row) => row.slice(n));
}

// ---------- Treino do modelo ----------
export interface TrainedModel {
  coefficients: number[];
  featureNames: string[];
  metrics: { r2: number; mae: number; rmse: number; nTrain: number; nTest: number };
  predictions: { actual: number; predicted: number }[];
}

function predict(x: number[], beta: number[]): number {
  let s = 0;
  for (let i = 0; i < x.length; i++) s += x[i] * beta[i];
  return s;
}

export function trainSalaryModel(testRatio = 0.25): TrainedModel {
  // Dataset: salário médio como target
  const data = JOBS.map((j) => ({
    x: buildFeatureVector({
      seniority: j.seniority,
      area: j.area,
      workModel: j.workModel,
      skills: j.skills,
    }),
    y: (j.salaryMin + j.salaryMax) / 2,
  }));

  // Split determinístico (cada 4ª amostra vai para teste)
  const train: typeof data = [];
  const test: typeof data = [];
  data.forEach((d, i) => (i % Math.round(1 / testRatio) === 0 ? test.push(d) : train.push(d)));

  const X: Mat = train.map((d) => d.x);
  const y: Mat = train.map((d) => [d.y]);
  const Xt = transpose(X);
  const beta = matmul(matmul(inverse(matmul(Xt, X)), Xt), y).map((r) => r[0]);

  // Métricas no conjunto de teste
  const preds = test.map((d) => ({ actual: d.y, predicted: predict(d.x, beta) }));
  const meanY = test.reduce((a, d) => a + d.y, 0) / test.length;
  let ssRes = 0, ssTot = 0, absErr = 0, sqErr = 0;
  for (const p of preds) {
    ssRes += (p.actual - p.predicted) ** 2;
    ssTot += (p.actual - meanY) ** 2;
    absErr += Math.abs(p.actual - p.predicted);
    sqErr += (p.actual - p.predicted) ** 2;
  }
  const r2 = 1 - ssRes / ssTot;
  const mae = absErr / preds.length;
  const rmse = Math.sqrt(sqErr / preds.length);

  return {
    coefficients: beta,
    featureNames: featureNames(),
    metrics: { r2, mae, rmse, nTrain: train.length, nTest: test.length },
    predictions: preds,
  };
}

export function predictSalary(model: TrainedModel, input: FeatureInput): number {
  return predict(buildFeatureVector(input), model.coefficients);
}
