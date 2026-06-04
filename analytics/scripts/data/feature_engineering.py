from pathlib import Path

import pandas as pd

from sklearn.preprocessing import MultiLabelBinarizer

INPUT = Path(
    "analytics/data/cleaned/carreiratech_dataset.csv"
)

OUTPUT = Path(
    "analytics/data/processed/ml_dataset.csv"
)

OUTPUT.parent.mkdir(
    parents=True,
    exist_ok=True
)

df = pd.read_csv(INPUT)

# ---------------------------------
# Linguagens
# ---------------------------------

languages = (
    df["LanguageHaveWorkedWith"]
    .fillna("")
    .str.split(";")
)

language_encoder = MultiLabelBinarizer()

languages_encoded = pd.DataFrame(
    language_encoder.fit_transform(languages),
    columns=[
        f"LANG_{column}"
        for column in language_encoder.classes_
    ]
)

# ---------------------------------
# Frameworks
# ---------------------------------

frameworks = (
    df["WebframeHaveWorkedWith"]
    .fillna("")
    .str.split(";")
)

framework_encoder = MultiLabelBinarizer()

frameworks_encoded = pd.DataFrame(
    framework_encoder.fit_transform(frameworks),
    columns=[
        f"FRAMEWORK_{column}"
        for column in framework_encoder.classes_
    ]
)

# ---------------------------------
# Databases
# ---------------------------------

databases = (
    df["DatabaseHaveWorkedWith"]
    .fillna("")
    .str.split(";")
)

database_encoder = MultiLabelBinarizer()

databases_encoded = pd.DataFrame(
    database_encoder.fit_transform(databases),
    columns=[
        f"DATABASE_{column}"
        for column in database_encoder.classes_
    ]
)

# ---------------------------------
# RemoteWork
# ---------------------------------

df["IsRemote"] = (
    df["RemoteWork"]
    .fillna("")
    .str.contains(
        "Remote",
        case=False
    )
    .astype(int)
)

# ---------------------------------
# DevType
# ---------------------------------

devtype_encoded = pd.get_dummies(
    df["DevType"],
    prefix="DEVTYPE"
)

# ---------------------------------
# EdLevel
# ---------------------------------

edlevel_encoded = pd.get_dummies(
    df["EdLevel"],
    prefix="EDLEVEL"
)

# ---------------------------------
# Country
# ---------------------------------

country_encoded = pd.get_dummies(
    df["Country"],
    prefix="COUNTRY"
)


# ---------------------------------
# Counts
# ---------------------------------

df["LanguageCount"] = (
    df["LanguageHaveWorkedWith"]
    .fillna("")
    .apply(
        lambda value:
        len(
            [
                item
                for item in value.split(";")
                if item.strip()
            ]
        )
    )
)

df["DatabaseCount"] = (
    df["DatabaseHaveWorkedWith"]
    .fillna("")
    .apply(
        lambda value:
        len(
            [
                item
                for item in value.split(";")
                if item.strip()
            ]
        )
    )
)

df["FrameworkCount"] = (
    df["WebframeHaveWorkedWith"]
    .fillna("")
    .apply(
        lambda value:
        len(
            [
                item
                for item in value.split(";")
                if item.strip()
            ]
        )
    )
)


# ---------------------------------
# Dataset final
# ---------------------------------

ml_df = pd.concat(
    [
        df[
            [
                "WorkExp",
                "IsRemote",
                "LanguageCount",
                "DatabaseCount",
                "FrameworkCount",
                "ConvertedCompYearly"
            ]
        ],

        devtype_encoded,
        edlevel_encoded,
        country_encoded,

        languages_encoded,
        frameworks_encoded,
        databases_encoded,
    ],
    axis=1
)

ml_df = ml_df.fillna(0)

ml_df.to_csv(
    OUTPUT,
    index=False
)

print(
    f"Dataset salvo em: {OUTPUT}"
)

print(
    f"Shape: {ml_df.shape}"
)