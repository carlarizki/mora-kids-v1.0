import React, { useState } from 'react';
import { ArrowLeft, Volume2, Star, Bookmark, BookOpen, Check, Trophy, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { KEMENAG_SHORT_SURAHS, QuranSurah, QuranAyah } from '../../data/catalog';
import { sound } from '../../utils/audio';

interface QuranExplorerGameProps {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
}

export const QuranExplorerGame: React.FC<QuranExplorerGameProps> = ({ onBack, onFinishGame }) => {
  const [selectedSurahIdx, setSelectedSurahIdx] = useState(0);
  const [activeAyahIdx, setActiveAyahIdx] = useState<number | null>(null);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<string[]>([]);
  const [readAyahs, setReadAyahs] = useState<string[]>([]);

  const surah = KEMENAG_SHORT_SURAHS[selectedSurahIdx];

  const handlePlayAyahAudio = (ayah: QuranAyah, idx: number) => {
    sound.playPop();
    setActiveAyahIdx(idx);

    // Speak translation & guidance
    sound.speak(`${surah.nameLatin}, ayat ${ayah.ayahNumber}. Artinya: ${ayah.translationId}`);

    const key = `${surah.number}:${ayah.ayahNumber}`;
    if (!readAyahs.includes(key)) {
      setReadAyahs((prev) => [...prev, key]);
    }
  };

  const handleToggleBookmark = (ayahNumber: number) => {
    sound.playPop();
    const key = `${surah.number}:${ayahNumber}`;
    setBookmarkedAyahs((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleCompleteSurah = () => {
    sound.playFanfare();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    onFinishGame(20, 100);
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-border/60">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-foreground bg-card border border-border px-4 py-2 rounded-full shadow-2xs cursor-pointer hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <BookOpen className="size-5 text-emerald-600" />
          <span className="font-display text-xl font-black text-foreground">
            Explore Short Surahs
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs shadow-2xs">
          <Check className="size-3.5 text-emerald-600" />
          <span className="font-display text-xs font-bold">Kemenag RI Verified</span>
        </div>
      </div>

      {/* Surah Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {KEMENAG_SHORT_SURAHS.map((s, idx) => {
          const isSelected = selectedSurahIdx === idx;
          return (
            <button
              key={s.number}
              onClick={() => {
                sound.playPop();
                setSelectedSurahIdx(idx);
                setActiveAyahIdx(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-play'
                  : 'bg-card text-ink-soft hover:bg-muted border border-border'
              }`}
            >
              <span>{s.number}. {s.nameLatin}</span>
              <span className="ml-1.5 opacity-80">({s.nameArabic})</span>
            </button>
          );
        })}
      </div>

      {/* Surah Header Card */}
      <div className="paper-card rounded-3xl p-6 sm:p-8 border border-border text-center relative overflow-hidden mb-8 bg-gradient-to-b from-emerald-50/60 to-card">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Surah ke-{surah.number} · {surah.totalAyahs} Ayat
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground mt-2">
          {surah.nameLatin} <span className="font-normal font-serif text-3xl">({surah.nameArabic})</span>
        </h2>
        <p className="text-sm text-ink-soft mt-1">
          Artinya: <strong className="text-foreground">"{surah.meaningId}"</strong> ({surah.meaningEn})
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Teks dan Terjemahan resmi dari Mushaf Standar Indonesia — LPMQ Kementerian Agama RI
        </p>
      </div>

      {/* Ayahs List */}
      <div className="space-y-4 mb-8">
        {surah.ayahs.map((ayah, idx) => {
          const isSelected = activeAyahIdx === idx;
          const isBookmarked = bookmarkedAyahs.includes(`${surah.number}:${ayah.ayahNumber}`);

          return (
            <article
              key={ayah.ayahNumber}
              className={`paper-card rounded-2xl p-5 sm:p-7 border transition-all ${
                isSelected
                  ? 'border-2 border-emerald-500 bg-emerald-50/20 shadow-play'
                  : 'border-border hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
                <span className="size-8 rounded-full bg-emerald-100 text-emerald-800 font-display font-black text-xs flex items-center justify-center">
                  {ayah.ayahNumber}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayAyahAudio(ayah, idx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-primary text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Volume2 className="size-3.5" />
                    <span>Dengarkan</span>
                  </button>

                  <button
                    onClick={() => handleToggleBookmark(ayah.ayahNumber)}
                    className={`size-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                      isBookmarked ? 'text-sun fill-sun' : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title="Bookmark Ayat"
                  >
                    <Bookmark className="size-4" />
                  </button>
                </div>
              </div>

              {/* Arabic Text (Large and beautifully padded for children) */}
              <div className="text-right py-3 leading-[2.4] font-serif text-2xl sm:text-3xl font-bold text-foreground" dir="rtl">
                {ayah.arabic}
              </div>

              {/* Transliteration */}
              <div className="text-xs font-semibold text-emerald-800 mt-2 italic">
                {ayah.transliteration}
              </div>

              {/* Translation ID & EN */}
              <div className="text-sm text-foreground mt-2 leading-relaxed">
                {ayah.translationId}
              </div>
              <div className="text-xs text-ink-soft mt-1">
                {ayah.translationEn}
              </div>
            </article>
          );
        })}
      </div>

      {/* Surah Reflection & Star Claim */}
      <div className="paper-card rounded-3xl p-6 sm:p-8 bg-secondary/40 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
            <Heart className="size-6" />
          </div>
          <div>
            <h4 className="font-display text-lg font-black text-foreground">
              Selesai Membaca {surah.nameLatin}?
            </h4>
            <p className="text-xs text-ink-soft leading-relaxed mt-0.5">
              Alhamdulillah! Anak hebat yang mencintai Al-Qur'an mendapat berkah dan bintang penjelajah.
            </p>
          </div>
        </div>

        <button
          onClick={handleCompleteSurah}
          className="px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-display text-sm font-black shadow-play cursor-pointer transition-transform hover:scale-105 whitespace-nowrap"
        >
          Klaim +20 Bintang Qur'an!
        </button>
      </div>
    </div>
  );
};
