import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Sliders, 
  Check, 
  UserCheck, 
  Target, 
  BookOpen, 
  RotateCcw, 
  ShieldCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { UserTalkPreferenceProfile } from '../../types';
import { 
  ALL_AVAILABLE_TOPICS, 
  ALL_AVAILABLE_SCHOLARS, 
  DEFAULT_USER_TALK_PREFERENCES,
  formatGoalLabel 
} from '../../utils/talkRecommendations';

interface PreferencesCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserTalkPreferenceProfile;
  onSavePreferences: (updated: UserTalkPreferenceProfile) => void;
}

export const PreferencesCustomizerModal: React.FC<PreferencesCustomizerModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSavePreferences
}) => {
  const [profileDraft, setProfileDraft] = useState<UserTalkPreferenceProfile>({ ...userProfile });
  const [activeSubSection, setActiveSubSection] = useState<'topics' | 'scholars' | 'goals'>('topics');

  if (!isOpen) return null;

  const toggleTopic = (topic: string) => {
    setProfileDraft(prev => {
      const exists = prev.selectedTopics.includes(topic);
      const newTopics = exists 
        ? prev.selectedTopics.filter(t => t !== topic)
        : [...prev.selectedTopics, topic];
      
      const newWeights = { ...prev.topicWeights };
      if (!exists && !newWeights[topic]) {
        newWeights[topic] = 8.5;
      }

      return {
        ...prev,
        selectedTopics: newTopics,
        topicWeights: newWeights
      };
    });
  };

  const setTopicWeight = (topic: string, weight: number) => {
    setProfileDraft(prev => ({
      ...prev,
      topicWeights: {
        ...prev.topicWeights,
        [topic]: weight
      }
    }));
  };

  const toggleScholar = (scholar: string) => {
    setProfileDraft(prev => {
      const exists = prev.preferredScholars.includes(scholar);
      const newScholars = exists 
        ? prev.preferredScholars.filter(s => s !== scholar)
        : [...prev.preferredScholars, scholar];

      const newWeights = { ...prev.scholarWeights };
      if (!exists && !newWeights[scholar]) {
        newWeights[scholar] = 9.0;
      }

      return {
        ...prev,
        preferredScholars: newScholars,
        scholarWeights: newWeights
      };
    });
  };

  const setScholarWeight = (scholar: string, weight: number) => {
    setProfileDraft(prev => ({
      ...prev,
      scholarWeights: {
        ...prev.scholarWeights,
        [scholar]: weight
      }
    }));
  };

  const handleResetToDefault = () => {
    setProfileDraft({ ...DEFAULT_USER_TALK_PREFERENCES });
  };

  const handleSave = () => {
    onSavePreferences(profileDraft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#121E14] text-white rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#182C1C] border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
                <span>Sesuaikan Profil Minat & Algoritma Kurasi</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-sans font-bold">
                  AI Weighted Engine
                </span>
              </h2>
              <p className="text-xs text-emerald-300/80">
                Atur topik agama dan asatidz rujukan agar playlist merekomendasikan materi yang paling relevan.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-emerald-500/20 flex items-center gap-2 bg-[#142417] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubSection('topics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubSection === 'topics'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-emerald-200/80 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Minat Topik Keagamaan ({profileDraft.selectedTopics.length})</span>
          </button>

          <button
            onClick={() => setActiveSubSection('scholars')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubSection === 'scholars'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-emerald-200/80 hover:bg-white/10'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Asatidz & Da\'i Favorit ({profileDraft.preferredScholars.length})</span>
          </button>

          <button
            onClick={() => setActiveSubSection('goals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubSection === 'goals'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-emerald-200/80 hover:bg-white/10'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Target & Kedalaman Belajar</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* SECTION 1: TOPICS */}
          {activeSubSection === 'topics' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#182C1C] border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed">
                <strong className="text-white font-bold">Bobot Rekomendasi Topik (40% Pengaruh Algoritma):</strong>{' '}
                Pilih topik yang ingin Anda perdalam. Anda dapat mengatur skala prioritas (1 - 10) untuk masing-masing bidang ilmu syariah.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ALL_AVAILABLE_TOPICS.map(topic => {
                  const isSelected = profileDraft.selectedTopics.includes(topic);
                  const weight = profileDraft.topicWeights[topic] || (isSelected ? 8.5 : 5.0);

                  return (
                    <div
                      key={topic}
                      className={`p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-[#1A331F] border-emerald-400/60 shadow-sm'
                          : 'bg-[#142317] border-emerald-500/15 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleTopic(topic)}
                          className="flex items-center gap-2.5 text-left font-bold text-xs sm:text-sm text-white flex-1"
                        >
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-emerald-500 border-emerald-400 text-white'
                              : 'border-gray-500 bg-transparent'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span>{topic}</span>
                        </button>

                        <span className="text-[11px] font-mono font-bold text-amber-300 shrink-0">
                          Skor: {weight.toFixed(1)}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="mt-3 pt-2.5 border-t border-emerald-500/20 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-gray-400">
                            <span>Tingkat Prioritas Rekomendasi:</span>
                            <span className="text-emerald-300 font-bold">
                              {weight >= 9 ? 'Sangat Tinggi (Paling Disukai)' : weight >= 7 ? 'Tinggi' : 'Sedang'}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.5"
                            value={weight}
                            onChange={(e) => setTopicWeight(topic, parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: SCHOLARS */}
          {activeSubSection === 'scholars' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#182C1C] border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed">
                <strong className="text-white font-bold">Afinitas Asatidz & Da\'i (30% Pengaruh Algoritma):</strong>{' '}
                Pilih tokoh ulama, pakar muamalah, dan praktisi dakwah yang penyampaian materinya paling cocok dengan gaya belajar Anda.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ALL_AVAILABLE_SCHOLARS.map(scholar => {
                  const isSelected = profileDraft.preferredScholars.includes(scholar);
                  const weight = profileDraft.scholarWeights[scholar] || (isSelected ? 9.0 : 6.0);

                  return (
                    <div
                      key={scholar}
                      className={`p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-[#1A331F] border-emerald-400/60 shadow-sm'
                          : 'bg-[#142317] border-emerald-500/15 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleScholar(scholar)}
                          className="flex items-center gap-2.5 text-left font-bold text-xs sm:text-sm text-white flex-1"
                        >
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-emerald-500 border-emerald-400 text-white'
                              : 'border-gray-500 bg-transparent'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span>{scholar}</span>
                        </button>

                        <span className="text-[11px] font-mono font-bold text-amber-300 shrink-0">
                          Skor: {weight.toFixed(1)}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="mt-3 pt-2.5 border-t border-emerald-500/20 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-gray-400">
                            <span>Frekuensi Kemunculan:</span>
                            <span className="text-emerald-300 font-bold">
                              {weight >= 9 ? 'Prioritas Utama' : weight >= 7.5 ? 'Sering Ditampilkan' : 'Standar'}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.5"
                            value={weight}
                            onChange={(e) => setScholarWeight(scholar, parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: GOALS & PACE */}
          {activeSubSection === 'goals' && (
            <div className="space-y-5">
              
              {/* Primary Spiritual & Intellectual Goal */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                  1. Target Utama Pembelajaran Anda Saat Ini:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'FINANCE_HALAL', label: 'Finansial & Bisnis Syariah', desc: 'Literasi fikih muamalah, fintech, & investasi halal.' },
                    { id: 'HAJJ_PREP', label: 'Persiapan Haji & Umrah Mabrur', desc: 'Bimbingan manasik, fiqih haramain, & doa mustajab.' },
                    { id: 'FAMILY_HARMONY', label: 'Keluarga Sakinah & Parenting', desc: 'Neuroparenting, adab anak, & ketahanan rumah tangga.' },
                    { id: 'ZAKAT_IMPACT', label: 'Zakat & Filantropi Berdaya', desc: 'Audit transparansi zakat blockchain & pemberdayaan 8 asnaf.' },
                    { id: 'SPIRITUAL_GROWTH', label: 'Tazkiyatun Nafs & Akidah', desc: 'Pembersihan hati, tadabbur Al-Qur\'an, & ketenteraman batin.' },
                    { id: 'ALL', label: 'Eksplorasi Holistik (Semua Bidang)', desc: 'Rekomendasi berimbang mencakup seluruh cabang keilmuan.' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setProfileDraft(prev => ({ ...prev, primaryGoal: item.id as any }))}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        profileDraft.primaryGoal === item.id
                          ? 'bg-[#1A331F] border-emerald-400 ring-1 ring-emerald-400/50'
                          : 'bg-[#142317] border-emerald-500/15 hover:bg-[#182C1C]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                        <span>{item.label}</span>
                        {profileDraft.primaryGoal === item.id && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-300 leading-snug">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                  2. Tingkat Kedalaman Materi:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'SEMUA_LEVEL', label: 'Semua Level' },
                    { id: 'PEMULA', label: 'Pemula (Dasar & Aplikatif)' },
                    { id: 'MENENGAH', label: 'Menengah & Lanjutan' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setProfileDraft(prev => ({ ...prev, preferredDifficulty: lvl.id as any }))}
                      className={`py-2.5 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                        profileDraft.preferredDifficulty === lvl.id
                          ? 'bg-emerald-500 text-white border-emerald-400 shadow-md'
                          : 'bg-[#142317] text-gray-300 border-emerald-500/15 hover:text-white'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#182C1C] border-t border-emerald-500/20 flex items-center justify-between gap-3">
          <button
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Simpan & Terapkan Algoritma</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
