/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DailyQuestsBar } from './components/DailyQuestsBar';
import { RealmSpotlight } from './components/RealmSpotlight';
import { CatalogSection } from './components/CatalogSection';
import { MoraHomeSections } from './components/MoraHomeSections';
import { MoraFooterSections } from './components/MoraFooterSections';
import { MoraFamilyHome } from './components/MoraFamilyHome';
import { WorksheetSection } from './components/WorksheetSection';
import { MascotMora } from './components/MascotMora';
import { ParentModal } from './components/ParentModal';

// Existing 8 Games
import { MathRocketGame } from './components/games/MathRocketGame';
import { PizzaFractionGame } from './components/games/PizzaFractionGame';
import { PhonicsSafariGame } from './components/games/PhonicsSafariGame';
import { ElectricCircuitGame } from './components/games/ElectricCircuitGame';
import { ScienceEcosystemGame } from './components/games/ScienceEcosystemGame';
import { RainbowMelodyGame } from './components/games/RainbowMelodyGame';
import { MemoryMatrixGame } from './components/games/MemoryMatrixGame';
import { PatternDetectiveGame } from './components/games/PatternDetectiveGame';

// New Quran & Hijaiyah Games
import { HijaiyahQuestGame } from './components/games/HijaiyahQuestGame';
import { QuranExplorerGame } from './components/games/QuranExplorerGame';
import { ArabicAdventureGame } from './components/games/ArabicAdventureGame';

import {
  GAMES_CATALOG,
  INITIAL_CHILDREN,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_MOMENTS,
  INITIAL_SCHEDULE,
  INITIAL_VOICE_PROFILES,
} from './data/catalog';
import {
  RealmId,
  UserProgress,
  Language,
  ChildProfile,
  FamilyMember,
  LittleMoment,
  SchedulePlan,
  VoiceProfile,
  LiveActivity,
} from './types/game';
import { sound } from './utils/audio';

const STORAGE_KEY = 'morakids_progress_v2';

const INITIAL_PROGRESS: UserProgress = {
  totalStars: 55,
  gamesPlayed: 4,
  dailyStreak: 3,
  completedQuests: ['quest-1'],
  gameHighScores: {
    'math-rocket': 95,
    'rainbow-melody': 60,
    'hijaiyah-quest': 80,
  },
  minutesSpent: 22,
};

