/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Per-child completion state for Mission Cards, persisted to localStorage.
// No backend yet (Mora is still in the localStorage-only phase), so this is
// device-local — it won't sync across a family's other devices.

export type MissionStatus = 'in_progress' | 'completed';

export interface MissionRecord {
  status: MissionStatus;
  photoDataUrl?: string;
  completedAt?: string;
}

type MissionProgressMap = Record<string, MissionRecord>; // key: missionId

const storageKey = (childId: string) => `mora_mission_progress:${childId}`;

export function loadMissionProgress(childId: string): MissionProgressMap {
  try {
    const raw = localStorage.getItem(storageKey(childId));
    return raw ? (JSON.parse(raw) as MissionProgressMap) : {};
  } catch {
    return {};
  }
}

export function saveMissionProgress(childId: string, map: MissionProgressMap): void {
  try {
    localStorage.setItem(storageKey(childId), JSON.stringify(map));
  } catch {
    // Quota exceeded or storage unavailable — fail silently, this is a
    // best-effort local cache, not the source of truth for stars/moments
    // (those already got recorded via onCompleteMission before this write).
  }
}
