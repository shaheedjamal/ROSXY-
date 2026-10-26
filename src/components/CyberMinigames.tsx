import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';
import { ShieldCheck, AlertOctagon, Mail, Network, X, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface PhishingDrillProps {
  onClose: () => void;
  onPass: (xp: number, credits: number) => void;
}

export const PhishingEmailInspector: React.FC<PhishingDrillProps> = ({
  onClose,
  onPass,
}) => {
  const [selectedFlags, setSelectedFlags] = useState<{ [key: string]: boolean }>({});
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);

  const indicators = [
    { id: 'spoof_domain', label: 'Lookalike Spoofed Domain (@cyberverse-sec-verify.xyz instead of .org)', isRedFlag: true },
    { id: 'urgent_threat', label: 'Artificial High Urgency ("Account deleted in 10 minutes!")', isRedFlag: true },
    { id: 'fake_link', label: 'Suspicious IP Link (http://192.168.4.12/steal-creds)', isRedFlag: true },
    { id: 'double_extension', label: 'Dangerous Double Extension file (Security_Report.pdf.exe)', isRedFlag: true },
    { id: 'standard_footer', label: 'Corporate copyright disclaimer at bottom', isRedFlag: false },
  ];

  const toggleFlag = (id: string) => {
    sounds.playTerminalClick();
    setSelectedFlags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    const identifiedSpoof = selectedFlags['spoof_domain'];
    const identifiedUrgent = selectedFlags['urgent_threat'];
    const identifiedLink = selectedFlags['fake_link'];
    const identifiedFile = selectedFlags['double_extension'];
    const falsePositive = selectedFlags['standard_footer'];

    const success = identifiedSpoof && identifiedUrgent && identifiedLink && identifiedFile && !falsePositive;
    setSubmitted(true);
    setPassed(Boolean(success));

    if (success) {
      sounds.playSuccessFanfare();
      confetti({ particleCount: 70, spread: 60 });
    } else {
      sounds.playGlitchBuzz();
    }
  };

  const handleClaim = () => {
    sounds.playSuccessFanfare();
    onPass(250, 120);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl flex flex-col bg-[#0b1022] border-2 border-[#ef4444] rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.35)] overflow-hidden font-sans">
        {/* Subtle Ambient SOC Artwork */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img
            src="/src/assets/images/cyber_defense_matrix_1792933230698.jpg"
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title Bar */}
        <div className="relative z-10 flex items-center justify-between px-5 py-3.5 bg-[#180d19]/90 border-b border-[#ef4444]/40 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-[#ef4444]" />
            <span className="font-cyber font-bold text-white tracking-wider text-sm">
              SOC FORENSIC DRILL: SPEAR-PHISHING INSPECTION
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Preview Container */}
        <div className="p-4 bg-[#070a16] border-b border-[#1f2940] flex flex-col gap-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-400 border-b border-[#1f2940] pb-2 font-code">
            <div>
              <span className="text-slate-500">From: </span>
              <span className="text-rose-400 font-bold">security-ops@cyberverse-sec-verify.xyz</span>
            </div>
            <span className="text-rose-400 text-[11px] font-bold">DKIM: FAIL | SPF: SOFTFAIL</span>
          </div>

          <div className="font-cyber font-bold text-sm text-white">
            Subject: [CRITICAL EMERGENCY] Your Cyber Guardian Clearance Expires in 10 MINUTES!
          </div>

          <div className="p-3 bg-[#0d1428] rounded-lg text-slate-200 leading-relaxed font-sans border border-[#1f2940]">
            <p>Dear Guardian,</p>
            <p className="mt-1">
              A rogue breach was detected from your neural link. You must immediately verify your credentials
              or your account will be permanently erased within 10 minutes.
            </p>
            <div className="mt-3 p-2 bg-[#080d1e] border border-rose-500/40 rounded flex items-center justify-between">
              <span className="text-rose-300 font-code text-[11px] underline">
                http://192.168.4.12/verify-credentials?guardian=active
              </span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-cyber">
                UNENCRYPTED HTTP
              </span>
            </div>
            <div className="mt-3 p-2 bg-[#080d1e] border border-amber-500/40 rounded flex items-center gap-2 text-xs text-amber-300">
              <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Attachment: Security_Report.pdf.exe (Executable Binary)</span>
            </div>
          </div>
        </div>

        {/* Forensic Analysis Checkboxes */}
        <div className="p-4 bg-[#0a0f22] flex flex-col gap-3 font-cyber">
          <div className="text-xs text-[#00f3ff] font-bold tracking-wider uppercase">
            Identify all legitimate red flags to neutralize the threat:
          </div>

          <div className="space-y-2 text-xs">
            {indicators.map((ind) => (
              <label
                key={ind.id}
                onClick={() => toggleFlag(ind.id)}
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                  selectedFlags[ind.id]
                    ? 'border-[#ef4444] bg-[#ef4444]/15 text-white'
                    : 'border-[#1e294f] bg-[#070b1a] text-slate-300 hover:border-slate-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    selectedFlags[ind.id] ? 'bg-[#ef4444] border-white' : 'border-slate-500'
                  }`}
                >
                  {selectedFlags[ind.id] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <span>{ind.label}</span>
              </label>
            ))}
          </div>

          {/* Result or Submit */}
          {!submitted ? (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ef4444] to-[#ffaa00] text-black font-cyber font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)]"
              >
                Submit Incident Report
              </button>
            </div>
          ) : (
            <div className="pt-2 flex items-center justify-between">
              {passed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>ALL 4 THREAT VECTORS IDENTIFIED! Phishing attack neutralized.</span>
                </div>
              ) : (
                <div className="text-rose-400 text-xs font-sans">
                  Analysis incomplete. Make sure you flagged all 4 genuine attack vectors (domain, urgency, unencrypted link, executable extension)!
                </div>
              )}

              {passed && (
                <button
                  onClick={handleClaim}
                  className="px-5 py-2 rounded-xl bg-[#00ff66] text-black font-cyber font-bold text-xs uppercase hover:bg-white active:scale-95 transition-all"
                >
                  Claim SecOps XP
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface NetworkRouterProps {
  onClose: () => void;
  onPass: (xp: number, credits: number) => void;
}

export const NetworkPacketRouter: React.FC<NetworkRouterProps> = ({
  onClose,
  onPass,
}) => {
  const [port443State, setPort443State] = useState<'BLOCK' | 'ALLOW'>('ALLOW');
  const [port4444State, setPort4444State] = useState<'BLOCK' | 'ALLOW'>('BLOCK');
  const [dnsServer, setDnsServer] = useState('8.8.8.8');
  const [passed, setPassed] = useState(false);

  const handleTestRoute = () => {
    sounds.playTerminalClick();
    if (port443State === 'ALLOW' && port4444State === 'BLOCK' && dnsServer.trim() === '8.8.8.8') {
      sounds.playSuccessFanfare();
      confetti({ particleCount: 70, spread: 70 });
      setPassed(true);
    } else {
      sounds.playGlitchBuzz();
      setPassed(false);
    }
  };

  const handleClaim = () => {
    sounds.playSuccessFanfare();
    onPass(250, 140);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl flex flex-col bg-[#090d20] border-2 border-[#8b5cf6] rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.3)] overflow-hidden font-cyber">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#140e2d] border-b border-[#8b5cf6]/40">
          <div className="flex items-center gap-2.5">
            <Network className="w-5 h-5 text-[#8b5cf6]" />
            <span className="font-bold text-white tracking-wider text-sm">
              NETWORK NEXUS // PACKET ROUTING & ACL FIREWALL
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Network Topology Diagram */}
        <div className="p-6 bg-[#050814] border-b border-[#1e294f] flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="p-3 rounded-xl bg-[#0e1630] border border-[#00f3ff] text-center w-28">
            <span className="text-[10px] text-slate-400 block">CLIENT</span>
            <span className="font-code text-[#00f3ff] font-bold">192.168.1.50</span>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-500" />

          <div className="p-3 rounded-xl bg-[#1a1238] border border-[#8b5cf6] text-center w-36">
            <span className="text-[10px] text-slate-400 block">NEXUS ROUTER</span>
            <span className="font-code text-[#8b5cf6] font-bold">GW: 192.168.1.1</span>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-500" />

          <div className="p-3 rounded-xl bg-[#2b0f20] border border-[#ff007f] text-center w-36">
            <span className="text-[10px] text-slate-400 block">FIREWALL ACL</span>
            <span className="font-code text-[#ff007f] font-bold">Stateful Inspect</span>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-500" />

          <div className="p-3 rounded-xl bg-[#0b241b] border border-[#00ff66] text-center w-28">
            <span className="text-[10px] text-slate-400 block">SECURE SERVER</span>
            <span className="font-code text-[#00ff66] font-bold">HTTPS :443</span>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="p-5 flex flex-col gap-4 bg-[#0a0f24] text-xs">
          <div className="text-[#8b5cf6] font-bold uppercase tracking-wider">
            Configure ACL Rules & DNS Resolver:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
            <div className="p-3 rounded-xl bg-[#060a18] border border-[#1e294f] flex flex-col gap-2">
              <span className="text-slate-300 font-cyber font-bold text-xs">Port 443 (HTTPS Web)</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPort443State('ALLOW')}
                  className={`flex-1 py-1.5 rounded-lg font-cyber font-bold text-xs transition-all ${
                    port443State === 'ALLOW' ? 'bg-[#00ff66] text-black shadow-[0_0_10px_#00ff66]' : 'bg-[#1e294f] text-slate-400'
                  }`}
                >
                  ALLOW
                </button>
                <button
                  onClick={() => setPort443State('BLOCK')}
                  className={`flex-1 py-1.5 rounded-lg font-cyber font-bold text-xs transition-all ${
                    port443State === 'BLOCK' ? 'bg-[#ef4444] text-white shadow-[0_0_10px_#ef4444]' : 'bg-[#1e294f] text-slate-400'
                  }`}
                >
                  BLOCK
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#060a18] border border-[#1e294f] flex flex-col gap-2">
              <span className="text-slate-300 font-cyber font-bold text-xs">Port 4444 (Trojan Port)</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPort4444State('ALLOW')}
                  className={`flex-1 py-1.5 rounded-lg font-cyber font-bold text-xs transition-all ${
                    port4444State === 'ALLOW' ? 'bg-[#ef4444] text-white shadow-[0_0_10px_#ef4444]' : 'bg-[#1e294f] text-slate-400'
                  }`}
                >
                  ALLOW
                </button>
                <button
                  onClick={() => setPort4444State('BLOCK')}
                  className={`flex-1 py-1.5 rounded-lg font-cyber font-bold text-xs transition-all ${
                    port4444State === 'BLOCK' ? 'bg-[#00ff66] text-black shadow-[0_0_10px_#00ff66]' : 'bg-[#1e294f] text-slate-400'
                  }`}
                >
                  BLOCK
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#060a18] border border-[#1e294f] flex flex-col gap-2">
              <span className="text-slate-300 font-cyber font-bold text-xs">Primary DNS Server</span>
              <input
                type="text"
                value={dnsServer}
                onChange={(e) => setDnsServer(e.target.value)}
                placeholder="8.8.8.8"
                className="w-full px-3 py-1.5 rounded-lg bg-[#0d142b] border border-[#8b5cf6]/40 text-[#00f3ff] font-code text-xs outline-none focus:border-[#8b5cf6]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleTestRoute}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#00f3ff] text-black font-cyber font-bold text-xs uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all shadow-[0_0_15px_rgba(139,92,246,0.5)]"
            >
              Test Packet Transmission
            </button>

            {passed && (
              <button
                onClick={handleClaim}
                className="px-5 py-2 rounded-xl bg-[#00ff66] text-black font-cyber font-bold text-xs uppercase hover:bg-white active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,102,0.5)]"
              >
                Claim Network XP (+250)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
