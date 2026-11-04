import { HajjChecklistItem, PilgrimageGuideStep, PilgrimageType } from '../types';

export const INITIAL_HAJJ_CHECKLIST: HajjChecklistItem[] = [
  // 1. DOKUMEN & ADMINISTRASI
  {
    id: 'chk-doc-1',
    title: 'Paspor Internasional (Masa Berlaku Min. 6-8 Bulan)',
    category: 'DOCUMENTS',
    description: 'Nama pada paspor minimal 2 atau 3 suku kata sesuai regulasi Kemenag & Imigrasi Arab Saudi.',
    isCompleted: false,
    isMandatory: true,
    tips: 'Pastikan nama di paspor identik dengan e-KTP dan Buku Nikah/Akta Lahir.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-doc-2',
    title: 'Visa Haji / Visa Umrah Resmi (Terdaftar di Nusuk Platform)',
    category: 'DOCUMENTS',
    description: 'Pastikan visa telah terbit dan barcode terdaftar aktif pada sistem Kementerian Haji & Umrah Saudi.',
    isCompleted: false,
    isMandatory: true,
    tips: 'Cetak fisik minimal 3 rangkap dan simpan salinan digital (PDF) di cloud dan smartphone.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-doc-3',
    title: 'Buku Kuning Vaksin Internasional (ICV Meningitis & Polio)',
    category: 'DOCUMENTS',
    description: 'Vaksinasi Meningitis Meningokokus wajib disuntikkan minimal 14 hari sebelum keberangkatan.',
    isCompleted: false,
    isMandatory: true,
    tips: 'Unduh juga sertifikat vaksinasi SatuSehat / Kemenkes resmi.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-doc-4',
    title: 'Kartu Peserta BPJS Kesehatan Aktif',
    category: 'DOCUMENTS',
    description: 'Syarat wajib verifikasi keberangkatan jemaah haji dan umrah Indonesia sesuai Kepmenag.',
    isCompleted: false,
    isMandatory: true,
    tips: 'Pastikan status kepesertaan tidak ada tunggakan iuran.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-doc-5',
    title: 'Pasfoto Cadangan (4x6 & 3x4 latar putih, 80% wajah)',
    category: 'DOCUMENTS',
    description: 'Siapkan 5 lembar pasfoto fisik untuk keperluan darurat di bandara atau kantor Daker Makkah/Madinah.',
    isCompleted: false,
    isMandatory: false,
    tips: 'Bagi wanita mengenakan jilbab kontras (tidak warna putih).',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-doc-6',
    title: 'Nomor Porsi Haji / SPPH & Bukti Setoran Lunas BPIH',
    category: 'DOCUMENTS',
    description: 'Bukti pendaftaran Siskohat Kemenag dan surat panggilan embarkasi (khusus jemaah Haji).',
    isCompleted: false,
    isMandatory: true,
    tips: 'Simpan nomor porsi di dompet paspor leher.',
    targetTripType: 'HAJJ'
  },

  // 2. IBADAH & MANASIK
  {
    id: 'chk-ibd-1',
    title: 'Kain Ihram (2 Lembar Tanpa Jahitan untuk Pria)',
    category: 'IBADAH_MANASIK',
    description: 'Bahan katun/handuk sejuk berdaya serap tinggi (1 lembar sarung bawah, 1 lembar selendang rida).',
    isCompleted: false,
    isMandatory: true,
    tips: 'Bawa minimal 2 pasang kain ihram sebagai cadangan jika terkena najis.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-ibd-2',
    title: 'Sabuk Ihram / Gesper Khusus Haji Berkantong Kuat',
    category: 'IBADAH_MANASIK',
    description: 'Sabuk tanpa jahitan atau berklip plastik kuat untuk mengencangkan kain sarung ihram bawah.',
    isCompleted: false,
    isMandatory: true,
    tips: 'Gesper berkancing retsleting aman untuk menyimpan uang pecahan kecil dan kunci hotel.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-ibd-3',
    title: 'Mukena & Gamis Syar\'i Longgar (Untuk Wanita)',
    category: 'IBADAH_MANASIK',
    description: 'Bahan katun adem tidak menerawang, menutup aurat sempurna selain wajah dan telapak tangan.',
    isCompleted: false,
    isMandatory: true,
    tips: 'Hindari model yang menyulitkan wudhu di area umum masjid.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-ibd-4',
    title: 'Buku Saku Kumpulan Doa Manasik & Al-Qur\'an Digital',
    category: 'IBADAH_MANASIK',
    description: 'Hafalan lafal Talbiyah, doa niat Miqat, doa Tawaf 7 putaran, Sa\'i, dan doa wukuf Arafah.',
    isCompleted: false,
    isMandatory: false,
    tips: 'Gunakan fitur doa audio di modul IslamicityLink untuk melancarkan makhraj tajwid.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-ibd-5',
    title: 'Gunting Lipat Kecil untuk Tahallul',
    category: 'IBADAH_MANASIK',
    description: 'Untuk memotong minimal 3 helai rambut setelah selesai Sa\'i (dimasukkan ke bagasi tercatat/koper besar).',
    isCompleted: false,
    isMandatory: true,
    tips: 'PERINGATAN: Jangan masukkan gunting ke dalam tas kabin pesawat agar tidak disita petugas keamanan.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-ibd-6',
    title: 'Pemahaman Fikih Larangan Ihram & Ketentuan Dam',
    category: 'IBADAH_MANASIK',
    description: 'Pahami larangan wewangian, memotong kuku/rambut, menutup kepala bagi pria, bercadar bagi wanita saat ihram.',
    isCompleted: false,
    isMandatory: true,
    tips: 'Ikuti sesi manasik travel/KBIHU minimal 3-5 kali sebelum terbang.',
    targetTripType: 'ALL'
  },

  // 3. PERLENGKAPAN & PAKAIAN
  {
    id: 'chk-eq-1',
    title: 'Sandal / Sepatu Selop Nyaman Anti-Slip & Tas Sandal Serut',
    category: 'EQUIPMENT_CLOTHING',
    description: 'Alas kaki tidak menutup mata kaki saat ihram pria, sangat empuk untuk berjalan 5-10 km/hari.',
    isCompleted: false,
    isMandatory: true,
    tips: 'Selalu bawa sandal ke dalam tas serut saat masuk Masjidil Haram dan Nabawi, jangan ditinggal di luar.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-eq-2',
    title: 'Botol Semprot Wajah (Face Spray) untuk Air Zamzam',
    category: 'EQUIPMENT_CLOTHING',
    description: 'Sangat vital untuk menyegarkan wajah dan kulit kepala saat terik cuaca panas ekstrem (40°C - 48°C).',
    isCompleted: false,
    isMandatory: false,
    tips: 'Isi dengan air Zamzam dingin langsung dari dispenser di dalam masjid.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-eq-3',
    title: 'Kacamata Hitam UV Protection & Payung Lipat Kecil',
    category: 'EQUIPMENT_CLOTHING',
    description: 'Melindungi mata dari pantulan marmer putih Masjidil Haram yang silau dan terik matahari.',
    isCompleted: false,
    isMandatory: false,
    tips: 'Pilih kacamata dengan lensa polarized filter UV400.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-eq-4',
    title: 'Jaket / Sweater Hangat & Kaos Kaki Tebal',
    category: 'EQUIPMENT_CLOTHING',
    description: 'Suhu malam dan Subuh di Madinah bisa turun drastis, serta antisipasi AC bus yang sangat dingin.',
    isCompleted: false,
    isMandatory: false,
    tips: 'Pilih bahan fleece ringan yang mudah dilipat ke dalam ransel harian.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-eq-5',
    title: 'Tas Paspor Selempang Dada / Neck Wallet Anti-Theft',
    category: 'EQUIPMENT_CLOTHING',
    description: 'Tas tipis yang dipakai di balik pakaian untuk menyimpan paspor, visa, kartu kamar, dan uang SAR.',
    isCompleted: false,
    isMandatory: true,
    tips: 'Jangan pernah meninggalkan paspor dan uang di kamar hotel tanpa brankas safety box.',
    targetTripType: 'ALL'
  },

  // 4. KESEHATAN & MEDIS
  {
    id: 'chk-med-1',
    title: 'Obat Pribadi Rutin & Surat Dokter (Untuk 30-45 Hari)',
    category: 'HEALTH_MEDICINE',
    description: 'Obat tensi darah tinggi, diabetes, asam lambung, asma, atau jantung lengkap dengan resep dokter resmi.',
    isCompleted: false,
    isMandatory: true,
    tips: 'Bawa obat dalam kemasan aslinya beserta surat keterangan dokter berbahasa Inggris/Indonesia.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-med-2',
    title: 'Pelembab Bibir (Lip Balm) & Kulit NON-PARFUM (Halal Ihram)',
    category: 'HEALTH_MEDICINE',
    description: 'Udara Saudi sangat kering (kelembapan <15%), mencegah bibir pecah-pecah dan tumit retak.',
    isCompleted: false,
    isMandatory: true,
    tips: 'PERINGATAN: Pastikan 100% bebas wewangian (Fragrance-Free / Pure Petroleum Jelly) agar tidak melanggar larangan ihram.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-med-3',
    title: 'Oralit & Serbuk Elektrolit Rehidrasi Cepat',
    category: 'HEALTH_MEDICINE',
    description: 'Mencegah dehidrasi berat dan heat stroke saat beraktivitas di bawah terik matahari.',
    isCompleted: false,
    isMandatory: true,
    tips: 'Minum 1 sachet per hari dicampur dengan 500ml air zamzam/mineral.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-med-4',
    title: 'Plester Luka / Bantalan Lecet Kaki & Minyak Kayu Putih',
    category: 'HEALTH_MEDICINE',
    description: 'Untuk mengantisipasi lecet telapak kaki akibat tawaf/sai dan pegal linu setelah berjalan jauh.',
    isCompleted: false,
    isMandatory: false,
    tips: 'Gunakan plester hidrokoloid pada tumit sebelum melakukan rangkaian Sa\'i.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-med-5',
    title: 'Masker Medis 3-Ply & Vitamin C / Zinc Booster',
    category: 'HEALTH_MEDICINE',
    description: 'Melindungi saluran pernapasan dari debu padat dan penularan flu batuk (Camel Flu/ISPA).',
    isCompleted: false,
    isMandatory: false,
    tips: 'Ganti masker medis setiap 4-6 jam sekali.',
    targetTripType: 'ALL'
  },

  // 5. FINANSIAL & DIGITAL
  {
    id: 'chk-fin-1',
    title: 'Aplikasi Resmi NUSUK (Kementerian Haji Arab Saudi)',
    category: 'FINANCIAL_DIGITAL',
    description: 'Wajib diinstal untuk reservasi izin tasrih masuk Raudhah Nabawi dan slot waktu Tawaf/Umrah.',
    isCompleted: false,
    isMandatory: true,
    tips: 'Daftarkan akun segera setelah nomor visa resmi Anda terbit dari pihak travel.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-fin-2',
    title: 'Kartu Debit ATM Bank Syariah Berlogo Visa / Mastercard',
    category: 'FINANCIAL_DIGITAL',
    description: 'Untuk penarikan tunai Riyal (SAR) di ATM Al-Rajhi, SNB AlAhli, atau Bank AlJazira dengan kurs kompetitif.',
    isCompleted: false,
    isMandatory: true,
    tips: 'Aktifkan fitur transaksi luar negeri (Overseas Usage) pada m-banking Anda sebelum terbang.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-fin-3',
    title: 'Uang Tunai Real Saudi (SAR) Pecahan Kecil (SAR 5, 10, 50)',
    category: 'FINANCIAL_DIGITAL',
    description: 'Diperlukan untuk sedekah dhuafa, membeli air zamzam botolan di jalan, jasa kursi roda, atau dam.',
    isCompleted: false,
    isMandatory: false,
    tips: 'Siapkan sekitar SAR 500 - 1.000 tunai saat berangkat dari tanah air.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-fin-4',
    title: 'Paket Roaming Saudi / Kartu Perdana Lokal (STC / Mobily / Zain)',
    category: 'FINANCIAL_DIGITAL',
    description: 'Koneksi internet stabil untuk komunikasi rombongan keluarga dan navigasi GPS masjid.',
    isCompleted: false,
    isMandatory: true,
    tips: 'e-SIM roaming internasional bisa diaktifkan instan tanpa antre registrasi sidik jari di bandara Jeddah/Madinah.',
    targetTripType: 'ALL'
  },
  {
    id: 'chk-fin-5',
    title: 'Power Bank Kapasitas Maks. 20.000 mAh (Bawa di Kabin)',
    category: 'FINANCIAL_DIGITAL',
    description: 'Menjaga baterai smartphone tetap penuh seharian saat berada di Masjidil Haram, Arafah, dan Mina.',
    isCompleted: false,
    isMandatory: true,
    tips: 'PERINGATAN IATA: Power bank HANYA BOLEH dibawa ke tas kabin pesawat, DILARANG di koper bagasi.',
    targetTripType: 'ALL'
  }
];

