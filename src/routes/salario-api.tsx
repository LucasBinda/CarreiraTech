import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getMetadata,
  predictSalary,
  type Metadata,
  type SalaryPredictionResponse,
} from "@/services/api";

export const Route = createFileRoute("/salario-api")({
  component: SalarioV2Page,
});
import topLanguagesChart from "@/assets/charts/top_languages.png";
import topCountriesChart from "@/assets/charts/top_countries.png";
import salaryVsExperienceChart from "@/assets/charts/salary_vs_experience.png";
function SalarioV2Page() {
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  const [loading, setLoading] = useState(true);

  const [predicting, setPredicting] = useState(false);

  const [prediction, setPrediction] = useState<SalaryPredictionResponse | null>(null);

  const [workExp, setWorkExp] = useState(5);

  const [isRemote, setIsRemote] = useState(true);

  const [country, setCountry] = useState("");

  const [devType, setDevType] = useState("");

  const [edLevel, setEdLevel] = useState("");

  const [languages, setLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState("");

  const [databases, setDatabases] = useState<string[]>([]);
  const [databaseInput, setDatabaseInput] = useState("");

  const [frameworks, setFrameworks] = useState<string[]>([]);
  const [frameworkInput, setFrameworkInput] = useState("");

  useEffect(() => {
    getMetadata()
      .then((data) => {
        setMetadata(data);

        setCountry(data.countries[22] ?? "");

        setDevType(data.devTypes[0] ?? "");

        setEdLevel(data.edLevels[0] ?? "");
      })
      .finally(() => setLoading(false));
  }, []);

  const languageSuggestions =
    languageInput.trim().length === 0
      ? []
      : (metadata?.languages.filter(
          (language) =>
            language.toLowerCase().includes(languageInput.toLowerCase()) &&
            !languages.includes(language),
        ) ?? []);

  const databaseSuggestions =
    databaseInput.trim().length === 0
      ? []
      : (metadata?.databases.filter(
          (database) =>
            database.toLowerCase().includes(databaseInput.toLowerCase()) &&
            !databases.includes(database),
        ) ?? []);

  const frameworkSuggestions =
    frameworkInput.trim().length === 0
      ? []
      : (metadata?.frameworks.filter(
          (framework) =>
            framework.toLowerCase().includes(frameworkInput.toLowerCase()) &&
            !frameworks.includes(framework),
        ) ?? []);

  async function handlePredict() {
    if (!metadata) {
      return;
    }

    try {
      setPredicting(true);

      const result = await predictSalary({
        workExp,
        isRemote,
        country,
        devType,
        edLevel,
        languages,
        databases,
        frameworks,
      });

      setPrediction(result);
    } catch (error) {
      console.error(error);

      alert("Erro ao prever salário");
    } finally {
      setPredicting(false);
    }
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="mb-4">
          <h1 className="text-4xl font-bold">Modelo Preditivo</h1>

          <p className="text-muted-foreground mt-2">
            Previsão salarial utilizando XGBoost Regressor treinado com dados reais da{" "}
            <a
              href="https://github.com/StackExchange/Survey/tree/main/packages/archive/2025"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Stack Overflow Developer Survey
            </a>
          </p>
        </div>
        <div className="grid sm:grid-cols-5 gap-4 mb-4">
          {[
            {
              label: "R² (teste)",
              value: "0.600",
              hint: "Variância explicada",
            },
            {
              label: "MAE",
              value: "US$ 2.122",
              hint: "Erro absoluto médio",
            },
            {
              label: "RMSE",
              value: "US$ 2.974",
              hint: "Raiz do erro quadrático",
            },
            {
              label: "CV Score",
              value: "0.588",
              hint: "Validação cruzada",
            },
            {
              label: "Amostras",
              value: "20.614",
              hint: "Desenvolvedores",
            },
          ].map((metric) => (
            <Card key={metric.label} className="p-5 bg-card border-border/50">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {metric.label}
              </div>

              <div className="mt-2 font-display text-2xl font-bold text-gradient">
                {metric.value}
              </div>

              <div className="text-xs text-muted-foreground mt-1">{metric.hint}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="space-y-5">
              <div>
                <Label>Experiência</Label>

                <Input
                  type="number"
                  value={workExp}
                  onChange={(e) => setWorkExp(Number(e.target.value))}
                />
              </div>

              <div>
                <Label>País</Label>

                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {metadata?.countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Cargo</Label>

                <Select value={devType} onValueChange={setDevType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {metadata?.devTypes.map((devType) => (
                      <SelectItem key={devType} value={devType}>
                        {devType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Escolaridade</Label>

                <Select value={edLevel} onValueChange={setEdLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {metadata?.edLevels.map((edLevel) => (
                      <SelectItem key={edLevel} value={edLevel}>
                        {edLevel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Linguagens</Label>

                <div className="relative mt-2">
                  <Input
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    placeholder="Digite uma linguagem..."
                  />

                  {languageSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-popover shadow-elegant overflow-hidden max-h-60 overflow-y-auto">
                      {languageSuggestions.map((language) => (
                        <button
                          key={language}
                          type="button"
                          onClick={() => {
                            setLanguages([...languages, language]);

                            setLanguageInput("");
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-secondary"
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {languages.map((language) => (
                    <Button
                      key={language}
                      type="button"
                      variant="secondary"
                      onClick={() => setLanguages(languages.filter((item) => item !== language))}
                    >
                      {language} X
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Bancos de Dados</Label>

                <div className="relative mt-2">
                  <Input
                    value={databaseInput}
                    onChange={(e) => setDatabaseInput(e.target.value)}
                    placeholder="Digite um banco de dados..."
                  />

                  {databaseSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-popover shadow-elegant overflow-hidden max-h-60 overflow-y-auto">
                      {databaseSuggestions.map((database) => (
                        <button
                          key={database}
                          type="button"
                          onClick={() => {
                            setDatabases([...databases, database]);

                            setDatabaseInput("");
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-secondary"
                        >
                          {database}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {databases.map((database) => (
                    <Button
                      key={database}
                      type="button"
                      variant="secondary"
                      onClick={() => setDatabases(databases.filter((item) => item !== database))}
                    >
                      {database} X
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Frameworks</Label>

                <div className="relative mt-2">
                  <Input
                    value={frameworkInput}
                    onChange={(e) => setFrameworkInput(e.target.value)}
                    placeholder="Digite um framework..."
                  />

                  {frameworkSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-popover shadow-elegant overflow-hidden max-h-60 overflow-y-auto">
                      {frameworkSuggestions.map((framework) => (
                        <button
                          key={framework}
                          type="button"
                          onClick={() => {
                            setFrameworks([...frameworks, framework]);

                            setFrameworkInput("");
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-secondary"
                        >
                          {framework}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {frameworks.map((framework) => (
                    <Button
                      key={framework}
                      type="button"
                      variant="secondary"
                      onClick={() => setFrameworks(frameworks.filter((item) => item !== framework))}
                    >
                      {framework} X
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Trabalho Remoto</Label>

                <Select
                  value={isRemote ? "yes" : "no"}
                  onValueChange={(v) => setIsRemote(v === "yes")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="yes">Sim</SelectItem>

                    <SelectItem value="no">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handlePredict} disabled={predicting} className="w-full">
                {predicting ? "Calculando..." : "Prever salário"}
              </Button>
            </div>
          </Card>

          <Card className="p-8 flex items-center justify-center">
            {prediction === null ? (
              <div className="text-center">
                <div className="text-muted-foreground">Faça uma previsão</div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div>
                  <div className="text-sm uppercase tracking-wider text-muted-foreground">
                    Salário Previsto
                  </div>

                  <div className="text-5xl font-bold mt-3">
                    US${" "}
                    {(prediction.predictedSalary / 12).toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm uppercase tracking-wider text-muted-foreground">
                    Faixa Estimada
                  </div>

                  <div className="text-xl font-semibold mt-2">
                    US${" "}
                    {(prediction.salaryMin / 12).toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                    {" - "}
                    US${" "}
                    {(prediction.salaryMax / 12).toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>

                <div className="border-t pt-4 text-sm text-muted-foreground">
                  Modelo treinado para prever renda anual. Os resultados são convertidos para renda
                  mensal para facilitar a interpretação pelo usuário.
                </div>
              </div>
            )}
          </Card>
        </div>
        <section className="mt-16">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-widest text-accent">
              Análise Exploratória
            </div>

            <h2 className="mt-2 text-3xl font-bold">Dataset Stack Overflow Survey</h2>

            <p className="mt-3 text-muted-foreground max-w-3xl">
              Visualizações utilizadas durante a análise exploratória e treinamento do modelo
              XGBoost. Os gráficos ajudam a compreender os padrões salariais observados entre
              profissionais de tecnologia.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-card border-border/50">
              <h3 className="font-semibold mb-1">Salário x Experiência</h3>

              <p className="text-xs text-muted-foreground mb-5">
                Relação entre anos de experiência profissional e remuneração observada no dataset.
              </p>

              <img
                src={salaryVsExperienceChart}
                alt="Salary vs Experience"
                className="w-full rounded-lg border border-border"
              />
            </Card>

            <Card className="p-6 bg-card border-border/50">
              <h3 className="font-semibold mb-1">Linguagens com maiores salários médios</h3>

              <p className="text-xs text-muted-foreground mb-5">
                Comparação entre tecnologias e remuneração média observada na pesquisa.
              </p>

              <img
                src={topLanguagesChart}
                alt="Top Languages"
                className="w-full rounded-lg border border-border"
              />
            </Card>

            <Card className="p-6 bg-card border-border/50">
              <h3 className="font-semibold mb-1">Países com maiores salários médios</h3>

              <p className="text-xs text-muted-foreground mb-5">
                Diferenças salariais entre mercados internacionais de tecnologia.
              </p>

              <img
                src={topCountriesChart}
                alt="Top Countries"
                className="w-full rounded-lg border border-border"
              />
            </Card>

            <Card className="p-6 bg-card/60 border-border/50">
              <h3 className="font-semibold text-accent">Principais conclusões</h3>

              <div className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Profissionais com mais anos de experiência apresentam tendência de crescimento
                  salarial consistente.
                </p>

                <p>
                  Algumas linguagens possuem remuneração média significativamente maior, refletindo
                  demanda e especialização do mercado.
                </p>

                <p>
                  Países desenvolvidos concentram as maiores faixas salariais da pesquisa,
                  evidenciando diferenças econômicas globais.
                </p>

                <p>
                  Esses padrões foram utilizados pelo modelo XGBoost para realizar as previsões
                  salariais apresentadas nesta página.
                </p>
              </div>
            </Card>
          </div>
        </section>
        <SiteFooter />
      </main>
    </div>
  );
}
