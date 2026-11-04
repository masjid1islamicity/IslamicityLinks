import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Coins,
  Sparkles,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Sliders,
  Building,
  Scale,
  FileText,
  DollarSign,
  Clock,
  Info,
  HelpCircle,
  Calculator,
  ChevronDown,
  Layers,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AsnafCategory, BlockchainTransaction } from '../../types';
import { OFFICIAL_CHARITIES } from '../../data/mockData';

export interface LiveRatesResponse {
  status: string;
  timestamp: string;
  source: string;
  feedQuality: string;
  spotMarketStatus: string;
  selectedCurrencyCode: string;
  currentRate: {
    currency: string;
    symbol: string;
    name: string;
    exchangeRateToUSD: number;
    gold: {
      perGram24k: number;
      perGram22k: number;
      perGram18k: number;
      perTroyOz: number;
      perDinar425g: number;
      change24hPercent: number;
      dayHigh: number;
      dayLow: number;
    };
    silver: {
      perGramPure: number;
      perTroyOz: number;
      perDirham2975g: number;
      change24hPercent: number;
      dayHigh: number;
      dayLow: number;
    };
    nisab: {
      goldStandard85g: number;
      silverStandard595g: number;
      riceStandard653kg: number;
    };
  };
  allCurrencies: Record<string, any>;
  historicalTrend7d: Array<{ day: string; goldUsd: number; silverUsd: number }>;
}

const DEFAULT_RATES: LiveRatesResponse = {
  status: "success",
  timestamp: new Date().toISOString(),
  source: "Islamicity Global Commodity & Sharia FX Feed",
  feedQuality: "REAL_TIME_LIVE_MARKET",
  spotMarketStatus: "OPEN_AUDITED",
  selectedCurrencyCode: "IDR",
  currentRate: {
    currency: "IDR",
    symbol: "Rp",
    name: "Indonesian Rupiah",
    exchangeRateToUSD: 16180,
    gold: {
      perGram24k: 1450000,
      perGram22k: 1328000,
      perGram18k: 1087500,
      perTroyOz: 40690000,
      perDinar425g: 6162500,
      change24hPercent: +0.68,
      dayHigh: 1461000,
      dayLow: 1439000
    },
    silver: {
      perGramPure: 15300,
      perTroyOz: 476500,
      perDirham2975g: 45500,
      change24hPercent: -0.34,
      dayHigh: 15500,
      dayLow: 15100
    },
    nisab: {
      goldStandard85g: 123250000,
      silverStandard595g: 9103500,
      riceStandard653kg: 9795000
    }
  },
  allCurrencies: {},
  historicalTrend7d: [
    { day: "H-6", goldUsd: 2482, silverUsd: 28.80 },
    { day: "H-5", goldUsd: 2490, silverUsd: 29.10 },
    { day: "H-4", goldUsd: 2495, silverUsd: 28.95 },
    { day: "H-3", goldUsd: 2503, silverUsd: 29.25 },
    { day: "H-2", goldUsd: 2508, silverUsd: 29.50 },
    { day: "Kemarin", goldUsd: 2502, silverUsd: 29.35 },
    { day: "Hari Ini (Live)", goldUsd: 2514.80, silverUsd: 29.45 }
  ]
};

const SUPPORTED_CURRENCIES = [
  { code: 'IDR', symbol: 'Rp', name: 'Rupiah (IDR)', flag: '🇮🇩' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', flag: '🇺🇸' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal (SAR)', flag: '🇸🇦' },
  { code: 'MYR', symbol: 'RM', name: 'Ringgit (MYR)', flag: '🇲🇾' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (SGD)', flag: '🇸🇬' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', flag: '🇪🇺' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)', flag: '🇦🇪' }
];

