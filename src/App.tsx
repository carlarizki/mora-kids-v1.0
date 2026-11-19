/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DailyQuestsBar } from './components/DailyQuestsBar';
import { RealmSpotlight } from './components/RealmSpotlight';
import { MoraHomeSections } from './components/MoraHomeSections';
import { MoraFooterSections } from './components/MoraFooterSections';
import { MascotMora } from './components/MascotMora';
import { ParentModal } from './components/ParentModal';
import { RewardShopModal } from './components/RewardShopModal';
import { LoginModal } from './components/LoginModal';
import { isLoggedIn, isPremiumAccount, logout as authLogout } from './utils/auth';
import { GAME_COMPONENTS, QUEST_BY_GAME, QUEST_GAME_BY_REALM } from './games/registry';

// Screens that are not part of the first paint are split into their own chunks.
const PlayWithMoraPage = lazy(() =>
  import('./components/PlayWithMoraPage').then((m) => ({ default: m.PlayWithMoraPage })),
);
const MoraFamilyHome = lazy(() =>
  import('./components/MoraFamilyHome').then((m) => ({ default: m.MoraFamilyHome })),
);
const PaywallScreen = lazy(() =>
  import('./components/PaywallScreen').then((m) => ({ default: m.PaywallScreen })),
);

import {
  GAMES_CATALOG,
  INITIAL_CHILDREN,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_MOMENTS,
  INITIAL_SCHEDULE,
  INITIAL_VOICE_PROFILES,
  REWARD_SHOP_ITEMS,
} from './data/catalog';
import { MissionCardItem } from './data/missionCards';
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
  CosmeticRewardItem,
  FamilyReward,
} from './types/game';
import { sound } from './utils/audio';
import { loadOwnedCosmetics, saveOwnedCosmetics, loadFamilyRewards, saveFamilyRewards } from './utils/rewardShop';

const STORAGE_KEY = 'morakids_progress_v2';
const MOMENT_ICON_BY_REALM: Partial<Record<RealmId, string>> = {
  quran: '🕌',
  math: '⭐',
  science: '⚡',
  coding: '🤖',
  discovery: '🧭',
};

const ScreenLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center text-primary" role="status" aria-label="Loading">
    <Loader2 className="size-8 animate-spin" />
  </div>
);
const FREE_TRIAL_LIMIT = 3;

// Real (non-dummy) starting point — this build is going out to actual
// friends/family testers, so progress should start empty, not pre-filled.
const INITIAL_PROGRESS: UserProgress = {
  totalStars: 0,
  gamesPlayed: 0,
  dailyStreak: 0,
  completedQuests: [],
  gameHighScores: {},
  minutesSpent: 0,
};

