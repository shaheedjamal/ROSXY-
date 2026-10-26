import React, { useState } from 'react';
import { CyberRole, PlayerCustomization, PlayerStats } from '../types/game';
import { sounds } from '../utils/audio';
import { User, Cpu, Shield, Sparkles, Check, ChevronRight } from 'lucide-react';

interface CharacterCreatorProps {
  initialPlayer: PlayerStats;
  onSave: (name: string, handle: string, role: CyberRole, customization: PlayerCustomization) => void;
  onClose?: () => void;
  isInitialSetup?: boolean;
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  initialPlayer,
  onSave,
  onClose,
  isInitialSetup = false,
}) => {
  const [handle, setHandle] = useState(initialPlayer.handle || 'ZeroCool');
  const [role, setRole] = useState<CyberRole>(initialPlayer.role || 'Code Architect');
  const [suitColor, setSuitColor] = useState(initialPlayer.customization.suitColor || '#1e293b');
  const [visorColor, setVisorColor] = useState(initialPlayer.customization.visorColor || '#00f3ff');
  const [accentColor, setAccentColor] = useState(initialPlayer.customization.accentColor || '#ff007f');
  const [cyberware, setCyberware] = useState<'Neural Deck' | 'Optic Glitch' | 'Overclock Core' | 'Quantum Rig'>(
    initialPlayer.customization.cyberware || 'Neural Deck'
  );

  const roles: { role: CyberRole; perk: string; desc: string }[] = [
    {
      role: 'Code Architect',
      perk: '+15% XP on Python & OOP',
      desc: 'Builds elegant algorithms and repairs corrupted data flows.',
    },
    {
      role: 'SecOps Hunter',
      perk: '+20% Shield against Bosses',
      desc: 'Defends systems from exploits, zero-days, and social engineering.',
    },
    {
      role: 'Netrunner',
      perk: 'Fast Travel & Packet Routing',
      desc: 'Surfs high-speed fiber bridges and bypasses firewall restrictions.',
    },
    {
      role: 'Kernel Breaker',
      perk: '+25% Terminal Command Speed',
      desc: 'Deep subterranean hacker fluent in low-level memory and bash.',
    },
    {
      role: 'AI Whisperer',
      perk: 'Bonus Hints & Logic Insight',
      desc: 'Trains neural alignments and shields networks from rogue AI models.',
    },
  ];

  const suitPalette = ['#0f172a', '#1e293b', '#18181b', '#1e1b4b', '#064e3b', '#7f1d1d'];
  const visorPalette = ['#00f3ff', '#ff007f', '#00ff66', '#ffaa00', '#a855f7', '#ffffff'];
  const accentPalette = ['#ff007f', '#00f3ff', '#ffaa00', '#00ff66', '#e11d48', '#8b5cf6'];
  const cyberwareOptions = ['Neural Deck', 'Optic Glitch', 'Overclock Core', 'Quantum Rig'] as const;

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playCyberBoot();
    onSave(handle, `@${handle.replace(/[^a-zA-Z0-9_]/g, '')}`, role, {
      suitColor,
      visorColor,
      accentColor,
      cyberware,
      avatarIcon: 'guardian-core',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-lg select-none overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto bg-[#070b1a] border-2 border-[#00f3ff] rounded-2xl shadow-[0_0_50px_rgba(0,243,255,0.35)] overflow-hidden font-cyber">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0d1630] border-b border-[#1e294f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00f3ff]/20 border border-[#00f3ff] flex items-center justify-center">
              <User className="w-6 h-6 text-[#00f3ff]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wider uppercase">
                {isInitialSetup ? 'CYBER GUARDIAN INITIALIZATION' : 'CUSTOMIZE GEAR & IDENTITY'}
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Calibrate your neural implants, armor plating, and hacker specialization.
              </p>
            </div>
          </div>
          {onClose && !isInitialSetup && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white px-3 py-1 rounded-lg border border-slate-700 text-xs"
            >
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleFinish} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Avatar Hologram Preview Card */}
          <div className="md:col-span-5 flex flex-col items-center justify-between p-5 rounded-xl bg-[#050814] border border-[#1e294f]">
            <div className="text-center">
              <span className="text-[10px] tracking-widest text-slate-500 uppercase block">
                GUARDIAN RIG PREVIEW
              </span>
              <span className="text-sm font-bold text-white mt-1 block">
                {handle || 'GUARDIAN'}
              </span>
              <span className="text-xs text-[#00f3ff] block font-sans">{role}</span>
            </div>

            {/* High-Fidelity Cyber Guardian Operator Preview */}
            <div className="relative my-4 w-44 h-56 flex items-center justify-center">
              <div
                style={{
                  boxShadow: `0 0 35px ${visorColor}35`,
                  borderColor: visorColor,
                }}
                className="w-full h-full rounded-2xl bg-[#090d20] border-2 relative overflow-hidden flex flex-col justify-end p-3"
              >
                {/* Operative High-Def Image */}
                <img
                  src="/src/assets/images/cyber_guardian_rig_1792933230818.jpg"
                  alt="Cyber Guardian Rig"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />

                {/* Cyber Tint Overlay matching player suit and visor */}
                <div 
                  style={{
                    background: `linear-gradient(to top, rgba(5,8,20,0.95) 0%, rgba(5,8,20,0.4) 60%, ${visorColor}25 100%)`
                  }}
                  className="absolute inset-0"
                />
                <div className="cyber-scanlines absolute inset-0 opacity-40 pointer-events-none" />

                {/* Dynamic Visor Glow Indicator */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span 
                      style={{ backgroundColor: visorColor, boxShadow: `0 0 8px ${visorColor}` }}
                      className="w-2.5 h-2.5 rounded-full inline-block"
                    />
                    <span className="text-[10px] text-white font-bold tracking-wider">
                      HUD OPTICS
                    </span>
                  </div>
                  <span className="text-[10px] font-code text-[#00f3ff] uppercase font-bold tracking-tight">
                    [{cyberware}]
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full text-center p-3 rounded-lg bg-[#0b1126] border border-[#1e294f] text-[11px] font-sans text-slate-300">
              <span className="text-[#00ff66] font-cyber font-bold block mb-0.5">
                ACTIVE PASSIVE PERK:
              </span>
              {roles.find((r) => r.role === role)?.perk}
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* Handle Name */}
            <div>
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-1">
                Guardian Handle / Call-Sign
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                maxLength={18}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b1126] border border-[#00f3ff]/40 text-[#00f3ff] font-code text-sm outline-none focus:border-[#00f3ff]"
                placeholder="CyberHacker_99"
              />
            </div>

            {/* Specialization Role Selection */}
            <div>
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-1.5">
                Specialization Track
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => {
                      sounds.playTerminalClick();
                      setRole(r.role);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === r.role
                        ? 'bg-[#00f3ff]/15 border-[#00f3ff] shadow-[0_0_12px_rgba(0,243,255,0.3)]'
                        : 'bg-[#090e20] border-[#1e294f] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{r.role}</span>
                      {role === r.role && <Check className="w-3.5 h-3.5 text-[#00f3ff]" />}
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5 leading-snug">
                      {r.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Suit Color */}
              <div>
                <span className="text-[11px] text-slate-400 font-bold block mb-1.5 uppercase">
                  Chassis Armor
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suitPalette.map((col) => (
                    <button
                      key={col}
                      type="button"
                      style={{ backgroundColor: col }}
                      onClick={() => setSuitColor(col)}
                      className={`w-6 h-6 rounded-lg border-2 transition-transform ${
                        suitColor === col ? 'scale-110 border-white shadow-[0_0_8px_white]' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Visor Color */}
              <div>
                <span className="text-[11px] text-slate-400 font-bold block mb-1.5 uppercase">
                  Visor Optics
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {visorPalette.map((col) => (
                    <button
                      key={col}
                      type="button"
                      style={{ backgroundColor: col }}
                      onClick={() => setVisorColor(col)}
                      className={`w-6 h-6 rounded-lg border-2 transition-transform ${
                        visorColor === col ? 'scale-110 border-white shadow-[0_0_8px_white]' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <span className="text-[11px] text-slate-400 font-bold block mb-1.5 uppercase">
                  Reactor Trim
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {accentPalette.map((col) => (
                    <button
                      key={col}
                      type="button"
                      style={{ backgroundColor: col }}
                      onClick={() => setAccentColor(col)}
                      className={`w-6 h-6 rounded-lg border-2 transition-transform ${
                        accentColor === col ? 'scale-110 border-white shadow-[0_0_8px_white]' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Cyberware Implant */}
            <div>
              <span className="text-[11px] text-slate-400 font-bold block mb-1.5 uppercase">
                Neural Implant Rig
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                {cyberwareOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setCyberware(opt)}
                    className={`py-2 px-3 rounded-xl border text-center font-cyber font-bold transition-all ${
                      cyberware === opt
                        ? 'bg-[#ff007f]/20 border-[#ff007f] text-[#ff007f] shadow-[0_0_10px_rgba(255,0,127,0.4)]'
                        : 'bg-[#090e20] border-[#1e294f] text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00f3ff] via-[#00a8ff] to-[#00ff66] text-black font-cyber font-bold text-sm uppercase tracking-widest hover:opacity-95 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,243,255,0.5)] flex items-center justify-center gap-2"
              >
                <span>{isInitialSetup ? 'Deploy to Cyberverse' : 'Save Changes'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
