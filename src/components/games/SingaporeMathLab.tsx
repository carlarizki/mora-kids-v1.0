import React, { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

interface SingaporeMathLabProps {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
}

type TabId = 'cpa' | 'bond' | 'ten' | 'bar' | 'puzzle' | 'parent';

const TABS: { id: TabId; label: string }[] = [
  { id: 'cpa', label: 'Pegang, Gambar, Angka' },
  { id: 'bond', label: 'Number Bond' },
  { id: 'ten', label: 'Make Ten' },
  { id: 'bar', label: 'Bar Model' },
  { id: 'puzzle', label: 'Teka-teki' },
  { id: 'parent', label: 'Untuk Mama/Papa' },
];

/* ---------- shared bits ---------- */

const Chip: React.FC<{ active?: boolean; onClick: () => void; children: React.ReactNode; className?: string }> = ({
  active,
  onClick,
  children,
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`min-h-10 cursor-pointer rounded-xl border-2 px-3.5 py-1.5 text-sm font-bold transition-colors ${
      active
        ? 'border-primary bg-primary text-primary-foreground'
        : 'border-border bg-card text-foreground hover:border-primary'
    } ${className}`}
  >
    {children}
  </button>
);

const ActionButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  alt?: boolean;
  disabled?: boolean;
}> = ({ onClick, children, alt, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`min-h-11 cursor-pointer rounded-xl px-5 py-2 text-sm font-bold transition-opacity disabled:cursor-default disabled:opacity-40 ${
      alt ? 'border-2 border-border bg-card text-foreground' : 'bg-foreground text-background'
    }`}
  >
    {children}
  </button>
);

const Say: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-4 rounded-2xl bg-sun/15 px-4 py-3 text-sm leading-relaxed text-ink-soft">
    <span className="font-display text-xs font-black uppercase tracking-wide text-foreground">Ucapkan</span>
    <br />
    {children}
  </div>
);

const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-6">{children}</div>
);

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-4 flex min-h-48 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-muted p-4">
    {children}
  </div>
);

const Cap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="min-h-14 text-base font-bold text-foreground sm:text-lg" aria-live="polite">
    {children}
  </p>
);

const Apple: React.FC<{ color: string }> = ({ color }) => (
  <span className={`relative inline-block size-9 rounded-full ${color} shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.12)]`}>
    <span className="absolute -top-1 left-5 h-2 w-3 -rotate-[24deg] rounded-[12px_0] bg-mint" />
  </span>
);

const Dot: React.FC<{ tone: 'a' | 'b'; label?: number; on?: boolean }> = ({ tone, label, on }) => {
  const base = tone === 'a' ? 'border-coral' : 'border-sun';
  const fill = on ? (tone === 'a' ? 'bg-coral text-white' : 'bg-sun text-sun-foreground') : tone === 'a' ? 'bg-coral-soft' : 'bg-sun/20';
  return (
    <span className={`grid size-8 place-items-center rounded-full border-[3px] font-display text-sm font-black transition-colors ${base} ${fill}`}>
      {on && label !== undefined ? label : ''}
    </span>
  );
};

/* ---------- 1. CPA ---------- */

const CPA_CAPS = [
  'Pegang bendanya. Ada dua kelompok apel. Kalau digabung, jadi berapa?',
  'Sekarang bendanya jadi gambar. Ketuk "Hitung bersama" dan ikuti titiknya satu per satu.',
  'Gambarnya diwakili angka. Tanda + artinya digabung, tanda = artinya hasilnya sama dengan.',
];

