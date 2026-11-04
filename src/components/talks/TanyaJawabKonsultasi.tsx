import React, { useState } from 'react';
import { 
  MessageSquare, 
  HelpCircle, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  ThumbsUp, 
  Mic, 
  MicOff, 
  ShieldCheck, 
  BookOpen, 
  Clock, 
  Eye, 
  Share2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TanyaJawabItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface TanyaJawabKonsultasiProps {
  items: TanyaJawabItem[];
}

export const TanyaJawabKonsultasi: React.FC<TanyaJawabKonsultasiProps> = ({ items }) => {
  const { userProfile, addNotification } = useApp();
  const [qaList, setQaList] = useState<TanyaJawabItem[]>(items);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  // Submission Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [questionCategory, setQuestionCategory] = useState<TanyaJawabItem['category']>('FIQIH_IBADAH');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiPrelimAnswer, setAiPrelimAnswer] = useState<string | null>(null);

  // Expanded items
  const [expandedId, setExpandedId] = useState<string | null>('tj-1');

  const categories = [
    { id: 'ALL', label: 'Semua Kategori' },
    { id: 'ZAKAT_HUKUM', label: 'Zakat & Keuangan' },
    { id: 'FIQIH_IBADAH', label: 'Fiqih Ibadah' },
    { id: 'MUAMALAH_FINANCE', label: 'Muamalah & Bisnis' },
    { id: 'KELUARGA', label: 'Keluarga & Pernikahan' }
  ];

  const filteredItems = qaList.filter(item => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchQ = item.question.toLowerCase().includes(q);
      const matchAns = item.answer.toLowerCase().includes(q);
      if (!matchTitle && !matchQ && !matchAns) return false;
    }
    return true;
  });

  const handleToggleLike = (id: string) => {
    setQaList(prev => prev.map(item => {
      if (item.id === id) {
        const hasLiked = !item.hasLiked;
        return {
          ...item,
          hasLiked,
          likesCount: hasLiked ? item.likesCount + 1 : item.likesCount - 1
        };
      }
      return item;
    }));
  };

  const handleVoiceRecordToggle = () => {
    if (!isVoiceRecording) {
      setIsVoiceRecording(true);
      setTimeout(() => {
        setIsVoiceRecording(false);
        setQuestionContent("Assalamu'alaikum Ustadz Benn, bagaimana hukum pembagian dividen saham syariah jika ada pendapatan non-halal minoritas yang harus dibersihkan?");
        setQuestionTitle("Hukum Pembersihan Dividen Saham Syariah (Tathhir Al-Amwal)");
        addNotification({
          title: 'Rekaman Suara Dikonversi ke Teks',
          message: 'Audio pertanyaan Anda berhasil ditranskrip secara otomatis.',
          type: 'GENERAL'
        });
      }, 3000);
    } else {
      setIsVoiceRecording(false);
    }
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTitle.trim() || !questionContent.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newItem: TanyaJawabItem = {
        id: `tj-${Date.now()}`,
        questionerName: isAnonymous ? 'Hamba Allah (Anonim)' : (userProfile.name || 'Jamaah'),
        isAnonymous,
        city: 'Indonesia',
        title: questionTitle.trim(),
        question: questionContent.trim(),
        category: questionCategory,
        categoryLabel: categories.find(c => c.id === questionCategory)?.label || 'Fiqih Ibadah',
        answer: 'Pertanyaan Anda telah diterima oleh Tim Asatidz Pusat Dakwah Islamicity dan sedang dalam proses penelaahan dalil serta penyusunan jawaban resmi.',
        ustadzName: 'Benn Al Islamicity & Dewan Syariah',
        ustadzTitle: 'Pusat Konsultasi Dakwah Islamicity',
        ustadzAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        dalilRef: ['Sedang ditelaah berdasarkan Kitab Fiqih 4 Mazhab & Fatwa MUI'],
        date: 'Hari Ini',
        viewsCount: 1,
        likesCount: 1,
        hasLiked: true,
        isResolved: false
      };

      setQaList(prev => [newItem, ...prev]);
      setIsSubmitting(false);
      setIsFormOpen(false);
      setQuestionTitle('');
      setQuestionContent('');
      setAiPrelimAnswer(null);

      addNotification({
        title: 'Pertanyaan Terkirim ke Dewan Asatidz',
        message: 'Pertanyaan konsultasi Anda telah masuk ke sistem antrean fatwa Pusat Dakwah.',
        type: 'FORUM_REPLY'
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Ask Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Tanya Jawab Islam & Konsultasi Syariah Interaktif</span>
          </h3>
          <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] mt-0.5">
            Konsultasi hukum Fiqih, Zakat, dan Muamalah langsung dijawab oleh Ustadz Benn Al Islamicity & Dewan Ulama.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors shrink-0"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{isFormOpen ? 'Tutup Formulir' : 'Ajukan Pertanyaan Baru'}</span>
        </button>
      </div>

      {/* QUESTION SUBMISSION FORM (COLLAPSIBLE) */}
      {isFormOpen && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1D1A] border-2 border-emerald-500/40 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#D8DFD8] dark:border-[#2D332D] pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                <HelpCircle className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Formulir Konsultasi Tanya Jawab Ustadz
                </h4>
                <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                  Gunakan suara atau ketik langsung pertanyaan Anda secara rinci.
                </p>
              </div>
            </div>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={handleVoiceRecordToggle}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isVoiceRecording
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#141A14] dark:text-[#E4E8E4] hover:bg-[#E2E8E2]'
              }`}
            >
              {isVoiceRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isVoiceRecording ? 'Mendengarkan...' : 'Tanya via Suara'}</span>
            </button>
          </div>

          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] mb-1">
                  Judul Topik Pertanyaan:
                </label>
                <input
                  type="text"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  placeholder="Misal: Hukum Zakat Saham Luar Negeri..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF8] dark:bg-[#141714] border border-[#D8DFD8] dark:border-[#2D332D] text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] mb-1">
                  Kategori Pembahasan:
                </label>
                <select
                  value={questionCategory}
                  onChange={(e) => setQuestionCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF8] dark:bg-[#141714] border border-[#D8DFD8] dark:border-[#2D332D] text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="FIQIH_IBADAH">Fiqih Ibadah & Salat</option>
                  <option value="ZAKAT_HUKUM">Zakat & Keuangan Syariah</option>
                  <option value="MUAMALAH_FINANCE">Muamalah & Bisnis</option>
                  <option value="KELUARGA">Keluarga & Pernikahan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] mb-1">
                Rincian Pertanyaan / Kronologi:
              </label>
              <textarea
                value={questionContent}
                onChange={(e) => setQuestionContent(e.target.value)}
                placeholder="Tuliskan kronologi dan kondisi secara lengkap agar Ustadz dapat memberikan fatwa yang akurat..."
                rows={4}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF8] dark:bg-[#141714] border border-[#D8DFD8] dark:border-[#2D332D] text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                required
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs text-[#5A665B] dark:text-[#A0A8A0] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Sembunyikan Identitas (Kirim sebagai Anonim)</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] text-xs font-semibold text-[#5A665B] dark:text-[#A0A8A0]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !questionTitle.trim() || !questionContent.trim()}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pertanyaan'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'bg-white dark:bg-[#1A1D1A] text-[#5A665B] dark:text-[#A0A8A0] border border-[#D8DFD8] dark:border-[#2D332D] hover:bg-[#EEF3EE]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A8A0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari fatwa atau hukum..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Q&A Accordion Cards List */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          const isLiked = item.hasLiked;

          return (
            <div
              key={item.id}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-white dark:bg-[#1A1D1A] border-emerald-500/50 shadow-md'
                  : 'bg-white dark:bg-[#1A1D1A] border-[#D8DFD8] dark:border-[#2D332D] hover:border-emerald-300'
              }`}
            >
              {/* Question Header Card */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-5 cursor-pointer flex items-start justify-between gap-4"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                      {item.categoryLabel}
                    </span>
                    <span className="text-[#A0A8A0]">
                      Ditanyakan oleh <strong className="text-[#141A14] dark:text-[#E4E8E4]">{item.questionerName}</strong> • {item.date}
                    </span>
                    {item.isResolved && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Terverifikasi Syariah</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm sm:text-base text-[#141A14] dark:text-[#E4E8E4] leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] line-clamp-2 leading-relaxed">
                    "{item.question}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hidden sm:inline">
                    {isExpanded ? 'Tutup Jawaban' : 'Baca Fatwa'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#A0A8A0]" />
                  )}
                </div>
              </div>

              {/* Expanded Answer Panel */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-0 border-t border-[#D8DFD8] dark:border-[#2D332D] space-y-4 animate-in fade-in">
                  
                  {/* Full Question Quote */}
                  <div className="p-3.5 rounded-2xl bg-[#F8FAF8] dark:bg-[#141714] border border-[#D8DFD8] dark:border-[#2D332D] text-xs text-[#141A14] dark:text-[#E4E8E4] italic">
                    <span className="font-bold not-italic text-emerald-700 dark:text-emerald-400">Pertanyaan Lengkap: </span>
                    "{item.question}"
                  </div>

                  {/* Ustadz Response Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-300 dark:border-emerald-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.ustadzAvatar}
                        alt={item.ustadzName}
                        className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#141A14] dark:text-[#E4E8E4]">
                            {item.ustadzName}
                          </span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="text-[11px] text-emerald-800 dark:text-emerald-300">
                          {item.ustadzTitle}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm text-[#141A14] dark:text-[#E4E8E4] leading-relaxed whitespace-pre-line font-sans">
                      {item.answer}
                    </div>

                    {/* Dalil & Referensi Kitab */}
                    {item.dalilRef && item.dalilRef.length > 0 && (
                      <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800 space-y-1">
                        <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>Landasan Dalil & Referensi:</span>
                        </div>
                        <ul className="list-disc list-inside text-[11px] text-[#3E4A3F] dark:text-[#B5C2B5] space-y-0.5">
                          {item.dalilRef.map((dalil, idx) => (
                            <li key={idx}>{dalil}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between text-xs text-[#5A665B] dark:text-[#A0A8A0] pt-1">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleLike(item.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                          isLiked
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] hover:bg-[#EEF3EE]'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Membantu ({item.likesCount})</span>
                      </button>

                      <span className="flex items-center gap-1 text-[11px]">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{item.viewsCount} dilihat</span>
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(`https://pusat.dakwah.islamicity.tv/tanya-jawab/${item.id}`);
                          addNotification({
                            title: 'Tautan Fatwa Disalin',
                            message: 'Tautan konsultasi berhasil disalin ke papan klip.',
                            type: 'GENERAL'
                          });
                        }
                      }}
                      className="flex items-center gap-1 text-xs font-semibold hover:text-emerald-600"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Bagikan</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
