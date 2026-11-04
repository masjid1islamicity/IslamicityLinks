import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  HeartHandshake,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Activity,
  Layers,
  Building,
  ShieldCheck,
  ExternalLink,
  Users,
  MapPin,
  CheckCircle2,
  Filter,
  ArrowUpRight,
  Sparkles,
  Info,
  Droplets,
  BookOpen,
  Stethoscope,
  Flame,
  Store,
  Baby,
  Landmark,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Humanitarian project categories and colors
export interface HumanitarianProjectItem {
  id: string;
  projectName: string;
  sector: 'AIR_BERSIH' | 'BENCANA' | 'PENDIDIKAN' | 'KESEHATAN' | 'EKONOMI' | 'YATIM' | 'WAKAF';
  sectorLabel: string;
  partnerAmil: string;
  location: string;
  province: string;
  targetAmount: number;
  distributedAmount: number;
  beneficiariesCount: number;
  beneficiariesUnit: string;
  completionRate: number;
  smartContract: string;
  verifiedAuditDate: string;
  iconName: string;
}

const SECTOR_METADATA = {
  AIR_BERSIH: {
    label: 'Air Bersih & Sanitasi',
    color: '#0284C7', // Sky blue
    icon: Droplets,
    badgeBg: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20'
  },
  BENCANA: {
    label: 'Bencana Alam & Darurat',
    color: '#EF4444', // Red
    icon: Flame,
    badgeBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
  },
  PENDIDIKAN: {
    label: 'Pendidikan & Beasiswa',
    color: '#8B5CF6', // Purple
    icon: BookOpen,
    badgeBg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20'
  },
  KESEHATAN: {
    label: 'Kesehatan & Medis',
    color: '#10B981', // Emerald
    icon: Stethoscope,
    badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
  },
  EKONOMI: {
    label: 'Pemberdayaan UMKM',
    color: '#F59E0B', // Amber
    icon: Store,
    badgeBg: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20'
  },
  YATIM: {
    label: 'Santunan Yatim Dhuafa',
    color: '#EC4899', // Pink
    icon: Baby,
    badgeBg: 'bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20'
  },
  WAKAF: {
    label: 'Wakaf Fasilitas Umat',
    color: '#2E7D32', // Brand Green
    icon: Landmark,
    badgeBg: 'bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 border-emerald-600/20'
  }
};

