import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Volume2, Star, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

interface PhonicsSafariGameProps {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
}

interface SafariWord {
  word: string;
  emoji: string;
  hint: string;
  funFact: string;
}

const SAFARI_WORDS: SafariWord[] = [
  { word: 'LION', emoji: '🦁', hint: 'The courageous king of the savanna who loves to roar!', funFact: 'A lion roar can be heard from 5 miles away!' },
  { word: 'ZEBRA', emoji: '🦓', hint: 'A wild horse with striking black and white stripes!', funFact: 'No two zebras have the exact same stripe pattern!' },
  { word: 'MONKEY', emoji: '🐒', hint: 'Loves swinging from branch to branch and peeling snacks!', funFact: 'Monkeys use their tails for balance like an extra hand!' },
  { word: 'FOX', emoji: '🦊', hint: 'Clever friend with a bushy orange tail and sharp ears!', funFact: 'Foxes have whiskers on their legs to help them navigate!' },
  { word: 'PANDA', emoji: '🐼', hint: 'Gentle black and white bear who munches on bamboo all day!', funFact: 'Giant pandas spend up to 12 hours a day eating!' },
];

export const PhonicsSafariGame: React.FC<PhonicsSafariGameProps> = ({ onBack, onFinishGame }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSlots, setCurrentSlots] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{ id: string; char: string }[]>([]);
  const [score, setScore] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentItem = SAFARI_WORDS[currentIndex];

  const initRound = (index: number) => {
    const item = SAFARI_WORDS[index];
    if (!item) return;

    setCurrentSlots(new Array(item.word.length).fill(''));
    setIsSuccess(false);

    // Shuffle characters
    const chars = item.word.split('').map((char, i) => ({
      id: `${char}-${i}-${Math.random()}`,
      char,
    }));
    setAvailableLetters(chars.sort(() => Math.random() - 0.5));

    sound.speak(`Spell the word: ${item.word}. Clue: ${item.hint}`);
  };

  useEffect(() => {
    initRound(currentIndex);
  }, [currentIndex]);

  const handlePickLetter = (item: { id: string; char: string }) => {
    sound.playPop();
    sound.speak(item.char);

    // Find first empty slot
    const firstEmpty = currentSlots.findIndex((s) => s === '');
    if (firstEmpty === -1) return;

    const newSlots = [...currentSlots];
    newSlots[firstEmpty] = item.char;
    setCurrentSlots(newSlots);

    // Remove from available
    setAvailableLetters((prev) => prev.filter((l) => l.id !== item.id));

    // Check if word is complete
    if (firstEmpty === currentItem.word.length - 1) {
      const spelledWord = newSlots.join('');
      if (spelledWord === currentItem.word) {
        setIsSuccess(true);
        sound.playSuccess();
        sound.speak(`Fantastic! You spelled ${currentItem.word}! ${currentItem.funFact}`);
        setScore((prev) => prev + 20);

        setTimeout(() => {
          if (currentIndex + 1 >= SAFARI_WORDS.length) {
            setIsGameOver(true);
            sound.playFanfare();
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            onFinishGame(12, score + 20);
          } else {
            setCurrentIndex((prev) => prev + 1);
          }
        }, 2200);
      } else {
        sound.playGentleBoing();
      }
    }
  };

  const handleRemoveSlot = (slotIdx: number) => {
    const char = currentSlots[slotIdx];
    if (!char) return;

    sound.playPop();
    const newSlots = [...currentSlots];
    newSlots[slotIdx] = '';
    setCurrentSlots(newSlots);

    // Return to available
    setAvailableLetters((prev) => [...prev, { id: `${char}-${Math.random()}`, char }]);
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsGameOver(false);
    initRound(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-200/80">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Safari</span>
        </button>

        <div className="text-xs font-bold text-sky-800">
          Safari Discovery {currentIndex + 1} of {SAFARI_WORDS.length}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span className="font-fredoka text-sm tabular-nums">{score} pts</span>
        </div>
      </div>

      {!isGameOver && currentItem ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-sky-200 shadow-sm text-center">
          {/* Animal Clue Frame */}
          <div className="relative inline-block mb-4">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-sky-100 to-amber-100 border-2 border-sky-300 flex items-center justify-center text-6xl sm:text-7xl shadow-inner mx-auto">
              {currentItem.emoji}
            </div>
            <button
              onClick={() => sound.speak(`Spell ${currentItem.word}. Clue: ${currentItem.hint}`)}
              className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-md cursor-pointer transition-transform hover:scale-105"
              title="Hear word & clue aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm font-medium text-slate-600 max-w-md mx-auto mb-6">
            "{currentItem.hint}"
          </p>

          {/* Letter Slots */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
            {currentSlots.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => handleRemoveSlot(idx)}
                className={`w-12 h-14 sm:w-16 sm:h-18 rounded-2xl font-fredoka text-2xl sm:text-3xl font-bold flex items-center justify-center transition-all cursor-pointer border-2 ${
                  letter
                    ? isSuccess
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm scale-105'
                      : 'bg-sky-500 text-white border-sky-600 shadow-sm'
                    : 'bg-slate-50 text-slate-400 border-dashed border-slate-300 hover:border-sky-300'
                }`}
              >
                {letter || '_'}
              </button>
            ))}
          </div>

          {/* Available Letter Tiles to Tap */}
          <div className="mb-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Tap letters to spell the animal:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {availableLetters.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePickLetter(item)}
                  className="w-13 h-15 sm:w-16 sm:h-18 rounded-2xl font-fredoka text-2xl sm:text-3xl font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300 shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                >
                  {item.char}
                </button>
              ))}
            </div>
          </div>

          {/* Fun Fact / Encouragement */}
          {isSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm font-semibold text-emerald-800 animate-in fade-in max-w-md mx-auto">
              🎉 Safari Explorer Success! {currentItem.funFact}
            </div>
          )}
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-sky-200 text-center shadow-lg">
          <div className="w-20 h-20 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="font-fredoka text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Safari Word Champion!
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            You spelled all the wild safari animals with brilliant phonetic accuracy!
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={restartGame}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Spell Again
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer"
            >
              Back to Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
