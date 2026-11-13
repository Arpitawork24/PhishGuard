from functools import lru_cache
from pathlib import Path
from typing import Literal, List, Optional
from app.email_analyzer import analyze_email
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sys
sys.path.append('..')

# Import the updated email analyzer (with emoji detection, full reasons, etc.)
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "app"))

from pydantic import BaseModel
from typing import Union
HttpUrl = str # Simplified for demo

app = FastAPI(title="Phishing Detector API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "API running"}

class URLInput(BaseModel):
    url: str

class PredictionOutput(BaseModel):
    url: str
    prediction: Literal["phishing", "safe"]
    risk_score: float
    reasons: list[str]
    suspicious_keywords: list[str] = []


class EmailInput(BaseModel):
    email_text: str


class EmailPredictionOutput(BaseModel):
    prediction: str
    risk_score: float
    suspicious_urls: List[str]
    reasons: List[str]
    ml_confidence: Optional[float] = None
    urls_found: Optional[int] = None
    suspicious_keywords: Optional[List[str]] = None


def get_url_risk_score(url: str) -> tuple:
    """
    Heuristic URL risk scorer — calibrated for real-world phishing detection.
    Returns (risk_score: float, prediction: str, reasons: list, suspicious_keywords: list)
    """
    import re
    from urllib.parse import urlparse

    # High-confidence phishing keywords commonly used by attackers
    DOMAIN_PHISHING_KEYWORDS = [
        "login", "signin", "verify", "secure", "account", "update",
        "confirm", "bank", "password", "credential", "suspend",
        "paypal", "amazon", "netflix", "microsoft", "apple", "ebay",
        "wellsfargo", "chase", "citibank", "support", "webscr",
        "auth", "validation", "recover", "unlock", "wallet",
    ]
    PATH_PHISHING_KEYWORDS = [
        "login", "signin", "verify", "account", "confirm", "secure",
        "update", "password", "credential", "webscr", "cmd", "dispatch",
        "phish", "validate", "recover", "suspended",
    ]
    SUSPICIOUS_TLDS = {"tk", "ml", "ga", "cf", "gq", "xyz", "top", "pw",
                       "click", "download", "bid", "date", "faith", "loan",
                       "review", "stream", "win", "party", "gdn", "men"}

    KNOWN_SAFE = {
        "google.com", "microsoft.com", "apple.com", "amazon.com",
        "github.com", "youtube.com", "facebook.com", "twitter.com",
        "linkedin.com", "stackoverflow.com", "wikipedia.org",
        "instagram.com", "reddit.com", "netflix.com", "paypal.com",
        "x.com", "openai.com", "cloudflare.com", "outlook.com",
    }

    url_norm = url if url.startswith(("http://", "https://")) else f"http://{url}"
    parsed = urlparse(url_norm)
    domain = parsed.netloc.lower().split(":")[0]
    path = parsed.path.lower()
    query = parsed.query.lower()

    score = 0.0
    reasons = []
    signals_hit = 0  # for combo amplification

    # --- HARD BLOCKERS (single signal enough) ---

    # 1. IP address used instead of domain — almost always phishing
    if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", domain):
        score += 0.55
        reasons.append("IP address used as domain — classic phishing technique")
        signals_hit += 3

    # 2. @ symbol — hides real destination
    if "@" in url:
        score += 0.45
        reasons.append("'@' symbol in URL disguises the real destination")
        signals_hit += 2

    # --- STRONG SIGNALS ---

    # 3. Suspicious TLD
    tld = domain.rsplit(".", 1)[-1] if "." in domain else ""
    if tld in SUSPICIOUS_TLDS:
        score += 0.30
        reasons.append(f"High-risk free TLD '.{tld}' — heavily abused for phishing")
        signals_hit += 1

    # 4. Phishing brand keywords in domain
    kw_hits = [kw for kw in DOMAIN_PHISHING_KEYWORDS if kw in domain]
    if kw_hits:
        per_kw = 0.20  # 0.20 per keyword, up from 0.10
        score += min(0.45, per_kw * len(kw_hits))
        reasons.append(f"Phishing keywords in domain: {', '.join(kw_hits[:4])}")
        signals_hit += len(kw_hits)

    # 5. Phishing keywords in URL path
    path_kw_hits = [kw for kw in PATH_PHISHING_KEYWORDS if kw in path]
    if path_kw_hits:
        score += min(0.30, 0.12 * len(path_kw_hits))
        reasons.append(f"Phishing keywords in path: {', '.join(path_kw_hits[:3])}")
        signals_hit += 1

    # --- MODERATE SIGNALS ---

    # 6. Hyphens in domain (typosquatting) — even 1 hyphen is suspicious
    base_domain = domain.split(".")[0] if domain else ""
    hyphen_count = base_domain.count("-")
    if hyphen_count >= 1:
        score += 0.08 + (0.07 * hyphen_count)
        reasons.append(f"Hyphen(s) in domain ({hyphen_count}) — common in typosquatting")
        signals_hit += 1

    # 7. Excessive subdomains
    sub_count = len(domain.split(".")) - 2
    if sub_count >= 2:
        score += 0.12 * sub_count
        reasons.append(f"Excessive subdomains ({sub_count}) — used to hide real domain")
        signals_hit += 1

    # 8. No HTTPS
    if parsed.scheme == "http":
        score += 0.12
        reasons.append("Insecure HTTP — phishing sites often skip SSL")
        signals_hit += 1

    # 9. Very long URL
    if len(url) > 75:
        extra = min(0.15, (len(url) - 75) / 500)
        score += extra
        if extra >= 0.05:
            reasons.append(f"Unusually long URL ({len(url)} chars) — obfuscation tactic")
            signals_hit += 1

    # 10. Many digits in domain
    digit_count = sum(c.isdigit() for c in domain.replace(".", ""))
    if digit_count >= 3:
        score += 0.10
        reasons.append(f"Many digits in domain ({digit_count}) — typical of generated phishing domains")
        signals_hit += 1

    # 11. Long query string
    if len(query) > 60:
        score += 0.10
        reasons.append("Long query string — may encode redirect/obfuscate target")
        signals_hit += 1

    # 12. Domain is all numbers + dashes (random generated)
    if re.match(r"^[\d\-]+\.", domain):
        score += 0.20
        reasons.append("Domain starts with digits/dashes — pattern of auto-generated phishing domains")
        signals_hit += 1

    # --- COMBO AMPLIFIER ---
    # Multiple weak signals together are a strong indicator
    if signals_hit >= 3:
        amplifier = min(0.20, 0.05 * (signals_hit - 2))
        score += amplifier

    # --- SAFE DOMAIN WHITELIST (applied last, overrides signals) ---
    if any(domain == s or domain.endswith("." + s) for s in KNOWN_SAFE):
        # Well-known trusted domain: clamp to safe unless something extreme
        score = min(score, 0.15)

    score = round(min(score, 1.0), 3)
    # Lower threshold to 0.28 — catches URLs with even 2 moderate signals
    prediction = "phishing" if score >= 0.28 else "safe"

    if not reasons:
        reasons.append("No suspicious patterns detected — URL appears safe")

    # Collect all matched keywords for display
    all_matched_keywords = list(dict.fromkeys(kw_hits + path_kw_hits))

    return score, prediction, reasons[:5], all_matched_keywords



@app.post("/predict", response_model=PredictionOutput)
def predict_phishing(input_data: URLInput):
    try:
        risk_score, prediction, reasons, suspicious_keywords = get_url_risk_score(input_data.url)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"URL analysis failed: {str(exc)}")

    return PredictionOutput(
        url=input_data.url,
        prediction=prediction,
        risk_score=risk_score,
        reasons=reasons,
        suspicious_keywords=suspicious_keywords,
    )


@app.post("/analyze-email", response_model=EmailPredictionOutput)
def analyze_email_api(input_data: EmailInput):
    try:
        result = analyze_email(input_data.email_text)
        return EmailPredictionOutput(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Email analysis failed: {str(exc)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app_fixed_main:app", host="127.0.0.1", port=8000, reload=True, log_level="info")
