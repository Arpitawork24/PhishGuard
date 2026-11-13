"use client";

import EmailAnalyzer from "../components/EmailAnalyzer";

export default function Home() {
  return (
    <div className="w-full px-6 md:px-12 lg:px-24 pt-12 pb-24">
      <div className="text-center mb-16 relative z-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-600 dark:text-primary-400 font-semibold mb-8 animate-fade-in hover:bg-primary-500/20 transition-colors cursor-default">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
          </span>
          Rakshak AI Engine v2.0 Live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black hero-heading mb-8 tracking-tight hero-slide-up">
          Enterprise-Grade <br/>
          <span className="text-gradient animate-glow-pulse">Threat Intelligence</span>
        </h1>
        
        <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed font-medium hero-slide-up" style={{ animationDelay: '0.1s' }}>
          Paste suspicious emails below for instant AI-powered phishing detection, spam analysis, and explainable continuous risk assessment.
        </p>
      </div>

      <div className="flex justify-center mb-24 relative z-20">
        <div className="w-full max-w-5xl hero-slide-up" style={{ animationDelay: '0.2s' }}>
          <EmailAnalyzer />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-24 border-t border-black/5 dark:border-white/5 w-full max-w-7xl mx-auto relative z-20">
        <div className="glass-card rounded-3xl p-10 text-left group hover:-translate-y-2 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-8 border border-primary-500/20 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.27 4.91A3 3 0 0112 14a3 3 0 011.73-.91L21 8M3 8v8a2 2 0 002 2h12a2 2 0 002-2V8m-10 2v4m4-4v4m-8 0h12" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Neural Email Scanning</h3>
          <p className="text-muted leading-relaxed font-medium">
            Advanced NLP detects sophisticated phishing patterns, zero-day spam campaigns, and malicious intent in emails.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-10 text-left group hover:-translate-y-2 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Proprietary AI Models</h3>
          <p className="text-muted leading-relaxed font-medium">
            Trained on millions of phishing emails for 99.8% accuracy with fully explainable AI threat assessments.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-10 text-left group hover:-translate-y-2 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-8 border border-rose-500/20 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Real-Time Analysis</h3>
          <p className="text-muted leading-relaxed font-medium">
            Millisecond latency results with quantitative risk scores, URL extraction, and actionable insights.
          </p>
        </div>
      </div>
    </div>
  );
}