const CpaTab: React.FC = () => {
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [merged, setMerged] = useState(false);
  const [count, setCount] = useState(0);
  const [counting, setCounting] = useState(false);

  useEffect(() => {
    if (!counting) return;
    if (count >= a + b) {
      setCounting(false);
      return;
    }
    const t = setTimeout(() => setCount((c) => c + 1), 550);
    return () => clearTimeout(t);
  }, [counting, count, a, b]);

  const reset = () => {
    setMerged(false);
    setCount(0);
    setCounting(false);
  };
  const goStage = (s: 0 | 1 | 2) => {
    reset();
    setStage(s);
  };
  const randomize = () => {
    let na = 1 + Math.floor(Math.random() * 5);
    let nb = 1 + Math.floor(Math.random() * 5);
    if (na === a && nb === b) nb = (nb % 5) + 1;
    reset();
    setA(na);
    setB(nb);
  };

  const says = [
    `Minta anak mengambil ${a} benda di tangan kiri dan ${b} di tangan kanan, lalu menggabungkannya. Tanya: "Semuanya ada berapa? Kamu hitung pakai apa?"`,
    'Gambar bendanya jadi titik. Tanya: "Titik merah ada berapa? Titik kuning berapa? Kalau dihitung semuanya?"',
    `Baru di tahap ini simbol ditulis. Tanya: "Angka ${a} mewakili apa tadi?" Kalau anak ragu, turun ke tahap gambar atau benda.`,
  ];

  return (
    <Panel>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Tahap CPA">
        <Chip active={stage === 0} onClick={() => goStage(0)}>1 · Benda</Chip>
        <Chip active={stage === 1} onClick={() => goStage(1)}>2 · Gambar</Chip>
        <Chip active={stage === 2} onClick={() => goStage(2)}>3 · Angka</Chip>
      </div>

      <Stage>
        {stage === 0 && (
          <>
            <div className="flex items-center" style={{ gap: merged ? 6 : 26, transition: 'gap 0.8s ease' }}>
              <div className="flex max-w-40 flex-wrap justify-center gap-1.5">
                {Array.from({ length: a }, (_, i) => <Apple key={i} color="bg-coral" />)}
              </div>
              <span
                className="overflow-hidden font-display text-4xl font-black"
                style={{ maxWidth: merged ? 0 : 40, opacity: merged ? 0 : 1, transition: 'max-width 0.6s, opacity 0.6s' }}
              >
                +
              </span>
              <div className="flex max-w-40 flex-wrap justify-center gap-1.5">
                {Array.from({ length: b }, (_, i) => <Apple key={i} color="bg-sun" />)}
              </div>
            </div>
            <p className="min-h-7 font-display text-xl font-black">
              {merged ? `Digabung: ${a + b} apel` : `${a} apel merah dan ${b} apel kuning`}
            </p>
          </>
        )}
        {stage === 1 && (
          <>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex max-w-44 flex-wrap justify-center gap-2">
                {Array.from({ length: a }, (_, i) => <Dot key={i} tone="a" label={i + 1} on={i < count} />)}
              </div>
              <div className="flex max-w-44 flex-wrap justify-center gap-2">
                {Array.from({ length: b }, (_, i) => <Dot key={i} tone="b" label={a + i + 1} on={a + i < count} />)}
              </div>
            </div>
            <p className="min-h-7 font-display text-xl font-black">
              {count > 0 ? `Hitungan: ${count}` : `${a} titik merah, ${b} titik kuning`}
            </p>
          </>
        )}
        {stage === 2 && (
          <div className="flex flex-wrap items-center justify-center gap-3 font-display text-6xl font-black sm:text-7xl">
            <span className="text-coral">{a}</span>
            <span className="text-muted-foreground">+</span>
            <span className="text-sun">{b}</span>
            <span className="text-muted-foreground">=</span>
            <span className="text-mint">{a + b}</span>
          </div>
        )}
      </Stage>

      <Cap>{CPA_CAPS[stage]}</Cap>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {stage === 0 && <ActionButton onClick={() => setMerged(true)} disabled={merged}>Gabungkan</ActionButton>}
        {stage === 1 && (
          <ActionButton
            onClick={() => {
              setCount(1);
              setCounting(true);
            }}
          >
            Hitung bersama
          </ActionButton>
        )}
        <ActionButton alt onClick={randomize}>Acak angka</ActionButton>
      </div>
      <Say>{says[stage]}</Say>
      <p className="mt-3 text-xs text-muted-foreground">
        Boleh balik ke tahap sebelumnya kapan saja kalau anak bingung. Urutannya bukan garis lurus.
      </p>
    </Panel>
  );
};

/* ---------- 2. Number bond ---------- */

