// Data bank for Petualangan Bahasa Arab (Negeri 1001 Malam)
/* ============================================================
   BANK SOAL — Petualangan Bahasa Arab
   Semua data terpisah dari mesin game agar mudah ditambah.
============================================================ */

export const HURUF: any = [
  ["ا","alif"],["ب","ba’"],["ت","ta’"],["ث","tsa’"],["ج","jim"],["ح","ḥa’"],["خ","kha’"],
  ["د","dal"],["ذ","dzal"],["ر","ra’"],["ز","zay"],["س","sin"],["ش","syin"],["ص","ṣad"],
  ["ض","ḍad"],["ط","ṭa’"],["ظ","ẓa’"],["ع","‘ain"],["غ","ghain"],["ف","fa’"],["ق","qaf"],
  ["ك","kaf"],["ل","lam"],["م","mim"],["ن","nun"],["هـ","ha’"],["و","wau"],["ي","ya’"]
];

export const HARAKAT: any = [
  ["بَ","ba"],["بِ","bi"],["بُ","bu"],["تَ","ta"],["تِ","ti"],["تُ","tu"],
  ["جَ","ja"],["جِ","ji"],["جُ","ju"],["دَ","da"],["دِ","di"],["دُ","du"],
  ["سَ","sa"],["سِ","si"],["سُ","su"],["كَ","ka"],["كِ","ki"],["كُ","ku"],
  ["مَ","ma"],["مِ","mi"],["مُ","mu"],["لَ","la"],["لِ","li"],["لُ","lu"],
  ["رَ","ra"],["رِ","ri"],["رُ","ru"],["نَ","na"],["نِ","ni"],["نُ","nu"],
  ["فَ","fa"],["قَ","qa"],["شَ","sya"],["هَ","ha"],["وَ","wa"],["يَ","ya"],
  ["بَا","baa (panjang)"],["فِيْ","fii (panjang)"],["نُوْ","nuu (panjang)"],
  ["مَا","maa (panjang)"],["كِيْ","kii (panjang)"],["جُوْ","juu (panjang)"],
  ["بٌ","bun (tanwin dhammah)"],["بً","ban (tanwin fathah)"],["بٍ","bin (tanwin kasrah)"],
  ["مِنْ","min"],["كَمْ","kam"],["أُمٌّ","ummun"],["بَيْتٌ","baitun"],
  ["قَلْ","qal"],["سَمْ","sam"],["دَرْ","dar"],["بَبْ","bab"]
];

export const KATA: any = [
  ["👨","أَبٌ","abun","ayah"],["👩","أُمٌّ","ummun","ibu"],["👴","جَدٌّ","jaddun","kakek"],["👵","جَدَّةٌ","jaddatun","nenek"],
  ["🐱","قِطٌّ","qiṭṭun","kucing"],["🐦","طَائِرٌ","ṭā’irun","burung"],["🐟","سَمَكٌ","samakun","ikan"],
  ["🦁","أَسَدٌ","asadun","singa"],["🐘","فِيلٌ","fīlun","gajah"],["🐰","أَرْنَبٌ","arnabun","kelinci"],["🐴","حِصَانٌ","ḥiṣānun","kuda"],
  ["📖","كِتَابٌ","kitābun","buku"],["🖊️","قَلَمٌ","qalamun","pena"],["🎒","حَقِيبَةٌ","ḥaqībatun","tas"],
  ["🪑","كُرْسِيٌّ","kursiyyun","kursi"],["🏫","مَدْرَسَةٌ","madrasatun","sekolah"],["🚪","بَابٌ","bābun","pintu"],
  ["🏠","بَيْتٌ","baitun","rumah"],["🕌","مَسْجِدٌ","masjidun","masjid"],["🪟","نَافِذَةٌ","nāfidzatun","jendela"],
  ["🍎","تُفَّاحٌ","tuffāḥun","apel"],["🍌","مَوْزٌ","mauzun","pisang"],["🍞","خُبْزٌ","khubzun","roti"],
  ["🥛","حَلِيبٌ","ḥalībun","susu"],["💧","مَاءٌ","mā’un","air"],["🍚","أَرُزٌّ","aruzzun","nasi"],["🥚","بَيْضٌ","baiḍun","telur"],
  ["👁️","عَيْنٌ","‘aynun","mata"],["👃","أَنْفٌ","anfun","hidung"],["👄","فَمٌ","famun","mulut"],
  ["✋","يَدٌ","yadun","tangan"],["👂","أُذُنٌ","udzunun","telinga"],
  ["🔴","أَحْمَرُ","aḥmaru","merah"],["🔵","أَزْرَقُ","azraqu","biru"],["🟡","أَصْفَرُ","aṣfaru","kuning"],
  ["🟢","أَخْضَرُ","akhḍaru","hijau"],["⚪","أَبْيَضُ","abyaḍu","putih"],["⚫","أَسْوَدُ","aswadu","hitam"],
  ["🟤","بُنِّيٌّ","bunniyyun","coklat"],
  ["🐄","بَقَرَةٌ","baqaratun","sapi"],["🐐","مَاعِزٌ","mā‘izun","kambing"],["🐪","جَمَلٌ","jamalun","unta"],
  ["🐝","نَحْلَةٌ","naḥlatun","lebah"],["🐓","دَجَاجَةٌ","dajājatun","ayam"],
  ["🍇","عِنَبٌ","‘inabun","anggur"],["🍊","بُرْتُقَالٌ","burtuqālun","jeruk"],["🥕","جَزَرٌ","jazarun","wortel"],
  ["🍯","عَسَلٌ","‘asalun","madu"],["🧀","جُبْنٌ","jubnun","keju"],["🍵","شَايٌ","syāyun","teh"],
  ["📏","مِسْطَرَةٌ","misṭaratun","penggaris"],["🧽","مِمْحَاةٌ","mimḥātun","penghapus"],
  ["🧦","جَوْرَبٌ","jaurabun","kaus kaki"],["🗝️","مِفْتَاحٌ","miftāḥun","kunci"],["💡","مِصْبَاحٌ","miṣbāḥun","lampu"],
  ["🚗","سَيَّارَةٌ","sayyāratun","mobil"],["🚲","دَرَّاجَةٌ","darrājatun","sepeda"],
  ["👕","قَمِيصٌ","qamīṣun","baju"],["👟","حِذَاءٌ","ḥidzā’un","sepatu"],
  ["🧠","رَأْسٌ","ra’sun","kepala"],["🦵","رِجْلٌ","rijlun","kaki"],["🦷","سِنٌّ","sinnun","gigi"],
  ["❤️","قَلْبٌ","qalbun","hati"]
];

export const ANGKA: any = [
  [1,"وَاحِدٌ","wāḥidun"],[2,"اِثْنَانِ","itsnāni"],[3,"ثَلَاثَةٌ","tsalātsatun"],[4,"أَرْبَعَةٌ","arba‘atun"],
  [5,"خَمْسَةٌ","khamsatun"],[6,"سِتَّةٌ","sittatun"],[7,"سَبْعَةٌ","sab‘atun"],[8,"ثَمَانِيَةٌ","tsamāniyatun"],
  [9,"تِسْعَةٌ","tis‘atun"],[10,"عَشَرَةٌ","‘asyaratun"]
];

