from pathlib import Path
import json
import pandas as pd

DATA = Path("analytics/data/cleaned/carreiratech_dataset.csv")
OUTPUT = Path("analytics/outputs/salary_report.json")

df = pd.read_csv(DATA)

salary_report = {
    "global_average_salary":
        round(
            df["ConvertedCompYearly"].mean(),
            2
        ),

    "top_countries":
        (
            df.groupby("Country")
            ["ConvertedCompYearly"]
            .mean()
            .sort_values(
                ascending=False
            )
            .head(20)
            .round(2)
            .to_dict()
        ),

    "top_dev_types":
        (
            df.groupby("DevType")
            ["ConvertedCompYearly"]
            .mean()
            .sort_values(
                ascending=False
            )
            .head(20)
            .round(2)
            .to_dict()
        ),

    "top_education":
        (
            df.groupby("EdLevel")
            ["ConvertedCompYearly"]
            .mean()
            .sort_values(
                ascending=False
            )
            .round(2)
            .to_dict()
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
        salary_report,
        f,
        indent=4,
        ensure_ascii=False
    )

print("salary_report.json gerado")