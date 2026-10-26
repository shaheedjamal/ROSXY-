import React from 'react';
import { PlayerStats, LanguageId } from '../types/game';
import { LANGUAGE_CATALOG } from '../data/languages';
import { sounds } from '../utils/audio';
import { 
  Play, 
  Code2, 
  Compass, 
  ShieldAlert, 
  Trophy, 
  Flame, 
  Heart, 
  Zap, 
  Sparkles, 
  ChevronRight, 
  Pin,
  HelpCircle,
  Volume2,
  VolumeX,
  User
} from 'lucide-react';

interface HomeScreenProps {
  player: PlayerStats;
  onPlayNow: () => void;
  onChooseLanguage: () => void;
  onExploreCyberverse: () => void;
  onCyberSecurity: () => void;
  onMyProgress: () => void;
  onSelectLanguage: (langId: LanguageId) => void;
  onOpenProfile: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  player,
  onPlayNow,
  onChooseLanguage,
  onExploreCyberverse,
  onCyberSecurity,
  onMyProgress,
  onSelectLanguage,
  onOpenProfile,
}) => {
  const [isMuted, setIsMuted] = React.useState(sounds.getIsMuted());

  const toggleAudio = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  // Get pinned language data (default to python, javascript, cybersecurity if none)
  const pinnedIds = (player.pinnedLanguages && player.pinnedLanguages.length > 0)
    ? player.pinnedLanguages
    : ['python', 'javascript', 'cybersecurity'];

  const pinnedLangs = pinnedIds
    .map((id) => LANGUAGE_CATALOG.find((l) => l.id === id))
    .filter(Boolean);

  const beginnerTracks = [
    {
      id: 'python' as LanguageId,
      name: 'Python',
      label: 'Beginner-Friendly Programming',
      color: '#34d399',
    },
    {
      id: 'c' as LanguageId,
      name: 'C',
      label: 'Programming Fundamentals',
      color: '#38bdf8',
    },
    {
      id: 'javascript' as LanguageId,
      name: 'HTML, CSS & JavaScript',
      label: 'Build Websites & Interfaces',
      color: '#facc15',
    },
    {
      id: 'cybersecurity' as LanguageId,
      name: 'Cybersecurity Basics',
      label: 'Learn to Protect Systems',
      color: '#ef4444',
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-y-auto bg-[#050814] text-white font-cyber select-none flex flex-col justify-between">
      {/* Cinematic Cyber Metropolis Background with Measured Contrast Scrim */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src="/src/assets/images/hero_cyber_metropolis_1792933230769.jpg"
          alt="ROSXY Cyberverse Metropolis"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-[#050814]/75 to-[#050814]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050814_80%)]" />
      </div>
      <div className="cyber-scanlines fixed inset-0 opacity-20 pointer-events-none z-0" />

      {/* TOP HEADER: Player Identity, Streak, Energy & Audio */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-[#141e3a]/90 bg-[#080d22]/80 backdrop-blur-md">
        {/* Logo & Handle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f3ff]/25 to-[#ff007f]/25 border border-[#00f3ff] flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.35)]">
            <span className="font-extrabold text-[#00f3ff] text-base tracking-tighter">RX</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-wider">ROSXY</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#00f3ff]/15 text-[#00f3ff] border border-[#00f3ff]/30 uppercase font-bold">
                Cyberverse
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Learn to Code. Play to Win. Think Like a Hacker.
            </p>
          </div>
        </div>

        {/* Stats Pill / Audio */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak */}
          <div 
            onMouseEnter={() => sounds.playHoverChirp()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e1633]/90 border border-[#ffaa00]/40 text-xs shadow-[0_0_12px_rgba(255,170,0,0.15)]"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-amber-300 font-bold tabular-nums">{player.streakDays} Day Streak</span>
          </div>

          {/* Energy */}
          <div 
            onMouseEnter={() => sounds.playHoverChirp()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e1633]/90 border border-[#ff007f]/40 text-xs shadow-[0_0_12px_rgba(255,0,127,0.15)]"
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="text-rose-300 font-bold tabular-nums">{player.energy}/{player.maxEnergy}</span>
          </div>

          {/* Profile Button with Guardian Portrait */}
          <button
            onClick={() => {
              sounds.playTerminalClick();
              onOpenProfile();
            }}
            onMouseEnter={() => sounds.playHoverChirp()}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#0e1633]/90 border border-[#1e2a4a] hover:border-[#00f3ff] text-slate-300 hover:text-white transition-all text-xs"
          >
            <div className="w-6 h-6 rounded-lg overflow-hidden border border-[#00f3ff]/50 shrink-0 bg-[#050814]">
              <img
                src="/src/assets/images/cyber_guardian_rig_1792933230818.jpg"
                alt="Guardian Portrait"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden sm:inline font-bold">{player.handle}</span>
            <span className="text-[10px] text-[#00ff66]">LVL {player.level}</span>
          </button>

          {/* Audio Mute */}
          <button
            onClick={toggleAudio}
            onMouseEnter={() => sounds.playHoverChirp()}
            className="p-2 rounded-xl bg-[#0e1633]/90 border border-[#1e2a4a] hover:border-slate-500 text-slate-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#00f3ff]" />}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 flex-1 flex flex-col justify-center">
        {/* BIG HERO CARD: PLAY NOW (Immediate 1-tap mission continuation) */}
        <div className="relative mb-6 p-6 sm:p-8 rounded-3xl bg-[#090f28e6] border-2 border-[#00f3ff] shadow-[0_0_50px_rgba(0,243,255,0.25)] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden backdrop-blur-md">
          {/* Subtle Ambient City Backdrop */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <img
              src="/src/assets/images/hero_cyber_metropolis_1792933230769.jpg"
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f3ff]/15 border border-[#00f3ff]/40 text-[#00f3ff] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Continue Career // Ready To Code</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide uppercase">
              READY FOR YOUR NEXT HACK?
            </h1>
            <p className="text-slate-300 font-sans text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Resume your training with <span className="text-[#00f3ff] font-cyber font-bold uppercase">{player.recentLanguage || 'Python'}</span>. 
              Repair malfunctioning robots, defeat corrupted district bosses, and level up your cyber skills!
            </p>

            {/* Quick Pinned Languages Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2 justify-center md:justify-start">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-bold">
                <Pin className="w-3.5 h-3.5 text-[#ffaa00]" /> PINNED:
              </span>
              {pinnedLangs.map((l) => (
                <button
                  key={l!.id}
                  onClick={() => {
                    sounds.playTerminalClick();
                    onSelectLanguage(l!.id);
                  }}
                  onMouseEnter={() => sounds.playHoverChirp()}
                  style={{ borderColor: l!.color }}
                  className="px-3 py-1.5 rounded-xl bg-[#080d20] border text-xs font-bold text-white hover:bg-white hover:text-black transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span style={{ color: l!.color }}>{l!.symbol}</span>
                  <span>{l!.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* BIG PLAY NOW BUTTON */}
          <div className="relative z-10 shrink-0 w-full md:w-auto flex flex-col items-center">
            <button
              onClick={() => {
                sounds.playLaserShot();
                onPlayNow();
              }}
              onMouseEnter={() => sounds.playHoverChirp()}
              className="w-full md:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-[#00f3ff] via-[#00c8ff] to-[#00ff66] text-black font-cyber font-extrabold text-lg sm:text-xl uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(0,243,255,0.7)] flex items-center justify-center gap-3"
            >
              <Play className="w-7 h-7 fill-black" />
              <span>PLAY NOW</span>
            </button>
            <span className="text-[11px] text-[#00f3ff] font-sans mt-2 tracking-wide">
              Tap to jump straight into action!
            </span>
          </div>
        </div>

        {/* 4 CORE NAVIGATION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* CHOOSE LANGUAGE */}
          <button
            onClick={() => {
              sounds.playTerminalClick();
              onChooseLanguage();
            }}
            className="group p-5 rounded-2xl bg-[#090e24] hover:bg-[#0f1738] border border-[#1e2a4a] hover:border-[#00f3ff] transition-all text-left flex flex-col justify-between shadow-lg active:scale-98"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00f3ff]/15 border border-[#00f3ff]/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6 text-[#00f3ff]" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base tracking-wider uppercase">
                  CHOOSE LANGUAGE
                </h3>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#00f3ff] transition-colors" />
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1">
                20+ tracks: Python, C, C++, JavaScript, Rust, SQL, and more.
              </p>
            </div>
          </button>

          {/* EXPLORE CYBERVERSE */}
          <button
            onClick={() => {
              sounds.playTerminalClick();
              onExploreCyberverse();
            }}
            onMouseEnter={() => sounds.playHoverChirp()}
            className="group p-5 rounded-2xl bg-[#090e24]/90 hover:bg-[#0f1738] border border-[#1e2a4a] hover:border-[#38bdf8] transition-all text-left flex flex-col justify-between shadow-lg active:scale-98 backdrop-blur-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/15 border border-[#38bdf8]/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6 text-[#38bdf8]" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base tracking-wider uppercase">
                  EXPLORE CITY
                </h3>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#38bdf8] transition-colors" />
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1">
                3D cyberpunk RPG exploration, interactive terminals, and bots.
              </p>
            </div>
          </button>

          {/* CYBER SECURITY */}
          <button
            onClick={() => {
              sounds.playTerminalClick();
              onCyberSecurity();
            }}
            onMouseEnter={() => sounds.playHoverChirp()}
            className="group relative p-5 rounded-2xl bg-[#090e24]/90 hover:bg-[#1a0f28] border border-[#1e2a4a] hover:border-[#ef4444] transition-all text-left flex flex-col justify-between shadow-lg active:scale-98 overflow-hidden backdrop-blur-sm"
          >
            {/* Subtle Matrix Artwork Scrim */}
            <div className="absolute inset-0 opacity-15 pointer-events-none group-hover:opacity-25 transition-opacity">
              <img
                src="/src/assets/images/cyber_defense_matrix_1792933230698.jpg"
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 w-12 h-12 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6 text-[#ef4444]" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base tracking-wider uppercase">
                  CYBER SECURITY
                </h3>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#ef4444] transition-colors" />
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Phishing forensics, firewalls, threat modeling, and zero trust.
              </p>
            </div>
          </button>

          {/* MY PROGRESS */}
          <button
            onClick={() => {
              sounds.playTerminalClick();
              onMyProgress();
            }}
            onMouseEnter={() => sounds.playHoverChirp()}
            className="group p-5 rounded-2xl bg-[#090e24]/90 hover:bg-[#18122c] border border-[#1e2a4a] hover:border-[#ffaa00] transition-all text-left flex flex-col justify-between shadow-lg active:scale-98 backdrop-blur-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-[#ffaa00]/15 border border-[#ffaa00]/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-[#ffaa00]" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base tracking-wider uppercase">
                  MY PROGRESS
                </h3>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#ffaa00] transition-colors" />
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Skill trees, badges, stats, and achievements.
              </p>
            </div>
          </button>
        </div>

        {/* CLEAR BEGINNER EXPERIENCE: "NEW TO CODING? START HERE" */}
        <div className="p-5 rounded-2xl bg-[#080d22] border border-[#1e294f] shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#00f3ff]" />
              <span className="font-bold text-xs uppercase tracking-wider text-[#00f3ff]">
                NEW TO CODING? START HERE
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-sans">
              No experience required • Zero setup • 1-tap start
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {beginnerTracks.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  sounds.playTerminalClick();
                  onSelectLanguage(b.id);
                }}
                className="p-3 rounded-xl bg-[#060a1a] hover:bg-[#0e1633] border border-[#1b2645] hover:border-slate-500 text-left transition-all flex flex-col justify-between"
              >
                <div>
                  <span
                    style={{ color: b.color }}
                    className="font-bold text-sm block"
                  >
                    {b.name}
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                    {b.label}
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-[#00f3ff] font-bold flex items-center gap-1">
                  <span>Start Track</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="relative z-10 w-full px-4 sm:px-8 py-3 border-t border-[#141e3a]/80 bg-[#080d22]/70 backdrop-blur-md flex flex-wrap items-center justify-between text-xs text-slate-400 font-sans">
        <div>
          ROSXY: The Cyberverse v2.4 • Offline-Ready • Guest Mode Enabled
        </div>
        <div className="flex items-center gap-4 text-[11px] font-cyber text-slate-400">
          <span>{player.credits} CYBER-BITS</span>
          <span>•</span>
          <span>{player.completedMissions.length} MISSIONS COMPLETED</span>
        </div>
      </footer>
    </div>
  );
};
