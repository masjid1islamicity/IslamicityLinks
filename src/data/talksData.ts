import { 
  TalkSession, 
  DakwahArticle, 
  TanyaJawabItem, 
  LuckyWheelVoucher,
  CuratedPlaylist 
} from '../types';

export const INITIAL_TALK_SESSIONS: TalkSession[] = [
  {
    id: 'talk-session-live-1',
    title: 'Bedah Fiqih Muamalah Digital: Etika Fintech, Kripto, & Zakat Blockchain L2',
    category: 'FIQIH_MUAMALAH',
    categoryLabel: 'Fiqih Muamalah & Fintech',
    tagline: 'Memahami batasan halal-haram investasi digital dan tata cara audit zakat terbuka on-chain.',
    speaker: {
      name: 'Benn Al Islamicity',
      role: 'Founder & Pembina Pusat Dakwah Islamicity',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      organization: 'Pusat Dakwah Islamicity & Lynk.id',
      isVerified: true,
      specialization: 'Fikih Muamalah & Transformasi Dakwah Digital'
    },
    coSpeakers: [
      {
        name: 'Dr. KH. M. Cholil Nafis, Lc., MA',
        role: 'Ketua MUI Bidang Dakwah & Ukhuwah',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        organization: 'Majelis Ulama Indonesia (MUI)',
        isVerified: true,
        specialization: 'Fatwa Muamalah Kontemporer'
      }
    ],
    date: 'Hari Ini (Sedang Berlangsung)',
    time: '09.30 - 11.45 WIB',
    status: 'LIVE',
    liveViewerCount: 1842,
    streamUrl: 'https://www.youtube.com/embed/live_stream_placeholder',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    registeredCount: 3420,
    maxCapacity: 5000,
    isUserRegistered: true,
    description: 'Kajian interaktif mendalam mengupas hukum kepemilikan aset kripto, kontrak pintar syariah, verifikasi mustahik berbasis blockchain, dan fatwa mutakhir DSN-MUI tentang instrumen keuangan terdesentralisasi.',
    keyTakeaways: [
      'Kaidah asal muamalah adalah mubah (boleh) kecuali ada dalil yang melarang (riba, gharar, maysir).',
      'Pemanfaatan blockchain L2 untuk transparansi zakat 100% selaras dengan prinsip Amanah & Tabligh.',
      'Ketentuan haul dan nisab 85 gram emas tetap berlaku pada portofolio aset kripto dan saham syariah.',
      'Cara memvalidasi smart contract donasi agar tidak melanggar syarat tamlik (kepemilikan asnaf).'
    ],
    agenda: [
      { time: '09.30 - 09.45 WIB', topic: 'Pembukaan & Tilawah Al-Qur\'an', presenter: 'MC Tim Dakwah Islamicity' },
      { time: '09.45 - 10.30 WIB', topic: 'Prinsip Syariah dalam Transaksi Digital & Blockchain', presenter: 'Benn Al Islamicity' },
      { time: '10.30 - 11.15 WIB', topic: 'Pandangan Fatwa DSN-MUI tentang Keuangan Terdesentralisasi', presenter: 'Dr. KH. M. Cholil Nafis' },
      { time: '11.15 - 11.45 WIB', topic: 'Live Q&A Tanya Jawab Jamaah & Doa Penutup', presenter: 'Benn Al Islamicity & Asatidz' }
    ],
    downloadables: [
      { title: 'Slide Materi Presentasi (PDF)', type: 'SLIDE', size: '4.8 MB', downloadsCount: 1420 },
      { title: 'E-Book Panduan Zakat Digital & Kripto', type: 'EBOOK', size: '2.3 MB', downloadsCount: 980 },
      { title: 'Transkrip & Ringkasan Khutbah (PDF)', type: 'PDF', size: '1.1 MB', downloadsCount: 650 }
    ],
    questions: [
      {
        id: 'q-1',
        userName: 'Ahmad Fauzi',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        isAnonymous: false,
        question: 'Ustadz Benn, bagaimana hukum staking kripto syariah dan kapan kewajiban zakatnya dikeluarkan bila nilainya berfluktuasi tajam?',
        upvotes: 48,
        hasUpvoted: true,
        timestamp: '10:04 WIB',
        answered: true,
        answerText: 'Staking syariah dibolehkan jika underlying project-nya halal (bukan riba/lending konvensional). Zakatnya dihitung pada saat haul tahunan dengan mengalikan 2.5% dari nilai pasar likuid jika telah melebihi nisab 85g emas.',
        answeredBy: 'Benn Al Islamicity'
      },
      {
        id: 'q-2',
        userName: 'Siti Rahmawati',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        isAnonymous: false,
        question: 'Apakah zakat yang disalurkan melalui smart contract on-chain sah akad tamlik-nya bila mustahik menerima dalam bentuk saldo dompet digital?',
        upvotes: 35,
        hasUpvoted: false,
        timestamp: '10:18 WIB',
        answered: true,
        answerText: 'Sah secara syar\'i karena qabdh (serah terima) kontemporer diakui secara digital saat saldo masuk ke penguasaan penuh (milkut taam) mustahik tanpa potongan perantara.',
        answeredBy: 'Dr. KH. M. Cholil Nafis'
      },
      {
        id: 'q-3',
        userName: 'Hamba Allah (Jakarta)',
        isAnonymous: true,
        question: 'Bagaimana cara membedakan platform infaq digital yang benar-benar teraudit dengan yang tidak transparan?',
        upvotes: 21,
        hasUpvoted: false,
        timestamp: '10:25 WIB',
        answered: false
      }
    ],
    polls: [
      {
        id: 'poll-1',
        question: 'Apakah Anda sudah pernah menunaikan Zakat atau Infaq melalui platform digital berbasis Blockchain?',
        options: [
          { id: 'opt-1', text: 'Sudah, sangat transparan dan cepat', votes: 842 },
          { id: 'opt-2', text: 'Baru pertama kali mencoba di IslamicityLink', votes: 614 },
          { id: 'opt-3', text: 'Masih ragu dan ingin mempelajari fikihnya', votes: 198 }
        ],
        totalVotes: 1654,
        userVotedOptionId: 'opt-1'
      }
    ],
    certificatesIssuedCount: 1250,
    infaqRaisedAmount: 18450000
  },
  {
    id: 'talk-session-upcoming-2',
    title: 'Webinar Eksklusif: Rahasia Sukses Haji & Umrah Mabrur di Era Smart Haramain',
    category: 'HAJJ_PREP',
    categoryLabel: 'Manasik & Haji Mabrur',
    tagline: 'Panduan lengkap rukun, sunnah, kesehatan lansia, dan tips aplikasi Nusuk Arab Saudi.',
    speaker: {
      name: 'Benn Al Islamicity',
      role: 'Pembina Pusat Dakwah Islamicity',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      organization: 'Pusat Dakwah Islamicity',
      isVerified: true,
      specialization: 'Bimbingan Ibadah Haramain'
    },
    coSpeakers: [
      {
        name: 'Ustadz Dr. H. Das\'ad Latif, Ph.D',
        role: 'Da\'i Nasional & Pembimbing Ibadah Haji',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        organization: 'Kemenag RI & Asosiasi PPIU',
        isVerified: true,
        specialization: 'Retorika Dakwah & Manasik Kalbu'
      }
    ],
    date: 'Ahad, 6 September 2026',
    time: '08.30 - 11.30 WIB',
    status: 'UPCOMING',
    coverImage: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800&auto=format&fit=crop&q=80',
    registeredCount: 2890,
    maxCapacity: 4000,
    isUserRegistered: false,
    description: 'Pelatihan komprehensif bagi calon jamaah haji dan umrah. Dapatkan bimbingan manasik praktis, doa-doa maqbul di Raudhah dan Multazam, serta kesempatan mendapatkan Voucher Umrah Berkah senilai Rp 5.000.000.',
    keyTakeaways: [
      'Kunci meraih kemabruran: Menjaga niat ikhlas, menjauhi rafats, fusuq, dan jidal.',
      'Tata cara manasik praktis sesuai As-Sunnah saat thawaf, sa\'i, wukuf di Arafah, dan mabit di Mina.',
      'Tips navigasi aplikasi Nusuk untuk izin Raudhah dan umrah mandiri.',
      'Manajemen stamina dan kesehatan di tengah cuaca ekstrem Makkah & Madinah.'
    ],
    agenda: [
      { time: '08.30 - 09.00 WIB', topic: 'Pembersihan Niat & Hakikat Panggilan Baitullah', presenter: 'Benn Al Islamicity' },
      { time: '09.00 - 10.15 WIB', topic: 'Fiqih Manasik Umrah & Haji Langkah demi Langkah', presenter: 'Ustadz Dr. H. Das\'ad Latif' },
      { time: '10.15 - 11.00 WIB', topic: 'Praktik Doa Mustajab & Tempat Bersejarah Haramain', presenter: 'Benn Al Islamicity' },
      { time: '11.00 - 11.30 WIB', topic: 'Undian Voucher Umrah Berkah & Penutup', presenter: 'Tim Dakwah Islamicity' }
    ],
    downloadables: [
      { title: 'Buku Saku Doa Manasik Haji & Umrah (PDF)', type: 'PDF', size: '3.2 MB', downloadsCount: 2100 },
      { title: 'Checklist Perlengkapan Koper Jamaah', type: 'SLIDE', size: '1.4 MB', downloadsCount: 1800 }
    ],
    questions: [],
    polls: [],
    certificatesIssuedCount: 0,
    infaqRaisedAmount: 0
  },
  {
    id: 'talk-session-upcoming-3',
    title: 'Parenting Islami: Membangun Generasi Qur\'ani & Menjaga Mental Anak di Era Gadget',
    category: 'FAMILY',
    categoryLabel: 'Keluarga Sakinah & Parenting',
    tagline: 'Metode Luqman Al-Hakim mendidik ketakwaan, adab, dan batasan digital.',
    speaker: {
      name: 'dr. Aisah Dahlan, CM.NLP',
      role: 'Praktisi Neuroparenting & Konsultan Keluarga Islam',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      organization: 'Asosiasi Konselor Muslim Indonesia',
      isVerified: true,
      specialization: 'Neuroparenting & Komunikasi Kasih Sayang'
    },
    coSpeakers: [
      {
        name: 'Benn Al Islamicity',
        role: 'Moderator & Pembina Dakwah',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        organization: 'Pusat Dakwah Islamicity',
        isVerified: true,
        specialization: 'Ketahanan Keluarga Muslim'
      }
    ],
    date: 'Sabtu, 12 September 2026',
    time: '19.30 - 21.30 WIB',
    status: 'UPCOMING',
    coverImage: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&auto=format&fit=crop&q=80',
    registeredCount: 1950,
    maxCapacity: 3000,
    isUserRegistered: true,
    description: 'Menyelami cara kerja otak anak, pendekatan komunikasi asertif tanpa bentakan, serta menanamkan kecintaan pada salat dan Al-Qur\'an di tengah gempuran media sosial.',
    keyTakeaways: [
      'Formula 7 tahun pertama (raja), 7 tahun kedua (tawanan berdisiplin), 7 tahun ketiga (sahabat karib).',
      'Mengatasi kecanduan layar (screen time) dengan habit replacement bernilai ibadah.',
      'Membangun bonding spiritual antara ayah, ibu, dan anak lewat salat berjamaah di rumah.'
    ],
    agenda: [
      { time: '19.30 - 20.30 WIB', topic: 'Neurosains Otak Anak & Pendekatan Surah Luqman', presenter: 'dr. Aisah Dahlan' },
      { time: '20.30 - 21.15 WIB', topic: 'Studi Kasus & Tanya Jawab Ayah Bunda', presenter: 'Benn Al Islamicity & dr. Aisah Dahlan' },
      { time: '21.15 - 21.30 WIB', topic: 'Doa Bersama untuk Keturunan yang Shalih', presenter: 'Tim Dakwah' }
    ],
    downloadables: [
      { title: 'Tabel Habit Tracker Ibadah Harian Anak (PDF)', type: 'PDF', size: '1.8 MB', downloadsCount: 1540 }
    ],
    questions: [],
    polls: [],
    certificatesIssuedCount: 0
  },
  {
    id: 'talk-session-recorded-4',
    title: 'Kupas Tuntas 8 Asnaf Zakat: Transformasi Mustahik Menjadi Muzakki Berdaya',
    category: 'ZAKAT_EKONOMI',
    categoryLabel: 'Zakat & Ekonomi Syariah',
    tagline: 'Rekaman seminar nasional pemberdayaan ekonomi umat berbasis dana zakat produktif.',
    speaker: {
      name: 'Benn Al Islamicity',
      role: 'Founder Pusat Dakwah Islamicity',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      organization: 'Pusat Dakwah Islamicity',
      isVerified: true,
      specialization: 'Ekosistem Zakat & Filantropi Islam'
    },
    coSpeakers: [
      {
        name: 'Prof. Dr. KH. Noor Achmad, MA',
        role: 'Ketua BAZNAS Republik Indonesia',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        organization: 'BAZNAS RI',
        isVerified: true,
        specialization: 'Regulasi Zakat Nasional'
      }
    ],
    date: '20 Agustus 2026',
    time: '2 Jam 15 Menit',
    status: 'RECORDED',
    streamUrl: 'https://www.youtube.com/embed/sample_recorded_talk',
    coverImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80',
    registeredCount: 4520,
    isUserRegistered: true,
    description: 'Seminar kolaboratif membahas bagaimana zakat produktif disalurkan kepada fakir, miskin, dan gharimin untuk modal wirausaha mikro, sehingga memutus rantai kemiskinan dan mencetak muzakki baru.',
    keyTakeaways: [
      'Pembedaan distribusi konsumtif (darurat pangan) vs produktif (modal usaha & pelatihan).',
      'Pengawasan dana zakat melalui sistem Ledger L2 yang transparan mencegah kebocoran dana.',
      'Sinergi BAZNAS, LAZ, dan kreator digital memperluas jangkauan dakwah zakat.'
    ],
    agenda: [
      { time: 'Sesi 1', topic: 'Urgensi 8 Asnaf dalam QS At-Taubah 60', presenter: 'Benn Al Islamicity' },
      { time: 'Sesi 2', topic: 'Roadmap Pengentasan Kemiskinan Nasional', presenter: 'Prof. Dr. Noor Achmad' }
    ],
    downloadables: [
      { title: 'Laporan Dampak Zakat Produktif 2026 (PDF)', type: 'PDF', size: '5.6 MB', downloadsCount: 3120 },
      { title: 'Audio Podcast Ceramah (MP3)', type: 'AUDIO_MP3', size: '42 MB', downloadsCount: 2450 }
    ],
    questions: [],
    polls: [],
    certificatesIssuedCount: 3890,
    infaqRaisedAmount: 32500000
  },
  {
    id: 'talk-session-5',
    title: 'Akad Halal E-Commerce, Dropship, & COD dalam Tinjauan Fiqih Muamalah',
    category: 'FIQIH_MUAMALAH',
    categoryLabel: 'Fiqih Muamalah & Fintech',
    tagline: 'Solusi berdagang online tanpa melanggar larangan jual-beli barang yang belum dimiliki (ba\'i ma la yamlik).',
    speaker: {
      name: 'Benn Al Islamicity',
      role: 'Pakar Fikih Muamalah & Founder Islamicity',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      organization: 'Pusat Dakwah Islamicity',
      isVerified: true,
      specialization: 'Fikih Bisnis & E-Commerce Syariah'
    },
    coSpeakers: [
      {
        name: 'Dr. KH. M. Cholil Nafis, Lc., MA',
        role: 'Ketua MUI Bidang Dakwah & Ukhuwah',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        organization: 'Majelis Ulama Indonesia (MUI)',
        isVerified: true,
        specialization: 'Fatwa Muamalah'
      }
    ],
    date: '14 Agustus 2026',
    time: '1 Jam 40 Menit',
    status: 'RECORDED',
    streamUrl: 'https://www.youtube.com/embed/sample_ecommerce_talk',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    registeredCount: 3780,
    isUserRegistered: false,
    description: 'Membahas skema wakalah bil ujrah, salam, dan istishna dalam perniagaan e-commerce marketplace modern agar bebas dari riba dan penipuan tersembunyi.',
    keyTakeaways: [
      'Dropshipping sah bila menggunakan akad wakalah (keagenan resmi) atau salam.',
      'Sistem COD dibolehkan bila akad jual beli selesai saat barang tiba dan dicek.',
      'Pentingnya transparansi deskripsi barang agar tidak terjadi gharar.'
    ],
    agenda: [
      { time: 'Bagian 1', topic: 'Kaidah Ba\'i As-Salam & Wakalah', presenter: 'Benn Al Islamicity' },
      { time: 'Bagian 2', topic: 'Fatwa DSN-MUI tentang Jual Beli Online', presenter: 'Dr. KH. M. Cholil Nafis' }
    ],
    downloadables: [
      { title: 'Draf Template Akad Wakalah Dropship Halal (PDF)', type: 'PDF', size: '1.5 MB', downloadsCount: 2210 }
    ],
    questions: [],
    polls: [],
    certificatesIssuedCount: 2900
  },
  {
    id: 'talk-session-6',
    title: 'Fiqih Faraidh & Waris Digital: Mencegah Sengketa Harta Keluarga Muslim',
    category: 'FIQIH_MUAMALAH',
    categoryLabel: 'Fiqih Muamalah & Fintech',
    tagline: 'Panduan membagi warisan sesuai Al-Qur\'an dan pencatatan wasiat terenkripsi.',
    speaker: {
      name: 'Dr. KH. M. Cholil Nafis, Lc., MA',
      role: 'Ketua MUI Bidang Fatwa',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      organization: 'MUI Pusat',
      isVerified: true,
      specialization: 'Faraidh & Hukum Keluarga Islam'
    },
    date: '8 Agustus 2026',
    time: '1 Jam 55 Menit',
    status: 'RECORDED',
    streamUrl: 'https://www.youtube.com/embed/sample_waris_talk',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    registeredCount: 2950,
    isUserRegistered: false,
    description: 'Penjelasan tuntas hukum faraidh dalam Surah An-Nisa, hak anak yatim, pembagian 2:1 antara laki-laki dan perempuan, serta pemanfaatan wasiat 1/3 harta.',
    keyTakeaways: [
      'Ilmu waris adalah separuh ilmu agama yang pertama kali dicabut bila ditinggalkan.',
      'Kewajiban melunasi hutang dan wasiat sebelum harta dibagikan kepada ahli waris.',
      'Musyawarah takharuj yang sah setelah masing-masing mengetahui bagian hak syar\'inya.'
    ],
    agenda: [
      { time: 'Sesi 1', topic: 'Rukun & Syarat Pembagian Waris Islami', presenter: 'Dr. KH. M. Cholil Nafis' }
    ],
    downloadables: [
      { title: 'Tabel Kalkulator Faraidh Lengkap (PDF)', type: 'PDF', size: '2.1 MB', downloadsCount: 1890 }
    ],
    questions: [],
    polls: [],
    certificatesIssuedCount: 2400
  },
  {
    id: 'talk-session-7',
    title: 'Manajemen Emosi & Burnout Muslimah: Terapi Tadabbur Al-Qur\'an',
    category: 'FAMILY',
    categoryLabel: 'Keluarga Sakinah & Parenting',
    tagline: 'Menemukan kedamaian batin di tengah padatnya peran ibu, istri, dan profesional.',
    speaker: {
      name: 'dr. Aisah Dahlan, CM.NLP',
      role: 'Konsultan Parenting & Psikologi Islam',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      organization: 'Asosiasi Konselor Muslim Indonesia',
      isVerified: true,
      specialization: 'Neuroparenting & Terapi Qalbu'
    },
    date: '2 Agustus 2026',
    time: '1 Jam 30 Menit',
    status: 'RECORDED',
    streamUrl: 'https://www.youtube.com/embed/sample_mental_talk',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    registeredCount: 4200,
    isUserRegistered: true,
    description: 'Terapi psikologis berbasis sains otak dan dzikrullah untuk meredakan kecemasan, overthinking, serta merekatkan kembali kehangatan rumah tangga.',
    keyTakeaways: [
      'Hormon endorfin dan serotonin meningkat drastis saat sujud panjang dan membaca Al-Qur\'an.',
      'Seni memaafkan pasangan untuk menjaga resonansi gelombang alfa di otak.',
      'Jadwal self-care spiritual harian bagi muslimah berdaya.'
    ],
    agenda: [
      { time: 'Materi Inti', topic: 'Neurosains Relaksasi dan Dzikir Pagi-Petang', presenter: 'dr. Aisah Dahlan' }
    ],
    downloadables: [
      { title: 'Audio Relaksasi Dzikir Ketenangan Jiwa (MP3)', type: 'AUDIO_MP3', size: '38 MB', downloadsCount: 3200 }
    ],
    questions: [],
    polls: [],
    certificatesIssuedCount: 3950
  },
  {
    id: 'talk-session-8',
    title: 'Manasik Qalbu: Menangis di Multazam & Raudhah Madinah',
    category: 'HAJJ_PREP',
    categoryLabel: 'Manasik & Haji Mabrur',
    tagline: 'Menghadirkan getaran jiwa dan kekhusyukan saat bersimpuh di depan Ka\'bah dan makam Rasulullah ﷺ.',
    speaker: {
      name: 'Ustadz Dr. H. Das\'ad Latif, Ph.D',
      role: 'Da\'i Nasional',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      organization: 'Pusat Dakwah Nusantara',
      isVerified: true,
      specialization: 'Muhasabah & Manasik Kalbu'
    },
    coSpeakers: [
      {
        name: 'Benn Al Islamicity',
        role: 'Pembina Pusat Dakwah',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        organization: 'Pusat Dakwah Islamicity',
        isVerified: true,
        specialization: 'Panduan Haramain'
      }
    ],
    date: '28 Juli 2026',
    time: '2 Jam',
    status: 'RECORDED',
    streamUrl: 'https://www.youtube.com/embed/sample_multazam_talk',
    coverImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&auto=format&fit=crop&q=80',
    registeredCount: 5120,
    isUserRegistered: true,
    description: 'Ceramah menyentuh hati tentang cara bertaubat nasuha, adab berdoa di tempat-tempat mustajab Makkah-Madinah, dan menjaga predikat mabrur seumur hidup.',
    keyTakeaways: [
      'Jangan pulang sebelum memaafkan semua orang dan memohon ampunan tulus di Multazam.',
      'Adab memasuki Raudhah dengan salam penuh ta\'dzim kepada Baginda Nabi ﷺ.',
      'Memelihara akhlak mabrur sebagai bukti nyata diterimanya amal haji.'
    ],
    agenda: [
      { time: 'Sesi Muhasabah', topic: 'Menangis di Haraman: Penebus Dosa Masa Lalu', presenter: 'Ustadz Dr. H. Das\'ad Latif' }
    ],
    downloadables: [
      { title: 'Kumpulan Doa Khusus Tempat Mustajab Haramain (PDF)', type: 'PDF', size: '2.8 MB', downloadsCount: 4500 }
    ],
    questions: [],
    polls: [],
    certificatesIssuedCount: 4800
  },
  {
    id: 'talk-session-9',
    title: 'Audit Zakat Blockchain: Menjaga Amanah Lembaga Filantropi',
    category: 'ZAKAT_EKONOMI',
    categoryLabel: 'Zakat & Ekonomi Syariah',
    tagline: 'Standardisasi transparansi penyaluran donasi publik berbasis smart contract.',
    speaker: {
      name: 'Prof. Dr. KH. Noor Achmad, MA',
      role: 'Ketua BAZNAS RI',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      organization: 'BAZNAS RI',
      isVerified: true,
      specialization: 'Akuntabilitas Amil Nasional'
    },
    coSpeakers: [
      {
        name: 'Benn Al Islamicity',
        role: 'Founder Islamicity',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        organization: 'Pusat Dakwah Islamicity',
        isVerified: true,
        specialization: 'Teknologi Dakwah'
      }
    ],
    date: '15 Juli 2026',
    time: '1 Jam 45 Menit',
    status: 'RECORDED',
    streamUrl: 'https://www.youtube.com/embed/sample_audit_talk',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    registeredCount: 3100,
    isUserRegistered: false,
    description: 'Evolusi pelaporan zakat dari manual ke sistem real-time on-chain yang dapat diverifikasi publik tanpa mengorbankan privasi martabat mustahik.',
    keyTakeaways: [
      'Tiga prinsip BAZNAS: Aman Syar\'i, Aman Regulasi, dan Aman NKRI.',
      'Sertifikat digital BSZ ber-QR sebagai pengurang resmi pajak tahunan.',
      'Membangun trust muzakki milenial dan gen Z melalui transparansi teknologi.'
    ],
    agenda: [
      { time: 'Presentasi', topic: 'Roadmap Audit Syariah Digital Indonesia', presenter: 'Prof. Dr. Noor Achmad' }
    ],
    downloadables: [
      { title: 'Buku Pedoman Audit Syariah LAZ (PDF)', type: 'PDF', size: '3.9 MB', downloadsCount: 1650 }
    ],
    questions: [],
    polls: [],
    certificatesIssuedCount: 2200
  },
  {
    id: 'talk-session-10',
    title: 'Tazkiyatun Nafs: Menyucikan Jiwa dari Penyakit Hati & Cinta Dunia',
    category: 'SPIRITUAL',
    categoryLabel: 'Spiritual & Tasawuf',
    tagline: 'Kajian kitab Ihya Ulumuddin Imam Al-Ghazali tentang hakikat zuhud dan ikhlas.',
    speaker: {
      name: 'Benn Al Islamicity',
      role: 'Pembina Dakwah Islamicity',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      organization: 'Pusat Dakwah Islamicity',
      isVerified: true,
      specialization: 'Tazkiyatun Nafs & Akhlak'
    },
    date: '10 Juli 2026',
    time: '1 Jam 35 Menit',
    status: 'RECORDED',
    streamUrl: 'https://www.youtube.com/embed/sample_tazkiyah_talk',
    coverImage: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80',
    registeredCount: 3600,
    isUserRegistered: true,
    description: 'Menemukan ketenangan sejati dengan membersihkan hati dari riya, ujub, hasad, dan ketergantungan berlebihan pada pujian makhluk.',
    keyTakeaways: [
      'Hati yang selamat (qalbun salim) adalah satu-satunya bekal berharga di hari kiamat.',
      'Praktik muhasabah sebelum tidur sebagai kebiasaan para salafus shalih.',
      'Zuhud bukan berarti miskin, melainkan dunia ada di tangan dan bukan di dalam hati.'
    ],
    agenda: [
      { time: 'Sesi Kajian', topic: 'Bedah Kitab Penawar Hati Al-Ghazali', presenter: 'Benn Al Islamicity' }
    ],
    downloadables: [
      { title: 'Matan Ringkasan Ihya Ulumuddin (PDF)', type: 'PDF', size: '2.5 MB', downloadsCount: 2800 }
    ],
    questions: [],
    polls: [],
    certificatesIssuedCount: 3100
  },
  {
    id: 'talk-session-11',
    title: 'Tadabbur Surah Al-Waqi\'ah: Menjemput Rezeki Berkah Tanpa Was-was',
    category: 'AKIDAH',
    categoryLabel: 'Tafsir & Akidah',
    tagline: 'Memahami janji Allah tentang kelapangan rezeki bagi hamba yang bertawakal.',
    speaker: {
      name: 'Dr. KH. M. Cholil Nafis, Lc., MA',
      role: 'Ketua MUI',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      organization: 'MUI Pusat',
      isVerified: true,
      specialization: 'Tafsir & Fatwa'
    },
    date: '1 Juli 2026',
    time: '1 Jam 25 Menit',
    status: 'RECORDED',
    streamUrl: 'https://www.youtube.com/embed/sample_tafsir_talk',
    coverImage: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80',
    registeredCount: 3890,
    isUserRegistered: false,
    description: 'Kajian tafsir mendalam ayat demi ayat Surah Al-Waqi\'ah, kelompok As-Sabiqun, Ashabul Yamin, dan kunci pembuka pintu rezeki langit dan bumi.',
    keyTakeaways: [
      'Rezeki telah tertulis, jemputlah dengan cara yang diridhai Allah.',
      'Rutinitas membaca Surah Al-Waqi\'ah sebagai pengingat kefakiran kita di hadapan Sang Maha Pemberi.',
      'Sedekah di kala lapang dan sempit sebagai magnet rezeki tak terduga.'
    ],
    agenda: [
      { time: 'Tafsir Ayat', topic: 'Kunci Sukses Kaum Sabiqun dalam Surah Al-Waqiah', presenter: 'Dr. KH. M. Cholil Nafis' }
    ],
    downloadables: [
      { title: 'Tafsir Tematik Surah Al-Waqi\'ah (PDF)', type: 'PDF', size: '2.0 MB', downloadsCount: 2600 }
    ],
    questions: [],
    polls: [],
    certificatesIssuedCount: 3400
  }
];

