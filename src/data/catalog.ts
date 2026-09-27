import { GameCatalogItem, RealmId, RealmInfo, ChildProfile, FamilyMember, LittleMoment, SchedulePlan, VoiceProfile } from '../types/game';

// NOTE: these used to be raw string paths ('/src/assets/images/mora-hero.jpg') pointing
// at files that never existed. Even with a correct filename, a plain string path into
// src/ is never bundled by Vite — only files reached through an ES `import` get hashed
// into dist/assets and actually ship in production. That's why every photo on the
// landing page rendered as a broken image / bare alt text.
//
// The first fix used illustrations AI Studio had already generated for this project,
// but their style (busy, highly detailed, saturated) clashed with Mora's own minimal
// pastel design system. These replacements were generated to match Mora's actual
// palette (cream / sky / mint / sun / coral) and flat, low-detail illustration style.
import moraHeroMinimal from '../assets/images/mora-hero-minimal.jpg';
import moraFlowerMinimal from '../assets/images/mora-flower-minimal.jpg';
import moraMomentsMinimal from '../assets/images/mora-moments-minimal.jpg';
import moraOwlMascot from '../assets/images/morakids_hero_mascot_1790447137530.jpg';
import moraMathKingdom from '../assets/images/realm_math_kingdom_1790447153048.jpg';

export const MORA_HERO_IMAGE = moraHeroMinimal;
export const MORA_FLOWER_IMAGE = moraFlowerMinimal;
export const MORA_MOMENTS_IMAGE = moraMomentsMinimal;
export const MORA_MASCOT_IMAGE = moraOwlMascot;
export const MORA_MATH_KINGDOM_IMAGE = moraMathKingdom;

export const REALMS: Record<RealmId, RealmInfo> = {
  math: {
    id: 'math',
    name: 'Math Kingdom',
    shortName: 'Math',
    tagline: 'Count, Calculate & Slice Fraction Pizza',
    description: 'Master number bonds, mental math, times tables, and fraction slices in exciting quests.',
    icon: 'Calculator',
    themeColor: {
      bg: 'bg-sun',
      border: 'border-sun/40',
      text: 'text-foreground',
      accent: 'oklch(83% 0.17 83)',
      lightBg: 'bg-sun/15',
    },
    cardImage: MORA_MATH_KINGDOM_IMAGE,
  },
  science: {
    id: 'science',
    name: 'Science Lab',
    shortName: 'Science',
    tagline: 'Spark Circuits & Balance Nature Web',
    description: 'Experiment with electrical circuits, gravity, planets, and animal ecosystems safely.',
    icon: 'FlaskConical',
    themeColor: {
      bg: 'bg-mint',
      border: 'border-mint/40',
      text: 'text-mint',
      accent: 'oklch(68% 0.16 165)',
      lightBg: 'bg-mint-soft',
    },
    cardImage: MORA_MOMENTS_IMAGE,
  },
  literacy: {
    id: 'literacy',
    name: 'Storyverse & Words',
    shortName: 'Reading',
    tagline: 'Spell Words & Phonics Safari Adventures',
    description: 'Listen, spell phonics words, explore vocabulary clues, and unlock cheerful story stars.',
    icon: 'BookOpen',
    themeColor: {
      bg: 'bg-sky',
      border: 'border-sky/40',
      text: 'text-primary',
      accent: 'oklch(57% 0.22 257)',
      lightBg: 'bg-sky-soft',
    },
    cardImage: MORA_HERO_IMAGE,
  },
  creative: {
    id: 'creative',
    name: 'Creative Studio',
    shortName: 'Art & Music',
    tagline: 'Play Rainbow Xylophone & Digital Beats',
    description: 'Compose cheerful melodies on the xylophone, record songs, and paint vibrant works of art.',
    icon: 'Palette',
    themeColor: {
      bg: 'bg-coral',
      border: 'border-coral/40',
      text: 'text-coral',
      accent: 'oklch(70% 0.19 25)',
      lightBg: 'bg-coral-soft',
    },
    cardImage: MORA_HERO_IMAGE,
  },
  logic: {
    id: 'logic',
    name: 'Brain Quest',
    shortName: 'Logic',
    tagline: 'Pattern Sequences & Memory Matrix',
    description: 'Sharpen spatial reasoning, memory retention, and sequential problem-solving skills.',
    icon: 'Sparkles',
    themeColor: {
      bg: 'bg-secondary',
      border: 'border-primary/20',
      text: 'text-primary',
      accent: 'oklch(57% 0.22 257)',
      lightBg: 'bg-secondary',
    },
    cardImage: MORA_MOMENTS_IMAGE,
  },
  quran: {
    id: 'quran',
    name: "Qur'an & Hijaiyah",
    shortName: "Qur'an",
    tagline: 'Meet Hijaiyah Letters & Explore Short Surahs',
    description: 'Play-first Arabic letter recognition, harakat sounds, and verified Kemenag short surahs.',
    icon: 'Moon',
    themeColor: {
      bg: 'bg-emerald-600',
      border: 'border-emerald-300',
      text: 'text-emerald-700',
      accent: '#059669',
      lightBg: 'bg-emerald-50',
    },
    cardImage: MORA_MOMENTS_IMAGE,
  },
};