export const PILGRIMAGE_PACKAGES = [
  {
    type: 'UMRAH_REGULER' as PilgrimageType,
    name: 'Umrah Reguler 9-12 Hari',
    subtitle: 'Hotel Bintang 3-4, Quad/Triple Room',
    estimatedCostIdr: 32000000,
    durationMonthsDefault: 12,
    badge: 'Paling Populer',
    features: [
      'Tiket Pesawat PP Direct/1 Transit',
      'Hotel Bintang 3/4 (300-500m dari Masjid)',
      'Makan Fullboard Menu Indonesia 3x/hari',
      'Visa Umrah + Asuransi Kesehatan Saudi',
      'Manasik, Muthawwif Berpengalaman & Air Zamzam 5L'
    ]
  },
  {
    type: 'UMRAH_VIP' as PilgrimageType,
    name: 'Umrah VIP / Executive',
    subtitle: 'Hotel Bintang 5 Depan Pelataran (Clock Tower)',
    estimatedCostIdr: 48000000,
    durationMonthsDefault: 18,
    badge: 'Kenyamanan Maksimal',
    features: [
      'Penerbangan Direct Garuda / Saudia Airlines',
      'Hotel Bintang 5 Menempel Pelataran Haram / Nabawi',
      'Kamar Double / Twin Suite Mewah',
      'Kereta Cepat Haramain High Speed Railway (HHR)',
      'Bimbingan Ibadah Eksklusif & Fast-track Handling'
    ]
  },
  {
    type: 'UMRAH_RAMADHAN' as PilgrimageType,
    name: 'Umrah Akhir Ramadhan & Lailatul Qadr',
    subtitle: '10 Hari Terakhir Ramadhan + Hari Raya Idul Fitri',
    estimatedCostIdr: 65000000,
    durationMonthsDefault: 24,
    badge: 'Pahala Berlipat',
    features: [
      'Pahala Setara Haji Bersama Rasulullah SAW',
      'I\'tikaf di Masjidil Haram 10 Malam Terakhir',
      'Sahur & Buka Puasa Prasmanan Hotel Pelataran',
      'Shalat Idul Fitri Akbar di Pelataran Ka\'bah',
      'Paket Ekstra Handling Musim Puncak'
    ]
  },
  {
    type: 'HAJJ_REGULER' as PilgrimageType,
    name: 'Haji Reguler Kemenag RI',
    subtitle: 'BPIH Resmi Pemerintah (Masa Tunggu Sesuai Kuota)',
    estimatedCostIdr: 56046172,
    durationMonthsDefault: 60,
    badge: 'Resmi Pemerintah',
    features: [
      'Setoran Awal Nomor Porsi Siskohat Rp 25.000.000',
      'Layanan 40-42 Hari di Tanah Suci',
      'Tenda Ber-AC Arafah & Mina Maktab Indonesia',
      'Subsidi Nilai Manfaat BPKH RI',
      'Pelunasan Bertahap Menjelang Tahun Keberangkatan'
    ]
  },
  {
    type: 'HAJJ_KHUSUS' as PilgrimageType,
    name: 'Haji Khusus / Plus (PIHK)',
    subtitle: 'Masa Tunggu 5-8 Tahun, Hotel Bintang 5',
    estimatedCostIdr: 195000000,
    durationMonthsDefault: 48,
    badge: 'Antrean Lebih Singkat',
    features: [
      'Setoran Awal USD 4.000 (Nomor Porsi Haji Khusus)',
      'Durasi 25-28 Hari Perjalanan',
      'Tenda Maktab VIP Ber-AC Dingin di Mina & Arafah',
      'Hotel Bintang 5 Depan Pelataran Masjid',
      'Kereta Cepat Haramain & Handling Prioritas'
    ]
  },
  {
    type: 'HAJJ_FURODA' as PilgrimageType,
    name: 'Haji Furoda / Mujamalah',
    subtitle: 'Tanpa Antri / Berangkat di Tahun Berjalan',
    estimatedCostIdr: 375000000,
    durationMonthsDefault: 36,
    badge: 'Langsung Berangkat',
    features: [
      'Visa Resmi Undangan Kerajaan (Visa Mujamalah)',
      'Langsung Terbang di Musim Haji Tahun Berjalan',
      'Akomodasi Maktab 111 / 112 Super VIP Mina',
      'Penerbangan Kelas Bisnis / Utama Tersedia',
      'Pendampingan Dokter Pribadi & Ustadz Pembimbing'
    ]
  }
];

