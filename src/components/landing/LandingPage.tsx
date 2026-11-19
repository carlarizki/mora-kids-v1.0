import React, { useEffect, useState } from 'react';
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

const TRUST_POINTS = ['Tanpa iklan', 'Pakai Bahasa Indonesia', 'Untuk anak 3–8 tahun', 'Cukup 15 menit sehari'];

const PAINS = [
  {
    icon: Smartphone,
    title: '“Bentar lagi, Bun…”',
    body: 'Satu video habis, langsung lanjut video berikutnya. Anaknya anteng, tapi kita jadi kepikiran, sebenarnya dia nonton apa?',
  },
  {
    icon: Clock,
    title: 'Pulang kerja udah capek',
    body: 'Pengin nemenin anak belajar, tapi tenaga tinggal sisa. Mau mulai dari mana juga bingung.',
  },
  {
    icon: BookOpen,
    title: 'Sebentar lagi masuk SD',
    body: 'Baca, tulis, hitung, ngaji, bahasa Inggris. Banyak yang mau dikenalkan, tapi anak cepat bosan kalau diajak duduk belajar.',
  },
];

const STEPS = [
  {
    n: '1',
    title: 'Buat profil anak',
    body: 'Isi nama dan umurnya. Mora langsung pilihkan permainan yang pas buat umur segitu.',
  },
  {
    n: '2',
    title: 'Main 15 menit',
    body: 'Satu sesi pendek tiap hari. Bisa main game, kerjakan misi harian, atau isi worksheet. Habis itu udahan, nggak perlu lama-lama.',
  },
  {
    n: '3',
    title: 'Lanjut main tanpa layar',
    body: 'Ada kartu misi buat dimainkan di rumah. Fotoin momennya, nanti keluarga yang lain juga bisa lihat.',
  },
];

const REALMS = [
  {
    realm: 'math',
    icon: Calculator,
    title: 'Matematika',
    body: 'Mulai dari berhitung sampai Math Lab ala Singapura. Anak pakai benda dulu, lalu gambar, baru ke angka.',
    tone: 'bg-sky-soft text-primary',
  },
  {
    realm: 'literacy',
    icon: BookOpen,
    title: 'Calistung & Bahasa',
    body: 'Kenal huruf, belajar baca per suku kata, dan nambah kosakata Bahasa Indonesia dan Inggris.',
    tone: 'bg-coral-soft text-coral',
  },
  {
    realm: 'quran',
    icon: Moon,
    title: 'Hijaiyah & Al-Qur’an',
    body: 'Kenalan sama huruf hijaiyah dan harakat, hafalan surat pendek, plus petualangan bahasa Arab.',
    tone: 'bg-mint-soft text-mint',
  },
  {
    realm: 'science',
    icon: FlaskConical,
    title: 'Sains & Sosial',
    body: 'Bikin rangkaian listrik, kenalan sama hewan di kolam, sampai jalan-jalan keliling dunia.',
    tone: 'bg-sun-soft text-sun-foreground',
  },
  {
    realm: 'coding',
    icon: Code2,
    title: 'Coding Cilik',
    body: 'Belajar logika langkah demi langkah, nggak perlu bisa ngetik. Cocok buat umur 4–6 tahun.',
    tone: 'bg-violet-soft text-violet',
  },
  {
    realm: 'worksheet',
    icon: Printer,
    title: 'Worksheet',
    body: 'Bisa di-print lalu dikerjakan pakai krayon, atau langsung dicoret-coret di layar.',
    tone: 'bg-rose-soft text-rose',
  },
];

const FAMILY_FEATURES = [
  {
    icon: Users,
    title: 'Eyang juga bisa ikut lihat',
    body: 'Undang Ayah, Bunda, atau Eyang yang tinggal di luar kota. Semua bisa lihat perkembangan dan foto kegiatan anak.',
  },
  {
    icon: Mic,
    title: 'Ada suara Bunda di dalam game',
    body: 'Rekam kalimat penyemangat pakai suara sendiri. Nanti Mora putar waktu anak lagi main.',
  },
  {
    icon: Heart,
    title: 'Bintang bisa ditukar hadiah',
    body: 'Hadiahnya Ayah Bunda yang tentukan. Misalnya main ke taman atau es krim di akhir pekan.',
  },
];

const PLANS = [
  {
    name: 'Gratis',
    price: 'Rp 0',
    period: 'selamanya',
    note: 'Buat kenalan dulu sama Mora.',
    items: ['Coba main 3 kali', '1 profil anak', 'Worksheet gratis'],
    cta: 'Mulai Gratis',
    highlight: false,
  },
  {
    name: 'Plus',
    price: 'Rp 49.000',
    period: '/bulan',
    note: 'Paling banyak dipilih.',
    items: ['Semua game, termasuk Math Lab', 'Maksimal 3 profil anak', 'Kartu misi dan album momen', 'Tanpa iklan'],
    cta: 'Coba Plus',
    highlight: true,
  },
  {
    name: 'Keluarga',
    price: 'Rp 79.000',
    period: '/bulan',
    note: 'Buat yang anaknya lebih dari tiga.',
    items: ['Semua yang ada di Plus', 'Maksimal 5 profil anak', 'Rekam suara orang tua', 'Undang lebih banyak anggota keluarga'],
    cta: 'Pilih Keluarga',
    highlight: false,
  },
];

