"use client";

import axios from "axios";
import { useState } from "react";

interface PredictionResponse {
  url: string;
  prediction: "phishing" | "safe";
  risk_score: number;
  reasons: string[];
  suspicious_keywords: string[];
}

const UrlAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState("");

  const analyzeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post<PredictionResponse>("http://localhost:8000/predict", {
        url,
      });
      setResult(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Failed to analyze URL");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 0.7) return "text-rose-500";
    if (score >= 0.4) return "text-amber-500";
    return "text-primary-500";
  };

  const getRiskBg = (score: number) => {
    if (score >= 0.7) return "bg-rose-500/10 border-rose-500/30";
    if (score >= 0.4) return "bg-amber-500/10 border-amber-500/30";
    return "bg-primary-500/10 border-primary-500/30";
  };

  const getPredictionBadge = (prediction: string) => {
    if (prediction === "phishing") {
      return "bg-rose-500/20 text-rose-400 border-rose-500/30";
    }
    return "bg-primary-500/20 text-primary-400 border-primary-500/30";
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Analyze a URL</h2>
        
        <form onSubmit={analyzeUrl} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-dark-300 mb-2">
              Enter URL to analyze
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 bg-dark-900 border border-white/5 rounded-xl text-foreground placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !url}
            className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-500 disabled:bg-dark-800 disabled:text-dark-500 text-white font-semibold rounded-xl transition-all disabled:cursor-not-allowed border border-primary-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:border-white/5 disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              "Analyze URL"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
            <p className="text-rose-400 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-4">
            <div className={`p-6 rounded-2xl border ${getRiskBg(result.risk_score)}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-dark-400 mb-1">Prediction</p>
                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border ${getPredictionBadge(result.prediction)}`}>
                    {result.prediction === "phishing" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {result.prediction.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-dark-400 mb-1">Risk Score</p>
                  <p className={`text-4xl font-bold ${getRiskColor(result.risk_score)}`}>
                    {(result.risk_score * 100).toFixed(1)}%
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                      result.risk_score <= 0.3 ? 'bg-primary-500/20 text-primary-400 border-primary-500/30' :
                      result.risk_score <= 0.6 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                      {result.risk_score <= 0.3 ? "SAFE" : result.risk_score <= 0.6 ? "SUSPICIOUS" : "HIGH RISK"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative h-3 bg-dark-700 rounded-full overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                    result.risk_score >= 0.7 ? "bg-rose-500" : 
                    result.risk_score >= 0.4 ? "bg-amber-500" : "bg-primary-500"
                  }`}
                  style={{ width: `${result.risk_score * 100}%` }}
                />
              </div>
            </div>

            {result.reasons && result.reasons.length > 0 && (
              <div className="glass-card rounded-2xl p-6 mt-6">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  AI Threat Analysis
                </h3>
                <ul className="space-y-3">
                  {result.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-3 text-dark-200 p-3 bg-dark-800/50 rounded-xl border border-white/5">
                      <div className="flex-shrink-0 w-6 h-6 bg-indigo-500/20 border border-indigo-500/40 rounded-lg flex items-center justify-center mt-0.5 text-indigo-400">
                        <span className="text-xs font-bold">{index+1}</span>
                      </div>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.suspicious_keywords && result.suspicious_keywords.length > 0 && (
              <div className="glass-card rounded-2xl p-6 mt-4 border border-amber-500/20 bg-amber-950/10">
                <h3 className="text-base font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Suspicious Keywords Found in URL
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.suspicious_keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    >
                      🚩 {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-dark-900 rounded-xl border border-white/5 p-4">
              <p className="text-sm text-dark-400 mb-1">Analyzed URL</p>
              <p className="text-foreground font-mono text-sm break-all">{result.url}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-800/30 rounded-xl border border-white/5 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground">15+ Features</h3>
          </div>
          <p className="text-sm text-dark-400">Analyzes URL structure, domain age, suspicious keywords, and more</p>
        </div>

        <div className="bg-dark-800/30 rounded-xl border border-white/5 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground">AI Powered</h3>
          </div>
          <p className="text-sm text-dark-400">Machine learning model trained on millions of phishing URLs</p>
        </div>

        <div className="bg-dark-800/30 rounded-xl border border-white/5 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground">Instant Results</h3>
          </div>
          <p className="text-sm text-dark-400">Get detailed analysis with explainable AI in seconds</p>
        </div>
      </div>
    </>
  );
};

export default UrlAnalyzer;
