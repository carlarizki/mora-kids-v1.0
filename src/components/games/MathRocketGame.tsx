import React, { useState, useEffect } from 'react';
import { Rocket, Star, Volume2, ArrowLeft, RefreshCw, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { playVoiceLine } from '../../utils/voiceRecorder';

interface MathRocketGameProps {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
}

interface Question {
  text: string;
  speakText: string;
  num1: number;
  num2: number;
  op: '+' | '-' | '×';
  answer: number;
  choices: number[];
}

export const MathRocketGame: React.FC<MathRocketGameProps> = ({ onBack, onFinishGame }) => {
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const totalRounds = 8;

  const generateQuestion = (lvl: 'easy' | 'medium' | 'hard'): Question => {
    let num1 = 0;
    let num2 = 0;
    let op: '+' | '-' | '×' = '+';
    let answer = 0;
    let speakOp = 'plus';

    if (lvl === 'easy') {
      const isSub = Math.random() > 0.5;
      if (isSub) {
        num1 = Math.floor(Math.random() * 8) + 3;
        num2 = Math.floor(Math.random() * num1) + 1;
        op = '-';
        answer = num1 - num2;
        speakOp = 'minus';
      } else {
        num1 = Math.floor(Math.random() * 6) + 1;
        num2 = Math.floor(Math.random() * 6) + 1;
        op = '+';
        answer = num1 + num2;
        speakOp = 'plus';
      }
    } else if (lvl === 'medium') {
      const mode = Math.floor(Math.random() * 3);
      if (mode === 0) {
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 15) + 5;
        op = '+';
        answer = num1 + num2;
        speakOp = 'plus';
      } else if (mode === 1) {
        num1 = Math.floor(Math.random() * 25) + 10;
        num2 = Math.floor(Math.random() * 10) + 3;
        op = '-';
        answer = num1 - num2;
        speakOp = 'minus';
      } else {
        num1 = Math.floor(Math.random() * 8) + 2;
        num2 = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
        op = '×';
        answer = num1 * num2;
        speakOp = 'times';
      }
    } else {
      num1 = Math.floor(Math.random() * 10) + 3;
      num2 = Math.floor(Math.random() * 10) + 2;
      op = '×';
      answer = num1 * num2;
      speakOp = 'times';
    }

    // Generate 3 unique wrong answers
    const wrongAnswers = new Set<number>();
    while (wrongAnswers.size < 3) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 1);
      const fake = answer + delta;
      if (fake >= 0 && fake !== answer) {
        wrongAnswers.add(fake);
      }
    }

    const choices = [answer, ...Array.from(wrongAnswers)].sort(() => Math.random() - 0.5);

    return {
      text: `${num1} ${op} ${num2} = ?`,
      speakText: `What is ${num1} ${speakOp} ${num2}?`,
      num1,
      num2,
      op,
      answer,
      choices,
    };
  };

  const nextQuestion = () => {
    if (questionCount >= totalRounds) {
      setIsGameOver(true);
      sound.playFanfare();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      const starsEarned = Math.max(5, Math.floor(score / 10));
      onFinishGame(starsEarned, score);
      return;
    }

    const q = generateQuestion(level);
    setCurrentQ(q);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setQuestionCount((prev) => prev + 1);
  };

  useEffect(() => {
    nextQuestion();
  }, [level]);

  // Play parent's recorded "start" line if one exists (Voice Studio, Level A)
  useEffect(() => {
    playVoiceLine('start');
  }, []);

  const handleSelectAnswer = (choice: number) => {
    if (selectedAnswer !== null || !currentQ) return;
    setSelectedAnswer(choice);

    if (choice === currentQ.answer) {
      setIsAnswerCorrect(true);
      sound.playSuccess();
      playVoiceLine('cheer');
      const streakBonus = streak * 5;
      setScore((prev) => prev + 15 + streakBonus);
      setStreak((prev) => prev + 1);
      setTimeout(() => {
        nextQuestion();
      }, 900);
    } else {
      setIsAnswerCorrect(false);
      sound.playGentleBoing();
      playVoiceLine('retry');
      setStreak(0);
      setTimeout(() => {
        nextQuestion();
      }, 1400);
    }
  };

  const restartGame = () => {
    setScore(0);
    setStreak(0);
    setQuestionCount(0);
    setIsGameOver(false);
    nextQuestion();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-200/80">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Game</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Difficulty segmented control */}
          <div className="flex items-center p-1 bg-amber-100/70 rounded-xl text-xs font-bold">
            {(['easy', 'medium', 'hard'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  sound.playPop();
                  setLevel(lvl);
                  restartGame();
                }}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                  level === lvl ? 'bg-white text-amber-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* HUD Score & Streak */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span className="font-fredoka text-sm tabular-nums">{score} pts</span>
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2.5 py-1.5 rounded-xl border border-orange-200 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{streak}x Combo!</span>
            </div>
          )}
        </div>
      </div>

      {!isGameOver ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-amber-200 shadow-sm relative overflow-hidden">
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-8 overflow-hidden">
            <div
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(questionCount / totalRounds) * 100}%` }}
            />
          </div>

          {/* Interactive Cosmic Arena */}
          <div className="relative h-44 rounded-2xl bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900 overflow-hidden flex items-center justify-between px-8 text-white mb-8 border border-indigo-800">
            {/* Twinkling stars */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Spaceship */}
            <div
              className={`relative z-10 flex items-center gap-3 transition-transform duration-500 ${
                isAnswerCorrect ? 'translate-x-12 scale-110' : ''
              }`}
            >
              <div className="relative">
                <Rocket className="w-14 h-14 text-amber-400 transform -rotate-45" />
                {/* Thruster Flame */}
                <div className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full bg-orange-500 blur-xs animate-ping" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs text-indigo-300 font-semibold">Astronaut Mora</div>
                <div className="text-[11px] text-amber-300">Targeting Asteroid Sector {questionCount}/{totalRounds}</div>
              </div>
            </div>

            {/* Planet Mora Destination */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 border-2 border-amber-300 shadow-lg flex items-center justify-center">
                <span className="font-fredoka text-xl font-bold text-white">🪐</span>
              </div>
              <span className="text-[10px] text-indigo-200 mt-1 font-semibold">Planet Mora</span>
            </div>
          </div>

          {/* Question Presentation */}
          {currentQ && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <button
                  onClick={() => sound.speak(currentQ.speakText)}
                  className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors cursor-pointer"
                  title="Hear question aloud"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <span className="text-xs font-semibold text-slate-500">
                  Question {questionCount} of {totalRounds}
                </span>
              </div>

              <h2 className="font-fredoka text-4xl sm:text-5xl font-bold text-slate-900 tracking-wide my-4">
                {currentQ.text}
              </h2>

              {/* Visual Counter for young learners if on easy mode */}
              {level === 'easy' && (
                <div className="flex items-center justify-center gap-6 my-4 py-2 px-4 bg-amber-50/70 rounded-2xl w-fit mx-auto border border-amber-200/60">
                  <div className="flex gap-1">
                    {Array.from({ length: currentQ.num1 }).map((_, i) => (
                      <span key={`n1-${i}`} className="w-5 h-5 rounded-full bg-amber-400 border border-amber-500 inline-block" />
                    ))}
                  </div>
                  <span className="font-bold text-slate-700">{currentQ.op}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: currentQ.num2 }).map((_, i) => (
                      <span key={`n2-${i}`} className="w-5 h-5 rounded-full bg-sky-400 border border-sky-500 inline-block" />
                    ))}
                  </div>
                </div>
              )}

              {/* Answer Choices */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
                {currentQ.choices.map((choice) => {
                  let buttonStyle = 'bg-white hover:bg-amber-50 text-slate-800 border-2 border-slate-200 hover:border-amber-400';

                  if (selectedAnswer !== null) {
                    if (choice === currentQ.answer) {
                      buttonStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 scale-105 shadow-md';
                    } else if (choice === selectedAnswer) {
                      buttonStyle = 'bg-rose-500 text-white border-2 border-rose-600';
                    } else {
                      buttonStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={choice}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleSelectAnswer(choice)}
                      className={`h-20 sm:h-24 rounded-2xl font-fredoka text-3xl sm:text-4xl font-bold transition-all duration-150 cursor-pointer shadow-xs active:scale-95 flex items-center justify-center ${buttonStyle}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {/* Feedback text */}
              {isAnswerCorrect === true && (
                <div className="mt-4 text-emerald-600 font-bold text-sm animate-bounce">
                  ✨ Stellar calculation! Rocket blasted forward!
                </div>
              )}
              {isAnswerCorrect === false && (
                <div className="mt-4 text-rose-500 font-semibold text-sm">
                  Oops! The correct answer was {currentQ.answer}. Keep flying!
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Game Over / Victory Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-amber-200 text-center shadow-lg">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="font-fredoka text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Mission Accomplished!
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Astronaut Mora landed safely on Planet Mora with your stellar math navigational skills!
          </p>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 max-w-sm mx-auto mb-8">
            <div className="text-xs font-semibold text-amber-800">Final Cosmic Score</div>
            <div className="font-fredoka text-4xl font-bold text-amber-600 my-1">{score}</div>
            <div className="text-xs text-amber-700 font-medium">
              +{Math.max(5, Math.floor(score / 10))} Mora Stars added to your pouch!
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={restartGame}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md cursor-pointer transition-transform hover:scale-105"
            >
              <RefreshCw className="w-4 h-4" />
              Play Again
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer transition-colors"
            >
              Back to Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
