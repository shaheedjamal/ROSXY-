import React from 'react';
import { CYBER_DISTRICTS } from '../data/districts';
import { DistrictId, PlayerStats } from '../types/game';
import { sounds } from '../utils/audio';
import { MapPin, Lock, Unlock, Skull, Code, ChevronRight, X, Sparkles } from 'lucide-react';

interface WorldMapModalProps {
  player: PlayerStats;
  currentDistrict: DistrictId;
  onSelectDistrict: (districtId: DistrictId) => void;
  onClose: () => void;
}

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  player,
  currentDistrict,
  onSelectDistrict,
  onClose,
}) => {
  const handleTravel = (id: DistrictId, isUnlocked: boolean) => {
    if (!isUnlocked) {
      sounds.playGlitchBuzz();
      return;
    }
    sounds.playLaserShot();
    onSelectDistrict(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md select-none overflow-hidden font-cyber">
      <div className="relative w-full max-w-5xl h-[88vh] flex flex-col bg-[#070a18] border-2 border-[#00f3ff] rounded-2xl shadow-[0_0_50px_rgba(0,243,255,0.3)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0d142c] border-b border-[#1e294f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00f3ff]/20 border border-[#00f3ff] flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#00f3ff]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wider uppercase">
                CYBERVERSE DISTRICT NAVIGATOR
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Explore connected learning sectors, battle corrupted district bosses, and patch systems.
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

        {/* Districts Grid */}
        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CYBER_DISTRICTS.map((dist) => {
            const isUnlocked = player.unlockedDistricts.includes(dist.id) || dist.unlockedByDefault;
            const isCurrent = currentDistrict === dist.id;

            return (
              <div
                key={dist.id}
                style={{ borderColor: isCurrent ? dist.color : isUnlocked ? '#1e294f' : '#141a29' }}
                className={`relative rounded-xl p-4 flex flex-col justify-between border transition-all ${
                  isCurrent
                    ? 'bg-[#0d1633] shadow-[0_0_20px_rgba(0,243,255,0.25)]'
                    : isUnlocked
                    ? 'bg-[#090e22] hover:border-slate-500'
                    : 'bg-[#060813] opacity-60'
                }`}
              >
                {/* District Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{ color: dist.color, borderColor: dist.color }}
                      className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase"
                    >
                      Track: {dist.primaryLanguage}
                    </span>
                    <div className="flex items-center gap-1 text-xs">
                      {isCurrent ? (
                        <span className="text-[#00ff66] font-bold flex items-center gap-1 text-[11px]">
                          <Sparkles className="w-3.5 h-3.5" /> CURRENT
                        </span>
                      ) : isUnlocked ? (
                        <Unlock className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-base tracking-wide">
                    {dist.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans mt-0.5 line-clamp-2">
                    {dist.tagline}
                  </p>

                  {/* Boss Info */}
                  <div className="mt-3 p-2 rounded-lg bg-[#04060f] border border-[#1e294f] flex items-center gap-2 text-xs">
                    <Skull className="w-4 h-4 text-[#ff007f] shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-slate-500 block uppercase">GUARDIAN BOSS</span>
                      <span className="text-rose-300 font-bold text-[11px] truncate block">
                        {dist.bossName}
                      </span>
                    </div>
                  </div>

                  {/* Learning Topics Chips */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {dist.learningTopics.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-[#101934] text-slate-400 text-[10px] font-sans"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fast Travel / Unlock Action Button */}
                <div className="mt-4 pt-2 border-t border-[#1e294f]/60">
                  <button
                    onClick={() => handleTravel(dist.id, Boolean(isUnlocked))}
                    disabled={!isUnlocked || isCurrent}
                    className={`w-full py-2 rounded-lg font-cyber font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                      isCurrent
                        ? 'bg-slate-800 text-slate-500 cursor-default'
                        : isUnlocked
                        ? 'bg-[#00f3ff] text-black hover:bg-white active:scale-95 shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                        : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    <span>{isCurrent ? 'Currently Exploring' : isUnlocked ? 'Fast Travel Here' : 'District Locked'}</span>
                    {isUnlocked && !isCurrent && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