const BondTab: React.FC = () => {
  const [n, setN] = useState(10);
  const [a, setA] = useState(4);
  const b = n - a;

  return (
    <Panel>
      <p className="mb-2 text-sm font-bold">Pilih angka utuh</p>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 9 }, (_, i) => i + 2).map((v) => (
          <Chip
            key={v}
            active={v === n}
            onClick={() => {
              setN(v);
              setA(Math.min(a, v));
            }}
          >
            {v}
          </Chip>
        ))}
      </div>

      <div className="mt-4 grid items-center gap-5 sm:grid-cols-[240px_1fr]">
        <svg viewBox="0 0 260 200" className="mx-auto w-full max-w-60" role="img" aria-label={`Number bond ${n} dipecah jadi ${a} dan ${b}`}>
          <g stroke="currentColor" strokeWidth="3" className="text-foreground">
            <line x1="130" y1="52" x2="62" y2="140" />
            <line x1="130" y1="52" x2="198" y2="140" />
          </g>
          <circle cx="130" cy="40" r="34" className="fill-sun stroke-foreground" strokeWidth="3" />
          <circle cx="62" cy="150" r="34" className="fill-mint-soft stroke-mint" strokeWidth="3" />
          <circle cx="198" cy="150" r="34" className="fill-coral-soft stroke-coral" strokeWidth="3" />
          {[
            [130, 40, n],
            [62, 150, a],
            [198, 150, b],
          ].map(([x, y, v], i) => (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-foreground font-display"
              style={{ fontSize: 26, fontWeight: 900 }}
            >
              {v}
            </text>
          ))}
        </svg>

        <div>
          <div className="grid gap-2">
            <div className="flex h-10 w-full overflow-hidden rounded-lg">
              <div className="grid w-full place-items-center bg-sun font-display text-lg font-black text-sun-foreground">{n}</div>
            </div>
            <div className="flex h-10 w-full overflow-hidden rounded-lg">
              <div className="grid place-items-center overflow-hidden bg-mint font-display text-lg font-black text-white transition-[width] duration-500" style={{ width: `${(a / n) * 100}%` }}>
                {a || ''}
              </div>
              <div className="grid place-items-center overflow-hidden bg-coral font-display text-lg font-black text-white transition-[width] duration-500" style={{ width: `${(b / n) * 100}%` }}>
                {b || ''}
              </div>
            </div>
          </div>
          <div className="mt-3.5 flex flex-wrap gap-1.5" aria-hidden="true">
            {Array.from({ length: n }, (_, i) => (
              <span key={i} className={`size-7 rounded-full border-[3px] ${i < a ? 'border-mint bg-mint-soft' : 'border-coral bg-coral-soft'}`} />
            ))}
          </div>
          <label htmlFor="bond-range" className="mt-4 mb-1 block text-sm font-bold">Geser untuk memecah</label>
          <input
            id="bond-range"
            type="range"
            min={0}
            max={n}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="h-8 w-full accent-primary"
          />
        </div>
      </div>

      <p className="mt-4 mb-2 text-sm font-bold">Semua pasangan, ketuk untuk melihatnya</p>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: n + 1 }, (_, i) => (
          <Chip key={i} active={i === a} onClick={() => setA(i)}>
            {i}+{n - i}
          </Chip>
        ))}
      </div>

      <div className="mt-4 grid gap-1.5 font-display text-lg font-black sm:grid-cols-2" aria-live="polite">
        <div>{a} + {b} = {n}</div>
        <div>{b} + {a} = {n}</div>
        <div>{n} − {a} = {b}</div>
        <div>{n} − {b} = {a}</div>
      </div>

      <Say>
        "{n} itu bisa dipecah jadi berapa saja? Kalau yang satu {a}, yang satunya berapa?" Biarkan anak menemukan pasangannya
        sendiri. Empat kalimat di atas muncul dari satu gambar yang sama, itu sebabnya tambah dan kurang terasa saling terhubung.
      </Say>
    </Panel>
  );
};

/* ---------- 3. Make ten ---------- */

const TEN_PROBLEMS: [number, number][] = [
  [8, 5],
  [9, 4],
  [7, 6],
  [8, 7],
];

