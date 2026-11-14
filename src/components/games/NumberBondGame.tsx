import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MoraButton } from '../ui/MoraPrimitives';
import { sound } from '../../utils/audio';

// Jembatan Angka — number bond, make ten, pola.
// Informed by Singapore-style CPA (konkret → gambar → angka) and the Indonesian
// "kematangan kognitif" foundation. See claude/mora-curriculum-research.md.
// Not an official curriculum claim; no timer, wrong answers get a hint, not a penalty.

interface Props {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
}

type Mode = 'menu' | 'bond' | 'ten' | 'pattern';

interface Question {
  prompt: string;
  visual: React.ReactNode;
  options: string[];
  answer: string;
  hint: string;
  why: string;
}

const QUESTIONS_PER_MODE = 5;

const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

function Dots({ filled, total, colorA = 'bg-mint', colorB = 'bg-coral' }: { filled: number; total: number; colorA?: string; colorB?: string }) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 max-w-xs" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`size-7 rounded-full border-2 border-foreground/20 ${i < filled ? colorA : colorB}`} />
      ))}
    </div>
  );
}

function TenFrame({ filled, loose }: { filled: number; loose: number }) {
  return (
    <div className="flex flex-col items-center gap-3" aria-hidden="true">
      <div className="grid grid-cols-5 gap-1 rounded-xl bg-border p-1">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="size-9 rounded-md bg-card grid place-items-center">
            {i < filled && <span className="size-6 rounded-full bg-mint" />}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5 max-w-[14rem]">
        {Array.from({ length: loose }, (_, i) => (
          <span key={i} className="size-7 rounded-full bg-coral" />
        ))}
      </div>
    </div>
  );
}

function makeOptions(answer: number, max: number): string[] {
  const set = new Set<number>([answer]);
  while (set.size < 3) {
    const v = rnd(Math.max(0, answer - 3), Math.min(max, answer + 3));
    set.add(v);
  }
  return shuffle([...set]).map(String);
}

function buildBond(): Question[] {
  return Array.from({ length: QUESTIONS_PER_MODE }, () => {
    const whole = rnd(4, 10);
    const a = rnd(1, whole - 1);
    const b = whole - a;
    return {
      prompt: `${whole} dipecah jadi ${a} dan berapa?`,
      visual: <Dots filled={a} total={whole} />,
      options: makeOptions(b, whole),
      answer: String(b),
      hint: 'Hitung titik yang berwarna oranye. Atau coba: berapa lagi supaya jadi ' + whole + '?',
      why: `${a} + ${b} = ${whole}, dan ${whole} − ${a} = ${b}. Satu gambar, banyak cerita!`,
    };
  });
}

function buildTen(): Question[] {
  const pairs: [number, number][] = [[8, 5], [9, 4], [7, 6], [8, 7], [9, 3], [7, 5]];
  return shuffle(pairs)
    .slice(0, QUESTIONS_PER_MODE)
    .map(([a, b]) => {
      const need = 10 - a;
      return {
        prompt: `Kotak sudah berisi ${a}. Ada ${b} di luar. Berapa lagi supaya kotak penuh?`,
        visual: <TenFrame filled={a} loose={b} />,
        options: makeOptions(need, 5),
        answer: String(need),
        hint: 'Hitung kotak yang masih kosong.',
        why: `Pindahkan ${need} ke kotak, jadi penuh (10). Sisa ${b - need}. Jadi ${a} + ${b} = 10 + ${b - need} = ${a + b}.`,
      };
    });
}

const Pd = ({ c }: { c: 'g' | 'r' | 'y' }) => (
  <span className={`size-9 rounded-full inline-block border-2 border-foreground/20 ${c === 'g' ? 'bg-mint' : c === 'r' ? 'bg-coral' : 'bg-sun'}`} />
);

