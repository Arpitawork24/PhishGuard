import os
import pandas as pd

BASE = os.path.dirname(os.path.abspath(__file__))

EMAIL_DIR = os.path.join(BASE, "datasets", "email")
SMS_DIR = os.path.join(BASE, "datasets", "sms")


def inspect_csv(path):
    print("\n" + "=" * 70)
    print(f"FILE: {os.path.basename(path)}")
    print("=" * 70)

    try:
        df = pd.read_csv(path, low_memory=False)

        print(f"Rows: {len(df):,}")
        print(f"Columns: {len(df.columns)}")
        print("Columns:")
        print(list(df.columns))

        print("\nMissing values:")
        print(df.isna().sum())

        print("\nDuplicate rows:")
        print(df.duplicated().sum())

        if "label" in df.columns:
            print("\nLabel distribution:")
            print(df["label"].value_counts(dropna=False))

        print("\nFirst 2 rows:")
        print(df.head(2).to_string())

    except Exception as e:
        print(f"ERROR: {e}")


def inspect_sms_collection(path):
    print("\n" + "=" * 70)
    print("FILE: SMSSpamCollection")
    print("=" * 70)

    try:
        df = pd.read_csv(
            path,
            sep="\t",
            header=None,
            names=["label", "text"],
            encoding="utf-8"
        )

        print(f"Rows: {len(df):,}")
        print("\nLabel distribution:")
        print(df["label"].value_counts())

        print("\nMissing values:")
        print(df.isna().sum())

        print("\nDuplicate messages:")
        print(df["text"].duplicated().sum())

        print("\nFirst 5 messages:")
        print(df.head().to_string(index=False))

    except Exception as e:
        print(f"ERROR: {e}")


def inspect_folder(folder):
    if not os.path.exists(folder):
        print(f"\nFolder not found: {folder}")
        return

    for filename in sorted(os.listdir(folder)):
        path = os.path.join(folder, filename)

        if os.path.isfile(path) and filename.lower().endswith(".csv"):
            inspect_csv(path)

        elif filename == "SMSSpamCollection":
            inspect_sms_collection(path)


print("\n" + "#" * 70)
print("RAKSHAK AI - DATASET INSPECTION")
print("#" * 70)

print("\nEMAIL DATASETS")
inspect_folder(EMAIL_DIR)

print("\n\nSMS DATASETS")
inspect_folder(SMS_DIR)

print("\n" + "#" * 70)
print("INSPECTION COMPLETE")
print("#" * 70)