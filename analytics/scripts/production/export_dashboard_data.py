from pathlib import Path
from collections import Counter

import json
import pandas as pd

DATA = Path(
    "analytics/data/cleaned/carreiratech_dataset.csv"
)

OUTPUT = Path(
    "analytics/outputs/dashboard"
)

OUTPUT.mkdir(
    parents=True,
    exist_ok=True
)

df = pd.read_csv(DATA)

# --------------------------------------------------
# Salary Distribution
# --------------------------------------------------

salary_distribution = (
    df["ConvertedCompYearly"]
    .dropna()
    .tolist()
)

# --------------------------------------------------
# Countries
# --------------------------------------------------

country_distribution = (
    df["Country"]
    .value_counts()
    .head(30)
    .to_dict()
)

# --------------------------------------------------
# Education
# --------------------------------------------------

education_distribution = (
    df["EdLevel"]
    .value_counts()
    .to_dict()
)

# --------------------------------------------------
# Remote Work
# --------------------------------------------------

remote_distribution = (
    df["RemoteWork"]
    .value_counts()
    .to_dict()
)

# --------------------------------------------------
# Salary By DevType
# --------------------------------------------------

salary_by_devtype = (
    df.groupby("DevType")
    ["ConvertedCompYearly"]
    .mean()
    .sort_values(
        ascending=False
    )
    .head(30)
    .to_dict()
)

# --------------------------------------------------
# Salary By Country
# --------------------------------------------------

salary_by_country = (
    df.groupby("Country")
    ["ConvertedCompYearly"]
    .mean()
    .sort_values(
        ascending=False
    )
    .head(30)
    .to_dict()
)

# --------------------------------------------------
# Languages
# --------------------------------------------------

languages = Counter()

for row in df[
    "LanguageHaveWorkedWith"
].dropna():

    for language in row.split(";"):

        languages[
            language.strip()
        ] += 1

# --------------------------------------------------
# Frameworks
# --------------------------------------------------

frameworks = Counter()

for row in df[
    "WebframeHaveWorkedWith"
].dropna():

    for framework in row.split(";"):

        frameworks[
            framework.strip()
        ] += 1

# --------------------------------------------------
# Databases
# --------------------------------------------------

databases = Counter()

for row in df[
    "DatabaseHaveWorkedWith"
].dropna():

    for database in row.split(";"):

        databases[
            database.strip()
        ] += 1

# --------------------------------------------------
# Export helper
# --------------------------------------------------

def save_json(
    filename,
    data
):

    with open(
        OUTPUT / filename,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            data,
            file,
            indent=4,
            ensure_ascii=False
        )

# --------------------------------------------------
# Save files
# --------------------------------------------------

save_json(
    "salary_distribution.json",
    salary_distribution
)

save_json(
    "country_distribution.json",
    country_distribution
)

save_json(
    "education_distribution.json",
    education_distribution
)

save_json(
    "remote_work_distribution.json",
    remote_distribution
)

save_json(
    "salary_by_devtype.json",
    salary_by_devtype
)

save_json(
    "salary_by_country.json",
    salary_by_country
)

save_json(
    "top_languages.json",
    dict(
        languages.most_common(30)
    )
)

save_json(
    "top_frameworks.json",
    dict(
        frameworks.most_common(30)
    )
)

save_json(
    "top_databases.json",
    dict(
        databases.most_common(30)
    )
)

print(
    "Dashboard JSONs exportados."
)