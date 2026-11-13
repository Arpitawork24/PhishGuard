import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

print("Loading dataset...")

data = pd.read_csv("dataset_phishing.csv")

print("Dataset shape:", data.shape)

# Target column
y = data["status"]

# Features
X = data.drop(["url", "status"], axis=1)

print("Training model...")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=100)

model.fit(X_train, y_train)

joblib.dump(model, "model/phishing_model.pkl")

print("Model trained and saved successfully!")