export const PILGRIMAGE_GUIDE_STEPS: PilgrimageGuideStep[] = [
  // 1. IHRAM
  {
    id: 'guide-step-1',
    stepNumber: 1,
    title: '1. Bersuci & Berihram dari Miqat',
    titleArabic: 'الإِحْرَامُ مِنَ المِيقَاتِ',
    phase: 'IHRAM',
    tripType: 'BOTH',
    description: 'Ihram adalah niat memasuki ibadah haji atau umrah dengan mengenakan pakaian ihram dan menaati seluruh larangan ihram sejak melintasi titik Miqat (misal: Bir Ali/Dzulhulaifah, Bandara Yalamlam/King Abdulaziz).',
    rulings: [
      'Rukun Ihram: Berniat di dalam hati dan mengucapkan lafal niat ihram di batas Miqat.',
      'Sunnah sebelum Ihram: Mandi sunnah ihram, memotong kuku, mencukur bulu ketiak/kemaluan, menyisir jenggot, dan memakai wewangian HANYA di badan sebelum berniat (jangan di kain ihram).',
      'Pria: Memakai 2 lembar kain ihram putih tanpa jahitan (izar & rida), tidak boleh memakai celana dalam, topi, atau sepatu tertutup.',
      'Wanita: Pakaian muslimah syar\'i menutup seluruh tubuh kecuali wajah dan kedua telapak tangan.'
    ],
    commonMistakes: [
      'Melewati batas Miqat di pesawat tanpa berniat ihram (Wajib bayar Dam/fidyah menyembelih 1 kambing jika terlewat).',
      'Memakai wewangian atau minyak wangi setelah melafalkan niat ihram.',
      'Pria mengenakan celana dalam atau kaos oblong di dalam kain ihram.'
    ],
    sunnahPractices: [
      'Shalat sunnah Ihram 2 rakaat di masjid Miqat.',
      'Mengulang-ulang bacaan Talbiyah dengan suara lantang bagi pria dan lirih bagi wanita.'
    ],
    duaTextArabic: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً (أَوْ: لَبَّيْكَ اللَّهُمَّ حَجًّا)\n\nلَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
    duaTextLatin: 'Labbayk Allaahumma \'Umratan (atau: Labbayk Allaahumma Hajjan).\n\nLabbayk Allaahumma labbayk, labbayka laa syariika laka labbayk, innal hamda wan ni\'mata laka wal mulk, laa syariika lak.',
    duaTranslation: 'Aku penuhi panggilan-Mu ya Allah untuk berumrah (atau berhaji).\n\nAku penuhi panggilan-Mu ya Allah, aku penuhi panggilan-Mu. Tidak ada sekutu bagi-Mu, aku penuhi panggilan-Mu. Sesungguhnya segala puji, kenikmatan, dan kekuasaan adalah milik-Mu, tidak ada sekutu bagi-Mu.'
  },

  // 2. TAWAF
  {
    id: 'guide-step-2',
    stepNumber: 2,
    title: '2. Tawaf Mengelilingi Ka\'bah (7 Putaran)',
    titleArabic: 'طَوَافُ البَيْتِ سَبْعَةَ أَشْوَاطٍ',
    phase: 'TAWAF',
    tripType: 'BOTH',
    description: 'Mengelilingi Ka\'bah sebanyak 7 putaran penuh berlawanan arah jarum jam, dimulai dan diakhiri pada garis lurus sudut Hajar Aswad, dengan posisi Ka\'bah senantiasa di sebelah kiri tubuh.',
    rulings: [
      'Syarat Sah Tawaf: Suci dari hadas kecil dan besar (wajib berwudhu), menutup aurat sempurna, berada di dalam area Masjidil Haram di luar dinding Ka\'bah dan Hijr Ismail.',
      'Jumlah putaran: Tepat 7 putaran tanpa ragu.',
      'Idhtiba\' (khusus pria): Membuka pundak kanan dan meletakkan kedua ujung kain ihram di atas pundak kiri selama 7 putaran tawaf umrah / tawaf qudum.'
    ],
    commonMistakes: [
      'Menerobos masuk ke dalam Hijr Ismail saat tawaf (Tawaf menjadi tidak sah untuk putaran tersebut karena Hijr Ismail adalah bagian dari Ka\'bah).',
      'Menyentuh dinding Ka\'bah atau kiswah saat sedang melangkah putaran tawaf.',
      'Mendorong atau menyakiti jemaah lain demi memaksakan diri mencium Hajar Aswad (Mencium sunnah, menyakiti orang haram).'
    ],
    sunnahPractices: [
      'Ramal (lari-lari kecil) bagi pria pada 3 putaran pertama jika kondisi memungkinkan.',
      'Melambaikan tangan kanan ke arah Hajar Aswad sambil mengucap "Bismillahi Allahu Akbar" di awal setiap putaran (Istilam).',
      'Membaca doa sapu jagat antara Rukun Yamani dan Hajar Aswad.'
    ],
    duaTextArabic: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ\n\nرَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    duaTextLatin: 'Bismillaahi wallaahu Akbar.\n\nRabbanaa aatinaa fid-dunyaa hasanatan wa fil aakhirati hasanatan wa qinaa \'adzaaban-naar.',
    duaTranslation: 'Dengan nama Allah, dan Allah Maha Besar.\n\nWahai Tuhan kami, berikanlah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari siksa api neraka. (QS. Al-Baqarah: 201)'
  },

  // 3. MAQAM IBRAHIM & ZAMZAM
  {
    id: 'guide-step-3',
    stepNumber: 3,
    title: '3. Shalat di Belakang Maqam Ibrahim & Minum Zamzam',
    titleArabic: 'صَلَاةُ رَكْعَتَيِ الطَّوَافِ وَشُرْبُ زَمْزَمَ',
    phase: 'TAWAF',
    tripType: 'BOTH',
    description: 'Setelah selesai 7 putaran tawaf, disunnahkan shalat sunnah tawaf 2 rakaat di belakang Maqam Ibrahim (atau di mana saja di dalam masjid jika padat), lalu meminum air Zamzam hingga kenyang.',
    rulings: [
      'Hukum Shalat 2 Rakaat Tawaf adalah Sunnah Muakkadah.',
      'Rakaat pertama membaca Surat Al-Kafirun setelah Al-Fatihah, rakaat kedua membaca Surat Al-Ikhlas.'
    ],
    commonMistakes: [
      'Berhenti tepat di jalur tawaf yang padat untuk shalat sehingga membahayakan jemaah lain yang sedang berputar.',
      'Menyiramkan air zamzam ke lantai masjid hingga licin.'
    ],
    sunnahPractices: [
      'Berdoa di depan Maqam Ibrahim dengan membaca: "Wattakhidzuu min maqaami Ibraahiima mushallaa" (QS. Al-Baqarah: 125).',
      'Minum Zamzam dengan posisi berdiri menghadap kiblat dan berdoa memohon ilmu bermanfaat, rezeki luas, dan kesembuhan dari segala penyakit.',
      'Membasahi wajah dan kepala dengan air Zamzam.'
    ],
    duaTextArabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا وَاسِعًا، وَشِفَاءً مِنْ كُلِّ دَاءٍ وَسَقَمٍ',
    duaTextLatin: 'Allaahumma innii as-aluka \'ilman naafi\'an, wa rizqan waasi\'an, wa syifaa-an min kulli daa-in wa saqamin.',
    duaTranslation: 'Ya Allah, sungguh aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang lapang, dan kesembuhan dari segala macam penyakit dan derita.'
  },

  // 4. SA'I
  {
    id: 'guide-step-4',
    stepNumber: 4,
    title: '4. Sa\'i Antara Bukit Shafa dan Marwah (7 Putaran)',
    titleArabic: 'السَّعْيُ بَيْنَ الصَّفَا وَالمَرْوَةِ',
    phase: 'SAI',
    tripType: 'BOTH',
    description: 'Berjalan bolak-balik sebanyak 7 kali perjalanan antara bukit Shafa dan Marwah, dimulai dari Bukit Shafa dan berakhir di Bukit Marwah (Shafa ke Marwah dihitung 1, Marwah ke Shafa dihitung 2).',
    rulings: [
      'Syarat Sah Sa\'i: Dilakukan setelah tawaf yang sah, dimulai dari bukit Shafa dan berakhir di bukit Marwah, menempuh jalur mas\'a secara penuh sebanyak 7 kali.',
      'Suci dari hadas bukanlah syarat sah sa\'i (wanita haid yang sudah tawaf sebelum haid boleh melakukan sa\'i).'
    ],
    commonMistakes: [
      'Menghitung bolak-balik (Shafa-Marwah-Shafa) sebagai 1 putaran (seharusnya Shafa-Marwah sudah terhitung 1).',
      'Mengira Sa\'i harus berlari sepanjang lintasan (hanya pria yang disunnahkan berlari-lari kecil di antara dua lampu hijau).',
      'Terburu-buru tanpa berdoa di atas bukit Shafa dan Marwah saat menghadap Ka\'bah.'
    ],
    sunnahPractices: [
      'Menaiki bukit Shafa, menghadap kiblat ke arah Ka\'bah, bertakbir 3 kali dan membaca doa ma\'tsur.',
      'Pria disunnahkan lari-lari kecil (harwalah) di antara dua pilar lampu hijau.',
      'Memperbanyak zikir, doa permohonan ampunan, dan istighfar sepanjang perjalanan Sa\'i.'
    ],
    duaTextArabic: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ، أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ\n\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ',
    duaTextLatin: 'Innash-shafaa wal marwata min sya\'aa-irillaah, abda-u bimaa bada-allaahu bih.\n\nLaa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa \'alaa kulli syay-in qadiir. Laa ilaaha illallaahu wahdah, anjaza wa\'dah, wa nashara \'abdah, wa hazamal ahzaaba wahdah.',
    duaTranslation: 'Sesungguhnya Shafa dan Marwah adalah sebagian dari syiar-syiar Allah. Aku memulai dengan apa yang Allah mulai dengannya.\n\nTiada Tuhan selain Allah semata, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya segala pujian, dan Dia Maha Kuasa atas segala sesuatu. Tiada Tuhan selain Allah semata, Dia telah menepati janji-Nya, menolong hamba-Nya, dan mengalahkan bala tentara musuh sendirian.'
  },

  // 5. TAHALLUL
  {
    id: 'guide-step-5',
    stepNumber: 5,
    title: '5. Tahallul (Memotong / Mencukur Rambut)',
    titleArabic: 'التَّحَلُّلُ (الحَلْقُ أَوِ التَّقْصِيرُ)',
    phase: 'TAHALLUL',
    tripType: 'BOTH',
    description: 'Mengakhiri keadaan ihram dan membebaskan diri dari seluruh larangan ihram dengan mencukur gundul (halq) atau memendekkan rambut (taqshir).',
    rulings: [
      'Pria: Boleh memotong pendek merata (taqshir) atau mencukur botak plontos (halq). Mencukur botak plontos lebih utama dan didoakan ampunan oleh Rasulullah SAW sebanyak 3 kali.',
      'Wanita: HANYA memotong ujung rambut sepanjang satu ruas jari (sekitar 2-3 cm) secara merata, DILARANG menggundul rambut.',
      'Dengan selesainya tahallul, rangkaian Umrah selesai 100% dan jemaah boleh kembali memakai pakaian biasa serta wewangian.'
    ],
    commonMistakes: [
      'Pria hanya memotong satu atau dua helai rambut di depan (seharusnya memotong rata dari seluruh bagian kepala).',
      'Membuka aurat rambut di tempat terbuka bagi jemaah wanita saat memotong rambut.',
      'Memotong rambut jemaah lain sebelum dirinya sendiri bertahallul.'
    ],
    sunnahPractices: [
      'Bagi pria, mencukur gundul plontos dengan pisau cukur steril sekali pakai di barbershop resmi sekitar Masjidil Haram.',
      'Membaca hamdalah dan bersyukur atas nikmat kelancaran ibadah umrah.'
    ],
    duaTextArabic: 'الْحَمْدُ لِلَّهِ الَّذِي قَضَى عَنَّا نُسُكَنَا، اللَّهُمَّ زِدْنَا إِيمَانًا وَيَقِينًا وَتَوْفِيقًا وَعَوْنًا',
    duaTextLatin: 'Alhamdulillaahilladzii qadhaa \'annaa nusukanaa, Allaahumma zidnaa iimaanan wa yaqiinan wa tawfiiqan wa \'awnaa.',
    duaTranslation: 'Segala puji bagi Allah yang telah menyempurnakan ibadah manasik kami. Ya Allah, tambahkanlah bagi kami keimanan, keyakinan, petunjuk taufik, dan pertolongan-Mu.'
  },

  // 6. WUKUF DI ARAFAH (Puncak Haji)
  {
    id: 'guide-step-6',
    stepNumber: 6,
    title: '6. Puncak Haji: Wukuf di Padang Arafah (9 Dzulhijjah)',
    titleArabic: 'الوُقُوفُ بِعَرَفَةَ (أَعْظَمُ أَرْكَانِ الحَجِّ)',
    phase: 'ARAFAT_MINA',
    tripType: 'HAJJ',
    description: 'Wukuf di Arafah adalah rukun terpenting haji ("Al-Hajju \'Arafah"). Dilaksanakan mulai tergelincirnya matahari (waktu Dzuhur) pada 9 Dzulhijjah hingga terbit fajar 10 Dzulhijjah.',
    rulings: [
      'Hukum Wukuf adalah Rukun Haji mutlak yang tidak bisa diganti dengan Dam apapun.',
      'Wajib berada di dalam batas resmi Arafah (di luar lembah Wadi \'Uranah).',
      'Mendengarkan Khutbah Wukuf, lalu shalat Dzuhur dan Ashar secara jamak qashar taqdim di waktu Dzuhur dengan satu azan dan dua iqamah.'
    ],
    commonMistakes: [
      'Keluar dari tenda Arafah sebelum waktu Maghrib tiba (wajib wukuf hingga terbenam matahari).',
      'Menghabiskan waktu wukuf yang sangat sakral untuk mengobrol santai, bermain gadget, atau tidur.',
      'Mengira harus mendaki ke puncak Jabal Rahmah (seluruh hamparan padang Arafah adalah tempat wukuf yang sah).'
    ],
    sunnahPractices: [
      'Memperbanyak doa, zikir, istighfar, membaca Al-Qur\'an, dan merendahkan diri menghadap kiblat dengan kedua tangan terangkat.',
      'Membaca sebaik-baik doa di hari Arafah: "Laa ilaaha illallaahu wahdahu laa syariika lah..."',
      'Menangis memohon ampunan dosa dan keselamatan untuk kedua orang tua, keluarga, dan seluruh umat Islam.'
    ],
    duaTextArabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ\n\nاللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا وَفِي سَمْعِي نُورًا وَفِي بَصَرِي نُورًا، اللَّهُمَّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    duaTextLatin: 'Laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa \'alaa kulli syay-in qadiir.\n\nAllaahummaj\'al fii qalbii nuuraa, wa fii sam\'ii nuuraa, wa fii basharii nuuraa. Allaahummasyrah lii shadrii wa yassir lii amrii.',
    duaTranslation: 'Tiada Tuhan selain Allah semata, tidak ada sekutu bagi-Nya. Milik-Nya segenap kerajaan dan pujian, dan Dia Maha Kuasa atas segala sesuatu.\n\nYa Allah, jadikanlah di dalam hatiku cahaya, pada pendengaranku cahaya, dan pada penglihatanku cahaya. Ya Allah, lapangkanlah dadaku dan mudahkanlah urusanku.'
  },

  // 7. MABIT MUZDALIFAH & MINA
  {
    id: 'guide-step-7',
    stepNumber: 7,
    title: '7. Mabit di Muzdalifah & Mengambil Kerikil (Malam 10 Dzulhijjah)',
    titleArabic: 'المَبِيتُ بِمُزْدَلِفَةَ وَجَمْعُ الحَصَى',
    phase: 'ARAFAT_MINA',
    tripType: 'HAJJ',
    description: 'Setelah matahari terbenam di Arafah, jemaah bergerak tenang menuju Muzdalifah. Shalat Maghrib dan Isya dijamak qashar ta\'khir di Muzdalifah, bermalam (mabit) minimal hingga lewat tengah malam, serta mengumpulkan kerikil untuk melempar Jumrah.',
    rulings: [
      'Hukum Mabit di Muzdalifah adalah Wajib Haji menurut mayoritas ulama (kecuali bagi yang memiliki uzur sakit/lansia diperbolehkan murur).',
      'Mengumpulkan 7 butir kerikil untuk Jumrah Aqabah 10 Dzulhijjah (atau 49/70 butir untuk seluruh hari Tasyrik).'
    ],
    commonMistakes: [
      'Mengambil batu besar untuk jumrah (ukuran kerikil yang disunnahkan adalah sebesar biji kacang/fistil).',
      'Mencuci kerikil secara berlebihan dengan anggapan harus suci steril (tidak disyaratkan).'
    ],
    sunnahPractices: [
      'Beristirahat dan tidur setelah shalat Isya agar memiliki stamina prima saat melontar Jumrah keesokan paginya di Mina.',
      'Berdzikir di Masy\'aril Haram setelah shalat Subuh hingga menjelang matahari terbit sebelum berangkat ke Mina.'
    ],
    duaTextArabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ أَنْ تَرْزُقَنِي فِي هَذَا الْمَكَانِ جَوَامِعَ الْخَيْرِ كُلِّهِ، وَأَنْ تُصْلِحَ لِي شَأْنِي كُلَّهُ',
    duaTextLatin: 'Allaahumma innii as-aluka an tarzuqanii fii haadzal makaan jawaami\'al khayri kullih, wa an tushliha lii sya\'nii kullah.',
    duaTranslation: 'Ya Allah, sesungguhnya aku memohon kepada-Mu agar Engkau menganugerahkan kepadaku di tempat ini segala pokok-pokok kebaikan, dan memperbaiki seluruh urusan kehidupanku.'
  },

  // 8. HARI NAHAR & TASYRIK
  {
    id: 'guide-step-8',
    stepNumber: 8,
    title: '8. Melontar Jumrah, Dam & Mabit di Mina (10-13 Dzulhijjah)',
    titleArabic: 'رَمْيُ الجَمَرَاتِ وَالمَبِيتُ بِمِنَى أَيَّامَ التَّشْرِيقِ',
    phase: 'TASYRIK',
    tripType: 'HAJJ',
    description: 'Pada 10 Dzulhijjah (Hari Idul Adha), melontar Jumrah Aqabah dengan 7 kerikil, menyembelih Dam/Hadyu, dan Tahallul Awwal. Dilanjutkan mabit di Mina dan melontar 3 Jumrah (Ula, Wustha, Aqabah) pada hari-hari Tasyrik (11, 12, dan 13 Dzulhijjah bagi Nafar Tsani).',
    rulings: [
      'Wajib melontar dengan 7 kerikil secara satu per satu sambil bertakbir di setiap lontaran.',
      'Kerikil harus masuk ke dalam lubang marma (sumur jumrah).',
      'Tahallul Awwal: Diperbolehkan setelah menyelesaikan 2 dari 3 amalan (Lempar Aqabah, Cukur/Tahallul, atau Tawaf Ifadhah).'
    ],
    commonMistakes: [
      'Melempar 7 kerikil sekaligus dalam satu lemparan (hanya terhitung 1 lemparan).',
      'Melempar sandal, botol, atau payung ke pilar jumrah karena emosi.',
      'Melontar Jumrah di luar jadwal waktu yang telah ditentukan oleh Maktab demi keselamatan dari kerumunan.'
    ],
    sunnahPractices: [
      'Menghadap kiblat dan berdoa panjang setelah melempar Jumrah Ula dan Jumrah Wustha.',
      'Tidak perlu berhenti berdoa setelah melempar Jumrah Aqabah.',
      'Memilih Nafar Awwal (keluar Mina 12 Dzulhijjah) atau Nafar Tsani (13 Dzulhijjah).'
    ],
    duaTextArabic: 'بِسْمِ اللَّهِ، اللَّهُ أَكْبَرُ، رَغْمًا لِلشَّيْطَانِ وَرِضًا لِلرَّحْمَنِ، اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا وَذَنْبًا مَغْفُورًا وَسَعْيًا مَشْكُورًا',
    duaTextLatin: 'Bismillaahi, Allaahu Akbar, raghman lisysyaythaani wa ridhan lir-Rahmaan, Allaahummaj\'alhu hajjan mabruuran wa dzanban maghfuuran wa sa\'yan masjkuuraa.',
    duaTranslation: 'Dengan nama Allah, Allah Maha Besar. Sebagai penghinaan bagi setan dan keridhaan bagi Tuhan Yang Maha Pengasih. Ya Allah, jadikanlah ini haji yang mabrur, dosa yang diampuni, dan ikhtiar amal yang diterima.'
  }
];

