const API_URL = "http://localhost:8000";

export interface Metadata {
  countries: string[];
  devTypes: string[];
  edLevels: string[];
  languages: string[];
  frameworks: string[];
  databases: string[];
}

export interface SalaryPredictionRequest {
  workExp: number;
  isRemote: boolean;
  country: string;
  devType: string;
  edLevel: string;
  languages: string[];
  databases: string[];
  frameworks: string[];
}

export interface SalaryPredictionResponse {
  predictedSalary: number;
  salaryMin: number;
  salaryMax: number;
}

export async function getMetadata(): Promise<Metadata> {
  const response = await fetch(`${API_URL}/metadata`);

  if (!response.ok) {
    throw new Error("Erro ao carregar metadata");
  }
  return response.json();
}

export async function predictSalary(
  payload: SalaryPredictionRequest,
): Promise<SalaryPredictionResponse> {
  const response = await fetch(`${API_URL}/predict-salary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Erro ao prever salário");
  }

  return response.json();
}
