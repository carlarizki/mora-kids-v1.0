// Level data for "Robo Jalan-Jalan" — the Little Coders pilot game.
// See claude/mora-little-coders-pilot-prd.md (Mora project) for the full
// design rationale. Kept deliberately linear (no nested loops) — level 8's
// `forward2` block is an atomic "move twice" command, not a real repeat
// block, so the engine stays a simple step-through queue for this pilot.

export type Direction = 0 | 1 | 2 | 3; // 0 = up, 1 = right, 2 = down, 3 = left

export type CommandType = 'forward' | 'left' | 'right' | 'forward2';

export interface GridPos {
  row: number;
  col: number;
}

export interface CodingLevel {
  id: string;
  title: string;
  rows: number;
  cols: number;
  start: GridPos & { dir: Direction };
  goal: GridPos;
  walls: GridPos[];
  bonusStar?: GridPos;
  maxCommands: number;
  unlockedCommands: CommandType[];
  isBonus?: boolean; // skippable "taste test" level
}

export const CODING_LEVELS: CodingLevel[] = [
  {
    id: 'coding-1',
    title: 'Langkah Pertama',
    rows: 4,
    cols: 4,
    start: { row: 3, col: 0, dir: 1 },
    goal: { row: 3, col: 1 },
    walls: [],
    maxCommands: 1,
    unlockedCommands: ['forward'],
  },
  {
    id: 'coding-2',
    title: 'Jalan Lurus',
    rows: 4,
    cols: 4,
    start: { row: 3, col: 0, dir: 1 },
    goal: { row: 3, col: 3 },
    walls: [],
    maxCommands: 3,
    unlockedCommands: ['forward'],
  },
  {
    id: 'coding-3',
    title: 'Belok Yuk',
    rows: 4,
    cols: 4,
    start: { row: 3, col: 0, dir: 1 },
    goal: { row: 1, col: 0 },
    walls: [],
    maxCommands: 3,
    unlockedCommands: ['forward', 'left', 'right'],
  },
  {
    id: 'coding-4',
    title: 'Hati-Hati Batu!',
    rows: 4,
    cols: 4,
    start: { row: 3, col: 0, dir: 1 },
    goal: { row: 3, col: 3 },
    walls: [{ row: 3, col: 2 }],
    maxCommands: 8,
    unlockedCommands: ['forward', 'left', 'right'],
  },
  {
    id: 'coding-5',
    title: 'Petualangan Lebih Jauh',
    rows: 5,
    cols: 5,
    start: { row: 4, col: 0, dir: 1 },
    goal: { row: 4, col: 4 },
    walls: [],
    maxCommands: 4,
    unlockedCommands: ['forward', 'left', 'right'],
  },
  {
    id: 'coding-6',
    title: 'Bintang Bonus',
    rows: 5,
    cols: 5,
    start: { row: 4, col: 0, dir: 1 },
    goal: { row: 4, col: 4 },
    walls: [],
    bonusStar: { row: 3, col: 2 },
    maxCommands: 8,
    unlockedCommands: ['forward', 'left', 'right'],
  },
  {
    id: 'coding-7',
    title: 'Dua Jalan Menuju Sukses',
    rows: 5,
    cols: 5,
    start: { row: 4, col: 0, dir: 1 },
    goal: { row: 0, col: 4 },
    walls: [{ row: 2, col: 2 }],
    maxCommands: 10,
    unlockedCommands: ['forward', 'left', 'right'],
  },
  {
    id: 'coding-8',
    title: 'Lompatan Ajaib (Bonus)',
    rows: 4,
    cols: 4,
    start: { row: 3, col: 0, dir: 1 },
    goal: { row: 3, col: 2 },
    walls: [],
    maxCommands: 3,
    unlockedCommands: ['forward', 'left', 'right', 'forward2'],
    isBonus: true,
  },
];
