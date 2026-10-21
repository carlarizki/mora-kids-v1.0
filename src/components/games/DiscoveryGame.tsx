import React, { useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, RotateCcw, Star, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MoraButton } from '../ui/MoraPrimitives';
import { sound } from '../../utils/audio';
import { DISCOVERY_TOPICS, DiscoveryItem, DiscoveryTopic, FlagCode } from '../../data/discoveryTopics';

interface DiscoveryGameProps {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
}

const ROUND_SIZE = 3;
const TOTAL_ROUNDS = 3;
const DRAG_THRESHOLD = 6;

// ---------- helpers ----------

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Picks TOTAL_ROUNDS x ROUND_SIZE items, cycling through a fresh shuffle so
// small topics still get full rounds, while a single round never repeats an item.
function buildRounds(items: DiscoveryItem[]): DiscoveryItem[][] {
  const rounds: DiscoveryItem[][] = [];
  let pool = shuffle(items);
  for (let r = 0; r < TOTAL_ROUNDS; r++) {
    const round: DiscoveryItem[] = [];
    while (round.length < ROUND_SIZE) {
      if (pool.length === 0) pool = shuffle(items);
      const next = pool.pop() as DiscoveryItem;
      if (!round.some((x) => x.id === next.id)) round.push(next);
      else pool.unshift(next);
    }
    rounds.push(round);
  }
  return rounds;
}

// Optional voice: speaks the name in Indonesian when the browser supports it.
function speak(text: string) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'id-ID';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  } catch {
    // speech is a nice-to-have only
  }
}

// ---------- art ----------

const FlagArt: React.FC<{ code: FlagCode; className?: string }> = ({ code, className = 'w-20 h-14' }) => {
  const body = (() => {
    switch (code) {
      case 'ID':
        return (
          <>
            <rect width="60" height="20" fill="#E70011" />
            <rect y="20" width="60" height="20" fill="#FFFFFF" />
          </>
        );
      case 'JP':
        return (
          <>
            <rect width="60" height="40" fill="#FFFFFF" />
            <circle cx="30" cy="20" r="11" fill="#BC002D" />
          </>
        );
      case 'FR':
        return (
          <>
            <rect width="20" height="40" fill="#0055A4" />
            <rect x="20" width="20" height="40" fill="#FFFFFF" />
            <rect x="40" width="20" height="40" fill="#EF4135" />
          </>
        );
      case 'IT':
        return (
          <>
            <rect width="20" height="40" fill="#009246" />
            <rect x="20" width="20" height="40" fill="#FFFFFF" />
            <rect x="40" width="20" height="40" fill="#CE2B37" />
          </>
        );
      case 'DE':
        return (
          <>
            <rect width="60" height="13.4" fill="#000000" />
            <rect y="13.3" width="60" height="13.4" fill="#DD0000" />
            <rect y="26.6" width="60" height="13.4" fill="#FFCE00" />
          </>
        );
      case 'NL':
        return (
          <>
            <rect width="60" height="13.4" fill="#AE1C28" />
            <rect y="13.3" width="60" height="13.4" fill="#FFFFFF" />
            <rect y="26.6" width="60" height="13.4" fill="#21468B" />
          </>
        );
      case 'PL':
        return (
          <>
            <rect width="60" height="20" fill="#FFFFFF" />
            <rect y="20" width="60" height="20" fill="#DC143C" />
          </>
        );
      case 'TH':
        return (
          <>
            <rect width="60" height="40" fill="#A51931" />
            <rect y="6.7" width="60" height="26.6" fill="#F4F5F8" />
            <rect y="13.3" width="60" height="13.4" fill="#2D2A4A" />
          </>
        );
    }
  })();
  return (
    <svg viewBox="0 0 60 40" className={`${className} rounded-md border border-border shadow-xs`} role="img" aria-hidden="true">
      {body}
    </svg>
  );
};

const ItemArt: React.FC<{ item: DiscoveryItem; size?: 'md' | 'lg' }> = ({ item, size = 'md' }) => {
  if (item.art.type === 'flag') {
    return <FlagArt code={item.art.code} className={size === 'lg' ? 'w-32 h-[5.33rem]' : 'w-20 h-14'} />;
  }
  return <span className={size === 'lg' ? 'text-7xl' : 'text-5xl'}>{item.art.value}</span>;
};

