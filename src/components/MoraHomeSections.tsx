import React from 'react';
import { ArrowRight, Bell, Heart, Leaf, Sun, Users, Palette, BookOpen, Sparkles } from 'lucide-react';
import { MoraLogo, MoraSectionHeader, MoraButton } from './ui/MoraPrimitives';
import { MORA_FLOWER_IMAGE, MORA_MOMENTS_IMAGE } from '../data/catalog';
import { sound } from '../utils/audio';

interface MoraHomeSectionsProps {
  onExploreFeatures: () => void;
  onExploreGames: () => void;
  onStartActivity: () => void;
}

export const MoraHomeSections: React.FC<MoraHomeSectionsProps> = ({
  onExploreFeatures,
  onExploreGames,
  onStartActivity,
}) => {
  return (
    <>
      {/* SECTION 1: HOW IT WORKS */}
      <section id="how-it-works" className="relative bg-card py-20 lg:py-24 border-y border-border/60">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          {/* Left Text */}
          <div>
            <MoraSectionHeader eyebrow="How it works">
              A kinder, brighter everyday.
            </MoraSectionHeader>
            <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
              Mora gives you age-right activities shaped to your child, so you can play, learn, and grow—one small moment at a time.
            </p>
            <MoraButton
              variant="sunshine"
              className="mt-7"
              onClick={() => {
                sound.playPop();
                onExploreFeatures();
              }}
            >
              <span>See how it works</span>
              <ArrowRight className="size-4" />
            </MoraButton>
          </div>

          {/* Right Interactive App Experience Card */}
          <div className="paper-card rounded-2xl p-4 sm:p-6">
            {/* Top Bar of the Mock App */}
            <div className="mb-6 flex items-center justify-between">
              <MoraLogo />
              <div className="flex items-center gap-3">
                <Bell className="size-5 text-primary" />
                <div className="size-8 rounded-full bg-coral-soft flex items-center justify-center font-hand font-bold text-coral text-xs">
                  A
                </div>
              </div>
            </div>

            {/* Greeting Header */}
            <div className="rounded-xl bg-sky-soft p-5">
              <p className="text-sm font-medium text-ink-soft">Good morning</p>
              <h3 className="text-xl font-black font-display text-foreground">
                Hi, Aruna! <span className="text-sun">☀</span>
              </h3>
              <p className="mt-1 text-sm text-ink-soft">Today looks like a great day to play.</p>
            </div>

            {/* Two Action Cards */}
            <div className="mt-4 grid gap-4 sm:grid-cols-[1.4fr_0.8fr]">
              <div className="rounded-xl bg-mint-soft p-5">
                <Leaf className="mb-3 size-8 text-mint" />
                <h4 className="font-bold text-foreground font-display">Nature walk adventure</h4>
                <p className="mt-1 text-sm text-ink-soft">Explore the little wonders around you.</p>
                <MoraButton
                  size="sm"
                  variant="joyful"
                  className="mt-4"
                  onClick={() => {
                    sound.playPop();
                    onStartActivity();
                  }}
                >
                  Let's go!
                </MoraButton>
              </div>

              <div
                onClick={() => {
                  sound.playPop();
                  onExploreGames();
                }}
                className="rounded-xl bg-sun/20 p-5 cursor-pointer hover:bg-sun/30 transition-colors flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-primary tracking-wider uppercase">
                    CONTINUE THE MOMENT
                  </p>
                  <p className="mt-2 text-sm text-ink-soft">
                    Try making a leaf collage from your walk.
                  </p>
                </div>
                <ArrowRight className="mt-4 text-primary size-5" />
              </div>
            </div>

            {/* Category Quick Badges */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[Heart, Palette, BookOpen, Sun].map((Icon, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    sound.playPop();
                    onExploreGames();
                  }}
                  className="flex h-16 sm:h-20 items-center justify-center rounded-xl bg-muted hover:bg-sky-soft transition-colors cursor-pointer group"
                >
                  <Icon className="size-6 sm:size-7 text-primary transition-transform group-hover:scale-110" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-20 lg:py-24 lg:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Flower Visual with Hand Note */}
          <div className="relative">
            <img
              src={MORA_FLOWER_IMAGE}
              alt="A child playing with a daisy outdoors"
              width={1008}
              height={864}
              loading="lazy"
              className="blob-soft animate-float h-[360px] sm:h-[420px] w-full object-cover shadow-soft"
            />
            <p className="absolute -right-2 top-5 rotate-6 font-hand text-xl font-bold text-primary select-none drop-shadow-xs">
              Learning happens
              <br />
              everywhere ♡
            </p>
          </div>

          <div>
            <MoraSectionHeader eyebrow="Features">
              Everything you need for meaningful moments.
            </MoraSectionHeader>
            <p className="mt-5 max-w-xl text-ink-soft leading-relaxed">
              From play ideas to shared memories, Mora fits real family life—at home, outside, or on the go.
            </p>
          </div>
        </div>

        {/* 4 Feature Cards */}
        <div className="relative z-10 mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Sun,
              title: 'Curated activities',
              body: 'Age-right, play-based ideas that are easy to follow.',
              color: 'bg-sun/20 text-sun-foreground',
            },
            {
              icon: Leaf,
              title: 'Personalized for you',
              body: "Fresh ideas shaped around your child's age and interests.",
              color: 'bg-mint-soft text-mint',
            },
            {
              icon: Palette,
              title: 'Capture & reflect',
              body: 'Save memories, notes, and all the little milestones.',
              color: 'bg-sky-soft text-primary',
            },
            {
              icon: Users,
              title: 'Family circle',
              body: 'Invite loved ones to join the journey together.',
              color: 'bg-coral-soft text-coral',
            },
          ].map(({ icon: Icon, title, body, color }, idx) => (
            <article
              key={idx}
              className="paper-card rounded-2xl p-6 transition-transform hover:-translate-y-1"
            >
              <div className={`mb-5 flex size-12 items-center justify-center rounded-xl ${color}`}>
                <Icon className="size-6" />
              </div>
              <h3 className="text-lg font-black font-display text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 3: FOR FAMILIES */}
      <section id="for-families" className="bg-card py-20 lg:py-24 border-y border-border/60">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[0.65fr_1.35fr] lg:px-8">
          <div>
            <MoraSectionHeader eyebrow="For real life">
              Play fits into your day.
            </MoraSectionHeader>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Messy mornings, busy afternoons, and quiet evenings all hold room for a little wonder.
            </p>
            <MoraButton
              variant="joyful"
              className="mt-7"
              onClick={() => {
                sound.playPop();
                onExploreGames();
              }}
            >
              <span>Get started</span>
              <ArrowRight className="size-4" />
            </MoraButton>
          </div>

          <div className="relative">
            <img
              src={MORA_MOMENTS_IMAGE}
              alt="Children building, exploring nature, and looking through binoculars"
              width={1536}
              height={640}
              loading="lazy"
              className="w-full rounded-2xl object-cover shadow-soft aspect-16/9 sm:aspect-21/9"
            />
            <div className="mt-4 grid grid-cols-3 text-center font-hand text-xl font-bold text-primary select-none">
              <span>At home</span>
              <span>Outside</span>
              <span>Anywhere</span>
            </div>
            <Sparkles className="absolute -right-3 -top-4 size-8 text-sun pointer-events-none animate-bob" />
          </div>
        </div>
      </section>
    </>
  );
};