export const CAKAP: any = [
  ["Temanmu menyapa:","اَلسَّلَامُ عَلَيْكُمْ","وَعَلَيْكُمُ السَّلَام","شُكْرًا","إِلَى اللِّقَاءِ","نَعَمْ"],
  ["Pagi hari, gurumu berkata:","صَبَاحُ الْخَيْرِ","صَبَاحُ النُّوْرِ","مَسَاءُ الْخَيْرِ","عَفْوًا","لَا"],
  ["Temanmu bertanya kabarmu:","كَيْفَ حَالُكَ؟","أَنَا بِخَيْرٍ","اِسْمِي أَحْمَد","هٰذَا كِتَابٌ","تَحْتَ الْكُرْسِيِّ"],
  ["Temanmu memberimu hadiah. Kamu bilang:","🎁","شُكْرًا","آسِفٌ","قِفْ","اُنْظُرْ"],
  ["Temanmu berkata 'syukran'. Jawabanmu:","شُكْرًا","عَفْوًا","نَعَمْ","مَرْحَبًا","أَنَا"],
  ["Kamu tidak sengaja menginjak kaki teman:","😅","آسِفٌ","شُكْرًا","مَرْحَبًا","كَمْ"],
  ["Temanmu bertanya namamu:","مَا اسْمُكَ؟","اِسْمِي عُمَر","عُمْرِي ثَمَانِي سَنَوَاتٍ","أَنَا بِخَيْرٍ","فِي الْحَقِيبَةِ"],
  ["Temanmu bertanya umurmu:","كَمْ عُمْرُكَ؟","عُمْرِي تِسْعُ سَنَوَاتٍ","اِسْمِي سِيتِي","هٰذَا قَلَمٌ","صَبَاحُ النُّوْرِ"],
  ["Temanmu bertanya asalmu:","مِنْ أَيْنَ أَنْتَ؟","أَنَا مِنْ إِنْدُونِيسِيَا","أَنَا طَالِبٌ","هٰذِهِ أُمِّي","عَفْوًا"],
  ["Guru bertanya sambil menunjuk buku:","مَا هٰذَا؟","هٰذَا كِتَابٌ","هٰذَا أَبِي","نَعَمْ","أَيْنَ"],
  ["Guru bertanya sambil menunjuk fotomu dan ayahmu:","مَنْ هٰذَا؟","هٰذَا أَبِي","هٰذَا قَلَمٌ","أَحْمَرُ","عَشَرَةٌ"],
  ["Temanmu bertanya 'di mana pena?' Pena ada di dalam tas:","أَيْنَ الْقَلَمُ؟","فِي الْحَقِيبَةِ","عَلَى الرَّأْسِ","أَنَا بِخَيْرٍ","مَرْحَبًا"],
  ["Kamu berpisah pulang sekolah:","👋","إِلَى اللِّقَاءِ","صَبَاحُ الْخَيْرِ","مَا هٰذَا؟","اُكْتُبْ"],
  ["Temanmu bertanya: 'hal tuḥibbul-mauz?' Kamu suka pisang:","هَلْ تُحِبُّ الْمَوْزَ؟","نَعَمْ، أُحِبُّ","لَا أَدْرِي","أَيْنَ","هٰذِهِ"],
  ["Gurumu mempersilakan kamu masuk kelas:","تَفَضَّلْ","شُكْرًا","إِلَى اللِّقَاءِ","كَمْ عُمْرُكَ؟","لَا أَدْرِي"],
  ["Kamu meminta tolong dengan sopan:","🙏","مِنْ فَضْلِكَ","إِلَى اللِّقَاءِ","نَعَمْ","مَا هٰذَا؟"],
  ["Sore hari kamu bertemu gurumu:","🌆","مَسَاءُ الْخَيْرِ","صَبَاحُ الْخَيْرِ","تُصْبِحُ عَلَى خَيْرٍ","أَنَا بِخَيْرٍ"],
  ["Sebelum tidur kamu berpamitan kepada ibu:","😴","تُصْبِحُ عَلَى خَيْرٍ","صَبَاحُ النُّوْرِ","مَرْحَبًا","مَا اسْمُكَ؟"],
  ["Tamu datang ke rumahmu, kamu menyambutnya:","🏠","أَهْلًا وَسَهْلًا","إِلَى اللِّقَاءِ","آسِفٌ","كَمْ"],
  ["Temanmu bertanya di mana kamu tinggal:","أَيْنَ تَسْكُنُ؟","أَسْكُنُ فِي جَاكَرْتَا","أَنَا طَالِبٌ","عُمْرِي عَشْرُ سَنَوَاتٍ","شُكْرًا"],
  ["Guru bertanya sambil menunjuk papan tulis:","مَا هٰذِهِ؟","هٰذِهِ سَبُّورَةٌ","هٰذَا كِتَابٌ","نَعَمْ","أَيْنَ"],
  ["Temanmu memuji gambarmu. Kamu mendoakannya:","🎨","بَارَكَ اللهُ فِيكَ","إِلَى اللِّقَاءِ","لَا","كَيْفَ"],
  ["Guru bertanya kabar seluruh kelas:","كَيْفَ حَالُكُمْ؟","نَحْنُ بِخَيْرٍ","هُوَ مُعَلِّمٌ","فِي الْحَقِيبَةِ","عَفْوًا"]
];

export const KALIMAT: any = [
  [["هٰذَا","كِتَابٌ"],"Ini buku"],
  [["هٰذِهِ","حَقِيبَةٌ"],"Ini tas"],
  [["أَنَا","طَالِبٌ"],"Saya murid"],
  [["اِسْمِي","أَحْمَد"],"Nama saya Ahmad"],
  [["أَنَا","مِنْ","إِنْدُونِيسِيَا"],"Saya dari Indonesia"],
  [["أُحِبُّ","أُسْرَتِي"],"Aku sayang keluargaku"],
  [["هٰذَا","أَبِي"],"Ini ayahku"],
  [["هٰذِهِ","أُمِّي"],"Ini ibuku"],
  [["عِنْدِي","قَلَمٌ"],"Saya punya pena"],
  [["اَلْكِتَابُ","عَلَى","الطَّاوِلَةِ"],"Buku di atas meja"],
  [["اَلْقِطُّ","تَحْتَ","الْكُرْسِيِّ"],"Kucing di bawah kursi"],
  [["أَنَا","أَقْرَأُ","الْكِتَابَ"],"Aku membaca buku"],
  [["أَنَا","أَشْرَبُ","الْحَلِيبَ"],"Aku minum susu"],
  [["أَذْهَبُ","إِلَى","الْمَدْرَسَةِ"],"Aku pergi ke sekolah"],
  [["هُوَ","مُعَلِّمٌ"],"Dia (laki-laki) guru"],
  [["هِيَ","طَالِبَةٌ"],"Dia (perempuan) murid"],
  [["نَحْنُ","أَصْدِقَاءُ"],"Kami berteman"],
  [["اَلْقَمَرُ","جَمِيلٌ"],"Bulan itu indah"],
  [["أُرِيدُ","مَاءً"],"Aku ingin air"],
  [["هُمْ","يَلْعَبُونَ"],"Mereka bermain"],
  [["اَلْجَوُّ","بَارِدٌ"],"Cuaca dingin"],
  [["هٰذِهِ","سَيَّارَةٌ","جَدِيدَةٌ"],"Ini mobil baru"],
  [["اَلطَّالِبُ","فِي","الْفَصْلِ"],"Murid itu di dalam kelas"],
  [["أُمِّي","فِي","الْمَطْبَخِ"],"Ibuku ada di dapur"],
  [["أَبِي","يَقْرَأُ","الْجَرِيدَةَ"],"Ayahku membaca koran"],
  [["أَنَا","أَغْسِلُ","يَدِي"],"Aku mencuci tanganku"],
  [["نَحْنُ","نَذْهَبُ","إِلَى","الْمَسْجِدِ"],"Kami pergi ke masjid"],
  [["اَلطَّبِيبُ","يَعْمَلُ","فِي","الْمُسْتَشْفَى"],"Dokter itu bekerja di rumah sakit"],
  [["أُحِبُّ","اللُّغَةَ","الْعَرَبِيَّةَ"],"Aku suka bahasa Arab"]
];

