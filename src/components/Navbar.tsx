import React, { useState } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowRight, Star, Globe, Users, Play } from 'lucide-react';
import { MoraLogo, MoraButton } from './ui/MoraPrimitives';
import { RealmId, Language } from '../types/game';

interface NavbarProps {
  currentRealm: RealmId | 'all';
  onSelectRealm: (realm: RealmId | 'all') => void;
  totalStars: number;
  soundMuted: boolean;
  onToggleSound: () => void;
  onOpenParentCorner: () => void;
  onNavigateSection: (sectionId: string) => void;
  onLaunchArabicGame?: () => void;
  currentMode: 'play' | 'family';
  onToggleMode: (mode: 'play' | 'family') => void;
  language: Language;
  onToggleLanguage: () => void;
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRealm,
  onSelectRealm,
  totalStars,
  soundMuted,
  onToggleSound,
  onOpenParentCorner,
  onNavigateSection,
  onLaunchArabicGame,
  currentMode,
  onToggleMode,
  language,
  onToggleLanguage,
  isAuthenticated,
  onLoginClick,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigateSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/60">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <MoraLogo
            onClick={() => {
              onSelectRealm('all');
              handleNavClick('top');
            }}
          />

          {/* Mode Switcher Badge (Play vs Family) — logged-in only */}
          {isAuthenticated && (
          <div className="hidden sm:flex items-center p-0.5 bg-muted rounded-full border border-border text-xs font-bold">
            <button
              onClick={() => onToggleMode('play')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer transition-all ${
                currentMode === 'play'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-ink-soft hover:text-foreground'
              }`}
            >
              <Play className="size-3 fill-current" />
              <span>Play</span>
            </button>
            <button
              onClick={() => onToggleMode('family')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer transition-all ${
                currentMode === 'family'
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-ink-soft hover:text-foreground'
              }`}
            >
              <Users className="size-3" />
              <span>Family</span>
            </button>
          </div>
          )}
        </div>

