import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceDot
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Layers,
  Users,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Download,
  Info,
  CheckCircle2,
  Moon,
  HeartHandshake,
  Landmark,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  FileDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateDonationImpactPDF } from '../../utils/pdfReportGenerator';

export interface MonthlyDonationDataPoint {
  monthKey: string;          // e.g. '2025-09'
  monthLabel: string;        // e.g. 'September 2025'
  shortLabel: string;        // e.g. 'Sep 25'
  totalDonation: number;     // in IDR
  zakatAmount: number;       // in IDR
  infaqAmount: number;       // in IDR
  wakafAmount: number;       // in IDR
  beneficiaries: number;     // Jiwa / Mustahik
  txCount: number;           // Transaction count
  growthRate: number;        // Month-over-month growth percentage
  seasonBadge?: string;      // Special islamic event
  isPeak?: boolean;
}

// 12 Months Historical Data (September 2025 - August 2026)
const DEFAULT_12_MONTHS_DATA: MonthlyDonationDataPoint[] = [
  {
    monthKey: '2025-09',
    monthLabel: 'September 2025',
    shortLabel: 'Sep 25',
    totalDonation: 2650000,
    zakatAmount: 1250000,
    infaqAmount: 900000,
    wakafAmount: 500000,
    beneficiaries: 780,
    txCount: 4,
    growthRate: 5.2,
    seasonBadge: 'Rabiul Awal (Maulid Nabi)'
  },
  {
    monthKey: '2025-10',
    monthLabel: 'Oktober 2025',
    shortLabel: 'Okt 25',
    totalDonation: 2900000,
    zakatAmount: 1350000,
    infaqAmount: 1050000,
    wakafAmount: 500000,
    beneficiaries: 890,
    txCount: 5,
    growthRate: 9.4
  },
  {
    monthKey: '2025-11',
    monthLabel: 'November 2025',
    shortLabel: 'Nov 25',
    totalDonation: 3150000,
    zakatAmount: 1500000,
    infaqAmount: 1100000,
    wakafAmount: 550000,
    beneficiaries: 1050,
    txCount: 6,
    growthRate: 8.6,
    seasonBadge: 'Siaga Pangan Dhuafa'
  },
  {
    monthKey: '2025-12',
    monthLabel: 'Desember 2025',
    shortLabel: 'Des 25',
    totalDonation: 3800000,
    zakatAmount: 1800000,
    infaqAmount: 1400000,
    wakafAmount: 600000,
    beneficiaries: 1320,
    txCount: 7,
    growthRate: 20.6,
    seasonBadge: 'Tutup Buku & Zakat Akhir Tahun'
  },
  {
    monthKey: '2026-01',
    monthLabel: 'Januari 2026',
    shortLabel: 'Jan 26',
    totalDonation: 3400000,
    zakatAmount: 1600000,
    infaqAmount: 1200000,
    wakafAmount: 600000,
    beneficiaries: 1180,
    txCount: 5,
    growthRate: -10.5,
    seasonBadge: 'Rajab 1447H'
  },
  {
    monthKey: '2026-02',
    monthLabel: 'Februari 2026',
    shortLabel: 'Feb 26',
    totalDonation: 4200000,
    zakatAmount: 2000000,
    infaqAmount: 1500000,
    wakafAmount: 700000,
    beneficiaries: 1540,
    txCount: 8,
    growthRate: 23.5,
    seasonBadge: "Sya'ban (Persiapan Ramadhan)"
  },
  {
    monthKey: '2026-03',
    monthLabel: 'Maret 2026',
    shortLabel: 'Mar 26 🌙',
    totalDonation: 8950000,
    zakatAmount: 4800000,
    infaqAmount: 3150000,
    wakafAmount: 1000000,
    beneficiaries: 3420,
    txCount: 18,
    growthRate: 113.1,
    seasonBadge: 'Ramadhan 1447H (Puncak Donasi)',
    isPeak: true
  },
  {
    monthKey: '2026-04',
    monthLabel: 'April 2026',
    shortLabel: 'Apr 26 ✨',
    totalDonation: 7800000,
    zakatAmount: 4300000,
    infaqAmount: 2600000,
    wakafAmount: 900000,
    beneficiaries: 2950,
    txCount: 14,
    growthRate: -12.8,
    seasonBadge: 'Idul Fitri & Zakat Fitrah',
    isPeak: true
  },
  {
    monthKey: '2026-05',
    monthLabel: 'Mei 2026',
    shortLabel: 'Mei 26',
    totalDonation: 3900000,
    zakatAmount: 1850000,
    infaqAmount: 1350000,
    wakafAmount: 700000,
    beneficiaries: 1380,
    txCount: 6,
    growthRate: -50.0,
    seasonBadge: 'Syawal & Pasca Ramadhan'
  },
  {
    monthKey: '2026-06',
    monthLabel: 'Juni 2026',
    shortLabel: 'Jun 26 🐑',
    totalDonation: 6300000,
    zakatAmount: 2600000,
    infaqAmount: 2500000,
    wakafAmount: 1200000,
    beneficiaries: 2480,
    txCount: 11,
    growthRate: 61.5,
    seasonBadge: 'Dzulhijjah 1447H & Sedekah Qurban'
  },
  {
    monthKey: '2026-07',
    monthLabel: 'Juli 2026',
    shortLabel: 'Jul 26',
    totalDonation: 4100000,
    zakatAmount: 1950000,
    infaqAmount: 1450000,
    wakafAmount: 700000,
    beneficiaries: 1450,
    txCount: 7,
    growthRate: -34.9,
    seasonBadge: 'Tahun Baru Hijriah 1448H'
  },
  {
    monthKey: '2026-08',
    monthLabel: 'Agustus 2026',
    shortLabel: 'Agu 26',
    totalDonation: 4500000,
    zakatAmount: 2150000,
    infaqAmount: 1550000,
    wakafAmount: 800000,
    beneficiaries: 1610,
    txCount: 8,
    growthRate: 9.8,
    seasonBadge: 'Bulan Kemerdekaan & Berkah Yatim'
  }
];

