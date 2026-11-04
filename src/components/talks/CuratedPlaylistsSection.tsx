import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Play, 
  Clock, 
  BookOpen, 
  Sliders, 
  Bookmark, 
  BookmarkCheck, 
  ThumbsUp, 
  Share2, 
  Search, 
  Filter, 
  CheckCircle, 
  HelpCircle, 
  Wand2, 
  ShieldCheck, 
  Award,
  Layers,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Flame,
  Check
} from 'lucide-react';
import { 
  CuratedPlaylist, 
  UserTalkPreferenceProfile, 
  TalkSession 
} from '../../types';
import { 
  INITIAL_CURATED_PLAYLISTS,
  INITIAL_TALK_SESSIONS 
} from '../../data/talksData';
import { 
  loadUserTalkPreferences, 
  saveUserTalkPreferences, 
  rankPlaylistsWithAlgorithm,
  formatGoalLabel 
} from '../../utils/talkRecommendations';
import { PlaylistPlayerModal } from './PlaylistPlayerModal';
import { PreferencesCustomizerModal } from './PreferencesCustomizerModal';
import { AlgorithmExplanationModal } from './AlgorithmExplanationModal';
import { SmartPlaylistGeneratorModal } from './SmartPlaylistGeneratorModal';

interface CuratedPlaylistsSectionProps {
  onScrollToLive?: () => void;
}