export const IHRAM_PROHIBITIONS = [
  {
    category: 'Pakaian & Penutup Tubuh',
    pria: 'Dilarang mengenakan pakaian berjahit melingkar (baju, celana dalam, kaos) dan menutup kepala dengan peci/topi.',
    wanita: 'Dilarang menutup wajah dengan cadar/niqab dan dilarang mengenakan sarung tangan yang menutupi jemari.',
    fidyah: 'Fidyah takhyir: Memilih antara puasa 3 hari, memberi makan 6 orang miskin (masing-masing 1/2 gantang), atau menyembelih 1 ekor kambing.'
  },
  {
    category: 'Wewangian & Perawatan Tubuh',
    pria: 'Dilarang memakai minyak wangi pada badan atau kain ihram setelah berniat, serta meminyaki rambut jenggot.',
    wanita: 'Dilarang memakai parfum beraroma menyengat, sabun mandi wangi, atau kosmetik berparfum.',
    fidyah: 'Fidyah takhyir (Puasa 3 hari / sedekah makanan 6 miskin / 1 kambing).'
  },
  {
    category: 'Rambut & Kuku',
    pria: 'Dilarang memotong, mencabut, atau mencukur rambut kepala, bulu badan, dan kuku tangan/kaki.',
    wanita: 'Dilarang memotong rambut dan kuku sebelum waktu Tahallul tiba.',
    fidyah: 'Jika memotong 3 helai rambut / kuku atau lebih: Fidyah takhyir lengkap. Kurang dari 3: Sedekah kurma/makanan.'
  },
  {
    category: 'Akad Nikah & Hubungan Suami Istri',
    pria: 'Dilarang melakukan akad nikah (menikahkan / menikah), bercumbu, dan bersetubuh (jima\').',
    wanita: 'Dilarang dinikahkan saat dalam status ihram aktif.',
    fidyah: 'Jika bersetubuh sebelum Tahallul Awwal: Haji BATAL, wajib menyembelih seekor Unta (Badanah), dan wajib mengqadha haji tahun berikutnya.'
  },
  {
    category: 'Berburu & Merusak Lingkungan Tanah Haram',
    pria: 'Dilarang berburu hewan darat liar yang halal dimakan atau membantu pemburu.',
    wanita: 'Dilarang menebang, mencabut pohon atau tumbuhan liar di kawasan Tanah Haram Makkah dan Madinah.',
    fidyah: 'Dam seharga/senilai hewan yang diburu untuk dibagikan kepada fakir miskin Tanah Haram.'
  }
];