/* Gerbang Kembar — kelompok huruf mirip + ciri pembeda */
export const KEMBAR: any = [
  ["ب","ba’","1 titik di bawah",["ت","ث","ن"]],
  ["ت","ta’","2 titik di atas",["ب","ث","ن"]],
  ["ث","tsa’","3 titik di atas",["ب","ت","ن"]],
  ["ج","jim","titik di dalam perut",["ح","خ","ع"]],
  ["ح","ḥa’","tanpa titik",["ج","خ","ع"]],
  ["خ","kha’","titik di atas kepala",["ج","ح","ع"]],
  ["د","dal","tanpa titik",["ذ","ر","ز"]],
  ["ذ","dzal","titik di atas",["د","ر","ز"]],
  ["ر","ra’","tanpa titik, ekor melengkung",["ز","د","ذ"]],
  ["ز","zay","titik di atas",["ر","د","ذ"]],
  ["س","sin","tanpa titik",["ش","ص","ض"]],
  ["ش","syin","3 titik di atas",["س","ص","ض"]],
  ["ص","ṣad","tanpa titik",["ض","س","ط"]],
  ["ض","ḍad","titik di atas",["ص","ظ","س"]],
  ["ط","ṭa’","tanpa titik",["ظ","ص","ض"]],
  ["ظ","ẓa’","titik di atas",["ط","ض","ص"]],
  ["ع","‘ain","tanpa titik",["غ","ح","خ"]],
  ["غ","ghain","titik di atas",["ع","ح","خ"]],
  ["ف","fa’","1 titik di atas",["ق","غ","و"]],
  ["ق","qaf","2 titik di atas",["ف","و","غ"]]
];

/* Gerbang Hadza-Hadzihi — mudzakkar vs muannats */
export const HADZA: any = [
  ["كِتَابٌ","buku","M"],["قَلَمٌ","pena","M"],["بَابٌ","pintu","M"],["بَيْتٌ","rumah","M"],
  ["قِطٌّ","kucing","M"],["أَبٌ","ayah","M"],["أَخٌ","kakak/adik laki-laki","M"],["جَدٌّ","kakek","M"],
  ["مَسْجِدٌ","masjid","M"],["فَصْلٌ","kelas","M"],["أَسَدٌ","singa","M"],["خُبْزٌ","roti","M"],
  ["حَقِيبَةٌ","tas","F"],["مَدْرَسَةٌ","sekolah","F"],["سَبُّورَةٌ","papan tulis","F"],["طَاوِلَةٌ","meja","F"],
  ["نَافِذَةٌ","jendela","F"],["غُرْفَةٌ","kamar","F"],["أُمٌّ","ibu","F"],["أُخْتٌ","kakak/adik perempuan","F"],
  ["جَدَّةٌ","nenek","F"],["مِسْطَرَةٌ","penggaris","F"],["مِمْحَاةٌ","penghapus","F"],["دَائِرَةٌ","lingkaran","F"],
  ["قَمَرٌ","bulan","M"],["بَحْرٌ","laut","M"],["جَبَلٌ","gunung","M"],["مِفْتَاحٌ","kunci","M"],
  ["حِصَانٌ","kuda","M"],["مِصْبَاحٌ","lampu","M"],["طَبِيبٌ","dokter","M"],["قَلْبٌ","hati","M"],
  ["سَيَّارَةٌ","mobil","F"],["زَهْرَةٌ","bunga","F"],["شَجَرَةٌ","pohon","F"],["سَاعَةٌ","jam","F"],
  ["كُرَةٌ","bola","F"],["دَجَاجَةٌ","ayam","F"],["مُعَلِّمَةٌ","guru perempuan","F"],["دَرَّاجَةٌ","sepeda","F"]
];

/* ============================================================
   BANK SOAL BARU
============================================================ */

/* Gerbang Sambung — bentuk huruf di awal / tengah / akhir kata.
   [tunggal, nama, awal, tengah, akhir, bisaDisambungKeKiri] */
export const SAMBUNG: any = [
  ["ب","ba’","بـ","ـبـ","ـب",true],
  ["ت","ta’","تـ","ـتـ","ـت",true],
  ["ث","tsa’","ثـ","ـثـ","ـث",true],
  ["ج","jim","جـ","ـجـ","ـج",true],
  ["ح","ḥa’","حـ","ـحـ","ـح",true],
  ["خ","kha’","خـ","ـخـ","ـخ",true],
  ["س","sin","سـ","ـسـ","ـس",true],
  ["ش","syin","شـ","ـشـ","ـش",true],
  ["ص","ṣad","صـ","ـصـ","ـص",true],
  ["ض","ḍad","ضـ","ـضـ","ـض",true],
  ["ط","ṭa’","طـ","ـطـ","ـط",true],
  ["ع","‘ain","عـ","ـعـ","ـع",true],
  ["غ","ghain","غـ","ـغـ","ـغ",true],
  ["ف","fa’","فـ","ـفـ","ـف",true],
  ["ق","qaf","قـ","ـقـ","ـق",true],
  ["ك","kaf","كـ","ـكـ","ـك",true],
  ["ل","lam","لـ","ـلـ","ـل",true],
  ["م","mim","مـ","ـمـ","ـم",true],
  ["ن","nun","نـ","ـنـ","ـن",true],
  ["ه","ha’","هـ","ـهـ","ـه",true],
  ["ي","ya’","يـ","ـيـ","ـي",true],
  ["ا","alif","ا","ـا","ـا",false],
  ["د","dal","د","ـد","ـد",false],
  ["ذ","dzal","ذ","ـذ","ـذ",false],
  ["ر","ra’","ر","ـر","ـر",false],
  ["ز","zay","ز","ـز","ـز",false],
  ["و","wau","و","ـو","ـو",false]
];

/* Gerbang Raqm — angka Arab (arqām hindiyyah) */
export const RAQM: any = [
  [0,"٠","صِفْرٌ","ṣifrun"],[1,"١","وَاحِدٌ","wāḥidun"],[2,"٢","اِثْنَانِ","itsnāni"],
  [3,"٣","ثَلَاثَةٌ","tsalātsatun"],[4,"٤","أَرْبَعَةٌ","arba‘atun"],[5,"٥","خَمْسَةٌ","khamsatun"],
  [6,"٦","سِتَّةٌ","sittatun"],[7,"٧","سَبْعَةٌ","sab‘atun"],[8,"٨","ثَمَانِيَةٌ","tsamāniyatun"],
  [9,"٩","تِسْعَةٌ","tis‘atun"],[10,"١٠","عَشَرَةٌ","‘asyaratun"],
  [11,"١١","أَحَدَ عَشَرَ","aḥada ‘asyara"],[12,"١٢","اِثْنَا عَشَرَ","itsnā ‘asyara"],
  [13,"١٣","ثَلَاثَةَ عَشَرَ","tsalātsata ‘asyara"],[15,"١٥","خَمْسَةَ عَشَرَ","khamsata ‘asyara"],
  [20,"٢٠","عِشْرُونَ","‘isyrūna"],[30,"٣٠","ثَلَاثُونَ","tsalātsūna"],
  [50,"٥٠","خَمْسُونَ","khamsūna"],[100,"١٠٠","مِائَةٌ","mi’atun"]
];

