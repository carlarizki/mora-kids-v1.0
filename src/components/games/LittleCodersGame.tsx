import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowUp, CornerUpLeft, CornerUpRight, ChevronsUp, Play, RotateCcw, Star, Trophy, SkipForward } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MoraButton } from '../ui/MoraPrimitives';
import { sound } from '../../utils/audio';
import { CODING_LEVELS, CodingLevel, CommandType, Direction, GridPos } from '../../data/codingLevels';
import { loadCodingProgress, saveCodingProgress } from '../../utils/codingProgress';

interface LittleCodersGameProps {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
  childId: string;
}

interface PathStep {
  row: number;
  col: number;
  dir: Direction;
}

type RunStatus = 'idle' | 'running' | 'success' | 'crashed' | 'incomplete';

const DELTAS: Array<[number, number]> = [
  [-1, 0], // up
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
];

type SimStatus = 'success' | 'crashed' | 'incomplete';

function simulate(level: CodingLevel, commands: CommandType[]) {
  let { row, col, dir } = level.start;
  const path: PathStep[] = [{ row, col, dir }];
  // Boxed in an object rather than a plain `let` — TS's control-flow
  // narrowing on a loop-mutated union-typed `let` gets overzealous here
  // (flags later comparisons as "no overlap" even though the loop body
  // reassigns it). A property access sidesteps that.
  const state: { status: SimStatus; starCollected: boolean } = { status: 'incomplete', starCollected: false };

  const tryMove = (): boolean => {
    const [dr, dc] = DELTAS[dir];
    const nr = row + dr;
    const nc = col + dc;
    if (nr < 0 || nr >= level.rows || nc < 0 || nc >= level.cols) return false;
    if (level.walls.some((w) => w.row === nr && w.col === nc)) return false;
    row = nr;
    col = nc;
    path.push({ row, col, dir });
    if (level.bonusStar && level.bonusStar.row === row && level.bonusStar.col === col) {
      state.starCollected = true;
    }
    if (level.goal.row === row && level.goal.col === col) {
      state.status = 'success';
    }
    return true;
  };

  commandLoop: for (const cmd of commands) {
    if (state.status === 'success') break;
    if (cmd === 'left') {
      dir = ((dir + 3) % 4) as Direction;
      path.push({ row, col, dir });
    } else if (cmd === 'right') {
      dir = ((dir + 1) % 4) as Direction;
      path.push({ row, col, dir });
    } else if (cmd === 'forward') {
      if (!tryMove()) {
        state.status = 'crashed';
        break commandLoop;
      }
    } else if (cmd === 'forward2') {
      for (let i = 0; i < 2; i++) {
        if (!tryMove()) {
          state.status = 'crashed';
          break commandLoop;
        }
        if (row === level.goal.row && col === level.goal.col) break;
      }
    }
  }

  // No post-loop goal re-check needed: tryMove() already flips status to
  // 'success' the instant the robot lands on the goal cell.
  return { path, status: state.status, starCollected: state.starCollected };
}

const COMMAND_META: Record<CommandType, { label: string; icon: React.ReactNode }> = {
  forward: { label: 'Maju', icon: <ArrowUp className="size-6" /> },
  left: { label: 'Kiri', icon: <CornerUpLeft className="size-6" /> },
  right: { label: 'Kanan', icon: <CornerUpRight className="size-6" /> },
  forward2: { label: 'Maju 2x', icon: <ChevronsUp className="size-6" /> },
};

const DIR_ROTATION: Record<Direction, number> = { 0: -90, 1: 0, 2: 90, 3: 180 };

const CELL_SIZE = 56; // px, matches touch-target guidance at 375px
const STARS_PER_LEVEL = 3;

