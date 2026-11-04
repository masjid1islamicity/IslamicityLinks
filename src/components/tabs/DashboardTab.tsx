import React from 'react';
import { 
  Coins, 
  HeartHandshake, 
  BookOpen, 
  MessageSquare, 
  Compass, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Building, 
  Users, 
  Lock,
  ExternalLink,
  ChevronRight,
  Calculator,
  Plane,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DuaOfTheDayWidget } from '../widgets/DuaOfTheDayWidget';
import { IslamicityLogo } from '../IslamicityLogo';

export const DashboardTab: React.FC = () => {
  const { 
    setActiveTab, 
    campaigns, 
    resources, 
    forumThreads, 
    blockchainTransactions, 
    goldPricePerGram, 
    nisabMaalAmount,
    setSelectedExplorerData,
    setSelectedReceiptTx,
    t 
  } = useApp();

  const totalCollected = campaigns.reduce((acc, c) => acc + c.collectedAmount, 0);
  const totalDonors = campaigns.reduce((acc, c) => acc + c.donorCount, 0);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F3D22] via-[#172E19] to-[#121E13] text-[#E4E8E4] p-6 sm:p-10 shadow-xl border border-[#2D332D]">
        
        {/* Background Islamic Geometric Pattern & Islamicity Logo Watermark */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-radial from-[#2E7D32]/25 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-radial from-[#795548]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        {/* Subtle decorative Islamicity emblem silhouette in background */}
        <div className="absolute right-8 bottom-6 opacity-10 pointer-events-none select-none hidden lg:block w-72 h-72">
          <IslamicityLogo variant="emblem" size="custom" className="w-full h-full text-emerald-300" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E7D32]/30 border border-[#4CAF50]/30 text-[#4CAF50] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sinergi Ekosistem Komunitas Muslim Global & Lynk.id</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-extrabold backdrop-blur-sm">
              <IslamicityLogo variant="emblem" size="xs" className="w-4 h-4 rounded-md shadow-none" />
              <span>Official Islamicity Network</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t('hero_title')}
          </h1>

          <p className="text-xs sm:text-sm text-[#E4E8E4]/90 leading-relaxed max-w-2xl">
            {t('hero_desc')}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => setActiveTab('zakat-blockchain')}
              className="px-5 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#2E7D32]/30 transition-all hover:scale-105"
            >
              <Coins className="w-4 h-4" />
              <span>Hitung & Tunaikan Zakat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('donations')}
              className="px-5 py-2.5 rounded-2xl bg-[#242924]/80 hover:bg-[#2D332D] text-[#E4E8E4] font-bold text-xs border border-[#2D332D] backdrop-blur flex items-center gap-2 transition-colors"
            >
              <HeartHandshake className="w-4 h-4 text-[#4CAF50]" />
              <span>Donasi Lembaga Resmi</span>
            </button>

            <button
              onClick={() => setActiveTab('islamicity-talks')}
              className="px-4 py-2.5 rounded-2xl bg-red-600/30 hover:bg-red-600/50 text-white font-bold text-xs border border-red-500/40 flex items-center gap-1.5 transition-all shadow-md"
            >
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <span>IslamicityTalks Live</span>
            </button>

            <button
              onClick={() => setActiveTab('hajj-umrah')}
              className="px-4 py-2.5 rounded-2xl bg-[#2E7D32]/30 hover:bg-[#2E7D32]/45 text-[#E4E8E4] font-semibold text-xs border border-[#2E7D32]/50 flex items-center gap-1.5 transition-colors"
            >
              <Plane className="w-4 h-4 text-emerald-300" />
              <span>Persiapan Haji & Umrah</span>
            </button>

            <button
              onClick={() => setActiveTab('lynk-hub')}
              className="px-4 py-2.5 rounded-2xl bg-[#795548]/30 hover:bg-[#795548]/45 text-[#E4E8E4] font-semibold text-xs border border-[#795548]/40 flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Kreator Lynk.id Hub</span>
            </button>
          </div>
        </div>

        {/* Real-time Global Impact Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-[#2D332D] text-xs">
          <div className="p-3 bg-[#121412]/70 rounded-2xl border border-[#2D332D]">
            <span className="text-[10px] text-[#A0A8A0] font-medium block">Total Dana Zakat & Infaq</span>
            <p className="text-base sm:text-lg font-black text-[#4CAF50] font-mono mt-0.5">
              Rp {totalCollected.toLocaleString('id-ID')}
            </p>
            <span className="text-[10px] text-[#2E7D32] dark:text-[#4CAF50]">100% Diaudit Real-time</span>
          </div>

          <div className="p-3 bg-[#121412]/70 rounded-2xl border border-[#2D332D]">
            <span className="text-[10px] text-[#A0A8A0] font-medium block">Muzakki & Donatur Global</span>
            <p className="text-base sm:text-lg font-black text-white font-mono mt-0.5">
              {totalDonors.toLocaleString('id-ID')} Jiwa
            </p>
            <span className="text-[10px] text-[#2E7D32] dark:text-[#4CAF50]">Privasi E2EE Terenkripsi</span>
          </div>

          <div className="p-3 bg-[#121412]/70 rounded-2xl border border-[#2D332D]">
            <span className="text-[10px] text-[#A0A8A0] font-medium block">Lembaga Resmi Terakreditasi</span>
            <p className="text-base sm:text-lg font-black text-white font-mono mt-0.5">
              5 Lembaga Nasional
            </p>
            <span className="text-[10px] text-[#2E7D32] dark:text-[#4CAF50]">BAZNAS, DD, RZ, NU, MUH</span>
          </div>

          <div className="p-3 bg-[#121412]/70 rounded-2xl border border-[#2D332D]">
            <span className="text-[10px] text-[#A0A8A0] font-medium block">Nisab Emas 85g Mutakhir</span>
            <p className="text-base sm:text-lg font-black text-[#4CAF50] font-mono mt-0.5">
              Rp {(nisabMaalAmount / 1000000).toFixed(1)} Juta
            </p>
            <span className="text-[10px] text-[#A0A8A0]">Rp {goldPricePerGram.toLocaleString('id-ID')}/g</span>
          </div>
        </div>
      </div>

      {/* Dua of the Day Interactive Audio Widget */}
      <DuaOfTheDayWidget />

      {/* Hajj & Umrah Preparation Spotlight Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#172E19] via-[#1B361E] to-[#122214] p-6 text-white border border-[#2D332D] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Modul Safar Suci
            </span>
            <span className="text-xs text-[#E4E8E4]/80">🕋 Labbaik Allahumma Labbaik</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            Persiapan Ibadah Haji & Umrah Terpadu
          </h3>
          <p className="text-xs text-[#E4E8E4]/80 leading-relaxed">
            Checklist bawaan koper & dokumen, panduan manasik sunnah dengan audio doa, dan kalkulator tabungan syariah lindung nilai emas.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('hajj-umrah')}
          className="shrink-0 px-5 py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#2E7D32]/30 transition-all hover:scale-105"
        >
          <Plane className="w-4 h-4" />
          <span>Buka Modul Haji & Umrah</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Live Blockchain Audit Ticker & Transparency Stream */}
      <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] border border-[#2E7D32]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                Buku Besar Zakat Kriptografi (Live Blockchain L2)
              </h2>
              <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                Pencatatan mutasi zakat, infak, dan wakaf real-time tanpa perantara tersembunyi
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('zakat-blockchain')}
            className="text-xs text-[#2E7D32] dark:text-[#4CAF50] font-bold hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Buka Penjelajah Blok Lengkap</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Transaction Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {blockchainTransactions.slice(0, 4).map(tx => (
            <div
              key={tx.id}
              onClick={() => setSelectedExplorerData({ tx })}
              className="p-3.5 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] border border-[#D8DFD8] dark:border-[#2D332D] cursor-pointer transition-all hover:border-[#2E7D32]/50 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50]">
                  {tx.type.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono text-[#5A665B] dark:text-[#A0A8A0]">
                  Blok #{tx.blockNumber}
                </span>
              </div>

              <div className="my-2">
                <p className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4] font-mono">
                  Rp {tx.amount.toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] font-medium truncate mt-0.5">
                  {tx.isAnonymous ? 'Hamba Allah (Privasi E2EE)' : tx.donorName}
                </p>
                <p className="text-[11px] text-[#A0A8A0] truncate">
                  → {tx.charityName}
                </p>
              </div>

              <div className="pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                <span className="font-mono">{tx.txHash.substring(0, 10)}...</span>
                <span className="text-[#2E7D32] dark:text-[#4CAF50] font-bold group-hover:underline flex items-center gap-0.5">
                  Audit <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Urgent Verified Campaigns & Lynk.id Creator Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Urgent Charity Campaigns (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
              <h2 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                Penyaluran Zakat & Infaq Terverifikasi
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('donations')}
              className="text-xs text-[#2E7D32] dark:text-[#4CAF50] font-bold hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua Kampanye</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {campaigns.slice(0, 2).map(camp => {
              const percent = Math.min(100, Math.round((camp.collectedAmount / camp.targetAmount) * 100));
              return (
                <div
                  key={camp.id}
                  className="rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] overflow-hidden flex flex-col justify-between bg-[#EEF3EE]/50 dark:bg-[#242924]/60 hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="relative h-36 w-full overflow-hidden">
                      <img
                        src={camp.coverImage}
                        alt={camp.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#2E7D32] text-white shadow">
                        {camp.charityName}
                      </div>
                      {camp.isUrgent && (
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-700 text-white shadow">
                          Mendesak
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] line-clamp-2 leading-snug">
                        {camp.title}
                      </h3>
                      <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] line-clamp-2">
                        {camp.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 space-y-3">
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                          Rp {camp.collectedAmount.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[#5A665B] dark:text-[#A0A8A0]">
                          {percent}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#D8DFD8] dark:bg-[#2D332D] overflow-hidden">
                        <div
                          className="h-full bg-[#2E7D32] rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('donations')}
                      className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      Salurkan Zakat / Donasi
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lynk.id Resource & Creator Spotlight (1 col) */}
        <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                  Lynk.id Resource Hub
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('lynk-hub')}
                className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
              >
                Semua
              </button>
            </div>

            <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed">
              Materi digital syariah, toolkit dakwah, template Notion, dan modul bisnis halal dari kreator terverifikasi.
            </p>

            <div className="space-y-3">
              {resources.slice(0, 3).map(res => (
                <div
                  key={res.id}
                  onClick={() => setActiveTab('lynk-hub')}
                  className="p-3 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] border border-[#D8DFD8] dark:border-[#2D332D] cursor-pointer transition-all flex items-center gap-3"
                >
                  <img
                    src={res.coverUrl}
                    alt={res.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      {res.category}
                    </span>
                    <h4 className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] truncate">
                      {res.title}
                    </h4>
                    <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] truncate">
                      Oleh {res.creatorName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('lynk-hub')}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Jelajahi Toko Digital & Wakaf Kreator</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Community Silaturahmi Discussion Snapshot */}
      <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
            <h2 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
              Forum Silaturahmi & Tanya Fiqih
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('forum')}
            className="text-xs text-[#2E7D32] dark:text-[#4CAF50] font-bold hover:underline flex items-center gap-1"
          >
            <span>Buka Forum Diskusi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forumThreads.slice(0, 2).map(th => (
            <div
              key={th.id}
              onClick={() => setActiveTab('forum')}
              className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] border border-[#D8DFD8] dark:border-[#2D332D] cursor-pointer transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={th.authorAvatar}
                    alt={th.authorName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] truncate">
                    {th.authorName}
                  </span>
                </div>
                <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">{th.timestamp}</span>
              </div>

              <h3 className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] line-clamp-2">
                {th.title}
              </h3>

              <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] line-clamp-2">
                {th.content}
              </p>

              <div className="pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                <span>{th.commentsCount} Komentar Jawaban</span>
                <span className="text-[#2E7D32] dark:text-[#4CAF50] font-bold">▲ {th.upvotes} Dukungan</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
