import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CodeMission, PlayerStats, LanguageId } from '../types/game';
import { LANGUAGE_CATALOG } from '../data/languages';
import { sounds } from '../utils/audio';
import { Terminal, Play, RotateCcw, Lightbulb, CheckCircle2, AlertTriangle, X, Sparkles, ChevronDown } from 'lucide-react';

interface CodePlaygroundModalProps {
  mission: CodeMission;
  player: PlayerStats;
  onClose: () => void;
  onComplete: (missionId: string, xp: number, credits: number) => void;
  onSwitchLanguage?: (langId: LanguageId) => void;
}

export const CodePlaygroundModal: React.FC<CodePlaygroundModalProps> = ({
  mission,
  player,
  onClose,
  onComplete,
  onSwitchLanguage,
}) => {
  const [code, setCode] = useState(mission.starterCode);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [showHintIndex, setShowHintIndex] = useState(0);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[] | null>(null);
  const [byteComment, setByteComment] = useState<{ mood: 'roast' | 'success' | 'hint'; text: string }>({
    mood: 'hint',
    text: mission.hints[0] || 'Analyze the code logic carefully. Look for missing syntax or logic bugs!',
  });
  const [isCompleted, setIsCompleted] = useState(false);

  // Deterministic execution engine for Python, Bash, SQL, Network, Cyberdefense
  const handleRunCode = () => {
    setIsRunning(true);
    sounds.playTerminalClick();

    setTimeout(() => {
      setIsRunning(false);
      let simOutput = '';
      let passed = false;
      const lowerCode = code.toLowerCase();

      // Custom deterministic logic per mission ID
      if (mission.id === 'neon-intro-vars') {
        const hasBattery = /battery\s*=\s*100/.test(code);
        const hasStatus = /status\s*=\s*["']ONLINE["']/i.test(code);
        if (hasBattery && hasStatus) {
          simOutput = 'SENTRY-7 status: ONLINE, battery: 100%';
          passed = true;
        } else {
          simOutput = `[COMPILE ERROR] Memory Partition Mismatch.\nBattery must be integer 100, status must be string "ONLINE".`;
        }
      } else if (mission.id === 'neon-gate-logic') {
        const hasIf = /if\s+clearance_level\s*>=\s*3\s*:/i.test(code);
        const hasGranted = /print\s*\(\s*["']ACCESS GRANTED["']\s*\)/i.test(code);
        if (hasIf && hasGranted) {
          simOutput = 'ACCESS GRANTED';
          passed = true;
        } else {
          simOutput = '[GATE SECURITY] Condition test failed. Output was ACCESS DENIED.';
        }
      } else if (mission.id === 'neon-boss-semicolon') {
        const hasClosedQuote = /charge_level\s*=\s*["']MAXIMUM["']/.test(code);
        const hasColon = /if\s+power\s*>\s*50\s*:/.test(code);
        if (hasClosedQuote && hasColon) {
          simOutput = 'CRITICAL HIT on SEMICOLON MONSTER! Laser power: 99kW';
          passed = true;
        } else {
          simOutput = 'SyntaxError: EOL while scanning string literal (missing quote or missing colon on if statement).';
        }
      } else if (mission.id === 'python-delivery-bot') {
        const hasLoop = /for\s+\w+\s+in\s+cargo_manifest\s*:/i.test(code);
        const hasPrint = /print\s*\(.*item.*\)/i.test(code);
        if (hasLoop && hasPrint) {
          simOutput = 'Delivering: Quantum Core\nDelivering: Neural Patch\nDelivering: Cooling Gel';
          passed = true;
        } else {
          simOutput = '[DRONE ERR] Loop syntax incomplete or missing iteration block.';
        }
      } else if (mission.id === 'python-boss-loopzilla') {
        const hasDecrement = /rampaging_charge\s*-=\s*1|rampaging_charge\s*=\s*rampaging_charge\s*-\s*1/.test(code);
        if (hasDecrement) {
          simOutput = 'Depleting rage field: 3\nDepleting rage field: 2\nDepleting rage field: 1\nLoopzilla calm! Infinite loop terminated.';
          passed = true;
        } else {
          simOutput = '[WATCHDOG TRIGGERED] Infinite loop detected! CPU temperature 104°C! Emergency break.';
        }
      } else if (mission.id === 'linux-ls-grep') {
        const hasGrep = /grep\s+["']FAILED["']\s+auth\.log/i.test(code);
        if (hasGrep) {
          simOutput = '[AUTH_LOG] 23:14:02 FAILED login for user: admin from 10.0.99.12\n[AUTH_LOG] 23:14:05 FAILED login for user: root from 10.0.99.12';
          passed = true;
        } else {
          simOutput = 'bash: command not matched. Remember syntax: grep "FAILED" auth.log';
        }
      } else if (mission.id === 'linux-boss-root-rogue') {
        const hasKill = /kill\s+-9\s+7331/.test(code);
        if (hasKill) {
          simOutput = '[KERNEL] Process 7331 (null_rogue_daemon) killed. Signal 9 acknowledged.';
          passed = true;
        } else {
          simOutput = 'Daemon still executing on PID 7331. Use kill -9 7331!';
        }
      } else if (mission.id === 'cyber-phishing-drill') {
        const hasPhishing = /result\s*=\s*["']PHISHING["']/i.test(code);
        if (hasPhishing) {
          simOutput = 'VERDICT: PHISHING - SUSPICIOUS_DOMAIN_AND_URGENCY';
          passed = true;
        } else {
          simOutput = 'Verdict incorrect. Look at the spoofed sender address and artificial urgency!';
        }
      } else if (mission.id === 'cyber-boss-hydra') {
        const hasReject = /dmarc_policy\s*=\s*["']p=reject["']/i.test(code);
        const hasMFA = /enforce_mfa\s*=\s*True/i.test(code);
        if (hasReject && hasMFA) {
          simOutput = 'SHIELD ACTIVATED: DMARC Reject + MFA Enforced. Hydra defeated!';
          passed = true;
        } else {
          simOutput = 'Policy too lenient. The Hydra slipped spoofed packets through!';
        }
      } else if (mission.id === 'network-routing-flow') {
        const has443 = /443\s*:\s*["']ALLOW["']/i.test(code);
        const has4444 = /4444\s*:\s*["']DENY["']/i.test(code);
        if (has443 && has4444) {
          simOutput = 'PORT 443: ALLOW\nPORT 4444: DENY';
          passed = true;
        } else {
          simOutput = 'Firewall misconfigured. Port 4444 must be DENY!';
        }
      } else if (mission.id === 'sql-injection-defense') {
        const hasParam = /\?/.test(code) && /where\s+username\s*=/i.test(code);
        if (hasParam) {
          simOutput = '[DB_RESULT] Query executed safely via PreparedStatement with bound parameters.';
          passed = true;
        } else {
          simOutput = '[DB ALERT] Unescaped user input detected! SQL Injection vulnerable.';
        }
      } else if (mission.id === 'dev-boss-null') {
        const hasExcept = /except\s+ZeroDivisionError\s*:/i.test(code);
        if (hasExcept) {
          simOutput = 'EXCEPTION HANDLED: Universal Kernel Patched!\nNULL has been cleansed. Cyberverse is SAFE!';
          passed = true;
        } else {
          simOutput = 'ZeroDivisionError: division by zero. Kernel collapsed into singularity!';
        }
      } else {
        // Fallback generic check
        if (code.includes(mission.solutionSnippet)) {
          simOutput = mission.testCases[0]?.expectedOutput || 'Execution successful.';
          passed = true;
        } else {
          simOutput = 'Execution finished with mismatches against expected test case.';
        }
      }

      setOutput(simOutput);

      if (passed) {
        sounds.playSuccessFanfare();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f3ff', '#ff007f', '#00ff66', '#ffaa00'],
        });
        setTestResults([{ passed: true, message: 'All test assertions passed successfully!' }]);
        setByteComment({
          mood: 'success',
          text: mission.byteSuccess,
        });
        setIsCompleted(true);
      } else {
        sounds.playGlitchBuzz();
        setTestResults([{ passed: false, message: 'Output did not match expected criteria.' }]);
        setByteComment({
          mood: 'roast',
          text: mission.byteRoast,
        });
      }
    }, 400);
  };

  const handleReset = () => {
    sounds.playTerminalClick();
    setCode(mission.starterCode);
    setOutput('');
    setTestResults(null);
    setIsCompleted(false);
    setByteComment({
      mood: 'hint',
      text: mission.hints[0] || 'Code reset to initial state.',
    });
  };

  const cycleHint = () => {
    sounds.playByteChirp();
    const nextIdx = (showHintIndex + 1) % mission.hints.length;
    setShowHintIndex(nextIdx);
    setByteComment({
      mood: 'hint',
      text: mission.hints[nextIdx],
    });
  };

  const handleClaimReward = () => {
    sounds.playSuccessFanfare();
    onComplete(mission.id, mission.xpReward, mission.creditsReward);
    onClose();
  };

  const lines = code.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#080d1e] border-2 border-[#00f3ff] rounded-2xl shadow-[0_0_40px_rgba(0,243,255,0.3)] overflow-hidden font-code">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0d162f] border-b border-[#1e294f]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00f3ff]" />
              <span className="font-cyber font-bold text-white text-sm tracking-wider uppercase">
                {mission.title}
              </span>
            </div>

            {/* Persistent Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  sounds.playTerminalClick();
                  setShowLangMenu(!showLangMenu);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-cyber font-bold bg-[#00f3ff]/15 hover:bg-[#00f3ff]/25 text-[#00f3ff] border border-[#00f3ff]/40 uppercase transition-all shadow-[0_0_8px_rgba(0,243,255,0.2)]"
              >
                <span>Current: {mission.language}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Language Switcher Popup Menu */}
              {showLangMenu && (
                <div className="absolute left-0 top-full mt-1 w-48 py-1.5 rounded-xl bg-[#090e24] border border-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.3)] z-50 font-cyber">
                  <div className="px-3 py-1 text-[9px] uppercase tracking-wider text-slate-400 border-b border-[#1e294f]">
                    Switch Language Track:
                  </div>
                  {['python', 'c', 'javascript', 'html-css', 'bash', 'sql', 'cyberdefense', 'cpp', 'java'].map((langId) => (
                    <button
                      key={langId}
                      type="button"
                      onClick={() => {
                        sounds.playTerminalClick();
                        setShowLangMenu(false);
                        if (onSwitchLanguage) {
                          onSwitchLanguage(langId as LanguageId);
                        }
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs uppercase flex items-center justify-between hover:bg-[#142045] transition-colors ${
                        mission.language === langId ? 'text-[#00f3ff] font-bold' : 'text-slate-300'
                      }`}
                    >
                      <span>{langId}</span>
                      {mission.language === langId && <CheckCircle2 className="w-3 h-3 text-[#00f3ff]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Context & Concept Banner */}
        <div className="px-4 py-2.5 bg-[#0b1126] border-b border-[#1e294f] flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-[#00f3ff] font-cyber font-semibold uppercase tracking-wider mr-2">
              Objective:
            </span>
            <span className="text-slate-300 font-sans">{mission.storyContext}</span>
          </div>
          <div className="flex items-center gap-3 font-cyber text-xs">
            <span className="text-[#ffaa00] font-bold">+{mission.xpReward} XP</span>
            <span className="text-[#00f3ff] font-bold">+{mission.creditsReward} BITS</span>
          </div>
        </div>

        {/* Main Workstation Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Code Editor (Left / Top) */}
          <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-[#1e294f] bg-[#050813]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#0a0f24] text-[11px] text-slate-400 border-b border-[#1e294f]">
              <span className="font-cyber">CYBER_DECK // CODE_EDITOR</span>
              <span>Lines: {lines.length}</span>
            </div>

            {/* Code Input with line numbers */}
            <div className="relative flex-1 flex overflow-auto max-h-[360px] lg:max-h-[460px]">
              {/* Line Numbers Column */}
              <div className="w-10 select-none py-3 text-right pr-2 text-slate-600 bg-[#070b19] font-code text-xs leading-6">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Text Area */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 py-3 px-3 bg-transparent text-[#e2e8f0] font-code text-xs leading-6 outline-none resize-none focus:ring-0 whitespace-pre overflow-x-auto"
                style={{ tabSize: 4 }}
              />
            </div>

            {/* Editor Action Buttons */}
            <div className="flex items-center justify-between p-3 bg-[#0a0f24] border-t border-[#1e294f]">
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-cyber transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={cycleHint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ffaa00]/50 hover:bg-[#ffaa00]/10 text-[#ffaa00] text-xs font-cyber transition-all"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Hint ({showHintIndex + 1}/{mission.hints.length})</span>
                </button>
              </div>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#00f3ff] to-[#0077ff] text-black font-cyber font-bold text-xs uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)] disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>{isRunning ? 'Compiling...' : 'Run & Test'}</span>
              </button>
            </div>
          </div>

          {/* Console & BYTE Assistant (Right / Bottom) */}
          <div className="lg:col-span-5 flex flex-col bg-[#070b1a] overflow-hidden">
            {/* Sarcastic Companion BYTE Widget */}
            <div className="p-3 bg-[#0d152d] border-b border-[#1e294f] flex items-start gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1e294b] to-[#00f3ff]/30 border border-[#00f3ff] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,243,255,0.3)]">
                <span className="font-cyber font-bold text-xs text-[#00f3ff]">BYTE</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00ff66] ring-2 ring-[#080d1e]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-[11px] font-cyber text-slate-400">
                  <span className="text-[#00f3ff] font-bold">BYTE Companion</span>
                  <span className="capitalize text-slate-400">[{byteComment.mood}]</span>
                </div>
                <p className="text-xs text-slate-200 mt-1 font-sans italic leading-relaxed">
                  &ldquo;{byteComment.text}&rdquo;
                </p>
              </div>
            </div>

            {/* Live Terminal Output Console */}
            <div className="flex-1 p-3 overflow-y-auto flex flex-col font-code text-xs">
              <div className="text-[11px] font-cyber text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                <span>Output Console</span>
                <span className="text-emerald-400">STDOUT / STDERR</span>
              </div>

              {output ? (
                <pre className="p-3 rounded-lg bg-[#04060d] border border-[#1e294f] text-[#00f3ff] whitespace-pre-wrap font-code leading-5">
                  {output}
                </pre>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-600 text-center p-4">
                  <Terminal className="w-8 h-8 mb-2 opacity-40 text-slate-500" />
                  <p>Click &quot;Run & Test&quot; to execute your code in the simulated Cyberverse runtime.</p>
                </div>
              )}

              {/* Test Case Status */}
              {testResults && (
                <div className="mt-3 p-3 rounded-lg bg-[#0b1328] border border-[#1e294f]">
                  <div className="text-[11px] font-cyber uppercase tracking-wider text-slate-400 mb-1.5">
                    Validation Status
                  </div>
                  {testResults.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      {t.passed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-emerald-300">{t.message}</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span className="text-rose-300">{t.message}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Victory Claim Bar */}
            {isCompleted && (
              <div className="p-4 bg-gradient-to-r from-[#00ff66]/15 to-[#00f3ff]/15 border-t border-[#00ff66]/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00ff66]" />
                  <div>
                    <p className="font-cyber font-bold text-white text-xs">MISSION COMPLETED!</p>
                    <p className="text-[11px] text-emerald-300 font-sans">System patched and verified.</p>
                  </div>
                </div>
                <button
                  onClick={handleClaimReward}
                  className="px-4 py-2 rounded-lg bg-[#00ff66] text-black font-cyber font-bold text-xs uppercase tracking-wider hover:bg-white active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,102,0.5)]"
                >
                  Claim Rewards
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
