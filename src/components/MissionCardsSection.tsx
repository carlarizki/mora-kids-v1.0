/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Star, Clock, Sparkles } from 'lucide-react';
import { MoraButton, MoraSectionHeader } from './ui/MoraPrimitives';
import { MISSION_CARDS_CATALOG, MISSION_CATEGORY_LABEL, MissionCardItem } from '../data/missionCards';
import { Language } from '../types/game';
import { sound } from '../utils/audio';

interface MissionCardsSectionProps {
  language: Language;
}

const CATEGORY_STYLE: Record<MissionCardItem['category'], string> = {
  indoor: 'bg-sky-soft text-primary',
  outdoor: 'bg-mint-soft text-mint',
  combo: 'bg-coral-soft text-coral',
};

// "Balanced Play" — offline Mission Cards, the third Mora product pillar
// alongside games and worksheets. Every card uses things already at home
// (cardboard, flour, scissors, glue, crayons, leaves...) — no purchase, no
// inventory. Meant as a screen-to-real-world bridge for parents.
export const MissionCardsSection: React.FC<MissionCardsSectionProps> = ({ language }) => {
  const [activeMission, setActiveMission] = useState<MissionCardItem | null>(null);

  return (
    <section id="mission-cards" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <MoraSectionHeader
          eyebrow={language === 'id' ? 'Dari Layar ke Dunia Nyata' : 'From Screen to Real World'}
          subtitle={
            language === 'id'
              ? 'Kegiatan offline pakai barang yang sudah ada di rumah — kardus, tepung, gunting, lem, krayon, atau sekadar jalan-jalan cari daun. Nggak perlu beli apa-apa.'
              : 'Offline activities using things you already have at home — cardboard, flour, scissors, glue, crayons, or just a walk to find leaves. Nothing to buy.'
          }
        >
          {language === 'id' ? 'Mission Cards' : 'Mission Cards'}
        </MoraSectionHeader>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MISSION_CARDS_CATALOG.map((mission) => (
            <div
              key={mission.id}
              className="paper-card rounded-2xl p-6 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="size-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                  {mission.emoji}
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${CATEGORY_STYLE[mission.category]}`}
                >
                  {MISSION_CATEGORY_LABEL[mission.category][language]}
                </span>
              </div>

              <h3 className="mt-4 font-display text-lg font-black text-foreground leading-tight">
                {mission.title}
              </h3>
              <p className="mt-1.5 text-sm text-ink-soft">
                {mission.materials.join(', ')}
              </p>

              <div className="mt-4 flex items-center gap-4 text-xs font-bold text-ink-soft">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {mission.durationMinutes} {language === 'id' ? 'menit' : 'min'}
                </span>
                <span className="inline-flex items-center gap-1 text-sun-foreground">
                  <Star className="size-3.5 fill-current" />
                  {mission.starsReward}
                </span>
              </div>

              <MoraButton
                variant="secondary"
                size="sm"
                className="w-full mt-5"
                onClick={() => {
                  sound.playPop();
                  setActiveMission(mission);
                }}
              >
                <Sparkles className="size-4" />
                <span>{language === 'id' ? 'Lihat Misi' : 'View Mission'}</span>
              </MoraButton>
            </div>
          ))}
        </div>
      </div>

      {activeMission && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in"
          onClick={() => setActiveMission(null)}
        >
          <div
            className="paper-card rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-play border border-border max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center text-2xl">
                  {activeMission.emoji}
                </div>
                <div>
                  <p className="font-hand font-bold text-primary text-xs uppercase tracking-wider">
                    {language === 'id' ? 'MISI' : 'MISSION'}
                  </p>
                  <h2 className="font-display text-xl sm:text-2xl font-black text-foreground leading-tight">
                    {activeMission.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setActiveMission(null)}
                className="size-9 rounded-full hover:bg-muted flex items-center justify-center text-ink-soft hover:text-foreground transition-colors cursor-pointer shrink-0"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-5">
              <h4 className="text-xs font-black uppercase tracking-wider text-ink-soft">
                {language === 'id' ? 'Bahan' : 'Materials'}
              </h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {activeMission.materials.map((m) => (
                  <span
                    key={m}
                    className="text-xs font-bold px-2.5 py-1 rounded-full bg-mint-soft text-mint"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <h4 className="text-xs font-black uppercase tracking-wider text-ink-soft">
                {language === 'id' ? 'Langkahnya' : 'Steps'}
              </h4>
              <ol className="mt-3 space-y-2.5">
                {activeMission.steps.map((step, idx) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-sun/20 text-xs font-black text-sun-foreground">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-foreground leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft">
                <Clock className="size-4" />
                {activeMission.durationMinutes} {language === 'id' ? 'menit' : 'min'}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-sun-foreground">
                <Star className="size-4 fill-current" />
                +{activeMission.starsReward} {language === 'id' ? 'bintang' : 'stars'}
              </span>
            </div>

            <MoraButton
              variant="joyful"
              size="sm"
              className="w-full mt-5"
              onClick={() => {
                sound.playPop();
                setActiveMission(null);
              }}
            >
              <span>{language === 'id' ? 'Siap, Ayo Mulai!' : "Ready, Let's Start!"}</span>
            </MoraButton>
          </div>
        </div>
      )}
    </section>
  );
};