export const GAMES_CATALOG: GameCatalogItem[] = [
  // 1. Math Cannon
  {
    id: 'math-rocket',
    title: 'Space Math Cannon',
    realm: 'math',
    ageGroup: 'ages-7-9',
    difficulty: 'medium',
    durationMinutes: 4,
    starsReward: 15,
    tagline: 'Solve math equations to launch your rocket through asteroid belts!',
    description: 'Blast off on a cosmic math voyage. Calculate addition, subtraction, and multiplication sums with visual fuel gauges, streak multipliers, and instant feedback.',
    skills: ['Mental Math', 'Addition & Subtraction', 'Multiplication', 'Quick Calculation'],
    bannerImage: MORA_FLOWER_IMAGE,
    accentColor: '#F5B738',
    isPopular: true,
  },
  // 2. Pizza Fractions
  {
    id: 'fraction-pizza',
    title: 'Pizza Chef Fractions',
    realm: 'math',
    ageGroup: 'ages-7-9',
    difficulty: 'easy',
    durationMinutes: 3,
    starsReward: 12,
    tagline: 'Slice and serve pizzas to hungry friendly woodland critters!',
    description: 'Master halves, quarters, thirds, and eighths. Select the exact fraction portions customers crave to earn glowing chef stars.',
    skills: ['Fractions', 'Visual Proportions', 'Parts of a Whole'],
    bannerImage: MORA_MOMENTS_IMAGE,
    accentColor: '#F5B738',
    isNew: true,
  },
  // 3. Phonics Safari
  {
    id: 'phonics-safari',
    title: 'Phonics Safari & Spell Quest',
    realm: 'literacy',
    ageGroup: 'ages-4-6',
    difficulty: 'easy',
    durationMinutes: 3,
    starsReward: 12,
    tagline: 'Listen, tap the letters, and discover safari animals with voice narration!',
    description: 'Hear each letter sound and word spoken clearly aloud. Drag or tap tiles to unscramble words, learn phonetics, and reveal happy wild animals.',
    skills: ['Phonics', 'Spelling', 'Sight Words', 'Auditory Listening'],
    bannerImage: MORA_HERO_IMAGE,
    accentColor: '#5352E8',
    isPopular: true,
  },
  // 4. Electric Circuit
  {
    id: 'science-circuits',
    title: 'Electric Circuit Sparks',
    realm: 'science',
    ageGroup: 'ages-7-9',
    difficulty: 'medium',
    durationMinutes: 5,
    starsReward: 18,
    tagline: 'Connect batteries, switches, and glowing lamps in a virtual lab!',
    description: 'Discover how electrical currents flow. Place power cells, close interactive switches, light up color bulbs, and test conductivities without any shocks.',
    skills: ['Basic Circuits', 'Electricity Flow', 'Conductors & Insulators', 'Hypothesis Testing'],
    bannerImage: MORA_FLOWER_IMAGE,
    accentColor: '#2BBF88',
    isPopular: true,
  },
  // 5. Science Ecosystem
  {
    id: 'science-ecosystem',
    title: 'Nature Web: Habitat Balance',
    realm: 'science',
    ageGroup: 'ages-10-12',
    difficulty: 'medium',
    durationMinutes: 4,
    starsReward: 14,
    tagline: 'Build a healthy pond food web from sunlight to river herons!',
    description: 'Connect producers, herbivores, predators, and decomposers. Watch the ecosystem balance meter respond in real-time as life flourishes.',
    skills: ['Food Chains', 'Biodiversity', 'Ecology', 'Cause & Effect'],
    bannerImage: MORA_MOMENTS_IMAGE,
    accentColor: '#2BBF88',
    isNew: true,
  },
  // 6. Rainbow Melody
  {
    id: 'rainbow-melody',
    title: 'Rainbow Xylophone & Song Studio',
    realm: 'creative',
    ageGroup: 'ages-4-6',
    difficulty: 'easy',
    durationMinutes: 5,
    starsReward: 10,
    tagline: 'Play nursery tunes, follow star notes, and record your own cheerful song!',
    description: 'Interactive crystal-clear chime synthesizer. Learn classics like Twinkle Star, Ode to Joy, or create original melodies with real-time playback.',
    skills: ['Musical Pitch', 'Rhythm & Melody', 'Fine Motor Control', 'Creativity'],
    bannerImage: MORA_HERO_IMAGE,
    accentColor: '#FA6B6B',
    isPopular: true,
  },
  // 7. Memory Matrix
  {
    id: 'memory-matrix',
    title: 'Brain Matrix: Animal Pairs',
    realm: 'logic',
    ageGroup: 'ages-4-6',
    difficulty: 'easy',
    durationMinutes: 3,
    starsReward: 10,
    tagline: 'Flip cards and match cheerful animal friends before the timer runs out!',
    description: 'A friendly memory card matching challenge. Train visual working memory and focus with responsive card flips and sound celebrations.',
    skills: ['Visual Memory', 'Focus & Attention', 'Pattern Recognition'],
    bannerImage: MORA_FLOWER_IMAGE,
    accentColor: '#5352E8',
  },
  // 8. Pattern Detective
  {
    id: 'pattern-detective',
    title: 'Pattern Detective: What Comes Next?',
    realm: 'logic',
    ageGroup: 'ages-7-9',
    difficulty: 'medium',
    durationMinutes: 4,
    starsReward: 15,
    tagline: 'Solve shape, color, and number sequences to unlock mystery chests!',
    description: 'Analyze repeating patterns and deduce what missing item completes the logic sequence. Encourages algorithmic thinking and reasoning.',
    skills: ['Logical Deduction', 'Sequence Analysis', 'Algorithmic Thinking'],
    bannerImage: MORA_MOMENTS_IMAGE,
    accentColor: '#5352E8',
  },
  // 9. NEW: Hijaiyah Quest (Qur'an & Hijaiyah)
  {
    id: 'hijaiyah-quest',
    title: 'Meet Hijaiyah & Letter Safari',
    realm: 'quran',
    ageGroup: 'ages-4-6',
    difficulty: 'easy',
    durationMinutes: 4,
    starsReward: 15,
    tagline: 'Learn Arabic letters with gentle audio pronunciation and harakat sounds!',
    description: 'Interactive touch-and-hear cards for Alif, Ba, Ta, and more. Toggle Fathah, Kasrah, and Dhommah, and match playful letter cards in cheerful rounds.',
    skills: ['Hijaiyah Recognition', 'Phonetic Harakat', 'Arabic Alphabet', 'Pronunciation'],
    bannerImage: MORA_HERO_IMAGE,
    accentColor: '#059669',
    isNew: true,
    isPopular: true,
  },
  // 10. NEW: Short Surahs Explorer (Kemenag Source)
  {
    id: 'quran-explorer',
    title: "Explore Short Surahs (LPMQ Kemenag)",
    realm: 'quran',
    ageGroup: 'ages-7-9',
    difficulty: 'easy',
    durationMinutes: 5,
    starsReward: 20,
    tagline: 'Read and listen to Juz Amma short surahs with authentic Indonesian translation!',
    description: 'Verified Mushaf Standar Indonesia text from Kemenag. Features Al-Fatihah, Al-Ikhlas, Al-Falaq, An-Nas, Al-Kautsar, with clear audio and gentle reflections.',
    skills: ['Qur’an Literacy', 'Tadabbur for Kids', 'Indonesian Translation', 'Memorization'],
    bannerImage: MORA_MOMENTS_IMAGE,
    accentColor: '#059669',
    isNew: true,
  },
  // 11. Petualangan Bahasa Arab (1001 Malam)
  {
    id: 'arabic-adventure',
    title: 'Petualangan Bahasa Arab (1001 Malam)',
    realm: 'quran',
    ageGroup: 'all',
    difficulty: 'medium',
    durationMinutes: 5,
    starsReward: 25,
    tagline: '30 Gerbang seru: huruf hijaiyah, harakat, kosakata benda, angka & kalimat!',
    description: 'Petualangan belajar bahasa Arab lengkap: 30 gerbang seru berisi huruf hijaiyah, harakat ba-bi-bu, kosakata bergambar, lawan kata, jamak, angka Arab, profesi, cuaca, percakapan sehari-hari, letuskan balon huruf, kartu memori, dan susun kalimat.',
    skills: ['Huruf Hijaiyah', 'Harakat Ba-Bi-Bu', 'Kosakata Arab', 'Susun Kalimat', 'Percakapan Sehari-hari'],
    bannerImage: MORA_HERO_IMAGE,
    accentColor: '#059669',
    isNew: true,
    isPopular: true,
  },
];

