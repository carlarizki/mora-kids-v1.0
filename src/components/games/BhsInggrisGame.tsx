/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BhsInggrisGameProps {
  onBack: () => void;
  childName: string;
}

// Bhs Inggris (43 mini-games: vocabulary, listening & speaking, grammar,
// sentence practice) is a standalone static game (public/games/bhs-inggris/),
// kept as-is — only the "isi nama" welcome step is skipped, since Mora
// already knows the child's name from the family profile (?name= below).
// Runs local-only (no Vercel backend deployed): global leaderboard/rooms and
// the Gemini speaking/TTS features fall back to on-device Web Speech API,
// exactly as the game itself is designed to do when no server is present.
export const BhsInggrisGame: React.FC<BhsInggrisGameProps> = ({ onBack, childName }) => {
  const src = `./games/bhs-inggris/index.html?name=${encodeURIComponent(childName)}`;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="flex items-center gap-3 border-b border-border/60 bg-card px-4 py-2.5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-ink-soft transition-colors hover:bg-muted hover:text-primary cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Mora
        </button>
      </div>
      <iframe
        title="Bhs Inggris"
        src={src}
        className="flex-1 w-full border-0"
        allow="microphone; autoplay"
      />
    </div>
  );
};
