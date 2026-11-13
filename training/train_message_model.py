import pandas as pd
import joblib

from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
    roc_auc_score
)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATASET_FILE = (
    BASE_DIR
    / "training"
    / "datasets"
    / "rakshak_master_dataset_v2.csv"
)

MODEL_DIR = BASE_DIR / "model"

MODEL_FILE = MODEL_DIR / "message_model.pkl"
VECTORIZER_FILE = MODEL_DIR / "message_vectorizer.pkl"

MODEL_DIR.mkdir(exist_ok=True)


# ============================================================
# 1. LOAD DATASET
# ============================================================

print("=" * 70)
print("RAKSHAK AI - MESSAGE MODEL TRAINING")
print("=" * 70)

print("\nLoading dataset...")
print(f"Dataset: {DATASET_FILE}")

df = pd.read_csv(DATASET_FILE)

print(f"\nTotal messages: {len(df):,}")


# ============================================================
# 2. BASIC DATA CHECK
# ============================================================

print("\n" + "=" * 70)
print("DATASET SUMMARY")
print("=" * 70)

print("\nLabels:")
print(df["label"].value_counts())

print("\nSources:")
print(df["source"].value_counts())

print("\nMessage types:")
print(df["type"].value_counts())


# Remove empty messages just in case
df = df[
    df["text"].notna()
    & (df["text"].astype(str).str.strip() != "")
].copy()

X = df["text"].astype(str)
y = df["label"].astype(int)

sources = df["source"].astype(str)


# ============================================================
# 3. TRAIN / TEST SPLIT
# ============================================================

print("\n" + "=" * 70)
print("TRAIN / TEST SPLIT")
print("=" * 70)

X_train, X_test, y_train, y_test, source_train, source_test = (
    train_test_split(
        X,
        y,
        sources,
        test_size=0.20,
        random_state=42,
        stratify=y
    )
)

print(f"\nTraining messages: {len(X_train):,}")
print(f"Testing messages:  {len(X_test):,}")

print("\nTraining label distribution:")
print(y_train.value_counts())

print("\nTesting label distribution:")
print(y_test.value_counts())


# ============================================================
# 4. TF-IDF
# ============================================================

print("\n" + "=" * 70)
print("CREATING TF-IDF FEATURES")
print("=" * 70)

vectorizer = TfidfVectorizer(
    lowercase=True,
    strip_accents="unicode",
    ngram_range=(1, 2),
    min_df=2,
    max_df=0.95,
    sublinear_tf=True
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

print(f"\nTF-IDF training shape: {X_train_tfidf.shape}")
print(f"TF-IDF testing shape:  {X_test_tfidf.shape}")
print(f"Vocabulary size:       {len(vectorizer.vocabulary_):,}")


# ============================================================
# 5. TRAIN LOGISTIC REGRESSION
# ============================================================

print("\n" + "=" * 70)
print("TRAINING LOGISTIC REGRESSION")
print("=" * 70)

model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced",
    random_state=42
)

model.fit(X_train_tfidf, y_train)

print("\nTraining completed.")


# ============================================================
# 6. PREDICTIONS
# ============================================================

print("\nGenerating predictions...")

y_pred = model.predict(X_test_tfidf)

# Probability of class 1 = phishing/suspicious
y_probability = model.predict_proba(X_test_tfidf)[:, 1]


# ============================================================
# 7. OVERALL EVALUATION
# ============================================================

accuracy = accuracy_score(y_test, y_pred)

precision = precision_score(
    y_test,
    y_pred,
    pos_label=1
)

recall = recall_score(
    y_test,
    y_pred,
    pos_label=1
)

f1 = f1_score(
    y_test,
    y_pred,
    pos_label=1
)

roc_auc = roc_auc_score(
    y_test,
    y_probability
)


print("\n" + "=" * 70)
print("OVERALL MODEL PERFORMANCE")
print("=" * 70)

