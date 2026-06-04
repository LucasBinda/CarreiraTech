from pathlib import Path

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

DATA = Path(
    "analytics/data/cleaned/carreiratech_dataset.csv"
)

OUTPUT = Path(
    "analytics/outputs/charts"
)

OUTPUT.mkdir(
    parents=True,
    exist_ok=True
)

df = pd.read_csv(DATA)

# --------------------------------------------------
# Histograma salarial
# --------------------------------------------------

plt.figure(
    figsize=(10, 6)
)

plt.hist(
    df["ConvertedCompYearly"],
    bins=50
)

plt.title(
    "Salary Distribution"
)

plt.xlabel(
    "Salary"
)

plt.ylabel(
    "Frequency"
)

plt.tight_layout()

plt.savefig(
    OUTPUT /
    "salary_distribution.png"
)

plt.close()

# --------------------------------------------------
# Boxplot salarial
# --------------------------------------------------

plt.figure(
    figsize=(10, 4)
)

plt.boxplot(
    df["ConvertedCompYearly"]
)

plt.title(
    "Salary Boxplot"
)

plt.tight_layout()

plt.savefig(
    OUTPUT /
    "salary_boxplot.png"
)

plt.close()

# --------------------------------------------------
# Heatmap
# --------------------------------------------------

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
    .corr()
)

plt.figure(
    figsize=(8, 6)
)

sns.heatmap(
    corr,
    annot=True,
    fmt=".2f"
)

plt.title(
    "Correlation Heatmap"
)

plt.tight_layout()

plt.savefig(
    OUTPUT /
    "correlation_heatmap.png"
)

plt.close()

# --------------------------------------------------
# Top linguagens
# --------------------------------------------------

skills = (
    df[
        "LanguageHaveWorkedWith"
    ]
    .dropna()
    .str.split(";")
    .explode()
)

top_skills = (
    skills
    .value_counts()
    .head(20)
)

plt.figure(
    figsize=(12, 6)
)

top_skills.plot(
    kind="bar"
)

plt.title(
    "Top Languages"
)

plt.tight_layout()

plt.savefig(
    OUTPUT /
    "top_languages.png"
)

plt.close()

# --------------------------------------------------
# Top países
# --------------------------------------------------

top_countries = (
    df[
        "Country"
    ]
    .value_counts()
    .head(20)
)

plt.figure(
    figsize=(12, 6)
)

top_countries.plot(
    kind="bar"
)

plt.title(
    "Top Countries"
)

plt.tight_layout()

plt.savefig(
    OUTPUT /
    "top_countries.png"
)

plt.close()

# --------------------------------------------------
# Senioridade
# --------------------------------------------------

seniority = (
    df[
        "ExperienceLevel"
    ]
    .value_counts()
)

plt.figure(
    figsize=(8, 5)
)

seniority.plot(
    kind="bar"
)

plt.title(
    "Experience Level"
)

plt.tight_layout()

plt.savefig(
    OUTPUT /
    "seniority_distribution.png"
)

plt.close()

# --------------------------------------------------
# Salário x experiência
# --------------------------------------------------

plt.figure(
    figsize=(10, 6)
)

sns.regplot(
    data=df,

    x="WorkExp",

    y="ConvertedCompYearly",

    scatter_kws={
        "alpha": 0.2
    }
)

plt.title(
    "Salary vs Experience"
)

plt.tight_layout()

plt.savefig(
    OUTPUT /
    "salary_vs_experience.png"
)

plt.close()

print(
    f"Gráficos salvos em:\n{OUTPUT}"
)