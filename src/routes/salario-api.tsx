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

  useEffect(() => {
    getMetadata()
      .then((data) => {
        setMetadata(data);

        setCountry(data.countries[0] ?? "");

        setDevType(data.devTypes[0] ?? "");

        setEdLevel(data.edLevels[0] ?? "");
      })
      .finally(() => setLoading(false));
  }, []);

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
        languages: [],
        databases: [],
        frameworks: [],
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Preditor Salarial IA</h1>

          <p className="text-muted-foreground mt-2">
            Modelo XGBoost treinado com 20.614 profissionais.
          </p>
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
                    {prediction.predictedSalary.toLocaleString("en-US", {
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
                    {prediction.salaryMin.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                    {" - "}
                    US${" "}
                    {prediction.salaryMax.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>

                <div className="border-t pt-4 text-sm text-muted-foreground">
                  Previsão gerada pelo modelo XGBoost treinado com 20.614 profissionais de
                  tecnologia.
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
