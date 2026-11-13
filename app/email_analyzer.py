from typing import List, Dict, Tuple
from pathlib import Path
from urllib.parse import urlparse
import re

import numpy as np
import pandas as pd
import joblib


# ============================================================
# MODEL PATHS
# ============================================================

MODEL_DIR = Path(__file__).resolve().parents[1] / "model"


# ============================================================
# LOAD MESSAGE MODEL
# ============================================================

email_model = joblib.load(
    MODEL_DIR / "message_model.pkl"
)

email_vectorizer = joblib.load(
    MODEL_DIR / "message_vectorizer.pkl"
)


# ============================================================
# LOAD URL MODEL
# ============================================================

try:
    url_model = joblib.load(
        MODEL_DIR / "phishing_model.pkl"
    )
    print("[INFO] URL phishing model loaded.")
except Exception as e:
    print(f"[WARNING] Could not load URL model: {e}")
    url_model = None


# ============================================================
# KEYWORDS
# ============================================================

PHISHING_KEYWORDS = [
    "urgent",
    "verify",
    "login",
    "password",
    "account",
    "bank",
    "security",
    "update",
    "confirm",
    "action required",
    "immediate",
    "suspended",
    "blocked",
    "click here",
    "dear customer",
    "your account",
    "billing information",
]

SPAM_KEYWORDS = [
    "free",
    "win",
    "prize",
    "congratulations",
    "limited time",
    "offer",
    "guaranteed",
    "no cost",
    "click to claim",
    "million dollars",
]

SUSPICIOUS_EMOJIS = [
    "🎉",
    "🚨",
    "💰",
    "🔥",
    "🎁",
]


# ============================================================
# TEXT CLEANING
# ============================================================

def clean_text(text: str) -> str:
    """
    Keep preprocessing consistent with the trained TF-IDF model.
    The TF-IDF vectorizer handles lowercase/accent normalization.
    """

    if not text or pd.isna(text):
        return ""

    text = str(text)

    # Only normalize whitespace.
    # Do NOT remove URLs, numbers or punctuation because
    # the new model was trained on the original message text.
    text = re.sub(r"\s+", " ", text)

    return text.strip()


# ============================================================
# URL EXTRACTION
# ============================================================

def extract_urls(email_text: str) -> List[str]:

    url_pattern = r"https?://[^\s]+|www\.[^\s]+"

    urls = re.findall(url_pattern, email_text)

    cleaned = []

    for url in urls:
        # Remove common trailing punctuation
        url = url.rstrip(".,!?;:)")

        if "." in url and len(url) > 6:
            cleaned.append(url)

    return cleaned


# ============================================================
# RULE-BASED ANALYSIS
# ============================================================

def detect_rules(
    email_text: str,
) -> Tuple[float, List[str], List[str]]:

    reasons = []
    matched_keywords = []
    score = 0.0

    text_lower = email_text.lower()

    # --------------------------------------------------------
    # Phishing keywords
    # --------------------------------------------------------

    phish_hits = [
        kw for kw in PHISHING_KEYWORDS
        if kw in text_lower
    ]

    if phish_hits:

        reasons.append(
            f"{len(phish_hits)} phishing keyword(s) detected: "
            f"{', '.join(phish_hits[:6])}"
        )

        matched_keywords.extend(phish_hits)

        score += min(
            len(phish_hits) * 0.10,
            0.30
        )

    # --------------------------------------------------------
    # Spam keywords
    # --------------------------------------------------------

    spam_hits = [
        kw for kw in SPAM_KEYWORDS
        if kw in text_lower
    ]

    if spam_hits:

        reasons.append(
            f"{len(spam_hits)} spam keyword(s) detected: "
            f"{', '.join(spam_hits[:6])}"
        )

        matched_keywords.extend(spam_hits)

        score += min(
            len(spam_hits) * 0.08,
            0.20
        )

    # --------------------------------------------------------
    # Emoji detection
    # --------------------------------------------------------

    emoji_hits = [
        emoji
        for emoji in SUSPICIOUS_EMOJIS
        if emoji in email_text
    ]

    if emoji_hits:

        for emoji in emoji_hits:
            reasons.append(
                f"Suspicious promotional emoji detected ({emoji})"
            )

        score += min(
            len(emoji_hits) * 0.12,
            0.30
        )

    # --------------------------------------------------------
    # Excessive uppercase
    # --------------------------------------------------------

    letters = [
        c for c in email_text
        if c.isalpha()
    ]

    if letters:

        uppercase_ratio = (
            sum(c.isupper() for c in letters)
            / len(letters)
        )

        if uppercase_ratio > 0.25:

            reasons.append(
                "Excessive UPPERCASE text"
            )

            score += 0.15

    # --------------------------------------------------------
    # Urgent punctuation
    # --------------------------------------------------------

    punctuation_count = (
        email_text.count("!")
        + email_text.count("?")
    )

    if punctuation_count >= 3:

        reasons.append(
            "Urgent punctuation pattern detected"
        )

        score += 0.15

    # --------------------------------------------------------
    # Remove duplicate keywords
    # --------------------------------------------------------

    unique_keywords = []

    for keyword in matched_keywords:

        if keyword not in unique_keywords:
            unique_keywords.append(keyword)

    return (
        min(score, 0.8),
        reasons,
        unique_keywords
    )


