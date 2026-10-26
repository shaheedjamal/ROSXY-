import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { Bot, MessageSquare, Sparkles, X } from 'lucide-react';

interface ByteCompanionProps {
  onDismiss?: () => void;
}

export const ByteCompanion: React.FC<ByteCompanionProps> = () => {
  const [currentRoast, setCurrentRoast] = useState<string>(
    'Tip: Semicolons and missing quotes are like ninjas in your code. They only reveal themselves when everything breaks.'
  );
  const [isOpen, setIsOpen] = useState(false);

  const byteJokes = [
    'Your code has three bugs. Correct: the other seventeen are hiding.',
    'The boss has 9,000 health. Have you tried reading the error message?',
    'There are 10 types of people in the Cyberverse: those who understand binary, and those who get tricked by NULL.',
    'A programmer had a problem. He used regular expressions. Now he has two problems.',
    'Why do Python programmers have great eyesight? Because they don\'t C#.',
    'Knock knock. Who\'s there? ...very long pause... Java.',
    'NULL walked into a bar. The bar crashed with a NullPointerException.',
    'If at first you don\'t succeed, call it version 1.0 and deploy it anyway.',
    'Keep your clearance level high and your passwords salty. Defense City rules!',
  ];

  const handlePokeByte = () => {
    sounds.playByteChirp();
    const nextJoke = byteJokes[Math.floor(Math.random() * byteJokes.length)];
    setCurrentRoast(nextJoke);
    setIsOpen(true);
  };

  return (
    <div className="fixed bottom-20 left-4 z-30 select-none pointer-events-auto font-cyber">
      {/* Speech Bubble */}
      {isOpen && (
        <div className="mb-2 max-w-xs p-3.5 rounded-2xl bg-[#090e24f0] border border-[#00f3ff] text-slate-200 shadow-[0_0_20px_rgba(0,243,255,0.3)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between text-[11px] text-[#00f3ff] font-bold pb-1 border-b border-[#1e294f] mb-1.5">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> BYTE Companion
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs font-sans italic leading-relaxed text-slate-100">
            &ldquo;{currentRoast}&rdquo;
          </p>
        </div>
      )}

      {/* Floating BYTE Trigger Button */}
      <button
        onClick={handlePokeByte}
        className="group relative flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0a0f26e6] border border-[#00f3ff]/50 hover:border-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.25)] hover:shadow-[0_0_25px_rgba(0,243,255,0.5)] transition-all active:scale-95"
      >
        <div className="relative w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1e294b] to-[#00f3ff] flex items-center justify-center text-black">
          <Bot className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00ff66]" />
        </div>
        <div className="text-left hidden sm:block">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block leading-none">
            COMPANION
          </span>
          <span className="text-xs font-bold text-[#00f3ff] leading-tight">
            BYTE v4.2
          </span>
        </div>
      </button>
    </div>
  );
};
