"use client";

import Navbar from "../../components/Navbar";
import UrlAnalyzer from "../../components/UrlAnalyzer";

export default function UrlAnalyzerPage() {
  return (
    <>
      <div className="w-full min-h-screen px-6 md:px-12 lg:px-24 pt-0">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-6 drop-shadow-2xl animate-glow-pulse">
            URL Phishing Detector
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Advanced AI-powered URL analysis. Instant risk assessment with detailed feature explanations.
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-4xl animate-in fade-in-50 duration-1000">
            <UrlAnalyzer />
          </div>
        </div>
      </div>
    </>
  );
}
