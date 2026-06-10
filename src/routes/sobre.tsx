import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Card } from "@/components/ui/card";
import { Database, BarChart3, Brain, GraduationCap, Briefcase, LineChart } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      {
        title: "Sobre o Projeto — CarreiraTech",
      },
      {
        name: "description",
        content:
          "Plataforma de análise de carreiras em tecnologia com dashboards, recomendação de vagas e predição salarial baseada em Machine Learning.",
      },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-16">
        <div className="text-xs uppercase tracking-widest text-accent">
          Projeto de Ciência de Dados
        </div>

        <h1 className="mt-2 text-4xl md:text-5xl font-bold">Sobre o projeto</h1>

        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          O <strong className="text-foreground">CarreiraTech</strong> é uma plataforma desenvolvida
          para auxiliar estudantes e profissionais de tecnologia na análise do mercado de trabalho.
          O sistema reúne visualizações interativas, recomendações de vagas e um modelo de Machine
          Learning capaz de estimar salários com base no perfil profissional informado pelo usuário.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {[
            {
              icon: Database,
              title: "Bases de dados",
              text: "O projeto utiliza duas fontes distintas: um dataset real da Stack Overflow Developer Survey para treinamento do modelo de Machine Learning e análises salariais, além de um dataset sintético de vagas criado para demonstração do dashboard e do sistema de recomendação.",
            },
            {
              icon: BarChart3,
              title: "Análise descritiva",
              text: "Dashboards interativos permitem explorar salários, habilidades, senioridade e modelos de trabalho presentes no conjunto de dados utilizado pelo sistema.",
            },
            {
              icon: Brain,
              title: "Predição salarial com IA",
              text: "Modelo XGBoost treinado com mais de vinte mil profissionais de tecnologia para estimar faixas salariais com base em experiência, escolaridade, cargo, linguagens, frameworks e bancos de dados.",
            },
            {
              icon: GraduationCap,
              title: "Impacto social",
              text: "A plataforma reduz barreiras de entrada para novos profissionais ao fornecer informações acessíveis sobre carreiras, salários e habilidades valorizadas pelo mercado.",
            },
          ].map((card) => (
            <Card key={card.title} className="p-6 bg-card border-border/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                <card.icon className="h-5 w-5 text-primary-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">{card.title}</h3>

              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{card.text}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-10 p-7 bg-card/60 border-border/50">
          <h2 className="font-semibold text-lg">Funcionalidades da plataforma</h2>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div>
              <div className="flex items-center gap-2 font-medium">
                <LineChart className="h-4 w-4 text-accent" />
                Preditor Salarial
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                Estimativa salarial baseada em Inteligência Artificial, utilizando um modelo XGBoost
                treinado com dados reais do mercado global de tecnologia.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 font-medium">
                <BarChart3 className="h-4 w-4 text-accent" />
                Dashboard Analítico
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                Visualizações sobre salários, habilidades, senioridade e tendências observadas no
                mercado de trabalho.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 font-medium">
                <Briefcase className="h-4 w-4 text-accent" />
                Recomendação de Vagas
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                Sistema de recomendação baseado em compatibilidade de habilidades, área de
                interesse, senioridade e preferências profissionais.
              </p>
            </div>
          </div>
        </Card>

        <Card className="mt-6 p-7 bg-card/60 border-border/50">
          <h2 className="font-semibold text-lg">Fontes de Dados</h2>

          <div className="mt-5 space-y-5">
            <div>
              <h3 className="font-medium">Stack Overflow Developer Survey</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Dataset utilizado para treinamento do modelo XGBoost e para geração das análises
                salariais. Contém informações reais de milhares de profissionais de tecnologia,
                incluindo experiência, escolaridade, linguagens de programação, frameworks, bancos
                de dados e remuneração.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Dataset Sintético de Vagas</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Conjunto de vagas criado especificamente para demonstração do sistema. É utilizado
                pelo dashboard do mercado e pelo mecanismo de recomendação de vagas, contendo
                cargos, senioridade, faixas salariais, habilidades e modalidades de trabalho.
              </p>
            </div>
          </div>
        </Card>

        <Card className="mt-6 p-7 bg-card/60 border-border/50">
          <h2 className="font-semibold text-lg">Tecnologias utilizadas</h2>

          <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Frontend</strong>
              <p className="text-muted-foreground mt-1">
                React, TypeScript, TanStack Router, Tailwind CSS, Shadcn/UI e Recharts.
              </p>
            </div>

            <div>
              <strong>Backend e IA</strong>
              <p className="text-muted-foreground mt-1">
                Python, FastAPI, Pandas, NumPy, Scikit-Learn, XGBoost, Uvicorn e FastApi.
              </p>
            </div>
          </div>
        </Card>
      </main>

      <SiteFooter />
    </div>
  );
}
