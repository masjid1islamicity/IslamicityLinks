import React, { useState } from 'react';
import { 
  X, 
  Gift, 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  Copy, 
  ArrowRight, 
  Award,
  ShieldCheck,
  Plane,
  BookOpen,
  Heart
} from 'lucide-react';
import { LuckyWheelVoucher } from '../../types';
import { INITIAL_LUCKY_VOUCHERS } from '../../data/talksData';
import { useApp } from '../../context/AppContext';

interface LuckyWheelBerkahModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToHajj?: () => void;
}

export const LuckyWheelBerkahModal: React.FC<LuckyWheelBerkahModalProps> = ({
  isOpen,
  onClose,
  onNavigateToHajj
}) => {
  const { addNotification, setActiveTab } = useApp();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [wonPrize, setWonPrize] = useState<LuckyWheelVoucher | null>(null);
  const [spinTickets, setSpinTickets] = useState(2);
  const [claimedCodes, setClaimedCodes] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const prizes = INITIAL_LUCKY_VOUCHERS;
  const segmentAngle = 360 / prizes.length;

  const handleSpinWheel = () => {
    if (isSpinning || spinTickets <= 0) return;

    setIsSpinning(true);
    setWonPrize(null);
    setIsCopied(false);

    // Pick random prize index
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const targetPrize = prizes[prizeIndex];

    // Calculate rotation to land on the chosen prize
    // 5 full rotations (1800 deg) + offset
    const randomOffset = Math.floor(Math.random() * 20) - 10;
    const finalAngle = 1800 + (360 - (prizeIndex * segmentAngle + segmentAngle / 2)) + randomOffset;

    setRotationDegrees(prev => prev + finalAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(targetPrize);
      setSpinTickets(prev => Math.max(0, prev - 1));
      setClaimedCodes(prev => [...prev, targetPrize.code]);

      addNotification({
        title: '🎉 Selamat! Anda Mendapatkan Voucher',
        message: `Anda memenangkan "${targetPrize.name}" (${targetPrize.discountValue}). Kode: ${targetPrize.code}`,
        type: 'VERIFICATION'
      });
    }, 4000);
  };

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);

      addNotification({
        title: 'Kode Voucher Disalin',
        message: `Kode voucher ${code} berhasil disalin. Gunakan saat pendaftaran paket.`,
        type: 'GENERAL'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl border border-amber-400/40 max-w-xl w-full overflow-hidden shadow-2xl relative">
        
        {/* Decorative Glowing Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 border-b border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between bg-gradient-to-r from-amber-50 via-white to-emerald-50 dark:from-amber-950/20 dark:via-[#1A1D1A] dark:to-emerald-950/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-500 text-white shadow-md">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  HADIAH DAKWAH ISLAMICITY
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              </div>
              <h3 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                Roda Berkah: Gratis Voucher Haji & Umrah
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white dark:bg-[#242924] hover:bg-[#EEF3EE] dark:hover:bg-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] border border-[#D8DFD8] dark:border-[#2D332D] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Wheel Graphic Container */}
          <div className="relative flex flex-col items-center justify-center">
            
            {/* Pointer / Needle Indicator */}
            <div className="absolute -top-3 z-30 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-red-600 drop-shadow-md" />
            </div>

            {/* Rotating Wheel Graphic */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-amber-400 shadow-2xl p-1 bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-400">
              <div 
                className="w-full h-full rounded-full relative overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
                style={{ transform: `rotate(${rotationDegrees}deg)` }}
              >
                {/* 6 Wheel Segments */}
                <div className="absolute inset-0 bg-[#059669] [clip-path:polygon(50%_50%,0_0,100%_0)]" />
                <div className="absolute inset-0 bg-[#D97706] rotate-60 [clip-path:polygon(50%_50%,0_0,100%_0)]" />
                <div className="absolute inset-0 bg-[#2563EB] rotate-120 [clip-path:polygon(50%_50%,0_0,100%_0)]" />
                <div className="absolute inset-0 bg-[#7C3AED] rotate-180 [clip-path:polygon(50%_50%,0_0,100%_0)]" />
                <div className="absolute inset-0 bg-[#DB2777] rotate-240 [clip-path:polygon(50%_50%,0_0,100%_0)]" />
                <div className="absolute inset-0 bg-[#0D9488] rotate-300 [clip-path:polygon(50%_50%,0_0,100%_0)]" />

                {/* Segment Labels */}
                <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-black uppercase pointer-events-none">
                  <span className="absolute top-4 font-extrabold tracking-tight">Umrah 5 Jt</span>
                  <span className="absolute right-4 rotate-60 font-extrabold tracking-tight">Haji 2.5 Jt</span>
                  <span className="absolute bottom-10 right-6 rotate-120 font-extrabold tracking-tight">Kitab Free</span>
                  <span className="absolute bottom-4 rotate-180 font-extrabold tracking-tight">Infaq 50k</span>
                  <span className="absolute bottom-10 left-6 -rotate-120 font-extrabold tracking-tight">VIP Pass</span>
                  <span className="absolute left-4 -rotate-60 font-extrabold tracking-tight">Doa Raudhah</span>
                </div>
              </div>

              {/* Center Spinning Hub Button */}
              <button
                id="btn-spin-wheel-center"
                onClick={handleSpinWheel}
                disabled={isSpinning || spinTickets <= 0}
                className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white dark:bg-[#1A1D1A] border-4 border-amber-400 shadow-xl flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-80 transition-transform z-20 group"
              >
                <RotateCw className={`w-5 h-5 text-amber-600 dark:text-amber-400 ${isSpinning ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} />
                <span className="text-[10px] font-black uppercase text-[#141A14] dark:text-[#E4E8E4] mt-0.5">
                  {isSpinning ? 'MEMUTAR...' : 'PUTAR'}
                </span>
              </button>
            </div>

            {/* Ticket Counter Info */}
            <div className="mt-4 text-xs font-semibold text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1.5">
              <span>Kesempatan Putar Hari Ini:</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-extrabold">
                {spinTickets} Tiket Tersisa
              </span>
            </div>
          </div>

          {/* WON PRIZE CELEBRATION CARD */}
          {wonPrize && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-transparent border-2 border-amber-400 dark:border-amber-500/50 space-y-3 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-500 text-white">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-[10px] text-amber-700 dark:text-amber-300 font-black uppercase tracking-wider">
                      SELAMAT! ANDA MENDAPATKAN:
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                      {wonPrize.name} ({wonPrize.discountValue})
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs">
                  {wonPrize.discountValue}
                </span>
              </div>

              <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed">
                {wonPrize.description} • {wonPrize.terms}
              </p>

              {/* Voucher Code Box */}
              <div className="p-3 rounded-xl bg-white dark:bg-[#141714] border border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] text-[#A0A8A0] uppercase font-bold">Kode Voucher Unik:</div>
                  <div className="font-mono text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 tracking-wider">
                    {wonPrize.code}
                  </div>
                </div>

                <button
                  onClick={() => handleCopyCode(wonPrize.code)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
              </div>

              {/* Action to use on Hajj Tab */}
              {(wonPrize.category === 'HAJJ' || wonPrize.category === 'UMRAH') && (
                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('hajj-umrah');
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Plane className="w-4 h-4" />
                  <span>Gunakan Voucher pada Tab Haji & Umrah</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#D8DFD8] dark:border-[#2D332D] bg-[#F8FAF8] dark:bg-[#141714] flex items-center justify-between text-xs text-[#5A665B] dark:text-[#A0A8A0]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Program Berkah Resmi Pusat Dakwah Islamicity</span>
          </span>

          <button
            onClick={onClose}
            className="font-bold hover:text-[#141A14] dark:hover:text-[#E4E8E4]"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
