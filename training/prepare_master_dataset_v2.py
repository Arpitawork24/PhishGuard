import os
import pandas as pd
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

EMAIL_DIR = os.path.join(BASE_DIR, "training", "datasets", "email")
SMS_DIR = os.path.join(BASE_DIR, "training", "datasets", "sms")

OUTPUT = os.path.join(
    BASE_DIR,
    "training",
    "datasets",
    "rakshak_master_dataset_v2.csv"
)


def clean_text(text):
    if pd.isna(text):
        return ""

    text = str(text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def load_email(filename, source):
    path = os.path.join(EMAIL_DIR, filename)

    df = pd.read_csv(path, low_memory=False)

    print(f"\nLoading {source}: {len(df):,} rows")

    # Combine subject + body
    subject = (
        df["subject"].fillna("").astype(str)
        if "subject" in df.columns
        else ""
    )

    body = (
        df["body"].fillna("").astype(str)
        if "body" in df.columns
        else ""
    )

    text = (subject + " " + body).apply(clean_text)

    labels = pd.to_numeric(df["label"], errors="coerce")

    result = pd.DataFrame({
        "text": text,
        "label": labels,
        "source": source,
        "type": "email"
    })

    result = result.dropna(subset=["label"])
    result["label"] = result["label"].astype(int)

    # Keep only 0 and 1
    result = result[result["label"].isin([0, 1])]

    return result


# ---------------------------------------------------------
# 1. LOAD ALL EMAIL DATASETS
# ---------------------------------------------------------

datasets = []

datasets.append(
    load_email("CEAS_08.csv", "CEAS_08")
)

datasets.append(
    load_email("Enron.csv", "Enron")
)

datasets.append(
    load_email("Ling.csv", "Ling")
)

datasets.append(
    load_email("Nazario.csv", "Nazario")
)

datasets.append(
    load_email("Nigerian_Fraud.csv", "Nigerian_Fraud")
)

datasets.append(
    load_email("SpamAssasin.csv", "SpamAssassin")
)


# ---------------------------------------------------------
# 2. ADD UCI SMS HAM AS LEGITIMATE
# ---------------------------------------------------------

sms_path = os.path.join(SMS_DIR, "SMSSpamCollection")

if os.path.exists(sms_path):

    print("\nLoading UCI SMS dataset...")

    sms = pd.read_csv(
        sms_path,
        sep="\t",
        header=None,
        names=["category", "message"],
        encoding="utf-8",
        on_bad_lines="skip"
    )

    # ONLY HAM
    sms_ham = sms[sms["category"].str.lower() == "ham"].copy()

    sms_result = pd.DataFrame({
        "text": sms_ham["message"].apply(clean_text),
        "label": 0,
        "source": "UCI_SMS",
        "type": "sms"
    })

    datasets.append(sms_result)

    print(f"UCI SMS ham: {len(sms_result):,}")

else:
    print("UCI SMS dataset not found.")


# ---------------------------------------------------------
# 3. OPTIONAL NCSU PHISHING SMS
# ---------------------------------------------------------

ncsu_path = os.path.join(
    SMS_DIR,
    "phishing_messages.csv"
)

if os.path.exists(ncsu_path):

    print("\nNCSU phishing SMS dataset found.")

    ncsu = pd.read_csv(
        ncsu_path,
        low_memory=False
    )

    # Try to automatically find the message column
    possible_columns = [
        "message",
        "text",
        "body",
        "sms"
    ]

    message_column = None

    for col in possible_columns:
        if col in ncsu.columns:
            message_column = col
            break

    if message_column:

        ncsu_result = pd.DataFrame({
            "text": ncsu[message_column].apply(clean_text),
            "label": 1,
            "source": "NCSU_SMS",
            "type": "sms"
        })

        datasets.append(ncsu_result)

        print(f"NCSU phishing SMS: {len(ncsu_result):,}")

    else:
        print("Could not find message column in NCSU dataset.")

else:
    print("\nNCSU phishing SMS not found - skipping for now.")


# ---------------------------------------------------------
# 4. COMBINE EVERYTHING
# ---------------------------------------------------------

master = pd.concat(
    datasets,
    ignore_index=True
)

print("\n--------------------------------------")
print("BEFORE CLEANING")
print("--------------------------------------")

print(f"Total rows: {len(master):,}")
print("\nLabels:")
print(master["label"].value_counts())

print("\nSources:")
print(master["source"].value_counts())


# ---------------------------------------------------------
# 5. REMOVE EMPTY TEXT
# ---------------------------------------------------------

master = master[
    master["text"].str.len() > 0
].copy()


# ---------------------------------------------------------
# 6. REMOVE DUPLICATES ACROSS ALL DATASETS
# ---------------------------------------------------------

master["dedup_key"] = (
    master["text"]
    .str.lower()
    .str.replace(r"\s+", " ", regex=True)
    .str.strip()
)

before = len(master)

master = master.drop_duplicates(
    subset=["dedup_key"]
).copy()

removed = before - len(master)

print(f"\nDuplicate rows removed: {removed:,}")


# ---------------------------------------------------------
# 7. REMOVE TEMPORARY COLUMN
# ---------------------------------------------------------

master.drop(
    columns=["dedup_key"],
    inplace=True
)


# ---------------------------------------------------------
# 8. SHUFFLE DATA
# ---------------------------------------------------------

master = master.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)


# ---------------------------------------------------------
# 9. SAVE
# ---------------------------------------------------------

master.to_csv(
    OUTPUT,
    index=False
)


# ---------------------------------------------------------
# 10. FINAL REPORT
# ---------------------------------------------------------

print("\n======================================")
print("RAKSHAK MASTER DATASET V2")
print("======================================")

print(f"Total rows: {len(master):,}")

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
print(master["source"].value_counts())

print("\nType distribution:")
print(master["type"].value_counts())

print("\nSaved to:")
print(OUTPUT)