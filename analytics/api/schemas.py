from pydantic import BaseModel


class SalaryPredictionRequest(
    BaseModel
):
    workExp: int

    isRemote: bool

    country: str

    devType: str

    edLevel: str

    languages: list[str]

    databases: list[str]

    frameworks: list[str]


class SalaryPredictionResponse(
    BaseModel
):
    predictedSalary: float
    salaryMin: float
    salaryMax: float