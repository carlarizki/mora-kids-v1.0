export type RealmId = 'math' | 'science' | 'literacy' | 'creative' | 'logic' | 'quran' | 'coding';

export type AgeGroupId = 'all' | 'ages-4-6' | 'ages-7-9' | 'ages-10-12';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type Language = 'id' | 'en';

export interface RealmInfo {
  id: RealmId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    lightBg: string;
  };
  cardImage: string;
}

export interface GameCatalogItem {
  id: string;
  title: string;
  realm: RealmId;
  ageGroup: AgeGroupId;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  starsReward: number;
  tagline: string;
  description: string;
  skills: string[];
  bannerImage: string;
  accentColor: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface UserProgress {
  totalStars: number;
  gamesPlayed: number;
  dailyStreak: number;
  completedQuests: string[];
  gameHighScores: Record<string, number>;
  lastPlayedId?: string;
  minutesSpent: number;
}

// Reward Shop — Phase 1 (see mora-reward-shop-prd.md).
// Track A: cosmetic items, permanently unlocked once bought (no re-purchase).
export interface CosmeticRewardItem {
  id: string;
  name: string;
  icon: string;
  costStars: number;
  category: 'robot-skin' | 'sticker' | 'avatar-frame' | 'theme';
}

// Track B: parent-defined real-world rewards. Repeatable — redeeming doesn't
// "own" it, it just logs a redemption Little Moment and deducts stars. The
// actual reward happens off-app; Mora is only the ledger.
export interface FamilyReward {
  id: string;
  title: string;
  icon: string;
  costStars: number;
  isDefault?: boolean;
  createdAt: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  favoriteSubject: string;
  stars: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: 'Mama' | 'Papa' | 'Nenek' | 'Kakek' | 'Guardian';
  avatar: string;
  permissions: string[];
}

export interface LittleMoment {
  id: string;
  childName: string;
  icon: string;
  title: string;
  subtitle: string;
  timestamp: string;
  starsEarned?: number;
  category: string;
  // Optional proof photo (resized data URL) — e.g. from a completed Mission Card.
  photoUrl?: string;
  // ISO date string used to group/sort the Portfolio timeline. `timestamp`
  // above stays a display string (e.g. "Baru saja") — this is the real date.
  createdAt: string;
}

export interface SchedulePlan {
  id: string;
  childId: string;
  day: string;
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  realm: RealmId;
  gameId: string;
  title: string;
  createdBy: string;
  completed?: boolean;
}

export interface VoiceProfile {
  id: string;
  name: string;
  owner: string;
  status: 'ready' | 'custom' | 'mora';
  enabled: boolean;
  samplePhrase: string;
}

export interface LiveActivity {
  isPlaying: boolean;
  childName: string;
  gameTitle: string;
  realm: RealmId;
  elapsedMinutes: number;
}
