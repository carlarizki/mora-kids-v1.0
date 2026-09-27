import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { RealmId } from '../types/game';

interface FooterProps {
  onSelectRealm: (realm: RealmId | 'all') => void;
  onOpenParentCorner: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectRealm, onOpenParentCorner }) => {
  return (
    <footer className="mt-20 border-t border-amber-200/60 bg-white/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white font-fredoka font-bold text-base">
              M
            </div>
            <div>
              <span className="font-fredoka text-lg font-bold text-slate-900">
                MoraKids
              </span>
              <p className="text-xs text-slate-500">
                Playful educational discovery for curious young minds
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => onSelectRealm('math')}
              className="hover:text-amber-600 cursor-pointer transition-colors"
            >
              Math Kingdom
            </button>
            <button
              onClick={() => onSelectRealm('science')}
              className="hover:text-emerald-600 cursor-pointer transition-colors"
            >
              Science Lab
            </button>
            <button
              onClick={() => onSelectRealm('literacy')}
              className="hover:text-sky-600 cursor-pointer transition-colors"
            >
              Storyverse
            </button>
            <button
              onClick={() => onSelectRealm('creative')}
              className="hover:text-purple-600 cursor-pointer transition-colors"
            >
              Creative Studio
            </button>
            <button
              onClick={onOpenParentCorner}
              className="hover:text-amber-700 cursor-pointer transition-colors flex items-center gap-1 text-amber-800"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Grown-ups Corner</span>
            </button>
          </div>

          <div className="text-xs text-slate-400">
            © {new Date().getFullYear()} MoraKids. Designed for joyous, safe exploration.
          </div>
        </div>
      </div>
    </footer>
  );
};
