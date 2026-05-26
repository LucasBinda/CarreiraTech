import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALL_SKILLS, ALL_AREAS, type Seniority } from "@/data/jobs";
import { recommendJobs, type Profile } from "@/lib/analytics";
import { Sparkles, Check, MapPin, Building2, X, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/recomendacoes")({
  head: () => ({
    meta: [
      { title: "Recomendações de Vagas — CarreiraTech" },
      { name: "description", content: "Informe seu perfil e receba recomendações personalizadas de vagas compatíveis com suas habilidades e nível de experiência." },
    ],
  }),
  component: Recomendacoes,
});

function Recomendacoes() {
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [seniority, setSeniority] = useState<Seniority>("Júnior");
  const [area, setArea] = useState<string>("any");
  const [model, setModel] = useState<string>("any");
  const [minSalary, setMinSalary] = useState<number>(2000);
  const [submitted, setSubmitted] = useState(false);

  const filteredSuggestions = useMemo(() => {
    if (!skillInput) return [];
    const q = skillInput.toLowerCase();
    return ALL_SKILLS.filter((s) => s.toLowerCase().includes(q) && !skills.includes(s)).slice(0, 6);
  }, [skillInput, skills]);

  const recommendations = useMemo(() => {
    if (!submitted) return [];
    const profile: Profile = {
      skills,
      seniority,
      preferredArea: area === "any" ? undefined : area,
      workModel: model === "any" ? undefined : model,
      minSalary,
    };
    return recommendJobs(profile, 12);
  }, [submitted, skills, seniority, area, model, minSalary]);

  function addSkill(s: string) {
    if (!skills.includes(s)) setSkills([...skills, s]);
    setSkillInput("");
  }
  function removeSkill(s: string) {
    setSkills(skills.filter((x) => x !== s));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-12">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-accent">Sistema de recomendação</div>
          <h1 className="mt-2 text-4xl font-bold">Encontre vagas para o seu perfil</h1>
          <p className="mt-3 text-muted-foreground">
            Conte sobre suas habilidades, nível e preferências. Calculamos um score de compatibilidade combinando skills,
            senioridade, área e modelo de trabalho.
          </p>
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Form */}
          <Card className="p-6 bg-card border-border/50 h-fit lg:sticky lg:top-24">
            <h2 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" /> Seu perfil</h2>

            <div className="mt-5 space-y-5">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Habilidades</Label>
                <div className="relative mt-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Digite uma skill (ex: Python, SQL...)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && filteredSuggestions[0]) {
                        e.preventDefault();
                        addSkill(filteredSuggestions[0]);
                      }
                    }}
                  />
                  {filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-popover shadow-elegant overflow-hidden">
                      {filteredSuggestions.map((s) => (
                        <button key={s} type="button" onClick={() => addSkill(s)} className="block w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {skills.map((s) => (
                      <Badge key={s} variant="secondary" className="gap-1 pr-1">
                        {s}
                        <button onClick={() => removeSkill(s)} className="rounded hover:bg-background/50 p-0.5"><X className="h-3 w-3" /></button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nível</Label>
                <Select value={seniority} onValueChange={(v) => setSeniority(v as Seniority)}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Estágio">Estágio</SelectItem>
                    <SelectItem value="Júnior">Júnior</SelectItem>
                    <SelectItem value="Pleno">Pleno</SelectItem>
                    <SelectItem value="Sênior">Sênior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Área de interesse</Label>
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Qualquer área</SelectItem>
                    {ALL_AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Modelo de trabalho</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Qualquer</SelectItem>
                    <SelectItem value="Remoto">Remoto</SelectItem>
                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                    <SelectItem value="Presencial">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Salário mínimo desejado</Label>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <Input type="number" value={minSalary} onChange={(e) => setMinSalary(Number(e.target.value) || 0)} min={0} step={500} />
                </div>
              </div>

              <Button onClick={() => setSubmitted(true)} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant" size="lg" disabled={skills.length === 0}>
                {skills.length === 0 ? "Adicione ao menos 1 skill" : "Recomendar vagas"}
              </Button>
            </div>
          </Card>

          {/* Results */}
          <div>
            {!submitted && (
              <Card className="p-12 bg-card/40 border-dashed border-border text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">Preencha seu perfil ao lado</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Quanto mais skills você adicionar, melhor será a precisão das recomendações.
                </p>
              </Card>
            )}

            {submitted && recommendations.length === 0 && (
              <Card className="p-12 text-center bg-card border-border/50">
                <h3 className="text-lg font-semibold">Nenhuma vaga compatível encontrada</h3>
                <p className="mt-2 text-sm text-muted-foreground">Tente adicionar mais skills ou ajustar os filtros.</p>
              </Card>
            )}

            {submitted && recommendations.length > 0 && (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-semibold">{recommendations.length} vagas recomendadas para você</h2>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Ordenadas por compatibilidade</span>
                </div>
                <div className="space-y-4">
                  {recommendations.map((r) => (
                    <Card key={r.job.id} className="p-6 bg-card border-border/50 hover:border-primary/40 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{r.job.title}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {r.job.company}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.job.location}</span>
                            <Badge variant="outline" className="text-[10px] py-0">{r.job.seniority}</Badge>
                            <Badge variant="outline" className="text-[10px] py-0">{r.job.workModel}</Badge>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-3xl font-display font-bold text-gradient leading-none">{r.score}</div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">match</div>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-muted-foreground">{r.job.description}</p>

                      <div className="mt-4 flex items-baseline justify-between">
                        <span className="font-mono text-sm text-accent font-semibold">
                          R$ {r.job.salaryMin.toLocaleString("pt-BR")} – {r.job.salaryMax.toLocaleString("pt-BR")}
                        </span>
                      </div>

                      <div className="mt-4 grid sm:grid-cols-2 gap-3">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Skills compatíveis</div>
                          <div className="flex flex-wrap gap-1">
                            {r.matchedSkills.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                            {r.matchedSkills.map((s) => (
                              <Badge key={s} className="bg-accent/15 text-accent border-accent/30 text-[10px] gap-1"><Check className="h-3 w-3" />{s}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Skills a desenvolver</div>
                          <div className="flex flex-wrap gap-1">
                            {r.missingSkills.length === 0 && <span className="text-xs text-muted-foreground">Você cobre tudo!</span>}
                            {r.missingSkills.map((s) => (
                              <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