// Base humanitarian project breakdown data
const HUMANITARIAN_PROJECTS_DATA: HumanitarianProjectItem[] = [
  {
    id: 'proj-hum-01',
    projectName: 'Pembangunan 50 Sumur Bor & Filter Air Bersih Pelosok NTT & Cianjur',
    sector: 'AIR_BERSIH',
    sectorLabel: 'Air Bersih & Sanitasi',
    partnerAmil: 'Dompet Dhuafa',
    location: 'Kab. Cianjur & Timor Tengah Selatan',
    province: 'Jawa Barat & NTT',
    targetAmount: 850000000,
    distributedAmount: 692000000,
    beneficiariesCount: 6400,
    beneficiariesUnit: 'Jiwa (1.600 KK)',
    completionRate: 81.4,
    smartContract: '0x88A2...AIR_BERSIH_NTT',
    verifiedAuditDate: '28 Agustus 2026',
    iconName: 'Droplets'
  },
  {
    id: 'proj-hum-02',
    projectName: 'Tanggap Bencana Gempa: Dapur Umum, Huntara & Logistik Pangan',
    sector: 'BENCANA',
    sectorLabel: 'Bencana Alam & Darurat',
    partnerAmil: 'LAZISMU PP Muhammadiyah',
    location: 'Pasaman Barat & Garut Selatan',
    province: 'Sumatera Barat & Jabar',
    targetAmount: 1100000000,
    distributedAmount: 890000000,
    beneficiariesCount: 8250,
    beneficiariesUnit: 'Penyintas Bencana',
    completionRate: 80.9,
    smartContract: '0x33F1...LOGISTIK_GEMPA',
    verifiedAuditDate: '30 Agustus 2026',
    iconName: 'Flame'
  },
  {
    id: 'proj-hum-03',
    projectName: 'Beasiswa Pendidikan Tahfidz & Sains 500 Santri Yatim Dhuafa',
    sector: 'PENDIDIKAN',
    sectorLabel: 'Pendidikan & Beasiswa',
    partnerAmil: 'Rumah Zakat',
    location: 'Pesantren Pelosok Gunungkidul & Madura',
    province: 'DIY & Jawa Timur',
    targetAmount: 1200000000,
    distributedAmount: 940000000,
    beneficiariesCount: 500,
    beneficiariesUnit: 'Santri Penerima Beasiswa',
    completionRate: 78.3,
    smartContract: '0x55C9...BEASISWA_TAHFIDZ',
    verifiedAuditDate: '25 Agustus 2026',
    iconName: 'BookOpen'
  },
  {
    id: 'proj-hum-04',
    projectName: 'Layanan Operasi Katarak Gratis & Armada Ambulans Dhuafa',
    sector: 'KESEHATAN',
    sectorLabel: 'Kesehatan & Medis',
    partnerAmil: 'LAZISNU Care',
    location: 'Klinik Berjalan Jawa Timur & Banten',
    province: 'Jawa Timur & Banten',
    targetAmount: 1150000000,
    distributedAmount: 885000000,
    beneficiariesCount: 3200,
    beneficiariesUnit: 'Pasien Dhuafa & Lansia',
    completionRate: 76.9,
    smartContract: '0x99B3...MEDIS_AMBULANS',
    verifiedAuditDate: '29 Agustus 2026',
    iconName: 'Stethoscope'
  },
  {
    id: 'proj-hum-05',
    projectName: 'Gerobak Berkah & Permodalan Syariah Bebas Riba 250 Pedagang Dhuafa',
    sector: 'EKONOMI',
    sectorLabel: 'Pemberdayaan UMKM',
    partnerAmil: 'Dompet Dhuafa',
    location: 'Pasar Tradisional Jabodetabek & Solo',
    province: 'DKI Jakarta & Jawa Tengah',
    targetAmount: 600000000,
    distributedAmount: 480000000,
    beneficiariesCount: 250,
    beneficiariesUnit: 'Keluarga UMKM Mandiri',
    completionRate: 80.0,
    smartContract: '0x12EE...MODAL_UMKM_SYARIAH',
    verifiedAuditDate: '27 Agustus 2026',
    iconName: 'Store'
  },
  {
    id: 'proj-hum-06',
    projectName: 'Program Orang Tua Asuh & Santunan Rutin 1.000 Anak Yatim Piatu',
    sector: 'YATIM',
    sectorLabel: 'Santunan Yatim Dhuafa',
    partnerAmil: 'Rumah Zakat',
    location: '18 Kota/Kabupaten Wilayah Indonesia',
    province: 'Nasional',
    targetAmount: 1500000000,
    distributedAmount: 1120000000,
    beneficiariesCount: 1000,
    beneficiariesUnit: 'Anak Yatim Piatu',
    completionRate: 74.6,
    smartContract: '0x77DD...SANTUNAN_YATIM',
    verifiedAuditDate: '31 Agustus 2026',
    iconName: 'Baby'
  },
  {
    id: 'proj-hum-07',
    projectName: 'Zakat Maal & Paket Logistik Sembako 10.000 Keluarga Fakir Miskin',
    sector: 'BENCANA',
    sectorLabel: 'Bencana Alam & Darurat',
    partnerAmil: 'BAZNAS RI',
    location: 'Wilayah 3T (Terdepan, Terluar, Tertinggal)',
    province: 'Papua, Maluku & NTT',
    targetAmount: 2500000000,
    distributedAmount: 1845000000,
    beneficiariesCount: 10000,
    beneficiariesUnit: 'Keluarga Fakir Miskin',
    completionRate: 73.8,
    smartContract: '0x44AA...ZAKAT_LOGISTIK_3T',
    verifiedAuditDate: '31 Agustus 2026',
    iconName: 'Flame'
  },
  {
    id: 'proj-hum-08',
    projectName: 'Wakaf Kebun Pertanian Organik & Sentra Hidroponik Petani Dhuafa',
    sector: 'WAKAF',
    sectorLabel: 'Wakaf Fasilitas Umat',
    partnerAmil: 'BAZNAS RI',
    location: 'Desa Berdaya Ciamis & Subang',
    province: 'Jawa Barat',
    targetAmount: 650000000,
    distributedAmount: 495000000,
    beneficiariesCount: 180,
    beneficiariesUnit: 'Petani & Keluarga Binaan',
    completionRate: 76.1,
    smartContract: '0x66CC...WAKAF_PRODUKTIF',
    verifiedAuditDate: '26 Agustus 2026',
    iconName: 'Landmark'
  }
];