export const INITIAL_CURATED_PLAYLISTS: CuratedPlaylist[] = [
  {
    id: 'playlist-fiqih-fintech-1',
    title: 'Masterclass Fiqih Fintech, Kripto, & Bisnis Digital Syariah',
    subtitle: 'Panduan lengkap akad halal perniagaan modern, investasi digital, dan smart contract zakat.',
    description: 'Seri kurikulum terstruktur yang mengupas tuntas fikih muamalah kontemporer. Membimbing Anda menavigasi e-commerce, dropshipping, kepemilikan aset kripto, hingga pencatatan transparansi zakat L2 sesuai fatwa resmi DSN-MUI.',
    category: 'Fiqih Muamalah & Fintech',
    categoryCode: 'FIQIH_MUAMALAH',
    badge: 'ALGORITHM_RECOMMENDED',
    badgeLabel: '✨ 98% Cocok dengan Minat Anda',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    scholars: [
      {
        name: 'Benn Al Islamicity',
        role: 'Founder & Pembina Pusat Dakwah',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        organization: 'Pusat Dakwah Islamicity',
        isVerified: true,
        specialization: 'Fikih Muamalah Digital'
      },
      {
        name: 'Dr. KH. M. Cholil Nafis, Lc., MA',
        role: 'Ketua MUI Bidang Fatwa & Dakwah',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        organization: 'MUI Pusat',
        isVerified: true,
        specialization: 'Fatwa Muamalah'
      }
    ],
    primaryTopics: [
      'Fiqih Muamalah & Fintech',
      'Etika Bisnis & Kejujuran Niaga',
      'Zakat & Filantropi Syariah'
    ],
    difficulty: 'MENENGAH',
    totalDurationMinutes: 340,
    totalEpisodes: 3,
    episodes: [
      {
        episodeNumber: 1,
        talkId: 'talk-session-live-1',
        customTitle: 'Modul 1: Kaidah Asal Muamalah & Kripto Syariah On-Chain',
        durationMinutes: 135,
        keyFocus: 'Hukum dasar investasi digital, smart contract audit, dan fatwa mutakhir DSN-MUI.',
        talkSession: INITIAL_TALK_SESSIONS[0]
      },
      {
        episodeNumber: 2,
        talkId: 'talk-session-5',
        customTitle: 'Modul 2: Praktik Halal E-Commerce, Dropship, & COD',
        durationMinutes: 100,
        keyFocus: 'Skema akad wakalah bil ujrah, salam, dan solusi anti-gharar marketplace.',
        talkSession: INITIAL_TALK_SESSIONS[4]
      },
      {
        episodeNumber: 3,
        talkId: 'talk-session-recorded-4',
        customTitle: 'Modul 3: Transformasi 8 Asnaf Zakat & Ekosistem Muzakki',
        durationMinutes: 105,
        keyFocus: 'Distribusi zakat produktif untuk modal wirausaha mustahik.',
        talkSession: INITIAL_TALK_SESSIONS[3]
      }
    ],
    targetGoal: 'FINANCE_HALAL',
    matchScore: 98,
    matchReasons: [
      'Sangat sesuai minat utama Anda pada Fiqih Muamalah & Fintech (Bobot 9.5/10)',
      'Menghadirkan 2 pemateri favorit: Benn Al Islamicity & Dr. KH. M. Cholil Nafis',
      'Selaras dengan target literasi finansial halal Anda'
    ],
    isSaved: true,
    likesCount: 1420,
    hasLiked: true,
    sharesCount: 380,
    isOfficialCuratorVerified: true,
    curatorName: 'Dewan Kurasi Dakwah Islamicity'
  },
  {
    id: 'playlist-hajj-mabrur-2',
    title: 'Kurikulum Lengkap Persiapan Haji & Umrah Mabrur 1448 H',
    subtitle: 'Manasik fiqih praktis, persiapan kalbu, bimbingan doa, dan tips aplikasi Nusuk.',
    description: 'Jalur pembelajaran komprehensif bagi calon tamu Allah. Menyatukan pemahaman rukun wajib haji-umrah sesuai sunnah, adab dan tempat doa mustajab di Haramain, hingga kesehatan fisik lansia di tanah suci.',
    category: 'Manasik Haji & Umrah',
    categoryCode: 'HAJJ_PREP',
    badge: 'LEARNING_PATH',
    badgeLabel: '🕋 Jalur Belajar Bersertifikat',
    coverImage: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800&auto=format&fit=crop&q=80',
    scholars: [
      {
        name: 'Benn Al Islamicity',
        role: 'Pembina Pusat Dakwah',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        organization: 'Pusat Dakwah Islamicity',
        isVerified: true,
        specialization: 'Bimbingan Haramain'
      },
      {
        name: 'Ustadz Dr. H. Das\'ad Latif, Ph.D',
        role: 'Da\'i Nasional',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        organization: 'Kemenag RI & Asosiasi PPIU',
        isVerified: true,
        specialization: 'Muhasabah Kalbu'
      }
    ],
    primaryTopics: [
      'Manasik Haji & Umrah Mabrur',
      'Tazkiyatun Nafs & Ketenangan Hati'
    ],
    difficulty: 'PEMULA',
    totalDurationMinutes: 300,
    totalEpisodes: 2,
    episodes: [
      {
        episodeNumber: 1,
        talkId: 'talk-session-upcoming-2',
        customTitle: 'Modul 1: Rahasia Sukses Haji Mabrur & Tata Cara Nusuk',
        durationMinutes: 180,
        keyFocus: 'Rukun, wajib, sunnah thawaf-sai-wukuf dan teknis izin Raudhah.',
        talkSession: INITIAL_TALK_SESSIONS[1]
      },
      {
        episodeNumber: 2,
        talkId: 'talk-session-8',
        customTitle: 'Modul 2: Manasik Qalbu: Menangis di Multazam & Raudhah',
        durationMinutes: 120,
        keyFocus: 'Muhasabah taubat nasuha, adab munajat di Multazam, dan menjaga kemabruran.',
        talkSession: INITIAL_TALK_SESSIONS[7]
      }
    ],
    targetGoal: 'HAJJ_PREP',
    matchScore: 94,
    matchReasons: [
      'Sesuai minat Anda pada Manasik Haji & Umrah Mabrur (Bobot 8.5/10)',
      'Dipandu langsung oleh Ustadz Dr. H. Das\'ad Latif & Benn Al Islamicity',
      'Menyediakan materi unduhan doa & checklist koper gratis'
    ],
    isSaved: true,
    likesCount: 2310,
    hasLiked: false,
    sharesCount: 650,
    isOfficialCuratorVerified: true,
    curatorName: 'Pusat Bimbingan Manasik Islamicity'
  },
  {
    id: 'playlist-parenting-sakinah-3',
    title: 'Sakinah Parenting: Neurosains Emosi & Adab Anak Qur\'ani',
    subtitle: 'Sinergi sains otak dan teladan Luqman Al-Hakim mendidik generasi di era media sosial.',
    description: 'Panduan ilmiah dan spiritual bagi orang tua muslim. Menyelami cara kerja hormon otak anak, komunikasi kasih sayang tanpa kekerasan verbal, serta membangun keluarga penuh sakinah mawaddah rahmah.',
    category: 'Parenting & Keluarga',
    categoryCode: 'FAMILY',
    badge: 'POPULAR_SERIES',
    badgeLabel: '🔥 Seri Terpopuler Pekan Ini',
    coverImage: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&auto=format&fit=crop&q=80',
    scholars: [
      {
        name: 'dr. Aisah Dahlan, CM.NLP',
        role: 'Praktisi Neuroparenting',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        organization: 'Asosiasi Konselor Muslim',
        isVerified: true,
        specialization: 'Neurosains Parenting'
      },
      {
        name: 'Benn Al Islamicity',
        role: 'Pembina Dakwah',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        organization: 'Pusat Dakwah Islamicity',
        isVerified: true,
        specialization: 'Ketahanan Keluarga'
      }
    ],
    primaryTopics: [
      'Parenting Islami & Generasi Qurani',
      'Tazkiyatun Nafs & Ketenangan Hati'
    ],
    difficulty: 'PEMULA',
    totalDurationMinutes: 210,
    totalEpisodes: 2,
    episodes: [
      {
        episodeNumber: 1,
        talkId: 'talk-session-upcoming-3',
        customTitle: 'Modul 1: Otak Anak & Metode Surah Luqman di Era Gadget',
        durationMinutes: 120,
        keyFocus: 'Menangani screen time berlebih dan membangun kecintaan salat berjamaah.',
        talkSession: INITIAL_TALK_SESSIONS[2]
      },
      {
        episodeNumber: 2,
        talkId: 'talk-session-7',
        customTitle: 'Modul 2: Terapi Burnout & Manajemen Emosi Muslimah',
        durationMinutes: 90,
        keyFocus: 'Pemberdayaan mental ibu dan komunikasi asertif dengan pasangan.',
        talkSession: INITIAL_TALK_SESSIONS[6]
      }
    ],
    targetGoal: 'FAMILY_HARMONY',
    matchScore: 89,
    matchReasons: [
      'Menampilkan dr. Aisah Dahlan dengan rating kepuasan jamaah 99%',
      'Mencakup topik Parenting Islami & Generasi Qurani (Bobot 7.0/10)',
      'Dilengkapi tabel Habit Tracker Ibadah Anak'
    ],
    likesCount: 3180,
    hasLiked: false,
    sharesCount: 920,
    isOfficialCuratorVerified: true,
    curatorName: 'Lembaga Konseling Keluarga Islamicity'
  },
  {
    id: 'playlist-zakat-filantropi-4',
    title: 'Ekosistem Filantropi: Transformasi 8 Asnaf & Zakat On-Chain',
    subtitle: 'Strategi pengentasan kemiskinan dengan transparansi ledger L2 dan akuntabilitas amil.',
    description: 'Kajian kebijakan dan fikih terapan bersama BAZNAS RI. Mengulas model penyaluran zakat produktif, validasi mustahik, dan tata kelola infaq modern yang membawa dampak sosial terukur.',
    category: 'Zakat & Ekonomi Syariah',
    categoryCode: 'ZAKAT_EKONOMI',
    badge: 'SCHOLAR_COLLECTION',
    badgeLabel: '🏛️ Kolaborasi BAZNAS RI',
    coverImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80',
    scholars: [
      {
        name: 'Prof. Dr. KH. Noor Achmad, MA',
        role: 'Ketua BAZNAS RI',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        organization: 'BAZNAS RI',
        isVerified: true,
        specialization: 'Regulasi Filantropi'
      },
      {
        name: 'Benn Al Islamicity',
        role: 'Founder Islamicity',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        organization: 'Pusat Dakwah Islamicity',
        isVerified: true,
        specialization: 'Infrastruktur Zakat Digital'
      }
    ],
    primaryTopics: [
      'Zakat & Filantropi Syariah',
      'Fiqih Muamalah & Fintech'
    ],
    difficulty: 'MENENGAH',
    totalDurationMinutes: 240,
    totalEpisodes: 2,
    episodes: [
      {
        episodeNumber: 1,
        talkId: 'talk-session-recorded-4',
        customTitle: 'Modul 1: 8 Asnaf Zakat: Transformasi Menjadi Muzakki',
        durationMinutes: 135,
        keyFocus: 'Distribusi produktif vs konsumtif dan pengawasan sistem ledger.',
        talkSession: INITIAL_TALK_SESSIONS[3]
      },
      {
        episodeNumber: 2,
        talkId: 'talk-session-9',
        customTitle: 'Modul 2: Audit Zakat Blockchain & Kepatuhan Syariah',
        durationMinutes: 105,
        keyFocus: 'Sertifikat BSZ ber-QR untuk pemotongan pajak resmi.',
        talkSession: INITIAL_TALK_SESSIONS[8]
      }
    ],
    targetGoal: 'ZAKAT_IMPACT',
    matchScore: 92,
    matchReasons: [
      'Sangat cocok dengan minat Zakat & Filantropi Syariah (Bobot 9.0/10)',
      'Menghadirkan Ketua BAZNAS RI Prof. Dr. KH. Noor Achmad',
      'Relevan dengan fitur Zakat Blockchain di aplikasi Anda'
    ],
    likesCount: 1850,
    hasLiked: false,
    sharesCount: 410,
    isOfficialCuratorVerified: true,
    curatorName: 'Pusat Kajian Filantropi BAZNAS'
  },
  {
    id: 'playlist-spiritual-tazkiyah-5',
    title: 'Tazkiyatun Nafs: Terapi Jiwa & Ketenangan Hati Era Modern',
    subtitle: 'Menyucikan hati dari hasad, was-was rezeki, dan ketergantungan pada duniawi.',
    description: 'Seri penyejuk batin yang membimbing kita kembali kepada fitrah. Mengupas nasihat agung Imam Al-Ghazali dan tadabbur ayat Al-Qur\'an untuk meraih ketenteraman jiwa di tengah kebisingan dunia.',
    category: 'Akidah & Tasawuf',
    categoryCode: 'SPIRITUAL',
    badge: 'POPULAR_SERIES',
    badgeLabel: '🌿 Penyejuk Jiwa',
    coverImage: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80',
    scholars: [
      {
        name: 'Benn Al Islamicity',
        role: 'Pembina Dakwah',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        organization: 'Pusat Dakwah Islamicity',
        isVerified: true,
        specialization: 'Tazkiyatun Nafs'
      },
      {
        name: 'Dr. KH. M. Cholil Nafis, Lc., MA',
        role: 'Ketua MUI',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        organization: 'MUI Pusat',
        isVerified: true,
        specialization: 'Tafsir & Akidah'
      }
    ],
    primaryTopics: [
      'Tazkiyatun Nafs & Ketenangan Hati',
      'Akidah & Tauhid Kontemporer',
      'Tafsir & Tadabbur Al-Quran'
    ],
    difficulty: 'PEMULA',
    totalDurationMinutes: 180,
    totalEpisodes: 2,
    episodes: [
      {
        episodeNumber: 1,
        talkId: 'talk-session-10',
        customTitle: 'Modul 1: Ihya Ulumuddin: Menyembuhkan Penyakit Hati',
        durationMinutes: 95,
        keyFocus: 'Hakikat ikhlas, zuhud, dan membentengi diri dari penyakit hasad.',
        talkSession: INITIAL_TALK_SESSIONS[9]
      },
      {
        episodeNumber: 2,
        talkId: 'talk-session-11',
        customTitle: 'Modul 2: Tadabbur Al-Waqi\'ah: Menjemput Rezeki Tanpa Was-was',
        durationMinutes: 85,
        keyFocus: 'Kunci tawakal dan janji rezeki Allah bagi kaum mukminin.',
        talkSession: INITIAL_TALK_SESSIONS[10]
      }
    ],
    targetGoal: 'SPIRITUAL_GROWTH',
    matchScore: 88,
    matchReasons: [
      'Membahas Tazkiyatun Nafs & Tadabbur Al-Qur\'an',
      'Disampaikan dengan gaya bahasa hangat dan menyentuh kalbu',
      'Cocok disimak saat waktu luang atau menjelang istirahat malam'
    ],
    likesCount: 2950,
    hasLiked: false,
    sharesCount: 780,
    isOfficialCuratorVerified: true,
    curatorName: 'Dewan Spiritual Islamicity'
  },
  {
    id: 'playlist-bisnis-waris-6',
    title: 'Hukum Faraidh & Proteksi Harta Halal Keluarga Muslim',
    subtitle: 'Mencegah sengketa waris, tata cara wasiat, dan pencatatan faraidh modern.',
    description: 'Panduan praktis menjaga keutuhan ukhuwah keluarga dengan pembagian warisan yang adil dan patuh syariat. Disertai studi kasus harta bersama, hibah sebelum wafat, dan hak ahli waris anak yatim.',
    category: 'Fiqih Keluarga & Muamalah',
    categoryCode: 'FIQIH_MUAMALAH',
    badge: 'NEW_RELEASE',
    badgeLabel: '🆕 Seri Rilisan Baru',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    scholars: [
      {
        name: 'Dr. KH. M. Cholil Nafis, Lc., MA',
        role: 'Ketua MUI Bidang Fatwa',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        organization: 'MUI Pusat',
        isVerified: true,
        specialization: 'Faraidh & Fatwa'
      },
      {
        name: 'Benn Al Islamicity',
        role: 'Pakar Muamalah',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        organization: 'Pusat Dakwah Islamicity',
        isVerified: true,
        specialization: 'Hukum Bisnis'
      }
    ],
    primaryTopics: [
      'Fiqih Muamalah & Fintech',
      'Etika Bisnis & Kejujuran Niaga'
    ],
    difficulty: 'LANJUTAN',
    totalDurationMinutes: 215,
    totalEpisodes: 2,
    episodes: [
      {
        episodeNumber: 1,
        talkId: 'talk-session-6',
        customTitle: 'Modul 1: Fiqih Faraidh: Rukun & Pembagian Harta Warisan',
        durationMinutes: 115,
        keyFocus: 'Kaidah Surah An-Nisa, pelunasan hutang jenazah, dan wasiat 1/3.',
        talkSession: INITIAL_TALK_SESSIONS[5]
      },
      {
        episodeNumber: 2,
        talkId: 'talk-session-5',
        customTitle: 'Modul 2: Perlindungan Aset & Akad Perniagaan Berkah',
        durationMinutes: 100,
        keyFocus: 'Transparansi kepemilikan aset dan adab perniagaan keluarga.',
        talkSession: INITIAL_TALK_SESSIONS[4]
      }
    ],
    targetGoal: 'FINANCE_HALAL',
    matchScore: 86,
    matchReasons: [
      'Kajian mendalam tentang Faraidh dan hukum kepemilikan harta',
      'Cocok untuk kepala keluarga dan pebisnis muslim',
      'Dilengkapi berkas PDF tabel kalkulator waris'
    ],
    likesCount: 1620,
    hasLiked: false,
    sharesCount: 340,
    isOfficialCuratorVerified: true,
    curatorName: 'Dewan Pakar Faraidh Islamicity'
  }
];


