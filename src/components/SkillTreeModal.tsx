import React from 'react';
import { SKILL_TREE_NODES } from '../data/skills';
import { PlayerStats } from '../types/game';
import { sounds } from '../utils/audio';
import { GitBranch, Flame, Heart, Zap, Lock, CheckCircle2, X } from 'lucide-react';

interface SkillTreeModalProps {
  player: PlayerStats;
  onUnlockSkill: (skillId: string, requiredXp: number) => void;
  onClose: () => void;
}

export const SkillTreeModal: React.FC<SkillTreeModalProps> = ({
  player,
  onUnlockSkill,
  onClose,
}) => {
  const tracks = ['Programming', 'Cybersecurity', 'Systems', 'Architecture'] as const;

  const handleUnlock = (skillId: string, requiredXp: number, canUnlock: boolean) => {
    if (!canUnlock) {
      sounds.playGlitchBuzz();
      return;
    }
    sounds.playSuccessFanfare();
    onUnlockSkill(skillId, requiredXp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md select-none overflow-hidden font-cyber">
      <div className="relative w-full max-w-5xl h-[88vh] flex flex-col bg-[#070b19] border-2 border-[#ffaa00] rounded-2xl shadow-[0_0_50px_rgba(255,170,0,0.3)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#141029] border-b border-[#2d2545] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffaa00]/20 border border-[#ffaa00] flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-[#ffaa00]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wider uppercase">
                GUARDIAN SKILL TREE & PROGRESSION
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Duolingo-style mastery tracks. Unlock persistent cyber advantages and advanced language protocols.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Energy, Streaks & Stats Banner */}
        <div className="px-6 py-3 bg-[#0a0e22] border-b border-[#1e294f] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-white font-bold">{player.streakDays} Day Coding Streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span className="text-white font-bold">{player.energy}/{player.maxEnergy} Energy</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#ffaa00]" />
              <span className="text-[#ffaa00] font-bold">{player.xp} Total XP</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-sans">
            Level {player.level} {player.role} • Next Level in {player.xpToNextLevel - (player.xp % player.xpToNextLevel)} XP
          </div>
        </div>

        {/* Skill Tree Tracks */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {tracks.map((track) => {
            const trackNodes = SKILL_TREE_NODES.filter((n) => n.track === track);

            return (
              <div key={track} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffaa00]" />
                  <h3 className="font-bold text-white text-sm tracking-wider uppercase">
                    {track} Track
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {trackNodes.map((node) => {
                    const isUnlocked = player.unlockedSkills?.includes(node.id) || node.unlocked;
                    const canAfford = player.xp >= node.requiredXp;
                    const canUnlock = !isUnlocked && canAfford;

                    return (
                      <div
                        key={node.id}
                        className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                          isUnlocked
                            ? 'bg-[#0c182c] border-[#00f3ff]/60 shadow-[0_0_15px_rgba(0,243,255,0.15)]'
                            : canUnlock
                            ? 'bg-[#181329] border-[#ffaa00]/60 hover:border-[#ffaa00]'
                            : 'bg-[#070b16] border-[#1b2234] opacity-70'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              Tier {node.tier}
                            </span>
                            {isUnlocked ? (
                              <CheckCircle2 className="w-4 h-4 text-[#00ff66]" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-500" />
                            )}
                          </div>

                          <h4 className="font-bold text-white text-sm">{node.name}</h4>
                          <p className="text-xs text-slate-300 font-sans mt-1 leading-snug">
                            {node.description}
                          </p>

                          <div className="mt-3 p-2 rounded-lg bg-[#050711] border border-[#1b2234] text-[11px] font-sans text-emerald-300">
                            <span className="font-cyber font-bold text-[#00f3ff] block text-[9px] uppercase">
                              PASSIVE PERK:
                            </span>
                            {node.perk}
                          </div>
                        </div>

                        <div className="mt-4 pt-2 border-t border-[#1b2234]">
                          {isUnlocked ? (
                            <span className="text-xs font-bold text-[#00ff66] flex items-center justify-center py-1">
                              MASTERED
                            </span>
                          ) : (
                            <button
                              onClick={() => handleUnlock(node.id, node.requiredXp, canUnlock)}
                              disabled={!canUnlock}
                              className={`w-full py-1.5 rounded-lg text-xs font-cyber font-bold uppercase transition-all ${
                                canUnlock
                                  ? 'bg-[#ffaa00] text-black hover:bg-white active:scale-95 shadow-[0_0_10px_rgba(255,170,0,0.4)]'
                                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              Unlock ({node.requiredXp} XP)
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