const TenTab: React.FC = () => {
  const [p, setP] = useState(0);
  const [s, setS] = useState(0);
  const [a, b] = TEN_PROBLEMS[p];
  const need = 10 - a;
  const rest = b - need;

  const caps = [
    `Kotak sepuluh sudah berisi ${a}. Di samping ada ${b} yang menunggu.`,
    `Kotak butuh ${need} lagi supaya penuh. Pecah ${b} jadi ${need} dan ${rest}.`,
    `Pindahkan ${need} ke kotak. Sekarang kotak penuh: 10.`,
    `Tinggal 10 + ${rest} = ${a + b}. Jadi ${a} + ${b} = ${a + b}.`,
  ];
  const strayCount = s === 0 ? b : s === 1 ? b : rest;

  return (
    <Panel>
      <div className="flex flex-wrap gap-2">
        {TEN_PROBLEMS.map((pr, i) => (
          <Chip
            key={i}
            active={i === p}
            onClick={() => {
              setP(i);
              setS(0);
            }}
          >
            {pr[0]} + {pr[1]}
          </Chip>
        ))}
      </div>

      <Stage>
        <div className="flex flex-wrap items-center justify-center gap-7">
          <div className="grid grid-cols-5 gap-1 rounded-xl bg-border p-1">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="relative block size-10 rounded-md bg-card">
                {i < a && <span className="absolute inset-1.5 rounded-full bg-mint" />}
                {i >= a && s >= 2 && <span className="absolute inset-1.5 rounded-full bg-coral" />}
              </span>
            ))}
          </div>
          <div className="flex min-h-9 max-w-56 flex-wrap items-center gap-1.5">
            {Array.from({ length: strayCount }, (_, i) => {
              const isNeed = s === 1 && i < need;
              const isRest = s === 1 && i >= need;
              return (
                <span
                  key={i}
                  className={`block size-7 rounded-full transition-all ${
                    isRest ? 'border-[3px] border-dashed border-coral bg-coral-soft' : 'bg-coral'
                  } ${isNeed ? 'outline-3 outline-offset-2 outline-sun' : ''}`}
                />
              );
            })}
          </div>
        </div>
        <p className="min-h-8 text-center font-display text-2xl font-black">
          {s === 1 && <>{b} = <span className="text-coral">{need}</span> + {rest}</>}
          {s === 2 && <>{a} + <span className="text-coral">{need}</span> = <span className="text-mint">10</span></>}
          {s === 3 && <><span className="text-mint">10</span> + {rest} = <span className="text-mint">{a + b}</span></>}
        </p>
      </Stage>

      <Cap>{caps[s]}</Cap>
      <div className="mt-3 flex flex-wrap gap-2.5">
        <ActionButton onClick={() => setS((v) => Math.min(3, v + 1))} disabled={s >= 3}>Langkah berikutnya</ActionButton>
        <ActionButton alt onClick={() => setS(0)}>Ulang</ActionButton>
      </div>
      <Say>
        "Kotak ini muat sepuluh. Berapa lagi yang dibutuhkan supaya penuh?" Pertanyaan itu sama dengan number bond: 10 = {a} + ?
      </Say>
    </Panel>
  );
};

/* ---------- 4. Bar model ---------- */

interface Seg {
  n: number;
  kind: 'given' | 'ask';
  color: 'mint' | 'coral' | 'sun';
  text: string;
}
interface BarProblem {
  name: string;
  story: React.ReactNode;
  rows: { label: string; segs: Seg[] }[];
  caps: [string, string, string, string];
  say: string;
}

const hl = (t: string) => <mark className="rounded bg-sun/30 px-1.5 font-extrabold text-foreground">{t}</mark>;

