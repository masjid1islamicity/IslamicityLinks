import React from 'react';
import { 
  Radio, 
  Sparkles, 
  Tv, 
  Users, 
  Award, 
  BookOpen, 
  ExternalLink, 
  ShieldCheck, 
  Heart, 
  Gift,
  PlayCircle
} from 'lucide-react';
import { IslamicityLogo } from '../IslamicityLogo';

interface TalksHeroBannerProps {
  onOpenLuckyWheel: () => void;
  onScrollToLive: () => void;
  onTabChange: (subTab: 'webinars' | 'playlists' | 'materi' | 'konsultasi' | 'amal') => void;
  activeSubTab: string;
}

export const TalksHeroBanner: React.FC<TalksHeroBannerProps> = ({
  onOpenLuckyWheel,
  onScrollToLive,
  onTabChange,
  activeSubTab
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B4D21] via-[#143B19] to-[#0D2811] text-white border border-[#2E7D32]/40 shadow-2xl p-6 sm:p-8 md:p-10">
      
      {/* Decorative Islamic Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#81C784_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Floating Glowing Orbs */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#4CAF50]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Benn Al Islamicity & Tim</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 border border-white/15 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pusat Dakwah Digital Terverifikasi</span>
            </span>
          </div>

          {/* Lucky Wheel Action Button (Featured in Poster) */}
          <button
            id="btn-hero-lucky-wheel"
            onClick={onOpenLuckyWheel}
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#141A14] font-black text-xs shadow-lg shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95"
          >
            <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-amber-600 shadow-inner group-hover:rotate-180 transition-transform duration-500">
              <Gift className="w-3 h-3 text-amber-700" />
            </div>
            <span>Putar Roda Berkah • Gratis Voucher Haji / Umrah</span>
          </button>
        </div>

        {/* Main Title & Tagline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300">
                <Radio className="w-7 h-7 animate-pulse text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight font-serif">
                  IslamicityTalks
                </h1>
                <p className="text-emerald-300 text-xs sm:text-sm font-semibold tracking-wider uppercase">
                  Aplikasi Pusat Dakwah Islamicity
                </p>
              </div>
            </div>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
              <strong className="text-white font-semibold">Raih Hidayah & Berbagi Berkah dengan Ujung Jari.</strong>{' '}
              Pusat kajian komprehensif, siaran langsung webinar interaktif bersama asatidz terkemuka, materi dakwah tematik, dan tanya jawab syariah terpercaya.
            </p>

            {/* Official Website Reference from Poster */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-emerald-300 font-mono bg-black/25 px-3 py-1 rounded-lg border border-emerald-500/20 inline-flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portal Resmi: <strong>pusat.dakwah.islamicity.tv</strong></span>
              </span>
            </div>
          </div>

          {/* Quick Metrics / Stats Grid */}
          <div className="lg:col-span-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 sm:p-5 space-y-3">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center justify-between">
              <span>Statistik Dakwah</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-emerald-300 text-xs mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Jamaah Aktif</span>
                </div>
                <div className="text-lg font-black text-white">48.500+</div>
                <div className="text-[10px] text-emerald-200/70">Tersebar di 34 Provinsi</div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs mb-1">
                  <Tv className="w-3.5 h-3.5" />
                  <span>Webinar & Kajian</span>
                </div>
                <div className="text-lg font-black text-white">124+ Sesi</div>
                <div className="text-[10px] text-emerald-200/70">Live & Replay HD</div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-blue-300 text-xs mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Materi & E-Book</span>
                </div>
                <div className="text-lg font-black text-white">350+ Berkas</div>
                <div className="text-[10px] text-emerald-200/70">Unduhan Gratis</div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-purple-300 text-xs mb-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>E-Sertifikat Ber-QR</span>
                </div>
                <div className="text-lg font-black text-white">18.200+</div>
                <div className="text-[10px] text-emerald-200/70">Tervalidasi Digital</div>
              </div>
            </div>

            <button
              id="btn-scroll-to-live-session"
              onClick={onScrollToLive}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Tonton Sesi Live Sekarang</span>
            </button>
          </div>
        </div>

        {/* Feature Sub-Navigation Tabs */}
        <div className="pt-2 border-t border-white/15 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onTabChange('webinars')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'webinars'
                ? 'bg-white text-[#1B4D21] shadow-md'
                : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Webinar & Siaran Live</span>
          </button>

          <button
            id="tab-btn-curated-playlists"
            onClick={() => onTabChange('playlists')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 relative ${
              activeSubTab === 'playlists'
                ? 'bg-white text-[#1B4D21] shadow-md'
                : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeSubTab === 'playlists' ? 'text-amber-600 animate-pulse' : 'text-amber-300 animate-pulse'}`} />
            <span>Playlist Kurasi & Rekomendasi</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400/30 text-amber-200 text-[9px] font-black uppercase tracking-wider">
              AI Match
            </span>
          </button>

          <button
            onClick={() => onTabChange('materi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'materi'
                ? 'bg-white text-[#1B4D21] shadow-md'
                : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Materi Dakwah & Artikel</span>
          </button>

          <button
            onClick={() => onTabChange('konsultasi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'konsultasi'
                ? 'bg-white text-[#1B4D21] shadow-md'
                : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tanya Jawab & Fatwa Syariah</span>
          </button>

          <button
            onClick={() => onTabChange('amal')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'amal'
                ? 'bg-white text-[#1B4D21] shadow-md'
                : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Sinergi Amal & Yatim</span>
          </button>
        </div>

      </div>
    </div>
  );
};
