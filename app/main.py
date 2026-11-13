from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import sys
sys.path.append('..')

# Fallback imports
try:
    from email_analyzer import analyze_email
except ImportError:
    from email_analyzer_fixed import analyze_email as analyze_email

from url_analyzer import analyze_url

app = FastAPI(title="Phishing Detector API v2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Phishing Detection API Running"}

@app.post("/predict")
def predict_url(data: dict):
    url = data.get("url")
    return analyze_url(url)

@app.post("/analyze-email")
def predict_email(data: dict):
    email_text = data.get("email_text", data.get("email", ""))
    return analyze_email(email_text)
