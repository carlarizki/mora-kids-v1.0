import React, { useState } from 'react';
import { VoiceLineRecorder } from './VoiceLineRecorder';
import { VOICE_LINES } from '../utils/voiceRecorder';
import {
  Users,
  Calendar,
  Sparkles,
  Mic,
  Clock,
  Plus,
  Play,
  CheckCircle,
  Heart,
  Volume2,
  Share2,
  Star,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  X
} from 'lucide-react';
import {
  ChildProfile,
  FamilyMember,
  LittleMoment,
  SchedulePlan,
  VoiceProfile,
  LiveActivity,
  Language
} from '../types/game';
import { MoraButton } from './ui/MoraPrimitives';
import { sound } from '../utils/audio';

interface MoraFamilyHomeProps {
  childrenList: ChildProfile[];
  selectedChildId: string;
  onSelectChild: (id: string) => void;
  members: FamilyMember[];
  moments: LittleMoment[];
  schedule: SchedulePlan[];
  voiceProfiles: VoiceProfile[];
  liveActivity: LiveActivity;
  language: Language;
  onLaunchGame: (gameId: string) => void;
  onSwitchToKidsPlay: () => void;
}

export const MoraFamilyHome: React.FC<MoraFamilyHomeProps> = ({
  childrenList,
  selectedChildId,
  onSelectChild,
  members,
  moments,
  schedule,
  voiceProfiles,
  liveActivity,
  language,
  onLaunchGame,
  onSwitchToKidsPlay,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'moments' | 'family' | 'voice'>('overview');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Papa' | 'Mama' | 'Nenek' | 'Kakek' | 'Guardian'>('Papa');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // New plan form
  const [planTitle, setPlanTitle] = useState('');
  const [planTime, setPlanTime] = useState('09:00');
  const [planPeriod, setPlanPeriod] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [planGameId, setPlanGameId] = useState('math-rocket');

  const selectedChild = childrenList.find((c) => c.id === selectedChildId) || childrenList[0];

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planTitle.trim()) return;
    sound.playSuccess();
    schedule.push({
      id: `sch-${Date.now()}`,
      childId: selectedChild.id,
      day: 'Tomorrow',
      time: planTime,
      period: planPeriod,
      realm: 'math',
      gameId: planGameId,
      title: planTitle,
      createdBy: 'Mama',
      completed: false,
    });
    setIsAddPlanModalOpen(false);
    setPlanTitle('');
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail.trim()) {
      sound.playSuccess();
      setInviteSuccess(true);
      setTimeout(() => {
        setIsInviteModalOpen(false);
        setInviteSuccess(false);
        setInviteEmail('');
      }, 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8 animate-in fade-in">
      {/* Top Family Greeting & Child Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary font-hand uppercase tracking-wider">
            <Users className="size-4" />
            <span>Mora Family · Home</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground mt-1">
            {language === 'id' ? `Halo, Keluarga ${selectedChild.name}! 🌱` : `Hello, ${selectedChild.name}'s Family! 🌱`}
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            {language === 'id'
              ? 'Ruang hangat orang tua dan keluarga untuk menemani petualangan belajar anak.'
              : 'A warm space for parents and caregivers to plan, support, and cherish little moments.'}
          </p>
        </div>

        {/* Child Selector Tabs */}
        <div className="flex items-center gap-3">
          <div className="p-1 bg-muted rounded-full flex items-center gap-1 border border-border">
            {childrenList.map((c) => {
              const isSelected = c.id === selectedChild.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    sound.playPop();
                    onSelectChild(c.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-ink-soft hover:text-foreground'
                  }`}
                >
                  <span className="text-base">{c.avatar}</span>
                  <span>{c.name}</span>
                  <span className="text-[11px] opacity-75">({c.age} thn)</span>
                </button>
              );
            })}
          </div>

          <MoraButton
            variant="joyful"
            size="sm"
            onClick={onSwitchToKidsPlay}
            className="shrink-0"
          >
            <Play className="size-3.5 fill-current" />
            <span>{language === 'id' ? 'Buka Mora Play' : 'Open Mora Play'}</span>
          </MoraButton>
        </div>
      </div>

      {/* Family Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-border/60 mb-8">
        {(
          [
            { id: 'overview' as const, label: language === 'id' ? 'Beranda Keluarga' : 'Family Home' },
            { id: 'schedule' as const, label: language === 'id' ? 'Little Plans (Jadwal)' : 'Little Plans' },
            { id: 'moments' as const, label: language === 'id' ? "Today's Moments" : "Today's Moments" },
            { id: 'family' as const, label: language === 'id' ? 'Anggota Keluarga' : 'Family Circle' },
            { id: 'voice' as const, label: language === 'id' ? 'Personalized Voice' : 'Voice Studio' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playPop();
              setActiveTab(tab.id);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-card text-ink-soft hover:bg-muted border border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 1. LIVE ACTIVITY (What is happening right now?) */}
          {liveActivity.isPlaying ? (
            <div className="paper-card rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-mint-soft via-card to-card border-2 border-mint">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="relative flex size-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
                    <span className="relative inline-flex rounded-full size-4 bg-mint" />
                  </span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-mint">
                      {language === 'id' ? 'AKTIVITAS BERLANGSUNG' : 'LIVE ACTIVITY'}
                    </span>
                    <h3 className="font-display text-xl font-black text-foreground">
                      {liveActivity.childName} {language === 'id' ? 'sedang bermain dengan Mora' : 'is playing with Mora'}
                    </h3>
                    <p className="text-xs text-ink-soft mt-0.5">
                      {liveActivity.gameTitle} · {liveActivity.elapsedMinutes} menit yang lalu
                    </p>
                  </div>
                </div>

                <MoraButton
                  size="sm"
                  variant="sunshine"
                  onClick={onSwitchToKidsPlay}
                >
                  <span>{language === 'id' ? 'Intip Permainan' : 'Join Activity'}</span>
                  <ArrowRight className="size-3.5" />
                </MoraButton>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-secondary/60 border border-primary/10 flex items-center justify-between text-xs text-ink-soft">
              <span>🌱 {language === 'id' ? `${selectedChild.name} sedang istirahat. Siap untuk petualangan berikutnya!` : `${selectedChild.name} is resting. Ready for the next little moment!`}</span>
              <button
                onClick={onSwitchToKidsPlay}
                className="font-bold text-primary hover:underline cursor-pointer"
              >
                {language === 'id' ? 'Ajak Bermain Sekarang →' : 'Start Play Now →'}
              </button>
            </div>
          )}

          {/* 2. WHAT HAPPENED? (Today's Little Moments) & WHAT'S NEXT (Little Plans) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Today's Little Moments */}
            <div className="paper-card rounded-3xl p-6 sm:p-7 border border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="font-hand font-bold text-primary text-xs uppercase tracking-wider">
                    {language === 'id' ? 'MEMORI HARI INI' : 'TODAY’S LITTLE MOMENTS'}
                  </span>
                  <h3 className="font-display text-2xl font-black text-foreground">
                    {language === 'id' ? 'Momen Indah Hari Ini' : 'Today’s Little Moments'}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('moments')}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  {language === 'id' ? 'Lihat Semua' : 'View All'}
                </button>
              </div>

              <div className="space-y-3.5">
                {moments.slice(0, 3).map((moment) => (
                  <div
                    key={moment.id}
                    className="p-4 rounded-2xl bg-muted/50 border border-border flex items-start gap-3.5"
                  >
                    <span className="text-2xl mt-0.5">{moment.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-sm text-foreground">
                          {moment.title}
                        </h4>
                        <span className="text-[11px] text-muted-foreground">{moment.timestamp}</span>
                      </div>
                      <p className="text-xs text-ink-soft mt-1">{moment.subtitle}</p>
                      {moment.starsEarned && (
                        <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-sun-foreground">
                          <Star className="size-3 fill-sun text-sun" />
                          <span>+{moment.starsEarned} Bintang diraih</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Next / Little Plans */}
            <div className="paper-card rounded-3xl p-6 sm:p-7 border border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="font-hand font-bold text-mint text-xs uppercase tracking-wider">
                    {language === 'id' ? 'RENCANA KECIL' : 'WHAT’S NEXT'}
                  </span>
                  <h3 className="font-display text-2xl font-black text-foreground">
                    {language === 'id' ? 'Little Plans 🌱' : 'Little Plans 🌱'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddPlanModalOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>{language === 'id' ? 'Tambah Rencana' : 'Add Plan'}</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {schedule.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-card border border-border shadow-2xs flex items-center justify-between group hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-sun/15 text-sun-foreground flex flex-col items-center justify-center font-display font-bold text-xs">
                        <span>{item.time}</span>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-foreground">
                          {item.title}
                        </h4>
                        <span className="text-[11px] text-ink-soft">
                          {item.day} · {language === 'id' ? 'Dibuat oleh' : 'Created by'} {item.createdBy}
                        </span>
                      </div>
                    </div>

                    <MoraButton
                      size="sm"
                      variant="sunshine"
                      onClick={() => onLaunchGame(item.gameId)}
                    >
                      <Play className="size-3 fill-current" />
                      <span>{language === 'id' ? 'Mulai' : 'Play'}</span>
                    </MoraButton>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. MORA SUGGESTIONS (What should we do next?) */}
          <div className="paper-card rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-sky-soft/60 via-card to-secondary/60 border border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="size-14 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="size-7" />
                </div>
                <div>
                  <span className="font-hand font-bold text-primary text-xs uppercase tracking-wider">
                    {language === 'id' ? 'SARAN DARI MORA' : 'MORA SUGGESTION'}
                  </span>
                  <h3 className="font-display text-2xl font-black text-foreground mt-0.5">
                    {language === 'id' ? `Ide bermain untuk ${selectedChild.name} besok:` : `Tomorrow's Little Plan for ${selectedChild.name}:`}
                  </h3>
                  <p className="text-sm text-ink-soft mt-1 max-w-xl">
                    {language === 'id'
                      ? 'Berdasarkan minat minggu ini: 1) Eksperimen sirkuit listrik di Science Lab, 2) Mengenal huruf Hijaiyah Ba & Ta dengan audio riang.'
                      : 'Based on recent milestones: 1) Circuit sparks in Science Lab, 2) Meet Hijaiyah letters Ba & Ta with gentle audio.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MoraButton
                  variant="joyful"
                  onClick={() => {
                    sound.playSuccess();
                    schedule.push({
                      id: `sch-rec-${Date.now()}`,
                      childId: selectedChild.id,
                      day: 'Tomorrow',
                      time: '15:30',
                      period: 'afternoon',
                      realm: 'quran',
                      gameId: 'hijaiyah-quest',
                      title: 'Meet Ba & Ta Letters',
                      createdBy: 'Mora Suggestion',
                      completed: false,
                    });
                    alert(language === 'id' ? 'Saran Mora berhasil ditambahkan ke Little Plans!' : 'Mora suggestion added to Little Plans!');
                  }}
                >
                  <span>{language === 'id' ? 'Jadwalkan Ide Ini' : 'Add to Schedule'}</span>
                  <Plus className="size-4" />
                </MoraButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE TAB */}
      {activeTab === 'schedule' && (
        <div className="paper-card rounded-3xl p-6 sm:p-10 border border-border">
          <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
            <div>
              <h2 className="font-display text-3xl font-black text-foreground">
                {language === 'id' ? 'Little Plans & Jadwal Aktivitas' : 'Little Plans & Schedule'}
              </h2>
              <p className="text-sm text-ink-soft mt-1">
                {language === 'id'
                  ? 'Atur ritme bermain tanpa tekanan. Jadwal bisa fleksibel kapan saja.'
                  : 'Flexible, stress-free routine for everyday moments.'}
              </p>
            </div>
            <MoraButton
              variant="joyful"
              size="sm"
              onClick={() => setIsAddPlanModalOpen(true)}
            >
              <Plus className="size-4" />
              <span>{language === 'id' ? 'Buat Rencana Baru' : 'New Plan'}</span>
            </MoraButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['morning', 'afternoon', 'evening'] as const).map((period) => {
              const items = schedule.filter((s) => s.period === period);
              const label =
                period === 'morning'
                  ? (language === 'id' ? '☀️ Pagi Hari' : '☀️ Morning')
                  : period === 'afternoon'
                  ? (language === 'id' ? '🌤️ Siang / Sore' : '🌤️ Afternoon')
                  : (language === 'id' ? '🌙 Malam Hari' : '🌙 Evening');

              return (
                <div key={period} className="p-5 bg-muted/40 rounded-2xl border border-border">
                  <h4 className="font-display text-lg font-black text-foreground mb-4">{label}</h4>
                  {items.length > 0 ? (
                    <div className="space-y-3">
                      {items.map((it) => (
                        <div key={it.id} className="p-4 bg-card rounded-xl border border-border shadow-2xs">
                          <div className="flex items-center justify-between text-xs text-ink-soft">
                            <span>{it.time}</span>
                            <span className="font-bold text-primary">{it.createdBy}</span>
                          </div>
                          <h5 className="font-display font-bold text-sm text-foreground mt-1">{it.title}</h5>
                          <MoraButton
                            size="sm"
                            variant="sunshine"
                            className="mt-3 w-full"
                            onClick={() => onLaunchGame(it.gameId)}
                          >
                            <Play className="size-3 fill-current" />
                            <span>{language === 'id' ? 'Mainkan Sekarang' : 'Play Now'}</span>
                          </MoraButton>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                      {language === 'id' ? 'Belum ada rencana. Waktu santai!' : 'No plans set. Free play time!'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MOMENTS TAB */}
      {activeTab === 'moments' && (
        <div className="paper-card rounded-3xl p-6 sm:p-10 border border-border">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-black text-foreground">
              {language === 'id' ? 'Buku Memori & Little Moments' : 'Family Memory Book & Moments'}
            </h2>
            <p className="text-sm text-ink-soft mt-1">
              {language === 'id'
                ? 'Kumpulan catatan kecil setiap kali anak menyelesaikan tantangan baru.'
                : 'A warm memory feed of accomplishments, drawings, and milestones.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moments.map((m) => (
              <div key={m.id} className="p-5 rounded-2xl bg-card border border-border shadow-soft flex items-start gap-4">
                <span className="text-3xl">{m.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase font-hand">{m.category}</span>
                    <span className="text-[11px] text-muted-foreground">{m.timestamp}</span>
                  </div>
                  <h4 className="font-display text-base font-black text-foreground mt-0.5">{m.title}</h4>
                  <p className="text-xs text-ink-soft mt-1 leading-relaxed">{m.subtitle}</p>
                  {m.starsEarned && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-sun-foreground">
                      <Star className="size-3.5 fill-sun text-sun" />
                      <span>+{m.starsEarned} Bintang tersimpan</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAMILY CIRCLE TAB */}
      {activeTab === 'family' && (
        <div className="paper-card rounded-3xl p-6 sm:p-10 border border-border">
          <div className="flex items-center justify-between pb-6 border-b border-border mb-8">
            <div>
              <h2 className="font-display text-3xl font-black text-foreground">
                {language === 'id' ? 'Lingkaran Keluarga (Family Circle)' : 'Family Circle'}
              </h2>
              <p className="text-sm text-ink-soft mt-1">
                {language === 'id'
                  ? 'Undang Papa, Mama, Nenek, Kakek, atau pengasuh untuk ikut melihat perjalanan anak.'
                  : 'Invite loved ones to share the journey together.'}
              </p>
            </div>
            <MoraButton
              variant="joyful"
              size="sm"
              onClick={() => setIsInviteModalOpen(true)}
            >
              <UserPlus className="size-4" />
              <span>{language === 'id' ? 'Undang Anggota' : 'Invite Member'}</span>
            </MoraButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {members.map((m) => (
              <div key={m.id} className="p-6 rounded-2xl bg-card border border-border shadow-xs text-center">
                <div className="size-16 rounded-full bg-secondary flex items-center justify-center text-3xl mx-auto mb-3 shadow-xs">
                  {m.avatar}
                </div>
                <h4 className="font-display font-black text-lg text-foreground">{m.name}</h4>
                <span className="text-xs font-bold text-primary font-hand uppercase">{m.role}</span>
                <p className="text-xs text-ink-soft mt-2">
                  {language === 'id' ? 'Izin: Melihat Momen, Jadwal, Permainan' : 'Permissions: Moments, Schedule, Play'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VOICE PERSONALIZATION TAB */}
      {activeTab === 'voice' && (
        <div className="paper-card rounded-3xl p-6 sm:p-10 border border-border">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-black text-foreground">
              {language === 'id' ? 'Studio Suara Keluarga (Personalized Voice)' : 'Personalized Family Voice'}
            </h2>
            <p className="text-sm text-ink-soft mt-1 max-w-xl leading-relaxed">
              {language === 'id'
                ? 'Rekam suara Mama atau Papa untuk menyapa dan memberi semangat saat anak bermain game Mora. Terasa seperti Mama sedang menemani langsung!'
                : "Record your voice to deliver game instructions and gentle cheers in your child's favorite voice."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {voiceProfiles.map((v) => (
              <div
                key={v.id}
                className={`p-6 rounded-2xl border transition-all ${
                  v.enabled
                    ? 'border-2 border-primary bg-secondary/30 shadow-play'
                    : 'bg-card border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Mic className="size-5" />
                  </div>
                  {v.enabled && (
                    <span className="px-2.5 py-1 rounded-full bg-mint-soft text-mint font-bold text-[11px]">
                      Aktif
                    </span>
                  )}
                </div>

                <h4 className="font-display font-bold text-base text-foreground">{v.name}</h4>
                <p className="text-xs text-ink-soft mt-0.5">{v.owner}</p>

                <div className="my-4 p-3 rounded-xl bg-card border border-border text-xs text-foreground italic">
                  "{v.samplePhrase}"
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playPop();
                      sound.speak(v.samplePhrase);
                    }}
                    className="flex-1 py-2 px-3 rounded-full bg-secondary hover:bg-secondary/80 text-primary font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Volume2 className="size-3.5" />
                    <span>Dengarkan</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.playSuccess();
                      voiceProfiles.forEach((vp) => (vp.enabled = vp.id === v.id));
                    }}
                    className={`px-3 py-2 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                      v.enabled
                        ? 'bg-primary text-white'
                        : 'bg-card border border-border text-ink-soft hover:text-foreground'
                    }`}
                  >
                    {v.enabled ? 'Terpilih' : 'Gunakan'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Record Your Voice Box */}
          <div className="p-6 rounded-2xl bg-secondary border border-primary/20">
            <div className="flex items-center gap-3 mb-5">
              <Mic className="size-6 text-primary shrink-0" />
              <div>
                <h5 className="font-display font-bold text-base text-foreground">
                  {language === 'id' ? 'Rekam Suara Baru' : 'Record a New Voice'}
                </h5>
                <p className="text-xs text-ink-soft">
                  {language === 'id'
                    ? 'Rekam 3 kalimat tetap di bawah ini. Suara disimpan di perangkat ini saja (localStorage), belum di-backup ke cloud.'
                    : 'Record the 3 fixed lines below. Stored on this device only (localStorage), not yet backed up to the cloud.'}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {VOICE_LINES.map((line) => (
                <VoiceLineRecorder key={line.id} line={line} language={language} />
              ))}
            </div>
            <p className="text-[11px] text-ink-soft mt-4 leading-relaxed">
              {language === 'id'
                ? 'Catatan: ini rekaman kalimat tetap, bukan voice cloning — jadi audionya persis kalimat yang direkam, belum bisa menyebut nama anak secara dinamis.'
                : "Note: these are fixed-line recordings, not voice cloning — playback is the exact recorded audio and can't dynamically say your child's name yet."}
            </p>
          </div>
        </div>
      )}

      {/* Modal: Add Plan */}
      {isAddPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in">
          <div className="paper-card rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-play border border-border">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
              <h3 className="font-display text-xl font-black text-foreground">
                {language === 'id' ? 'Tambah Little Plan' : 'Add Little Plan'}
              </h3>
              <button
                onClick={() => setIsAddPlanModalOpen(false)}
                className="size-8 rounded-full hover:bg-muted flex items-center justify-center"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddPlan} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Nama Aktivitas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Belajar Huruf Ba & Ta"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Jam Main</label>
                  <input
                    type="time"
                    value={planTime}
                    onChange={(e) => setPlanTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Waktu</label>
                  <select
                    value={planPeriod}
                    onChange={(e) => setPlanPeriod(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="morning">Pagi</option>
                    <option value="afternoon">Siang/Sore</option>
                    <option value="evening">Malam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Pilih Permainan Mora</label>
                <select
                  value={planGameId}
                  onChange={(e) => setPlanGameId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="hijaiyah-quest">🕌 Meet Hijaiyah & Letter Safari</option>
                  <option value="quran-explorer">📖 Explore Short Surahs (Kemenag)</option>
                  <option value="math-rocket">🚀 Space Math Cannon</option>
                  <option value="fraction-pizza">🍕 Pizza Chef Fractions</option>
                  <option value="science-circuits">⚡ Electric Circuit Sparks</option>
                  <option value="rainbow-melody">🎵 Rainbow Xylophone</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPlanModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-ink-soft hover:bg-muted"
                >
                  Batal
                </button>
                <MoraButton type="submit" variant="joyful" size="sm">
                  Simpan ke Rencana
                </MoraButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Invite Member */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in">
          <div className="paper-card rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-play border border-border">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
              <h3 className="font-display text-xl font-black text-foreground">
                Undang Anggota Keluarga
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="size-8 rounded-full hover:bg-muted flex items-center justify-center"
              >
                <X className="size-4" />
              </button>
            </div>

            {inviteSuccess ? (
              <div className="text-center py-6">
                <CheckCircle className="size-12 text-mint mx-auto mb-2" />
                <h4 className="font-display text-lg font-bold text-foreground">Undangan Terkirim!</h4>
                <p className="text-xs text-ink-soft mt-1">
                  Link undangan bergabung ke keluarga {selectedChild.name} telah dikirim ke {inviteEmail}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Peran Keluarga</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="Papa">Papa</option>
                    <option value="Mama">Mama</option>
                    <option value="Nenek">Nenek</option>
                    <option value="Kakek">Kakek</option>
                    <option value="Guardian">Pengasuh / Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Email Anggota</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-bold text-ink-soft hover:bg-muted"
                  >
                    Batal
                  </button>
                  <MoraButton type="submit" variant="joyful" size="sm">
                    Kirim Undangan
                  </MoraButton>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
