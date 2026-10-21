// Data for the "Jelajah Dunia" discovery engine. The engine (DiscoveryGame) is
// topic-agnostic: adding a new topic = adding an object here, no new game code.
// Content is general knowledge (not curriculum-aligned) on purpose.

export type FlagCode = 'ID' | 'JP' | 'FR' | 'IT' | 'DE' | 'NL' | 'PL' | 'TH';

export type DiscoveryArt =
  | { type: 'emoji'; value: string }
  // Flags are drawn as inline SVG (see FlagArt) — flag emoji don't render on
  // Windows browsers, which would show two letters instead of a flag.
  | { type: 'flag'; code: FlagCode };

export interface DiscoveryItem {
  id: string;
  name: string;
  art: DiscoveryArt;
  fact: string;
}

export interface DiscoveryTopic {
  id: string;
  title: string;
  emoji: string;
  blurb: string;
  items: DiscoveryItem[];
}

export const DISCOVERY_TOPICS: DiscoveryTopic[] = [
  {
    id: 'flags',
    title: 'Bendera Dunia',
    emoji: '🚩',
    blurb: 'Kenali bendera dari berbagai negara',
    items: [
      { id: 'flag-id', name: 'Indonesia', art: { type: 'flag', code: 'ID' }, fact: 'Bendera Merah Putih. Merah di atas, putih di bawah.' },
      { id: 'flag-jp', name: 'Jepang', art: { type: 'flag', code: 'JP' }, fact: 'Lingkaran merah di tengah melambangkan matahari.' },
      { id: 'flag-fr', name: 'Prancis', art: { type: 'flag', code: 'FR' }, fact: 'Tiga warna: biru, putih, merah. Menara Eiffel ada di Prancis!' },
      { id: 'flag-it', name: 'Italia', art: { type: 'flag', code: 'IT' }, fact: 'Hijau, putih, merah. Italia terkenal dengan pizza dan pasta.' },
      { id: 'flag-de', name: 'Jerman', art: { type: 'flag', code: 'DE' }, fact: 'Hitam, merah, dan emas tersusun dari atas ke bawah.' },
      { id: 'flag-nl', name: 'Belanda', art: { type: 'flag', code: 'NL' }, fact: 'Merah, putih, biru. Belanda terkenal dengan kincir angin dan bunga tulip.' },
      { id: 'flag-pl', name: 'Polandia', art: { type: 'flag', code: 'PL' }, fact: 'Putih di atas, merah di bawah. Mirip Indonesia, tapi terbalik!' },
      { id: 'flag-th', name: 'Thailand', art: { type: 'flag', code: 'TH' }, fact: 'Ada lima garis. Garis biru di tengah paling tebal.' },
    ],
  },
  {
    id: 'dino',
    title: 'Dunia Dinosaurus',
    emoji: '🦖',
    blurb: 'Kenalan sama dinosaurus dan kerabatnya',
    items: [
      { id: 'dino-trex', name: 'T-Rex', art: { type: 'emoji', value: '🦖' }, fact: 'Tyrannosaurus rex punya gigi besar dan tajam. Ia pemakan daging.' },
      { id: 'dino-brachio', name: 'Brachiosaurus', art: { type: 'emoji', value: '🦕' }, fact: 'Lehernya panjang sekali untuk menjangkau daun di pucuk pohon. Ia pemakan tumbuhan.' },
      { id: 'dino-egg', name: 'Telur', art: { type: 'emoji', value: '🥚' }, fact: 'Dinosaurus bertelur, seperti burung dan buaya.' },
      { id: 'dino-fossil', name: 'Fosil', art: { type: 'emoji', value: '🦴' }, fact: 'Fosil adalah sisa tulang makhluk purba yang membatu. Dari fosil kita tahu bentuk dinosaurus.' },
      { id: 'dino-bird', name: 'Burung', art: { type: 'emoji', value: '🐦' }, fact: 'Burung adalah keturunan dinosaurus yang masih hidup sampai sekarang!' },
      { id: 'dino-croc', name: 'Buaya', art: { type: 'emoji', value: '🐊' }, fact: 'Buaya sudah ada sejak zaman dinosaurus dan bentuknya masih mirip.' },
    ],
  },
  {
    id: 'body',
    title: 'Tubuhku',
    emoji: '🫀',
    blurb: 'Kenali bagian-bagian tubuhmu',
    items: [
      { id: 'body-brain', name: 'Otak', art: { type: 'emoji', value: '🧠' }, fact: 'Otak adalah pusat kendali tubuh. Ia membantu kamu berpikir dan mengingat.' },
      { id: 'body-heart', name: 'Jantung', art: { type: 'emoji', value: '🫀' }, fact: 'Jantung memompa darah ke seluruh tubuh. Dengarkan: dug-dug-dug!' },
      { id: 'body-lungs', name: 'Paru-paru', art: { type: 'emoji', value: '🫁' }, fact: 'Paru-paru dipakai untuk bernapas. Jumlahnya dua, kiri dan kanan.' },
      { id: 'body-bone', name: 'Tulang', art: { type: 'emoji', value: '🦴' }, fact: 'Tulang menopang tubuh supaya kamu bisa berdiri tegak.' },
      { id: 'body-eye', name: 'Mata', art: { type: 'emoji', value: '👁️' }, fact: 'Mata dipakai untuk melihat warna dan bentuk.' },
      { id: 'body-ear', name: 'Telinga', art: { type: 'emoji', value: '👂' }, fact: 'Telinga dipakai untuk mendengar suara.' },
      { id: 'body-nose', name: 'Hidung', art: { type: 'emoji', value: '👃' }, fact: 'Hidung dipakai untuk mencium bau dan bernapas.' },
      { id: 'body-tooth', name: 'Gigi', art: { type: 'emoji', value: '🦷' }, fact: 'Gigi dipakai untuk mengunyah makanan. Jangan lupa sikat gigi!' },
      { id: 'body-tongue', name: 'Lidah', art: { type: 'emoji', value: '👅' }, fact: 'Lidah merasakan manis, asam, asin, dan pahit.' },
    ],
  },
];