/* Gerbang Dhamir — kata ganti [arab, translit, arti, situasi] */
export const DHAMIR: any = [
  ["أَنَا","anā","saya","🧒 Kamu bicara tentang DIRIMU SENDIRI"],
  ["نَحْنُ","naḥnu","kami / kita","🧒🧒 Kamu bicara tentang DIRIMU DAN TEMANMU"],
  ["أَنْتَ","anta","kamu (laki-laki)","👦 Kamu bicara KEPADA seorang anak laki-laki"],
  ["أَنْتِ","anti","kamu (perempuan)","👧 Kamu bicara KEPADA seorang anak perempuan"],
  ["أَنْتُمْ","antum","kalian (laki-laki)","👦👦 Kamu bicara KEPADA banyak anak laki-laki"],
  ["أَنْتُنَّ","antunna","kalian (perempuan)","👧👧 Kamu bicara KEPADA banyak anak perempuan"],
  ["هُوَ","huwa","dia (laki-laki)","👨 Kamu bicara TENTANG seorang laki-laki"],
  ["هِيَ","hiya","dia (perempuan)","👩 Kamu bicara TENTANG seorang perempuan"],
  ["هُمْ","hum","mereka (laki-laki)","👨👨 Kamu bicara TENTANG banyak laki-laki"],
  ["هُنَّ","hunna","mereka (perempuan)","👩👩 Kamu bicara TENTANG banyak perempuan"]
];

/* Gerbang Tempat — kata keterangan tempat [arab, translit, arti] */
export const TEMPAT: any = [
  ["فِي","fī","di dalam"],
  ["عَلَى","‘alā","di atas (menempel)"],
  ["تَحْتَ","taḥta","di bawah"],
  ["فَوْقَ","fauqa","di atas (melayang)"],
  ["أَمَامَ","amāma","di depan"],
  ["خَلْفَ","khalfa","di belakang"],
  ["بِجَانِبِ","bijānibi","di samping"]
];
/* [emoji benda, emoji tempat, jawaban arab, kalimat petunjuk] */
export const TEMPAT_ADEGAN: any = [
  ["🖊️","🎒","فِي","Pena itu ada di DALAM tas"],
  ["🐟","💧","فِي","Ikan itu ada di DALAM air"],
  ["📖","🪑","عَلَى","Buku itu ada di ATAS meja (menempel)"],
  ["🍎","🪑","عَلَى","Apel itu ada di ATAS kursi (menempel)"],
  ["🐱","🪑","تَحْتَ","Kucing itu ada di BAWAH kursi"],
  ["⚽","🛏️","تَحْتَ","Bola itu ada di BAWAH tempat tidur"],
  ["🌙","🕌","فَوْقَ","Bulan itu ada di ATAS masjid (melayang)"],
  ["🐦","🌴","فَوْقَ","Burung itu ada di ATAS pohon (terbang)"],
  ["🧒","🚪","أَمَامَ","Anak itu berdiri di DEPAN pintu"],
  ["🚗","🏠","أَمَامَ","Mobil itu ada di DEPAN rumah"],
  ["🐰","🌳","خَلْفَ","Kelinci itu bersembunyi di BELAKANG pohon"],
  ["🧒","🏫","خَلْفَ","Anak itu ada di BELAKANG sekolah"],
  ["🪑","🚪","بِجَانِبِ","Kursi itu ada di SAMPING pintu"],
  ["🕌","🏠","بِجَانِبِ","Masjid itu ada di SAMPING rumah"],
  ["💧","🥛","فِي","Air itu ada di DALAM gelas"],
  ["📖","🎒","فِي","Buku itu ada di DALAM tas"],
  ["🕰️","🚪","فَوْقَ","Jam itu ada di ATAS pintu"],
  ["🌳","🏫","أَمَامَ","Pohon itu ada di DEPAN sekolah"],
  ["🐱","🚪","خَلْفَ","Kucing itu bersembunyi di BELAKANG pintu"],
  ["🍎","📖","عَلَى","Apel itu ada di ATAS buku (menempel)"],
  ["🐝","🌸","فَوْقَ","Lebah itu terbang di ATAS bunga"],
  ["🚲","🌳","بِجَانِبِ","Sepeda itu ada di SAMPING pohon"]
];

/* Gerbang Lawan — antonim [arab A, translit A, arti A, arab B, translit B, arti B] */
export const LAWAN: any = [
  ["كَبِيرٌ","kabīrun","besar","صَغِيرٌ","ṣaghīrun","kecil"],
  ["طَوِيلٌ","ṭawīlun","panjang/tinggi","قَصِيرٌ","qaṣīrun","pendek"],
  ["جَدِيدٌ","jadīdun","baru","قَدِيمٌ","qadīmun","lama"],
  ["حَارٌّ","ḥārrun","panas","بَارِدٌ","bāridun","dingin"],
  ["نَظِيفٌ","naẓīfun","bersih","وَسِخٌ","wasikhun","kotor"],
  ["سَهْلٌ","sahlun","mudah","صَعْبٌ","ṣa‘bun","sulit"],
  ["قَرِيبٌ","qarībun","dekat","بَعِيدٌ","ba‘īdun","jauh"],
  ["كَثِيرٌ","katsīrun","banyak","قَلِيلٌ","qalīlun","sedikit"],
  ["ثَقِيلٌ","tsaqīlun","berat","خَفِيفٌ","khafīfun","ringan"],
  ["مَفْتُوحٌ","maftūḥun","terbuka","مُغْلَقٌ","mughlaqun","tertutup"],
  ["نَهَارٌ","nahārun","siang","لَيْلٌ","lailun","malam"],
  ["حُلْوٌ","ḥulwun","manis","مُرٌّ","murrun","pahit"],
  ["غَنِيٌّ","ghaniyyun","kaya","فَقِيرٌ","faqīrun","miskin"],
  ["قَوِيٌّ","qawiyyun","kuat","ضَعِيفٌ","ḍa‘īfun","lemah"],
  ["سَرِيعٌ","sarī‘un","cepat","بَطِيءٌ","baṭī’un","lambat"],
  ["جَمِيلٌ","jamīlun","cantik/indah","قَبِيحٌ","qabīḥun","buruk rupa"],
  ["وَاسِعٌ","wāsi‘un","luas","ضَيِّقٌ","ḍayyiqun","sempit"],
  ["مَرِيضٌ","marīḍun","sakit","صَحِيحٌ","ṣaḥīḥun","sehat"],
  ["أَوَّلٌ","awwalun","pertama","آخِرٌ","ākhirun","terakhir"],
  ["مُرْتَفِعٌ","murtafi‘un","tinggi","مُنْخَفِضٌ","munkhafiḍun","rendah"]
];

/* Gerbang Hari — nama hari [arab, translit, arti] */
export const HARI: any = [
  ["اَلْأَحَدُ","al-aḥadu","Minggu"],
  ["اَلْإِثْنَيْنِ","al-itsnaini","Senin"],
  ["اَلثُّلَاثَاءُ","ats-tsulātsā’u","Selasa"],
  ["اَلْأَرْبِعَاءُ","al-arbi‘ā’u","Rabu"],
  ["اَلْخَمِيسُ","al-khamīsu","Kamis"],
  ["اَلْجُمُعَةُ","al-jumu‘atu","Jumat"],
  ["اَلسَّبْتُ","as-sabtu","Sabtu"]
];

