/* =====================================================================
 * core.js — dipakai bersama oleh index.html (game) dan admin.html (panel).
 *
 * Sengaja classic script, bukan ES module: dengan begitu kedua halaman tetap
 * bisa dibuka langsung lewat double-click (file://) seperti game Matematika,
 * IPS, dan Inggris — ES module diblokir CORS di protokol file://.
 * ===================================================================== */

/* ---------------------------------------------------------------------
 * 1. KONFIGURASI BAWAAN
 *
 * Seluruh tampilan DAN seluruh isi permainan ada di sini. Tidak ada teks,
 * warna, atau soal yang ditulis langsung di dalam index.html — itulah yang
 * membuat game ini bisa di-whitelabel sepenuhnya dari panel admin.
 * ------------------------------------------------------------------- */

var DEFAULT_CONFIG = {
  version: 1,

  brand: {
    appName: "Petualangan\nSains Seru",
    tagline: "Game IPA untuk Ilmuwan Kecil 🔬",
    mascotName: "Nova",
    logoUrl: "",
    faviconEmoji: "🔬",
    footnote: "Kumpulkan bintang sebanyak-banyaknya! ⭐",
    colors: {
      teal: "#2BB3AB",
      sun: "#F5A623",
      coral: "#FF6F61",
      leaf: "#5FB56A",
      grape: "#9B6FD6",
      sky: "#3FA7E0",
      pink: "#FF8FB1",
    },
    ink: "#3A3A3A",
    paper: "#FFFDF7",
    bgFrom: "#BDE7FA",
    bgMid: "#DFF4E6",
    bgTo: "#FFF3D6",
    doodles: ["⭐", "🍃", "☁️", "🐾", "💧", "🔬", "🦋", "🌟", "🌈", "🌱"],
    homeMessages: [
      "Pilih permainan, yuk!",
      "Ayo jadi ilmuwan kecil!",
      "Mau main yang mana hari ini?",
      "Kumpulkan bintang sebanyak-banyaknya!",
      "Sains itu seru, lho!",
    ],
    goodMessages: [
      "Hebat! 🎉",
      "Benar sekali! 🌟",
      "Keren! 👏",
      "Pintar! 💫",
      "Tepat! ✨",
      "Mantap! 🚀",
    ],
    soundOn: true,

    /* Tingkat kesulitan. Yang berubah adalah BANYAKNYA soal/item per ronde —
       bukan isinya — supaya satu bank soal bisa melayani ketiga level. */
    levels: [
      { id: "mudah",  name: "Pemula",    desc: "Ronde pendek, cocok untuk mulai" },
      { id: "sedang", name: "Menengah",  desc: "Ronde standar" },
      { id: "sulit",  name: "Jagoan",    desc: "Semua soal keluar, ronde penuh" },
    ],

    /* Album stiker — hadiah yang membuat bintang PUNYA tujuan. Tiap kelipatan
       starsPerSticker bintang membuka satu stiker berikutnya, berurutan, jadi
       anak selalu bisa melihat "tinggal berapa bintang lagi".

       Sengaja disusun dari yang paling akrab ke yang paling "wah", supaya
       koleksi di akhir terasa layak dikejar. */
    starsPerSticker: 10,
    stickers: [
      { e: "🌱", n: "Tunas Pertama" },
      { e: "💧", n: "Setetes Air" },
      { e: "🍃", n: "Daun Hijau" },
      { e: "🐛", n: "Ulat Kecil" },
      { e: "🦋", n: "Kupu-kupu" },
      { e: "🐝", n: "Lebah Pekerja" },
      { e: "🐜", n: "Semut Rajin" },
      { e: "🕷️", n: "Laba-laba" },
      { e: "🐌", n: "Siput" },
      { e: "🐢", n: "Kura-kura" },
      { e: "🐠", n: "Ikan Warna" },
      { e: "🐙", n: "Gurita" },
      { e: "🦀", n: "Kepiting" },
      { e: "🐬", n: "Lumba-lumba" },
      { e: "🐋", n: "Paus Biru" },
      { e: "🦈", n: "Hiu" },
      { e: "🦎", n: "Komodo" },
      { e: "🐍", n: "Ular" },
      { e: "🦅", n: "Elang" },
      { e: "🦉", n: "Burung Hantu" },
      { e: "🦇", n: "Kelelawar" },
      { e: "🐘", n: "Gajah" },
      { e: "🦏", n: "Badak" },
      { e: "🐅", n: "Harimau" },
      { e: "🦧", n: "Orangutan" },
      { e: "🌺", n: "Rafflesia" },
      { e: "🌵", n: "Kaktus" },
      { e: "🌳", n: "Pohon Besar" },
      { e: "🍄", n: "Jamur" },
      { e: "🌋", n: "Gunung Api" },
      { e: "🪨", n: "Batu Purba" },
      { e: "🦴", n: "Fosil" },
      { e: "🦕", n: "Dinosaurus" },
      { e: "❄️", n: "Kristal Es" },
      { e: "🌈", n: "Pelangi" },
      { e: "⚡", n: "Petir" },
      { e: "🧲", n: "Magnet" },
      { e: "🔭", n: "Teleskop" },
      { e: "🔬", n: "Mikroskop" },
      { e: "🧪", n: "Tabung Reaksi" },
      { e: "⚗️", n: "Alat Suling" },
      { e: "🧬", n: "DNA" },
      { e: "🌍", n: "Bumi" },
      { e: "🌕", n: "Bulan Purnama" },
      { e: "🪐", n: "Planet Bercincin" },
      { e: "☄️", n: "Komet" },
      { e: "🌟", n: "Bintang Terang" },
      { e: "🚀", n: "Roket" },
      { e: "🛰️", n: "Satelit" },
      { e: "👩‍🚀", n: "Astronaut" },
    ],

    /* Peta petualangan mengunci pos berikutnya sampai pos sebelumnya dimainkan.
       Matikan kalau anak harus bebas memilih permainan mana pun. */
    mapLock: true,

    /* Gerbang panel admin. Lihat catatan keamanan di README —
       ini penghalang, bukan keamanan sungguhan. */
    adminPassword: "admin123",
  },

  modules: [
    {
      "id": "quiz",
      "kind": "quiz",
      "category": "Campuran",
      "ico": "🧠",
      "name": "Kuis Sains",
      "desc": "Jawab pertanyaan seru",
      "color": "teal",
      "enabled": true,
      "perRound": 10,
      "questions": [
        {
          "e": "🔬",
          "q": "Apa kepanjangan dari IPA?",
          "o": [
            "Ilmu Pengetahuan Alam",
            "Ikan Punya Air",
            "Ilmu Pandai Anak"
          ],
          "a": 0,
          "w": "IPA mempelajari segala hal di alam — dari semut kecil sampai bintang di langit."
        },
        {
          "e": "👃",
          "q": "Indra untuk mencium bau adalah…",
          "o": [
            "Hidung",
            "Mata",
            "Lidah"
          ],
          "a": 0,
          "w": "Hidungmu bisa membedakan lebih dari 1.000 bau yang berbeda!"
        },
        {
          "e": "❤️",
          "q": "Organ yang memompa darah adalah…",
          "o": [
            "Jantung",
            "Paru-paru",
            "Lambung"
          ],
          "a": 0,
          "w": "Jantungmu berdetak sekitar 100.000 kali setiap hari, bahkan saat kamu tidur."
        },
        {
          "e": "🧼",
          "q": "Sebelum makan kita mencuci tangan pakai…",
          "o": [
            "Sabun",
            "Pasir",
            "Minyak"
          ],
          "a": 0,
          "w": "Sabun membuat kuman terlepas dari kulit lalu ikut hanyut bersama air."
        },
        {
          "e": "🐟",
          "q": "Ikan bernapas menggunakan…",
          "o": [
            "Insang",
            "Paru-paru",
            "Hidung"
          ],
          "a": 0,
          "w": "Insang mengambil oksigen yang terlarut di dalam air — jadi ikan tetap bernapas tanpa naik ke permukaan."
        },
        {
          "e": "🌱",
          "q": "Bagian tumbuhan yang menyerap air adalah…",
          "o": [
            "Akar",
            "Daun",
            "Bunga"
          ],
          "a": 0,
          "w": "Akar menyerap air dari tanah, lalu air itu naik ke daun lewat batang."
        },
        {
          "e": "🐛",
          "q": "Sebelum jadi kupu-kupu, ulat menjadi…",
          "o": [
            "Kepompong",
            "Telur",
            "Kecebong"
          ],
          "a": 0,
          "w": "Di dalam kepompong, tubuh ulat benar-benar dirombak menjadi kupu-kupu."
        },
        {
          "e": "🌾",
          "q": "Dalam rantai makanan, tumbuhan berperan sebagai…",
          "o": [
            "Produsen",
            "Pengurai",
            "Konsumen"
          ],
          "a": 0,
          "w": "Tumbuhan disebut produsen karena ia membuat makanannya sendiri dari cahaya matahari."
        },
        {
          "e": "🧊",
          "q": "Air yang membeku berubah menjadi…",
          "o": [
            "Es",
            "Uap",
            "Embun"
          ],
          "a": 0,
          "w": "Uniknya, es lebih ringan daripada air — itulah sebabnya es batu mengapung."
        },
        {
          "e": "🍎",
          "q": "Buah jatuh ke bawah karena gaya…",
          "o": [
            "Gravitasi",
            "Gesek",
            "Magnet"
          ],
          "a": 0,
          "w": "Gravitasi jugalah yang menahan kita tetap menapak di bumi."
        },
        {
          "e": "☀️",
          "q": "Sumber energi terbesar di bumi adalah…",
          "o": [
            "Matahari",
            "Lampu",
            "Api"
          ],
          "a": 0,
          "w": "Hampir semua energi di bumi berasal dari matahari, termasuk energi di dalam makananmu."
        },
        {
          "e": "🔔",
          "q": "Semua bunyi berasal dari benda yang…",
          "o": [
            "Bergetar",
            "Diam",
            "Panas"
          ],
          "a": 0,
          "w": "Coba pegang tenggorokanmu sambil bersuara — kamu akan merasakan getarannya."
        },
        {
          "e": "🌙",
          "q": "Bulan terlihat bersinar karena…",
          "o": [
            "Memantulkan cahaya matahari",
            "Punya api",
            "Bercahaya sendiri"
          ],
          "a": 0,
          "w": "Bulan tidak punya cahaya sendiri; ia hanya memantulkan cahaya matahari."
        },
        {
          "e": "🌡️",
          "q": "Alat untuk mengukur suhu adalah…",
          "o": [
            "Termometer",
            "Timbangan",
            "Penggaris"
          ],
          "a": 0,
          "w": "Termometer badan dipakai untuk mengetahui apakah seseorang sedang demam."
        },
        {
          "e": "🧲",
          "q": "Magnet dapat menarik benda dari…",
          "o": [
            "Besi",
            "Plastik",
            "Kayu"
          ],
          "a": 0,
          "w": "Magnet menarik besi, tetapi tidak menarik plastik, kayu, atau kertas."
        },
        {
          "e": "💧",
          "q": "Air laut yang terkena panas akan…",
          "o": [
            "Menguap",
            "Membeku",
            "Menyublim"
          ],
          "a": 0,
          "w": "Air yang menguap naik jadi awan, lalu turun lagi sebagai hujan. Itulah daur air."
        },
        {
          "e": "🌍",
          "q": "Perputaran bumi pada porosnya menyebabkan…",
          "o": [
            "Siang dan malam",
            "Musim",
            "Gempa"
          ],
          "a": 0,
          "w": "Bumi berputar sekali sehari — bagian yang menghadap matahari mengalami siang."
        },
        {
          "e": "♻️",
          "q": "Kata 'Reduce' dalam 3R artinya…",
          "o": [
            "Mengurangi",
            "Membakar",
            "Membuang"
          ],
          "a": 0,
          "w": "3R = Reduce (mengurangi), Reuse (memakai ulang), Recycle (mendaur ulang)."
        },
        {
          "e": "🦎",
          "q": "Kadal raksasa khas Indonesia adalah…",
          "o": [
            "Komodo",
            "Buaya",
            "Iguana"
          ],
          "a": 0,
          "w": "Komodo hanya hidup liar di Indonesia, dan panjangnya bisa mencapai 3 meter."
        },
        {
          "e": "🌺",
          "q": "Bunga terbesar dari Sumatra adalah…",
          "o": [
            "Rafflesia",
            "Mawar",
            "Melati"
          ],
          "a": 0,
          "w": "Bunga Rafflesia bisa selebar 1 meter, dan baunya seperti bangkai untuk memanggil lalat."
        },
        {
          "e": "🌵",
          "q": "Daun kaktus menjadi duri agar…",
          "o": [
            "Tidak banyak menguapkan air",
            "Lebih tajam",
            "Terlihat keren"
          ],
          "a": 0,
          "w": "Daun yang lebar menguapkan banyak air — di gurun, air terlalu berharga untuk disia-siakan."
        },
        {
          "e": "🐄",
          "q": "Hewan yang menyusui anaknya disebut…",
          "o": [
            "Mamalia",
            "Reptil",
            "Amfibi"
          ],
          "a": 0,
          "w": "Manusia juga termasuk mamalia, lho!"
        },
        {
          "e": "🍃",
          "q": "Tumbuhan membuat makanan lewat proses…",
          "o": [
            "Fotosintesis",
            "Penguapan",
            "Pembusukan"
          ],
          "a": 0,
          "w": "Fotosintesis memerlukan cahaya matahari, air, dan karbon dioksida."
        },
        {
          "e": "🌈",
          "q": "Pelangi muncul setelah…",
          "o": [
            "Hujan",
            "Gempa",
            "Angin"
          ],
          "a": 0,
          "w": "Titik-titik air hujan membelokkan cahaya matahari menjadi tujuh warna."
        },
        {
          "e": "🦟",
          "q": "Penyakit demam berdarah disebarkan oleh…",
          "o": [
            "Nyamuk",
            "Lalat",
            "Semut"
          ],
          "a": 0,
          "w": "Nyamuk demam berdarah bertelur di air bersih yang tergenang — jadi rajinlah menguras bak mandi."
        },
        {
          "e": "🫁",
          "q": "Kita menghirup udara yang mengandung…",
          "o": [
            "Oksigen",
            "Asap",
            "Debu"
          ],
          "a": 0,
          "w": "Kita menghirup oksigen dan mengembuskan karbon dioksida."
        },
        {
          "e": "🌳",
          "q": "Tumbuhan hijau menghasilkan gas…",
          "o": [
            "Oksigen",
            "Asap",
            "Karbon"
          ],
          "a": 0,
          "w": "Tumbuhan menghasilkan oksigen yang kita hirup — itulah sebabnya menanam pohon itu penting."
        },
        {
          "e": "🐝",
          "q": "Lebah membantu bunga melakukan…",
          "o": [
            "Penyerbukan",
            "Pembakaran",
            "Pembekuan"
          ],
          "a": 0,
          "w": "Tanpa lebah, banyak buah dan sayur tidak akan pernah terbentuk."
        },
        {
          "e": "🦇",
          "q": "Kelelawar mencari makan pada waktu…",
          "o": [
            "Malam",
            "Siang",
            "Pagi"
          ],
          "a": 0,
          "w": "Kelelawar 'melihat' dalam gelap dengan mendengarkan pantulan suaranya sendiri."
        },
        {
          "e": "🥚",
          "q": "Hewan yang berkembang biak dengan bertelur disebut…",
          "o": [
            "Ovipar",
            "Vivipar",
            "Ovovivipar"
          ],
          "a": 0,
          "w": "Ovipar = bertelur. Vivipar = melahirkan, seperti kucing dan sapi."
        }
      ]
    },
    {
      "id": "hewan",
      "kind": "sort",
      "category": "Makhluk Hidup",
      "ico": "🐾",
      "name": "Rumah Hewan",
      "desc": "Darat, air, atau udara?",
      "color": "coral",
      "enabled": true,
      "hint": "Hewan ini tinggal di mana?",
      "bins": [
        {
          "k": "darat",
          "l": "Darat",
          "e": "🌳",
          "color": "leaf"
        },
        {
          "k": "air",
          "l": "Air",
          "e": "🌊",
          "color": "sky"
        },
        {
          "k": "udara",
          "l": "Udara",
          "e": "☁️",
          "color": "grape"
        }
      ],
      "items": [
        {
          "e": "🐱",
          "n": "Kucing",
          "k": "darat"
        },
        {
          "e": "🐟",
          "n": "Ikan",
          "k": "air"
        },
        {
          "e": "🐦",
          "n": "Burung",
          "k": "udara"
        },
        {
          "e": "🐄",
          "n": "Sapi",
          "k": "darat"
        },
        {
          "e": "🐙",
          "n": "Gurita",
          "k": "air"
        },
        {
          "e": "🦋",
          "n": "Kupu-kupu",
          "k": "udara"
        },
        {
          "e": "🐰",
          "n": "Kelinci",
          "k": "darat"
        },
        {
          "e": "🐬",
          "n": "Lumba-lumba",
          "k": "air"
        },
        {
          "e": "🐝",
          "n": "Lebah",
          "k": "udara"
        },
        {
          "e": "🐘",
          "n": "Gajah",
          "k": "darat"
        },
        {
          "e": "🦈",
          "n": "Hiu",
          "k": "air"
        },
        {
          "e": "🦅",
          "n": "Elang",
          "k": "udara"
        },
        {
          "e": "🐅",
          "n": "Harimau",
          "k": "darat"
        },
        {
          "e": "🦐",
          "n": "Udang",
          "k": "air"
        },
        {
          "e": "🦉",
          "n": "Burung hantu",
          "k": "udara"
        },
        {
          "e": "🐎",
          "n": "Kuda",
          "k": "darat"
        },
        {
          "e": "🐳",
          "n": "Paus",
          "k": "air"
        },
        {
          "e": "🦜",
          "n": "Beo",
          "k": "udara"
        },
        {
          "e": "🐐",
          "n": "Kambing",
          "k": "darat"
        },
        {
          "e": "🦀",
          "n": "Kepiting",
          "k": "air"
        },
        {
          "e": "🦟",
          "n": "Nyamuk",
          "k": "udara"
        },
        {
          "e": "🦒",
          "n": "Jerapah",
          "k": "darat"
        },
        {
          "e": "🐠",
          "n": "Ikan hias",
          "k": "air"
        },
        {
          "e": "🦆",
          "n": "Bebek",
          "k": "udara"
        },
        {
          "e": "🐕",
          "n": "Anjing",
          "k": "darat"
        },
        {
          "e": "🐡",
          "n": "Ikan buntal",
          "k": "air"
        },
        {
          "e": "🕊️",
          "n": "Merpati",
          "k": "udara"
        },
        {
          "e": "🦁",
          "n": "Singa",
          "k": "darat"
        },
        {
          "e": "🐢",
          "n": "Penyu",
          "k": "air"
        },
        {
          "e": "🦇",
          "n": "Kelelawar",
          "k": "udara"
        }
      ]
    },
    {
      "id": "benda",
      "kind": "sort",
      "category": "Benda & Energi",
      "ico": "🧊",
      "name": "Wujud Benda",
      "desc": "Padat, cair, atau gas?",
      "color": "sky",
      "enabled": true,
      "hint": "Benda ini termasuk wujud apa?",
      "bins": [
        {
          "k": "padat",
          "l": "Padat",
          "e": "🧱",
          "color": "coral"
        },
        {
          "k": "cair",
          "l": "Cair",
          "e": "💧",
          "color": "sky"
        },
        {
          "k": "gas",
          "l": "Gas",
          "e": "💨",
          "color": "grape"
        }
      ],
      "items": [
        {
          "e": "🪨",
          "n": "Batu",
          "k": "padat"
        },
        {
          "e": "💧",
          "n": "Air",
          "k": "cair"
        },
        {
          "e": "💨",
          "n": "Asap",
          "k": "gas"
        },
        {
          "e": "📕",
          "n": "Buku",
          "k": "padat"
        },
        {
          "e": "🥛",
          "n": "Susu",
          "k": "cair"
        },
        {
          "e": "🎈",
          "n": "Udara balon",
          "k": "gas"
        },
        {
          "e": "🥄",
          "n": "Sendok",
          "k": "padat"
        },
        {
          "e": "🍯",
          "n": "Madu",
          "k": "cair"
        },
        {
          "e": "♨️",
          "n": "Uap",
          "k": "gas"
        },
        {
          "e": "🪑",
          "n": "Kursi",
          "k": "padat"
        },
        {
          "e": "🧃",
          "n": "Jus",
          "k": "cair"
        },
        {
          "e": "☁️",
          "n": "Awan",
          "k": "gas"
        },
        {
          "e": "✏️",
          "n": "Pensil",
          "k": "padat"
        },
        {
          "e": "🛢️",
          "n": "Minyak",
          "k": "cair"
        },
        {
          "e": "🌬️",
          "n": "Angin",
          "k": "gas"
        },
        {
          "e": "🧱",
          "n": "Batu bata",
          "k": "padat"
        },
        {
          "e": "☕",
          "n": "Kopi",
          "k": "cair"
        },
        {
          "e": "🎐",
          "n": "Oksigen",
          "k": "gas"
        },
        {
          "e": "🔑",
          "n": "Kunci",
          "k": "padat"
        },
        {
          "e": "🥤",
          "n": "Soda",
          "k": "cair"
        },
        {
          "e": "💭",
          "n": "Uap air",
          "k": "gas"
        },
        {
          "e": "📱",
          "n": "Ponsel",
          "k": "padat"
        },
        {
          "e": "🍵",
          "n": "Teh",
          "k": "cair"
        },
        {
          "e": "🎈",
          "n": "Gas helium",
          "k": "gas"
        },
        {
          "e": "⚽",
          "n": "Bola",
          "k": "padat"
        },
        {
          "e": "🩸",
          "n": "Sirup",
          "k": "cair"
        },
        {
          "e": "🫧",
          "n": "Gelembung gas",
          "k": "gas"
        },
        {
          "e": "🧊",
          "n": "Es batu",
          "k": "padat"
        },
        {
          "e": "🌊",
          "n": "Air laut",
          "k": "cair"
        },
        {
          "e": "🚬",
          "n": "Asap knalpot",
          "k": "gas"
        }
      ]
    },
    {
      "id": "sampah",
      "kind": "sort",
      "category": "Bumi & Lingkungan",
      "ico": "♻️",
      "name": "Pahlawan Sampah",
      "desc": "Pilah organik & anorganik",
      "color": "leaf",
      "enabled": true,
      "hint": "Sampah ini organik atau anorganik?",
      "bins": [
        {
          "k": "organik",
          "l": "Organik",
          "e": "🍃",
          "color": "leaf"
        },
        {
          "k": "anorganik",
          "l": "Anorganik",
          "e": "🧴",
          "color": "sun"
        }
      ],
      "items": [
        {
          "e": "🍌",
          "n": "Kulit pisang",
          "k": "organik"
        },
        {
          "e": "🧴",
          "n": "Botol plastik",
          "k": "anorganik"
        },
        {
          "e": "🍂",
          "n": "Daun kering",
          "k": "organik"
        },
        {
          "e": "🥫",
          "n": "Kaleng",
          "k": "anorganik"
        },
        {
          "e": "🍚",
          "n": "Sisa nasi",
          "k": "organik"
        },
        {
          "e": "🫙",
          "n": "Kaca",
          "k": "anorganik"
        },
        {
          "e": "🍊",
          "n": "Kulit jeruk",
          "k": "organik"
        },
        {
          "e": "🔋",
          "n": "Baterai",
          "k": "anorganik"
        },
        {
          "e": "🍎",
          "n": "Sisa buah",
          "k": "organik"
        },
        {
          "e": "📦",
          "n": "Kardus",
          "k": "anorganik"
        },
        {
          "e": "🥚",
          "n": "Cangkang telur",
          "k": "organik"
        },
        {
          "e": "🛍️",
          "n": "Kantong plastik",
          "k": "anorganik"
        },
        {
          "e": "🌾",
          "n": "Jerami",
          "k": "organik"
        },
        {
          "e": "🪟",
          "n": "Pecahan kaca",
          "k": "anorganik"
        },
        {
          "e": "🐟",
          "n": "Tulang ikan",
          "k": "organik"
        },
        {
          "e": "🥤",
          "n": "Gelas plastik",
          "k": "anorganik"
        },
        {
          "e": "🥬",
          "n": "Sayur busuk",
          "k": "organik"
        },
        {
          "e": "📱",
          "n": "Ponsel rusak",
          "k": "anorganik"
        },
        {
          "e": "☕",
          "n": "Ampas kopi",
          "k": "organik"
        },
        {
          "e": "🔩",
          "n": "Besi tua",
          "k": "anorganik"
        },
        {
          "e": "🍞",
          "n": "Roti basi",
          "k": "organik"
        },
        {
          "e": "💿",
          "n": "CD bekas",
          "k": "anorganik"
        },
        {
          "e": "🌰",
          "n": "Kulit kacang",
          "k": "organik"
        },
        {
          "e": "🧷",
          "n": "Peniti",
          "k": "anorganik"
        },
        {
          "e": "🍉",
          "n": "Kulit semangka",
          "k": "organik"
        },
        {
          "e": "🩹",
          "n": "Plastik pembungkus",
          "k": "anorganik"
        },
        {
          "e": "🥔",
          "n": "Kulit kentang",
          "k": "organik"
        },
        {
          "e": "🪫",
          "n": "Aki bekas",
          "k": "anorganik"
        },
        {
          "e": "🌿",
          "n": "Ranting",
          "k": "organik"
        },
        {
          "e": "🖊️",
          "n": "Pulpen bekas",
          "k": "anorganik"
        }
      ]
    },
    {
      "id": "seq",
      "kind": "sequence",
      "category": "Makhluk Hidup",
      "ico": "🦋",
      "name": "Urutkan Daur",
      "desc": "Susun tahap yang benar",
      "color": "grape",
      "enabled": true,
      "sequences": [
        {
          "t": "Daur hidup kupu-kupu",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🐛",
              "n": "Ulat"
            },
            {
              "e": "🛡️",
              "n": "Kepompong"
            },
            {
              "e": "🦋",
              "n": "Kupu-kupu"
            }
          ]
        },
        {
          "t": "Daur hidup katak",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🐟",
              "n": "Kecebong"
            },
            {
              "e": "🐸",
              "n": "Katak muda"
            },
            {
              "e": "🐸",
              "n": "Katak dewasa"
            }
          ]
        },
        {
          "t": "Perjalanan daur air",
          "s": [
            {
              "e": "☀️",
              "n": "Menguap"
            },
            {
              "e": "☁️",
              "n": "Awan"
            },
            {
              "e": "🌧️",
              "n": "Hujan"
            },
            {
              "e": "🌊",
              "n": "Ke laut"
            }
          ]
        },
        {
          "t": "Daur hidup nyamuk",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🪱",
              "n": "Jentik"
            },
            {
              "e": "🛡️",
              "n": "Pupa"
            },
            {
              "e": "🦟",
              "n": "Nyamuk"
            }
          ]
        },
        {
          "t": "Daur hidup ayam",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🐣",
              "n": "Menetas"
            },
            {
              "e": "🐤",
              "n": "Anak ayam"
            },
            {
              "e": "🐔",
              "n": "Ayam dewasa"
            }
          ]
        },
        {
          "t": "Daur hidup capung",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🐛",
              "n": "Nimfa"
            },
            {
              "e": "🦗",
              "n": "Nimfa besar"
            },
            {
              "e": "🪰",
              "n": "Capung"
            }
          ]
        },
        {
          "t": "Daur hidup belalang",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🦗",
              "n": "Nimfa kecil"
            },
            {
              "e": "🦗",
              "n": "Nimfa besar"
            },
            {
              "e": "🦗",
              "n": "Belalang"
            }
          ]
        },
        {
          "t": "Daur hidup lebah",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🐛",
              "n": "Larva"
            },
            {
              "e": "🛡️",
              "n": "Pupa"
            },
            {
              "e": "🐝",
              "n": "Lebah"
            }
          ]
        },
        {
          "t": "Daur hidup kecoa",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🪳",
              "n": "Nimfa"
            },
            {
              "e": "🪳",
              "n": "Nimfa besar"
            },
            {
              "e": "🪳",
              "n": "Kecoa"
            }
          ]
        },
        {
          "t": "Daur hidup lalat",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🪱",
              "n": "Belatung"
            },
            {
              "e": "🛡️",
              "n": "Pupa"
            },
            {
              "e": "🪰",
              "n": "Lalat"
            }
          ]
        },
        {
          "t": "Daur hidup ikan",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🐟",
              "n": "Larva"
            },
            {
              "e": "🐠",
              "n": "Ikan muda"
            },
            {
              "e": "🐟",
              "n": "Ikan dewasa"
            }
          ]
        },
        {
          "t": "Daur hidup penyu",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🐣",
              "n": "Menetas"
            },
            {
              "e": "🐢",
              "n": "Tukik"
            },
            {
              "e": "🐢",
              "n": "Penyu dewasa"
            }
          ]
        },
        {
          "t": "Daur hidup ular",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🐍",
              "n": "Anak ular"
            },
            {
              "e": "🐍",
              "n": "Ular remaja"
            },
            {
              "e": "🐍",
              "n": "Ular dewasa"
            }
          ]
        },
        {
          "t": "Daur hidup buaya",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🐊",
              "n": "Anak buaya"
            },
            {
              "e": "🐊",
              "n": "Buaya muda"
            },
            {
              "e": "🐊",
              "n": "Buaya dewasa"
            }
          ]
        },
        {
          "t": "Daur hidup burung",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🐣",
              "n": "Menetas"
            },
            {
              "e": "🐤",
              "n": "Anak burung"
            },
            {
              "e": "🐦",
              "n": "Burung dewasa"
            }
          ]
        },
        {
          "t": "Daur hidup kupu sutra",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🐛",
              "n": "Ulat sutra"
            },
            {
              "e": "🧵",
              "n": "Kepompong"
            },
            {
              "e": "🦋",
              "n": "Ngengat"
            }
          ]
        },
        {
          "t": "Daur hidup semut",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🐛",
              "n": "Larva"
            },
            {
              "e": "🛡️",
              "n": "Pupa"
            },
            {
              "e": "🐜",
              "n": "Semut"
            }
          ]
        },
        {
          "t": "Daur hidup udang",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🦐",
              "n": "Larva"
            },
            {
              "e": "🦐",
              "n": "Udang muda"
            },
            {
              "e": "🦐",
              "n": "Udang dewasa"
            }
          ]
        },
        {
          "t": "Turunnya hujan",
          "s": [
            {
              "e": "🌊",
              "n": "Air laut"
            },
            {
              "e": "☀️",
              "n": "Menguap"
            },
            {
              "e": "☁️",
              "n": "Awan"
            },
            {
              "e": "🌧️",
              "n": "Hujan"
            }
          ]
        },
        {
          "t": "Terjadinya pelangi",
          "s": [
            {
              "e": "🌧️",
              "n": "Hujan"
            },
            {
              "e": "☀️",
              "n": "Matahari muncul"
            },
            {
              "e": "💧",
              "n": "Cahaya menembus air"
            },
            {
              "e": "🌈",
              "n": "Pelangi"
            }
          ]
        },
        {
          "t": "Pergantian siang malam",
          "s": [
            {
              "e": "🌅",
              "n": "Pagi"
            },
            {
              "e": "☀️",
              "n": "Siang"
            },
            {
              "e": "🌆",
              "n": "Sore"
            },
            {
              "e": "🌙",
              "n": "Malam"
            }
          ]
        },
        {
          "t": "Daur hidup kanguru",
          "s": [
            {
              "e": "🍼",
              "n": "Bayi kecil"
            },
            {
              "e": "🦘",
              "n": "Dalam kantung"
            },
            {
              "e": "🦘",
              "n": "Anak kanguru"
            },
            {
              "e": "🦘",
              "n": "Kanguru dewasa"
            }
          ]
        },
        {
          "t": "Daur hidup kucing",
          "s": [
            {
              "e": "🐱",
              "n": "Anak kucing"
            },
            {
              "e": "🐈",
              "n": "Kucing remaja"
            },
            {
              "e": "🐈",
              "n": "Kucing dewasa"
            },
            {
              "e": "🐈‍⬛",
              "n": "Kucing tua"
            }
          ]
        },
        {
          "t": "Daur hidup anjing",
          "s": [
            {
              "e": "🐶",
              "n": "Anak anjing"
            },
            {
              "e": "🐕",
              "n": "Anjing remaja"
            },
            {
              "e": "🐕",
              "n": "Anjing dewasa"
            },
            {
              "e": "🦴",
              "n": "Anjing tua"
            }
          ]
        },
        {
          "t": "Daur hidup sapi",
          "s": [
            {
              "e": "🐄",
              "n": "Anak sapi"
            },
            {
              "e": "🐮",
              "n": "Sapi muda"
            },
            {
              "e": "🐄",
              "n": "Sapi dewasa"
            },
            {
              "e": "🥛",
              "n": "Menghasilkan susu"
            }
          ]
        },
        {
          "t": "Daur hidup pohon mangga",
          "s": [
            {
              "e": "🌰",
              "n": "Biji"
            },
            {
              "e": "🌱",
              "n": "Tunas"
            },
            {
              "e": "🌳",
              "n": "Pohon"
            },
            {
              "e": "🥭",
              "n": "Berbuah"
            }
          ]
        },
        {
          "t": "Daur hidup padi",
          "s": [
            {
              "e": "🌾",
              "n": "Benih"
            },
            {
              "e": "🌱",
              "n": "Bibit"
            },
            {
              "e": "🌾",
              "n": "Tumbuh"
            },
            {
              "e": "🍚",
              "n": "Panen"
            }
          ]
        },
        {
          "t": "Daur hidup kelapa",
          "s": [
            {
              "e": "🥥",
              "n": "Buah kelapa"
            },
            {
              "e": "🌱",
              "n": "Tunas"
            },
            {
              "e": "🌴",
              "n": "Pohon muda"
            },
            {
              "e": "🌴",
              "n": "Pohon kelapa"
            }
          ]
        },
        {
          "t": "Daur hidup jagung",
          "s": [
            {
              "e": "🌰",
              "n": "Biji"
            },
            {
              "e": "🌱",
              "n": "Tunas"
            },
            {
              "e": "🌿",
              "n": "Batang"
            },
            {
              "e": "🌽",
              "n": "Jagung"
            }
          ]
        },
        {
          "t": "Daur hidup bunga",
          "s": [
            {
              "e": "🌱",
              "n": "Tunas"
            },
            {
              "e": "🌿",
              "n": "Daun"
            },
            {
              "e": "🌷",
              "n": "Kuncup"
            },
            {
              "e": "🌸",
              "n": "Mekar"
            }
          ]
        }
      ]
    },
    {
      "id": "match",
      "kind": "match",
      "category": "Tubuh & Tumbuhan",
      "ico": "🔗",
      "name": "Pasangkan",
      "desc": "Cocokkan yang tepat",
      "color": "sun",
      "enabled": true,
      "sets": [
        {
          "t": "Set Pasangan 1",
          "pairs": [
            {
              "le": "👁️",
              "l": "Mata",
              "re": "🌈",
              "r": "Melihat"
            },
            {
              "le": "👂",
              "l": "Telinga",
              "re": "🎵",
              "r": "Mendengar"
            },
            {
              "le": "👃",
              "l": "Hidung",
              "re": "🌸",
              "r": "Mencium"
            },
            {
              "le": "👅",
              "l": "Lidah",
              "re": "🍬",
              "r": "Mengecap"
            },
            {
              "le": "✋",
              "l": "Kulit",
              "re": "🧸",
              "r": "Meraba"
            },
            {
              "le": "🧠",
              "l": "Otak",
              "re": "💭",
              "r": "Berpikir"
            }
          ]
        },
        {
          "t": "Set Pasangan 2",
          "pairs": [
            {
              "le": "🌱",
              "l": "Akar",
              "re": "💧",
              "r": "Menyerap air"
            },
            {
              "le": "🎋",
              "l": "Batang",
              "re": "🚰",
              "r": "Menyalurkan air"
            },
            {
              "le": "🍃",
              "l": "Daun",
              "re": "🍳",
              "r": "Membuat makanan"
            },
            {
              "le": "🌸",
              "l": "Bunga",
              "re": "🐝",
              "r": "Berkembang biak"
            },
            {
              "le": "🍎",
              "l": "Buah",
              "re": "🌰",
              "r": "Melindungi biji"
            },
            {
              "le": "🌡️",
              "l": "Termometer",
              "re": "🤒",
              "r": "Mengukur suhu"
            }
          ]
        },
        {
          "t": "Set Pasangan 3",
          "pairs": [
            {
              "le": "⚖️",
              "l": "Timbangan",
              "re": "🏋️",
              "r": "Mengukur berat"
            },
            {
              "le": "📏",
              "l": "Penggaris",
              "re": "📐",
              "r": "Mengukur panjang"
            },
            {
              "le": "⏰",
              "l": "Jam",
              "re": "🕐",
              "r": "Menunjukkan waktu"
            },
            {
              "le": "🔭",
              "l": "Teleskop",
              "re": "⭐",
              "r": "Melihat bintang"
            },
            {
              "le": "🔬",
              "l": "Mikroskop",
              "re": "🦠",
              "r": "Melihat benda kecil"
            },
            {
              "le": "🫀",
              "l": "Jantung",
              "re": "🩸",
              "r": "Memompa darah"
            }
          ]
        },
        {
          "t": "Set Pasangan 4",
          "pairs": [
            {
              "le": "🫁",
              "l": "Paru-paru",
              "re": "💨",
              "r": "Bernapas"
            },
            {
              "le": "🦴",
              "l": "Tulang",
              "re": "🧍",
              "r": "Menegakkan tubuh"
            },
            {
              "le": "💪",
              "l": "Otot",
              "re": "🏃",
              "r": "Menggerakkan tubuh"
            },
            {
              "le": "🦷",
              "l": "Gigi",
              "re": "🍽️",
              "r": "Mengunyah"
            },
            {
              "le": "☀️",
              "l": "Matahari",
              "re": "💡",
              "r": "Sumber cahaya"
            },
            {
              "le": "🌬️",
              "l": "Angin",
              "re": "🪁",
              "r": "Menggerakkan layang"
            }
          ]
        },
        {
          "t": "Set Pasangan 5",
          "pairs": [
            {
              "le": "💧",
              "l": "Air",
              "re": "🌊",
              "r": "Kincir air"
            },
            {
              "le": "🔋",
              "l": "Baterai",
              "re": "🔦",
              "r": "Menyalakan senter"
            },
            {
              "le": "🐟",
              "l": "Ikan",
              "re": "🫧",
              "r": "Bernapas dengan insang"
            },
            {
              "le": "🐦",
              "l": "Burung",
              "re": "🪶",
              "r": "Bersayap"
            },
            {
              "le": "🐍",
              "l": "Ular",
              "re": "🦎",
              "r": "Melata"
            },
            {
              "le": "🦇",
              "l": "Kelelawar",
              "re": "🌙",
              "r": "Aktif malam hari"
            }
          ]
        }
      ]
    },
    {
      "id": "benarsalah",
      "kind": "truefalse",
      "category": "Campuran",
      "ico": "✅",
      "name": "Benar atau Salah",
      "desc": "Fakta sains, tebak!",
      "color": "pink",
      "enabled": true,
      "perRound": 8,
      "statements": [
        {
          "e": "☀️",
          "s": "Matahari adalah sebuah bintang.",
          "a": true
        },
        {
          "e": "🦇",
          "s": "Kelelawar adalah jenis burung.",
          "a": false
        },
        {
          "e": "🕷️",
          "s": "Laba-laba punya delapan kaki.",
          "a": true
        },
        {
          "e": "🐬",
          "s": "Lumba-lumba bernapas dengan insang.",
          "a": false
        },
        {
          "e": "🍅",
          "s": "Tomat termasuk buah.",
          "a": true
        },
        {
          "e": "🌙",
          "s": "Bulan memancarkan cahayanya sendiri.",
          "a": false
        },
        {
          "e": "💧",
          "s": "Air bisa berubah menjadi uap saat dipanaskan.",
          "a": true
        },
        {
          "e": "🐧",
          "s": "Penguin bisa terbang tinggi di langit.",
          "a": false
        },
        {
          "e": "🌱",
          "s": "Tumbuhan membuat makanannya sendiri.",
          "a": true
        },
        {
          "e": "🧲",
          "s": "Magnet bisa menarik semua jenis logam.",
          "a": false
        },
        {
          "e": "🦎",
          "s": "Cicak dapat memutuskan ekornya saat bahaya.",
          "a": true
        },
        {
          "e": "❄️",
          "s": "Es lebih berat daripada air yang sama banyaknya.",
          "a": false
        },
        {
          "e": "🐝",
          "s": "Lebah membantu bunga melakukan penyerbukan.",
          "a": true
        },
        {
          "e": "🩸",
          "s": "Jantung berfungsi untuk berpikir.",
          "a": false
        },
        {
          "e": "🌍",
          "s": "Bumi berputar mengelilingi Matahari.",
          "a": true
        },
        {
          "e": "🦈",
          "s": "Ikan hiu termasuk hewan mamalia.",
          "a": false
        },
        {
          "e": "🐄",
          "s": "Sapi termasuk hewan pemakan tumbuhan.",
          "a": true
        },
        {
          "e": "🌵",
          "s": "Kaktus dapat hidup di tempat yang kering.",
          "a": true
        },
        {
          "e": "🐸",
          "s": "Katak muda bernapas menggunakan paru-paru.",
          "a": false
        },
        {
          "e": "🌈",
          "s": "Pelangi memiliki tujuh warna.",
          "a": true
        },
        {
          "e": "🦋",
          "s": "Kupu-kupu berasal dari kepompong.",
          "a": true
        },
        {
          "e": "🧊",
          "s": "Air membeku saat suhunya sangat panas.",
          "a": false
        },
        {
          "e": "👂",
          "s": "Telinga berguna untuk mendengar.",
          "a": true
        },
        {
          "e": "🌳",
          "s": "Pohon menghasilkan oksigen yang kita hirup.",
          "a": true
        },
        {
          "e": "🐍",
          "s": "Ular memiliki banyak kaki.",
          "a": false
        },
        {
          "e": "🍄",
          "s": "Semua jamur aman untuk dimakan.",
          "a": false
        },
        {
          "e": "🐢",
          "s": "Kura-kura dapat hidup di darat dan air.",
          "a": true
        },
        {
          "e": "⚡",
          "s": "Petir muncul saat cuaca cerah.",
          "a": false
        },
        {
          "e": "🐛",
          "s": "Cacing tanah membantu menyuburkan tanah.",
          "a": true
        },
        {
          "e": "🌡️",
          "s": "Termometer digunakan untuk mengukur berat.",
          "a": false
        }
      ]
    },
    {
      "id": "tubuh",
      "kind": "quiz",
      "category": "Tubuh Manusia",
      "ico": "🦴",
      "name": "Tubuh Manusia",
      "desc": "Kenali tubuhmu",
      "color": "coral",
      "enabled": true,
      "perRound": 8,
      "questions": [
        {
          "e": "🫁",
          "q": "Organ untuk bernapas adalah…",
          "o": [
            "Paru-paru",
            "Ginjal",
            "Hati"
          ],
          "a": 0
        },
        {
          "e": "🦴",
          "q": "Rangka tubuh tersusun dari…",
          "o": [
            "Tulang",
            "Otot",
            "Kulit"
          ],
          "a": 0
        },
        {
          "e": "🧠",
          "q": "Bagian tubuh yang mengatur gerakan adalah…",
          "o": [
            "Otak",
            "Perut",
            "Kaki"
          ],
          "a": 0
        },
        {
          "e": "🦷",
          "q": "Gigi yang merobek makanan disebut gigi…",
          "o": [
            "Taring",
            "Seri",
            "Geraham"
          ],
          "a": 0
        },
        {
          "e": "👀",
          "q": "Kita melihat menggunakan…",
          "o": [
            "Mata",
            "Telinga",
            "Hidung"
          ],
          "a": 0
        },
        {
          "e": "🩸",
          "q": "Cairan merah dalam tubuh adalah…",
          "o": [
            "Darah",
            "Air",
            "Keringat"
          ],
          "a": 0
        },
        {
          "e": "💪",
          "q": "Yang menggerakkan tulang adalah…",
          "o": [
            "Otot",
            "Rambut",
            "Kuku"
          ],
          "a": 0
        },
        {
          "e": "👂",
          "q": "Alat untuk mendengar adalah…",
          "o": [
            "Telinga",
            "Lidah",
            "Mata"
          ],
          "a": 0
        },
        {
          "e": "🫀",
          "q": "Organ yang berdetak memompa darah adalah…",
          "o": [
            "Jantung",
            "Lambung",
            "Paru-paru"
          ],
          "a": 0
        },
        {
          "e": "🍽️",
          "q": "Makanan pertama dikunyah di dalam…",
          "o": [
            "Mulut",
            "Perut",
            "Usus"
          ],
          "a": 0
        },
        {
          "e": "👅",
          "q": "Kita mengecap rasa dengan…",
          "o": [
            "Lidah",
            "Hidung",
            "Kulit"
          ],
          "a": 0
        },
        {
          "e": "✋",
          "q": "Kita meraba benda dengan…",
          "o": [
            "Kulit",
            "Mata",
            "Telinga"
          ],
          "a": 0
        },
        {
          "e": "🦵",
          "q": "Kita berjalan menggunakan…",
          "o": [
            "Kaki",
            "Tangan",
            "Kepala"
          ],
          "a": 0
        },
        {
          "e": "💇",
          "q": "Rambut tumbuh di bagian…",
          "o": [
            "Kepala",
            "Perut",
            "Kaki"
          ],
          "a": 0
        },
        {
          "e": "🫃",
          "q": "Makanan dicerna setelah lambung masuk ke…",
          "o": [
            "Usus",
            "Paru-paru",
            "Jantung"
          ],
          "a": 0
        },
        {
          "e": "🧴",
          "q": "Kulit mengeluarkan cairan berupa…",
          "o": [
            "Keringat",
            "Darah",
            "Air liur"
          ],
          "a": 0
        },
        {
          "e": "🦿",
          "q": "Sendi berguna untuk membantu tulang…",
          "o": [
            "Bergerak",
            "Berpikir",
            "Melihat"
          ],
          "a": 0
        },
        {
          "e": "👃",
          "q": "Rongga hidung berfungsi menyaring…",
          "o": [
            "Udara",
            "Makanan",
            "Air"
          ],
          "a": 0
        },
        {
          "e": "😁",
          "q": "Jumlah gigi susu anak-anak sekitar…",
          "o": [
            "20",
            "32",
            "10"
          ],
          "a": 0
        },
        {
          "e": "🩺",
          "q": "Bagian darah yang melawan penyakit adalah sel darah…",
          "o": [
            "Putih",
            "Merah",
            "Biru"
          ],
          "a": 0
        },
        {
          "e": "🫧",
          "q": "Kita membuang napas mengeluarkan gas…",
          "o": [
            "Karbon dioksida",
            "Oksigen",
            "Nitrogen"
          ],
          "a": 0
        },
        {
          "e": "🥛",
          "q": "Minuman yang menguatkan tulang adalah…",
          "o": [
            "Susu",
            "Soda",
            "Kopi"
          ],
          "a": 0
        },
        {
          "e": "🛌",
          "q": "Agar tubuh sehat, kita perlu cukup…",
          "o": [
            "Istirahat",
            "Begadang",
            "Main terus"
          ],
          "a": 0
        },
        {
          "e": "🏃",
          "q": "Olahraga membuat tubuh menjadi…",
          "o": [
            "Sehat",
            "Lemah",
            "Sakit"
          ],
          "a": 0
        },
        {
          "e": "🧽",
          "q": "Agar gigi bersih, kita harus rajin…",
          "o": [
            "Menggosok gigi",
            "Makan permen",
            "Tidur"
          ],
          "a": 0
        },
        {
          "e": "🥕",
          "q": "Vitamin A baik untuk kesehatan…",
          "o": [
            "Mata",
            "Tulang",
            "Rambut"
          ],
          "a": 0
        },
        {
          "e": "☀️",
          "q": "Vitamin D banyak didapat dari…",
          "o": [
            "Sinar matahari",
            "Air hujan",
            "Angin"
          ],
          "a": 0
        },
        {
          "e": "🍊",
          "q": "Buah jeruk banyak mengandung vitamin…",
          "o": [
            "C",
            "K",
            "B"
          ],
          "a": 0
        },
        {
          "e": "💅",
          "q": "Bagian ujung jari yang keras disebut…",
          "o": [
            "Kuku",
            "Tulang",
            "Otot"
          ],
          "a": 0
        },
        {
          "e": "🧬",
          "q": "Anak biasanya mirip dengan…",
          "o": [
            "Orang tuanya",
            "Tetangganya",
            "Gurunya"
          ],
          "a": 0
        }
      ]
    },
    {
      "id": "makanan",
      "kind": "sort",
      "category": "Tubuh Manusia",
      "ico": "🥗",
      "name": "Makanan Sehat",
      "desc": "Sehat atau kurang sehat?",
      "color": "leaf",
      "enabled": true,
      "hint": "Makanan ini sehat atau kurang sehat?",
      "bins": [
        {
          "k": "sehat",
          "l": "Sehat",
          "e": "🥦",
          "color": "leaf"
        },
        {
          "k": "kurang",
          "l": "Kurang Sehat",
          "e": "🍭",
          "color": "coral"
        }
      ],
      "items": [
        {
          "e": "🥦",
          "n": "Brokoli",
          "k": "sehat"
        },
        {
          "e": "🍬",
          "n": "Permen",
          "k": "kurang"
        },
        {
          "e": "🍎",
          "n": "Apel",
          "k": "sehat"
        },
        {
          "e": "🥤",
          "n": "Soda",
          "k": "kurang"
        },
        {
          "e": "🐟",
          "n": "Ikan",
          "k": "sehat"
        },
        {
          "e": "🍟",
          "n": "Keripik",
          "k": "kurang"
        },
        {
          "e": "🥕",
          "n": "Wortel",
          "k": "sehat"
        },
        {
          "e": "🍩",
          "n": "Donat",
          "k": "kurang"
        },
        {
          "e": "🥛",
          "n": "Susu",
          "k": "sehat"
        },
        {
          "e": "🍦",
          "n": "Es krim",
          "k": "kurang"
        },
        {
          "e": "🥬",
          "n": "Bayam",
          "k": "sehat"
        },
        {
          "e": "🍭",
          "n": "Lolipop",
          "k": "kurang"
        },
        {
          "e": "🍊",
          "n": "Jeruk",
          "k": "sehat"
        },
        {
          "e": "🍔",
          "n": "Burger",
          "k": "kurang"
        },
        {
          "e": "🥚",
          "n": "Telur",
          "k": "sehat"
        },
        {
          "e": "🍫",
          "n": "Cokelat batangan",
          "k": "kurang"
        },
        {
          "e": "🍚",
          "n": "Nasi",
          "k": "sehat"
        },
        {
          "e": "🌭",
          "n": "Sosis goreng",
          "k": "kurang"
        },
        {
          "e": "🍌",
          "n": "Pisang",
          "k": "sehat"
        },
        {
          "e": "🧁",
          "n": "Kue manis",
          "k": "kurang"
        },
        {
          "e": "🥑",
          "n": "Alpukat",
          "k": "sehat"
        },
        {
          "e": "🍿",
          "n": "Popcorn manis",
          "k": "kurang"
        },
        {
          "e": "🍅",
          "n": "Tomat",
          "k": "sehat"
        },
        {
          "e": "🥓",
          "n": "Gorengan",
          "k": "kurang"
        },
        {
          "e": "🫘",
          "n": "Kacang",
          "k": "sehat"
        },
        {
          "e": "🍰",
          "n": "Kue tart",
          "k": "kurang"
        },
        {
          "e": "🌽",
          "n": "Jagung",
          "k": "sehat"
        },
        {
          "e": "🥨",
          "n": "Camilan asin",
          "k": "kurang"
        },
        {
          "e": "🍠",
          "n": "Ubi",
          "k": "sehat"
        },
        {
          "e": "🧋",
          "n": "Minuman boba",
          "k": "kurang"
        }
      ]
    },
    {
      "id": "antariksa",
      "kind": "quiz",
      "category": "Bumi & Antariksa",
      "ico": "🪐",
      "name": "Kuis Antariksa",
      "desc": "Jelajah luar angkasa",
      "color": "grape",
      "enabled": true,
      "perRound": 8,
      "questions": [
        {
          "e": "🪐",
          "q": "Planet yang punya cincin indah adalah…",
          "o": [
            "Saturnus",
            "Mars",
            "Venus"
          ],
          "a": 0
        },
        {
          "e": "🔴",
          "q": "Planet 'Planet Merah' adalah…",
          "o": [
            "Mars",
            "Bumi",
            "Jupiter"
          ],
          "a": 0
        },
        {
          "e": "🌟",
          "q": "Benda langit yang bercahaya sendiri adalah…",
          "o": [
            "Bintang",
            "Planet",
            "Bulan"
          ],
          "a": 0
        },
        {
          "e": "🌍",
          "q": "Planet tempat kita tinggal adalah…",
          "o": [
            "Bumi",
            "Merkurius",
            "Neptunus"
          ],
          "a": 0
        },
        {
          "e": "🚀",
          "q": "Kendaraan ke luar angkasa disebut…",
          "o": [
            "Roket",
            "Kapal",
            "Kereta"
          ],
          "a": 0
        },
        {
          "e": "🌞",
          "q": "Pusat tata surya kita adalah…",
          "o": [
            "Matahari",
            "Bumi",
            "Bulan"
          ],
          "a": 0
        },
        {
          "e": "👨‍🚀",
          "q": "Penjelajah luar angkasa disebut…",
          "o": [
            "Astronaut",
            "Pilot",
            "Nahkoda"
          ],
          "a": 0
        },
        {
          "e": "🌑",
          "q": "Satelit alami Bumi adalah…",
          "o": [
            "Bulan",
            "Matahari",
            "Mars"
          ],
          "a": 0
        },
        {
          "e": "☄️",
          "q": "Benda langit berekor disebut…",
          "o": [
            "Komet",
            "Awan",
            "Pelangi"
          ],
          "a": 0
        },
        {
          "e": "🌌",
          "q": "Kumpulan miliaran bintang disebut…",
          "o": [
            "Galaksi",
            "Planet",
            "Meteor"
          ],
          "a": 0
        },
        {
          "e": "🪨",
          "q": "Batu langit yang jatuh ke bumi disebut…",
          "o": [
            "Meteor",
            "Komet",
            "Bintang"
          ],
          "a": 0
        },
        {
          "e": "☀️",
          "q": "Planet terdekat dengan Matahari adalah…",
          "o": [
            "Merkurius",
            "Bumi",
            "Saturnus"
          ],
          "a": 0
        },
        {
          "e": "🪐",
          "q": "Planet terbesar di tata surya adalah…",
          "o": [
            "Jupiter",
            "Bumi",
            "Mars"
          ],
          "a": 0
        },
        {
          "e": "🌡️",
          "q": "Planet paling panas adalah…",
          "o": [
            "Venus",
            "Neptunus",
            "Bumi"
          ],
          "a": 0
        },
        {
          "e": "🔭",
          "q": "Alat untuk melihat bintang jauh adalah…",
          "o": [
            "Teleskop",
            "Mikroskop",
            "Kacamata"
          ],
          "a": 0
        },
        {
          "e": "🌗",
          "q": "Perubahan bentuk bulan disebut…",
          "o": [
            "Fase bulan",
            "Gerhana",
            "Musim"
          ],
          "a": 0
        },
        {
          "e": "🌘",
          "q": "Saat bulan menutupi matahari terjadi…",
          "o": [
            "Gerhana matahari",
            "Hujan",
            "Pelangi"
          ],
          "a": 0
        },
        {
          "e": "🌝",
          "q": "Bulan purnama berbentuk…",
          "o": [
            "Bulat penuh",
            "Sabit",
            "Setengah"
          ],
          "a": 0
        },
        {
          "e": "🧭",
          "q": "Bumi berputar mengelilingi matahari disebut…",
          "o": [
            "Revolusi",
            "Rotasi",
            "Gravitasi"
          ],
          "a": 0
        },
        {
          "e": "🔄",
          "q": "Bumi berputar pada porosnya disebut…",
          "o": [
            "Rotasi",
            "Revolusi",
            "Orbit"
          ],
          "a": 0
        },
        {
          "e": "🌠",
          "q": "Jalur planet mengelilingi matahari disebut…",
          "o": [
            "Orbit",
            "Rel",
            "Jalan"
          ],
          "a": 0
        },
        {
          "e": "🧊",
          "q": "Planet yang sangat dingin dan jauh adalah…",
          "o": [
            "Neptunus",
            "Merkurius",
            "Venus"
          ],
          "a": 0
        },
        {
          "e": "🌍",
          "q": "Bumi tampak berwarna biru karena banyak…",
          "o": [
            "Air",
            "Pasir",
            "Api"
          ],
          "a": 0
        },
        {
          "e": "⭐",
          "q": "Bintang yang paling dekat dengan bumi adalah…",
          "o": [
            "Matahari",
            "Bulan",
            "Mars"
          ],
          "a": 0
        },
        {
          "e": "🛰️",
          "q": "Benda buatan yang mengelilingi bumi disebut…",
          "o": [
            "Satelit",
            "Komet",
            "Meteor"
          ],
          "a": 0
        },
        {
          "e": "🌒",
          "q": "Bagian bumi yang tidak kena matahari mengalami…",
          "o": [
            "Malam",
            "Siang",
            "Musim panas"
          ],
          "a": 0
        },
        {
          "e": "🧑‍🚀",
          "q": "Baju khusus astronaut disebut…",
          "o": [
            "Baju antariksa",
            "Jas hujan",
            "Seragam"
          ],
          "a": 0
        },
        {
          "e": "🌞",
          "q": "Cahaya matahari sampai ke bumi berupa…",
          "o": [
            "Sinar",
            "Suara",
            "Angin"
          ],
          "a": 0
        },
        {
          "e": "🪐",
          "q": "Jumlah planet di tata surya ada…",
          "o": [
            "Delapan",
            "Lima",
            "Sepuluh"
          ],
          "a": 0
        },
        {
          "e": "🌏",
          "q": "Planet yang punya kehidupan sejauh ini adalah…",
          "o": [
            "Bumi",
            "Mars",
            "Jupiter"
          ],
          "a": 0
        }
      ]
    },
    {
      "id": "daurayam",
      "kind": "sequence",
      "category": "Makhluk Hidup",
      "ico": "🐔",
      "name": "Daur Hidup",
      "desc": "Susun tahap tumbuhnya",
      "color": "sun",
      "enabled": true,
      "sequences": [
        {
          "t": "Pertumbuhan tanaman",
          "s": [
            {
              "e": "🌰",
              "n": "Biji"
            },
            {
              "e": "🌱",
              "n": "Tunas"
            },
            {
              "e": "🌿",
              "n": "Tumbuh daun"
            },
            {
              "e": "🌳",
              "n": "Pohon"
            }
          ]
        },
        {
          "t": "Pertumbuhan manusia",
          "s": [
            {
              "e": "👶",
              "n": "Bayi"
            },
            {
              "e": "🧒",
              "n": "Anak"
            },
            {
              "e": "🧑",
              "n": "Remaja"
            },
            {
              "e": "🧓",
              "n": "Dewasa"
            }
          ]
        },
        {
          "t": "Menanam biji kacang",
          "s": [
            {
              "e": "🫘",
              "n": "Biji"
            },
            {
              "e": "💧",
              "n": "Disiram"
            },
            {
              "e": "🌱",
              "n": "Berkecambah"
            },
            {
              "e": "🌿",
              "n": "Tumbuh"
            }
          ]
        },
        {
          "t": "Tumbuhnya biji",
          "s": [
            {
              "e": "🌰",
              "n": "Biji"
            },
            {
              "e": "🌱",
              "n": "Akar keluar"
            },
            {
              "e": "🌱",
              "n": "Tunas naik"
            },
            {
              "e": "🌿",
              "n": "Berdaun"
            }
          ]
        },
        {
          "t": "Membuat kecambah",
          "s": [
            {
              "e": "🫘",
              "n": "Kacang hijau"
            },
            {
              "e": "💧",
              "n": "Rendam air"
            },
            {
              "e": "🌱",
              "n": "Berkecambah"
            },
            {
              "e": "🌿",
              "n": "Tauge"
            }
          ]
        },
        {
          "t": "Bunga menjadi buah",
          "s": [
            {
              "e": "🌸",
              "n": "Bunga"
            },
            {
              "e": "🐝",
              "n": "Penyerbukan"
            },
            {
              "e": "🌼",
              "n": "Bakal buah"
            },
            {
              "e": "🍎",
              "n": "Buah"
            }
          ]
        },
        {
          "t": "Tumbuh gigi anak",
          "s": [
            {
              "e": "👶",
              "n": "Bayi tanpa gigi"
            },
            {
              "e": "🦷",
              "n": "Gigi tumbuh"
            },
            {
              "e": "😁",
              "n": "Gigi susu"
            },
            {
              "e": "🦷",
              "n": "Gigi tetap"
            }
          ]
        },
        {
          "t": "Pertumbuhan ayam",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🐣",
              "n": "Menetas"
            },
            {
              "e": "🐤",
              "n": "Anak ayam"
            },
            {
              "e": "🐔",
              "n": "Ayam dewasa"
            }
          ]
        },
        {
          "t": "Pertumbuhan pohon kelapa",
          "s": [
            {
              "e": "🥥",
              "n": "Buah"
            },
            {
              "e": "🌱",
              "n": "Tunas"
            },
            {
              "e": "🌴",
              "n": "Pohon muda"
            },
            {
              "e": "🌴",
              "n": "Pohon tinggi"
            }
          ]
        },
        {
          "t": "Pertumbuhan tomat",
          "s": [
            {
              "e": "🌱",
              "n": "Bibit"
            },
            {
              "e": "🌿",
              "n": "Batang"
            },
            {
              "e": "🌼",
              "n": "Berbunga"
            },
            {
              "e": "🍅",
              "n": "Tomat"
            }
          ]
        },
        {
          "t": "Fotosintesis daun",
          "s": [
            {
              "e": "☀️",
              "n": "Cahaya matahari"
            },
            {
              "e": "💧",
              "n": "Air"
            },
            {
              "e": "🍃",
              "n": "Diolah daun"
            },
            {
              "e": "🍬",
              "n": "Makanan"
            }
          ]
        },
        {
          "t": "Membuat nasi",
          "s": [
            {
              "e": "🌾",
              "n": "Padi"
            },
            {
              "e": "🍚",
              "n": "Beras"
            },
            {
              "e": "🍲",
              "n": "Dimasak"
            },
            {
              "e": "🍚",
              "n": "Nasi"
            }
          ]
        },
        {
          "t": "Membuat roti",
          "s": [
            {
              "e": "🌾",
              "n": "Gandum"
            },
            {
              "e": "🥣",
              "n": "Tepung"
            },
            {
              "e": "🍞",
              "n": "Adonan"
            },
            {
              "e": "🍞",
              "n": "Roti matang"
            }
          ]
        },
        {
          "t": "Membuat susu jadi keju",
          "s": [
            {
              "e": "🥛",
              "n": "Susu"
            },
            {
              "e": "🧫",
              "n": "Diendapkan"
            },
            {
              "e": "🧀",
              "n": "Dipadatkan"
            },
            {
              "e": "🧀",
              "n": "Keju"
            }
          ]
        },
        {
          "t": "Perubahan es",
          "s": [
            {
              "e": "🧊",
              "n": "Es batu"
            },
            {
              "e": "💧",
              "n": "Mencair"
            },
            {
              "e": "♨️",
              "n": "Menguap"
            },
            {
              "e": "☁️",
              "n": "Uap"
            }
          ]
        },
        {
          "t": "Membuat garam",
          "s": [
            {
              "e": "🌊",
              "n": "Air laut"
            },
            {
              "e": "🏖️",
              "n": "Ditampung"
            },
            {
              "e": "☀️",
              "n": "Dijemur"
            },
            {
              "e": "🧂",
              "n": "Garam"
            }
          ]
        },
        {
          "t": "Kupu bertelur",
          "s": [
            {
              "e": "🦋",
              "n": "Kupu-kupu"
            },
            {
              "e": "🥚",
              "n": "Bertelur"
            },
            {
              "e": "🐛",
              "n": "Menetas jadi ulat"
            },
            {
              "e": "🛡️",
              "n": "Kepompong"
            }
          ]
        },
        {
          "t": "Perkembangan katak",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🐟",
              "n": "Kecebong"
            },
            {
              "e": "🐸",
              "n": "Berkaki"
            },
            {
              "e": "🐸",
              "n": "Katak"
            }
          ]
        },
        {
          "t": "Membuat yoghurt",
          "s": [
            {
              "e": "🥛",
              "n": "Susu"
            },
            {
              "e": "🌡️",
              "n": "Dihangatkan"
            },
            {
              "e": "🦠",
              "n": "Diberi bakteri baik"
            },
            {
              "e": "🥣",
              "n": "Yoghurt"
            }
          ]
        },
        {
          "t": "Membuat tempe",
          "s": [
            {
              "e": "🫘",
              "n": "Kedelai"
            },
            {
              "e": "💧",
              "n": "Direbus"
            },
            {
              "e": "🍄",
              "n": "Diberi ragi"
            },
            {
              "e": "🟫",
              "n": "Tempe"
            }
          ]
        },
        {
          "t": "Tumbuhnya jamur",
          "s": [
            {
              "e": "🌧️",
              "n": "Lembap"
            },
            {
              "e": "🦠",
              "n": "Spora"
            },
            {
              "e": "🍄",
              "n": "Tunas jamur"
            },
            {
              "e": "🍄",
              "n": "Jamur"
            }
          ]
        },
        {
          "t": "Membuat kompos",
          "s": [
            {
              "e": "🍂",
              "n": "Sampah daun"
            },
            {
              "e": "🪱",
              "n": "Diurai cacing"
            },
            {
              "e": "🌡️",
              "n": "Membusuk"
            },
            {
              "e": "🟤",
              "n": "Pupuk"
            }
          ]
        },
        {
          "t": "Perubahan warna daun",
          "s": [
            {
              "e": "🌱",
              "n": "Hijau muda"
            },
            {
              "e": "🍃",
              "n": "Hijau tua"
            },
            {
              "e": "🍂",
              "n": "Kuning"
            },
            {
              "e": "🍁",
              "n": "Cokelat"
            }
          ]
        },
        {
          "t": "Membuat teh",
          "s": [
            {
              "e": "🌿",
              "n": "Daun teh"
            },
            {
              "e": "☀️",
              "n": "Dikeringkan"
            },
            {
              "e": "💧",
              "n": "Diseduh"
            },
            {
              "e": "🍵",
              "n": "Teh"
            }
          ]
        },
        {
          "t": "Membuat cokelat",
          "s": [
            {
              "e": "🌰",
              "n": "Biji kakao"
            },
            {
              "e": "☀️",
              "n": "Dijemur"
            },
            {
              "e": "🏭",
              "n": "Diolah"
            },
            {
              "e": "🍫",
              "n": "Cokelat"
            }
          ]
        },
        {
          "t": "Pertumbuhan bebek",
          "s": [
            {
              "e": "🥚",
              "n": "Telur"
            },
            {
              "e": "🐣",
              "n": "Menetas"
            },
            {
              "e": "🐥",
              "n": "Anak bebek"
            },
            {
              "e": "🦆",
              "n": "Bebek dewasa"
            }
          ]
        },
        {
          "t": "Membuat gula",
          "s": [
            {
              "e": "🎋",
              "n": "Tebu"
            },
            {
              "e": "💧",
              "n": "Diperas"
            },
            {
              "e": "🔥",
              "n": "Dimasak"
            },
            {
              "e": "🍬",
              "n": "Gula"
            }
          ]
        },
        {
          "t": "Membuat kertas",
          "s": [
            {
              "e": "🌳",
              "n": "Kayu"
            },
            {
              "e": "🪵",
              "n": "Bubur kayu"
            },
            {
              "e": "🏭",
              "n": "Dicetak"
            },
            {
              "e": "📄",
              "n": "Kertas"
            }
          ]
        },
        {
          "t": "Membuat kain",
          "s": [
            {
              "e": "🌿",
              "n": "Kapas"
            },
            {
              "e": "🧵",
              "n": "Benang"
            },
            {
              "e": "🧶",
              "n": "Ditenun"
            },
            {
              "e": "👕",
              "n": "Kain"
            }
          ]
        },
        {
          "t": "Pertumbuhan biji bunga matahari",
          "s": [
            {
              "e": "🌰",
              "n": "Biji"
            },
            {
              "e": "🌱",
              "n": "Tunas"
            },
            {
              "e": "🌿",
              "n": "Batang tinggi"
            },
            {
              "e": "🌻",
              "n": "Bunga"
            }
          ]
        }
      ]
    },
    {
      "id": "ingatan",
      "kind": "memory",
      "category": "Makhluk Hidup",
      "ico": "🃏",
      "name": "Kartu Ingatan",
      "desc": "Cari pasangan kartunya",
      "color": "sky",
      "enabled": true,
      "pairs": [
        {
          "a": "🐘",
          "b": "Gajah"
        },
        {
          "a": "🦁",
          "b": "Singa"
        },
        {
          "a": "🐧",
          "b": "Penguin"
        },
        {
          "a": "🦒",
          "b": "Jerapah"
        },
        {
          "a": "🐸",
          "b": "Katak"
        },
        {
          "a": "🦋",
          "b": "Kupu-kupu"
        },
        {
          "a": "🐬",
          "b": "Lumba-lumba"
        },
        {
          "a": "🦉",
          "b": "Burung Hantu"
        },
        {
          "a": "🐯",
          "b": "Harimau"
        },
        {
          "a": "🐻",
          "b": "Beruang"
        },
        {
          "a": "🦊",
          "b": "Rubah"
        },
        {
          "a": "🐨",
          "b": "Koala"
        },
        {
          "a": "🐼",
          "b": "Panda"
        },
        {
          "a": "🦓",
          "b": "Zebra"
        },
        {
          "a": "🦘",
          "b": "Kanguru"
        },
        {
          "a": "🐢",
          "b": "Kura-kura"
        },
        {
          "a": "🐍",
          "b": "Ular"
        },
        {
          "a": "🦈",
          "b": "Hiu"
        },
        {
          "a": "🐙",
          "b": "Gurita"
        },
        {
          "a": "🦀",
          "b": "Kepiting"
        },
        {
          "a": "🐝",
          "b": "Lebah"
        },
        {
          "a": "🐜",
          "b": "Semut"
        },
        {
          "a": "🕷️",
          "b": "Laba-laba"
        },
        {
          "a": "🦇",
          "b": "Kelelawar"
        },
        {
          "a": "🦅",
          "b": "Elang"
        },
        {
          "a": "🦆",
          "b": "Bebek"
        },
        {
          "a": "🐔",
          "b": "Ayam"
        },
        {
          "a": "🐄",
          "b": "Sapi"
        },
        {
          "a": "🐴",
          "b": "Kuda"
        },
        {
          "a": "🐰",
          "b": "Kelinci"
        }
      ]
    },
    {
      "id": "bedahidup",
      "kind": "odd",
      "category": "Makhluk Hidup",
      "ico": "🔍",
      "name": "Cari yang Beda",
      "desc": "Mana yang tidak sekelompok?",
      "color": "sun",
      "enabled": true,
      "perRound": 6,
      "groups": [
        {
          "q": "Mana yang bukan mamalia?",
          "items": [
            {
              "e": "🐟",
              "n": "Ikan"
            },
            {
              "e": "🐘",
              "n": "Gajah"
            },
            {
              "e": "🦁",
              "n": "Singa"
            },
            {
              "e": "🐄",
              "n": "Sapi"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan burung?",
          "items": [
            {
              "e": "🦋",
              "n": "Kupu-kupu"
            },
            {
              "e": "🦅",
              "n": "Elang"
            },
            {
              "e": "🦉",
              "n": "Burung hantu"
            },
            {
              "e": "🐧",
              "n": "Penguin"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan buah?",
          "items": [
            {
              "e": "🥕",
              "n": "Wortel"
            },
            {
              "e": "🍎",
              "n": "Apel"
            },
            {
              "e": "🍌",
              "n": "Pisang"
            },
            {
              "e": "🍇",
              "n": "Anggur"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan hewan?",
          "items": [
            {
              "e": "🌳",
              "n": "Pohon"
            },
            {
              "e": "🐕",
              "n": "Anjing"
            },
            {
              "e": "🐈",
              "n": "Kucing"
            },
            {
              "e": "🐄",
              "n": "Sapi"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan tumbuhan?",
          "items": [
            {
              "e": "🐛",
              "n": "Ulat"
            },
            {
              "e": "🌳",
              "n": "Pohon"
            },
            {
              "e": "🌵",
              "n": "Kaktus"
            },
            {
              "e": "🌻",
              "n": "Bunga"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang tidak hidup di air?",
          "items": [
            {
              "e": "🐫",
              "n": "Unta"
            },
            {
              "e": "🐠",
              "n": "Ikan"
            },
            {
              "e": "🐙",
              "n": "Gurita"
            },
            {
              "e": "🦈",
              "n": "Hiu"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan serangga?",
          "items": [
            {
              "e": "🕷️",
              "n": "Laba-laba"
            },
            {
              "e": "🐜",
              "n": "Semut"
            },
            {
              "e": "🐝",
              "n": "Lebah"
            },
            {
              "e": "🦗",
              "n": "Belalang"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang tidak bisa terbang?",
          "items": [
            {
              "e": "🐢",
              "n": "Kura-kura"
            },
            {
              "e": "🦅",
              "n": "Elang"
            },
            {
              "e": "🦋",
              "n": "Kupu-kupu"
            },
            {
              "e": "🐝",
              "n": "Lebah"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan hewan berkaki empat?",
          "items": [
            {
              "e": "🐍",
              "n": "Ular"
            },
            {
              "e": "🐕",
              "n": "Anjing"
            },
            {
              "e": "🐈",
              "n": "Kucing"
            },
            {
              "e": "🐄",
              "n": "Sapi"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan sayur?",
          "items": [
            {
              "e": "🍓",
              "n": "Stroberi"
            },
            {
              "e": "🥦",
              "n": "Brokoli"
            },
            {
              "e": "🥕",
              "n": "Wortel"
            },
            {
              "e": "🥬",
              "n": "Bayam"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bertelur?",
          "items": [
            {
              "e": "🐄",
              "n": "Sapi"
            },
            {
              "e": "🐔",
              "n": "Ayam"
            },
            {
              "e": "🦆",
              "n": "Bebek"
            },
            {
              "e": "🐢",
              "n": "Kura-kura"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan hewan buas?",
          "items": [
            {
              "e": "🐰",
              "n": "Kelinci"
            },
            {
              "e": "🦁",
              "n": "Singa"
            },
            {
              "e": "🐯",
              "n": "Harimau"
            },
            {
              "e": "🐺",
              "n": "Serigala"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan pemakan daging?",
          "items": [
            {
              "e": "🐄",
              "n": "Sapi"
            },
            {
              "e": "🦁",
              "n": "Singa"
            },
            {
              "e": "🐯",
              "n": "Harimau"
            },
            {
              "e": "🐊",
              "n": "Buaya"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan bagian tumbuhan?",
          "items": [
            {
              "e": "🪶",
              "n": "Bulu"
            },
            {
              "e": "🌿",
              "n": "Daun"
            },
            {
              "e": "🌸",
              "n": "Bunga"
            },
            {
              "e": "🌱",
              "n": "Akar"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang hidup di darat?",
          "items": [
            {
              "e": "🐬",
              "n": "Lumba-lumba"
            },
            {
              "e": "🐘",
              "n": "Gajah"
            },
            {
              "e": "🦒",
              "n": "Jerapah"
            },
            {
              "e": "🐅",
              "n": "Harimau"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan hewan peliharaan?",
          "items": [
            {
              "e": "🐅",
              "n": "Harimau"
            },
            {
              "e": "🐈",
              "n": "Kucing"
            },
            {
              "e": "🐕",
              "n": "Anjing"
            },
            {
              "e": "🐹",
              "n": "Hamster"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang tidak menyusui anaknya?",
          "items": [
            {
              "e": "🐦",
              "n": "Burung"
            },
            {
              "e": "🐄",
              "n": "Sapi"
            },
            {
              "e": "🐈",
              "n": "Kucing"
            },
            {
              "e": "🐘",
              "n": "Gajah"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan reptil?",
          "items": [
            {
              "e": "🐸",
              "n": "Katak"
            },
            {
              "e": "🐍",
              "n": "Ular"
            },
            {
              "e": "🦎",
              "n": "Kadal"
            },
            {
              "e": "🐊",
              "n": "Buaya"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan pohon?",
          "items": [
            {
              "e": "🌹",
              "n": "Mawar"
            },
            {
              "e": "🥭",
              "n": "Mangga"
            },
            {
              "e": "🥥",
              "n": "Kelapa"
            },
            {
              "e": "🍌",
              "n": "Pisang"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang hidup di air tawar?",
          "items": [
            {
              "e": "🦈",
              "n": "Hiu"
            },
            {
              "e": "🐟",
              "n": "Ikan mas"
            },
            {
              "e": "🐸",
              "n": "Katak"
            },
            {
              "e": "🦆",
              "n": "Bebek"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan hewan bertelur?",
          "items": [
            {
              "e": "🐈",
              "n": "Kucing"
            },
            {
              "e": "🐔",
              "n": "Ayam"
            },
            {
              "e": "🐍",
              "n": "Ular"
            },
            {
              "e": "🐠",
              "n": "Ikan"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang tidak berbulu?",
          "items": [
            {
              "e": "🐍",
              "n": "Ular"
            },
            {
              "e": "🐈",
              "n": "Kucing"
            },
            {
              "e": "🐕",
              "n": "Anjing"
            },
            {
              "e": "🐰",
              "n": "Kelinci"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan hewan malam?",
          "items": [
            {
              "e": "🐓",
              "n": "Ayam jago"
            },
            {
              "e": "🦇",
              "n": "Kelelawar"
            },
            {
              "e": "🦉",
              "n": "Burung hantu"
            },
            {
              "e": "🦊",
              "n": "Rubah"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan tanaman bunga?",
          "items": [
            {
              "e": "🌵",
              "n": "Kaktus"
            },
            {
              "e": "🌹",
              "n": "Mawar"
            },
            {
              "e": "🌻",
              "n": "Matahari"
            },
            {
              "e": "🌷",
              "n": "Tulip"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan makanan herbivora?",
          "items": [
            {
              "e": "🍖",
              "n": "Daging"
            },
            {
              "e": "🌿",
              "n": "Rumput"
            },
            {
              "e": "🥬",
              "n": "Daun"
            },
            {
              "e": "🥕",
              "n": "Wortel"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang hidup di kutub?",
          "items": [
            {
              "e": "🦒",
              "n": "Jerapah"
            },
            {
              "e": "🐧",
              "n": "Penguin"
            },
            {
              "e": "🐻‍❄️",
              "n": "Beruang kutub"
            },
            {
              "e": "🦭",
              "n": "Anjing laut"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan hewan air?",
          "items": [
            {
              "e": "🐿️",
              "n": "Tupai"
            },
            {
              "e": "🐟",
              "n": "Ikan"
            },
            {
              "e": "🦐",
              "n": "Udang"
            },
            {
              "e": "🦀",
              "n": "Kepiting"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang berkembang biak dengan biji?",
          "items": [
            {
              "e": "🍄",
              "n": "Jamur"
            },
            {
              "e": "🌻",
              "n": "Bunga matahari"
            },
            {
              "e": "🥭",
              "n": "Mangga"
            },
            {
              "e": "🌽",
              "n": "Jagung"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan unggas?",
          "items": [
            {
              "e": "🐐",
              "n": "Kambing"
            },
            {
              "e": "🐔",
              "n": "Ayam"
            },
            {
              "e": "🦆",
              "n": "Bebek"
            },
            {
              "e": "🦢",
              "n": "Angsa"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan hewan berkantung?",
          "items": [
            {
              "e": "🐘",
              "n": "Gajah"
            },
            {
              "e": "🦘",
              "n": "Kanguru"
            },
            {
              "e": "🐨",
              "n": "Koala"
            },
            {
              "e": "🦫",
              "n": "Possum"
            }
          ],
          "a": 0
        }
      ]
    },
    {
      "id": "bedabenda",
      "kind": "odd",
      "category": "Benda & Energi",
      "ico": "🔎",
      "name": "Cari yang Beda: Benda",
      "desc": "Mana yang tidak sekelompok?",
      "color": "sky",
      "enabled": true,
      "perRound": 5,
      "groups": [
        {
          "q": "Mana yang bukan benda cair?",
          "items": [
            {
              "e": "🧊",
              "n": "Es"
            },
            {
              "e": "💧",
              "n": "Air"
            },
            {
              "e": "🥛",
              "n": "Susu"
            },
            {
              "e": "🍯",
              "n": "Madu"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan benda langit?",
          "items": [
            {
              "e": "🌳",
              "n": "Pohon"
            },
            {
              "e": "⭐",
              "n": "Bintang"
            },
            {
              "e": "🌙",
              "n": "Bulan"
            },
            {
              "e": "☀️",
              "n": "Matahari"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan alat tulis?",
          "items": [
            {
              "e": "🍴",
              "n": "Garpu"
            },
            {
              "e": "✏️",
              "n": "Pensil"
            },
            {
              "e": "🖊️",
              "n": "Pulpen"
            },
            {
              "e": "📏",
              "n": "Penggaris"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan sumber cahaya?",
          "items": [
            {
              "e": "🪨",
              "n": "Batu"
            },
            {
              "e": "☀️",
              "n": "Matahari"
            },
            {
              "e": "💡",
              "n": "Lampu"
            },
            {
              "e": "🕯️",
              "n": "Lilin"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang tidak bisa ditarik magnet?",
          "items": [
            {
              "e": "📕",
              "n": "Buku"
            },
            {
              "e": "🔩",
              "n": "Baut besi"
            },
            {
              "e": "📎",
              "n": "Klip"
            },
            {
              "e": "🥫",
              "n": "Kaleng"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan benda padat?",
          "items": [
            {
              "e": "💨",
              "n": "Asap"
            },
            {
              "e": "🪨",
              "n": "Batu"
            },
            {
              "e": "📕",
              "n": "Buku"
            },
            {
              "e": "🥄",
              "n": "Sendok"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan kendaraan?",
          "items": [
            {
              "e": "🏠",
              "n": "Rumah"
            },
            {
              "e": "🚗",
              "n": "Mobil"
            },
            {
              "e": "🚲",
              "n": "Sepeda"
            },
            {
              "e": "✈️",
              "n": "Pesawat"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan alat musik?",
          "items": [
            {
              "e": "🍳",
              "n": "Wajan"
            },
            {
              "e": "🥁",
              "n": "Drum"
            },
            {
              "e": "🎸",
              "n": "Gitar"
            },
            {
              "e": "🎹",
              "n": "Piano"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan benda gas?",
          "items": [
            {
              "e": "💧",
              "n": "Air"
            },
            {
              "e": "💨",
              "n": "Angin"
            },
            {
              "e": "🎈",
              "n": "Udara balon"
            },
            {
              "e": "☁️",
              "n": "Uap"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang tidak menghasilkan panas?",
          "items": [
            {
              "e": "🧊",
              "n": "Es"
            },
            {
              "e": "🔥",
              "n": "Api"
            },
            {
              "e": "☀️",
              "n": "Matahari"
            },
            {
              "e": "🕯️",
              "n": "Lilin"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan alat dapur?",
          "items": [
            {
              "e": "📚",
              "n": "Buku"
            },
            {
              "e": "🍴",
              "n": "Garpu"
            },
            {
              "e": "🥄",
              "n": "Sendok"
            },
            {
              "e": "🔪",
              "n": "Pisau"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan warna pelangi?",
          "items": [
            {
              "e": "🟤",
              "n": "Cokelat"
            },
            {
              "e": "🔴",
              "n": "Merah"
            },
            {
              "e": "🟡",
              "n": "Kuning"
            },
            {
              "e": "🔵",
              "n": "Biru"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan gejala cuaca?",
          "items": [
            {
              "e": "🏔️",
              "n": "Gunung"
            },
            {
              "e": "🌧️",
              "n": "Hujan"
            },
            {
              "e": "🌈",
              "n": "Pelangi"
            },
            {
              "e": "⛈️",
              "n": "Badai"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan benda elektronik?",
          "items": [
            {
              "e": "🪑",
              "n": "Kursi"
            },
            {
              "e": "📺",
              "n": "Televisi"
            },
            {
              "e": "📻",
              "n": "Radio"
            },
            {
              "e": "💻",
              "n": "Komputer"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan bentuk air?",
          "items": [
            {
              "e": "🪨",
              "n": "Batu"
            },
            {
              "e": "💧",
              "n": "Cair"
            },
            {
              "e": "🧊",
              "n": "Es"
            },
            {
              "e": "💨",
              "n": "Uap"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan alat kebersihan?",
          "items": [
            {
              "e": "🍽️",
              "n": "Piring"
            },
            {
              "e": "🧹",
              "n": "Sapu"
            },
            {
              "e": "🧽",
              "n": "Spons"
            },
            {
              "e": "🪣",
              "n": "Ember"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan sumber air?",
          "items": [
            {
              "e": "🔥",
              "n": "Api"
            },
            {
              "e": "🌊",
              "n": "Laut"
            },
            {
              "e": "🏞️",
              "n": "Sungai"
            },
            {
              "e": "🌧️",
              "n": "Hujan"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang tidak larut dalam air?",
          "items": [
            {
              "e": "🛢️",
              "n": "Minyak"
            },
            {
              "e": "🧂",
              "n": "Garam"
            },
            {
              "e": "🍬",
              "n": "Gula"
            },
            {
              "e": "🧊",
              "n": "Es"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan alat ukur?",
          "items": [
            {
              "e": "🖍️",
              "n": "Krayon"
            },
            {
              "e": "📏",
              "n": "Penggaris"
            },
            {
              "e": "⚖️",
              "n": "Timbangan"
            },
            {
              "e": "🌡️",
              "n": "Termometer"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan benda buatan manusia?",
          "items": [
            {
              "e": "🌙",
              "n": "Bulan"
            },
            {
              "e": "🚗",
              "n": "Mobil"
            },
            {
              "e": "🏠",
              "n": "Rumah"
            },
            {
              "e": "🪑",
              "n": "Kursi"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan alat pertukangan?",
          "items": [
            {
              "e": "🥄",
              "n": "Sendok"
            },
            {
              "e": "🔨",
              "n": "Palu"
            },
            {
              "e": "🪛",
              "n": "Obeng"
            },
            {
              "e": "🪚",
              "n": "Gergaji"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan sumber energi?",
          "items": [
            {
              "e": "🪨",
              "n": "Batu"
            },
            {
              "e": "☀️",
              "n": "Matahari"
            },
            {
              "e": "💨",
              "n": "Angin"
            },
            {
              "e": "💧",
              "n": "Air"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan alat komunikasi?",
          "items": [
            {
              "e": "🍽️",
              "n": "Piring"
            },
            {
              "e": "📱",
              "n": "Ponsel"
            },
            {
              "e": "📻",
              "n": "Radio"
            },
            {
              "e": "📺",
              "n": "Televisi"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang tidak terapung di air?",
          "items": [
            {
              "e": "🪨",
              "n": "Batu"
            },
            {
              "e": "🍂",
              "n": "Daun"
            },
            {
              "e": "🪵",
              "n": "Kayu"
            },
            {
              "e": "⛵",
              "n": "Perahu"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan benda tajam?",
          "items": [
            {
              "e": "🧸",
              "n": "Boneka"
            },
            {
              "e": "🔪",
              "n": "Pisau"
            },
            {
              "e": "✂️",
              "n": "Gunting"
            },
            {
              "e": "📌",
              "n": "Paku payung"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan pakaian?",
          "items": [
            {
              "e": "👟",
              "n": "Sepatu"
            },
            {
              "e": "👕",
              "n": "Baju"
            },
            {
              "e": "👖",
              "n": "Celana"
            },
            {
              "e": "🧥",
              "n": "Jaket"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan alat transportasi air?",
          "items": [
            {
              "e": "🚂",
              "n": "Kereta"
            },
            {
              "e": "⛵",
              "n": "Perahu"
            },
            {
              "e": "🚤",
              "n": "Speedboat"
            },
            {
              "e": "🛳️",
              "n": "Kapal"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang tidak memantulkan cahaya?",
          "items": [
            {
              "e": "🪨",
              "n": "Batu"
            },
            {
              "e": "🪞",
              "n": "Cermin"
            },
            {
              "e": "💧",
              "n": "Air"
            },
            {
              "e": "🥄",
              "n": "Sendok logam"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan bahan bakar?",
          "items": [
            {
              "e": "💧",
              "n": "Air"
            },
            {
              "e": "⛽",
              "n": "Bensin"
            },
            {
              "e": "🪵",
              "n": "Kayu"
            },
            {
              "e": "🔥",
              "n": "Arang"
            }
          ],
          "a": 0
        },
        {
          "q": "Mana yang bukan tempat tinggal?",
          "items": [
            {
              "e": "🚗",
              "n": "Mobil"
            },
            {
              "e": "🏠",
              "n": "Rumah"
            },
            {
              "e": "🏢",
              "n": "Apartemen"
            },
            {
              "e": "⛺",
              "n": "Tenda"
            }
          ],
          "a": 0
        }
      ]
    },
    {
      "id": "energi",
      "kind": "quiz",
      "category": "Benda & Energi",
      "ico": "⚡",
      "name": "Energi & Gaya",
      "desc": "Gaya, gerak, dan energi",
      "color": "grape",
      "enabled": true,
      "perRound": 8,
      "questions": [
        {
          "e": "💡",
          "q": "Lampu mengubah energi listrik menjadi…",
          "o": [
            "Cahaya",
            "Suara",
            "Gerak"
          ],
          "a": 0
        },
        {
          "e": "🍎",
          "q": "Gaya yang membuat buah jatuh adalah gaya…",
          "o": [
            "Gravitasi",
            "Gesek",
            "Magnet"
          ],
          "a": 0
        },
        {
          "e": "🔥",
          "q": "Setrika mengubah energi listrik menjadi…",
          "o": [
            "Panas",
            "Cahaya",
            "Gerak"
          ],
          "a": 0
        },
        {
          "e": "🚲",
          "q": "Mengayuh sepeda memberikan gaya…",
          "o": [
            "Dorongan",
            "Tarikan",
            "Diam"
          ],
          "a": 0
        },
        {
          "e": "🧲",
          "q": "Gaya yang menarik besi adalah gaya…",
          "o": [
            "Magnet",
            "Gesek",
            "Pegas"
          ],
          "a": 0
        },
        {
          "e": "🛝",
          "q": "Permukaan licin membuat benda mudah…",
          "o": [
            "Bergerak",
            "Berhenti",
            "Panas"
          ],
          "a": 0
        },
        {
          "e": "🔋",
          "q": "Baterai menyimpan energi…",
          "o": [
            "Listrik",
            "Angin",
            "Suara"
          ],
          "a": 0
        },
        {
          "e": "🪁",
          "q": "Layang-layang terbang karena…",
          "o": [
            "Angin",
            "Air",
            "Api"
          ],
          "a": 0
        },
        {
          "e": "🍚",
          "q": "Sumber energi utama tubuh adalah…",
          "o": [
            "Makanan",
            "Tidur",
            "Bermain"
          ],
          "a": 0
        },
        {
          "e": "🛑",
          "q": "Rem sepeda bekerja memakai gaya…",
          "o": [
            "Gesek",
            "Magnet",
            "Gravitasi"
          ],
          "a": 0
        },
        {
          "e": "📻",
          "q": "Radio mengubah energi listrik menjadi…",
          "o": [
            "Suara",
            "Cahaya",
            "Panas"
          ],
          "a": 0
        },
        {
          "e": "🌬️",
          "q": "Kincir angin memanfaatkan energi…",
          "o": [
            "Angin",
            "Air",
            "Matahari"
          ],
          "a": 0
        },
        {
          "e": "💧",
          "q": "Kincir air digerakkan oleh energi…",
          "o": [
            "Air",
            "Angin",
            "Listrik"
          ],
          "a": 0
        },
        {
          "e": "☀️",
          "q": "Panel surya mengubah energi…",
          "o": [
            "Matahari menjadi listrik",
            "Air menjadi panas",
            "Angin menjadi suara"
          ],
          "a": 0
        },
        {
          "e": "🚗",
          "q": "Mobil bergerak karena bahan bakar diubah jadi energi…",
          "o": [
            "Gerak",
            "Suara",
            "Cahaya"
          ],
          "a": 0
        },
        {
          "e": "🔦",
          "q": "Senter menyala menggunakan energi dari…",
          "o": [
            "Baterai",
            "Angin",
            "Air"
          ],
          "a": 0
        },
        {
          "e": "🎈",
          "q": "Balon meletus mengeluarkan energi…",
          "o": [
            "Suara",
            "Cahaya",
            "Magnet"
          ],
          "a": 0
        },
        {
          "e": "🪃",
          "q": "Benda dilempar akan jatuh karena…",
          "o": [
            "Gravitasi",
            "Angin",
            "Magnet"
          ],
          "a": 0
        },
        {
          "e": "⚽",
          "q": "Bola ditendang bergerak karena diberi…",
          "o": [
            "Gaya",
            "Warna",
            "Suara"
          ],
          "a": 0
        },
        {
          "e": "🧊",
          "q": "Es batu di tangan mencair karena…",
          "o": [
            "Panas tubuh",
            "Cahaya",
            "Angin"
          ],
          "a": 0
        },
        {
          "e": "🕯️",
          "q": "Lilin menyala menghasilkan energi cahaya dan…",
          "o": [
            "Panas",
            "Suara",
            "Gerak"
          ],
          "a": 0
        },
        {
          "e": "🔌",
          "q": "Alat listrik menyala saat…",
          "o": [
            "Dialiri listrik",
            "Dilempar",
            "Ditiup"
          ],
          "a": 0
        },
        {
          "e": "🧵",
          "q": "Karet ditarik lalu dilepas memiliki gaya…",
          "o": [
            "Pegas",
            "Magnet",
            "Gesek"
          ],
          "a": 0
        },
        {
          "e": "🛷",
          "q": "Benda meluncur di es karena gesekannya…",
          "o": [
            "Kecil",
            "Besar",
            "Hilang"
          ],
          "a": 0
        },
        {
          "e": "🏋️",
          "q": "Mengangkat beban memerlukan energi…",
          "o": [
            "Otot",
            "Cahaya",
            "Suara"
          ],
          "a": 0
        },
        {
          "e": "🌊",
          "q": "Air terjun menyimpan energi…",
          "o": [
            "Gerak",
            "Suara",
            "Magnet"
          ],
          "a": 0
        },
        {
          "e": "🔊",
          "q": "Speaker mengubah energi listrik menjadi…",
          "o": [
            "Suara",
            "Panas",
            "Cahaya"
          ],
          "a": 0
        },
        {
          "e": "🚪",
          "q": "Menutup pintu dengan menariknya memakai gaya…",
          "o": [
            "Tarikan",
            "Dorongan",
            "Magnet"
          ],
          "a": 0
        },
        {
          "e": "🌡️",
          "q": "Energi panas berpindah dari benda…",
          "o": [
            "Panas ke dingin",
            "Dingin ke panas",
            "Diam"
          ],
          "a": 0
        },
        {
          "e": "⛵",
          "q": "Perahu layar bergerak dibantu oleh…",
          "o": [
            "Angin",
            "Listrik",
            "Magnet"
          ],
          "a": 0
        }
      ]
    },
    {
      "id": "buahsayur",
      "kind": "sort",
      "category": "Makhluk Hidup",
      "ico": "🍎",
      "name": "Buah atau Sayur",
      "desc": "Kelompokkan yang tepat",
      "color": "leaf",
      "enabled": true,
      "hint": "Ini termasuk buah atau sayur?",
      "bins": [
        {
          "k": "buah",
          "l": "Buah",
          "e": "🍎",
          "color": "coral"
        },
        {
          "k": "sayur",
          "l": "Sayur",
          "e": "🥦",
          "color": "leaf"
        }
      ],
      "items": [
        {
          "e": "🍎",
          "n": "Apel",
          "k": "buah"
        },
        {
          "e": "🥕",
          "n": "Wortel",
          "k": "sayur"
        },
        {
          "e": "🍌",
          "n": "Pisang",
          "k": "buah"
        },
        {
          "e": "🥬",
          "n": "Bayam",
          "k": "sayur"
        },
        {
          "e": "🍇",
          "n": "Anggur",
          "k": "buah"
        },
        {
          "e": "🥦",
          "n": "Brokoli",
          "k": "sayur"
        },
        {
          "e": "🍊",
          "n": "Jeruk",
          "k": "buah"
        },
        {
          "e": "🌽",
          "n": "Jagung",
          "k": "sayur"
        },
        {
          "e": "🍉",
          "n": "Semangka",
          "k": "buah"
        },
        {
          "e": "🍆",
          "n": "Terong",
          "k": "sayur"
        },
        {
          "e": "🥭",
          "n": "Mangga",
          "k": "buah"
        },
        {
          "e": "🥔",
          "n": "Kentang",
          "k": "sayur"
        },
        {
          "e": "🍓",
          "n": "Stroberi",
          "k": "buah"
        },
        {
          "e": "🧅",
          "n": "Bawang",
          "k": "sayur"
        },
        {
          "e": "🍍",
          "n": "Nanas",
          "k": "buah"
        },
        {
          "e": "🥒",
          "n": "Timun",
          "k": "sayur"
        },
        {
          "e": "🍑",
          "n": "Ceri",
          "k": "buah"
        },
        {
          "e": "🫑",
          "n": "Paprika",
          "k": "sayur"
        },
        {
          "e": "🥝",
          "n": "Kiwi",
          "k": "buah"
        },
        {
          "e": "🍄",
          "n": "Jamur",
          "k": "sayur"
        },
        {
          "e": "🍐",
          "n": "Pir",
          "k": "buah"
        },
        {
          "e": "🥗",
          "n": "Selada",
          "k": "sayur"
        },
        {
          "e": "🍈",
          "n": "Melon",
          "k": "buah"
        },
        {
          "e": "🫛",
          "n": "Kacang polong",
          "k": "sayur"
        },
        {
          "e": "🍒",
          "n": "Cherry",
          "k": "buah"
        },
        {
          "e": "🧄",
          "n": "Bawang putih",
          "k": "sayur"
        },
        {
          "e": "🥥",
          "n": "Kelapa",
          "k": "buah"
        },
        {
          "e": "🥬",
          "n": "Kubis",
          "k": "sayur"
        },
        {
          "e": "🍋",
          "n": "Lemon",
          "k": "buah"
        },
        {
          "e": "🍠",
          "n": "Ubi",
          "k": "sayur"
        }
      ]
    },
    {
      "id": "kebiasaan",
      "kind": "sequence",
      "category": "Tubuh Manusia",
      "ico": "🪥",
      "name": "Kebiasaan Baik",
      "desc": "Susun langkahnya",
      "color": "pink",
      "enabled": true,
      "sequences": [
        {
          "t": "Mencuci tangan",
          "s": [
            {
              "e": "💧",
              "n": "Basahi tangan"
            },
            {
              "e": "🧼",
              "n": "Beri sabun"
            },
            {
              "e": "🙌",
              "n": "Gosok merata"
            },
            {
              "e": "🚿",
              "n": "Bilas air"
            }
          ]
        },
        {
          "t": "Sebelum tidur",
          "s": [
            {
              "e": "🍽️",
              "n": "Makan malam"
            },
            {
              "e": "🚿",
              "n": "Mandi"
            },
            {
              "e": "🪥",
              "n": "Gosok gigi"
            },
            {
              "e": "🛏️",
              "n": "Tidur"
            }
          ]
        },
        {
          "t": "Berangkat sekolah",
          "s": [
            {
              "e": "⏰",
              "n": "Bangun"
            },
            {
              "e": "🚿",
              "n": "Mandi"
            },
            {
              "e": "👕",
              "n": "Pakai seragam"
            },
            {
              "e": "🎒",
              "n": "Berangkat"
            }
          ]
        },
        {
          "t": "Menggosok gigi",
          "s": [
            {
              "e": "🪥",
              "n": "Ambil sikat"
            },
            {
              "e": "🧴",
              "n": "Beri pasta gigi"
            },
            {
              "e": "😁",
              "n": "Sikat gigi"
            },
            {
              "e": "💧",
              "n": "Kumur"
            }
          ]
        },
        {
          "t": "Sebelum makan",
          "s": [
            {
              "e": "🧼",
              "n": "Cuci tangan"
            },
            {
              "e": "🍽️",
              "n": "Siapkan makanan"
            },
            {
              "e": "🙏",
              "n": "Berdoa"
            },
            {
              "e": "😋",
              "n": "Makan"
            }
          ]
        },
        {
          "t": "Membersihkan kamar",
          "s": [
            {
              "e": "🛏️",
              "n": "Rapikan tempat tidur"
            },
            {
              "e": "🧹",
              "n": "Menyapu"
            },
            {
              "e": "🧽",
              "n": "Mengelap"
            },
            {
              "e": "🧺",
              "n": "Rapikan barang"
            }
          ]
        },
        {
          "t": "Mengerjakan PR",
          "s": [
            {
              "e": "📖",
              "n": "Buka buku"
            },
            {
              "e": "✏️",
              "n": "Baca soal"
            },
            {
              "e": "📝",
              "n": "Menulis jawaban"
            },
            {
              "e": "✅",
              "n": "Selesai"
            }
          ]
        },
        {
          "t": "Setelah bermain",
          "s": [
            {
              "e": "🧸",
              "n": "Selesai bermain"
            },
            {
              "e": "🧹",
              "n": "Rapikan mainan"
            },
            {
              "e": "🧼",
              "n": "Cuci tangan"
            },
            {
              "e": "💧",
              "n": "Minum"
            }
          ]
        },
        {
          "t": "Sebelum sekolah pagi",
          "s": [
            {
              "e": "⏰",
              "n": "Bangun pagi"
            },
            {
              "e": "🛏️",
              "n": "Rapikan kasur"
            },
            {
              "e": "🚿",
              "n": "Mandi"
            },
            {
              "e": "🍳",
              "n": "Sarapan"
            }
          ]
        },
        {
          "t": "Membuang sampah",
          "s": [
            {
              "e": "🗑️",
              "n": "Ambil sampah"
            },
            {
              "e": "♻️",
              "n": "Pilah jenisnya"
            },
            {
              "e": "🚮",
              "n": "Buang ke tempatnya"
            },
            {
              "e": "🧼",
              "n": "Cuci tangan"
            }
          ]
        },
        {
          "t": "Setelah dari toilet",
          "s": [
            {
              "e": "🚽",
              "n": "Selesai"
            },
            {
              "e": "🚿",
              "n": "Siram"
            },
            {
              "e": "🧼",
              "n": "Cuci tangan"
            },
            {
              "e": "🧻",
              "n": "Keringkan"
            }
          ]
        },
        {
          "t": "Sebelum berolahraga",
          "s": [
            {
              "e": "👟",
              "n": "Pakai sepatu"
            },
            {
              "e": "🤸",
              "n": "Pemanasan"
            },
            {
              "e": "🏃",
              "n": "Berolahraga"
            },
            {
              "e": "💧",
              "n": "Minum air"
            }
          ]
        },
        {
          "t": "Merawat tanaman",
          "s": [
            {
              "e": "🪴",
              "n": "Lihat tanaman"
            },
            {
              "e": "💧",
              "n": "Siram air"
            },
            {
              "e": "☀️",
              "n": "Jemur di matahari"
            },
            {
              "e": "🌱",
              "n": "Tumbuh subur"
            }
          ]
        },
        {
          "t": "Membaca buku",
          "s": [
            {
              "e": "📚",
              "n": "Pilih buku"
            },
            {
              "e": "🪑",
              "n": "Duduk rapi"
            },
            {
              "e": "📖",
              "n": "Membaca"
            },
            {
              "e": "🔖",
              "n": "Tandai halaman"
            }
          ]
        },
        {
          "t": "Makan buah",
          "s": [
            {
              "e": "🍎",
              "n": "Ambil buah"
            },
            {
              "e": "💧",
              "n": "Cuci bersih"
            },
            {
              "e": "🔪",
              "n": "Potong"
            },
            {
              "e": "😋",
              "n": "Dimakan"
            }
          ]
        },
        {
          "t": "Sebelum menyeberang jalan",
          "s": [
            {
              "e": "🛑",
              "n": "Berhenti"
            },
            {
              "e": "👀",
              "n": "Lihat kanan kiri"
            },
            {
              "e": "✋",
              "n": "Angkat tangan"
            },
            {
              "e": "🚶",
              "n": "Menyeberang"
            }
          ]
        },
        {
          "t": "Merapikan meja belajar",
          "s": [
            {
              "e": "📚",
              "n": "Kumpulkan buku"
            },
            {
              "e": "✏️",
              "n": "Rapikan alat tulis"
            },
            {
              "e": "🧽",
              "n": "Lap meja"
            },
            {
              "e": "✨",
              "n": "Bersih"
            }
          ]
        },
        {
          "t": "Mandi yang benar",
          "s": [
            {
              "e": "🚿",
              "n": "Basahi badan"
            },
            {
              "e": "🧼",
              "n": "Pakai sabun"
            },
            {
              "e": "💧",
              "n": "Bilas"
            },
            {
              "e": "🧺",
              "n": "Keringkan"
            }
          ]
        },
        {
          "t": "Sebelum tidur siang",
          "s": [
            {
              "e": "🍽️",
              "n": "Makan siang"
            },
            {
              "e": "🦷",
              "n": "Sikat gigi"
            },
            {
              "e": "📖",
              "n": "Baca buku"
            },
            {
              "e": "😴",
              "n": "Tidur siang"
            }
          ]
        },
        {
          "t": "Membantu ibu",
          "s": [
            {
              "e": "🍽️",
              "n": "Bawa piring kotor"
            },
            {
              "e": "💧",
              "n": "Cuci piring"
            },
            {
              "e": "🧽",
              "n": "Bilas"
            },
            {
              "e": "🗄️",
              "n": "Simpan"
            }
          ]
        },
        {
          "t": "Menyiram bunga",
          "s": [
            {
              "e": "🪣",
              "n": "Ambil air"
            },
            {
              "e": "🌸",
              "n": "Dekati bunga"
            },
            {
              "e": "💧",
              "n": "Siram"
            },
            {
              "e": "🌷",
              "n": "Bunga segar"
            }
          ]
        },
        {
          "t": "Belajar di malam hari",
          "s": [
            {
              "e": "📚",
              "n": "Siapkan buku"
            },
            {
              "e": "💡",
              "n": "Nyalakan lampu"
            },
            {
              "e": "✏️",
              "n": "Belajar"
            },
            {
              "e": "😴",
              "n": "Istirahat"
            }
          ]
        },
        {
          "t": "Setelah bangun tidur",
          "s": [
            {
              "e": "😴",
              "n": "Bangun"
            },
            {
              "e": "🙆",
              "n": "Regangkan badan"
            },
            {
              "e": "🛏️",
              "n": "Rapikan kasur"
            },
            {
              "e": "🚿",
              "n": "Cuci muka"
            }
          ]
        },
        {
          "t": "Memakai sepatu",
          "s": [
            {
              "e": "🧦",
              "n": "Pakai kaus kaki"
            },
            {
              "e": "👟",
              "n": "Pakai sepatu"
            },
            {
              "e": "🎀",
              "n": "Ikat tali"
            },
            {
              "e": "🚶",
              "n": "Siap jalan"
            }
          ]
        },
        {
          "t": "Menabung",
          "s": [
            {
              "e": "💰",
              "n": "Punya uang"
            },
            {
              "e": "🐷",
              "n": "Masukkan celengan"
            },
            {
              "e": "⏳",
              "n": "Menunggu penuh"
            },
            {
              "e": "🎁",
              "n": "Beli keperluan"
            }
          ]
        },
        {
          "t": "Menjaga kebersihan kelas",
          "s": [
            {
              "e": "🧹",
              "n": "Menyapu"
            },
            {
              "e": "🗑️",
              "n": "Buang sampah"
            },
            {
              "e": "🧽",
              "n": "Lap papan"
            },
            {
              "e": "✨",
              "n": "Kelas bersih"
            }
          ]
        },
        {
          "t": "Sebelum berdoa makan",
          "s": [
            {
              "e": "🪑",
              "n": "Duduk rapi"
            },
            {
              "e": "🤲",
              "n": "Tangan menengadah"
            },
            {
              "e": "🙏",
              "n": "Berdoa"
            },
            {
              "e": "😋",
              "n": "Mulai makan"
            }
          ]
        },
        {
          "t": "Merawat mata",
          "s": [
            {
              "e": "📖",
              "n": "Baca dengan terang"
            },
            {
              "e": "↔️",
              "n": "Jaga jarak"
            },
            {
              "e": "😌",
              "n": "Istirahatkan mata"
            },
            {
              "e": "🥕",
              "n": "Makan wortel"
            }
          ]
        },
        {
          "t": "Membuat jadwal harian",
          "s": [
            {
              "e": "📝",
              "n": "Tulis kegiatan"
            },
            {
              "e": "⏰",
              "n": "Atur waktu"
            },
            {
              "e": "✅",
              "n": "Lakukan"
            },
            {
              "e": "😊",
              "n": "Selesai"
            }
          ]
        },
        {
          "t": "Setelah makan",
          "s": [
            {
              "e": "🍽️",
              "n": "Selesai makan"
            },
            {
              "e": "🙏",
              "n": "Bersyukur"
            },
            {
              "e": "💧",
              "n": "Minum"
            },
            {
              "e": "🪥",
              "n": "Kumur"
            }
          ]
        }
      ]
    },
    {
      "id": "hewanmakan",
      "kind": "match",
      "category": "Makhluk Hidup",
      "ico": "🍽️",
      "name": "Hewan & Makanannya",
      "desc": "Cocokkan yang tepat",
      "color": "coral",
      "enabled": true,
      "sets": [
        {
          "t": "Set Hewan 1",
          "pairs": [
            {
              "le": "🐰",
              "l": "Kelinci",
              "re": "🥕",
              "r": "Wortel"
            },
            {
              "le": "🐵",
              "l": "Monyet",
              "re": "🍌",
              "r": "Pisang"
            },
            {
              "le": "🐼",
              "l": "Panda",
              "re": "🎋",
              "r": "Bambu"
            },
            {
              "le": "🐭",
              "l": "Tikus",
              "re": "🧀",
              "r": "Keju"
            },
            {
              "le": "🐝",
              "l": "Lebah",
              "re": "🌸",
              "r": "Nektar bunga"
            },
            {
              "le": "🐈",
              "l": "Kucing",
              "re": "🐟",
              "r": "Ikan"
            }
          ]
        },
        {
          "t": "Set Hewan 2",
          "pairs": [
            {
              "le": "🐕",
              "l": "Anjing",
              "re": "🦴",
              "r": "Tulang"
            },
            {
              "le": "🐄",
              "l": "Sapi",
              "re": "🌿",
              "r": "Rumput"
            },
            {
              "le": "🐐",
              "l": "Kambing",
              "re": "🍃",
              "r": "Daun"
            },
            {
              "le": "🐔",
              "l": "Ayam",
              "re": "🌾",
              "r": "Biji-bijian"
            },
            {
              "le": "🦁",
              "l": "Singa",
              "re": "🍖",
              "r": "Daging"
            },
            {
              "le": "🐨",
              "l": "Koala",
              "re": "🌿",
              "r": "Daun eukaliptus"
            }
          ]
        },
        {
          "t": "Set Hewan 3",
          "pairs": [
            {
              "le": "🐿️",
              "l": "Tupai",
              "re": "🌰",
              "r": "Kacang"
            },
            {
              "le": "🐘",
              "l": "Gajah",
              "re": "🌿",
              "r": "Rumput dan daun"
            },
            {
              "le": "🦒",
              "l": "Jerapah",
              "re": "🍃",
              "r": "Daun tinggi"
            },
            {
              "le": "🐝",
              "l": "Lebah",
              "re": "🍯",
              "r": "Sarang madu"
            },
            {
              "le": "🐦",
              "l": "Burung",
              "re": "🪺",
              "r": "Sarang"
            },
            {
              "le": "🕷️",
              "l": "Laba-laba",
              "re": "🕸️",
              "r": "Jaring"
            }
          ]
        },
        {
          "t": "Set Hewan 4",
          "pairs": [
            {
              "le": "🐜",
              "l": "Semut",
              "re": "🏔️",
              "r": "Sarang tanah"
            },
            {
              "le": "🐻",
              "l": "Beruang",
              "re": "🕳️",
              "r": "Gua"
            },
            {
              "le": "🐟",
              "l": "Ikan",
              "re": "🌊",
              "r": "Air"
            },
            {
              "le": "🐫",
              "l": "Unta",
              "re": "🏜️",
              "r": "Gurun"
            },
            {
              "le": "🐧",
              "l": "Penguin",
              "re": "🧊",
              "r": "Kutub"
            },
            {
              "le": "🦫",
              "l": "Berang-berang",
              "re": "🪵",
              "r": "Bendungan"
            }
          ]
        },
        {
          "t": "Set Hewan 5",
          "pairs": [
            {
              "le": "🐴",
              "l": "Kuda",
              "re": "🏠",
              "r": "Kandang"
            },
            {
              "le": "🐄",
              "l": "Sapi",
              "re": "🔊",
              "r": "Moo"
            },
            {
              "le": "🐱",
              "l": "Kucing",
              "re": "🔊",
              "r": "Meong"
            },
            {
              "le": "🐶",
              "l": "Anjing",
              "re": "🔊",
              "r": "Guk"
            },
            {
              "le": "🐔",
              "l": "Ayam",
              "re": "🔊",
              "r": "Petok"
            },
            {
              "le": "🐸",
              "l": "Katak",
              "re": "🔊",
              "r": "Kwok"
            }
          ]
        }
      ]
    },
    {
      "id": "tatasurya",
      "kind": "memory",
      "category": "Bumi & Antariksa",
      "ico": "🌌",
      "name": "Kartu Tata Surya",
      "desc": "Cari pasangan kartunya",
      "color": "grape",
      "enabled": true,
      "pairs": [
        {
          "a": "☀️",
          "b": "Matahari"
        },
        {
          "a": "🌍",
          "b": "Bumi"
        },
        {
          "a": "🌙",
          "b": "Bulan"
        },
        {
          "a": "⭐",
          "b": "Bintang"
        },
        {
          "a": "🪐",
          "b": "Saturnus"
        },
        {
          "a": "🚀",
          "b": "Roket"
        },
        {
          "a": "☄️",
          "b": "Komet"
        },
        {
          "a": "👨‍🚀",
          "b": "Astronaut"
        },
        {
          "a": "🔴",
          "b": "Mars"
        },
        {
          "a": "🌌",
          "b": "Galaksi"
        },
        {
          "a": "🛰️",
          "b": "Satelit"
        },
        {
          "a": "🔭",
          "b": "Teleskop"
        },
        {
          "a": "🌠",
          "b": "Meteor"
        },
        {
          "a": "🌑",
          "b": "Bulan baru"
        },
        {
          "a": "🌕",
          "b": "Bulan purnama"
        },
        {
          "a": "🪨",
          "b": "Asteroid"
        },
        {
          "a": "🌞",
          "b": "Siang"
        },
        {
          "a": "🌛",
          "b": "Malam"
        },
        {
          "a": "🧑‍🚀",
          "b": "Antariksawan"
        },
        {
          "a": "🛸",
          "b": "UFO"
        },
        {
          "a": "💫",
          "b": "Bintang jatuh"
        },
        {
          "a": "🌡️",
          "b": "Suhu"
        },
        {
          "a": "🧊",
          "b": "Planet es"
        },
        {
          "a": "🔥",
          "b": "Planet panas"
        },
        {
          "a": "🌏",
          "b": "Dunia"
        },
        {
          "a": "🌗",
          "b": "Fase bulan"
        },
        {
          "a": "🌘",
          "b": "Gerhana"
        },
        {
          "a": "⚡",
          "b": "Kilat kosmik"
        },
        {
          "a": "🌒",
          "b": "Bulan sabit"
        },
        {
          "a": "🌟",
          "b": "Bintang terang"
        }
      ]
    },
    {
      "id": "labor",
      "kind": "lab",
      "category": "Benda & Energi",
      "ico": "🧪",
      "name": "Laboratorium Ajaib",
      "desc": "Campur dua bahan jadi sesuatu",
      "color": "grape",
      "enabled": true,
      "hint": "Ketuk dua bahan yang tepat!",
      "perRound": 8,
      "recipes": [
        {
          "e": "🧊",
          "t": "Es Batu",
          "a": {
            "e": "💧",
            "n": "Air"
          },
          "b": {
            "e": "❄️",
            "n": "Suhu Dingin"
          },
          "w": "Air yang didinginkan sampai 0°C membeku menjadi es. Wujudnya berubah dari cair jadi padat."
        },
        {
          "e": "💨",
          "t": "Uap Air",
          "a": {
            "e": "💧",
            "n": "Air"
          },
          "b": {
            "e": "🔥",
            "n": "Panas"
          },
          "w": "Air yang dipanaskan menguap. Itulah asap putih yang keluar dari panci mendidih."
        },
        {
          "e": "💧",
          "t": "Air",
          "a": {
            "e": "🧊",
            "n": "Es Batu"
          },
          "b": {
            "e": "☀️",
            "n": "Sinar Matahari"
          },
          "w": "Es yang terkena panas mencair kembali menjadi air. Perubahan wujud bisa bolak-balik!"
        },
        {
          "e": "🌈",
          "t": "Pelangi",
          "a": {
            "e": "💧",
            "n": "Titik Hujan"
          },
          "b": {
            "e": "☀️",
            "n": "Sinar Matahari"
          },
          "w": "Cahaya matahari terurai jadi tujuh warna saat menembus titik-titik air di udara."
        },
        {
          "e": "🌱",
          "t": "Kecambah",
          "a": {
            "e": "🌰",
            "n": "Biji"
          },
          "b": {
            "e": "💧",
            "n": "Air"
          },
          "w": "Biji yang disiram akan berkecambah — tunas kecilnya keluar mencari cahaya."
        },
        {
          "e": "🌳",
          "t": "Pohon Besar",
          "a": {
            "e": "🌱",
            "n": "Kecambah"
          },
          "b": {
            "e": "⏳",
            "n": "Waktu"
          },
          "w": "Tumbuhan butuh waktu bertahun-tahun untuk tumbuh besar. Sabar itu bagian dari sains!"
        },
        {
          "e": "🍃",
          "t": "Makanan Tumbuhan",
          "a": {
            "e": "🍀",
            "n": "Daun Hijau"
          },
          "b": {
            "e": "☀️",
            "n": "Sinar Matahari"
          },
          "w": "Daun hijau memasak makanannya sendiri memakai cahaya matahari. Namanya fotosintesis."
        },
        {
          "e": "☁️",
          "t": "Awan",
          "a": {
            "e": "💨",
            "n": "Uap Air"
          },
          "b": {
            "e": "🌬️",
            "n": "Udara Dingin"
          },
          "w": "Uap air yang naik lalu mendingin berkumpul menjadi awan."
        },
        {
          "e": "🌧️",
          "t": "Hujan",
          "a": {
            "e": "☁️",
            "n": "Awan Tebal"
          },
          "b": {
            "e": "🌡️",
            "n": "Udara Sejuk"
          },
          "w": "Titik air di awan makin berat, lalu jatuh ke bumi sebagai hujan."
        },
        {
          "e": "🌩️",
          "t": "Petir",
          "a": {
            "e": "☁️",
            "n": "Awan Badai"
          },
          "b": {
            "e": "⚡",
            "n": "Muatan Listrik"
          },
          "w": "Muatan listrik yang meloncat di dalam awan membuat kilat dan suara guruh."
        },
        {
          "e": "🌫️",
          "t": "Embun",
          "a": {
            "e": "💨",
            "n": "Uap Air"
          },
          "b": {
            "e": "🌿",
            "n": "Rumput Dingin"
          },
          "w": "Pagi hari uap air menempel di rumput yang dingin dan berubah jadi titik embun."
        },
        {
          "e": "🔥",
          "t": "Api Unggun",
          "a": {
            "e": "🪵",
            "n": "Kayu Kering"
          },
          "b": {
            "e": "🕯️",
            "n": "Nyala Korek"
          },
          "w": "Api butuh tiga hal: bahan bakar, panas, dan udara. Hilang satu, api padam."
        },
        {
          "e": "🍫",
          "t": "Cokelat Cair",
          "a": {
            "e": "🍫",
            "n": "Cokelat Batang"
          },
          "b": {
            "e": "🔥",
            "n": "Panas"
          },
          "w": "Cokelat padat meleleh jadi cair saat dipanaskan, lalu memadat lagi kalau didinginkan."
        },
        {
          "e": "🍦",
          "t": "Es Krim Meleleh",
          "a": {
            "e": "🍨",
            "n": "Es Krim"
          },
          "b": {
            "e": "☀️",
            "n": "Sinar Matahari"
          },
          "w": "Es krim mencair karena panas. Makanya harus cepat dimakan di siang hari!"
        },
        {
          "e": "🥤",
          "t": "Air Sirup",
          "a": {
            "e": "💧",
            "n": "Air"
          },
          "b": {
            "e": "🍬",
            "n": "Sirup Manis"
          },
          "w": "Sirup larut di dalam air. Campuran yang menyatu seperti ini disebut larutan."
        },
        {
          "e": "🧂",
          "t": "Air Garam",
          "a": {
            "e": "💧",
            "n": "Air"
          },
          "b": {
            "e": "🧂",
            "n": "Garam"
          },
          "w": "Garam larut sampai tak terlihat, tapi rasanya tetap ada. Ia tidak hilang, hanya menyebar."
        },
        {
          "e": "🫧",
          "t": "Busa Sabun",
          "a": {
            "e": "🧼",
            "n": "Sabun"
          },
          "b": {
            "e": "💧",
            "n": "Air"
          },
          "w": "Sabun membuat air bisa memerangkap udara sehingga terbentuk gelembung."
        },
        {
          "e": "🎈",
          "t": "Balon Terbang",
          "a": {
            "e": "🎈",
            "n": "Balon"
          },
          "b": {
            "e": "🎐",
            "n": "Gas Ringan"
          },
          "w": "Gas yang lebih ringan dari udara membuat balon naik ke atas."
        },
        {
          "e": "⚡",
          "t": "Listrik Statis",
          "a": {
            "e": "🎈",
            "n": "Balon"
          },
          "b": {
            "e": "🧶",
            "n": "Kain Wol"
          },
          "w": "Balon yang digosok ke kain wol bisa menarik rambut dan potongan kertas kecil."
        },
        {
          "e": "💡",
          "t": "Lampu Menyala",
          "a": {
            "e": "🔋",
            "n": "Baterai"
          },
          "b": {
            "e": "💡",
            "n": "Bohlam"
          },
          "w": "Listrik mengalir dari baterai ke bohlam lewat kabel, lalu berubah jadi cahaya."
        },
        {
          "e": "🧲",
          "t": "Tarikan Magnet",
          "a": {
            "e": "🧲",
            "n": "Magnet"
          },
          "b": {
            "e": "🔩",
            "n": "Paku Besi"
          },
          "w": "Magnet menarik benda dari besi, tapi tidak menarik plastik atau kayu."
        },
        {
          "e": "🔊",
          "t": "Bunyi",
          "a": {
            "e": "🥁",
            "n": "Benda Bergetar"
          },
          "b": {
            "e": "🌬️",
            "n": "Udara"
          },
          "w": "Bunyi merambat lewat udara. Di ruang hampa tanpa udara, tidak ada suara sama sekali."
        },
        {
          "e": "🌑",
          "t": "Bayangan",
          "a": {
            "e": "💡",
            "n": "Cahaya"
          },
          "b": {
            "e": "🧱",
            "n": "Benda Gelap"
          },
          "w": "Bayangan muncul karena cahaya tidak bisa menembus benda yang gelap."
        },
        {
          "e": "🚲",
          "t": "Sepeda Berjalan",
          "a": {
            "e": "🚲",
            "n": "Sepeda"
          },
          "b": {
            "e": "💪",
            "n": "Gaya Dorong"
          },
          "w": "Benda diam baru bergerak kalau ada gaya yang mendorong atau menariknya."
        },
        {
          "e": "🦋",
          "t": "Kupu-kupu",
          "a": {
            "e": "🐛",
            "n": "Ulat"
          },
          "b": {
            "e": "⏳",
            "n": "Waktu"
          },
          "w": "Ulat berubah jadi kepompong, lalu jadi kupu-kupu. Perubahan ini disebut metamorfosis."
        },
        {
          "e": "🐔",
          "t": "Anak Ayam",
          "a": {
            "e": "🥚",
            "n": "Telur"
          },
          "b": {
            "e": "🪶",
            "n": "Kehangatan Induk"
          },
          "w": "Telur menetas setelah dierami sekitar 21 hari agar tetap hangat."
        },
        {
          "e": "🍂",
          "t": "Kompos",
          "a": {
            "e": "🍁",
            "n": "Daun Kering"
          },
          "b": {
            "e": "🪱",
            "n": "Cacing Tanah"
          },
          "w": "Sampah daun diurai cacing dan jamur menjadi pupuk yang menyuburkan tanah."
        },
        {
          "e": "🦴",
          "t": "Tulang Kuat",
          "a": {
            "e": "🥛",
            "n": "Susu"
          },
          "b": {
            "e": "☀️",
            "n": "Sinar Matahari"
          },
          "w": "Kalsium dari susu dan vitamin D dari matahari pagi bekerja sama menguatkan tulang."
        },
        {
          "e": "😃",
          "t": "Badan Segar",
          "a": {
            "e": "🛏️",
            "n": "Tidur Cukup"
          },
          "b": {
            "e": "🥗",
            "n": "Makanan Sehat"
          },
          "w": "Tubuh memperbaiki dirinya saat kita tidur, dan bahan perbaikannya datang dari makanan."
        },
        {
          "e": "🌬️",
          "t": "Angin",
          "a": {
            "e": "🌡️",
            "n": "Udara Panas"
          },
          "b": {
            "e": "❄️",
            "n": "Udara Sejuk"
          },
          "w": "Udara panas naik, udara sejuk mengalir mengisinya. Aliran itulah yang kita rasakan sebagai angin."
        }
      ]
    }
  ],
};

var COLOR_KEYS = ["teal", "sun", "coral", "leaf", "grape", "sky", "pink"];

var KIND_LABEL = {
  quiz: "Kuis pilihan ganda",
  truefalse: "Benar atau Salah",
  odd: "Cari yang Beda",
  sort: "Kelompokkan ke wadah",
  sequence: "Susun urutan",
  match: "Pasangkan kiri–kanan",
  memory: "Kartu Ingatan",
  lab: "Laboratorium (campur 2 bahan)",
};

/* ---------------------------------------------------------------------
 * 2. WARNA
 *
 * Admin cukup memilih SATU warna dasar per slot. Varian gelap (bayangan
 * tebal khas gaya kartun ini), varian lembut, dan warna teks yang kontras
 * semuanya dihitung dari situ.
 * ------------------------------------------------------------------- */

function parseHex(hex) {
  var h = String(hex || "").trim().replace(/^#/, "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return [0, 0, 0];
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function toHex(r, g, b) {
  function c(n) {
    var v = Math.max(0, Math.min(255, Math.round(n)));
    return (v < 16 ? "0" : "") + v.toString(16);
  }
  return "#" + c(r) + c(g) + c(b);
}

/** Menggelapkan warna — untuk bayangan tombol. */
function shade(hex, amount) {
  var a = amount === undefined ? 0.28 : amount;
  var c = parseHex(hex);
  return toHex(c[0] * (1 - a), c[1] * (1 - a), c[2] * (1 - a));
}

/** Melembutkan warna ke arah putih — untuk latar jawaban benar/salah. */
function tint(hex, amount) {
  var a = amount === undefined ? 0.82 : amount;
  var c = parseHex(hex);
  return toHex(
    c[0] + (255 - c[0]) * a,
    c[1] + (255 - c[1]) * a,
    c[2] + (255 - c[2]) * a
  );
}

/**
 * Putih atau gelap — mana pun yang lebih terbaca di atas `hex`.
 * Ini yang menjaga teks tetap terbaca berapa pun warna pilihan admin.
 */
function readableOn(hex) {
  var c = parseHex(hex);
  function lin(v) {
    var s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  }
  var L = 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  return L > 0.45 ? "#2A2A2A" : "#FFFFFF";
}

/** Menerapkan palet brand ke CSS custom properties di :root. */
function applyBrand(brand) {
  var root = document.documentElement.style;
  root.setProperty("--ink", brand.ink);
  root.setProperty("--paper", brand.paper);
  root.setProperty("--bg-from", brand.bgFrom);
  root.setProperty("--bg-mid", brand.bgMid);
  root.setProperty("--bg-to", brand.bgTo);
  for (var i = 0; i < COLOR_KEYS.length; i++) {
    var k = COLOR_KEYS[i];
    var base = brand.colors[k];
    root.setProperty("--" + k, base);
    root.setProperty("--" + k + "-d", shade(base));
    root.setProperty("--" + k + "-t", tint(base));
    root.setProperty("--" + k + "-on", readableOn(base));
  }
}

/* ---------------------------------------------------------------------
 * 3. VALIDASI
 *
 * Config bisa datang dari panel admin, dari file config.json yang diedit
 * tangan, atau dari file impor. Apa pun sumbernya harus lewat sini dulu:
 * field tak dikenal diganti nilai bawaan, dan entri yang mustahil dimainkan
 * (soal tanpa pilihan, item yang menunjuk wadah tak ada) dibuang.
 *
 * Tujuannya satu: satu salah ketik di JSON tidak boleh membuat game blank.
 * ------------------------------------------------------------------- */

function isObj(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function str(v, fb) {
  return typeof v === "string" ? v : fb;
}

function bool(v, fb) {
  return typeof v === "boolean" ? v : fb;
}

function int(v, fb, min, max) {
  var n = typeof v === "number" ? Math.round(v) : NaN;
  if (!isFinite(n)) return fb;
  return Math.max(min, Math.min(max, n));
}

function hexOr(v, fb) {
  return typeof v === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v.trim())
    ? v.trim()
    : fb;
}

function colorKeyOr(v, fb) {
  return COLOR_KEYS.indexOf(v) !== -1 ? v : fb;
}

function strList(v, fb) {
  if (!Array.isArray(v)) return fb;
  var out = v.filter(function (x) {
    return typeof x === "string" && x !== "";
  });
  return out.length ? out : fb;
}

function normalizeBrand(raw) {
  var b = isObj(raw) ? raw : {};
  var D = DEFAULT_CONFIG.brand;
  var rawColors = isObj(b.colors) ? b.colors : {};
  var colors = {};
  for (var i = 0; i < COLOR_KEYS.length; i++) {
    var k = COLOR_KEYS[i];
    colors[k] = hexOr(rawColors[k], D.colors[k]);
  }
  return {
    appName: str(b.appName, D.appName),
    tagline: str(b.tagline, D.tagline),
    mascotName: str(b.mascotName, D.mascotName),
    logoUrl: str(b.logoUrl, ""),
    faviconEmoji: str(b.faviconEmoji, D.faviconEmoji),
    footnote: str(b.footnote, D.footnote),
    colors: colors,
    ink: hexOr(b.ink, D.ink),
    paper: hexOr(b.paper, D.paper),
    bgFrom: hexOr(b.bgFrom, D.bgFrom),
    bgMid: hexOr(b.bgMid, D.bgMid),
    bgTo: hexOr(b.bgTo, D.bgTo),
    /* Doodle boleh sengaja dikosongkan admin, jadi array kosong dihormati
       (tidak diganti bawaan seperti daftar yang lain). */
    doodles: Array.isArray(b.doodles)
      ? b.doodles.filter(function (x) {
          return typeof x === "string" && x !== "";
        })
      : D.doodles.slice(),
    homeMessages: strList(b.homeMessages, D.homeMessages),
    goodMessages: strList(b.goodMessages, D.goodMessages),
    soundOn: bool(b.soundOn, true),
    levels: normalizeLevels(b.levels),
    starsPerSticker: int(b.starsPerSticker, D.starsPerSticker, 1, 500),
    stickers: normalizeStickers(b.stickers),
    /* Peta petualangan: pos berikutnya baru terbuka setelah pos sebelumnya
       DIMAINKAN. Bisa dimatikan admin kalau kelasnya butuh akses bebas. */
    mapLock: bool(b.mapLock, D.mapLock),
    adminPassword: str(b.adminPassword, D.adminPassword),
  };
}

/**
 * Album stiker. Boleh dikosongkan admin — album lalu hilang dari layar anak,
 * bukan jatuh ke bawaan. Itu pilihan yang sah: sebagian sekolah cuma mau
 * bintang polos.
 */
function normalizeStickers(raw) {
  if (!Array.isArray(raw)) return DEFAULT_CONFIG.brand.stickers.slice();
  return raw
    .filter(isObj)
    .map(function (s) {
      return { e: str(s.e, "⭐"), n: str(s.n, "") };
    })
    .filter(function (s) {
      return s.n.trim() !== "";
    })
    /* Album raksasa bikin layar anak jadi dinding emoji — cukupkan di 120. */
    .slice(0, 120);
}

/**
 * Level selalu tepat tiga, dengan id tetap (mudah/sedang/sulit).
 * Admin boleh mengganti NAMA dan keterangannya, tapi tidak jumlah maupun id-nya
 * — id itulah yang dipakai roundSize() untuk menentukan panjang ronde, dan yang
 * tersimpan di preferensi pemain.
 */
function normalizeLevels(raw) {
  var D = DEFAULT_CONFIG.brand.levels;
  var list = Array.isArray(raw) ? raw : [];
  return D.map(function (def) {
    var found = list.filter(function (l) { return isObj(l) && l.id === def.id; })[0] || {};
    return {
      id: def.id,
      name: str(found.name, def.name),
      desc: str(found.desc, def.desc),
    };
  });
}

/**
 * Berapa banyak soal/item yang keluar dalam satu ronde, menurut level.
 *
 * Level TIDAK mengganti isi bank soal — hanya memotong panjangnya. Dengan
 * begitu guru cukup mengurus satu bank soal, dan ketiga level tetap bekerja
 * berapa pun jumlah soal yang ada.
 */
function roundSize(module, levelId) {
  if (module.kind === "quiz") {
    var tq = module.questions.length;
    if (levelId === "mudah") return Math.min(5, tq);
    if (levelId === "sulit") return tq;
    return Math.min(module.perRound, tq);
  }
  if (module.kind === "truefalse") {
    var tt = module.statements.length;
    if (levelId === "mudah") return Math.min(5, tt);
    if (levelId === "sulit") return tt;
    return Math.min(module.perRound, tt);
  }
  if (module.kind === "odd") {
    var to = module.groups.length;
    if (levelId === "mudah") return Math.min(5, to);
    if (levelId === "sulit") return to;
    return Math.min(module.perRound, to);
  }
  if (module.kind === "sort") {
    var ts = module.items.length;
    if (levelId === "mudah") return Math.min(6, ts);
    return ts;
  }
  if (module.kind === "lab") {
    var tl = module.recipes.length;
    if (levelId === "mudah") return Math.min(5, tl);
    if (levelId === "sulit") return tl;
    return Math.min(module.perRound, tl);
  }
  /* Sequence, match, memory panjangnya diatur oleh set/pasangannya sendiri. */
  return 0;
}

/**
 * Berapa kartu bahan yang tergelar di baki Laboratorium.
 *
 * Dua di antaranya selalu bahan yang benar; sisanya pengecoh dari resep lain.
 * Level tidak mengubah resepnya — hanya seberapa ramai baki bahannya, dan di
 * situlah kesulitan sesungguhnya berada.
 */
function labTraySize(levelId) {
  if (levelId === "mudah") return 4;
  if (levelId === "sedang") return 6;
  return 8;
}

/** Berapa pasangan yang dipakai di satu ronde "pasangkan". */
function matchSize(pairs, levelId) {
  if (levelId === "mudah") return Math.min(3, pairs.length);
  if (levelId === "sedang") return Math.min(4, pairs.length);
  return pairs.length;
}

/** Berapa pasang kartu yang dibuka di satu ronde "Kartu Ingatan". */
function memorySize(pairs, levelId) {
  if (levelId === "mudah") return Math.min(4, pairs.length);
  if (levelId === "sedang") return Math.min(6, pairs.length);
  return Math.min(8, pairs.length); /* 8 pasang = 16 kartu, batas nyaman di layar */
}

function normalizeModule(raw, index) {
  if (!isObj(raw)) return null;
  var kind = raw.kind;
  if (["quiz", "truefalse", "odd", "sort", "sequence", "match", "memory", "lab"].indexOf(kind) === -1) return null;

  var base = {
    id: str(raw.id, "game-" + index),
    kind: kind,
    /* Kategori bebas diketik admin; dipakai untuk filter "Fokus Belajar"
       di menu utama. Kosong = masuk kelompok "Lainnya". */
    category: str(raw.category, "Lainnya").trim() || "Lainnya",
    ico: str(raw.ico, "🎮"),
    name: str(raw.name, "Permainan"),
    desc: str(raw.desc, ""),
    color: colorKeyOr(raw.color, "teal"),
    enabled: bool(raw.enabled, true),
    /* Mode Kilat — timer per soal. Mati secara bawaan: tekanan waktu memacu
       sebagian anak tapi membuat sebagian lain menyerah, jadi ia harus jadi
       pilihan guru, bukan bawaan. Hanya berlaku di engine bersoal tunggal
       (kuis, benar/salah, cari yang beda, laboratorium). */
    timed: bool(raw.timed, false),
    seconds: int(raw.seconds, 20, 5, 120),
  };

  if (kind === "quiz") {
    var questions = (Array.isArray(raw.questions) ? raw.questions : [])
      .filter(isObj)
      .map(function (q) {
        var o = (Array.isArray(q.o) ? q.o : [])
          .filter(function (x) {
            return typeof x === "string";
          })
          .slice(0, 4);
        return {
          e: str(q.e, "❓"),
          q: str(q.q, ""),
          o: o,
          /* Indeks jawaban dijepit ke rentang pilihan yang benar-benar ada. */
          a: int(q.a, 0, 0, Math.max(0, o.length - 1)),
          /* Penjelasan "Tahukah kamu?" — opsional. Kosong = panel tidak muncul. */
          w: str(q.w, ""),
        };
      })
      .filter(function (q) {
        return q.q.trim() !== "" && q.o.length >= 2;
      });
    if (!questions.length) return null;
    base.perRound = int(raw.perRound, 10, 1, questions.length);
    base.questions = questions;
    return base;
  }

  if (kind === "truefalse") {
    var statements = (Array.isArray(raw.statements) ? raw.statements : [])
      .filter(isObj)
      .map(function (s) {
        return {
          e: str(s.e, "🤔"),
          s: str(s.s, ""),
          /* Jawaban dipaksa jadi boolean asli — string "true" pun ikut benar. */
          a: s.a === true || s.a === "true",
          w: str(s.w, ""),
        };
      })
      .filter(function (s) {
        return s.s.trim() !== "";
      });
    if (!statements.length) return null;
    base.perRound = int(raw.perRound, 8, 1, statements.length);
    base.statements = statements;
    return base;
  }

  if (kind === "odd") {
    var groups = (Array.isArray(raw.groups) ? raw.groups : [])
      .filter(isObj)
      .map(function (g) {
        var items = (Array.isArray(g.items) ? g.items : [])
          .filter(isObj)
          .map(function (it) {
            return { e: str(it.e, "❔"), n: str(it.n, "") };
          })
          .filter(function (it) {
            return it.n.trim() !== "";
          })
          .slice(0, 6); /* muat rapi dalam grid */
        return {
          q: str(g.q, "Mana yang berbeda?"),
          items: items,
          /* Indeks item yang "beda", dijepit ke jumlah item yang ada. */
          a: int(g.a, 0, 0, Math.max(0, items.length - 1)),
          w: str(g.w, ""),
        };
      })
      /* Butuh minimal 3 pilihan supaya "yang beda" bermakna. */
      .filter(function (g) {
        return g.items.length >= 3;
      });
    if (!groups.length) return null;
    base.perRound = int(raw.perRound, 5, 1, groups.length);
    base.groups = groups;
    return base;
  }

  if (kind === "sort") {
    var bins = (Array.isArray(raw.bins) ? raw.bins : [])
      .filter(isObj)
      .map(function (b, i) {
        return {
          k: str(b.k, "bin-" + i),
          l: str(b.l, "Wadah " + (i + 1)),
          e: str(b.e, "📦"),
          color: colorKeyOr(b.color, COLOR_KEYS[i % COLOR_KEYS.length]),
        };
      })
      .slice(0, 3); /* tata letak menampung maksimal 3 wadah */
    var keys = bins.map(function (b) {
      return b.k;
    });
    var items = (Array.isArray(raw.items) ? raw.items : [])
      .filter(isObj)
      .map(function (it) {
        return { n: str(it.n, ""), e: str(it.e, "❔"), k: str(it.k, ""), w: str(it.w, "") };
      })
      .filter(function (it) {
        /* Item yang menunjuk wadah tak dikenal mustahil dijawab benar. */
        return it.n.trim() !== "" && keys.indexOf(it.k) !== -1;
      });
    if (bins.length < 2 || !items.length) return null;
    base.hint = str(raw.hint, "Masukkan ke kelompok yang tepat!");
    base.bins = bins;
    base.items = items;
    return base;
  }

  if (kind === "lab") {
    var recipes = (Array.isArray(raw.recipes) ? raw.recipes : [])
      .filter(isObj)
      .map(function (r) {
        var ba = isObj(r.a) ? r.a : {};
        var bb = isObj(r.b) ? r.b : {};
        return {
          e: str(r.e, "🧪"),
          t: str(r.t, ""),
          a: { e: str(ba.e, "❔"), n: str(ba.n, "") },
          b: { e: str(bb.e, "❔"), n: str(bb.n, "") },
          w: str(r.w, ""),
        };
      })
      .filter(function (r) {
        if (r.t.trim() === "" || r.a.n.trim() === "" || r.b.n.trim() === "") return false;
        /* Baki bahan disaring per NAMA supaya tidak pernah ada dua kartu kembar.
           Resep yang kedua bahannya bernama sama karenanya mustahil digelar
           dengan jujur — hanya satu kartunya yang muncul. */
        return r.a.n.trim().toLowerCase() !== r.b.n.trim().toLowerCase();
      });
    /* Butuh minimal dua resep: bahan resep lain itulah sumber pengecohnya. */
    if (recipes.length < 2) return null;
    base.hint = str(raw.hint, "Ketuk dua bahan yang tepat!");
    base.perRound = int(raw.perRound, 5, 1, recipes.length);
    base.recipes = recipes;
    return base;
  }

  if (kind === "sequence") {
    var sequences = (Array.isArray(raw.sequences) ? raw.sequences : [])
      .filter(isObj)
      .map(function (s) {
        return {
          t: str(s.t, "Urutan"),
          s: (Array.isArray(s.s) ? s.s : [])
            .filter(isObj)
            .map(function (step) {
              return { e: str(step.e, "•"), n: str(step.n, "") };
            })
            .filter(function (step) {
              return step.n.trim() !== "";
            }),
        };
      })
      .filter(function (s) {
        return s.s.length >= 2;
      });
    if (!sequences.length) return null;
    base.sequences = sequences;
    return base;
  }

  var sets = (Array.isArray(raw.sets) ? raw.sets : [])
    .filter(isObj)
    .map(function (s) {
      return {
        t: str(s.t, "Pasangkan"),
        pairs: (Array.isArray(s.pairs) ? s.pairs : [])
          .filter(isObj)
          .map(function (p) {
            return {
              le: str(p.le, "•"),
              l: str(p.l, ""),
              re: str(p.re, "•"),
              r: str(p.r, ""),
            };
          })
          .filter(function (p) {
            return p.l.trim() !== "" && p.r.trim() !== "";
          }),
      };
    })
    .filter(function (s) {
      return s.pairs.length >= 2;
    });
  if (kind === "match") {
    if (!sets.length) return null;
    base.sets = sets;
    return base;
  }

  /* kind === "memory" — kartu ingatan. Tiap pasangan punya dua sisi (a & b),
     bisa emoji-kata (🐘 ↔ "Gajah") atau emoji-emoji. Keduanya dicocokkan lewat
     indeks pasangannya, bukan isinya, jadi dua sisi boleh sama persis. */
  var mpairs = (Array.isArray(raw.pairs) ? raw.pairs : [])
    .filter(isObj)
    .map(function (p) {
      return { a: str(p.a, ""), b: str(p.b, "") };
    })
    .filter(function (p) {
      return p.a.trim() !== "" && p.b.trim() !== "";
    });
  if (mpairs.length < 2) return null;
  base.pairs = mpairs;
  return base;
}

function normalizeConfig(raw) {
  var c = isObj(raw) ? raw : {};
  var list = Array.isArray(c.modules) ? c.modules : [];
  var modules = [];
  var seen = {};

  list.forEach(function (m, i) {
    var mod = normalizeModule(m, i);
    if (!mod) return;
    /* Id harus unik: ia jadi kunci progres pemain di localStorage. */
    var id = mod.id;
    var n = 2;
    while (seen[id]) id = mod.id + "-" + n++;
    seen[id] = true;
    mod.id = id;
    modules.push(mod);
  });

  return { version: 1, brand: normalizeBrand(c.brand), modules: modules };
}

/* ---------------------------------------------------------------------
 * 4. MEMUAT CONFIG
 *
 * Urutan prioritas:
 *   1. Draf pratinjau admin di localStorage — HANYA di perangkat admin,
 *      dan hanya kalau ia menyalakan mode pratinjau.
 *   2. config.json di sebelah index.html — inilah yang dilihat semua pemain.
 *   3. DEFAULT_CONFIG di file ini — jaring pengaman; juga yang membuat game
 *      tetap jalan saat dibuka lewat file:// (fetch diblokir di sana).
 * ------------------------------------------------------------------- */

var PREVIEW_KEY = "psa:preview";
var DRAFT_KEY = "psa:draft";

function readPreviewDraft() {
  try {
    if (localStorage.getItem(PREVIEW_KEY) !== "1") return null;
    var raw = localStorage.getItem(DRAFT_KEY);
    return raw ? normalizeConfig(JSON.parse(raw)) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Memuat config yang TERPUBLIKASI — yaitu yang dilihat semua pemain.
 * Draf pratinjau admin sengaja diabaikan di sini.
 */
function loadPublishedConfig(callback) {
  /* cache-buster: config.json baru harus langsung terbaca setelah redeploy */
  fetch("config.json?v=" + Date.now(), { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("no config.json");
      return res.json();
    })
    .then(function (json) {
      callback(normalizeConfig(json), "published");
    })
    .catch(function () {
      /* Tidak ada config.json (atau dibuka via file://) — pakai bawaan. */
      callback(normalizeConfig(DEFAULT_CONFIG), "default");
    });
}

/**
 * Memuat config untuk GAME: draf pratinjau admin menang, kalau ada.
 * Panel admin tidak memakai ini — ia butuh versi terpublikasi sebagai
 * pembanding, supaya tahu mana yang sudah diunduh dan mana yang belum.
 */
function loadConfig(callback) {
  var draft = readPreviewDraft();
  if (draft) {
    callback(draft, "preview");
    return;
  }
  loadPublishedConfig(callback);
}

/* ---------------------------------------------------------------------
 * 5. KODE ROOM (main bersama)
 *
 * Tanpa server, tidak ada tempat menyimpan "isi room". Jadi kodenya sendiri
 * yang MENGANGKUT pengaturannya: level dan fokus ditanam di dalam 6 huruf itu.
 * Akibatnya teman yang mengetik kode di perangkat lain langsung mendapat
 * tantangan yang sama — tanpa backend sama sekali.
 *
 * Yang TIDAK bisa dilakukan cara ini: menggabungkan papan bintang antar
 * perangkat. Itu memang butuh server.
 *
 * Susunan 6 huruf:  [acak][level][acak][fokus][acak][checksum]
 * Huruf acak membuat dua room dengan pengaturan sama tetap berbeda kodenya,
 * dan checksum menolak kode salah ketik.
 * ------------------------------------------------------------------- */

/* Tanpa I, O, 0, 1 — supaya anak tidak tertukar saat menyalin kode. */
var ROOM_ABC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function roomIdx(ch) { return ROOM_ABC.indexOf(ch); }
function roomRandChar() { return ROOM_ABC.charAt(Math.floor(Math.random() * ROOM_ABC.length)); }

function roomChecksum(body) {
  var sum = 0;
  for (var i = 0; i < body.length; i++) sum = (sum * 7 + roomIdx(body.charAt(i))) % 32;
  return sum;
}

/** Membuat kode room dari indeks level (0..2) dan indeks fokus (0 = Semua). */
function makeRoomCode(levelIdx, focusIdx) {
  var body =
    roomRandChar() + ROOM_ABC.charAt(levelIdx % 32) +
    roomRandChar() + ROOM_ABC.charAt(focusIdx % 32) +
    roomRandChar();
  return body + ROOM_ABC.charAt(roomChecksum(body));
}

/**
 * Membaca kode room. Mengembalikan {levelIdx, focusIdx} atau null kalau kode
 * tidak berbentuk benar / checksum-nya tidak cocok (mis. salah ketik).
 */
function parseRoomCode(code) {
  if (typeof code !== "string") return null;
  var c = code.trim().toUpperCase().replace(/[^A-Z2-9]/g, "");
  if (c.length !== 6) return null;
  for (var i = 0; i < 6; i++) if (roomIdx(c.charAt(i)) === -1) return null;
  var body = c.slice(0, 5);
  if (ROOM_ABC.charAt(roomChecksum(body)) !== c.charAt(5)) return null;
  return { code: c, levelIdx: roomIdx(c.charAt(1)), focusIdx: roomIdx(c.charAt(3)) };
}

/* ---------------------------------------------------------------------
 * 6. ACAK — bisa "dikunci" oleh room
 *
 * Di luar room, pengacakan memakai Math.random biasa.
 *
 * Di dalam room, pengacakan dikunci memakai seed yang diturunkan dari kode
 * room. Karena kode itu sama di semua perangkat, SEMUA anggota room mendapat
 * soal yang sama persis, dalam urutan yang sama, dengan pilihan yang tersusun
 * sama. Tanpa ini, "main bersama" cuma menyamakan level — skor mereka tidak
 * benar-benar bisa dibandingkan.
 * ------------------------------------------------------------------- */

var __rng = null; /* null = pakai Math.random */

/** PRNG kecil & cepat; sama seed → sama urutan angka, di perangkat mana pun. */
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a — mengubah teks (kode room + id game) jadi satu angka seed. */
function hashStr(s) {
  var h = 2166136261;
  for (var i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Mengunci pengacakan ke seed tertentu. */
function useSeed(str) { __rng = mulberry32(hashStr(String(str))); }

/** Mengembalikan pengacakan ke acak sungguhan. */
function useRandom() { __rng = null; }

function rand() { return __rng ? __rng() : Math.random(); }

/* ---------------------------------------------------------------------
 * 7. UTIL
 * ------------------------------------------------------------------- */

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(rand() * (i + 1));
    var t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

function sample(arr) {
  return arr[Math.floor(rand() * arr.length)];
}

/** Emoji jadi favicon tanpa file aset — cukup satu data URI SVG. */
function setFavicon(emoji) {
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
    '<text y=".9em" font-size="90">' +
    (emoji || "🔬") +
    "</text></svg>";
  var link = document.querySelector("link[rel=icon]");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = "data:image/svg+xml," + encodeURIComponent(svg);
}

/**
 * Pangkat maskot — naik seiring bintang yang dikumpulkan anak.
 *
 * Maskot yang ikut "tumbuh" membuat progres terasa milik seseorang, bukan
 * sekadar angka. Ambangnya sengaja rapat di awal supaya anak baru cepat
 * merasakan kenaikan pertamanya.
 */
var RANKS = [
  { at: 0,    name: "Ilmuwan Cilik" },
  { at: 40,   name: "Peneliti Muda" },
  { at: 120,  name: "Ahli Sains" },
  { at: 260,  name: "Profesor Cilik" },
  { at: 500,  name: "Ilmuwan Hebat" },
  { at: 900,  name: "Legenda Sains" },
];

/** Indeks pangkat untuk sejumlah bintang. */
function rankIndex(stars) {
  var i = 0;
  for (var k = 0; k < RANKS.length; k++) if (stars >= RANKS[k].at) i = k;
  return i;
}

/**
 * Maskot bawaan, digambar dengan warna palet supaya ikut ter-whitelabel.
 *
 * `rank` (0–5) menambahkan atribut yang menumpuk: kacamata, syal, topi, dan
 * seterusnya. Argumennya opsional — pemanggil lama tetap mendapat maskot dasar.
 */
function mascotSvg(mood, brand, rank) {
  var c = brand.colors;
  var stroke = "#20343A";
  var r = typeof rank === "number" ? Math.max(0, Math.min(RANKS.length - 1, rank)) : 0;
  var eyes =
    mood === "cheer"
      ? '<path d="M40 52 q6 -10 12 0" stroke="' + stroke + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<path d="M68 52 q6 -10 12 0" stroke="' + stroke + '" stroke-width="4" fill="none" stroke-linecap="round"/>'
      : '<circle cx="46" cy="54" r="5.5" fill="' + stroke + '"/><circle cx="74" cy="54" r="5.5" fill="' + stroke + '"/>' +
        '<circle cx="48" cy="52" r="1.8" fill="#fff"/><circle cx="76" cy="52" r="1.8" fill="#fff"/>';
  var mouth =
    mood === "oops"
      ? '<path d="M50 74 q10 -8 20 0" stroke="' + stroke + '" stroke-width="4" fill="none" stroke-linecap="round"/>'
      : mood === "cheer"
        ? '<path d="M46 70 q14 20 28 0 q-14 8 -28 0Z" fill="' + shade(c.coral, 0.15) + '"/>'
        : '<path d="M48 72 q12 12 24 0" stroke="' + stroke + '" stroke-width="4" fill="none" stroke-linecap="round"/>';

  /* Atribut pangkat menumpuk: tiap kenaikan MENAMBAH, tidak mengganti — jadi
     maskot terlihat makin lengkap, bukan berubah jadi karakter lain. */
  var depan = "", belakang = "";

  if (r >= 1) {
    /* Kacamata peneliti */
    belakang +=
      '<circle cx="46" cy="54" r="11" fill="none" stroke="' + shade(c.sky, .1) + '" stroke-width="3"/>' +
      '<circle cx="74" cy="54" r="11" fill="none" stroke="' + shade(c.sky, .1) + '" stroke-width="3"/>' +
      '<path d="M57 54 h6" stroke="' + shade(c.sky, .1) + '" stroke-width="3" stroke-linecap="round"/>';
  }
  if (r >= 2) {
    /* Syal */
    belakang +=
      '<path d="M38 88 q22 12 44 0 l-3 9 q-19 9 -38 0Z" fill="' + c.coral + '"/>' +
      '<path d="M76 95 l9 16 -9 3 -4 -16Z" fill="' + shade(c.coral, .12) + '"/>';
  }
  if (r >= 3) {
    /* Topi lulusan */
    belakang +=
      '<path d="M60 16 L98 30 L60 44 L22 30Z" fill="' + shade(c.grape, .1) + '"/>' +
      '<path d="M84 36 v14" stroke="' + c.sun + '" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="84" cy="52" r="4" fill="' + c.sun + '"/>';
  }
  if (r >= 4) {
    /* Lencana bintang di dada */
    belakang +=
      '<circle cx="60" cy="92" r="9" fill="' + c.sun + '"/>' +
      '<text x="60" y="97" font-size="11" text-anchor="middle">⭐</text>';
  }
  if (r >= 5) {
    /* Aura legenda */
    depan +=
      '<circle cx="60" cy="62" r="47" fill="none" stroke="' + c.sun +
      '" stroke-width="2.5" stroke-dasharray="5 7" opacity=".8"/>';
  }

  return (
    '<ellipse cx="60" cy="112" rx="30" ry="6" fill="rgba(0,0,0,.08)"/>' +
    depan +
    '<path d="M60 14 l7 10 -14 0Z" fill="' + c.leaf + '"/>' +
    '<circle cx="60" cy="9" r="5" fill="' + c.sun + '"/>' +
    '<circle cx="60" cy="62" r="40" fill="' + c.teal + '"/>' +
    '<circle cx="60" cy="62" r="40" fill="none" stroke="' + shade(c.teal) + '" stroke-width="3"/>' +
    '<ellipse cx="60" cy="60" rx="30" ry="26" fill="#EAFBFA"/>' +
    eyes +
    mouth +
    '<circle cx="36" cy="66" r="6" fill="' + c.pink + '" opacity=".7"/>' +
    '<circle cx="84" cy="66" r="6" fill="' + c.pink + '" opacity=".7"/>' +
    '<path d="M22 60 a38 38 0 0 1 76 0" fill="none" stroke="' + c.sun + '" stroke-width="5" stroke-linecap="round" opacity=".55"/>' +
    belakang
  );
}