const BAR_PROBLEMS: BarProblem[] = [
  {
    name: 'Gabung',
    story: <>Aira punya {hl('7')} stiker. Bimo punya {hl('5')} stiker. Berapa stiker mereka {hl('semuanya')}?</>,
    rows: [
      { label: 'Semua', segs: [{ n: 12, kind: 'ask', color: 'sun', text: '?' }] },
      {
        label: 'Bagian',
        segs: [
          { n: 7, kind: 'given', color: 'mint', text: 'Aira 7' },
          { n: 5, kind: 'given', color: 'coral', text: 'Bimo 5' },
        ],
      },
    ],
    caps: [
      'Baca pelan-pelan. Cari angka dan pertanyaannya.',
      'Gambar bar untuk Aira (7) dan Bimo (5), disusun berdampingan.',
      'Yang ditanya adalah keseluruhannya. Tandai dengan bar putus-putus di atas.',
      '7 + 5 = 12. Mereka punya 12 stiker.',
    ],
    say: '"Bagian-bagian ini kalau digabung jadi apa?" Anak belajar bahwa dua bagian membentuk satu keseluruhan.',
  },
  {
    name: 'Banding',
    story: <>Aira punya {hl('8')} stiker. Bimo punya {hl('5')} stiker. Berapa {hl('selisih')} stiker mereka?</>,
    rows: [
      { label: 'Aira', segs: [{ n: 8, kind: 'given', color: 'mint', text: '8' }] },
      {
        label: 'Bimo',
        segs: [
          { n: 5, kind: 'given', color: 'coral', text: '5' },
          { n: 3, kind: 'ask', color: 'sun', text: '?' },
        ],
      },
    ],
    caps: [
      'Baca pelan-pelan. Kata "selisih" artinya bedanya berapa.',
      'Gambar dua bar sejajar. Bar Aira lebih panjang dari bar Bimo.',
      'Selisih adalah bagian yang kurang di bar Bimo. Tandai dengan putus-putus.',
      '8 − 5 = 3. Aira punya 3 stiker lebih banyak.',
    ],
    say: '"Bar mana yang lebih panjang? Kurangnya berapa petak supaya sama?" Anak melihat selisih sebagai jarak, bukan hanya angka.',
  },
  {
    name: 'Bagian hilang',
    story: <>Ada {hl('12')} kelereng. {hl('7')} kelereng di kotak merah, sisanya di kotak biru. Berapa kelereng di {hl('kotak biru')}?</>,
    rows: [
      { label: 'Semua', segs: [{ n: 12, kind: 'given', color: 'sun', text: '12' }] },
      {
        label: 'Bagian',
        segs: [
          { n: 7, kind: 'given', color: 'mint', text: 'Merah 7' },
          { n: 5, kind: 'ask', color: 'coral', text: 'Biru ?' },
        ],
      },
    ],
    caps: [
      'Baca pelan-pelan. Totalnya diketahui, satu bagiannya juga.',
      'Gambar bar besar 12, lalu potong 7 untuk kotak merah.',
      'Yang ditanya adalah bagian biru. Tandai dengan putus-putus.',
      '12 − 7 = 5. Ada 5 kelereng di kotak biru.',
    ],
    say: '"Kalau semuanya 12 dan satu bagian 7, bagian satunya berapa?" Ini sama dengan number bond yang salah satu lingkarannya kosong.',
  },
];

const BAR_STEPS = ['1 Baca', '2 Gambar', '3 Tanya', '4 Hitung'];
const SEG_COLOR: Record<Seg['color'], string> = {
  mint: 'bg-mint text-white',
  coral: 'bg-coral text-white',
  sun: 'bg-sun text-sun-foreground',
};

