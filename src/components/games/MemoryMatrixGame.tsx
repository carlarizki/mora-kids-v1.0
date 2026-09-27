import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Star, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

interface MemoryMatrixGameProps {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
}

interface CardItem {
  id: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ANIMAL_PAIRS = [
  { emoji: '🦁', name: 'Lion' },
  { emoji: '🐼', name: 'Panda' },
  { emoji: '🐨', name: 'Koala' },
  { emoji: '🐬', name: 'Dolphin' },
  { emoji: '🦊', name: 'Fox' },
  { emoji: '🦉', name: 'Owl' },
];

export const MemoryMatrixGame: React.FC<MemoryMatrixGameProps> = ({ onBack, onFinishGame }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    const deck: CardItem[] = [];
    let idCounter = 0;

    ANIMAL_PAIRS.forEach((item) => {
      // 2 cards for each animal
      deck.push({ id: idCounter++, emoji: item.emoji, name: item.name, isFlipped: false, isMatched: false });
      deck.push({ id: idCounter++, emoji: item.emoji, name: item.name, isFlipped: false, isMatched: false });
    });

    setCards(deck.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    sound.playPop();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (cards[firstIdx].name === cards[secondIdx].name) {
        // Matched!
        sound.playSuccess();
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[firstIdx].isMatched = true;
            updated[secondIdx].isMatched = true;

            // Check if all matched
            if (updated.every((c) => c.isMatched)) {
              setIsWon(true);
              sound.playFanfare();
              confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
              onFinishGame(12, Math.max(10, 100 - moves * 4));
            }
            return updated;
          });
          setFlippedCards([]);
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[firstIdx].isFlipped = false;
            updated[secondIdx].isFlipped = false;
            return updated;
          });
          setFlippedCards([]);
        }, 900);
      }
    }
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
          <span>Exit Puzzle</span>
        </button>

        <div className="text-xs font-bold text-rose-800">
          Moves Made: <span className="tabular-nums font-fredoka text-sm">{moves}</span>
        </div>

        <button
          onClick={initGame}
          className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-slate-50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Restart
        </button>
      </div>

      {!isWon ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-200 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="font-fredoka text-2xl sm:text-3xl font-bold text-slate-900">
              Animal Memory Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Flip and match the smiling pairs of wild friends!
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto">
            {cards.map((card, idx) => {
              const isRevealed = card.isFlipped || card.isMatched;

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`h-24 sm:h-28 rounded-2xl font-fredoka text-4xl sm:text-5xl flex items-center justify-center transition-all duration-200 cursor-pointer border-2 ${
                    card.isMatched
                      ? 'bg-emerald-50 border-emerald-400 opacity-80 scale-95 shadow-inner'
                      : isRevealed
                      ? 'bg-white border-rose-400 shadow-md scale-100'
                      : 'bg-gradient-to-br from-rose-400 to-amber-500 border-white text-white hover:brightness-105 shadow-sm active:scale-95'
                  }`}
                >
                  {isRevealed ? (
                    card.emoji
                  ) : (
                    <span className="font-fredoka text-2xl font-bold text-white drop-shadow-xs">?</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-rose-200 text-center shadow-lg">
          <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="font-fredoka text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Brilliant Memory!
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            You discovered all 6 animal pairs in just {moves} moves!
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={initGame}
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
