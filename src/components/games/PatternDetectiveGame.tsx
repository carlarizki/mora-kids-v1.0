import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Star, Trophy, Sparkles, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

interface PatternDetectiveGameProps {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
}

interface PatternPuzzle {
  sequence: string[];
  answer: string;
  choices: string[];
  explanation: string;
}

const PATTERNS: PatternPuzzle[] = [
  {
    sequence: ['🟡', '🔺', '🟡', '🔺'],
    answer: '🟡',
    choices: ['🟡', '🔺', '🟦', '⭐'],
    explanation: 'The pattern repeats: Circle, Triangle, Circle, Triangle... so Circle comes next!',
  },
  {
    sequence: ['2', '4', '6', '8'],
    answer: '10',
    choices: ['9', '10', '11', '12'],
    explanation: 'We are counting by twos! 8 plus 2 equals 10.',
  },
  {
    sequence: ['🍎', '🍌', '🍌', '🍎', '🍌'],
    answer: '🍌',
    choices: ['🍎', '🍌', '🍇', '🍉'],
    explanation: 'The pattern is: 1 Apple, 2 Bananas, 1 Apple, 2 Bananas!',
  },
  {
    sequence: ['5', '10', '15', '20'],
    answer: '25',
    choices: ['22', '24', '25', '30'],
    explanation: 'We are leaping by fives! 20 plus 5 equals 25.',
  },
  {
    sequence: ['⭐', '⭐', '🌙', '⭐', '⭐'],
    answer: '🌙',
    choices: ['⭐', '🌙', '☀️', '☁️'],
    explanation: 'Two Stars, then a Moon! Next is Moon.',
  },
];

export const PatternDetectiveGame: React.FC<PatternDetectiveGameProps> = ({ onBack, onFinishGame }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const puzzle = PATTERNS[currentIdx];

  const handleSelectChoice = (choice: string) => {
    if (selectedChoice !== null || !puzzle) return;
    setSelectedChoice(choice);

    if (choice === puzzle.answer) {
      setIsCorrect(true);
      sound.playSuccess();
      sound.speak(`Correct! ${puzzle.explanation}`);
      setScore((s) => s + 20);

      setTimeout(() => {
        if (currentIdx + 1 >= PATTERNS.length) {
          setIsFinished(true);
          sound.playFanfare();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          onFinishGame(15, score + 20);
        } else {
          setCurrentIdx((p) => p + 1);
          setSelectedChoice(null);
          setIsCorrect(null);
        }
      }, 1800);
    } else {
      setIsCorrect(false);
      sound.playGentleBoing();
      setTimeout(() => {
        setSelectedChoice(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedChoice(null);
    setIsCorrect(null);
    setIsFinished(false);
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
          <span>Exit Detective</span>
        </button>

        <div className="text-xs font-bold text-rose-800">
          Case {currentIdx + 1} of {PATTERNS.length}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
          <Star className="w-4 h-4 fill-rose-400 text-rose-500" />
          <span className="font-fredoka text-sm tabular-nums">{score} pts</span>
        </div>
      </div>

      {!isFinished && puzzle ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-rose-200 shadow-sm text-center">
          <div className="inline-block p-2 bg-rose-50 rounded-2xl border border-rose-200 text-rose-800 text-xs font-bold mb-4">
            🔎 What comes next in the pattern?
          </div>

          {/* Sequence Display */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-8">
            {puzzle.sequence.map((item, i) => (
              <div
                key={i}
                className="w-16 h-18 sm:w-20 sm:h-22 rounded-2xl bg-amber-50 border-2 border-amber-300 font-fredoka text-3xl sm:text-4xl flex items-center justify-center shadow-xs"
              >
                {item}
              </div>
            ))}

            {/* Mystery target slot */}
            <div className="w-16 h-18 sm:w-20 sm:h-22 rounded-2xl bg-rose-50 border-2 border-dashed border-rose-400 font-fredoka text-3xl sm:text-4xl font-bold text-rose-500 flex items-center justify-center animate-pulse">
              ?
            </div>
          </div>

          {/* Choices to Pick */}
          <div className="max-w-md mx-auto">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Select the matching item:
            </div>
            <div className="grid grid-cols-4 gap-3">
              {puzzle.choices.map((choice) => {
                let style = 'bg-white hover:bg-rose-50 text-slate-800 border-2 border-slate-200 hover:border-rose-400';
                if (selectedChoice !== null) {
                  if (choice === puzzle.answer) {
                    style = 'bg-emerald-500 text-white border-2 border-emerald-600 scale-105';
                  } else if (choice === selectedChoice) {
                    style = 'bg-rose-500 text-white border-2 border-rose-600';
                  } else {
                    style = 'bg-slate-100 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={choice}
                    disabled={selectedChoice !== null}
                    onClick={() => handleSelectChoice(choice)}
                    className={`h-16 sm:h-20 rounded-2xl font-fredoka text-2xl sm:text-3xl font-bold flex items-center justify-center cursor-pointer transition-all shadow-xs active:scale-95 ${style}`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Callout */}
          {isCorrect !== null && (
            <div
              className={`mt-6 p-4 rounded-2xl text-xs sm:text-sm font-semibold max-w-md mx-auto ${
                isCorrect
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {isCorrect ? `✨ ${puzzle.explanation}` : 'Not quite! Take another close look at the order.'}
            </div>
          )}
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-rose-200 text-center shadow-lg">
          <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="font-fredoka text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Master Pattern Detective!
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            You solved all logical pattern cases with brilliant insight!
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={restart}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Play Again
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
