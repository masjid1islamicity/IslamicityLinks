import React, { useState, useMemo } from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  QrCode, 
  CreditCard, 
  ExternalLink, 
  Clock, 
  Users, 
  Sparkles,
  Building,
  Building2,
  ArrowRight,
  Lock,
  Camera,
  MapPin,
  Flame,
  ArrowUpRight,
  Repeat,
  Calendar,
  Play,
  Pause,
  Trash2,
  PlusCircle,
  Check,
  AlertCircle,
  AlertTriangle,
  GraduationCap,
  Stethoscope,
  Briefcase,
  Scale,
  X,
  RotateCcw,
  SlidersHorizontal,
  Info,
  TrendingUp,
  HandHeart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  CharityCampaign, 
  MosquePhysicalBox, 
  ScannedQRCodeResult, 
  CharityQRVerificationResult,
  RecurringFrequency, 
  RecurringDonationSchedule 
} from '../../types';
import { OFFICIAL_CHARITIES, PHYSICAL_MOSQUE_BOXES } from '../../data/mockData';
import { OfficialCharityQrScannerModal } from '../donation/OfficialCharityQrScannerModal';
import { CampaignQrViewModal } from '../donation/CampaignQrViewModal';
import { MosqueBoxDonationModal } from '../MosqueBoxDonationModal';
import { RecurringScheduleCreateModal } from '../RecurringScheduleCreateModal';
import { CommunityImpactMatchingSection } from '../zakat/CommunityImpactMatchingSection';
import confetti from 'canvas-confetti';

export interface CategoryDefinition {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  badgeBg: string;
  badgeText: string;
  borderActive: string;
  description: string;
  tagline: string;
  keywords: string[];
}

export const DONATION_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'ALL',
    label: 'Semua Program',
    shortLabel: 'Semua',
    icon: Sparkles,
    color: 'text-[#2E7D32] dark:text-[#4CAF50]',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    borderActive: 'border-[#2E7D32] bg-[#2E7D32] text-white',
    description: 'Semua program donasi, infaq, zakat, dan wakaf produktif yang telah lolos audit syariah & legalitas amil resmi.',
    tagline: '100% Penyaluran transparan tercatat di blockchain & terdaftar di Kementerian Agama RI',
    keywords: []
  },
  {
    id: 'BENCANA',
    label: 'Tanggap Bencana',
    shortLabel: 'Bencana Alam',
    icon: AlertTriangle,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-500/10 dark:bg-rose-500/20',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/60',
    badgeText: 'text-rose-800 dark:text-rose-300',
    borderActive: 'border-rose-600 bg-rose-600 text-white',
    description: 'Evakuasi darurat, posko medis, tenda pengungsian, dapur umum, dan paket sembako tanggap bencana alam & musibah.',
    tagline: '“Barangsiapa membebaskan seorang mukmin dari kesusahan duniawi, Allah akan membebaskan darinya kesusahan di hari kiamat.” (HR. Muslim)',
    keywords: ['bencana', 'banjir', 'gempa', 'longsor', 'erupsi', 'darurat', 'evakuasi', 'huntara', 'dapur umum']
  },
  {
    id: 'YATIM',
    label: 'Santunan Anak Yatim',
    shortLabel: 'Yatim Piatu',
    icon: HandHeart,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/20',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
    badgeText: 'text-amber-800 dark:text-amber-300',
    borderActive: 'border-amber-600 bg-amber-600 text-white',
    description: 'Program orang tua asuh, perlengkapan sekolah, asrama panti asuhan, dan tabungan masa depan santri yatim piatu dhuafa.',
    tagline: '“Aku dan pemelihara anak yatim di surga bagaikan dua jari ini (telunjuk dan jari tengah).” (HR. Bukhari)',
    keywords: ['yatim', 'piatu', 'asuh', 'santunan yatim', 'kado bahagia', 'anak yatim']
  },
  {
    id: 'PENDIDIKAN',
    label: 'Pendidikan & Beasiswa',
    shortLabel: 'Pendidikan',
    icon: GraduationCap,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10 dark:bg-blue-500/20',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
    badgeText: 'text-blue-800 dark:text-blue-300',
    borderActive: 'border-blue-600 bg-blue-600 text-white',
    description: 'Beasiswa santri tahfidz & sains, renovasi madrasah terpencil, pengadaan buku islami, dan sarana laboratorium digital santri.',
    tagline: '“Menuntut ilmu adalah kewajiban bagi setiap muslim.” Membantu mencetak generasi santri qurani berilmu dan bertakwa.',
    keywords: ['pendidikan', 'beasiswa', 'sekolah', 'madrasah', 'santri', 'tahfidz', 'buku', 'edukasi']
  },
  {
    id: 'KESEHATAN',
    label: 'Kesehatan & Medis',
    shortLabel: 'Kesehatan',
    icon: Stethoscope,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-500/10 dark:bg-teal-500/20',
    badgeBg: 'bg-teal-100 dark:bg-teal-950/60',
    badgeText: 'text-teal-800 dark:text-teal-300',
    borderActive: 'border-teal-600 bg-teal-600 text-white',
    description: 'Operasi katarak lansia dhuafa, armada ambulans siaga 24 jam gratis, terapi gizi balita, dan bantuan biaya medis pasien pra-sejahtera.',
    tagline: 'Bantuan medis cepat dan obat-obatan gratis untuk memulihkan kesehatan serta meringankan beban saudara yang sakit.',
    keywords: ['kesehatan', 'medis', 'katarak', 'ambulans', 'obat', 'balita', 'stunting', 'operasi', 'rumah sakit']
  },
  {
    id: 'WAKAF',
    label: 'Wakaf Produktif',
    shortLabel: 'Wakaf',
    icon: Building2,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10 dark:bg-purple-500/20',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/60',
    badgeText: 'text-purple-800 dark:text-purple-300',
    borderActive: 'border-purple-600 bg-purple-600 text-white',
    description: 'Pembangunan sumur bor air bersih desa kering, instalasi wudhu higienis, perkebunan wakaf produktif, dan klinik syariah.',
    tagline: 'Pahala jariyah yang terus mengalir deras dan tidak akan terputus meskipun raga telah berpulang.',
    keywords: ['wakaf', 'sumur', 'air bersih', 'sarana', 'kebun', 'produktif']
  },
  {
    id: 'EKONOMI',
    label: 'Ekonomi Dhuafa',
    shortLabel: 'Ekonomi',
    icon: Briefcase,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950/60',
    badgeText: 'text-indigo-800 dark:text-indigo-300',
    borderActive: 'border-indigo-600 bg-indigo-600 text-white',
    description: 'Permodalan syariah tanpa riba, gerobak usaha mustahik, pendampingan bisnis halal Lynk.id, dan kemandirian peternak/petani.',
    tagline: 'Mentransformasi mustahik menjadi muzakki berdaya mandiri dengan rezeki yang halal dan barakah.',
    keywords: ['ekonomi', 'umkm', 'usaha', 'modal', 'gerobak', 'mustahik', 'mandiri']
  },
  {
    id: 'ZAKAT',
    label: 'Zakat 8 Asnaf',
    shortLabel: 'Zakat',
    icon: Scale,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    borderActive: 'border-emerald-700 bg-emerald-700 text-white',
    description: 'Penyaluran Zakat Maal, Penghasilan, dan Fitrah sesuai syariat 8 Asnaf penerima dengan buku besar audit real-time.',
    tagline: 'Kewajiban rukun Islam untuk membersihkan harta, menolak bala, dan menyucikan jiwa kita di hadapan Allah.',
    keywords: ['zakat', 'maal', 'fitrah', 'asnaf', 'fakir', 'miskin', 'amil']
  }
];

