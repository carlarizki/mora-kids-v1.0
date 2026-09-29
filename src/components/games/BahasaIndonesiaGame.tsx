/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BahasaIndonesiaGameProps {
  onBack: () => void;
  childName: string;
}

// Petualangan Bahasa Indonesia Ceria (20 mini-games: kosakata, lawan kata,
// susun kalimat, tanda baca, membaca & menyimak) is a standalone static
// game (public/games/bahasa-indonesia/), kept as-is — only the "Siapa
// namamu?" setup step is skipped, since Mora already knows the child's
// name from the family profile (?name= below). Runs local-only (no Vercel
// backend deployed): the "Main bareng (Live)" server quiz mode isn't
// available, exactly as the game itself is designed to degrade when no
// server is present.
export const BahasaIndonesiaGame: React.FC<BahasaIndonesiaGameProps> = ({ onBack, childName }) => {
  const src = `./games/bahasa-indonesia/index.html?name=${encodeURIComponent(childName)}`;

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
        title="Petualangan Bahasa Indonesia Ceria"
        src={src}
        className="flex-1 w-full border-0"
        allow="autoplay"
      />
    </div>
  );
};
