import React, { useState } from 'react';
import { 
  BookOpen, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  Compass, 
  Smartphone, 
  ShieldAlert, 
  Info,
  Copy,
  Check
} from 'lucide-react';
import { PILGRIMAGE_GUIDE_STEPS, IHRAM_PROHIBITIONS, NUSUK_RAWDAH_GUIDE } from '../../data/hajjData';
import { PilgrimageGuideStep } from '../../types';

export const HajjManasikGuideSection: React.FC = () => {
  const [activeGuideView, setActiveGuideView] = useState<'UMRAH' | 'HAJJ' | 'PROHIBITIONS' | 'NUSUK_RAWDAH'>('UMRAH');
  const [expandedStepId, setExpandedStepId] = useState<string>('guide-step-1');
  const [playingDuaId, setPlayingDuaId] = useState<string | null>(null);
  const [copiedDuaId, setCopiedDuaId] = useState<string | null>(null);

  const filteredSteps = PILGRIMAGE_GUIDE_STEPS.filter(step => {
    if (activeGuideView === 'UMRAH') {
      return step.tripType === 'UMRAH' || step.tripType === 'BOTH';
    }
    if (activeGuideView === 'HAJJ') {
      return step.tripType === 'HAJJ' || step.tripType === 'BOTH';
    }
    return true;
  });

  const toggleStep = (id: string) => {
    setExpandedStepId(prev => prev === id ? '' : id);
  };

  // Audio / Speech Synthesizer for Arabic Du'as
  const handlePlayAudio = (step: PilgrimageGuideStep) => {
    if (!('speechSynthesis' in window)) {
      alert('Browser Anda tidak mendukung Web Speech API audio.');
      return;
    }

    if (playingDuaId === step.id) {
      window.speechSynthesis.cancel();
      setPlayingDuaId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setPlayingDuaId(step.id);

    const utterance = new SpeechSynthesisUtterance(step.duaTextArabic);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85; // Slightly slower for clear tajweed

    utterance.onend = () => {
      setPlayingDuaId(null);
    };

    utterance.onerror = () => {
      setPlayingDuaId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleCopyDua = (step: PilgrimageGuideStep) => {
    const text = `${step.duaTextArabic}\n\n${step.duaTextLatin}\n\nArtinya: ${step.duaTranslation}`;
    navigator.clipboard.writeText(text);
    setCopiedDuaId(step.id);
    setTimeout(() => {
      setCopiedDuaId(null);
    }, 2000);
  };

  return (
    <div id="hajj-manasik-guide-section" className="space-y-6">
      
      {/* Sub-Navigation Mode Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 bg-white dark:bg-[#1A1D1A] rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D]">
        <button
          onClick={() => setActiveGuideView('UMRAH')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeGuideView === 'UMRAH'
              ? 'bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/30'
              : 'text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
          }`}
        >
          <span>✈️</span>
          <span>Panduan Umrah Praktis</span>
        </button>

        <button
          onClick={() => setActiveGuideView('HAJJ')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeGuideView === 'HAJJ'
              ? 'bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/30'
              : 'text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
          }`}
        >
          <span>🕋</span>
          <span>Puncak Rangkaian Haji</span>
        </button>

        <button
          onClick={() => setActiveGuideView('PROHIBITIONS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeGuideView === 'PROHIBITIONS'
              ? 'bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/30'
              : 'text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>Larangan Ihram & Fidyah Dam</span>
        </button>

        <button
          onClick={() => setActiveGuideView('NUSUK_RAWDAH')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeGuideView === 'NUSUK_RAWDAH'
              ? 'bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/30'
              : 'text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
          <span>Aplikasi Nusuk & Ziarah Raudhah</span>
        </button>
      </div>

      {/* VIEW 1 & 2: MANASIK GUIDE STEPS (UMRAH & HAJJ) */}
      {(activeGuideView === 'UMRAH' || activeGuideView === 'HAJJ') && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2E7D32]/10 to-[#4CAF50]/10 border border-[#2E7D32]/20 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                {activeGuideView === 'UMRAH' ? 'Tata Cara & Rukun Manasik Umrah Lengkap' : 'Rangkaian Ibadah Haji Tamattu\' Step-by-Step'}
              </h3>
              <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] mt-0.5">
                Disusun berdasarkan Sunnah shahih Rasulullah SAW lengkap dengan audio lafaz doa dan makhraj tajwid.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#2E7D32] dark:text-[#4CAF50] bg-white dark:bg-[#1A1D1A] px-3 py-1.5 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D]">
              {filteredSteps.length} Tahapan Utama
            </span>
          </div>

          <div className="space-y-3">
            {filteredSteps.map((step) => {
              const isExpanded = expandedStepId === step.id;
              const isPlaying = playingDuaId === step.id;
              const isCopied = copiedDuaId === step.id;

              return (
                <div
                  key={step.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'bg-white dark:bg-[#1A1D1A] border-[#2E7D32] dark:border-[#4CAF50] shadow-md ring-1 ring-[#2E7D32]/20'
                      : 'bg-white dark:bg-[#1A1D1A] border-[#D8DFD8] dark:border-[#2D332D] hover:border-[#2E7D32]/40'
                  }`}
                >
                  {/* Step Header */}
                  <div
                    onClick={() => toggleStep(step.id)}
                    className="p-4 sm:p-5 cursor-pointer flex items-center justify-between gap-3 select-none"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isExpanded
                          ? 'bg-[#2E7D32] text-white shadow-sm'
                          : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#2E7D32] dark:text-[#4CAF50]'
                      }`}>
                        {step.stepNumber}
                      </div>

                      <div>
                        <h4 className="text-sm sm:text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                          {step.title}
                        </h4>
                        <p className="text-xs font-arabic text-[#2E7D32] dark:text-[#4CAF50] mt-0.5">
                          {step.titleArabic}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border border-[#D8DFD8] dark:border-[#2D332D]">
                        Fase {step.phase}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#A0A8A0]" />
                      )}
                    </div>
                  </div>

                  {/* Step Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 space-y-4 border-t border-[#D8DFD8] dark:border-[#2D332D] pt-4 animate-in fade-in">
                      
                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#141A14] dark:text-[#E4E8E4] leading-relaxed">
                        {step.description}
                      </p>

                      {/* Rulings & Syarat */}
                      <div className="p-3.5 rounded-xl bg-[#EEF3EE]/60 dark:bg-[#242924]/60 border border-[#D8DFD8] dark:border-[#2D332D] space-y-1.5">
                        <span className="text-[11px] font-extrabold text-[#2E7D32] dark:text-[#4CAF50] uppercase tracking-wider block">
                          Ketentuan & Hukum Fiqih:
                        </span>
                        {step.rulings.map((ruling, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50] shrink-0 mt-0.5" />
                            <span>{ruling}</span>
                          </div>
                        ))}
                      </div>

                      {/* Common Mistakes Warning */}
                      {step.commonMistakes.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Hindari Kesalahan Umum di Lapangan:</span>
                          </div>
                          {step.commonMistakes.map((mistake, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-rose-900 dark:text-rose-200">
                              <span className="text-rose-500 font-bold shrink-0">✕</span>
                              <span>{mistake}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Doa & Lafal Manasik */}
                      {step.duaTextArabic && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#1C2C1E] to-[#121A13] text-white shadow-inner border border-[#2D332D] space-y-3">
                          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              Lafal Doa & Talbiyah Ma'tsur
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handlePlayAudio(step)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                                  isPlaying 
                                    ? 'bg-amber-500 text-white animate-pulse' 
                                    : 'bg-white/15 hover:bg-white/25 text-white'
                                }`}
                              >
                                {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                                <span>{isPlaying ? 'Hentikan' : 'Dengarkan Lafal'}</span>
                              </button>

                              <button
                                onClick={() => handleCopyDua(step)}
                                className="p-1 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                                title="Salin doa"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Arabic text */}
                          <p className="text-lg sm:text-xl font-arabic text-right leading-loose text-emerald-100 font-semibold py-1">
                            {step.duaTextArabic}
                          </p>

                          {/* Latin Transliteration */}
                          <p className="text-xs font-serif italic text-[#E4E8E4]/90 border-t border-white/10 pt-2 leading-relaxed">
                            {step.duaTextLatin}
                          </p>

                          {/* Translation */}
                          <p className="text-xs text-[#E4E8E4]/80 leading-relaxed">
                            <strong className="text-white">Artinya:</strong> {step.duaTranslation}
                          </p>
                        </div>
                      )}

                      {/* Sunnah Practices */}
                      {step.sunnahPractices.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1">
                          <span className="text-[11px] font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                            Amalan Sunnah Sangat Dianjurkan:
                          </span>
                          {step.sunnahPractices.map((sunnah, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                              <span className="text-amber-600 font-bold shrink-0">★</span>
                              <span>{sunnah}</span>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* VIEW 3: LARANGAN IHRAM & DAM */}
      {activeGuideView === 'PROHIBITIONS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>Matriks Larangan Saat Berstatus Ihram & Konsekuensi Dam/Fidyah</span>
            </div>
            <p className="text-xs text-amber-900 dark:text-amber-200/90 mt-1 leading-relaxed">
              Setiap jemaah yang telah berniat ihram di Miqat terikat dengan larangan-larangan syariat hingga dinyatakan Tahallul Awwal / Tahallul Tsani.
            </p>
          </div>

          <div className="space-y-3">
            {IHRAM_PROHIBITIONS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1A1D1A] p-5 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#D8DFD8] dark:border-[#2D332D] pb-2">
                  <h4 className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                    {item.category}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    Ketat
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#EEF3EE]/50 dark:bg-[#242924]/50 border border-[#D8DFD8] dark:border-[#2D332D]">
                    <span className="font-bold text-[#141A14] dark:text-[#E4E8E4] block mb-1">
                      🧔 Larangan untuk Pria:
                    </span>
                    <p className="text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed">
                      {item.pria}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#EEF3EE]/50 dark:bg-[#242924]/50 border border-[#D8DFD8] dark:border-[#2D332D]">
                    <span className="font-bold text-[#141A14] dark:text-[#E4E8E4] block mb-1">
                      🧕 Larangan untuk Wanita:
                    </span>
                    <p className="text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed">
                      {item.wanita}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
                  <strong className="text-amber-800 dark:text-amber-300">⚖️ Ketentuan Fidyah / Dam jika Melanggar:</strong> {item.fidyah}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: PANDUAN NUSUK & RAUDHAH */}
      {activeGuideView === 'NUSUK_RAWDAH' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1C2D1F] to-[#121A13] text-white shadow-md border border-[#2D332D]">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Smartphone className="w-5 h-5" />
              <span>Panduan Izin Tasrih Raudhah Syarifah (Masjid Nabawi Madinah)</span>
            </div>
            <p className="text-xs text-[#E4E8E4]/90 mt-1 leading-relaxed max-w-2xl">
              Raudhah adalah "Taman Surga" di antara mimbar dan makam Rasulullah SAW. Saat ini, masuk Raudhah wajib memiliki permit resmi melalui aplikasi resmi Nusuk Pemerintah Kerajaan Arab Saudi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NUSUK_RAWDAH_GUIDE.map((step) => (
              <div
                key={step.step}
                className="bg-white dark:bg-[#1A1D1A] p-5 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-xl bg-[#2E7D32] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm shadow-[#2E7D32]/30">
                  {step.step}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Practical Tips for Raudhah */}
          <div className="bg-white dark:bg-[#1A1D1A] p-5 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] space-y-2.5">
            <h4 className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-[#2E7D32]" />
              <span>Tips Sukses Ziarah & Ibadah di Raudhah</span>
            </h4>
            <ul className="text-xs text-[#5A665B] dark:text-[#A0A8A0] space-y-1.5 list-disc list-inside leading-relaxed">
              <li>Pintu masuk wanita (Gate 37) dan pria (Bab as-Salam) memiliki jadwal terpisah. Datanglah 30-45 menit sebelum jam slot kartu izin Anda.</li>
              <li>Peraturan Saudi mengizinkan kunjungan Raudhah resmi 1 kali setiap 365 hari per nomor visa/paspor.</li>
              <li>Di dalam Raudhah, dahulukan shalat sunnah 2 rakaat di atas karpet hijau, perbanyak salam kepada Rasulullah SAW, Abu Bakar Ash-Shiddiq, dan Umar bin Khattab ra.</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};