// Monthly trend data
const MONTHLY_DISBURSEMENT_TREND = [
  { month: 'Mar 2026', airBersih: 95, bencana: 180, pendidikan: 120, kesehatan: 110, ekonomi: 70, yatim: 140, wakaf: 60, total: 775 },
  { month: 'Apr 2026', airBersih: 110, bencana: 220, pendidikan: 140, kesehatan: 135, ekonomi: 85, yatim: 180, wakaf: 75, total: 945 },
  { month: 'Mei 2026 (Ramadhan)', airBersih: 160, bencana: 310, pendidikan: 210, kesehatan: 190, ekonomi: 125, yatim: 290, wakaf: 110, total: 1395 },
  { month: 'Jun 2026', airBersih: 105, bencana: 190, pendidikan: 150, kesehatan: 140, ekonomi: 90, yatim: 160, wakaf: 80, total: 915 },
  { month: 'Jul 2026', airBersih: 120, bencana: 240, pendidikan: 165, kesehatan: 155, ekonomi: 95, yatim: 175, wakaf: 85, total: 1035 },
  { month: 'Agu 2026', airBersih: 140, bencana: 275, pendidikan: 185, kesehatan: 170, ekonomi: 115, yatim: 195, wakaf: 95, total: 1170 }
];

export const HumanitarianFundDistributionChart: React.FC = () => {
  const { setSelectedExplorerData, setActiveTab } = useApp();

  const [activeView, setActiveView] = useState<'DONUT' | 'BAR_TARGET' | 'TIMELINE'>('DONUT');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('ALL');
  const [selectedAmilFilter, setSelectedAmilFilter] = useState<string>('ALL');
  const [activeProjectDetail, setActiveProjectDetail] = useState<HumanitarianProjectItem | null>(null);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return HUMANITARIAN_PROJECTS_DATA.filter((p) => {
      const matchSector = selectedSectorFilter === 'ALL' || p.sector === selectedSectorFilter;
      const matchAmil = selectedAmilFilter === 'ALL' || p.partnerAmil === selectedAmilFilter;
      return matchSector && matchAmil;
    });
  }, [selectedSectorFilter, selectedAmilFilter]);

  // Sector Aggregation for Pie / Donut Chart
  const sectorBreakdownData = useMemo(() => {
    const sectorMap: Record<
      string,
      { sectorKey: string; name: string; value: number; target: number; beneficiaries: number; projectCount: number; color: string }
    > = {};

    filteredProjects.forEach((proj) => {
      const meta = SECTOR_METADATA[proj.sector];
      if (!sectorMap[proj.sector]) {
        sectorMap[proj.sector] = {
          sectorKey: proj.sector,
          name: meta.label,
          value: 0,
          target: 0,
          beneficiaries: 0,
          projectCount: 0,
          color: meta.color
        };
      }
      sectorMap[proj.sector].value += proj.distributedAmount;
      sectorMap[proj.sector].target += proj.targetAmount;
      sectorMap[proj.sector].beneficiaries += proj.beneficiariesCount;
      sectorMap[proj.sector].projectCount += 1;
    });

    return Object.values(sectorMap).sort((a, b) => b.value - a.value);
  }, [filteredProjects]);

  // Bar chart data comparing target vs distributed for each project
  const barChartData = useMemo(() => {
    return filteredProjects.map((p) => ({
      name: p.projectName.length > 28 ? p.projectName.substring(0, 28) + '...' : p.projectName,
      fullName: p.projectName,
      partner: p.partnerAmil,
      targetJuta: Math.round(p.targetAmount / 1000000),
      disalurkanJuta: Math.round(p.distributedAmount / 1000000),
      rawTarget: p.targetAmount,
      rawDistributed: p.distributedAmount,
      percent: p.completionRate,
      sector: p.sectorLabel,
      beneficiaries: `${p.beneficiariesCount.toLocaleString('id-ID')} ${p.beneficiariesUnit}`
    }));
  }, [filteredProjects]);

  // Aggregate totals
  const totalDistributed = useMemo(() => {
    return filteredProjects.reduce((acc, p) => acc + p.distributedAmount, 0);
  }, [filteredProjects]);

  const totalTarget = useMemo(() => {
    return filteredProjects.reduce((acc, p) => acc + p.targetAmount, 0);
  }, [filteredProjects]);

  const totalBeneficiaries = useMemo(() => {
    return filteredProjects.reduce((acc, p) => acc + p.beneficiariesCount, 0);
  }, [filteredProjects]);

  const overallRealizationRate = totalTarget > 0 ? ((totalDistributed / totalTarget) * 100).toFixed(1) : '0.0';

  // Distinct Amil Partners list
  const amilPartners = useMemo(() => {
    const set = new Set<string>();
    HUMANITARIAN_PROJECTS_DATA.forEach((p) => set.add(p.partnerAmil));
    return Array.from(set);
  }, []);

  // Format currency helper
  const formatRp = (num: number) => {
    if (num >= 1000000000) {
      return `Rp ${(num / 1000000000).toFixed(2)} M`;
    }
    if (num >= 1000000) {
      return `Rp ${(num / 1000000).toFixed(0)} Juta`;
    }
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  return (
    <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 sm:p-8 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-6">
      
      {/* Top Header & Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D8DFD8]/70 dark:border-[#2D332D]/70 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#2E7D32] dark:text-[#4CAF50] text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Visualisasi Audit Penyaluran Dana Kemanusiaan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#141A14] dark:text-[#E4E8E4] tracking-tight">
            Distribusi Dana Kemanusiaan & Program Bantuan
          </h2>
          <p className="text-xs sm:text-sm text-[#5A665B] dark:text-[#A0A8A0] max-w-2xl">
            Rincian matematis alokasi infak, sedekah, dan wakaf pada proyek kemanusiaan darurat, air bersih, medis, pendidikan santri, hingga pemberdayaan UMKM mustahik.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] shrink-0 self-start lg:self-auto">
          <button
            onClick={() => setActiveView('DONUT')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeView === 'DONUT'
                ? 'bg-white dark:bg-[#1A1D1A] text-[#2E7D32] dark:text-[#4CAF50] shadow-sm'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Porsi Sektor (Donut)</span>
          </button>

          <button
            onClick={() => setActiveView('BAR_TARGET')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeView === 'BAR_TARGET'
                ? 'bg-white dark:bg-[#1A1D1A] text-[#2E7D32] dark:text-[#4CAF50] shadow-sm'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Target vs Realisasi (Bar)</span>
          </button>

          <button
            onClick={() => setActiveView('TIMELINE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeView === 'TIMELINE'
                ? 'bg-white dark:bg-[#1A1D1A] text-[#2E7D32] dark:text-[#4CAF50] shadow-sm'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Tren Bulanan (Area)</span>
          </button>
        </div>
      </div>

      {/* Quick Key Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#EEF3EE]/70 dark:bg-[#242924]/70 border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <span className="text-[11px] font-bold text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
            Total Dana Disalurkan
          </span>
          <p className="text-lg sm:text-xl font-black text-[#2E7D32] dark:text-[#4CAF50] font-mono">
            {formatRp(totalDistributed)}
          </p>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
            Dari Target {formatRp(totalTarget)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#EEF3EE]/70 dark:bg-[#242924]/70 border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <span className="text-[11px] font-bold text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            Penerima Manfaat
          </span>
          <p className="text-lg sm:text-xl font-black text-[#141A14] dark:text-[#E4E8E4] font-mono">
            {totalBeneficiaries.toLocaleString('id-ID')}+ Jiwa
          </p>
          <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">
            Tersebar di {filteredProjects.length} Proyek Aktif
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#EEF3EE]/70 dark:bg-[#242924]/70 border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <span className="text-[11px] font-bold text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Rasio Realisasi
          </span>
          <p className="text-lg sm:text-xl font-black text-[#2E7D32] dark:text-[#4CAF50] font-mono">
            {overallRealizationRate}%
          </p>
          <span className="text-[10px] text-[#2E7D32] dark:text-[#4CAF50] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Penyaluran Efektif Tepat Waktu
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#EEF3EE]/70 dark:bg-[#242924]/70 border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <span className="text-[11px] font-bold text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Integritas Audit
          </span>
          <p className="text-lg sm:text-xl font-black text-purple-700 dark:text-purple-400 font-mono">
            100% On-Chain
          </p>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
            Smart Contract Verified BAZNAS
          </span>
        </div>
      </div>

      {/* Interactive Filters Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#EEF3EE]/50 dark:bg-[#242924]/50 border border-[#D8DFD8] dark:border-[#2D332D]">
        
        {/* Sector Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Sektor:
          </span>
          
          <button
            onClick={() => setSelectedSectorFilter('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              selectedSectorFilter === 'ALL'
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'bg-white dark:bg-[#1A1D1A] text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-white border border-[#D8DFD8] dark:border-[#2D332D]'
            }`}
          >
            Semua ({HUMANITARIAN_PROJECTS_DATA.length})
          </button>

          {Object.entries(SECTOR_METADATA).map(([key, meta]) => {
            const count = HUMANITARIAN_PROJECTS_DATA.filter((p) => p.sector === key).length;
            const IconComp = meta.icon;
            const isSelected = selectedSectorFilter === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedSectorFilter(isSelected ? 'ALL' : key)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-[#2E7D32] text-white shadow-sm'
                    : 'bg-white dark:bg-[#1A1D1A] text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-white border border-[#D8DFD8] dark:border-[#2D332D]'
                }`}
              >
                <IconComp className="w-3 h-3" />
                <span>{meta.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#EEF3EE] dark:bg-[#242924]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Partner Amil Filter Dropdown */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <span className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1">
            <Building className="w-3.5 h-3.5" /> Mitra LAZ:
          </span>
          <select
            value={selectedAmilFilter}
            onChange={(e) => setSelectedAmilFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          >
            <option value="ALL">Semua Lembaga Amil</option>
            {amilPartners.map((amil) => (
              <option key={amil} value={amil}>
                {amil}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Visualization Area */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#F8FAF8] dark:bg-[#151715] border border-[#D8DFD8] dark:border-[#2D332D]">
        
        {/* VIEW 1: DONUT / PIE CHART */}
        {activeView === 'DONUT' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
                  Proporsi Distribusi per Sektor Kemanusiaan
                </h3>
                <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                  Persentase alokasi dana dan total penerima manfaat yang terdampak di setiap bidang.
                </p>
              </div>
              <div className="text-xs text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1 font-mono">
                <span>Total Alokasi:</span>
                <span className="font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">{formatRp(totalDistributed)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Pie Chart Canvas */}
              <div className="lg:col-span-6 h-72 sm:h-80 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {sectorBreakdownData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="#1A1D1A"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const percent = ((data.value / totalDistributed) * 100).toFixed(1);
                          return (
                            <div className="bg-[#1A1D1A] text-white p-3 rounded-xl shadow-xl border border-white/10 text-xs space-y-1 font-sans">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                                <span className="font-bold">{data.name}</span>
                              </div>
                              <div className="font-mono text-emerald-400 font-extrabold">
                                Rp {data.value.toLocaleString('id-ID')} ({percent}%)
                              </div>
                              <div className="text-[11px] text-gray-300">
                                Target: Rp {data.target.toLocaleString('id-ID')}
                              </div>
                              <div className="text-[11px] text-gray-300">
                                Penerima Manfaat: {data.beneficiaries.toLocaleString('id-ID')} Jiwa
                              </div>
                              <div className="text-[10px] text-gray-400">
                                {data.projectCount} Proyek Aktif
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Sector Legend Cards with Progress */}
              <div className="lg:col-span-6 space-y-2.5">
                {sectorBreakdownData.map((item, idx) => {
                  const percentOfTotal = totalDistributed > 0 ? ((item.value / totalDistributed) * 100).toFixed(1) : '0';
                  const realizationPercent = item.target > 0 ? Math.round((item.value / item.target) * 100) : 0;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedSectorFilter(selectedSectorFilter === item.sectorKey ? 'ALL' : item.sectorKey)}
                      className="p-3 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] hover:border-[#2E7D32] cursor-pointer transition-all space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">
                            {formatRp(item.value)}
                          </span>
                          <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-[#EEF3EE] dark:bg-[#242924] font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                            {percentOfTotal}%
                          </span>
                        </div>
                      </div>

                      {/* Mini progress bar */}
                      <div className="w-full bg-[#EEF3EE] dark:bg-[#242924] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${Math.min(100, realizationPercent)}%`, backgroundColor: item.color }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                        <span>{item.projectCount} Proyek Aktif • {item.beneficiaries.toLocaleString('id-ID')} Penerima Manfaat</span>
                        <span className="font-semibold">{realizationPercent}% Realisasi Target</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: TARGET VS REALISASI BAR CHART */}
        {activeView === 'BAR_TARGET' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
                  Komparasi Target Anggaran vs Dana Terdistribusi (Juta Rupiah)
                </h3>
                <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                  Evaluasi daya serap donasi dan transparansi realisasi per proyek kemanusiaan aktif.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-[#5A665B]/40" />
                  <span className="text-[#5A665B] dark:text-[#A0A8A0]">Target Anggaran</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-[#2E7D32]" />
                  <span className="text-[#2E7D32] dark:text-[#4CAF50]">Dana Disalurkan</span>
                </div>
              </div>
            </div>

            <div className="h-80 sm:h-96 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D332D" opacity={0.2} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#5A665B', fontSize: 10 }}
                    angle={-15}
                    textAnchor="end"
                    interval={0}
                    height={50}
                  />
                  <YAxis
                    tick={{ fill: '#5A665B', fontSize: 10 }}
                    tickFormatter={(val) => `Rp ${val}Jt`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#1A1D1A] text-white p-3.5 rounded-xl shadow-xl border border-white/10 text-xs space-y-1.5 max-w-xs font-sans">
                            <p className="font-extrabold text-white leading-tight">{d.fullName}</p>
                            <div className="flex items-center justify-between text-[11px] text-gray-300">
                              <span>Sektor: {d.sector}</span>
                              <span className="text-emerald-400 font-bold">{d.partner}</span>
                            </div>
                            <div className="border-t border-white/10 pt-1.5 space-y-0.5">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Target Anggaran:</span>
                                <span className="font-mono font-bold">Rp {d.rawTarget.toLocaleString('id-ID')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-emerald-400 font-bold">Dana Disalurkan:</span>
                                <span className="font-mono font-extrabold text-emerald-400">Rp {d.rawDistributed.toLocaleString('id-ID')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Pencapaian:</span>
                                <span className="font-mono font-bold text-amber-400">{d.percent}%</span>
                              </div>
                              <div className="flex justify-between text-[11px] text-sky-300 pt-1">
                                <span>Penerima Manfaat:</span>
                                <span>{d.beneficiaries}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="targetJuta" name="Target (Juta)" fill="#5A665B" opacity={0.35} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="disalurkanJuta" name="Disalurkan (Juta)" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* VIEW 3: TIMELINE AREA CHART */}
        {activeView === 'TIMELINE' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
                  Tren Penyaluran Dana Kemanusiaan 6 Bulan Terakhir (Juta Rupiah)
                </h3>
                <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                  Pertumbuhan volume penyaluran dana zakat, infak dan sedekah pada program kemanusiaan bulanan.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] self-start sm:self-auto">
                Puncak: Ramadhan 1447H (Rp 1.39 Miliar)
              </span>
            </div>

            <div className="h-80 sm:h-96 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={MONTHLY_DISBURSEMENT_TREND}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorBencana" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D332D" opacity={0.2} />
                  <XAxis dataKey="month" tick={{ fill: '#5A665B', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#5A665B', fontSize: 10 }} tickFormatter={(v) => `Rp ${v}Jt`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#1A1D1A] text-white p-3.5 rounded-xl shadow-xl border border-white/10 text-xs space-y-1.5 font-sans">
                            <p className="font-extrabold text-emerald-400">{label}</p>
                            <p className="text-base font-black font-mono text-white">
                              Total Disalurkan: Rp {d.total} Juta
                            </p>
                            <div className="border-t border-white/10 pt-1.5 space-y-1 text-[11px]">
                              <div className="flex justify-between text-rose-300">
                                <span>Bencana & Darurat:</span>
                                <span className="font-mono">Rp {d.bencana} Jt</span>
                              </div>
                              <div className="flex justify-between text-pink-300">
                                <span>Santunan Yatim:</span>
                                <span className="font-mono">Rp {d.yatim} Jt</span>
                              </div>
                              <div className="flex justify-between text-purple-300">
                                <span>Pendidikan:</span>
                                <span className="font-mono">Rp {d.pendidikan} Jt</span>
                              </div>
                              <div className="flex justify-between text-emerald-300">
                                <span>Kesehatan Medis:</span>
                                <span className="font-mono">Rp {d.kesehatan} Jt</span>
                              </div>
                              <div className="flex justify-between text-sky-300">
                                <span>Air Bersih:</span>
                                <span className="font-mono">Rp {d.airBersih} Jt</span>
                              </div>
                              <div className="flex justify-between text-amber-300">
                                <span>Pemberdayaan UMKM:</span>
                                <span className="font-mono">Rp {d.ekonomi} Jt</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Total Penyaluran"
                    stroke="#2E7D32"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>

      {/* Detailed Project Distribution Table */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
              Daftar Proyek Kemanusiaan & Verifikasi Akuntabilitas ({filteredProjects.length} Proyek)
            </h3>
            <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
              Klik pada proyek untuk memeriksa bukti audit smart contract, titik lokasi koordinat, dan rincian penerima manfaat.
            </p>
          </div>
          
          <button
            onClick={() => {
              setSelectedSectorFilter('ALL');
              setSelectedAmilFilter('ALL');
            }}
            className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] hover:underline self-start sm:self-auto"
          >
            Reset Filter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((proj) => {
            const meta = SECTOR_METADATA[proj.sector];
            const IconComp = meta.icon;
            const isSelected = activeProjectDetail?.id === proj.id;

            return (
              <div
                key={proj.id}
                onClick={() => setActiveProjectDetail(isSelected ? null : proj)}
                className={`p-4 rounded-2xl bg-[#EEF3EE]/50 dark:bg-[#242924]/50 border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-md bg-white dark:bg-[#1A1D1A]'
                    : 'border-[#D8DFD8] dark:border-[#2D332D] hover:border-[#2E7D32]/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${meta.badgeBg}`}>
                        {proj.sectorLabel}
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4] line-clamp-1 mt-0.5">
                        {proj.projectName}
                      </h4>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-extrabold text-[#2E7D32] dark:text-[#4CAF50] shrink-0">
                    {proj.completionRate}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-[#D8DFD8] dark:bg-[#2D332D] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${proj.completionRate}%`, backgroundColor: meta.color }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold font-mono text-[#141A14] dark:text-[#E4E8E4]">
                      Disalurkan: {formatRp(proj.distributedAmount)}
                    </span>
                    <span className="text-[#5A665B] dark:text-[#A0A8A0] font-mono">
                      Target: {formatRp(proj.targetAmount)}
                    </span>
                  </div>
                </div>

                {/* Meta details row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[#5A665B] dark:text-[#A0A8A0] border-t border-[#D8DFD8]/60 dark:border-[#2D332D]/60">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
                    <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">{proj.partnerAmil}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{proj.location}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-[#2E7D32] dark:text-[#4CAF50]">
                    <Users className="w-3 h-3" />
                    <span>{proj.beneficiariesCount.toLocaleString('id-ID')} {proj.beneficiariesUnit}</span>
                  </div>
                </div>

                {/* Expanded Details when selected */}
                {isSelected && (
                  <div className="pt-2 mt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] space-y-2 text-xs animate-in fade-in">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1 font-mono text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#5A665B] dark:text-[#A0A8A0]">Smart Contract:</span>
                        <span className="text-[#2E7D32] dark:text-[#4CAF50] font-bold">{proj.smartContract}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#5A665B] dark:text-[#A0A8A0]">Audit Terakhir:</span>
                        <span className="text-[#141A14] dark:text-[#E4E8E4] font-semibold">{proj.verifiedAuditDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#5A665B] dark:text-[#A0A8A0]">Provinsi Cakupan:</span>
                        <span className="text-[#141A14] dark:text-[#E4E8E4] font-semibold">{proj.province}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] text-[#2E7D32] dark:text-[#4CAF50] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Fiqih Audit Disetujui DPS
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExplorerData({
                            type: 'DISTRIBUTION',
                            id: proj.id,
                            title: proj.projectName,
                            smartContract: proj.smartContract,
                            amount: proj.distributedAmount,
                            charityName: proj.partnerAmil,
                            asnaf: proj.sectorLabel
                          });
                        }}
                        className="px-3 py-1 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Verifikasi Ledger</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
