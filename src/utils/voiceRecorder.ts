/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Manual "static line" voice recording — Level A of the Voice Studio roadmap.
// Parents record themselves saying 3 fixed sentences; recordings are stored
// on-device (localStorage, base64) and can be played back instead of TTS
// at specific moments inside a game. This is NOT voice cloning: it only
// plays back the exact recorded audio, it cannot generate new sentences
// (e.g. inserting a child's name) in the parent's voice.

export interface VoiceLineDef {
  id: string;
  label: string;
  script: string;
}

export const VOICE_LINES: VoiceLineDef[] = [
  { id: 'start', label: 'Ajakan Mulai', script: 'Ayo, kita mulai petualangan hari ini!' },
  { id: 'cheer', label: 'Semangat Menang', script: 'Kerja bagus! Kamu hebat sekali!' },
  { id: 'retry', label: 'Semangat Coba Lagi', script: 'Yuk, coba lagi, pasti bisa!' },
];

const STORAGE_KEY = 'morakids_voice_lines_v1';

type StoredVoiceLines = Record<string, { dataUrl: string; recordedAt: string }>;

function readStore(): StoredVoiceLines {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(store: StoredVoiceLines) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // storage full/unavailable — recording stays in-memory for this session only
  }
}

export function getVoiceLine(lineId: string) {
  return readStore()[lineId];
}

export function saveVoiceLine(lineId: string, dataUrl: string) {
  const store = readStore();
  store[lineId] = { dataUrl, recordedAt: new Date().toISOString() };
  writeStore(store);
}

export function deleteVoiceLine(lineId: string) {
  const store = readStore();
  delete store[lineId];
  writeStore(store);
}

/** Plays a recorded line if one exists. Returns true if playback started (caller should skip TTS fallback). */
export function playVoiceLine(lineId: string): boolean {
  const entry = getVoiceLine(lineId);
  if (!entry) return false;
  try {
    const audio = new Audio(entry.dataUrl);
    audio.play().catch(() => {});
    return true;
  } catch {
    return false;
  }
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
