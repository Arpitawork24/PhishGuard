import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
FILE = BASE_DIR / "phishing_messages_clean.csv"

df = pd.read_csv(FILE)

print("=" * 60)
print("DATASET INFORMATION")
print("=" * 60)

print("\nDataset shape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nMissing values:")
print(df.isnull().sum())

print("\nLabel distribution:")
print(df["label"].value_counts())

print("\nLabel percentages:")
print(df["label"].value_counts(normalize=True) * 100)

print("\nDuplicate messages:")
print(df["text"].duplicated().sum())

print("\nMessage length statistics:")
print(df["text"].str.len().describe())

print("\n" + "=" * 60)
print("LEGITIMATE EXAMPLES")
print("=" * 60)

legitimate = df[df["label"] == 0]

for message in legitimate["text"].sample(
    min(5, len(legitimate)),
    random_state=42
):
    print("\n---")
    print(message)

print("\n" + "=" * 60)
print("PHISHING EXAMPLES")
print("=" * 60)

phishing = df[df["label"] == 1]

for message in phishing["text"].sample(
    min(5, len(phishing)),
    random_state=42
):
    print("\n---")
    print(message)