from typing import List, Dict, Tuple
import re
import string
from collections import Counter
import numpy as np
import joblib
from pathlib import Path
from urllib.parse import urlparse


PHISHING_KEYWORDS = [
    "urgent", "verify", "login", "password", "account", "bank", "security",
    "update", "confirm", "action required", "immediate", "suspended", "blocked",
    "click here", "dear customer", "your account", "billing information"
]

SPAM_PATTERNS_KEYWORDS = [
    "free", "win", "prize", "congratulations", "limited time", "offer",
    "guaranteed", "no cost", "click to claim", "million dollars"
]


def extract_urls(email_text: str) -> List[str]:
    """
    Extract URLs from email text using regex.
    """
    url_pattern = r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+[^\s]*|www\.[^\s]+|(?:[0-9]{1,3}\.){3}[0-9]{1,3}[^\s]*'
    urls = re.findall(url_pattern, email_text, re.IGNORECASE)
    cleaned_urls = list(set(url.strip(".,;?!:") for url in urls if url.strip()))
    return cleaned_urls


def preprocess_email(email_text: str) -> str:
    """
    Preprocess email text: lowercase, remove punctuation, normalize spaces.
    """
    text = email_text.lower()
    translator = str.maketrans("", "", string.punctuation)
    text = text.translate(translator)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def detect_phishing_keywords(email_text: str) -> Tuple[int, List[str]]:
    """
    Detect phishing keywords.
    """
    processed = preprocess_email(email_text)
    found_keywords = [kw for kw in PHISHING_KEYWORDS if kw in processed]
    count = len(found_keywords)
    return count, found_keywords


def detect_spam_patterns(email_text: str) -> Tuple[float, List[str]]:
    """
    Detect spam patterns like caps ratio, punctuation, repeated words.
    """
    reasons = []
    score = 0.0

    upper_ratio = sum(1 for c in email_text if c.isupper()) / max(len(email_text), 1)
    if upper_ratio > 0.3:
        reasons.append("excessive uppercase text")
        score += 0.25

    excl_count = email_text.count("!") + email_text.count("?")
    excl_ratio = excl_count / max(len(email_text) / 100, 1)
    if excl_ratio > 0.5:
        reasons.append("excessive punctuation (! ?)")
        score += 0.25

    processed = preprocess_email(email_text)
    words = re.findall(r"\b\w+\b", processed)
    word_counts = Counter(words)

    repeats = sum(1 for count in word_counts.values() if count > 2)
    if repeats > 2:
        reasons.append("repeated words detected")
        score += 0.20

    spam_count = sum(1 for kw in SPAM_PATTERNS_KEYWORDS if kw in processed)
    if spam_count > 0:
        reasons.append(f"spam keywords detected ({spam_count})")
        score += 0.30

    return min(score, 1.0), reasons


def get_model():
    """
    Load phishing URL ML model.
    """
    model_path = Path(__file__).resolve().parents[1] / "model" / "phishing_model.pkl"

    if not model_path.exists():
        raise RuntimeError(f"Model file not found at {model_path}")

    return joblib.load(model_path)


