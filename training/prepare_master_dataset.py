import os
import pandas as pd

BASE = os.path.dirname(os.path.abspath(__file__))

EMAIL_DIR = os.path.join(BASE, "datasets", "email")
SMS_DIR = os.path.join(BASE, "datasets", "sms")
OUTPUT_DIR = os.path.join(BASE, "datasets")

OUTPUT_FILE = os.path.join(
    OUTPUT_DIR,
    "rakshak_master_dataset.csv"
)


def clean_text(text):
    if pd.isna(text):
        return ""

    text = str(text)

    # Normalize whitespace
    text = " ".join(text.split())

    return text.strip()


def add_email_dataset(
    frames,
    filename,
    source,
    label_mapping,
    text_columns=("subject", "body")
):
    path = os.path.join(EMAIL_DIR, filename)

    if not os.path.exists(path):
        print(f"WARNING: {filename} not found")
        return

    print(f"\nProcessing {filename}...")

    df = pd.read_csv(path, low_memory=False)

    # Keep only required columns
    available = [
        col for col in text_columns
        if col in df.columns
    ]

    if not available:
        print(f"Skipping {filename}: no text columns found")
        return

    # Combine subject + body
    text = df[available].fillna("").astype(str).agg(
        " ".join,
        axis=1
    )

    result = pd.DataFrame({
        "text": text,
        "source": source,
        "type": "email"
    })

    # Apply label mapping
    if "label" in label_mapping:
        result["label"] = df["label"].map(label_mapping["label"])
    else:
        result["label"] = None

    result["text"] = result["text"].apply(clean_text)

    # Remove empty messages
    result = result[result["text"] != ""]

    # Remove rows where label could not be determined
    result = result.dropna(subset=["label"])

    result["label"] = result["label"].astype(int)

    frames.append(result)

    print(f"Added: {len(result):,} rows")


def add_nazario(frames):
    add_email_dataset(
        frames,
        "Nazario.csv",
        "Nazario",
        {"label": {1: 1}}
    )


def add_nigerian(frames):
    add_email_dataset(
        frames,
        "Nigerian_Fraud.csv",
        "Nigerian_Fraud",
        {"label": {1: 1}}
    )


def add_legitimate_only(
    frames,
    filename,
    source
):
    path = os.path.join(EMAIL_DIR, filename)

    if not os.path.exists(path):
        print(f"WARNING: {filename} not found")
        return

    print(f"\nProcessing legitimate emails from {filename}...")

    df = pd.read_csv(path, low_memory=False)

    if "body" not in df.columns:
        print(f"Skipping {filename}: body column missing")
        return

    subject = (
        df["subject"]
        if "subject" in df.columns
        else ""
    )

    body = df["body"]

    result = pd.DataFrame({
        "text": (
            subject.fillna("").astype(str)
            + " "
            + body.fillna("").astype(str)
        ),
        "label": 0,
        "source": source,
        "type": "email"
    })

    result["text"] = result["text"].apply(clean_text)
    result = result[result["text"] != ""]

    frames.append(result)

    print(f"Added: {len(result):,} legitimate rows")


def add_ceas_legitimate(frames):
    path = os.path.join(EMAIL_DIR, "CEAS_08.csv")

    print("\nProcessing CEAS_08 legitimate emails...")

    df = pd.read_csv(path, low_memory=False)

    df = df[df["label"] == 0]

    result = pd.DataFrame({
        "text": (
            df["subject"].fillna("").astype(str)
            + " "
            + df["body"].fillna("").astype(str)
        ),
        "label": 0,
        "source": "CEAS_08",
        "type": "email"
    })

    result["text"] = result["text"].apply(clean_text)
    result = result[result["text"] != ""]

    frames.append(result)

    print(f"Added: {len(result):,} legitimate rows")


def add_uci_ham(frames):
    path = os.path.join(
        SMS_DIR,
        "SMSSpamCollection"
    )

    if not os.path.exists(path):
        print("\nWARNING: SMSSpamCollection not found")
        return

    print("\nProcessing UCI SMS ham...")

    df = pd.read_csv(
        path,
        sep="\t",
        header=None,
        names=["label", "text"],
        encoding="utf-8"
    )

    # Keep ONLY ham
    df = df[df["label"] == "ham"]

    result = pd.DataFrame({
        "text": df["text"],
        "label": 0,
        "source": "UCI_SMS",
        "type": "sms"
    })

    result["text"] = result["text"].apply(clean_text)
    result = result[result["text"] != ""]

    frames.append(result)

    print(f"Added: {len(result):,} legitimate SMS")


# --------------------------------------------------
# MAIN
# --------------------------------------------------

print("=" * 70)
print("RAKSHAK AI - BUILDING MASTER DATASET")
print("=" * 70)

frames = []

# -------------------------------
# PHISHING EMAILS
# -------------------------------

add_nazario(frames)
add_nigerian(frames)

# -------------------------------
# LEGITIMATE EMAILS
# -------------------------------

add_legitimate_only(
    frames,
    "Enron.csv",
    "Enron"
)

add_legitimate_only(
    frames,
    "Ling.csv",
    "Ling"
)

add_legitimate_only(
    frames,
    "SpamAssasin.csv",
    "SpamAssassin"
)

add_ceas_legitimate(frames)

# -------------------------------
# LEGITIMATE SMS
# -------------------------------

add_uci_ham(frames)

# -------------------------------
# COMBINE
# -------------------------------

print("\nCombining datasets...")

master = pd.concat(
    frames,
    ignore_index=True
)

# Normalize text again
master["text"] = master["text"].apply(clean_text)

# Remove exact duplicate texts
before = len(master)

master = master.drop_duplicates(
    subset=["text"]
).reset_index(drop=True)

after = len(master)

print(f"\nRemoved duplicate texts: {before - after:,}")

# Shuffle
master = master.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)

# Save
master.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8"
)

# --------------------------------------------------
# SUMMARY
# --------------------------------------------------

print("\n" + "=" * 70)
print("MASTER DATASET CREATED")
print("=" * 70)

print(f"\nTotal messages: {len(master):,}")

print("\nLabel distribution:")
print(master["label"].value_counts())

print("\nLabel percentages:")
print(
    master["label"]
    .value_counts(normalize=True)
    .mul(100)
    .round(2)
)

print("\nSource distribution:")
print(
    master["source"]
    .value_counts()
)

print("\nType distribution:")
print(
    master["type"]
    .value_counts()
)

print("\nPhishing by source:")
print(
    master[master["label"] == 1]["source"]
    .value_counts()
)

print("\nLegitimate by source:")
print(
    master[master["label"] == 0]["source"]
    .value_counts()
)

print("\nSaved to:")
print(OUTPUT_FILE)

print("\nDONE!")