function buildPattern(): Question[] {
  const seq = (cs: ('g' | 'r' | 'y')[]) => (
    <div className="flex items-center gap-2 flex-wrap justify-center" aria-hidden="true">
      {cs.map((c, i) => <Pd key={i} c={c} />)}
      <span className="size-9 rounded-full border-2 border-dashed border-foreground grid place-items-center font-bold">?</span>
    </div>
  );
  const nums = (ns: number[]) => (
    <div className="flex items-center gap-2 font-display text-3xl font-bold flex-wrap justify-center">
      {ns.map((n, i) => <span key={i} className="rounded-xl bg-muted px-3 py-1">{n}</span>)}
      <span className="rounded-xl border-2 border-dashed border-foreground px-3 py-1">?</span>
    </div>
  );
  return [
    { prompt: 'Lanjutkan polanya. Warna apa berikutnya?', visual: seq(['g', 'g', 'r', 'g', 'g', 'r', 'g', 'g']), options: ['hijau', 'merah', 'kuning'], answer: 'merah', hint: 'Bacakan pelan: hijau, hijau, merah… bagian mana yang berulang?', why: 'Polanya hijau-hijau-merah, lalu mengulang.' },
    { prompt: 'Angka berikutnya apa?', visual: nums([2, 4, 6, 8]), options: ['9', '10', '12'], answer: '10', hint: 'Dari 2 ke 4 naik berapa? Dari 4 ke 6?', why: 'Setiap angka naik 2. Ini sama dengan loncat 2.' },
    { prompt: 'Lanjutkan polanya. Warna apa berikutnya?', visual: seq(['r', 'y', 'g', 'r', 'y', 'g', 'r']), options: ['kuning', 'hijau', 'merah'], answer: 'kuning', hint: 'Ada tiga warna yang bergantian. Setelah merah, apa?', why: 'Merah-kuning-hijau terus berulang.' },
    { prompt: 'Angka berikutnya apa?', visual: nums([5, 10, 15, 20]), options: ['22', '25', '30'], answer: '25', hint: 'Hitung loncat lima: 5, 10, 15…', why: 'Naik 5 setiap langkah.' },
    { prompt: 'Satu angka berbeda. Yang mana?', visual: <div className="flex gap-2 font-display text-3xl font-bold">{[2, 4, 7, 8].map((n) => <span key={n} className="rounded-xl bg-muted px-3 py-1">{n}</span>)}</div>, options: ['2', '4', '7', '8'], answer: '7', hint: 'Pasangkan benda dua-dua. Angka mana yang tersisa satu?', why: '2, 4, 8 habis dipasangkan (genap). 7 menyisakan satu (ganjil).' },
  ];
}

const MODES: { id: Exclude<Mode, 'menu'>; title: string; emoji: string; blurb: string }[] = [
  { id: 'bond', title: 'Pecah Angka', emoji: '🔗', blurb: 'Satu angka bisa dipecah jadi dua bagian' },
  { id: 'ten', title: 'Penuhi Sepuluh', emoji: '🔟', blurb: 'Isi kotak sepuluh dulu, sisanya belakangan' },
  { id: 'pattern', title: 'Pola & Teka-teki', emoji: '🧩', blurb: 'Temukan pola yang berulang' },
];

