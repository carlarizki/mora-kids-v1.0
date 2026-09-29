import React from 'react';
import { Calculator, FlaskConical, BookOpen, Palette, Sparkles, Moon, Code, ChevronRight } from 'lucide-react';
import { REALMS } from '../data/catalog';
import { RealmId } from '../types/game';
import { MoraSectionHeader } from './ui/MoraPrimitives';
import { sound } from '../utils/audio';

interface RealmSpotlightProps {
  onSelectRealm: (realm: RealmId) => void;
  selectedRealm: RealmId | 'all';
}

export const RealmSpotlight: React.FC<RealmSpotlightProps> = ({ onSelectRealm, selectedRealm }) => {
  const realmsList = Object.values(REALMS);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="size-5" />;
      case 'FlaskConical':
        return <FlaskConical className="size-5" />;
      case 'BookOpen':
        return <BookOpen className="size-5" />;
      case 'Palette':
        return <Palette className="size-5" />;
      case 'Moon':
        return <Moon className="size-5" />;
      case 'Code':
        return <Code className="size-5" />;
      default:
        return <Sparkles className="size-5" />;
    }
  };

  return (
    <section id="realms-section" className="py-12 max-w-7xl mx-auto px-5 lg:px-8">
      <MoraSectionHeader
        eyebrow="Curated Realms"
        subtitle="Six gentle learning environments shaped around natural curiosity."
        className="mb-8"
      >
        Explore by Learning Realm
      </MoraSectionHeader>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {realmsList.map((realm) => {
          const isSelected = selectedRealm === realm.id;

          return (
            <button
              key={realm.id}
              onClick={() => {
                sound.playPop();
                onSelectRealm(realm.id);
              }}
              className={`text-left p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'border-2 border-primary bg-card shadow-play scale-[1.02]'
                  : 'paper-card hover:-translate-y-1'
              }`}
            >
              <div>
                <div
                  className={`size-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                    isSelected ? 'bg-primary text-primary-foreground' : `${realm.themeColor.lightBg} ${realm.themeColor.text}`
                  }`}
                >
                  {getIcon(realm.icon)}
                </div>

                <h3 className="font-display text-lg font-black text-foreground leading-tight">
                  {realm.name}
                </h3>

                <p className="mt-1 text-xs text-ink-soft line-clamp-2 leading-relaxed font-normal">
                  {realm.tagline}
                </p>
              </div>

              <div className="mt-5 pt-3 flex items-center justify-between text-xs font-bold border-t border-border text-primary">
                <span>Explore</span>
                <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
