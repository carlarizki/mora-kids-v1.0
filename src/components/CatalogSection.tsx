import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, Filter } from 'lucide-react';
import { GameCatalogItem, RealmId, AgeGroupId } from '../types/game';
import { GameCard } from './GameCard';
import { MoraSectionHeader, MoraButton } from './ui/MoraPrimitives';
import { sound } from '../utils/audio';

interface CatalogSectionProps {
  games: GameCatalogItem[];
  selectedRealm: RealmId | 'all';
  onSelectRealm: (realm: RealmId | 'all') => void;
  onPlayGame: (gameId: string) => void;
  highScores: Record<string, number>;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  games,
  selectedRealm,
  onSelectRealm,
  onPlayGame,
  highScores,
}) => {
  const [selectedAge, setSelectedAge] = useState<AgeGroupId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      if (selectedRealm !== 'all' && game.realm !== selectedRealm) {
        return false;
      }
      if (selectedAge !== 'all' && game.ageGroup !== selectedAge) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(query);
        const matchesTagline = game.tagline.toLowerCase().includes(query);
        const matchesSkills = game.skills.some((s) => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesTagline && !matchesSkills) {
          return false;
        }
      }
      return true;
    });
  }, [games, selectedRealm, selectedAge, searchQuery]);

  const handleResetFilters = () => {
    sound.playPop();
    onSelectRealm('all');
    setSelectedAge('all');
    setSearchQuery('');
  };

  return (
    <section id="games" className="py-20 max-w-7xl mx-auto px-5 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-border/60">
        <MoraSectionHeader
          eyebrow="Educational Games"
          subtitle="Little games for curious minds that turn play into thoughtful learning."
        >
          Curated Mini-Games &amp; Adventures
        </MoraSectionHeader>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="size-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities &amp; skills..."
            className="w-full pl-11 pr-10 h-12 rounded-full bg-card border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        {/* Realm Segmented Controls */}
        <div className="flex items-center gap-1.5 p-1.5 bg-muted rounded-full overflow-x-auto max-w-full">
          {(
            [
              { id: 'all', label: 'All Activities' },
              { id: 'quran', label: "🌙 Qur'an & Arabic" },
              { id: 'math', label: 'Math Kingdom' },
              { id: 'science', label: 'Science Lab' },
              { id: 'literacy', label: 'Storyverse' },
              { id: 'creative', label: 'Music & Art' },
              { id: 'logic', label: 'Brain Quest' },
              { id: 'coding', label: '💻 Little Coders' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playPop();
                onSelectRealm(tab.id);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedRealm === tab.id
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-ink-soft hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Age Filter Tabs */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
          <span className="text-muted-foreground mr-1 hidden sm:inline">Age:</span>
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'ages-4-6', label: '4–6 yrs' },
              { id: 'ages-7-9', label: '7–9 yrs' },
              { id: 'ages-10-12', label: '10–12 yrs' },
            ] as const
          ).map((ageTab) => (
            <button
              key={ageTab.id}
              onClick={() => {
                sound.playPop();
                setSelectedAge(ageTab.id);
              }}
              className={`px-3.5 py-1.5 rounded-full cursor-pointer transition-colors ${
                selectedAge === ageTab.id
                  ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                  : 'bg-card text-foreground hover:bg-muted border border-border'
              }`}
            >
              {ageTab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Games Catalog Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={onPlayGame}
              highScore={highScores[game.id]}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 paper-card rounded-3xl p-8 max-w-md mx-auto">
          <div className="size-14 rounded-2xl bg-secondary flex items-center justify-center text-primary mx-auto mb-4">
            <Sparkles className="size-7" />
          </div>
          <h3 className="font-display text-2xl font-black text-foreground">
            Nothing here yet.
          </h3>
          <p className="text-sm text-ink-soft mt-1 mb-6">
            Let's make our first little moment together with a different filter.
          </p>
          <MoraButton variant="joyful" onClick={handleResetFilters}>
            Reset all filters
          </MoraButton>
        </div>
      )}
    </section>
  );
};
