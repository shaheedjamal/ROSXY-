import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';
import { Terminal as TerminalIcon, X, HelpCircle, CheckCircle } from 'lucide-react';

interface TerminalSimulatorProps {
  onClose: () => void;
  onMissionPass: (xp: number, credits: number) => void;
}

interface CommandOutput {
  command: string;
  response: string;
  isError?: boolean;
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({
  onClose,
  onMissionPass,
}) => {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'system_init',
      response: 'ROSXY LINUX KERNEL v6.12-cyberverse (x86_64)\nType "help" to view safe simulated commands.\nMission: Investigate "auth.log" using grep to find FAILED attempts, then kill rogue process 7331!',
    },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [passedLogGrep, setPassedLogGrep] = useState(false);
  const [passedKillProcess, setPassedKillProcess] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = currentInput.trim();
    if (!cmd) return;

    sounds.playTerminalClick();
    const parts = cmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    let resp = '';
    let isErr = false;

    switch (mainCmd) {
      case 'help':
        resp = `Available safe commands:
  ls               - List files in current directory
  cat <file>       - Output contents of a file
  grep <str> <file>- Search plain-text files for keywords
  pwd              - Print current working directory
  ps aux           - Display currently running processes
  kill -9 <PID>    - Terminate a process by ID
  chmod <mode> <f> - Change file access permissions
  clear            - Clear terminal screen
  whoami           - Print active Cyber Guardian username`;
        break;

      case 'clear':
        setHistory([]);
        setCurrentInput('');
        return;

      case 'pwd':
        resp = '/home/guardian/cyber_logs';
        break;

      case 'whoami':
        resp = 'guardian (uid=1000 gid=1000)';
        break;

      case 'ls':
        resp = 'auth.log       daemon.conf    quantum_key.pem    rogue_payload.sh';
        break;

      case 'cat':
        if (parts[1] === 'auth.log') {
          resp = `[AUTH_LOG] 23:14:00 System booted
[AUTH_LOG] 23:14:02 FAILED login for user: admin from 10.0.99.12
[AUTH_LOG] 23:14:03 SUCCESS login for user: guardian
[AUTH_LOG] 23:14:05 FAILED login for user: root from 10.0.99.12
[AUTH_LOG] 23:14:06 FAILED login for user: null from 10.0.99.12`;
        } else if (parts[1] === 'daemon.conf') {
          resp = 'port=22\nenable_root_login=no\nmax_auth_tries=3';
        } else if (parts[1] === 'quantum_key.pem') {
          resp = '-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQI...';
        } else {
          resp = `cat: ${parts[1] || 'missing file'}: No such file or directory`;
          isErr = true;
        }
        break;

      case 'grep':
        if (cmd.includes('FAILED') && cmd.includes('auth.log')) {
          resp = `[AUTH_LOG] 23:14:02 FAILED login for user: admin from 10.0.99.12
[AUTH_LOG] 23:14:05 FAILED login for user: root from 10.0.99.12
[AUTH_LOG] 23:14:06 FAILED login for user: null from 10.0.99.12
[SUCCESS] Intrusion trace identified! Great job using grep to filter logs.`;
          setPassedLogGrep(true);
          sounds.playSuccessFanfare();
        } else {
          resp = 'grep: syntax: grep "PATTERN" FILENAME (e.g. grep "FAILED" auth.log)';
          isErr = true;
        }
        break;

      case 'ps':
        resp = `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1  16880  2048 ?        Ss   23:10   0:01 /sbin/init
guardian  1204  0.1  0.5  45200  8192 pts/0    Ss   23:12   0:00 -bash
null_bot  7331 99.4  8.2 245000 95000 ?        R    23:14   4:20 null_rogue_daemon --drain-entropy`;
        break;

      case 'kill':
        if (cmd.includes('-9') && cmd.includes('7331')) {
          resp = `[KERNEL] Process 7331 (null_rogue_daemon) terminated with SIGKILL!
Entropy siphon eliminated. CPU load back to normal!`;
          setPassedKillProcess(true);
          sounds.playSuccessFanfare();
        } else {
          resp = 'kill: invalid argument or PID. To kill rogue daemon, use: kill -9 7331';
          isErr = true;
        }
        break;

      case 'chmod':
        resp = `mode of '${parts[2] || 'file'}' changed to ${parts[1] || 'default'}`;
        break;

      default:
        resp = `bash: ${mainCmd}: command not found. Type "help" for a list of commands.`;
        isErr = true;
        break;
    }

    setHistory((prev) => [...prev, { command: cmd, response: resp, isError: isErr }]);
    setCurrentInput('');

    // Check if both tasks completed
    if ((passedLogGrep || (cmd.includes('FAILED') && cmd.includes('auth.log'))) &&
        (passedKillProcess || (cmd.includes('-9') && cmd.includes('7331')))) {
      confetti({ particleCount: 80, spread: 70 });
    }
  };

  const handleFinishMission = () => {
    sounds.playSuccessFanfare();
    onMissionPass(250, 150);
    onClose();
  };

  const isBothDone = passedLogGrep && passedKillProcess;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl h-[85vh] flex flex-col bg-[#070b16] border-2 border-[#f59e0b] rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.3)] overflow-hidden font-code text-xs">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#11172a] border-b border-[#2d3748]">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <TerminalIcon className="w-4 h-4 text-[#f59e0b] ml-2" />
            <span className="font-cyber font-bold text-white tracking-wider">
              LINUX TERMINAL // guardian@cyberverse:~
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Objectives Progress Header */}
        <div className="px-4 py-2 bg-[#0e1424] border-b border-[#1f293d] flex flex-wrap items-center justify-between gap-3 text-[11px] font-cyber">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${passedLogGrep ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <span className={passedLogGrep ? 'text-emerald-300' : 'text-slate-400'}>
                1. grep &quot;FAILED&quot; auth.log
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${passedKillProcess ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <span className={passedKillProcess ? 'text-emerald-300' : 'text-slate-400'}>
                2. kill -9 7331
              </span>
            </div>
          </div>

          {isBothDone && (
            <button
              onClick={handleFinishMission}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#f59e0b] text-black font-cyber font-bold text-xs hover:bg-white active:scale-95 transition-all"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Claim Terminal XP</span>
            </button>
          )}
        </div>

        {/* Scrollable Output Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 leading-relaxed text-slate-200">
          {history.map((h, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2 text-[#00f3ff]">
                <span className="text-[#f59e0b]">guardian@cyberverse:~$</span>
                <span>{h.command}</span>
              </div>
              <pre className={`whitespace-pre-wrap ${h.isError ? 'text-rose-400' : 'text-emerald-300'} font-code`}>
                {h.response}
              </pre>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Command Input Bar */}
        <form
          onSubmit={handleExecute}
          className="p-3 bg-[#0a0f1d] border-t border-[#1f293d] flex items-center gap-2"
        >
          <span className="text-[#f59e0b] font-bold">guardian@cyberverse:~$</span>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder='Type command (e.g. grep "FAILED" auth.log or help)'
            className="flex-1 bg-transparent text-[#00f3ff] outline-none font-code text-xs focus:ring-0"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1 rounded bg-[#1f293d] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-black font-cyber font-bold transition-colors"
          >
            ENTER
          </button>
        </form>
      </div>
    </div>
  );
};
