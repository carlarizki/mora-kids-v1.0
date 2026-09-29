/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { X, Star, Clock, Sparkles, Camera, CheckCircle2, RotateCcw, Loader2 } from 'lucide-react';
import { MoraButton, MoraSectionHeader } from './ui/MoraPrimitives';
import { MISSION_CARDS_CATALOG, MISSION_CATEGORY_LABEL, MissionCardItem } from '../data/missionCards';
import { Language } from '../types/game';
import { sound } from '../utils/audio';
import { resizeImageFile } from '../utils/imageResize';
import { loadMissionProgress, saveMissionProgress, MissionRecord } from '../utils/missionProgress';

interface MissionCardsSectionProps {
  language: Language;
  childId: string;
  onCompleteMission: (mission: MissionCardItem, photoDataUrl: string) => void;
}

type ModalMode = 'view' | 'complete' | 'completed';

const CATEGORY_STYLE: Record<MissionCardItem['category'], string> = {
  indoor: 'bg-sky-soft text-primary',
  outdoor: 'bg-mint-soft text-mint',
  combo: 'bg-coral-soft text-coral',
};

// "Balanced Play" — offline Mission Cards, the third Mora product pillar
// alongside games and worksheets. Every card uses things already at home
// (cardboard, flour, scissors, glue, crayons, leaves...) — no purchase, no
// inventory. Meant as a screen-to-real-world bridge for parents.
//
// Flow: view mission -> "Siap, Ayo Mulai!" marks it in_progress (go do it
// offline) -> come back and upload a proof photo -> stars + a Little
// Moment get recorded. Progress is per-child, stored in localStorage —
// Mora has no backend yet, so this is device-local only.
export const MissionCardsSection: React.FC<MissionCardsSectionProps> = ({
  language,
  childId,
  onCompleteMission,
}) => {
  const [progress, setProgress] = useState<Record<string, MissionRecord>>({});
  const [activeMission, setActiveMission] = useState<MissionCardItem | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>('view');
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setProgress(loadMissionProgress(childId));
  }, [childId]);

  const persist = (next: Record<string, MissionRecord>) => {
    setProgress(next);
    saveMissionProgress(childId, next);
  };

  const openMission = (mission: MissionCardItem) => {
    sound.playPop();
    setActiveMission(mission);
    setPendingPhoto(null);
    setPhotoError(null);
    const record = progress[mission.id];
    setModalMode(record?.status === 'completed' ? 'completed' : record?.status === 'in_progress' ? 'complete' : 'view');
  };

  const closeModal = () => {
    setActiveMission(null);
    setPendingPhoto(null);
    setPhotoError(null);
  };

  const startMission = () => {
    if (!activeMission) return;
    sound.playPop();
    persist({ ...progress, [activeMission.id]: { status: 'in_progress' } });
    closeModal();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);
    setIsProcessingPhoto(true);
    try {
      const dataUrl = await resizeImageFile(file);
      setPendingPhoto(dataUrl);
    } catch {
      setPhotoError(
        language === 'id' ? 'Gagal memproses foto, coba foto lain ya.' : "Couldn't process that photo — try another one."
      );
    } finally {
      setIsProcessingPhoto(false);
      e.target.value = '';
    }
  };

  const claimReward = () => {
    if (!activeMission || !pendingPhoto) return;
    sound.playPop();
    persist({
      ...progress,
      [activeMission.id]: {
        status: 'completed',
        photoDataUrl: pendingPhoto,
        completedAt: new Date().toISOString(),
      },
    });
    onCompleteMission(activeMission, pendingPhoto);
    closeModal();
  };

  return (
    <section id="mission-cards" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <MoraSectionHeader
          eyebrow={language === 'id' ? 'Dari Layar ke Dunia Nyata' : 'From Screen to Real World'}
          subtitle={
            language === 'id'
              ? 'Kegiatan offline pakai barang yang sudah ada di rumah — kardus, tepung, gunting, lem, krayon, atau sekadar jalan-jalan cari daun. Nggak perlu beli apa-apa.'
              : 'Offline activities using things you already have at home — cardboard, flour, scissors, glue, crayons, or just a walk to find leaves. Nothing to buy.'
          }
        >
          {language === 'id' ? 'Mission Cards' : 'Mission Cards'}
        </MoraSectionHeader>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MISSION_CARDS_CATALOG.map((mission) => {
            const record = progress[mission.id];
            return (
              <div
                key={mission.id}
                className="paper-card rounded-2xl p-6 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-3">
                  {record?.status === 'completed' && record.photoDataUrl ? (
                    <img
                      src={record.photoDataUrl}
                      alt={mission.title}
                      className="size-12 rounded-xl object-cover border border-border"
                    />
                  ) : (
                    <div className="size-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                      {mission.emoji}
                    </div>
                  )}
                  {record?.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-mint-soft text-mint whitespace-nowrap">
                      <CheckCircle2 className="size-3.5" />
                      {language === 'id' ? 'Selesai' : 'Done'}
                    </span>
                  ) : record?.status === 'in_progress' ? (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-sun/20 text-sun-foreground whitespace-nowrap">
                      {language === 'id' ? 'Sedang Berlangsung' : 'In Progress'}
                    </span>
                  ) : (
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${CATEGORY_STYLE[mission.category]}`}
                    >
                      {MISSION_CATEGORY_LABEL[mission.category][language]}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-display text-lg font-black text-foreground leading-tight">
                  {mission.title}
                </h3>
                <p className="mt-1.5 text-sm text-ink-soft">{mission.materials.join(', ')}</p>

                <div className="mt-4 flex items-center gap-4 text-xs font-bold text-ink-soft">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {mission.durationMinutes} {language === 'id' ? 'menit' : 'min'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sun-foreground">
                    <Star className="size-3.5 fill-current" />
                    {mission.starsReward}
                  </span>
                </div>

                <MoraButton
                  variant={record?.status === 'in_progress' ? 'joyful' : 'secondary'}
                  size="sm"
                  className="w-full mt-5"
                  onClick={() => openMission(mission)}
                >
                  {record?.status === 'completed' ? (
                    <>
                      <CheckCircle2 className="size-4" />
                      <span>{language === 'id' ? 'Lihat Lagi' : 'View Again'}</span>
                    </>
                  ) : record?.status === 'in_progress' ? (
                    <>
                      <Camera className="size-4" />
                      <span>{language === 'id' ? 'Upload Bukti' : 'Upload Proof'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      <span>{language === 'id' ? 'Lihat Misi' : 'View Mission'}</span>
                    </>
                  )}
                </MoraButton>
              </div>
            );
          })}
        </div>
      </div>

      {activeMission && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in"
          onClick={closeModal}
        >
          <div
            className="paper-card rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-play border border-border max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center text-2xl">
                  {activeMission.emoji}
                </div>
                <div>
                  <p className="font-hand font-bold text-primary text-xs uppercase tracking-wider">
                    {modalMode === 'completed'
                      ? language === 'id'
                        ? 'MISI SELESAI'
                        : 'MISSION DONE'
                      : language === 'id'
                        ? 'MISI'
                        : 'MISSION'}
                  </p>
                  <h2 className="font-display text-xl sm:text-2xl font-black text-foreground leading-tight">
                    {activeMission.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="size-9 rounded-full hover:bg-muted flex items-center justify-center text-ink-soft hover:text-foreground transition-colors cursor-pointer shrink-0"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* View mode: materials + steps + start CTA */}
            {modalMode === 'view' && (
              <>
                <div className="mt-5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-ink-soft">
                    {language === 'id' ? 'Bahan' : 'Materials'}
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {activeMission.materials.map((m) => (
                      <span key={m} className="text-xs font-bold px-2.5 py-1 rounded-full bg-mint-soft text-mint">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-ink-soft">
                    {language === 'id' ? 'Langkahnya' : 'Steps'}
                  </h4>
                  <ol className="mt-3 space-y-2.5">
                    {activeMission.steps.map((step, idx) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-sun/20 text-xs font-black text-sun-foreground">
                          {idx + 1}
                        </span>
                        <p className="text-sm text-foreground leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft">
                    <Clock className="size-4" />
                    {activeMission.durationMinutes} {language === 'id' ? 'menit' : 'min'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-sun-foreground">
                    <Star className="size-4 fill-current" />
                    +{activeMission.starsReward} {language === 'id' ? 'bintang' : 'stars'}
                  </span>
                </div>

                <MoraButton variant="joyful" size="sm" className="w-full mt-5" onClick={startMission}>
                  <span>{language === 'id' ? 'Siap, Ayo Mulai!' : "Ready, Let's Start!"}</span>
                </MoraButton>
                <p className="mt-3 text-center text-[11px] text-ink-soft">
                  {language === 'id'
                    ? 'Nanti balik lagi ke sini buat upload foto hasilnya ya.'
                    : "Come back here to upload a photo when you're done."}
                </p>
              </>
            )}

            {/* Complete mode: recap + photo upload */}
            {modalMode === 'complete' && (
              <>
                <p className="mt-5 text-sm text-ink-soft leading-relaxed">
                  {language === 'id'
                    ? 'Sudah selesai ngerjain misinya? Upload foto hasilnya buat klaim bintang.'
                    : 'Finished the mission? Upload a photo to claim your stars.'}
                </p>

                <div className="mt-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  {pendingPhoto ? (
                    <div className="relative">
                      <img
                        src={pendingPhoto}
                        alt={activeMission.title}
                        className="w-full max-h-64 object-cover rounded-2xl border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full bg-card/90 backdrop-blur-xs px-3 py-1.5 text-xs font-bold text-foreground border border-border cursor-pointer"
                      >
                        <RotateCcw className="size-3.5" />
                        {language === 'id' ? 'Ganti Foto' : 'Change Photo'}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessingPhoto}
                      className="w-full rounded-2xl border-2 border-dashed border-border py-8 flex flex-col items-center justify-center gap-2 text-ink-soft hover:text-primary hover:border-primary/40 transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {isProcessingPhoto ? (
                        <Loader2 className="size-6 animate-spin" />
                      ) : (
                        <Camera className="size-6" />
                      )}
                      <span className="text-sm font-bold">
                        {isProcessingPhoto
                          ? language === 'id'
                            ? 'Memproses foto...'
                            : 'Processing photo...'
                          : language === 'id'
                            ? 'Jepret atau pilih foto'
                            : 'Take or choose a photo'}
                      </span>
                    </button>
                  )}
                  {photoError && <p className="mt-2 text-xs font-bold text-coral">{photoError}</p>}
                </div>

                <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-sun-foreground">
                    <Star className="size-4 fill-current" />
                    +{activeMission.starsReward} {language === 'id' ? 'bintang' : 'stars'}
                  </span>
                </div>

                <MoraButton
                  variant="joyful"
                  size="sm"
                  className="w-full mt-5"
                  disabled={!pendingPhoto}
                  onClick={claimReward}
                >
                  <Star className="size-4" />
                  <span>{language === 'id' ? 'Selesai! Klaim Bintang' : 'Done! Claim Stars'}</span>
                </MoraButton>
              </>
            )}

            {/* Completed mode: read-only recap */}
            {modalMode === 'completed' && (
              <>
                {progress[activeMission.id]?.photoDataUrl && (
                  <img
                    src={progress[activeMission.id].photoDataUrl}
                    alt={activeMission.title}
                    className="mt-5 w-full max-h-64 object-cover rounded-2xl border border-border"
                  />
                )}
                <div className="mt-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-mint">
                    <CheckCircle2 className="size-4" />
                    {language === 'id' ? 'Misi selesai' : 'Mission complete'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-sun-foreground">
                    <Star className="size-4 fill-current" />
                    +{activeMission.starsReward} {language === 'id' ? 'bintang' : 'stars'}
                  </span>
                </div>
                <MoraButton variant="secondary" size="sm" className="w-full mt-5" onClick={closeModal}>
                  <span>{language === 'id' ? 'Tutup' : 'Close'}</span>
                </MoraButton>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