        {/* Clean Text Navigation Links */}
        <nav className="hidden items-center gap-7 text-sm font-semibold text-ink-soft md:flex" aria-label="Main navigation">
          {currentMode === 'play' ? (
            <>
              <button
                onClick={() => handleNavClick('how-it-works')}
                className="cursor-pointer transition-colors hover:text-primary"
              >
                {language === 'id' ? 'Cara Kerja' : 'How it works'}
              </button>
              <button
                onClick={() => handleNavClick('features')}
                className="cursor-pointer transition-colors hover:text-primary"
              >
                {language === 'id' ? 'Fitur' : 'Features'}
              </button>
              <button
                onClick={() => handleNavClick('games')}
                className={`cursor-pointer transition-colors ${
                  currentRealm !== 'all' ? 'text-primary font-bold' : 'hover:text-primary'
                }`}
              >
                {language === 'id' ? 'Permainan' : 'Play & Games'}
              </button>
              <button
                onClick={() => {
                  if (onLaunchArabicGame) {
                    onLaunchArabicGame();
                  } else {
                    onSelectRealm('quran');
                    handleNavClick('games');
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-bold transition-all shadow-2xs cursor-pointer group"
                title="Petualangan Bahasa Arab (1001 Malam)"
              >
                <span>🌙</span>
                <span>{language === 'id' ? 'Bahasa Arab' : 'Arabic Games'}</span>
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>
              <button
                onClick={() => handleNavClick('worksheet')}
                className="cursor-pointer transition-colors hover:text-primary"
              >
                {language === 'id' ? 'Worksheet' : 'Worksheets'}
              </button>
              <button
                onClick={() => handleNavClick('for-families')}
                className="cursor-pointer transition-colors hover:text-primary"
              >
                {language === 'id' ? 'Keluarga' : 'For families'}
              </button>
              <button
                onClick={() => handleNavClick('pricing')}
                className="cursor-pointer transition-colors hover:text-primary"
              >
                {language === 'id' ? 'Harga' : 'Pricing'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onToggleMode('family')}
                className="cursor-pointer text-primary font-bold"
              >
                {language === 'id' ? 'Dashboard Keluarga' : 'Family Dashboard'}
              </button>
              <button
                onClick={() => handleNavClick('games')}
                className="cursor-pointer transition-colors hover:text-primary"
              >
                {language === 'id' ? 'Katalog Aktivitas' : 'Activity Library'}
              </button>
              <button
                onClick={() => handleNavClick('pricing')}
                className="cursor-pointer transition-colors hover:text-primary"
              >
                {language === 'id' ? 'Langganan' : 'Subscription'}
              </button>
            </>
          )}
        </nav>

        {/* Action Controls */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-muted text-xs font-bold text-ink-soft hover:text-foreground transition-colors cursor-pointer"
            title="Ganti Bahasa / Switch Language"
          >
            <Globe className="size-3.5 text-primary" />
            <span>{language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundMuted ? 'Turn Sound On' : 'Turn Sound Off'}
            className="flex size-9 items-center justify-center rounded-full hover:bg-muted text-ink-soft hover:text-foreground transition-colors cursor-pointer"
            title={soundMuted ? 'Sound Muted' : 'Sound Active'}
          >
            {soundMuted ? <VolumeX className="size-4 text-muted-foreground" /> : <Volume2 className="size-4 text-primary" />}
          </button>

          {/* Star Counter — only meaningful once logged in */}
          {isAuthenticated && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sun/15 border border-sun/30 text-sun-foreground font-bold text-xs shadow-2xs select-none"
              title="Total Mora Stars collected"
            >
              <Star className="size-3.5 fill-sun text-sun" />
              <span className="font-display font-black text-sm tabular-nums">{totalStars}</span>
            </div>
          )}

          {isAuthenticated && (
            <MoraButton
              variant={currentMode === 'family' ? 'joyful' : 'ghost'}
              size="sm"
              onClick={() => onToggleMode(currentMode === 'family' ? 'play' : 'family')}
            >
              {currentMode === 'family' ? 'Mora Play 🎮' : 'Family Mode 👨‍👩‍👧'}
            </MoraButton>
          )}

          {isAuthenticated && (
            <button
              type="button"
              onClick={onLogout}
              className="text-xs font-bold text-ink-soft hover:text-destructive px-2 py-1.5 cursor-pointer transition-colors"
            >
              {language === 'id' ? 'Keluar' : 'Log out'}
            </button>
          )}

          {!isAuthenticated && (
            <MoraButton variant="joyful" size="default" onClick={onLoginClick}>
              <span>{language === 'id' ? 'Masuk' : 'Log in'}</span>
              <ArrowRight className="size-4" />
            </MoraButton>
          )}

          {isAuthenticated && currentMode === 'play' && (
            <MoraButton
              variant="joyful"
              size="default"
              onClick={() => handleNavClick('games')}
            >
              <span>{language === 'id' ? 'Mulai Main' : 'Get started'}</span>
              <ArrowRight className="size-4" />
            </MoraButton>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onToggleLanguage}
            className="text-xs font-bold px-2 py-1 bg-muted rounded-full text-foreground"
          >
            {language === 'id' ? 'ID' : 'EN'}
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            className="flex size-9 items-center justify-center rounded-full text-ink-soft"
          >
            {soundMuted ? <VolumeX className="size-4 text-muted-foreground" /> : <Volume2 className="size-4 text-primary" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-full hover:bg-muted text-foreground"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="paper-card absolute left-5 right-5 top-20 rounded-2xl p-5 md:hidden space-y-2 shadow-play z-50 animate-in fade-in">
            {/* Mode switch — logged-in only */}
            {isAuthenticated && (
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xs font-bold text-ink-soft">Mode:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onToggleMode('play');
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${currentMode === 'play' ? 'bg-primary text-white' : 'bg-muted'}`}
                  >
                    Play
                  </button>
                  <button
                    onClick={() => {
                      onToggleMode('family');
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${currentMode === 'family' ? 'bg-primary text-white' : 'bg-muted'}`}
                  >
                    Family
                  </button>
                </div>
              </div>
            )}

            {['How it works', 'Features', 'Worksheet', 'For families', 'Play & Games', 'Stories', 'Pricing'].map((item) => {
              const target = item === 'Play & Games' ? 'games' : item.toLowerCase().replaceAll(' ', '-');
              return (
                <button
                  key={item}
                  onClick={() => handleNavClick(target)}
                  className="w-full text-left px-3 py-2 text-sm font-bold text-foreground hover:text-primary hover:bg-muted rounded-xl transition-colors cursor-pointer"
                >
                  {item}
                </button>
              );
            })}
            <div className="pt-2 border-t border-border flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onLaunchArabicGame) {
                    onLaunchArabicGame();
                  } else {
                    onSelectRealm('quran');
                    handleNavClick('games');
                  }
                }}
                className="w-full text-left px-3 py-2.5 text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>🌙</span>
                  <span>Petualangan Bahasa Arab (1001 Malam)</span>
                </div>
                <span className="text-xs bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-bold">Baru</span>
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    onOpenParentCorner();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-bold text-ink-soft hover:text-foreground rounded-xl"
                >
                  Grown-ups Dashboard
                </button>
              )}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-bold text-destructive hover:bg-muted rounded-xl"
                >
                  {language === 'id' ? 'Keluar' : 'Log out'}
                </button>
              ) : (
                <MoraButton
                  variant="joyful"
                  className="w-full"
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  {language === 'id' ? 'Masuk' : 'Log in'}
                </MoraButton>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
