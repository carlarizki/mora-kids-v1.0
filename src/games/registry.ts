import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * Every prop a game host can hand to a game. Each game declares only the
 * subset it needs (e.g. iframe-embedded games only take onBack + childName),
 * which is still assignable here because extra props are simply ignored.
 */
export interface GameHostProps {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
  childId: string;
  childName: string;
}

type GameComponent = LazyExoticComponent<ComponentType<GameHostProps>>;

/**
 * Lazy-load a named export so each game ships as its own chunk and is only
 * downloaded when a child actually opens it.
 */
const load = <M extends Record<string, unknown>>(
  importer: () => Promise<M>,
  exportName: keyof M,
): GameComponent =>
  lazy(async () => {
    const mod = await importer();
    return { default: mod[exportName] as ComponentType<GameHostProps> };
  });

/** Game id (from GAMES_CATALOG) → component. Adding a game = one line here. */
export const GAME_COMPONENTS: Record<string, GameComponent> = {
  // Math
  'math-rocket': load(() => import('../components/games/MathRocketGame'), 'MathRocketGame'),
  'fraction-pizza': load(() => import('../components/games/PizzaFractionGame'), 'PizzaFractionGame'),
  'number-bond': load(() => import('../components/games/NumberBondGame'), 'NumberBondGame'),
  'math-fun-quest': load(() => import('../components/games/MathFunQuestGame'), 'MathFunQuestGame'),

  // Literacy & languages
  'phonics-safari': load(() => import('../components/games/PhonicsSafariGame'), 'PhonicsSafariGame'),
  'bhs-inggris-quest': load(() => import('../components/games/BhsInggrisGame'), 'BhsInggrisGame'),
  'bahasa-indonesia-ceria': load(() => import('../components/games/BahasaIndonesiaGame'), 'BahasaIndonesiaGame'),

  // Science & social studies
  'science-circuits': load(() => import('../components/games/ElectricCircuitGame'), 'ElectricCircuitGame'),
  'science-ecosystem': load(() => import('../components/games/ScienceEcosystemGame'), 'ScienceEcosystemGame'),
  'ipa-sains-seru': load(() => import('../components/games/IpaGame'), 'IpaGame'),
  'ips-ceria': load(() => import('../components/games/IpsGame'), 'IpsGame'),
  'discovery-explorer': load(() => import('../components/games/DiscoveryGame'), 'DiscoveryGame'),

  // Creative & logic
  'rainbow-melody': load(() => import('../components/games/RainbowMelodyGame'), 'RainbowMelodyGame'),
  'memory-matrix': load(() => import('../components/games/MemoryMatrixGame'), 'MemoryMatrixGame'),
  'pattern-detective': load(() => import('../components/games/PatternDetectiveGame'), 'PatternDetectiveGame'),
  'little-coders': load(() => import('../components/games/LittleCodersGame'), 'LittleCodersGame'),

  // Quran & Arabic
  'hijaiyah-quest': load(() => import('../components/games/HijaiyahQuestGame'), 'HijaiyahQuestGame'),
  'quran-explorer': load(() => import('../components/games/QuranExplorerGame'), 'QuranExplorerGame'),
  'arabic-adventure': load(() => import('../components/games/ArabicAdventureGame'), 'ArabicAdventureGame'),
};

/** Daily quest completed when the matching game is finished. */
export const QUEST_BY_GAME: Record<string, string> = {
  'math-rocket': 'quest-1',
  'phonics-safari': 'quest-2',
  'hijaiyah-quest': 'quest-3',
};

/** Game launched from the Daily Quests bar, per realm. */
export const QUEST_GAME_BY_REALM: Partial<Record<string, string>> = {
  math: 'math-rocket',
  literacy: 'phonics-safari',
  quran: 'hijaiyah-quest',
  science: 'science-circuits',
};
