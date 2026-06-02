from pathlib import Path

import pandas as pd

from scipy.stats import pearsonr
from scipy.stats import ttest_ind

DATA = Path(
    "analytics/data/cleaned/carreiratech_dataset.csv"
)

df = pd.read_csv(DATA)


print("\nWorkExp")

print(df["WorkExp"].describe())

print("\nSalary")

print(df["ConvertedCompYearly"].describe())

print("\nValores únicos WorkExp")

print(df["WorkExp"].nunique())


print("\nCorrelação salário x experiência")

analysis_df = df[
    [
        "WorkExp",
        "ConvertedCompYearly"
    ]
].dropna()

if analysis_df["WorkExp"].nunique() <= 1:
    print(
        "WorkExp não possui variabilidade suficiente."
    )
else:

    corr, p_value = pearsonr(
        analysis_df["WorkExp"],
        analysis_df["ConvertedCompYearly"]
    )

    print(corr)
    print(p_value)

print("Correlação:", corr)
print("P-value:", p_value)

remote = df[
    df["RemoteWork"]
    .str.contains(
        "Remote",
        case=False,
        na=False
    )
]["ConvertedCompYearly"]

onsite = df[
    df["RemoteWork"]
    .str.contains(
        "In-person",
        case=False,
        na=False
    )
]["ConvertedCompYearly"]

t_stat, p_value = ttest_ind(
    remote,
    onsite,
    equal_var=False
)

print("\nTeste T")

print("T:", t_stat)
print("P:", p_value)

if p_value < 0.05:
    print(
        "Diferença estatisticamente significativa"
    )
else:
    print(
        "Sem diferença significativa"
    )

print("\nMédia Remoto")
print(remote.mean())

print("\nMédia Presencial")
print(onsite.mean())

print("\nDiferença")
print(remote.mean() - onsite.mean())
