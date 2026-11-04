import React, { useState, useMemo } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  MapPin, 
  Coins, 
  ArrowRight, 
  PlusCircle, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  Lock, 
  Building, 
  SlidersHorizontal, 
  Layers, 
  Flame, 
  Info, 
  Check, 
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  ImpactMatchingProject, 
  ImpactMatchingCategory, 
  CoFinancePledge, 
  AsnafCategory 
} from '../../types';
import confetti from 'canvas-confetti';

export const CommunityImpactMatchingSection: React.FC = () => {
  const { 
    impactMatchingProjects, 
    coFinanceProject, 
    proposeImpactMatchingProject, 
    sponsorMatchingPool,
    userProfile,
    setSelectedReceiptTx
  } = useApp();

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<ImpactMatchingCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'multiplier' | 'urgent' | 'progress' | 'target'>('multiplier');

  // Modals
  const [activeCoFinanceProject, setActiveCoFinanceProject] = useState<ImpactMatchingProject | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState<number>(100000);
  const [customPledgeAmount, setCustomPledgeAmount] = useState<string>('');
  const [zakatType, setZakatType] = useState<'ZAKAT_MAAL' | 'INFAQ_SEDEKAH' | 'WAKAF_TUNAI' | 'ZAKAT_FITRAH'>('INFAQ_SEDEKAH');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'VA_BSI' | 'VA_MANDIRI' | 'LYNK_PAY' | 'CRYPTO_USDT'>('QRIS');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [doaNote, setDoaNote] = useState<string>('Bismillah, semoga berkah untuk masyarakat dan dilipatgandakan pahalanya.');
  const [isSubmittingPledge, setIsSubmittingPledge] = useState<boolean>(false);

  // Propose New Project Modal
  const [isProposeModalOpen, setIsProposeModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<ImpactMatchingCategory>('AIR_BERSIH');
  const [newLocation, setNewLocation] = useState<string>('');
  const [newProvince, setNewProvince] = useState<string>('Jawa Barat');
  const [newInitiatorRole, setNewInitiatorRole] = useState<string>('Ketua Relawan / Tokoh Masyarakat');
  const [newProblem, setNewProblem] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newBeneficiaries, setNewBeneficiaries] = useState<string>('100 Kepala Keluarga');
  const [newTargetAmount, setNewTargetAmount] = useState<number>(30000000);
  const [newMatchingSponsor, setNewMatchingSponsor] = useState<string>('Mitra Filantropi & BAZNAS');
  const [newMatchingRatio, setNewMatchingRatio] = useState<number>(1.0);
  const [newMatchingPoolTotal, setNewMatchingPoolTotal] = useState<number>(15000000);
  const [newAsnaf, setNewAsnaf] = useState<AsnafCategory>('FISABILILLAH');
  const [newCoverImage, setNewCoverImage] = useState<string>('https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80');

  // Sponsor Top-up Modal
  const [sponsorModalProject, setSponsorModalProject] = useState<ImpactMatchingProject | null>(null);
  const [sponsorPoolAmount, setSponsorPoolAmount] = useState<number>(5000000);
  const [sponsorOrgName, setSponsorOrgName] = useState<string>('Hamba Allah / Mitra CSR');

  // Success Feedback toast
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const presetAmounts = [50000, 100000, 250000, 500000, 1000000, 2500000];

  // Distinct provinces for filter dropdown
  const provinces = useMemo(() => {
    const set = new Set<string>();
    impactMatchingProjects.forEach(p => {
      if (p.province) set.add(p.province);
    });
    return Array.from(set);
  }, [impactMatchingProjects]);

  // Aggregate Metrics
  const aggregateMetrics = useMemo(() => {
    let totalCommunity = 0;
    let totalMatched = 0;
    let totalTarget = 0;
    let totalPoolRemaining = 0;
    let totalDonors = 0;

    impactMatchingProjects.forEach(p => {
      totalCommunity += p.communityCollectedAmount;
      totalMatched += p.matchedAmount;
      totalTarget += p.targetAmount;
      totalPoolRemaining += p.matchingPoolRemaining;
      totalDonors += p.coFinancierCount;
    });

    const totalImpactUnlocked = totalCommunity + totalMatched;

    return {
      totalCommunity,
      totalMatched,
      totalTarget,
      totalPoolRemaining,
      totalDonors,
      totalImpactUnlocked,
      projectCount: impactMatchingProjects.length
    };
  }, [impactMatchingProjects]);

  // Category filter definitions
  const categories: { id: ImpactMatchingCategory; label: string; icon: string }[] = [
    { id: 'ALL', label: 'Semua Inisiatif', icon: '✨' },
    { id: 'AIR_BERSIH', label: 'Air Bersih & Sanitasi', icon: '💧' },
    { id: 'MODAL_DHUAFA', label: 'Modal Usaha Dhuafa', icon: '🛒' },
    { id: 'PENDIDIKAN_MADRASAH', label: 'Pendidikan Madrasah', icon: '📚' },
    { id: 'KESEHATAN_LANSIA', label: 'Kesehatan & Obat', icon: '🩺' },
    { id: 'WAKAF_ENERGI', label: 'Wakaf Energi Bersih', icon: '☀️' },
    { id: 'PANGAN_DARURAT', label: 'Pangan & Nutrisi Yatim', icon: '🍲' },
  ];

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return impactMatchingProjects
      .filter(p => {
        const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
        const matchProv = selectedProvince === 'ALL' || p.province === selectedProvince;
        const query = searchQuery.toLowerCase().trim();
        const matchSearch = !query || 
          p.title.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) ||
          p.initiatorName.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          p.matchingSponsorName.toLowerCase().includes(query);

        return matchCat && matchProv && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'multiplier') {
          return b.matchingRatio - a.matchingRatio;
        }
        if (sortBy === 'urgent') {
          return a.daysRemaining - b.daysRemaining;
        }
        if (sortBy === 'progress') {
          const pA = (a.communityCollectedAmount + a.matchedAmount) / a.targetAmount;
          const pB = (b.communityCollectedAmount + b.matchedAmount) / b.targetAmount;
          return pB - pA;
        }
        if (sortBy === 'target') {
          return b.targetAmount - a.targetAmount;
        }
        return 0;
      });
  }, [impactMatchingProjects, selectedCategory, selectedProvince, searchQuery, sortBy]);

  // Compute dynamic match calculation for active modal
  const effectivePledgeAmount = customPledgeAmount ? Number(customPledgeAmount) : pledgeAmount;
  const currentMatchingRatio = activeCoFinanceProject ? activeCoFinanceProject.matchingRatio : 1.0;
  const potentialMatched = Math.round(effectivePledgeAmount * currentMatchingRatio);
  const actualMatched = activeCoFinanceProject 
    ? Math.min(activeCoFinanceProject.matchingPoolRemaining, potentialMatched) 
    : potentialMatched;
  const totalCalculatedImpact = effectivePledgeAmount + actualMatched;

  // Handle co-financing execution
  const handleExecuteCoFinance = () => {
    if (!activeCoFinanceProject || effectivePledgeAmount <= 0) return;

    setIsSubmittingPledge(true);

    setTimeout(() => {
      const pledgeData: CoFinancePledge = {
        projectId: activeCoFinanceProject.id,
        donorName: userProfile.name,
        isAnonymous,
        amount: effectivePledgeAmount,
        matchedAmount: actualMatched,
        totalImpactAmount: totalCalculatedImpact,
        paymentMethod,
        doaNote,
        zakatType
      };

      const newTx = coFinanceProject(pledgeData);

      setIsSubmittingPledge(false);
      setActiveCoFinanceProject(null);
      setCustomPledgeAmount('');

      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#2E7D32', '#4CAF50', '#81C784', '#FFD54F', '#FF9800']
        });
      } catch {}

      setSelectedReceiptTx(newTx);
      setFeedbackToast(`Alhamdulillah! Co-Financing sebesar Rp ${effectivePledgeAmount.toLocaleString('id-ID')} berhasil diverifikasi di blockchain dengan dana matching Rp ${actualMatched.toLocaleString('id-ID')}.`);
    }, 750);
  };

  // Handle Propose Project Submit
  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || newTargetAmount <= 0) return;

    proposeImpactMatchingProject({
      title: newTitle,
      category: newCategory,
      categoryLabel: categories.find(c => c.id === newCategory)?.label || 'Inisiatif Amal',
      initiatorName: userProfile.name,
      initiatorAvatar: userProfile.avatar,
      initiatorRole: newInitiatorRole,
      initiatorContact: userProfile.email,
      location: newLocation || 'Wilayah Terverifikasi',
      province: newProvince,
      verifiedBy: 'Dewan Syariah BAZNAS & Mitra Amil',
      coverImage: newCoverImage,
      description: newDescription,
      problemStatement: newProblem || 'Kebutuhan mendesak masyarakat yang membutuhkan gotong royong.',
      expectedBeneficiaries: newBeneficiaries,
      targetAmount: newTargetAmount,
      matchingRatio: newMatchingRatio,
      matchingRatioLabel: `1:${newMatchingRatio} Match (${newMatchingRatio >= 1.5 ? 'Super Match' : 'Duplikasi Penuh'})`,
      matchingSponsorName: newMatchingSponsor,
      matchingSponsorBadge: 'Matching Grant Partner',
      matchingPoolTotal: newMatchingPoolTotal,
      matchingPoolRemaining: newMatchingPoolTotal,
      daysRemaining: 30,
      asnafCategory: newAsnaf,
    });

    setIsProposeModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewProblem('');
    setFeedbackToast('Inisiatif proyek lokal Anda telah berhasil diajukan dan terbuka untuk co-financing komunitas!');
  };

  // Handle Sponsor Matching Pool Submit
  const handleSponsorPoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorModalProject || sponsorPoolAmount <= 0) return;

    sponsorMatchingPool(sponsorModalProject.id, sponsorPoolAmount, sponsorOrgName);
    setSponsorModalProject(null);
    setFeedbackToast(`Komitmen Matching Grant sebesar Rp ${sponsorPoolAmount.toLocaleString('id-ID')} berhasil disuntikkan ke kolam dana ${sponsorModalProject.title}!`);
  };

  return (
    <div id="community-impact-matching-section" className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 sm:p-8 border-2 border-[#2E7D32]/30 shadow-md space-y-6">
      
      {/* Header Banner with Multiplier Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-[#D8DFD8] dark:border-[#2D332D]">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#2E7D32] text-white flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Community Impact Matching (Co-Financing)</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              ⚡ Multiplier Efek 1:1 s/d 1:2
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30">
              Smart Contract Co-Funding
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#141A14] dark:text-[#E4E8E4]">
            Lipatgandakan Dampak Zakat: Co-Financing Proyek Amal Lokal
          </h2>
          <p className="text-xs sm:text-sm text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed">
            Inisiatif akar rumput dari ustadz, masjid, dan relawan lokal yang didukung <strong>Matching Grant</strong> dari BAZNAS, CSR Bank Syariah, dan sponsor filantropi. Setiap Rupiah zakat/infaq yang Anda salurkan akan <strong>diduplikasi secara otomatis</strong> untuk melipatgandakan manfaat nyata bagi mustahik.
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setIsProposeModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-bold flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4 text-[#2E7D32]" />
            <span>Ajukan Inisiatif Lokal</span>
          </button>
        </div>
      </div>

      {/* Aggregate Multiplier KPI Stats Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* KPI 1: Total Real Impact Generated */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2E7D32]/10 to-[#2E7D32]/5 dark:from-[#2E7D32]/20 dark:to-[#2E7D32]/10 border border-[#2E7D32]/30 space-y-1">
          <div className="flex items-center justify-between text-[#2E7D32] dark:text-[#4CAF50] text-xs font-bold">
            <span>Total Dampak Terbuka</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg sm:text-xl font-black text-[#141A14] dark:text-[#E4E8E4] font-mono">
            Rp {aggregateMetrics.totalImpactUnlocked.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">
            Donatur Komunitas + Matching Sponsor
          </span>
        </div>

        {/* KPI 2: Donatur Contribution */}
        <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <div className="flex items-center justify-between text-[#5A665B] dark:text-[#A0A8A0] text-xs font-semibold">
            <span>Donasi Murni Komunitas</span>
            <Users className="w-4 h-4 text-[#2E7D32]" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-[#141A14] dark:text-[#E4E8E4] font-mono">
            Rp {aggregateMetrics.totalCommunity.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">
            Dari {aggregateMetrics.totalDonors} Co-Financier
          </span>
        </div>

        {/* KPI 3: Matching Grant Disbursed */}
        <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 text-xs font-semibold">
            <span>Dana Matching Terserap</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-amber-900 dark:text-amber-200 font-mono">
            + Rp {aggregateMetrics.totalMatched.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 block">
            Subsidi Lipat Ganda Mitra CSR
          </span>
        </div>

        {/* KPI 4: Matching Grant Pool Remaining */}
        <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/30 space-y-1">
          <div className="flex items-center justify-between text-blue-800 dark:text-blue-300 text-xs font-semibold">
            <span>Sisa Kuota Matching Pool</span>
            <Coins className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-blue-900 dark:text-blue-200 font-mono">
            Rp {aggregateMetrics.totalPoolRemaining.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-blue-700 dark:text-blue-400 block">
            Siap menggandakan donasi Anda
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 pt-2">
        {/* Category Horizontal Scrollable Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isSelected 
                    ? 'bg-[#2E7D32] text-white shadow-md shadow-[#2E7D32]/25 scale-105' 
                    : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] border border-[#D8DFD8] dark:border-[#2D332D]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search, Province & Sorting Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A665B] dark:text-[#A0A8A0]" />
            <input
              type="text"
              placeholder="Cari inisiatif, lokasi, ustadz, atau amil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#5A665B] dark:text-[#A0A8A0] shrink-0">Wilayah:</span>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs text-[#141A14] dark:text-[#E4E8E4]"
            >
              <option value="ALL">Semua Provinsi</option>
              {provinces.map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#5A665B] dark:text-[#A0A8A0] shrink-0">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs text-[#141A14] dark:text-[#E4E8E4]"
            >
              <option value="multiplier">⚡ Multiplier Tertinggi (1:2 / 1:1.5)</option>
              <option value="urgent">Mendesak (Sisa Hari Sedikit)</option>
              <option value="progress">Progres Penggalangan Tertinggi</option>
              <option value="target">Target Pendanaan Terbesar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="p-3.5 rounded-xl bg-[#2E7D32]/10 border border-[#2E7D32]/30 text-xs text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2E7D32]" />
            <span>{feedbackToast}</span>
          </div>
          <button onClick={() => setFeedbackToast(null)} className="font-bold text-xs">✕</button>
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-[#EEF3EE]/50 dark:bg-[#242924]/50 rounded-2xl border border-dashed border-[#D8DFD8] dark:border-[#2D332D] space-y-3">
          <HeartHandshake className="w-8 h-8 text-[#5A665B] mx-auto opacity-50" />
          <p className="text-sm font-bold text-[#141A14] dark:text-[#E4E8E4]">
            Tidak ada proyek inisiatif yang cocok dengan filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedProvince('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const totalCollected = project.communityCollectedAmount + project.matchedAmount;
            const progressPercent = Math.min(100, Math.round((totalCollected / project.targetAmount) * 100));
            const communityPercent = Math.min(100, Math.round((project.communityCollectedAmount / project.targetAmount) * 100));
            const matchedPercent = Math.min(100 - communityPercent, Math.round((project.matchedAmount / project.targetAmount) * 100));

            return (
              <div 
                key={project.id}
                className="bg-white dark:bg-[#121412] rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:border-[#2E7D32]/50 group"
              >
                <div>
                  {/* Card Cover with Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={project.coverImage} 
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-[#2E7D32] text-white shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>{project.matchingRatioLabel}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-black/60 backdrop-blur-sm text-white flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{project.daysRemaining} Hari</span>
                      </span>
                    </div>

                    {/* Bottom overlay in image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-200">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{project.location}, {project.province}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    
                    {/* Initiator & Verification */}
                    <div className="flex items-center justify-between text-xs gap-2 pb-2 border-b border-[#D8DFD8] dark:border-[#2D332D]">
                      <div className="flex items-center gap-2">
                        <img 
                          src={project.initiatorAvatar} 
                          alt={project.initiatorName}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover border border-[#2E7D32]"
                        />
                        <div className="truncate">
                          <span className="font-bold text-[#141A14] dark:text-[#E4E8E4] block truncate">
                            {project.initiatorName}
                          </span>
                          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block truncate">
                            {project.initiatorRole}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-[#2E7D32] dark:text-[#4CAF50] font-bold shrink-0 bg-[#2E7D32]/10 px-2 py-0.5 rounded-lg">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Terverifikasi</span>
                      </div>
                    </div>

                    {/* Title & Problem Brief */}
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-black text-[#141A14] dark:text-[#E4E8E4] line-clamp-2 leading-snug group-hover:text-[#2E7D32] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] line-clamp-2 leading-relaxed">
                        {project.problemStatement}
                      </p>
                    </div>

                    {/* Matching Grant Highlight Box */}
                    <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                          <span>⚡ Matching Sponsor:</span>
                        </span>
                        <span className="font-mono font-bold text-amber-800 dark:text-amber-300">
                          1:{project.matchingRatio} Multiplier
                        </span>
                      </div>
                      <p className="text-[10px] text-amber-900/90 dark:text-amber-200/90 font-medium">
                        {project.matchingSponsorName}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-amber-800 dark:text-amber-300 pt-1 border-t border-amber-500/20">
                        <span>Sisa Kuota Matching:</span>
                        <span className="font-mono font-bold">Rp {project.matchingPoolRemaining.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    {/* Dual-Layer Funding Progress Bar */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-[#141A14] dark:text-[#E4E8E4] font-mono text-sm">
                          Rp {totalCollected.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[#2E7D32] dark:text-[#4CAF50] font-mono">
                          {progressPercent}%
                        </span>
                      </div>

                      {/* Bar with Community + Matched segments */}
                      <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-[#2E7D32]"
                          style={{ width: `${communityPercent}%` }}
                          title={`Donasi Komunitas: Rp ${project.communityCollectedAmount.toLocaleString('id-ID')}`}
                        />
                        <div 
                          className="h-full bg-amber-500"
                          style={{ width: `${matchedPercent}%` }}
                          title={`Matching Grant: Rp ${project.matchedAmount.toLocaleString('id-ID')}`}
                        />
                      </div>

                      {/* Legend */}
                      <div className="flex items-center justify-between text-[10px] text-[#5A665B] dark:text-[#A0A8A0] pt-0.5">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                          <span>Komunitas: <strong>Rp {project.communityCollectedAmount.toLocaleString('id-ID')}</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span>Match: <strong>+Rp {project.matchedAmount.toLocaleString('id-ID')}</strong></span>
                        </div>
                      </div>

                      <div className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] flex items-center justify-between">
                        <span>Target: Rp {project.targetAmount.toLocaleString('id-ID')}</span>
                        <span>{project.expectedBeneficiaries}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveCoFinanceProject(project);
                        setPledgeAmount(100000);
                        setCustomPledgeAmount('');
                      }}
                      className="flex-1 py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-black shadow-md shadow-[#2E7D32]/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Co-Finance (Lipat Gandakan)</span>
                    </button>

                    <button
                      onClick={() => {
                        setSponsorModalProject(project);
                        setSponsorPoolAmount(5000000);
                      }}
                      className="px-3 py-3 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-bold transition-colors"
                      title="Tambah / Sponsori Kuota Matching Grant"
                    >
                      +Sponsor
                    </button>
                  </div>

                  {/* Co-Financiers mini avatar stack */}
                  <div className="flex items-center justify-between text-[11px] text-[#5A665B] dark:text-[#A0A8A0] pt-1">
                    <span>{project.coFinancierCount} Donatur Berpartisipasi</span>
                    <span className="font-mono text-[10px]">Smart Contract: {project.smartContractAddress.substring(0, 10)}...</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CO-FINANCING & MULTIPLIER EXECUTION MODAL */}
      {activeCoFinanceProject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#D8DFD8] dark:border-[#2D332D]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#141A14] dark:text-[#E4E8E4] line-clamp-1">
                    Co-Financing Inisiatif Amal Komunitas
                  </h3>
                  <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] line-clamp-1">
                    {activeCoFinanceProject.title}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveCoFinanceProject(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* LIVE MULTIPLIER IMPACT PREVIEW CALCULATOR */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#2E7D32]/15 via-[#2E7D32]/10 to-amber-500/15 border-2 border-[#2E7D32]/40 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                <span>Simulasi Lipat Ganda Dampak (Matching 1:{activeCoFinanceProject.matchingRatio})</span>
                <span className="px-2 py-0.5 rounded-full bg-[#2E7D32] text-white text-[10px]">
                  Aktif On-Chain
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#121412]/80 border border-[#D8DFD8] dark:border-[#2D332D]">
                  <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block font-semibold">1. Donasi Anda:</span>
                  <span className="text-xs sm:text-sm font-black font-mono text-[#141A14] dark:text-[#E4E8E4]">
                    Rp {effectivePledgeAmount.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/15 dark:bg-amber-500/25 border border-amber-500/40">
                  <span className="text-[10px] text-amber-900 dark:text-amber-300 block font-semibold">2. Matching Sponsor:</span>
                  <span className="text-xs sm:text-sm font-black font-mono text-amber-800 dark:text-amber-300">
                    + Rp {actualMatched.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#2E7D32] text-white shadow-md">
                  <span className="text-[10px] text-white/90 block font-semibold">3. TOTAL DAMPAK:</span>
                  <span className="text-xs sm:text-sm font-black font-mono text-amber-300">
                    Rp {totalCalculatedImpact.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] text-center pt-1">
                Matching disponsori oleh: <strong>{activeCoFinanceProject.matchingSponsorName}</strong>
              </p>
            </div>

            {/* Amount Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] flex items-center justify-between">
                <span>Pilih Nominal Donasi Anda:</span>
                <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">Min. Rp 10.000</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setPledgeAmount(amt);
                      setCustomPledgeAmount('');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                      pledgeAmount === amt && !customPledgeAmount
                        ? 'bg-[#2E7D32] text-white shadow-sm'
                        : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#141A14] dark:text-[#E4E8E4] border border-[#D8DFD8] dark:border-[#2D332D] hover:bg-[#E2E8E2]'
                    }`}
                  >
                    Rp {amt.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-[#5A665B] dark:text-[#A0A8A0]">Rp</span>
                <input
                  type="number"
                  placeholder="Atau masukkan nominal kustom lainnya..."
                  value={customPledgeAmount}
                  onChange={(e) => setCustomPledgeAmount(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-mono font-bold text-[#141A14] dark:text-[#E4E8E4]"
                />
              </div>
            </div>

            {/* Zakat Type Allocation */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                Alokasi Jenis Dana Syariah:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setZakatType('INFAQ_SEDEKAH')}
                  className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                    zakatType === 'INFAQ_SEDEKAH'
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                      : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D]'
                  }`}
                >
                  Infaq / Sedekah
                </button>
                <button
                  type="button"
                  onClick={() => setZakatType('ZAKAT_MAAL')}
                  className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                    zakatType === 'ZAKAT_MAAL'
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                      : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D]'
                  }`}
                >
                  Zakat Maal
                </button>
                <button
                  type="button"
                  onClick={() => setZakatType('WAKAF_TUNAI')}
                  className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                    zakatType === 'WAKAF_TUNAI'
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                      : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D]'
                  }`}
                >
                  Wakaf Tunai
                </button>
                <button
                  type="button"
                  onClick={() => setZakatType('ZAKAT_FITRAH')}
                  className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                    zakatType === 'ZAKAT_FITRAH'
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                      : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D]'
                  }`}
                >
                  Zakat Fitrah
                </button>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                Metode Pembayaran:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('QRIS')}
                  className={`p-2.5 rounded-xl text-left border flex items-center gap-2 ${
                    paymentMethod === 'QRIS'
                      ? 'border-[#2E7D32] bg-[#2E7D32]/10 text-[#2E7D32] font-bold'
                      : 'border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0]'
                  }`}
                >
                  <span className="p-1 rounded bg-[#2E7D32] text-white text-[9px] font-black">QRIS</span>
                  <span className="text-[11px]">QRIS Instan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('VA_BSI')}
                  className={`p-2.5 rounded-xl text-left border flex items-center gap-2 ${
                    paymentMethod === 'VA_BSI'
                      ? 'border-[#2E7D32] bg-[#2E7D32]/10 text-[#2E7D32] font-bold'
                      : 'border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0]'
                  }`}
                >
                  <span className="p-1 rounded bg-teal-700 text-white text-[9px] font-black">BSI</span>
                  <span className="text-[11px]">Bank Syariah</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('LYNK_PAY')}
                  className={`p-2.5 rounded-xl text-left border flex items-center gap-2 ${
                    paymentMethod === 'LYNK_PAY'
                      ? 'border-[#2E7D32] bg-[#2E7D32]/10 text-[#2E7D32] font-bold'
                      : 'border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0]'
                  }`}
                >
                  <span className="p-1 rounded bg-indigo-600 text-white text-[9px] font-black">LYNK</span>
                  <span className="text-[11px]">Lynk.id Wallet</span>
                </button>
              </div>
            </div>

            {/* Doa / Prayer Note */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                Doa & Pesan Kebaikan (Opsional):
              </label>
              <textarea
                rows={2}
                value={doaNote}
                onChange={(e) => setDoaNote(e.target.value)}
                className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs text-[#141A14] dark:text-[#E4E8E4]"
              />
            </div>

            {/* Anonymity Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded text-[#2E7D32] focus:ring-[#2E7D32]"
              />
              <span className="text-[#5A665B] dark:text-[#A0A8A0]">
                Sembunyikan nama saya di buku besar publik (Tampil sebagai <strong>Hamba Allah</strong>)
              </span>
            </label>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D8DFD8] dark:border-[#2D332D]">
              <button
                type="button"
                onClick={() => setActiveCoFinanceProject(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]"
              >
                Batal
              </button>
              
              <button
                type="button"
                onClick={handleExecuteCoFinance}
                disabled={isSubmittingPledge || effectivePledgeAmount <= 0}
                className="px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-extrabold shadow-lg shadow-[#2E7D32]/25 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isSubmittingPledge ? 'Memproses On-Chain...' : `Konfirmasi Co-Finance (Rp ${effectivePledgeAmount.toLocaleString('id-ID')})`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROPOSE NEW COMMUNITY INITIATIVE MODAL */}
      {isProposeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <form 
            onSubmit={handleProposeSubmit}
            className="bg-white dark:bg-[#1A1D1A] rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#D8DFD8] dark:border-[#2D332D]">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32]">
                  <PlusCircle className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                    Ajukan Inisiatif Amal Komunitas Baru
                  </h3>
                  <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                    Inisiasi proyek kebaikan lokal agar dapat menerima donasi & matching grant.
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsProposeModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">Judul Inisiatif Proyek:</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Sumur Bor Air Bersih Wudhu Dusun Sukamaju"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-medium text-[#141A14] dark:text-[#E4E8E4]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">Kategori Inisiatif:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ImpactMatchingCategory)}
                    className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4]"
                  >
                    <option value="AIR_BERSIH">Air Bersih & Sanitasi</option>
                    <option value="MODAL_DHUAFA">Pemberdayaan UMKM Mustahik</option>
                    <option value="PENDIDIKAN_MADRASAH">Pendidikan & Madrasah</option>
                    <option value="KESEHATAN_LANSIA">Kesehatan & Obat Gratis</option>
                    <option value="WAKAF_ENERGI">Wakaf Energi Terbarukan</option>
                    <option value="PANGAN_DARURAT">Pangan & Nutrisi Yatim</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">Target Asnaf:</label>
                  <select
                    value={newAsnaf}
                    onChange={(e) => setNewAsnaf(e.target.value as AsnafCategory)}
                    className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4]"
                  >
                    <option value="FAKIR">Fakir</option>
                    <option value="MISKIN">Miskin</option>
                    <option value="FISABILILLAH">Fisabilillah</option>
                    <option value="GHARIMIN">Gharimin</option>
                    <option value="IBNU_SABIL">Ibnu Sabil</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">Lokasi / Desa / Kecamatan:</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Desa Sukamaju, Kec. Cugenang"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">Provinsi:</label>
                  <select
                    value={newProvince}
                    onChange={(e) => setNewProvince(e.target.value)}
                    className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4]"
                  >
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="DKI Jakarta">DKI Jakarta</option>
                    <option value="Jawa Tengah">Jawa Tengah</option>
                    <option value="D.I. Yogyakarta">D.I. Yogyakarta</option>
                    <option value="Jawa Timur">Jawa Timur</option>
                    <option value="Banten">Banten</option>
                    <option value="Nusa Tenggara Timur">Nusa Tenggara Timur</option>
                    <option value="Jambi">Jambi</option>
                    <option value="Sumatera Barat">Sumatera Barat</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">Masalah yang Dihadapi (Problem Statement):</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Jelaskan kondisi mendesak di lapangan..."
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">Rincian Solusi & Program:</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Rincian penggunaan dana dan spesifikasi barang..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">Target Total Dana (Rp):</label>
                  <input
                    type="number"
                    required
                    value={newTargetAmount}
                    onChange={(e) => setNewTargetAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-[#141A14] dark:text-[#E4E8E4]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">Target Penerima Manfaat:</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: 150 KK (600 Jiwa)"
                    value={newBeneficiaries}
                    onChange={(e) => setNewBeneficiaries(e.target.value)}
                    className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4]"
                  />
                </div>
              </div>

              {/* Matching Pool Configuration */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 block">
                  ⚡ Matching Sponsor & Ratio:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-amber-800 dark:text-amber-300 block">Nama Mitra Sponsor:</label>
                    <input
                      type="text"
                      value={newMatchingSponsor}
                      onChange={(e) => setNewMatchingSponsor(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-amber-800 dark:text-amber-300 block">Rasio Matching:</label>
                    <select
                      value={newMatchingRatio}
                      onChange={(e) => setNewMatchingRatio(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-lg text-xs"
                    >
                      <option value={1.0}>1:1 (Duplikasi 100%)</option>
                      <option value={1.5}>1:1.5 (Super Match 150%)</option>
                      <option value={2.0}>1:2 (Triple Impact 200%)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D8DFD8] dark:border-[#2D332D]">
              <button
                type="button"
                onClick={() => setIsProposeModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-extrabold shadow-md shadow-[#2E7D32]/25"
              >
                Terbitkan Inisiatif Proyek
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SPONSOR MATCHING POOL TOP-UP MODAL */}
      {sponsorModalProject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <form 
            onSubmit={handleSponsorPoolSubmit}
            className="bg-white dark:bg-[#1A1D1A] rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-start justify-between pb-4 border-b border-[#D8DFD8] dark:border-[#2D332D]">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600">
                  <Coins className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                    Sponsori Matching Grant Pool
                  </h3>
                  <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] line-clamp-1">
                    {sponsorModalProject.title}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setSponsorModalProject(null)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed">
              Dengan mengunci komitmen dana matching, setiap donasi masyarakat akan diduplikasi secara otomatis sampai kuota dana Anda terpenuhi.
            </p>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Nama Lembaga / Sponsor:
                </label>
                <input
                  type="text"
                  required
                  value={sponsorOrgName}
                  onChange={(e) => setSponsorOrgName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Komitmen Dana Matching Tambahan (Rp):
                </label>
                <input
                  type="number"
                  required
                  value={sponsorPoolAmount}
                  onChange={(e) => setSponsorPoolAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-[#141A14] dark:text-[#E4E8E4]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D8DFD8] dark:border-[#2D332D]">
              <button
                type="button"
                onClick={() => setSponsorModalProject(null)}
                className="px-4 py-2 text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md"
              >
                Kunci Matching Grant
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
