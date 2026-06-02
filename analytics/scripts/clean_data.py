from pathlib import Path
import pandas as pd
import json

RAW = Path(
    "analytics/data/raw/survey_results_public.csv"
)

OUTPUT = Path(
    "analytics/data/cleaned/carreiratech_dataset.csv"
)

REPORT_OUTPUT = Path(
    "analytics/outputs/dataset_quality.json"
)


def parse_years(value):

    if pd.isna(value):
        return 0

    if value == "Less than 1 year":
        return 0.5

    if value == "More than 50 years":
        return 50

    try:
        return float(value)

    except:
        return 0


def experience_level(years):

    if years <= 2:
        return "Junior"

    if years <= 5:
        return "Mid-Level"

    if years <= 10:
        return "Senior"

    return "Staff+"


def salary_band(salary):

    if salary < 40000:
        return "Low"

    if salary < 80000:
        return "Medium"

    if salary < 120000:
        return "High"

    return "Very High"


def count_stack(value):

    if pd.isna(value):
        return 0

    return len([
        tech.strip()
        for tech in str(value).split(";")
        if tech.strip()
    ])


def detect_inconsistencies(df):

    return {
        "workexp_greater_than_yearscode":
            int(
                (
                    df["WorkExp"]
                    >
                    df["YearsCode"]
                ).sum()
            ),

        "workexp_above_60_years":
            int(
                (
                    df["WorkExp"]
                    > 60
                ).sum()
            ),

        "salary_above_500k":
            int(
                (
                    df["ConvertedCompYearly"]
                    > 500000
                ).sum()
            )
    }



def dataset_quality_report(
    df,
    removed_duplicates,
    removed_outliers,
    removed_invalid_exp,
    inconsistencies
):

    languages = set()

    for row in (
        df["LanguageHaveWorkedWith"]
        .dropna()
    ):

        languages.update(
            tech.strip()
            for tech in row.split(";")
            if tech.strip()
        )

    salary_stats = (
        df["ConvertedCompYearly"]
        .describe()
    )

    return {

        "rows":
            int(len(df)),

        "duplicates_remaining":
            int(
                df.duplicated().sum()
            ),

        "duplicates_removed":
            int(
                removed_duplicates
            ),

        "countries":
            int(
                df["Country"]
                .nunique()
            ),

        "dev_types":
            int(
                df["DevType"]
                .nunique()
            ),

        "languages":
            int(
                len(languages)
            ),

        "salary_mean":
            float(
                salary_stats["mean"]
            ),

        "salary_median":
            float(
                salary_stats["50%"]
            ),

        "salary_min":
            float(
                salary_stats["min"]
            ),

        "salary_max":
            float(
                salary_stats["max"]
            ),

        "salary_std":
            float(
                salary_stats["std"]
            ),

        "outliers_removed":
            int(
                removed_outliers
            ),

        "invalid_experience_removed":
            int(
                removed_invalid_exp
            ),

        "invalid_records":
            inconsistencies
    }


columns = [
    "Age",
    "EdLevel",
    "Employment",
    "WorkExp",
    "YearsCode",
    "DevType",
    "RemoteWork",
    "Country",
    "ConvertedCompYearly",
    "LanguageHaveWorkedWith",
    "DatabaseHaveWorkedWith",
    "PlatformHaveWorkedWith",
    "WebframeHaveWorkedWith",
    "AISelect"
]

print("Carregando dataset...")

df = pd.read_csv(
    RAW,
    usecols=columns
)

print(
    f"Registros originais: {len(df)}"
)

df["YearsCode"] = (
    df["YearsCode"]
    .apply(parse_years)
)

df["WorkExp"] = pd.to_numeric(
    df["WorkExp"],
    errors="coerce"
)

df["ConvertedCompYearly"] = pd.to_numeric(
    df["ConvertedCompYearly"],
    errors="coerce"
)

df = df.dropna(
    subset=[
        "Country",
        "DevType",
        "ConvertedCompYearly",
        "WorkExp",
        "YearsCode"
    ]
)

before_duplicates = len(df)

df = df.drop_duplicates()

removed_duplicates = (
    before_duplicates - len(df)
)

print(
    f"Duplicatas removidas: {removed_duplicates}"
)

print(
    f"Após remoção de nulos: {len(df)}"
)

df["ExperienceLevel"] = (
    df["WorkExp"]
    .apply(experience_level)
)

df["SalaryBand"] = (
    df["ConvertedCompYearly"]
    .apply(salary_band)
)

df["LanguageCount"] = (
    df["LanguageHaveWorkedWith"]
    .apply(count_stack)
)

df["AIUsageFlag"] = (
    df["AISelect"]
    .notna()
    .astype(int)
)

invalid_experience = (
    df["WorkExp"]
    >
    df["YearsCode"]
)

removed_invalid_exp = int(
    invalid_experience.sum()
)

df = df[
    ~invalid_experience
]

print(
    f"Experiências inválidas removidas: "
    f"{removed_invalid_exp}"
)

q1 = (
    df["ConvertedCompYearly"]
    .quantile(0.25)
)

q3 = (
    df["ConvertedCompYearly"]
    .quantile(0.75)
)

iqr = q3 - q1

lower = q1 - (1.5 * iqr)
upper = q3 + (1.5 * iqr)

before_outliers = len(df)

df = df[
    (
        df["ConvertedCompYearly"]
        >= lower
    )
    &
    (
        df["ConvertedCompYearly"]
        <= upper
    )
]

removed_outliers = (
    before_outliers - len(df)
)

print(
    f"Outliers removidos: "
    f"{removed_outliers}"
)

inconsistencies = (
    detect_inconsistencies(df)
)

print(
    f"Registros finais: {len(df)}"
)

OUTPUT.parent.mkdir(
    parents=True,
    exist_ok=True
)

REPORT_OUTPUT.parent.mkdir(
    parents=True,
    exist_ok=True
)

df.to_csv(
    OUTPUT,
    index=False
)

report = dataset_quality_report(
    df,
    removed_duplicates,
    removed_outliers,
    removed_invalid_exp,
    inconsistencies
)

with open(
    REPORT_OUTPUT,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        report,
        f,
        indent=4,
        ensure_ascii=False
    )

print(
    f"Dataset salvo em: {OUTPUT}"
)

print(
    f"Relatório salvo em: {REPORT_OUTPUT}"
)

print("\nResumo:")

print(
    json.dumps(
        report,
        indent=4,
        ensure_ascii=False
    )
)