export default function App() {
  const [currentMode, setCurrentMode] = useState<'play' | 'family'>('play');
  const [language, setLanguage] = useState<Language>('id');
  const [currentRealm, setCurrentRealm] = useState<RealmId | 'all'>('all');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  // Dedicated "Play with Mora" page — holds every product (games + worksheets)
  // in one place. Reached via any "Explore"/games/worksheet CTA instead of
  // anchor-scrolling within the homepage/dashboard.
  const [showPlayPage, setShowPlayPage] = useState(false);
  const [playPageNavCount, setPlayPageNavCount] = useState(0);
  const playPageScrollTargetRef = React.useRef<string | null>(null);
  const navigateToPlayPage = (scrollTarget: string | null = null) => {
    playPageScrollTargetRef.current = scrollTarget;
    setShowPlayPage(true);
    setPlayPageNavCount((n) => n + 1);
  };
  const [soundMuted, setSoundMuted] = useState<boolean>(sound.isMuted());
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [isRewardShopOpen, setIsRewardShopOpen] = useState(false);

  // Reward Shop state (see mora-reward-shop-prd.md) — device-local via
  // localStorage, spends from the existing account-level totalStars pool.
  const [ownedCosmeticIds, setOwnedCosmeticIds] = useState<string[]>(() => loadOwnedCosmetics());
  const [familyRewards, setFamilyRewards] = useState<FamilyReward[]>(() => loadFamilyRewards());

  // Auth (UX-flow only, shared credential — see src/utils/auth.ts)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isLoggedIn());
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [pendingGameId, setPendingGameId] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  // Family State
  const [childrenList] = useState<ChildProfile[]>(INITIAL_CHILDREN);
  const [selectedChildId, setSelectedChildId] = useState<string>(INITIAL_CHILDREN[0].id);
  const [familyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY_MEMBERS);
  const [moments, setMoments] = useState<LittleMoment[]>(INITIAL_MOMENTS);
  const [schedule] = useState<SchedulePlan[]>(INITIAL_SCHEDULE);
  const [voiceProfiles] = useState<VoiceProfile[]>(INITIAL_VOICE_PROFILES);

  const selectedChild = useMemo(
    () => childrenList.find((c) => c.id === selectedChildId) ?? childrenList[0],
    [childrenList, selectedChildId],
  );
  const t = (id: string, en: string) => (language === 'id' ? id : en);

  // Every reward path (game, mission, shop) logs a Little Moment for the parent.
  const addMoment = (moment: Omit<LittleMoment, 'childName' | 'timestamp' | 'createdAt'>) => {
    setMoments((prev) => [
      {
        ...moment,
        childName: selectedChild.name,
        timestamp: t('Baru saja', 'Just now'),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

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

  useEffect(() => {
    saveOwnedCosmetics(ownedCosmeticIds);
  }, [ownedCosmeticIds]);

  useEffect(() => {
    saveFamilyRewards(familyRewards);
  }, [familyRewards]);

  // Every time we navigate into (or within) the Play with Mora page, either
  // jump to the requested section (e.g. "worksheet") or land at the top.
  // playPageNavCount is a nonce so re-clicking a nav link while already on
  // the page still re-triggers the scroll (unlike keying off the target
  // string, which would collide with clearing it back to null below).
  useEffect(() => {
    if (!showPlayPage || playPageNavCount === 0) return;
    const target = playPageScrollTargetRef.current;
    requestAnimationFrame(() => {
      if (target) {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [showPlayPage, playPageNavCount]);

  const handleToggleSound = () => {
    const nextMuted = !sound.toggleMute();
    setSoundMuted(nextMuted);
  };

  const handleToggleLanguage = () => {
    sound.playPop();
    setLanguage((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  // Entry point for every "play" action in the app (hero CTA, daily quest,
  // catalog card). Gates on: 1) logged in, 2) still has free trial plays left
  // — premium accounts skip the trial-limit gate entirely.
  const requestPlayGame = (gameId: string) => {
    if (!isAuthenticated) {
      setPendingGameId(gameId);
      setIsLoginOpen(true);
      return;
    }
    if (!isPremiumAccount() && progress.gamesPlayed >= FREE_TRIAL_LIMIT) {
      setShowPaywall(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    handlePlayGame(gameId);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginOpen(false);
    setCurrentMode('play');
    const gameId = pendingGameId;
    setPendingGameId(null);
    if (gameId) {
      // We're already inside the same synchronous handler that just
      // authenticated, so check the trial limit and launch directly instead
      // of going back through requestPlayGame — a setTimeout hop there would
      // close over a stale `isAuthenticated` from this render and bounce
      // straight back to the login modal.
      if (!isPremiumAccount() && progress.gamesPlayed >= FREE_TRIAL_LIMIT) {
        setShowPaywall(true);
      } else {
        handlePlayGame(gameId);
      }
    }
  };

  const handleLogout = () => {
    authLogout();
    setIsAuthenticated(false);
    setActiveGameId(null);
    setShowPaywall(false);
    setCurrentMode('play');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayGame = (gameId: string) => {
    sound.playPop();
    setActiveGameId(gameId);

    const game = GAMES_CATALOG.find((g) => g.id === gameId);

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
    const gameId = activeGameId ?? '';
    const game = GAMES_CATALOG.find((g) => g.id === gameId);

    if (game) {
      addMoment({
        id: `mom-${Date.now()}`,
        icon: MOMENT_ICON_BY_REALM[game.realm] ?? '🎨',
        title: t(`Menyelesaikan ${game.title}`, `Completed ${game.title}`),
        subtitle: t(`Meraih skor ${score} dengan semangat tinggi!`, `Scored ${score} with great joy!`),
        starsEarned,
        category: game.title,
      });
    }

    setLiveActivity((prev) => ({ ...prev, isPlaying: false }));

    setProgress((prev) => {
      const quest = QUEST_BY_GAME[gameId];
      return {
        ...prev,
        totalStars: prev.totalStars + starsEarned,
        completedQuests:
          quest && !prev.completedQuests.includes(quest) ? [...prev.completedQuests, quest] : prev.completedQuests,
        gameHighScores: {
          ...prev.gameHighScores,
          [gameId]: Math.max(prev.gameHighScores[gameId] || 0, score),
        },
      };
    });
  };

  const handleBackToCatalog = () => {
    sound.playPop();
    setActiveGameId(null);
    setLiveActivity((prev) => ({ ...prev, isPlaying: false }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mission Card completed offline, with a proof photo — awards stars and
  // records a Little Moment, same reward path as finishing a digital game.
  const handleCompleteMission = (mission: MissionCardItem, photoDataUrl: string) => {
    addMoment({
      id: `mission-${Date.now()}`,
      icon: mission.emoji,
      title: t(`Selesai misi: ${mission.title}`, `Completed mission: ${mission.title}`),
      subtitle: t('Aktivitas offline bareng Mora', 'Offline activity with Mora'),
      starsEarned: mission.starsReward,
      category: 'Mission Card',
      photoUrl: photoDataUrl,
    });
    setProgress((prev) => ({ ...prev, totalStars: prev.totalStars + mission.starsReward }));
  };

  // Reward Shop — Track A: buy a cosmetic item once with stars. Owned items
  // aren't re-purchasable and don't unlock any gameplay/content.
  const handleRedeemCosmetic = (item: CosmeticRewardItem) => {
    if (progress.totalStars < item.costStars || ownedCosmeticIds.includes(item.id)) return;
    setProgress((prev) => ({ ...prev, totalStars: prev.totalStars - item.costStars }));
    setOwnedCosmeticIds((prev) => [...prev, item.id]);
    addMoment({
      id: `shop-${Date.now()}`,
      icon: item.icon,
      title: t(`Membeli ${item.name}`, `Bought ${item.name}`),
      subtitle: t('Item dari Toko Bintang', 'Item from the Star Shop'),
      category: 'Toko Bintang',
    });
  };

  // Reward Shop — Track B: redeem a parent-defined real-world reward.
  // Repeatable (no ownership) — the reward itself happens off-app; this just
  // deducts stars and logs it to the Portfolio timeline for the parent.
  const handleRedeemFamilyReward = (reward: FamilyReward) => {
    if (progress.totalStars < reward.costStars) return;
    setProgress((prev) => ({ ...prev, totalStars: prev.totalStars - reward.costStars }));
    addMoment({
      id: `familyreward-${Date.now()}`,
      icon: reward.icon,
      title: t(`Menukar: ${reward.title}`, `Redeemed: ${reward.title}`),
      subtitle: t('Hadiah dari orang tua', 'A reward from the family'),
      category: 'Reward Keluarga',
    });
  };

  const handleCreateFamilyReward = (title: string, costStars: number, icon: string) => {
    const newReward: FamilyReward = {
      id: `reward-${Date.now()}`,
      title,
      icon,
      costStars,
      createdAt: new Date().toISOString(),
    };
    setFamilyRewards((prev) => [...prev, newReward]);
  };

  const handleDeleteFamilyReward = (rewardId: string) => {
    setFamilyRewards((prev) => prev.filter((r) => r.id !== rewardId || r.isDefault));
  };

  const handleResetProgress = () => {
    setProgress(INITIAL_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'games' || sectionId === 'worksheet') {
      // Both products now live together on the standalone Play with Mora page.
      setActiveGameId(null);
      setCurrentMode('play');
      navigateToPlayPage(sectionId);
    } else if (sectionId === 'top') {
      setActiveGameId(null);
      setShowPlayPage(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveGameId(null);
      setShowPlayPage(false);
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const ActiveGame = activeGameId ? GAME_COMPONENTS[activeGameId] : undefined;

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
        onOpenParentCorner={() => (isAuthenticated ? setIsParentModalOpen(true) : setIsLoginOpen(true))}
        onOpenRewardShop={() => setIsRewardShopOpen(true)}
        onNavigateSection={handleNavigateSection}
        onLaunchArabicGame={() => requestPlayGame('arabic-adventure')}
        currentMode={currentMode}
        onToggleMode={(mode) => {
          if (mode === 'family' && !isAuthenticated) {
            setIsLoginOpen(true);
            return;
          }
          sound.playPop();
          setActiveGameId(null);
          setShowPaywall(false);
          setShowPlayPage(false);
          setCurrentMode(mode);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        isAuthenticated={isAuthenticated}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        <Suspense fallback={<ScreenLoader />}>
          {activeGameId ? (
            /* Active game — each game is its own lazily loaded chunk */
            <div className="animate-in fade-in duration-200">
              <Suspense fallback={<ScreenLoader />}>
                {ActiveGame && (
                  <ActiveGame
                    onBack={handleBackToCatalog}
                    onFinishGame={handleFinishGame}
                    childId={selectedChild.id}
                    childName={selectedChild.name}
                  />
                )}
              </Suspense>
            </div>
          ) : showPaywall ? (
            <PaywallScreen language={language} onBack={() => setShowPaywall(false)} />
          ) : showPlayPage ? (
            /* Play with Mora — the one dedicated page holding every product:
               games catalog + worksheets. */
            <PlayWithMoraPage
              games={GAMES_CATALOG}
              selectedRealm={currentRealm}
              onSelectRealm={setCurrentRealm}
              onPlayGame={requestPlayGame}
              highScores={progress.gameHighScores}
              language={language}
              childId={selectedChild.id}
              onCompleteMission={handleCompleteMission}
              onBack={() => {
                setShowPlayPage(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : currentMode === 'family' && isAuthenticated ? (
            /* Mora Family Experience (Parents, Schedule, Moments, Voice Studio) — gated */
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
              onLaunchGame={requestPlayGame}
              onSwitchToKidsPlay={() => {
                sound.playPop();
                setCurrentMode('play');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              totalStars={progress.totalStars}
              familyRewards={familyRewards}
              onRedeemFamilyReward={handleRedeemFamilyReward}
              onCreateFamilyReward={handleCreateFamilyReward}
              onDeleteFamilyReward={handleDeleteFamilyReward}
            />
          ) : isAuthenticated ? (
            /* Dashboard: logged-in play experience — no marketing fluff, straight to activities */
            <div className="animate-in fade-in duration-200">
              <DailyQuestsBar
                language={language}
                completedQuestIds={progress.completedQuests}
                onPlayQuest={(realmId) => {
                  const questGame = QUEST_GAME_BY_REALM[realmId];
                  if (questGame) requestPlayGame(questGame);
                  else {
                    setCurrentRealm(realmId as RealmId);
                    navigateToPlayPage();
                  }
                }}
              />

              <RealmSpotlight
                language={language}
                selectedRealm={currentRealm}
                onSelectRealm={(r) => {
                  setCurrentRealm(r);
                  setActiveGameId(null);
                  navigateToPlayPage();
                }}
              />
            </div>
          ) : (
            /* Public Landing (logged out) — marketing content, matches morakids.lovable.app.
               Games are browsable here but "play" always routes through the login gate. */
            <div className="animate-in fade-in duration-200">
              <HeroBanner
                onQuickStart={() => requestPlayGame('hijaiyah-quest')}
                onExploreHowItWorks={() => handleNavigateSection('how-it-works')}
              />

              <MoraHomeSections
                onExploreFeatures={() => handleNavigateSection('features')}
                onExploreGames={() => handleNavigateSection('games')}
                onStartActivity={() => requestPlayGame('fraction-pizza')}
              />

              <RealmSpotlight
                language={language}
                selectedRealm={currentRealm}
                onSelectRealm={(r) => {
                  setCurrentRealm(r);
                  setActiveGameId(null);
                  navigateToPlayPage();
                }}
              />

              <MoraFooterSections
                onSelectPlan={() => {
                  setIsLoginOpen(true);
                }}
                onOpenParentCorner={() => setIsLoginOpen(true)}
                onSelectRealm={(r) => {
                  setCurrentRealm(r as RealmId);
                  handleNavigateSection('games');
                }}
              />
            </div>
          )}
        </Suspense>
      </main>

      {/* Interactive Mascot widget */}
      <MascotMora />

      {/* Grown-ups / Teacher Progress modal — logged-in only */}
      {isAuthenticated && (
        <ParentModal
          isOpen={isParentModalOpen}
          onClose={() => setIsParentModalOpen(false)}
          progress={progress}
          onResetProgress={handleResetProgress}
        />
      )}

      {/* Reward Shop (Track A: cosmetics) — logged-in only */}
      {isAuthenticated && (
        <RewardShopModal
          isOpen={isRewardShopOpen}
          onClose={() => setIsRewardShopOpen(false)}
          items={REWARD_SHOP_ITEMS}
          ownedIds={ownedCosmeticIds}
          totalStars={progress.totalStars}
          onRedeem={handleRedeemCosmetic}
          language={language}
        />
      )}

      {/* Login gate (UX-flow only, shared credential) */}
      <LoginModal
        isOpen={isLoginOpen}
        language={language}
        onClose={() => {
          setIsLoginOpen(false);
          setPendingGameId(null);
        }}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