export const DAILY_QUESTS = [
  { id: 'quest-1', title: 'Launch 1 Math Cannon Rocket', rewardStars: 10, realm: 'math' as RealmId },
  { id: 'quest-2', title: 'Spell 3 safari words with voice clues', rewardStars: 10, realm: 'literacy' as RealmId },
  { id: 'quest-3', title: 'Meet 3 Hijaiyah letters with harakat', rewardStars: 15, realm: 'quran' as RealmId },
];

export const MORA_WISDOM_TIPS = [
  "Did you know? Honeybees can count up to four and recognize shapes!",
  "A lightning bolt is 5 times hotter than the surface of the sun!",
  "Music helps your brain build strong memory bridges for math and language!",
  "Octopuses have three hearts and blue blood!",
  "When you practice reading, your imagination grows super wings!",
  "Huruf hijaiyah berjumlah 28 huruf indah yang dipelajari jutaan anak di dunia!",
];

// Initial Family Mock Data for Mora Family
export const INITIAL_CHILDREN: ChildProfile[] = [
  {
    id: 'c-1',
    name: 'Zahra',
    age: 6,
    avatar: '👧',
    favoriteSubject: 'Math & Hijaiyah',
    stars: 65,
  },
  {
    id: 'c-2',
    name: 'Aruna',
    age: 4,
    avatar: '🧒',
    favoriteSubject: 'Music & Nature',
    stars: 45,
  },
];

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'm-1',
    name: 'Mama Carla',
    role: 'Mama',
    avatar: '👩‍🦰',
    permissions: ['all'],
  },
  {
    id: 'm-2',
    name: 'Papa Rizki',
    role: 'Papa',
    avatar: '👨‍💼',
    permissions: ['all'],
  },
  {
    id: 'm-3',
    name: 'Nenek Siti',
    role: 'Nenek',
    avatar: '👵',
    permissions: ['view', 'moments', 'schedule'],
  },
];

