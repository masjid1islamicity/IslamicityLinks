import React, { useState, useMemo } from 'react';
import { 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Filter, 
  Layers, 
  Coins, 
  Users, 
  Clock, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight, 
  Hash, 
  Activity,
  Sparkles,
  Lock,
  Boxes
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CharityCampaign, BlockchainTransaction } from '../types';

export const DonationGoalAuditTracker: React.FC = () => {
  const { 
    campaigns, 
    blockchainTransactions, 
    blockchainBlocks, 
    setActiveTab, 
    setSelectedExplorerData 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'PERCENT_DESC' | 'PERCENT_ASC' | 'TARGET_DESC' | 'COLLECTED_DESC' | 'URGENT'>('PERCENT_DESC');
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null);

  // Compute live statistics for each campaign mapped with blockchain ledger
  const enrichedCampaigns = useMemo(() => {
    return campaigns.map(campaign => {
      // Find all transactions recorded on ledger for this campaign or charity
      const matchingTxs = blockchainTransactions.filter(
        tx => tx.charityId === campaign.charityId || 
              (tx.asnafTarget && campaign.asnafCategory === tx.asnafTarget)
      );

      const target = campaign.targetAmount;
      const collected = campaign.collectedAmount;
      const percent = target > 0 ? (collected / target) * 100 : 0;
      const formattedPercent = Math.min(100, percent).toFixed(1);
      const rawPercentNum = Math.min(100, percent);
      const remainingDeficit = Math.max(0, target - collected);
      const avgDonation = campaign.donorCount > 0 ? Math.round(collected / campaign.donorCount) : 0;

      // Status classification
      let statusLabel = 'Aktif Berjalan';
      let statusColor = 'bg-[#EEF3EE] dark:bg-[#242924] text-[#2E7D32] dark:text-[#4CAF50] border-[#D8DFD8] dark:border-[#2D332D]';
      
      if (rawPercentNum >= 100) {
        statusLabel = 'Target Terpenuhi (100%)';
        statusColor = 'bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] border-[#2E7D32]/30';
      } else if (rawPercentNum >= 75) {
        statusLabel = 'Mendekati Target (>=75%)';
        statusColor = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20';
      } else if (campaign.isUrgent) {
        statusLabel = 'Kebutuhan Mendesak';
        statusColor = 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20';
      }

      return {
        ...campaign,
        matchingTxs,
        percentNum: rawPercentNum,
        formattedPercent,
        remainingDeficit,
        avgDonation,
        statusLabel,
        statusColor,
      };
    });
  }, [campaigns, blockchainTransactions]);

  // Overall Global Goals summary
  const aggregateMetrics = useMemo(() => {
    const totalGoal = campaigns.reduce((acc, c) => acc + c.targetAmount, 0);
    const totalAchieved = campaigns.reduce((acc, c) => acc + c.collectedAmount, 0);
    const aggregatePercent = totalGoal > 0 ? ((totalAchieved / totalGoal) * 100).toFixed(1) : '0';
    const totalProjects = campaigns.length;
    const fundedProjects = campaigns.filter(c => c.collectedAmount >= c.targetAmount).length;
    const urgentProjects = campaigns.filter(c => c.isUrgent).length;
    const totalLedgerTxs = blockchainTransactions.length;

    return {
      totalGoal,
      totalAchieved,
      aggregatePercent,
      totalProjects,
      fundedProjects,
      urgentProjects,
      totalLedgerTxs,
    };
  }, [campaigns, blockchainTransactions]);

  // Filter and sort campaigns
  const filteredAndSortedCampaigns = useMemo(() => {
    return enrichedCampaigns
      .filter(c => {
        const matchCat = selectedCategory === 'ALL' || c.category === selectedCategory || (selectedCategory === 'URGENT' && c.isUrgent);
        const matchQuery = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           c.charityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (c.asnafCategory && c.asnafCategory.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCat && matchQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'PERCENT_DESC') return b.percentNum - a.percentNum;
        if (sortBy === 'PERCENT_ASC') return a.percentNum - b.percentNum;
        if (sortBy === 'TARGET_DESC') return b.targetAmount - a.targetAmount;
        if (sortBy === 'COLLECTED_DESC') return b.collectedAmount - a.collectedAmount;
        if (sortBy === 'URGENT') return (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0);
        return 0;
      });
  }, [enrichedCampaigns, selectedCategory, searchQuery, sortBy]);

  const categories = [
    { id: 'ALL', label: 'Semua Proyek' },
    { id: 'Zakat', label: 'Zakat Maal & Fitrah' },
    { id: 'WAKAF', label: 'Wakaf Abadi' },
    { id: 'PENDIDIKAN', label: 'Pendidikan Santri' },
    { id: 'KEMANUSIAAN', label: 'Kemanusiaan' },
    { id: 'URGENT', label: '⚠️ Mendesak' },
  ];

  const toggleExpand = (campaignId: string) => {
    setExpandedCampaignId(prev => (prev === campaignId ? null : campaignId));
  };

  const handleInspectTx = (tx: BlockchainTransaction) => {
    setSelectedExplorerData({ tx });
  };

  return (
    <section id="donation-goal-audit-section" className="space-y-6">
      
      {/* Main Section Header Card */}
      <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 sm:p-8 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#2E7D32] dark:text-[#4CAF50] text-xs font-extrabold uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Target Capaian & Verifikasi Konsensus Blockchain</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#141A14] dark:text-[#E4E8E4] tracking-tight">
              Progress Target Donasi Proyek Syariah Real-Time
            </h2>
            <p className="text-xs sm:text-sm text-[#5A665B] dark:text-[#A0A8A0] max-w-2xl leading-relaxed">
              Setiap progres persentase dihitung secara real-time berdasarkan akumulasi mutasi transaksi terverifikasi pada buku besar (ledger) blockchain sharia.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EEF3EE] dark:bg-[#242924] text-[#2E7D32] dark:text-[#4CAF50] text-xs font-bold border border-[#D8DFD8] dark:border-[#2D332D]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span>Sinkronisasi Ledger: ON-CHAIN 100%</span>
            </span>
          </div>
        </div>

        {/* Global Aggregate Progress Overview Banner */}
        <div className="p-5 rounded-2xl bg-[#EEF3EE]/80 dark:bg-[#242924]/80 border border-[#D8DFD8] dark:border-[#2D332D] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0] uppercase tracking-wide">
                Akumulasi Seluruh Proyek Aktif
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-[#2E7D32] dark:text-[#4CAF50] font-mono">
                  Rp {aggregateMetrics.totalAchieved.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-[#5A665B] dark:text-[#A0A8A0] font-mono">
                  / Rp {aggregateMetrics.totalGoal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">Tingkat Pemenuhan</span>
                <p className="text-2xl font-black text-[#141A14] dark:text-[#E4E8E4] font-mono">
                  {aggregateMetrics.aggregatePercent}%
                </p>
              </div>
            </div>
          </div>

          {/* Aggregate Visual Progress Bar with Milestones */}
          <div className="space-y-1.5">
            <div className="relative w-full h-4 rounded-full bg-[#D8DFD8] dark:bg-[#1A1D1A] overflow-hidden p-0.5 shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#1F3D22] via-[#2E7D32] to-[#4CAF50] transition-all duration-700 relative"
                style={{ width: `${Math.min(100, Number(aggregateMetrics.aggregatePercent))}%` }}
              >
                {/* Visual pulse glow on active tip */}
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Milestone markers */}
            <div className="flex justify-between text-[10px] font-mono text-[#5A665B] dark:text-[#A0A8A0] px-1">
              <span>0% Mulai</span>
              <span>25% Tahap 1</span>
              <span>50% Setengah Target</span>
              <span>75% Akselerasi</span>
              <span className="font-bold text-[#2E7D32] dark:text-[#4CAF50]">100% Target Penuh</span>
            </div>
          </div>

          {/* Micro summary badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between">
              <span className="text-[#5A665B] dark:text-[#A0A8A0]">Total Program</span>
              <span className="font-bold font-mono text-[#141A14] dark:text-[#E4E8E4]">{aggregateMetrics.totalProjects} Proyek</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between">
              <span className="text-[#5A665B] dark:text-[#A0A8A0]">Status Mendesak</span>
              <span className="font-bold font-mono text-amber-600 dark:text-amber-400">{aggregateMetrics.urgentProjects} Proyek</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between">
              <span className="text-[#5A665B] dark:text-[#A0A8A0]">Mutasi On-Chain</span>
              <span className="font-bold font-mono text-[#2E7D32] dark:text-[#4CAF50]">{aggregateMetrics.totalLedgerTxs} Transaksi</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between">
              <span className="text-[#5A665B] dark:text-[#A0A8A0]">Blok Audit Terakhir</span>
              <span className="font-bold font-mono text-[#141A14] dark:text-[#E4E8E4]">#{blockchainBlocks[0]?.blockNumber || 148293}</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                id={`filter-cat-${cat.id.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                    : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D] hover:text-[#141A14] dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A665B] dark:text-[#A0A8A0]" />
              <input
                type="text"
                id="search-campaign-goal"
                placeholder="Cari program / amil..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#4CAF50]"
              />
            </div>

            <select
              id="sort-campaign-goal"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              aria-label="Urutkan Proyek Donasi"
              className="px-3 py-1.5 rounded-xl text-xs bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:border-[#2E7D32] font-semibold"
            >
              <option value="PERCENT_DESC">Persentase Terbesar</option>
              <option value="PERCENT_ASC">Persentase Terkecil</option>
              <option value="COLLECTED_DESC">Dana Terkumpul Terbanyak</option>
              <option value="TARGET_DESC">Target Terbesar</option>
              <option value="URGENT">Prioritas Mendesak</option>
            </select>
          </div>
        </div>

      </div>

      {/* Project Cards Grid with Real-time Goal Progress Bars */}
      <div className="space-y-4">
        {filteredAndSortedCampaigns.length === 0 ? (
          <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-10 text-center border border-[#D8DFD8] dark:border-[#2D332D] space-y-3">
            <AlertCircle className="w-8 h-8 text-[#5A665B] dark:text-[#A0A8A0] mx-auto opacity-70" />
            <p className="text-sm font-bold text-[#141A14] dark:text-[#E4E8E4]">
              Tidak ada proyek donasi yang cocok dengan pencarian.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          filteredAndSortedCampaigns.map(campaign => {
            const isExpanded = expandedCampaignId === campaign.id;

            return (
              <div 
                key={campaign.id}
                id={`project-goal-card-${campaign.id}`}
                className="bg-white dark:bg-[#1A1D1A] rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm hover:border-[#2E7D32]/40 transition-all p-5 sm:p-6 space-y-5"
              >
                
                {/* Card Top: Title, Category, Amil Badge, Days Left */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <img 
                      src={campaign.coverImage} 
                      alt={campaign.title}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-[#D8DFD8] dark:border-[#2D332D] shrink-0" 
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#EEF3EE] dark:bg-[#242924] text-[#2E7D32] dark:text-[#4CAF50] text-[11px] font-extrabold border border-[#D8DFD8] dark:border-[#2D332D]">
                          {campaign.category}
                        </span>
                        {campaign.asnafCategory && (
                          <span className="px-2 py-0.5 rounded-md bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] text-[10px] font-bold">
                            Asnaf: {campaign.asnafCategory}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${campaign.statusColor}`}>
                          {campaign.statusLabel}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-extrabold text-[#141A14] dark:text-[#E4E8E4] leading-snug">
                        {campaign.title}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                        <span className="font-semibold">{campaign.charityName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{campaign.donorCount.toLocaleString('id-ID')} Muzakki / Donatur</span>
                        </span>
                        {campaign.daysRemaining && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{campaign.daysRemaining} Hari Lagi</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Percentage Big Badge on Desktop */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-[#D8DFD8] dark:border-[#2D332D] shrink-0">
                    <span className="text-xs text-[#5A665B] dark:text-[#A0A8A0] font-bold uppercase">
                      Capaian Target Goal
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-[#2E7D32] dark:text-[#4CAF50] font-mono">
                        {campaign.formattedPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* VISUAL DONATION GOAL PROGRESS BAR SECTION */}
                <div className="space-y-2 bg-[#EEF3EE]/50 dark:bg-[#242924]/50 p-4 rounded-2xl border border-[#D8DFD8]/60 dark:border-[#2D332D]/60">
                  
                  {/* Values row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-[#5A665B] dark:text-[#A0A8A0]">Dana Terkumpul:</span>
                      <span className="font-black text-sm text-[#141A14] dark:text-[#E4E8E4] font-mono">
                        Rp {campaign.collectedAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-[#5A665B] dark:text-[#A0A8A0]">Target Keseluruhan:</span>
                      <span className="font-extrabold text-[#2E7D32] dark:text-[#4CAF50] font-mono">
                        Rp {campaign.targetAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* High-Precision Visual Progress Bar */}
                  <div className="relative w-full h-3.5 rounded-full bg-[#D8DFD8] dark:bg-[#121412] overflow-hidden p-0.5 shadow-inner">
                    <div
                      id={`progress-bar-fill-${campaign.id}`}
                      className="h-full rounded-full bg-gradient-to-r from-[#2E7D32] via-[#388E3C] to-[#4CAF50] transition-all duration-700 relative shadow-sm"
                      style={{ width: `${campaign.percentNum}%` }}
                    >
                      {/* Active pulse dot on the tip */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md animate-pulse" />
                    </div>
                  </div>

                  {/* Milestone Indicators (25%, 50%, 75%, 100%) */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#5A665B] dark:text-[#A0A8A0] pt-0.5">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5A665B]" />
                      <span>0%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${campaign.percentNum >= 25 ? 'bg-[#2E7D32]' : 'bg-[#D8DFD8] dark:bg-[#2D332D]'}`} />
                      <span>25%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${campaign.percentNum >= 50 ? 'bg-[#2E7D32]' : 'bg-[#D8DFD8] dark:bg-[#2D332D]'}`} />
                      <span>50%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${campaign.percentNum >= 75 ? 'bg-[#2E7D32]' : 'bg-[#D8DFD8] dark:bg-[#2D332D]'}`} />
                      <span>75%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${campaign.percentNum >= 100 ? 'bg-[#4CAF50]' : 'bg-[#D8DFD8] dark:bg-[#2D332D]'}`} />
                      <span className={campaign.percentNum >= 100 ? 'font-bold text-[#4CAF50]' : ''}>100% Goal</span>
                    </div>
                  </div>

                  {/* Deficit / Sisa Kebutuhan Row */}
                  <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-[#D8DFD8]/50 dark:border-[#2D332D]/50">
                    <span className="text-[#5A665B] dark:text-[#A0A8A0]">
                      {campaign.remainingDeficit > 0 ? (
                        <>Sisa Kebutuhan: <strong className="text-[#141A14] dark:text-[#E4E8E4] font-mono">Rp {campaign.remainingDeficit.toLocaleString('id-ID')}</strong></>
                      ) : (
                        <span className="text-[#2E7D32] dark:text-[#4CAF50] font-bold">✓ Target Telah Tercapai Sepenuhnya</span>
                      )}
                    </span>
                    <span className="text-[#5A665B] dark:text-[#A0A8A0]">
                      Rata-rata per Donatur: <strong className="font-mono text-[#141A14] dark:text-[#E4E8E4]">Rp {campaign.avgDonation.toLocaleString('id-ID')}</strong>
                    </span>
                  </div>
                </div>

                {/* Action Bar & Expandable Blockchain Audit Details Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  
                  <div className="flex items-center gap-3">
                    <button
                      id={`btn-toggle-ledger-${campaign.id}`}
                      onClick={() => toggleExpand(campaign.id)}
                      className="text-xs font-extrabold text-[#2E7D32] dark:text-[#4CAF50] hover:underline flex items-center gap-1.5 transition-all"
                    >
                      <Boxes className="w-4 h-4" />
                      <span>
                        {isExpanded 
                          ? 'Tutup Bukti Buku Besar Ledger' 
                          : `Lihat Mutasi Ledger Blockchain (${campaign.matchingTxs.length + campaign.recentDonations.length} Mutasi)`
                        }
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-donate-now-${campaign.id}`}
                      onClick={() => setActiveTab('donations')}
                      className="px-4 py-2 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Salurkan Donasi / Zakat</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* EXPANDABLE ON-CHAIN BLOCKCHAIN LEDGER ACCORDION */}
                {isExpanded && (
                  <div 
                    id={`expanded-ledger-${campaign.id}`}
                    className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-3 animate-in fade-in duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                        <Hash className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
                        <span>Rincian Verifikasi Kriptografi Proyek (Proof-of-Authority Sharia Subnet)</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#2E7D32] dark:text-[#4CAF50] font-bold bg-white dark:bg-[#1A1D1A] px-2 py-0.5 rounded border border-[#D8DFD8] dark:border-[#2D332D]">
                        Smart Contract: 0xZakatAutoEscrow.sol
                      </span>
                    </div>

                    {/* Ledger transactions list */}
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {campaign.matchingTxs.length > 0 ? (
                        campaign.matchingTxs.map(tx => (
                          <div 
                            key={tx.id}
                            className="p-3 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                                  {tx.isAnonymous ? 'Hamba Allah' : tx.donorName}
                                </span>
                                <span className="px-1.5 py-0.2 rounded bg-[#EEF3EE] dark:bg-[#242924] text-[10px] font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                                  {tx.type.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] font-mono text-[#5A665B] dark:text-[#A0A8A0]">
                                  Blok #{tx.blockNumber}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono text-[#5A665B] dark:text-[#A0A8A0] truncate max-w-md">
                                TxHash: {tx.txHash}
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                              <span className="font-extrabold font-mono text-[#2E7D32] dark:text-[#4CAF50]">
                                Rp {tx.amount.toLocaleString('id-ID')}
                              </span>
                              <button
                                onClick={() => handleInspectTx(tx)}
                                className="px-2.5 py-1 rounded-lg bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#2E7D32] hover:text-white text-[#2E7D32] dark:text-[#4CAF50] text-[11px] font-bold border border-[#D8DFD8] dark:border-[#2D332D] transition-colors flex items-center gap-1"
                              >
                                <span>Audit Explorer</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        campaign.recentDonations.map((d, idx) => (
                          <div 
                            key={idx}
                            className="p-3 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between text-xs"
                          >
                            <div className="space-y-0.5">
                              <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">{d.name}</span>
                              <p className="text-[11px] font-mono text-[#5A665B] dark:text-[#A0A8A0]">
                                Tx: {d.txHash} • {d.time}
                              </p>
                            </div>
                            <span className="font-mono font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">
                              Rp {d.amount.toLocaleString('id-ID')}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#5A665B] dark:text-[#A0A8A0] pt-1">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
                        <span>Merkle Root Hash tervalidasi pada konsensus DSN-MUI & BAZNAS RI</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('zakat-blockchain')}
                        className="text-[#2E7D32] dark:text-[#4CAF50] font-bold hover:underline"
                      >
                        Buka Node Explorer &rarr;
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </section>
  );
};
