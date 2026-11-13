import React, { useState, useRef } from 'react';
import { SAMPLE_MESSAGES } from '../data/mockData';
import { analyzeMessage } from '../services/analysisService';
import { AnalysisResult } from '../types';
import { SecurityCore } from '../components/visualizations/SecurityCore';
import { AnalysisAnimation } from '../components/analysis/AnalysisAnimation';
import { ThreatResult } from '../components/analysis/ThreatResult';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/common/GlassCard';
import {
  MessageSquare,
  UploadCloud,
  Trash2,
  Sparkles,
  CornerDownLeft
} from 'lucide-react';

export const MessageAnalyzer: React.FC = () => {
  const [inputText, setInputText] = useState(SAMPLE_MESSAGES[0].text);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePresetSelect = (text: string) => {
    setInputText(text);
    setResult(null);
  };

  const handleStartAnalysis = async () => {
    if (!inputText.trim() || analyzing) return;
    setAnalyzing(true);
    setResult(null);

    try {
      const res = await analyzeMessage(inputText);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
        setResult(null);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 relative">
      {/* Background Ambient Glow */}
      <div className="ambient-gradient absolute top-0 inset-x-0 h-[600px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-mono mb-4">
            <MessageSquare size={13} />
            <span>LINGUISTIC INTENT SCANNER</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
            Analyze Before You Trust
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Detect phishing, scams and suspicious intent using intelligent message analysis.
          </p>
        </div>

        {/* Central Responsive Security Core Canvas */}
        <div className="flex justify-center mb-6">
          <SecurityCore
            state={analyzing ? 'scanning' : result ? 'result' : 'idle'}
            resultClassification={result?.classification || null}
            size="md"
            interactive={!analyzing}
          />
        </div>

        {/* Dynamic State View: Input Form OR Analyzing Sequence OR Result Card */}
        {analyzing ? (
          <div className="my-8">
            <AnalysisAnimation
              targetType="message"
              targetPreview={inputText.slice(0, 70) + '...'}
            />
          </div>
        ) : result ? (
          <div className="my-8 animate-in fade-in zoom-in-95 duration-300">
            <ThreatResult
              result={result}
              onReset={() => {
                setResult(null);
              }}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Preset Scenarios */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                  <Sparkles size={12} className="text-cyan-500 dark:text-cyan-400" />
                  Select Test Scenarios
                </span>
                <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                  Click to pre-fill
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_MESSAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(preset.text)}
                    className="p-2.5 text-left rounded-xl bg-stone-100 hover:bg-stone-200/90 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-stone-200/90 dark:border-white/5 hover:border-cyan-500/40 transition-all text-xs text-stone-800 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white cursor-pointer group shadow-sm dark:shadow-none"
                  >
                    <div className="font-semibold text-stone-900 dark:text-white truncate mb-0.5 group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                      {preset.title.split('(')[0]}
                    </div>
                    <div className="text-[10px] font-mono text-stone-600 dark:text-slate-400 truncate font-medium">
                      {preset.title.includes('(') ? preset.title.split('(')[1].replace(')', '') : 'Sample'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Textarea Container */}
            <GlassCard className="relative p-0 overflow-hidden border-cyan-500/20">
              <div className="p-4 sm:p-5 pb-2">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200/90 dark:border-white/5 text-xs text-stone-700 dark:text-slate-400 font-mono font-semibold">
                  <span>RAW MESSAGE PAYLOAD</span>
                  <span>{inputText.length} characters</span>
                </div>

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste a suspicious message here (email body, SMS alert, chat communication, executive wire note)..."
                  rows={8}
                  className="w-full bg-transparent text-stone-900 dark:text-slate-100 placeholder-stone-500 dark:placeholder-slate-500 text-sm font-sans leading-relaxed resize-y outline-none focus:ring-0 border-none selection:bg-cyan-500/30 font-medium"
                />
              </div>

              {/* Bottom Tool Bar */}
              <div className="bg-stone-100/90 dark:bg-black/30 p-4 sm:p-5 border-t border-stone-200/90 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.eml,.msg"
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<UploadCloud size={15} />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Text / Email File
                  </Button>

                  {inputText && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={14} className="text-stone-600 dark:text-slate-400" />}
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <Button
                    variant="primary"
                    size="lg"
                    magnetic={true}
                    disabled={!inputText.trim()}
                    onClick={handleStartAnalysis}
                    icon={<CornerDownLeft size={16} />}
                  >
                    Analyze Message
                  </Button>
                </div>
              </div>
            </GlassCard>

            {/* Explanatory Architecture Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono text-stone-700 dark:text-slate-400">
              <div className="p-3.5 rounded-xl bg-stone-100/90 dark:bg-slate-900/30 border border-stone-200/90 dark:border-white/5">
                <div className="font-semibold text-stone-900 dark:text-white mb-1">1. Linguistic Intent</div>
                <p className="text-[11px] text-stone-600 dark:text-slate-400 font-medium">Evaluates panic induction, urgency deadlines, and psychological coercion triggers.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-100/90 dark:bg-slate-900/30 border border-stone-200/90 dark:border-white/5">
                <div className="font-semibold text-stone-900 dark:text-white mb-1">2. Hyperlink Extraction</div>
                <p className="text-[11px] text-stone-600 dark:text-slate-400 font-medium">Parses embedded destination URLs, typosquatted brands, and evasive redirects.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-100/90 dark:bg-slate-900/30 border border-stone-200/90 dark:border-white/5">
                <div className="font-semibold text-stone-900 dark:text-white mb-1">3. Executive Impersonation</div>
                <p className="text-[11px] text-stone-600 dark:text-slate-400 font-medium">Cross-checks Business Email Compromise (BEC) and wire authorization patterns.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
