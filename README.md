# Phishing Detector API & Frontend

A full-stack phishing URL detection system with FastAPI backend and Next.js frontend.

## Project Structure

```
phishing-detector-api/
├── app/
│   └── main.py           # FastAPI backend with ML model
├── model/
│   ├── phishing_model.pkl # Trained ML model
│   └── train_url_model.py # Model training script
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   └── app/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       └── globals.css
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── ...
├── dataset_phishing.csv   # Training dataset
└── requirements.txt        # Python dependencies
```

## Features

- **15+ URL Features**: URL length, domain age, suspicious keywords, special characters, subdomain count, TLD analysis, and more
- **Domain Age Detection**: WHOIS lookup to check domain registration date
- **Explainable AI**: Human-readable explanations for each prediction
- **Modern UI**: Responsive Next.js frontend with Tailwind CSS

## Setup & Running

### Backend (FastAPI)

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Start the API server:
```bash
cd app
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend (Next.js)

1. Install Node.js (if not already installed): https://nodejs.org/

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoint

### POST /predict

Analyze a URL for phishing indicators.

**Request:**
```json
{
  "url": "https://example.com/login"
}
```

**Response:**
```json
{
  "url": "https://example.com/login",
  "prediction": "phishing",
  "risk_score": 0.82,
  "reasons": [
    "domain contains suspicious keywords (login, verify, secure, etc.)",
    "URL does not use HTTPS encryption"
  ]
}
```

## Feature List

1. url_len - URL length
2. has_at - Presence of "@" symbol
3. has_hyphen - Presence of hyphen in domain
4. has_ip - IP address pattern detection
5. num_dots - Number of dots in domain
6. has_https - HTTPS protocol check
7. num_subdirs - Number of subdirectories
8. num_query_params - Number of query parameters
9. num_digits - Count of digit characters
10. num_special_chars - Count of special characters
11. suspicious_keywords - Count of phishing keywords
12. domain_length - Domain name length
13. tld_length - Top-level domain length
14. subdomain_count - Number of subdomains
15. domain_age_days - Domain age from WHOIS lookup