export default function App() {
  const [currentMode, setCurrentMode] = useState<'play' | 'family'>('play');
  const [language, setLanguage] = useState<Language>('id');
  const [currentRealm, setCurrentRealm] = useState<RealmId | 'all'>('all');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [soundMuted, setSoundMuted] = useState<boolean>(sound.isMuted());
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);

  // Family State
  const [childrenList, setChildrenList] = useState<ChildProfile[]>(INITIAL_CHILDREN);
  const [selectedChildId, setSelectedChildId] = useState<string>(INITIAL_CHILDREN[0].id);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY_MEMBERS);
  const [moments, setMoments] = useState<LittleMoment[]>(INITIAL_MOMENTS);
  const [schedule, setSchedule] = useState<SchedulePlan[]>(INITIAL_SCHEDULE);
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>(INITIAL_VOICE_PROFILES);

  // Real-time live activity
  const [liveActivity, setLiveActivity] = useState<LiveActivity>({
    isPlaying: false,
    childName: 'Zahra',
    gameTitle: 'Space Math Cannon',
    realm: 'math',
    elapsedMinutes: 3,
  });

  // User Progress
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  const handleToggleSound = () => {
    const nextMuted = !sound.toggleMute();
    setSoundMuted(nextMuted);
  };

  const handleToggleLanguage = () => {
    sound.playPop();
    setLanguage((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const handlePlayGame = (gameId: string) => {
    sound.playPop();
    setActiveGameId(gameId);

    const game = GAMES_CATALOG.find((g) => g.id === gameId);
    const selectedChild = childrenList.find((c) => c.id === selectedChildId) || childrenList[0];

    // Set realtime live activity state (< 5 sec latency)
    setLiveActivity({
      isPlaying: true,
      childName: selectedChild.name,
      gameTitle: game ? game.title : 'Aktivitas Mora',
      realm: game ? game.realm : 'math',
      elapsedMinutes: 1,
    });

    setProgress((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      minutesSpent: prev.minutesSpent + (game?.durationMinutes || 4),
      lastPlayedId: gameId,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishGame = (starsEarned: number, score: number) => {
    const game = GAMES_CATALOG.find((g) => g.id === activeGameId);
    const selectedChild = childrenList.find((c) => c.id === selectedChildId) || childrenList[0];

    // Record a new Family Moment
    if (game) {
      const newMoment: LittleMoment = {
        id: `mom-${Date.now()}`,
        childName: selectedChild.name,
        icon: game.realm === 'quran' ? '🕌' : game.realm === 'math' ? '⭐' : game.realm === 'science' ? '⚡' : '🎨',
        title: language === 'id' ? `Menyelesaikan ${game.title}` : `Completed ${game.title}`,
        subtitle: language === 'id' ? `Meraih skor ${score} dengan semangat tinggi!` : `Scored ${score} with great joy!`,
        timestamp: language === 'id' ? 'Baru saja' : 'Just now',
        starsEarned,
        category: game.title,
      };
      setMoments((prev) => [newMoment, ...prev]);
    }

    // Turn off live activity
    setLiveActivity((prev) => ({ ...prev, isPlaying: false }));

    setProgress((prev) => {
      const newTotalStars = prev.totalStars + starsEarned;
      const currentHigh = prev.gameHighScores[activeGameId || ''] || 0;
      const newHighScores = {
        ...prev.gameHighScores,
        [activeGameId || '']: Math.max(currentHigh, score),
      };

      const updatedQuests = [...prev.completedQuests];
      if (activeGameId === 'math-rocket' && !updatedQuests.includes('quest-1')) {
        updatedQuests.push('quest-1');
      }
      if (activeGameId === 'phonics-safari' && !updatedQuests.includes('quest-2')) {
        updatedQuests.push('quest-2');
      }
      if (activeGameId === 'hijaiyah-quest' && !updatedQuests.includes('quest-3')) {
        updatedQuests.push('quest-3');
      }

      return {
        ...prev,
        totalStars: newTotalStars,
        completedQuests: updatedQuests,
        gameHighScores: newHighScores,
      };
    });
  };

  const handleBackToCatalog = () => {
    sound.playPop();
    setActiveGameId(null);
    setLiveActivity((prev) => ({ ...prev, isPlaying: false }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetProgress = () => {
    setProgress(INITIAL_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'games') {
      setActiveGameId(null);
      setCurrentMode('play');
      const el = document.getElementById('games');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'top') {
      setActiveGameId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveGameId(null);
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderActiveGame = () => {
    switch (activeGameId) {
      // Existing 8 Games
      case 'math-rocket':
        return <MathRocketGame onBack={handleBackToCatalog} onFinishGame={handleFinishGame} />;
      case 'fraction-pizza':
        return <PizzaFractionGame onBack={handleBackToCatalog} onFinishGame={handleFinishGame} />;
      case 'phonics-safari':
        return <PhonicsSafariGame onBack={handleBackToCatalog} onFinishGame={handleFinishGame} />;
      case 'science-circuits':
        return <ElectricCircuitGame onBack={handleBackToCatalog} onFinishGame={handleFinishGame} />;
      case 'science-ecosystem':
        return <ScienceEcosystemGame onBack={handleBackToCatalog} onFinishGame={handleFinishGame} />;
      case 'rainbow-melody':
        return <RainbowMelodyGame onBack={handleBackToCatalog} onFinishGame={handleFinishGame} />;
      case 'memory-matrix':
        return <MemoryMatrixGame onBack={handleBackToCatalog} onFinishGame={handleFinishGame} />;
      case 'pattern-detective':
        return <PatternDetectiveGame onBack={handleBackToCatalog} onFinishGame={handleFinishGame} />;

      // New Quran & Hijaiyah Games
      case 'hijaiyah-quest':
        return <HijaiyahQuestGame onBack={handleBackToCatalog} onFinishGame={handleFinishGame} />;
      case 'quran-explorer':
        return <QuranExplorerGame onBack={handleBackToCatalog} onFinishGame={handleFinishGame} />;
      case 'arabic-adventure':
        return <ArabicAdventureGame onBack={handleBackToCatalog} onFinishGame={handleFinishGame} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-sun/30 selection:text-foreground">
      {/* Universal Top Bar */}
      <Navbar
        currentRealm={currentRealm}
        onSelectRealm={(r) => {
          setCurrentRealm(r);
          setActiveGameId(null);
          setCurrentMode('play');
        }}
        totalStars={progress.totalStars}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
        onOpenParentCorner={() => setIsParentModalOpen(true)}
        onNavigateSection={handleNavigateSection}
        onLaunchArabicGame={() => handlePlayGame('arabic-adventure')}
        currentMode={currentMode}
        onToggleMode={(mode) => {
          sound.playPop();
          setActiveGameId(null);
          setCurrentMode(mode);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      <main className="flex-1">
        {activeGameId ? (
          /* Active Game View (All 10 Games fully playable) */
          <div className="animate-in fade-in duration-200">
            {renderActiveGame()}
          </div>
        ) : currentMode === 'family' ? (
          /* Mora Family Experience (Parents, Schedule, Moments, Voice Studio) */
          <MoraFamilyHome
            childrenList={childrenList}
            selectedChildId={selectedChildId}
            onSelectChild={setSelectedChildId}
            members={familyMembers}
            moments={moments}
            schedule={schedule}
            voiceProfiles={voiceProfiles}
            liveActivity={liveActivity}
            language={language}
            onLaunchGame={handlePlayGame}
            onSwitchToKidsPlay={() => {
              sound.playPop();
              setCurrentMode('play');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          /* Mora Play Experience (Homepage matching https://morakids.lovable.app/ + Curated Games) */
          <div className="animate-in fade-in duration-200">
            {/* Hero Section */}
            <HeroBanner
              onQuickStart={() => handlePlayGame('hijaiyah-quest')}
              onExploreHowItWorks={() => handleNavigateSection('how-it-works')}
            />

            {/* Daily Quests Bar */}
            <DailyQuestsBar
              completedQuestIds={progress.completedQuests}
              onPlayQuest={(realmId) => {
                if (realmId === 'math') handlePlayGame('math-rocket');
                else if (realmId === 'literacy') handlePlayGame('phonics-safari');
                else if (realmId === 'quran') handlePlayGame('hijaiyah-quest');
                else if (realmId === 'science') handlePlayGame('science-circuits');
                else setCurrentRealm(realmId as RealmId);
              }}
            />

            {/* How It Works + Features + For Families Sections (From morakids.lovable.app) */}
            <MoraHomeSections
              onExploreFeatures={() => handleNavigateSection('features')}
              onExploreGames={() => handleNavigateSection('games')}
              onStartActivity={() => handlePlayGame('fraction-pizza')}
            />

            {/* Learning Realms Spotlight */}
            <RealmSpotlight
              selectedRealm={currentRealm}
              onSelectRealm={(r) => {
                setCurrentRealm(r);
                const el = document.getElementById('games');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Games & Activities Catalog */}
            <CatalogSection
              games={GAMES_CATALOG}
              selectedRealm={currentRealm}
              onSelectRealm={setCurrentRealm}
              onPlayGame={handlePlayGame}
              highScores={progress.gameHighScores}
            />

            {/* Worksheet & Activity Modules (download PDF or draw in-app) */}
            <WorksheetSection language={language} />

            {/* Pricing, Stories, Newsletter & Clean Footer (From morakids.lovable.app) */}
            <MoraFooterSections
              onSelectPlan={(plan) => {
                sound.speak(language === 'id' ? `Paket ${plan} dipilih!` : `Plan ${plan} selected!`);
                setIsParentModalOpen(true);
              }}
              onOpenParentCorner={() => setIsParentModalOpen(true)}
              onSelectRealm={(r) => {
                setCurrentRealm(r as any);
                handleNavigateSection('games');
              }}
            />
          </div>
        )}
      </main>

      {/* Interactive Mascot widget */}
      <MascotMora />

      {/* Grown-ups / Teacher Progress modal */}
      <ParentModal
        isOpen={isParentModalOpen}
        onClose={() => setIsParentModalOpen(false)}
        progress={progress}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
