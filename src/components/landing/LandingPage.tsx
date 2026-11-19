import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  ChevronDown,
  Clock,
  Code2,
  FlaskConical,
  Heart,
  Mic,
  Moon,
  Printer,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
} from 'lucide-react';
import { MoraButton, MoraSectionHeader } from '../ui/MoraPrimitives';
import { MORA_FLOWER_IMAGE, MORA_HERO_IMAGE, MORA_MOMENTS_IMAGE } from '../../data/catalog';
import { sound } from '../../utils/audio';

/**
 * Public landing page for the Indonesian market (logged-out visitors).
 *
 * Positioning: screen time yang bermakna — short, guided play for ages 3–8,
 * with Calistung, Hijaiyah and Singapore-style math, balanced with offline
 * activities, and a family dashboard so working parents stay in the loop.
 */

interface LandingPageProps {
  /** Primary conversion: start the free plan (opens login / sign-up). */
  onStart: () => void;
  /** Browse the catalog for a given learning realm. */
  onBrowseRealm: (realm: string) => void;
}

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const TRUST_POINTS = ['Tanpa iklan', 'Bahasa Indonesia', 'Usia 3–8 tahun', '10–15 menit sehari'];

const PAINS = [
  {
    icon: Smartphone,
    title: '“Sebentar lagi, Bun…”',
    body: 'HP dipegang, video terus berganti. Anak anteng, tapi Ayah & Bunda bertanya-tanya: dia belajar apa?',
  },
  {
    icon: Clock,
    title: 'Waktu orang tua terbatas',
    body: 'Pulang kerja sudah capek. Mau menemani belajar, tapi bingung harus mulai dari mana.',
  },
  {
    icon: BookOpen,
    title: 'Persiapan masuk SD',
    body: 'Calistung, mengaji, bahasa Inggris — semuanya penting, dan semuanya ingin dimulai dengan cara yang menyenangkan.',
  },
];

const STEPS = [
  {
    n: '1',
    title: 'Buat profil si kecil',
    body: 'Masukkan nama dan usianya. Mora menyiapkan aktivitas yang pas untuk tahap belajarnya.',
  },
  {
    n: '2',
    title: 'Main 10–15 menit',
    body: 'Satu sesi singkat setiap hari: game edukatif, misi harian, atau worksheet. Cukup, lalu selesai.',
  },
  {
    n: '3',
    title: 'Lanjutkan di dunia nyata',
    body: 'Kartu misi mengajak anak bermain tanpa layar. Foto momennya, dan seluruh keluarga bisa ikut melihat.',
  },
];

const REALMS = [
  {
    realm: 'math',
    icon: Calculator,
    title: 'Matematika',
    body: 'Berhitung, number bond, dan Math Lab ala Singapura: pegang benda, gambar, lalu angka.',
    tone: 'bg-sky-soft text-primary',
  },
  {
    realm: 'literacy',
    icon: BookOpen,
    title: 'Calistung & Bahasa',
    body: 'Mengenal huruf, membaca suku kata, dan kosakata Bahasa Indonesia & Inggris.',
    tone: 'bg-coral-soft text-coral',
  },
  {
    realm: 'quran',
    icon: Moon,
    title: 'Hijaiyah & Al-Qur’an',
    body: 'Mengenal huruf Hijaiyah dan harakat, surat-surat pendek, dan petualangan bahasa Arab.',
    tone: 'bg-mint-soft text-mint',
  },
  {
    realm: 'science',
    icon: FlaskConical,
    title: 'Sains & Sosial',
    body: 'Rangkaian listrik, ekosistem kolam, dan jelajah dunia lewat tebak-cocok yang seru.',
    tone: 'bg-sun-soft text-sun-foreground',
  },
  {
    realm: 'coding',
    icon: Code2,
    title: 'Coding Cilik',
    body: 'Logika langkah demi langkah tanpa mengetik, dirancang untuk anak usia 4–6 tahun.',
    tone: 'bg-violet-soft text-violet',
  },
  {
    realm: 'worksheet',
    icon: Printer,
    title: 'Worksheet Cetak',
    body: 'Unduh dan print di rumah, atau kerjakan langsung di layar dengan krayon digital.',
    tone: 'bg-rose-soft text-rose',
  },
];