export const DonationTab: React.FC = () => {
  const { 
    campaigns, 
    addNewTransaction, 
    setSelectedReceiptTx, 
    userProfile, 
    t,
    recurringSchedules,
    addRecurringSchedule,
    toggleRecurringScheduleStatus,
    deleteRecurringSchedule,
    executeRecurringNow
  } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCharity, setSelectedCharity] = useState<string>('ALL');
  const [urgentOnly, setUrgentOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'urgent' | 'popular' | 'progress' | 'amount' | 'daysLeft'>('urgent');
  const [searchFilter, setSearchFilter] = useState<string>('');
  
  // QR Camera Scanner & Physical Mosque Box state
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannedMosqueBox, setScannedMosqueBox] = useState<MosquePhysicalBox | null>(null);
  const [isMosqueDonationModalOpen, setIsMosqueDonationModalOpen] = useState<boolean>(false);
  const [viewingQrCampaign, setViewingQrCampaign] = useState<CharityCampaign | null>(null);
  const [scannedVerification, setScannedVerification] = useState<CharityQRVerificationResult | null>(null);

  // Dedicated Recurring Schedule Create Modal
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState<boolean>(false);
  const [recurringModalCharityId, setRecurringModalCharityId] = useState<string | undefined>(undefined);

  // Modal Donation state
  const [activeCampaign, setActiveCampaign] = useState<CharityCampaign | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'VA_BSI' | 'VA_MANDIRI' | 'LYNK_PAY' | 'CRYPTO_USDT'>('QRIS');
  const [donorPrayerNote, setDonorPrayerNote] = useState<string>('Semoga berkah dan meringankan beban saudara kita.');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Recurring Donation Toggle inside Campaign Donate Modal
  const [isRecurringEnabled, setIsRecurringEnabled] = useState<boolean>(false);
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>('DAILY');
  const [recurringTimingNote, setRecurringTimingNote] = useState<string>('Setiap Subuh (04:45 WIB)');
  const [executedTxFeedback, setExecutedTxFeedback] = useState<string | null>(null);

  const presetAmounts = [25000, 50000, 100000, 250000, 500000, 1000000];

  // Helper to test if a campaign matches a category definition
  const matchesCategory = (campaign: CharityCampaign, catId: string): boolean => {
    if (catId === 'ALL') return true;
    
    const catDef = DONATION_CATEGORIES.find(c => c.id === catId);
    const upperCampCat = (campaign.category || '').toUpperCase();
    const upperTitle = (campaign.title || '').toUpperCase();
    const upperDesc = (campaign.description || '').toUpperCase();

    if (catId === 'BENCANA') {
      return upperCampCat.includes('BENCANA') || upperTitle.includes('BENCANA') || upperTitle.includes('BANJIR') || upperTitle.includes('GEMPA') || upperTitle.includes('DARURAT');
    }
    if (catId === 'YATIM') {
      return upperCampCat.includes('YATIM') || upperTitle.includes('YATIM') || upperDesc.includes('YATIM') || upperTitle.includes('ASUH');
    }
    if (catId === 'PENDIDIKAN') {
      return upperCampCat.includes('PENDIDIKAN') || upperCampCat.includes('BEASISWA') || upperTitle.includes('PENDIDIKAN') || upperTitle.includes('BEASISWA') || upperTitle.includes('MADRASAH') || upperTitle.includes('SANTRI');
    }
    if (catId === 'KESEHATAN') {
      return upperCampCat.includes('KESEHATAN') || upperCampCat.includes('MEDIS') || upperTitle.includes('KATARAK') || upperTitle.includes('AMBULANS') || upperTitle.includes('MEDIS');
    }
    if (catId === 'WAKAF') {
      return upperCampCat.includes('WAKAF') || upperTitle.includes('WAKAF') || upperDesc.includes('WAKAF');
    }
    if (catId === 'EKONOMI') {
      return upperCampCat.includes('EKONOMI') || upperCampCat.includes('UMKM') || upperTitle.includes('MODAL') || upperTitle.includes('UMKM') || upperTitle.includes('USAHA');
    }
    if (catId === 'ZAKAT') {
      return upperCampCat.includes('ZAKAT') || upperTitle.includes('ZAKAT');
    }

    if (catDef && catDef.keywords.length > 0) {
      return catDef.keywords.some(k => 
        upperCampCat.includes(k.toUpperCase()) || 
        upperTitle.includes(k.toUpperCase()) || 
        upperDesc.includes(k.toUpperCase())
      );
    }

    return upperCampCat.includes(catId);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    DONATION_CATEGORIES.forEach(cat => {
      counts[cat.id] = campaigns.filter(c => matchesCategory(c, cat.id)).length;
    });
    return counts;
  }, [campaigns]);

  // Multi-dimensional filtered & sorted campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter(c => {
        // Category filter
        const matchCat = matchesCategory(c, selectedCategory);

        // Charity filter
        const matchCharity = selectedCharity === 'ALL' || c.charityId === selectedCharity;

        // Urgent filter
        const matchUrgent = !urgentOnly || Boolean(c.isUrgent);

        // Search text filter
        const query = searchFilter.toLowerCase().trim();
        const matchSearch = !query || 
          c.title.toLowerCase().includes(query) || 
          c.description.toLowerCase().includes(query) ||
          c.charityName.toLowerCase().includes(query) ||
          (c.category && c.category.toLowerCase().includes(query)) ||
          (c.asnafCategory && c.asnafCategory.toLowerCase().includes(query));

        return matchCat && matchCharity && matchUrgent && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'urgent') {
          if (a.isUrgent && !b.isUrgent) return -1;
          if (!a.isUrgent && b.isUrgent) return 1;
          return (a.daysLeft || 30) - (b.daysLeft || 30);
        }
        if (sortBy === 'popular') {
          return (b.donorCount || 0) - (a.donorCount || 0);
        }
        if (sortBy === 'progress') {
          const pA = a.collectedAmount / a.targetAmount;
          const pB = b.collectedAmount / b.targetAmount;
          return pB - pA;
        }
        if (sortBy === 'amount') {
          return b.collectedAmount - a.collectedAmount;
        }
        if (sortBy === 'daysLeft') {
          return (a.daysLeft || 30) - (b.daysLeft || 30);
        }
        return 0;
      });
  }, [campaigns, selectedCategory, selectedCharity, urgentOnly, sortBy, searchFilter]);

  const activeCategoryDef = useMemo(() => {
    return DONATION_CATEGORIES.find(c => c.id === selectedCategory) || DONATION_CATEGORIES[0];
  }, [selectedCategory]);

  const hasActiveFilters = selectedCategory !== 'ALL' || selectedCharity !== 'ALL' || urgentOnly || searchFilter !== '';

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setSelectedCharity('ALL');
    setUrgentOnly(false);
    setSearchFilter('');
    setSortBy('urgent');
  };

  const handleOpenDonateModal = (campaign: CharityCampaign) => {
    setActiveCampaign(campaign);
    setDonationAmount(100000);
    setCustomAmount('');
    setIsRecurringEnabled(false);
    setRecurringFrequency('DAILY');
    setRecurringTimingNote('Setiap Subuh (04:45 WIB)');
  };

  const handleScanVerificationConfirm = (result: CharityQRVerificationResult) => {
    setIsScannerOpen(false);
    setScannedVerification(result);

    if (result.mosqueBox) {
      setScannedMosqueBox(result.mosqueBox);
      setIsMosqueDonationModalOpen(true);
    } else if (result.campaign) {
      setActiveCampaign(result.campaign);
      setDonationAmount(result.suggestedAmount || 100000);
      setCustomAmount('');
      setIsRecurringEnabled(false);
      setRecurringFrequency('DAILY');
      setRecurringTimingNote('Setiap Subuh (04:45 WIB)');
    } else if (result.charity) {
      const camp = campaigns.find(c => c.charityId === result.charity?.id) || campaigns[0];
      if (camp) {
        setActiveCampaign(camp);
        setDonationAmount(result.suggestedAmount || 100000);
        setCustomAmount('');
        setIsRecurringEnabled(false);
      }
    } else {
      const defaultBox = PHYSICAL_MOSQUE_BOXES[0];
      setScannedMosqueBox(defaultBox);
      setIsMosqueDonationModalOpen(true);
    }
  };

  const handleQuickSelectMosqueBox = (box: MosquePhysicalBox) => {
    setScannedMosqueBox(box);
    setIsMosqueDonationModalOpen(true);
  };

  const handleRecurringFrequencyChange = (freq: RecurringFrequency) => {
    setRecurringFrequency(freq);
    if (freq === 'DAILY') {
      setRecurringTimingNote('Setiap Subuh (04:45 WIB)');
    } else if (freq === 'WEEKLY') {
      setRecurringTimingNote('Setiap Hari Jumat Berkah (08:00 WIB)');
    } else {
      setRecurringTimingNote('Setiap Tanggal 25 (Gajian 09:00 WIB)');
    }
  };

  const handleExecuteDonation = () => {
    if (!activeCampaign) return;
    const finalAmount = customAmount ? Number(customAmount) : donationAmount;
    if (finalAmount <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#2E7D32', '#4CAF50', '#81C784', '#FFD54F']
        });
      } catch {}

      let newTx;

      if (isRecurringEnabled) {
        // Create an Automated Recurring Schedule
        const nextDateStr = recurringFrequency === 'DAILY'
          ? 'Besok, 04:45 WIB'
          : recurringFrequency === 'WEEKLY'
          ? 'Jumat Depan, 08:00 WIB'
          : 'Tanggal 25 Bulan Depan, 09:00 WIB';

        const schedulePaymentMethod = paymentMethod === 'VA_BSI' 
          ? 'AUTO_DEBIT_BSI' 
          : paymentMethod === 'LYNK_PAY' 
          ? 'LYNK_WALLET' 
          : paymentMethod === 'VA_MANDIRI' 
          ? 'MANDIRI_AUTODEBIT' 
          : 'QRIS_AUTOPAY';

        const schedule = addRecurringSchedule({
          charityId: activeCampaign.charityId,
          charityName: activeCampaign.charityName,
          campaignId: activeCampaign.id,
          campaignTitle: activeCampaign.title,
          amount: finalAmount,
          frequency: recurringFrequency,
          timingDetails: recurringTimingNote,
          paymentMethod: schedulePaymentMethod,
          status: 'ACTIVE',
          nextExecutionDate: nextDateStr,
          isAnonymous,
          note: donorPrayerNote,
          asnafCategory: activeCampaign.asnafCategory || 'FISABILILLAH',
        });

        newTx = {
          id: 'tx_rec_' + Date.now().toString(36),
          txHash: '0x' + schedule.smartContract,
          blockNumber: 148295,
          timestamp: new Date().toISOString(),
          type: (activeCampaign.category === 'WAKAF' ? 'WAKAF_PRODUKTIF' : 'INFAQ_SEDEKAH') as any,
          donorName: isAnonymous ? 'Hamba Allah' : userProfile.name,
          isAnonymous,
          amount: finalAmount,
          charityId: activeCampaign.charityId,
          charityName: activeCampaign.charityName + ' (Autodebit Berkala)',
          status: 'CONFIRMED' as const,
          smartContract: schedule.smartContract,
          merkleProof: '0x' + schedule.smartContract.substring(2, 24),
          officialReceiptNumber: `BSZ-REC/${Date.now().toString().slice(-6)}`,
        };
      } else {
        // Standard one-time donation
        newTx = addNewTransaction({
          charityId: activeCampaign.charityId,
          charityName: activeCampaign.charityName,
          donorName: userProfile.name,
          amount: finalAmount,
          type: (activeCampaign.category === 'WAKAF' ? 'WAKAF_PRODUKTIF' : 'INFAQ_SEDEKAH') as any,
          isAnonymous,
          smartContract: `0x98D2...CHARITY_${activeCampaign.charityId.toUpperCase()}`,
          status: 'CONFIRMED',
          asnafTarget: activeCampaign.asnafCategory || 'FISABILILLAH',
        });
      }

      setIsProcessing(false);
      setActiveCampaign(null);
      setSelectedReceiptTx(newTx);
    }, 850);
  };

  const handleManualTriggerTest = (scheduleId: string) => {
    const tx = executeRecurringNow(scheduleId);
    if (tx) {
      setExecutedTxFeedback(scheduleId);
      setTimeout(() => setExecutedTxFeedback(null), 3500);
      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#2E7D32', '#4CAF50']
        });
      } catch {}
    }
  };

  const totalActiveRecurringCount = recurringSchedules.filter(s => s.status === 'ACTIVE').length;
  const totalRecurringDonated = recurringSchedules.reduce((acc, s) => acc + s.totalAmountDonated, 0);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1F3D22] via-[#172E19] to-[#121E13] rounded-3xl p-6 sm:p-8 text-[#E4E8E4] shadow-lg border border-[#2D332D] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#4CAF50] text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4" />
              <span>Donasi & Wakaf Produktif 100% Transparan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Penyaluran Amal Lembaga Resmi & Kotak Masjid
            </h1>
            <p className="text-xs sm:text-sm text-[#E4E8E4]/90 max-w-2xl leading-relaxed">
              Tersambung langsung ke rekening amil terdaftar (BAZNAS, Dompet Dhuafa, Rumah Zakat, LAZISNU, LAZISMU) dan kotak infaq fisik masjid terverifikasi.
            </p>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <a
              href="#community-impact-matching-section"
              className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:scale-[1.02] transition-all border border-amber-300/30"
            >
              <Sparkles className="w-4 h-4 text-amber-100" />
              <div className="text-left">
                <span className="block leading-tight">Co-Financing Komunitas</span>
                <span className="text-[10px] font-normal text-white/90">⚡ Matching 1:1 - 1:2</span>
              </div>
            </a>

            <button
              id="btn-header-open-recurring-modal"
              onClick={() => {
                setRecurringModalCharityId(undefined);
                setIsRecurringModalOpen(true);
              }}
              className="px-4 py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#2E7D32]/30 hover:scale-[1.02] transition-all border border-[#4CAF50]/30"
            >
              <Repeat className="w-4 h-4 text-emerald-300" />
              <div className="text-left">
                <span className="block leading-tight">Sedekah Otomatis</span>
                <span className="text-[10px] font-normal text-white/80">Jadwal Harian / Jumat / Gaji</span>
              </div>
            </button>

            <button
              id="btn-header-open-qr-scanner"
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-3 rounded-2xl bg-[#4CAF50] hover:bg-[#43A047] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-[#4CAF50]/30 hover:scale-[1.03] transition-all"
            >
              <div className="relative">
                <Camera className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
              </div>
              <div className="text-left">
                <span className="block leading-tight">Pindai QR Donasi</span>
                <span className="text-[10px] font-normal text-white/90">Verifikasi Amil & QRIS</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* DEDICATED SECTION: Automated Recurring Donations (Sedekah Rutin Autodebit) */}
      <div 
        id="automated-recurring-donations-section"
        className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 sm:p-7 border-2 border-[#2E7D32]/25 shadow-md space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#D8DFD8] dark:border-[#2D332D]">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2E7D32] to-[#1F3D22] text-white flex items-center justify-center shadow-lg shadow-[#2E7D32]/25 shrink-0">
              <Repeat className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] text-[11px] font-extrabold border border-[#2E7D32]/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Amalan Paling Dicintai Allah: Istiqomah</span>
                </span>
                <span className="text-xs text-[#5A665B] dark:text-[#A0A8A0] font-semibold hidden sm:inline">
                  Smart Contract Autodebit
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                Jadwal Sedekah & Infaq Otomatis (Recurring Donation)
              </h2>
              <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] max-w-2xl leading-relaxed">
                Jadwalkan donasi rutin secara otomatis (Harian/Sedekah Subuh, Mingguan/Jumat Berkah, atau Bulanan/Gajian) langsung ke rekening amil terverifikasi dengan mutasi transparan di blockchain.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto shrink-0 flex-wrap">
            <div className="px-3.5 py-2 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-left">
              <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block font-bold uppercase">
                Total Rutin Tersalurkan
              </span>
              <span className="text-sm font-mono font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">
                Rp {totalRecurringDonated.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              id="btn-create-new-recurring-plan"
              onClick={() => {
                setRecurringModalCharityId(undefined);
                setIsRecurringModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-[#2E7D32]/25 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Jadwal Baru</span>
            </button>
          </div>
        </div>

        {/* Active Recurring Schedules List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1.5">
              <span>Jadwal Aktif Anda ({totalActiveRecurringCount} Berjalan)</span>
            </h3>
            <span className="text-[11px] text-[#2E7D32] dark:text-[#4CAF50] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>0% Biaya Admin Platform</span>
            </span>
          </div>

          {recurringSchedules.length === 0 ? (
            <div className="p-8 text-center bg-[#EEF3EE]/60 dark:bg-[#242924]/60 rounded-3xl border border-dashed border-[#D8DFD8] dark:border-[#2D332D] space-y-3">
              <Repeat className="w-8 h-8 text-[#5A665B] dark:text-[#A0A8A0] mx-auto opacity-50" />
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                  Belum Ada Jadwal Sedekah Otomatis
                </h4>
                <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] max-w-md mx-auto">
                  Mulai rutinitas sedekah harian atau mingguan Anda untuk menjaga keistiqomahan beramal.
                </p>
              </div>
              <button
                onClick={() => setIsRecurringModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold shadow-sm"
              >
                Aktifkan Sedekah Rutin Pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {recurringSchedules.map(schedule => {
                const isDaily = schedule.frequency === 'DAILY';
                const isWeekly = schedule.frequency === 'WEEKLY';
                const isMonthly = schedule.frequency === 'MONTHLY';
                const isActive = schedule.status === 'ACTIVE';

                return (
                  <div
                    key={schedule.id}
                    id={`card-recurring-${schedule.id}`}
                    className={`p-4 rounded-3xl border transition-all flex flex-col justify-between space-y-3 relative shadow-sm ${
                      isActive
                        ? 'bg-gradient-to-b from-white to-[#F8FCF8] dark:from-[#1A1D1A] dark:to-[#171D17] border-[#D8DFD8] dark:border-[#2D332D] hover:border-[#2E7D32]'
                        : 'bg-[#EEF3EE]/50 dark:bg-[#242924]/40 border-dashed border-amber-500/40 opacity-80'
                    }`}
                  >
                    {/* Top Row: Frequency Badge & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                          isDaily
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : isWeekly
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-[#2E7D32] dark:text-[#4CAF50] border border-emerald-200 dark:border-emerald-800'
                            : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        }`}>
                          {isDaily ? <Clock className="w-3 h-3" /> : isWeekly ? <Calendar className="w-3 h-3" /> : <Repeat className="w-3 h-3" />}
                          <span>{isDaily ? 'Harian (Subuh)' : isWeekly ? 'Mingguan (Jumat)' : 'Bulanan (Gaji)'}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                        }`}>
                          {isActive ? '● Aktif' : '⏸ Dijeda'}
                        </span>
                      </div>
                    </div>

                    {/* Program & Charity Info */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#2E7D32] dark:text-[#4CAF50] block">
                        {schedule.charityName}
                      </span>
                      <h4 className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4] line-clamp-1">
                        {schedule.campaignTitle || 'Donasi Rutin Kemaslahatan Umat'}
                      </h4>
                      <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-[#2E7D32] dark:text-[#4CAF50] shrink-0" />
                        <span>{schedule.timingDetails}</span>
                      </p>
                    </div>

                    {/* Amount & Accumulation Stats */}
                    <div className="p-2.5 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">Nominal per Tarik:</span>
                        <span className="font-mono font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                          Rp {schedule.amount.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#5A665B] dark:text-[#A0A8A0] pt-1 border-t border-[#D8DFD8] dark:border-[#2D332D]">
                        <span>Tersalurkan {schedule.totalExecutedCount}x:</span>
                        <span className="font-mono font-semibold text-[#141A14] dark:text-[#E4E8E4]">
                          Rp {schedule.totalAmountDonated.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Next execution notice */}
                    <div className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] flex items-center justify-between">
                      <span>Jadwal berikutnya:</span>
                      <span className="font-semibold text-[#141A14] dark:text-[#E4E8E4]">
                        {schedule.nextExecutionDate}
                      </span>
                    </div>

                    {/* Feedback when test triggered */}
                    {executedTxFeedback === schedule.id && (
                      <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Berhasil dieksekusi & dicatat di blockchain!</span>
                      </div>
                    )}

                    {/* Action Buttons: Pause/Resume, Manual Test Trigger, Delete */}
                    <div className="pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between gap-1.5">
                      <button
                        id={`btn-trigger-now-${schedule.id}`}
                        onClick={() => handleManualTriggerTest(schedule.id)}
                        title="Eksekusi donasi rutin sekarang (Simulasi Tarik Manual)"
                        className="px-2.5 py-1.5 rounded-xl bg-[#2E7D32]/10 hover:bg-[#2E7D32]/20 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-[10px] flex items-center gap-1 transition-all"
                      >
                        <Play className="w-3 h-3" />
                        <span>Tarik Sekarang</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          id={`btn-toggle-status-${schedule.id}`}
                          onClick={() => toggleRecurringScheduleStatus(schedule.id)}
                          title={isActive ? 'Jeda donasi otomatis' : 'Lanjutkan donasi otomatis'}
                          className="p-1.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#D8DFD8] dark:hover:bg-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] text-xs transition-colors"
                        >
                          {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />}
                        </button>

                        <button
                          id={`btn-delete-schedule-${schedule.id}`}
                          onClick={() => deleteRecurringSchedule(schedule.id)}
                          title="Hapus jadwal donasi rutin"
                          className="p-1.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-rose-100 dark:hover:bg-rose-950/60 text-[#5A665B] hover:text-rose-600 dark:text-[#A0A8A0] text-xs transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FEATURED: Physical Mosque Box QR Scanner Showcase Section */}
      <div 
        id="physical-mosque-scanner-card"
        className="bg-gradient-to-br from-white via-[#F4FAF4] to-[#EEF3EE] dark:from-[#1A1D1A] dark:via-[#1E241E] dark:to-[#171D17] rounded-3xl p-6 sm:p-7 border-2 border-[#2E7D32]/30 shadow-md space-y-5"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center shadow-lg shadow-[#2E7D32]/25 shrink-0">
              <QrCode className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] text-[11px] font-extrabold border border-[#2E7D32]/20">
                  Fitur Masjid Cerdas
                </span>
                <span className="text-xs text-[#5A665B] dark:text-[#A0A8A0] font-semibold">
                  Sedekah Non-Tunai Langsung di Tempat
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                Sedekah di Masjid? Pindai Stiker Kotak Amal Fisik
              </h2>
              <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] max-w-2xl leading-relaxed">
                Sedang berada di masjid untuk shalat berjamaah atau kajian? Gunakan kamera untuk memindai stiker QRIS pada kotak infaq keliling, kotak sedekah subuh, atau kotak renovasi masjid.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
            <button
              id="btn-action-open-scanner"
              onClick={() => setIsScannerOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#2E7D32]/25 transition-all hover:scale-[1.02]"
            >
              <Camera className="w-4 h-4" />
              <span>Buka Scanner Kamera</span>
            </button>
          </div>
        </div>

        {/* Quick Simulated Physical Box Previews */}
        <div className="pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">
              Kotak Amal Masjid Terpopuler (Klik untuk Donasi Cepat Tanpa Kamera):
            </span>
            <span className="text-[11px] font-bold text-[#2E7D32] dark:text-[#4CAF50] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verifikasi DKM Resmi</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PHYSICAL_MOSQUE_BOXES.slice(0, 3).map(box => (
              <div
                key={box.id}
                id={`card-quick-box-${box.id}`}
                onClick={() => handleQuickSelectMosqueBox(box)}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] hover:border-[#2E7D32] transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={box.photoUrl}
                    alt={box.mosqueName}
                    className="w-11 h-11 rounded-xl object-cover border border-[#D8DFD8] dark:border-[#2D332D] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#EEF3EE] dark:bg-[#242924] text-[#2E7D32] dark:text-[#4CAF50]">
                        {box.boxType.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4] truncate group-hover:text-[#2E7D32] dark:group-hover:text-[#4CAF50] transition-colors">
                      {box.mosqueName}
                    </h4>
                    <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] truncate">
                      {box.locationDetails}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] group-hover:bg-[#2E7D32] group-hover:text-white text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center shrink-0 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED: Community Impact Matching (Co-Financing Local Charity Projects) */}
      <CommunityImpactMatchingSection />

      {/* Official Charities Accredited Bar with Interactive Filter */}
      <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
            <span className="text-xs font-extrabold text-[#5A665B] dark:text-[#A0A8A0] uppercase tracking-wider">
              Mitra Lembaga Filantropi Syariah Resmi Terakreditasi:
            </span>
          </div>
          <div className="flex items-center gap-2">
            {selectedCharity !== 'ALL' && (
              <button
                onClick={() => setSelectedCharity('ALL')}
                className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Hapus Filter Lembaga</span>
              </button>
            )}
            <span className="text-[11px] text-[#2E7D32] dark:text-[#4CAF50] font-bold bg-[#EEF3EE] dark:bg-[#242924] px-2.5 py-0.5 rounded-full border border-[#D8DFD8] dark:border-[#2D332D]">
              ✓ Audit Akuntabel WTP & Kemenag
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {OFFICIAL_CHARITIES.map(c => {
            const isSelected = selectedCharity === c.id;
            return (
              <button
                key={c.id}
                id={`btn-filter-charity-${c.id}`}
                onClick={() => setSelectedCharity(isSelected ? 'ALL' : c.id)}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all relative ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#2E7D32] dark:border-[#4CAF50] ring-2 ring-[#2E7D32]/30 shadow-md scale-[1.02]'
                    : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] hover:border-[#2E7D32]/60 hover:bg-emerald-50/50 dark:hover:bg-[#283028]'
                }`}
              >
                <img
                  src={c.logo}
                  alt={c.name}
                  className="w-8 h-8 rounded-lg object-contain bg-white p-1 border border-[#D8DFD8] dark:border-[#2D332D] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] truncate">
                    {c.name.split(' ')[0]} {c.name.split(' ')[1] || ''}
                  </h4>
                  <span className="text-[10px] text-[#2E7D32] dark:text-[#4CAF50] font-semibold block truncate">
                    {c.accountNumber?.split('/')[0] || 'Rekening Resmi'}
                  </span>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-[10px] shrink-0">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CATEGORY-BASED FILTER SYSTEM */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span>Jelajahi Program Berdasarkan Kategori Kebaikan</span>
            </h2>
            <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
              Pilih program bantuan sesuai niat ibadah Anda (Tanggap Darurat Bencana, Anak Yatim, Pendidikan, Kesehatan, dsb.)
            </p>
          </div>
          <span className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0] self-start sm:self-auto">
            Menampilkan <span className="text-[#2E7D32] dark:text-[#4CAF50] font-extrabold">{filteredCampaigns.length}</span> dari {campaigns.length} Program
          </span>
        </div>

        {/* Category Filter Pills with Counter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {DONATION_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                id={`btn-cat-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? `${cat.borderActive} shadow-md scale-[1.02]`
                    : 'bg-white dark:bg-[#1A1D1A] border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : cat.color}`} />
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Cause Spotlight & Islamic Motivation Banner */}
        {selectedCategory !== 'ALL' && (
          <div 
            id="category-cause-spotlight-banner"
            className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-[#F4FAF4] to-white dark:from-[#172318] dark:via-[#1A1D1A] dark:to-[#171D17] border border-[#2E7D32]/30 shadow-sm space-y-2.5 animate-in fade-in duration-200"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-2xl ${activeCategoryDef.bgColor} ${activeCategoryDef.color} flex items-center justify-center shrink-0 border border-current/20`}>
                  {React.createElement(activeCategoryDef.icon, { className: 'w-5 h-5' })}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${activeCategoryDef.badgeBg} ${activeCategoryDef.badgeText}`}>
                      Kategori: {activeCategoryDef.label}
                    </span>
                    <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] font-semibold">
                      {filteredCampaigns.length} Program Tersedia
                    </span>
                  </div>
                  <p className="text-xs text-[#141A14] dark:text-[#E4E8E4] font-medium leading-relaxed max-w-2xl">
                    {activeCategoryDef.description}
                  </p>
                </div>
              </div>

              <div className="text-left md:text-right shrink-0 bg-white/70 dark:bg-[#242924]/70 p-2.5 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D]">
                <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block uppercase font-bold">
                  Akad Penyaluran
                </span>
                <span className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Tepat Sasaran</span>
                </span>
              </div>
            </div>

            {/* Hadith / Islamic Motivation Quote */}
            <div className="pt-2 border-t border-[#D8DFD8]/80 dark:border-[#2D332D] flex items-center gap-2 text-xs italic text-[#5A665B] dark:text-[#A0A8A0]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{activeCategoryDef.tagline}</span>
            </div>
          </div>
        )}

        {/* Filter and Search Bar Controls Toolbar */}
        <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-3.5 sm:p-4 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A665B] dark:text-[#A0A8A0]" />
              <input
                type="text"
                id="input-search-campaigns"
                placeholder="Cari program donasi, bencana, anak yatim, beasiswa, atau nama lembaga..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-[#EEF3EE]/60 dark:bg-[#242924]/60 border border-[#D8DFD8] dark:border-[#2D332D] rounded-2xl text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:border-[#2E7D32] transition-colors"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A665B] hover:text-rose-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sub-Filters: Charity Partner Selector, Urgent Toggle, Sort Selector */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Partner Dropdown */}
              <div className="relative shrink-0 flex-1 sm:flex-none">
                <select
                  id="select-charity-partner"
                  value={selectedCharity}
                  onChange={(e) => setSelectedCharity(e.target.value)}
                  className="w-full sm:w-auto text-xs font-bold py-2 pl-3 pr-8 rounded-2xl bg-[#EEF3EE]/70 dark:bg-[#242924]/70 border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Semua Lembaga Mitra ({OFFICIAL_CHARITIES.length})</option>
                  {OFFICIAL_CHARITIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Urgent Only Filter Button */}
              <button
                id="btn-toggle-urgent-only"
                onClick={() => setUrgentOnly(!urgentOnly)}
                className={`px-3 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all border shrink-0 ${
                  urgentOnly
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-[#EEF3EE]/70 dark:bg-[#242924]/70 border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] hover:text-rose-600'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${urgentOnly ? 'text-white' : 'text-rose-500'}`} />
                <span>Mendesak Saja</span>
              </button>

              {/* Sort Selector */}
              <div className="relative shrink-0 flex-1 sm:flex-none">
                <select
                  id="select-sort-campaigns"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto text-xs font-bold py-2 pl-3 pr-8 rounded-2xl bg-[#EEF3EE]/70 dark:bg-[#242924]/70 border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] focus:outline-none cursor-pointer"
                >
                  <option value="urgent">🔥 Paling Mendesak</option>
                  <option value="popular">👥 Donatur Terbanyak</option>
                  <option value="progress">📈 Persentase Terkumpul</option>
                  <option value="amount">💰 Dana Terbesar</option>
                  <option value="daysLeft">⏳ Sisa Hari Sedikit</option>
                </select>
              </div>

              {/* Quick Scanner Icon Button */}
              <button
                id="btn-quick-scan-filter-bar"
                onClick={() => setIsScannerOpen(true)}
                title="Scan QR Kotak Amal Masjid"
                className="p-2.5 rounded-2xl bg-[#2E7D32] text-white hover:bg-[#256629] shadow-sm transition-all shrink-0"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Filter Badges Strip & Reset Action */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] font-semibold">Filter aktif:</span>
                
                {selectedCategory !== 'ALL' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] text-[11px] font-bold border border-[#2E7D32]/20 flex items-center gap-1">
                    <span>Kategori: {activeCategoryDef.label}</span>
                    <button onClick={() => setSelectedCategory('ALL')} className="hover:text-rose-600">×</button>
                  </span>
                )}

                {selectedCharity !== 'ALL' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400 text-[11px] font-bold border border-blue-500/20 flex items-center gap-1">
                    <span>Lembaga: {OFFICIAL_CHARITIES.find(c => c.id === selectedCharity)?.name || selectedCharity}</span>
                    <button onClick={() => setSelectedCharity('ALL')} className="hover:text-rose-600">×</button>
                  </span>
                )}

                {urgentOnly && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-400 text-[11px] font-bold border border-rose-500/20 flex items-center gap-1">
                    <span>🔥 Hanya Mendesak</span>
                    <button onClick={() => setUrgentOnly(false)} className="hover:text-rose-600">×</button>
                  </span>
                )}

                {searchFilter && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[11px] font-bold border border-amber-500/20 flex items-center gap-1">
                    <span>Cari: "{searchFilter}"</span>
                    <button onClick={() => setSearchFilter('')} className="hover:text-rose-600">×</button>
                  </span>
                )}
              </div>

              <button
                id="btn-reset-all-filters"
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Semua Filter</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DEDICATED SECTION: Official Charity & QRIS Scanner Callout Banner */}
      <div 
        id="qr-verification-callout-banner"
        className="bg-gradient-to-r from-[#173019] via-[#1F3D22] to-[#122313] rounded-3xl p-5 sm:p-6 text-white border-2 border-[#4CAF50]/35 shadow-lg relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#4CAF50]/20 border border-[#4CAF50]/40 text-[#4CAF50] flex items-center justify-center shrink-0 shadow-inner">
              <QrCode className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verifikasi Amil & Anti-Fraud QRIS</span>
                </span>
                <span className="text-[11px] text-emerald-200/80 font-medium hidden sm:inline">
                  Validasi Database Kemenag RI & BAZNAS
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Punya Kode QR Donasi atau QRIS Masjid?
              </h3>
              <p className="text-xs text-white/85 max-w-xl leading-relaxed">
                Pindai dengan kamera ponsel atau unggah berkas foto untuk memvalidasi legalitas amil resmi, audit syariah, dan memastikan dana tersalurkan aman dari manipulasi barcode palsu.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              id="btn-callout-scan-qr"
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-[#4CAF50]/30 hover:scale-[1.02] transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Pindai QR Sekarang</span>
            </button>

            <button
              id="btn-callout-presets-qr"
              onClick={() => setIsScannerOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 hover:scale-[1.02] transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Contoh Kode Resmi</span>
            </button>
          </div>
        </div>
      </div>

      {/* CAMPAIGNS GRID / EMPTY STATE */}
      {filteredCampaigns.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#1A1D1A] rounded-3xl border border-dashed border-[#D8DFD8] dark:border-[#2D332D] space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Filter className="w-8 h-8 opacity-75" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
              Tidak Ada Program yang Cocok dengan Filter
            </h3>
            <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] max-w-md mx-auto leading-relaxed">
              Coba ubah kata kunci pencarian, pilih kategori lain, atau reset filter untuk melihat semua program donasi resmi.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs shadow-md transition-all"
          >
            Tampilkan Semua Program Donasi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(camp => {
            const percent = Math.min(100, Math.round((camp.collectedAmount / camp.targetAmount) * 100));
            const campCatDef = DONATION_CATEGORIES.find(c => matchesCategory(camp, c.id) && c.id !== 'ALL') || DONATION_CATEGORIES[0];
            const CategoryIcon = campCatDef.icon;

            return (
              <div
                key={camp.id}
                id={`card-camp-${camp.id}`}
                className="bg-white dark:bg-[#1A1D1A] rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-[#2E7D32]/50 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Banner with Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={camp.coverImage}
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Top Left: Charity Name */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#2E7D32] text-white shadow-md flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{camp.charityName}</span>
                    </div>

                    {/* Top Right: Urgent Indicator */}
                    {camp.isUrgent && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-600 text-white shadow-md flex items-center gap-1 animate-pulse">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>Mendesak</span>
                      </div>
                    )}

                    {/* Bottom Left: Cause Category Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold backdrop-blur-md shadow-md flex items-center gap-1 bg-black/60 text-white border border-white/20`}>
                        <CategoryIcon className={`w-3.5 h-3.5 ${campCatDef.color}`} />
                        <span>{campCatDef.shortLabel}</span>
                      </span>
                    </div>

                    {/* Bottom Right: Days Left Badge */}
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/90 dark:bg-black/80 text-[#141A14] dark:text-[#E4E8E4] shadow">
                      ⏳ {camp.daysLeft || camp.daysRemaining || 30} Hari Lagi
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                      <div className="flex items-center gap-1.5 font-semibold text-[#2E7D32] dark:text-[#4CAF50]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{camp.charityBadge || 'Akreditasi A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{camp.donorCount.toLocaleString('id-ID')} Donatur</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4] leading-snug line-clamp-2 group-hover:text-[#2E7D32] dark:group-hover:text-[#4CAF50] transition-colors">
                      {camp.title}
                    </h3>

                    <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] line-clamp-2 leading-relaxed">
                      {camp.description}
                    </p>

                    {/* Asnaf & Blockchain Tag */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {camp.asnafCategory && (
                        <span className="px-2 py-0.5 rounded-md bg-[#EEF3EE] dark:bg-[#242924] text-[10px] font-bold text-[#2E7D32] dark:text-[#4CAF50] border border-[#D8DFD8] dark:border-[#2D332D]">
                          Asnaf: {camp.asnafCategory}
                        </span>
                      )}
                      {camp.blockchainTrackingEnabled && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[10px] font-bold text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          ⛓ Blockchain Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress & Donate Action */}
                <div className="p-5 pt-0 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">Terkumpul:</span>
                        <span className="font-mono font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                          Rp {camp.collectedAmount.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">Target:</span>
                        <span className="text-[#5A665B] dark:text-[#A0A8A0] font-mono text-[11px] font-bold">
                          Rp {(camp.targetAmount / 1000000).toFixed(0)} Jt ({percent}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#D8DFD8] dark:bg-[#2D332D] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percent >= 90 ? 'bg-emerald-600' : 'bg-[#2E7D32]'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-donate-camp-${camp.id}`}
                      onClick={() => handleOpenDonateModal(camp)}
                      className="flex-1 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs shadow-md shadow-[#2E7D32]/20 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span>Salurkan Donasi</span>
                    </button>

                    <button
                      id={`btn-view-qr-camp-${camp.id}`}
                      onClick={() => setViewingQrCampaign(camp)}
                      title="Lihat & Unduh Kode QR Resmi"
                      className="p-2.5 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] text-[#2E7D32] dark:text-[#4CAF50] border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm transition-all shrink-0 hover:scale-[1.03]"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instant Donation Dialog Modal with Automated Recurring Toggle */}
      {activeCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4] my-auto space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D8DFD8] dark:border-[#2D332D]">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <h3 className="font-bold text-base text-[#141A14] dark:text-[#E4E8E4]">
                  Penyaluran Donasi & Infaq Resmi
                </h3>
              </div>
              <button
                id="btn-close-donate-modal"
                onClick={() => setActiveCampaign(null)}
                className="p-1 rounded-full hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0]"
              >
                ✕
              </button>
            </div>

            {/* Scanned QR Verification Seal */}
            {scannedVerification && scannedVerification.campaign?.id === activeCampaign.id && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-950 dark:text-emerald-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50] shrink-0" />
                  <div>
                    <span className="font-extrabold block">Terverifikasi via Pemindaian QR Resmi</span>
                    <span className="text-[10px] opacity-80">{scannedVerification.licenseNumber || 'SK Kemenag Terdaftar'} • Audit Syariah Valid</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#2E7D32] text-white text-[10px] font-bold">100% Sah</span>
              </div>
            )}

            {/* Campaign Summary Card */}
            <div className="p-3 bg-[#EEF3EE] dark:bg-[#242924] rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] flex items-center gap-3">
              <img
                src={activeCampaign.coverImage}
                alt={activeCampaign.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-[#2E7D32] dark:text-[#4CAF50] block">
                  {activeCampaign.charityName}
                </span>
                <h4 className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] truncate">
                  {activeCampaign.title}
                </h4>
                <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                  Akad: Infaq / Sedekah Terikat / Wakaf
                </span>
              </div>
            </div>

            {/* AUTOMATED RECURRING DONATION TOGGLE */}
            <div 
              id="automated-recurring-toggle-box"
              className={`p-3.5 rounded-2xl border transition-all space-y-3 ${
                isRecurringEnabled
                  ? 'bg-gradient-to-br from-[#EEF8EE] via-white to-[#F2FAF2] dark:from-[#1F2E20] dark:via-[#1A241B] dark:to-[#172218] border-[#2E7D32] shadow-sm'
                  : 'bg-[#EEF3EE]/50 dark:bg-[#242924]/50 border-[#D8DFD8] dark:border-[#2D332D]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                    isRecurringEnabled
                      ? 'bg-[#2E7D32] text-white shadow-sm'
                      : 'bg-[#D8DFD8] dark:bg-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0]'
                  }`}>
                    <Repeat className="w-4 h-4" />
                  </div>
                  <div>
                    <label 
                      htmlFor="toggle-recurring-donation"
                      className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4] cursor-pointer block"
                    >
                      Automated Recurring Donation
                    </label>
                    <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">
                      Jadikan sedekah rutin harian, mingguan, atau bulanan
                    </span>
                  </div>
                </div>

                {/* Custom Styled Switch Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="toggle-recurring-donation"
                    type="checkbox"
                    checked={isRecurringEnabled}
                    onChange={(e) => setIsRecurringEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#D8DFD8] dark:bg-[#2D332D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#D8DFD8] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2E7D32]"></div>
                </label>
              </div>

              {/* Recurring Details Expanded */}
              {isRecurringEnabled && (
                <div className="pt-2 border-t border-[#2E7D32]/20 dark:border-[#2E7D32]/30 space-y-2.5 animate-in fade-in">
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold text-[#141A14] dark:text-[#E4E8E4] block">
                      Pilih Frekuensi Donasi Rutin:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'DAILY', label: 'Harian (Daily)', sub: 'Sedekah Subuh', icon: Clock },
                        { id: 'WEEKLY', label: 'Mingguan (Weekly)', sub: 'Jumat Berkah', icon: Calendar },
                        { id: 'MONTHLY', label: 'Bulanan (Monthly)', sub: 'Autodebit Gaji', icon: Repeat },
                      ].map(freq => {
                        const Icon = freq.icon;
                        const isSel = recurringFrequency === freq.id;
                        return (
                          <button
                            key={freq.id}
                            id={`btn-modal-freq-${freq.id.toLowerCase()}`}
                            type="button"
                            onClick={() => handleRecurringFrequencyChange(freq.id as RecurringFrequency)}
                            className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-0.5 transition-all ${
                              isSel
                                ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                                : 'bg-white dark:bg-[#1A1D1A] border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4]'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${isSel ? 'text-white' : 'text-[#2E7D32] dark:text-[#4CAF50]'}`} />
                            <span className="text-[11px] font-bold">{freq.label}</span>
                            <span className={`text-[9px] ${isSel ? 'text-white/90' : 'text-[#5A665B] dark:text-[#A0A8A0]'}`}>
                              {freq.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#5A665B] dark:text-[#A0A8A0] block">
                      Waktu & Jam Penarikan:
                    </span>
                    <input
                      type="text"
                      id="input-modal-recurring-timing"
                      value={recurringTimingNote}
                      onChange={(e) => setRecurringTimingNote(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-[#1A1D1A] border border-[#2E7D32]/30 rounded-xl text-xs font-medium text-[#141A14] dark:text-[#E4E8E4] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Preset Amount Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] block">
                Pilih Nominal {isRecurringEnabled ? `per ${recurringFrequency === 'DAILY' ? 'Hari' : recurringFrequency === 'WEEKLY' ? 'Minggu' : 'Bulan'}` : 'Donasi'}:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map(amt => (
                  <button
                    key={amt}
                    id={`btn-preset-amt-${amt}`}
                    onClick={() => {
                      setDonationAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-3 rounded-xl font-mono text-xs font-bold border transition-all ${
                      donationAmount === amt && !customAmount
                        ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                        : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4]'
                    }`}
                  >
                    Rp {amt.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0] text-xs">Nominal Lain: Rp</span>
                <input
                  type="number"
                  id="input-modal-custom-amount"
                  placeholder="Contoh: 1500000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-32 pr-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-mono font-bold text-[#141A14] dark:text-[#E4E8E4] focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Channels */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-[#141A14] dark:text-[#E4E8E4] block">
                Metode Pembayaran {isRecurringEnabled ? '(Autodebit Mandate)' : ''}:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'QRIS', label: isRecurringEnabled ? 'QRIS Recurring Mandate' : 'QRIS Real-Time (Semua Bank)', icon: QrCode },
                  { id: 'VA_BSI', label: isRecurringEnabled ? 'BSI Autodebit Syariah' : 'BSI Virtual Account', icon: CreditCard },
                  { id: 'LYNK_PAY', label: isRecurringEnabled ? 'Lynk.id Wallet Auto-Pay' : 'Lynk.id Pay / Saldo', icon: Sparkles },
                  { id: 'CRYPTO_USDT', label: isRecurringEnabled ? 'USDT Standing Smart Contract' : 'USDT Sharia Zero-Fee', icon: ShieldCheck },
                ].map(p => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      id={`btn-modal-payment-${p.id.toLowerCase()}`}
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
              <label className="font-bold text-[#141A14] dark:text-[#E4E8E4] block">
                Doa & Harapan untuk Penerima Manfaat:
              </label>
              <input
                type="text"
                id="input-modal-prayer-note"
                value={donorPrayerNote}
                onChange={(e) => setDonorPrayerNote(e.target.value)}
                className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs text-[#141A14] dark:text-[#E4E8E4]"
              />
            </div>

            {/* Anonymous Toggle */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#141A14] dark:text-[#E4E8E4] cursor-pointer">
              <input
                type="checkbox"
                id="check-modal-anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
              />
              <span>Donasi sebagai <strong>Hamba Allah</strong> (Sembunyikan Nama Publik)</span>
            </label>

            {/* Submit Button */}
            <button
              id="btn-execute-donation-modal"
              onClick={handleExecuteDonation}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs shadow-lg shadow-[#2E7D32]/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              {isRecurringEnabled ? <Repeat className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span>
                {isProcessing
                  ? 'Memproses Transaksi...'
                  : isRecurringEnabled
                  ? `Aktifkan Sedekah ${recurringFrequency === 'DAILY' ? 'Harian' : recurringFrequency === 'WEEKLY' ? 'Mingguan' : 'Bulanan'} & Salurkan Rp ${(customAmount ? Number(customAmount) : donationAmount).toLocaleString('id-ID')}`
                  : `Kirim Donasi Rp ${(customAmount ? Number(customAmount) : donationAmount).toLocaleString('id-ID')}`
                }
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Official Charity & QRIS Camera / Upload Scanner Modal */}
      <OfficialCharityQrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        campaigns={campaigns}
        charities={OFFICIAL_CHARITIES}
        mosqueBoxes={PHYSICAL_MOSQUE_BOXES}
        onConfirmDonation={handleScanVerificationConfirm}
      />

      {/* Campaign Official QR Code & QRIS View / Download Modal */}
      <CampaignQrViewModal
        isOpen={Boolean(viewingQrCampaign)}
        campaign={viewingQrCampaign}
        charity={OFFICIAL_CHARITIES.find(ch => ch.id === viewingQrCampaign?.charityId)}
        onClose={() => setViewingQrCampaign(null)}
        onScanThisCode={() => {
          setViewingQrCampaign(null);
          setIsScannerOpen(true);
        }}
      />

      {/* Mosque Physical Box Infaq / Donation Modal */}
      <MosqueBoxDonationModal
        mosqueBox={scannedMosqueBox}
        isOpen={isMosqueDonationModalOpen}
        onClose={() => setIsMosqueDonationModalOpen(false)}
      />

      {/* Dedicated Recurring Schedule Create Modal */}
      <RecurringScheduleCreateModal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
        initialCharityId={recurringModalCharityId}
      />

    </div>
  );
};
