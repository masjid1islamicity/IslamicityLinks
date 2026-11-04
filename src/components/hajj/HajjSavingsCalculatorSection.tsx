import React, { useState } from 'react';
import { 
  Calculator, 
  Coins, 
  Calendar, 
  TrendingUp, 
  Wallet, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Printer, 
  Share2, 
  ShieldCheck, 
  Building2, 
  Clock, 
  AlertCircle,
  HelpCircle,
  PiggyBank
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PILGRIMAGE_PACKAGES } from '../../data/hajjData';
import { PilgrimageType } from '../../types';

export const HajjSavingsCalculatorSection: React.FC = () => {
  const { goldPricePerGram, addNotification } = useApp();

  // Package & Calculation State
  const [selectedType, setSelectedType] = useState<PilgrimageType>('UMRAH_REGULER');
  const [customCost, setCustomCost] = useState<number>(35000000);
  const [initialSavings, setInitialSavings] = useState<number>(5000000);
  const [extraPocketMoney, setExtraPocketMoney] = useState<number>(7500000); // SAR 1.700 + Paspor + Vaksin + Dam
  const [durationMonths, setDurationMonths] = useState<number>(12);
  const [savingFrequency, setSavingFrequency] = useState<'MONTHLY' | 'WEEKLY' | 'DAILY'>('MONTHLY');
  const [strategy, setStrategy] = useState<'GOLD_HEDGE' | 'SYARIAH_SAVINGS' | 'SUKUK_MUTUAL_FUND'>('GOLD_HEDGE');
  const [isAutodebitModalOpen, setIsAutodebitModalOpen] = useState(false);
  const [autodebitBank, setAutodebitBank] = useState('BSI_HAJI');
  const [autodebitSuccess, setAutodebitSuccess] = useState(false);

  // Selected package details
  const activePackage = PILGRIMAGE_PACKAGES.find(p => p.type === selectedType);
  const baseCost = selectedType === 'CUSTOM' ? customCost : (activePackage?.estimatedCostIdr || 32000000);
  const totalTarget = baseCost + extraPocketMoney;
  const remainingNeeded = Math.max(0, totalTarget - initialSavings);

  // Time calculations
  const monthlyNeeded = durationMonths > 0 ? Math.ceil(remainingNeeded / durationMonths) : remainingNeeded;
  const weeklyNeeded = Math.ceil(monthlyNeeded / 4.33);
  const dailyNeeded = Math.ceil(monthlyNeeded / 30);

  // Gold equivalent calculations
  const targetGoldGrams = (totalTarget / goldPricePerGram).toFixed(2);
  const initialGoldGrams = (initialSavings / goldPricePerGram).toFixed(2);
  const remainingGoldGrams = (remainingNeeded / goldPricePerGram).toFixed(2);
  const monthlyGoldGrams = durationMonths > 0 ? (parseFloat(remainingGoldGrams) / durationMonths).toFixed(2) : remainingGoldGrams;

  // Percentage funded
  const progressPercent = Math.min(100, Math.round((initialSavings / totalTarget) * 100));

  const formatIdr = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleSelectPackage = (type: PilgrimageType, defaultCost: number, defaultMonths: number) => {
    setSelectedType(type);
    if (type !== 'CUSTOM') {
      setDurationMonths(defaultMonths);
    }
  };

  const handleSimulateAutodebit = (e: React.FormEvent) => {
    e.preventDefault();
    setAutodebitSuccess(true);
    addNotification({
      title: 'Autodebit Tabungan Haji Berhasil Dijadwalkan!',
      message: `Setoran otomatis sebesar ${formatIdr(monthlyNeeded)}/bulan via ${autodebitBank} telah aktif untuk target ${activePackage?.name || 'Safar Baitullah'}.`,
      type: 'SECURITY',
      linkTab: 'hajj-umrah'
    });
    setTimeout(() => {
      setIsAutodebitModalOpen(false);
      setAutodebitSuccess(false);
    }, 2000);
  };

  return (
    <div id="hajj-savings-calculator-section" className="space-y-8">
      
      {/* Header & Quick Intro */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-[#1F3D22] via-[#172E19] to-[#121E13] text-white shadow-lg border border-[#2D332D]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4CAF50]/20 border border-[#4CAF50]/30 text-[#4CAF50] text-xs font-bold">
              <Coins className="w-3.5 h-3.5" />
              <span>Perencanaan Keuangan Syariah Bebas Riba</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Kalkulator Tabungan Haji & Umrah
            </h2>
            <p className="text-xs sm:text-sm text-[#E4E8E4]/90 max-w-2xl leading-relaxed">
              Simulasikan akumulasi dana keberangkatan ke Baitullah dengan pilihan strategi lindung nilai emas (Gold Hedge) atau rekening tabungan haji syariah resmi.
            </p>
          </div>

          {/* Gold Nisab Live Indicator */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15 text-right">
            <span className="text-[11px] text-[#E4E8E4]/90 font-medium block">
              Harga Emas Antam Hari Ini
            </span>
            <span className="text-lg sm:text-xl font-black text-amber-300">
              {formatIdr(goldPricePerGram)} <span className="text-xs text-white font-normal">/gram</span>
            </span>
          </div>
        </div>
      </div>

      {/* Package Selection Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
          <span>Pilih Paket Target Perjalanan Ibadah:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {PILGRIMAGE_PACKAGES.map(pkg => {
            const isSelected = selectedType === pkg.type;

            return (
              <div
                key={pkg.type}
                onClick={() => handleSelectPackage(pkg.type, pkg.estimatedCostIdr, pkg.durationMonthsDefault)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#2E7D32]/10 via-[#2E7D32]/5 to-transparent border-[#2E7D32] dark:border-[#4CAF50] shadow-md ring-2 ring-[#2E7D32]/30'
                    : 'bg-white dark:bg-[#1A1D1A] border-[#D8DFD8] dark:border-[#2D332D] hover:border-[#2E7D32]/40'
                }`}
              >
                {pkg.badge && (
                  <span className="absolute right-3 top-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] border border-[#2E7D32]/20">
                    {pkg.badge}
                  </span>
                )}

                <div>
                  <h4 className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4] pr-16">
                    {pkg.name}
                  </h4>
                  <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] mt-0.5">
                    {pkg.subtitle}
                  </p>
                  <div className="mt-3">
                    <span className="text-xs text-[#5A665B] dark:text-[#A0A8A0] block">Estimasi Biaya:</span>
                    <span className="text-base font-black text-[#2E7D32] dark:text-[#4CAF50]">
                      {formatIdr(pkg.estimatedCostIdr)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
                  {pkg.features.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                      <CheckCircle2 className="w-3 h-3 text-[#2E7D32] dark:text-[#4CAF50] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Custom Package Card */}
          <div
            onClick={() => setSelectedType('CUSTOM')}
            className={`p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
              selectedType === 'CUSTOM'
                ? 'bg-gradient-to-br from-[#2E7D32]/10 via-[#2E7D32]/5 to-transparent border-[#2E7D32] dark:border-[#4CAF50] shadow-md ring-2 ring-[#2E7D32]/30'
                : 'bg-white dark:bg-[#1A1D1A] border-[#D8DFD8] dark:border-[#2D332D] hover:border-[#2E7D32]/40'
            }`}
          >
            <div>
              <h4 className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                Target Kustom Pribadi
              </h4>
              <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] mt-0.5">
                Tentukan target nominal anggaran sendiri
              </p>
              <div className="mt-3">
                <span className="text-xs text-[#5A665B] dark:text-[#A0A8A0] block">Nominal Fleksibel:</span>
                <span className="text-base font-black text-[#2E7D32] dark:text-[#4CAF50]">
                  {formatIdr(customCost)}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#D8DFD8] dark:border-[#2D332D] flex items-center gap-1.5 text-[11px] text-[#2E7D32] dark:text-[#4CAF50] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bebas Menyesuaikan Anggaran</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Calculator Form & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5 bg-white dark:bg-[#1A1D1A] p-5 sm:p-6 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm">
          <h3 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
            <span>Parameter Tabungan & Target Safar</span>
          </h3>

          {/* Custom Cost Input (if Custom) */}
          {selectedType === 'CUSTOM' && (
            <div>
              <label className="block text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] mb-1">
                Biaya Paket Kustom Pokok (Rp)
              </label>
              <input
                type="number"
                step="1000000"
                value={customCost}
                onChange={(e) => setCustomCost(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 text-sm font-mono font-bold rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>
          )}

          {/* Initial Savings Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                Dana Awal / Tabungan Saat Ini
              </label>
              <span className="text-xs font-mono font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                {formatIdr(initialSavings)}
              </span>
            </div>
            <input
              type="number"
              step="500000"
              value={initialSavings}
              onChange={(e) => setInitialSavings(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2.5 text-sm font-mono font-bold rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            />
            <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] mt-1">
              Setara dengan ±<strong>{initialGoldGrams} gram emas</strong> pada harga pasar saat ini.
            </p>
          </div>

          {/* Extra Costs (Pocket Money, Passport, Dam, Vaccine) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                Estimasi Biaya Tambahan (Uang Saku SAR + Paspor & Vaksin + Dam Hadyu)
              </label>
              <span className="text-xs font-mono font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                {formatIdr(extraPocketMoney)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setExtraPocketMoney(5000000)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors ${
                  extraPocketMoney === 5000000 
                    ? 'bg-[#2E7D32] text-white border-[#2E7D32]' 
                    : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D]'
                }`}
              >
                Hemat (Rp 5 Jt)
              </button>
              <button
                type="button"
                onClick={() => setExtraPocketMoney(7500000)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors ${
                  extraPocketMoney === 7500000 
                    ? 'bg-[#2E7D32] text-white border-[#2E7D32]' 
                    : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D]'
                }`}
              >
                Standar (Rp 7.5 Jt)
              </button>
              <button
                type="button"
                onClick={() => setExtraPocketMoney(12000000)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors ${
                  extraPocketMoney === 12000000 
                    ? 'bg-[#2E7D32] text-white border-[#2E7D32]' 
                    : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D]'
                }`}
              >
                Leluasa (Rp 12 Jt)
              </button>
            </div>
          </div>

          {/* Target Duration Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                Target Jangka Waktu Menabung: <span className="text-[#2E7D32] dark:text-[#4CAF50]">{durationMonths} Bulan ({ (durationMonths / 12).toFixed(1) } Tahun)</span>
              </label>
              <span className="text-xs font-mono font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                {durationMonths} bln
              </span>
            </div>

            <input
              type="range"
              min="3"
              max="72"
              step="3"
              value={durationMonths}
              onChange={(e) => setDurationMonths(Number(e.target.value))}
              className="w-full accent-[#2E7D32] h-2 bg-[#D8DFD8] dark:bg-[#2D332D] rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-[#A0A8A0] mt-1 font-mono">
              <span>3 Bln</span>
              <span>12 Bln (1 Thn)</span>
              <span>24 Bln (2 Thn)</span>
              <span>36 Bln (3 Thn)</span>
              <span>60 Bln (5 Thn)</span>
            </div>
          </div>

          {/* Investment Strategy Choice */}
          <div>
            <label className="block text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] mb-1.5">
              Strategi Portofolio Dana Safar
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStrategy('GOLD_HEDGE')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  strategy === 'GOLD_HEDGE'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-400/30'
                    : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs">
                  <span>🪙</span>
                  <span>Tabung Emas Antam</span>
                </div>
                <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] mt-1">
                  Lindung nilai inflasi & kurs Riyal (SAR).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStrategy('SYARIAH_SAVINGS')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  strategy === 'SYARIAH_SAVINGS'
                    ? 'bg-[#2E7D32]/10 border-[#2E7D32] ring-2 ring-[#2E7D32]/30'
                    : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-xs">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Tabungan Haji BSI</span>
                </div>
                <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] mt-1">
                  Terkoneksi Siskohat & pendaftaran porsi resmi.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStrategy('SUKUK_MUTUAL_FUND')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  strategy === 'SUKUK_MUTUAL_FUND'
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-400/30'
                    : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Sukuk / Reksadana</span>
                </div>
                <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] mt-1">
                  Imbal hasil syariah kompetitif 5-7% p.a.
                </p>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Calculation Summary Card & Milestones (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-gradient-to-br from-white via-[#F7FAF7] to-[#EBF3EB] dark:from-[#1E231E] dark:via-[#191F19] dark:to-[#141A14] p-6 rounded-2xl border-2 border-[#2E7D32]/30 dark:border-[#4CAF50]/30 shadow-md">
            <span className="text-[11px] font-bold text-[#2E7D32] dark:text-[#4CAF50] uppercase tracking-wider block">
              Ringkasan Rekomendasi Finansial
            </span>

            {/* Target Total */}
            <div className="mt-2 pb-4 border-b border-[#D8DFD8] dark:border-[#2D332D]">
              <span className="text-xs text-[#5A665B] dark:text-[#A0A8A0] block">
                Total Target Dana yang Diperlukan:
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#141A14] dark:text-[#E4E8E4]">
                  {formatIdr(totalTarget)}
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  (≈ {targetGoldGrams}g Emas)
                </span>
              </div>
            </div>

            {/* Frequency Selection */}
            <div className="mt-4">
              <div className="flex items-center justify-between gap-1 bg-[#EEF3EE] dark:bg-[#242924] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSavingFrequency('MONTHLY')}
                  className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                    savingFrequency === 'MONTHLY' 
                      ? 'bg-[#2E7D32] text-white shadow-sm' 
                      : 'text-[#5A665B] dark:text-[#A0A8A0]'
                  }`}
                >
                  Per Bulan
                </button>
                <button
                  type="button"
                  onClick={() => setSavingFrequency('WEEKLY')}
                  className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                    savingFrequency === 'WEEKLY' 
                      ? 'bg-[#2E7D32] text-white shadow-sm' 
                      : 'text-[#5A665B] dark:text-[#A0A8A0]'
                  }`}
                >
                  Per Minggu
                </button>
                <button
                  type="button"
                  onClick={() => setSavingFrequency('DAILY')}
                  className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                    savingFrequency === 'DAILY' 
                      ? 'bg-[#2E7D32] text-white shadow-sm' 
                      : 'text-[#5A665B] dark:text-[#A0A8A0]'
                  }`}
                >
                  Per Hari
                </button>
              </div>
            </div>

            {/* Primary Result Box */}
            <div className="mt-4 p-4 rounded-xl bg-[#2E7D32] text-white text-center shadow-lg shadow-[#2E7D32]/20">
              <span className="text-xs text-emerald-100 font-medium">
                Komitmen Setoran Rutin yang Dibutuhkan:
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1">
                {savingFrequency === 'MONTHLY' && formatIdr(monthlyNeeded)}
                {savingFrequency === 'WEEKLY' && formatIdr(weeklyNeeded)}
                {savingFrequency === 'DAILY' && formatIdr(dailyNeeded)}
              </div>
              <span className="text-[11px] text-emerald-200 mt-1 block">
                {savingFrequency === 'MONTHLY' && `atau kumpulkan ± ${monthlyGoldGrams} gram emas per bulan`}
                {savingFrequency === 'WEEKLY' && `selama ${Math.ceil(durationMonths * 4.33)} pekan ke depan`}
                {savingFrequency === 'DAILY' && `selama ${durationMonths * 30} hari konsisten`}
              </span>
            </div>

            {/* Progress Meter */}
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#5A665B] dark:text-[#A0A8A0]">Koleksi Dana Terkumpul:</span>
                <span className="text-[#2E7D32] dark:text-[#4CAF50]">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#D8DFD8] dark:bg-[#2D332D] h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2E7D32] rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                <span>Tersedia: {formatIdr(initialSavings)}</span>
                <span>Kekurangan: {formatIdr(remainingNeeded)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={() => setIsAutodebitModalOpen(true)}
                className="w-full py-3 rounded-xl bg-[#141A14] hover:bg-[#2E7D32] dark:bg-white dark:text-[#141A14] dark:hover:bg-[#4CAF50] text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <PiggyBank className="w-4 h-4" />
                <span>Jadwalkan Autodebit Tabungan Safar</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-white dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4] transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Rencana Perjalanan Suci (PDF)</span>
              </button>
            </div>

          </div>

          {/* Milestones Road Map Card */}
          <div className="bg-white dark:bg-[#1A1D1A] p-5 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm">
            <h4 className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] uppercase tracking-wider mb-3">
              Tahapan Pencapaian (Milestone Roadmap)
            </h4>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#D8DFD8] dark:before:bg-[#2D332D]">
              
              <div className="relative flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold z-10 ${
                  initialSavings >= 2500000 
                    ? 'bg-[#2E7D32] text-white ring-4 ring-[#2E7D32]/20' 
                    : 'bg-[#D8DFD8] dark:bg-[#2D332D] text-[#5A665B]'
                }`}>
                  1
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Tahap 1: Berkas Paspor & Vaksin ICV (Rp 2,5 Jt)
                  </h5>
                  <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                    {initialSavings >= 2500000 ? '✅ Dana paspor & vaksin telah terpenuhi' : 'Fokuskan tabungan awal untuk paspor & vaksinasi'}
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold z-10 ${
                  initialSavings >= 25000000 
                    ? 'bg-[#2E7D32] text-white ring-4 ring-[#2E7D32]/20' 
                    : 'bg-[#D8DFD8] dark:bg-[#2D332D] text-[#5A665B]'
                }`}>
                  2
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Tahap 2: Setoran Awal Nomor Porsi Siskohat (Rp 25 Jt)
                  </h5>
                  <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                    Mendapatkan nomor antrean porsi resmi Kemenag RI.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold z-10 ${
                  initialSavings >= totalTarget 
                    ? 'bg-[#2E7D32] text-white ring-4 ring-[#2E7D32]/20' 
                    : 'bg-[#D8DFD8] dark:bg-[#2D332D] text-[#5A665B]'
                }`}>
                  3
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Tahap 3: Pelunasan 100% + Living Cost SAR
                  </h5>
                  <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                    Dana lunas penuh siap melangkah ke Tanah Suci.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Autodebit Scheduling Modal */}
      {isAutodebitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1D1A] w-full max-w-md rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between bg-[#EEF3EE]/50 dark:bg-[#242924]/50">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <h3 className="font-bold text-sm text-[#141A14] dark:text-[#E4E8E4]">
                  Jadwal Autodebit Tabungan Safar
                </h3>
              </div>
              <button
                onClick={() => setIsAutodebitModalOpen(false)}
                className="text-xs text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]"
              >
                ✕
              </button>
            </div>

            {autodebitSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                  Autodebit Berhasil Disimpan!
                </h4>
                <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                  Setoran {formatIdr(monthlyNeeded)} akan didebit otomatis setiap tanggal 25 menuju rekening tabungan haji syariah Anda.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSimulateAutodebit} className="p-5 space-y-4">
                <div className="p-3 rounded-xl bg-[#2E7D32]/10 border border-[#2E7D32]/20 text-xs text-[#2E7D32] dark:text-[#4CAF50]">
                  🎯 <strong>Target:</strong> {activePackage?.name || 'Safar Baitullah'} senilai {formatIdr(totalTarget)} ({durationMonths} Bulan).
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] mb-1">
                    Rekening Debet Sumber Dana
                  </label>
                  <select
                    value={autodebitBank}
                    onChange={(e) => setAutodebitBank(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] focus:outline-none"
                  >
                    <option value="BSI_HAJI">Bank Syariah Indonesia (BSI) — Tabungan Haji Mabrur</option>
                    <option value="MUAMALAT_HAJI">Bank Muamalat — Tabungan Haji Arafah</option>
                    <option value="MANDIRI_SYARIAH">Livin' Syariah Autodebit</option>
                    <option value="LYNK_WALLET">Lynk.id Creator Sharia Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] mb-1">
                    Nominal Setoran Rutin Bulanan
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formatIdr(monthlyNeeded)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] mb-1">
                    Tanggal Debet Otomatis
                  </label>
                  <select className="w-full px-3 py-2 text-xs rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] focus:outline-none">
                    <option>Setiap Tanggal 25 (Setelah Gajian)</option>
                    <option>Setiap Tanggal 1 Awal Bulan</option>
                    <option>Setiap Hari Jumat Berkah</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAutodebitModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold shadow-md shadow-[#2E7D32]/25 hover:bg-[#256629]"
                  >
                    Aktifkan Autodebit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
