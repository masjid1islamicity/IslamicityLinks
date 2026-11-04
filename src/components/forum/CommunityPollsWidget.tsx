import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PlusCircle, 
  CheckCircle2, 
  Vote, 
  Sparkles, 
  Search, 
  Filter, 
  MessageSquare, 
  Share2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  Users, 
  Send, 
  Check, 
  Trash2, 
  Plus, 
  HelpCircle,
  Award,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CommunityPoll, CommunityPollOption } from '../../types';

const INITIAL_POLLS: CommunityPoll[] = [
  {
    id: 'poll-01',
    title: 'Prioritas Penyaluran Dana Wakaf Produktif 2026',
    description: 'Berdasarkan musyawarah BAZNAS dan perwakilan DKM, sektor manakah yang sebaiknya menjadi fokus utama pembiayaan wakaf produktif tahun ini?',
    category: 'Wakaf & Sosial',
    creatorName: 'H. Muhammad Arifin, Lc.',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    creatorBadge: 'Dewan Pakar BAZNAS',
    createdAt: '2 hari lalu',
    expiresAt: '5 hari lagi',
    isClosed: false,
    totalVotes: 342,
    options: [
      { id: 'opt-1-1', text: 'Inkubator Modal Usaha Mikro Syariah & Dhuafa', votes: 148 },
      { id: 'opt-1-2', text: 'Panel Surya & Efisiensi Energi Masjid Ramah Lingkungan', votes: 96 },
      { id: 'opt-1-3', text: 'Beasiswa Pendidikan & Asrama Santri Tahfidz', votes: 68 },
      { id: 'opt-1-4', text: 'Klinik Layanan Kesehatan Gratis Terpadu', votes: 30 }
    ],
    tags: ['WakafProduktif', 'BAZNAS', 'EkonomiUmat'],
    comments: [
      {
        id: 'pcomm-1',
        pollId: 'poll-01',
        authorName: 'Ust. Farhan Siddiq',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
        authorBadge: 'MUI Bidang Fatwa',
        content: 'Modal usaha mikro memiliki multiplier effect ekonomi paling nyata untuk mengentaskan kemiskinan (asnaf mustahik menjadi muzakki).',
        timestamp: '1 hari lalu'
      },
      {
        id: 'pcomm-2',
        pollId: 'poll-01',
        authorName: 'Rina Salsabila',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
        authorBadge: 'Jamaah Aktif',
        content: 'Panel surya masjid juga sangat hemat tagihan listrik jangka panjang, sehingga kas masjid bisa dialihkan ke santunan fakir miskin.',
        timestamp: '18 jam lalu'
      }
    ]
  },
  {
    id: 'poll-02',
    title: 'Format Kajian Rutin Mingguan Paling Efektif & Diminati Jamaah',
    description: 'Evaluasi format taklim dan majelis ilmu untuk meningkatkan keikutsertaan generasi muda dan jamaah profesional perkotaan.',
    category: 'Edukasi & Kajian',
    creatorName: 'DKM Masjid Raya Al-Hikmah',
    creatorAvatar: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=120&auto=format&fit=crop&q=80',
    creatorBadge: 'DKM Partner',
    createdAt: '3 hari lalu',
    expiresAt: '2 hari lagi',
    isClosed: false,
    totalVotes: 512,
    options: [
      { id: 'opt-2-1', text: 'Hybrid (Tatap Muka di Masjid + Live Streaming YouTube/Zoom)', votes: 284 },
      { id: 'opt-2-2', text: 'Offline Tematik Diskusi Interaktif & Bedah Buku Syariah', votes: 124 },
      { id: 'opt-2-3', text: 'Podcast Audio & Modul Lynk.id Digital Fleksibel', votes: 76 },
      { id: 'opt-2-4', text: 'Kajian Subuh Berjamaah Plus Sarapan Sehat', votes: 28 }
    ],
    tags: ['KajianRutin', 'MajelisIlmu', 'DakwahDigital'],
    comments: [
      {
        id: 'pcomm-3',
        pollId: 'poll-02',
        authorName: 'Budi Santoso',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        authorBadge: 'Muzakki Terverifikasi',
        content: 'Format hybrid sangat memudahkan bagi yang sedang berdinas ke luar kota tetap bisa menyimak kajian asatidz favorit.',
        timestamp: '2 hari lalu'
      }
    ]
  },
  {
    id: 'poll-03',
    title: 'Penerapan Sistem Infaq & Kotak Amal Digital (QRIS / On-Chain)',
    description: 'Sejauh mana efektivitas dan kenyamanan jamaah saat berinfaq menggunakan transaksi non-tunai di lingkungan masjid Anda?',
    category: 'Program Masjid',
    creatorName: 'Ir. Hendra Pratama',
    creatorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    creatorBadge: 'Relawan IT Masjid',
    createdAt: '4 hari lalu',
    expiresAt: '1 hari lagi',
    isClosed: false,
    totalVotes: 420,
    options: [
      { id: 'opt-3-1', text: 'Sangat Nyaman & Transparan (QRIS Standar Nasional)', votes: 230 },
      { id: 'opt-3-2', text: 'Perlu Keduanya (Tetap Sediakan Kotak Kas Tunai & QRIS)', votes: 145 },
      { id: 'opt-3-3', text: 'Kombinasi QRIS + Blockchain Tracker (Audit Terbuka)', votes: 35 },
      { id: 'opt-3-4', text: 'Masih Lebih Nyaman Tunai Langsung', votes: 10 }
    ],
    tags: ['CashlessMasjid', 'QRIS', 'Transparansi'],
    comments: []
  },
  {
    id: 'poll-04',
    title: 'Topik Fiqih Kontemporer yang Perlu Segera Dibahas Tuntas di Forum',
    description: 'Tentukan tema bahasan webinar fikih muamalah bulanan bersama para ulama dan praktisi syariah.',
    category: 'Fiqih & Fatwa',
    creatorName: 'Dr. Ahmad Fauzan, S.E.I.',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    creatorBadge: 'Ahli Fikih Muamalah',
    createdAt: '5 hari lalu',
    expiresAt: 'Selesai Kemarin',
    isClosed: true,
    totalVotes: 680,
    options: [
      { id: 'opt-4-1', text: 'Fiqih AI, Otomasi Algoritma & Hak Cipta Karya Digital', votes: 310 },
      { id: 'opt-4-2', text: 'Aset Kripto, Tokenisasi RWA & Saham Syariah Global', votes: 195 },
      { id: 'opt-4-3', text: 'Kaidah Pajak Penghasilan vs Zakat Profesi Resmi', votes: 125 },
      { id: 'opt-4-4', text: 'Skema Dropship & Affiliate Marketing Sesuai Sunnah', votes: 50 }
    ],
    tags: ['FiqihKontemporer', 'WebinarSyariah', 'Teknologi'],
    comments: [
      {
        id: 'pcomm-4',
        pollId: 'poll-04',
        authorName: 'Ustadzah Maryam Lc.',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        authorBadge: 'Konsultan Syariah',
        content: 'InsyaAllah topik Fiqih AI akan kami jadwalkan bersama pakar AI dan DSN-MUI pekan depan!',
        timestamp: '1 hari lalu'
      }
    ]
  }
];