# ============================================================
# URL FEATURE EXTRACTION
# ============================================================

def extract_phishing_features(url: str):
    parsed = urlparse(url)

    domain = parsed.netloc
    path = parsed.path or ""
    query = parsed.query or ""

    # Remove port from domain
    domain_without_port = domain.split(":")[0]

    url_len = len(url)
    has_at = "@" in url

    # Domain features
    domain_hyphen = domain.count("-")

    has_ip = bool(
        re.fullmatch(
            r"(?:\d{1,3}\.){3}\d{1,3}",
            domain_without_port
        )
    )

    num_dots_domain = domain.count(".")
    has_https = parsed.scheme.lower() == "https"

    # Path / query features
    num_subdirs = path.count("/")
    num_query_params = query.count("&") + (1 if query else 0)

    # Digits
    num_digits_domain = sum(
        c.isdigit() for c in domain_without_port
    )

    num_digits_path = sum(
        c.isdigit() for c in path
    )

    # Special characters
    domain_special_chars = sum(
        1
        for c in domain_without_port
        if not c.isalnum() and c not in [":", ".", "-"]
    )

    path_special_chars = sum(
        1
        for c in path
        if not c.isalnum() and c not in ["/", "-", "_", "?", "&", "="]
    )

    # Suspicious keywords
    suspicious_keywords_list = [
        "login", "signin", "verify", "secure", "account",
        "update", "confirm", "bank", "password", "credential",
        "suspend", "urgent", "alert", "limited", "restricted",
        "access"
    ]

    domain_suspicious_keywords = sum(
        1
        for kw in suspicious_keywords_list
        if kw in domain_without_port.lower()
    )

    path_suspicious_keywords = sum(
        1
        for kw in suspicious_keywords_list
        if kw in path.lower()
    )

    # Domain length
    domain_length = len(domain_without_port)

    # TLD length
    tld = ""

    if "." in domain_without_port:
        tld = domain_without_port.rsplit(".", 1)[-1]

    tld_length = len(tld)

    # Subdomain count
    subdomain_count = 0

    if "." in domain_without_port:
        parts = domain_without_port.rsplit(".", 1)

        if len(parts) > 1:
            subdomain_parts = parts[0].split(".")
            subdomain_count = len(subdomain_parts)

    # Domain age
    # The original training dataset used domain_age as feature 18.
    # Runtime does not currently perform WHOIS lookup here,
    # so use -1 when domain age is unavailable.
    domain_age = -1

    # EXACTLY 18 FEATURES
    return [
        float(url_len),                    # 0
        float(has_at),                     # 1
        float(domain_hyphen),              # 2
        float(has_ip),                     # 3
        float(num_dots_domain),            # 4
        float(has_https),                  # 5
        float(num_subdirs),                # 6
        float(num_query_params),           # 7
        float(num_digits_domain),          # 8
        float(num_digits_path),            # 9
        float(domain_special_chars),       # 10
        float(path_special_chars),         # 11
        float(domain_suspicious_keywords), # 12
        float(path_suspicious_keywords),   # 13
        float(domain_length),              # 14
        float(tld_length),                 # 15
        float(subdomain_count),            # 16
        float(domain_age)                  # 17
    ]
