import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Send, 
  ThumbsUp, 
  Lock, 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  Filter, 
  CheckCircle2, 
  Award,
  ChevronDown,
  ExternalLink,
  Vote,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ForumThread } from '../../types';
import { E2EESecurity } from '../../utils/cryptoSim';
import { CommunityPollsWidget } from '../forum/CommunityPollsWidget';

type ForumSubView = 'DISCUSSIONS' | 'POLLS';

export const ForumCommunityTab: React.FC = () => {
  const { 
    forumThreads, 
    addForumThread, 
    addForumComment, 
    toggleThreadUpvote, 
    userProfile, 
    t 
  } = useApp();

  const [activeSubView, setActiveSubView] = useState<ForumSubView>('DISCUSSIONS');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeThread, setActiveThread] = useState<ForumThread | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');
  
  // New Thread Modal state
  const [showNewThreadModal, setShowNewThreadModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('Fiqih Muamalah');
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);

  const tagsList = ['ALL', 'Fiqih Muamalah', 'Zakat & Pajak', 'Wakaf Produktif', 'Bisnis Halal', 'Komunitas & Silaturahmi'];

  const filteredThreads = forumThreads.filter(th => {
    const matchTag = selectedTag === 'ALL' || th.tags.includes(selectedTag);
    const matchSearch = th.title.toLowerCase().includes(searchQuery.toLowerCase()) || th.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTag && matchSearch;
  });

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const finalContent = isEncrypted 
      ? E2EESecurity.encrypt(newContent, userProfile.e2eePublicKey)
      : newContent;

    addForumThread({
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      authorBadge: 'Muzakki Terverifikasi',
      title: newTitle,
      content: finalContent,
      tags: [newTag],
      isE2EEProtected: isEncrypted,
      e2eeEncryptedPayload: isEncrypted ? finalContent : undefined,
    });

    setShowNewThreadModal(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleSendComment = (threadId: string) => {
    if (!commentInput.trim()) return;
    addForumComment(threadId, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Sub-view Switch Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#1A1D1A] p-2 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            onClick={() => setActiveSubView('DISCUSSIONS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubView === 'DISCUSSIONS'
                ? 'bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/30'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Forum Diskusi & Fikih</span>
          </button>

          <button
            onClick={() => setActiveSubView('POLLS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubView === 'POLLS'
                ? 'bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/30'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
            }`}
          >
            <Vote className="w-4 h-4" />
            <span>Jajak Pendapat & Polling Syura</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeSubView === 'POLLS' ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-[#2E7D32] dark:text-emerald-400'
            }`}>
              Aktif
            </span>
          </button>
        </div>

        <div className="text-xs text-[#5A665B] dark:text-[#A0A8A0] px-2 hidden md:block">
          🤝 <em>"Wa amruhum syura bainahum (Musyawarah antar mereka)"</em> — QS. Asy-Syura: 38
        </div>
      </div>

      {activeSubView === 'POLLS' ? (
        <CommunityPollsWidget />
      ) : (
        <>
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#1F3D22] via-[#172E19] to-[#121E13] rounded-3xl p-6 sm:p-8 text-[#E4E8E4] shadow-lg border border-[#2D332D] space-y-2">
            <div className="flex items-center gap-2 text-[#4CAF50] text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Forum Silaturahmi & Tanya Jawab Fiqih Muamalah</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Ruang Diskusi Ummah Global
                </h1>
                <p className="text-xs sm:text-sm text-[#E4E8E4]/90 max-w-2xl leading-relaxed mt-1">
                  Pererat silaturahmi, konsultasi fikih dengan para asatidz terakreditasi, dan diskusikan peluang kolaborasi bisnis halal di era digital.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSubView('POLLS')}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs flex items-center gap-1.5 border border-white/20 transition-all shrink-0"
                >
                  <Vote className="w-4 h-4 text-emerald-300" />
                  <span>Lihat Polling Komunitas</span>
                </button>

                <button
                  onClick={() => setShowNewThreadModal(true)}
                  className="px-5 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all shrink-0 self-start sm:self-auto"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Buat Topik Diskusi</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Poll Teaser Spotlight Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-emerald-950/40 p-4 sm:p-5 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#2E7D32]/20 flex items-center justify-center text-[#2E7D32] dark:text-[#4CAF50] shrink-0 border border-[#2E7D32]/30">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#2E7D32] dark:text-[#4CAF50]">
                    Jajak Pendapat Terkini
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 font-bold">
                    342+ Suara
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                  Prioritas Penyaluran Dana Wakaf Produktif 2026
                </h4>
              </div>
            </div>

            <button
              onClick={() => setActiveSubView('POLLS')}
              className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all self-end sm:self-auto shrink-0"
            >
              <span>Isi Polling & Suarakan Pilihan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {tagsList.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedTag === tag
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                      : 'bg-white dark:bg-[#1A1D1A] border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
                  }`}
                >
                  {tag === 'ALL' ? 'Semua Topik' : tag}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A665B] dark:text-[#A0A8A0]" />
              <input
                type="text"
                placeholder="Cari topik / pembahasan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-full text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none"
              />
            </div>
          </div>

          {/* Main Threads List & Active Thread Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Thread Cards List (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              {filteredThreads.map(th => {
                const isSelected = activeThread?.id === th.id;
                return (
                  <div
                    key={th.id}
                    onClick={() => setActiveThread(th)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2E7D32]/10 border-[#2E7D32] shadow-md'
                        : 'bg-white dark:bg-[#1A1D1A] border-[#D8DFD8] dark:border-[#2D332D] hover:border-[#2E7D32]/50 shadow-sm'
                    }`}
                  >
                    {/* Author & Timestamp */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={th.authorAvatar}
                          alt={th.authorName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                              {th.authorName}
                            </span>
                            {th.authorBadge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-[#EEF3EE] dark:bg-[#242924] text-[#2E7D32] dark:text-[#4CAF50]">
                                {th.authorBadge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">{th.timestamp}</span>
                        </div>
                      </div>

                      {/* E2EE Lock Indicator */}
                      {th.isE2EEProtected && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EEF3EE] dark:bg-[#242924] text-[10px] font-mono text-[#5A665B] dark:text-[#A0A8A0] border border-[#D8DFD8] dark:border-[#2D332D]">
                          <Lock className="w-3 h-3 text-[#2E7D32] dark:text-[#4CAF50]" />
                          <span>E2EE Terenkripsi</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="my-3 space-y-1.5">
                      <h3 className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4] leading-snug">
                        {th.title}
                      </h3>
                      <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed line-clamp-3">
                        {th.isE2EEProtected 
                          ? E2EESecurity.decrypt(th.content) 
                          : th.content}
                      </p>
                    </div>

                    {/* Tags & Action Bar */}
                    <div className="pt-3 border-t border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        {th.tags.map(tg => (
                          <span
                            key={tg}
                            className="px-2 py-0.5 rounded-lg bg-[#EEF3EE] dark:bg-[#242924] text-[10px] font-semibold text-[#5A665B] dark:text-[#A0A8A0]"
                          >
                            #{tg}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleThreadUpvote(th.id);
                          }}
                          className="flex items-center gap-1 text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#2E7D32] dark:hover:text-[#4CAF50] font-bold transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{th.upvotes}</span>
                        </button>

                        <div className="flex items-center gap-1 text-[#5A665B] dark:text-[#A0A8A0]">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{th.commentsCount} Balasan</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Thread Comments & Reply Box (1 col) */}
            <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-4 flex flex-col justify-between h-fit sticky top-20">
              {activeThread ? (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-[#D8DFD8] dark:border-[#2D332D]">
                    <span className="text-[10px] font-bold text-[#2E7D32] dark:text-[#4CAF50] uppercase">
                      Diskusi Terpilih
                    </span>
                    <h4 className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4] mt-0.5">
                      {activeThread.title}
                    </h4>
                  </div>

                  {/* Comments Stream */}
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {activeThread.comments && activeThread.comments.length > 0 ? (
                      activeThread.comments.map(c => (
                        <div
                          key={c.id}
                          className={`p-3 rounded-2xl border text-xs space-y-1.5 ${
                            c.isUstazVerified
                              ? 'bg-[#EEF3EE] dark:bg-[#242924] border-[#2E7D32]/50'
                              : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={c.authorAvatar}
                                alt={c.authorName}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="font-bold text-[#141A14] dark:text-[#E4E8E4] text-[11px]">
                                {c.authorName}
                              </span>
                            </div>
                            {c.isUstazVerified && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#2E7D32] text-white">
                                Fatwa Terverifikasi
                              </span>
                            )}
                          </div>
                          <p className="text-[#141A14] dark:text-[#E4E8E4] text-[11px] leading-relaxed">
                            {c.content}
                          </p>
                          <span className="text-[9px] text-[#5A665B] dark:text-[#A0A8A0] block text-right">
                            {c.timestamp}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-6 text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                        Belum ada jawaban. Jadilah yang pertama memberikan masukan syar'i!
                      </p>
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <div className="pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] space-y-2">
                    <textarea
                      rows={2}
                      placeholder="Tulis tanggapan atau dalil rujukan..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="w-full p-2.5 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none"
                    />
                    <button
                      onClick={() => handleSendComment(activeThread.id)}
                      disabled={!commentInput.trim()}
                      className="w-full py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256629] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Jawaban Silaturahmi</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-2">
                  <MessageSquare className="w-8 h-8 text-[#5A665B] dark:text-[#A0A8A0] mx-auto opacity-50" />
                  <p className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                    Pilih topik di sebelah kiri untuk melihat rincian dan fatwa asatidz.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* New Thread Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4] my-8 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#D8DFD8] dark:border-[#2D332D]">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <h3 className="font-bold text-base text-[#141A14] dark:text-[#E4E8E4]">
                  Buat Topik Diskusi Silaturahmi
                </h3>
              </div>
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="p-1 rounded-full hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Judul Pertanyaan / Topik:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hukum Pembagian Bagi Hasil Usaha Kopi Syariah"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Kategori:
                </label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4]"
                >
                  <option value="Fiqih Muamalah">Fiqih Muamalah</option>
                  <option value="Zakat & Pajak">Zakat & Pajak</option>
                  <option value="Wakaf Produktif">Wakaf Produktif</option>
                  <option value="Bisnis Halal">Bisnis Halal</option>
                  <option value="Komunitas & Silaturahmi">Komunitas & Silaturahmi</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Penjelasan & Pertanyaan Detail:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Uraikan kondisi muamalah atau persoalan yang ingin dikonsultasikan..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4]"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-[#141A14] dark:text-[#E4E8E4] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isEncrypted}
                  onChange={(e) => setIsEncrypted(e.target.checked)}
                  className="rounded text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
                />
                <span>Enkripsi Pesan End-to-End (Hanya Terbuka untuk Konsultan/Ustaz)</span>
              </label>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs shadow-md transition-colors"
              >
                Terbitkan Diskusi
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
