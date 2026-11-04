import React, { useState } from 'react';
import { 
  CheckSquare, 
  Calculator, 
  BookOpen, 
  Plane, 
  Coins, 
  Compass, 
  Sparkles, 
  Search, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HajjChecklistSection } from '../hajj/HajjChecklistSection';
import { HajjSavingsCalculatorSection } from '../hajj/HajjSavingsCalculatorSection';
import { HajjManasikGuideSection } from '../hajj/HajjManasikGuideSection';

type SubView = 'CHECKLIST' | 'CALCULATOR' | 'MANASIK_GUIDE';

export const HajjUmrahTab: React.FC = () => {
  const { goldPricePerGram } = useApp();
  const [activeSubView, setActiveSubView] = useState<SubView>('CHECKLIST');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1B361E] via-[#152B18] to-[#0E1B0F] border border-[#2D332D] text-white p-6 sm:p-8 md:p-10 shadow-xl">
        {/* Subtle Decorative Background Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none flex items-center justify-end pr-6">
          <svg className="w-80 h-80 text-white" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-300">
            <Plane className="w-3.5 h-3.5" />
            <span>Pusat Kesiapan Safar Baitullah & Manasik Mandiri</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Persiapan Ibadah Haji & Umrah Terpadu
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#E4E8E4]/90 leading-relaxed max-w-2xl">
            Rencanakan perjalanan suci Anda dengan checklist perlengkapan komprehensif, panduan manasik sunnah dengan audio doa, serta kalkulator tabungan syariah lindung nilai emas.
          </p>
        </div>

        {/* Quick Highlights Grid */}
        <div className="relative z-10 mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-bold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Setoran Porsi Siskohat</span>
            </div>
            <span className="text-sm sm:text-base font-black text-white block">
              Rp 25.000.000
            </span>
            <span className="text-[10px] text-[#E4E8E4]/70">Dapat Nomor Porsi Kemenag</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-bold mb-1">
              <Coins className="w-3.5 h-3.5" />
              <span>Harga Emas Antam</span>
            </div>
            <span className="text-sm sm:text-base font-black text-white block">
              Rp {(goldPricePerGram / 1000).toLocaleString('id-ID')} rb <span className="text-[10px] font-normal">/g</span>
            </span>
            <span className="text-[10px] text-[#E4E8E4]/70">Lindung Nilai Inflasi</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-bold mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Kurs Riyal Saudi (SAR)</span>
            </div>
            <span className="text-sm sm:text-base font-black text-white block">
              ± Rp 4.250 <span className="text-[10px] font-normal">/SAR</span>
            </span>
            <span className="text-[10px] text-[#E4E8E4]/70">Acuan Living Cost Makkah</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Aplikasi Wajib Saudi</span>
            </div>
            <span className="text-sm sm:text-base font-black text-white block">
              Nusuk App
            </span>
            <span className="text-[10px] text-[#E4E8E4]/70">Izin Masuk Raudhah</span>
          </div>

        </div>
      </div>

      {/* Main Sub-Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#1A1D1A] p-2 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm">
        
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            onClick={() => setActiveSubView('CHECKLIST')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubView === 'CHECKLIST'
                ? 'bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/30'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Checklist Persiapan & Koper</span>
          </button>

          <button
            onClick={() => setActiveSubView('CALCULATOR')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubView === 'CALCULATOR'
                ? 'bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/30'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Kalkulator Tabungan Safar</span>
          </button>

          <button
            onClick={() => setActiveSubView('MANASIK_GUIDE')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubView === 'MANASIK_GUIDE'
                ? 'bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/30'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Panduan Manasik & Doa Audio</span>
          </button>
        </div>

        <div className="text-xs text-[#5A665B] dark:text-[#A0A8A0] px-2 hidden md:block">
          🕋 <em>"Labbaik Allahumma Labbaik..."</em>
        </div>

      </div>

      {/* Dynamic Sub-View Content */}
      <div className="transition-all duration-200">
        {activeSubView === 'CHECKLIST' && <HajjChecklistSection />}
        {activeSubView === 'CALCULATOR' && <HajjSavingsCalculatorSection />}
        {activeSubView === 'MANASIK_GUIDE' && <HajjManasikGuideSection />}
      </div>

    </div>
  );
};