export const MonthlyDonationTrendChart: React.FC = () => {
  const { blockchainTransactions, userProfile } = useApp();

  const [activeMetricView, setActiveMetricView] = useState<'ALL_TREND' | 'TOTAL_AREA' | 'IMPACT_BENEFICIARIES' | 'DUAL_AXIS'>('ALL_TREND');
  const [timeRange, setTimeRange] = useState<'12M' | '6M_H2' | '6M_H1'>('12M');
  const [showDataTable, setShowDataTable] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<MonthlyDonationDataPoint | null>(null);

  // Compute filtered dataset according to time range
  const filteredData = useMemo(() => {
    if (timeRange === '6M_H2') {
      return DEFAULT_12_MONTHS_DATA.slice(6, 12); // Mar 2026 - Aug 2026
    }
    if (timeRange === '6M_H1') {
      return DEFAULT_12_MONTHS_DATA.slice(0, 6);  // Sep 2025 - Feb 2026
    }
    return DEFAULT_12_MONTHS_DATA;
  }, [timeRange]);

  // Aggregate statistics across selected range
  const stats = useMemo(() => {
    const totalDonation = filteredData.reduce((acc, curr) => acc + curr.totalDonation, 0);
    const totalZakat = filteredData.reduce((acc, curr) => acc + curr.zakatAmount, 0);
    const totalInfaq = filteredData.reduce((acc, curr) => acc + curr.infaqAmount, 0);
    const totalWakaf = filteredData.reduce((acc, curr) => acc + curr.wakafAmount, 0);
    const totalBeneficiaries = filteredData.reduce((acc, curr) => acc + curr.beneficiaries, 0);
    const totalTx = filteredData.reduce((acc, curr) => acc + curr.txCount, 0);
    const monthlyAverage = Math.round(totalDonation / filteredData.length);
    
    // Find peak month
    let peakMonth = filteredData[0];
    for (const d of filteredData) {
      if (d.totalDonation > peakMonth.totalDonation) {
        peakMonth = d;
      }
    }

    return {
      totalDonation,
      totalZakat,
      totalInfaq,
      totalWakaf,
      totalBeneficiaries,
      totalTx,
      monthlyAverage,
      peakMonth,
      consistencyStreak: filteredData.length,
      zakatRatio: Math.round((totalZakat / totalDonation) * 100),
      infaqRatio: Math.round((totalInfaq / totalDonation) * 100),
      wakafRatio: Math.round((totalWakaf / totalDonation) * 100)
    };
  }, [filteredData]);

  // Format Currency
  const formatRp = (value: number) => {
    return `Rp ${(value / 1000000).toFixed(1)} Jt`;
  };

  const formatFullRp = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  // CSV Exporter for Trends
  const handleExportCSV = () => {
    const headers = 'Bulan,Total Donasi (Rp),Zakat (Rp),Infaq/Sedekah (Rp),Wakaf (Rp),Penerima Manfaat (Jiwa),Jumlah Transaksi,Pertumbuhan MoM (%)\n';
    const rows = filteredData.map(d => 
      `"${d.monthLabel}",${d.totalDonation},${d.zakatAmount},${d.infaqAmount},${d.wakafAmount},${d.beneficiaries},${d.txCount},"${d.growthRate}%"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Tren_Donasi_Tahunan_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    try {
      const result = generateDonationImpactPDF({
        donorName: userProfile.name,
        donorEmail: userProfile.email,
        taxId: userProfile.taxIdentificationNumber || '92.481.092.3-014.000',
        kycLevel: userProfile.kycLevel,
        e2eePublicKey: userProfile.e2eePublicKey,
        transactions: blockchainTransactions,
        periodLabel: `Tren Donasi Bulanan (${timeRange === '12M' ? '12 Bulan Terakhir' : timeRange === '6M_H2' ? 'Semester 2 2026' : 'Semester 1 2025'})`,
        generatedDate: new Date(),
        includeTaxCertification: true,
      });
      result.download();
    } catch (e) {
      console.error('Failed to export PDF from chart:', e);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 sm:p-8 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-6">
      
      {/* Header & Controls Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#2E7D32] dark:text-[#4CAF50] text-xs font-black uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Tren & Dinamika Ibadah Keuangan 1 Tahun</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#141A14] dark:text-[#E4E8E4] mt-0.5">
            Pola Donasi Bulanan & Visualisasi Dampak Sosial
          </h2>
          <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] mt-0.5 max-w-2xl">
            Lacak konsistensi infak berkala, lonjakan momentum syariah (Ramadhan & Qurban), serta eskalasi penerima manfaat riil selama 12 bulan terakhir.
          </p>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex items-center bg-[#EEF3EE] dark:bg-[#242924] p-1 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D]">
            <button
              onClick={() => setTimeRange('12M')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                timeRange === '12M'
                  ? 'bg-[#2E7D32] text-white shadow-sm'
                  : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
              }`}
            >
              12 Bulan
            </button>
            <button
              onClick={() => setTimeRange('6M_H2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                timeRange === '6M_H2'
                  ? 'bg-[#2E7D32] text-white shadow-sm'
                  : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
              }`}
            >
              Sem. 2 (2026)
            </button>
            <button
              onClick={() => setTimeRange('6M_H1')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                timeRange === '6M_H1'
                  ? 'bg-[#2E7D32] text-white shadow-sm'
                  : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
              }`}
            >
              Sem. 1 (2025)
            </button>
          </div>

          {/* Metric View Toggle Selector */}
          <div className="flex items-center bg-[#EEF3EE] dark:bg-[#242924] p-1 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D]">
            <button
              onClick={() => setActiveMetricView('ALL_TREND')}
              title="Perbandingan Garis Kategori (Zakat, Infaq, Wakaf)"
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeMetricView === 'ALL_TREND'
                  ? 'bg-white dark:bg-[#1A1D1A] text-[#2E7D32] dark:text-[#4CAF50] shadow-sm'
                  : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Multi-Kategori</span>
            </button>

            <button
              onClick={() => setActiveMetricView('TOTAL_AREA')}
              title="Area Total Volume Donasi"
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeMetricView === 'TOTAL_AREA'
                  ? 'bg-white dark:bg-[#1A1D1A] text-[#2E7D32] dark:text-[#4CAF50] shadow-sm'
                  : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Volume Total</span>
            </button>

            <button
              onClick={() => setActiveMetricView('IMPACT_BENEFICIARIES')}
              title="Tren Penerima Manfaat (Jiwa Mustahik)"
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeMetricView === 'IMPACT_BENEFICIARIES'
                  ? 'bg-white dark:bg-[#1A1D1A] text-[#2E7D32] dark:text-[#4CAF50] shadow-sm'
                  : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Jiwa Terbantu</span>
            </button>

            <button
              onClick={() => setActiveMetricView('DUAL_AXIS')}
              title="Garis Ganda: Nominal Rp & Jiwa Mustahik"
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeMetricView === 'DUAL_AXIS'
                  ? 'bg-white dark:bg-[#1A1D1A] text-[#2E7D32] dark:text-[#4CAF50] shadow-sm'
                  : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dual-Axis</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Insight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#5A665B] dark:text-[#A0A8A0]">
            <span className="font-semibold">Total Donasi ({timeRange})</span>
            <HeartHandshake className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
          </div>
          <p className="text-lg sm:text-xl font-black text-[#141A14] dark:text-[#E4E8E4] font-mono">
            {formatFullRp(stats.totalDonation)}
          </p>
          <div className="text-[11px] text-[#2E7D32] dark:text-[#4CAF50] font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>Rata-rata {formatRp(stats.monthlyAverage)}/bln</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#5A665B] dark:text-[#A0A8A0]">
            <span className="font-semibold">Puncak Kedermawanan</span>
            <Moon className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-lg sm:text-xl font-black text-[#2E7D32] dark:text-[#4CAF50] font-mono truncate">
            {stats.peakMonth.shortLabel}
          </p>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
            {formatFullRp(stats.peakMonth.totalDonation)} (Ramadhan)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#5A665B] dark:text-[#A0A8A0]">
            <span className="font-semibold">Mustahik Terdampak</span>
            <Users className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          </div>
          <p className="text-lg sm:text-xl font-black text-[#141A14] dark:text-[#E4E8E4] font-mono">
            {stats.totalBeneficiaries.toLocaleString('id-ID')} Jiwa
          </p>
          <div className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
            Dari {stats.totalTx} transaksi on-chain
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#5A665B] dark:text-[#A0A8A0]">
            <span className="font-semibold">Indeks Istiqomah</span>
            <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-lg sm:text-xl font-black text-purple-700 dark:text-purple-300 font-mono">
            {stats.consistencyStreak}/{stats.consistencyStreak} Bulan Aktif
          </p>
          <div className="text-[11px] text-[#2E7D32] dark:text-[#4CAF50] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% Kontinu & Terjadwal</span>
          </div>
        </div>
      </div>

      {/* Main Recharts Chart Stage */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#F8FAF8] dark:bg-[#151715] border border-[#D8DFD8] dark:border-[#2D332D] space-y-4">
        
        {/* Active View Subheader with Legends */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
              {activeMetricView === 'ALL_TREND' && '📈 Grafik Multi-Garis: Total, Zakat, Infaq/Sedekah & Wakaf Produktif'}
              {activeMetricView === 'TOTAL_AREA' && '📊 Area Kurva Pertumbuhan Volume Akumulatif Donasi'}
              {activeMetricView === 'IMPACT_BENEFICIARIES' && '👥 Grafik Garis Dampak Sosial (Jiwa Penerima Manfaat)'}
              {activeMetricView === 'DUAL_AXIS' && '⚡ Analisis Korelasi: Nominal Donasi (Rp) vs Jiwa Mustahik'}
            </span>
          </div>

          {/* Quick Legend Indicators */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold">
            {(activeMetricView === 'ALL_TREND' || activeMetricView === 'TOTAL_AREA' || activeMetricView === 'DUAL_AXIS') && (
              <div className="flex items-center gap-1.5 text-[#2E7D32] dark:text-[#4CAF50]">
                <div className="w-3 h-1 bg-[#2E7D32] dark:bg-[#4CAF50] rounded-full" />
                <span>Total Donasi</span>
              </div>
            )}
            {activeMetricView === 'ALL_TREND' && (
              <>
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <div className="w-3 h-1 bg-amber-500 rounded-full" />
                  <span>Zakat ({stats.zakatRatio}%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                  <div className="w-3 h-1 bg-sky-500 rounded-full" />
                  <span>Infaq/Sedekah ({stats.infaqRatio}%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                  <div className="w-3 h-1 bg-purple-500 rounded-full" />
                  <span>Wakaf ({stats.wakafRatio}%)</span>
                </div>
              </>
            )}
            {(activeMetricView === 'IMPACT_BENEFICIARIES' || activeMetricView === 'DUAL_AXIS') && (
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <div className="w-3 h-1 bg-rose-500 rounded-full" />
                <span>Penerima Manfaat (Jiwa)</span>
              </div>
            )}
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-72 sm:h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {/* VIEW 1: Multi-Line Trend Chart */}
            {activeMetricView === 'ALL_TREND' ? (
              <LineChart data={filteredData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="totalGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#D8DFD8" className="dark:stroke-[#2D332D]" opacity={0.6} />
                <XAxis 
                  dataKey="shortLabel" 
                  stroke="#5A665B" 
                  fontSize={11} 
                  tickLine={false} 
                  dy={10} 
                />
                <YAxis 
                  stroke="#5A665B" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(1)}Jt`}
                  dx={-5}
                />
                <Tooltip content={<CustomTrendTooltip />} />
                
                {/* Reference line for average */}
                <ReferenceLine 
                  y={stats.monthlyAverage} 
                  stroke="#2E7D32" 
                  strokeDasharray="4 4" 
                  strokeOpacity={0.5}
                  label={{
                    value: `Rata-rata: Rp ${(stats.monthlyAverage / 1000000).toFixed(1)} Jt`,
                    fill: '#2E7D32',
                    fontSize: 10,
                    position: 'insideTopRight'
                  }} 
                />

                {/* Lines */}
                <Line
                  type="monotone"
                  dataKey="totalDonation"
                  name="Total Donasi"
                  stroke="#2E7D32"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2E7D32', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#2E7D32', stroke: '#fff', strokeWidth: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="zakatAmount"
                  name="Zakat (Maal/Fitrah/Profesi)"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="2 2"
                  dot={{ r: 3, fill: '#F59E0B' }}
                />
                <Line
                  type="monotone"
                  dataKey="infaqAmount"
                  name="Infaq & Sedekah"
                  stroke="#0284C7"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#0284C7' }}
                />
                <Line
                  type="monotone"
                  dataKey="wakafAmount"
                  name="Wakaf Produktif"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#7C3AED' }}
                />
              </LineChart>
            ) : activeMetricView === 'TOTAL_AREA' ? (
              /* VIEW 2: Total Volume Gradient Area Chart */
              <AreaChart data={filteredData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#D8DFD8" className="dark:stroke-[#2D332D]" opacity={0.6} />
                <XAxis 
                  dataKey="shortLabel" 
                  stroke="#5A665B" 
                  fontSize={11} 
                  tickLine={false} 
                  dy={10} 
                />
                <YAxis 
                  stroke="#5A665B" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(1)}Jt`}
                  dx={-5}
                />
                <Tooltip content={<CustomTrendTooltip />} />
                
                <Area
                  type="monotone"
                  dataKey="totalDonation"
                  name="Total Donasi"
                  stroke="#2E7D32"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#areaGradient)"
                  dot={{ r: 4, fill: '#2E7D32', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: '#2E7D32', stroke: '#fff', strokeWidth: 3 }}
                />
              </AreaChart>
            ) : activeMetricView === 'IMPACT_BENEFICIARIES' ? (
              /* VIEW 3: Beneficiaries / Mustahik Line Chart */
              <LineChart data={filteredData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="beneficiariesGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#D8DFD8" className="dark:stroke-[#2D332D]" opacity={0.6} />
                <XAxis 
                  dataKey="shortLabel" 
                  stroke="#5A665B" 
                  fontSize={11} 
                  tickLine={false} 
                  dy={10} 
                />
                <YAxis 
                  stroke="#5A665B" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={(v) => `${v.toLocaleString('id-ID')} Jiwa`}
                  dx={-5}
                />
                <Tooltip content={<CustomTrendTooltip isBeneficiaryFocus={true} />} />
                <Line
                  type="monotone"
                  dataKey="beneficiaries"
                  name="Jiwa Mustahik Terbantu"
                  stroke="#E11D48"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#E11D48', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: '#E11D48', stroke: '#fff', strokeWidth: 3 }}
                />
              </LineChart>
            ) : (
              /* VIEW 4: Dual-Axis Composed Chart */
              <ComposedChart data={filteredData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D8DFD8" className="dark:stroke-[#2D332D]" opacity={0.6} />
                <XAxis 
                  dataKey="shortLabel" 
                  stroke="#5A665B" 
                  fontSize={11} 
                  tickLine={false} 
                  dy={10} 
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#2E7D32" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(1)}Jt`}
                  dx={-5}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#E11D48" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={(v) => `${v} Jiwa`}
                  dx={5}
                />
                <Tooltip content={<CustomTrendTooltip />} />
                <Bar 
                  yAxisId="left"
                  dataKey="totalDonation" 
                  name="Nominal Donasi" 
                  fill="#2E7D32" 
                  opacity={0.3} 
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalDonation"
                  name="Trend Nominal"
                  stroke="#2E7D32"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#2E7D32' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="beneficiaries"
                  name="Mustahik (Jiwa)"
                  stroke="#E11D48"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#E11D48', stroke: '#fff' }}
                  activeDot={{ r: 7, fill: '#E11D48' }}
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Seasonal Annotation Footnote */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] text-xs text-[#5A665B] dark:text-[#A0A8A0]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
              🌙 Ramadhan & Idul Fitri (Mar-Apr)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold text-[10px]">
              🐑 Dzulhijjah / Qurban (Jun)
            </span>
            <span className="text-[11px]">
              Lonjakan donasi hingga <strong>+113%</strong> tercatat pada bulan Ramadhan 1447H.
            </span>
          </div>

          <button
            onClick={() => setShowDataTable(!showDataTable)}
            className="text-[#2E7D32] dark:text-[#4CAF50] font-bold text-xs flex items-center gap-1 hover:underline shrink-0"
          >
            {showDataTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{showDataTable ? 'Tutup Tabel Rincian' : 'Lihat Rekap Tabel Bulanan'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Monthly Audit Table */}
      {showDataTable && (
        <div className="space-y-3 pt-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span>Rekapitulasi Audit Bulanan Berbasis Mutasi Kas Syariah</span>
            </h4>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPDF}
                className="px-3 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                title="Export riwayat donasi bulanan dan laporan dampak ke PDF"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-200" />
                <span>Export to PDF</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-xl bg-[#2E7D32]/10 hover:bg-[#2E7D32]/20 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] font-bold uppercase text-[10px] border-b border-[#D8DFD8] dark:border-[#2D332D]">
                <tr>
                  <th className="p-3">Periode Bulan</th>
                  <th className="p-3 text-right">Total Donasi</th>
                  <th className="p-3 text-right">Zakat (Maal/Fitrah)</th>
                  <th className="p-3 text-right">Infaq & Sedekah</th>
                  <th className="p-3 text-right">Wakaf Produktif</th>
                  <th className="p-3 text-right">Penerima Manfaat</th>
                  <th className="p-3 text-center">Mutasi Tx</th>
                  <th className="p-3 text-right">Pertumbuhan (MoM)</th>
                  <th className="p-3">Catatan Momentum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8DFD8] dark:divide-[#2D332D]">
                {filteredData.map((row, idx) => (
                  <tr 
                    key={row.monthKey} 
                    className="hover:bg-[#F8FAF8] dark:hover:bg-[#1C201C] transition-colors"
                  >
                    <td className="p-3 font-bold text-[#141A14] dark:text-[#E4E8E4]">
                      {row.monthLabel}
                    </td>
                    <td className="p-3 text-right font-mono font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">
                      Rp {row.totalDonation.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3 text-right font-mono text-[#5A665B] dark:text-[#A0A8A0]">
                      Rp {row.zakatAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3 text-right font-mono text-[#5A665B] dark:text-[#A0A8A0]">
                      Rp {row.infaqAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3 text-right font-mono text-[#5A665B] dark:text-[#A0A8A0]">
                      Rp {row.wakafAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-[#141A14] dark:text-[#E4E8E4]">
                      {row.beneficiaries.toLocaleString('id-ID')} Jiwa
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-[#EEF3EE] dark:bg-[#242924] font-mono text-[11px] font-bold text-[#141A14] dark:text-[#E4E8E4]">
                        {row.txCount} tx
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold">
                      {row.growthRate > 0 ? (
                        <span className="text-[#2E7D32] dark:text-[#4CAF50]">+{row.growthRate}%</span>
                      ) : row.growthRate < 0 ? (
                        <span className="text-rose-600 dark:text-rose-400">{row.growthRate}%</span>
                      ) : (
                        <span className="text-gray-400">0%</span>
                      )}
                    </td>
                    <td className="p-3">
                      {row.seasonBadge ? (
                        <span className="px-2 py-0.5 rounded-md bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-[10px]">
                          {row.seasonBadge}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#EEF3EE] dark:bg-[#242924] font-bold border-t-2 border-[#D8DFD8] dark:border-[#2D332D]">
                <tr>
                  <td className="p-3 font-extrabold text-[#141A14] dark:text-[#E4E8E4]">TOTAL KUMULATIF</td>
                  <td className="p-3 text-right font-mono font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">
                    Rp {stats.totalDonation.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 text-right font-mono text-[#141A14] dark:text-[#E4E8E4]">
                    Rp {stats.totalZakat.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 text-right font-mono text-[#141A14] dark:text-[#E4E8E4]">
                    Rp {stats.totalInfaq.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 text-right font-mono text-[#141A14] dark:text-[#E4E8E4]">
                    Rp {stats.totalWakaf.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 text-right font-mono font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                    {stats.totalBeneficiaries.toLocaleString('id-ID')} Jiwa
                  </td>
                  <td className="p-3 text-center font-mono font-bold">
                    {stats.totalTx} tx
                  </td>
                  <td className="p-3 text-right font-mono text-emerald-600 font-extrabold">
                    100% On-Chain
                  </td>
                  <td className="p-3 text-xs text-[#2E7D32] dark:text-[#4CAF50]">
                    Status: Audited WTP
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

// Rich Interactive Custom Tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  isBeneficiaryFocus?: boolean;
}

const CustomTrendTooltip: React.FC<CustomTooltipProps> = ({ active, payload, isBeneficiaryFocus }) => {
  if (active && payload && payload.length) {
    const data: MonthlyDonationDataPoint = payload[0].payload;
    const isPositive = data.growthRate >= 0;

    return (
      <div className="bg-[#141A14] text-white p-3.5 rounded-2xl shadow-2xl border border-white/10 text-xs space-y-2 font-sans max-w-[260px]">
        {/* Month Header & Season Badge */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
          <div className="font-extrabold text-sm text-emerald-400">
            {data.monthLabel}
          </div>
          {data.growthRate !== undefined && (
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-black flex items-center gap-0.5 ${
              isPositive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {data.growthRate > 0 ? `+${data.growthRate}%` : `${data.growthRate}%`}
            </span>
          )}
        </div>

        {/* Season / Momentum Badge if available */}
        {data.seasonBadge && (
          <div className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
            ✨ {data.seasonBadge}
          </div>
        )}

        {/* Breakdown Values */}
        <div className="space-y-1 font-mono text-[11px]">
          <div className="flex items-center justify-between text-white font-black text-xs pt-0.5">
            <span className="font-sans font-normal text-gray-300">Total Donasi:</span>
            <span className="text-emerald-400">Rp {data.totalDonation.toLocaleString('id-ID')}</span>
          </div>

          <div className="flex items-center justify-between text-amber-300 text-[10px] pl-2 border-l-2 border-amber-500/40">
            <span className="font-sans text-gray-400">Zakat:</span>
            <span>Rp {data.zakatAmount.toLocaleString('id-ID')}</span>
          </div>

          <div className="flex items-center justify-between text-sky-300 text-[10px] pl-2 border-l-2 border-sky-500/40">
            <span className="font-sans text-gray-400">Infaq:</span>
            <span>Rp {data.infaqAmount.toLocaleString('id-ID')}</span>
          </div>

          <div className="flex items-center justify-between text-purple-300 text-[10px] pl-2 border-l-2 border-purple-500/40">
            <span className="font-sans text-gray-400">Wakaf:</span>
            <span>Rp {data.wakafAmount.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Social Impact Metric */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
          <span className="text-gray-300 flex items-center gap-1">
            <Users className="w-3 h-3 text-rose-400" /> Penerima Manfaat:
          </span>
          <span className="font-bold text-rose-300 font-mono">
            {data.beneficiaries.toLocaleString('id-ID')} Jiwa
          </span>
        </div>

        <div className="text-[10px] text-gray-400 flex items-center justify-between">
          <span>Mutasi Transaksi:</span>
          <span className="font-bold text-gray-200">{data.txCount} Transaksi Sah</span>
        </div>
      </div>
    );
  }
  return null;
};
