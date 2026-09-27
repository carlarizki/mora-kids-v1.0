/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ArrowLeft, Check } from 'lucide-react';
import { MoraButton } from './ui/MoraPrimitives';
import { Language } from '../types/game';

interface PaywallScreenProps {
  language: Language;
  onBack: () => void;
}

const PLANS = [
  { name: 'Little Explorer', price: '$5.90', perks: ['Semua game', 'Worksheet interaktif', '1 profil anak'] },
  { name: 'Family Circle', price: '$9.90', perks: ['Semua game', 'Voice Studio', 'Sampai 4 profil anak'] },
];

export const PaywallScreen: React.FC<PaywallScreenProps> = ({ language, onBack }) => {
  return (
    <div className="max-w-2xl mx-auto px-5 py-16 text-center">
      <div className="size-16 mx-auto rounded-full bg-sun/20 flex items-center justify-center mb-6">
        <Sparkles className="size-8 text-sun-foreground" />
      </div>
      <h2 className="font-display text-3xl font-black text-foreground">
        {language === 'id' ? 'Sudah 3 kali main gratis! 🎉' : "You've used your 3 free plays! 🎉"}
      </h2>
      <p className="text-ink-soft mt-3 max-w-md mx-auto">
        {language === 'id'
          ? 'Untuk lanjut main sepuasnya, upgrade ke salah satu paket Mora di bawah ini.'
          : 'To keep playing, upgrade to one of the Mora plans below.'}
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {PLANS.map((plan) => (
          <div key={plan.name} className="paper-card rounded-3xl p-6 border border-border text-left">
            <h3 className="font-display text-lg font-black text-foreground">{plan.name}</h3>
            <p className="text-2xl font-black text-primary mt-1">
              {plan.price}
              <span className="text-sm font-medium text-ink-soft"> / bulan</span>
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-foreground">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2">
                  <Check className="size-3.5 text-mint shrink-0" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-xs text-ink-soft mt-6 italic">
        {language === 'id'
          ? '(Placeholder — pembayaran belum aktif di versi testing ini. Chat Carla kalau mau lanjut.)'
          : '(Placeholder — payment is not live in this test build yet. Message Carla to continue.)'}
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-foreground cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        <span>{language === 'id' ? 'Kembali ke katalog' : 'Back to catalog'}</span>
      </button>
    </div>
  );
};
