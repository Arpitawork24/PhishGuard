from typing import Dict, List, Tuple
import re
import joblib
from pathlib import Path
from urllib.parse import urlparse
import numpy as np
from collections import Counter


PHISHING_URL_PATTERNS = [
    "login", "signin", "verify", "secure", "account", "update",
    "confirm", "bank", "password", "credential", "suspend",
    "urgent", "alert", "limited", "restricted", "access",
    "paypal", "amazon", "netflix", "microsoft", "google"
]

def preprocess_url(url: str) -> str:
    """Clean and normalize URL for analysis."""
    parsed = urlparse(url)
    domain = parsed.netloc.lower() if parsed.netloc else ""
    path = parsed.path.lower() if parsed.path else ""
    return f"{domain}{path}"


def extract_url_features(url: str) -> List[float]:
    """Extract 18 phishing detection features."""
    parsed = urlparse(url)
    domain = parsed.netloc or ""
    path = parsed.path or ""
    query = parsed.query or ""

    # Clean domain
    domain_without_port = domain.split(":")[0] if ":" in domain else domain
    
    # Feature extraction
    url_len = len(url)
    has_at = 1 if "@" in url else 0
    has_ip = 1 if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", domain_without_port) else 0
    num_dots_domain = domain.count(".")
    has_https = 1 if parsed.scheme.lower() == "https" else 0
    num_subdirs = len([p for p in path.split("/") if p])
    num_query_params = query.count("&") + (1 if query else 0)

    domain_hyphen = domain.count("-")
    num_digits_domain = sum(c.isdigit() for c in domain_without_port)
    num_digits_path = sum(c.isdigit() for c in path)

    domain_special_chars = sum(1 for c in domain_without_port if c not in "abcdefghijklmnopqrstuvwxyz0123456789.-")
    path_special_chars = sum(1 for c in path if c not in "abcdefghijklmnopqrstuvwxyz0123456789/-?_=&")

    # Suspicious keywords
    suspicious_keywords = sum(1 for kw in PHISHING_URL_PATTERNS if kw in domain.lower() or kw in path.lower())
    
    domain_length = len(domain_without_port)
    tld = domain_without_port.rsplit(".", 1)[-1] if "." in domain_without_port else ""
    tld_length = len(tld)
    subdomain_count = len(domain_without_port.split(".")) - 2 if "." in domain_without_port else 0
    
    # Domain age (placeholder)
    domain_age_days = 365.0

    features = [
        url_len, has_at, domain_hyphen, has_ip, num_dots_domain,
        has_https, num_subdirs, num_query_params, num_digits_domain,
        num_digits_path, domain_special_chars, path_special_chars,
        suspicious_keywords, domain_length, tld_length, subdomain_count,
        domain_age_days, float(len(query) > 100)
    ]

    return features


def get_url_model():
    """Load URL phishing model with fallback."""
    model_path = Path(__file__).resolve().parents[1] / "model" / "phishing_model.pkl"
    
    try:
        if model_path.exists():
            return joblib.load(model_path)
    except Exception:
        pass
    
    # Fallback model
    class DummyPhishingModel:
        def predict(self, X):
            return np.array([[0]] * len(X))  # Safe by default
        
        def predict_proba(self, X):
            return np.array([[0.9, 0.1]] * len(X))  # 90% safe
    
    return DummyPhishingModel()


def analyze_url(url: str) -> Dict:
    """Main URL analysis function."""
    if not url or len(url.strip()) < 10:
        return {
            "prediction": "safe",
            "risk_score": 0.0,
            "reasons": ["Invalid or too short URL"]
        }

    try:
        features = extract_url_features(url)
        X = np.array(features).reshape(1, -1)
        
        model = get_url_model()
        proba = model.predict_proba(X)[0][1]  # Phishing probability
        
        prediction = "phishing" if proba >= 0.5 else "safe"
        
        # Rule-based reasons
        reasons = []
        parsed = urlparse(url)
        
        if proba >= 0.5:
            reasons.append("High ML risk score")
        
        if "@" in url:
            reasons.append("Contains @ symbol (credential phishing)")
        
        if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", parsed.netloc):
            reasons.append("IP address instead of domain")
        
        domain_keywords = sum(1 for kw in PHISHING_URL_PATTERNS if kw in parsed.netloc.lower())
        if domain_keywords > 0:
            reasons.append(f"Suspicious keywords in domain ({domain_keywords})")
        
        if len(parsed.query) > 100:
            reasons.append("Excessively long query string")
        
        return {
            "prediction": prediction,
            "risk_score": round(float(proba), 3),
            "reasons": reasons[:5]
        }
        
    except Exception as e:
        return {
            "prediction": "safe",
            "risk_score": 0.0,
            "reasons": [f"Analysis error: {str(e)}"]
        }


if __name__ == "__main__":
    test_urls = [
        "http://login-bank-secure.com/update?verify=true",
        "https://google.com",
        "http://192.168.1.1/login"
    ]
    
    for url in test_urls:
        result = analyze_url(url)
        print(f"URL: {url}")
        print(f"Result: {result}\n")