/* Gerbang Fi'il — kata kerja [emoji, arab, translit, arti] */
export const FIIL: any = [
  ["📖","يَقْرَأُ","yaqra’u","membaca"],
  ["✍️","يَكْتُبُ","yaktubu","menulis"],
  ["🍽️","يَأْكُلُ","ya’kulu","makan"],
  ["🥤","يَشْرَبُ","yasyrabu","minum"],
  ["🚶","يَمْشِي","yamsyī","berjalan"],
  ["😴","يَنَامُ","yanāmu","tidur"],
  ["🏃","يَجْرِي","yajrī","berlari"],
  ["🪑","يَجْلِسُ","yajlisu","duduk"],
  ["🧍","يَقُومُ","yaqūmu","berdiri"],
  ["🕌","يُصَلِّي","yuṣallī","shalat"],
  ["👂","يَسْمَعُ","yasma‘u","mendengar"],
  ["👁️","يَنْظُرُ","yanẓuru","melihat"],
  ["🗣️","يَتَكَلَّمُ","yatakallamu","berbicara"],
  ["🧼","يَغْسِلُ","yaghsilu","mencuci"],
  ["😂","يَضْحَكُ","yaḍḥaku","tertawa"],
  ["🎓","يَدْرُسُ","yadrusu","belajar"],
  ["🎨","يَرْسُمُ","yarsumu","menggambar"],
  ["⚽","يَلْعَبُ","yal‘abu","bermain"],
  ["🏊","يَسْبَحُ","yasbaḥu","berenang"],
  ["🚪","يَفْتَحُ","yaftaḥu","membuka"],
  ["🛒","يَشْتَرِي","yasytarī","membeli"],
  ["🤝","يُسَاعِدُ","yusā‘idu","menolong"],
  ["✈️","يُسَافِرُ","yusāfiru","bepergian"],
  ["🎁","يُعْطِي","yu‘ṭī","memberi"],
  ["😢","يَبْكِي","yabkī","menangis"],
  ["🍳","يَطْبُخُ","yaṭbukhu","memasak"],
  ["🧎","يَسْجُدُ","yasjudu","bersujud"],
  ["🚗","يَرْكَبُ","yarkabu","naik kendaraan"]
];

/* Gerbang Eja — susun huruf jadi kata (tanpa harakat agar mudah dipisah)
   [emoji, kata, translit, arti] */
export const EJA: any = [
  ["📖","كتاب","kitāb","buku"],
  ["🖊️","قلم","qalam","pena"],
  ["🚪","باب","bāb","pintu"],
  ["🏠","بيت","bait","rumah"],
  ["🐱","قط","qiṭṭ","kucing"],
  ["🐟","سمك","samak","ikan"],
  ["🦁","أسد","asad","singa"],
  ["🍞","خبز","khubz","roti"],
  ["✋","يد","yad","tangan"],
  ["👁️","عين","‘ain","mata"],
  ["🕌","مسجد","masjid","masjid"],
  ["🏫","مدرسة","madrasah","sekolah"],
  ["🌙","قمر","qamar","bulan"],
  ["☀️","شمس","syams","matahari"],
  ["⭐","نجم","najm","bintang"],
  ["🌴","نخلة","nakhlah","pohon kurma"],
  ["🐪","جمل","jamal","unta"],
  ["💧","ماء","mā’","air"],
  ["🍯","عسل","‘asal","madu"],
  ["🐝","نحل","naḥl","lebah"],
  ["🌊","بحر","baḥr","laut"],
  ["🏔️","جبل","jabal","gunung"],
  ["❤️","قلب","qalb","hati"],
  ["🦵","رجل","rijl","kaki"],
  ["🗝️","مفتاح","miftāḥ","kunci"],
  ["☁️","سحاب","saḥāb","awan"],
  ["🌸","زهرة","zahrah","bunga"],
  ["👕","قميص","qamīṣ","baju"],
  ["🚗","سيارة","sayyārah","mobil"],
  ["🐓","دجاجة","dajājah","ayam"]
];

/* Gerbang Doa — dzikir & doa harian [situasi, arab, translit, arti] */
export const DOA: any = [
  ["Sebelum makan","بِسْمِ اللهِ","bismillāh","Dengan nama Allah"],
  ["Sesudah makan","اَلْحَمْدُ لِلَّهِ","alḥamdulillāh","Segala puji bagi Allah"],
  ["Sebelum belajar","رَبِّ زِدْنِي عِلْمًا","rabbi zidnī ‘ilmā","Tuhanku, tambahkanlah ilmuku"],
  ["Sebelum tidur","بِاسْمِكَ اللَّهُمَّ أَحْيَا وَأَمُوتُ","bismika-llāhumma aḥyā wa amūt","Dengan nama-Mu ya Allah aku hidup dan mati"],
  ["Melihat sesuatu yang menakjubkan","مَا شَاءَ اللهُ","māsyā’allāh","Atas kehendak Allah"],
  ["Berjanji melakukan sesuatu besok","إِنْ شَاءَ اللهُ","insyā’allāh","Jika Allah menghendaki"],
  ["Menjawab teman yang bersin","يَرْحَمُكَ اللهُ","yarḥamukallāh","Semoga Allah merahmatimu"],
  ["Mendengar kabar musibah","إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ","innā lillāhi wa innā ilaihi rāji‘ūn","Kami milik Allah dan kepada-Nya kami kembali"],
  ["Meminta ampun kepada Allah","أَسْتَغْفِرُ اللهَ","astaghfirullāh","Aku memohon ampun kepada Allah"],
  ["Memuji kesucian Allah","سُبْحَانَ اللهِ","subḥānallāh","Maha Suci Allah"],
  ["Ketika bangun tidur","اَلْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا","alḥamdulillāhilladzī aḥyānā","Segala puji bagi Allah yang menghidupkan kami"],
  ["Sebelum bepergian","بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ","bismillāhi tawakkaltu ‘alallāh","Dengan nama Allah aku bertawakal kepada Allah"],
  ["Ketika masuk masjid","اَللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ","allāhummaftaḥ lī abwāba raḥmatik","Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu"],
  ["Berterima kasih & mendoakan teman","بَارَكَ اللهُ فِيكَ","bārakallāhu fīk","Semoga Allah memberkahimu"],
  ["Mendoakan kedua orang tua","رَبِّ ارْحَمْهُمَا","rabbirḥamhumā","Tuhanku, sayangilah keduanya"],
  ["Ketika menghadapi kesulitan","حَسْبُنَا اللهُ","ḥasbunallāh","Cukuplah Allah bagi kami"],
  ["Ketika bersin","اَلْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ","alḥamdulillāhi rabbil ‘ālamīn","Segala puji bagi Allah Tuhan semesta alam"]
];

/* ============================================================
   MATERI TAMBAHAN
============================================================ */

/* Gerbang Syamsi — "ال" qamariyah (dibaca jelas) vs syamsiyah (lam dilebur)
   [kata ber-ال, translit, arti, jenis Q/S, huruf sesudah ال] */
export const SYAMSI: any = [
  ["اَلْقَمَرُ","al-qamaru","bulan","Q","ق"],
  ["اَلْبَيْتُ","al-baitu","rumah","Q","ب"],
  ["اَلْكِتَابُ","al-kitābu","buku","Q","ك"],
  ["اَلْمَسْجِدُ","al-masjidu","masjid","Q","م"],
  ["اَلْوَلَدُ","al-waladu","anak laki-laki","Q","و"],
  ["اَلْجَمَلُ","al-jamalu","unta","Q","ج"],
  ["اَلْعَيْنُ","al-‘ainu","mata","Q","ع"],
  ["اَلْفِيلُ","al-fīlu","gajah","Q","ف"],
  ["اَلْحَقِيبَةُ","al-ḥaqībatu","tas","Q","ح"],
  ["اَلْأَسَدُ","al-asadu","singa","Q","أ"],
  ["اَلْخُبْزُ","al-khubzu","roti","Q","خ"],
  ["اَلْغُرْفَةُ","al-ghurfatu","kamar","Q","غ"],
  ["اَلْهِلَالُ","al-hilālu","bulan sabit","Q","هـ"],
  ["اَلْيَدُ","al-yadu","tangan","Q","ي"],
  ["اَلشَّمْسُ","asy-syamsu","matahari","S","ش"],
  ["اَلسَّمَكُ","as-samaku","ikan","S","س"],
  ["اَلتُّفَّاحُ","at-tuffāḥu","apel","S","ت"],
  ["اَلنَّجْمُ","an-najmu","bintang","S","ن"],
  ["اَلرَّجُلُ","ar-rajulu","laki-laki","S","ر"],
  ["اَلدَّرْسُ","ad-darsu","pelajaran","S","د"],
  ["اَلطَّالِبُ","aṭ-ṭālibu","murid","S","ط"],
  ["اَلصَّبَاحُ","aṣ-ṣabāḥu","pagi","S","ص"],
  ["اَلزَّهْرَةُ","az-zahratu","bunga","S","ز"],
  ["اَلثَّوْبُ","ats-tsaubu","baju","S","ث"],
  ["اَلذَّهَبُ","adz-dzahabu","emas","S","ذ"],
  ["اَلضَّيْفُ","aḍ-ḍaifu","tamu","S","ض"],
  ["اَلظُّهْرُ","aẓ-ẓuhru","waktu zuhur","S","ظ"]
];