export const NUSUK_RAWDAH_GUIDE = [
  {
    step: 1,
    title: 'Download & Registrasi Akun Nusuk',
    desc: 'Unduh aplikasi "Nusuk" resmi dari App Store atau Google Play Store. Pilih registrasi akun "International Visitor" menggunakan nomor paspor dan nomor visa resmi Anda.'
  },
  {
    step: 2,
    title: 'Pilih Layanan "Pray in the Noble Rawdah"',
    desc: 'Buka menu utama -> Pilih "Holy Mosque Services" -> Pilih "Pray in the Noble Rawdah (Men)" untuk pria atau "Pray in the Noble Rawdah (Women)" untuk wanita.'
  },
  {
    step: 3,
    title: 'Pilih Tanggal & Jam Masuk (Slot Tasrih)',
    desc: 'Pilih slot tanggal dan warna indikator kuota (Hijau = Tersedia, Kuning = Sedikit, Abu-abu = Penuh). Slot waktu wanita umumnya dibuka pagi (ba\'da Dhuha) dan malam (ba\'da Isya).'
  },
  {
    step: 4,
    title: 'Dapatkan Barcode Izin Resmi (Permit)',
    desc: 'Setelah konfirmasi berhasil, simpan screenshot QR Code tasrih Nusuk. Tunjukkan QR code tersebut kepada asykar penjaga di Pintu Masuk Rawdah (Gate 37 untuk wanita / Bab as-Salam untuk pria) 30 menit sebelum jadwal.'
  }
];
