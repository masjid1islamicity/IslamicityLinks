import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Radio, 
  Users, 
  MessageSquare, 
  BarChart2, 
  Download, 
  Award, 
  ThumbsUp, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  QrCode, 
  FileText,
  Clock,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { TalkSession, TalkQuestion, TalkPoll } from '../../types';
import { useApp } from '../../context/AppContext';

interface LiveWebinarStreamCardProps {
  session: TalkSession;
  onInfaqClick?: () => void;
}

export const LiveWebinarStreamCard: React.FC<LiveWebinarStreamCardProps> = ({
  session,
  onInfaqClick
}) => {
  const { userProfile, addNotification } = useApp();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'poll' | 'downloads' | 'certificate'>('chat');
  
  // Q&A State
  const [questions, setQuestions] = useState<TalkQuestion[]>(session.questions || []);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isAnonymousQuestion, setIsAnonymousQuestion] = useState(false);
  
  // Poll State
  const [poll, setPoll] = useState<TalkPoll | undefined>(session.polls?.[0]);
  
  // Certificate State
  const [attendeeName, setAttendeeName] = useState(userProfile.name || 'Hamba Allah');
  const [isCertificateClaimed, setIsCertificateClaimed] = useState(false);
  const [certificateHash, setCertificateHash] = useState('');

  // Handle Question Submission
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: TalkQuestion = {
      id: `q-${Date.now()}`,
      userName: isAnonymousQuestion ? 'Hamba Allah (Anonim)' : (userProfile.name || 'Jamaah'),
      userAvatar: isAnonymousQuestion ? undefined : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      isAnonymous: isAnonymousQuestion,
      question: newQuestionText.trim(),
      upvotes: 1,
      hasUpvoted: true,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      answered: false
    };

    setQuestions(prev => [newQ, ...prev]);
    setNewQuestionText('');

    addNotification({
      title: 'Pertanyaan Terkirim ke Ustadz',
      message: 'Pertanyaan Anda telah masuk antrean moderasi siaran langsung IslamicityTalks.',
      type: 'FORUM_REPLY'
    });
  };

  // Handle Upvote
  const handleToggleUpvote = (questionId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const hasUpvoted = !q.hasUpvoted;
        return {
          ...q,
          hasUpvoted,
          upvotes: hasUpvoted ? q.upvotes + 1 : q.upvotes - 1
        };
      }
      return q;
    }));
  };

  // Handle Poll Vote
  const handleVotePoll = (optionId: string) => {
    if (!poll || poll.userVotedOptionId) return;

    const updatedOptions = poll.options.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    setPoll({
      ...poll,
      options: updatedOptions,
      totalVotes: poll.totalVotes + 1,
      userVotedOptionId: optionId
    });

    addNotification({
      title: 'Suara Polling Tercatat',
      message: 'Jazakallahu khairan atas partisipasi Anda dalam polling interaktif kajian.',
      type: 'FORUM_REPLY'
    });
  };

  // Handle Certificate Claim
  const handleClaimCertificate = () => {
    if (!attendeeName.trim()) return;
    const generatedHash = `CERT-TALKS-${Date.now().toString(16).toUpperCase()}-BAZNAS`;
    setCertificateHash(generatedHash);
    setIsCertificateClaimed(true);

    addNotification({
      title: 'E-Sertifikat Kajian Terbit',
      message: `Selamat, E-Sertifikat kehadiran untuk "${session.title}" berhasil diterbitkan.`,
      type: 'VERIFICATION'
    });
  };

  return (
    <div id="live-stream-section" className="bg-white dark:bg-[#1A1D1A] rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-xl overflow-hidden transition-colors">
      
      {/* Top Header Information */}
      <div className="p-4 sm:p-6 border-b border-[#D8DFD8] dark:border-[#2D332D] flex flex-wrap items-center justify-between gap-4 bg-[#F8FAF8] dark:bg-[#141714]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 font-extrabold text-[11px] uppercase tracking-wider border border-red-200 dark:border-red-800 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>SIARAN LANGSUNG</span>
              </span>
              <span className="text-xs font-semibold text-[#5A665B] dark:text-[#A0A8A0] hidden sm:inline">
                {session.categoryLabel}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#141A14] dark:text-[#E4E8E4] mt-0.5">
              {session.title}
            </h2>
          </div>
        </div>

        {/* Live Viewer Count & Share */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] shadow-sm">
            <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{(session.liveViewerCount || 1842).toLocaleString('id-ID')} Jamaah Online</span>
          </div>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(`https://pusat.dakwah.islamicity.tv/talks/${session.id}`);
                addNotification({
                  title: 'Tautan Siaran Disalin',
                  message: 'Ajak keluarga dan kerabat menyaksikan siaran langsung IslamicityTalks.',
                  type: 'GENERAL'
                });
              }
            }}
            className="p-2 rounded-full bg-white dark:bg-[#242924] hover:bg-[#EEF3EE] dark:hover:bg-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] border border-[#D8DFD8] dark:border-[#2D332D] transition-colors"
            title="Bagikan Tautan Siaran"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Video Player + Interactive Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left Col (8 Cols): Video Player Simulation & Speaker Info */}
        <div className="lg:col-span-8 p-4 sm:p-6 space-y-5 border-b lg:border-b-0 lg:border-r border-[#D8DFD8] dark:border-[#2D332D]">
          
          {/* Simulated Video Player Container */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl group border border-black/40">
            {/* Background Stream Visual */}
            <img 
              src={session.coverImage} 
              alt={session.title}
              className="w-full h-full object-cover opacity-85"
            />

            {/* Video Watermark & Branding */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-white text-xs font-bold font-sans">
                Islamicity.tv <span className="text-emerald-400">HD LIVE</span>
              </span>
            </div>

            <div className="absolute top-4 right-4 z-10 bg-red-600/90 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider animate-pulse">
              LIVE BROADCAST
            </div>

            {/* In-stream Speaker Overlay Lower Third */}
            <div className="absolute bottom-16 left-4 right-4 z-10 pointer-events-none">
              <div className="inline-flex items-center gap-3 p-2.5 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 text-white max-w-md shadow-2xl">
                <img 
                  src={session.speaker.avatar} 
                  alt={session.speaker.name}
                  className="w-10 h-10 rounded-xl object-cover border border-emerald-400"
                />
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs truncate text-emerald-300">
                      {session.speaker.name}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <div className="text-[10px] text-white/80 truncate">
                    {session.speaker.role} • {session.speaker.organization}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 flex items-center justify-between text-white z-20">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="text-[11px] font-mono text-emerald-400 font-bold hidden sm:inline">
                  ● 1080p 60fps (Server SG-L2)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onInfaqClick}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-[11px] flex items-center gap-1 shadow-md transition-colors"
                >
                  <Heart className="w-3 h-3 text-red-700" />
                  <span>Infaq Kajian</span>
                </button>

                <button 
                  onClick={() => {
                    addNotification({
                      title: 'Mode Layar Penuh',
                      message: 'Gunakan tombol F11 pada keyboard untuk tampilan penuh interaktif.',
                      type: 'GENERAL'
                    });
                  }}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Key Takeaways & Speaker Bio */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Intisari & Pokok Bahasan Kajian
                </h3>
                <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                  Garis besar materi yang dibahas dalam siaran langsung ini:
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Clock className="w-3 h-3" />
                <span>{session.time}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {session.keyTakeaways.map((takeaway, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-2xl bg-[#F4F7F4] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] flex items-start gap-2.5 text-xs text-[#141A14] dark:text-[#E4E8E4]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{takeaway}</span>
                </div>
              ))}
            </div>

            {/* Speakers List */}
            <div className="pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A665B] dark:text-[#A0A8A0] mb-3">
                Dewan Asatidz & Pemateri
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Main Speaker */}
                <div className="p-3 rounded-2xl bg-white dark:bg-[#1F241F] border border-[#D8DFD8] dark:border-[#2D332D] flex items-center gap-3">
                  <img 
                    src={session.speaker.avatar} 
                    alt={session.speaker.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#141A14] dark:text-[#E4E8E4] truncate">
                        {session.speaker.name}
                      </span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    </div>
                    <div className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] truncate">
                      {session.speaker.role}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                      {session.speaker.specialization}
                    </div>
                  </div>
                </div>

                {/* Co-Speakers if any */}
                {session.coSpeakers?.map((coSpeaker, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-white dark:bg-[#1F241F] border border-[#D8DFD8] dark:border-[#2D332D] flex items-center gap-3">
                    <img 
                      src={coSpeaker.avatar} 
                      alt={coSpeaker.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#141A14] dark:text-[#E4E8E4] truncate">
                          {coSpeaker.name}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      </div>
                      <div className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] truncate">
                        {coSpeaker.role}
                      </div>
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold truncate">
                        {coSpeaker.specialization}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Col (4 Cols): Interactive Tabs (Q&A, Polling, Unduhan, Sertifikat) */}
        <div className="lg:col-span-4 p-4 sm:p-6 flex flex-col justify-between bg-[#FAFCFA] dark:bg-[#171A17] space-y-4">
          
          {/* Sub-Tab Navigation Header */}
          <div>
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#EEF3EE] dark:bg-[#242924] rounded-2xl">
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-2 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'chat'
                    ? 'bg-white dark:bg-[#1A1D1A] text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Tanya Q&A</span>
              </button>

              <button
                onClick={() => setActiveTab('poll')}
                className={`py-2 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'poll'
                    ? 'bg-white dark:bg-[#1A1D1A] text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14]'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Polling</span>
              </button>

              <button
                onClick={() => setActiveTab('downloads')}
                className={`py-2 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'downloads'
                    ? 'bg-white dark:bg-[#1A1D1A] text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14]'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Materi</span>
              </button>

              <button
                onClick={() => setActiveTab('certificate')}
                className={`py-2 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'certificate'
                    ? 'bg-white dark:bg-[#1A1D1A] text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14]'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Sertifikat</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Live Interactive Q&A */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                <span>Daftar Pertanyaan Jamaah ({questions.length})</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Moderasi Langsung Aktif</span>
              </div>

              {/* Questions Stream */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className={`p-3 rounded-2xl border transition-colors ${
                      q.answered
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                        : 'bg-white dark:bg-[#1F241F] border-[#D8DFD8] dark:border-[#2D332D]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {q.userAvatar ? (
                          <img src={q.userAvatar} alt={q.userName} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#D8DFD8] dark:bg-[#2D332D] flex items-center justify-center text-[10px] font-bold">
                            HA
                          </div>
                        )}
                        <span className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                          {q.userName}
                        </span>
                        <span className="text-[10px] text-[#A0A8A0]">
                          {q.timestamp}
                        </span>
                      </div>

                      {/* Upvote Button */}
                      <button
                        onClick={() => handleToggleUpvote(q.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          q.hasUpvoted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#E2E8E2]'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{q.upvotes}</span>
                      </button>
                    </div>

                    <p className="text-xs text-[#141A14] dark:text-[#E4E8E4] mt-2 leading-relaxed">
                      {q.question}
                    </p>

                    {/* Answer if available */}
                    {q.answered && q.answerText && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-white dark:bg-[#141714] border border-emerald-300 dark:border-emerald-700/50 text-xs">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Dijawab oleh {q.answeredBy || 'Ustadz'}:</span>
                        </div>
                        <p className="text-[#3E4A3F] dark:text-[#C5CCC5] text-[11px] leading-relaxed">
                          {q.answerText}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Question Submission Input Form */}
              <form onSubmit={handleAddQuestion} className="space-y-2 pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D]">
                <div className="relative">
                  <input
                    type="text"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Tulis pertanyaan seputar materi untuk Ustadz..."
                    className="w-full pl-3 pr-10 py-2.5 rounded-2xl bg-white dark:bg-[#1F241F] border border-[#D8DFD8] dark:border-[#2D332D] text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!newQuestionText.trim()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <label className="flex items-center gap-1.5 text-[#5A665B] dark:text-[#A0A8A0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymousQuestion}
                      onChange={(e) => setIsAnonymousQuestion(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Kirim sebagai Hamba Allah (Anonim)</span>
                  </label>
                  <span className="text-[10px] text-[#A0A8A0]">Maksimal 300 Karakter</span>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Live Polling */}
          {activeTab === 'poll' && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              {poll ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <BarChart2 className="w-4 h-4 text-emerald-600" />
                      <span>Polling Langsung Dari Pemateri</span>
                    </div>
                    <p className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] leading-snug">
                      {poll.question}
                    </p>
                    <div className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                      Total {poll.totalVotes} suara jamaah terkumpul
                    </div>
                  </div>

                  {/* Poll Options */}
                  <div className="space-y-2.5">
                    {poll.options.map((opt) => {
                      const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                      const isUserChoice = poll.userVotedOptionId === opt.id;

                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleVotePoll(opt.id)}
                          className={`relative overflow-hidden p-3 rounded-2xl border cursor-pointer transition-all ${
                            isUserChoice
                              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                              : 'border-[#D8DFD8] dark:border-[#2D332D] bg-white dark:bg-[#1F241F] hover:border-emerald-400'
                          }`}
                        >
                          {/* Percentage Fill Bar */}
                          {poll.userVotedOptionId && (
                            <div 
                              className="absolute inset-y-0 left-0 bg-emerald-500/15 dark:bg-emerald-500/20 transition-all duration-700"
                              style={{ width: `${percentage}%` }}
                            />
                          )}

                          <div className="relative z-10 flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#141A14] dark:text-[#E4E8E4] pr-2">
                              {opt.text}
                            </span>
                            {poll.userVotedOptionId && (
                              <span className="font-black text-emerald-700 dark:text-emerald-400 shrink-0 font-mono">
                                {percentage}%
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {poll.userVotedOptionId && (
                    <div className="text-center p-2.5 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/50 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                      ✓ Suara Anda telah tercatat pada statistik webinar.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-xs text-[#A0A8A0]">
                  Belum ada polling aktif saat ini.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Downloads & Slides */}
          {activeTab === 'downloads' && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Berkas & Materi Kajian
                </h4>
                <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                  Unduh materi resmi yang disiapkan oleh pemateri:
                </p>
              </div>

              <div className="space-y-2.5">
                {session.downloadables.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-2xl bg-white dark:bg-[#1F241F] border border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] truncate">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-[#A0A8A0]">
                          {item.type} • {item.size} • {item.downloadsCount}x diunduh
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addNotification({
                          title: 'Unduhan Dimulai',
                          message: `Mengunduh berkas ${item.title} (${item.size}).`,
                          type: 'GENERAL'
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-emerald-600 hover:text-white text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Download className="w-3 h-3" />
                      <span>Unduh</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
                💡 Materi dilisensikan sebagai <strong>Wakaf Ilmu Digital</strong>, bebas disebarluaskan untuk kemaslahatan dakwah Islam.
              </div>
            </div>
          )}

          {/* TAB 4: Digital E-Certificate */}
          {activeTab === 'certificate' && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  E-Sertifikat Kehadiran Ber-QR
                </h4>
                <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                  Diterbitkan resmi oleh Pusat Dakwah Islamicity & Dewan Syariah:
                </p>
              </div>

              {!isCertificateClaimed ? (
                <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-[#1F241F] border border-[#D8DFD8] dark:border-[#2D332D]">
                  <div>
                    <label className="block text-[11px] font-bold text-[#141A14] dark:text-[#E4E8E4] mb-1">
                      Nama Lengkap Jamaah (Untuk Sertifikat):
                    </label>
                    <input
                      type="text"
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      placeholder="Masukkan nama lengkap beserta gelar..."
                      className="w-full px-3 py-2 rounded-xl bg-[#F4F7F4] dark:bg-[#141714] border border-[#D8DFD8] dark:border-[#2D332D] text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    onClick={handleClaimCertificate}
                    disabled={!attendeeName.trim()}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <Award className="w-4 h-4" />
                    <span>Terbitkan E-Sertifikat Sekarang</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-[#143B19] text-white border border-emerald-500/40 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-300">
                      SERTIFIKAT RESMI
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300">
                      {certificateHash}
                    </span>
                  </div>

                  <div className="text-center py-2 border-y border-white/15">
                    <div className="text-[10px] text-emerald-200">Diberikan kepada:</div>
                    <div className="text-sm font-black text-white font-serif mt-0.5">
                      {attendeeName}
                    </div>
                    <div className="text-[10px] text-emerald-200 mt-1">
                      Sebagai Peserta Webinar IslamicityTalks: "{session.title}"
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-300">
                      <QrCode className="w-4 h-4" />
                      <span>Validasi Hash L2 Aktif</span>
                    </div>

                    <button
                      onClick={() => {
                        addNotification({
                          title: 'Sertifikat PDF Diunduh',
                          message: `File sertifikat ${certificateHash}.pdf berhasil disimpan.`,
                          type: 'VERIFICATION'
                        });
                      }}
                      className="px-3 py-1 rounded-lg bg-white text-emerald-900 font-bold text-[11px] hover:bg-emerald-100 transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Unduh PDF</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="text-[10px] text-center text-[#A0A8A0]">
                Tercatat lebih dari {session.certificatesIssuedCount || 1250} sertifikat telah diverifikasi.
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