const FAMILY_FEATURES = [
  {
    icon: Users,
    title: 'Satu keluarga, satu lingkaran',
    body: 'Ayah, Bunda, bahkan Eyang di kota lain bisa melihat progres dan momen si kecil.',
  },
  {
    icon: Mic,
    title: 'Suara Bunda di dalam game',
    body: 'Rekam kalimat penyemangat dengan suara sendiri, lalu Mora memutarnya saat anak bermain.',
  },
  {
    icon: Heart,
    title: 'Hadiah dari bintang',
    body: 'Bintang yang dikumpulkan bisa ditukar dengan hadiah yang Ayah & Bunda tentukan sendiri.',
  },
];

const PLANS = [
  {
    name: 'Gratis',
    price: 'Rp 0',
    period: 'selamanya',
    note: 'Untuk mulai mengenal Mora.',
    items: ['3 sesi main untuk dicoba', '1 profil anak', 'Worksheet gratis'],
    cta: 'Mulai Gratis',
    highlight: false,
  },
  {
    name: 'Plus',
    price: 'Rp 49.000',
    period: '/bulan',
    note: 'Paling banyak dipilih keluarga.',
    items: ['Semua game & Math Lab', 'Sampai 3 profil anak', 'Kartu misi & momen keluarga', 'Tanpa iklan'],
    cta: 'Coba Plus',
    highlight: true,
  },
  {
    name: 'Keluarga',
    price: 'Rp 79.000',
    period: '/bulan',
    note: 'Untuk keluarga besar.',
    items: ['Semua fitur Plus', 'Sampai 5 profil anak', 'Voice Studio suara orang tua', 'Lingkaran keluarga diperluas'],
    cta: 'Pilih Keluarga',
    highlight: false,
  },
];

