from pathlib import Path

import json
import pickle

import pandas as pd

from xgboost import XGBRegressor

DATA = Path(
    "analytics/data/processed/ml_dataset.csv"
)

MODEL_DIR = Path(
    "analytics/models"
)

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True
)

MODEL_FILE = MODEL_DIR / "salary_predictor.pkl"

FEATURES_FILE = MODEL_DIR / "feature_columns.json"

df = pd.read_csv(DATA)

X = df.drop(
    columns=["ConvertedCompYearly"]
)

y = df["ConvertedCompYearly"]

model = XGBRegressor(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)

print("Treinando modelo...")

model.fit(
    X,
    y
)

with open(
    MODEL_FILE,
    "wb"
) as file:

    pickle.dump(
        model,
        file
    )

with open(
    FEATURES_FILE,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        list(X.columns),
        file,
        indent=4,
        ensure_ascii=False
    )

print(
    f"Modelo salvo em: {MODEL_FILE}"
)

print(
    f"Features salvas em: {FEATURES_FILE}"
)