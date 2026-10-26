import React, { useState } from 'react';
import { PlayerStats } from '../types/game';
import { sounds } from '../utils/audio';
import { 
  Terminal, 
  MapPin, 
  GitBranch, 
  User, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  Flame, 
  Heart, 
  Shield, 
  Compass, 
  ListOrdered,
  Home,
  Code2
} from 'lucide-react';

interface HudAndDockProps {
  player: PlayerStats;
  currentDistrictName: string;
  onOpenMissions: () => void;
  onOpenPlayground: () => void;
  onOpenMap: () => void;
  onOpenSkills: () => void;
  onOpenProfile: () => void;
  onGoHome: () => void;
  onChooseLanguage: () => void;
}

export const HudAndDock: React.FC<HudAndDockProps> = ({
  player,
  currentDistrictName,
  onOpenMissions,
  onOpenPlayground,
  onOpenMap,
  onOpenSkills,
  onOpenProfile,
  onGoHome,
  onChooseLanguage,
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleAudio = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const xpPercentage = Math.min(100, Math.floor(((player.xp % player.xpToNextLevel) / player.xpToNextLevel) * 100));

  return (
    <>
      {/* Top Header / Spec Badge (Top-Left and Top-Right) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 select-none pointer-events-auto">
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#090d20e6] border border-[#00f3ff]/40 shadow-[0_0_15px_rgba(0,243,255,0.2)] font-cyber">
          {/* Avatar Icon */}
          <button
            onClick={onOpenProfile}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f3ff]/20 to-[#0077ff]/20 border border-[#00f3ff] flex items-center justify-center text-[#00f3ff] hover:scale-105 active:scale-95 transition-transform"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Player Identity & Level */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm tracking-wider">
                {player.handle}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#00f3ff]/15 text-[#00f3ff] font-bold border border-[#00f3ff]/30">
                LVL {player.level}
              </span>
            </div>

            {/* XP Mini Bar */}
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 h-1.5 rounded-full bg-[#1b2545] overflow-hidden">
                <div
                  style={{ width: `${xpPercentage}%` }}
                  className="h-full bg-gradient-to-r from-[#00f3ff] to-[#00ff66]"
                />
              </div>
              <span className="text-[10px] text-slate-400 font-sans">{player.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Home Button */}
        <button
          onClick={() => {
            sounds.playTerminalClick();
            onGoHome();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#090d20e6] border border-[#00f3ff]/40 hover:bg-[#00f3ff]/20 text-[#00f3ff] text-xs font-cyber font-bold transition-all shadow-[0_0_10px_rgba(0,243,255,0.2)]"
          title="Return to Home Screen"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">HOME</span>
        </button>

        {/* Current Location Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#090d20e6] border border-[#1e294f] text-xs font-cyber text-slate-300">
          <Compass className="w-4 h-4 text-[#00f3ff]" />
          <span>{currentDistrictName}</span>
        </div>
      </div>

      {/* Top-Right Duolingo Stats Bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 select-none pointer-events-auto">
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#090d20e6] border border-[#ffaa00]/40 text-xs font-cyber shadow-[0_0_10px_rgba(255,170,0,0.15)]">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-amber-300 font-bold">{player.streakDays}</span>
        </div>

        {/* Hearts / Energy */}
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#090d20e6] border border-[#ff007f]/40 text-xs font-cyber shadow-[0_0_10px_rgba(255,0,127,0.15)]">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span className="text-rose-300 font-bold">{player.energy}</span>
        </div>

        {/* Cyber-Bits */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#090d20e6] border border-[#00ff66]/40 text-xs font-cyber shadow-[0_0_10px_rgba(0,255,102,0.15)]">
          <span className="text-[#00ff66] font-bold">{player.credits} BITS</span>
        </div>

        {/* Audio Mute Button */}
        <button
          onClick={toggleAudio}
          className="p-2 rounded-2xl bg-[#090d20e6] border border-slate-700 hover:border-slate-400 text-slate-300 hover:text-white transition-all"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#00f3ff]" />}
        </button>
      </div>

      {/* Ergonomic Collapsible Bottom Control Dock */}
      <div
        style={{
          transform: `translateX(-50%) translateY(${isDockCollapsed ? 'calc(100% - 24px)' : '0px'})`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="fixed bottom-3 left-1/2 z-30 w-[94vw] max-w-[840px] flex flex-col items-center pointer-events-auto select-none"
      >
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => {
            sounds.playTerminalClick();
            setIsDockCollapsed(!isDockCollapsed);
          }}
          className="px-4 py-1 rounded-t-xl bg-[#090d20] border-t border-x border-[#00f3ff]/40 text-[#00f3ff] text-[11px] font-cyber font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-[#121a36] shadow-[0_-4px_10px_rgba(0,243,255,0.15)] transition-all"
        >
          {isDockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Show Cyber Dock</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Cinema Mode (H)</span>
            </>
          )}
        </button>

        {/* Dock Navigation Bar */}
        <div className="w-full p-2 rounded-2xl bg-[#080c1df0] border border-[#00f3ff]/40 shadow-[0_0_25px_rgba(0,243,255,0.2)] flex items-center justify-between gap-1 sm:gap-2 font-cyber">
          {/* Home Button */}
          <button
            onClick={() => {
              sounds.playTerminalClick();
              onGoHome();
            }}
            className="flex-1 py-2 sm:py-2.5 px-2 rounded-xl bg-[#0f1733] hover:bg-[#17234d] border border-transparent hover:border-[#00f3ff]/40 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-slate-200 hover:text-white transition-all active:scale-95"
          >
            <Home className="w-4 h-4 text-[#00f3ff]" />
            <span className="text-[11px] font-bold uppercase">Home</span>
          </button>

          {/* Languages Button */}
          <button
            onClick={() => {
              sounds.playTerminalClick();
              onChooseLanguage();
            }}
            className="flex-1 py-2 sm:py-2.5 px-2 rounded-xl bg-[#0f1733] hover:bg-[#17234d] border border-transparent hover:border-[#00f3ff]/40 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-slate-200 hover:text-white transition-all active:scale-95"
          >
            <Code2 className="w-4 h-4 text-[#38bdf8]" />
            <span className="text-[11px] font-bold uppercase">Languages</span>
          </button>

          {/* Quests Button */}
          <button
            onClick={() => {
              sounds.playTerminalClick();
              onOpenMissions();
            }}
            className="flex-1 py-2 sm:py-2.5 px-2 rounded-xl bg-[#0f1733] hover:bg-[#17234d] border border-transparent hover:border-[#00f3ff]/40 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-slate-200 hover:text-white transition-all active:scale-95"
          >
            <ListOrdered className="w-4 h-4 text-[#00f3ff]" />
            <span className="text-[11px] font-bold uppercase">Missions</span>
          </button>

          {/* Code Playground Button */}
          <button
            onClick={() => {
              sounds.playTerminalClick();
              onOpenPlayground();
            }}
            className="flex-1 py-2 sm:py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#00f3ff]/20 to-[#0077ff]/20 hover:from-[#00f3ff]/30 hover:to-[#0077ff]/30 border border-[#00f3ff] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-[#00f3ff] hover:text-white transition-all active:scale-95 shadow-[0_0_12px_rgba(0,243,255,0.25)]"
          >
            <Terminal className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase">Code Deck</span>
          </button>

          {/* World Map Button */}
          <button
            onClick={() => {
              sounds.playTerminalClick();
              onOpenMap();
            }}
            className="flex-1 py-2 sm:py-2.5 px-2 rounded-xl bg-[#0f1733] hover:bg-[#17234d] border border-transparent hover:border-[#00f3ff]/40 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-slate-200 hover:text-white transition-all active:scale-95"
          >
            <MapPin className="w-4 h-4 text-[#ff007f]" />
            <span className="text-[11px] font-bold uppercase">Districts</span>
          </button>

          {/* Skill Tree Button */}
          <button
            onClick={() => {
              sounds.playTerminalClick();
              onOpenSkills();
            }}
            className="flex-1 py-2 sm:py-2.5 px-2 rounded-xl bg-[#0f1733] hover:bg-[#17234d] border border-transparent hover:border-[#00f3ff]/40 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-slate-200 hover:text-white transition-all active:scale-95"
          >
            <GitBranch className="w-4 h-4 text-[#ffaa00]" />
            <span className="text-[11px] font-bold uppercase">Skills</span>
          </button>

          {/* Cyber Gear Button */}
          <button
            onClick={() => {
              sounds.playTerminalClick();
              onOpenProfile();
            }}
            className="flex-1 py-2 sm:py-2.5 px-2 rounded-xl bg-[#0f1733] hover:bg-[#17234d] border border-transparent hover:border-[#00f3ff]/40 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-slate-200 hover:text-white transition-all active:scale-95"
          >
            <Shield className="w-4 h-4 text-[#00ff66]" />
            <span className="text-[11px] font-bold uppercase">Gear</span>
          </button>
        </div>
      </div>
    </>
  );
};
