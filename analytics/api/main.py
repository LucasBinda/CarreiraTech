from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
def predict_salary_endpoint(
    payload:
    SalaryPredictionRequest
):

    return predict_salary(
        payload
    )