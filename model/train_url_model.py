import pandas as pd
import joblib
import re
from urllib.parse import urlparse

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier


# Feature extractor matching app/main.py extract_phishing_features()
def extract_features(url):
    parsed = urlparse(url)
    domain = parsed.netloc
    path = parsed.path or ""
    query = parsed.query or ""

    # Remove port from domain if present
    domain_without_port = domain.split(":")[0]

    url_len = len(url)
    has_at = "@" in url
    has_hyphen = "-" in domain
    has_ip = bool(re.fullmatch(r"(?:\d{1,3}\.){3}\d{1,3}", domain_without_port))
    num_dots = domain.count(".")
    has_https = parsed.scheme.lower() == "https"
    num_subdirs = path.count("/")
    num_query_params = query.count("&") + (1 if query else 0)


    url_len = len(url)
    has_at = "@" in url
    has_ip = bool(re.fullmatch(r"(?:\d{1,3}\.){3}\d{1,3}", domain_without_port))
    num_dots_domain = domain.count(".")  # Domain-specific
    has_https = parsed.scheme.lower() == "https"
    num_subdirs = path.count("/")  # Path-specific
    num_query_params = query.count("&") + (1 if query else 0)  # Path-specific

    # Separated features: DOMAIN vs PATH
    # Domain features (suspicious when abnormal)
    domain_hyphen = domain.count("-")  # Domain-specific
    path_hyphen = path.count("-")      # Path-specific (normal)
    
    num_digits_domain = sum(c.isdigit() for c in domain_without_port)  # Domain - suspicious
    num_digits_path = sum(c.isdigit() for c in path)                    # Path - normal
    
    domain_special_chars = sum(1 for c in domain_without_port if not c.isalnum() and c not in [":", ".", "-"])  # Domain
    path_special_chars = sum(1 for c in path if not c.isalnum() and c not in ["/", "-", "_", "?", "&", "="])    # Path

    # Suspicious keywords - separated by location
    suspicious_keywords_list = [
        "login", "signin", "verify", "secure", "account", "update",
        "confirm", "bank", "password", "credential", "suspend",
        "urgent", "alert", "limited", "restricted", "access"
    ]
    domain_suspicious_keywords = sum(1 for kw in suspicious_keywords_list if kw in domain_without_port.lower())  # Domain - suspicious
    path_suspicious_keywords = sum(1 for kw in suspicious_keywords_list if kw in path.lower())                    # Path

    # Domain length
    domain_length = len(domain_without_port)

    # TLD (Top-Level Domain) length - extract the last part after the last dot
    tld = ""
    if "." in domain_without_port:
        tld = domain_without_port.rsplit(".", 1)[-1]
    tld_length = len(tld)

    # Subdomain count - count parts before the main domain (TLD)
    subdomain_count = 0
    if "." in domain_without_port:
        parts = domain_without_port.rsplit(".", 1)
        if len(parts) > 1:
            # Everything before the main domain is considered subdomain(s)
            subdomain_parts = parts[0].split(".")
            subdomain_count = len(subdomain_parts)

    # Note: domain_age will be added from the dataset's pre-computed column
    # Feature indices:
    # 0: url_len, 1: has_at, 2: domain_hyphen, 3: has_ip, 4: num_dots_domain
    # 5: has_https, 6: num_subdirs, 7: num_query_params
    # 8: num_digits_domain (suspicious), 9: num_digits_path (normal)
    # 10: domain_special_chars, 11: path_special_chars
    # 12: domain_suspicious_keywords (suspicious), 13: path_suspicious_keywords (normal)
    # 14: domain_length, 15: tld_length, 16: subdomain_count, 17: domain_age
    return [
        float(url_len),
        float(has_at),
        float(domain_hyphen),    # Domain hyphens - suspicious
        float(has_ip),
        float(num_dots_domain),  # Domain dots
        float(has_https),
        float(num_subdirs),      # Path subdirs
        float(num_query_params), # Query params
        float(num_digits_domain),  # Digits in domain - suspicious
        float(num_digits_path),    # Digits in path - normal
        float(domain_special_chars),  # Domain special chars
        float(path_special_chars),    # Path special chars
        float(domain_suspicious_keywords),  # Domain keywords - suspicious
        float(path_suspicious_keywords),    # Path keywords - normal
        float(domain_length),
        float(tld_length),
        float(subdomain_count),
    ]



print("Loading dataset...")

data = pd.read_csv("dataset_phishing.csv")

urls = data["url"]
labels = data["status"]

print("Extracting URL features...")
X = [extract_features(url) for url in urls]

# Add domain_age from the pre-computed dataset column
# domain_age column exists in the dataset
domain_ages = data["domain_age"].fillna(-1).values.tolist()

# Combine URL features with domain_age
X = [url_features + [domain_age] for url_features, domain_age in zip(X, domain_ages)]
y = labels

print("Training model...")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=100)

model.fit(X_train, y_train)

joblib.dump(model, "model/phishing_model.pkl")

print("Model trained with URL features and saved!")
