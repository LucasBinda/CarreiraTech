from pathlib import Path

import numpy as np
import pandas as pd

from sklearn.linear_model import LinearRegression

from sklearn.model_selection import (
    train_test_split,
    cross_val_score
)

from sklearn.metrics import (
    r2_score,
    mean_absolute_error,
    root_mean_squared_error
)

DATA = Path(
    "analytics/data/processed/ml_dataset.csv"
)

df = pd.read_csv(DATA)

X = df.drop(
    columns=[
        "ConvertedCompYearly"
    ]
)

y = df[
    "ConvertedCompYearly"
]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model = LinearRegression()

model.fit(
    X_train,
    y_train
)

predictions = model.predict(
    X_test
)

r2 = r2_score(
    y_test,
    predictions
)

mae = mean_absolute_error(
    y_test,
    predictions
)

rmse = root_mean_squared_error(
    y_test,
    predictions
)

print("\nLinear Regression")
print("R²:", r2)
print("MAE:", mae)
print("RMSE:", rmse)

scores = cross_val_score(
    model,
    X,
    y,
    cv=5,
    scoring="r2"
)

print("\nCross Validation")

print(scores)

print(
    "Mean:",
    scores.mean()
)