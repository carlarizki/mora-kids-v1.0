import React from 'react';
import { Play, ArrowRight, Heart, Leaf, Sun, Users } from 'lucide-react';
import { MoraButton } from './ui/MoraPrimitives';
import { MORA_HERO_IMAGE } from '../data/catalog';
import { sound } from '../utils/audio';

interface HeroBannerProps {
  onQuickStart: () => void;
  onExploreHowItWorks: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onQuickStart, onExploreHowItWorks }) => {
  return (
    <section className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 overflow-hidden px-5 pb-16 pt-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      {/* Left Column */}
      <div className="relative z-10 max-w-2xl">
        <p className="mb-4 font-hand text-xl sm:text-2xl font-bold text-primary select-none">
          Good play changes everything ♡
        </p>

        <h1 className="text-5xl font-black leading-[0.92] text-foreground sm:text-7xl lg:text-8xl font-display tracking-tight">
          Little moments.
          <br />
          <span className="text-primary">Big tomorrows.</span>
        </h1>

        <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
          Mora helps families turn everyday moments into meaningful learning, together.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <MoraButton
            size="lg"
            variant="joyful"
            onClick={() => {
              sound.playPop();
              onQuickStart();
            }}
          >
            <span>Get started</span>
            <ArrowRight className="size-4" />
          </MoraButton>

          <MoraButton
            size="lg"
            variant="ghost"
            onClick={() => {
              sound.playPop();
              onExploreHowItWorks();
            }}
          >
            <span className="flex size-9 items-center justify-center rounded-full border-2 border-primary text-primary mr-1">
              <Play className="size-4 fill-current ml-0.5" />
            </span>
            <span>Watch the story</span>
          </MoraButton>
        </div>

        {/* 4 Pillars: Play, Explore, Grow, Together */}
        <div className="mt-12 grid max-w-lg grid-cols-4 gap-3 text-center">
          {[
            { icon: Heart, label: 'Play' },
            { icon: Leaf, label: 'Explore' },
            { icon: Sun, label: 'Grow' },
            { icon: Users, label: 'Together' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="group">
              <Icon className="mx-auto mb-2 size-7 text-mint transition-transform group-hover:scale-110" />
              <span className="text-xs font-bold text-foreground font-display">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Hero Artwork with Organic Blobs */}
      <div className="relative min-h-[430px] lg:min-h-[610px]">
        {/* Soft decorative background shapes */}
        <div className="blob-soft absolute inset-4 bg-sky-soft pointer-events-none" />
        <div className="blob-soft absolute -right-16 top-12 size-64 bg-sun/80 pointer-events-none" />
        <div className="blob-soft absolute -bottom-20 left-4 size-72 bg-mint pointer-events-none" />

        {/* Photo Container */}
        <img
          src={MORA_HERO_IMAGE}
          alt="A parent and child painting together at a table"
          width={1200}
          height={1008}
          className="blob-soft animate-float relative z-10 h-full min-h-[430px] w-full object-cover object-center shadow-soft lg:min-h-[610px]"
        />

        {/* Playful Handwritten Note */}
        <p className="absolute right-1 top-2 z-20 rotate-6 font-hand text-xl sm:text-2xl font-bold text-foreground lg:-right-3 select-none drop-shadow-xs">
          Same little humans.
          <br />
          Brighter days ahead. ♡
        </p>
      </div>
    </section>
  );
};
