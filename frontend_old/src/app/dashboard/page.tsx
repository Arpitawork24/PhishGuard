"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ScanRecord {
  id: string;
  type: "email" | "url";
  input: string;
  prediction: "phishing" | "spam" | "safe";
  risk_score: number;
  timestamp: Date;
}

// Simulated recent scans for demo
const DEMO_SCANS: ScanRecord[] = [
  { id: "1", type: "email", input: "URGENT: Verify your PayPal account now...", prediction: "phishing", risk_score: 0.94, timestamp: new Date(Date.now() - 1000 * 60 * 3) },
  { id: "2", type: "url", input: "https://secure-banking-login.phish.com/verify", prediction: "phishing", risk_score: 0.89, timestamp: new Date(Date.now() - 1000 * 60 * 15) },
  { id: "3", type: "email", input: "Meeting reminder for tomorrow at 10am...", prediction: "safe", risk_score: 0.04, timestamp: new Date(Date.now() - 1000 * 60 * 32) },
  { id: "4", type: "email", input: "50% OFF SALE! Limited time offer click NOW...", prediction: "spam", risk_score: 0.71, timestamp: new Date(Date.now() - 1000 * 60 * 58) },
  { id: "5", type: "url", input: "https://google.com/search?q=rakshak+ai", prediction: "safe", risk_score: 0.02, timestamp: new Date(Date.now() - 1000 * 60 * 90) },
];

const formatTimeAgo = (date: Date) => {
  const diff = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
};

const RiskBadge = ({ prediction, score }: { prediction: string; score: number }) => {
  const cfg = {
    phishing: { bg: "bg-rose-500/10 border-rose-500/30", text: "text-rose-600 dark:text-rose-400", dot: "bg-rose-500", label: "Phishing" },
    spam:     { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500", label: "Spam" },
    safe:     { bg: "bg-primary-500/10 border-primary-500/30", text: "text-primary-600 dark:text-primary-400", dot: "bg-primary-500", label: "Safe" },
  }[prediction] ?? { bg: "", text: "", dot: "bg-gray-400", label: prediction };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label} · {Math.round(score * 100)}%
    </span>
  );
};

export default function DashboardPage() {
  const [filter, setFilter] = useState<"all" | "phishing" | "spam" | "safe">("all");

  const stats = {
    total: DEMO_SCANS.length,
    threats: DEMO_SCANS.filter(s => s.prediction !== "safe").length,
    safe: DEMO_SCANS.filter(s => s.prediction === "safe").length,
    avgRisk: Math.round((DEMO_SCANS.reduce((a, s) => a + s.risk_score, 0) / DEMO_SCANS.length) * 100),
  };

  const filtered = filter === "all" ? DEMO_SCANS : DEMO_SCANS.filter(s => s.prediction === filter);

  return (
    <div className="w-full px-6 md:px-12 lg:px-24 py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-black hero-heading mb-3">
          Security <span className="text-gradient">Dashboard</span>
        </h1>
        <p className="text-muted text-lg">Overview of your recent threat intelligence scans.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Scans", value: stats.total, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10" },
          { label: "Threats Found", value: stats.threats, icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10" },
          { label: "Safe Content", value: stats.safe, icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: "text-primary-600 dark:text-primary-400", bg: "bg-primary-500/10" },
          { label: "Avg Risk Score", value: `${stats.avgRisk}%`, icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${stat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>
            <div className="text-3xl font-black text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Threat Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="glass-card rounded-2xl p-6 col-span-1">
          <h2 className="text-lg font-bold text-foreground mb-5">Threat Breakdown</h2>
          <div className="space-y-4">
            {[
              { label: "Phishing", count: DEMO_SCANS.filter(s => s.prediction === "phishing").length, color: "bg-rose-500", pct: Math.round(DEMO_SCANS.filter(s => s.prediction === "phishing").length / stats.total * 100) },
              { label: "Spam", count: DEMO_SCANS.filter(s => s.prediction === "spam").length, color: "bg-amber-500", pct: Math.round(DEMO_SCANS.filter(s => s.prediction === "spam").length / stats.total * 100) },
              { label: "Safe", count: DEMO_SCANS.filter(s => s.prediction === "safe").length, color: "bg-primary-500", pct: Math.round(DEMO_SCANS.filter(s => s.prediction === "safe").length / stats.total * 100) },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm font-semibold mb-1.5">
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-muted">{item.count} · {item.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 col-span-1 lg:col-span-2 flex flex-col">
          <h2 className="text-lg font-bold text-foreground mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <Link href="/"
              className="flex items-center gap-4 p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 hover:bg-primary-500/10 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.27 4.91A3 3 0 0112 14a3 3 0 011.73-.91L21 8M3 8v8a2 2 0 002 2h12a2 2 0 002-2V8" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Analyze Email</div>
                <div className="text-xs text-muted">Paste & scan email content</div>
              </div>
            </Link>
            <Link href="/url-analyzer"
              className="flex items-center gap-4 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Analyze URL</div>
                <div className="text-xs text-muted">Check link for phishing</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-black/5 dark:border-white/5">
          <h2 className="text-lg font-bold text-foreground">Recent Scans</h2>
          <div className="flex gap-2 flex-wrap">
            {(["all", "phishing", "spam", "safe"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  filter === f
                    ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                    : "text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-black/5 dark:divide-white/5">
          <AnimatePresence mode="popLayout">
            {filtered.map((scan, i) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 hover:bg-black/2 dark:hover:bg-white/2 transition-colors group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${scan.type === 'email' ? 'bg-indigo-500/10' : 'bg-primary-500/10'}`}>
                  {scan.type === 'email' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.27 4.91A3 3 0 0112 14a3 3 0 011.73-.91L21 8M3 8v8a2 2 0 002 2h12a2 2 0 002-2V8" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{scan.input}</p>
                  <p className="text-xs text-muted capitalize">{scan.type} scan · {formatTimeAgo(scan.timestamp)}</p>
                </div>
                <RiskBadge prediction={scan.prediction} score={scan.risk_score} />
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted">No scans found for this filter.</div>
          )}
        </div>
      </div>
    </div>
  );
}
