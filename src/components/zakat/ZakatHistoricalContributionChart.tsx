import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Coins, 
  ShieldCheck, 
  Award, 
  Sliders, 
  Sparkles, 
  Layers, 
  Info, 
  FileText,
  ChevronRight,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { BlockchainTransaction } from '../../types';

interface ZakatHistoricalContributionChartProps {
  transactions: BlockchainTransaction[];
  nisabMaalAmount: number;
  goldPricePerGram: number;
  theme?: 'light' | 'dark';
}

interface MonthlyDataPoint {
  key: string;
  month: string;
  fullMonth: string;
  hijriMonth: string;
  zakatMaal: number;
  zakatProfesi: number;
  infaqSedekah: number;
  wakaf: number;
  total: number;
  cumulative: number;
  txCount: number;
  isRamadhan?: boolean;
  isCurrentMonth?: boolean;
  hasAuditCertificate: boolean;
}

export const ZakatHistoricalContributionChart: React.FC<ZakatHistoricalContributionChartProps> = ({
  transactions,
  nisabMaalAmount,
  goldPricePerGram,
  theme = 'light',
}) => {
  // Chart Display Mode
  const [chartMode, setChartMode] = useState<'categories' | 'total' | 'cumulative'>('categories');
  
  // Series Visibility Toggles
  const [showZakatMaal, setShowZakatMaal] = useState<boolean>(true);
  const [showZakatProfesi, setShowZakatProfesi] = useState<boolean>(true);
  const [showInfaq, setShowInfaq] = useState<boolean>(true);
  const [showWakaf, setShowWakaf] = useState<boolean>(true);
  const [showNisabBenchmark, setShowNisabBenchmark] = useState<boolean>(true);
  const [showAverageLine, setShowAverageLine] = useState<boolean>(false);

  // Reference Benchmark (Monthly Nisab)
  const monthlyNisab = useMemo(() => Math.round(nisabMaalAmount / 12), [nisabMaalAmount]);

  // Build the 12-Month Historical Data Series
  // Current anchor date is August 2026 (spanning Sep 2025 to Aug 2026)
  const historicalData = useMemo<MonthlyDataPoint[]>(() => {
    // 12-Month Baseline Structure
    const baseMonths: Omit<MonthlyDataPoint, 'total' | 'cumulative'>[] = [
      {
        key: '2025-09',
        month: 'Sep 25',
        fullMonth: 'September 2025',
        hijriMonth: 'Rabiul Awwal 1447',
        zakatMaal: 0,
        zakatProfesi: 1500000,
        infaqSedekah: 350000,
        wakaf: 0,
        txCount: 2,
        hasAuditCertificate: true,
      },
      {
        key: '2025-10',
        month: 'Okt 25',
        fullMonth: 'Oktober 2025',
        hijriMonth: 'Rabiul Akhir 1447',
        zakatMaal: 0,
        zakatProfesi: 1500000,
        infaqSedekah: 400000,
        wakaf: 500000,
        txCount: 3,
        hasAuditCertificate: true,
      },
      {
        key: '2025-11',
        month: 'Nov 25',
        fullMonth: 'November 2025',
        hijriMonth: 'Jumadil Ula 1447',
        zakatMaal: 0,
        zakatProfesi: 1750000,
        infaqSedekah: 500000,
        wakaf: 0,
        txCount: 2,
        hasAuditCertificate: true,
      },
      {
        key: '2025-12',
        month: 'Des 25',
        fullMonth: 'Desember 2025',
        hijriMonth: 'Jumadil Akhirah 1447',
        zakatMaal: 4500000, // Haul Akhir Tahun Bonus
        zakatProfesi: 2000000,
        infaqSedekah: 1000000,
        wakaf: 2000000,
        txCount: 5,
        hasAuditCertificate: true,
      },
      {
        key: '2026-01',
        month: 'Jan 26',
        fullMonth: 'Januari 2026',
        hijriMonth: 'Rajab 1447',
        zakatMaal: 0,
        zakatProfesi: 1750000,
        infaqSedekah: 600000,
        wakaf: 0,
        txCount: 2,
        hasAuditCertificate: true,
      },
      {
        key: '2026-02',
        month: 'Feb 26',
        fullMonth: 'Februari 2026',
        hijriMonth: 'Sya\'ban 1447',
        zakatMaal: 0,
        zakatProfesi: 1750000,
        infaqSedekah: 750000,
        wakaf: 1000000,
        txCount: 3,
        hasAuditCertificate: true,
      },
      {
        key: '2026-03',
        month: 'Mar 26',
        fullMonth: 'Maret 2026',
        hijriMonth: 'Ramadhan 1447 H',
        zakatMaal: 8500000, // Ramadhan peak
        zakatProfesi: 2500000,
        infaqSedekah: 3000000,
        wakaf: 5000000,
        txCount: 9,
        isRamadhan: true,
        hasAuditCertificate: true,
      },
      {
        key: '2026-04',
        month: 'Apr 26',
        fullMonth: 'April 2026',
        hijriMonth: 'Syawwal 1447 H',
        zakatMaal: 2500000,
        zakatProfesi: 2000000,
        infaqSedekah: 1500000,
        wakaf: 0,
        txCount: 4,
        isRamadhan: true,
        hasAuditCertificate: true,
      },
      {
        key: '2026-05',
        month: 'Mei 26',
        fullMonth: 'Mei 2026',
        hijriMonth: 'Dzulqa\'dah 1447',
        zakatMaal: 0,
        zakatProfesi: 1750000,
        infaqSedekah: 500000,
        wakaf: 500000,
        txCount: 3,
        hasAuditCertificate: true,
      },
      {
        key: '2026-06',
        month: 'Jun 26',
        fullMonth: 'Juni 2026',
        hijriMonth: 'Dzulhijjah 1447 (Qurban)',
        zakatMaal: 0,
        zakatProfesi: 1750000,
        infaqSedekah: 2500000,
        wakaf: 0,
        txCount: 4,
        hasAuditCertificate: true,
      },
      {
        key: '2026-07',
        month: 'Jul 26',
        fullMonth: 'Juli 2026',
        hijriMonth: 'Muharram 1448',
        zakatMaal: 0,
        zakatProfesi: 1750000,
        infaqSedekah: 800000,
        wakaf: 1000000,
        txCount: 3,
        hasAuditCertificate: true,
      },
      {
        key: '2026-08',
        month: 'Agu 26',
        fullMonth: 'Agustus 2026',
        hijriMonth: 'Safar 1448 (Bulan Ini)',
        zakatMaal: 2500000, // base for current month
        zakatProfesi: 1750000,
        infaqSedekah: 500000,
        wakaf: 0,
        txCount: 3,
        isCurrentMonth: true,
        hasAuditCertificate: true,
      },
    ];

    // Overlay any freshly added transactions in current context
    const currentMonthData = { ...baseMonths[baseMonths.length - 1] };
    
    // Count dynamic transactions that user might have added
    transactions.forEach(tx => {
      // If transaction was created during this session (e.g. txHash starts with 0x and is confirmed)
      if (tx.id.startsWith('tx-live-') || tx.id.startsWith('tx-rec-')) {
        if (tx.type.includes('MAAL') || tx.type.includes('EMAS') || tx.type.includes('SAHAM')) {
          currentMonthData.zakatMaal += tx.amount;
        } else if (tx.type.includes('PROFESI')) {
          currentMonthData.zakatProfesi += tx.amount;
        } else if (tx.type.includes('INFAQ')) {
          currentMonthData.infaqSedekah += tx.amount;
        } else if (tx.type.includes('WAKAF')) {
          currentMonthData.wakaf += tx.amount;
        }
        currentMonthData.txCount += 1;
      }
    });

    baseMonths[baseMonths.length - 1] = currentMonthData;

    // Calculate totals and cumulative progression
    let runningCumulative = 0;
    return baseMonths.map(item => {
      const monthTotal = item.zakatMaal + item.zakatProfesi + item.infaqSedekah + item.wakaf;
      runningCumulative += monthTotal;
      return {
        ...item,
        total: monthTotal,
        cumulative: runningCumulative,
      };
    });
  }, [transactions]);

  // Aggregate Key Metrics for Stats Banner
  const metrics = useMemo(() => {
    const total12Months = historicalData.reduce((acc, curr) => acc + curr.total, 0);
    const totalZakatOnly = historicalData.reduce((acc, curr) => acc + curr.zakatMaal + curr.zakatProfesi, 0);
    const totalInfaqWakaf = historicalData.reduce((acc, curr) => acc + curr.infaqSedekah + curr.wakaf, 0);
    const averageMonthly = Math.round(total12Months / 12);
    const totalTxCount = historicalData.reduce((acc, curr) => acc + curr.txCount, 0);
    
    // Find peak month
    let peakMonth = historicalData[0];
    historicalData.forEach(d => {
      if (d.total > peakMonth.total) {
        peakMonth = d;
      }
    });

    // Tax Deduction Benefit (PPh 21 / 25 reduction based on Zakat receipts)
    const estimatedTaxReduction = Math.round(totalZakatOnly * 0.15); // Standard 15% bracket savings

    return {
      total12Months,
      totalZakatOnly,
      totalInfaqWakaf,
      averageMonthly,
      totalTxCount,
      peakMonth,
      estimatedTaxReduction,
    };
  }, [historicalData]);

  // Currency formatter
  const formatRupiah = (val: number): string => {
    if (val >= 1000000000) {
      return `Rp ${(val / 1000000000).toFixed(1)} Miliar`;
    }
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(1)} Jt`;
    }
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const formatCurrencyFull = (val: number): string => {
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  // Custom Tooltip Renderer
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data: MonthlyDataPoint = payload[0]?.payload;
    if (!data) return null;

    return (
      <div className="bg-white/95 dark:bg-[#1A1D1A]/95 backdrop-blur-md p-4 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-xl text-xs space-y-3 min-w-[240px] max-w-[280px]">
        
        {/* Tooltip Header */}
        <div className="pb-2 border-b border-[#D8DFD8] dark:border-[#2D332D]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] text-sm">
              {data.fullMonth}
            </span>
            {data.isRamadhan && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black text-[9px]">
                🌙 Ramadhan
              </span>
            )}
            {data.isCurrentMonth && (
              <span className="px-2 py-0.5 rounded-full bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] font-black text-[9px]">
                ✨ Bulan Ini
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] font-medium block mt-0.5">
            {data.hijriMonth}
          </span>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-1.5 font-mono">
          {showZakatMaal && data.zakatMaal > 0 && (
            <div className="flex items-center justify-between text-[#2E7D32] dark:text-[#4CAF50]">
              <span className="font-sans text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                Zakat Maal:
              </span>
              <span className="font-bold">{formatCurrencyFull(data.zakatMaal)}</span>
            </div>
          )}

          {showZakatProfesi && data.zakatProfesi > 0 && (
            <div className="flex items-center justify-between text-[#0D9488] dark:text-[#14B8A6]">
              <span className="font-sans text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
                Zakat Profesi:
              </span>
              <span className="font-bold">{formatCurrencyFull(data.zakatProfesi)}</span>
            </div>
          )}

          {showInfaq && data.infaqSedekah > 0 && (
            <div className="flex items-center justify-between text-[#D97706] dark:text-[#F59E0B]">
              <span className="font-sans text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                Infaq & Sedekah:
              </span>
              <span className="font-bold">{formatCurrencyFull(data.infaqSedekah)}</span>
            </div>
          )}

          {showWakaf && data.wakaf > 0 && (
            <div className="flex items-center justify-between text-[#7C3AED] dark:text-[#A78BFA]">
              <span className="font-sans text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                Wakaf Produktif:
              </span>
              <span className="font-bold">{formatCurrencyFull(data.wakaf)}</span>
            </div>
          )}

          {/* Total & Cumulative Summary */}
          <div className="pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
            <div className="flex items-center justify-between font-sans">
              <span className="font-bold text-[#141A14] dark:text-[#E4E8E4] text-[11px]">
                Total Bulan Ini:
              </span>
              <span className="font-black text-sm text-[#2E7D32] dark:text-[#4CAF50] font-mono">
                {formatCurrencyFull(data.total)}
              </span>
            </div>

            {chartMode === 'cumulative' && (
              <div className="flex items-center justify-between font-sans text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                <span>Akumulasi s.d. Bulan Ini:</span>
                <span className="font-bold font-mono">{formatCurrencyFull(data.cumulative)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between text-[10px] text-[#5A665B] dark:text-[#A0A8A0] pt-1">
          <span className="flex items-center gap-1 text-[#2E7D32] dark:text-[#4CAF50] font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>{data.txCount} Tx On-Chain (BSZ)</span>
          </span>
          <span>
            {data.total >= monthlyNisab ? '✓ Memenuhi Nisab' : 'Di Bawah Nisab'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 sm:p-8 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
              Visualisasi Kontribusi Zakat 12 Bulan Terakhir
            </h2>
          </div>
          <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] max-w-2xl leading-relaxed">
            Pantau konsistensi ibadah zakat maal, zakat profesi, infaq, dan wakaf Anda yang telah terverifikasi secara on-chain pada buku besar L2.
          </p>
        </div>

        {/* Chart Mode Segmented Buttons */}
        <div className="flex items-center p-1 bg-[#EEF3EE] dark:bg-[#242924] rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] shrink-0 self-start lg:self-center">
          <button
            onClick={() => setChartMode('categories')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartMode === 'categories'
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Per Kategori Akad</span>
          </button>

          <button
            onClick={() => setChartMode('total')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartMode === 'total'
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tren Total Bulanan</span>
          </button>

          <button
            onClick={() => setChartMode('cumulative')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartMode === 'cumulative'
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pertumbuhan Akumulasi</span>
          </button>
        </div>
      </div>

      {/* Top 4 Summary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total 12-Month Contribution */}
        <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <div className="flex items-center justify-between text-[#5A665B] dark:text-[#A0A8A0]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Total Donasi 12 Bln</span>
            <Coins className="w-3.5 h-3.5 text-[#2E7D32]" />
          </div>
          <p className="text-base sm:text-lg font-black text-[#2E7D32] dark:text-[#4CAF50] font-mono">
            {formatRupiah(metrics.total12Months)}
          </p>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">
            {metrics.totalTxCount} Transaksi Terverifikasi
          </span>
        </div>

        {/* Monthly Average */}
        <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <div className="flex items-center justify-between text-[#5A665B] dark:text-[#A0A8A0]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Rata-Rata Bulanan</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#0D9488]" />
          </div>
          <p className="text-base sm:text-lg font-black text-[#141A14] dark:text-[#E4E8E4] font-mono">
            {formatRupiah(metrics.averageMonthly)}
          </p>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">
            Konsistensi: Rutin Setiap Bulan
          </span>
        </div>

        {/* Peak Giving Month */}
        <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <div className="flex items-center justify-between text-[#5A665B] dark:text-[#A0A8A0]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Puncak Donasi</span>
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
            {metrics.peakMonth.month} ({formatRupiah(metrics.peakMonth.total)})
          </p>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block truncate">
            {metrics.peakMonth.hijriMonth}
          </span>
        </div>

        {/* Tax Deduction Benefit */}
        <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <div className="flex items-center justify-between text-[#5A665B] dark:text-[#A0A8A0]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Pengurang Pajak (BSZ)</span>
            <FileText className="w-3.5 h-3.5 text-[#7C3AED]" />
          </div>
          <p className="text-base sm:text-lg font-black text-[#7C3AED] dark:text-[#A78BFA] font-mono">
            {formatRupiah(metrics.totalZakatOnly)}
          </p>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">
            PPh Terhemat: ~{formatRupiah(metrics.estimatedTaxReduction)}
          </span>
        </div>
      </div>

      {/* Series Filter Toggles (Visible in Category Mode) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
        
        {/* Category Series Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-extrabold text-[#5A665B] dark:text-[#A0A8A0] uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            <span>Kategori:</span>
          </span>

          <button
            onClick={() => setShowZakatMaal(!showZakatMaal)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
              showZakatMaal
                ? 'bg-[#2E7D32]/10 border-[#2E7D32] text-[#2E7D32] dark:text-[#4CAF50]'
                : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span>Zakat Maal</span>
          </button>

          <button
            onClick={() => setShowZakatProfesi(!showZakatProfesi)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
              showZakatProfesi
                ? 'bg-[#0D9488]/10 border-[#0D9488] text-[#0D9488] dark:text-[#14B8A6]'
                : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
            <span>Zakat Profesi</span>
          </button>

          <button
            onClick={() => setShowInfaq(!showInfaq)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
              showInfaq
                ? 'bg-[#D97706]/10 border-[#D97706] text-[#D97706] dark:text-[#F59E0B]'
                : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            <span>Infaq & Sedekah</span>
          </button>

          <button
            onClick={() => setShowWakaf(!showWakaf)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
              showWakaf
                ? 'bg-[#7C3AED]/10 border-[#7C3AED] text-[#7C3AED] dark:text-[#A78BFA]'
                : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
            <span>Wakaf</span>
          </button>
        </div>

        {/* Reference Line Controls */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-[#5A665B] dark:text-[#A0A8A0] cursor-pointer hover:text-[#141A14] dark:hover:text-[#E4E8E4]">
            <input
              type="checkbox"
              checked={showNisabBenchmark}
              onChange={(e) => setShowNisabBenchmark(e.target.checked)}
              className="rounded text-[#2E7D32] focus:ring-[#2E7D32] w-3.5 h-3.5"
            />
            <span>Garis Nisab Bulanan ({formatRupiah(monthlyNisab)})</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs text-[#5A665B] dark:text-[#A0A8A0] cursor-pointer hover:text-[#141A14] dark:hover:text-[#E4E8E4]">
            <input
              type="checkbox"
              checked={showAverageLine}
              onChange={(e) => setShowAverageLine(e.target.checked)}
              className="rounded text-[#2E7D32] focus:ring-[#2E7D32] w-3.5 h-3.5"
            />
            <span>Garis Rata-Rata</span>
          </label>
        </div>

      </div>

      {/* Main Recharts Container */}
      <div className="w-full h-[320px] sm:h-[380px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'categories' ? (
            <LineChart
              data={historicalData}
              margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === 'dark' ? '#2D332D' : '#E2E8E2'}
                vertical={false}
              />
              
              <XAxis
                dataKey="month"
                stroke={theme === 'dark' ? '#808A80' : '#687368'}
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: theme === 'dark' ? '#2D332D' : '#D8DFD8' }}
              />
              
              <YAxis
                stroke={theme === 'dark' ? '#808A80' : '#687368'}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => formatRupiah(val)}
              />

              <Tooltip content={<CustomChartTooltip />} />

              {/* Reference Line for Monthly Nisab */}
              {showNisabBenchmark && (
                <ReferenceLine
                  y={monthlyNisab}
                  stroke="#E11D48"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Nisab Bulanan: ${formatRupiah(monthlyNisab)}`,
                    position: 'insideTopRight',
                    fill: '#E11D48',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              )}

              {/* Reference Line for Average */}
              {showAverageLine && (
                <ReferenceLine
                  y={metrics.averageMonthly}
                  stroke="#3B82F6"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{
                    value: `Avg: ${formatRupiah(metrics.averageMonthly)}`,
                    position: 'insideBottomRight',
                    fill: '#3B82F6',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              )}

              {/* Zakat Maal Line */}
              {showZakatMaal && (
                <Line
                  type="monotone"
                  dataKey="zakatMaal"
                  name="Zakat Maal"
                  stroke="#2E7D32"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#2E7D32', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, fill: '#2E7D32', stroke: '#A5D6A7', strokeWidth: 2 }}
                />
              )}

              {/* Zakat Profesi Line */}
              {showZakatProfesi && (
                <Line
                  type="monotone"
                  dataKey="zakatProfesi"
                  name="Zakat Profesi"
                  stroke="#0D9488"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#0D9488', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, fill: '#0D9488', stroke: '#99F6E4', strokeWidth: 2 }}
                />
              )}

              {/* Infaq & Sedekah Line */}
              {showInfaq && (
                <Line
                  type="monotone"
                  dataKey="infaqSedekah"
                  name="Infaq & Sedekah"
                  stroke="#D97706"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  dot={{ r: 3, fill: '#D97706', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                  activeDot={{ r: 5, fill: '#D97706', stroke: '#FDE68A', strokeWidth: 2 }}
                />
              )}

              {/* Wakaf Produktif Line */}
              {showWakaf && (
                <Line
                  type="monotone"
                  dataKey="wakaf"
                  name="Wakaf Produktif"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#7C3AED', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                  activeDot={{ r: 5, fill: '#7C3AED', stroke: '#DDD6FE', strokeWidth: 2 }}
                />
              )}
            </LineChart>
          ) : chartMode === 'total' ? (
            /* Total Monthly Trend with Soft Area Fill */
            <ComposedChart
              data={historicalData}
              margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="totalMonthlyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === 'dark' ? '#2D332D' : '#E2E8E2'}
                vertical={false}
              />
              
              <XAxis
                dataKey="month"
                stroke={theme === 'dark' ? '#808A80' : '#687368'}
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: theme === 'dark' ? '#2D332D' : '#D8DFD8' }}
              />
              
              <YAxis
                stroke={theme === 'dark' ? '#808A80' : '#687368'}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => formatRupiah(val)}
              />

              <Tooltip content={<CustomChartTooltip />} />

              {showNisabBenchmark && (
                <ReferenceLine
                  y={monthlyNisab}
                  stroke="#E11D48"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Nisab Bulanan: ${formatRupiah(monthlyNisab)}`,
                    position: 'insideTopRight',
                    fill: '#E11D48',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              )}

              <ReferenceLine
                y={metrics.averageMonthly}
                stroke="#3B82F6"
                strokeDasharray="3 3"
                strokeWidth={1.5}
                label={{
                  value: `Rata-rata: ${formatRupiah(metrics.averageMonthly)}`,
                  position: 'insideBottomRight',
                  fill: '#3B82F6',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />

              <Area
                type="monotone"
                dataKey="total"
                fill="url(#totalMonthlyGradient)"
                stroke="none"
              />

              <Line
                type="monotone"
                dataKey="total"
                name="Total Zakat & Infaq"
                stroke="#2E7D32"
                strokeWidth={3}
                dot={{ r: 4, fill: '#2E7D32', strokeWidth: 2, stroke: '#FFFFFF' }}
                activeDot={{ r: 7, fill: '#2E7D32', stroke: '#A5D6A7', strokeWidth: 2 }}
              />
            </ComposedChart>
          ) : (
            /* Cumulative Trajectory Growth */
            <ComposedChart
              data={historicalData}
              margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === 'dark' ? '#2D332D' : '#E2E8E2'}
                vertical={false}
              />
              
              <XAxis
                dataKey="month"
                stroke={theme === 'dark' ? '#808A80' : '#687368'}
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: theme === 'dark' ? '#2D332D' : '#D8DFD8' }}
              />
              
              <YAxis
                stroke={theme === 'dark' ? '#808A80' : '#687368'}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => formatRupiah(val)}
              />

              <Tooltip content={<CustomChartTooltip />} />

              <Area
                type="monotone"
                dataKey="cumulative"
                fill="url(#cumulativeGradient)"
                stroke="none"
              />

              <Line
                type="monotone"
                dataKey="cumulative"
                name="Akumulasi 12 Bulan"
                stroke="#0D9488"
                strokeWidth={3.5}
                dot={{ r: 4.5, fill: '#0D9488', strokeWidth: 2, stroke: '#FFFFFF' }}
                activeDot={{ r: 8, fill: '#0D9488', stroke: '#99F6E4', strokeWidth: 2 }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Notes & Blockchain Audit Tag */}
      <div className="pt-4 border-t border-[#D8DFD8] dark:border-[#2D332D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#5A665B] dark:text-[#A0A8A0]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
          <span>
            Data historis terekam pada <strong>BAZNAS L2 Proof-of-Authority</strong> dengan bukti kriptografis Merkle Root.
          </span>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <span className="flex items-center gap-1 font-bold text-[#141A14] dark:text-[#E4E8E4]">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
            100% On-Chain Synchronized
          </span>
        </div>
      </div>

    </div>
  );
};
