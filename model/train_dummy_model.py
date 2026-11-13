from pathlib import Path

import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression


def generate_dummy_data(n_samples: int = 200):
    """
    Generate synthetic data consistent with extract_phishing_features in app.main:
    [url_len, has_at, has_hyphen, has_ip, num_dots, has_https, num_subdirs, num_query_params]
    """
    rng = np.random.default_rng(42)

    # Random but somewhat realistic ranges
    url_len = rng.integers(10, 200, size=n_samples)
    has_at = rng.integers(0, 2, size=n_samples)
    has_hyphen = rng.integers(0, 2, size=n_samples)
    has_ip = rng.integers(0, 2, size=n_samples)
    num_dots = rng.integers(1, 5, size=n_samples)
    has_https = rng.integers(0, 2, size=n_samples)
    num_subdirs = rng.integers(0, 10, size=n_samples)
    num_query_params = rng.integers(0, 8, size=n_samples)

    X = np.column_stack(
        [
            url_len,
            has_at,
            has_hyphen,
            has_ip,
            num_dots,
            has_https,
            num_subdirs,
            num_query_params,
        ]
    ).astype(float)

    # Heuristic rule to create labels:
    # more suspicious if: has_at, has_ip, many dots, no https, many query params
    suspicious_score = (
        0.01 * url_len
        + 2.0 * has_at
        + 1.5 * has_ip
        + 0.8 * has_hyphen
        + 0.7 * num_dots
        - 1.0 * has_https
        + 0.5 * num_query_params
    )

    # Threshold around median to get a mix of classes
    threshold = np.median(suspicious_score)
    y = (suspicious_score > threshold).astype(int)

    return X, y


def train_and_save_model(output_path: Path | None = None):
    if output_path is None:
        output_path = Path(__file__).resolve().parent / "phishing_model.pkl"

    X, y = generate_dummy_data()
    model = LogisticRegression(max_iter=1000)
    model.fit(X, y)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, output_path)
    print(f"Model trained and saved to: {output_path}")


if __name__ == "__main__":
    train_and_save_model()

