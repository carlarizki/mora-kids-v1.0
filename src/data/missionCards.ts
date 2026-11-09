/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// "Balanced Play" — offline Mission Cards. Zero-inventory activities using
// things already at home, meant to sit alongside the digital games and
// worksheets as the third product pillar on the "Play with Mora" page.
// See the Mora project doc "Balanced Play (Screen-Time Balancer + Offline
// Mission Cards)" for the full concept behind these.

export type MissionCategory = 'indoor' | 'outdoor' | 'combo';

export interface MissionCardItem {
  id: string;
  title: string;
  category: MissionCategory;
  materials: string[];
  steps: string[];
  durationMinutes: number;
  starsReward: number;
  emoji: string;
}

export const MISSION_CATEGORY_LABEL: Record<MissionCategory, { id: string; en: string }> = {
  indoor: { id: 'Indoor', en: 'Indoor' },
  outdoor: { id: 'Jelajah Luar', en: 'Outdoor Explore' },
  combo: { id: 'Luar + Kerajinan', en: 'Outdoor + Craft' },
};

export const MISSION_CARDS_CATALOG: MissionCardItem[] = [
  // Indoor craft
  {
    id: 'robot-kardus-mini',
    title: 'Robot Kardus Mini',
    category: 'indoor',
    materials: ['Kardus bekas', 'Gunting', 'Lem', 'Krayon'],
    steps: [
      'Gunting kardus jadi badan dan kepala robot.',
      'Tempel badan dan kepala pakai lem.',
      'Hias robotnya pakai krayon — kasih mata, tombol, apa aja!',
    ],
    durationMinutes: 20,
    starsReward: 15,
    emoji: '🤖',
  },
  {
    id: 'playdough-tepung',
    title: 'Playdough Tepung',
    category: 'indoor',
    materials: ['Tepung', 'Air', 'Sedikit garam', 'Pewarna makanan (opsional)'],
    steps: [
      'Campur tepung, air, dan garam sampai jadi adonan.',
      'Uleni sampai kalis, tambah pewarna kalau ada.',
      'Bentuk jadi apa aja — hewan, buah, atau bentuk favoritmu.',
    ],
    durationMinutes: 15,
    starsReward: 10,
    emoji: '🎨',
  },
  {
    id: 'kolase-bentuk',
    title: 'Kolase Bentuk',
    category: 'indoor',
    materials: ['Kertas/majalah bekas', 'Gunting', 'Lem'],
    steps: [
      'Gunting bentuk-bentuk sederhana dari kertas bekas.',
      'Susun bentuk-bentuknya di kertas kosong.',
      'Tempel jadi gambar baru — rumah, hewan, atau apa aja.',
    ],
    durationMinutes: 15,
    starsReward: 10,
    emoji: '✂️',
  },
  {
    id: 'rumah-kardus-mini',
    title: 'Rumah Kardus Mini',
    category: 'indoor',
    materials: ['Kardus sepatu/kotak bekas', 'Gunting', 'Krayon'],
    steps: [
      'Gunting jendela dan pintu di kardus.',
      'Hias dindingnya pakai krayon.',
      'Jadikan rumah-rumahan buat boneka atau mainan kecil.',
    ],
    durationMinutes: 20,
    starsReward: 15,
    emoji: '🏠',
  },
  // Outdoor explore
  {
    id: 'cari-5-daun',
    title: 'Cari 5 Daun Beda Bentuk',
    category: 'outdoor',
    materials: ['Tidak perlu bahan — jalan-jalan di sekitar rumah'],
    steps: [
      'Ajak jalan-jalan sebentar di sekitar rumah.',
      'Kumpulkan 5 daun yang bentuknya berbeda-beda.',
      'Urutkan daunnya dari yang terkecil ke terbesar.',
    ],
    durationMinutes: 10,
    starsReward: 10,
    emoji: '🍃',
  },
  {
    id: 'berburu-warna-pelangi',
    title: 'Berburu Warna Pelangi',
    category: 'outdoor',
    materials: ['Tidak perlu bahan — mata jeli aja'],
    steps: [
      'Sebutkan urutan warna pelangi.',
      'Cari 1 benda di sekitar rumah/taman untuk tiap warna.',
      'Foto atau susun semua benda itu berjajar.',
    ],
    durationMinutes: 15,
    starsReward: 15,
    emoji: '🌈',
  },
  {
    id: 'jejak-kecil',
    title: 'Jejak Kecil',
    category: 'outdoor',
    materials: ['Tidak perlu bahan — cukup amati sekitar'],
    steps: [
      'Cari semut atau serangga kecil di sekitar rumah.',
      'Amati diam-diam selama 5 menit.',
      'Ceritakan atau gambar apa yang kamu lihat.',
    ],
    durationMinutes: 10,
    starsReward: 10,
    emoji: '🐜',
  },
  // Outdoor + craft
  {
    id: 'lukisan-daun',
    title: 'Lukisan Daun',
    category: 'combo',
    materials: ['5 daun', 'Kertas', 'Krayon'],
    steps: [
      'Cari 5 daun yang bentuknya beda-beda di luar.',
      'Taruh daun di bawah kertas.',
      'Gosok krayon di atasnya sampai motif daunnya muncul.',
    ],
    durationMinutes: 15,
    starsReward: 15,
    emoji: '🍂',
  },
  {
    id: 'mahkota-alam',
    title: 'Mahkota Alam',
    category: 'combo',
    materials: ['Ranting/daun/bunga kecil', 'Kertas atau karton', 'Lem'],
    steps: [
      'Kumpulkan ranting, daun, atau bunga kecil di sekitar rumah.',
      'Bentuk kertas/karton jadi lingkaran mahkota.',
      'Tempel bahan-bahan alamnya di mahkota.',
    ],
    durationMinutes: 20,
    starsReward: 15,
    emoji: '👑',
  },
  {
    id: 'batu-cerita',
    title: 'Batu Cerita',
    category: 'combo',
    materials: ['3-5 batu kecil', 'Krayon atau spidol'],
    steps: [
      'Cari 3-5 batu kecil di sekitar rumah.',
      'Gambar wajah atau ekspresi di tiap batu.',
      'Pakai batu-batu itu buat main cerita bareng.',
    ],
    durationMinutes: 15,
    starsReward: 10,
    emoji: '🪨',
  },
];
