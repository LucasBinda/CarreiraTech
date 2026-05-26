import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Card } from "@/components/ui/card";
import { Database, BarChart3, Brain, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o Projeto — CarreiraTech" },
      { name: "description", content: "Projeto Integrador III de Ciência de Dados: análise do mercado de trabalho de TI e recomendação de vagas para iniciantes." },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-4xl px-6 py-16">
        <div className="text-xs uppercase tracking-widest text-accent">Projeto Integrador III</div>
        <h1 className="mt-2 text-4xl md:text-5xl font-bold">Sobre o projeto</h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          O <strong className="text-foreground">CarreiraTech</strong> aplica técnicas de ciência de dados à análise do mercado de trabalho
          de tecnologia, com foco em ajudar profissionais iniciantes a encontrar vagas compatíveis com suas habilidades, nível
          de experiência e expectativas salariais.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {[
            { icon: Database, title: "Coleta de dados", text: "Dataset de vagas inspirado em fontes públicas como Kaggle e portais de emprego, com padrões realistas do mercado brasileiro." },
            { icon: BarChart3, title: "Análise descritiva", text: "Estatísticas sobre salários por área, distribuição por senioridade, modelos de trabalho e habilidades mais requisitadas." },
            { icon: Brain, title: "Modelo de recomendação", text: "Algoritmo de matching baseado em similaridade de skills, compatibilidade de senioridade, área e preferências do candidato." },
            { icon: GraduationCap, title: "Impacto social", text: "Reduz a barreira de entrada no mercado de tecnologia ao orientar iniciantes sobre que vagas buscar e que skills desenvolver." },
          ].map((c) => (
            <Card key={c.title} className="p-6 bg-card border-border/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                <c.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.text}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-10 p-7 bg-card/60 border-border/50">
          <h2 className="font-semibold text-lg">Metodologia do score de compatibilidade</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Cada vaga recebe uma pontuação de 0 a 100 calculada como combinação ponderada:
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between border-b border-border/50 pb-2"><span>Compatibilidade de habilidades</span><span className="font-mono text-accent">60 pts</span></li>
            <li className="flex justify-between border-b border-border/50 pb-2"><span>Proximidade de senioridade</span><span className="font-mono text-accent">20 pts</span></li>
            <li className="flex justify-between border-b border-border/50 pb-2"><span>Área de interesse</span><span className="font-mono text-accent">10 pts</span></li>
            <li className="flex justify-between border-b border-border/50 pb-2"><span>Modelo de trabalho</span><span className="font-mono text-accent">5 pts</span></li>
            <li className="flex justify-between"><span>Faixa salarial mínima atendida</span><span className="font-mono text-accent">5 pts</span></li>
          </ul>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
