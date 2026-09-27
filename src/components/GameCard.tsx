import React, { useState } from 'react';
import { Play, Star, Clock, Sparkles } from 'lucide-react';
import { GameCatalogItem } from '../types/game';
import { MoraButton } from './ui/MoraPrimitives';
import { sound } from '../utils/audio';

interface GameCardProps {
  game: GameCatalogItem;
  onPlay: (gameId: string) => void;
  highScore?: number;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPlay, highScore }) => {
  const [imageError, setImageError] = useState(false);

  const formatAge = (age: string) => {
    switch (age) {
      case 'ages-4-6':
        return 'Ages 4–6';
      case 'ages-7-9':
        return 'Ages 7–9';
      case 'ages-10-12':
        return 'Ages 10–12';
      default:
        return 'All Ages';
    }
  };

  const formatDifficulty = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'Gentle';
      case 'medium':
        return 'Adventurer';
      case 'hard':
        return 'Master';
      default:
        return diff;
    }
  };

  return (
    <article className="paper-card rounded-2xl overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 group">
      {/* Visual Frame */}
      <div className="relative aspect-16/10 w-full bg-muted overflow-hidden">
        {!imageError && game.bannerImage ? (
          <img
            src={game.bannerImage}
            alt={game.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-sky-soft p-6 text-center">
            <Sparkles className="size-10 text-primary mb-2" />
            <span className="font-display text-lg font-bold text-foreground">{game.title}</span>
          </div>
        )}

        {/* Best score badge */}
        {highScore && highScore > 0 ? (
          <div className="absolute top-3 right-3 bg-card/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-foreground border border-border shadow-xs flex items-center gap-1">
            <Star className="size-3.5 fill-sun text-sun" />
            <span>Best: {highScore}</span>
          </div>
        ) : null}
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-soft mb-2">
            <span>{formatAge(game.ageGroup)}</span>
            <span aria-hidden="true">·</span>
            <span>{formatDifficulty(game.difficulty)}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3 text-muted-foreground" />
              {game.durationMinutes} min
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display text-xl font-black text-foreground tracking-tight leading-snug group-hover:text-primary transition-colors">
            {game.title}
          </h3>

          {/* Tagline */}
          <p className="mt-2 text-sm text-ink-soft line-clamp-2 leading-relaxed font-normal">
            {game.tagline}
          </p>

          {/* Skills List */}
          <div className="mt-4 pt-3 border-t border-border/60 text-xs text-ink-soft flex flex-wrap gap-x-2 gap-y-1 font-medium">
            {game.skills.slice(0, 3).map((skill, idx) => (
              <span key={skill} className="flex items-center gap-1">
                {idx > 0 && <span className="text-border">/</span>}
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Action Row */}
        <div className="mt-6 pt-4 flex items-center justify-between border-t border-border/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-sun-foreground">
            <Star className="size-4 fill-sun text-sun" />
            <span className="font-display text-sm font-black">+{game.starsReward} Stars</span>
          </div>

          <MoraButton
            size="sm"
            variant="joyful"
            onClick={() => {
              sound.playPop();
              onPlay(game.id);
            }}
          >
            <Play className="size-3.5 fill-current" />
            <span>Play</span>
          </MoraButton>
        </div>
      </div>
    </article>
  );
};
