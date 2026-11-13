"use client";
import { motion } from "framer-motion";

interface AnalyzeButtonProps {
  loading: boolean;
  disabled: boolean;
}

export const AnalyzeButton = ({ loading, disabled }: AnalyzeButtonProps) => {
  return (
    <motion.button
      type="submit"
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02, translateY: -2 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`relative w-full py-5 px-8 rounded-2xl font-bold text-lg shadow-xl overflow-hidden group transition-all duration-300 ${
        disabled 
          ? "bg-dark-800 text-dark-500 cursor-not-allowed border border-white/5" 
          : "bg-primary-600 text-white hover:bg-primary-500 border border-primary-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
      }`}
    >
      {/* Background Gradient Animation on Hover */}
      {!disabled && !loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 via-emerald-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
      )}
      
      {/* Shimmer Effect */}
      {!disabled && !loading && (
        <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_2s_infinite] z-0" />
      )}

      <div className="relative z-10 flex items-center justify-center gap-3">
        {loading ? (
           <>
             <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
             </svg>
             <span className="tracking-wide">Analyzing Email Content...</span>
           </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
            <span className="tracking-wide uppercase">Analyze for Phishing & Spam</span>
          </>
        )}
      </div>
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(150%);
          }
        }
      `}</style>
    </motion.button>
  );
};