# ============================================================
# URL SCORING
# ============================================================

def score_urls(
    urls: List[str],
) -> Tuple[float, List[str]]:

    if not urls or url_model is None:
        return 0.0, []

    suspicious_urls = []

    risks = []

    for url in urls[:5]:

        try:

            features = extract_phishing_features(url)

            X = np.array(
                [features],
                dtype=float
            )

            if hasattr(
                url_model,
                "predict_proba"
            ):

                probability = float(
                    url_model.predict_proba(X)[0][1]
                )

            else:

                probability = float(
                    url_model.predict(X)[0]
                )

            risks.append(probability)

            if probability >= 0.50:

                suspicious_urls.append(
                    f"{url[:60]}... "
                    f"({probability:.1%})"
                )

        except Exception as e:

            print(
                f"[WARNING] URL analysis failed "
                f"for {url}: {e}"
            )

    if not risks:
        return 0.0, suspicious_urls

    average_risk = sum(risks) / len(risks)

    return (
        min(average_risk, 1.0),
        suspicious_urls
    )


# ============================================================
# MAIN EMAIL ANALYZER
# ============================================================

def analyze_email(email_text: str) -> Dict:

    """
    Hybrid phishing analysis:

    ML Model  = 70%
    Rules     = 15%
    URL Model = 15%
    """

    # --------------------------------------------------------
    # Basic validation
    # --------------------------------------------------------

    if not email_text or len(email_text.strip()) < 20:

        return {
            "prediction": "safe",
            "risk_score": 0.0,
            "suspicious_urls": [],
            "reasons": [
                "Email too short for meaningful analysis"
            ],
            "suspicious_keywords": [],
            "ml_confidence": 0.0,
            "urls_found": 0,
        }

    reasons = []

    # ========================================================
    # 1. MESSAGE ML MODEL
    # ========================================================

    cleaned = clean_text(email_text)

    text_features = email_vectorizer.transform(
        [cleaned]
    )

    ml_proba = float(
        email_model.predict_proba(
            text_features
        )[0][1]
    )

    reasons.append(
        f"ML Model confidence: {ml_proba:.1%}"
    )

    # ========================================================
    # 2. RULE ENGINE
    # ========================================================

    rules_score, rule_reasons, matched_keywords = (
        detect_rules(email_text)
    )

    reasons.extend(rule_reasons)

    # ========================================================
    # 3. URL ANALYSIS
    # ========================================================

    urls = extract_urls(email_text)

    url_score, suspicious_urls = score_urls(
        urls
    )

    if suspicious_urls:

        reasons.append(
            f"{len(suspicious_urls)} suspicious URL(s) detected"
        )

    # ========================================================
    # 4. FINAL RISK SCORE
    # ========================================================

    final_risk = (
        ml_proba * 0.70
        + rules_score * 0.15
        + url_score * 0.15
    )

    final_risk = min(
        max(final_risk, 0.0),
        1.0
    )

    # ========================================================
    # 5. FINAL CLASSIFICATION
    # ========================================================

    if final_risk >= 0.65:

        prediction = "phishing"

    elif final_risk >= 0.35:

        prediction = "spam"

    else:

        prediction = "safe"

    # ========================================================
    # 6. RESPONSE
    # ========================================================

    result = {

        "prediction": prediction,

        "risk_score": round(
            final_risk,
            3
        ),

        "suspicious_urls": suspicious_urls,

        "reasons": reasons,

        "ml_confidence": round(
            ml_proba,
            3
        ),

        "urls_found": len(urls),

        "suspicious_keywords": matched_keywords,
    }

    print(
        "[INFO] Email analysis:",
        result
    )

    return result