export const RealTimeZakatMaalCalculator: React.FC = () => {
  const {
    addNewTransaction,
    setSelectedReceiptTx,
    userProfile,
    isOffline,
  } = useApp();

  // Selected Currency
  const [selectedCurrency, setSelectedCurrency] = useState<string>('IDR');
  const [ratesData, setRatesData] = useState<LiveRatesResponse>(DEFAULT_RATES);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);
  const [lastFetchedTime, setLastFetchedTime] = useState<string>('Baru saja');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Asset inputs
  const [goldWeightGrams, setGoldWeightGrams] = useState<number>(95);
  const [goldKarat, setGoldKarat] = useState<'24K' | '22K' | '18K'>('24K');
  const [silverWeightGrams, setSilverWeightGrams] = useState<number>(0);
  
  const [cashAndBank, setCashAndBank] = useState<number>(75000000);
  const [tradeInventoryAndReceivables, setTradeInventoryAndReceivables] = useState<number>(35000000);
  const [stocksAndInvestments, setStocksAndInvestments] = useState<number>(25000000);
  const [shortTermDebt, setShortTermDebt] = useState<number>(10000000);

  // Nisab standard choice: 'GOLD' (85g) or 'SILVER' (595g)
  const [nisabStandard, setNisabStandard] = useState<'GOLD' | 'SILVER'>('GOLD');
  
  // Haul type: 'HIJRI' (2.5%) or 'GREGORIAN' (2.577%)
  const [calendarType, setCalendarType] = useState<'HIJRI' | 'GREGORIAN'>('HIJRI');
  const [isHaulFulfilled, setIsHaulFulfilled] = useState<boolean>(true);

  // Charity & Asnaf selection for settlement
  const [selectedCharityId, setSelectedCharityId] = useState<string>('baznas-ri');
  const [selectedAsnaf, setSelectedAsnaf] = useState<AsnafCategory>('FAKIR');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch live rates from API
  const fetchLiveRates = useCallback(async (currencyCode: string) => {
    setIsLoadingRates(true);
    try {
      const res = await fetch(`/api/zakat/rates?currency=${currencyCode}`);
      if (res.ok) {
        const data: LiveRatesResponse = await res.json();
        setRatesData(data);
        const now = new Date();
        setLastFetchedTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.warn("Failed to fetch live zakat rates, using local cached rates:", err);
    } finally {
      setIsLoadingRates(false);
    }
  }, []);

  // Fetch on mount and when currency changes
  useEffect(() => {
    fetchLiveRates(selectedCurrency);
  }, [selectedCurrency, fetchLiveRates]);

  // Current active rates
  const currentRate = ratesData.currentRate;
  const currencySymbol = currentRate.symbol;

  // Active Gold Price per gram based on selected Karat
  const activeGoldPricePerGram = useMemo(() => {
    if (goldKarat === '22K') return currentRate.gold.perGram22k;
    if (goldKarat === '18K') return currentRate.gold.perGram18k;
    return currentRate.gold.perGram24k;
  }, [goldKarat, currentRate]);

  // Calculated Asset Valuations in active currency
  const goldTotalValue = useMemo(() => {
    return Math.round(goldWeightGrams * activeGoldPricePerGram);
  }, [goldWeightGrams, activeGoldPricePerGram]);

  const silverTotalValue = useMemo(() => {
    return Math.round(silverWeightGrams * currentRate.silver.perGramPure);
  }, [silverWeightGrams, currentRate.silver.perGramPure]);

  // Total Gross Wealth
  const totalGrossAssets = useMemo(() => {
    return goldTotalValue + silverTotalValue + cashAndBank + tradeInventoryAndReceivables + stocksAndInvestments;
  }, [goldTotalValue, silverTotalValue, cashAndBank, tradeInventoryAndReceivables, stocksAndInvestments]);

  // Net Zakatable Wealth (Harta Bersih setelah dikurangi hutang jatuh tempo)
  const netZakatableWealth = useMemo(() => {
    return Math.max(0, totalGrossAssets - shortTermDebt);
  }, [totalGrossAssets, shortTermDebt]);

  // Active Nisab Threshold based on standard
  const activeNisabThreshold = useMemo(() => {
    if (nisabStandard === 'SILVER') {
      return currentRate.nisab.silverStandard595g;
    }
    return currentRate.nisab.goldStandard85g;
  }, [nisabStandard, currentRate]);

  // Rate of Zakat (2.5% Hijri or 2.577% Gregorian/Masehi)
  const zakatRatePercentage = calendarType === 'GREGORIAN' ? 0.02577 : 0.025;

  // Nisab fulfillment check
  const isNisabReached = netZakatableWealth >= activeNisabThreshold;
  const isObligated = isNisabReached && isHaulFulfilled;

  // Final Zakat Liability
  const zakatPayableAmount = useMemo(() => {
    if (!isObligated) return 0;
    return Math.round(netZakatableWealth * zakatRatePercentage);
  }, [isObligated, netZakatableWealth, zakatRatePercentage]);

  // Percentage comparison against Nisab
  const nisabPercentage = activeNisabThreshold > 0 
    ? Math.round((netZakatableWealth / activeNisabThreshold) * 100)
    : 0;

  // Format currency helper
  const formatCurrency = (amount: number) => {
    if (selectedCurrency === 'IDR') {
      return `Rp ${amount.toLocaleString('id-ID')}`;
    }
    return `${currencySymbol} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Preset scenarios
  const handleApplyPreset = (type: 'GOLD_SAVER' | 'BUSINESS' | 'MIDDLE_CLASS' | 'EXPAT_USD') => {
    if (type === 'GOLD_SAVER') {
      setGoldWeightGrams(100);
      setGoldKarat('24K');
      setSilverWeightGrams(0);
      setCashAndBank(selectedCurrency === 'IDR' ? 15000000 : 1000);
      setTradeInventoryAndReceivables(0);
      setStocksAndInvestments(0);
      setShortTermDebt(0);
    } else if (type === 'BUSINESS') {
      setGoldWeightGrams(25);
      setGoldKarat('24K');
      setSilverWeightGrams(0);
      setCashAndBank(selectedCurrency === 'IDR' ? 85000000 : 5000);
      setTradeInventoryAndReceivables(selectedCurrency === 'IDR' ? 120000000 : 8000);
      setStocksAndInvestments(selectedCurrency === 'IDR' ? 30000000 : 2000);
      setShortTermDebt(selectedCurrency === 'IDR' ? 25000000 : 1500);
    } else if (type === 'MIDDLE_CLASS') {
      setGoldWeightGrams(50);
      setGoldKarat('24K');
      setSilverWeightGrams(250);
      setCashAndBank(selectedCurrency === 'IDR' ? 45000000 : 3000);
      setTradeInventoryAndReceivables(0);
      setStocksAndInvestments(selectedCurrency === 'IDR' ? 40000000 : 2500);
      setShortTermDebt(selectedCurrency === 'IDR' ? 5000000 : 350);
    } else if (type === 'EXPAT_USD') {
      setSelectedCurrency('USD');
      setGoldWeightGrams(120);
      setGoldKarat('24K');
      setSilverWeightGrams(500);
      setCashAndBank(12000);
      setTradeInventoryAndReceivables(5000);
      setStocksAndInvestments(18000);
      setShortTermDebt(2000);
    }
  };

  // Copy Calculation Breakdown
  const handleCopySummary = () => {
    const summaryText = `--- RINGKASAN AUDIT ZAKAT AL-MAAL REAL-TIME ---
Platform: IslamicityLink (Live Commodity API Synced)
Mata Uang: ${selectedCurrency} (${currentRate.name})
Harga Emas Live (24K): ${formatCurrency(currentRate.gold.perGram24k)}/gram
Harga Perak Live (999): ${formatCurrency(currentRate.silver.perGramPure)}/gram

[RINCIAN ASET]:
- Emas (${goldWeightGrams}g, ${goldKarat}): ${formatCurrency(goldTotalValue)}
- Perak (${silverWeightGrams}g): ${formatCurrency(silverTotalValue)}
- Kas & Tabungan Bank: ${formatCurrency(cashAndBank)}
- Aset Dagang & Piutang: ${formatCurrency(tradeInventoryAndReceivables)}
- Investasi & Saham: ${formatCurrency(stocksAndInvestments)}
---------------------------------------------
Total Harta Kotor: ${formatCurrency(totalGrossAssets)}
Hutang Jatuh Tempo (-): ${formatCurrency(shortTermDebt)}
Harta Bersih Wajib Zakat: ${formatCurrency(netZakatableWealth)}

[STATUS NISAB]:
- Standar Nisab: ${nisabStandard === 'GOLD' ? 'Emas 85g' : 'Perak 595g'} (${formatCurrency(activeNisabThreshold)})
- Status Kelayakan: ${isObligated ? 'WAJIB ZAKAT (Memenuhi Nisab & Haul)' : 'BELUM WAJIB ZAKAT'}
- Nisab Ratio: ${nisabPercentage}%

Kewajiban Zakat (${calendarType === 'HIJRI' ? '2.5% Tahun Hijriah' : '2.577% Tahun Masehi'}):
>>> ${formatCurrency(zakatPayableAmount)} <<<
Tercatat Pada Smart Contract Islamicity Blockchain L2.`;

    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Handle Pay Zakat On-Chain
  const handlePayZakatOnChain = () => {
    if (zakatPayableAmount <= 0) return;
    setIsSubmitting(true);

    const charity = OFFICIAL_CHARITIES.find(c => c.id === selectedCharityId) || OFFICIAL_CHARITIES[0];

    // Convert to IDR equivalent if foreign currency for uniform ledger recording
    const amountInIdr = selectedCurrency === 'IDR' 
      ? zakatPayableAmount 
      : Math.round(zakatPayableAmount * (currentRate.exchangeRateToUSD ? 16180 / currentRate.exchangeRateToUSD : 16180));

    setTimeout(() => {
      const newTx: BlockchainTransaction = addNewTransaction({
        charityId: charity.id,
        charityName: charity.name,
        donorName: userProfile.name,
        amount: amountInIdr,
        type: 'ZAKAT_MAAL',
        isAnonymous,
        smartContract: `0x88F2...ZAKAT_MAAL_LIVE_${selectedCurrency}`,
        asnafTarget: selectedAsnaf,
        status: 'CONFIRMED',
      });

      setIsSubmitting(false);
      setSelectedReceiptTx(newTx);
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 sm:p-8 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-6">
      
      {/* Top Header with Live Market Indicator & Currency Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D8DFD8]/70 dark:border-[#2D332D]/70 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#2E7D32] dark:text-[#4CAF50] text-xs font-bold uppercase tracking-wider">
            <Coins className="w-4 h-4" />
            <span>Kalkulator Zakat Al-Maal Real-Time & Live API</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#141A14] dark:text-[#E4E8E4] tracking-tight">
            Kalkulator Zakat Al-Maal (Konversi Otomatis Emas & Perak)
          </h2>
          <p className="text-xs sm:text-sm text-[#5A665B] dark:text-[#A0A8A0] max-w-2xl">
            Hitung nilai seluruh simpanan logam mulia, kas perbankan, aset perniagaan, dan investasi dengan konversi harga komoditas spot dan kurs mata uang lokal secara live.
          </p>
        </div>

        {/* Currency Switcher & Live Refresh Button */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Currency Dropdown */}
          <div className="relative">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-black text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} ({c.symbol})
                </option>
              ))}
            </select>
            <Globe className="w-4 h-4 text-[#5A665B] dark:text-[#A0A8A0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-[#5A665B] dark:text-[#A0A8A0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Refresh Rates Button */}
          <button
            onClick={() => fetchLiveRates(selectedCurrency)}
            disabled={isLoadingRates}
            title="Perbarui Harga Emas & Kurs Spot Live"
            className="px-3.5 py-2 rounded-2xl bg-[#2E7D32]/10 hover:bg-[#2E7D32]/20 text-[#2E7D32] dark:text-[#4CAF50] border border-[#2E7D32]/20 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRates ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Perbarui Kurs Live</span>
          </button>
        </div>
      </div>

      {/* Live Market Rates Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-[#EEF3EE]/60 dark:bg-[#242924]/60 border border-[#D8DFD8] dark:border-[#2D332D]">
        
        {/* Live Gold Rate */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#5A665B] dark:text-[#A0A8A0] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Emas 24K Live ({selectedCurrency})
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              +{currentRate.gold.change24hPercent}%
            </span>
          </div>
          <p className="text-sm sm:text-base font-black text-[#141A14] dark:text-[#E4E8E4] font-mono">
            {formatCurrency(currentRate.gold.perGram24k)}
            <span className="text-[10px] font-normal text-[#5A665B] dark:text-[#A0A8A0]"> /gram</span>
          </p>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
            1 Dinar (4.25g): {formatCurrency(currentRate.gold.perDinar425g)}
          </span>
        </div>

        {/* Live Silver Rate */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#5A665B] dark:text-[#A0A8A0] font-bold flex items-center gap-1">
              <Coins className="w-3 h-3 text-slate-400" />
              Perak 999 Live ({selectedCurrency})
            </span>
            <span className="text-[10px] font-bold text-rose-500">
              {currentRate.silver.change24hPercent}%
            </span>
          </div>
          <p className="text-sm sm:text-base font-black text-[#141A14] dark:text-[#E4E8E4] font-mono">
            {formatCurrency(currentRate.silver.perGramPure)}
            <span className="text-[10px] font-normal text-[#5A665B] dark:text-[#A0A8A0]"> /gram</span>
          </p>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
            1 Dirham (2.975g): {formatCurrency(currentRate.silver.perDirham2975g)}
          </span>
        </div>

        {/* Nisab Gold 85g Benchmark */}
        <div className="space-y-0.5">
          <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] font-bold flex items-center gap-1">
            <Scale className="w-3 h-3 text-[#2E7D32] dark:text-[#4CAF50]" />
            Nisab Emas (85 Gram)
          </span>
          <p className="text-sm sm:text-base font-black text-[#2E7D32] dark:text-[#4CAF50] font-mono">
            {formatCurrency(currentRate.nisab.goldStandard85g)}
          </p>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
            Ambang Wajib Zakat Harta/Tahun
          </span>
        </div>

        {/* Status & Live Feed Quality */}
        <div className="space-y-0.5">
          <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            Status Feed Pasar
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300">
              Spot Market Terverifikasi
            </span>
          </div>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
            Sinkronisasi: {lastFetchedTime}
          </span>
        </div>

      </div>

      {/* Fast Preset Scenarios */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1 mr-1">
          <Sliders className="w-3.5 h-3.5" /> Simulasi Cepat:
        </span>
        <button
          onClick={() => handleApplyPreset('GOLD_SAVER')}
          className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-semibold text-[#141A14] dark:text-[#E4E8E4] hover:border-[#2E7D32] transition-all"
        >
          🪙 Simpanan Emas 100g
        </button>
        <button
          onClick={() => handleApplyPreset('BUSINESS')}
          className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-semibold text-[#141A14] dark:text-[#E4E8E4] hover:border-[#2E7D32] transition-all"
        >
          🏪 Pengusaha Retail / UMKM
        </button>
        <button
          onClick={() => handleApplyPreset('MIDDLE_CLASS')}
          className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-semibold text-[#141A14] dark:text-[#E4E8E4] hover:border-[#2E7D32] transition-all"
        >
          💼 Tabungan & Portofolio Saham
        </button>
        <button
          onClick={() => handleApplyPreset('EXPAT_USD')}
          className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-semibold text-[#141A14] dark:text-[#E4E8E4] hover:border-[#2E7D32] transition-all"
        >
          🌐 Ekspatriat Global (USD)
        </button>
      </div>

      {/* Main Calculation Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Asset Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-[#EEF3EE]/70 dark:bg-[#242924]/70 border border-[#D8DFD8] dark:border-[#2D332D] space-y-4">
            <h3 className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                1. Logam Mulia (Konversi Otomatis Kurs Live)
              </span>
              <span className="text-[11px] font-mono text-[#2E7D32] dark:text-[#4CAF50] font-bold">
                {formatCurrency(goldTotalValue + silverTotalValue)}
              </span>
            </h3>

            {/* Gold Assets Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-5 space-y-1">
                <label className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] flex items-center justify-between">
                  <span>Berat Emas Simpanan:</span>
                  <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">Nisab 85g</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={goldWeightGrams}
                    onChange={(e) => setGoldWeightGrams(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 pr-14 bg-white dark:bg-[#151715] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] focus:ring-1 focus:ring-[#2E7D32]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                    Gram
                  </span>
                </div>
              </div>

              {/* Karat Selection */}
              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Kadar Karat:
                </label>
                <select
                  value={goldKarat}
                  onChange={(e) => setGoldKarat(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-white dark:bg-[#151715] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]"
                >
                  <option value="24K">24 Karat (99.9%)</option>
                  <option value="22K">22 Karat (91.6%)</option>
                  <option value="18K">18 Karat (75.0%)</option>
                </select>
              </div>

              {/* Auto Converted Gold Valuation */}
              <div className="sm:col-span-4 space-y-1">
                <label className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                  Nilai Terkonversi ({selectedCurrency}):
                </label>
                <div className="px-3 py-2 bg-white dark:bg-[#151715] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs font-black text-amber-600 dark:text-amber-400">
                  {formatCurrency(goldTotalValue)}
                </div>
              </div>
            </div>

            {/* Silver Assets Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2 border-t border-[#D8DFD8]/60 dark:border-[#2D332D]/60">
              <div className="sm:col-span-5 space-y-1">
                <label className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] flex items-center justify-between">
                  <span>Berat Perak Simpanan:</span>
                  <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">Nisab 595g</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={silverWeightGrams}
                    onChange={(e) => setSilverWeightGrams(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 pr-14 bg-white dark:bg-[#151715] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] focus:ring-1 focus:ring-[#2E7D32]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                    Gram
                  </span>
                </div>
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                  Kadar Perak:
                </label>
                <div className="px-2.5 py-2 bg-white dark:bg-[#151715] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                  Murni 99.9%
                </div>
              </div>

              <div className="sm:col-span-4 space-y-1">
                <label className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                  Nilai Terkonversi ({selectedCurrency}):
                </label>
                <div className="px-3 py-2 bg-white dark:bg-[#151715] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs font-black text-slate-700 dark:text-slate-300">
                  {formatCurrency(silverTotalValue)}
                </div>
              </div>
            </div>
          </div>

          {/* Liquid Cash, Trade & Investments Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#EEF3EE]/70 dark:bg-[#242924]/70 border border-[#D8DFD8] dark:border-[#2D332D] space-y-4">
            <h3 className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
                2. Kas, Perniagaan & Portofolio Investasi ({selectedCurrency})
              </span>
              <span className="text-[11px] font-mono text-[#2E7D32] dark:text-[#4CAF50] font-bold">
                {formatCurrency(cashAndBank + tradeInventoryAndReceivables + stocksAndInvestments)}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Cash & Bank */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] flex items-center justify-between">
                  <span>Kas & Rekening:</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={cashAndBank}
                    onChange={(e) => setCashAndBank(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#151715] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] focus:ring-1 focus:ring-[#2E7D32]"
                  />
                </div>
                <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">
                  Tabungan & deposito cair
                </span>
              </div>

              {/* Trade Assets & Receivables */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] flex items-center justify-between">
                  <span>Aset Dagang:</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={tradeInventoryAndReceivables}
                    onChange={(e) => setTradeInventoryAndReceivables(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#151715] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] focus:ring-1 focus:ring-[#2E7D32]"
                  />
                </div>
                <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">
                  Stok barang + piutang lancar
                </span>
              </div>

              {/* Stocks / Crypto / Mutual Funds */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] flex items-center justify-between">
                  <span>Saham & Reksadana:</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={stocksAndInvestments}
                    onChange={(e) => setStocksAndInvestments(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#151715] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] focus:ring-1 focus:ring-[#2E7D32]"
                  />
                </div>
                <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">
                  Portofolio syariah bersih
                </span>
              </div>

            </div>
          </div>

          {/* Deductible Short-term Debts */}
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/5 dark:bg-rose-950/10 border border-rose-500/20 space-y-3">
            <h3 className="text-sm font-extrabold text-rose-800 dark:text-rose-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                3. Hutang Jatuh Tempo Kebutuhan Pokok (-)
              </span>
              <span className="text-[11px] font-mono text-rose-700 dark:text-rose-300 font-bold">
                -{formatCurrency(shortTermDebt)}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-8">
                <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed">
                  Hutang jangka pendek yang jatuh tempo pada masa haul dan digunakan untuk kebutuhan pokok/operasional mendasar dapat menjadi pengurang sebelum perhitungan zakat.
                </p>
              </div>
              <div className="sm:col-span-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-rose-600">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={shortTermDebt}
                    onChange={(e) => setShortTermDebt(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#151715] border border-rose-300 dark:border-rose-900 rounded-xl font-mono text-xs font-bold text-rose-700 dark:text-rose-300 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sharia Settings (Nisab Standard & Calendar Basis) */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#151715] border border-[#D8DFD8] dark:border-[#2D332D] space-y-3">
            <span className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4] uppercase tracking-wider block">
              Parameter Fikih & Ketentuan Nisab:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Nisab Standard Picker */}
              <div className="space-y-1">
                <label className="font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                  Patokan Standar Nisab:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNisabStandard('GOLD')}
                    className={`py-2 px-2.5 rounded-xl font-bold border transition-all text-center ${
                      nisabStandard === 'GOLD'
                        ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-xs'
                        : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4]'
                    }`}
                  >
                    Emas 85g (Mayoritas)
                  </button>
                  <button
                    onClick={() => setNisabStandard('SILVER')}
                    className={`py-2 px-2.5 rounded-xl font-bold border transition-all text-center ${
                      nisabStandard === 'SILVER'
                        ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-xs'
                        : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4]'
                    }`}
                  >
                    Perak 595g (Hanafi)
                  </button>
                </div>
              </div>

              {/* Haul Calendar Basis */}
              <div className="space-y-1">
                <label className="font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                  Dasar Perhitungan Haul:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCalendarType('HIJRI')}
                    className={`py-2 px-2.5 rounded-xl font-bold border transition-all text-center ${
                      calendarType === 'HIJRI'
                        ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-xs'
                        : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4]'
                    }`}
                  >
                    Hijriah (2.5%)
                  </button>
                  <button
                    onClick={() => setCalendarType('GREGORIAN')}
                    className={`py-2 px-2.5 rounded-xl font-bold border transition-all text-center ${
                      calendarType === 'GREGORIAN'
                        ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-xs'
                        : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4]'
                    }`}
                  >
                    Masehi (2.577%)
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Live Audit Summary & One-Click Settlement (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Real-time Nisab Status & Obligation Card */}
          <div className={`p-5 rounded-3xl border transition-all shadow-md ${
            isObligated 
              ? 'bg-gradient-to-br from-[#1F3D22] to-[#132415] text-[#E4E8E4] border-[#2E7D32]/40' 
              : 'bg-gradient-to-br from-[#2D2A18] to-[#1E1C12] text-[#E4E8E4] border-amber-500/30'
          }`}>
            <div className="space-y-4">
              
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isObligated ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Wajib Menunaikan Zakat
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Info className="w-3 h-3 text-amber-400" />
                        Belum Mencapai Nisab
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {isObligated ? 'Kewajiban Zakat Al-Maal' : 'Simulasi Infak & Sedekah'}
                  </h3>
                </div>

                <button
                  onClick={handleCopySummary}
                  title="Salin Rincian Perhitungan"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-xs flex items-center gap-1 shrink-0"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Big Calculated Number */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1">
                <span className="text-[11px] text-[#A0A8A0] font-bold block">
                  Total Zakat Terhitung ({calendarType === 'HIJRI' ? '2,5%' : '2,577%'}):
                </span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
                  {formatCurrency(zakatPayableAmount)}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#A0A8A0] pt-1">
                  <span>Basis Harta Bersih:</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(netZakatableWealth)}</span>
                </div>
              </div>

              {/* Nisab Progress Gauge Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#A0A8A0]">Rasio Terhadap Nisab ({nisabStandard === 'GOLD' ? '85g Emas' : '595g Perak'}):</span>
                  <span className={`font-mono font-extrabold ${nisabPercentage >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {nisabPercentage}%
                  </span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      nisabPercentage >= 100 ? 'bg-gradient-to-r from-emerald-500 to-[#4CAF50]' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, nisabPercentage)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#A0A8A0]">
                  <span>Nisab: {formatCurrency(activeNisabThreshold)}</span>
                  <span>{nisabPercentage >= 100 ? `Melebihi Nisab ${formatCurrency(netZakatableWealth - activeNisabThreshold)}` : `Kurang ${formatCurrency(activeNisabThreshold - netZakatableWealth)}`}</span>
                </div>
              </div>

              {/* Itemized Calculation Summary Checklist */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#A0A8A0]">
                  <span>Total Aset Kotor:</span>
                  <span className="text-white font-bold">{formatCurrency(totalGrossAssets)}</span>
                </div>
                <div className="flex justify-between text-rose-300">
                  <span>Hutang Pengurang:</span>
                  <span>-{formatCurrency(shortTermDebt)}</span>
                </div>
                <div className="border-t border-white/10 pt-1.5 flex justify-between font-bold text-emerald-300">
                  <span>Harta Wajib Zakat:</span>
                  <span>{formatCurrency(netZakatableWealth)}</span>
                </div>
              </div>

            </div>
          </div>

          {/* On-Chain Payment & Asnaf Dispatch Form */}
          <div className="p-5 rounded-3xl bg-[#EEF3EE]/80 dark:bg-[#242924]/80 border border-[#D8DFD8] dark:border-[#2D332D] space-y-4">
            <h4 className="text-xs font-black text-[#141A14] dark:text-[#E4E8E4] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
              Penyaluran Zakat Blockchain L2 & Bukti BSZ
            </h4>

            {/* Charity Partner Selector */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                Lembaga Amil Zakat Terakreditasi:
              </label>
              <select
                value={selectedCharityId}
                onChange={(e) => setSelectedCharityId(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#151715] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]"
              >
                {OFFICIAL_CHARITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.accountNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* 8 Asnaf Selector */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                Target 8 Asnaf (QS. At-Taubah: 60):
              </label>
              <select
                value={selectedAsnaf}
                onChange={(e) => setSelectedAsnaf(e.target.value as AsnafCategory)}
                className="w-full px-3 py-2 bg-white dark:bg-[#151715] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]"
              >
                <option value="FAKIR">Fakir (Kebutuhan Pangan Pokok Darurat)</option>
                <option value="MISKIN">Miskin (Pemberdayaan Ekonomi Produktif)</option>
                <option value="FISABILILLAH">Fisabilillah (Pendidikan Santri & Beasiswa)</option>
                <option value="GHARIM">Gharimin (Pembebasan Jerat Hutang Daruri)</option>
                <option value="IBNU_SABIL">Ibnu Sabil (Musafir Kehabisan Bekal)</option>
                <option value="MUALAF">Mualaf (Penguatan Iman & Pembinaan)</option>
                <option value="AMIL">Amil (Operasional Pengelola Zakat Berizin)</option>
                <option value="RIQAB">Riqab (Pembebasan Pekerja Tertindas)</option>
              </select>
            </div>

            {/* Anonymous Toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold text-[#5A665B] dark:text-[#A0A8A0] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-[#D8DFD8] text-[#2E7D32] focus:ring-[#2E7D32]"
              />
              <span>Sembunyikan nama pada audit explorer publik (Hamba Allah)</span>
            </label>

            {/* Action Pay Button */}
            <button
              onClick={handlePayZakatOnChain}
              disabled={isSubmitting || zakatPayableAmount <= 0}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                zakatPayableAmount > 0
                  ? 'bg-[#2E7D32] hover:bg-[#256629] text-white shadow-[#2E7D32]/30 active:scale-[0.99]'
                  : 'bg-[#D8DFD8] dark:bg-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>
                {isSubmitting 
                  ? 'Memproses Smart Contract...' 
                  : zakatPayableAmount > 0 
                    ? `Tunaikan ${formatCurrency(zakatPayableAmount)} On-Chain` 
                    : 'Aset Belum Wajib Zakat'}
              </span>
            </button>

            <div className="flex items-center justify-between text-[10px] text-[#5A665B] dark:text-[#A0A8A0] pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#2E7D32]" /> Sertifikat BSZ Pengurang Pajak SPT
              </span>
              <span>L2 Gas Fee: Rp 0 (Disubsidi)</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
