import React, { useState } from 'react';
import { LanguageId, LanguageCategory, PlayerStats } from '../types/game';
import { LANGUAGE_CATALOG } from '../data/languages';
import { sounds } from '../utils/audio';
import { 
  Search, 
  X, 
  Code2, 
  Pin, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Bot,
  Filter
} from 'lucide-react';

interface LanguageSelectorModalProps {
  player: PlayerStats;
  onSelectLanguage: (langId: LanguageId) => void;
  onTogglePin: (langId: LanguageId) => void;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  player,
  onSelectLanguage,
  onTogglePin,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [byteQuip, setByteQuip] = useState<string>(
    'Select any programming language to calibrate your neural workstation!'
  );

  const filters: (string | LanguageCategory)[] = [
    'All',
    'Beginner',
    'Intermediate',
    'Advanced',
    'Web Development',
    'App Development',
    'Game Development',
    'AI and Data',
    'Cybersecurity',
  ];

  const filteredLanguages = LANGUAGE_CATALOG.filter((lang) => {
    const matchesSearch =
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.symbol.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'All') return true;
    return lang.categories.includes(selectedFilter as LanguageCategory);
  });

  const handleCardClick = (lang: typeof LANGUAGE_CATALOG[0]) => {
    sounds.playByteChirp();
    setByteQuip(lang.byteQuip);
    onSelectLanguage(lang.id);
  };

  const handlePinClick = (e: React.MouseEvent, langId: LanguageId) => {
    e.stopPropagation();
    sounds.playTerminalClick();
    onTogglePin(langId);
  };

  const pinnedSet = new Set(player.pinnedLanguages || []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md select-none overflow-hidden font-cyber">
      <div className="relative w-full max-w-6xl h-[92vh] flex flex-col bg-[#070b1a] border-2 border-[#00f3ff] rounded-3xl shadow-[0_0_50px_rgba(0,243,255,0.3)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0d152e] border-b border-[#1e294f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00f3ff]/20 border border-[#00f3ff] flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)]">
              <Code2 className="w-6 h-6 text-[#00f3ff]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wider uppercase">
                CYBERVERSE LANGUAGE REPOSITORY
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Choose a programming language or security track. Learn by solving real missions.
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

        {/* BYTE Quip Bar */}
        <div className="px-6 py-2.5 bg-[#0a1024] border-b border-[#1e294f] flex items-center gap-3">
          <div className="relative w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1e294b] to-[#00f3ff] flex items-center justify-center text-black shrink-0">
            <Bot className="w-4 h-4 text-black" />
          </div>
          <p className="text-xs text-[#00f3ff] font-sans italic truncate">
            &ldquo;{byteQuip}&rdquo;
          </p>
        </div>

        {/* Search Bar & Category Filter Pills */}
        <div className="px-6 py-3.5 bg-[#090e24] border-b border-[#1e294f] flex flex-col gap-3">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any language (Python, C, JavaScript, Rust, SQL, Bash...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#060a18] border border-[#1e294f] text-[#00f3ff] placeholder-slate-500 font-code text-xs outline-none focus:border-[#00f3ff]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => {
                  sounds.playTerminalClick();
                  setSelectedFilter(f);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap uppercase transition-all ${
                  selectedFilter === f
                    ? 'bg-[#00f3ff] text-black shadow-[0_0_12px_rgba(0,243,255,0.4)]'
                    : 'bg-[#0e1633] text-slate-400 hover:text-white hover:bg-[#152047]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Language Cards Grid */}
        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLanguages.map((lang) => {
            const isPinned = pinnedSet.has(lang.id);
            const isRecent = player.recentLanguage === lang.id;
            const progress = player.languageProgress?.[lang.id] || { completedCount: 0, currentLevel: 1, xp: 0 };

            return (
              <div
                key={lang.id}
                onClick={() => handleCardClick(lang)}
                onMouseEnter={() => sounds.playHoverChirp()}
                style={{ borderColor: isRecent ? lang.color : '#1e294f' }}
                className={`group relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isRecent
                    ? 'bg-[#0e1633] shadow-[0_0_20px_rgba(0,243,255,0.2)]'
                    : 'bg-[#080d22] hover:bg-[#0c1433] hover:border-slate-500'
                }`}
              >
                <div>
                  {/* Top Bar: Symbol Badge + Pin Toggle + Difficulty */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        style={{ backgroundColor: `${lang.color}20`, borderColor: lang.color, color: lang.color }}
                        className="w-11 h-11 rounded-xl border flex items-center justify-center font-code font-bold text-base shadow-[0_0_12px_rgba(0,0,0,0.5)]"
                      >
                        {lang.symbol}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-white text-base tracking-wide">
                            {lang.name}
                          </h3>
                          {isRecent && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00f3ff]/20 text-[#00f3ff] font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-sans block">
                          {lang.difficulty} Level
                        </span>
                      </div>
                    </div>

                    {/* Pin button */}
                    <button
                      type="button"
                      onClick={(e) => handlePinClick(e, lang.id)}
                      className={`p-2 rounded-xl border transition-all ${
                        isPinned
                          ? 'bg-[#ffaa00]/20 border-[#ffaa00] text-[#ffaa00] shadow-[0_0_10px_rgba(255,170,0,0.3)]'
                          : 'border-transparent text-slate-600 hover:text-slate-300'
                      }`}
                      title={isPinned ? 'Unpin from home' : 'Pin to home screen'}
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tagline */}
                  <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
                    {lang.tagline}
                  </p>

                  {/* Categories Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {lang.categories.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-md bg-[#050814] text-slate-400 text-[10px] font-sans border border-[#17203b]"
                      >
                        {c}
                      </span>
                    ))}
                    {!lang.isFullyImplemented && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-sans border border-amber-500/30">
                        Roadmap Track
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress & Start Button */}
                <div className="pt-3 border-t border-[#1a233d] flex items-center justify-between">
                  <div className="text-[11px] font-sans text-slate-400">
                    <span className="text-[#00ff66] font-cyber font-bold">
                      {progress.completedCount} Missions
                    </span>
                    <span className="text-slate-500"> / {lang.totalMissions}</span>
                  </div>

                  <span className="text-xs font-bold text-[#00f3ff] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Open Dashboard</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
