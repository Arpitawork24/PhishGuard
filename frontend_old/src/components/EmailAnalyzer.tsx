"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmailInputCard } from "./EmailInputCard";
import { AnalyzeButton } from "./AnalyzeButton";
import { ResultCard } from "./ResultCard";
import { Loader } from "./Loader";

interface EmailResult {
  prediction: "phishing" | "spam" | "safe";
  risk_score: number;
  suspicious_urls: string[];
  reasons: string[];
}

export const EmailAnalyzer = () => {
  const [emailText, setEmailText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<EmailResult | null>(null);
  const [error, setError] = useState(""); 

  const analyzeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText.trim()) return;

    setLoading(true);
    setLoadingStep(0);
    setError("");
    setResult(null);

    // Simulate AI scanning steps
    const steps = [
      "🔍 Scanning email content...",
      "🔗 Extracting URLs...", 
      "⚠ Detecting suspicious keywords...",
      "🧠 Running AI model...",
      "📊 Generating threat report..."
    ];

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= steps.length) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_text: emailText }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to analyze email. Is backend running?");
    } finally {
      setLoading(false);
      clearInterval(stepInterval);
    }
  };

  const steps = [
    "Scanning email content...",
    "Extracting URLs...", 
    "Detecting suspicious keywords...",
    "Running AI model...",
    "Generating threat report..."
  ];

  return (
    <div className="w-full">
      <form onSubmit={analyzeEmail} className="space-y-6 lg:space-y-8 flex flex-col items-center max-w-4xl mx-auto">
        
        <EmailInputCard 
          emailText={emailText} 
          setEmailText={setEmailText} 
          disabled={loading} 
        />
        
        <div className="w-full sm:w-2/3 lg:w-1/2 mt-4 relative z-20">
          <AnalyzeButton 
            loading={loading} 
            disabled={loading || !emailText.trim()} 
          />
        </div>

      </form>

      <div className="max-w-4xl mx-auto w-full mt-12">
        <AnimatePresence mode="wait">
          {loading && !error && !result && (
            <motion.div
              key="loader"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Loader step={loadingStep} steps={steps} />
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-6 bg-red-500/10 border-l-4 border-red-500 rounded-2xl glass-card relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-500/5 pulse-slow" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-400 mb-1">Analysis Failed</h3>
                  <p className="text-red-300/80">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ResultCard 
                result={result} 
                onClear={() => {
                  setEmailText("");
                  setResult(null);
                  setError("");
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmailAnalyzer;