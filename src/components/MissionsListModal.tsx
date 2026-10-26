import React, { useState } from 'react';
import { CODE_MISSIONS } from '../data/curriculum';
import { CYBER_DISTRICTS } from '../data/districts';
import { CodeMission, DistrictId, PlayerStats } from '../types/game';
import { sounds } from '../utils/audio';
import { 
  ListOrdered, 
  CheckCircle2, 
  Terminal, 
  Skull, 
  Code, 
  ChevronRight, 
  X, 
  Filter 
} from 'lucide-react';

interface MissionsListModalProps {
  player: PlayerStats;
  currentDistrict: DistrictId;
  onSelectMission: (mission: CodeMission) => void;
  onClose: () => void;
}

export const MissionsListModal: React.FC<MissionsListModalProps> = ({
  player,
  currentDistrict,
  onSelectMission,
  onClose,
}) => {
  const [selectedLang, setSelectedLang] = useState<string>('all');

  const filteredMissions = CODE_MISSIONS.filter((m) => {
    if (selectedLang === 'all') return true;
    return m.language === selectedLang;
  });

  const handleLaunch = (m: CodeMission) => {
    sounds.playTerminalClick();
    onSelectMission(m);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md select-none overflow-hidden font-cyber">
      <div className="relative w-full max-w-4xl h-[88vh] flex flex-col bg-[#070b18] border-2 border-[#00f3ff] rounded-2xl shadow-[0_0_50px_rgba(0,243,255,0.3)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0d152e] border-b border-[#1e294f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00f3ff]/20 border border-[#00f3ff] flex items-center justify-center">
              <ListOrdered className="w-6 h-6 text-[#00f3ff]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wider uppercase">
                CYBER GUARDIAN MISSION BOARD
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Real code repair, defensive cybersecurity drills, and boss encounters.
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

        {/* Language Filter Chips */}
        <div className="px-6 py-3 bg-[#0a0f24] border-b border-[#1e294f] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Track:
          </span>
          {['all', 'python', 'bash', 'sql', 'cyberdefense', 'network'].map((lang) => (
            <button
              key={lang}
              onClick={() => {
                sounds.playTerminalClick();
                setSelectedLang(lang);
              }}
              className={`px-3 py-1 rounded-lg uppercase font-bold transition-all ${
                selectedLang === lang
                  ? 'bg-[#00f3ff] text-black shadow-[0_0_10px_rgba(0,243,255,0.4)]'
                  : 'bg-[#121a36] text-slate-400 hover:text-white hover:bg-[#1a254d]'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Missions List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3">
          {filteredMissions.map((m) => {
            const isCompleted = player.completedMissions?.includes(m.id);
            const district = CYBER_DISTRICTS.find((d) => d.id === m.districtId);

            return (
              <div
                key={m.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  isCompleted
                    ? 'bg-[#091424] border-[#00ff66]/40 shadow-[0_0_10px_rgba(0,255,102,0.1)]'
                    : m.isBossMission
                    ? 'bg-[#1a0a1e] border-[#ff007f]/60 hover:border-[#ff007f]'
                    : 'bg-[#090e22] border-[#1e294f] hover:border-slate-500'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      style={{ color: district?.color || '#00f3ff' }}
                      className="text-[10px] uppercase font-bold tracking-wider"
                    >
                      {district?.name || m.districtId}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="px-2 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 font-code uppercase">
                      {m.language}
                    </span>
                    {m.isBossMission && (
                      <span className="px-2 py-0.2 rounded text-[10px] bg-[#ff007f]/20 text-[#ff007f] font-bold border border-[#ff007f]/40 uppercase flex items-center gap-1">
                        <Skull className="w-3 h-3" /> BOSS
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-sm tracking-wide flex items-center gap-2">
                    {m.title}
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-[#00ff66]" />}
                  </h3>

                  <p className="text-xs text-slate-300 font-sans mt-0.5 leading-relaxed">
                    {m.summary}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] font-sans">
                    <span className="text-[#ffaa00] font-cyber font-bold">+{m.xpReward} XP</span>
                    <span className="text-[#00f3ff] font-cyber font-bold">+{m.creditsReward} BITS</span>
                    <span className="text-slate-500 font-code">Concept: {m.concept}</span>
                  </div>
                </div>

                {/* Launch Button */}
                <div className="shrink-0 flex items-center">
                  <button
                    onClick={() => handleLaunch(m)}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-cyber font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                      isCompleted
                        ? 'bg-[#10243b] text-[#00ff66] border border-[#00ff66]/40 hover:bg-[#16304f]'
                        : m.isBossMission
                        ? 'bg-gradient-to-r from-[#ff007f] to-[#ffaa00] text-black shadow-[0_0_15px_rgba(255,0,127,0.4)] hover:opacity-95'
                        : 'bg-[#00f3ff] text-black shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:bg-white active:scale-95'
                    }`}
                  >
                    <span>{isCompleted ? 'Review Code' : m.isBossMission ? 'Fight Boss' : 'Start Mission'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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