export const INITIAL_DAKWAH_ARTICLES: DakwahArticle[] = [
  {
    id: 'art-1',
    title: 'Panduan Praktis Menghitung Zakat Penghasilan & Tabungan Sesuai Fatwa DSN-MUI',
    category: 'FIQIH',
    categoryLabel: 'Fikih Muamalah & Zakat',
    author: 'Benn Al Islamicity & Tim Asatidz',
    authorRole: 'Dewan Pakar Dakwah Islamicity',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    readTimeMinutes: 5,
    date: '28 Agustus 2026',
    excerpt: 'Simak langkah demi langkah menghitung nisab 85 gram emas, pengurangan kebutuhan pokok, dan cara pelaporan Bukti Setor Zakat (BSZ) untuk pemotongan pajak resmi.',
    content: `Zakat merupakan salah satu rukun Islam yang memiliki dimensi ibadah mahdhah sekaligus pemberdayaan sosial ekonomi. Dalam fatwa MUI Nomor 3 Tahun 2003, zakat penghasilan (profesi) diqiyaskan pada zakat pertanian dalam hal waktu pengeluarannya (setiap menerima hasil/gaji) dan diqiyaskan pada zakat emas dalam hal nisabnya (setara 85 gram emas murni).

### 1. Ambang Batas Nisab
Nisab zakat profesi adalah seharga 85 gram emas murni per tahun, atau bila dihitung bulanan setara dengan harga ~7,08 gram emas. Jika harga emas Rp 1.450.000/gram, maka nisab bulanan berkisar Rp 10.270.000.

### 2. Rumus Perhitungan Bersih
Penghasilan Kotor (Gaji Pokok + Tunjangan + Bonus) dikurangi kebutuhan pokok sandang, pangan, papan daruri, dan cicilan hutang jatuh tempo. Jika sisanya melebihi ambang nisab, maka kadar zakat yang wajib dikeluarkan adalah 2.5%.

### 3. Pencatatan Transparan Blockchain
Dengan memanfaatkan teknologi IslamicityLink, setiap transaksi zakat langsung tercatat pada smart contract publik, memberikan Anda Bukti Setor Zakat (BSZ) ber-QR yang sah untuk pengurang pajak SPT Tahunan sesuai UU No. 23/2011.`,
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    audioDuration: '4:15 Menit',
    likesCount: 524,
    hasLiked: true,
    sharesCount: 188,
    tags: ['Zakat Profesi', 'DSN-MUI', 'Nisab Emas', 'Pajak SPT'],
    keyVerses: [
      {
        arabic: 'خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا',
        latin: 'Khuz min amwaalihim shadaqatan tutahhiruhum wa tuzakkiihim bihaa',
        translation: 'Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan menyucikan mereka...',
        surah: 'QS. At-Taubah: 103'
      }
    ]
  },
  {
    id: 'art-2',
    title: 'Meraih Predikat Haji & Umrah Mabrur: Menata Hati Menuju Tanah Suci',
    category: 'AKIDAH',
    categoryLabel: 'Spiritual & Ibadah',
    author: 'Benn Al Islamicity',
    authorRole: 'Pembina Pusat Dakwah',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    readTimeMinutes: 7,
    date: '25 Agustus 2026',
    excerpt: 'Haji mabrur tidak ada balasan baginya kecuali surga. Pahami esensi kepasrahan Nabi Ibrahim AS dan Hajar di bukit Shafa-Marwah.',
    content: `Rasulullah ﷺ bersabda: "Dan haji mabrur tidak ada balasan baginya melainkan surga" (HR. Bukhari & Muslim). Tanda kemabruran haji terlihat dari perubahan akhlak setelah pulang dari Tanah Suci: semakin dermawan, tutur kata santun, dan menjaga salat berjamaah.

### 1. Niat Suci Tanpa Riya\'
Pastikan niat semata-mata mengharap ridha Allah ﷻ, bukan gelar sosial atau dokumentasi pamer di media sosial.

### 2. Harta yang Halal
Daging yang tumbuh dari harta haram tidak akan diterima doanya di Multazam. Pastikan tabungan haji berasal dari rezeki yang bersih dari riba dan syubhat.

### 3. Tawakal & Sabar
Ujian kesabaran saat antrian panjang, cuaca terik, dan kerumunan jutaan jamaah merupakan ladang pelebur dosa.`,
    coverImage: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800&auto=format&fit=crop&q=80',
    audioDuration: '6:30 Menit',
    likesCount: 890,
    hasLiked: false,
    sharesCount: 312,
    tags: ['Haji Mabrur', 'Umrah', 'Tawakal', 'Baitullah'],
    keyVerses: [
      {
        arabic: 'وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ',
        latin: 'Wa atimmul hajja wal \'umrata lillaah',
        translation: 'Dan sempurnakanlah ibadah haji dan umrah karena Allah...',
        surah: 'QS. Al-Baqarah: 196'
      }
    ]
  },
  {
    id: 'art-3',
    title: 'Adab Berbisnis Islami: Meraih Berkah dengan Kejujuran & Akad yang Jelas',
    category: 'MUAMALAH',
    categoryLabel: 'Muamalah & Bisnis Syariah',
    author: 'Tim Dakwah Islamicity & Lynk.id',
    authorRole: 'Pusat Kajian Muamalah',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    readTimeMinutes: 4,
    date: '20 Agustus 2026',
    excerpt: 'Kejujuran dalam perniagaan mengantarkan pedagang bersama para Nabi, Shiddiqin, dan Syuhada di akhirat kelak.',
    content: `Rasulullah ﷺ adalah sosok teladan agung sebagai pedagang ulung bergelar Al-Amin (Yang Terpercaya). Di era e-commerce dan ekonomi digital saat ini, prinsip transparansi dan kejelasan akad (tanpa menyembunyikan cacat barang) menjadi kunci mengundang keberkahan rezeki.`,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    likesCount: 412,
    hasLiked: false,
    sharesCount: 145,
    tags: ['Bisnis Syariah', 'Al-Amin', 'Kejujuran', 'Muamalah']
  }
];