/* Gerbang Jamak — satu ↔ banyak
   [mufrad, translit mufrad, jamak, translit jamak, arti] */
export const JAMAK: any = [
  ["كِتَابٌ","kitābun","كُتُبٌ","kutubun","buku"],
  ["قَلَمٌ","qalamun","أَقْلَامٌ","aqlāmun","pena"],
  ["بَيْتٌ","baitun","بُيُوتٌ","buyūtun","rumah"],
  ["بَابٌ","bābun","أَبْوَابٌ","abwābun","pintu"],
  ["وَلَدٌ","waladun","أَوْلَادٌ","aulādun","anak laki-laki"],
  ["بِنْتٌ","bintun","بَنَاتٌ","banātun","anak perempuan"],
  ["طَالِبٌ","ṭālibun","طُلَّابٌ","ṭullābun","murid"],
  ["مُعَلِّمٌ","mu‘allimun","مُعَلِّمُونَ","mu‘allimūna","guru"],
  ["صَدِيقٌ","ṣadīqun","أَصْدِقَاءُ","aṣdiqā’u","teman"],
  ["رَجُلٌ","rajulun","رِجَالٌ","rijālun","laki-laki"],
  ["عَيْنٌ","‘aynun","عُيُونٌ","‘uyūnun","mata"],
  ["يَدٌ","yadun","أَيْدِي","aydī","tangan"],
  ["مَدْرَسَةٌ","madrasatun","مَدَارِسُ","madārisu","sekolah"],
  ["مَسْجِدٌ","masjidun","مَسَاجِدُ","masājidu","masjid"],
  ["نَافِذَةٌ","nāfidzatun","نَوَافِذُ","nawāfidzu","jendela"],
  ["طَاوِلَةٌ","ṭāwilatun","طَاوِلَاتٌ","ṭāwilātun","meja"],
  ["سَيَّارَةٌ","sayyāratun","سَيَّارَاتٌ","sayyārātun","mobil"],
  ["شَجَرَةٌ","syajaratun","أَشْجَارٌ","asyjārun","pohon"]
];

/* Gerbang Mihnah — profesi [emoji, arab, translit, arti] */
export const MIHNAH: any = [
  ["👨‍🏫","مُعَلِّمٌ","mu‘allimun","guru"],
  ["👨‍⚕️","طَبِيبٌ","ṭabībun","dokter"],
  ["👩‍⚕️","مُمَرِّضَةٌ","mumarriḍatun","perawat"],
  ["👮","شُرْطِيٌّ","syurṭiyyun","polisi"],
  ["👨‍🌾","فَلَّاحٌ","fallāḥun","petani"],
  ["🎣","صَيَّادٌ","ṣayyādun","nelayan"],
  ["👨‍🍳","طَبَّاخٌ","ṭabbākhun","juru masak"],
  ["🧑‍🔧","مُهَنْدِسٌ","muhandisun","insinyur"],
  ["🧑‍✈️","طَيَّارٌ","ṭayyārun","pilot"],
  ["🧑‍🎓","طَالِبٌ","ṭālibun","murid"],
  ["🧑‍💼","تَاجِرٌ","tājirun","pedagang"],
  ["🪚","نَجَّارٌ","najjārun","tukang kayu"],
  ["🚗","سَائِقٌ","sā’iqun","sopir"],
  ["✍️","كَاتِبٌ","kātibun","penulis"],
  ["🕌","إِمَامٌ","imāmun","imam"],
  ["🧑‍🚒","إِطْفَائِيٌّ","iṭfā’iyyun","pemadam kebakaran"]
];

/* Gerbang Cuaca — cuaca & musim [emoji, arab, translit, arti] */
export const CUACA: any = [
  ["☀️","مُشْمِسٌ","musymisun","cerah"],
  ["🌧️","مُمْطِرٌ","mumṭirun","hujan"],
  ["☁️","غَائِمٌ","ghā’imun","berawan"],
  ["🌬️","رِيحٌ","rīḥun","angin"],
  ["❄️","ثَلْجٌ","tsaljun","salju"],
  ["🔥","حَارٌّ","ḥārrun","panas"],
  ["🥶","بَارِدٌ","bāridun","dingin"],
  ["🌈","قَوْسُ قُزَحٍ","qausu quzaḥin","pelangi"],
  ["⛈️","رَعْدٌ","ra‘dun","guruh"],
  ["🌫️","ضَبَابٌ","ḍabābun","kabut"],
  ["🌡️","اَلطَّقْسُ","aṭ-ṭaqsu","cuaca"],
  ["🌸","اَلرَّبِيعُ","ar-rabī‘u","musim semi"],
  ["🏖️","اَلصَّيْفُ","aṣ-ṣaifu","musim panas"],
  ["🍂","اَلْخَرِيفُ","al-kharīfu","musim gugur"],
  ["⛄","اَلشِّتَاءُ","asy-syitā’u","musim dingin"]
];

/* Gerbang Waktu — waktu harian & satuan waktu [emoji, arab, translit, arti] */
export const WAKTU: any = [
  ["🌄","فَجْرٌ","fajrun","subuh"],
  ["🌅","صَبَاحٌ","ṣabāḥun","pagi"],
  ["🌞","ظُهْرٌ","ẓuhrun","tengah hari"],
  ["🌇","عَصْرٌ","‘aṣrun","sore"],
  ["🌆","مَسَاءٌ","masā’un","petang"],
  ["🌙","لَيْلٌ","lailun","malam"],
  ["📅","يَوْمٌ","yaumun","hari"],
  ["🗓️","أُسْبُوعٌ","usbū‘un","pekan"],
  ["📆","شَهْرٌ","syahrun","bulan"],
  ["🎉","سَنَةٌ","sanatun","tahun"],
  ["⏰","سَاعَةٌ","sā‘atun","jam"],
  ["⏱️","دَقِيقَةٌ","daqīqatun","menit"],
  ["⏲️","ثَانِيَةٌ","tsāniyatun","detik"],
  ["🕰️","اَلْآنَ","al-āna","sekarang"],
  ["⏭️","غَدًا","ghadan","besok"],
  ["⏮️","أَمْسِ","amsi","kemarin"],
  ["📍","اَلْيَوْمَ","al-yauma","hari ini"]
];