const BarTab: React.FC = () => {
  const [pi, setPi] = useState(0);
  const [s, setS] = useState(1);
  const prob = BAR_PROBLEMS[pi];

  return (
    <Panel>
      <div className="flex flex-wrap gap-2">
        {BAR_PROBLEMS.map((pr, i) => (
          <Chip
            key={pr.name}
            active={i === pi}
            onClick={() => {
              setPi(i);
              setS(1);
            }}
          >
            {pr.name}
          </Chip>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-muted px-4 py-3.5 text-base leading-relaxed sm:text-lg">{prob.story}</div>

      <div className="my-3.5 grid grid-cols-4 gap-2">
        {BAR_STEPS.map((label, i) => (
          <Chip key={label} active={s === i + 1} onClick={() => setS(i + 1)} className="px-1 text-xs sm:text-sm">
            {label}
          </Chip>
        ))}
      </div>

      <div className="my-4 grid gap-3">
        {prob.rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2.5">
            <div className="w-14 flex-none text-xs font-bold text-muted-foreground sm:w-16 sm:text-sm">{row.label}</div>
            <div className="flex h-11 w-full min-w-0">
              {row.segs.map((g, gi) => {
                const ask = g.kind === 'ask';
                const show = ask ? s >= 3 : s >= 2;
                const done = ask && s >= 4;
                const style = ask
                  ? done
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-foreground bg-transparent text-foreground'
                  : SEG_COLOR[g.color];
                return (
                  <div
                    key={gi}
                    className={`grid h-11 place-items-center overflow-hidden whitespace-nowrap font-display text-base font-black transition-[width] duration-700 ease-out ${ask ? 'border-[3px] border-dashed' : ''} ${style}`}
                    style={{ width: show ? `${(g.n / 12) * 100}%` : 0 }}
                  >
                    {done ? g.text.replace('?', String(g.n)) : g.text}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Cap>{prob.caps[s - 1]}</Cap>
      <div className="mt-3 flex flex-wrap gap-2.5">
        <ActionButton onClick={() => setS((v) => Math.min(4, v + 1))} disabled={s >= 4}>Langkah berikutnya</ActionButton>
        <ActionButton alt onClick={() => setS(1)}>Ulang</ActionButton>
      </div>
      <Say>{prob.say}</Say>
    </Panel>
  );
};

/* ---------- 5. Puzzles ---------- */

type PuzzleDot = 'g' | 'r' | 'y';
const PD_CLASS: Record<PuzzleDot, string> = { g: 'bg-mint', r: 'bg-coral', y: 'bg-sun' };

interface Puzzle {
  q: string;
  viz: React.ReactNode;
  opts: { v: string; node: React.ReactNode; label: string }[];
  ans: string;
  hint: string;
  why: string;
  after?: React.ReactNode;
}

const PuzzleDotEl: React.FC<{ c: PuzzleDot }> = ({ c }) => <span className={`inline-block size-8 rounded-full ${PD_CLASS[c]}`} />;
const NumRow: React.FC<{ nums: (number | string)[] }> = ({ nums }) => (
  <div className="flex flex-wrap gap-2.5 font-display text-3xl font-black">
    {nums.map((v, i) => (
      <span key={i} className="rounded-xl bg-muted px-3.5 py-0.5">{v}</span>
    ))}
  </div>
);
const Mystery = () => (
  <span className="grid size-8 place-items-center rounded-full border-[3px] border-dashed border-foreground font-display font-black">?</span>
);

const PUZZLES: Puzzle[] = [
  {
    q: 'Lanjutkan polanya. Apa yang ada di tanda tanya?',
    viz: (
      <div className="flex flex-wrap items-center gap-2">
        {(['g', 'g', 'r', 'g', 'g', 'r', 'g', 'g'] as PuzzleDot[]).map((c, i) => <PuzzleDotEl key={i} c={c} />)}
        <Mystery />
      </div>
    ),
    opts: [
      { v: 'r', node: <PuzzleDotEl c="r" />, label: 'merah' },
      { v: 'g', node: <PuzzleDotEl c="g" />, label: 'hijau' },
      { v: 'y', node: <PuzzleDotEl c="y" />, label: 'kuning' },
    ],
    ans: 'r',
    hint: 'Coba baca polanya dengan suara: hijau, hijau, merah... Bagian mana yang berulang?',
    why: 'Polanya hijau-hijau-merah lalu mengulang. Setelah dua hijau, giliran merah.',
  },
  {
    q: 'Angka berikutnya apa?',
    viz: <NumRow nums={[2, 4, 6, 8, '?']} />,
    opts: ['9', '10', '12'].map((v) => ({ v, node: v, label: v })),
    ans: '10',
    hint: 'Dari 2 ke 4 naik berapa? Dari 4 ke 6 naik berapa? Apakah selalu sama?',
    why: 'Setiap angka naik 2. Setelah 8 datang 10. Ini sama dengan menghitung loncat 2.',
  },
  {
    q: 'Raka berdiri di urutan ke-3 dari depan dan ke-2 dari belakang. Ada berapa anak di antrean?',
    viz: <p className="text-sm text-muted-foreground">Gambar antreannya dulu sebelum menjumlahkan.</p>,
    opts: ['4', '5', '6'].map((v) => ({ v, node: v, label: v })),
    ans: '4',
    hint: 'Kalau 3 + 2, Raka terhitung berapa kali? Coba gambar antrean dan tunjuk Raka.',
    why: '3 + 2 = 5 menghitung Raka dua kali. Gambar antreannya: 2 anak di depan, Raka, 1 anak di belakang, jadi 4.',
    after: (
      <div className="mt-2 flex items-end gap-2">
        {[
          ['1', 'depan', 'bg-mint'],
          ['2', 'depan', 'bg-mint'],
          ['3', 'Raka', 'bg-coral'],
          ['4', 'belakang', 'bg-mint'],
        ].map(([n, l, c]) => (
          <div key={n} className="grid justify-items-center gap-1 text-xs font-bold">
            <span className={`grid size-8 place-items-center rounded-full font-display text-sm font-black text-white ${c}`}>{n}</span>
            {l}
          </div>
        ))}
      </div>
    ),
  },
  {
    q: 'Satu angka berbeda dari yang lain. Yang mana?',
    viz: <NumRow nums={[2, 4, 7, 8]} />,
    opts: ['2', '4', '7', '8'].map((v) => ({ v, node: v, label: v })),
    ans: '7',
    hint: 'Coba pasangkan benda sebanyak angka itu, dua-dua. Angka mana yang tersisa satu?',
    why: '2, 4, dan 8 bisa dipasangkan tanpa sisa (genap). 7 menyisakan satu (ganjil).',
  },
];

const PuzzleTab: React.FC<{ onBack: () => void; onFinishGame: (stars: number, score: number) => void }> = ({
  onBack,
  onFinishGame,
}) => {
  const [i, setI] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState<string[]>([]);
  const [tries, setTries] = useState(0);
  const [score, setScore] = useState(0);
  const finished = i >= PUZZLES.length;

  const pick = (v: string) => {
    const p = PUZZLES[i];
    if (solved || wrong.includes(v)) return;
    setTries((t) => t + 1);
    if (v === p.ans) {
      sound.playSuccess();
      setSolved(true);
      setScore((s) => s + (wrong.length === 0 ? 20 : 10));
    } else {
      sound.playGentleBoing();
      setWrong((w) => [...w, v]);
    }
  };

  const next = () => {
    if (i + 1 >= PUZZLES.length) {
      sound.playFanfare();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onFinishGame(15, score);
    }
    setI((v) => v + 1);
    setSolved(false);
    setWrong([]);
  };

  const restart = () => {
    setI(0);
    setSolved(false);
    setWrong([]);
    setScore(0);
    setTries(0);
  };

  if (finished) {
    return (
      <Panel>
        <div className="py-6 text-center">
          <div className="mx-auto mb-4 grid size-20 place-items-center rounded-full bg-sun/30 text-sun-foreground">
            <Trophy className="size-10" />
          </div>
          <h2 className="font-display text-2xl font-black sm:text-3xl">Selesai! Hebat sekali.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
            Yang penting bukan cepat, tapi bisa menjelaskan caranya. Pilih satu soal tadi dan tanya: "Bagaimana kamu tahu?"
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={restart}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
            >
              <RefreshCw className="size-4" /> Main lagi
            </button>
            <button
              type="button"
              onClick={onBack}
              className="min-h-11 cursor-pointer rounded-xl bg-muted px-5 py-2 text-sm font-bold text-foreground"
            >
              Kembali ke katalog
            </button>
          </div>
        </div>
      </Panel>
    );
  }

  const p = PUZZLES[i];
  return (
    <Panel>
      <div className="grid gap-4">
        <p className="text-sm font-bold text-muted-foreground">
          Soal {i + 1} dari {PUZZLES.length} · tidak ada stopwatch, tidak ada hukuman
        </p>
        <h2 className="font-display text-xl font-black sm:text-2xl">{p.q}</h2>
        <div className="flex min-h-11 items-center">{p.viz}</div>
        <div className="flex flex-wrap gap-2.5">
          {p.opts.map((o) => {
            const isWrong = wrong.includes(o.v);
            const isOk = solved && o.v === p.ans;
            return (
              <button
                key={o.v}
                type="button"
                aria-label={o.label}
                onClick={() => pick(o.v)}
                className={`inline-flex min-h-14 min-w-16 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 px-5 py-1.5 font-display text-2xl font-black transition-colors ${
                  isOk
                    ? 'border-mint bg-mint-soft'
                    : isWrong
                      ? 'border-coral bg-coral-soft opacity-70'
                      : 'border-border bg-card hover:border-primary'
                }`}
              >
                {o.node}
              </button>
            );
          })}
        </div>
        <div aria-live="polite">
          {solved && (
            <div className="rounded-2xl bg-mint-soft px-4 py-3 text-sm">
              <b>Betul.</b> {p.why}
              {p.after}
            </div>
          )}
          {!solved && wrong.length > 0 && (
            <div className="rounded-2xl bg-sun/15 px-4 py-3 text-sm">
              <b>Belum pas, coba lagi.</b> Petunjuk: {p.hint}
            </div>
          )}
        </div>
        {solved && (
          <div>
            <ActionButton onClick={next}>{i + 1 >= PUZZLES.length ? 'Selesai' : 'Lanjut'}</ActionButton>
          </div>
        )}
        <p className="text-xs text-muted-foreground">Percobaan sejauh ini: {tries}</p>
      </div>
    </Panel>
  );
};

/* ---------- 6. Parent guide ---------- */

const ParentTab: React.FC = () => (
  <div className="grid gap-4">
    <Panel>
      <h2 className="font-display text-xl font-black">Lima pertanyaan yang cukup</h2>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {['Kamu lihat apa?', 'Bisa tunjukkan pakai benda?', 'Bagaimana kamu tahu?', 'Ada cara lain?', 'Apa yang ditanyakan ceritanya?'].map((q) => (
          <span key={q} className="rounded-2xl bg-violet-soft px-3.5 py-2 text-sm font-bold">{q}</span>
        ))}
      </div>
    </Panel>

    <div className="grid gap-4 sm:grid-cols-2">
      <Panel>
        <h3 className="font-display text-lg font-black text-mint">Lakukan</h3>
        <ul className="mt-2 grid list-disc gap-1.5 pl-5 text-sm">
          <li>Mulai dari benda di rumah: sendok, tutup botol, kancing.</li>
          <li>Minta anak menjelaskan caranya, bukan hanya jawabannya.</li>
          <li>Kembali ke benda kalau gambar atau angka membingungkan.</li>
          <li>Rayakan cara yang berbeda dan jawaban salah yang masuk akal.</li>
        </ul>
      </Panel>
      <Panel>
        <h3 className="font-display text-lg font-black text-coral">Hindari</h3>
        <ul className="mt-2 grid list-disc gap-1.5 pl-5 text-sm">
          <li>Langsung menulis angka sebelum anak memegang bendanya.</li>
          <li>Memberi tekanan waktu pada anak TK.</li>
          <li>Membandingkan dengan anak lain atau mengejar medali.</li>
          <li>Menghafal trik tanpa gambar.</li>
        </ul>
      </Panel>
    </div>

    <Panel>
      <h3 className="font-display text-lg font-black">Kalau anak macet</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-mint-soft p-3.5 text-sm"><b>Langkah 1.</b> Turun satu tahap: dari angka ke gambar, atau dari gambar ke benda.</div>
        <div className="rounded-2xl bg-sun/15 p-3.5 text-sm"><b>Langkah 2.</b> Kecilkan angkanya. Kalau 8 + 5 sulit, coba 8 + 2 dulu.</div>
        <div className="rounded-2xl bg-coral-soft p-3.5 text-sm"><b>Langkah 3.</b> Jeda dan ganti suasana. Lanjutkan besok dengan soal yang sama.</div>
      </div>
    </Panel>

    <Panel>
      <h3 className="font-display text-lg font-black">Soal berpikir dan lomba: pelan-pelan saja</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Untuk usia TK, lomba matematika hanya perkenalan dengan soal berpikir, bukan target. Dua pintu yang biasanya terbuka: SASMO
        (ada kategori K2) dan Kangaroo (ada kategori prasekolah). Olimpiade Sains Nasional (OSN) SD berjalan lewat sekolah.
        Jadwal dan pendaftaran berbeda tiap tahun dan tiap negara, jadi selalu cek pengumuman resmi penyelenggara.
      </p>
    </Panel>
  </div>
);

/* ---------- shell ---------- */

export const SingaporeMathLab: React.FC<SingaporeMathLabProps> = ({ onBack, onFinishGame }) => {
  const [tab, setTab] = useState<TabId>('cpa');

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-ink-soft hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Mora
        </button>
        <p className="font-display text-sm font-black text-foreground sm:text-base">Math Lab ala Singapore</p>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Bagian Math Lab">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex-none cursor-pointer rounded-full border px-4 py-1.5 text-sm font-bold transition-colors ${
              tab === t.id ? 'border-foreground bg-foreground text-background' : 'border-border bg-card text-foreground hover:border-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'cpa' && <CpaTab />}
      {tab === 'bond' && <BondTab />}
      {tab === 'ten' && <TenTab />}
      {tab === 'bar' && <BarTab />}
      {tab === 'puzzle' && <PuzzleTab onBack={onBack} onFinishGame={onFinishGame} />}
      {tab === 'parent' && <ParentTab />}
    </div>
  );
};
