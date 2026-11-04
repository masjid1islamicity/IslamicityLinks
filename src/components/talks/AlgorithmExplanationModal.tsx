import React from 'react';
import { 
  X, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  BookOpen, 
  UserCheck, 
  Target, 
  Layers 
} from 'lucide-react';
import { CuratedPlaylist, UserTalkPreferenceProfile } from '../../types';
import { formatGoalLabel } from '../../utils/talkRecommendations';

interface AlgorithmExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: CuratedPlaylist | null;
  userProfile: UserTalkPreferenceProfile;
}

export const AlgorithmExplanationModal: React.FC<AlgorithmExplanationModalProps> = ({
  isOpen,
  onClose,
  playlist,
  userProfile
}) => {
  if (!isOpen || !playlist) return null;

  const score = playlist.matchScore || 85;
  const breakdown = playlist.matchBreakdown || {
    topicScore: 36,
    scholarScore: 28,
    goalScore: 14,
    levelScore: 9
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#121E14] text-white rounded-3xl border border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#182C1C] border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
                <span>Transparansi Algoritma Rekomendasi</span>
              </h3>
              <p className="text-xs text-emerald-300/80">
                Formula komputasi kecocokan materi berdasarkan riwayat & profil minat Anda.
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
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Target Playlist Banner */}
          <div className="p-4 rounded-2xl bg-[#182C1C] border border-emerald-500/30 flex items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Daftar Putar Terpilih:
              </span>
              <h4 className="text-sm sm:text-base font-bold text-white truncate">
                {playlist.title}
              </h4>
              <p className="text-xs text-gray-300 truncate">
                Kategori: {playlist.category} • {playlist.totalEpisodes} Modul ({playlist.totalDurationMinutes}m)
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-sm font-black font-mono">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>{score}% Match</span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-1">Tingkat Kecocokan</span>
            </div>
          </div>

          {/* Detailed Factor Breakdown Grid */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Bobot & Indikator Penilaian Multi-Faktor:
            </h5>

            <div className="space-y-3">
              
              {/* Factor 1: Topic Affinity */}
              <div className="p-3.5 rounded-2xl bg-black/30 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Afinitas Topik Syariah (Maks 40 Poin)</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-300">
                    {breakdown.topicScore} / 40 Poin
                  </span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-1.5">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${(breakdown.topicScore / 40) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-300 leading-snug">
                  Mencocokkan topik materi ({playlist.primaryTopics.join(', ')}) dengan preferensi topik yang Anda prioritaskan.
                </p>
              </div>

              {/* Factor 2: Scholar Affinity */}
              <div className="p-3.5 rounded-2xl bg-black/30 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    <span>Afinitas Asatidz Rujukan (Maks 30 Poin)</span>
                  </div>
                  <span className="font-mono font-bold text-amber-300">
                    {breakdown.scholarScore} / 30 Poin
                  </span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-1.5">
                  <div 
                    className="bg-amber-400 h-1.5 rounded-full"
                    style={{ width: `${(breakdown.scholarScore / 30) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-300 leading-snug">
                  Menghadirkan narasumber utama: {playlist.scholars.map(s => s.name).join(', ')}.
                </p>
              </div>

              {/* Factor 3: Target Goal */}
              <div className="p-3.5 rounded-2xl bg-black/30 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span>Kesesuaian Target Belajar (Maks 15 Poin)</span>
                  </div>
                  <span className="font-mono font-bold text-purple-300">
                    {breakdown.goalScore} / 15 Poin
                  </span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-1.5">
                  <div 
                    className="bg-purple-400 h-1.5 rounded-full"
                    style={{ width: `${(breakdown.goalScore / 15) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-300 leading-snug">
                  Target belajar aktif Anda: <strong className="text-white">{formatGoalLabel(userProfile.primaryGoal)}</strong>.
                </p>
              </div>

              {/* Factor 4: Level & Depth */}
              <div className="p-3.5 rounded-2xl bg-black/30 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Format & Tingkat Kesulitan (Maks 15 Poin)</span>
                  </div>
                  <span className="font-mono font-bold text-cyan-300">
                    {breakdown.levelScore} / 15 Poin
                  </span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-1.5">
                  <div 
                    className="bg-cyan-400 h-1.5 rounded-full"
                    style={{ width: `${(breakdown.levelScore / 15) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-300 leading-snug">
                  Tingkat materi ({playlist.difficulty}) selaras dengan ritme kenyamanan belajar Anda.
                </p>
              </div>

            </div>
          </div>

          {/* Dynamic Match Reasons Listed by Engine */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
            <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Alasan Rekomendasi Kurator:</span>
            </h5>
            <ul className="space-y-1.5 text-xs text-emerald-100">
              {playlist.matchReasons && playlist.matchReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#182C1C] border-t border-emerald-500/20 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            Tutup Penjelasan
          </button>
        </div>

      </div>
    </div>
  );
};
