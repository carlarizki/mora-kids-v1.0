/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface IpsGameProps {
  onBack: () => void;
  childName: string;
}

// Petualangan IPS Ceria (kuis topik, dunia & negara, tebak bendera, sortir,
// urutkan sejarah, tebak profesi) is a standalone static game
// (public/games/ips/), kept as-is — only the "Ganti nama/pemain" step is
// skipped, since Mora already knows the child's name from the family
// profile (?name= below). Runs local-only: solo mode works fully offline,
// the room/multiplayer mode still works device-local exactly as designed.
export const IpsGame: React.FC<IpsGameProps> = ({ onBack, childName }) => {
  const src = `./games/ips/index.html?name=${encodeURIComponent(childName)}`;

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
        title="Petualangan IPS Ceria"
        src={src}
        className="flex-1 w-full border-0"
        allow="autoplay"
      />
    </div>
  );
};