print(f"\nAccuracy :  {accuracy:.4f}")
print(f"Precision:  {precision:.4f}")
print(f"Recall   :  {recall:.4f}")
print(f"F1 Score :  {f1:.4f}")
print(f"ROC-AUC  :  {roc_auc:.4f}")


# ============================================================
# 8. CLASSIFICATION REPORT
# ============================================================

print("\n" + "=" * 70)
print("CLASSIFICATION REPORT")
print("=" * 70)

print(
    classification_report(
        y_test,
        y_pred,
        target_names=[
            "Legitimate",
            "Phishing/Suspicious"
        ]
    )
)


# ============================================================
# 9. CONFUSION MATRIX
# ============================================================

print("=" * 70)
print("CONFUSION MATRIX")
print("=" * 70)

cm = confusion_matrix(y_test, y_pred)

print("\n                 Predicted")
print("               Legit  Phish")
print(
    f"Actual Legit   {cm[0][0]:5d} {cm[0][1]:6d}"
)
print(
    f"Actual Phish   {cm[1][0]:5d} {cm[1][1]:6d}"
)


# ============================================================
# 10. PERFORMANCE BY SOURCE
# ============================================================

print("\n" + "=" * 70)
print("PERFORMANCE BY DATA SOURCE")
print("=" * 70)

test_results = pd.DataFrame({
    "text": X_test.values,
    "actual": y_test.values,
    "predicted": y_pred,
    "probability": y_probability,
    "source": source_test.values
})

for source in sorted(test_results["source"].unique()):

    source_data = test_results[
        test_results["source"] == source
    ]

    if source_data["actual"].nunique() < 2:
        print(f"\n{source}:")
        print(f"  Samples: {len(source_data):,}")
        print("  Skipped metrics - only one class present.")
        continue

    source_accuracy = accuracy_score(
        source_data["actual"],
        source_data["predicted"]
    )

    source_precision = precision_score(
        source_data["actual"],
        source_data["predicted"],
        zero_division=0
    )

    source_recall = recall_score(
        source_data["actual"],
        source_data["predicted"],
        zero_division=0
    )

    source_f1 = f1_score(
        source_data["actual"],
        source_data["predicted"],
        zero_division=0
    )

    print(f"\n{source}:")
    print(f"  Samples:  {len(source_data):,}")
    print(f"  Accuracy: {source_accuracy:.4f}")
    print(f"  Precision:{source_precision:.4f}")
    print(f"  Recall:   {source_recall:.4f}")
    print(f"  F1:       {source_f1:.4f}")


# ============================================================
# 11. TOP PHISHING INDICATORS
# ============================================================

print("\n" + "=" * 70)
print("TOP PHISHING INDICATORS LEARNED BY MODEL")
print("=" * 70)

feature_names = vectorizer.get_feature_names_out()

coefficients = model.coef_[0]

top_indices = coefficients.argsort()[-30:][::-1]

print("\nStrongest phishing/suspicious indicators:\n")

for index in top_indices:

    print(
        f"{feature_names[index]:35s}"
        f"{coefficients[index]:10.4f}"
    )


# ============================================================
# 12. TOP LEGITIMATE INDICATORS
# ============================================================

print("\n" + "=" * 70)
print("TOP LEGITIMATE INDICATORS")
print("=" * 70)

bottom_indices = coefficients.argsort()[:20]

print("\nStrongest legitimate indicators:\n")

for index in bottom_indices:

    print(
        f"{feature_names[index]:35s}"
        f"{coefficients[index]:10.4f}"
    )


# ============================================================
# 13. SAVE MODEL
# ============================================================

print("\n" + "=" * 70)
print("SAVING MODEL")
print("=" * 70)

joblib.dump(model, MODEL_FILE)
joblib.dump(vectorizer, VECTORIZER_FILE)

print(f"\nModel saved:")
print(MODEL_FILE)

print("\nVectorizer saved:")
print(VECTORIZER_FILE)


# ============================================================
# 14. COMPLETE
# ============================================================

print("\n" + "=" * 70)
print("TRAINING COMPLETE")
print("=" * 70)