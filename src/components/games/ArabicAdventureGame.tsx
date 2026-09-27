import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  RefreshCw,
  Star,
  Trophy,
  Volume2,
  Users,
  Compass,
  Sparkles,
  Shield,
  Heart,
  Clock,
  CheckCircle2,
  Lock,
  ChevronRight,
  Flame,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import {
  GERBANG,
  LEVELS,
  PANGKAT,
  MISI,
  STIKER,
  BANK,
  EMOJI_HITUNG
} from '../../data/arabicAdventureData';

interface ArabicAdventureGameProps {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
}

interface Question {
  prompt: string;
  hint?: string;
  bigContent?: React.ReactNode;
  options: string[];
  correct: string;
  tip?: string;
  speechText?: string;
  isArabicButtons?: boolean;
  isArabicBig?: boolean;
}

export const ArabicAdventureGame: React.FC<ArabicAdventureGameProps> = ({
  onBack,
  onFinishGame,
}) => {
  // Wizard state: 1 (Room/Pemain) -> 2 (Level) -> 3 (Fokus) -> 4 (Peta Gerbang)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(4);
  const [pemainName, setPemainName] = useState<string>('Zahra');
  const [roomCode, setRoomCode] = useState<string>('');
  const [levelId, setLevelId] = useState<string>('musafir');
  const [fokusId, setFokusId] = useState<string>('semua');
  const [activeTabSub, setActiveTabSub] = useState<'gerbang' | 'stiker' | 'misi' | 'papan'>('gerbang');

  // Game Progress
  const [gateStars, setGateStars] = useState<Record<string, number>>({
    huruf: 3,
    harakat: 2,
    kata: 1,
  });
  const [totalStars, setTotalStars] = useState<number>(35);
  const [streakDays, setStreakDays] = useState<number>(3);
  const [unlockAllGates, setUnlockAllGates] = useState<boolean>(true); // default friendly for exploring

  // In-Game state
  const [activeGateId, setActiveGateId] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<'quiz' | 'susun' | 'memori' | 'balon' | 'kilat' | null>(null);

  // Quiz state
  const [qIndex, setQIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10); // 10 per round for engaging bite-sized play
  const [correctCount, setCorrectCount] = useState(0);
  const [lives, setLives] = useState(6);
  const [maxLives, setMaxLives] = useState(6);
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Special Mode: Susun (Kalimat / Eja)
  const [susunPool, setSusunPool] = useState<string[]>([]);
  const [susunPlaced, setSusunPlaced] = useState<number[]>([]);
  const [susunOriginal, setSusunOriginal] = useState<string[]>([]);
  const [susunMeta, setSusunMeta] = useState<{ title: string; hint: string; joinChar: string }>({
    title: '',
    hint: '',
    joinChar: ' ',
  });

  // Special Mode: Memori
  const [memoriCards, setMemoriCards] = useState<Array<{ id: number; content: string; isArabic: boolean; isFlipped: boolean; isMatched: boolean }>>([]);
  const [memoriFlipped, setMemoriFlipped] = useState<number[]>([]);
  const [memoriWrongCount, setMemoriWrongCount] = useState(0);

  // Special Mode: Balon
  const [balonTime, setBalonTime] = useState(40);
  const [balonTarget, setBalonTarget] = useState<[string, string]>(['ا', 'alif']);
  const [balons, setBalons] = useState<Array<{ id: number; char: string; name: string; x: number; speed: number; color: string }>>([]);

  // Special Mode: Kilat
  const [kilatTime, setKilatTime] = useState(45);

  // Result state
  const [isFinished, setIsFinished] = useState(false);
  const [earnedStarsRound, setEarnedStarsRound] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentLevelInfo = LEVELS.find((l: any) => l.id === levelId) || LEVELS[0];

  // Helper: calculate Rank
  const currentRank = PANGKAT.slice().reverse().find((p: any) => totalStars >= p.min) || PANGKAT[0];

  // Helper: check if gate is open
  const isGateUnlocked = (index: number) => {
    if (unlockAllGates) return true;
    return index <= 1 || totalStars >= (index - 1) * 3;
  };

  // Generate question according to gate
  const generateQuestion = (gateId: string): Question => {
    const n = currentLevelInfo.opsi || 3;
    const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

    // Default fallback
    if (gateId === 'huruf') {
      const shuffled = shuffle(BANK.HURUF);
      const target = shuffled[0];
      const others = shuffled.slice(1, n);
      const options = shuffle([target[1], ...others.map((o: any) => o[1])]);
      return {
        prompt: 'Apa nama huruf ini?',
        bigContent: <span className="text-6xl sm:text-7xl font-bold font-serif text-emerald-800">{target[0]}</span>,
        options,
        correct: target[1],
        speechText: target[0],
        tip: `Huruf ${target[0]} bernama "${target[1]}".`,
      };
    }

    if (gateId === 'harakat') {
      const shuffled = shuffle(BANK.HARAKAT);
      const target = shuffled[0];
      const others = shuffled.slice(1, n);
      const options = shuffle([target[1], ...others.map((o: any) => o[1])]);
      return {
        prompt: 'Bagaimana cara membaca huruf ini?',
        bigContent: <span className="text-6xl sm:text-7xl font-bold font-serif text-emerald-800">{target[0]}</span>,
        options,
        correct: target[1],
        speechText: target[0],
        tip: `Dibaca "${target[1]}".`,
      };
    }

    if (gateId === 'bunyi') {
      const shuffled = shuffle(BANK.HURUF);
      const target = shuffled[0];
      const others = shuffled.slice(1, n);
      const options = shuffle([target[0], ...others.map((o: any) => o[0])]);
      return {
        prompt: 'Manakah huruf yang berbunyi...',
        hint: `Dengarkan: "${target[1]}"`,
        bigContent: <div className="text-3xl font-display font-bold text-primary">🔊 "{target[1]}"</div>,
        options,
        correct: target[0],
        speechText: target[0],
        isArabicBig: true,
      };
    }

    if (gateId === 'kembar') {
      const shuffled = shuffle(BANK.KEMBAR);
      const target = shuffled[0];
      const huruf = target[0];
      const nama = target[1];
      const ciri = target[2];
      const mirip = target[3] || [];
      const options = shuffle([huruf, ...mirip.slice(0, n - 1)]);
      return {
        prompt: `Huruf kembar! Yang mana huruf "${nama}"?`,
        hint: `Petunjuk: ${ciri}`,
        bigContent: <div className="text-4xl sm:text-5xl">👯‍♂️</div>,
        options,
        correct: huruf,
        speechText: huruf,
        isArabicBig: true,
        tip: `Huruf ${huruf} (${nama}): ${ciri}.`,
      };
    }

    if (gateId === 'angka') {
      const shuffled = shuffle(BANK.ANGKA);
      const target = shuffled[0];
      const others = shuffled.slice(1, n);
      const emoji = EMOJI_HITUNG[Math.floor(Math.random() * EMOJI_HITUNG.length)];
      const count = target[0];
      const options = shuffle([target[1], ...others.map((o: any) => o[1])]);
      return {
        prompt: 'Hitung gambar ini, lalu pilih angka bahasa Arabnya!',
        bigContent: <div className="text-3xl sm:text-4xl tracking-widest">{emoji.repeat(count)}</div>,
        options,
        correct: target[1],
        speechText: target[1],
        isArabicButtons: true,
        tip: `${count} = ${target[1]} (${target[2]}).`,
      };
    }

    if (gateId === 'raqm') {
      const shuffled = shuffle(BANK.RAQM);
      const target = shuffled[0];
      const others = shuffled.slice(1, n);
      if (Math.random() < 0.5) {
        const options = shuffle([String(target[0]), ...others.map((o: any) => String(o[0]))]);
        return {
          prompt: 'Angka Arab ini nilainya berapa?',
          bigContent: <span className="text-6xl font-bold font-serif text-primary">{target[1]}</span>,
          options,
          correct: String(target[0]),
          tip: `${target[1]} = ${target[0]} (${target[3]}).`,
        };
      } else {
        const options = shuffle([target[1], ...others.map((o: any) => o[1])]);
        return {
          prompt: `Mana angka Arab untuk bilangan ${target[0]}?`,
          bigContent: <div className="text-4xl">🔢</div>,
          options,
          correct: target[1],
          isArabicBig: true,
          tip: `${target[0]} ditulis ${target[1]} (${target[3]}).`,
        };
      }
    }

    if (gateId === 'hadza') {
      const shuffled = shuffle(BANK.HADZA);
      const target = shuffled[0];
      const correct = target[2] === 'M' ? 'هٰذَا' : 'هٰذِهِ';
      return {
        prompt: 'Kata tunjuk mana yang tepat untuk kata ini?',
        hint: `(${target[1]})`,
        bigContent: <span className="text-4xl sm:text-5xl font-bold font-serif text-foreground">{target[0]}</span>,
        options: ['هٰذَا', 'هٰذِهِ'],
        correct,
        speechText: `${correct} ${target[0]}`,
        isArabicButtons: true,
        tip: target[2] === 'F' ? 'Kata berakhiran ta marbuthah (ة) memakai هٰذِهِ.' : 'Kata mudzakkar memakai هٰذَا.',
      };
    }

    if (gateId === 'syamsi') {
      const shuffled = shuffle(BANK.SYAMSI);
      const target = shuffled[0];
      const qamar = '🌙 Qamariyah (Lam dibaca jelas)';
      const syams = '☀️ Syamsiyah (Lam dilebur/tasydid)';
      const correct = target[3] === 'Q' ? qamar : syams;
      return {
        prompt: 'Bagaimana membaca huruf "ال" pada kata ini?',
        hint: `Artinya: ${target[2]}`,
        bigContent: <span className="text-4xl sm:text-5xl font-bold font-serif text-primary">{target[0]}</span>,
        options: [qamar, syams],
        correct,
        speechText: target[0],
        tip: target[3] === 'Q' ? `Dibaca "${target[1]}". Lam terbaca jelas karena huruf ${target[4]} adalah qamariyah.` : `Dibaca "${target[1]}". Lam dilebur ke huruf ${target[4]} (syamsiyah).`,
      };
    }

    if (gateId === 'lawan') {
      const shuffled = shuffle(BANK.LAWAN);
      const target = shuffled[0];
      const others = shuffled.slice(1, n);
      return {
        prompt: `Apa LAWAN KATA dari "${target[0]}" (${target[2]})?`,
        bigContent: <span className="text-4xl sm:text-5xl font-bold font-serif text-coral">{target[0]}</span>,
        options: shuffle([target[3], ...others.map((o: any) => o[3])]),
        correct: target[3],
        speechText: target[3],
        isArabicButtons: true,
        tip: `${target[0]} (${target[2]}) ↔ ${target[3]} (${target[5]}).`,
      };
    }

    if (gateId === 'hari') {
      const shuffled = shuffle(BANK.HARI);
      const target = shuffled[0];
      const others = shuffled.slice(1, n);
      return {
        prompt: `Hari "${target[2]}" bahasa Arabnya adalah?`,
        bigContent: <div className="text-4xl">📅</div>,
        options: shuffle([target[0], ...others.map((o: any) => o[0])]),
        correct: target[0],
        speechText: target[0],
        isArabicButtons: true,
        tip: `${target[2]} = ${target[0]} (${target[1]}).`,
      };
    }

    if (gateId === 'sambung') {
      const shuffled = shuffle(BANK.SAMBUNG);
      const target = shuffled[0];
      const positions = [
        { label: 'di AWAL kata (ـفـ / فـ)', form: target[2], posName: 'awal' },
        { label: 'di TENGAH kata (ـفـ)', form: target[3], posName: 'tengah' },
        { label: 'di AKHIR kata (ـف)', form: target[4], posName: 'akhir' },
      ];
      const chosenPos = positions[Math.floor(Math.random() * positions.length)];
      const otherForms = shuffle(BANK.SAMBUNG.filter((s: any) => s[0] !== target[0])).slice(0, n - 1).map((s: any) => s[Math.floor(Math.random() * 3) + 2]);
      return {
        prompt: `Bagaimana bentuk huruf "${target[1]}" (${target[0]}) saat berada di ${chosenPos.posName} kata?`,
        bigContent: <span className="text-5xl font-bold font-serif text-primary">{target[0]}</span>,
        options: shuffle([chosenPos.form, ...otherForms]),
        correct: chosenPos.form,
        speechText: target[0],
        isArabicButtons: true,
        tip: `Huruf ${target[0]} (${target[1]}) di ${chosenPos.posName} ditulis: ${chosenPos.form}.`,
      };
    }

    if (gateId === 'tempat') {
      const shuffled = shuffle(BANK.TEMPAT);
      const target = shuffled[0];
      const others = shuffled.slice(1, n);
      return {
        prompt: 'Apa arti kata keterangan tempat ini?',
        hint: `Dibaca: "${target[1]}"`,
        bigContent: <span className="text-5xl font-bold font-serif text-emerald-700">{target[0]}</span>,
        options: shuffle([target[2], ...others.map((o: any) => o[2])]),
        correct: target[2],
        speechText: target[0],
        tip: `${target[0]} (${target[1]}) artinya "${target[2]}".`,
      };
    }

    if (gateId === 'tanya') {
      const shuffled = shuffle(BANK.TANYA);
      const target = shuffled[0];
      const others = shuffled.slice(1, n);
      return {
        prompt: 'Kata tanya bahasa Arab ini artinya apa?',
        hint: `Dibaca: "${target[1]}"`,
        bigContent: <span className="text-5xl font-bold font-serif text-primary">{target[0]}</span>,
        options: shuffle([target[2], ...others.map((o: any) => o[2])]),
        correct: target[2],
        speechText: target[0],
        tip: `Kata tanya ${target[0]} (${target[1]}) digunakan untuk: ${target[2]}.`,
      };
    }

    if (gateId === 'amr') {
      const shuffled = shuffle(BANK.AMR);
      const target = shuffled[0];
      const others = shuffled.slice(1, n);
      return {
        prompt: 'Apa arti kata perintah ini?',
        hint: `Dibaca: "${target[2]}"`,
        bigContent: (
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">{target[0]}</span>
            <span className="text-4xl font-bold font-serif text-foreground">{target[1]}</span>
          </div>
        ),
        options: shuffle([target[3], ...others.map((o: any) => o[3])]),
        correct: target[3],
        speechText: target[1],
        tip: `${target[1]} (${target[2]}) artinya "${target[3]}!".`,
      };
    }

    if (gateId === 'jamak') {
      const shuffled = shuffle(BANK.JAMAK);
      const target = shuffled[0];
      const others = shuffled.slice(1, n);
      return {
        prompt: `Apa bentuk JAMAK (banyak) dari kata "${target[0]}" (${target[4]})?`,
        hint: `Tunggal: ${target[0]} (${target[1]})`,
        bigContent: <span className="text-4xl sm:text-5xl font-bold font-serif text-primary">{target[0]}</span>,
        options: shuffle([target[2], ...others.map((o: any) => o[2])]),
        correct: target[2],
        speechText: target[2],
        isArabicButtons: true,
        tip: `Bentuk tunggal: ${target[0]} (${target[1]}) ↔ Jamak: ${target[2]} (${target[3]}).`,
      };
    }

    if (gateId === 'ujian') {
      const subGates = ['huruf', 'harakat', 'kata', 'angka', 'hadza', 'syamsi', 'lawan', 'hari', 'cakap', 'tempat', 'tanya', 'amr', 'jamak'];
      const randomSub = subGates[Math.floor(Math.random() * subGates.length)];
      return generateQuestion(randomSub);
    }

    if (gateId === 'cakap') {
      const shuffled = shuffle(BANK.CAKAP);
      const item = shuffled[0];
      const situasi = item[0];
      const ucapan = item[1];
      const benar = item[2];
      const salah = item.slice(3, 3 + (n - 1));
      return {
        prompt: situasi,
        bigContent: <div className="text-2xl sm:text-3xl font-bold font-serif text-primary px-3 py-2 bg-secondary rounded-2xl">{ucapan}</div>,
        options: shuffle([benar, ...salah]),
        correct: benar,
        speechText: ucapan,
        isArabicButtons: true,
      };
    }

    // Default vocabulary handler (Kata, Mihnah, Cuaca, Waktu, Alam, Fiil, Jamak, Doa, etc.)
    let pool = BANK.KATA;
    if (gateId === 'mihnah') pool = BANK.MIHNAH;
    else if (gateId === 'cuaca') pool = BANK.CUACA;
    else if (gateId === 'waktu') pool = BANK.WAKTU;
    else if (gateId === 'alam') pool = BANK.ALAM;
    else if (gateId === 'fiil') pool = BANK.FIIL;
    else if (gateId === 'dhamir') pool = BANK.DHAMIR;
    else if (gateId === 'doa') pool = BANK.DOA;

    const shuffled = shuffle(pool);
    const item = shuffled[0];
    const others = shuffled.slice(1, n);

    if (Math.random() < 0.5 && item[0]) {
      // Show emoji -> pick Arabic
      return {
        prompt: 'Apa bahasa Arab benda/gambar ini?',
        hint: `(${item[3] || item[2]})`,
        bigContent: <div className="text-5xl sm:text-6xl">{item[0]}</div>,
        options: shuffle([item[1], ...others.map((o: any) => o[1])]),
        correct: item[1],
        speechText: item[1],
        isArabicButtons: true,
        tip: `${item[1]} (${item[2]}) = ${item[3] || item[2]}.`,
      };
    } else {
      // Show Arabic -> pick Indonesian
      return {
        prompt: 'Apa arti kata bahasa Arab ini?',
        hint: `Dibaca: "${item[2]}"`,
        bigContent: <span className="text-4xl sm:text-5xl font-bold font-serif text-emerald-700">{item[1]}</span>,
        options: shuffle([item[3] || item[2], ...others.map((o: any) => o[3] || o[2])]),
        correct: item[3] || item[2],
        speechText: item[1],
        tip: `${item[1]} = ${item[3] || item[2]}.`,
      };
    }
  };

  // Launch a selected Gate
  const handleStartGate = (gate: any) => {
    sound.playPop();
    setActiveGateId(gate.id);
    setIsFinished(false);
    setQIndex(0);
    setCorrectCount(0);
    setSelectedOption(null);
    setFeedback(null);
    setIsLocked(false);

    const initLives = gate.id === 'ujian' ? 5 : (currentLevelInfo.nyawa || 6);
    setLives(initLives);
    setMaxLives(initLives);

    if (gate.id === 'memori') {
      setGameMode('memori');
      setupMemori();
    } else if (gate.id === 'balon') {
      setGameMode('balon');
      setupBalon();
    } else if (gate.id === 'kilat') {
      setGameMode('kilat');
      setupKilat();
    } else if (gate.id === 'kalimat' || gate.id === 'eja') {
      setGameMode('susun');
      setupSusun(gate.id);
    } else {
      setGameMode('quiz');
      setTotalQuestions(gate.id === 'ujian' ? 12 : 8);
      const firstQ = generateQuestion(gate.id);
      setCurrentQ(firstQ);
      if (firstQ.speechText) sound.speak(firstQ.speechText);
    }
  };

  // Memori Setup
  const setupMemori = () => {
    const pairCount = levelId === 'musafir' ? 4 : levelId === 'pengembara' ? 6 : 8;
    const shuffledItems = [...BANK.KATA].sort(() => Math.random() - 0.5).slice(0, pairCount);
    const cards: any[] = [];
    shuffledItems.forEach((item: any, idx: number) => {
      cards.push({ id: idx, content: item[0], isArabic: false, isFlipped: false, isMatched: false });
      cards.push({ id: idx, content: item[1], isArabic: true, isFlipped: false, isMatched: false });
    });
    setMemoriCards(cards.sort(() => Math.random() - 0.5));
    setMemoriFlipped([]);
    setMemoriWrongCount(0);
  };

  const handleMemoriCardClick = (cardIdx: number) => {
    if (isLocked || memoriCards[cardIdx].isFlipped || memoriCards[cardIdx].isMatched) return;

    sound.playPop();
    const updated = [...memoriCards];
    updated[cardIdx].isFlipped = true;
    setMemoriCards(updated);

    const newFlipped = [...memoriFlipped, cardIdx];
    setMemoriFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [firstIdx, secondIdx] = newFlipped;
      if (memoriCards[firstIdx].id === memoriCards[secondIdx].id) {
        sound.playSuccess();
        setTimeout(() => {
          setMemoriCards((prev) => {
            const next = [...prev];
            next[firstIdx].isMatched = true;
            next[secondIdx].isMatched = true;
            if (next.every((c) => c.isMatched)) {
              endGameRound(3);
            }
            return next;
          });
          setMemoriFlipped([]);
          setIsLocked(false);
        }, 500);
      } else {
        sound.playGentleBoing();
        setMemoriWrongCount((w) => w + 1);
        setTimeout(() => {
          setMemoriCards((prev) => {
            const next = [...prev];
            next[firstIdx].isFlipped = false;
            next[secondIdx].isFlipped = false;
            return next;
          });
          setMemoriFlipped([]);
          setIsLocked(false);
        }, 800);
      }
    }
  };

  // Susun Setup
  const setupSusun = (type: 'kalimat' | 'eja') => {
    if (type === 'kalimat') {
      const item = [...BANK.KALIMAT].sort(() => Math.random() - 0.5)[0];
      const words = item[0];
      const scrambled = [...words].sort(() => Math.random() - 0.5);
      setSusunOriginal(words);
      setSusunPool(scrambled);
      setSusunPlaced([]);
      setSusunMeta({
        title: 'Susun kata menjadi kalimat yang tepat:',
        hint: `Arti: "${item[1]}"`,
        joinChar: ' ',
      });
    } else {
      const item = [...BANK.EJA].sort(() => Math.random() - 0.5)[0];
      const letters = Array.from(item[1] as string);
      const scrambled = [...letters].sort(() => Math.random() - 0.5);
      setSusunOriginal(letters);
      setSusunPool(scrambled);
      setSusunPlaced([]);
      setSusunMeta({
        title: `Susun huruf membentuk kata: ${item[0]}`,
        hint: `Arti: ${item[3]} (Dibaca: ${item[2]})`,
        joinChar: '',
      });
    }
  };

  const handleCheckSusun = () => {
    if (susunPlaced.length !== susunOriginal.length) {
      setFeedback({ isCorrect: false, text: 'Letakkan semua potongan terlebih dahulu ya!' });
      return;
    }
    const arranged = susunPlaced.map((i) => susunPool[i]);
    const isOk = arranged.join('|') === susunOriginal.join('|');
    if (isOk) {
      sound.playSuccess();
      setFeedback({ isCorrect: true, text: `Hebat! مُمْتَاز! Benar: ${susunOriginal.join(susunMeta.joinChar)}` });
      setCorrectCount((c) => c + 1);
      setTimeout(() => {
        endGameRound(3);
      }, 1200);
    } else {
      sound.playGentleBoing();
      setLives((l) => l - 1);
      setFeedback({ isCorrect: false, text: `Belum tepat. Urutan benar: ${susunOriginal.join(susunMeta.joinChar)}` });
      setTimeout(() => {
        setupSusun(activeGateId as any);
      }, 1800);
    }
  };

  // Balon Setup
  const setupBalon = () => {
    setBalonTime(40);
    setCorrectCount(0);
    const target = [...BANK.HURUF].sort(() => Math.random() - 0.5)[0];
    setBalonTarget([target[0], target[1]]);
    setBalons([]);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setBalonTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          endGameRound(3);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  // Balon spawning effect
  useEffect(() => {
    if (gameMode !== 'balon' || balonTime <= 0) return;
    const colors = ['#E14D4D', '#3D74C9', '#3B9E56', '#7D55D4', '#E8862B', '#149E96', '#D6408B'];
    const interval = setInterval(() => {
      const isTarget = Math.random() < 0.45;
      const charData = isTarget ? balonTarget : [...BANK.HURUF].sort(() => Math.random() - 0.5)[0];
      const newBalon = {
        id: Date.now() + Math.random(),
        char: charData[0],
        name: charData[1],
        x: 10 + Math.random() * 75,
        speed: 4 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      setBalons((prev) => [...prev.slice(-8), newBalon]);
    }, 900);
    return () => clearInterval(interval);
  }, [gameMode, balonTime, balonTarget]);

  const handlePopBalon = (b: any) => {
    sound.playPop();
    if (b.char === balonTarget[0]) {
      sound.playSuccess();
      setCorrectCount((c) => c + 1);
      setFeedback({ isCorrect: true, text: `Tepat sekali! Huruf ${balonTarget[1]}` });
      // Pick next target
      const nextTarget = [...BANK.HURUF].sort(() => Math.random() - 0.5)[0];
      setBalonTarget([nextTarget[0], nextTarget[1]]);
    } else {
      sound.playGentleBoing();
      setFeedback({ isCorrect: false, text: `Itu huruf ${b.name}, cari huruf ${balonTarget[1]} ya!` });
    }
    setBalons((prev) => prev.filter((item) => item.id !== b.id));
  };

  // Kilat Setup
  const setupKilat = () => {
    setKilatTime(45);
    setCorrectCount(0);
    const pool = ['huruf', 'harakat', 'kata', 'angka', 'raqm', 'hari'];
    const randomGate = pool[Math.floor(Math.random() * pool.length)];
    setCurrentQ(generateQuestion(randomGate));

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setKilatTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          endGameRound(3);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  // Answer multiple choice question
  const handleAnswer = (option: string) => {
    if (isLocked || !currentQ) return;
    setIsLocked(true);
    setSelectedOption(option);

    const isCorrect = option === currentQ.correct;

    if (isCorrect) {
      sound.playSuccess();
      setCorrectCount((c) => c + 1);
      setFeedback({ isCorrect: true, text: 'Hebat! مُمْتَاز! Jawabanmu tepat!' });
    } else {
      sound.playGentleBoing();
      setLives((l) => l - 1);
      setFeedback({ isCorrect: false, text: currentQ.tip || `Jawaban yang benar: ${currentQ.correct}` });
    }

    setTimeout(() => {
      if (gameMode === 'kilat') {
        const pool = ['huruf', 'harakat', 'kata', 'angka', 'raqm', 'hari'];
        const randomGate = pool[Math.floor(Math.random() * pool.length)];
        setCurrentQ(generateQuestion(randomGate));
        setSelectedOption(null);
        setFeedback(null);
        setIsLocked(false);
      } else {
        const nextQIndex = qIndex + 1;
        if (nextQIndex >= totalQuestions || lives - (isCorrect ? 0 : 1) <= 0) {
          const ratio = (correctCount + (isCorrect ? 1 : 0)) / totalQuestions;
          const stars = ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : 1;
          endGameRound(stars);
        } else {
          setQIndex(nextQIndex);
          const nextQ = generateQuestion(activeGateId || 'huruf');
          setCurrentQ(nextQ);
          setSelectedOption(null);
          setFeedback(null);
          setIsLocked(false);
          if (nextQ.speechText) sound.speak(nextQ.speechText);
        }
      }
    }, isCorrect ? 900 : 1500);
  };

  const endGameRound = (stars: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    sound.playFanfare();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    setEarnedStarsRound(stars);
    setTotalStars((s) => s + stars);
    if (activeGateId) {
      setGateStars((prev) => ({
        ...prev,
        [activeGateId]: Math.max(prev[activeGateId] || 0, stars),
      }));
    }
    setIsFinished(true);
    onFinishGame(stars * 5, correctCount * 10);
  };

  // Find all gate items
  const allGateItems = GERBANG.flatMap((g: any) => g.items);
  const filteredCategories = fokusId === 'semua' ? GERBANG : GERBANG.filter((g: any) => g.id === fokusId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (activeGateId) {
                if (timerRef.current) clearInterval(timerRef.current);
                setActiveGateId(null);
                setGameMode(null);
                setIsFinished(false);
              } else {
                onBack();
              }
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-foreground bg-card border border-border px-4 py-2 rounded-full shadow-2xs hover:bg-muted transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>{activeGateId ? 'Daftar Gerbang' : 'Kembali ke Mora'}</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌙</span>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                Petualangan Bahasa Arab
              </h1>
            </div>
            <p className="text-xs text-ink-soft">
              Negeri 1001 Malam · 30 Gerbang Kosakata, Huruf &amp; Tantangan
            </p>
          </div>
        </div>

        {/* Player Badge, Rank & Stars */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-primary font-bold text-xs border border-primary/20">
            <span>{currentRank.emoji}</span>
            <span>{currentRank.nama}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sun/15 border border-sun/30 text-sun-foreground font-bold text-xs shadow-2xs">
            <Star className="size-3.5 fill-sun text-sun" />
            <span className="font-display font-black text-sm tabular-nums">{totalStars}</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-coral-soft text-coral font-bold text-xs border border-coral/30">
            <Flame className="size-3.5 fill-coral" />
            <span>{streakDays} Hari</span>
          </div>
        </div>
      </div>

      {/* WIZARD OR GAME SCREEN */}
      {!activeGateId ? (
        <div>
          {/* 4-Step Preparation Wizard Pills */}
          <div className="flex items-center justify-between max-w-xl mx-auto mb-8 p-1.5 bg-muted rounded-full border border-border">
            {[
              { num: 1, label: '1. Profil' },
              { num: 2, label: '2. Level' },
              { num: 3, label: '3. Fokus' },
              { num: 4, label: '4. 30 Gerbang' },
            ].map((st) => (
              <button
                key={st.num}
                onClick={() => {
                  sound.playPop();
                  setCurrentStep(st.num as any);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer text-center ${
                  currentStep === st.num
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-ink-soft hover:text-foreground'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* STEP 1: Profil & Room */}
          {currentStep === 1 && (
            <div className="paper-card rounded-3xl p-6 sm:p-10 max-w-xl mx-auto border border-border">
              <span className="text-xs font-bold text-primary uppercase tracking-wider font-hand">
                LANGKAH 1 DARI 4
              </span>
              <h2 className="font-display text-2xl font-black text-foreground mt-1 mb-2">
                Siapa Nama Penjelajah Cilik?
              </h2>
              <p className="text-xs text-ink-soft mb-6">
                Nama ini akan muncul di ucapan sambutan, lencana kelulusan, dan papan bintang bersama.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Nama Pemain</label>
                  <input
                    type="text"
                    value={pemainName}
                    onChange={(e) => setPemainName(e.target.value)}
                    placeholder="Contoh: Zahra"
                    className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Kode Room Bersama (Opsional)
                  </label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: KELAS-1A"
                    className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-xs uppercase tracking-wider"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Cocok untuk belajar bareng satu kelas atau keluarga di rumah!
                  </p>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      sound.playPop();
                      setCurrentStep(2);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-play cursor-pointer"
                  >
                    <span>Lanjut ke Level</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Tingkat Tantangan */}
          {currentStep === 2 && (
            <div className="paper-card rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto border border-border">
              <span className="text-xs font-bold text-primary uppercase tracking-wider font-hand">
                LANGKAH 2 DARI 4
              </span>
              <h2 className="font-display text-2xl font-black text-foreground mt-1 mb-2">
                Pilih Tingkat Tantangan
              </h2>
              <p className="text-xs text-ink-soft mb-6">
                Tingkat kesulitan menyaring jumlah pilihan jawaban dan jumlah nyawa pemain.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {LEVELS.map((lvl: any) => {
                  const isSelected = levelId === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => {
                        sound.playPop();
                        setLevelId(lvl.id);
                      }}
                      className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-2 border-primary bg-secondary/40 shadow-play scale-102'
                          : 'bg-card border-border hover:border-primary/40'
                      }`}
                    >
                      <div>
                        <span className="text-4xl block mb-2">{lvl.emoji}</span>
                        <h3 className="font-display text-lg font-black text-foreground">{lvl.nama}</h3>
                        <p className="text-xs text-ink-soft mt-1 leading-relaxed">{lvl.sub}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/60 text-xs font-bold text-primary">
                        {lvl.opsi} Pilihan · {lvl.nyawa} ❤️
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-xs font-bold text-ink-soft hover:text-foreground"
                >
                  Kembali
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    setCurrentStep(3);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-play cursor-pointer"
                >
                  <span>Pilih Fokus Belajar</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Fokus Belajar */}
          {currentStep === 3 && (
            <div className="paper-card rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto border border-border">
              <span className="text-xs font-bold text-primary uppercase tracking-wider font-hand">
                LANGKAH 3 DARI 4
              </span>
              <h2 className="font-display text-2xl font-black text-foreground mt-1 mb-2">
                Pilih Fokus Pembelajaran
              </h2>
              <p className="text-xs text-ink-soft mb-6">
                Ingin belajar huruf dulu, kosakata benda, percakapan sehari-hari, atau semua tema?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { id: 'semua', title: '🌟 Semua 30 Gerbang', desc: 'Buka petualangan lengkap tanpa batas' },
                  { id: 'hurufbunyi', title: '🔤 Huruf & Bunyi', desc: 'Hijaiyah, harakat, bunyi, sambung, syamsi' },
                  { id: 'katabenda', title: '🧺 Kata & Benda', desc: 'Kosakata gambar, angka, raqm, memori, eja' },
                  { id: 'alamdunia', title: '🏞️ Alam & Kehidupan', desc: 'Profesi, cuaca, waktu, alam semesta' },
                  { id: 'kalimatcakap', title: '💬 Kalimat & Percakapan', desc: 'Sapaan, kata tunjuk, dhamir, doa' },
                  { id: 'tantangan', title: '⚡ Tantangan Cepat', desc: 'Gerbang Kilat & Ujian Akbar' },
                ].map((f) => {
                  const isSelected = fokusId === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        sound.playPop();
                        setFokusId(f.id);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-2 border-primary bg-secondary/40 shadow-xs'
                          : 'bg-card border-border hover:bg-muted'
                      }`}
                    >
                      <h4 className="font-display text-sm font-black text-foreground">{f.title}</h4>
                      <p className="text-xs text-ink-soft mt-0.5">{f.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-xs font-bold text-ink-soft hover:text-foreground"
                >
                  Kembali
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    setCurrentStep(4);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-play cursor-pointer"
                >
                  <span>Buka Peta Gerbang</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Peta 30 Gerbang, Stiker, Misi, Papan Bintang */}
          {currentStep === 4 && (
            <div className="space-y-8">
              {/* Explorer Summary & Control Bar */}
              <div className="paper-card rounded-3xl p-6 bg-gradient-to-r from-sun/10 via-card to-secondary/30 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl shadow-xs">
                    {currentRank.emoji}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-black text-foreground">
                      Selamat datang, {pemainName}!
                    </h3>
                    <p className="text-xs text-ink-soft">
                      Level: <strong className="text-foreground">{currentLevelInfo.nama}</strong> · Fokus: <strong className="text-foreground">{fokusId.toUpperCase()}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playPop();
                      setUnlockAllGates(!unlockAllGates);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                      unlockAllGates
                        ? 'bg-mint-soft text-mint border-mint/30'
                        : 'bg-card text-ink-soft border-border'
                    }`}
                  >
                    {unlockAllGates ? '🔓 Semua Gerbang Terbuka' : '🔒 Kunci Bertahap Aktif'}
                  </button>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-3.5 py-1.5 rounded-full bg-card hover:bg-muted border border-border text-xs font-bold text-foreground cursor-pointer"
                  >
                    Ganti Level / Fokus
                  </button>
                </div>
              </div>

              {/* Navigation Sub-Tabs */}
              <div className="flex items-center justify-center gap-2">
                {[
                  { id: 'gerbang' as const, label: '🚪 30 Gerbang Petualangan' },
                  { id: 'stiker' as const, label: '🎨 Album 50 Stiker' },
                  { id: 'misi' as const, label: '🎯 Misi Harian' },
                ].map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => {
                      sound.playPop();
                      setActiveTabSub(tb.id);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-all ${
                      activeTabSub === tb.id
                        ? 'bg-primary text-white shadow-play'
                        : 'bg-card text-ink-soft hover:bg-muted border border-border'
                    }`}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>

              {/* SUBTAB 1: 30 GERBANG */}
              {activeTabSub === 'gerbang' && (
                <div className="space-y-10">
                  {filteredCategories.map((cat: any) => (
                    <div key={cat.id} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary" />
                        <h3 className="font-display text-xl font-black text-foreground">
                          {cat.grup}
                        </h3>
                        <span className="text-xs text-ink-soft">({cat.desc})</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {cat.items.map((gate: any, idx: number) => {
                          const stars = gateStars[gate.id] || 0;
                          const unlocked = isGateUnlocked(idx);

                          return (
                            <button
                              key={gate.id}
                              disabled={!unlocked}
                              onClick={() => handleStartGate(gate)}
                              className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer group ${
                                !unlocked
                                  ? 'bg-muted/40 border-border opacity-60 cursor-not-allowed'
                                  : 'paper-card hover:-translate-y-1 hover:border-primary/40'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-3xl">{gate.emoji}</span>
                                  {unlocked ? (
                                    <div className="flex items-center gap-0.5 text-xs text-sun">
                                      {[1, 2, 3].map((s) => (
                                        <Star
                                          key={s}
                                          className={`size-3.5 ${
                                            stars >= s ? 'fill-sun text-sun' : 'text-border'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  ) : (
                                    <Lock className="size-4 text-muted-foreground" />
                                  )}
                                </div>

                                <h4 className="font-display text-base font-black text-foreground group-hover:text-primary transition-colors">
                                  {gate.judul}
                                </h4>
                                <p className="text-xs text-ink-soft mt-1 line-clamp-2">
                                  {gate.sub}
                                </p>
                              </div>

                              <div className="mt-4 pt-3 flex items-center justify-between text-xs font-bold border-t border-border/60 text-primary">
                                <span>{unlocked ? 'Mulai Petualangan' : 'Terkunci'}</span>
                                <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUBTAB 2: ALBUM STIKER */}
              {activeTabSub === 'stiker' && (
                <div className="paper-card rounded-3xl p-6 sm:p-10 border border-border">
                  <div className="text-center max-w-md mx-auto mb-8">
                    <span className="text-xs font-bold text-primary uppercase font-hand">
                      KOLEKSI NEGERI 1001 MALAM
                    </span>
                    <h3 className="font-display text-2xl font-black text-foreground mt-1">
                      Album 50 Stiker Ajaib
                    </h3>
                    <p className="text-xs text-ink-soft mt-1">
                      Kumpulkan 1 stiker setiap memperoleh 10 bintang! Stiker terbuka: {Math.min(50, Math.floor(totalStars / 10))} / 50
                    </p>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                    {STIKER.map((emoji: string, idx: number) => {
                      const isUnlocked = totalStars >= (idx + 1) * 10 || unlockAllGates;
                      return (
                        <div
                          key={idx}
                          className={`size-14 sm:size-16 rounded-2xl flex flex-col items-center justify-center border text-2xl sm:text-3xl transition-all ${
                            isUnlocked
                              ? 'bg-card border-border shadow-xs hover:scale-110'
                              : 'bg-muted/50 border-dashed border-border opacity-40 grayscale'
                          }`}
                          title={isUnlocked ? `Stiker #${idx + 1}` : `Butuh ${(idx + 1) * 10} bintang`}
                        >
                          {isUnlocked ? emoji : '🔒'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUBTAB 3: MISI HARIAN */}
              {activeTabSub === 'misi' && (
                <div className="paper-card rounded-3xl p-6 sm:p-10 border border-border max-w-2xl mx-auto">
                  <h3 className="font-display text-2xl font-black text-foreground mb-4">
                    Misi Harian Penjelajah
                  </h3>
                  <div className="space-y-3">
                    {MISI.slice(0, 4).map((m: any) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{m.ikon}</span>
                          <div>
                            <h4 className="font-display font-bold text-sm text-foreground">{m.teks}</h4>
                            <span className="text-[11px] text-ink-soft">Hadiah: +5 ⭐ Bintang Bonus</span>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-sun/15 text-sun-foreground text-xs font-bold">
                          Aktif
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : isFinished ? (
        /* VICTORY & SUMMARY SCREEN */
        <div className="paper-card rounded-3xl p-8 sm:p-12 text-center shadow-play border border-border max-w-xl mx-auto">
          <div className="size-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 text-4xl">
            {earnedStarsRound >= 2 ? '🧞' : '🐫'}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-2xl mb-2 text-sun">
            {[1, 2, 3].map((s) => (
              <span key={s}>{earnedStarsRound >= s ? '⭐' : '☆'}</span>
            ))}
          </div>

          <h2 className="font-display text-3xl font-black text-foreground mb-1">
            {earnedStarsRound === 3 ? 'LUAR BIASA! مُمْتَاز!' : 'HEBAT SEKALI!'}
          </h2>
          <p className="text-sm text-ink-soft mb-6">
            Kamu menyelesaikan tantangan dengan {correctCount} jawaban benar!
          </p>

          <div className="p-4 rounded-2xl bg-secondary mb-6 text-xs text-foreground flex justify-around font-bold">
            <div>
              <span className="text-ink-soft block">Bintang Ronde</span>
              <span className="text-primary font-display text-lg">+{earnedStarsRound} ⭐</span>
            </div>
            <div>
              <span className="text-ink-soft block">Total Bintang</span>
              <span className="text-sun-foreground font-display text-lg">{totalStars} ⭐</span>
            </div>
            <div>
              <span className="text-ink-soft block">Pangkat</span>
              <span className="text-foreground font-display text-lg">{currentRank.emoji} {currentRank.nama}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                const gate = allGateItems.find((g: any) => g.id === activeGateId);
                if (gate) handleStartGate(gate);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-play cursor-pointer"
            >
              <RefreshCw className="size-4" />
              <span>Main Lagi</span>
            </button>

            <button
              onClick={() => {
                setActiveGateId(null);
                setGameMode(null);
                setIsFinished(false);
              }}
              className="px-6 py-3 rounded-full bg-card hover:bg-muted text-foreground border border-border font-bold text-sm cursor-pointer"
            >
              Pilih Gerbang Lain
            </button>
          </div>
        </div>
      ) : (
        /* IN-GAME PLAY ZONE */
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Game HUD Bar */}
          <div className="paper-card rounded-2xl p-4 flex items-center justify-between border border-border">
            {/* Lives */}
            <div className="flex items-center gap-1">
              {Array.from({ length: maxLives }).map((_, i) => (
                <span key={i} className="text-lg">
                  {i < lives ? '❤️' : '🤍'}
                </span>
              ))}
            </div>

            {/* Title / Mode */}
            <div className="text-xs font-bold text-foreground font-display uppercase tracking-wider">
              {gameMode === 'balon' ? `⏱ Waktu: ${balonTime}s` : gameMode === 'kilat' ? `⚡ Cepat: ${kilatTime}s` : `Soal ${qIndex + 1} dari ${totalQuestions}`}
            </div>

            {/* Score */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-sun-foreground">
              <Star className="size-4 fill-sun text-sun" />
              <span>Benar: {correctCount}</span>
            </div>
          </div>

          {/* MODE: MULTIPLE CHOICE */}
          {gameMode === 'quiz' || gameMode === 'kilat' ? (
            <div className="paper-card rounded-3xl p-6 sm:p-10 text-center border border-border">
              {currentQ && (
                <>
                  <p className="text-sm font-bold text-ink-soft mb-2">{currentQ.prompt}</p>
                  {currentQ.hint && <p className="text-xs text-primary font-medium mb-3">{currentQ.hint}</p>}

                  {/* Big visual container */}
                  <div className="my-6 min-h-24 flex items-center justify-center">
                    {currentQ.bigContent}
                  </div>

                  {/* Speech button */}
                  {currentQ.speechText && (
                    <button
                      onClick={() => sound.speak(currentQ.speechText!)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-primary font-bold text-xs mb-8 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Volume2 className="size-4" />
                      <span>Dengarkan Suara</span>
                    </button>
                  )}

                  {/* Options Grid */}
                  <div className={`grid gap-3 ${currentQ.options.length <= 2 ? 'grid-cols-2 max-w-sm mx-auto' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {currentQ.options.map((opt, i) => {
                      let btnStyle = 'bg-card hover:bg-muted text-foreground border-border hover:border-primary/40';
                      if (selectedOption !== null) {
                        if (opt === currentQ.correct) {
                          btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-play scale-102';
                        } else if (opt === selectedOption) {
                          btnStyle = 'bg-rose-500 text-white border-rose-600';
                        } else {
                          btnStyle = 'bg-card text-muted-foreground opacity-50 border-border';
                        }
                      }

                      return (
                        <button
                          key={i}
                          disabled={isLocked}
                          onClick={() => handleAnswer(opt)}
                          className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-display text-base font-bold cursor-pointer transition-all active:scale-95 shadow-2xs ${
                            currentQ.isArabicBig
                              ? 'text-3xl sm:text-4xl font-serif py-5'
                              : currentQ.isArabicButtons
                              ? 'text-xl sm:text-2xl font-serif py-3.5'
                              : ''
                          } ${btnStyle}`}
                        >
                          <span className="size-6 rounded-full bg-black/5 text-xs flex items-center justify-center font-sans font-bold opacity-75">
                            {i + 1}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Pedagogical Feedback Banner */}
                  {feedback && (
                    <div
                      className={`mt-6 p-4 rounded-2xl text-xs sm:text-sm font-bold animate-in fade-in ${
                        feedback.isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-50 text-rose-700 border border-rose-300'
                      }`}
                    >
                      {feedback.text}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : null}

          {/* MODE: MEMORI */}
          {gameMode === 'memori' && (
            <div className="paper-card rounded-3xl p-6 sm:p-8 text-center border border-border">
              <p className="text-sm font-bold text-ink-soft mb-6">
                Buka dua kartu yang sama: Cocokkan Gambar ↔ Bahasa Arab!
              </p>

              <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
                {memoriCards.map((card, idx) => {
                  const isRevealed = card.isFlipped || card.isMatched;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleMemoriCardClick(idx)}
                      className={`h-24 sm:h-28 rounded-2xl font-display text-2xl sm:text-3xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                        card.isMatched
                          ? 'bg-emerald-50 border-emerald-400 opacity-80 scale-95 shadow-inner'
                          : isRevealed
                          ? 'bg-card border-primary text-foreground shadow-md'
                          : 'bg-gradient-to-br from-primary to-emerald-600 border-white text-white hover:brightness-105 shadow-sm active:scale-95'
                      }`}
                    >
                      {isRevealed ? (
                        <span className={card.isArabic ? 'font-serif text-xl sm:text-2xl font-bold' : ''}>
                          {card.content}
                        </span>
                      ) : (
                        <span className="font-serif text-2xl text-white/90">۞</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE: SUSUN (KALIMAT & EJA) */}
          {gameMode === 'susun' && (
            <div className="paper-card rounded-3xl p-6 sm:p-8 text-center border border-border">
              <p className="text-sm font-bold text-foreground mb-1">{susunMeta.title}</p>
              <p className="text-xs text-primary font-medium mb-6">{susunMeta.hint}</p>

              {/* Placed Target Slots */}
              <div className="min-h-20 p-4 rounded-2xl bg-secondary/40 border border-primary/20 flex flex-wrap items-center justify-center gap-2 mb-6" dir="rtl">
                {susunPlaced.length === 0 ? (
                  <span className="text-xs text-muted-foreground font-sans">
                    — Ketuk kata di bawah untuk meletakkan di sini —
                  </span>
                ) : (
                  susunPlaced.map((poolIdx, pos) => (
                    <button
                      key={pos}
                      onClick={() => {
                        const updated = [...susunPlaced];
                        updated.splice(pos, 1);
                        setSusunPlaced(updated);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-card border-2 border-primary text-foreground font-serif text-xl font-bold shadow-xs cursor-pointer hover:bg-rose-50 hover:border-rose-400 transition-colors"
                    >
                      {susunPool[poolIdx]}
                    </button>
                  ))
                )}
              </div>

              {/* Pool of Choices */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8" dir="rtl">
                {susunPool.map((word, idx) => {
                  const isUsed = susunPlaced.includes(idx);
                  if (isUsed) return null;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        sound.playPop();
                        setSusunPlaced((prev) => [...prev, idx]);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-card border border-border text-foreground font-serif text-xl font-bold shadow-xs hover:border-primary cursor-pointer active:scale-95 transition-transform"
                    >
                      {word}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleCheckSusun}
                className="px-8 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-play cursor-pointer"
              >
                ✔ Periksa Susunan
              </button>

              {feedback && (
                <div
                  className={`mt-6 p-4 rounded-2xl text-xs sm:text-sm font-bold animate-in fade-in ${
                    feedback.isCorrect
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-50 text-rose-700 border border-rose-300'
                  }`}
                >
                  {feedback.text}
                </div>
              )}
            </div>
          )}

          {/* MODE: BALON (ARCADE LETUSKAN BALON) */}
          {gameMode === 'balon' && (
            <div className="paper-card rounded-3xl p-6 text-center border border-border relative overflow-hidden h-[420px] flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Tantangan Balon Huruf</p>
                <h3 className="font-display text-2xl font-black text-foreground mt-0.5">
                  Letuskan Huruf: <span className="text-primary font-serif text-3xl">{balonTarget[0]}</span> ({balonTarget[1]})
                </h3>
              </div>

              {/* Floating Balloons Field */}
              <div className="relative flex-1 overflow-hidden my-2">
                {balons.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handlePopBalon(b)}
                    style={{
                      left: `${b.x}%`,
                      animationDuration: `${b.speed}s`,
                    }}
                    className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center animate-bounce cursor-pointer group"
                  >
                    <div
                      style={{ backgroundColor: b.color }}
                      className="size-16 sm:size-18 rounded-full text-white font-serif text-3xl font-bold flex items-center justify-center shadow-md transition-transform group-hover:scale-110 active:scale-90"
                    >
                      {b.char}
                    </div>
                    <div className="w-0.5 h-6 bg-slate-400" />
                  </button>
                ))}
              </div>

              {feedback && (
                <div
                  className={`py-2 px-4 rounded-full text-xs font-bold mx-auto w-fit ${
                    feedback.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {feedback.text}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
