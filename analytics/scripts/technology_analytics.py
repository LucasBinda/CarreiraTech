from pathlib import Path
from collections import Counter
import json
import pandas as pd

DATA = Path("analytics/data/cleaned/carreiratech_dataset.csv")
OUTPUT = Path("analytics/outputs/technology_report.json")

df = pd.read_csv(DATA)


def count_items(column_name):

    counter = Counter()

    for value in df[column_name].dropna():

        for item in str(value).split(";"):

            item = item.strip()

            if item:
                counter[item] += 1

    return dict(
        counter.most_common(30)
    )


technology_report = {

    "languages":
        count_items(
            "LanguageHaveWorkedWith"
        ),

    "databases":
        count_items(
            "DatabaseHaveWorkedWith"
        ),

    "platforms":
        count_items(
            "PlatformHaveWorkedWith"
        ),

    "frameworks":
        count_items(
            "WebframeHaveWorkedWith"
        )
}

OUTPUT.parent.mkdir(
    parents=True,
    exist_ok=True
)

with open(
    OUTPUT,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        technology_report,
        f,
        indent=4,
        ensure_ascii=False
    )

print("technology_report.json gerado")