export const LittleCodersGame: React.FC<LittleCodersGameProps> = ({ onBack, onFinishGame, childId }) => {
  const initialProgress = useMemo(() => loadCodingProgress(childId), [childId]);
  const [levelIndex, setLevelIndex] = useState(() =>
    Math.min(initialProgress.furthestLevelIndex, CODING_LEVELS.length - 1)
  );
  const [completedLevelIds, setCompletedLevelIds] = useState<string[]>(initialProgress.completedLevelIds);
  const [tray, setTray] = useState<CommandType[]>([]);
  const [runStatus, setRunStatus] = useState<RunStatus>('idle');
  const [robot, setRobot] = useState<PathStep>(() => {
    const lvl = CODING_LEVELS[Math.min(initialProgress.furthestLevelIndex, CODING_LEVELS.length - 1)];
    return { row: lvl.start.row, col: lvl.start.col, dir: lvl.start.dir };
  });
  const [starCollected, setStarCollected] = useState(false);
  const [sessionStars, setSessionStars] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const level = CODING_LEVELS[levelIndex];

  useEffect(() => {
    // Reset the board whenever the level changes.
    setRobot({ row: level.start.row, col: level.start.col, dir: level.start.dir });
    setTray([]);
    setRunStatus('idle');
    setStarCollected(false);
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, [levelIndex]);

  const wallSet = useMemo(() => new Set(level.walls.map((w) => `${w.row}-${w.col}`)), [level]);

  const addCommand = (cmd: CommandType) => {
    if (runStatus === 'running' || tray.length >= level.maxCommands) return;
    sound.playPop();
    setTray((prev) => [...prev, cmd]);
  };

  const removeLast = () => {
    if (runStatus === 'running') return;
    setTray((prev) => prev.slice(0, -1));
  };

  const clearTray = () => {
    if (runStatus === 'running') return;
    setTray([]);
  };

  const advanceLevel = (starsEarned: number) => {
    setSessionStars((s) => s + starsEarned);
    const alreadyDone = completedLevelIds.includes(level.id);
    const newCompleted = alreadyDone ? completedLevelIds : [...completedLevelIds, level.id];
    if (!alreadyDone) setCompletedLevelIds(newCompleted);

    const nextIndex = levelIndex + 1;
    const newFurthest = Math.max(initialProgress.furthestLevelIndex, nextIndex);
    saveCodingProgress(childId, { completedLevelIds: newCompleted, furthestLevelIndex: newFurthest });

    if (nextIndex >= CODING_LEVELS.length) {
      setGameFinished(true);
    } else {
      setTimeout(() => setLevelIndex(nextIndex), 1400);
    }
  };

  const run = () => {
    if (tray.length === 0 || runStatus === 'running') return;
    const { path, status, starCollected: gotStar } = simulate(level, tray);
    setRunStatus('running');

    let i = 0;
    const step = () => {
      setRobot(path[i]);
      if (path[i].row === level.bonusStar?.row && path[i].col === level.bonusStar?.col) {
        setStarCollected(true);
      }
      i += 1;
      if (i < path.length) {
        animTimeoutRef.current = setTimeout(step, 420);
      } else {
        animTimeoutRef.current = setTimeout(() => {
          if (status === 'success') {
            sound.playFanfare();
            confetti({ particleCount: 60, spread: 65, origin: { y: 0.5 } });
            setRunStatus('success');
            advanceLevel(STARS_PER_LEVEL + (gotStar ? 2 : 0));
          } else {
            sound.playGentleBoing();
            setRunStatus(status);
          }
        }, 350);
      }
    };
    step();
  };

  const retry = () => {
    setRobot({ row: level.start.row, col: level.start.col, dir: level.start.dir });
    setRunStatus('idle');
  };

  const skipBonusLevel = () => {
    advanceLevel(0);
  };

  if (gameFinished) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-violet-soft text-violet">
          <Trophy className="size-10" />
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground">
          Kamu Master Little Coder! 🎉
        </h2>
        <p className="mt-3 text-ink-soft">
          Semua 8 puzzle Robo Jalan-Jalan berhasil diselesaikan. Kamu dapat {sessionStars} bintang!
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <MoraButton
            variant="joyful"
            onClick={() => {
              sound.playPop();
              onFinishGame(sessionStars, sessionStars);
            }}
          >
            <Star className="size-4" />
            Selesai & Kumpulkan Bintang
          </MoraButton>
          <MoraButton variant="outline" onClick={onBack}>
            Kembali ke Katalog
          </MoraButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
        <button
          onClick={() => {
            sound.playPop();
            onBack();
          }}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-primary cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Kembali
        </button>
        <div className="text-xs font-bold text-ink-soft">
          Level {levelIndex + 1} / {CODING_LEVELS.length}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-sun-foreground bg-sun/15 px-3 py-1.5 rounded-full">
          <Star className="size-4 fill-sun text-sun" />
          <span className="font-display text-sm font-black">{sessionStars}</span>
        </div>
      </div>

      <h3 className="text-center font-display text-2xl font-black text-foreground mb-1">{level.title}</h3>
      <p className="text-center text-sm text-ink-soft mb-6">
        Susun perintah lalu tekan &ldquo;Jalan!&rdquo; untuk memandu robot ke bendera 🚩
      </p>

      {/* Grid */}
      <div className="flex justify-center mb-6">
        <div
          className="relative rounded-2xl border border-border bg-violet-soft/40 p-2"
          style={{ width: level.cols * CELL_SIZE + 16, height: level.rows * CELL_SIZE + 16 }}
        >
          <div
            className="grid gap-0"
            style={{
              gridTemplateColumns: `repeat(${level.cols}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${level.rows}, ${CELL_SIZE}px)`,
            }}
          >
            {Array.from({ length: level.rows }).map((_, r) =>
              Array.from({ length: level.cols }).map((__, c) => {
                const isWall = wallSet.has(`${r}-${c}`);
                const isGoal = level.goal.row === r && level.goal.col === c;
                const isBonus = level.bonusStar && level.bonusStar.row === r && level.bonusStar.col === c && !starCollected;
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`flex items-center justify-center border border-border/50 text-2xl ${
                      isWall ? 'bg-ink-soft/20' : 'bg-card'
                    }`}
                  >
                    {isWall ? '🧱' : isGoal ? '🚩' : isBonus ? '⭐' : ''}
                  </div>
                );
              })
            )}
          </div>
          {/* Robot */}
          <div
            className="absolute flex items-center justify-center text-3xl transition-all duration-300 ease-out pointer-events-none"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              top: 8 + robot.row * CELL_SIZE,
              left: 8 + robot.col * CELL_SIZE,
            }}
          >
            <span
              className="inline-block transition-transform duration-300"
              style={{ transform: `rotate(${DIR_ROTATION[robot.dir]}deg)` }}
            >
              🤖
            </span>
          </div>
        </div>
      </div>

      {/* Retry banner */}
      {(runStatus === 'crashed' || runStatus === 'incomplete') && (
        <div className="max-w-md mx-auto mb-6 rounded-2xl bg-coral-soft border border-coral/40 text-center p-4">
          <p className="text-sm font-bold text-foreground">
            {runStatus === 'crashed'
              ? 'Oops, ada penghalang! Coba susun jalan lain yuk.'
              : 'Hampir sampai! Tambah atau ganti perintahnya sedikit lagi.'}
          </p>
          <MoraButton size="sm" variant="outline" className="mt-3" onClick={retry}>
            <RotateCcw className="size-3.5" />
            Coba Lagi
          </MoraButton>
        </div>
      )}

      {/* Command tray */}
      <div className="max-w-md mx-auto mb-4">
        <div className="text-xs font-bold text-ink-soft uppercase tracking-wide mb-2 text-center">
          Perintah ({tray.length}/{level.maxCommands})
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap min-h-14">
          {Array.from({ length: level.maxCommands }).map((_, i) => {
            const cmd = tray[i];
            return (
              <button
                key={i}
                onClick={i === tray.length - 1 ? removeLast : undefined}
                disabled={!cmd || runStatus === 'running'}
                className={`size-12 rounded-xl border-2 flex items-center justify-center ${
                  cmd
                    ? 'bg-violet text-white border-violet cursor-pointer'
                    : 'border-dashed border-border text-muted-foreground'
                }`}
                aria-label={cmd ? `Hapus perintah ${COMMAND_META[cmd].label}` : 'Slot kosong'}
              >
                {cmd ? COMMAND_META[cmd].icon : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Command palette */}
      <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
        {level.unlockedCommands.map((cmd) => (
          <button
            key={cmd}
            onClick={() => addCommand(cmd)}
            disabled={runStatus === 'running' || tray.length >= level.maxCommands}
            className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card px-4 py-3 shadow-xs hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span className="text-violet">{COMMAND_META[cmd].icon}</span>
            <span className="text-xs font-bold text-ink-soft">{COMMAND_META[cmd].label}</span>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <MoraButton variant="outline" size="sm" onClick={clearTray} disabled={runStatus === 'running' || tray.length === 0}>
          <RotateCcw className="size-3.5" />
          Ulang
        </MoraButton>
        <MoraButton
          variant="joyful"
          onClick={run}
          disabled={tray.length === 0 || runStatus === 'running'}
        >
          <Play className="size-4 fill-current" />
          Jalan!
        </MoraButton>
        {level.isBonus && (
          <MoraButton variant="ghost" size="sm" onClick={skipBonusLevel} disabled={runStatus === 'running'}>
            <SkipForward className="size-3.5" />
            Lewati
          </MoraButton>
        )}
      </div>
    </div>
  );
};
