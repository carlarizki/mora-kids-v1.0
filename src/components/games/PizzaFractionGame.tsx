import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Star, Volume2, Trophy, ChefHat, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

interface PizzaFractionGameProps {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
}

interface Order {
  customerName: string;
  customerAvatar: string;
  targetNumerator: number;
  targetDenominator: number;
  promptText: string;
}

const ORDERS: Order[] = [
  { customerName: 'Barnaby Bear', customerAvatar: '🐻', targetNumerator: 1, targetDenominator: 2, promptText: 'wants 1/2 of the pizza!' },
  { customerName: 'Penny Penguin', customerAvatar: '🐧', targetNumerator: 3, targetDenominator: 4, promptText: 'wants 3/4 of the pizza!' },
  { customerName: 'Sammy Squirrel', customerAvatar: '🐿️', targetNumerator: 2, targetDenominator: 3, promptText: 'wants 2/3 of the pizza!' },
  { customerName: 'Bella Bunny', customerAvatar: '🐰', targetNumerator: 1, targetDenominator: 4, promptText: 'wants 1/4 of the pizza!' },
  { customerName: 'Leo Lion', customerAvatar: '🦁', targetNumerator: 5, targetDenominator: 8, promptText: 'wants 5/8 of the pizza!' },
  { customerName: 'Ollie Owl', customerAvatar: '🦉', targetNumerator: 3, targetDenominator: 8, promptText: 'wants 3/8 of the pizza!' },
];

export const PizzaFractionGame: React.FC<PizzaFractionGameProps> = ({ onBack, onFinishGame }) => {
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [sliceCount, setSliceCount] = useState<number>(2); // 2, 3, 4, 8
  const [selectedSlices, setSelectedSlices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const order = ORDERS[currentOrderIndex];

  useEffect(() => {
    setSelectedSlices([]);
    setFeedback(null);
    if (order) {
      sound.speak(`${order.customerName} ${order.promptText}`);
    }
  }, [currentOrderIndex]);

  const toggleSlice = (idx: number) => {
    sound.playPop();
    setSelectedSlices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleServe = () => {
    if (!order) return;
    const servedFraction = selectedSlices.length / sliceCount;
    const targetFraction = order.targetNumerator / order.targetDenominator;

    // Direct comparison
    if (Math.abs(servedFraction - targetFraction) < 0.001) {
      sound.playSuccess();
      setScore((prev) => prev + 25);
      setFeedback('🎉 Delicious! Exactly what the customer wanted!');

      setTimeout(() => {
        if (currentOrderIndex + 1 >= ORDERS.length) {
          setIsGameOver(true);
          sound.playFanfare();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          onFinishGame(15, score + 25);
        } else {
          setCurrentOrderIndex((prev) => prev + 1);
        }
      }, 1200);
    } else {
      sound.playGentleBoing();
      setFeedback(
        `Hmm, you served ${selectedSlices.length}/${sliceCount} (${(servedFraction * 100).toFixed(0)}%), but they wanted ${order.targetNumerator}/${order.targetDenominator}. Try adjusting the slices!`
      );
    }
  };

  const restartGame = () => {
    setCurrentOrderIndex(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedSlices([]);
    setFeedback(null);
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
          <span>Exit Kitchen</span>
        </button>

        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-amber-600" />
          <span className="font-fredoka text-lg font-bold text-slate-800">
            Pizza Chef Fractions
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span className="font-fredoka text-sm tabular-nums">{score} pts</span>
        </div>
      </div>

      {!isGameOver && order ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm">
          {/* Order Ticket */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-amber-50/80 rounded-2xl border border-amber-200 mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-3xl shadow-xs">
                {order.customerAvatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-fredoka text-lg font-bold text-slate-900">
                    {order.customerName}
                  </span>
                  <button
                    onClick={() => sound.speak(`${order.customerName} ${order.promptText}`)}
                    className="p-1 rounded-md text-amber-600 hover:text-amber-800"
                    title="Hear customer order"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm font-semibold text-amber-800">
                  Order:{' '}
                  <span className="font-fredoka text-lg font-bold bg-white px-2 py-0.5 rounded-md border border-amber-300">
                    {order.targetNumerator}/{order.targetDenominator}
                  </span>{' '}
                  of the pizza
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-semibold">
              Order {currentOrderIndex + 1} of {ORDERS.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Interactive Pizza Visualizer */}
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-64 rounded-full bg-amber-200 border-8 border-amber-600/60 shadow-inner flex items-center justify-center overflow-hidden">
                {/* SVG Slices */}
                <svg viewBox="-100 -100 200 200" className="w-full h-full transform -rotate-90">
                  {Array.from({ length: sliceCount }).map((_, i) => {
                    const anglePerSlice = (2 * Math.PI) / sliceCount;
                    const startAngle = i * anglePerSlice;
                    const endAngle = (i + 1) * anglePerSlice;

                    const x1 = 90 * Math.cos(startAngle);
                    const y1 = 90 * Math.sin(startAngle);
                    const x2 = 90 * Math.cos(endAngle);
                    const y2 = 90 * Math.sin(endAngle);

                    const largeArc = anglePerSlice > Math.PI ? 1 : 0;
                    const pathData = `M 0 0 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`;

                    const isSelected = selectedSlices.includes(i);

                    return (
                      <g
                        key={i}
                        onClick={() => toggleSlice(i)}
                        className="cursor-pointer transition-all duration-150 hover:opacity-90"
                      >
                        <path
                          d={pathData}
                          fill={isSelected ? '#F59E0B' : '#FEF3C7'}
                          stroke="#B45309"
                          strokeWidth="2"
                        />
                        {/* Slice index indicator / topping circle */}
                        <circle
                          cx={45 * Math.cos((startAngle + endAngle) / 2)}
                          cy={45 * Math.sin((startAngle + endAngle) / 2)}
                          r="6"
                          fill={isSelected ? '#DC2626' : '#D97706'}
                          opacity="0.8"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Center pizza crust pin */}
                <div className="absolute w-5 h-5 rounded-full bg-amber-700 pointer-events-none" />
              </div>
              <span className="text-xs text-slate-500 font-medium mt-3">
                Tap slices to select them for your customer!
              </span>
            </div>

            {/* Kitchen Slice Controls */}
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  1. Choose Pizza Slices Cut:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 8].map((count) => (
                    <button
                      key={count}
                      onClick={() => {
                        sound.playPop();
                        setSliceCount(count);
                        setSelectedSlices([]);
                      }}
                      className={`py-2 px-3 rounded-xl font-fredoka font-bold text-sm border-2 cursor-pointer transition-colors ${
                        sliceCount === count
                          ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      {count} Slices
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Plated Fraction */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-slate-500 mb-1">2. Plated Fraction to Serve:</div>
                <div className="flex items-center gap-3">
                  <div className="font-fredoka text-3xl font-bold text-amber-600">
                    {selectedSlices.length} / {sliceCount}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    ({selectedSlices.length} slices selected out of {sliceCount} total)
                  </div>
                </div>
              </div>

              {/* Serve Button */}
              <button
                onClick={handleServe}
                disabled={selectedSlices.length === 0}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-fredoka text-lg font-bold rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Serve Pizza Order!
              </button>

              {/* Feedback prompt */}
              {feedback && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-slate-800 animate-in fade-in">
                  {feedback}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-amber-200 text-center shadow-lg">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="font-fredoka text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Master Pizza Chef!
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            All the animal friends loved their perfectly sliced fraction pizzas!
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={restartGame}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Bake More
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
