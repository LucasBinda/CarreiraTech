from pathlib import Path

import json
import pickle

import pandas as pd


BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)

MODEL_FILE = (
    BASE_DIR
    / "models"
    / "salary_predictor.pkl"
)

FEATURES_FILE = (
    BASE_DIR
    / "models"
    / "feature_columns.json"
)


with open(
    MODEL_FILE,
    "rb"
) as file:

    MODEL = pickle.load(file)


with open(
    FEATURES_FILE,
    "r",
    encoding="utf-8"
) as file:

    FEATURE_COLUMNS = json.load(file)


def predict_salary(
    payload
):

    row = {
        column: 0
        for column in FEATURE_COLUMNS
    }

    # -------------------------
    # Básicos
    # -------------------------

    row["WorkExp"] = (
        payload.workExp
    )

    row["IsRemote"] = int(
        payload.isRemote
    )

    # -------------------------
    # Country
    # -------------------------

    country_column = (
        f"COUNTRY_{payload.country}"
    )

    if country_column in row:
        row[country_column] = 1

    # -------------------------
    # DevType
    # -------------------------

    devtype_column = (
        f"DEVTYPE_{payload.devType}"
    )

    if devtype_column in row:
        row[devtype_column] = 1

    # -------------------------
    # EdLevel
    # -------------------------

    edlevel_column = (
        f"EDLEVEL_{payload.edLevel}"
    )

    if edlevel_column in row:
        row[edlevel_column] = 1

    # -------------------------
    # Languages
    # -------------------------

    for language in payload.languages:

        column = (
            f"LANG_{language}"
        )

        if column in row:
            row[column] = 1

    # -------------------------
    # Databases
    # -------------------------

    for database in payload.databases:

        column = (
            f"DATABASE_{database}"
        )

        if column in row:
            row[column] = 1

    # -------------------------
    # Frameworks
    # -------------------------

    for framework in payload.frameworks:

        column = (
            f"FRAMEWORK_{framework}"
        )

        if column in row:
            row[column] = 1

    # -------------------------
    # Counts
    # -------------------------

    row["LanguageCount"] = len(
        payload.languages
    )

    row["DatabaseCount"] = len(
        payload.databases
    )

    row["FrameworkCount"] = len(
        payload.frameworks
    )

    input_df = pd.DataFrame(
        [row]
    )

    prediction = (
        MODEL.predict(
            input_df
        )[0]
    )

    return float(
        prediction
    )