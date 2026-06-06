from pathlib import Path

import json
import pandas as pd

INPUT = Path(
    "analytics/data/cleaned/carreiratech_dataset.csv"
)

OUTPUT = Path(
    "analytics/outputs/metadata.json"
)

OUTPUT.parent.mkdir(
    parents=True,
    exist_ok=True
)

df = pd.read_csv(INPUT)

# -------------------------
# Campos simples
# -------------------------

countries = sorted(
    df["Country"]
    .dropna()
    .unique()
    .tolist()
)

dev_types = sorted(
    df["DevType"]
    .dropna()
    .unique()
    .tolist()
)

ed_levels = sorted(
    df["EdLevel"]
    .dropna()
    .unique()
    .tolist()
)

# -------------------------
# Campos multi-valor
# -------------------------

def extract_values(
    column_name: str
):

    values = set()

    for row in (
        df[column_name]
        .dropna()
    ):

        for item in row.split(";"):

            item = item.strip()

            if item:
                values.add(item)

    return sorted(values)

languages = extract_values(
    "LanguageHaveWorkedWith"
)

frameworks = extract_values(
    "WebframeHaveWorkedWith"
)

databases = extract_values(
    "DatabaseHaveWorkedWith"
)

# -------------------------
# Metadata final
# -------------------------

metadata = {
    "countries": countries,
    "devTypes": dev_types,
    "edLevels": ed_levels,
    "languages": languages,
    "frameworks": frameworks,
    "databases": databases
}

with open(
    OUTPUT,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        metadata,
        file,
        ensure_ascii=False,
        indent=4
    )

print(
    f"Metadata salvo em: {OUTPUT}"
)

print(
    f"Countries: {len(countries)}"
)

print(
    f"DevTypes: {len(dev_types)}"
)

print(
    f"EdLevels: {len(ed_levels)}"
)

print(
    f"Languages: {len(languages)}"
)

print(
    f"Frameworks: {len(frameworks)}"
)

print(
    f"Databases: {len(databases)}"
)