/* Gerbang Alam — benda-benda alam [emoji, arab, translit, arti] */
export const ALAM: any = [
  ["☀️","شَمْسٌ","syamsun","matahari"],
  ["🌙","قَمَرٌ","qamarun","bulan"],
  ["⭐","نَجْمٌ","najmun","bintang"],
  ["☁️","سَحَابٌ","saḥābun","awan"],
  ["🌊","بَحْرٌ","baḥrun","laut"],
  ["🏔️","جَبَلٌ","jabalun","gunung"],
  ["🏜️","صَحْرَاءُ","ṣaḥrā’u","padang pasir"],
  ["🌳","شَجَرَةٌ","syajaratun","pohon"],
  ["🌸","زَهْرَةٌ","zahratun","bunga"],
  ["🍃","وَرَقَةٌ","waraqatun","daun"],
  ["🪨","حَجَرٌ","ḥajarun","batu"],
  ["🏞️","نَهْرٌ","nahrun","sungai"],
  ["🌍","أَرْضٌ","arḍun","bumi"],
  ["🌤️","سَمَاءٌ","samā’un","langit"],
  ["🔥","نَارٌ","nārun","api"],
  ["💨","هَوَاءٌ","hawā’un","udara"],
  ["🏝️","جَزِيرَةٌ","jazīratun","pulau"],
  ["🌾","حَقْلٌ","ḥaqlun","ladang"]
];

/* Gerbang Tanya — kata tanya [arab, translit, arti] */
export const TANYA: any = [
  ["مَا","mā","apa (untuk benda)"],
  ["مَنْ","man","siapa"],
  ["أَيْنَ","aina","di mana"],
  ["كَيْفَ","kaifa","bagaimana"],
  ["كَمْ","kam","berapa"],
  ["مَتَى","matā","kapan"],
  ["لِمَاذَا","limādzā","mengapa"],
  ["هَلْ","hal","apakah"]
];
/* [situasi, kalimat berlubang, jawaban, keterangan] */
export const TANYA_SOAL: any = [
  ["Kamu ingin tahu NAMA temanmu.","___ اسْمُكَ؟","مَا","mā ismuka? = siapa namamu"],
  ["Guru menunjuk foto, kamu ingin tahu ORANGNYA.","___ هٰذَا؟","مَنْ","man hādzā? = siapa ini"],
  ["Penamu hilang, kamu mencarinya.","___ الْقَلَمُ؟","أَيْنَ","aina-l-qalamu? = di mana pena"],
  ["Kamu menanyakan KABAR temanmu.","___ حَالُكَ؟","كَيْفَ","kaifa ḥāluka? = bagaimana kabarmu"],
  ["Kamu ingin tahu UMUR temanmu.","___ عُمْرُكَ؟","كَمْ","kam ‘umruka? = berapa umurmu"],
  ["Kamu ingin tahu KAPAN ujian dimulai.","___ الْاِمْتِحَانُ؟","مَتَى","matā-l-imtiḥānu? = kapan ujian"],
  ["Kamu ingin tahu ALASAN temanmu menangis.","___ تَبْكِي؟","لِمَاذَا","limādzā tabkī? = mengapa kamu menangis"],
  ["Kamu menanyakan apakah temanmu suka pisang.","___ تُحِبُّ الْمَوْزَ؟","هَلْ","hal tuḥibbu-l-mauza? = apakah kamu suka pisang"],
  ["Kamu ingin tahu JUMLAH buku di tas.","___ كِتَابًا فِي الْحَقِيبَةِ؟","كَمْ","kam kitāban? = berapa buku"],
  ["Guru memegang sesuatu, kamu ingin tahu BENDANYA.","___ هٰذَا؟","مَا","mā hādzā? = apa ini"],
  ["Kamu ingin tahu LETAK rumah temanmu.","___ بَيْتُكَ؟","أَيْنَ","aina baituka? = di mana rumahmu"],
  ["Kamu menanyakan KEADAAN cuaca hari ini.","___ الطَّقْسُ الْيَوْمَ؟","كَيْفَ","kaifa-ṭ-ṭaqsu? = bagaimana cuaca"],
  ["Kamu ingin tahu SIAPA guru barumu.","___ الْمُعَلِّمُ الْجَدِيدُ؟","مَنْ","man al-mu‘allimu? = siapa gurunya"],
  ["Kamu menanyakan waktu pulang sekolah.","___ نَرْجِعُ؟","مَتَى","matā narji‘u? = kapan kita pulang"]
];

/* Gerbang Perintah (fi'il amr) di kelas [emoji, arab, translit, arti] */
export const AMR: any = [
  ["✍️","اُكْتُبْ","uktub","tulislah"],
  ["📖","اِقْرَأْ","iqra’","bacalah"],
  ["🪑","اِجْلِسْ","ijlis","duduklah"],
  ["🧍","قِفْ","qif","berdirilah"],
  ["👂","اِسْمَعْ","isma‘","dengarkanlah"],
  ["👁️","اُنْظُرْ","unẓur","lihatlah"],
  ["🚪","اِفْتَحْ","iftaḥ","bukalah"],
  ["🔒","أَغْلِقْ","aghliq","tutuplah"],
  ["🤫","اُسْكُتْ","uskut","diamlah"],
  ["🗣️","قُلْ","qul","katakanlah"],
  ["🏃","تَعَالَ","ta‘āla","kemarilah"],
  ["🔁","أَعِدْ","a‘id","ulangilah"],
  ["🖐️","اِرْفَعْ يَدَكَ","irfa‘ yadaka","angkat tanganmu"],
  ["🧹","نَظِّفْ","naẓẓif","bersihkanlah"]
];

export const EMOJI_HITUNG: any = ["🍎","⭐","🐪","🏮","🌙","🐟","📚","🌴"];

/* ============================================================
   TINGKAT TANTANGAN
   opsi = jumlah pilihan jawaban, soal = jumlah soal per ronde
============================================================ */
export const LEVELS: any = [
  {id:"musafir",    emoji:"🐫", nama:"Musafir",    opsi:3, soal:30, nyawa:6, sub:"30 soal · huruf & kata pendek · 3 pilihan · 6 nyawa"},
  {id:"pengembara", emoji:"🧞", nama:"Pengembara", opsi:4, soal:30, nyawa:5, sub:"30 soal · kata lebih panjang · 4 pilihan · 5 nyawa"},
  {id:"sultan",     emoji:"👑", nama:"Sultan",     opsi:5, soal:30, nyawa:4, sub:"30 soal · semua materi · 5 pilihan · 4 nyawa"}
];

/* ============================================================
   PANGKAT — naik otomatis mengikuti total bintang
============================================================ */
export const PANGKAT: any = [
  {min:0,   emoji:"🐫", nama:"Musafir Kecil"},
  {min:20,  emoji:"🧭", nama:"Penjelajah Gurun"},
  {min:50,  emoji:"🏮", nama:"Pembawa Lentera"},
  {min:90,  emoji:"🪄", nama:"Murid Penyihir Kata"},
  {min:140, emoji:"🧞", nama:"Sahabat Jin"},
  {min:200, emoji:"🕌", nama:"Penjaga Gerbang"},
  {min:280, emoji:"👑", nama:"Sultan Bahasa"},
  {min:380, emoji:"🌟", nama:"Bintang 1001 Malam"}
];

/* ============================================================
   MISI HARIAN — 3 misi diundi tiap hari, tiap misi berhadiah bintang
   kunci = nama penghitung harian yang dipakai di js/sistem.js
============================================================ */
export const MISI_BONUS: any = 5;
export const MISI: any = [
  {id:"kategori", ikon:"🧭", teks:"Main di 2 kategori berbeda",            target:2,  kunci:"kategori"},
  {id:"beruntun", ikon:"🔥", teks:"Dapat 8 jawaban benar beruntun",        target:8,  kunci:"beruntun"},
  {id:"sempurna", ikon:"🏆", teks:"Selesaikan 1 permainan dengan ⭐⭐⭐",   target:1,  kunci:"sempurna"},
  {id:"ronde",    ikon:"🎯", teks:"Selesaikan 3 ronde",                    target:3,  kunci:"ronde"},
  {id:"bintang",  ikon:"⭐", teks:"Kumpulkan 10 bintang hari ini",         target:10, kunci:"bintang"},
  {id:"benar",    ikon:"✔️", teks:"Jawab 25 soal dengan benar",            target:25, kunci:"benar"},
  {id:"gerbang",  ikon:"🚪", teks:"Coba 1 gerbang yang belum pernah dimainkan", target:1, kunci:"gerbangBaru"},
  {id:"dengar",   ikon:"🔊", teks:"Pakai tombol Dengarkan 5 kali",         target:5,  kunci:"dengar"}
];

