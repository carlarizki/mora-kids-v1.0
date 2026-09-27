import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Volume2, Star, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

interface HijaiyahQuestGameProps {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
}

interface HijaiyahLetter {
  char: string;
  name: string;
  fathah: string;
  kasrah: string;
  dhommah: string;
  soundFathah: string;
  soundKasrah: string;
  soundDhommah: string;
  exampleWord: string;
  meaningId: string;
}

const HIJAIYAH_LETTERS: HijaiyahLetter[] = [
  { char: 'ا', name: 'Alif', fathah: 'اَ', kasrah: 'اِ', dhommah: 'اُ', soundFathah: 'A', soundKasrah: 'I', soundDhommah: 'U', exampleWord: 'أَرْنَبٌ (Arnab)', meaningId: 'Kelinci' },
  { char: 'ب', name: 'Ba', fathah: 'بَ', kasrah: 'بِ', dhommah: 'بُ', soundFathah: 'Ba', soundKasrah: 'Bi', soundDhommah: 'Bu', exampleWord: 'بَيْتٌ (Bait)', meaningId: 'Rumah' },
  { char: 'ت', name: 'Ta', fathah: 'تَ', kasrah: 'تِ', dhommah: 'تُ', soundFathah: 'Ta', soundKasrah: 'Ti', soundDhommah: 'Tu', exampleWord: 'تُفَّاحٌ (Tuffah)', meaningId: 'Apel' },
  { char: 'ث', name: 'Tsa', fathah: 'ثَ', kasrah: 'ثِ', dhommah: 'ثُ', soundFathah: 'Tsa', soundKasrah: 'Tsi', soundDhommah: 'Tsu', exampleWord: 'ثَعْلَبٌ (Tsa\'lab)', meaningId: 'Rubah' },
  { char: 'ج', name: 'Jim', fathah: 'جَ', kasrah: 'جِ', dhommah: 'جُ', soundFathah: 'Ja', soundKasrah: 'Ji', soundDhommah: 'Ju', exampleWord: 'جَمَلٌ (Jamal)', meaningId: 'Unta' },
  { char: 'ح', name: 'Ha', fathah: 'حَ', kasrah: 'حِ', dhommah: 'حُ', soundFathah: 'Ha', soundKasrah: 'Hi', soundDhommah: 'Hu', exampleWord: 'حِصَانٌ (Hishan)', meaningId: 'Kuda' },
  { char: 'خ', name: 'Kho', fathah: 'خَ', kasrah: 'خِ', dhommah: 'خُ', soundFathah: 'Kho', soundKasrah: 'Khi', soundDhommah: 'Khu', exampleWord: 'خُبْزٌ (Khubz)', meaningId: 'Roti' },
  { char: 'د', name: 'Dal', fathah: 'دَ', kasrah: 'دِ', dhommah: 'دُ', soundFathah: 'Da', soundKasrah: 'Di', soundDhommah: 'Du', exampleWord: 'دُبٌّ (Dubb)', meaningId: 'Beruang' },
  { char: 'ذ', name: 'Dzal', fathah: 'ذَ', kasrah: 'ذِ', dhommah: 'ذُ', soundFathah: 'Dza', soundKasrah: 'Dzi', soundDhommah: 'Dzu', exampleWord: 'ذُرَةٌ (Dzurah)', meaningId: 'Jagung' },
  { char: 'ر', name: 'Ro', fathah: 'رَ', kasrah: 'رِ', dhommah: 'رُ', soundFathah: 'Ro', soundKasrah: 'Ri', soundDhommah: 'Ru', exampleWord: 'رُمَّانٌ (Rumman)', meaningId: 'Delima' },
  { char: 'ز', name: 'Zai', fathah: 'زَ', kasrah: 'زِ', dhommah: 'زُ', soundFathah: 'Za', soundKasrah: 'Zi', soundDhommah: 'Zu', exampleWord: 'زَرَافَةٌ (Zarafah)', meaningId: 'Jerapah' },
  { char: 'س', name: 'Sin', fathah: 'سَ', kasrah: 'سِ', dhommah: 'سُ', soundFathah: 'Sa', soundKasrah: 'Si', soundDhommah: 'Su', exampleWord: 'سَمَكَةٌ (Samakah)', meaningId: 'Ikan' },
];

