import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Wand2, 
  BookOpen, 
  Check, 
  ArrowRight, 
  Play, 
  Clock, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { TalkSession, CuratedPlaylist, UserTalkPreferenceProfile } from '../../types';
import { generateSmartCustomPlaylist } from '../../utils/talkRecommendations';

interface SmartPlaylistGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTalks: TalkSession[];
  userProfile: UserTalkPreferenceProfile;
  onPlaylistCreated: (newPlaylist: CuratedPlaylist) => void;
  onPlayPlaylist: (playlist: CuratedPlaylist) => void;
}

export const SmartPlaylistGeneratorModal: React.FC<SmartPlaylistGeneratorModalProps> = ({
  isOpen,
  onClose,
  allTalks,
  userProfile,
  onPlaylistCreated,
  onPlayPlaylist
}) => {
  const [promptQuery, setPromptQuery] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<CuratedPlaylist | null>(null);

  if (!isOpen) return null;

  const PRESET_IDEAS = [
    'Panduan Pembagian Warisan & Faraidh Syariah',
    'Investasi Halal, Kripto, & Fiqih E-Commerce',
    'Tips Manasik & Meraih Haji Mabrur di Haramain',
    'Mendidik Mental Anak & Komunikasi Sakinah',
    'Audit Zakat Blockchain & Pemberdayaan 8 Asnaf',
    'Tazkiyatun Nafs & Terapi Ketenangan Batin'
  ];

  const handleGenerate = (targetQuery?: string) => {
    const queryToUse = targetQuery || promptQuery.trim();
    if (!queryToUse) return;

    setIsGenerating(true);
    setGeneratedResult(null);

    setTimeout(() => {
      const newPlaylist = generateSmartCustomPlaylist(queryToUse, allTalks, userProfile);
      setGeneratedResult(newPlaylist);
      setIsGenerating(false);
    }, 600);
  };

  const handleSaveAndPlay = () => {
    if (generatedResult) {
      onPlaylistCreated(generatedResult);
      onPlayPlaylist(generatedResult);
      onClose();
    }
  };

  const handleSaveOnly = () => {
    if (generatedResult) {
      onPlaylistCreated(generatedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#121E14] text-white rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#182C1C] border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
                <span>Susun Playlist Cerdas Sesuai Kebutuhan</span>
              </h3>
              <p className="text-xs text-emerald-300/80">
                Sebutkan topik atau permasalahan syariah yang ingin Anda pelajari secara mendalam.
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
              Topik Kajian atau Permasalahan yang Ingin Dikaji:
            </label>
            <div className="relative">
              <input
                type="text"
                value={promptQuery}
                onChange={(e) => setPromptQuery(e.target.value)}
                placeholder="Contoh: Hukum dropship & akad fintech syariah..."
                className="w-full pl-4 pr-28 py-3 rounded-2xl bg-black/40 border border-emerald-500/30 focus:border-emerald-400 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && promptQuery.trim()) {
                    handleGenerate();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={!promptQuery.trim() || isGenerating}
                className="absolute right-2 top-1.5 bottom-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                {isGenerating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span>Susun</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Ideas */}
          <div className="space-y-2">
            <span className="text-[11px] text-gray-400 font-semibold block">
              Atau pilih topik rekomendasi cepat:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_IDEAS.map((idea, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPromptQuery(idea);
                    handleGenerate(idea);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-900/40 text-emerald-200 hover:text-white border border-emerald-500/20 text-xs text-left transition-all"
                >
                  + {idea}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Result Preview */}
          {generatedResult && (
            <div className="p-5 rounded-2xl bg-[#182C1C] border border-emerald-400/50 shadow-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>Kurikulum Cerdas Disusun ({generatedResult.matchScore}% Match)</span>
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white font-serif">
                    {generatedResult.title}
                  </h4>
                  <p className="text-xs text-emerald-300/90">
                    {generatedResult.subtitle}
                  </p>
                </div>
              </div>

              {/* Modules List */}
              <div className="space-y-2 pt-2 border-t border-emerald-500/20">
                <span className="text-[11px] font-bold text-gray-300 block uppercase tracking-wider">
                  Silabus Pembelajaran Rekomendasi:
                </span>
                <div className="space-y-2">
                  {generatedResult.episodes.map((ep, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-black/30 border border-emerald-500/20 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{ep.customTitle || ep.talkSession.title}</p>
                          <p className="text-[11px] text-gray-400 truncate">Ustadz: {ep.talkSession.speaker.name}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-300 shrink-0">
                        {ep.durationMinutes}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Match Reasons */}
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/20 text-xs text-emerald-200 space-y-1">
                <p className="font-semibold text-amber-300">Mengapa kurikulum ini cocok untuk Anda:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-gray-300">
                  {generatedResult.matchReasons?.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveOnly}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
                >
                  Simpan ke Playlist Saya
                </button>

                <button
                  type="button"
                  onClick={handleSaveAndPlay}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Mulai Belajar Sekarang</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#182C1C] border-t border-emerald-500/20 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Didukung Smart Algoritma Rekomendasi Syariah Islamicity</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
