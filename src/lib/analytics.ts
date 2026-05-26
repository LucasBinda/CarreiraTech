import { JOBS, type Job, type Seniority } from "@/data/jobs";

export function avgSalaryByArea() {
  const map = new Map<string, number[]>();
  for (const j of JOBS) {
    const avg = (j.salaryMin + j.salaryMax) / 2;
    if (!map.has(j.area)) map.set(j.area, []);
    map.get(j.area)!.push(avg);
  }
  return Array.from(map.entries())
    .map(([area, vals]) => ({ area, salario: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) }))
    .sort((a, b) => b.salario - a.salario);
}

export function topSkills(limit = 10) {
  const counts = new Map<string, number>();
  for (const j of JOBS) for (const s of j.skills) counts.set(s, (counts.get(s) ?? 0) + 1);
  return Array.from(counts.entries())
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function jobsBySeniority() {
  const order: Seniority[] = ["Estágio", "Júnior", "Pleno", "Sênior"];
  const counts = new Map<Seniority, number>();
  for (const j of JOBS) counts.set(j.seniority, (counts.get(j.seniority) ?? 0) + 1);
  return order.map((s) => ({ nivel: s, vagas: counts.get(s) ?? 0 }));
}

export function jobsByWorkModel() {
  const counts = new Map<string, number>();
  for (const j of JOBS) counts.set(j.workModel, (counts.get(j.workModel) ?? 0) + 1);
  return Array.from(counts.entries()).map(([modelo, vagas]) => ({ modelo, vagas }));
}

export interface Profile {
  skills: string[];
  seniority: Seniority;
  preferredArea?: string;
  workModel?: string;
  minSalary: number;
}

export interface Recommendation {
  job: Job;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

const SENIORITY_RANK: Record<Seniority, number> = { "Estágio": 0, "Júnior": 1, "Pleno": 2, "Sênior": 3 };

export function recommendJobs(profile: Profile, limit = 12): Recommendation[] {
  const userSkills = new Set(profile.skills.map((s) => s.toLowerCase()));
  const userRank = SENIORITY_RANK[profile.seniority];

  return JOBS.map((job): Recommendation => {
    const matched = job.skills.filter((s) => userSkills.has(s.toLowerCase()));
    const missing = job.skills.filter((s) => !userSkills.has(s.toLowerCase()));

    // Score components (0-100)
    const skillScore = job.skills.length === 0 ? 0 : (matched.length / job.skills.length) * 60;

    const jobRank = SENIORITY_RANK[job.seniority];
    const rankDiff = Math.abs(jobRank - userRank);
    const seniorityScore = rankDiff === 0 ? 20 : rankDiff === 1 ? 10 : 0;

    const areaScore = profile.preferredArea && profile.preferredArea === job.area ? 10 : 0;
    const modelScore = profile.workModel && profile.workModel === job.workModel ? 5 : 0;
    const salaryScore = job.salaryMax >= profile.minSalary ? 5 : 0;

    const score = Math.round(skillScore + seniorityScore + areaScore + modelScore + salaryScore);
    return { job, score, matchedSkills: matched, missingSkills: missing };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