export const INITIAL_MOMENTS: LittleMoment[] = [
  {
    id: 'mom-1',
    childName: 'Zahra',
    icon: '⭐',
    title: 'Completed Space Math Cannon',
    subtitle: 'Solved 8 addition and subtraction challenges with 3x streak!',
    timestamp: '15 minutes ago',
    starsEarned: 15,
    category: 'Mathematics',
  },
  {
    id: 'mom-2',
    childName: 'Zahra',
    icon: '🕌',
    title: 'Practiced 4 Hijaiyah Letters',
    subtitle: 'Learned Ba, Ta, Tsa with Fathah and Kasrah sounds.',
    timestamp: '1 hour ago',
    starsEarned: 12,
    category: "Qur'an & Hijaiyah",
  },
  {
    id: 'mom-3',
    childName: 'Aruna',
    icon: '🎨',
    title: 'Composed on Rainbow Xylophone',
    subtitle: 'Played Twinkle Twinkle Little Star and recorded a sweet tune.',
    timestamp: '3 hours ago',
    starsEarned: 10,
    category: 'Creative Studio',
  },
];

export const INITIAL_SCHEDULE: SchedulePlan[] = [
  {
    id: 'sch-1',
    childId: 'c-1',
    day: 'Tomorrow',
    time: '09:00',
    period: 'morning',
    realm: 'math',
    gameId: 'fraction-pizza',
    title: 'Pizza Chef Fractions',
    createdBy: 'Mama',
    completed: false,
  },
  {
    id: 'sch-2',
    childId: 'c-1',
    day: 'Tomorrow',
    time: '16:00',
    period: 'afternoon',
    realm: 'quran',
    gameId: 'hijaiyah-quest',
    title: 'Meet Ba & Ta Letters',
    createdBy: 'Mama',
    completed: false,
  },
  {
    id: 'sch-3',
    childId: 'c-2',
    day: 'Tomorrow',
    time: '10:30',
    period: 'morning',
    realm: 'creative',
    gameId: 'rainbow-melody',
    title: 'Xylophone Melody Hour',
    createdBy: 'Papa',
    completed: false,
  },
];

