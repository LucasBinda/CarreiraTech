import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Card } from "@/components/ui/card";
import { JOBS } from "@/data/jobs";
import { avgSalaryByArea, topSkills, jobsBySeniority, jobsByWorkModel } from "@/lib/analytics";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Briefcase, DollarSign, MapPin, Users } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard do Mercado — CarreiraTech" },
      { name: "description", content: "Análise visual do mercado de TI brasileiro: salários por área, habilidades em alta, distribuição por senioridade e modelo de trabalho." },
    ],
  }),
  component: Dashboard,
});

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--foreground)",
};

function Dashboard() {
  const salaryData = avgSalaryByArea();
  const skillsData = topSkills(10);
  const seniorityData = jobsBySeniority();
  const modelData = jobsByWorkModel();

  const totalJobs = JOBS.length;
  const avgSalary = Math.round(JOBS.reduce((acc, j) => acc + (j.salaryMin + j.salaryMax) / 2, 0) / JOBS.length);
  const remotePercent = Math.round((JOBS.filter((j) => j.workModel === "Remoto").length / JOBS.length) * 100);
  const juniorJobs = JOBS.filter((j) => j.seniority === "Júnior" || j.seniority === "Estágio").length;

  const kpis = [
    { icon: Briefcase, label: "Vagas analisadas", value: totalJobs.toString(), hint: "do dataset" },
    { icon: DollarSign, label: "Salário médio", value: `R$ ${avgSalary.toLocaleString("pt-BR")}`, hint: "todas as áreas" },
    { icon: MapPin, label: "Vagas remotas", value: `${remotePercent}%`, hint: "do total" },
    { icon: Users, label: "Para iniciantes", value: juniorJobs.toString(), hint: "estágio + júnior" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-12">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-accent">Análise descritiva</div>
          <h1 className="mt-2 text-4xl font-bold">Dashboard do Mercado de TI</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Insights extraídos do dataset de vagas. Os gráficos abaixo mostram padrões de salário, habilidades requisitadas e oportunidades por nível.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {kpis.map((k) => (
            <Card key={k.label} className="p-6 bg-card border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</span>
                <k.icon className="h-4 w-4 text-accent" />
              </div>
              <div className="mt-3 text-3xl font-display font-bold">{k.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{k.hint}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Salário por área */}
          <Card className="p-6 bg-card border-border/50">
            <h2 className="font-semibold mb-1">Salário médio por área</h2>
            <p className="text-xs text-muted-foreground mb-5">Em reais (R$), considerando média entre mín. e máx.</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis dataKey="area" type="category" stroke="var(--muted-foreground)" fontSize={11} width={110} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
                <Bar dataKey="salario" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Top skills */}
          <Card className="p-6 bg-card border-border/50">
            <h2 className="font-semibold mb-1">Top 10 habilidades mais requisitadas</h2>
            <p className="text-xs text-muted-foreground mb-5">Frequência nas descrições das vagas</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="skill" stroke="var(--muted-foreground)" fontSize={10} angle={-30} textAnchor="end" height={60} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Senioridade */}
          <Card className="p-6 bg-card border-border/50">
            <h2 className="font-semibold mb-1">Vagas por nível de senioridade</h2>
            <p className="text-xs text-muted-foreground mb-5">Distribuição de oportunidades</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={seniorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="nivel" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="vagas" radius={[4, 4, 0, 0]}>
                  {seniorityData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Modelo de trabalho */}
          <Card className="p-6 bg-card border-border/50">
            <h2 className="font-semibold mb-1">Modelo de trabalho</h2>
            <p className="text-xs text-muted-foreground mb-5">Remoto, híbrido e presencial</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={modelData} dataKey="vagas" nameKey="modelo" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3}>
                  {modelData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="var(--background)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Insights cards */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Principais conclusões</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Demanda por iniciantes", text: `${Math.round((juniorJobs / totalJobs) * 100)}% das vagas são para estágio ou júnior — o mercado tem espaço para quem está começando.` },
              { title: "Trabalho remoto consolidado", text: `${remotePercent}% das vagas são 100% remotas, ampliando oportunidades fora dos grandes centros.` },
              { title: "Skills fundamentais", text: `${skillsData[0].skill}, ${skillsData[1].skill} e ${skillsData[2].skill} aparecem entre as mais pedidas — invista nelas primeiro.` },
            ].map((i) => (
              <Card key={i.title} className="p-6 bg-card/60 border-border/50">
                <h3 className="font-semibold text-accent">{i.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{i.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
