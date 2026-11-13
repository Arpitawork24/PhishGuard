import joblib
from pathlib import Path


# ============================================================
# LOAD MODEL
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_FILE = BASE_DIR / "model" / "message_model.pkl"
VECTORIZER_FILE = BASE_DIR / "model" / "message_vectorizer.pkl"

model = joblib.load(MODEL_FILE)
vectorizer = joblib.load(VECTORIZER_FILE)


# ============================================================
# TEST MESSAGES
# ============================================================

test_messages = [

    # --------------------------------------------------------
    # PHISHING
    # --------------------------------------------------------

    (
        "Your bank account has been temporarily restricted. "
        "Confirm your identity within 24 hours to avoid permanent suspension."
    ),

    (
        "Congratulations! You have been selected to receive "
        "a cash reward of Rs 50,000. Submit your bank details to claim it."
    ),

    (
        "URGENT: Your UPI service will be disabled today. "
        "Verify your account immediately to continue using payments."
    ),

    (
        "Your KYC verification has expired. "
        "Update your information immediately or your account will be blocked."
    ),

    (
        "We detected unusual activity on your account. "
        "Confirm your password and verification code to restore access."
    ),

    (
        "Your parcel could not be delivered. "
        "Pay the pending delivery charge now to reschedule your shipment."
    ),

    # --------------------------------------------------------
    # LEGITIMATE
    # --------------------------------------------------------

    (
        "Your electricity bill of Rs 850 is due on September 15. "
        "You can view and pay the bill through the official application."
    ),

    (
        "Your order has been shipped and is expected to arrive tomorrow. "
        "You can track the delivery from your order history."
    ),

    (
        "The project meeting has been moved to 3 PM tomorrow. "
        "Please review the attached document before the meeting."
    ),

    (
        "Your monthly account statement is now available in your banking app."
    ),

    (
        "Reminder: your university assignment submission is due Friday."
    ),

    (
        "Your appointment is confirmed for Monday at 10 AM. "
        "Please arrive 15 minutes early."
    ),

    # --------------------------------------------------------
    # DIFFICULT / AMBIGUOUS CASES
    # --------------------------------------------------------

    (
        "Your account needs verification before you can access the new feature. "
        "Please open the official mobile application to complete verification."
    ),

    (
        "Security alert: We noticed a new login to your account. "
        "If this was you, no action is required."
    ),

    (
        "Please verify your email address to complete registration "
        "for the service you signed up for."
    ),
]


# ============================================================
# PREDICT
# ============================================================

X = vectorizer.transform(test_messages)

predictions = model.predict(X)
probabilities = model.predict_proba(X)[:, 1]


# ============================================================
# DISPLAY RESULTS
# ============================================================

print("=" * 70)
print("RAKSHAK AI — MESSAGE MODEL SANITY TEST")
print("=" * 70)

for i, (message, prediction, probability) in enumerate(
    zip(test_messages, predictions, probabilities),
    start=1
):

    label = "PHISHING" if prediction == 1 else "LEGITIMATE"

    print(f"\nTEST {i}")
    print("-" * 70)

    print(f"Message:")
    print(message)

    print(f"\nPrediction : {label}")
    print(f"Phishing probability: {probability * 100:.2f}%")

print("\n" + "=" * 70)
print("TEST COMPLETE")
print("=" * 70)