export const INITIAL_VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'v-mora',
    name: "Mora's Friendly Voice",
    owner: 'Mora Mascot',
    status: 'mora',
    enabled: true,
    samplePhrase: 'Halo sayang! Yuk kita mulai petualangan seru hari ini.',
  },
  {
    id: 'v-mama',
    name: "Mama's Voice",
    owner: 'Mama Carla',
    status: 'ready',
    enabled: true,
    samplePhrase: 'Hebat sekali, Zahra! Mama bangga sama kamu.',
  },
  {
    id: 'v-papa',
    name: "Papa's Voice",
    owner: 'Papa Rizki',
    status: 'ready',
    enabled: false,
    samplePhrase: 'Wah pintarnya anak Papa, yuk coba yang satu lagi!',
  },
];

// Verified Kemenag Short Surahs Data (Mushaf Standar Indonesia)
export interface QuranAyah {
  ayahNumber: number;
  arabic: string;
  transliteration: string;
  translationId: string;
  translationEn: string;
}

export interface QuranSurah {
  number: number;
  nameArabic: string;
  nameLatin: string;
  meaningId: string;
  meaningEn: string;
  totalAyahs: number;
  ayahs: QuranAyah[];
}

export const KEMENAG_SHORT_SURAHS: QuranSurah[] = [
  {
    number: 1,
    nameArabic: 'الفَاتِحَة',
    nameLatin: 'Al-Fatihah',
    meaningId: 'Pembukaan',
    meaningEn: 'The Opening',
    totalAyahs: 7,
    ayahs: [
      {
        ayahNumber: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: "Bismillāhir-raḥmānir-raḥīm",
        translationId: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.',
        translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      },
      {
        ayahNumber: 2,
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: "Al-ḥamdu lillāhi rabbil-'ālamīn",
        translationId: 'Segala puji bagi Allah, Tuhan seluruh alam,',
        translationEn: '[All] praise is [due] to Allah, Lord of the worlds -',
      },
      {
        ayahNumber: 3,
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: "Ar-raḥmānir-raḥīm",
        translationId: 'Yang Maha Pengasih lagi Maha Penyayang,',
        translationEn: 'The Entirely Merciful, the Especially Merciful,',
      },
      {
        ayahNumber: 4,
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transliteration: "Māliki yawmid-dīn",
        translationId: 'Pemilik hari pembalasan.',
        translationEn: 'Sovereign of the Day of Recompense.',
      },
      {
        ayahNumber: 5,
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteration: "Iyyāka na'budu wa iyyāka nasta'īn",
        translationId: 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.',
        translationEn: 'It is You we worship and You we ask for help.',
      },
      {
        ayahNumber: 6,
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliteration: "Ihdinaṣ-ṣirāṭal-mustaqīm",
        translationId: 'Tunjukilah kami jalan yang lurus,',
        translationEn: 'Guide us to the straight path -',
      },
      {
        ayahNumber: 7,
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliteration: "Ṣirāṭallażīna an'amta 'alaihim gairil-magḍūbi 'alaihim walad-ḍāllīn",
        translationId: '(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.',
        translationEn: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
      },
    ],
  },
  {
    number: 112,
    nameArabic: 'الإِخْلَاص',
    nameLatin: 'Al-Ikhlas',
    meaningId: 'Kemurnian Keesaan Allah',
    meaningEn: 'The Sincerity',
    totalAyahs: 4,
    ayahs: [
      {
        ayahNumber: 1,
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliteration: "Qul huwallāhu aḥad",
        translationId: 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa."',
        translationEn: 'Say, "He is Allah, [who is] One,"',
      },
      {
        ayahNumber: 2,
        arabic: 'اللَّهُ الصَّمَدُ',
        transliteration: "Allāhuṣ-ṣamad",
        translationId: 'Allah tempat meminta segala sesuatu.',
        translationEn: 'Allah, the Eternal Refuge.',
      },
      {
        ayahNumber: 3,
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        transliteration: "Lam yalid wa lam yūlad",
        translationId: '(Allah) tidak beranak dan tidak pula diperanakkan,',
        translationEn: 'He neither begets nor is born,',
      },
      {
        ayahNumber: 4,
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteration: "Wa lam yakul lahū kufuwan aḥad",
        translationId: 'Dan tidak ada sesuatu yang setara dengan Dia.',
        translationEn: 'Nor is there to Him any equivalent.',
      },
    ],
  },
  {
    number: 113,
    nameArabic: 'الفَلَق',
    nameLatin: 'Al-Falaq',
    meaningId: 'Waktu Subuh',
    meaningEn: 'The Daybreak',
    totalAyahs: 5,
    ayahs: [
      {
        ayahNumber: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        transliteration: "Qul a'ūżu birabbil-falaq",
        translationId: 'Katakanlah, "Aku berlindung kepada Tuhan yang menguasai subuh (fajar),',
        translationEn: 'Say, "I seek refuge in the Lord of daybreak,',
      },
      {
        ayahNumber: 2,
        arabic: 'مِن شَرِّ مَا خَلَقَ',
        transliteration: "Min syarri mā khalaq",
        translationId: 'dari kejahatan (makhluk yang) Dia ciptakan,',
        translationEn: 'From the evil of that which He created,',
      },
      {
        ayahNumber: 3,
        arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        transliteration: "Wa min syarri gāsiqin iżā waqab",
        translationId: 'dan dari kejahatan malam apabila telah gelap gulita,',
        translationEn: 'And from the evil of darkness when it settles,',
      },
      {
        ayahNumber: 4,
        arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        transliteration: "Wa min syarrin-naffāṡāti fil-'uqad",
        translationId: 'dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya),',
        translationEn: 'And from the evil of the blowers in knots,',
      },
      {
        ayahNumber: 5,
        arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        transliteration: "Wa min syarri ḥāsidin iżā ḥasad",
        translationId: 'dan dari kejahatan orang yang dengki apabila dia dengki."',
        translationEn: 'And from the evil of an envier when he envies."',
      },
    ],
  },
  {
    number: 114,
    nameArabic: 'النَّاس',
    nameLatin: 'An-Nas',
    meaningId: 'Manusia',
    meaningEn: 'Mankind',
    totalAyahs: 6,
    ayahs: [
      {
        ayahNumber: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        transliteration: "Qul a'ūżu birabbin-nās",
        translationId: 'Katakanlah, "Aku berlindung kepada Tuhannya manusia,',
        translationEn: 'Say, "I seek refuge in the Lord of mankind,',
      },
      {
        ayahNumber: 2,
        arabic: 'مَلِكِ النَّاسِ',
        transliteration: "Malikin-nās",
        translationId: 'Raja manusia,',
        translationEn: 'The Sovereign of mankind,',
      },
      {
        ayahNumber: 3,
        arabic: 'إِلَٰهِ النَّاسِ',
        transliteration: "Ilāhin-nās",
        translationId: 'Sembahan manusia,',
        translationEn: 'The God of mankind,',
      },
      {
        ayahNumber: 4,
        arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        transliteration: "Min syarril-waswāsil-khannās",
        translationId: 'dari kejahatan (bisikan) setan yang bersembunyi,',
        translationEn: 'From the evil of the retreating whisperer -',
      },
      {
        ayahNumber: 5,
        arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        transliteration: "Allażī yuwaswisu fī ṣudūrin-nās",
        translationId: 'yang membisikkan (kejahatan) ke dalam dada manusia,',
        translationEn: 'Who whispers [evil] into the breasts of mankind -',
      },
      {
        ayahNumber: 6,
        arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        transliteration: "Minal-jinnati wan-nās",
        translationId: 'dari (golongan) jin dan manusia."',
        translationEn: 'From among the jinn and mankind."',
      },
    ],
  },
  {
    number: 108,
    nameArabic: 'الكَوْثَر',
    nameLatin: 'Al-Kausar',
    meaningId: 'Nikmat yang Berlimpah',
    meaningEn: 'The Abundance',
    totalAyahs: 3,
    ayahs: [
      {
        ayahNumber: 1,
        arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
        transliteration: "Innā a'ṭainākal-kausar",
        translationId: 'Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak.',
        translationEn: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.',
      },
      {
        ayahNumber: 2,
        arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
        transliteration: "Faṣalli lirabbika wan-ḥar",
        translationId: 'Maka laksanakanlah salat karena Tuhanmu, dan berkurbanlah.',
        translationEn: 'So pray to your Lord and sacrifice [to Him alone].',
      },
      {
        ayahNumber: 3,
        arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
        transliteration: "Inna syāni'aka huwal-abtar",
        translationId: 'Sungguh, orang-orang yang membencimu dialah yang terputus (dari rahmat Allah).',
        translationEn: 'Indeed, your enemy is the one cut off.',
      },
    ],
  },
];