const FAQS = [
  {
    q: 'Mora cocok buat umur berapa?',
    a: 'Buat anak 3–8 tahun, dari PAUD/TK sampai kelas 1–2 SD. Tiap permainan ada keterangan umurnya, jadi gampang milihnya.',
  },
  {
    q: 'Nanti anaknya malah makin lama main HP, dong?',
    a: 'Satu sesi cuma 15 menit. Setelah itu banyak kegiatan yang lanjut tanpa layar, misalnya worksheet yang di-print atau kartu misi yang dimainkan bareng di rumah.',
  },
  {
    q: 'Aman nggak buat anak? Ada iklannya?',
    a: 'Nggak ada iklan dan nggak ada fitur chat. Pengaturan dan laporan perkembangan anak cuma bisa dibuka dari bagian orang tua.',
  },
  {
    q: 'Ada materi ngajinya?',
    a: 'Ada. Anak bisa belajar huruf hijaiyah dan harakat, surat-surat pendek, dan bahasa Arab dasar lewat permainan.',
  },
  {
    q: 'Bisa dibuka di HP?',
    a: 'Bisa. Mora langsung jalan di browser HP, tablet, atau laptop. Nggak perlu download aplikasi.',
  },
  {
    q: 'Kalau mau berhenti langganan, gimana?',
    a: 'Paket Gratis bisa dipakai terus tanpa batas waktu. Paket berbayar bisa dihentikan kapan aja.',
  },
];

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-hand text-xl font-bold text-primary sm:text-2xl">{children}</p>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onBrowseRealm }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  // Phones: once the hero CTA scrolls away, keep a slim "Coba Gratis" bar at the bottom.
  const [showStickyCta, setShowStickyCta] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowStickyCta(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const start = () => {
    sound.playPop();
    onStart();
  };

  return (
    <div className="animate-in fade-in duration-200">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-10 overflow-hidden px-5 pb-16 pt-6 sm:pt-8 lg:min-h-[640px] lg:grid-cols-[1fr_1fr] lg:px-8">
        <div className="relative z-10 max-w-2xl">
          <Eyebrow>Main bareng, belajar bareng ♡</Eyebrow>

          <h1 className="mt-3 font-display text-4xl font-black leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Main HP boleh, <span className="text-primary">asal ada belajarnya.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Mora berisi game edukasi, worksheet, dan kegiatan seru buat anak umur 3–8 tahun. Ada calistung, huruf
            hijaiyah, sampai matematika ala Singapura. Sehari 15 menit juga udah cukup.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <MoraButton size="lg" variant="joyful" onClick={start}>
              <span>Coba Gratis</span>
              <ArrowRight className="size-4" />
            </MoraButton>
            <MoraButton size="lg" variant="outline" onClick={() => scrollTo('how-it-works')}>
              Lihat cara pakainya
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
              <p className="text-xs text-ink-soft">Belajar huruf Alif, Ba, Ta</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Empathy / problem ─────────────────────────────── */}
      <section className="border-y border-border/60 bg-card py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <MoraSectionHeader eyebrow="Pasti pernah ngalamin" centered>
            Anak susah lepas dari HP? Wajar, kok.
            <br className="hidden sm:block" /> Yang bisa kita atur itu isinya.
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
            <MoraSectionHeader eyebrow="Cara pakainya">Tiga langkah, nggak ribet.</MoraSectionHeader>
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
            eyebrow="Isinya apa aja?"
            centered
            subtitle="Ada lebih dari 20 permainan, dikelompokkan sesuai umur anak."
          >
            Bekal masuk SD, dikemas jadi permainan.
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
                  Lihat isinya <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Families ──────────────────────────────────────── */}
      <section id="for-families" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16 lg:px-8 lg:py-24">
        <MoraSectionHeader eyebrow="Buat satu keluarga">
          Satu rumah bisa ikut <span className="text-primary">lihat perkembangannya.</span>
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
            Tanpa iklan dan tanpa fitur chat. Semua pengaturan ada di tangan orang tua.
          </p>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────── */}
      <section id="pricing" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16 lg:px-8 lg:py-24">
        <MoraSectionHeader eyebrow="Harga" centered subtitle="Coba gratis dulu. Kalau anaknya suka, baru upgrade.">
          Lebih murah dari sekali les privat.
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
          <MoraSectionHeader eyebrow="FAQ" centered>
            Yang sering ditanyain Ayah Bunda
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
            <Eyebrow>Mulai dari hari ini</Eyebrow>
            <h2 className="mx-auto mt-2 max-w-2xl font-display text-3xl font-black leading-tight text-foreground sm:text-5xl">
              Coba 15 menit hari ini, lihat sendiri reaksi anaknya.
            </h2>
            <MoraButton size="lg" variant="joyful" className="mt-8" onClick={start}>
              <span>Coba Gratis</span>
              <ArrowRight className="size-4" />
            </MoraButton>
            <p className="mt-3 text-sm text-ink-soft">Gratis, tanpa kartu kredit. Bisa langsung dipakai di HP.</p>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      {/* ── Sticky CTA (phones only) ──────────────────────── */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-200 motion-reduce:transition-none sm:hidden ${
          showStickyCta ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!showStickyCta}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-foreground">Coba Mora gratis</p>
            <p className="truncate text-xs text-ink-soft">Untuk anak 3–8 tahun</p>
          </div>
          <MoraButton variant="joyful" onClick={start} tabIndex={showStickyCta ? 0 : -1}>
            Mulai
            <ArrowRight className="size-4" />
          </MoraButton>
        </div>
      </div>

      <footer className="border-t border-border/60 pb-20 sm:pb-0">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            <span className="font-display text-base font-black text-foreground">mora</span> · Teman main dan belajar
            anak.
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
            {[
              ['Cara pakai', 'how-it-works'],
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
