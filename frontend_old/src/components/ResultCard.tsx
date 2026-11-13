"use client";
import { motion } from "framer-motion";
import { ConfidenceMeter } from "./ConfidenceMeter";

interface EmailResult {
  prediction: "phishing" | "spam" | "safe";
  risk_score: number;
  suspicious_urls: string[];
  reasons: string[];
  suspicious_keywords?: string[];
}

interface ResultCardProps {
  result: EmailResult;
  onClear: () => void;
}

export const ResultCard = ({ result, onClear }: ResultCardProps) => {
  const getCardStyle = () => {
    if (result.prediction === "safe") return "border-primary-500/30 bg-primary-900/10 shadow-[0_0_50px_rgba(34,197,94,0.1)]";
    if (result.prediction === "spam") return "border-amber-500/30 bg-amber-900/10 shadow-[0_0_50px_rgba(250,204,21,0.1)]";
    return "border-rose-500/30 bg-rose-900/10 shadow-[0_0_50px_rgba(244,63,94,0.1)]";
  };

  const getLabelColor = () => {
    if (result.prediction === "safe") return "text-primary-400 bg-primary-500/20";
    if (result.prediction === "spam") return "text-amber-400 bg-amber-500/20";
    return "text-rose-400 bg-rose-500/20";
  };
  
  const getIcon = () => {
    if (result.prediction === "safe") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${result.prediction === 'spam' ? 'text-amber-400' : 'text-rose-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="w-full space-y-6 mt-12"
    >
      <div className={`glass-card rounded-3xl p-8 lg:p-12 border-2 ${getCardStyle()}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          
          <div className="flex items-start gap-6">
            <div className={`p-4 rounded-2xl ${
              result.prediction === 'safe' ? 'bg-primary-500/10' : 
              result.prediction === 'spam' ? 'bg-amber-500/10' : 'bg-rose-500/10'
            }`}>
              {getIcon()}
            </div>
            
            <div>
              <p className="text-sm font-semibold text-dark-300 mb-2 uppercase tracking-widest">
                Analysis Status
              </p>
              <div className={`inline-flex items-center px-6 py-2 rounded-xl text-3xl font-black tracking-wide capitalize ${getLabelColor()}`}>
                {result.prediction}
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <ConfidenceMeter score={result.risk_score} prediction={result.prediction} />
        </div>
      </div>

      {result.reasons?.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-8 border border-white/5"
        >
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            AI Assessment Notes
          </h3>
          <ul className="grid gap-3">
            {result.reasons.map((reason, i) => (
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 hover:bg-amber-500/10 transition-colors"
              >
                {/* Warning icon */}
                <div className="mt-0.5 flex-shrink-0 w-5 h-5 text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                {/* Reason text — rendered exactly as returned by API, preserving emojis */}
                <span className="text-foreground leading-relaxed text-sm">{reason}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {result.suspicious_keywords && result.suspicious_keywords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-3xl p-8 border border-amber-500/20 bg-amber-950/10"
        >
          <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Suspicious Keywords Found in Email
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.suspicious_keywords.map((kw, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-rose-500/20 text-rose-300 border border-rose-500/40"
              >
                🚩 {kw}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {result.suspicious_urls?.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-3xl p-8 border border-rose-500/20 bg-rose-950/10"
        >
          <h3 className="text-xl font-bold text-rose-400 mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Suspicious URLs Detected ({result.suspicious_urls.length})
          </h3>
          <div className="grid gap-3">
            {result.suspicious_urls.map((url, i) => (
              <div key={i} className="p-4 rounded-xl bg-dark-900 border border-rose-500/20 hover:border-rose-500/40 transition-colors group">
                <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full overflow-hidden text-rose-300/80 group-hover:text-rose-300 font-mono text-sm break-all">
                  {url}
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={onClear}
        className="w-full py-4 text-dark-300 hover:text-foreground font-semibold rounded-2xl bg-dark-800/50 hover:bg-dark-800 border border-white/5 hover:border-white/10 transition-all flex items-center justify-center gap-2 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Analyze Another Email
      </motion.button>
    </motion.div>
  );
};
