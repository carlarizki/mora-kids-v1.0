import React from 'react';
import { X, Star, Check, Lock, ShoppingBag } from 'lucide-react';
import { CosmeticRewardItem, Language } from '../types/game';
import { MoraButton } from './ui/MoraPrimitives';
import { sound } from '../utils/audio';

interface RewardShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CosmeticRewardItem[];
  ownedIds: string[];
  totalStars: number;
  onRedeem: (item: CosmeticRewardItem) => void;
  language: Language;
}

const CATEGORY_LABEL: Record<CosmeticRewardItem['category'], { id: string; en: string }> = {
  'robot-skin': { id: 'Skin Robot', en: 'Robot Skins' },
  sticker: { id: 'Stiker', en: 'Stickers' },
  'avatar-frame': { id: 'Bingkai Avatar', en: 'Avatar Frames' },
  theme: { id: 'Tema', en: 'Themes' },
};

export const RewardShopModal: React.FC<RewardShopModalProps> = ({
  isOpen,
  onClose,
  items,
  ownedIds,
  totalStars,
  onRedeem,
  language,
}) => {
  if (!isOpen) return null;

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in">
      <div className="paper-card rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-play border border-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-sun/20 flex items-center justify-center text-sun-foreground">
              <ShoppingBag className="size-6" />
            </div>
            <div>
              <p className="font-hand font-bold text-primary text-xs uppercase tracking-wider">
                {language === 'id' ? 'TOKO BINTANG' : 'STAR SHOP'}
              </p>
              <h2 className="font-display text-2xl font-black text-foreground">
                {language === 'id' ? 'Tukar Bintang, Dapat Hadiah!' : 'Trade Stars for Goodies!'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-9 rounded-full hover:bg-muted flex items-center justify-center text-ink-soft hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-center gap-2 my-6 py-3 rounded-2xl bg-sun/15 border border-sun/30">
          <Star className="size-5 fill-sun text-sun" />
          <span className="font-display text-2xl font-black text-foreground tabular-nums">{totalStars}</span>
          <span className="text-sm font-bold text-ink-soft">
            {language === 'id' ? 'Bintang tersedia' : 'stars available'}
          </span>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-6">
            <h3 className="font-hand font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">
              {language === 'id' ? CATEGORY_LABEL[category].id : CATEGORY_LABEL[category].en}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items
                .filter((item) => item.category === category)
                .map((item) => {
                  const owned = ownedIds.includes(item.id);
                  const affordable = totalStars >= item.costStars;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 ${
                        owned ? 'bg-mint-soft border-mint/30' : 'bg-card border-border'
                      }`}
                    >
                      <span className="text-3xl">{item.icon}</span>
                      <span className="text-xs font-bold text-foreground leading-tight">{item.name}</span>
                      {owned ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-mint">
                          <Check className="size-3" strokeWidth={3} />
                          {language === 'id' ? 'Dimiliki' : 'Owned'}
                        </span>
                      ) : (
                        <MoraButton
                          size="sm"
                          variant={affordable ? 'joyful' : 'outline'}
                          disabled={!affordable}
                          className="w-full !text-[11px] !px-2"
                          onClick={() => {
                            if (!affordable) return;
                            sound.playSuccess();
                            onRedeem(item);
                          }}
                        >
                          {affordable ? (
                            <span className="flex items-center gap-1">
                              <Star className="size-3 fill-current" />
                              {item.costStars}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Lock className="size-3" />
                              {item.costStars}
                            </span>
                          )}
                        </MoraButton>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        <p className="text-xs text-muted-foreground text-center mt-2">
          {language === 'id'
            ? 'Item di sini cuma buat gaya — nggak buka level atau fitur baru.'
            : "These are cosmetic-only — they don't unlock new levels or features."}
        </p>
      </div>
    </div>
  );
};
