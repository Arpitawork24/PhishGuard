"use client";
import { motion } from "framer-motion";

export const Loader = ({ step, steps }: { step: number; steps: string[] }) => {
  return (
    <div className="w-full mt-8">
      <motion.div 
        className="p-8 rounded-3xl glass-card relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Background Gradient Sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/10 to-transparent w-[200%]"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        <div className="flex items-center gap-6 mb-8 relative z-10">
          <motion.div 
            className="w-16 h-16 bg-primary-500/10 border border-primary-500/30 rounded-2xl flex items-center justify-center relative"
          >
            <motion.div
              className="absolute inset-0 border-2 border-primary-500 rounded-2xl border-t-transparent border-r-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">AI Security Scan</h3>
            <p className="text-primary-500 font-medium">Advanced threat intelligence processing...</p>
          </div>
        </div>
        
        <div className="space-y-3 relative z-10">
          {steps.map((stepText, i) => {
            const isActive = step === i;
            const isCompleted = step > i;
            const isPending = step < i;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: isPending ? 0.4 : 1,
                  x: isPending ? -10 : 0
                }}
                transition={{ duration: 0.4 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  isActive 
                    ? 'bg-primary-500/10 border-primary-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)] scale-[1.02]' 
                    : isCompleted
                    ? 'bg-dark-800/50 border-white/5'
                    : 'bg-dark-900/30 border-transparent'
                }`}
              >
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  isActive ? 'bg-primary-400 shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse' :
                  isCompleted ? 'bg-primary-700' : 'bg-dark-600'
                }`} />
                <span className={`font-medium flex-1 ${isActive ? 'text-primary-100' : 'text-dark-300'}`}>
                  {stepText}
                </span>
                {isActive && (
                  <motion.div 
                    className="w-5 h-5 border-2 border-dark-600 border-t-primary-400 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                )}
                {isCompleted && (
                  <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