export const HijaiyahQuestGame: React.FC<HijaiyahQuestGameProps> = ({ onBack, onFinishGame }) => {
  const [selectedHarakat, setSelectedHarakat] = useState<'fathah' | 'kasrah' | 'dhommah'>('fathah');
  const [activeLetterIdx, setActiveLetterIdx] = useState<number>(0);
  const [gameMode, setGameMode] = useState<'explore' | 'quiz'>('explore');
  const [quizTarget, setQuizTarget] = useState<HijaiyahLetter>(HIJAIYAH_LETTERS[1]);
  const [quizChoices, setQuizChoices] = useState<HijaiyahLetter[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentLetter = HIJAIYAH_LETTERS[activeLetterIdx];

  const getPronunciation = (letter: HijaiyahLetter, harakat: 'fathah' | 'kasrah' | 'dhommah') => {
    if (harakat === 'fathah') return letter.soundFathah;
    if (harakat === 'kasrah') return letter.soundKasrah;
    return letter.soundDhommah;
  };

  const getArabicDisplay = (letter: HijaiyahLetter, harakat: 'fathah' | 'kasrah' | 'dhommah') => {
    if (harakat === 'fathah') return letter.fathah;
    if (harakat === 'kasrah') return letter.kasrah;
    return letter.dhommah;
  };

  const speakLetter = (letter: HijaiyahLetter, harakat: 'fathah' | 'kasrah' | 'dhommah') => {
    sound.playPop();
    const soundText = getPronunciation(letter, harakat);
    sound.speak(`${soundText}. Huruf ${letter.name}.`);
  };

  const startQuizRound = () => {
    const target = HIJAIYAH_LETTERS[Math.floor(Math.random() * HIJAIYAH_LETTERS.length)];
    const others = HIJAIYAH_LETTERS.filter((l) => l.char !== target.char).sort(() => Math.random() - 0.5).slice(0, 3);
    const choices = [target, ...others].sort(() => Math.random() - 0.5);

    setQuizTarget(target);
    setQuizChoices(choices);
    setQuizFeedback(null);
    sound.speak(`Manakah huruf ${target.name}?`);
  };

  const handleSelectQuizAnswer = (chosen: HijaiyahLetter) => {
    sound.playPop();
    if (chosen.char === quizTarget.char) {
      sound.playSuccess();
      sound.speak(`Hebat! Benar sekali, ini huruf ${quizTarget.name}!`);
      setScore((s) => s + 20);
      setQuizFeedback('🎉 Hebat sekali! Jawabanmu benar!');
      const nextRounds = roundsCompleted + 1;
      setRoundsCompleted(nextRounds);

      setTimeout(() => {
        if (nextRounds >= 5) {
          setIsGameOver(true);
          sound.playFanfare();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          onFinishGame(15, score + 25);
        } else {
          startQuizRound();
        }
      }, 1500);
    } else {
      sound.playGentleBoing();
      setQuizFeedback(`Bukan sayang, ini huruf ${chosen.name}. Yuk cari huruf ${quizTarget.name}!`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-border/60">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-foreground bg-card border border-border px-4 py-2 rounded-full shadow-2xs cursor-pointer hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-black text-foreground">
            Meet Hijaiyah &amp; Harakat
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sun/15 border border-sun/30 text-sun-foreground font-bold text-xs shadow-2xs">
          <Star className="size-3.5 fill-sun text-sun" />
          <span className="font-display font-black text-sm tabular-nums">{score} pts</span>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <button
              onClick={() => {
                sound.playPop();
                setGameMode('explore');
              }}
              className={`px-5 py-2 rounded-full text-xs font-bold cursor-pointer transition-all ${
                gameMode === 'explore'
                  ? 'bg-primary text-primary-foreground shadow-play'
                  : 'bg-card text-ink-soft hover:bg-muted border border-border'
              }`}
            >
              📖 Jelajah Huruf (Belajar Bunyi)
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setGameMode('quiz');
                startQuizRound();
              }}
              className={`px-5 py-2 rounded-full text-xs font-bold cursor-pointer transition-all ${
                gameMode === 'quiz'
                  ? 'bg-primary text-primary-foreground shadow-play'
                  : 'bg-card text-ink-soft hover:bg-muted border border-border'
              }`}
            >
              🎯 Tebak Huruf (Tantangan)
            </button>
          </div>

          {gameMode === 'explore' ? (
            /* EXPLORE MODE */
            <div className="paper-card rounded-3xl p-6 sm:p-10 border border-border">
              {/* Harakat Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-secondary mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Pilih Harakat (Tanda Baca):
                </span>
                <div className="flex items-center gap-2">
                  {(
                    [
                      { id: 'fathah' as const, label: 'Fathah ( َ ) Bunyi -A', symbol: 'ـَ' },
                      { id: 'kasrah' as const, label: 'Kasrah ( ِ ) Bunyi -I', symbol: 'ـِ' },
                      { id: 'dhommah' as const, label: 'Dhommah ( ُ ) Bunyi -U', symbol: 'ـُ' },
                    ] as const
                  ).map((h) => (
                    <button
                      key={h.id}
                      onClick={() => {
                        sound.playPop();
                        setSelectedHarakat(h.id);
                        speakLetter(currentLetter, h.id);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                        selectedHarakat === h.id
                          ? 'bg-card text-foreground shadow-xs border border-primary/20'
                          : 'text-ink-soft hover:text-foreground'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus Letter Showcase */}
              <div className="flex flex-col items-center justify-center my-6">
                <div className="relative group cursor-pointer" onClick={() => speakLetter(currentLetter, selectedHarakat)}>
                  <div className="size-40 sm:size-48 rounded-3xl bg-emerald-50 border-3 border-emerald-400 flex items-center justify-center text-7xl sm:text-8xl font-black text-emerald-800 shadow-md transition-transform hover:scale-105 active:scale-95">
                    {getArabicDisplay(currentLetter, selectedHarakat)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakLetter(currentLetter, selectedHarakat);
                    }}
                    className="absolute -bottom-3 -right-3 size-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110"
                    title="Dengarkan Suara Huruf"
                  >
                    <Volume2 className="size-6" />
                  </button>
                </div>

                <div className="text-center mt-5">
                  <h3 className="font-display text-3xl font-black text-foreground">
                    Huruf {currentLetter.name}
                  </h3>
                  <p className="text-sm font-semibold text-emerald-700 mt-1">
                    Dibaca: <strong className="text-lg font-black">{getPronunciation(currentLetter, selectedHarakat)}</strong>
                  </p>
                  <p className="text-xs text-ink-soft mt-1">
                    Contoh kosakata: <span className="font-bold text-foreground">{currentLetter.exampleWord}</span> ({currentLetter.meaningId})
                  </p>
                </div>
              </div>

              {/* Grid of All Letters */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 text-center">
                  Sentuh huruf untuk mendengarkan bunyinya:
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {HIJAIYAH_LETTERS.map((letter, idx) => {
                    const isSelected = activeLetterIdx === idx;
                    return (
                      <button
                        key={letter.char}
                        onClick={() => {
                          setActiveLetterIdx(idx);
                          speakLetter(letter, selectedHarakat);
                        }}
                        className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-play scale-105'
                            : 'bg-card hover:bg-muted text-foreground border border-border'
                        }`}
                      >
                        <span className="text-3xl font-bold mb-1">{getArabicDisplay(letter, selectedHarakat)}</span>
                        <span className={`text-[11px] font-bold ${isSelected ? 'text-emerald-100' : 'text-ink-soft'}`}>
                          {letter.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* QUIZ / TANTANGAN MODE */
            <div className="paper-card rounded-3xl p-6 sm:p-10 border border-border text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Tantangan {roundsCompleted + 1} dari 5
              </span>

              <h3 className="font-display text-2xl sm:text-3xl font-black text-foreground my-4">
                Manakah huruf <span className="text-primary">{quizTarget.name}</span>?
              </h3>

              <button
                onClick={() => sound.speak(`Manakah huruf ${quizTarget.name}?`)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-primary font-bold text-xs mb-8 hover:bg-secondary/80 cursor-pointer"
              >
                <Volume2 className="size-4" />
                <span>Ulangi Suara Soal</span>
              </button>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
                {quizChoices.map((choice) => (
                  <button
                    key={choice.char}
                    onClick={() => handleSelectQuizAnswer(choice)}
                    className="size-28 sm:size-32 rounded-3xl bg-card hover:bg-emerald-50 border-2 border-border hover:border-emerald-500 flex flex-col items-center justify-center text-5xl font-black text-foreground shadow-xs hover:shadow-play cursor-pointer transition-all hover:-translate-y-1 active:scale-95"
                  >
                    <span>{choice.char}</span>
                  </button>
                ))}
              </div>

              {quizFeedback && (
                <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm font-bold text-emerald-800 animate-in fade-in max-w-md mx-auto">
                  {quizFeedback}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Victory Screen */
        <div className="paper-card rounded-3xl p-8 sm:p-12 text-center shadow-play border border-border">
          <div className="size-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <Trophy className="size-10" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground mb-2">
            Mabruk! Kamu Hebat Sekali!
          </h2>
          <p className="text-sm text-ink-soft mb-6 max-w-md mx-auto">
            Kamu telah mengenal dan mempraktikkan huruf Hijaiyah serta harakat dengan sangat baik hari ini.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setIsGameOver(false);
                setRoundsCompleted(0);
                setScore(0);
                startQuizRound();
              }}
              className="px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-play cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="size-4" />
              <span>Main Lagi</span>
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-full bg-card hover:bg-muted text-foreground border border-border font-bold text-sm cursor-pointer"
            >
              Kembali ke Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
