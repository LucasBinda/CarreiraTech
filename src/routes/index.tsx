import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, BarChart3, Target, Brain, TrendingUp } from "lucide-react";
import { JOBS } from "../data/jobs";
import { topSkills, avgSalaryByArea } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CarreiraTech — Análise de Dados e Recomendação de Vagas para Iniciantes" },
      { name: "description", content: "Plataforma que aplica ciência de dados para analisar o mercado de trabalho de TI e recomendar vagas ideais para profissionais iniciantes." },
      { property: "og:title", content: "CarreiraTech — Vagas inteligentes para quem está começando" },
      { property: "og:description", content: "Descubra padrões do mercado, salários e habilidades em alta. Receba recomendações personalizadas." },
    ],
  }),
  component: Index,
});

function Index() {
  const top = topSkills(5);
  const areas = avgSalaryByArea().slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(var(--color-foreground)_1px,transparent_1px),linear-gradient(90deg,var(--color-foreground)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Projeto Integrador III · Ciência de Dados
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.05]">
            Encontre a vaga certa <br />
            <span className="text-gradient">com ciência de dados.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Analisamos centenas de vagas do mercado de TI brasileiro para entender salários, habilidades e tendências —
            e recomendamos as oportunidades mais compatíveis com o perfil de quem está começando.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant">
              <Link to="/recomendacoes">
                Receber recomendações <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/dashboard">Ver dashboard do mercado</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Vagas analisadas", value: JOBS.length },
              { label: "Áreas mapeadas", value: new Set(JOBS.map((j) => j.area)).size },
              { label: "Habilidades", value: new Set(JOBS.flatMap((j) => j.skills)).size },
              { label: "Empresas", value: new Set(JOBS.map((j) => j.company)).size },
            ].map((s) => (
              <Card key={s.label} className="bg-card/60 border-border/50 p-5">
                <div className="text-3xl font-display font-bold text-gradient">{s.value}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold">Como funciona</h2>
          <p className="mt-3 text-muted-foreground">Três etapas, do dado bruto à recomendação personalizada.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, title: "1. Coleta e análise", text: "Processamos um dataset de vagas do mercado de TI, extraindo padrões de salário, skills e senioridade." },
            { icon: Brain, title: "2. Modelo de matching", text: "Calculamos um score baseado em compatibilidade de skills, nível de experiência, área e modelo de trabalho." },
            { icon: Target, title: "3. Recomendação", text: "Você informa seu perfil e recebe as vagas mais compatíveis, com gaps de skills para evoluir." },
          ].map((s) => (
            <Card key={s.title} className="p-7 bg-card/60 border-border/50 hover:border-primary/40 transition-colors">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Insights preview */}
      <section className="bg-card/30 border-y border-border/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
                <TrendingUp className="h-3.5 w-3.5" /> Insights do mercado
              </div>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">O que os dados revelam</h2>
            </div>
            <Button asChild variant="ghost">
              <Link to="/dashboard">Ver dashboard completo <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <Card className="p-7 bg-card border-border/50">
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground">Top skills mais pedidas</h3>
              <ul className="mt-5 space-y-3">
                {top.map((s, i) => (
                  <li key={s.skill} className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground w-5">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-medium">{s.skill}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-gradient-primary" style={{ width: `${(s.count / top[0].count) * 100}%` }} />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{s.count}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-7 bg-card border-border/50">
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground">Áreas mais bem remuneradas</h3>
              <ul className="mt-5 space-y-4">
                {areas.map((a) => (
                  <li key={a.area}>
                    <div className="flex items-baseline justify-between">
                      <span className="font-medium">{a.area}</span>
                      <span className="font-mono text-accent font-semibold">R$ {a.salario.toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">salário médio mensal</div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-bold">Pronto para encontrar sua próxima vaga?</h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Conte sobre suas habilidades e nível de experiência. Em segundos, mostramos as vagas mais alinhadas ao seu perfil.
        </p>
        <Button asChild size="lg" className="mt-8 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant">
          <Link to="/recomendacoes">Começar agora <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </section>

      <SiteFooter />
    </div>
  );
}
