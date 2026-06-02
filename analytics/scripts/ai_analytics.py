from pathlib import Path
import json
import pandas as pd

DATA = Path("analytics/data/cleaned/carreiratech_dataset.csv")
OUTPUT = Path("analytics/outputs/ai_report.json")

df = pd.read_csv(DATA)

ai_report = {

    "ai_usage":

        df["AISelect"]
        .value_counts()
        .to_dict(),

    "top_countries_using_ai":

        df.groupby("Country")
        ["AISelect"]
        .count()
        .sort_values(
            ascending=False
        )
        .head(20)
        .to_dict()
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
        ai_report,
        f,
        indent=4,
        ensure_ascii=False
    )

print("ai_report.json gerado")