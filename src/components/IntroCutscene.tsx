import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/audio';
import { Terminal, ShieldAlert, Cpu, ChevronRight, FastForward } from 'lucide-react';

interface IntroCutsceneProps {
  onComplete: () => void;
}

export const IntroCutscene: React.FC<IntroCutsceneProps> = ({ onComplete }) => {
  const [slide, setSlide] = useState(0);

  const introSlides = [
    {
      title: 'ROSXY: THE CYBERVERSE',
      subtitle: 'LEARN TO CODE. PLAY TO WIN. THINK LIKE A HACKER.',
      body: 'In the year 2099, the Internet did not simply evolve into a network. It became a living, breathing synthetic universe.',
      badge: 'INITIALIZING SYNAPSE LINK',
      color: '#00f3ff',
    },
    {
      title: 'NULL IS AWAKENING',
      subtitle: 'SYSTEM ANOMALY // CODE COLLAPSE',
      body: 'A mysterious rogue entity known only as NULL has begun corrupting core memory partitions. Loops are running wild, firewalls are crumbling, and syntax itself is breaking.',
      badge: 'THREAT LEVEL: CRITICAL',
      color: '#ff007f',
    },
    {
      title: 'MEET BYTE: YOUR SARCASTIC DRONE',
      subtitle: 'AUTONOMOUS REPAIR SYSTEM v4.2',
      body: '"Greetings, rookie! I am BYTE. Your code has three bugs right now. The other seventeen are hiding. But hey, grab your neural deck—we have a universe to save!"',
      badge: 'COMPANION PAIRED',
      color: '#00ff66',
    },
    {
      title: 'YOUR MISSION BEGINS',
      subtitle: 'NEON ACADEMY PROTOCOL',
      body: 'Master real programming languages, investigate digital threats, and stop NULL before the Cyberverse collapses forever.',
      badge: 'READY TO ENGAGE',
      color: '#ffaa00',
    },
  ];

  const current = introSlides[slide];

  useEffect(() => {
    sounds.playCyberBoot();
  }, [slide]);

  const handleNext = () => {
    sounds.playTerminalClick();
    if (slide < introSlides.length - 1) {
      setSlide((s) => s + 1);
    } else {
      sounds.playSuccessFanfare();
      onComplete();
    }
  };

  const handleSkip = () => {
    sounds.playTerminalClick();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black select-none overflow-hidden font-cyber">
      {/* Background Cinematic Visual */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/src/assets/images/hero_cyber_metropolis_1792933230769.jpg"
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
      </div>
      <div className="cyber-scanlines absolute inset-0 opacity-40 pointer-events-none" />

      {/* Skip Button Top Right */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-20 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e162f]/80 border border-slate-700 hover:border-[#00f3ff] text-slate-300 hover:text-white text-xs font-cyber tracking-wider transition-all"
      >
        <FastForward className="w-4 h-4 text-[#00f3ff]" />
        <span>SKIP INTRO</span>
      </button>

      {/* Main Narrative Card */}
      <div className="relative z-10 w-full max-w-2xl p-8 rounded-3xl bg-[#070b1a]/95 border-2 border-[#00f3ff]/40 shadow-[0_0_60px_rgba(0,243,255,0.25)] flex flex-col items-center text-center">
        {/* Status Badge */}
        <div
          style={{ borderColor: current.color, color: current.color }}
          className="px-3 py-1 rounded-full border text-[11px] font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(0,243,255,0.2)]"
        >
          {current.badge}
        </div>

        {/* Title */}
        <h1
          style={{ textShadow: `0 0 20px ${current.color}80` }}
          className="text-3xl md:text-4xl font-extrabold text-white tracking-wider uppercase"
        >
          {current.title}
        </h1>

        <p className="text-xs md:text-sm text-[#00f3ff] font-sans font-bold uppercase tracking-widest mt-1 mb-6">
          {current.subtitle}
        </p>

        {/* Narrative Text */}
        <div className="p-6 rounded-2xl bg-[#04060e] border border-[#1e294f] text-slate-200 text-sm md:text-base leading-relaxed font-sans max-w-lg mb-8">
          {current.body}
        </div>

        {/* Progress Dots & Next Button */}
        <div className="w-full flex items-center justify-between pt-2">
          <div className="flex gap-2">
            {introSlides.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  slide === i ? 'w-8 bg-[#00f3ff]' : 'w-2.5 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00f3ff] to-[#0077ff] text-black font-cyber font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)]"
          >
            <span>{slide === introSlides.length - 1 ? 'Start Career' : 'Continue'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
