import React, { useState } from 'react';
import { 
  Building2, 
  HeartHandshake, 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  X, 
  Lock, 
  ArrowRight, 
  Coins,
  Check,
  Share2,
  FileText
} from 'lucide-react';
import { MosquePhysicalBox } from '../types';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

interface MosqueBoxDonationModalProps {
  mosqueBox: MosquePhysicalBox | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MosqueBoxDonationModal: React.FC<MosqueBoxDonationModalProps> = ({
  mosqueBox,
  isOpen,
  onClose
}) => {
  const { addNewTransaction, setSelectedReceiptTx, userProfile } = useApp();

  const [selectedAmount, setSelectedAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'VA_BSI' | 'VA_MANDIRI' | 'LYNK_PAY' | 'CRYPTO_USDT'>('QRIS');
  const [prayerNote, setPrayerNote] = useState<string>('Bismillah, sedekah jumat berkah untuk kemakmuran masjid & kaum dhuafa.');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !mosqueBox) return null;

  const currentAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handleConfirmDonation = () => {
    if (currentAmount <= 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Trigger festive confetti
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2E7D32', '#4CAF50', '#81C784', '#FFD54F']
        });
      } catch {}

      const newTx = addNewTransaction({
        charityId: mosqueBox.mosqueId,
        charityName: `${mosqueBox.mosqueName} (${mosqueBox.boxLabel})`,
        donorName: isAnonymous ? 'Hamba Allah' : userProfile.name,
        amount: currentAmount,
        type: 'INFAQ_SEDEKAH',
        isAnonymous,
        asnafTarget: mosqueBox.targetAsnaf || 'FISABILILLAH',
        smartContract: `0xMosquePhysicalBox_${mosqueBox.id.toUpperCase()}`,
        status: 'CONFIRMED',
      });

      setIsSubmitting(false);
      onClose();
      setSelectedReceiptTx(newTx);
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4] my-auto space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D8DFD8] dark:border-[#2D332D]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#2E7D32] dark:text-[#4CAF50] tracking-wider block">
                Kotak Amal Fisik Terverifikasi
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-[#141A14] dark:text-[#E4E8E4]">
                Infaq Kotak Amal Masjid
              </h3>
            </div>
          </div>

          <button
            id="btn-close-mosque-donation-modal"
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scanned Mosque Box Info Card */}
        <div className="p-3.5 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] flex items-start gap-3">
          <img
            src={mosqueBox.photoUrl}
            alt={mosqueBox.mosqueName}
            className="w-16 h-16 rounded-xl object-cover border border-[#D8DFD8] dark:border-[#2D332D] shrink-0"
          />
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-[#2E7D32] text-white text-[10px] font-extrabold">
                {mosqueBox.boxType.replace('_', ' ')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#1A1D1A] text-[#2E7D32] dark:text-[#4CAF50] text-[10px] font-bold border border-[#D8DFD8] dark:border-[#2D332D]">
                DKM Terakreditasi
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4] leading-snug">
              {mosqueBox.mosqueName}
            </h4>
            <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#2E7D32] dark:text-[#4CAF50] shrink-0" />
              <span className="truncate">{mosqueBox.locationDetails} • {mosqueBox.city}</span>
            </p>
            <div className="text-[10px] font-mono text-[#5A665B] dark:text-[#A0A8A0]">
              NMID: {mosqueBox.qrisNmid} • {mosqueBox.dkmAccount}
            </div>
          </div>
        </div>

        {/* Niat & Akad Infaq Reminder */}
        <div className="p-3 rounded-xl bg-[#2E7D32]/10 border border-[#2E7D32]/20 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">
            <HeartHandshake className="w-4 h-4" />
            <span>Niat Akad Sedekah / Infaq Masjid:</span>
          </div>
          <p className="text-[11px] text-[#141A14] dark:text-[#E4E8E4] italic">
            "Nawaitu an uthliqa hadzihis shadaqah lillahi Ta'ala (Saya berniat mengeluarkan sedekah/infaq ini semata-mata karena Allah Ta'ala)."
          </p>
        </div>

        {/* Amount Presets */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4] block">
            Pilih Nominal Infaq:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {mosqueBox.suggestedAmounts.map(amt => (
              <button
                key={amt}
                id={`btn-preset-mosque-amt-${amt}`}
                onClick={() => {
                  setSelectedAmount(amt);
                  setCustomAmount('');
                }}
                className={`py-2 px-2.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                  selectedAmount === amt && !customAmount
                    ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                    : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4]'
                }`}
              >
                Rp {amt.toLocaleString('id-ID')}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0] text-xs">
              Nominal Bebas: Rp
            </span>
            <input
              type="number"
              id="input-custom-mosque-amt"
              placeholder="Contoh: 75000"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full pl-36 pr-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-mono font-bold text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:border-[#2E7D32]"
            />
          </div>
        </div>

        {/* Payment Channels */}
        <div className="space-y-2 text-xs">
          <label className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] block">
            Metode Pembayaran Instan:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'QRIS', label: 'QRIS Real-Time (Semua Bank / Dompet Digital)', icon: QrCode },
              { id: 'VA_BSI', label: 'BSI Virtual Account', icon: CreditCard },
              { id: 'LYNK_PAY', label: 'Lynk.id Pay / Dompet Syariah', icon: Sparkles },
              { id: 'CRYPTO_USDT', label: 'USDT Sharia 0-Fee', icon: ShieldCheck },
            ].map(p => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  id={`btn-pay-channel-${p.id.toLowerCase()}`}
                  onClick={() => setPaymentMethod(p.id as any)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    paymentMethod === p.id
                      ? 'bg-[#2E7D32]/10 border-[#2E7D32] text-[#2E7D32] dark:text-[#4CAF50] font-bold'
                      : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50] shrink-0" />
                  <span className="text-[11px] leading-tight">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prayer / Doa Note */}
        <div className="space-y-1 text-xs">
          <label className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] block">
            Doa & Hajat untuk Jamaah / Keluarga:
          </label>
          <input
            type="text"
            id="input-mosque-prayer-note"
            value={prayerNote}
            onChange={(e) => setPrayerNote(e.target.value)}
            className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:border-[#2E7D32]"
          />
        </div>

        {/* Anonymous Toggle */}
        <label className="flex items-center gap-2 text-xs font-medium text-[#141A14] dark:text-[#E4E8E4] cursor-pointer">
          <input
            type="checkbox"
            id="check-anonymous-mosque-infaq"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="rounded text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
          />
          <span>Donasi sebagai <strong>Hamba Allah</strong> (Sembunyikan Nama pada Layar Kas Masjid)</span>
        </label>

        {/* Confirm Action Button */}
        <button
          id="btn-confirm-mosque-infaq-submit"
          onClick={handleConfirmDonation}
          disabled={isSubmitting || currentAmount <= 0}
          className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-black text-xs shadow-lg shadow-[#2E7D32]/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>
            {isSubmitting 
              ? 'Memproses Mutasi On-Chain...' 
              : `Salurkan Infaq Rp ${currentAmount.toLocaleString('id-ID')}`
            }
          </span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
          <span>Tersinkronisasi langsung dengan buku besar transparansi masjid & bukti setor sah.</span>
        </div>

      </div>
    </div>
  );
};