export const CuratedPlaylistsSection: React.FC<CuratedPlaylistsSectionProps> = ({
  onScrollToLive
}) => {
  // State
  const [userProfile, setUserProfile] = useState<UserTalkPreferenceProfile>(() => loadUserTalkPreferences());
  const [allPlaylists, setAllPlaylists] = useState<CuratedPlaylist[]>(INITIAL_CURATED_PLAYLISTS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  
  // Modals state
  const [activePlayingPlaylist, setActivePlayingPlaylist] = useState<CuratedPlaylist | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);
  
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState<boolean>(false);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState<boolean>(false);
  
  const [selectedPlaylistForExplanation, setSelectedPlaylistForExplanation] = useState<CuratedPlaylist | null>(null);
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Rank playlists using dynamic multi-factor algorithm whenever user preferences or playlists change
  const rankedPlaylists = useMemo(() => {
    return rankPlaylistsWithAlgorithm(allPlaylists, userProfile);
  }, [allPlaylists, userProfile]);

  // Filter based on category & search query
  const filteredPlaylists = useMemo(() => {
    return rankedPlaylists.filter(pl => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = pl.title.toLowerCase().includes(q);
        const matchDesc = pl.description.toLowerCase().includes(q);
        const matchScholars = pl.scholars.some(s => s.name.toLowerCase().includes(q));
        const matchTopics = pl.primaryTopics.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchScholars && !matchTopics) {
          return false;
        }
      }

      // Category filter
      if (selectedCategoryFilter === 'SAVED') {
        return userProfile.savedPlaylistIds.includes(pl.id);
      }
      if (selectedCategoryFilter === 'RECOMMENDED') {
        return (pl.matchScore || 0) >= 90;
      }
      if (selectedCategoryFilter !== 'ALL') {
        return pl.categoryCode === selectedCategoryFilter;
      }

      return true;
    });
  }, [rankedPlaylists, searchQuery, selectedCategoryFilter, userProfile.savedPlaylistIds]);

  // Top #1 Algorithm Pick
  const topSpotlightPlaylist = rankedPlaylists[0] || INITIAL_CURATED_PLAYLISTS[0];

  // Save Preferences Handler
  const handleSavePreferences = (updatedProfile: UserTalkPreferenceProfile) => {
    setUserProfile(updatedProfile);
    saveUserTalkPreferences(updatedProfile);
    showToast('Preferensi minat berhasil diperbarui! Rekomendasi telah dikalkulasi ulang.');
  };

  // Bookmark / Save Playlist Toggle
  const handleToggleSavePlaylist = (playlistId: string) => {
    setUserProfile(prev => {
      const exists = prev.savedPlaylistIds.includes(playlistId);
      const updatedSaved = exists 
        ? prev.savedPlaylistIds.filter(id => id !== playlistId)
        : [...prev.savedPlaylistIds, playlistId];
      
      const newProfile = { ...prev, savedPlaylistIds: updatedSaved };
      saveUserTalkPreferences(newProfile);
      showToast(exists ? 'Playlist dihapus dari simpanan.' : 'Playlist berhasil disimpan ke daftar putar Anda!');
      return newProfile;
    });
  };

  // Like Playlist Toggle
  const handleToggleLike = (playlistId: string) => {
    setAllPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        const hasLiked = !pl.hasLiked;
        return {
          ...pl,
          hasLiked,
          likesCount: pl.likesCount + (hasLiked ? 1 : -1)
        };
      }
      return pl;
    }));
  };

  // Toggle Episode Completion
  const handleToggleEpisodeComplete = (playlistId: string, talkId: string) => {
    setUserProfile(prev => {
      const isDone = prev.completedTalkIds.includes(talkId);
      const updatedCompleted = isDone
        ? prev.completedTalkIds.filter(id => id !== talkId)
        : [...prev.completedTalkIds, talkId];
      
      const newProfile = {
        ...prev,
        completedTalkIds: updatedCompleted,
        watchedTalkIds: Array.from(new Set([...prev.watchedTalkIds, talkId]))
      };
      saveUserTalkPreferences(newProfile);
      return newProfile;
    });
  };

  // Start Playing Playlist
  const handlePlayPlaylist = (playlist: CuratedPlaylist) => {
    setActivePlayingPlaylist(playlist);
    setIsPlayerOpen(true);
  };

  // Add Smart Generated Playlist
  const handleAddCustomPlaylist = (newPl: CuratedPlaylist) => {
    setAllPlaylists(prev => [newPl, ...prev]);
    setUserProfile(prev => {
      const newProfile = {
        ...prev,
        savedPlaylistIds: [newPl.id, ...prev.savedPlaylistIds]
      };
      saveUserTalkPreferences(newProfile);
      return newProfile;
    });
    showToast('Playlist cerdas berhasil disusun dan ditambahkan!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900/95 text-white border border-emerald-400/50 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP SPOTLIGHT: #1 AI Recommended Playlist */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A3820] via-[#122A17] to-[#0A1A0E] text-white border-2 border-emerald-500/40 shadow-2xl p-6 sm:p-8">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left / Info Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Recommendation Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs shadow-lg shadow-amber-500/25">
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                <span>Rekomendasi Utama #{topSpotlightPlaylist.matchScore}% Match</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                {topSpotlightPlaylist.badgeLabel}
              </span>

              <span className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-xs">
                Tingkat: {topSpotlightPlaylist.difficulty}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight font-serif">
                {topSpotlightPlaylist.title}
              </h2>
              <p className="text-emerald-200/90 text-xs sm:text-sm leading-relaxed max-w-2xl">
                {topSpotlightPlaylist.description}
              </p>
            </div>

            {/* Match Explanations (Why recommended) */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between text-amber-300 font-bold text-[11px]">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Mengapa playlist ini sangat cocok untuk Anda:
                </span>
                <button
                  onClick={() => {
                    setSelectedPlaylistForExplanation(topSpotlightPlaylist);
                    setIsExplanationModalOpen(true);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 underline font-normal flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" />
                  Lihat Skor Transparansi
                </button>
              </div>
              
              <ul className="space-y-1 text-emerald-100/90 text-[11px]">
                {topSpotlightPlaylist.matchReasons?.slice(0, 2).map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Scholars List */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2 overflow-hidden">
                {topSpotlightPlaylist.scholars.map((sc, idx) => (
                  <img
                    key={idx}
                    src={sc.avatar}
                    alt={sc.name}
                    title={sc.name}
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-emerald-500 object-cover"
                  />
                ))}
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">
                  {topSpotlightPlaylist.scholars.map(s => s.name).join(' & ')}
                </span>
                <span className="text-[11px] text-emerald-300/80">
                  {topSpotlightPlaylist.totalEpisodes} Modul Pembelajaran • {topSpotlightPlaylist.totalDurationMinutes} Menit
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="btn-play-top-spotlight-playlist"
                onClick={() => handlePlayPlaylist(topSpotlightPlaylist)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-900/50 flex items-center gap-2.5 transform hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Mulai Belajar Kurikulum Seri Ini</span>
              </button>

              <button
                onClick={() => handleToggleSavePlaylist(topSpotlightPlaylist.id)}
                className={`p-3 rounded-2xl border transition-colors flex items-center gap-2 text-xs font-semibold ${
                  userProfile.savedPlaylistIds.includes(topSpotlightPlaylist.id)
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                title="Simpan Playlist"
              >
                {userProfile.savedPlaylistIds.includes(topSpotlightPlaylist.id) ? (
                  <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {userProfile.savedPlaylistIds.includes(topSpotlightPlaylist.id) ? 'Tersimpan' : 'Simpan'}
                </span>
              </button>
            </div>

          </div>

          {/* Right / Visual Preview Column (5 cols) */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-2xl overflow-hidden aspect-video lg:aspect-[4/3] border-2 border-emerald-500/40 shadow-2xl bg-black">
              <img
                src={topSpotlightPlaylist.coverImage}
                alt={topSpotlightPlaylist.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono text-emerald-300 border border-emerald-500/30">
                    HD Video & E-Sertifikat
                  </span>
                  
                  <div className="px-3 py-1 rounded-full bg-emerald-500/30 backdrop-blur-md border border-emerald-400 text-emerald-300 font-bold text-xs">
                    {topSpotlightPlaylist.matchScore}% Match
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg mx-auto group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  <p className="text-center text-xs font-semibold text-emerald-200">
                    Klik untuk Memutar Modul 1
                  </p>
                </div>

                {/* Progress bar inside card if started */}
                <div className="space-y-1 text-[10px] text-gray-300">
                  <div className="flex justify-between">
                    <span>Target: {formatGoalLabel(userProfile.primaryGoal)}</span>
                    <span>{topSpotlightPlaylist.episodes.length} Modul</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-1.5 rounded-full"
                      style={{ width: `${topSpotlightPlaylist.completedEpisodesCount ? (topSpotlightPlaylist.completedEpisodesCount / topSpotlightPlaylist.episodes.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. CONTROLS, SEARCH & AI GENERATOR BAR */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik playlist, ustadz, atau judul..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#142317] border border-gray-200 dark:border-emerald-500/20 focus:border-emerald-500 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons: Tuning & AI Generator */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              id="btn-open-preferences-modal"
              onClick={() => setIsPreferencesModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#182C1C] hover:bg-emerald-50 dark:hover:bg-[#1D3B22] border border-gray-200 dark:border-emerald-500/30 text-gray-800 dark:text-emerald-200 font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Sliders className="w-4 h-4 text-emerald-500" />
              <span>Sesuaikan Minat & Asatidz</span>
            </button>

            <button
              id="btn-open-ai-smart-generator"
              onClick={() => setIsGeneratorModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-900/30 transition-all transform hover:scale-105 active:scale-95"
            >
              <Wand2 className="w-4 h-4 text-amber-300" />
              <span>✨ Susun Playlist Cerdas (AI)</span>
            </button>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          {[
            { id: 'ALL', label: 'Semua Playlist Kurasi' },
            { id: 'RECOMMENDED', label: '⚡ Sangat Cocok (90%+ Match)' },
            { id: 'FIQIH_MUAMALAH', label: 'Fiqih Muamalah & Fintech' },
            { id: 'HAJJ_PREP', label: 'Manasik Haji & Umrah' },
            { id: 'FAMILY', label: 'Parenting & Sakinah' },
            { id: 'ZAKAT_EKONOMI', label: 'Zakat & Filantropi' },
            { id: 'SPIRITUAL', label: 'Tazkiyatun Nafs & Akidah' },
            { id: 'SAVED', label: `⭐ Playlist Tersimpan (${userProfile.savedPlaylistIds.length})` }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                selectedCategoryFilter === cat.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#142317] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-[#182C1C]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. PLAYLISTS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
              <span>Daftar Putar Rekomendasi Terstruktur</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-sans font-normal">
                ({filteredPlaylists.length} Seri Tersedia)
              </span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Diurutkan secara cerdas berdasarkan skor kecocokan minat topik dan asatidz pilihan Anda.
            </p>
          </div>
        </div>

        {filteredPlaylists.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#121E14] border border-gray-200 dark:border-emerald-500/20 space-y-3">
            <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tidak ada playlist yang sesuai dengan filter pencarian.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryFilter('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaylists.map(playlist => {
              const isSaved = userProfile.savedPlaylistIds.includes(playlist.id);
              const score = playlist.matchScore || 85;

              return (
                <div
                  key={playlist.id}
                  className="rounded-3xl bg-white dark:bg-[#121E14] border border-gray-200 dark:border-emerald-500/20 shadow-md hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Cover Header */}
                  <div className="relative aspect-video bg-black overflow-hidden">
                    <img
                      src={playlist.coverImage}
                      alt={playlist.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-3.5">
                      
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                          {playlist.category}
                        </span>

                        {/* Match Score Badge with click for explanation */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlaylistForExplanation(playlist);
                            setIsExplanationModalOpen(true);
                          }}
                          className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 backdrop-blur-md border border-emerald-400 text-emerald-300 text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-500/50 transition-colors shadow-sm"
                          title="Klik untuk melihat rincian kalkulasi algoritma"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>{score}% Match</span>
                        </button>
                      </div>

                      {/* Bottom Info inside Cover */}
                      <div className="flex items-center justify-between text-white text-[11px]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          {playlist.totalDurationMinutes} Menit
                        </span>
                        <span className="font-semibold text-emerald-300">
                          {playlist.totalEpisodes} Modul
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    
                    <div className="space-y-2.5">
                      {/* Title & Subtitle */}
                      <h4 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-500 transition-colors font-serif">
                        {playlist.title}
                      </h4>

                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                        {playlist.subtitle}
                      </p>

                      {/* Primary Topics Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {playlist.primaryTopics.slice(0, 2).map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 text-[10px] font-medium"
                          >
                            #{topic}
                          </span>
                        ))}
                      </div>

                      {/* Scholars Preview */}
                      <div className="pt-2 flex items-center gap-2 border-t border-gray-100 dark:border-emerald-500/10">
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {playlist.scholars.map((sc, idx) => (
                            <img
                              key={idx}
                              src={sc.avatar}
                              alt={sc.name}
                              className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500"
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-600 dark:text-gray-400 truncate">
                          {playlist.scholars.map(s => s.name).join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-gray-100 dark:border-emerald-500/15 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handlePlayPlaylist(playlist)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Mulai Belajar</span>
                      </button>

                      {/* Save / Bookmark Button */}
                      <button
                        onClick={() => handleToggleSavePlaylist(playlist.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          isSaved
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                            : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-white'
                        }`}
                        title={isSaved ? 'Hapus Simpanan' : 'Simpan Playlist'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      {/* Like Button */}
                      <button
                        onClick={() => handleToggleLike(playlist.id)}
                        className={`p-2 rounded-xl border flex items-center gap-1 text-[11px] transition-colors ${
                          playlist.hasLiked
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-white'
                        }`}
                        title="Suka Playlist"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${playlist.hasLiked ? 'fill-current' : ''}`} />
                        <span>{playlist.likesCount}</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. MODALS */}
      {/* Player Modal */}
      {activePlayingPlaylist && (
        <PlaylistPlayerModal
          playlist={activePlayingPlaylist}
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          onToggleEpisodeComplete={handleToggleEpisodeComplete}
          completedTalkIds={userProfile.completedTalkIds}
        />
      )}

      {/* Preferences Customizer Modal */}
      <PreferencesCustomizerModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        userProfile={userProfile}
        onSavePreferences={handleSavePreferences}
      />

      {/* Algorithm Transparency Explanation Modal */}
      <AlgorithmExplanationModal
        isOpen={isExplanationModalOpen}
        onClose={() => setIsExplanationModalOpen(false)}
        playlist={selectedPlaylistForExplanation}
        userProfile={userProfile}
      />

      {/* AI Smart Playlist Generator Modal */}
      <SmartPlaylistGeneratorModal
        isOpen={isGeneratorModalOpen}
        onClose={() => setIsGeneratorModalOpen(false)}
        allTalks={INITIAL_TALK_SESSIONS}
        userProfile={userProfile}
        onPlaylistCreated={handleAddCustomPlaylist}
        onPlayPlaylist={handlePlayPlaylist}
      />

    </div>
  );
};
