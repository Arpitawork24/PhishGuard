"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EmailInputCardProps {
  emailText: string;
  setEmailText: (val: string) => void;
  disabled: boolean;
}

export const EmailInputCard = ({ emailText, setEmailText, disabled }: EmailInputCardProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handlePasteDemo = () => {
    setEmailText(
      "URGENT: Your account has been suspended due to suspicious activity. Click here immediately to verify your identity and restore access: http://secure-verify-update.com/login"
    );
  };

  return (
    <div className="w-full relative group">
      {/* Animated glow effect behind the text area */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"
          />
        )}
      </AnimatePresence>
      
      <div className="relative glass-card rounded-3xl overflow-hidden bg-dark-900/50">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-dark-800/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-primary-500" />
            <span className="ml-2 text-dark-300 text-sm font-medium font-mono">email_content.txt</span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePasteDemo}
              className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors"
              disabled={disabled}
            >
              Load Example
            </button>
            <button
              type="button"
              onClick={() => setEmailText("")}
              className="text-xs font-semibold text-dark-400 hover:text-foreground transition-colors"
              disabled={disabled || !emailText}
            >
              Clear
            </button>
          </div>
        </div>
        
        <textarea
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Paste the suspicious email content here..."
          rows={12}
          className="w-full p-6 bg-transparent text-foreground placeholder-dark-600 resize-none outline-none focus:ring-0 text-base md:text-lg font-mono leading-relaxed custom-scrollbar"
          disabled={disabled}
        />
      </div>
    </div>
  );
};
