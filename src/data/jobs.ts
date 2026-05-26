// Dataset simulado baseado em padrões reais do mercado de TI brasileiro
// (inspirado em datasets do Kaggle como "Brazil Tech Jobs" e "LinkedIn Jobs")

export type Seniority = "Estágio" | "Júnior" | "Pleno" | "Sênior";
export type WorkModel = "Remoto" | "Híbrido" | "Presencial";

export interface Job {
  id: string;
  title: string;
  company: string;
  area: string;
  seniority: Seniority;
  salaryMin: number;
  salaryMax: number;
  location: string;
  workModel: WorkModel;
  skills: string[];
  description: string;
}

const companies = [
  "Nubank", "iFood", "Magazine Luiza", "Stone", "Mercado Livre", "Globo",
  "PicPic", "Loft", "Creditas", "QuintoAndar", "Hotmart", "RD Station",
  "Movile", "VTEX", "TOTVS", "Locaweb", "Inter", "C6 Bank", "XP Inc",
];

const cities = [
  "São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", "Florianópolis, SC",
  "Porto Alegre, RS", "Recife, PE", "Curitiba, PR", "Remoto - Brasil",
];

const templates: Array<Omit<Job, "id" | "company" | "location"> & { weight: number }> = [
  { title: "Analista de Dados", area: "Dados", seniority: "Júnior", salaryMin: 4000, salaryMax: 6500, workModel: "Híbrido", skills: ["SQL", "Python", "Power BI", "Excel"], description: "Apoiar squads na análise descritiva, construção de dashboards e extração de insights.", weight: 5 },
  { title: "Cientista de Dados", area: "Dados", seniority: "Pleno", salaryMin: 9000, salaryMax: 14000, workModel: "Remoto", skills: ["Python", "Machine Learning", "SQL", "Pandas", "Scikit-learn"], description: "Desenvolver modelos preditivos para problemas de negócio.", weight: 4 },
  { title: "Engenheiro de Dados", area: "Dados", seniority: "Pleno", salaryMin: 10000, salaryMax: 16000, workModel: "Remoto", skills: ["Python", "SQL", "Airflow", "Spark", "AWS"], description: "Construir pipelines de dados em larga escala.", weight: 3 },
  { title: "Estagiário em Ciência de Dados", area: "Dados", seniority: "Estágio", salaryMin: 1800, salaryMax: 2500, workModel: "Híbrido", skills: ["Python", "SQL", "Estatística", "Excel"], description: "Apoiar o time em análises exploratórias e relatórios.", weight: 4 },
  { title: "Analista BI Júnior", area: "Dados", seniority: "Júnior", salaryMin: 3800, salaryMax: 6000, workModel: "Híbrido", skills: ["Power BI", "SQL", "Excel", "DAX"], description: "Construir dashboards e indicadores de negócio.", weight: 4 },

  { title: "Desenvolvedor Front-end", area: "Desenvolvimento", seniority: "Júnior", salaryMin: 4500, salaryMax: 7000, workModel: "Remoto", skills: ["React", "TypeScript", "HTML", "CSS", "Git"], description: "Implementar interfaces web responsivas e acessíveis.", weight: 5 },
  { title: "Desenvolvedor Back-end", area: "Desenvolvimento", seniority: "Júnior", salaryMin: 5000, salaryMax: 7500, workModel: "Híbrido", skills: ["Node.js", "SQL", "API REST", "Git"], description: "Desenvolver APIs e serviços de backend.", weight: 5 },
  { title: "Desenvolvedor Full Stack", area: "Desenvolvimento", seniority: "Pleno", salaryMin: 8000, salaryMax: 13000, workModel: "Remoto", skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"], description: "Atuar em frontend e backend de produtos digitais.", weight: 4 },
  { title: "Estagiário em Desenvolvimento", area: "Desenvolvimento", seniority: "Estágio", salaryMin: 1500, salaryMax: 2200, workModel: "Presencial", skills: ["JavaScript", "HTML", "CSS", "Git"], description: "Apoiar squads no desenvolvimento de features.", weight: 4 },
  { title: "Desenvolvedor Mobile", area: "Desenvolvimento", seniority: "Pleno", salaryMin: 8500, salaryMax: 13500, workModel: "Remoto", skills: ["React Native", "TypeScript", "Git", "API REST"], description: "Desenvolver apps mobile para iOS e Android.", weight: 3 },

  { title: "QA / Analista de Testes", area: "Qualidade", seniority: "Júnior", salaryMin: 4000, salaryMax: 6000, workModel: "Híbrido", skills: ["Testes Manuais", "Cypress", "SQL", "Git"], description: "Garantir qualidade através de testes automatizados e manuais.", weight: 3 },

  { title: "Analista de Produto Júnior", area: "Produto", seniority: "Júnior", salaryMin: 5000, salaryMax: 7500, workModel: "Híbrido", skills: ["SQL", "Excel", "Figma", "Comunicação"], description: "Apoiar PMs na descoberta e priorização de features.", weight: 3 },
  { title: "Designer UX/UI", area: "Design", seniority: "Júnior", salaryMin: 4500, salaryMax: 6800, workModel: "Remoto", skills: ["Figma", "Design System", "Prototipação", "Pesquisa"], description: "Desenhar interfaces centradas no usuário.", weight: 3 },

  { title: "Analista de Marketing Digital", area: "Marketing", seniority: "Júnior", salaryMin: 3500, salaryMax: 5500, workModel: "Híbrido", skills: ["Google Ads", "SEO", "Excel", "Analytics"], description: "Gerenciar campanhas digitais e mensurar resultados.", weight: 3 },

  { title: "DevOps Engineer", area: "Infraestrutura", seniority: "Pleno", salaryMin: 10000, salaryMax: 15000, workModel: "Remoto", skills: ["AWS", "Docker", "Kubernetes", "Linux", "CI/CD"], description: "Manter infraestrutura cloud e pipelines de deploy.", weight: 2 },
  { title: "Analista de Segurança", area: "Segurança", seniority: "Pleno", salaryMin: 8000, salaryMax: 13000, workModel: "Híbrido", skills: ["Pentest", "Linux", "Networking", "OWASP"], description: "Avaliar vulnerabilidades e proteger sistemas.", weight: 2 },
];

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

export const JOBS: Job[] = (() => {
  const rand = seededRandom(42);
  const out: Job[] = [];
  let i = 0;
  for (const t of templates) {
    for (let n = 0; n < t.weight * 3; n++) {
      const company = companies[Math.floor(rand() * companies.length)];
      const location = t.workModel === "Remoto" ? "Remoto - Brasil" : cities[Math.floor(rand() * cities.length)];
      const variance = 0.85 + rand() * 0.3;
      out.push({
        id: `job-${i++}`,
        title: t.title,
        company,
        area: t.area,
        seniority: t.seniority,
        salaryMin: Math.round((t.salaryMin * variance) / 100) * 100,
        salaryMax: Math.round((t.salaryMax * variance) / 100) * 100,
        location,
        workModel: t.workModel,
        skills: t.skills,
        description: t.description,
      });
    }
  }
  return out;
})();

export const ALL_SKILLS = Array.from(new Set(JOBS.flatMap((j) => j.skills))).sort();
export const ALL_AREAS = Array.from(new Set(JOBS.map((j) => j.area))).sort();