const FAQS = [
  {
    q: 'Untuk usia berapa Mora cocok?',
    a: 'Mora dirancang untuk anak usia 3–8 tahun, dari PAUD/TK sampai kelas awal SD. Setiap aktivitas punya label usia sehingga Ayah & Bunda bisa memilih yang pas.',
  },
  {
    q: 'Bukankah anak jadi makin lama di depan layar?',
    a: 'Justru sebaliknya. Satu sesi Mora hanya 10–15 menit, dan banyak aktivitas berlanjut tanpa layar: worksheet cetak dan kartu misi untuk dimainkan bersama di rumah.',
  },
  {
    q: 'Apakah aman untuk anak? Ada iklannya?',
    a: 'Tidak ada iklan dan tidak ada chat dengan orang asing. Fitur pengaturan dan progres berada di area orang tua.',
  },
  {
    q: 'Apakah ada materi mengaji?',
    a: 'Ada. Mora punya permainan mengenal huruf Hijaiyah dan harakat, surat-surat pendek, serta petualangan bahasa Arab untuk anak.',
  },
  {
    q: 'Bisa dipakai di HP?',
    a: 'Bisa. Mora berjalan di browser HP, tablet, maupun laptop, tanpa perlu mengunduh aplikasi.',
  },
  {
    q: 'Bagaimana kalau ingin berhenti berlangganan?',
    a: 'Paket Gratis bisa dipakai tanpa batas waktu. Paket berbayar bisa dihentikan kapan saja.',
  },
];

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-hand text-xl font-bold text-primary sm:text-2xl">{children}</p>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onBrowseRealm }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const start = () => {
    sound.playPop();
    onStart();
  };

  return (
    <div className="animate-in fade-in duration-200">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-10 overflow-hidden px-5 pb-16 pt-8 lg:min-h-[640px] lg:grid-cols-[1fr_1fr] lg:px-8">
        <div className="relative z-10 max-w-2xl">
          <Eyebrow>Main sambil belajar, bareng Ayah & Bunda ♡</Eyebrow>

          <h1 className="mt-3 font-display text-4xl font-black leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Waktu layar yang <span className="text-primary">bikin anak tumbuh.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Game edukatif, worksheet, dan aktivitas keluarga untuk anak 3–8 tahun. Calistung, Hijaiyah, sampai
            matematika ala Singapura, cukup 10–15 menit sehari.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <MoraButton size="lg" variant="joyful" onClick={start}>
              <span>Coba Gratis Sekarang</span>
              <ArrowRight className="size-4" />
            </MoraButton>
            <MoraButton size="lg" variant="outline" onClick={() => scrollTo('how-it-works')}>
              Lihat cara kerjanya
            </MoraButton>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink-soft">
            {TRUST_POINTS.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="size-4 text-mint" strokeWidth={3} />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-h-[380px] lg:min-h-[560px]">
          <div className="blob-soft pointer-events-none absolute inset-4 bg-sky-soft" />
          <div className="blob-soft pointer-events-none absolute -right-16 top-10 size-56 bg-sun/80" />
          <div className="blob-soft pointer-events-none absolute -bottom-16 left-4 size-64 bg-mint" />
          <img
            src={MORA_HERO_IMAGE}
            alt="Anak tersenyum dengan tangan penuh cat warna-warni"
            width={1200}
            height={1008}
            fetchPriority="high"
            decoding="async"
            className="blob-soft animate-float relative z-10 h-full min-h-[380px] w-full object-cover shadow-soft lg:min-h-[560px]"
          />
          <div className="absolute bottom-6 left-0 z-20 flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-play sm:left-6">
            <span className="flex size-10 items-center justify-center rounded-full bg-sun text-lg">⭐</span>
            <div>
              <p className="text-sm font-black text-foreground">Zahra dapat 3 bintang!</p>
              <p className="text-xs text-ink-soft">Mengenal huruf Alif–Ba–Ta</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Empathy / problem ─────────────────────────────── */}
      <section className="border-y border-border/60 bg-card py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <MoraSectionHeader eyebrow="Kami paham rasanya" centered>
            Anak dekat dengan layar itu wajar.
            <br className="hidden sm:block" /> Yang penting, layarnya mengajak apa.
          </MoraSectionHeader>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PAINS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-background p-6">
                <Icon className="size-7 text-coral" />
                <h3 className="mt-4 text-lg font-black text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <MoraSectionHeader eyebrow="Cara kerjanya">Sebentar di layar, panjang manfaatnya.</MoraSectionHeader>
            <ol className="mt-8 space-y-6">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-black text-primary-foreground">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-foreground">{s.title}</h3>
                    <p className="mt-1 leading-relaxed text-ink-soft">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <img
            src={MORA_FLOWER_IMAGE}
            alt="Anak bermain dengan bunga di luar rumah"
            width={1008}
            height={864}
            loading="lazy"
            decoding="async"
            className="blob-soft h-[340px] w-full object-cover shadow-soft sm:h-[440px]"
          />
        </div>
      </section>

      {/* ── What they learn ───────────────────────────────── */}
      <section id="features" className="scroll-mt-20 border-y border-border/60 bg-card py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <MoraSectionHeader
            eyebrow="Apa yang dipelajari"
            centered
            subtitle="Lebih dari 20 game dan aktivitas, disusun per tahap usia, dari yang paling dasar."
          >
            Semua yang si kecil butuhkan sebelum dan saat masuk SD.
          </MoraSectionHeader>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REALMS.map(({ realm, icon: Icon, title, body, tone }) => (
              <button
                key={title}
                type="button"
                onClick={() => {
                  sound.playPop();
                  onBrowseRealm(realm);
                }}
                className="group flex cursor-pointer flex-col items-start rounded-2xl border border-border bg-background p-6 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-soft"
              >
                <span className={`flex size-12 items-center justify-center rounded-2xl ${tone}`}>
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-4 text-lg font-black text-foreground">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
                  Lihat aktivitas <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Families ──────────────────────────────────────── */}
      <section id="for-families" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16 lg:px-8 lg:py-24">
        <MoraSectionHeader eyebrow="Untuk seluruh keluarga">
          Belajarnya di aplikasi, <span className="text-primary">kenangannya untuk keluarga.</span>
        </MoraSectionHeader>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <img
            src={MORA_MOMENTS_IMAGE}
            alt="Anak-anak bermain membangun dan menjelajah alam"
            width={1536}
            height={640}
            loading="lazy"
            decoding="async"
            className="aspect-16/10 w-full rounded-2xl object-cover shadow-soft"
          />
          <div className="flex flex-col justify-center gap-6">
            {FAMILY_FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-foreground">{title}</h3>
                  <p className="mt-1 leading-relaxed text-ink-soft">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Safety strip ──────────────────────────────────── */}
      <section className="bg-primary py-10 text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-5 sm:flex-row sm:items-center lg:px-8">
          <ShieldCheck className="size-10 shrink-0" />
          <p className="text-lg font-bold leading-snug">
            Aman sejak awal: tanpa iklan, tanpa chat dengan orang asing, dan semua pengaturan ada di tangan orang tua.
          </p>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────── */}
      <section id="pricing" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16 lg:px-8 lg:py-24">
        <MoraSectionHeader eyebrow="Harga" centered subtitle="Mulai gratis. Upgrade kalau si kecil sudah betah.">
          Lebih hemat dari satu kali les per bulan.
        </MoraSectionHeader>
        <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-7 ${
                plan.highlight ? 'bg-foreground text-background shadow-play' : 'border border-border bg-card'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-sun px-3 py-1 text-xs font-black text-sun-foreground">
                  <Sparkles className="size-3" /> Favorit
                </span>
              )}
              <h3 className={`text-lg font-black ${plan.highlight ? 'text-background' : 'text-foreground'}`}>
                {plan.name}
              </h3>
              <p className={`mt-1 text-sm ${plan.highlight ? 'text-background/70' : 'text-ink-soft'}`}>{plan.note}</p>
              <p className="mt-5 font-display">
                <span className="text-3xl font-black">{plan.price}</span>
                <span className={`ml-1 text-sm ${plan.highlight ? 'text-background/70' : 'text-ink-soft'}`}>
                  {plan.period}
                </span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className={`mt-0.5 size-4 shrink-0 ${plan.highlight ? 'text-sun' : 'text-mint'}`} strokeWidth={3} />
                    {item}
                  </li>
                ))}
              </ul>
              <MoraButton
                className="mt-7 w-full"
                variant={plan.highlight ? 'sunshine' : 'outline'}
                onClick={start}
              >
                {plan.cta}
              </MoraButton>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-20 border-t border-border/60 bg-card py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <MoraSectionHeader eyebrow="Pertanyaan yang sering ditanyakan" centered>
            Ada yang ingin ditanyakan?
          </MoraSectionHeader>
          <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-background">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-bold text-foreground"
                  >
                    {f.q}
                    <ChevronDown className={`size-5 shrink-0 text-ink-soft transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {open && <p className="px-5 pb-5 leading-relaxed text-ink-soft">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-sky-soft px-6 py-12 text-center sm:px-12">
          <div className="blob-soft pointer-events-none absolute -left-10 -top-10 size-40 bg-sun/60" />
          <div className="blob-soft pointer-events-none absolute -bottom-12 -right-8 size-48 bg-mint/50" />
          <div className="relative">
            <Eyebrow>Hari ini, 15 menit saja</Eyebrow>
            <h2 className="mx-auto mt-2 max-w-2xl font-display text-3xl font-black leading-tight text-foreground sm:text-5xl">
              Mulai kebiasaan belajar yang menyenangkan bersama si kecil.
            </h2>
            <MoraButton size="lg" variant="joyful" className="mt-8" onClick={start}>
              <span>Coba Mora Gratis</span>
              <ArrowRight className="size-4" />
            </MoraButton>
            <p className="mt-3 text-sm text-ink-soft">Tanpa kartu kredit. Langsung bisa dipakai di HP.</p>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            <span className="font-display text-base font-black text-foreground">mora</span> · Momen kecil, masa depan
            besar.
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
            {[
              ['Cara kerja', 'how-it-works'],
              ['Materi', 'features'],
              ['Harga', 'pricing'],
              ['FAQ', 'faq'],
            ].map(([label, id]) => (
              <button key={id} type="button" onClick={() => scrollTo(id)} className="cursor-pointer hover:text-primary">
                {label}
              </button>
            ))}
          </nav>
          <p>© {new Date().getFullYear()} Mora</p>
        </div>
      </footer>
    </div>
  );
};