export const INITIAL_TANYA_JAWAB: TanyaJawabItem[] = [
  {
    id: 'tj-1',
    questionerName: 'Rizky Pratama',
    isAnonymous: false,
    city: 'Surabaya',
    title: 'Hukum Zakat Penghasilan bagi Freelancer Remote dengan Gaji Dollar (USD)',
    question: 'Assalamu\'alaikum Ustadz. Saya bekerja remote untuk perusahaan luar negeri dengan pendapatan bervariasi dalam mata uang USD. Bagaimana cara menghitung nisab dan kapan waktu terbaik membayarnya?',
    category: 'ZAKAT_HUKUM',
    categoryLabel: 'Zakat & Keuangan Syariah',
    answer: 'Wa\'alaikumussalam Warahmatullah. Anda dapat mengonversi penghasilan USD ke Rupiah berdasarkan kurs saat menerima gaji. Jika total penghasilan bersih per bulan setara dengan harga 7,08 gram emas murni (sekitar Rp 10.270.000), maka wajib dikeluarkan zakatnya 2.5% saat menerima upah tersebut. Anda dapat langsung menggunakan konversi mata uang lokal pada tab Zakat Blockchain kami.',
    ustadzName: 'Benn Al Islamicity',
    ustadzTitle: 'Pembina Pusat Dakwah Islamicity',
    ustadzAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    dalilRef: ['Fatwa MUI No. 3 Tahun 2003 tentang Zakat Penghasilan', 'QS. Al-An\'am: 141 (Tunaikan haknya di hari memetik hasilnya)'],
    date: '29 Agustus 2026',
    viewsCount: 1420,
    likesCount: 185,
    hasLiked: true,
    isResolved: true
  },
  {
    id: 'tj-2',
    questionerName: 'Nurul Hidayah',
    isAnonymous: false,
    city: 'Bandung',
    title: 'Syarat Sah Safar Umrah Wanita Mandiri Tanpa Mahram di Regulasi Baru',
    question: 'Ustadz, apakah seorang wanita muslimah boleh berangkat umrah mandiri bersama rombongan wanita terpercaya tanpa didampingi suami atau mahram laki-laki?',
    category: 'FIQIH_IBADAH',
    categoryLabel: 'Fiqih Ibadah & Manasik',
    answer: 'Menurut Mazhab Syafi\'i dan fatwa ulama kontemporer (termasuk regulasi resmi Kementerian Haji Arab Saudi), wanita muslimah dibolehkan safar umrah tanpa mahram laki-laki dengan syarat berada dalam rombongan wanita yang amanah dan terpercaya (suhbah ma\'munah) serta terjamin keamanannya dari fitnah selama perjalanan.',
    ustadzName: 'Dr. KH. M. Cholil Nafis',
    ustadzTitle: 'Ketua Bidang Fatwa & Dakwah MUI',
    ustadzAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    dalilRef: ['Kitab Al-Majmu\' Syarah Al-Muhadzdzab Imam An-Nawawi', 'Fatwa Lajnah Daimah & DSN-MUI'],
    date: '26 Agustus 2026',
    viewsCount: 2310,
    likesCount: 310,
    hasLiked: false,
    isResolved: true
  },
  {
    id: 'tj-3',
    questionerName: 'Hamba Allah',
    isAnonymous: true,
    city: 'Yogyakarta',
    title: 'Hukum Bagi Hasil Tabungan Wadiah vs Mudharabah di Bank Syariah',
    question: 'Apa perbedaan mendasar antara akad Wadiah (titipan) dan Mudharabah (investasi bagi hasil) dalam tabungan syariah menurut fikih?',
    category: 'MUAMALAH_FINANCE',
    categoryLabel: 'Perbankan & Muamalah',
    answer: 'Akad Wadiah Yad Dhamanah adalah titipan yang dijamin keamanannya dan nasabah tidak dijanjikan imbalan tetap (hanya bonus sukarela dari bank). Sedangkan Akad Mudharabah adalah kemitraan investasi di mana nasabah bertindak sebagai shahibul maal (pemilik dana) dan bank sebagai mudharib (pengelola), dengan nisbah bagi hasil yang disepakati di awal (misal 60:40).',
    ustadzName: 'Benn Al Islamicity',
    ustadzTitle: 'Pakar Fikih Muamalah Islamicity',
    ustadzAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    dalilRef: ['Fatwa DSN-MUI No. 01/DSN-MUI/IV/2000 tentang Giro', 'Fatwa DSN-MUI No. 02/DSN-MUI/IV/2000 tentang Tabungan'],
    date: '22 Agustus 2026',
    viewsCount: 1780,
    likesCount: 215,
    hasLiked: false,
    isResolved: true
  }
];

