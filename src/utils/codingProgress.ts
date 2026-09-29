// Per-child progress for the Little Coders pilot game, persisted to
// localStorage — same device-local, no-backend-yet pattern as
// missionProgress.ts. Tracks which levels are done and how far the child
// has gotten, so returning to the game resumes instead of restarting.

export interface CodingProgressState {
  completedLevelIds: string[];
  furthestLevelIndex: number; // highest index reached (0-based)
}

const storageKey = (childId: string) => `mora_coding_progress:${childId}`;

const EMPTY_STATE: CodingProgressState = {
  completedLevelIds: [],
  furthestLevelIndex: 0,
};

export function loadCodingProgress(childId: string): CodingProgressState {
  try {
    const raw = localStorage.getItem(storageKey(childId));
    if (!raw) return { ...EMPTY_STATE };
    const parsed = JSON.parse(raw) as CodingProgressState;
    return {
      completedLevelIds: Array.isArray(parsed.completedLevelIds) ? parsed.completedLevelIds : [],
      furthestLevelIndex: typeof parsed.furthestLevelIndex === 'number' ? parsed.furthestLevelIndex : 0,
    };
  } catch {
    return { ...EMPTY_STATE };
  }
}

export function saveCodingProgress(childId: string, state: CodingProgressState): void {
  try {
    localStorage.setItem(storageKey(childId), JSON.stringify(state));
  } catch {
    // Quota exceeded or storage unavailable — best-effort local cache only.
  }
}
