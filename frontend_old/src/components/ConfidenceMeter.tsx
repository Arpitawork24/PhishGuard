"use client";
import { motion } from "framer-motion";

interface ConfidenceMeterProps {
  score: number; // 0 to 1
  prediction: "phishing" | "spam" | "safe";
}

export const ConfidenceMeter = ({ score, prediction }: ConfidenceMeterProps) => {
  const percentage = Math.round(score * 100);
  
  const getColors = () => {
    if (prediction === "safe") return "from-primary-400 to-primary-600 shadow-[0_0_20px_rgba(34,197,94,0.4)]";
    if (prediction === "spam") return "from-yellow-400 to-amber-600 shadow-[0_0_20px_rgba(250,204,21,0.4)]";
    return "from-rose-500 to-red-600 shadow-[0_0_20px_rgba(244,63,94,0.4)]";
  };

  const getLabelColor = () => {
    if (prediction === "safe") return "text-primary-400";
    if (prediction === "spam") return "text-yellow-400";
    return "text-rose-500";
  };

  return (
    <div className="flex flex-col items-center sm:items-end">
      <p className="text-sm font-semibold text-dark-300 mb-2 uppercase tracking-widest">
        Risk Score
      </p>
      
      <div className={`text-6xl font-black mb-3 ${getLabelColor()}`}>
        {percentage}%
      </div>

      <div className="w-full sm:w-64 h-3 bg-dark-800 rounded-full overflow-hidden border border-white/5">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${getColors()}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
      
      <div className="flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-dark-800 border border-white/10">
        <div className={`w-2 h-2 rounded-full animate-pulse ${
          prediction === 'safe' ? 'bg-primary-500' :
          prediction === 'spam' ? 'bg-amber-500' : 'bg-rose-500'
        }`} />
        <span className={`text-xs font-bold uppercase tracking-wide ${getLabelColor()}`}>
          {prediction === 'safe' ? 'Low Risk' : prediction === 'spam' ? 'Suspicious' : 'High Risk'}
        </span>
      </div>
    </div>
  );
};
