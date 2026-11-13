import pandas as pd
import re
from pathlib import Path

# --------------------------------------------------
# CONFIGURATION
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT_FILE = BASE_DIR / "phishing_messages.csv"
OUTPUT_FILE = BASE_DIR / "phishing_messages_clean.csv"


# --------------------------------------------------
# 1. LOAD DATASET
# --------------------------------------------------

print("Loading dataset...")

df = pd.read_csv(INPUT_FILE)

print(f"Original dataset size: {len(df)}")
print(f"Columns: {df.columns.tolist()}")


# --------------------------------------------------
# 2. KEEP ONLY THE COLUMNS WE NEED
# --------------------------------------------------

df = df[["text", "label"]].copy()


# --------------------------------------------------
# 3. REMOVE MISSING VALUES
# --------------------------------------------------

df = df.dropna(subset=["text", "label"])


# --------------------------------------------------
# 4. CLEAN TEXT
# --------------------------------------------------

def clean_message(text):

    text = str(text)

    # Remove artificial dataset metadata.
    # Example:
    # Keywords: password pin login ...
    text = re.sub(
        r"\n?\s*Keywords:\s*.*?(?=\n\s*\n|\Z)",
        "",
        text,
        flags=re.IGNORECASE | re.DOTALL
    )

    # Normalize whitespace
    text = re.sub(r"\s+", " ", text)

    # Remove leading/trailing spaces
    text = text.strip()

    return text


df["text"] = df["text"].apply(clean_message)


# --------------------------------------------------
# 5. REMOVE EMPTY MESSAGES
# --------------------------------------------------

df = df[df["text"].str.len() > 0]


# --------------------------------------------------
# 6. REMOVE EXACT DUPLICATES
# --------------------------------------------------

before_duplicates = len(df)

df = df.drop_duplicates(subset=["text"])

duplicates_removed = before_duplicates - len(df)


# --------------------------------------------------
# 7. MAKE SURE LABELS ARE INTEGERS
# --------------------------------------------------

df["label"] = df["label"].astype(int)


# --------------------------------------------------
# 8. BASIC VALIDATION
# --------------------------------------------------

print("\nAfter cleaning:")
print(f"Total messages: {len(df)}")

print("\nClass distribution:")

label_counts = df["label"].value_counts()

for label, count in label_counts.items():

    if label == 0:
        name = "Legitimate"
    else:
        name = "Phishing"

    print(f"{name}: {count}")


print(f"\nDuplicates removed: {duplicates_removed}")


# --------------------------------------------------
# 9. SAVE CLEAN DATASET
# --------------------------------------------------

df.to_csv(OUTPUT_FILE, index=False)

print("\nClean dataset saved to:")
print(OUTPUT_FILE)

print("\nFirst 5 cleaned messages:")
print(df.head())