// ---------- component ----------

type Screen = 'menu' | 'explore' | 'match';

interface DragState {
  id: string;
  sx: number;
  sy: number;
  dx: number;
  dy: number;
  moved: boolean;
}

export const DiscoveryGame: React.FC<DiscoveryGameProps> = ({ onBack, onFinishGame }) => {
  const [screen, setScreen] = useState<Screen>('menu');
  const [topic, setTopic] = useState<DiscoveryTopic | null>(null);
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<DiscoveryItem | null>(null);

  const [rounds, setRounds] = useState<DiscoveryItem[][]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [roundDone, setRoundDone] = useState(false);
  const [topicResult, setTopicResult] = useState<{ stars: number } | null>(null);

  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [sessionStars, setSessionStars] = useState(0);
  const [collected, setCollected] = useState(false);
  const lockRef = useRef(false);

  const currentRound = rounds[roundIndex] ?? [];
  // Separate shuffles for name slots and picture cards so the order never lines up.
  const slotOrder = useMemo(() => shuffle(currentRound), [currentRound]);
  const cardOrder = useMemo(() => shuffle(currentRound), [currentRound]);

  const openTopic = (t: DiscoveryTopic) => {
    sound.playPop();
    setTopic(t);
    setDiscovered([]);
    setActiveItem(null);
    setTopicResult(null);
    setScreen('explore');
  };

  const backToMenu = () => {
    setScreen('menu');
    setTopic(null);
    setTopicResult(null);
    setActiveItem(null);
  };

  const discover = (item: DiscoveryItem) => {
    sound.playPop();
    setActiveItem(item);
    speak(item.name);
    setDiscovered((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
  };

  const startMatch = () => {
    if (!topic) return;
    sound.playPop();
    setRounds(buildRounds(topic.items));
    setRoundIndex(0);
    setPlaced([]);
    setMistakes(0);
    setSelectedId(null);
    setRoundDone(false);
    setTopicResult(null);
    lockRef.current = false;
    setScreen('match');
  };

  const finishTopic = (finalMistakes: number) => {
    if (!topic) return;
    const firstTime = !completedTopics.includes(topic.id);
    const stars = firstTime ? Math.max(5, 10 - finalMistakes) : 0;
    if (firstTime) {
      setCompletedTopics((prev) => [...prev, topic.id]);
      setSessionStars((s) => s + stars);
    }
    setTopicResult({ stars });
    sound.playFanfare();
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
  };

  const tryDrop = (cardId: string, slotId: string) => {
    if (lockRef.current || placed.includes(cardId)) return;
    if (cardId === slotId) {
      const nextPlaced = [...placed, cardId];
      setPlaced(nextPlaced);
      setSelectedId(null);
      sound.playSuccess();
      const item = currentRound.find((i) => i.id === cardId);
      if (item) speak(item.name);
      if (nextPlaced.length === currentRound.length) {
        lockRef.current = true;
        setRoundDone(true);
        setTimeout(() => {
          if (roundIndex + 1 < rounds.length) {
            setRoundIndex((r) => r + 1);
            setPlaced([]);
            setRoundDone(false);
            lockRef.current = false;
          } else {
            finishTopic(mistakes);
          }
        }, 1100);
      }
    } else {
      setMistakes((m) => m + 1);
      setWrongId(cardId);
      setSelectedId(null);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  // ----- pointer drag (mouse + touch) with tap-to-select fallback -----
  const onCardPointerDown = (e: React.PointerEvent, id: string) => {
    if (placed.includes(id) || lockRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ id, sx: e.clientX, sy: e.clientY, dx: 0, dy: 0, moved: false });
  };

  const onCardPointerMove = (e: React.PointerEvent, id: string) => {
    if (!drag || drag.id !== id) return;
    const dx = e.clientX - drag.sx;
    const dy = e.clientY - drag.sy;
    setDrag({ ...drag, dx, dy, moved: drag.moved || Math.hypot(dx, dy) > DRAG_THRESHOLD });
  };

  const onCardPointerUp = (e: React.PointerEvent, id: string) => {
    if (!drag || drag.id !== id) return;
    const wasDrag = drag.moved;
    setDrag(null);
    if (wasDrag) {
      const stack = document.elementsFromPoint(e.clientX, e.clientY);
      const slotEl = stack.find((el) => el instanceof HTMLElement && el.dataset.slotId) as HTMLElement | undefined;
      if (slotEl?.dataset.slotId) tryDrop(id, slotEl.dataset.slotId);
    } else {
      sound.playPop();
      setSelectedId((cur) => (cur === id ? null : id));
    }
  };

  const onSlotClick = (slotId: string) => {
    if (selectedId && !placed.includes(slotId)) tryDrop(selectedId, slotId);
  };

  // ---------- render ----------

  const header = (
    <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
      <button
        onClick={() => {
          sound.playPop();
          if (screen === 'menu') onBack();
          else backToMenu();
        }}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-primary cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        {screen === 'menu' ? 'Kembali' : 'Pilih Topik'}
      </button>
      <div className="text-xs font-bold text-ink-soft">
        {topic && screen !== 'menu' ? `${topic.emoji} ${topic.title}` : 'Jelajah Dunia'}
      </div>
      <div className="flex items-center gap-1.5 text-xs font-bold text-sun-foreground bg-sun/15 px-3 py-1.5 rounded-full">
        <Star className="size-4 fill-sun text-sun" />
        <span className="font-display text-sm font-black">{sessionStars}</span>
      </div>
    </div>
  );

  // MENU
  if (screen === 'menu') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        {header}
        <h3 className="text-center font-display text-2xl font-black text-foreground mb-1">Mau jelajah apa hari ini?</h3>
        <p className="text-center text-sm text-ink-soft mb-6">Kenalan dulu, lalu seret gambarnya ke nama yang cocok.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {DISCOVERY_TOPICS.map((t) => {
            const done = completedTopics.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => openTopic(t)}
                className="relative flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-6 shadow-soft hover:-translate-y-1 transition-transform cursor-pointer"
              >
                {done && (
                  <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-mint text-white">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                )}
                <span className="text-5xl">{t.emoji}</span>
                <span className="font-display text-lg font-black text-foreground">{t.title}</span>
                <span className="text-xs text-ink-soft text-center">{t.blurb}</span>
              </button>
            );
          })}
        </div>
        {sessionStars > 0 && (
          <div className="mt-8 text-center">
            <MoraButton
              variant="joyful"
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
      </div>
    );
  }

  // EXPLORE (tap to discover)
  if (screen === 'explore' && topic) {
    const allFound = discovered.length >= topic.items.length;
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        {header}
        <p className="text-center text-sm text-ink-soft mb-4">Ketuk gambar untuk berkenalan. ({discovered.length}/{topic.items.length})</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {topic.items.map((item) => {
            const seen = discovered.includes(item.id);
            const isActive = activeItem?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => discover(item)}
                aria-label={item.name}
                className={`flex h-28 items-center justify-center rounded-2xl border-2 bg-card transition-all cursor-pointer hover:-translate-y-0.5 ${
                  isActive ? 'border-rose bg-rose-soft' : seen ? 'border-mint/50' : 'border-border'
                }`}
              >
                <ItemArt item={item} />
              </button>
            );
          })}
        </div>

        <div className="min-h-32 rounded-2xl border border-border bg-rose-soft/50 p-5 text-center mb-6" aria-live="polite">
          {activeItem ? (
            <>
              <div className="flex items-center justify-center gap-2">
                <h3 className="font-display text-2xl font-black text-foreground">{activeItem.name}</h3>
                <button
                  onClick={() => speak(activeItem.name)}
                  className="flex size-8 items-center justify-center rounded-full bg-card text-rose hover:bg-muted cursor-pointer"
                  aria-label={`Dengarkan ${activeItem.name}`}
                >
                  <Volume2 className="size-4" />
                </button>
              </div>
              <p className="mt-2 text-sm text-ink-soft">{activeItem.fact}</p>
            </>
          ) : (
            <p className="text-sm text-ink-soft pt-6">Pilih salah satu gambar di atas 👆</p>
          )}
        </div>

        <div className="text-center">
          <MoraButton variant="joyful" onClick={startMatch} disabled={!allFound}>
            {allFound ? 'Main Seret & Cocokkan' : `Kenalan dulu semuanya (${discovered.length}/${topic.items.length})`}
          </MoraButton>
        </div>
      </div>
    );
  }

  // MATCH (drag picture onto its name)
  if (screen === 'match' && topic) {
    if (topicResult) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-6">
          {header}
          <div className="text-center py-8">
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="font-display text-3xl font-black text-foreground">Hebat! {topic.title} selesai</h2>
            <p className="mt-3 text-ink-soft">
              {topicResult.stars > 0
                ? `Kamu dapat ${topicResult.stars} bintang.`
                : 'Topik ini sudah pernah dapat bintang. Boleh main lagi buat latihan!'}
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              <MoraButton variant="outline" onClick={startMatch}>
                <RotateCcw className="size-4" />
                Main Lagi
              </MoraButton>
              <MoraButton variant="joyful" onClick={backToMenu}>
                Pilih Topik Lain
              </MoraButton>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto px-4 py-6 select-none">
        {header}
        <p className="text-center text-xs font-bold text-ink-soft mb-1">
          Ronde {roundIndex + 1} / {rounds.length}
        </p>
        <p className="text-center text-sm text-ink-soft mb-6">
          Seret gambar ke nama yang cocok. Atau ketuk gambar, lalu ketuk namanya.
        </p>

        {/* Name slots */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {slotOrder.map((item) => {
            const filled = placed.includes(item.id);
            const armed = selectedId !== null && !filled;
            return (
              <div
                key={item.id}
                data-slot-id={item.id}
                onClick={() => onSlotClick(item.id)}
                className={`flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl border-2 p-3 transition-colors ${
                  filled
                    ? 'border-mint bg-mint-soft'
                    : armed
                      ? 'border-dashed border-rose bg-rose-soft/60 cursor-pointer'
                      : 'border-dashed border-border bg-card'
                }`}
              >
                <div className="flex h-20 items-center justify-center">
                  {filled ? <ItemArt item={item} /> : <span className="text-3xl text-muted-foreground/50">?</span>}
                </div>
                <span className="font-display text-sm font-black text-foreground text-center">{item.name}</span>
              </div>
            );
          })}
        </div>

        {/* Draggable picture cards */}
        <div className="grid grid-cols-3 gap-3">
          {cardOrder.map((item) => {
            const isPlaced = placed.includes(item.id);
            const isDragging = drag?.id === item.id && drag.moved;
            const isSelected = selectedId === item.id;
            return (
              <div key={item.id} className="flex h-28 items-center justify-center">
                {!isPlaced && (
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Gambar ${item.name}`}
                    aria-pressed={isSelected}
                    onPointerDown={(e) => onCardPointerDown(e, item.id)}
                    onPointerMove={(e) => onCardPointerMove(e, item.id)}
                    onPointerUp={(e) => onCardPointerUp(e, item.id)}
                    onPointerCancel={() => setDrag(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedId((cur) => (cur === item.id ? null : item.id));
                      }
                    }}
                    style={{
                      touchAction: 'none',
                      transform: isDragging ? `translate(${drag.dx}px, ${drag.dy}px) scale(1.08)` : undefined,
                      zIndex: isDragging ? 50 : 1,
                    }}
                    className={`relative flex size-28 items-center justify-center rounded-2xl border-2 bg-card shadow-soft cursor-grab active:cursor-grabbing ${
                      wrongId === item.id ? 'border-coral animate-pulse' : isSelected ? 'border-rose ring-4 ring-rose/30' : 'border-border'
                    } ${isDragging ? '' : 'transition-transform'}`}
                  >
                    <ItemArt item={item} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm font-bold text-foreground min-h-6" aria-live="polite">
          {roundDone
            ? 'Bagus! Semua cocok 🎉'
            : wrongId
              ? 'Hampir! Coba lagi ya 💪'
              : ''}
        </p>
      </div>
    );
  }

  return null;
};