/* ============================================================
   KUNCI GERBANG — gerbang dibuka bertahap oleh bintang.
   Dua gerbang pertama gratis, lalu tiap gerbang berikutnya +3 bintang.
============================================================ */
export const KUNCI_LANGKAH: any = 3;
export const syaratBintang = (i: number) => i <= 1 ? 0 : (i - 1) * KUNCI_LANGKAH;

/* ============================================================
   ALBUM STIKER — 1 stiker tiap 10 bintang
============================================================ */
export const STIKER_PER_BINTANG: any = 10;
export const STIKER: any = [
  "🌙","⭐","🏮","🐫","🧞","🕌","🌴","🗝️","📜","🪔",
  "🐪","🧿","🍯","🫖","🥁","🪕","🎇","✨","🌠","🐐",
  "🦅","🦂","🐍","🦎","🌵","🏜️","⛺","🧺","👑","💎",
  "🪞","📿","🕋","🌟","🔮","🪄","🎭","🕊️","🐎","🎪",
  "🌅","🫓","🍇","☕","🧭","🪁","🛶","🏺","🧴","🎊"
];

/* Semua bank soal dalam satu peta, agar bisa disaring per level */
export const BANK: any = {
  HURUF, HARAKAT, KATA, ANGKA, RAQM, CAKAP, KALIMAT, KEMBAR, HADZA,
  SAMBUNG, DHAMIR, TEMPAT, TEMPAT_ADEGAN, LAWAN, HARI, FIIL, EJA, DOA,
  SYAMSI, JAMAK, MIHNAH, CUACA, WAKTU, ALAM, TANYA, TANYA_SOAL, AMR
};

/* ============================================================
   DAFTAR GERBANG — sumber tunggal untuk menu
   {id, judul, sub, emoji, warna}
============================================================ */
export const GERBANG: any = [
  { id:"hurufbunyi", grup:"Huruf & Bunyi", desc:"Hijaiyah, harakat, bunyi", items:[
    {id:"huruf",   emoji:"🔤", judul:"Gerbang Huruf",    sub:"Tebak nama huruf hijaiyah", warna:"i1"},
    {id:"harakat", emoji:"🎵", judul:"Gerbang Ba-Bi-Bu", sub:"Baca huruf berharakat",     warna:"i2"},
    {id:"bunyi",   emoji:"👂", judul:"Gerbang Bunyi",    sub:"Dengar bunyi, cari hurufnya",warna:"i7"},
    {id:"kembar",  emoji:"👯", judul:"Gerbang Kembar",   sub:"Bedakan huruf yang mirip",  warna:"i8"},
    {id:"sambung", emoji:"🔗", judul:"Gerbang Sambung",  sub:"Bentuk huruf saat disambung",warna:"i4"},
    {id:"syamsi",  emoji:"🌗", judul:"Gerbang Syamsi",   sub:"ال jelas atau dilebur?",     warna:"i9"},
    {id:"balon",   emoji:"🎈", judul:"Gerbang Balon",    sub:"Letuskan balon huruf!",     warna:"i10"}
  ]},
  { id:"katabenda", grup:"Kata & Benda", desc:"Kosakata, warna, angka", items:[
    {id:"kata",   emoji:"🧺", judul:"Gerbang Kata",   sub:"Gambar ↔ kata Arab",        warna:"i3"},
    {id:"angka",  emoji:"🔢", judul:"Gerbang Angka",  sub:"Hitung lalu jawab Arab",    warna:"i4"},
    {id:"raqm",   emoji:"٣",  judul:"Gerbang Raqm",   sub:"Angka Arab ٠ ١ ٢ ٣",        warna:"i9"},
    {id:"lawan",  emoji:"↔️", judul:"Gerbang Lawan",  sub:"Cari lawan katanya",        warna:"i7"},
    {id:"fiil",   emoji:"🏃", judul:"Gerbang Fi‘il",  sub:"Kata kerja sehari-hari",    warna:"i6"},
    {id:"hari",   emoji:"📅", judul:"Gerbang Hari",   sub:"Nama-nama hari",            warna:"i2"},
    {id:"jamak",  emoji:"👥", judul:"Gerbang Jamak",  sub:"Satu ↔ banyak",             warna:"i5"},
    {id:"memori", emoji:"🧠", judul:"Gerbang Memori", sub:"Cocokkan pasangan kartu",   warna:"i10"},
    {id:"eja",    emoji:"🔠", judul:"Gerbang Eja",    sub:"Susun huruf jadi kata",     warna:"i8"}
  ]},
  { id:"alamdunia", grup:"Alam & Kehidupan", desc:"Profesi, cuaca, waktu, alam", items:[
    {id:"mihnah", emoji:"👨‍⚕️", judul:"Gerbang Mihnah", sub:"Nama-nama profesi",        warna:"i2"},
    {id:"cuaca",  emoji:"🌦️", judul:"Gerbang Cuaca",  sub:"Cuaca & musim",             warna:"i6"},
    {id:"waktu",  emoji:"⏰", judul:"Gerbang Waktu",   sub:"Pagi, siang, malam, jam",   warna:"i9"},
    {id:"alam",   emoji:"🏞️", judul:"Gerbang Alam",   sub:"Matahari, laut, gunung…",   warna:"i3"}
  ]},
  { id:"kalimatcakap", grup:"Kalimat & Percakapan", desc:"Sapaan, kata tunjuk, susun kalimat", items:[
    {id:"cakap",   emoji:"💬", judul:"Gerbang Sapaan", sub:"Pilih jawaban percakapan",  warna:"i5"},
    {id:"hadza",   emoji:"🕌", judul:"Gerbang Hadza",  sub:"هٰذَا atau هٰذِهِ?",          warna:"i9"},
    {id:"dhamir",  emoji:"🙋", judul:"Gerbang Dhamir", sub:"Ana, anta, huwa, hiya…",    warna:"i3"},
    {id:"tempat",  emoji:"📍", judul:"Gerbang Tempat", sub:"Fī, ‘alā, taḥta, fauqa…",   warna:"i6"},
    {id:"tanya",   emoji:"❓", judul:"Gerbang Tanya",   sub:"Mā, man, aina, kaifa…",     warna:"i1"},
    {id:"amr",     emoji:"📣", judul:"Gerbang Perintah",sub:"Uktub, iqra’, ijlis…",     warna:"i8"},
    {id:"kalimat", emoji:"🧩", judul:"Gerbang Kalimat",sub:"Susun kata jadi kalimat",   warna:"i6"},
    {id:"doa",     emoji:"🤲", judul:"Gerbang Doa",    sub:"Doa & dzikir harian",       warna:"i4"}
  ]},
  { id:"tantangan", grup:"Tantangan", desc:"Adu cepat & ujian campuran", items:[
    {id:"kilat", emoji:"⚡", judul:"Gerbang Kilat", sub:"45 detik, jawab sebanyaknya!", warna:"i1"},
    {id:"ujian", emoji:"🏆", judul:"Ujian Akbar",   sub:"12 soal campuran, 3 nyawa!",   warna:"i5"}
  ]}
];

export default { GERBANG, LEVELS, PANGKAT, MISI, STIKER, BANK };
