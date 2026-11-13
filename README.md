# 🛡️ PhishGuard AI – AI-Powered Phishing Detection System

PhishGuard AI is a full-stack phishing detection system designed to identify potentially malicious URLs using Machine Learning and intelligent URL analysis.

It combines a **FastAPI backend**, a trained Machine Learning model, and a modern **Next.js frontend** to analyze suspicious URLs, assess potential security risks, and provide explainable prediction results.

## ✨ Features

- **Machine Learning-Based Detection:** Classifies URLs as potentially legitimate or phishing.
- **15+ URL Features:** Analyzes URL length, domain age, suspicious keywords, special characters, subdomains, TLD characteristics, and more.
- **Domain Age Detection:** Uses WHOIS lookup to retrieve domain registration information.
- **Explainable AI:** Provides human-readable reasons behind detection results.
- **Risk Score Analysis:** Generates a risk score to help users understand potential URL threats.
- **Modern User Interface:** Responsive frontend built with Next.js and Tailwind CSS.
- **REST API:** FastAPI-powered backend for URL analysis and prediction.

## 🧰 Tech Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI |
| Machine Learning | Scikit-learn |
| Data Processing | Pandas, NumPy |
| Domain Analysis | WHOIS |
| API Documentation | FastAPI Swagger UI |

## 📁 Project Structure

```text
phishing-detector-api/
│
├── app/
│   └── main.py
│
├── model/
│   └── train_url_model.py
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       └── globals.css
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── requirements.txt
├── .gitignore
└── README.md
```

*Note: Trained model files and large training datasets are excluded from this repository due to their file sizes.*

## ⚙️ Installation & Setup

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Arpitawork24/PhishGuard.git
cd PhishGuard
```

### 2. Backend Setup

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Model Training Workflow

PhishGuard AI uses a trained Machine Learning model to classify URLs based on extracted URL characteristics.

The training script is located in the `model/` directory.

**Step 1: Prepare the Training Dataset**

Obtain the required phishing URL dataset and place it in the location expected by the training script.

Large datasets are not included in this repository. Make sure the dataset path and column names match those configured in the training script.

**Step 2: Train the Model**

Run the training script from the project root:

```bash
python model/train_url_model.py
```

The script is responsible for preparing the training data, extracting the required features, training the classification model, and saving the trained model artifacts.

**Step 3: Verify Model Artifacts**

After successful training, verify that the generated model files are saved in the expected `model/` directory.

The backend requires the trained model artifacts to be available at the paths specified in `app/main.py`.

**Step 4: Start the Backend**

```bash
cd app
uvicorn main:app --reload
```

The backend will run at:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

*Important: The exact dataset paths, model output filenames, and training requirements depend on the implementation of `train_url_model.py`. The training script and backend must use compatible feature extraction logic and model artifacts.*

### 4. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the Next.js development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

## 🔍 API Documentation

### POST `/predict`

Analyzes a submitted URL and returns its phishing prediction.

**Request Body:**

```json
{
  "url": "https://example.com/login"
}
```

**Example Response:**

```json
{
  "url": "https://example.com/login",
  "prediction": "phishing",
  "risk_score": 0.82,
  "reasons": [
    "Domain contains suspicious keywords",
    "URL does not use HTTPS encryption"
  ]
}
```

*Note: The response above is illustrative. Actual predictions and response values depend on the backend implementation.*

## 🧠 URL Features Used for Detection

The Machine Learning model analyzes multiple URL characteristics to identify potentially suspicious patterns.

| Feature | Description |
|---|---|
| url_len | Total URL length |
| has_at | Presence of the @ symbol |
| has_hyphen | Presence of a hyphen in the domain |
| has_ip | IP address pattern detection |
| num_dots | Number of dots in the URL |
| has_https | HTTPS protocol check |
| num_subdirs | Number of URL subdirectories |
| num_query_params | Number of query parameters |
| num_digits | Count of numerical digits |
| num_special_chars | Count of special characters |
| suspicious_keywords | Count of suspicious keywords |
| domain_length | Domain name length |
| tld_length | Top-level domain length |
| subdomain_count | Number of subdomains |
| domain_age_days | Domain age obtained through WHOIS lookup |

## 🔮 Future Improvements

- Improve model accuracy and generalization.
- Integrate additional threat intelligence sources.
- Enhance detection of newly registered and suspicious domains.
- Provide more detailed security analysis and reporting.
- Improve model evaluation and performance monitoring.
- Expand detection capabilities for different phishing techniques.

## ⚠️ Limitations

- WHOIS information may not be available for every domain.
- URL-based detection cannot guarantee that a website is safe or malicious.
- Machine Learning predictions may produce false positives and false negatives.
- Risk scores should be treated as indicators rather than definitive security guarantees.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## 📄 License

This project is currently available without an explicit open-source license. All rights are reserved by the repository owner unless a license is added.

---

**PhishGuard AI – Making the web a little safer, one URL at a time.** 🛡️