def extract_phishing_features(url: str) -> List[float]:
    """
    Extract URL features for phishing detection model.
    """
    parsed = urlparse(url)

    domain = parsed.netloc or ""
    path = parsed.path or ""
    query = parsed.query or ""

    domain_without_port = domain.split(":")[0]

    url_len = len(url)
    has_at = 1 if "@" in url else 0
    has_ip = 1 if re.fullmatch(r"(?:\d{1,3}\.){3}\d{1,3}", domain_without_port) else 0
    num_dots_domain = domain.count(".")
    has_https = 1 if parsed.scheme.lower() == "https" else 0
    num_subdirs = path.count("/")
    num_query_params = query.count("&") + (1 if query else 0)

    domain_hyphen = domain.count("-")
    num_digits_domain = sum(c.isdigit() for c in domain_without_port)
    num_digits_path = sum(c.isdigit() for c in path)

    domain_special_chars = sum(1 for c in domain_without_port if not c.isalnum() and c not in ":.-")
    path_special_chars = sum(1 for c in path if not c.isalnum() and c not in "/-?_=&")

    suspicious_keywords_list = [
        "login", "signin", "verify", "secure", "account", "update",
        "confirm", "bank", "password", "credential", "suspend",
        "urgent", "alert", "limited", "restricted", "access"
    ]

    domain_suspicious_keywords = sum(
        1 for kw in suspicious_keywords_list if kw in domain_without_port.lower()
    )
    path_suspicious_keywords = sum(
        1 for kw in suspicious_keywords_list if kw in path.lower()
    )

    domain_length = len(domain_without_port)
    tld = domain_without_port.rsplit(".", 1)[-1] if "." in domain_without_port else ""
    tld_length = len(tld)

    subdomain_parts = (
        domain_without_port.rsplit(".", 1)[0].split(".")
        if "." in domain_without_port else []
    )
    subdomain_count = len(subdomain_parts)

    domain_age_days = 365.0  # placeholder

    features = [
        float(url_len),
        float(has_at),
        float(domain_hyphen),
        float(has_ip),
        float(num_dots_domain),
        float(has_https),
        float(num_subdirs),
        float(num_query_params),
        float(num_digits_domain),
        float(num_digits_path),
        float(domain_special_chars),
        float(path_special_chars),
        float(domain_suspicious_keywords),
        float(path_suspicious_keywords),
        float(domain_length),
        float(tld_length),
        float(subdomain_count),
        float(domain_age_days),
    ]

    return features


def generate_explanation(url: str, features: List[float], phishing_score: float) -> List[str]:
    """
    Generate simple explanation.
    """
    reasons = []

    if phishing_score >= 0.5:
        reasons.append("High phishing risk detected")
    else:
        reasons.append("Low risk URL")

    return reasons


def analyze_email(email_text: str) -> Dict:
    """
    Main email analysis function.
    """

    if not email_text.strip() or len(email_text.strip()) < 10:
        return {
            "prediction": "safe",
            "risk_score": 0.0,
            "suspicious_urls": [],
            "reasons": ["Email too short for analysis"]
        }

    reasons = []

    # phishing keywords
    kw_count, kw_list = detect_phishing_keywords(email_text)
    kw_score = (kw_count / len(PHISHING_KEYWORDS)) * 0.3

    if kw_list:
        reasons.extend([f"Phishing keyword: '{kw}'" for kw in kw_list[:3]])

    # spam patterns
    spam_score, spam_reasons = detect_spam_patterns(email_text)
    spam_weighted = spam_score * 0.3
    reasons.extend(spam_reasons)

    # URLs
    urls = extract_urls(email_text)
    num_urls = len(urls)

    url_risk_sum = 0.0
    suspicious_urls = []

    if urls:
        try:
            model = get_model()

            for url in urls:
                features = extract_phishing_features(url)
                X = np.array(features).reshape(1, -1)

                if hasattr(model, "predict_proba"):
                    proba = model.predict_proba(X)[0][1]
                else:
                    proba = 1.0 if model.predict(X)[0] == 1 else 0.0

                url_risk_sum += proba

                if proba >= 0.5:
                    suspicious_urls.append(url)
                    reasons.append(f"Suspicious URL: {url[:50]}...")

        except Exception:
            reasons.append("URL model unavailable - basic checks only")

    avg_url_risk = url_risk_sum / max(num_urls, 1)
    url_score = min((num_urls / 5.0) * 0.1 + avg_url_risk * 0.3, 0.4)

    total_risk = kw_score + spam_weighted + url_score

    if total_risk >= 0.7:
        prediction = "phishing"
    elif total_risk >= 0.4:
        prediction = "spam"
    else:
        prediction = "safe"

    if num_urls == 0:
        reasons.append("No suspicious URLs found")

    return {
        "prediction": prediction,
        "risk_score": round(total_risk, 2),
        "suspicious_urls": suspicious_urls,
        "reasons": reasons[:8]
    }


if __name__ == "__main__":

    test_email = """
    URGENT! Action Required!
    Dear Customer, verify your account at http://fake-bank-login.com/update now!
    Free iPhone if you click here! http://win.freeiphone.com
    """

    result = analyze_email(test_email)

    print(result)