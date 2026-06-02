from pathlib import Path
from collections import Counter

import pandas as pd

DATA = Path(
    "analytics/data/cleaned/carreiratech_dataset.csv"
)

df = pd.read_csv(DATA)

print("=" * 60)
print("DATASET")
print("=" * 60)

print(f"Linhas: {len(df)}")
print(f"Colunas: {len(df.columns)}")

print("\nColunas:")

for column in df.columns:
    print(column)

print("\n")
print("=" * 60)
print("SALÁRIOS")
print("=" * 60)

print(
    df["ConvertedCompYearly"]
    .describe()
)

print("\n")
print("=" * 60)
print("EXPERIÊNCIA")
print("=" * 60)

print(
    df["WorkExp"]
    .describe()
)

print("\n")
print("=" * 60)
print("TOP PAÍSES")
print("=" * 60)

print(
    df["Country"]
    .value_counts()
    .head(20)
)

print("\n")
print("=" * 60)
print("SENIORIDADE")
print("=" * 60)

print(
    df["ExperienceLevel"]
    .value_counts()
)

print("\n")
print("=" * 60)
print("TRABALHO REMOTO")
print("=" * 60)

print(
    df["RemoteWork"]
    .value_counts()
)

print("\n")
print("=" * 60)
print("TOP CARGOS")
print("=" * 60)

print(
    df["DevType"]
    .value_counts()
    .head(20)
)

print("\n")
print("=" * 60)
print("TOP LINGUAGENS")
print("=" * 60)

languages = Counter()

for row in df[
    "LanguageHaveWorkedWith"
].dropna():

    for language in row.split(";"):

        languages[
            language.strip()
        ] += 1

for language, count in (
    languages.most_common(20)
):

    print(
        f"{language}: {count}"
    )

print("\n")
print("=" * 60)
print("TOP FRAMEWORKS")
print("=" * 60)

frameworks = Counter()

for row in df[
    "WebframeHaveWorkedWith"
].dropna():

    for framework in row.split(";"):

        frameworks[
            framework.strip()
        ] += 1

for framework, count in (
    frameworks.most_common(20)
):

    print(
        f"{framework}: {count}"
    )

print("\n")
print("=" * 60)
print("CORRELAÇÕES")
print("=" * 60)

numeric_cols = [

    "ConvertedCompYearly",

    "WorkExp",

    "YearsCode",

    "LanguageCount",

    "AIUsageFlag"
]

corr = (
    df[
        numeric_cols
    ]
    .corr(
        numeric_only=True
    )
)

print(corr)

print("\n")
print("=" * 60)
print("SALÁRIO X EXPERIÊNCIA")
print("=" * 60)

salary_exp_corr = (
    df["WorkExp"]
    .corr(
        df[
            "ConvertedCompYearly"
        ]
    )
)

print(
    f"Correlação: "
    f"{salary_exp_corr:.4f}"
)