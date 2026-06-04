from pathlib import Path

import pandas as pd

from sklearn.ensemble import RandomForestRegressor

DATA = Path(
    "analytics/data/processed/ml_dataset.csv"
)

df = pd.read_csv(DATA)

X = df.drop(
    columns=["ConvertedCompYearly"]
)

y = df["ConvertedCompYearly"]

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)

importance = pd.DataFrame(
    {
        "feature": X.columns,
        "importance": model.feature_importances_
    }
)

importance = importance.sort_values(
    "importance",
    ascending=False
)

print(
    importance.head(30)
)