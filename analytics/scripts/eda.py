from pathlib import Path
from collections import Counter

import pandas as pd

DATA = Path(
    "analytics/data/cleaned/carreiratech_dataset.csv"
)

df = pd.read_csv(DATA)

print("\nSalário médio")
print(df["ConvertedCompYearly"].mean())

print("\nTop países")

print(
    df["Country"]
    .value_counts()
    .head(10)
)

languages = Counter()

for row in df["LanguageHaveWorkedWith"].dropna():

    for language in row.split(";"):
        languages[language.strip()] += 1

print("\nTop linguagens")

for language, count in languages.most_common(20):
    print(language, count)

frameworks = Counter()

for row in df["WebframeHaveWorkedWith"].dropna():

    for framework in row.split(";"):
        frameworks[framework.strip()] += 1

print("\nTop frameworks")

for framework, count in frameworks.most_common(20):
    print(framework, count)