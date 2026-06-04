from pathlib import Path

import json
import pickle

import pandas as pd

MODEL_FILE = Path(
    "analytics/models/salary_predictor.pkl"
)

FEATURES_FILE = Path(
    "analytics/models/feature_columns.json"
)

OUTPUT_FILE = Path(
    "analytics/outputs/feature_importance.json"
)

OUTPUT_FILE.parent.mkdir(
    parents=True,
    exist_ok=True
)

# -------------------------
# Load model
# -------------------------

with open(
    MODEL_FILE,
    "rb"
) as file:

    model = pickle.load(file)

# -------------------------
# Load feature names
# -------------------------

with open(
    FEATURES_FILE,
    "r",
    encoding="utf-8"
) as file:

    feature_names = json.load(file)

# -------------------------
# Importance
# -------------------------

importance_df = pd.DataFrame(
    {
        "feature": feature_names,
        "importance": model.feature_importances_
    }
)

importance_df = importance_df.sort_values(
    by="importance",
    ascending=False
)

# -------------------------
# Export Top 100
# -------------------------

top_features = (
    importance_df
    .head(100)
    .to_dict(
        orient="records"
    )
)

with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        top_features,
        file,
        indent=4,
        ensure_ascii=False
    )

print(
    f"Feature importance exportada para: {OUTPUT_FILE}"
)

print("\nTop 20 Features\n")

print(
    importance_df
    .head(20)
)