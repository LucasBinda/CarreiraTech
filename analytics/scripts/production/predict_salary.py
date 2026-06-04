from pathlib import Path

import json
import pickle
import sys

import pandas as pd

MODEL_FILE = Path(
    "analytics/models/salary_predictor.pkl"
)

FEATURES_FILE = Path(
    "analytics/models/feature_columns.json"
)

with open(
    MODEL_FILE,
    "rb"
) as file:

    model = pickle.load(file)

with open(
    FEATURES_FILE,
    "r",
    encoding="utf-8"
) as file:

    feature_columns = json.load(file)


# payload ou stdin passado como argumento
# arquivo passado como argumento
if len(sys.argv) > 1:

    with open(
        sys.argv[1],
        "r",
        encoding="utf-8"
    ) as file:

        payload = json.load(file)

# stdin
else:

    raw_input = sys.stdin.read().strip()

    if not raw_input:

        print(
            json.dumps(
                {
                    "error": "no input provided"
                }
            )
        )

        sys.exit(1)

    payload = json.loads(
        raw_input
    )




row = {
    column: 0
    for column in feature_columns
}

# -------------------------
# Básicos
# -------------------------

row["WorkExp"] = payload.get(
    "workExp",
    0
)

row["IsRemote"] = int(
    payload.get(
        "isRemote",
        False
    )
)

# -------------------------
# Country
# -------------------------

country_column = (
    f"COUNTRY_{payload['country']}"
)

if country_column in row:
    row[country_column] = 1

# -------------------------
# DevType
# -------------------------

devtype_column = (
    f"DEVTYPE_{payload['devType']}"
)

if devtype_column in row:
    row[devtype_column] = 1

# -------------------------
# EdLevel
# -------------------------

edlevel_column = (
    f"EDLEVEL_{payload['edLevel']}"
)

if edlevel_column in row:
    row[edlevel_column] = 1

# -------------------------
# Languages
# -------------------------

for language in payload.get(
    "languages",
    []
):

    column = f"LANG_{language}"

    if column in row:
        row[column] = 1

# -------------------------
# Databases
# -------------------------

for database in payload.get(
    "databases",
    []
):

    column = f"DATABASE_{database}"

    if column in row:
        row[column] = 1

# -------------------------
# Frameworks
# -------------------------

for framework in payload.get(
    "frameworks",
    []
):

    column = f"FRAMEWORK_{framework}"

    if column in row:
        row[column] = 1

# -------------------------
# Counts
# -------------------------

row["LanguageCount"] = len(
    payload.get(
        "languages",
        []
    )
)

row["DatabaseCount"] = len(
    payload.get(
        "databases",
        []
    )
)

row["FrameworkCount"] = len(
    payload.get(
        "frameworks",
        []
    )
)

input_df = pd.DataFrame(
    [row]
)

prediction = model.predict(
    input_df
)[0]

print(
    json.dumps(
        {
            "predictedSalary": round(
                float(prediction),
                2
            )
        }
    )
)