import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { AnalysisResult } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { GlassCard } from '../common/GlassCard';
import { RiskScore } from './RiskScore';

interface ThreatResultProps {
  result: AnalysisResult;
  onReset?: () => void;
  className?: string;
}

interface Tactic {
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export const ThreatResult: React.FC<ThreatResultProps> = ({
  result,
  onReset,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  /*
   * ---------------------------------------------------------
   * DYNAMIC AI THREAT ANALYSIS
   * ---------------------------------------------------------
   * This section uses the actual result returned by the
   * phishing detection engine.
   *
   * No ML model is modified here.
   */

  const threatAnalysis = useMemo(() => {
    const classification = result.classification;

    const indicatorText = result.indicators
      .map((ind) => `${ind.name} ${ind.description}`)
      .join(' ')
      .toLowerCase();

    const explanation = (result.explanation || '').toLowerCase();

    const combinedText = `${indicatorText} ${explanation}`;

    const hasUrl =
      Boolean(result.metadata?.suspiciousLinksCount) ||
      combinedText.includes('url') ||
      combinedText.includes('link');

    const hasKeywordDetection =
      combinedText.includes('keyword') ||
      combinedText.includes('phishing keyword') ||
      combinedText.includes('spam keyword');

    const hasUrgency =
      combinedText.includes('urgent') ||
      combinedText.includes('urgency') ||
      combinedText.includes('immediate') ||
      combinedText.includes('quick action') ||
      combinedText.includes('pressure');

    const hasCredentialTargeting =
      combinedText.includes('credential') ||
      combinedText.includes('account') ||
      combinedText.includes('login') ||
      combinedText.includes('password') ||
      combinedText.includes('verify');

    const hasPrizeScam =
      combinedText.includes('prize') ||
      combinedText.includes('winner') ||
      combinedText.includes('reward') ||
      combinedText.includes('cash') ||
      combinedText.includes('voucher') ||
      combinedText.includes('free');

    const hasMalware =
      classification === 'MALWARE' ||
      combinedText.includes('malware') ||
      combinedText.includes('payload') ||
      combinedText.includes('c2');

    const hasSuspiciousInfrastructure =
      combinedText.includes('suspicious domain') ||
      combinedText.includes('hosting') ||
      combinedText.includes('tor') ||
      combinedText.includes('anonym') ||
      combinedText.includes('ip address');

    /*
     * ---------------------------------------------------------
     * ATTACK PATTERN
     * ---------------------------------------------------------
     */

    let attackPattern = 'No Threat Pattern Detected';
    let attackDescription =
      'The analysis did not identify a significant malicious communication pattern.';

    if (classification === 'PHISHING') {
      if (hasCredentialTargeting) {
        attackPattern = 'Credential / Account Phishing';
        attackDescription =
          'The message shows characteristics commonly associated with attempts to obtain sensitive information, credentials, or account access.';
      } else if (hasUrl) {
        attackPattern = 'Link-Based Phishing';
        attackDescription =
          'The message contains link-related indicators commonly associated with attempts to redirect users toward suspicious destinations.';
      } else {
        attackPattern = 'Phishing / Social Engineering';
        attackDescription =
          'The message contains multiple signals consistent with a phishing or social-engineering attack.';
      }
    } else if (classification === 'SCAM') {
      if (hasPrizeScam) {
        attackPattern = 'Prize / Reward Scam';
        attackDescription =
          'The message uses an attractive reward, prize, cash benefit, or free offer to encourage the recipient to interact.';
      } else {
        attackPattern = 'Social Engineering Scam';
        attackDescription =
          'The message uses persuasive or manipulative language designed to influence the recipient into taking an unsafe action.';
      }
    } else if (classification === 'MALWARE' || hasMalware) {
      attackPattern = 'Malware Delivery / Payload Threat';
      attackDescription =
        'The detected signals are consistent with an attempt to deliver or activate malicious content.';
    } else if (classification === 'SUSPICIOUS') {
      attackPattern = 'Suspicious Communication Pattern';
      attackDescription =
        'The message contains anomalies that require additional verification before the recipient interacts with it.';
    } else if (classification === 'SAFE') {
      attackPattern = 'No Malicious Pattern Detected';
      attackDescription =
        'The available signals are consistent with a normal communication and no significant malicious indicators were identified.';
    }

    /*
     * ---------------------------------------------------------
     * DETECTED TACTICS
     * ---------------------------------------------------------
     */

    const tactics: Tactic[] = [];

    if (hasUrgency) {
      tactics.push({
        title: 'Urgency / Pressure',
        description:
          'Uses urgent or persuasive language to encourage quick action.',
        severity: classification === 'PHISHING' ? 'high' : 'medium',
      });
    }

    if (hasUrl) {
      tactics.push({
        title: 'Suspicious Link Path',
        description:
          'Uses a suspicious URL or link as part of the detected attack path.',
        severity: 'critical',
      });
    }

    if (hasCredentialTargeting) {
      tactics.push({
        title: 'Credential / Account Targeting',
        description:
          'Attempts to create an opportunity for account, login, or credential compromise.',
        severity: 'high',
      });
    }

    if (hasKeywordDetection) {
      tactics.push({
        title: 'Threat Keyword Signals',
        description:
          'Contains words or phrases associated with phishing, spam, fraud, or social engineering.',
        severity: 'medium',
      });
    }

    if (hasPrizeScam) {
      tactics.push({
        title: 'Reward / Prize Bait',
        description:
          'Uses a reward, prize, cash benefit, or free offer to attract the recipient.',
        severity: 'medium',
      });
    }

    if (hasMalware) {
      tactics.push({
        title: 'Malicious Payload Risk',
        description:
          'Signals indicate possible malicious content or malware delivery behavior.',
        severity: 'critical',
      });
    }

    if (hasSuspiciousInfrastructure) {
      tactics.push({
        title: 'Suspicious Infrastructure',
        description:
          'The analysis detected infrastructure-related characteristics that increase the security risk.',
        severity: 'high',
      });
    }

    /*
     * SAFE RESULT
     */

    if (classification === 'SAFE') {
      tactics.push({
        title: 'No Significant Threat Signals',
        description:
          'No strong phishing, scam, malware, or suspicious communication indicators were identified.',
        severity: 'low',
      });
    }

    /*
     * FALLBACK
     */

    if (tactics.length === 0) {
      if (classification === 'PHISHING') {
        tactics.push({
          title: 'Multiple Phishing Signals',
          description:
            'The detection engine identified multiple characteristics associated with phishing activity.',
          severity: 'high',
        });
      } else if (classification === 'SCAM') {
        tactics.push({
          title: 'Manipulative Communication',
          description:
            'The message contains characteristics associated with fraudulent or deceptive communication.',
          severity: 'medium',
        });
      } else if (classification === 'SUSPICIOUS') {
        tactics.push({
          title: 'Anomalous Signals',
          description:
            'The message contains signals that require additional verification.',
          severity: 'medium',
        });
      }
    }

    /*
     * ---------------------------------------------------------
     * WHY IT MATTERS
     * ---------------------------------------------------------
     */

    let whyItMatters =
      'Continue to verify the source independently before taking action.';

    if (classification === 'PHISHING') {
      if (hasCredentialTargeting && hasUrl) {
        whyItMatters =
          'Following the suspicious link or entering credentials could expose account information, passwords, or other sensitive data.';
      } else if (hasCredentialTargeting) {
        whyItMatters =
          'Responding to the message could expose credentials, account information, or other sensitive data.';
      } else if (hasUrl) {
        whyItMatters =
          'Interacting with the suspicious link could redirect the user to an unsafe destination or phishing page.';
      } else {
        whyItMatters =
          'The detected social-engineering signals could be used to manipulate the recipient into an unsafe action.';
      }
    } else if (classification === 'SCAM') {
      whyItMatters =
        'The offer may be designed to create excitement or urgency and encourage the recipient to reveal information or take an unsafe action.';
    } else if (classification === 'MALWARE') {
      whyItMatters =
        'Interacting with malicious content could compromise the device, data, credentials, or connected systems.';
    } else if (classification === 'SUSPICIOUS') {
      whyItMatters =
        'The detected anomalies are not enough to establish a confirmed attack, but they warrant verification before interaction.';
    } else if (classification === 'SAFE') {
      whyItMatters =
        'No significant malicious indicators were detected, but normal security awareness should still be maintained.';
    }

    return {
      attackPattern,
      attackDescription,
      tactics,
      whyItMatters,
      hasUrl,
      hasKeywordDetection,
      hasUrgency,
      hasCredentialTargeting,
    };
  }, [result]);

  /*
   * ---------------------------------------------------------
   * COLORS / UI HELPERS
   * ---------------------------------------------------------
   */

  const getGlow = () => {
    switch (result.classification) {
      case 'SAFE':
        return 'safe';

      case 'SUSPICIOUS':
      case 'SCAM':
        return 'warning';

      case 'PHISHING':
      case 'MALWARE':
        return 'danger';

      default:
        return 'cyan';
    }
  };

  const getTacticStyles = (severity: Tactic['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          badge:
            'bg-rose-500/20 text-rose-800 dark:text-rose-400 border border-rose-500/40',
          dot: 'bg-rose-500',
        };

      case 'high':
        return {
          badge:
            'bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30',
          dot: 'bg-rose-400',
        };

      case 'medium':
        return {
          badge:
            'bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30',
          dot: 'bg-amber-500',
        };

      default:
        return {
          badge:
            'bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30',
          dot: 'bg-emerald-500',
        };
    }
  };

  /*
   * ---------------------------------------------------------
   * COPY REPORT
   * ---------------------------------------------------------
   */

  const handleCopyReport = () => {
    const report = `PHISHGUARD AI THREAT REPORT
ID: ${result.id}
Classification: ${result.classification}
Risk Score: ${result.riskScore}%
Confidence: ${result.confidence}%

ATTACK PATTERN:
${threatAnalysis.attackPattern}

${threatAnalysis.attackDescription}

DETECTED TACTICS:
${threatAnalysis.tactics
  .map(
    (tactic, index) =>
      `${index + 1}. [${tactic.severity.toUpperCase()}] ${tactic.title}: ${tactic.description}`
  )
  .join('\n')}

WHY IT MATTERS:
${threatAnalysis.whyItMatters}

INDICATORS:
${result.indicators
  .map(
    (ind) =>
      `- [${ind.severity.toUpperCase()}] ${ind.name}: ${ind.description}`
  )
  .join('\n')}

EXPLANATION:
${result.explanation}

RECOMMENDED ACTION:
${result.recommendation}
`;

    navigator.clipboard.writeText(report);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  /*
   * ---------------------------------------------------------
   * DOWNLOAD REPORT
   * ---------------------------------------------------------
   */

  const handleDownloadReport = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            ...result,
            aiThreatAnalysis: {
              attackPattern: threatAnalysis.attackPattern,
              attackDescription: threatAnalysis.attackDescription,
              tactics: threatAnalysis.tactics,
              whyItMatters: threatAnalysis.whyItMatters,
            },
          },
          null,
          2
        )
      );

    const downloadAnchor = document.createElement('a');

    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `phishguard-report-${result.id}.json`
    );

    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  /*
   * ---------------------------------------------------------
   * MAIN UI
   * ---------------------------------------------------------
   */

  return (
    <div className={`w-full max-w-3xl mx-auto space-y-6 ${className}`}>
      {/* =====================================================
          PRIMARY RESULT OVERVIEW
      ====================================================== */}

      <GlassCard glow={getGlow()} className="border-t-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-stone-200/90 dark:border-white/10">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-2">
              <span className="font-mono text-xs font-semibold text-stone-700 dark:text-slate-400">
                REPORT #{result.id}
              </span>

              <span className="text-stone-400 dark:text-slate-600">
                •
              </span>

              <span className="text-xs font-medium text-stone-700 dark:text-slate-400">
                {result.timestamp}
              </span>
            </div>

            <div className="mb-3">
              <Badge
                classification={result.classification}
                size="lg"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white mb-2">
              {result.classification === 'SAFE'
                ? 'Verified Legitimate Communication'
                : result.classification === 'PHISHING'
                ? 'High-Severity Phishing Attack'
                : result.classification === 'SCAM'
                ? 'Social Engineering Scam'
                : result.classification === 'MALWARE'
                ? 'Malicious Payload Detected'
                : 'Suspicious Anomalies Found'}
            </h2>

            <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed max-w-md font-normal">
              {result.explanation}
            </p>
          </div>

          {/* Risk Score */}
          <div className="shrink-0 p-3.5 rounded-2xl bg-stone-100/90 dark:bg-black/30 border border-stone-200/90 dark:border-white/5 shadow-inner dark:shadow-none">
            <RiskScore
              score={result.riskScore}
              confidence={result.confidence}
              classification={result.classification}
              size="lg"
            />
          </div>
        </div>

        {/* =====================================================
            IDENTIFIED INDICATORS
        ====================================================== */}

        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert
                size={17}
                className="text-cyan-700 dark:text-cyan-400"
              />

              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-slate-200">
                Identified Indicators ({result.indicators.length})
              </h3>
            </div>

            <span className="text-xs text-stone-600 dark:text-slate-400 font-mono font-medium">
              Severity Assessed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.indicators.map((ind) => (
              <div
                key={ind.id}
                className="p-3.5 rounded-xl bg-stone-100/90 dark:bg-slate-900/50 border border-stone-200/90 dark:border-white/5 hover:border-stone-300 dark:hover:border-white/15 transition-all text-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-semibold text-stone-900 dark:text-white tracking-wide">
                    {ind.name}
                  </span>

                  <span
                    className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded font-semibold ${
                      ind.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-800 dark:text-rose-400 border border-rose-500/40'
                        : ind.severity === 'high'
                        ? 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30'
                        : ind.severity === 'medium'
                        ? 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {ind.severity}
                  </span>
                </div>

                <p className="text-stone-700 dark:text-slate-400 text-[11px] leading-relaxed">
                  {ind.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================
            AI THREAT BREAKDOWN
        ====================================================== */}

        <div className="mt-6 p-5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-400/5 border border-cyan-500/20 dark:border-cyan-400/20">
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <ShieldAlert
                size={17}
                className="text-cyan-600 dark:text-cyan-400"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white">
                AI Threat Breakdown
              </h3>

              <p className="text-[11px] text-stone-600 dark:text-slate-400">
                Evidence behind the security decision
              </p>
            </div>
          </div>

          {/* =================================================
              DETECTION EVIDENCE
          ================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <div className="p-3 rounded-xl bg-stone-100/80 dark:bg-slate-900/60 border border-stone-200 dark:border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-slate-500 mb-1">
                ML Model
              </div>

              <div className="text-lg font-bold text-cyan-700 dark:text-cyan-400">
                {result.confidence}%
              </div>

              <div className="text-[10px] text-stone-600 dark:text-slate-400">
                model confidence
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-100/80 dark:bg-slate-900/60 border border-stone-200 dark:border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-slate-500 mb-1">
                Risk Score
              </div>

              <div
                className={`text-lg font-bold ${
                  result.riskScore >= 65
                    ? 'text-rose-600 dark:text-rose-400'
                    : result.riskScore >= 35
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {result.riskScore}%
              </div>

              <div className="text-[10px] text-stone-600 dark:text-slate-400">
                overall threat level
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-100/80 dark:bg-slate-900/60 border border-stone-200 dark:border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-slate-500 mb-1">
                Indicators
              </div>

              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {result.indicators.length}
              </div>

              <div className="text-[10px] text-stone-600 dark:text-slate-400">
                signals detected
              </div>
            </div>
          </div>

          {/* =================================================
              ATTACK PATTERN
          ================================================== */}

          <div className="mb-5">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-cyan-600 dark:text-cyan-400 mb-3">
              Attack Pattern
            </div>

            <div className="p-4 rounded-xl bg-stone-100/80 dark:bg-slate-900/60 border border-stone-200 dark:border-white/5">
              <div className="text-base font-bold text-stone-900 dark:text-white mb-1.5">
                {threatAnalysis.attackPattern}
              </div>

              <p className="text-xs leading-relaxed text-stone-600 dark:text-slate-400">
                {threatAnalysis.attackDescription}
              </p>
            </div>
          </div>

          {/* =================================================
              DETECTED TACTICS
          ================================================== */}

          <div className="mb-5">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400 mb-3">
              Detected Tactics
            </div>

            <div className="space-y-2">
              {threatAnalysis.tactics.map((tactic, index) => {
                const styles = getTacticStyles(tactic.severity);

                return (
                  <div
                    key={`${tactic.title}-${index}`}
                    className="flex items-start gap-3 p-3 rounded-xl bg-stone-100/70 dark:bg-slate-900/50 border border-stone-200 dark:border-white/5"
                  >
                    <div className="shrink-0 mt-1">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${styles.badge}`}
                      >
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-xs text-stone-900 dark:text-slate-200">
                          {tactic.title}
                        </span>

                        <span
                          className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded font-semibold ${styles.badge}`}
                        >
                          {tactic.severity}
                        </span>
                      </div>

                      <p className="text-[11px] leading-relaxed text-stone-600 dark:text-slate-400">
                        {tactic.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================
              WHY IT MATTERS
          ================================================== */}

          <div className="mb-5">
            <div
              className={`text-[10px] uppercase tracking-wider font-semibold mb-3 ${
                result.classification === 'SAFE'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              Why It Matters
            </div>

            <div
              className={`p-4 rounded-xl border ${
                result.classification === 'SAFE'
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-rose-500/5 border-rose-500/20'
              }`}
            >
              <p className="text-xs leading-relaxed text-stone-700 dark:text-slate-300">
                {threatAnalysis.whyItMatters}
              </p>
            </div>
          </div>

          {/* =================================================
              SECURITY DECISION FLOW
          ================================================== */}

          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-600 dark:text-slate-400 mb-3">
              Security Decision Flow
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
              <span className="px-3 py-2 rounded-lg bg-stone-200 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border border-stone-300 dark:border-white/10">
                MESSAGE
              </span>

              <span className="text-cyan-500">→</span>

              <span className="px-3 py-2 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
                ML SIGNALS
              </span>

              <span className="text-cyan-500">→</span>

              <span className="px-3 py-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                RULE ANALYSIS
              </span>

              {threatAnalysis.hasUrl && (
                <>
                  <span className="text-cyan-500">→</span>

                  <span className="px-3 py-2 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
                    URL ANALYSIS
                  </span>
                </>
              )}

              <span className="text-cyan-500">→</span>

              <span className="px-3 py-2 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                THREAT ASSESSMENT
              </span>

              <span className="text-cyan-500">→</span>

              <span
                className={`px-3 py-2 rounded-lg font-bold border ${
                  result.classification === 'SAFE'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                    : result.classification === 'SUSPICIOUS'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                    : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                }`}
              >
                {result.classification}
              </span>
            </div>
          </div>

          {/* =================================================
              RISK CALCULATION
          ================================================== */}

          <div className="mt-5 pt-4 border-t border-stone-200/50 dark:border-white/5">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
              <span className="text-stone-500 dark:text-slate-500">
                RISK CALCULATION:
              </span>

              <span className="text-cyan-600 dark:text-cyan-400">
                ML 70%
              </span>

              <span className="text-stone-400">
                +
              </span>

              <span className="text-amber-600 dark:text-amber-400">
                RULES 15%
              </span>

              <span className="text-stone-400">
                +
              </span>

              <span className="text-purple-600 dark:text-purple-400">
                URL 15%
              </span>

              <span className="text-stone-400">
                =
              </span>

              <span
                className={`font-bold ${
                  result.riskScore >= 65
                    ? 'text-rose-600 dark:text-rose-400'
                    : result.riskScore >= 35
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                FINAL RISK {result.riskScore}%
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            RECOMMENDED COUNTERMEASURE
        ====================================================== */}

        <div
          className={`mt-6 p-4 rounded-xl border flex items-start gap-3.5 ${
            result.classification === 'SAFE'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-950 dark:text-emerald-200'
              : result.classification === 'SUSPICIOUS'
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-950 dark:text-amber-200'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-950 dark:text-rose-200'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {result.classification === 'SAFE' ? (
              <ShieldCheck
                size={19}
                className="text-emerald-700 dark:text-emerald-400"
              />
            ) : (
              <AlertTriangle
                size={19}
                className="text-rose-700 dark:text-rose-400"
              />
            )}
          </div>

          <div>
            <div className="font-bold text-xs tracking-wider uppercase mb-1">
              Recommended Countermeasure
            </div>

            <p className="text-xs sm:text-sm leading-relaxed opacity-95 font-medium">
              {result.recommendation}
            </p>
          </div>
        </div>

        {/* =====================================================
            CONTEXT METADATA
        ====================================================== */}

        {result.metadata && (
          <div className="mt-5 pt-4 border-t border-stone-200/90 dark:border-white/5 flex flex-wrap items-center gap-4 text-xs font-mono text-stone-700 dark:text-slate-400">
            {result.metadata.spoofedBrand && (
              <div>
                <span className="text-stone-500 dark:text-slate-500">
                  Targeted Brand:{' '}
                </span>

                <span className="text-stone-900 dark:text-white font-semibold">
                  {result.metadata.spoofedBrand}
                </span>
              </div>
            )}

            {result.metadata.urgencyLevel && (
              <div>
                <span className="text-stone-500 dark:text-slate-500">
                  Urgency Velocity:{' '}
                </span>

                <span className="text-stone-900 dark:text-amber-400 font-semibold">
                  {result.metadata.urgencyLevel}
                </span>
              </div>
            )}

            {result.metadata.senderReputation && (
              <div>
                <span className="text-stone-500 dark:text-slate-500">
                  Sender Origin:{' '}
                </span>

                <span className="text-stone-900 dark:text-white font-semibold">
                  {result.metadata.senderReputation}
                </span>
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            ACTIONS
        ====================================================== */}

        <div className="mt-6 pt-5 border-t border-stone-200/90 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={
                copied ? (
                  <Check
                    size={14}
                    className="text-emerald-500 dark:text-emerald-400"
                  />
                ) : (
                  <Copy size={14} />
                )
              }
              onClick={handleCopyReport}
            >
              {copied ? 'Copied to Clipboard' : 'Copy Report'}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={<Download size={14} />}
              onClick={handleDownloadReport}
            >
              Export JSON
            </Button>
          </div>

          {onReset && (
            <Button
              variant="primary"
              size="sm"
              icon={<RotateCcw size={14} />}
              onClick={onReset}
            >
              Analyze Another Target
            </Button>
          )}
        </div>
      </GlassCard>
    </div>
  );
};