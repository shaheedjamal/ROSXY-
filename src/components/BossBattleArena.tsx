import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DistrictInfo, PlayerStats } from '../types/game';
import { sounds } from '../utils/audio';
import { Shield, Zap, Skull, Terminal, Play, AlertCircle, Sparkles, X } from 'lucide-react';

interface BossBattleArenaProps {
  district: DistrictInfo;
  player: PlayerStats;
  onClose: () => void;
  onVictory: (bossName: string, xp: number, credits: number) => void;
}

export const BossBattleArena: React.FC<BossBattleArenaProps> = ({
  district,
  player,
  onClose,
  onVictory,
}) => {
  const [bossHp, setBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [combatPhase, setCombatPhase] = useState(1);
  const [bossStatusText, setBossStatusText] = useState(
    `${district.bossName} emerges from the glitch vortex! Prepare defensive counter-measures!`
  );
  const [playerCodeInput, setPlayerCodeInput] = useState('');
  const [isAttacking, setIsAttacking] = useState(false);
  const [battleWon, setBattleWon] = useState(false);
  const [isScreenShaking, setIsScreenShaking] = useState(false);

  // Dynamic Boss Combat Challenges
  const getBossPhaseData = () => {
    if (district.id === 'neon-academy') {
      return {
        attackName: 'SYNTAX SHREDDER CLAW',
        instruction: 'The boss corrupted the counter-laser! Close the string quote: laser_target = "MONSTER',
        starter: 'laser_target = "MONSTER"',
        expectedRegex: /laser_target\s*=\s*["']MONSTER["']/,
        damage: 40,
        hint: 'Add closing double quote " to fix the syntax error!',
      };
    } else if (district.id === 'python-port') {
      return {
        attackName: 'INFINITE STOMP WAVE',
        instruction: 'Loopzilla is trapped in while rage > 0! Decrement rage by 1: rage -= 1',
        starter: 'rage = 5\nwhile rage > 0:\n    rage -= 1',
        expectedRegex: /rage\s*-=\s*1|rage\s*=\s*rage\s*-\s*1/,
        damage: 50,
        hint: 'Type rage -= 1 inside the loop to break the infinite rage cycle!',
      };
    } else if (district.id === 'cyber-defense') {
      return {
        attackName: 'SPOOFED DOMAIN FLOOD',
        instruction: 'Deploy strict anti-spoofing policy: dmarc = "reject"',
        starter: 'dmarc = "reject"',
        expectedRegex: /dmarc\s*=\s*["']reject["']/,
        damage: 50,
        hint: 'Set dmarc = "reject" to block all fraudulent emails!',
      };
    } else if (district.id === 'linux-underground') {
      return {
        attackName: 'FORK BOMB PROPAGATION',
        instruction: 'Send termination signal 9 to rogue process 7331: kill -9 7331',
        starter: 'kill -9 7331',
        expectedRegex: /kill\s+-9\s+7331/,
        damage: 50,
        hint: 'Type: kill -9 7331',
      };
    } else {
      // Final Boss NULL or generic
      return {
        attackName: 'SINGULARITY VOID COLLAPSE',
        instruction: 'Catch the division by zero exception: except ZeroDivisionError:',
        starter: 'try:\n    x = 1 / 0\nexcept ZeroDivisionError:\n    pass',
        expectedRegex: /except\s+ZeroDivisionError\s*:/,
        damage: 60,
        hint: 'Use: except ZeroDivisionError: to prevent universal kernel crash!',
      };
    }
  };

  const phase = getBossPhaseData();

  const handleExecuteCounter = () => {
    setIsAttacking(true);
    sounds.playLaserShot();
    sounds.triggerHaptic([30, 50, 30]);

    setTimeout(() => {
      setIsAttacking(false);
      setIsScreenShaking(true);
      setTimeout(() => setIsScreenShaking(false), 300);

      const isCorrect = phase.expectedRegex.test(playerCodeInput);

      if (isCorrect) {
        sounds.playSuccessFanfare();
        sounds.triggerHaptic([50, 80, 50]);
        const nextHp = Math.max(0, bossHp - phase.damage);
        setBossHp(nextHp);

        if (nextHp <= 0) {
          setBattleWon(true);
          setBossStatusText(`CRITICAL HIT! ${district.bossName} disintegrated into harmless binary sparkles!`);
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#00f3ff', '#ff007f', '#ffaa00'],
          });
        } else {
          setBossStatusText(`DIRECT HIT! Boss took ${phase.damage} damage! Next phase initiated.`);
          setCombatPhase((prev) => prev + 1);
        }
      } else {
        sounds.playGlitchBuzz();
        sounds.triggerHaptic(100);
        const nextPlayerHp = Math.max(10, playerHp - 25);
        setPlayerHp(nextPlayerHp);
        setBossStatusText(`BUG IN COUNTER-MEASURE! ${district.bossName} dealt 25 damage with ${phase.attackName}! Check your syntax.`);
      }
    }, 350);
  };

  const handleClaimBossLoot = () => {
    sounds.playSuccessFanfare();
    onVictory(district.bossName, 500, 300);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-lg select-none">
      <div 
        style={{
          transform: isScreenShaking ? 'translate(4px, -3px) rotate(0.4deg)' : 'none',
          transition: 'transform 0.05s ease-in-out',
        }}
        className="relative w-full max-w-3xl flex flex-col bg-[#090b1c] border-2 border-[#ff007f] rounded-2xl shadow-[0_0_60px_rgba(255,0,127,0.45)] overflow-hidden font-cyber"
      >
        {/* Boss Arena Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#1c081e] via-[#100720] to-[#0d162f] border-b border-[#ff007f]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff007f]/20 border border-[#ff007f] flex items-center justify-center shadow-[0_0_15px_rgba(255,0,127,0.5)]">
              <Skull className="w-6 h-6 text-[#ff007f]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-base tracking-wider uppercase">
                  {district.bossName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#ff007f]/20 border border-[#ff007f]/40 text-[#ff007f] font-bold uppercase">
                  Phase {combatPhase}
                </span>
              </div>
              <p className="text-xs text-[#ff007f]/80 font-sans">{district.bossTitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Health Bars Display */}
        <div className="p-4 bg-[#060814] border-b border-[#1e294f] grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Boss HP */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-rose-300 font-bold">
              <span>{district.bossName} Integrity</span>
              <span>{bossHp}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#1b0816] overflow-hidden border border-[#ff007f]/50">
              <div
                style={{ width: `${bossHp}%` }}
                className="h-full bg-gradient-to-r from-[#ff007f] to-[#ff5f56] transition-all duration-300 shadow-[0_0_10px_#ff007f]"
              />
            </div>
          </div>

          {/* Player HP / Shield */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-[#00f3ff] font-bold">
              <span>{player.handle || 'Cyber Guardian'} Cyber Shield</span>
              <span>{playerHp}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#051322] overflow-hidden border border-[#00f3ff]/50">
              <div
                style={{ width: `${playerHp}%` }}
                className="h-full bg-gradient-to-r from-[#00f3ff] to-[#00ff66] transition-all duration-300 shadow-[0_0_10px_#00f3ff]"
              />
            </div>
          </div>
        </div>

        {/* Boss Narrative & Status */}
        <div className="p-4 bg-[#0d1028] border-b border-[#1e294f] flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#ffaa00] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {bossStatusText}
            </p>
          </div>
        </div>

        {/* Combat Code Counter-Measure Console */}
        {!battleWon ? (
          <div className="p-5 flex flex-col gap-4 bg-[#050711]">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00f3ff]">
                <Terminal className="w-4 h-4" />
                <span>ACTIVE COUNTER-MEASURE PROTOCOL</span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                {phase.instruction}
              </p>
            </div>

            {/* Input Box */}
            <div className="flex flex-col gap-2">
              <textarea
                value={playerCodeInput}
                onChange={(e) => setPlayerCodeInput(e.target.value)}
                placeholder={phase.starter}
                rows={3}
                className="w-full p-3 bg-[#0a0f24] border border-[#00f3ff]/40 rounded-xl font-code text-xs text-[#00f3ff] outline-none focus:border-[#00f3ff] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
                <span>Tip: {phase.hint}</span>
                <button
                  type="button"
                  onClick={() => setPlayerCodeInput(phase.starter)}
                  className="text-[#00f3ff] hover:underline"
                >
                  Insert Template
                </button>
              </div>
            </div>

            {/* Combat Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Shield className="w-4 h-4 text-[#00ff66]" />
                <span>Defensive Firewall Active</span>
              </div>

              <button
                onClick={handleExecuteCounter}
                disabled={isAttacking || !playerCodeInput.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#ffaa00] text-black font-cyber font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,0,127,0.5)] disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>{isAttacking ? 'Firing Laser...' : 'Execute Counter-Strike'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#060814] to-[#12081f] gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#00ff66]/20 border-2 border-[#00ff66] flex items-center justify-center shadow-[0_0_30px_rgba(0,255,102,0.5)]">
              <Sparkles className="w-10 h-10 text-[#00ff66]" />
            </div>
            <div>
              <h2 className="text-xl font-cyber font-bold text-white tracking-wider">
                BOSS VANQUISHED!
              </h2>
              <p className="text-xs text-emerald-400 font-sans mt-1">
                You defended {district.name} and cleansed NULL&apos;s corruption from the district mainframe!
              </p>
            </div>

            <div className="flex gap-4 font-cyber text-sm">
              <div className="px-4 py-2 rounded-xl bg-[#0b1328] border border-[#1e294f]">
                <span className="text-slate-400 block text-[10px]">XP GAINED</span>
                <span className="text-[#ffaa00] font-bold">+500 XP</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-[#0b1328] border border-[#1e294f]">
                <span className="text-slate-400 block text-[10px]">CYBER-BITS</span>
                <span className="text-[#00f3ff] font-bold">+300 BITS</span>
              </div>
            </div>

            <button
              onClick={handleClaimBossLoot}
              className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#00f3ff] text-black font-cyber font-bold text-xs uppercase tracking-widest hover:bg-white active:scale-95 transition-all shadow-[0_0_25px_rgba(0,255,102,0.6)]"
            >
              Collect Boss Loot & Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
