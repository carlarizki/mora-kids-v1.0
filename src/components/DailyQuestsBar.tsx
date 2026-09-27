import React from 'react';
import { Target, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { DAILY_QUESTS } from '../data/catalog';
import { MoraButton } from './ui/MoraPrimitives';
import { sound } from '../utils/audio';

interface DailyQuestsBarProps {
  completedQuestIds: string[];
  onPlayQuest: (realmId: string) => void;
}

export const DailyQuestsBar: React.FC<DailyQuestsBarProps> = ({
  completedQuestIds,
  onPlayQuest,
}) => {
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
                TODAY'S MOMENTS
              </p>
              <h3 className="font-display text-2xl font-black text-foreground">
                Daily Learning Adventures
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-foreground bg-card px-4 py-2 rounded-full border border-border shadow-xs w-fit">
            <span>Progress:</span>
            <span className="font-display text-sm font-black text-primary tabular-nums">
              {completedQuestIds.length} / {DAILY_QUESTS.length} Done
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
                      {quest.title}
                    </div>
                    <div className="text-xs text-ink-soft flex items-center gap-1 mt-0.5 font-medium">
                      <Star className="size-3 fill-sun text-sun" />
                      <span>+{quest.rewardStars} Stars</span>
                    </div>
                  </div>
                </div>

                {!isCompleted && (
                  <MoraButton
                    size="sm"
                    variant="sunshine"
                    onClick={() => {
                      sound.playPop();
                      onPlayQuest(quest.realm);
                    }}
                    className="shrink-0 ml-2"
                  >
                    <span>Play</span>
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