export const INITIAL_LUCKY_VOUCHERS: LuckyWheelVoucher[] = [
  {
    id: 'v-hajj-1',
    name: 'Voucher Tabungan Haji Berkah',
    category: 'HAJJ',
    code: 'HAJJBERKAH2026',
    discountValue: 'Rp 2.500.000',
    description: 'Potongan setoran awal pendaftaran porsi Haji Khusus / Plus pada mitra travel resmi.',
    terms: 'Berlaku hingga 31 Desember 2026 untuk pendaftaran haji via mitra PPIU terakreditasi.',
    expiryDate: '31 Des 2026',
    color: '#D97706',
    isClaimed: false
  },
  {
    id: 'v-umrah-1',
    name: 'Grand Prize Voucher Umrah Mabrur',
    category: 'UMRAH',
    code: 'UMRAHMABRUR5JT',
    discountValue: 'Rp 5.000.000',
    description: 'Voucher subsidi paket Umrah Syawal / Awal Musim 1448 H bersama Ustadz Pembina.',
    terms: 'Dapat digunakan langsung untuk paket Umrah Bintang 5 atau Reguler pada Tab Haji & Umrah.',
    expiryDate: '30 Nov 2026',
    color: '#059669',
    isClaimed: false
  },
  {
    id: 'v-book-1',
    name: 'Gratis E-Book Kitab Fiqih & Tafsir Lynk.id',
    category: 'BOOK',
    code: 'KITABGRATIS100',
    discountValue: '100% GRATIS',
    description: 'Akses penuh unduhan 5 E-Book Kajian Tematik & Transkrip Ceramah Pusat Dakwah.',
    terms: 'Bisa di-redeem langsung pada modul Lynk.id Hub.',
    expiryDate: '15 Okt 2026',
    color: '#2563EB',
    isClaimed: false
  },
  {
    id: 'v-infaq-1',
    name: 'Kupon Matching Infaq Berkah',
    category: 'INFAQ',
    code: 'MATCHINGINFAQ50K',
    discountValue: 'Bonus Rp 50.000',
    description: 'Donasi Anda akan dilipatgandakan oleh sponsor filantropi mitra IslamicityTalks.',
    terms: 'Otomatis aktif saat melakukan penyaluran di Co-Financing Komunitas.',
    expiryDate: '31 Okt 2026',
    color: '#7C3AED',
    isClaimed: false
  },
  {
    id: 'v-vip-1',
    name: 'Akses VIP Webinar & Sertifikat Digital',
    category: 'TALKS_VIP',
    code: 'TALKSVIP2026',
    discountValue: 'Akses Eksklusif',
    description: 'Jalur prioritas Q&A langsung dijawab oleh Ustadz Benn Al Islamicity & E-Sertifikat Ber-QR.',
    terms: 'Dapat digunakan untuk semua sesi webinar mendatang.',
    expiryDate: '31 Des 2026',
    color: '#DB2777',
    isClaimed: false
  },
  {
    id: 'v-doa-1',
    name: 'Doa Khusus Mustajab di Raudhah',
    category: 'DOA',
    code: 'DOARAUDHAH2026',
    discountValue: 'Titip Doa',
    description: 'Nama dan hajat doa Anda akan dibawa dan dibacakan langsung oleh Tim Dakwah di Raudhah Madinah.',
    terms: 'Kirimkan hajat doa melalui form konfirmasi jamaah.',
    expiryDate: '31 Des 2026',
    color: '#0D9488',
    isClaimed: false
  }
];