export const NumberBondGame: React.FC<Props> = ({ onBack, onFinishGame }) => {
  const [mode, setMode] = useState<Mode>('menu');
  const [qs, setQs] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [doneModes, setDoneModes] = useState<Set<string>>(new Set());
  const [sessionStars, setSessionStars] = useState(0);
  const [collected, setCollected] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = qs[idx];
  const solved = picked !== null && picked === q?.answer;

  const start = (m: Exclude<Mode, 'menu'>) => {
    setQs(m === 'bond' ? buildBond() : m === 'ten' ? buildTen() : buildPattern());
    setMode(m);
    setIdx(0);
    setPicked(null);
    setWrong(new Set());
    setMistakes(0);
    setFinished(false);
  };

  const choose = (o: string) => {
    if (solved) return;
    if (o === q.answer) {
      setPicked(o);
      sound.playPop();
    } else {
      setWrong((w) => new Set(w).add(o));
      setMistakes((m) => m + 1);
    }
  };

  const next = () => {
    if (idx + 1 < qs.length) {
      setIdx(idx + 1);
      setPicked(null);
      setWrong(new Set());
      return;
    }
    // finished a mode
    if (!doneModes.has(mode)) {
      setSessionStars((s) => s + Math.max(3, 7 - mistakes));
      setDoneModes((d) => new Set(d).add(mode));
    }
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    setFinished(true);
  };

  const modeInfo = useMemo(() => MODES.find((m) => m.id === mode), [mode]);

  const Header = (
    <div className="flex items-center gap-3 mb-6">
      <MoraButton variant="ghost" size="icon" aria-label="Kembali" onClick={mode === 'menu' ? onBack : () => setMode('menu')}>
        <ArrowLeft className="size-5" />
      </MoraButton>
      <h2 className="font-display text-2xl font-bold">{modeInfo ? `${modeInfo.emoji} ${modeInfo.title}` : '🔗 Jembatan Angka'}</h2>
    </div>
  );

  if (mode === 'menu') {
    return (
      <div className="mx-auto max-w-2xl p-4">
        {Header}
        <p className="text-muted-foreground mb-5">Pegang dulu, gambar, baru angka. Tidak ada waktu, tidak ada nilai jelek. Salah? Dapat petunjuk saja.</p>
        <div className="grid gap-3">
          {MODES.map((m) => (
            <button key={m.id} onClick={() => start(m.id)} className="paper-card flex items-center gap-4 p-4 text-left hover:-translate-y-0.5 transition-transform">
              <span className="text-4xl">{m.emoji}</span>
              <span className="flex-1">
                <span className="block font-display text-lg font-bold">{m.title}</span>
                <span className="block text-sm text-muted-foreground">{m.blurb}</span>
              </span>
              {doneModes.has(m.id) && <Check className="size-5 text-mint" aria-label="Selesai" />}
            </button>
          ))}
        </div>
        {sessionStars > 0 && (
          <div className="mt-6 flex justify-center">
            <MoraButton
              disabled={collected}
              onClick={() => {
                sound.playPop();
                setCollected(true);
                onFinishGame(sessionStars, sessionStars);
              }}
            >
              <Star className="size-4" />
              {collected ? 'Bintang Sudah Terkumpul' : `Selesai & Kumpulkan ${sessionStars} Bintang`}
            </MoraButton>
          </div>
        )}
        <p className="mt-6 text-xs text-muted-foreground">Konsep terinspirasi pendekatan konkret–gambar–angka. Bukan klaim kurikulum resmi.</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-2xl p-4 text-center">
        {Header}
        <div className="text-6xl mb-3">🎉</div>
        <p className="font-display text-xl font-bold mb-1">Hebat! Selesai.</p>
        <p className="text-muted-foreground mb-5">Tanya anak: “Bagaimana kamu tahu?” Penjelasannya lebih berharga dari jawabannya.</p>
        <div className="flex justify-center gap-3">
          <MoraButton variant="outline" onClick={() => start(mode)}>Main lagi</MoraButton>
          <MoraButton onClick={() => setMode('menu')}>Pilih permainan</MoraButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      {Header}
      <p className="text-sm font-bold text-muted-foreground mb-2">Soal {idx + 1} dari {qs.length}</p>
      <div className="paper-card p-5 grid gap-5 justify-items-center text-center">
        <p className="font-display text-xl font-bold">{q.prompt}</p>
        {q.visual}
        <div className="flex flex-wrap justify-center gap-3" role="group" aria-label="Pilihan jawaban">
          {q.options.map((o) => {
            const isRight = solved && o === q.answer;
            const isWrong = wrong.has(o);
            return (
              <button
                key={o}
                onClick={() => choose(o)}
                disabled={isWrong || solved}
                className={`min-w-16 min-h-14 rounded-2xl border-2 px-5 font-display text-2xl font-bold transition-colors ${
                  isRight ? 'border-mint bg-mint-soft' : isWrong ? 'border-coral bg-coral-soft opacity-60' : 'border-border bg-card hover:border-primary'
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
        <div aria-live="polite" className="min-h-12 text-sm">
          {solved ? (
            <p className="rounded-xl bg-mint-soft px-4 py-2"><b>Betul!</b> {q.why}</p>
          ) : wrong.size > 0 ? (
            <p className="rounded-xl bg-sun-soft px-4 py-2"><b>Belum pas, coba lagi.</b> Petunjuk: {q.hint}</p>
          ) : null}
        </div>
        {solved && (
          <MoraButton onClick={next}>{idx + 1 === qs.length ? 'Selesai' : 'Lanjut'}</MoraButton>
        )}
      </div>
    </div>
  );
};
