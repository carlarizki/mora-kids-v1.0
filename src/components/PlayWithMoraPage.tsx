/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { GameCatalogItem, RealmId, Language } from '../types/game';
import { MissionCardItem } from '../data/missionCards';
import { CatalogSection } from './CatalogSection';
import { WorksheetSection } from './WorksheetSection';
import { MissionCardsSection } from './MissionCardsSection';
import { MoraSectionHeader } from './ui/MoraPrimitives';
import { sound } from '../utils/audio';

interface PlayWithMoraPageProps {
  games: GameCatalogItem[];
  selectedRealm: RealmId | 'all';
  onSelectRealm: (realm: RealmId | 'all') => void;
  onPlayGame: (gameId: string) => void;
  highScores: Record<string, number>;
  language: Language;
  childId: string;
  onCompleteMission: (mission: MissionCardItem, photoDataUrl: string) => void;
  onBack: () => void;
}

// Dedicated "Play with Mora" page — the single place that holds every Mora
// product (games catalog + worksheets, guided activities live inside the
// worksheet/activity cards). Reached from any "Explore" CTA instead of
// anchor-scrolling within the homepage/dashboard.
export const PlayWithMoraPage: React.FC<PlayWithMoraPageProps> = ({
  games,
  selectedRealm,
  onSelectRealm,
  onPlayGame,
  highScores,
  language,
  childId,
  onCompleteMission,
  onBack,
}) => {
  return (
    <div className="animate-in fade-in duration-200">
      {/* Page chrome: back button + title, visually separated from the
          product sections below (border-b) so it reads as navigation, not
          as another section competing at the same weight. */}
      <div className="border-b border-border pb-8">
        <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-primary cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            {language === 'id' ? 'Kembali' : 'Back'}
          </button>

          <MoraSectionHeader
            size="page"
            eyebrow={language === 'id' ? 'Semua Produk Mora' : 'All Mora products'}
            subtitle={
              language === 'id'
                ? 'Games edukasi, worksheet yang bisa dikerjakan langsung, dan mission cards untuk aktivitas offline — semuanya ada di satu halaman.'
                : 'Educational games, worksheets you can complete right here, and offline mission cards — everything in one place.'
            }
            className="mt-4"
          >
            Play with Mora
          </MoraSectionHeader>
        </div>
      </div>

      <CatalogSection
        games={games}
        selectedRealm={selectedRealm}
        onSelectRealm={onSelectRealm}
        onPlayGame={onPlayGame}
        highScores={highScores}
      />

      <WorksheetSection language={language} />

      <MissionCardsSection language={language} childId={childId} onCompleteMission={onCompleteMission} />
    </div>
  );
};
