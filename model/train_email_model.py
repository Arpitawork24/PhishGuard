#!/usr/bin/env python3
"""
Train email phishing classification model using phishing_email.csv dataset.
Saves model and TF-IDF vectorizer for FastAPI inference.
"""

import re
import string
import pandas as pd
import numpy as np
from pathlib import Path
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.pipeline import Pipeline
import nltk
from nltk.corpus import stopwords

# Download stopwords if needed (run once)
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# English stopwords
stop_words = set(stopwords.words('english'))

def clean_text(text: str) -> str:
    if pd.isna(text):
        return ''

    text = text.lower()

    # remove urls but keep domain words
    text = re.sub(r"http\S+", "url", text)

    # remove numbers
    text = re.sub(r"\d+", "", text)

    # remove punctuation except important characters
    text = re.sub(r"[^\w\s@!$]", " ", text)

    words = text.split()

    words = [w for w in words if w not in stop_words and len(w) > 2]

    return " ".join(words)

def main():
    print("Loading phishing_email.csv dataset...")
    
    # Load dataset
    dataset_path = Path(__file__).parent.parent / "phishing_email.csv"
    if not dataset_path.exists():
        raise FileNotFoundError(f"Dataset not found: {dataset_path}")
    
    df = pd.read_csv(dataset_path)
    print(f"Dataset loaded: {len(df)} samples")
    print(f"Columns: {list(df.columns)}")
    print(f"Label distribution:\n{df['label'].value_counts()}")
    
    # Prepare data
    print("\nCleaning text data...")
    df['cleaned_text'] = df['text_combined'].apply(clean_text)
    
    # Remove empty texts
    df = df[df['cleaned_text'].str.len() > 0].copy()
    print(f"After cleaning: {len(df)} samples")
    
    X = df['cleaned_text']
    y = df['label']
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Train: {len(X_train)}, Test: {len(X_test)}")
    
    # Create pipeline: TF-IDF + Logistic Regression
    print("\nTraining model...")
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            max_features=20000,
            ngram_range=(1, 2),
            min_df=2,
            max_df=0.95,
            stop_words=None  # Already handled in cleaning
        )),
        ('classifier', LogisticRegression(
            max_iter=1000,
            random_state=42,
            class_weight='balanced'
        ))
    ])
    
    # Train
    pipeline.fit(X_train, y_train)
    
    # Predict on test set
    y_pred = pipeline.predict(X_test)
    
    # Evaluation
    print("\n=== EVALUATION RESULTS ===")
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    print(f"Accuracy:  {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # Save model and vectorizer
    print("\nSaving model and vectorizer...")
    model_dir = Path(__file__).parent
    joblib.dump(pipeline, model_dir / "email_model.pkl")
    joblib.dump(pipeline.named_steps['tfidf'], model_dir / "email_vectorizer.pkl")
    
    print("✅ Model saved: model/email_model.pkl")
    print("✅ Vectorizer saved: model/email_vectorizer.pkl")
    print("\nReady for FastAPI inference!")
    
    # Example prediction
    print("\nExample prediction:")
    sample_email = "URGENT: Verify your account now at secure-bank-login.com"
    cleaned_sample = clean_text(sample_email)
    prediction = pipeline.predict([cleaned_sample])[0]
    probability = pipeline.predict_proba([cleaned_sample])[0]
    print(f"Sample: {sample_email}")
    print(f"Prediction: {'phishing' if prediction == 1 else 'safe'}")
    print(f"Probabilities: safe={probability[0]:.3f}, phishing={probability[1]:.3f}")

if __name__ == "__main__":
    main()

