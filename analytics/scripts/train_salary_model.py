from pathlib import Path

import pandas as pd

from sklearn.compose import ColumnTransformer

from sklearn.preprocessing import OneHotEncoder

from sklearn.pipeline import Pipeline

from sklearn.model_selection import (
    train_test_split,
    cross_val_score
)

from sklearn.linear_model import (
    LinearRegression,
    Ridge
)

from sklearn.metrics import (
    mean_absolute_error,
    r2_score
)

DATA = Path(
    "analytics/data/cleaned/carreiratech_dataset.csv"
)

df = pd.read_csv(DATA)

features = [
    "Country",
    "RemoteWork",
    "DevType",
    "WorkExp",
    "YearsCode",
    "EdLevel"
]

target = "ConvertedCompYearly"

df = df.dropna(subset=features)

X = df[features]
y = df[target]

categorical = [
    "Country",
    "RemoteWork",
    "DevType",
    "EdLevel"
]

numeric = [
    "WorkExp",
    "YearsCode"
]

preprocessor = ColumnTransformer(
    [
        (
            "cat",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical
        )
    ],
    remainder="passthrough"
)

model = Pipeline(
    [
        (
            "preprocessor",
            preprocessor
        ),
        (
            "regressor",
            Ridge(alpha=1.0)
        )
    ]
)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model.fit(
    X_train,
    y_train
)

predictions = model.predict(
    X_test
)

print(
    "\nR²:",
    r2_score(
        y_test,
        predictions
    )
)

print(
    "MAE:",
    mean_absolute_error(
        y_test,
        predictions
    )
)

scores = cross_val_score(
    model,
    X,
    y,
    cv=5,
    scoring="r2"
)

print(
    "\nCross Validation R²"
)

print(scores)
print(scores.mean())