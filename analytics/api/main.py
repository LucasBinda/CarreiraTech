from fastapi import FastAPI
from pathlib import Path

import json
from .schemas import (
    SalaryPredictionRequest,
    SalaryPredictionResponse
)

from .predictor import (
    predict_salary
)

BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)

METADATA_FILE = (
    BASE_DIR
    / "outputs"
    / "metadata.json"
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


@app.get("/metadata")
def metadata():

    with open(
        METADATA_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)

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