import React from 'react';
import { Target, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { DAILY_QUESTS } from '../data/catalog';
import { MoraButton } from './ui/MoraPrimitives';
import { sound } from '../utils/audio';
import { Language } from '../types/game';

const QUEST_TITLES_ID: Record<string, string> = {
  'quest-1': 'Luncurkan 1 Roket Matematika',
  'quest-2': 'Eja 3 kata safari dengan petunjuk suara',
  'quest-3': 'Kenali 3 huruf hijaiyah dengan harakat',
};

interface DailyQuestsBarProps {
  completedQuestIds: string[];
  onPlayQuest: (realmId: string) => void;
  language?: Language;
}

export const DailyQuestsBar: React.FC<DailyQuestsBarProps> = ({
  completedQuestIds,
  onPlayQuest,
  language = 'id',
}) => {
  const isId = language === 'id';
  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 my-10">
      <div className="paper-card rounded-2xl p-6 sm:p-7 relative overflow-hidden bg-gradient-to-r from-sun/15 via-sun/5 to-card border border-sun/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-sun text-sun-foreground flex items-center justify-center shadow-xs">
              <Target className="size-6" />
            </div>
            <div>
              <p className="font-hand font-bold text-primary text-sm uppercase tracking-wider">
                {isId ? 'MISI HARI INI' : "TODAY'S MOMENTS"}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                {isId ? 'Petualangan Belajar Hari Ini' : 'Daily Learning Adventures'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-bold text-foreground bg-card px-4 py-2 rounded-full border border-border shadow-xs w-fit">
            <span>{isId ? 'Progres:' : 'Progress:'}</span>
            <span className="font-display text-sm font-black text-primary tabular-nums">
              {completedQuestIds.length} / {DAILY_QUESTS.length} {isId ? 'Selesai' : 'Done'}
            </span>
          </div>
        </div>

        {/* Quests Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DAILY_QUESTS.map((quest) => {
            const isCompleted = completedQuestIds.includes(quest.id);

            return (
              <div
                key={quest.id}
                className="bg-card rounded-xl p-4 border border-border flex items-center justify-between shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle className="size-5 text-mint shrink-0" strokeWidth={2.5} />
                  ) : (
                    <div className="size-5 rounded-full border-2 border-border shrink-0" />
                  )}
                  <div>
                    <div className="text-sm font-bold text-foreground font-display leading-snug">
                      {isId ? QUEST_TITLES_ID[quest.id] ?? quest.title : quest.title}
                    </div>
                    <div className="text-xs text-ink-soft flex items-center gap-1 mt-0.5 font-medium">
                      <Star className="size-3 fill-sun text-sun" />
                      <span>+{quest.rewardStars} {isId ? 'Bintang' : 'Stars'}</span>
                    </div>
                  </div>
                </div>

                {!isCompleted && (
                  <MoraButton
                    size="sm"
                    variant="joyful"
                    onClick={() => {
                      sound.playPop();
                      onPlayQuest(quest.realm);
                    }}
                    className="shrink-0 ml-2"
                  >
                    <span>{isId ? 'Main' : 'Play'}</span>
                    <ArrowRight className="size-3" />
                  </MoraButton>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
