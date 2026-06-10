import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_AREAS, ALL_SKILLS, type Seniority, type WorkModel } from "@/data/jobs";
import { trainSalaryModel, predictSalary, MODEL_SKILLS } from "@/lib/regression";
import { Brain, TrendingUp, X, Sigma } from "lucide-react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

export const Route = createFileRoute("/salario")({
  head: () => ({
    meta: [
      { title: "Previsão Salarial (Regressão Linear) — CarreiraTech" },
      {
        name: "description",
        content:
          "Modelo de regressão linear múltipla treinado sobre o dataset de vagas para estimar a faixa salarial de um perfil.",
      },
    ],
  }),
  component: SalarioPage,
});

function fmt(n: number) {
  return n.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
}

function SalarioPage() {
  // Treina o modelo uma única vez (memoizado) ao montar a página
  const model = useMemo(() => trainSalaryModel(0.25), []);

  const [seniority, setSeniority] = useState<Seniority>("Júnior");
  const [area, setArea] = useState<string>(ALL_AREAS[0]);
  const [workModel, setWorkModel] = useState<WorkModel>("Remoto");
  const [skills, setSkills] = useState<string[]>(["Python", "SQL"]);
  const [skillInput, setSkillInput] = useState("");

  const suggestions = useMemo(() => {
    if (!skillInput) return [];
    const q = skillInput.toLowerCase();
    return ALL_SKILLS.filter((s) => s.toLowerCase().includes(q) && !skills.includes(s)).slice(0, 6);
  }, [skillInput, skills]);

  const predicted = useMemo(
    () => predictSalary(model, { seniority, area, workModel, skills }),
    [model, seniority, area, workModel, skills],
  );

  // Ranking dos coeficientes (excluindo intercepto) por magnitude
  const ranked = useMemo(() => {
    return model.coefficients
      .map((c, i) => ({ name: model.featureNames[i], coef: c }))
      .filter((c) => c.name !== "Intercepto")
      .sort((a, b) => Math.abs(b.coef) - Math.abs(a.coef))
      .slice(0, 12);
  }, [model]);

  const maxAbs = Math.max(...ranked.map((r) => Math.abs(r.coef)), 1);

  // Linha y=x para o scatter
  const scatterMax = Math.max(...model.predictions.map((p) => Math.max(p.actual, p.predicted)));

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-12">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-accent">Modelo preditivo</div>
          <h1 className="mt-2 text-4xl font-bold">Previsão salarial por regressão linear</h1>
          <p className="mt-3 text-muted-foreground">
            Modelo de <strong className="text-foreground">regressão linear múltipla</strong>{" "}
            treinado <em>from scratch</em> via equações normais{" "}
            <span className="font-mono text-accent">β = (XᵀX)⁻¹Xᵀy</span>, usando senioridade, área,
            modelo de trabalho e habilidades como variáveis preditoras.
          </p>
        </div>

        {/* Métricas */}
        <div className="grid sm:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "R² (teste)",
              value: model.metrics.r2.toFixed(3),
              hint: "Variância explicada",
            },
            { label: "MAE", value: `R$ ${fmt(model.metrics.mae)}`, hint: "Erro absoluto médio" },
            {
              label: "RMSE",
              value: `R$ ${fmt(model.metrics.rmse)}`,
              hint: "Raiz do erro quadrático",
            },
            {
              label: "Amostras",
              value: `${model.metrics.nTrain} / ${model.metrics.nTest}`,
              hint: "Treino / Teste",
            },
          ].map((m) => (
            <Card key={m.label} className="p-5 bg-card border-border/50">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {m.label}
              </div>
              <div className="mt-2 font-display text-2xl font-bold text-gradient">{m.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{m.hint}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-[420px_1fr] gap-8">
          {/* Formulário de previsão */}
          <Card className="p-6 bg-card border-border/50 h-fit lg:sticky lg:top-24">
            <h2 className="font-semibold flex items-center gap-2">
              <Brain className="h-4 w-4 text-accent" /> Faça uma previsão
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Nível
                </Label>
                <Select value={seniority} onValueChange={(v) => setSeniority(v as Seniority)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["Estágio", "Júnior", "Pleno", "Sênior"] as Seniority[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Área
                </Label>
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_AREAS.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Modelo de trabalho
                </Label>
                <Select value={workModel} onValueChange={(v) => setWorkModel(v as WorkModel)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remoto">Remoto</SelectItem>
                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                    <SelectItem value="Presencial">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Habilidades
                </Label>
                <div className="relative mt-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Adicione skills..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && suggestions[0]) {
                        e.preventDefault();
                        setSkills([...skills, suggestions[0]]);
                        setSkillInput("");
                      }
                    }}
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-popover shadow-elegant overflow-hidden">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setSkills([...skills, s]);
                            setSkillInput("");
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {skills.map((s) => (
                    <Badge key={s} variant="secondary" className="gap-1 pr-1">
                      {s}
                      <button
                        onClick={() => setSkills(skills.filter((x) => x !== s))}
                        className="rounded hover:bg-background/50 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-accent/30 bg-accent/5 p-5">
                <div className="text-xs uppercase tracking-widest text-accent">
                  Salário estimado
                </div>
                <div className="mt-2 font-display text-4xl font-bold text-gradient">
                  R$ {fmt(Math.max(0, predicted))}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  ± R$ {fmt(model.metrics.rmse)} (RMSE no conjunto de teste)
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSkills([]);
                  setSkillInput("");
                }}
              >
                Limpar skills
              </Button>
            </div>
          </Card>

          {/* Diagnóstico do modelo */}
          <div className="space-y-8">
            {/* Scatter previsto x real */}
            <Card className="p-6 bg-card border-border/50">
              <h2 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" /> Previsto vs. Real (conjunto de teste)
              </h2>
              <p className="text-sm text-blue-400 mt-1">
                Quanto mais próximos da linha diagonal, melhor a previsão.
              </p>
              <div className="h-80 mt-5">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                    <CartesianGrid stroke="hsl(var(--border) / 0.3)" strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="actual"
                      name="Real"
                      tick={{ fill: "#FFFFFF", fontSize: 11 }}
                      label={{
                        value: "Salário real (R$)",
                        position: "insideBottom",
                        offset: -5,
                        fill: "#FFFFFF",
                        fontSize: 11,
                      }}
                    />
                    <YAxis
                      type="number"
                      dataKey="predicted"
                      name="Previsto"
                      tick={{ fill: "#FFFFFF", fontSize: 11 }}
                      label={{
                        value: "Previsto (R$)",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#FFFFFF",
                        fontSize: 11,
                      }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      contentStyle={{
                        background: "#FFFFFF",
                        border: "#FFFFFF",
                        borderRadius: 8,
                      }}
                      formatter={(v: number) => `R$ ${fmt(v)}`}
                    />
                    <ReferenceLine
                      segment={[
                        { x: 0, y: 0 },
                        { x: scatterMax, y: scatterMax },
                      ]}
                      stroke="hsl(var(--accent))"
                      strokeDasharray="4 4"
                    />
                    <Scatter data={model.predictions} fill="#FFFFFF" fillOpacity={0.7} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Coeficientes */}
            <Card className="p-6 bg-card border-border/50">
              <h2 className="font-semibold flex items-center gap-2">
                <Sigma className="h-4 w-4 text-accent" /> Coeficientes mais influentes
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Quanto cada variável adiciona (verde) ou subtrai (vermelho) ao salário previsto.
              </p>
              <div className="mt-5 space-y-2.5">
                {ranked.map((r) => {
                  const pct = (Math.abs(r.coef) / maxAbs) * 100;
                  const positive = r.coef >= 0;
                  return (
                    <div key={r.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{r.name}</span>
                        <span
                          className={`font-mono ${positive ? "text-accent" : "text-destructive"}`}
                        >
                          {positive ? "+" : "−"} R$ {fmt(Math.abs(r.coef))}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full ${positive ? "bg-accent" : "bg-destructive"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-5 leading-relaxed">
                <strong className="text-foreground">Como ler:</strong> com tudo o mais constante,
                possuir essa característica altera o salário previsto em ± o valor mostrado. O
                modelo inclui regularização L2 (ridge λ=1e-6) para estabilidade numérica.
              </p>
            </Card>

            <Card className="p-6 bg-card/60 border-border/50">
              <h3 className="font-semibold">Metodologia</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                <li>
                  <strong className="text-foreground">Variável alvo:</strong> média entre salário
                  mínimo e máximo da vaga.
                </li>
                <li>
                  <strong className="text-foreground">Variáveis preditoras:</strong> senioridade
                  (ordinal 0–3), nº total de skills, one-hot de área, one-hot de modelo de trabalho
                  e indicadores binários das {MODEL_SKILLS.length} skills mais frequentes.
                </li>
                <li>
                  <strong className="text-foreground">Treino/Teste:</strong> divisão determinística
                  75% / 25% (a cada 4ª amostra vai para teste).
                </li>
                <li>
                  <strong className="text-foreground">Estimação:</strong> equações normais com
                  solução fechada, calculadas em JavaScript puro (sem libs de ML).
                </li>
                <li>
                  <strong className="text-foreground">Métricas:</strong> R² (variância explicada),
                  MAE (erro médio absoluto) e RMSE (raiz do erro quadrático médio).
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
