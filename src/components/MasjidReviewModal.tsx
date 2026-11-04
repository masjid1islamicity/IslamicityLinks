import React, { useState } from 'react';
import { 
  Star, 
  X, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  Award,
  ThumbsUp
} from 'lucide-react';
import { MasjidLocation, MasjidReview } from '../types';
import { useApp } from '../context/AppContext';

interface MasjidReviewModalProps {
  masjid: MasjidLocation;
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (masjidId: string, review: MasjidReview) => void;
}

export const MasjidReviewModal: React.FC<MasjidReviewModalProps> = ({
  masjid,
  isOpen,
  onClose,
  onAddReview,
}) => {
  const { userProfile } = useApp();
  const [activeTab, setActiveTab] = useState<'reviews' | 'write'>('reviews');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [cleanlinessScore, setCleanlinessScore] = useState<number>(5);
  const [wudhuComfortScore, setWudhuComfortScore] = useState<number>(5);
  const [acAcousticScore, setAcAcousticScore] = useState<number>(5);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev: MasjidReview = {
      id: 'rev_' + Date.now().toString(36),
      authorName: userProfile.name || 'Jamaah Terverifikasi',
      rating,
      comment: comment.trim(),
      timestamp: 'Baru saja',
      cleanlinessScore,
      wudhuComfortScore,
      acAcousticScore,
      verifiedJamaah: true,
    };

    onAddReview(masjid.id, newRev);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setActiveTab('reviews');
      setComment('');
    }, 1200);
  };

  const reviewsList = masjid.reviews || [];
  const breakdown = masjid.ratingsBreakdown || {
    cleanliness: 4.96,
    wudhuComfort: 4.94,
    acAcoustics: 4.98,
    parkingAccess: 4.88,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl p-6 max-w-xl w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4] my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D8DFD8] dark:border-[#2D332D]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] border border-[#2E7D32]/20">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#141A14] dark:text-[#E4E8E4]">
                Ulasan & Rating Komunitas Jamaah
              </h3>
              <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                {masjid.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'reviews'
                ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0]'
            }`}
          >
            Semua Ulasan ({reviewsList.length + 120}+)
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'write'
                ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0]'
            }`}
          >
            + Tulis Ulasan Jamaah
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {activeTab === 'reviews' ? (
            <div className="space-y-4">
              
              {/* Overall Rating Summary Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EEF3EE] to-[#EAEFEA] dark:from-[#242924] dark:to-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] flex flex-col sm:flex-row items-center gap-5">
                <div className="text-center sm:border-r sm:border-[#D8DFD8] dark:sm:border-[#2D332D] sm:pr-6 shrink-0">
                  <div className="text-3xl font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">
                    {masjid.rating || 4.95}
                  </div>
                  <div className="flex items-center justify-center gap-1 my-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-[#2E7D32] text-[#2E7D32] dark:fill-[#4CAF50] dark:text-[#4CAF50]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                    {masjid.reviewCount || 120}+ Ulasan Sahih
                  </span>
                </div>

                {/* Score Breakdown Progress Bars */}
                <div className="flex-1 w-full space-y-1.5 text-[11px]">
                  <div>
                    <div className="flex justify-between text-[#5A665B] dark:text-[#A0A8A0] text-[10px]">
                      <span>Kebersihan & Kenyamanan Wudhu</span>
                      <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">{breakdown.cleanliness}/5.0</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#D8DFD8] dark:bg-[#2D332D] overflow-hidden">
                      <div className="h-full bg-[#2E7D32]" style={{ width: `${(breakdown.cleanliness / 5) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#5A665B] dark:text-[#A0A8A0] text-[10px]">
                      <span>Kejernihan Suara Sound & Khutbah</span>
                      <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">{breakdown.acAcoustics}/5.0</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#D8DFD8] dark:bg-[#2D332D] overflow-hidden">
                      <div className="h-full bg-[#2E7D32]" style={{ width: `${(breakdown.acAcoustics / 5) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#5A665B] dark:text-[#A0A8A0] text-[10px]">
                      <span>Kerapian Saf & Kesejukan AC</span>
                      <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">{breakdown.wudhuComfort}/5.0</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#D8DFD8] dark:bg-[#2D332D] overflow-hidden">
                      <div className="h-full bg-[#2E7D32]" style={{ width: `${(breakdown.wudhuComfort / 5) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#5A665B] dark:text-[#A0A8A0] text-[10px]">
                      <span>Kemudahan Parkir & Disabilitas</span>
                      <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">{breakdown.parkingAccess}/5.0</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#D8DFD8] dark:bg-[#2D332D] overflow-hidden">
                      <div className="h-full bg-[#2E7D32]" style={{ width: `${(breakdown.parkingAccess / 5) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-xs">
                          {rev.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">{rev.authorName}</span>
                            {rev.verifiedJamaah && (
                              <span className="text-[10px] text-[#2E7D32] dark:text-[#4CAF50] flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">{rev.timestamp}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rev.rating
                                ? 'fill-[#2E7D32] text-[#2E7D32] dark:fill-[#4CAF50] dark:text-[#4CAF50]'
                                : 'text-[#D8DFD8] dark:text-[#2D332D]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#141A14] dark:text-[#E4E8E4] leading-relaxed">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D]">
                        Wudhu: {rev.wudhuComfortScore || 5}/5
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D]">
                        Akustik: {rev.acAcousticScore || 5}/5
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {isSubmitted ? (
                <div className="p-8 text-center space-y-2 bg-[#EEF3EE] dark:bg-[#242924] rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D]">
                  <CheckCircle2 className="w-10 h-10 text-[#2E7D32] dark:text-[#4CAF50] mx-auto animate-bounce" />
                  <h4 className="font-extrabold text-sm text-[#141A14] dark:text-[#E4E8E4]">
                    Jazakallah Khair!
                  </h4>
                  <p className="text-[#5A665B] dark:text-[#A0A8A0] text-xs">
                    Ulasan Anda telah ditambahkan ke data komunitas jamaah {masjid.name}.
                  </p>
                </div>
              ) : (
                <>
                  {/* Rating Stars Input */}
                  <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-center space-y-2">
                    <span className="font-bold text-[#141A14] dark:text-[#E4E8E4] block">
                      Rating Keseluruhan Pengalaman Ibadah:
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setRating(s)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              s <= rating
                                ? 'fill-[#2E7D32] text-[#2E7D32] dark:fill-[#4CAF50] dark:text-[#4CAF50]'
                                : 'text-[#D8DFD8] dark:text-[#2D332D]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                      {rating === 5 ? 'Sangat Istimewa (Mumtaz)' : rating === 4 ? 'Bagus & Nyaman' : 'Cukup'}
                    </span>
                  </div>

                  {/* Sub Scores */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-center space-y-1">
                      <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">Kebersihan</span>
                      <select
                        value={cleanlinessScore}
                        onChange={(e) => setCleanlinessScore(Number(e.target.value))}
                        className="w-full bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-lg p-1 text-xs text-center"
                      >
                        <option value={5}>5 - Bersih Sekali</option>
                        <option value={4}>4 - Bersih</option>
                        <option value={3}>3 - Cukup</option>
                      </select>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-center space-y-1">
                      <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">Kenyamanan Wudhu</span>
                      <select
                        value={wudhuComfortScore}
                        onChange={(e) => setWudhuComfortScore(Number(e.target.value))}
                        className="w-full bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-lg p-1 text-xs text-center"
                      >
                        <option value={5}>5 - Sangat Luas</option>
                        <option value={4}>4 - Memadai</option>
                        <option value={3}>3 - Standar</option>
                      </select>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-center space-y-1">
                      <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">Kualitas Sound</span>
                      <select
                        value={acAcousticScore}
                        onChange={(e) => setAcAcousticScore(Number(e.target.value))}
                        className="w-full bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-lg p-1 text-xs text-center"
                      >
                        <option value={5}>5 - Jernih & Syahdu</option>
                        <option value={4}>4 - Jelas</option>
                        <option value={3}>3 - Standar</option>
                      </select>
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div className="space-y-1">
                    <label className="font-bold text-[#141A14] dark:text-[#E4E8E4] block">
                      Tuliskan Ulasan / Tips bagi Jamaah Lain:
                    </label>
                    <textarea
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Contoh: Saf wanita sangat nyaman di lantai 2, wudhu airnya deras dan bersih, tersedia parkir sepeda motor luas..."
                      required
                      className="w-full p-3 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Kirim Ulasan Jamaah
                  </button>
                </>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#D8DFD8] dark:border-[#2D332D] flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#D8DFD8] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] font-bold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
