import React, { useState } from 'react';
import { 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Heart, 
  Share2, 
  Bookmark, 
  Clock, 
  Search, 
  Filter, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  X,
  Type,
  FileText
} from 'lucide-react';
import { DakwahArticle } from '../../types';
import { useApp } from '../../context/AppContext';

interface DakwahMateriReaderProps {
  articles: DakwahArticle[];
}

export const DakwahMateriReader: React.FC<DakwahMateriReaderProps> = ({ articles }) => {
  const { addNotification } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<DakwahArticle | null>(null);
  
  // Reader controls
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>({ 'art-1': true });

  const categories = [
    { id: 'ALL', label: 'Semua Artikel' },
    { id: 'FIQIH', label: 'Fikih & Zakat' },
    { id: 'AKIDAH', label: 'Akidah & Ibadah' },
    { id: 'MUAMALAH', label: 'Bisnis Syariah' },
    { id: 'FAMILY', label: 'Keluarga' }
  ];

  const filteredArticles = articles.filter(art => {
    if (selectedCategory !== 'ALL' && art.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchExcerpt = art.excerpt.toLowerCase().includes(q);
      const matchAuthor = art.author.toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt && !matchAuthor) return false;
    }
    return true;
  });

  const handleToggleLike = (articleId: string) => {
    setLikedArticles(prev => ({
      ...prev,
      [articleId]: !prev[articleId]
    }));
  };

  const handleGenerateAiSummary = (article: DakwahArticle) => {
    setIsSummarizing(true);
    setTimeout(() => {
      setIsSummarizing(false);
      setAiSummary(`Ringkasan Intisari Dakwah (AI Scholar Assistant):
1. Landasan Syariah: Sesuai Fatwa DSN-MUI dan kaidah Fiqih, setiap muslim wajib menunaikan hak harta yang telah mencapai nisab 85 gram emas.
2. Parameter Transparansi: Pencatatan melalui sistem digital IslamicityLink memastikan kepatuhan syariah (tamlik tepat sasaran) dan akuntabilitas mutlak.
3. Dampak Keberkahan: Pembersihan harta mengundang keberkahan rezeki, ketenteraman jiwa, dan perlindungan sosial bagi kaum dhuafa.`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Materi Dakwah, Artikel, & Transkrip Khutbah</span>
          </h3>
          <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] mt-0.5">
            Kumpulan artikel pilihan oleh Dewan Pakar Pusat Dakwah Islamicity & Asatidz terpercaya.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A8A0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel, fatwa, atau materi..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
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

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredArticles.map((art) => {
          const isLiked = likedArticles[art.id];

          return (
            <div
              key={art.id}
              onClick={() => {
                setSelectedArticle(art);
                setAiSummary(null);
                setIsAudioPlaying(false);
              }}
              className="bg-white dark:bg-[#1A1D1A] rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-emerald-300 border border-white/10">
                    {art.categoryLabel}
                  </div>
                  {art.audioDuration && (
                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-white flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-emerald-400" />
                      <span>{art.audioDuration}</span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-[#A0A8A0]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{art.readTimeMinutes} menit baca</span>
                    </span>
                    <span>•</span>
                    <span>{art.date}</span>
                  </div>

                  <h4 className="font-bold text-sm text-[#141A14] dark:text-[#E4E8E4] leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {art.title}
                  </h4>

                  <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer: Author & Social */}
              <div className="p-5 pt-0 border-t border-[#D8DFD8]/60 dark:border-[#2D332D]/60 mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={art.authorAvatar}
                    alt={art.author}
                    className="w-6 h-6 rounded-full object-cover border border-emerald-500 shrink-0"
                  />
                  <span className="text-xs font-semibold text-[#141A14] dark:text-[#E4E8E4] truncate">
                    {art.author}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLike(art.id);
                    }}
                    className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                      isLiked ? 'text-red-500 font-bold' : ''
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{isLiked ? art.likesCount + 1 : art.likesCount}</span>
                  </button>

                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between gap-4 bg-[#F8FAF8] dark:bg-[#141714]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold">
                    {selectedArticle.categoryLabel}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#141A14] dark:text-[#E4E8E4] truncate">
                    {selectedArticle.title}
                  </h3>
                </div>
              </div>

              {/* Reader Options: Font Size & Close */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setFontSize(prev => prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal');
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1"
                  title="Ubah Ukuran Huruf"
                >
                  <Type className="w-3.5 h-3.5" />
                  <span className="uppercase text-[10px]">{fontSize}</span>
                </button>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 rounded-xl bg-white dark:bg-[#242924] hover:bg-[#EEF3EE] dark:hover:bg-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] border border-[#D8DFD8] dark:border-[#2D332D] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body Scroll Area */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              
              {/* Author & Audio Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#F4F7F4] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D]">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedArticle.authorAvatar}
                    alt={selectedArticle.author}
                    className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <div className="font-bold text-xs text-[#141A14] dark:text-[#E4E8E4]">
                      {selectedArticle.author}
                    </div>
                    <div className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                      {selectedArticle.authorRole} • {selectedArticle.date}
                    </div>
                  </div>
                </div>

                {/* Audio Narrator Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      isAudioPlaying
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white dark:bg-[#1A1D1A] text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                    }`}
                  >
                    {isAudioPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isAudioPlaying ? 'Jeda Audio Narasi' : 'Dengarkan Audio'}</span>
                  </button>

                  <button
                    onClick={() => handleGenerateAiSummary(selectedArticle)}
                    disabled={isSummarizing}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSummarizing ? 'Menganalisis...' : 'Ringkas Intisari AI'}</span>
                  </button>
                </div>
              </div>

              {/* AI Summary Card if generated */}
              {aiSummary && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Ringkasan Cerdas Intisari Dakwah (Gemini AI)</span>
                  </div>
                  <p className="text-[#2C382D] dark:text-[#C5D1C5] whitespace-pre-line leading-relaxed">
                    {aiSummary}
                  </p>
                </div>
              )}

              {/* Key Quranic Verses if present */}
              {selectedArticle.keyVerses?.map((verse, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 to-[#143B19] text-white border border-emerald-500/30 space-y-2 text-center shadow-lg">
                  <div className="text-xl sm:text-2xl font-serif leading-loose text-emerald-200">
                    {verse.arabic}
                  </div>
                  <div className="text-xs italic text-emerald-300/90 font-serif">
                    "{verse.translation}"
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                    — {verse.surah}
                  </div>
                </div>
              ))}

              {/* Article Main Text Body */}
              <div className={`prose dark:prose-invert max-w-none text-[#141A14] dark:text-[#E4E8E4] leading-relaxed whitespace-pre-line ${
                fontSize === 'large' ? 'text-base' : fontSize === 'xlarge' ? 'text-lg' : 'text-sm'
              }`}>
                {selectedArticle.content}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#D8DFD8] dark:border-[#2D332D]">
                <span className="text-xs text-[#A0A8A0]">Kata Kunci:</span>
                {selectedArticle.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#D8DFD8] dark:border-[#2D332D] bg-[#F8FAF8] dark:bg-[#141714] flex items-center justify-between">
              <button
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(`https://pusat.dakwah.islamicity.tv/artikel/${selectedArticle.id}`);
                    addNotification({
                      title: 'Tautan Artikel Disalin',
                      message: 'Bagikan materi dakwah ini kepada kerabat dan grup pengajian.',
                      type: 'GENERAL'
                    });
                  }
                }}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1.5 hover:bg-[#EEF3EE]"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bagikan Artikel</span>
              </button>

              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Tutup Pembaca
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
