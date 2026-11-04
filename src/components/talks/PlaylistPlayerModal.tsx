import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  CheckCircle, 
  Circle, 
  Clock, 
  BookOpen, 
  Download, 
  Share2, 
  ThumbsUp, 
  Sparkles, 
  Award, 
  Volume2, 
  SkipForward, 
  SkipBack, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { CuratedPlaylist, CuratedPlaylistEpisode } from '../../types';

interface PlaylistPlayerModalProps {
  playlist: CuratedPlaylist;
  isOpen: boolean;
  onClose: () => void;
  onToggleEpisodeComplete: (playlistId: string, talkId: string) => void;
  completedTalkIds: string[];
}

export const PlaylistPlayerModal: React.FC<PlaylistPlayerModalProps> = ({
  playlist,
  isOpen,
  onClose,
  onToggleEpisodeComplete,
  completedTalkIds
}) => {
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  if (!isOpen || !playlist) return null;

  const currentEpisode: CuratedPlaylistEpisode = playlist.episodes[activeEpisodeIndex] || playlist.episodes[0];
  const currentTalk = currentEpisode.talkSession;
  const isCurrentCompleted = completedTalkIds.includes(currentEpisode.talkId);

  const completedCount = playlist.episodes.filter(ep => completedTalkIds.includes(ep.talkId)).length;
  const progressPercent = Math.round((completedCount / playlist.episodes.length) * 100);

  const handleNextEpisode = () => {
    if (activeEpisodeIndex < playlist.episodes.length - 1) {
      setActiveEpisodeIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrevEpisode = () => {
    if (activeEpisodeIndex > 0) {
      setActiveEpisodeIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#121E14] text-white rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#182C1C] border-b border-emerald-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {playlist.category}
                </span>
                <span className="text-xs text-emerald-400 font-semibold truncate hidden sm:inline">
                  {playlist.curatorName}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate font-serif">
                {playlist.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 text-xs flex items-center gap-1.5 transition-colors"
              title="Bagikan Playlist"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copyFeedback ? 'Tersalin!' : 'Bagikan'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two Column (Player Left, Syllabus Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          
          {/* LEFT COLUMN: Main Media Viewer & Episode Detail (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-emerald-500/20 space-y-5 overflow-y-auto">
            
            {/* Video / Stream Frame Container */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-emerald-500/30 shadow-lg group">
              <img
                src={currentTalk.coverImage || playlist.coverImage}
                alt={currentTalk.title}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity"
              />
              
              {/* Play Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600/80 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Modul {activeEpisodeIndex + 1} dari {playlist.episodes.length}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono text-emerald-300">
                    {currentEpisode.durationMinutes} Menit
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-xl shadow-emerald-900/50 transform hover:scale-105 active:scale-95 transition-all"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>
                  </div>

                  {/* Player Controls Bar */}
                  <div className="flex items-center justify-between text-xs text-white/80 pt-2">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handlePrevEpisode}
                        disabled={activeEpisodeIndex === 0}
                        className="p-1 hover:text-white disabled:opacity-30"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={handleNextEpisode}
                        disabled={activeEpisodeIndex === playlist.episodes.length - 1}
                        className="p-1 hover:text-white disabled:opacity-30"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                      <span className="font-mono text-[11px]">HD 1080p • Audio Stereo</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPlaybackSpeed(s => s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1)}
                        className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[11px] font-bold"
                      >
                        {playbackSpeed}x Speed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Episode Meta & Controls */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1 max-w-xl">
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {currentEpisode.customTitle || currentTalk.title}
                  </h3>
                  <p className="text-emerald-300 text-xs sm:text-sm">
                    {currentTalk.tagline}
                  </p>
                </div>

                <button
                  onClick={() => onToggleEpisodeComplete(playlist.id, currentEpisode.talkId)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    isCurrentCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <CheckCircle className={`w-4 h-4 ${isCurrentCompleted ? 'text-emerald-400' : 'text-white'}`} />
                  <span>{isCurrentCompleted ? 'Selesai Dipelajari ✓' : 'Tandai Selesai'}</span>
                </button>
              </div>

              {/* Speaker Card */}
              <div className="p-3.5 rounded-2xl bg-[#182C1C] border border-emerald-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentTalk.speaker.avatar}
                    alt={currentTalk.speaker.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm">{currentTalk.speaker.name}</span>
                      {currentTalk.speaker.isVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <p className="text-xs text-emerald-300/80">{currentTalk.speaker.role}</p>
                    <p className="text-[11px] text-gray-400">{currentTalk.speaker.organization}</p>
                  </div>
                </div>

                {currentTalk.coSpeakers && currentTalk.coSpeakers.length > 0 && (
                  <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-emerald-500/20">
                    <img
                      src={currentTalk.coSpeakers[0].avatar}
                      alt={currentTalk.coSpeakers[0].name}
                      className="w-9 h-9 rounded-full object-cover border border-emerald-400"
                    />
                    <div className="text-[11px]">
                      <span className="font-semibold text-white block truncate max-w-[120px]">
                        {currentTalk.coSpeakers[0].name}
                      </span>
                      <span className="text-gray-400 block text-[10px]">Narasumber Pendamping</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Key Takeaways / Poin Penting Modul */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Poin Kunci & Hikmah Pelajaran:</span>
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-100/90 list-disc list-inside">
                  {currentTalk.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Downloadables */}
              {currentTalk.downloadables && currentTalk.downloadables.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-gray-300 block">Berkas Pendukung Modul:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentTalk.downloadables.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-2 text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate">{doc.title}</p>
                            <p className="text-[10px] text-gray-400">{doc.size}</p>
                          </div>
                        </div>
                        <button className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white shrink-0 transition-colors">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* RIGHT COLUMN: Syllabus / Episodes Navigation (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-6 bg-[#0E170F] space-y-5 overflow-y-auto">
            
            {/* Playlist Progress Summary */}
            <div className="p-4 rounded-2xl bg-[#182C1C] border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-200">Kemajuan Belajar Anda</span>
                <span className="font-bold text-emerald-400">{progressPercent}% Selesai</span>
              </div>
              
              <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-amber-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>{completedCount} dari {playlist.episodes.length} Modul Dituntaskan</span>
                <span>Total Durasi: {Math.round(playlist.totalDurationMinutes / 60)} Jam {playlist.totalDurationMinutes % 60} Menit</span>
              </div>

              {progressPercent === 100 && (
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Alhamdulillah! Anda telah menuntaskan seluruh kurikulum seri ini.</span>
                </div>
              )}
            </div>

            {/* Episodes List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                  Daftar Silabus & Modul ({playlist.episodes.length})
                </h4>
                <span className="text-[11px] text-gray-400">Pilih modul untuk diputar</span>
              </div>

              <div className="space-y-2.5">
                {playlist.episodes.map((episode, idx) => {
                  const isActive = idx === activeEpisodeIndex;
                  const isDone = completedTalkIds.includes(episode.talkId);

                  return (
                    <div
                      key={episode.talkId || idx}
                      onClick={() => {
                        setActiveEpisodeIndex(idx);
                        setIsPlaying(true);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 text-left ${
                        isActive
                          ? 'bg-[#1D3B22] border-emerald-400/80 shadow-md ring-1 ring-emerald-400/50'
                          : 'bg-[#142317] hover:bg-[#1A2D1E] border-emerald-500/15'
                      }`}
                    >
                      {/* Step / Status Indicator */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleEpisodeComplete(playlist.id, episode.talkId);
                        }}
                        className="mt-0.5 shrink-0"
                      >
                        {isDone ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : isActive ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                            {idx + 1}
                          </div>
                        ) : (
                          <Circle className="w-5 h-5 text-gray-500 hover:text-emerald-400" />
                        )}
                      </button>

                      {/* Content Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-bold truncate ${isActive ? 'text-emerald-300' : 'text-white'}`}>
                            {episode.customTitle || episode.talkSession.title}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400 shrink-0 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {episode.durationMinutes}m
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed">
                          {episode.keyFocus}
                        </p>

                        <div className="flex items-center gap-2 pt-1 text-[10px] text-emerald-400/80">
                          <span>Ustadz: {episode.talkSession.speaker.name}</span>
                          {isActive && (
                            <span className="font-bold text-amber-300 ml-auto flex items-center gap-1">
                              <Play className="w-2.5 h-2.5 fill-current" />
                              Sedang Diputar
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Curator & Dalil Note */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Terakreditasi Dewan Syariah</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Materi telah ditinjau dan divalidasi selaras dengan Al-Qur\'an, As-Sunnah, dan Fatwa DSN-MUI.
              </p>
            </div>

          </div>

        </div>

        {/* Footer Navigation */}
        <div className="px-5 py-3 bg-[#182C1C] border-t border-emerald-500/20 flex items-center justify-between text-xs">
          <button
            onClick={handlePrevEpisode}
            disabled={activeEpisodeIndex === 0}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-medium flex items-center gap-1.5 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
            <span>Modul Sebelumnya</span>
          </button>

          <span className="text-gray-400 text-xs hidden sm:inline">
            Modul {activeEpisodeIndex + 1} dari {playlist.episodes.length}
          </span>

          <button
            onClick={handleNextEpisode}
            disabled={activeEpisodeIndex === playlist.episodes.length - 1}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Modul Selanjutnya</span>
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