const STORAGE_KEY = 'islamicity_community_polls_v1';

export const CommunityPollsWidget: React.FC = () => {
  const { userProfile, addNotification } = useApp();

  const [polls, setPolls] = useState<CommunityPoll[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved polls', e);
    }
    return INITIAL_POLLS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ACTIVE' | 'CLOSED' | 'VOTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'NEWEST' | 'ENDING_SOON'>('POPULAR');
  
  // Expanded comments for poll
  const [expandedCommentsPollId, setExpandedCommentsPollId] = useState<string | null>(null);
  const [pollCommentInput, setPollCommentInput] = useState<{ [pollId: string]: string }>({});

  // Share Toast Feedback
  const [copiedPollId, setCopiedPollId] = useState<string | null>(null);

  // Modal State for New Poll
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Program Masjid');
  const [newOptions, setNewOptions] = useState<string[]>(['', '']);
  const [newTags, setNewTags] = useState<string>('');

  // Persist polls whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(polls));
    } catch (e) {
      console.error('Failed to save polls', e);
    }
  }, [polls]);

  const categories = ['ALL', 'Wakaf & Sosial', 'Edukasi & Kajian', 'Program Masjid', 'Fiqih & Fatwa', 'Gaya Hidup Halal'];

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id !== pollId) return poll;
        if (poll.isClosed) return poll;

        const previousVotedId = poll.userVotedOptionId;
        
        // If clicking the same option, they can toggle or keep it
        let updatedOptions: CommunityPollOption[];
        let newTotalVotes = poll.totalVotes;
        let nextVotedOptionId: string | undefined = optionId;

        if (previousVotedId === optionId) {
          // Retract vote
          updatedOptions = poll.options.map(opt => 
            opt.id === optionId ? { ...opt, votes: Math.max(0, opt.votes - 1) } : opt
          );
          newTotalVotes = Math.max(0, newTotalVotes - 1);
          nextVotedOptionId = undefined;
        } else if (previousVotedId) {
          // Switch vote from previous option to new option
          updatedOptions = poll.options.map(opt => {
            if (opt.id === previousVotedId) {
              return { ...opt, votes: Math.max(0, opt.votes - 1) };
            }
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + 1 };
            }
            return opt;
          });
        } else {
          // First time voting on this poll
          updatedOptions = poll.options.map(opt => 
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          );
          newTotalVotes += 1;
        }

        return {
          ...poll,
          options: updatedOptions,
          totalVotes: newTotalVotes,
          userVotedOptionId: nextVotedOptionId
        };
      })
    );

    if (addNotification) {
      addNotification({
        title: 'Suara Jajak Pendapat Tercatat',
        message: 'Partisipasi syura Anda telah berkontribusi terhadap aspirasi ummah di platform IslamicityLink.',
        type: 'SYSTEM_UPDATE',
        linkTab: 'forum'
      });
    }
  };

  const handleAddOptionField = () => {
    if (newOptions.length < 6) {
      setNewOptions([...newOptions, '']);
    }
  };

  const handleRemoveOptionField = (index: number) => {
    if (newOptions.length > 2) {
      setNewOptions(newOptions.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...newOptions];
    updated[index] = value;
    setNewOptions(updated);
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = newOptions.map(opt => opt.trim()).filter(opt => opt.length > 0);
    if (!newTitle.trim() || validOptions.length < 2) return;

    const parsedTags = newTags
      .split(/[\s,#,]+/)
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    const createdPoll: CommunityPoll = {
      id: `poll-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      category: newCategory,
      creatorName: userProfile.name || 'Jamaah Terverifikasi',
      creatorAvatar: userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      creatorBadge: 'Inisiator Polling',
      createdAt: 'Baru saja',
      expiresAt: '7 hari lagi',
      isClosed: false,
      totalVotes: 0,
      options: validOptions.map((text, idx) => ({
        id: `opt-${Date.now()}-${idx + 1}`,
        text,
        votes: 0
      })),
      tags: parsedTags.length > 0 ? parsedTags : ['MusyawarahUmmah'],
      comments: []
    };

    setPolls([createdPoll, ...polls]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewOptions(['', '']);
    setNewTags('');

    if (addNotification) {
      addNotification({
        title: 'Polling Komunitas Berhasil Dibuat',
        message: `Polling "${createdPoll.title}" sekarang aktif untuk dijawab oleh jamaah global.`,
        type: 'SYSTEM_UPDATE',
        linkTab: 'forum'
      });
    }
  };

  const handleSendPollComment = (pollId: string) => {
    const text = pollCommentInput[pollId]?.trim();
    if (!text) return;

    setPolls(prev => prev.map(p => {
      if (p.id !== pollId) return p;
      const newComment = {
        id: `pcomm-${Date.now()}`,
        pollId,
        authorName: userProfile.name,
        authorAvatar: userProfile.avatar,
        authorBadge: 'Jamaah Terverifikasi',
        content: text,
        timestamp: 'Baru saja'
      };
      return {
        ...p,
        comments: [...(p.comments || []), newComment]
      };
    }));

    setPollCommentInput(prev => ({ ...prev, [pollId]: '' }));
  };

  const handleSharePoll = (poll: CommunityPoll) => {
    const summary = `📊 *Jajak Pendapat Komunitas IslamicityLink*\n"${poll.title}"\nTotal Suara: ${poll.totalVotes.toLocaleString('id-ID')} partisipan.\nIkuti musyawarah syura di platform IslamicityLink.`;
    navigator.clipboard?.writeText?.(summary);
    setCopiedPollId(poll.id);
    setTimeout(() => setCopiedPollId(null), 2500);
  };

  // Filtering and sorting
  const filteredPolls = polls.filter(poll => {
    const matchCategory = selectedCategory === 'ALL' || poll.category === selectedCategory;
    const matchSearch = 
      poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (poll.description && poll.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      poll.options.some(opt => opt.text.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchStatus = true;
    if (selectedStatus === 'ACTIVE') matchStatus = !poll.isClosed;
    if (selectedStatus === 'CLOSED') matchStatus = !!poll.isClosed;
    if (selectedStatus === 'VOTED') matchStatus = !!poll.userVotedOptionId;

    return matchCategory && matchSearch && matchStatus;
  }).sort((a, b) => {
    if (sortBy === 'POPULAR') return b.totalVotes - a.totalVotes;
    if (sortBy === 'NEWEST') return b.id.localeCompare(a.id);
    if (sortBy === 'ENDING_SOON') {
      if (a.isClosed && !b.isClosed) return 1;
      if (!a.isClosed && b.isClosed) return -1;
      return a.totalVotes - b.totalVotes;
    }
    return 0;
  });

  const totalVotesAcrossAll = polls.reduce((acc, p) => acc + p.totalVotes, 0);
  const activePollsCount = polls.filter(p => !p.isClosed).length;
  const userVotedCount = polls.filter(p => !!p.userVotedOptionId).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Syura Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C3620] via-[#162C19] to-[#0F1E11] p-6 sm:p-7 text-white border border-[#2D332D] shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-300">
              <Vote className="w-3.5 h-3.5" />
              <span>Prinsip Syura & Aspirasi Komunitas Muslim</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Jajak Pendapat & Polling Syura Ummah
            </h2>
            <p className="text-xs sm:text-sm text-[#E4E8E4]/90 leading-relaxed">
              Suarakan aspirasi Anda dalam penentuan prioritas program dakwah, tata kelola wakaf, kajian fikih, dan kemaslahatan jamaah global secara terbuka dan demokratis.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#2E7D32]/30 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Polling Baru</span>
            </button>
          </div>
        </div>

        {/* Quick Stat Pill Highlights */}
        <div className="relative z-10 grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10 text-center sm:text-left">
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-emerald-300 font-bold block">Total Partisipasi Suara</span>
            <span className="text-base sm:text-lg font-black text-white">{totalVotesAcrossAll.toLocaleString('id-ID')}</span>
            <span className="text-[9px] text-[#E4E8E4]/70 block">Aspirasi Jamaah</span>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-amber-300 font-bold block">Polling Sedang Aktif</span>
            <span className="text-base sm:text-lg font-black text-white">{activePollsCount}</span>
            <span className="text-[9px] text-[#E4E8E4]/70 block">Bisa Diisi Sekarang</span>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-blue-300 font-bold block">Telah Anda Ikuti</span>
            <span className="text-base sm:text-lg font-black text-white">{userVotedCount}</span>
            <span className="text-[9px] text-[#E4E8E4]/70 block">Suara Anda Aktif</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1A1D1A] p-4 rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-3">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                    : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#E0E8E0] dark:hover:bg-[#2D332D]'
                }`}
              >
                {cat === 'ALL' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A665B] dark:text-[#A0A8A0]" />
            <input
              type="text"
              placeholder="Cari topik jajak pendapat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-full text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
            />
          </div>
        </div>

        {/* Secondary Status Filter & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] text-xs">
          
          <div className="flex items-center gap-1">
            <span className="text-[#5A665B] dark:text-[#A0A8A0] text-[11px] font-semibold mr-1">Status:</span>
            {(['ALL', 'ACTIVE', 'VOTED', 'CLOSED'] as const).map(statusKey => {
              const labels = {
                ALL: 'Semua',
                ACTIVE: 'Masih Aktif',
                VOTED: 'Sudah Memilih',
                CLOSED: 'Telah Ditutup'
              };
              return (
                <button
                  key={statusKey}
                  onClick={() => setSelectedStatus(statusKey)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedStatus === statusKey
                      ? 'bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] font-black'
                      : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-white'
                  }`}
                >
                  {labels[statusKey]}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#5A665B] dark:text-[#A0A8A0] text-[11px] font-semibold">Urutan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-lg text-[11px] font-bold text-[#141A14] dark:text-[#E4E8E4] focus:outline-none"
            >
              <option value="POPULAR">🔥 Terpopuler (Suara Terbanyak)</option>
              <option value="NEWEST">✨ Terbaru Diterbitkan</option>
              <option value="ENDING_SOON">⏳ Berakhir Segera</option>
            </select>
          </div>

        </div>

      </div>

      {/* Poll Cards Stream */}
      <div className="space-y-5">
        {filteredPolls.length > 0 ? (
          filteredPolls.map(poll => {
            const hasUserVoted = !!poll.userVotedOptionId;
            const highestVotes = Math.max(...poll.options.map(o => o.votes), 0);
            const isCommentsExpanded = expandedCommentsPollId === poll.id;

            return (
              <div 
                key={poll.id}
                className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm hover:shadow-md transition-all space-y-5"
              >
                
                {/* Header: Author Info + Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={poll.creatorAvatar} 
                      alt={poll.creatorName}
                      className="w-10 h-10 rounded-full object-cover border border-[#D8DFD8] dark:border-[#2D332D]"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-[#141A14] dark:text-[#E4E8E4]">
                          {poll.creatorName}
                        </span>
                        {poll.creatorBadge && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEF3EE] dark:bg-[#242924] text-[#2E7D32] dark:text-[#4CAF50] border border-[#D8DFD8] dark:border-[#2D332D]">
                            {poll.creatorBadge}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {poll.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#5A665B] dark:text-[#A0A8A0] mt-0.5">
                        <span>Dibuat {poll.createdAt}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-amber-500" />
                          {poll.isClosed ? 'Status: Selesai / Ditutup' : `Batas Waktu: ${poll.expiresAt}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Tag & Share Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    {poll.isClosed ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        Selesai
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-[#2E7D32] dark:text-[#4CAF50] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Aktif
                      </span>
                    )}

                    <button
                      onClick={() => handleSharePoll(poll)}
                      title="Bagikan Ringkasan Polling"
                      className="p-1.5 rounded-full hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] transition-colors"
                    >
                      {copiedPollId === poll.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Question & Description */}
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#141A14] dark:text-[#E4E8E4] leading-snug">
                    {poll.title}
                  </h3>
                  {poll.description && (
                    <p className="text-xs sm:text-sm text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed">
                      {poll.description}
                    </p>
                  )}
                </div>

                {/* Interactive Progress Bar Options Grid */}
                <div className="space-y-2.5">
                  {poll.options.map(option => {
                    const isSelected = poll.userVotedOptionId === option.id;
                    const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                    const isHighest = highestVotes > 0 && option.votes === highestVotes;

                    return (
                      <div
                        key={option.id}
                        onClick={() => !poll.isClosed && handleVote(poll.id, option.id)}
                        className={`relative overflow-hidden rounded-2xl border p-3.5 transition-all select-none ${
                          poll.isClosed
                            ? 'cursor-default'
                            : 'cursor-pointer hover:border-[#2E7D32]/60'
                        } ${
                          isSelected
                            ? 'border-[#2E7D32] bg-[#2E7D32]/5 dark:bg-[#2E7D32]/10 ring-1 ring-[#2E7D32]'
                            : 'border-[#D8DFD8] dark:border-[#2D332D] bg-[#F7F9F7] dark:bg-[#202520]'
                        }`}
                      >
                        {/* Animated Visual Progress Bar Fill */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ease-out opacity-20 ${
                            isSelected
                              ? 'bg-[#2E7D32] opacity-30'
                              : isHighest
                              ? 'bg-amber-500 opacity-25'
                              : 'bg-[#5A665B] opacity-15'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />

                        {/* Foreground Option Content */}
                        <div className="relative z-10 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            {/* Selection Radio / Check Indicator */}
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-[#2E7D32] border-[#2E7D32] text-white'
                                : 'border-[#A0A8A0] dark:border-[#5A665B] bg-white dark:bg-[#1A1D1A]'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>

                            <span className={`text-xs sm:text-sm font-semibold leading-tight ${
                              isSelected 
                                ? 'text-[#2E7D32] dark:text-[#4CAF50] font-bold' 
                                : 'text-[#141A14] dark:text-[#E4E8E4]'
                            }`}>
                              {option.text}
                            </span>
                          </div>

                          {/* Percent & Vote Count */}
                          <div className="flex items-center gap-2 shrink-0">
                            {isHighest && poll.totalVotes > 0 && (
                              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                <Sparkles className="w-2.5 h-2.5" />
                                Terbanyak
                              </span>
                            )}
                            {isSelected && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#2E7D32] text-white">
                                Pilihan Anda
                              </span>
                            )}
                            <div className="text-right">
                              <span className="text-xs sm:text-sm font-black text-[#141A14] dark:text-[#E4E8E4]">
                                {percentage}%
                              </span>
                              <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] ml-1">
                                ({option.votes})
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Footer Controls: Total Votes + Tags + Musyawarah Comments Toggle */}
                <div className="pt-3 border-t border-[#D8DFD8] dark:border-[#2D332D] flex flex-wrap items-center justify-between gap-3 text-xs">
                  
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 font-bold text-[#141A14] dark:text-[#E4E8E4]">
                      <Users className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
                      <span>{poll.totalVotes.toLocaleString('id-ID')} Total Suara</span>
                    </span>

                    {hasUserVoted && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ Suara Anda telah masuk. Klik pilihan lain jika ingin mengubah.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Tags */}
                    {poll.tags && poll.tags.map(tg => (
                      <span 
                        key={tg}
                        className="px-2 py-0.5 rounded-lg bg-[#EEF3EE] dark:bg-[#242924] text-[10px] font-semibold text-[#5A665B] dark:text-[#A0A8A0]"
                      >
                        #{tg}
                      </span>
                    ))}

                    {/* Toggle Comments Button */}
                    <button
                      onClick={() => setExpandedCommentsPollId(isCommentsExpanded ? null : poll.id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#E0E8E0] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] font-bold text-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
                      <span>{poll.comments?.length || 0} Tanggapan & Dalil</span>
                      {isCommentsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                </div>

                {/* Collapsible Musyawarah Comments Stream */}
                {isCommentsExpanded && (
                  <div className="pt-4 border-t border-[#D8DFD8] dark:border-[#2D332D] space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
                        <span>Ruang Musyawarah & Argumentasi Jamaah</span>
                      </span>
                      <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                        Sampaikan alasan pilihan secara santun & berlandaskan maslahat
                      </span>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {poll.comments && poll.comments.length > 0 ? (
                        poll.comments.map(comm => (
                          <div
                            key={comm.id}
                            className="p-3 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src={comm.authorAvatar}
                                  alt={comm.authorName}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                                <span className="font-bold text-[#141A14] dark:text-[#E4E8E4] text-[11px]">
                                  {comm.authorName}
                                </span>
                                {comm.authorBadge && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50]">
                                    {comm.authorBadge}
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] text-[#5A665B] dark:text-[#A0A8A0]">
                                {comm.timestamp}
                              </span>
                            </div>
                            <p className="text-[#141A14] dark:text-[#E4E8E4] text-[11px] leading-relaxed pl-7">
                              {comm.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4 text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                          Belum ada catatan musyawarah. Jadilah yang pertama memberikan masukan!
                        </p>
                      )}
                    </div>

                    {/* Comment Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Uraikan alasan/dalil atas pilihan Anda..."
                        value={pollCommentInput[poll.id] || ''}
                        onChange={(e) => setPollCommentInput({ ...pollCommentInput, [poll.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendPollComment(poll.id);
                        }}
                        className="flex-1 px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                      />
                      <button
                        onClick={() => handleSendPollComment(poll.id)}
                        disabled={!pollCommentInput[poll.id]?.trim()}
                        className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256629] disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-10 border border-[#D8DFD8] dark:border-[#2D332D] text-center space-y-3">
            <Vote className="w-10 h-10 text-[#5A665B] dark:text-[#A0A8A0] mx-auto opacity-50" />
            <h4 className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
              Tidak Ada Polling yang Sesuai Filter
            </h4>
            <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian atau ganti filter kategori untuk melihat jajak pendapat lainnya.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] text-[#2E7D32] dark:text-[#4CAF50] text-xs font-bold hover:bg-[#E0E8E0] dark:hover:bg-[#2D332D]"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* Create New Poll Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4] my-8 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#D8DFD8] dark:border-[#2D332D]">
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <h3 className="font-bold text-base text-[#141A14] dark:text-[#E4E8E4]">
                  Buat Jajak Pendapat / Polling Syura
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-4 text-xs">
              
              {/* Question / Title */}
              <div className="space-y-1">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Pertanyaan Polling: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Program apa yang paling dibutuhkan santri dhuafa saat ini?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Kategori Pembahasan:
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4] focus:outline-none"
                >
                  <option value="Program Masjid">Program Masjid</option>
                  <option value="Wakaf & Sosial">Wakaf & Sosial</option>
                  <option value="Edukasi & Kajian">Edukasi & Kajian</option>
                  <option value="Fiqih & Fatwa">Fiqih & Fatwa</option>
                  <option value="Gaya Hidup Halal">Gaya Hidup Halal</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Konteks / Penjelasan Singkat (Opsional):
                </label>
                <textarea
                  rows={2}
                  placeholder="Uraikan latar belakang atau tujuan musyawarah ini secara ringkas..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4] focus:outline-none"
                />
              </div>

              {/* Dynamic Options List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Pilihan Jawaban (Minimal 2, Maksimal 6): <span className="text-red-500">*</span>
                  </label>
                  {newOptions.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddOptionField}
                      className="text-[11px] text-[#2E7D32] dark:text-[#4CAF50] font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Pilihan</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {newOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 text-center font-bold text-[#5A665B] dark:text-[#A0A8A0] text-[11px]">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        required
                        placeholder={`Pilihan ${idx + 1} (contoh: ${idx === 0 ? 'Pelatihan Keterampilan Kerja' : 'Santunan Sembako Bulanan'})`}
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                      />
                      {newOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionField(idx)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                          title="Hapus Pilihan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Tags / Tagar (Pisahkan dengan koma atau spasi):
                </label>
                <input
                  type="text"
                  placeholder="Contoh: DKM, Santri, Beasiswa"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4] focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Vote className="w-4 h-4" />
                  <span>Terbitkan Polling Komunitas</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
