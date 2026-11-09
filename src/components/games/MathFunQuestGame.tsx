/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface MathFunQuestGameProps {
  onBack: () => void;
  childName: string;
}

// Math Fun Quest is a standalone static game (public/games/math-fun-quest/),
// kept as-is — only the "isi nama" welcome step is skipped, since Mora
// already knows the child's name from the family profile (?name= below).
// It runs in its own iframe with its own screens (level → focus → game,
// leaderboard, badges); this wrapper just gives it a way back into Mora.
export const MathFunQuestGame: React.FC<MathFunQuestGameProps> = ({ onBack, childName }) => {
  const src = `./games/math-fun-quest/index.html?name=${encodeURIComponent(childName)}`;

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
        title="Math Fun Quest"
        src={src}
        className="flex-1 w-full border-0"
        allow="autoplay"
      />
    </div>
  );
};
