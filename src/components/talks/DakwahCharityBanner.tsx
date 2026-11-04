import React, { useState } from 'react';
import { 
  Heart, 
  HandHeart, 
  Building2, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Send,
  Coins
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DakwahCharityBannerProps {
  onSuccessDonation?: () => void;
}

export const DakwahCharityBanner: React.FC<DakwahCharityBannerProps> = ({ onSuccessDonation }) => {
  const { addNewTransaction, userProfile, addNotification, setSelectedReceiptTx } = useApp();
  const [selectedProgram, setSelectedProgram] = useState<'YATIM' | 'MASJID'>('YATIM');
  const [infaqAmount, setInfaqAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorDoa, setDonorDoa] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const presetAmounts = [25000, 50000, 100000, 250000, 500000];

  const handleExecuteInfaq = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : infaqAmount;
    if (!finalAmount || finalAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const programTitle = selectedProgram === 'YATIM' 
        ? 'Santunan 1.000 Anak Yatim Penghafal Qur\'an - Pusat Dakwah Islamicity'
        : 'Pembangunan & Renovasi Masjid Pelosok - Pusat Dakwah Islamicity';

      const newTx = addNewTransaction({
        type: 'INFAQ_SEDEKAH',
        donorName: isAnonymous ? 'Hamba Allah' : (userProfile.name || 'Jamaah IslamicityTalks'),
        isAnonymous,
        amount: finalAmount,
        currency: 'IDR',
        charityId: 'charity-dakwah-islamicity',
        charityName: programTitle,
        asnafTarget: selectedProgram === 'YATIM' ? 'FAKIR' : 'FISABILILLAH',
        status: 'CONFIRMED',
        smartContract: '0xDAKWAH...77F9',
        gasFee: 0,
        taxDeductionEligible: true
      });

      setIsProcessing(false);
      setSelectedReceiptTx(newTx);

      addNotification({
        title: 'Infaq Dakwah Berhasil Tersalurkan',
        message: `Jazakallahu khairan atas infaq sebesar Rp ${finalAmount.toLocaleString('id-ID')} untuk ${programTitle}. Transaksi tercatat pada Blockchain L2.`,
        type: 'DONATION'
      });

      if (onSuccessDonation) onSuccessDonation();
    }, 1000);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-[#143B19] to-[#0D2811] text-white p-6 sm:p-8 md:p-10 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
      
      {/* Background Islamic Ornaments */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Col (7 Cols): Narrative & Program Highlights */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold uppercase tracking-wider border border-amber-400/30 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-current text-amber-300" />
              <span>Kolaborasi & Amal Dakwah Nyata</span>
            </span>
            <span className="text-xs text-emerald-300">
              Pusat Dakwah Islamicity
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight font-serif">
            Bantu Yatim Penghafal Qur'an & Proyek Masjid Pelosok
          </h3>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
            Sinergi dakwah bukan sekadar kata-kata, melainkan aksi nyata memuliakan anak yatim dan menghidupkan rumah-rumah Allah di pelosok Nusantara. Setiap donasi tercatat transparan 100% on-chain tanpa potongan tersembunyi.
          </p>

          {/* Program Toggle Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div
              onClick={() => setSelectedProgram('YATIM')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedProgram === 'YATIM'
                  ? 'bg-white/15 border-amber-400 shadow-lg'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
                <HandHeart className="w-4 h-4" />
                <span>Santunan 1.000 Yatim</span>
              </div>
              <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                Beasiswa pendidikan, asrama santri, dan kebutuhan pangan yatim dhuafa.
              </p>
            </div>

            <div
              onClick={() => setSelectedProgram('MASJID')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedProgram === 'MASJID'
                  ? 'bg-white/15 border-amber-400 shadow-lg'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs mb-1">
                <Building2 className="w-4 h-4" />
                <span>Proyek Masjid Binaan</span>
              </div>
              <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                Penyediaan karpet, sound system, sumur air bersih, dan sound adzan masjid terpencil.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col (5 Cols): Fast Infaq Pledge Widget */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1A1D1A] text-[#141A14] dark:text-[#E4E8E4] rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/20 space-y-4">
          <div className="flex items-center justify-between border-b border-[#D8DFD8] dark:border-[#2D332D] pb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Formulir Infaq Spontan
            </div>
            <div className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] font-mono">
              Validasi Smart Contract L2
            </div>
          </div>

          <form onSubmit={handleExecuteInfaq} className="space-y-4">
            {/* Amount Presets */}
            <div>
              <label className="block text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] mb-2">
                Pilih Nominal Infaq Berkah:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setInfaqAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
                      infaqAmount === amt && !customAmount
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-[#F4F7F4] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] hover:bg-[#EEF3EE]'
                    }`}
                  >
                    Rp {amt >= 1000000 ? `${amt / 1000000} Jt` : `${amt / 1000}k`}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <label className="block text-[11px] font-medium text-[#5A665B] dark:text-[#A0A8A0] mb-1">
                Atau Masukkan Nominal Lain (Rp):
              </label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setInfaqAmount(0);
                }}
                placeholder="Misal: 150000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF8] dark:bg-[#141714] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Doa / Notes */}
            <div>
              <input
                type="text"
                value={donorDoa}
                onChange={(e) => setDonorDoa(e.target.value)}
                placeholder="Tuliskan hajat doa (opsional)..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAF8] dark:bg-[#141714] border border-[#D8DFD8] dark:border-[#2D332D] text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Anonymous Toggle */}
            <label className="flex items-center gap-2 text-xs text-[#5A665B] dark:text-[#A0A8A0] cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Infaq sebagai Hamba Allah (Enkripsi Privasi E2E)</span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition-all disabled:opacity-50"
            >
              <Coins className="w-4 h-4" />
              <span>{isProcessing ? 'Memproses Transaksi...' : `Tunaikan Infaq Rp ${(customAmount ? parseFloat(customAmount) : infaqAmount).toLocaleString('id-ID')}`}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
