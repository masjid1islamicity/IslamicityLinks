import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Copy, 
  Check, 
  Share2, 
  BookOpen, 
  Bookmark, 
  ChevronRight, 
  RefreshCw, 
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  ListFilter,
  Info,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { DailyDua } from '../../types';
import { DAILY_DUAS, getDuaForDate } from '../../data/mockDuas';
import { useApp } from '../../context/AppContext';

export const DuaOfTheDayWidget: React.FC = () => {
  const { addNotification } = useApp();
  
  // Current active dua (default from today's date rotation)
  const [currentDua, setCurrentDua] = useState<DailyDua>(getDuaForDate());
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  
  // UI toggles
  const [showLatin, setShowLatin] = useState<boolean>(true);
  const [showFadhilah, setShowFadhilah] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isBrowseModalOpen, setIsBrowseModalOpen] = useState<boolean>(false);
  
  // Dzikir Counter state for the current Dua
  const [count, setCount] = useState<number>(0);
  const targetCount = currentDua.repeatCount || 3;

  // Audio & Speech Synthesis Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Stop audio on dua switch
  useEffect(() => {
    stopAudioPlayback();
    setCount(0);
    setPlaybackProgress(0);
  }, [currentDua]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAudioPlayback();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const stopAudioPlayback = () => {
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Play Recitation using Web Audio Synthesizer or Web Speech Synthesis
  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudioPlayback();
      return;
    }

    setIsPlaying(true);
    setPlaybackProgress(0);

    // Try Speech Synthesis with Arabic voice, or fallback to progressive audio timer
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(currentDua.arabicText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85 * playbackSpeed;
      utterance.pitch = 1.0;
      speechUtteranceRef.current = utterance;

      // Simulated duration calculation for progress bar
      const wordCount = currentDua.arabicText.split(' ').length;
      const estimatedDurationMs = Math.max(4000, (wordCount * 800) / playbackSpeed);
      const startTime = Date.now();

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const prog = Math.min(100, (elapsed / estimatedDurationMs) * 100);
        setPlaybackProgress(prog);

        if (prog < 100) {
          animationFrameRef.current = requestAnimationFrame(updateProgress);
        }
      };

      utterance.onstart = () => {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      };

      utterance.onend = () => {
        setPlaybackProgress(100);
        if (isLooping) {
          setTimeout(() => {
            if (isPlaying) {
              setPlaybackProgress(0);
              window.speechSynthesis.speak(utterance);
            }
          }, 600);
        } else {
          setIsPlaying(false);
          // Increment dzikir count on completion
          setCount(prev => Math.min(targetCount, prev + 1));
        }
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis playback note:', e);
        playFallbackChime();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      playFallbackChime();
    }
  };

  // Web Audio chime fallback if TTS is disabled
  const playFallbackChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      }
    } catch (err) {
      console.warn('Audio chime fallback:', err);
    }

    // Run progress animation
    let prog = 0;
    const interval = setInterval(() => {
      prog += 5;
      setPlaybackProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setIsPlaying(false);
        setCount(prev => Math.min(targetCount, prev + 1));
      }
    }, 150);
  };

  // Copy to Clipboard
  const handleCopy = () => {
    const textToCopy = `✨ ${currentDua.title} ✨\n\n${currentDua.arabicText}\n\n"${currentDua.transliteration}"\n\nArtinya:\n${currentDua.translation}\n\nSumber: ${currentDua.source}\nKeutamaan: ${currentDua.benefitFadhilah}\n\n— Dibagikan via Islamicity Ummah Hub`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);

    addNotification({
      title: 'Doa Berhasil Disalin',
      message: `Teks Arab, transliterasi, dan terjemahan ${currentDua.title} siap dibagikan.`,
      type: 'FORUM_REPLY',
    });
  };

  // Share Dua
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentDua.title,
        text: `${currentDua.title}\n\n${currentDua.arabicText}\n\n${currentDua.translation}\n\nSumber: ${currentDua.source}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  // Switch to another random or next Dua
  const handleNextDua = () => {
    const currentIndex = DAILY_DUAS.findIndex(d => d.id === currentDua.id);
    const nextIndex = (currentIndex + 1) % DAILY_DUAS.length;
    setCurrentDua(DAILY_DUAS[nextIndex]);
  };

  // Increment Dzikir counter
  const handleIncrementCount = () => {
    if (count < targetCount) {
      const nextCount = count + 1;
      setCount(nextCount);
      if (nextCount === targetCount) {
        addNotification({
          title: 'Target Wirid Harian Tercapai! 🎉',
          message: `Alhamdulillah, Anda telah mengamalkan ${currentDua.title} sebanyak ${targetCount}x. Semoga diijabah Allah Ta'ala.`,
          type: 'PRAYER_ALERT',
        });
      }
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 sm:p-7 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-6 relative overflow-hidden transition-all">
      
      {/* Background Islamic Ambient Geometric Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#2E7D32]/10 dark:from-[#2E7D32]/15 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-radial from-[#795548]/10 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Top Header: Badge, Category, Date, and Action Icons */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] border border-[#2E7D32]/20 shadow-inner">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2E7D32] dark:text-[#4CAF50]">
                Doa Harian Pilihan • Dua of the Day
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#EEF3EE] dark:bg-[#242924] text-[10px] font-bold text-[#5A665B] dark:text-[#A0A8A0] border border-[#D8DFD8] dark:border-[#2D332D]">
                {currentDua.category}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#141A14] dark:text-[#E4E8E4] tracking-tight">
              {currentDua.title}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setIsBrowseModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#D8DFD8] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] text-xs font-bold border border-[#D8DFD8] dark:border-[#2D332D] transition-colors flex items-center gap-1.5 shadow-sm"
            title="Pilih dari Kumpulan Doa Shahih"
          >
            <ListFilter className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
            <span className="hidden sm:inline">Pilih Doa</span>
          </button>

          <button
            onClick={handleNextDua}
            className="p-2 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#D8DFD8] dark:hover:bg-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] border border-[#D8DFD8] dark:border-[#2D332D] transition-colors"
            title="Ganti ke Doa Berikutnya"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-xl border transition-colors ${
              isBookmarked
                ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D]'
            }`}
            title="Simpan Doa Favorit"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#D8DFD8] dark:hover:bg-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] border border-[#D8DFD8] dark:border-[#2D332D] transition-colors"
            title="Salin Teks Doa"
          >
            {isCopied ? <Check className="w-4 h-4 text-[#2E7D32]" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#D8DFD8] dark:hover:bg-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] border border-[#D8DFD8] dark:border-[#2D332D] transition-colors"
            title="Bagikan Doa"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Arabic Calligraphy Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#EEF3EE] via-[#E4EBE4] to-[#EEF3EE] dark:from-[#242924] dark:via-[#1D221D] dark:to-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] shadow-inner space-y-6 relative">
        
        {/* Arabic Text Display */}
        <div className="text-right font-serif leading-[2.2] sm:leading-[2.4] text-2xl sm:text-3xl lg:text-4xl text-[#141A14] dark:text-[#E4E8E4] tracking-wide select-text py-2" dir="rtl">
          {currentDua.arabicText}
        </div>

        {/* Transliteration (Latin) */}
        {showLatin && (
          <div className="pt-4 border-t border-[#D8DFD8] dark:border-[#2D332D]">
            <p className="text-xs sm:text-sm italic text-[#2E7D32] dark:text-[#4CAF50] font-medium leading-relaxed">
              "{currentDua.transliteration}"
            </p>
          </div>
        )}

        {/* Translation (Indonesian) */}
        <div className="pt-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5A665B] dark:text-[#A0A8A0] block mb-1">
            Artinya:
          </span>
          <p className="text-xs sm:text-sm text-[#141A14] dark:text-[#E4E8E4] leading-relaxed font-normal">
            {currentDua.translation}
          </p>
        </div>

        {/* Audio Player & Soundwave Bar */}
        <div className="pt-4 border-t border-[#D8DFD8] dark:border-[#2D332D] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Recitation Play Button & Soundwave Visualizer */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-md transition-all ${
                isPlaying
                  ? 'bg-rose-700 hover:bg-rose-800 text-white animate-pulse'
                  : 'bg-[#2E7D32] hover:bg-[#256629] text-white shadow-[#2E7D32]/20 hover:scale-105'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Jeda Tilawah</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Dengarkan Pelafalan Audio</span>
                </>
              )}
            </button>

            {/* Visualizer Soundwave Bars */}
            {isPlaying && (
              <div className="flex items-center gap-1 px-2 py-1 bg-white/40 dark:bg-black/30 rounded-xl">
                {[1, 2, 3, 4, 5, 6].map((bar) => (
                  <div
                    key={bar}
                    className="w-1 bg-[#2E7D32] dark:bg-[#4CAF50] rounded-full animate-bounce"
                    style={{
                      height: `${12 + (bar % 3) * 8}px`,
                      animationDelay: `${bar * 120}ms`,
                      animationDuration: '600ms',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Player Settings: Speed, Latin Toggle, and Fadhilah Info */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#1A1D1A] px-2.5 py-1.5 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] text-[11px]">
              <span className="text-[#5A665B] dark:text-[#A0A8A0]">Tempo:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-transparent font-extrabold text-[#2E7D32] dark:text-[#4CAF50] focus:outline-none cursor-pointer"
              >
                <option value={0.75}>0.75x</option>
                <option value={1.0}>1.0x</option>
                <option value={1.25}>1.25x</option>
              </select>
            </div>

            {/* Toggle Latin */}
            <button
              onClick={() => setShowLatin(!showLatin)}
              className={`px-3 py-1.5 rounded-xl border font-bold text-[11px] flex items-center gap-1 transition-colors ${
                showLatin
                  ? 'bg-white dark:bg-[#1A1D1A] text-[#141A14] dark:text-[#E4E8E4] border-[#D8DFD8] dark:border-[#2D332D]'
                  : 'bg-[#D8DFD8] dark:bg-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] border-transparent'
              }`}
            >
              {showLatin ? <Eye className="w-3 h-3 text-[#2E7D32]" /> : <EyeOff className="w-3 h-3" />}
              <span>Latin</span>
            </button>

            {/* Loop Toggle */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-1.5 rounded-xl border transition-colors ${
                isLooping
                  ? 'bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] border-[#2E7D32]/30'
                  : 'bg-white dark:bg-[#1A1D1A] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D]'
              }`}
              title="Ulangi Otomatis (Loop)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar (when playing) */}
        {isPlaying && (
          <div className="w-full bg-[#D8DFD8] dark:bg-[#2D332D] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#2E7D32] h-full rounded-full transition-all duration-100"
              style={{ width: `${playbackProgress}%` }}
            />
          </div>
        )}

      </div>

      {/* Bottom Insights: Dzikir Counter & Keutamaan / Fadhilah */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Left: Keutamaan & Sanad Hadith (8 cols) */}
        <div className="md:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#EEF3EE]/60 dark:bg-[#242924]/60 border border-[#D8DFD8] dark:border-[#2D332D] space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
            <span>Fadhilah & Sanad Riwayat Sahih</span>
          </div>

          <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed">
            {currentDua.benefitFadhilah}
          </p>

          <div className="pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="font-bold text-[#2E7D32] dark:text-[#4CAF50]">
              📖 {currentDua.source}
            </span>
            <div className="flex gap-1">
              {currentDua.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-[#1A1D1A] text-[10px] text-[#5A665B] dark:text-[#A0A8A0] border border-[#D8DFD8] dark:border-[#2D332D]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Daily Repetition / Dzikir Counter (4 cols) */}
        <div className="md:col-span-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#2E7D32]/10 to-[#1F3D22]/10 dark:from-[#2E7D32]/20 dark:to-[#172E19]/20 border border-[#2E7D32]/30 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-[#2E7D32] dark:text-[#4CAF50] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Target Harian</span>
            </span>
            <span className="text-xs font-mono font-bold text-[#141A14] dark:text-[#E4E8E4]">
              {count} / {targetCount}x
            </span>
          </div>

          {/* Interactive Tap Button */}
          <button
            onClick={handleIncrementCount}
            disabled={count >= targetCount}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow transition-all ${
              count >= targetCount
                ? 'bg-[#2E7D32] text-white cursor-default'
                : 'bg-white dark:bg-[#1A1D1A] hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#2E7D32] dark:text-[#4CAF50] border border-[#2E7D32]/30 active:scale-95'
            }`}
          >
            {count >= targetCount ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Selesai Diamalkan</span>
              </>
            ) : (
              <>
                <span>Ketuk Wirid (+1)</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Browse All Duas Modal */}
      {isBrowseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-[#D8DFD8] dark:border-[#2D332D] shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <h3 className="font-extrabold text-sm sm:text-base text-[#141A14] dark:text-[#E4E8E4]">
                  Koleksi Doa Shahih Nabawiyyah
                </h3>
              </div>
              <button
                onClick={() => setIsBrowseModalOpen(false)}
                className="px-3 py-1 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]"
              >
                Tutup
              </button>
            </div>

            {/* Duas List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
              {DAILY_DUAS.map((dua) => {
                const isSelected = dua.id === currentDua.id;
                return (
                  <div
                    key={dua.id}
                    onClick={() => {
                      setCurrentDua(dua);
                      setIsBrowseModalOpen(false);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-[#2E7D32]/10 border-[#2E7D32] ring-1 ring-[#2E7D32]'
                        : 'bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] border-[#D8DFD8] dark:border-[#2D332D]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-[#2E7D32] dark:text-[#4CAF50] uppercase">
                          {dua.category}
                        </span>
                        <h4 className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4] mt-0.5">
                          {dua.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-[#1A1D1A] text-[#5A665B] dark:text-[#A0A8A0] border border-[#D8DFD8] dark:border-[#2D332D] shrink-0">
                        {dua.repeatCount}x Bacaan
                      </span>
                    </div>

                    <p className="text-right font-serif text-sm text-[#141A14] dark:text-[#E4E8E4] line-clamp-1" dir="rtl">
                      {dua.arabicText}
                    </p>

                    <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] line-clamp-2">
                      {dua.translation}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
