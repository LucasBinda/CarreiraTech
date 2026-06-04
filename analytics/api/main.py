from fastapi import FastAPI

from .schemas import (
    SalaryPredictionRequest,
    SalaryPredictionResponse
)

from .predictor import (
    predict_salary
)

app = FastAPI(
    title="CarreiraTech API",
    version="1.0.0"
)


@app.get("/")
def root():

    return {
        "message":
        "CarreiraTech API"
    }


@app.get("/health")
def health():

    return {
        "status": "ok"
    }


@app.post(
    "/predict-salary",
    response_model=
    SalaryPredictionResponse
)
def predict(
    request:
    SalaryPredictionRequest
):

    salary = predict_salary(
        request
    )

    return {
        "predictedSalary":
        round(
            salary,
            2
        )
    }