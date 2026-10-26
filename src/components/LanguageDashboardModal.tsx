import React, { useState } from 'react';
import { LanguageTrackInfo, PlayerStats, CodeMission } from '../types/game';
import { CODE_MISSIONS } from '../data/curriculum';
import { sounds } from '../utils/audio';
import { 
  Play, 
  BookOpen, 
  Trophy, 
  Compass, 
  X, 
  Sparkles, 
  Bot, 
  CheckCircle2, 
  HelpCircle,
  Code2,
  ChevronRight
} from 'lucide-react';

interface LanguageDashboardModalProps {
  language: LanguageTrackInfo;
  player: PlayerStats;
  onStartMission: (mission: CodeMission) => void;
  onExploreDistrict: (districtId: string) => void;
  onClose: () => void;
}

export const LanguageDashboardModal: React.FC<LanguageDashboardModalProps> = ({
  language,
  player,
  onStartMission,
  onExploreDistrict,
  onClose,
}) => {
  const [showTutorial, setShowTutorial] = useState(false);

  // Find missions for this language or district
  const languageMissions = CODE_MISSIONS.filter(
    (m) => m.language === language.id || m.districtId === language.districtId
  );

  // Next available uncompleted mission or first
  const nextMission = languageMissions.find(
    (m) => !player.completedMissions?.includes(m.id)
  ) || languageMissions[0] || CODE_MISSIONS[0];

  const completedCount = languageMissions.filter(
    (m) => player.completedMissions?.includes(m.id)
  ).length;

  const progressPercent = languageMissions.length > 0
    ? Math.round((completedCount / languageMissions.length) * 100)
    : 0;

  const handleStartLearning = () => {
    sounds.playLaserShot();
    onStartMission(nextMission);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md select-none overflow-hidden font-cyber">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#070b1a] border-2 border-[#00f3ff] rounded-3xl shadow-[0_0_50px_rgba(0,243,255,0.3)] overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#0d152e] border-b border-[#1e294f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: `${language.color}20`, borderColor: language.color, color: language.color }}
              className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-code font-bold text-lg shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
              {language.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wider uppercase">
                  {language.name} DASHBOARD
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#00f3ff]/20 text-[#00f3ff] font-bold border border-[#00f3ff]/40 uppercase">
                  {language.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                {language.tagline}
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

        {/* BYTE Witty Speech Banner */}
        <div className="px-6 py-3 bg-[#0a1126] border-b border-[#1e294f] flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1e294b] to-[#00f3ff] flex items-center justify-center text-black shrink-0">
            <Bot className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] text-[#00f3ff] font-bold uppercase tracking-wider block">
              BYTE COMPANION
            </span>
            <p className="text-xs text-slate-200 font-sans italic">
              &ldquo;{language.byteQuip}&rdquo;
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Top Progress & Large START LEARNING Button */}
          <div className="p-6 rounded-2xl bg-[#090e24] border border-[#1e294f] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">
                NEXT RECOMMENDED OBJECTIVE
              </span>
              <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                {nextMission.title}
                {player.completedMissions?.includes(nextMission.id) && (
                  <CheckCircle2 className="w-4 h-4 text-[#00ff66]" />
                )}
              </h3>
              <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                {nextMission.storyContext || nextMission.summary}
              </p>

              {/* Progress bar */}
              <div className="mt-4 flex items-center gap-3">
                <div className="w-40 h-2 rounded-full bg-[#050814] overflow-hidden border border-[#1e294f]">
                  <div
                    style={{ width: `${progressPercent}%`, backgroundColor: language.color }}
                    className="h-full transition-all duration-300"
                  />
                </div>
                <span className="text-xs text-slate-300 font-sans">
                  {completedCount}/{languageMissions.length || language.totalMissions} Completed ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* LARGE START LEARNING BUTTON */}
            <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
              <button
                onClick={handleStartLearning}
                onMouseEnter={() => sounds.playHoverChirp()}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00f3ff] via-[#00c8ff] to-[#00ff66] text-black font-cyber font-extrabold text-base uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_35px_rgba(0,243,255,0.6)] flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>START LEARNING</span>
              </button>

              <button
                onClick={() => {
                  sounds.playTerminalClick();
                  onExploreDistrict(language.districtId);
                  onClose();
                }}
                onMouseEnter={() => sounds.playHoverChirp()}
                className="px-4 py-2 rounded-xl bg-[#070b19] border border-[#1e294f] hover:border-slate-400 text-slate-300 hover:text-white text-xs font-cyber flex items-center justify-center gap-1.5 transition-all"
              >
                <Compass className="w-3.5 h-3.5 text-[#00f3ff]" />
                <span>Explore {language.name} District</span>
              </button>
            </div>
          </div>

          {/* Quick Overview & Code Snippet Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Why Learn */}
            <div className="p-5 rounded-2xl bg-[#080d22] border border-[#1e294f]">
              <span className="text-xs text-[#00f3ff] font-bold uppercase tracking-wider block mb-2">
                WHY LEARN {language.name.toUpperCase()}?
              </span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
                {language.whyLearn}
              </p>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {language.description}
              </p>
            </div>

            {/* Starter Code Preview */}
            <div className="p-5 rounded-2xl bg-[#080d22] border border-[#1e294f] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#00ff66] font-bold uppercase tracking-wider">
                    STARTER SYNTAX PREVIEW
                  </span>
                  <span className="text-[10px] text-slate-500 font-code">read-only</span>
                </div>
                <pre className="p-3 rounded-xl bg-[#04060e] border border-[#1e294f] text-slate-200 font-code text-xs overflow-x-auto whitespace-pre leading-relaxed">
                  {language.starterCodeSample}
                </pre>
              </div>

              {/* Beginner Tutorial Toggle */}
              {language.tutorialSteps && (
                <button
                  onClick={() => setShowTutorial(!showTutorial)}
                  className="mt-3 text-xs text-[#ffaa00] hover:underline flex items-center gap-1 font-sans"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showTutorial ? 'Hide beginner tutorial' : 'New to this language? View 30-second tutorial'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Beginner Tutorial Accordion */}
          {showTutorial && language.tutorialSteps && (
            <div className="p-5 rounded-2xl bg-[#101730] border border-[#ffaa00]/40 animate-in fade-in duration-200">
              <h4 className="text-sm font-bold text-[#ffaa00] uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#ffaa00]" />
                <span>{language.name} 30-Second Fast Track:</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-200 font-sans list-disc list-inside leading-relaxed">
                {language.tutorialSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
