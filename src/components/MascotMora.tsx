import React, { useState } from 'react';
import { Sparkles, MessageCircle, Volume2 } from 'lucide-react';
import { sound } from '../utils/audio';
import { MORA_WISDOM_TIPS } from '../data/catalog';

export const MascotMora: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleMascotClick = () => {
    sound.playPop();
    const nextIndex = (tipIndex + 1) % MORA_WISDOM_TIPS.length;
    setTipIndex(nextIndex);
    setIsOpen(true);
    sound.speak(`Mora says: ${MORA_WISDOM_TIPS[nextIndex]}`);
  };

  const currentTip = MORA_WISDOM_TIPS[tipIndex];

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 max-w-xs sm:max-w-sm p-4 bg-white rounded-2xl shadow-xl border-2 border-amber-300 text-slate-800 text-sm relative animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-fredoka text-amber-700 font-bold flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              Mora's Wonder Fact
            </span>
            <button
              onClick={() => sound.speak(currentTip)}
              className="text-amber-600 hover:text-amber-800 p-1 rounded-md"
              title="Hear tip aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="font-medium text-slate-700 leading-snug">{currentTip}</p>
          <div className="mt-2.5 flex justify-between items-center pt-2 border-t border-amber-100">
            <button
              onClick={handleMascotClick}
              className="text-xs text-amber-600 font-semibold hover:underline cursor-pointer"
            >
              Next fun fact →
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Close
            </button>
          </div>
          {/* Speech bubble beak */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r-2 border-b-2 border-amber-300 transform rotate-45" />
        </div>
      )}

      {/* Mascot Button */}
      <button
        onClick={handleMascotClick}
        aria-label="Tap Mora the Mascot for learning tips"
        className="group relative flex items-center justify-center p-1.5 rounded-full bg-linear-to-tr from-amber-400 via-amber-300 to-orange-400 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all border-3 border-white cursor-pointer focus-visible:outline-amber-600"
        title="Tap Mora for a fun learning fact!"
      >
        <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full overflow-hidden flex items-center justify-center bg-amber-100 relative">
          {/* Adorable SVG Owl Mascot Face */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Feathers base */}
            <circle cx="50" cy="50" r="46" fill="#F59E0B" />
            {/* Belly */}
            <ellipse cx="50" cy="62" rx="28" ry="24" fill="#FEF3C7" />
            {/* Feather tufts on ear */}
            <polygon points="20,15 32,32 15,35" fill="#D97706" />
            <polygon points="80,15 68,32 85,35" fill="#D97706" />
            {/* Eye whites */}
            <circle cx="36" cy="46" r="16" fill="#FFFFFF" />
            <circle cx="64" cy="46" r="16" fill="#FFFFFF" />
            {/* Pupils with playful shine */}
            <circle cx="37" cy="46" r="8" fill="#1E293B" />
            <circle cx="63" cy="46" r="8" fill="#1E293B" />
            <circle cx="34" cy="43" r="3" fill="#FFFFFF" />
            <circle cx="60" cy="43" r="3" fill="#FFFFFF" />
            {/* Golden Beak */}
            <polygon points="50,48 43,58 57,58" fill="#EA580C" />
            {/* Cheerful blush */}
            <circle cx="23" cy="55" r="5" fill="#F43F5E" opacity="0.4" />
            <circle cx="77" cy="55" r="5" fill="#F43F5E" opacity="0.4" />
          </svg>
        </div>

        {/* Small badge */}
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
          ★
        </span>
      </button>
    </div>
  );
};
