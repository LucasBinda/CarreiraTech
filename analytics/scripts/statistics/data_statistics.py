from pathlib import Path

import numpy as np
import pandas as pd

from scipy import stats
from scipy.stats import (
    pearsonr,
    spearmanr,
    ttest_ind,
    f_oneway
)

DATA = Path(
    "analytics/data/cleaned/carreiratech_dataset.csv"
)

df = pd.read_csv(DATA)

print("=" * 60)
print("ESTATÍSTICAS DESCRITIVAS")
print("=" * 60)

print("\nWorkExp")

print(
    df["WorkExp"]
    .describe()
)

print("\nSalary")

print(
    df["ConvertedCompYearly"]
    .describe()
)

print("\nValores únicos WorkExp")

print(
    df["WorkExp"]
    .nunique()
)

analysis_df = df[
    [
        "WorkExp",
        "ConvertedCompYearly"
    ]
].dropna()

print("\n")
print("=" * 60)
print("CORRELAÇÃO DE PEARSON")
print("=" * 60)

if analysis_df["WorkExp"].nunique() <= 1:

    print(
        "WorkExp não possui variabilidade suficiente."
    )

else:

    pearson_corr, pearson_p = pearsonr(
        analysis_df["WorkExp"],
        analysis_df["ConvertedCompYearly"]
    )

    print(
        f"Correlação: {pearson_corr:.4f}"
    )

    print(
        f"P-value: {pearson_p:.10f}"
    )

    if pearson_p < 0.05:

        print(
            "Correlação estatisticamente significativa"
        )

    else:

        print(
            "Correlação não significativa"
        )

print("\n")
print("=" * 60)
print("CORRELAÇÃO DE SPEARMAN")
print("=" * 60)

spearman_corr, spearman_p = spearmanr(
    analysis_df["WorkExp"],
    analysis_df["ConvertedCompYearly"]
)

print(
    f"Correlação: {spearman_corr:.4f}"
)

print(
    f"P-value: {spearman_p:.10f}"
)

if spearman_p < 0.05:

    print(
        "Correlação monotônica significativa"
    )

else:

    print(
        "Correlação monotônica não significativa"
    )

print("\n")
print("=" * 60)
print("TESTE T")
print("=" * 60)

remote = df[
    df["RemoteWork"]
    .str.contains(
        "Remote",
        case=False,
        na=False
    )
][
    "ConvertedCompYearly"
]

onsite = df[
    df["RemoteWork"]
    .str.contains(
        "In-person",
        case=False,
        na=False
    )
][
    "ConvertedCompYearly"
]

print("\nHipóteses")

print(
    "H0: salário remoto = salário presencial"
)

print(
    "H1: salário remoto != salário presencial"
)

t_stat, t_p = ttest_ind(
    remote,
    onsite,
    equal_var=False
)

print(
    f"\nT-statistic: {t_stat:.4f}"
)

print(
    f"P-value: {t_p:.10f}"
)

alpha = 0.05

if t_p < alpha:

    print(
        "Rejeitamos H0"
    )

    print(
        "Diferença estatisticamente significativa"
    )

else:

    print(
        "Falhamos em rejeitar H0"
    )

print("\nMédia Remoto")

print(
    remote.mean()
)

print("\nMédia Presencial")

print(
    onsite.mean()
)

print("\nDiferença")

print(
    remote.mean()
    -
    onsite.mean()
)

print("\n")
print("=" * 60)
print("INTERVALO DE CONFIANÇA 95%")
print("=" * 60)

salary = (
    df["ConvertedCompYearly"]
    .dropna()
)

confidence = 0.95

mean_salary = salary.mean()

std_salary = salary.std()

n = len(salary)

margin = stats.t.ppf(
    (1 + confidence) / 2,
    n - 1
) * (
    std_salary / np.sqrt(n)
)

lower = mean_salary - margin

upper = mean_salary + margin

print(
    f"Média Salarial: {mean_salary:.2f}"
)

print(
    f"IC95%: [{lower:.2f}, {upper:.2f}]"
)

print("\n")
print("=" * 60)
print("ANOVA")
print("=" * 60)

groups = []

valid_levels = []

for level in (
    df["EdLevel"]
    .dropna()
    .unique()
):

    salaries = df[
        df["EdLevel"] == level
    ][
        "ConvertedCompYearly"
    ]

    if len(salaries) >= 30:

        groups.append(
            salaries
        )

        valid_levels.append(
            level
        )

print(
    f"Grupos analisados: {len(groups)}"
)

anova_f, anova_p = f_oneway(
    *groups
)

print(
    f"F-statistic: {anova_f:.4f}"
)

print(
    f"P-value: {anova_p:.10f}"
)

if anova_p < 0.05:

    print(
        "Existe diferença salarial entre níveis educacionais"
    )

else:

    print(
        "Não foi encontrada diferença salarial significativa"
    )

print("\n")
print("=" * 60)
print("ANÁLISE DE VARIÂNCIA SALARIAL")
print("=" * 60)

salary_variance = salary.var()

salary_std = salary.std()

coefficient_variation = (
    salary_std
    /
    mean_salary
)

print(
    f"Variância: {salary_variance:.2f}"
)

print(
    f"Desvio padrão: {salary_std:.2f}"
)

print(
    f"Coeficiente de variação: "
    f"{coefficient_variation:.4f}"
)

print("\n")
print("=" * 60)
print("RESUMO")
print("=" * 60)

print(
    f"Pearson: {pearson_corr:.4f}"
)

print(
    f"Spearman: {spearman_corr:.4f}"
)

print(
    f"T-Test p-value: {t_p:.10f}"
)

print(
    f"ANOVA p-value: {anova_p:.10f}"
)

print(
    f"Média salarial: {mean_salary:.2f}"
)