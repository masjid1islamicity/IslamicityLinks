import React, { useState } from 'react';
import { 
  Calculator, 
  Coins, 
  ShieldCheck, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Boxes, 
  Filter, 
  Search, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AsnafCategory, BlockchainTransaction, AnnualFinancialData } from '../../types';
import { OFFICIAL_CHARITIES } from '../../data/mockData';
import { AiZakatAdvisorCard } from '../zakat/AiZakatAdvisorCard';
import { ZakatHistoricalContributionChart } from '../zakat/ZakatHistoricalContributionChart';
import { ScheduledZakatNotificationManager } from '../zakat/ScheduledZakatNotificationManager';
import { ZakatAiChatbot } from '../zakat/ZakatAiChatbot';
import { RealTimeZakatMaalCalculator } from '../zakat/RealTimeZakatMaalCalculator';

export const ZakatBlockchainTab: React.FC = () => {
  const { 
    blockchainTransactions, 
    blockchainBlocks, 
    goldPricePerGram, 
    nisabMaalAmount,
    addNewTransaction,
    setSelectedExplorerData,
    setSelectedReceiptTx,
    userProfile,
    isOffline,
    theme,
    t 
  } = useApp();

  // Zakat Calculator Type: 'MAAL' | 'PROFESI' | 'EMAS' | 'SAHAM'
  const [calcType, setCalcType] = useState<'MAAL' | 'PROFESI' | 'EMAS' | 'SAHAM'>('MAAL');
  
  // Zakat Maal Inputs
  const [maalCash, setMaalCash] = useState<number>(150000000);
  const [maalGoldValue, setMaalGoldValue] = useState<number>(20000000);
  const [maalTradeAsset, setMaalTradeAsset] = useState<number>(0);
  const [maalShortDebt, setMaalShortDebt] = useState<number>(10000000);

  // Zakat Profesi Inputs
  const [profesiSalary, setProfesiSalary] = useState<number>(12000000);
  const [profesiBonus, setProfesiBonus] = useState<number>(3000000);
  const [profesiExpense, setProfesiExpense] = useState<number>(5000000);

  // Zakat Emas Inputs
  const [goldWeightGrams, setGoldWeightGrams] = useState<number>(90);

  // Zakat Saham Inputs
  const [stockPortfolioValue, setStockPortfolioValue] = useState<number>(130000000);

  // Selected Charity & Asnaf Target
  const [selectedCharityId, setSelectedCharityId] = useState<string>('baznas-ri');
  const [selectedAsnaf, setSelectedAsnaf] = useState<AsnafCategory>('FAKIR');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Ledger Filter & Search
  const [ledgerFilter, setLedgerFilter] = useState<string>('ALL');
  const [ledgerSearch, setLedgerSearch] = useState<string>('');

  // Calculations
  let totalHarta = 0;
  let zakatAmount = 0;
  let meetsNisab = false;
  let nisabBenchmark = nisabMaalAmount;

  if (calcType === 'MAAL') {
    totalHarta = Math.max(0, (maalCash + maalGoldValue + maalTradeAsset) - maalShortDebt);
    meetsNisab = totalHarta >= nisabMaalAmount;
    zakatAmount = meetsNisab ? Math.round(totalHarta * 0.025) : 0;
  } else if (calcType === 'PROFESI') {
    const monthlyNet = Math.max(0, (profesiSalary + profesiBonus) - profesiExpense);
    const monthlyNisab = Math.round(nisabMaalAmount / 12);
    totalHarta = monthlyNet;
    nisabBenchmark = monthlyNisab;
    meetsNisab = monthlyNet >= monthlyNisab;
    zakatAmount = meetsNisab ? Math.round(monthlyNet * 0.025) : 0;
  } else if (calcType === 'EMAS') {
    totalHarta = goldWeightGrams * goldPricePerGram;
    meetsNisab = goldWeightGrams >= 85;
    zakatAmount = meetsNisab ? Math.round(totalHarta * 0.025) : 0;
  } else if (calcType === 'SAHAM') {
    totalHarta = stockPortfolioValue;
    meetsNisab = stockPortfolioValue >= nisabMaalAmount;
    zakatAmount = meetsNisab ? Math.round(stockPortfolioValue * 0.025) : 0;
  }

  const handlePayZakatOnChain = () => {
    if (zakatAmount <= 0) return;
    setIsSubmitting(true);

    const charity = OFFICIAL_CHARITIES.find(c => c.id === selectedCharityId) || OFFICIAL_CHARITIES[0];

    setTimeout(() => {
      const newTx = addNewTransaction({
        charityId: charity.id,
        charityName: charity.name,
        donorName: userProfile.name,
        amount: zakatAmount,
        type: `ZAKAT_${calcType}` as any,
        isAnonymous,
        smartContract: `0x71C8...ZAKAT_${calcType}_SMARTCONTRACT`,
        asnafTarget: selectedAsnaf,
        status: 'CONFIRMED',
      });

      setIsSubmitting(false);
      setSelectedReceiptTx(newTx);
    }, 800);
  };

  const filteredTxs = blockchainTransactions.filter(tx => {
    const matchFilter = ledgerFilter === 'ALL' || tx.type.includes(ledgerFilter) || tx.charityId === ledgerFilter;
    const matchSearch = 
      tx.txHash.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      tx.donorName.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      tx.charityName.toLowerCase().includes(ledgerSearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleApplyAiRecommendation = (rec: {
    charityId: string;
    asnafTarget: AsnafCategory;
    suggestedAmount?: number;
    category?: string;
  }) => {
    if (rec.charityId) {
      setSelectedCharityId(rec.charityId);
    }
    if (rec.asnafTarget) {
      setSelectedAsnaf(rec.asnafTarget);
    }
    const calcElement = document.getElementById('zakat-calculator-section');
    if (calcElement) {
      calcElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSyncAnnualFinancialData = (finData: AnnualFinancialData) => {
    setCalcType('MAAL');
    setMaalCash(finData.cashAndBank || 0);
    setMaalGoldValue(finData.goldAndSilverValue || 0);
    setMaalTradeAsset(finData.businessAssetsAndReceivables || 0);
    setMaalShortDebt(finData.shortTermDebts || 0);
    setStockPortfolioValue(finData.stocksAndMutualFunds || 0);
    if (finData.goldAndSilverValue && goldPricePerGram) {
      setGoldWeightGrams(Math.round(finData.goldAndSilverValue / goldPricePerGram));
    }
  };

  const handleApplyChatbotValues = (values: {
    calcType: 'MAAL' | 'PROFESI' | 'EMAS' | 'SAHAM';
    amount: number;
    asnafTarget?: AsnafCategory;
  }) => {
    setCalcType(values.calcType);
    if (values.calcType === 'MAAL') {
      setMaalCash(values.amount);
      setMaalGoldValue(0);
      setMaalTradeAsset(0);
      setMaalShortDebt(0);
    } else if (values.calcType === 'PROFESI') {
      setProfesiSalary(values.amount);
      setProfesiBonus(0);
      setProfesiExpense(0);
    } else if (values.calcType === 'EMAS') {
      if (goldPricePerGram) {
        setGoldWeightGrams(Math.round(values.amount / goldPricePerGram));
      }
    } else if (values.calcType === 'SAHAM') {
      setStockPortfolioValue(values.amount);
    }
    if (values.asnafTarget) {
      setSelectedAsnaf(values.asnafTarget);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1F3D22] via-[#172E19] to-[#121E13] rounded-3xl p-6 sm:p-8 text-[#E4E8E4] shadow-lg border border-[#2D332D] space-y-2">
        <div className="flex items-center gap-2 text-[#4CAF50] text-xs font-bold uppercase tracking-wider">
          <Boxes className="w-4 h-4" />
          <span>Infrastruktur Zakat L2 Immutable & Smart Contract</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Kalkulator & Manajemen Zakat Blockchain
        </h1>
        <p className="text-xs sm:text-sm text-[#E4E8E4]/90 max-w-3xl leading-relaxed">
          Hitung kewajiban zakat sesuai kaidah fikih 4 mazhab dan fatwa DSN-MUI, langsung tercatat pada buku besar terdesentralisasi yang dapat diaudit publik secara real-time.
        </p>
      </div>

      {/* FEATURED: Real-Time Zakat Al-Maal Calculator with Live Gold & Silver Asset API Conversion */}
      <RealTimeZakatMaalCalculator />

      {/* FEATURED: AI-Powered Conversational Chatbot (Eligibility, Local Currency Nisab, & 8 Asnaf Requirements) */}
      <ZakatAiChatbot 
        onApplyCalculatedValues={handleApplyChatbotValues}
      />

      {/* Scheduled Zakat Push Notification & Annual Financial Monitor */}
      <ScheduledZakatNotificationManager
        onSyncToCalculator={handleSyncAnnualFinancialData}
      />

      {/* AI-Powered Zakat Advisor (Historical Contribution & Global Needs Intelligence) */}
      <AiZakatAdvisorCard
        currentCalculatedZakat={zakatAmount}
        selectedZakatType={calcType}
        onApplyRecommendation={handleApplyAiRecommendation}
      />

      {/* 12-Month Historical Zakat Contribution Visualization Chart (Recharts) */}
      <ZakatHistoricalContributionChart
        transactions={blockchainTransactions}
        nisabMaalAmount={nisabMaalAmount}
        goldPricePerGram={goldPricePerGram}
        theme={theme}
      />

      {/* Main Grid: Calculator (Left 2 cols) & Blockchain Ledger Summary (Right 1 col) */}
      <div id="zakat-calculator-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Zakat Calculator & Payment Form */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 sm:p-8 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-6">
          
          {/* Calculator Category Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4] uppercase tracking-wider block">
              Pilih Jenis Zakat:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'MAAL', label: 'Zakat Maal (Harta)' },
                { id: 'PROFESI', label: 'Zakat Profesi (Gaji)' },
                { id: 'EMAS', label: 'Zakat Logam Mulia' },
                { id: 'SAHAM', label: 'Zakat Saham & Kripto' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCalcType(cat.id as any)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border ${
                    calcType === cat.id
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-md shadow-[#2E7D32]/20'
                      : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calculator Inputs based on Selected Category */}
          <div className="p-5 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-4">
            
            {/* ZAKAT MAAL */}
            {calcType === 'MAAL' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Tabungan / Rekening / Kas Tunai:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0]">Rp</span>
                    <input
                      type="number"
                      value={maalCash}
                      onChange={(e) => setMaalCash(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Nilai Emas / Simpanan Berharga:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0]">Rp</span>
                    <input
                      type="number"
                      value={maalGoldValue}
                      onChange={(e) => setMaalGoldValue(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Aset Bisnis / Dagang / Piutang Lancar:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0]">Rp</span>
                    <input
                      type="number"
                      value={maalTradeAsset}
                      onChange={(e) => setMaalTradeAsset(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Hutang Jangka Pendek (Jatuh Tempo):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0]">Rp</span>
                    <input
                      type="number"
                      value={maalShortDebt}
                      onChange={(e) => setMaalShortDebt(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ZAKAT PROFESI */}
            {calcType === 'PROFESI' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Gaji / Pendapatan Pokok (Bulan):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0]">Rp</span>
                    <input
                      type="number"
                      value={profesiSalary}
                      onChange={(e) => setProfesiSalary(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Bonus / Tunjangan / Lainnya:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0]">Rp</span>
                    <input
                      type="number"
                      value={profesiBonus}
                      onChange={(e) => setProfesiBonus(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Kebutuhan Pokok Bulanan (Daruri):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0]">Rp</span>
                    <input
                      type="number"
                      value={profesiExpense}
                      onChange={(e) => setProfesiExpense(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ZAKAT EMAS */}
            {calcType === 'EMAS' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Berat Emas Murni Tersimpan (Gram):
                  </label>
                  <input
                    type="number"
                    value={goldWeightGrams}
                    onChange={(e) => setGoldWeightGrams(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                  />
                  <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                    Nisab Emas wajib zakat adalah 85 Gram emas murni (tersimpan 1 haul/tahun).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Harga Acuan Emas Hari Ini:
                  </label>
                  <div className="px-3 py-2 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#2E7D32] dark:text-[#4CAF50] font-bold">
                    Rp {goldPricePerGram.toLocaleString('id-ID')} / gram
                  </div>
                </div>
              </div>
            )}

            {/* ZAKAT SAHAM */}
            {calcType === 'SAHAM' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Total Nilai Portofolio Saham Syariah / Reksadana:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0]">Rp</span>
                    <input
                      type="number"
                      value={stockPortfolioValue}
                      onChange={(e) => setStockPortfolioValue(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#2E7D32]/10 border border-[#2E7D32]/20 text-[11px] text-[#2E7D32] dark:text-[#4CAF50] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-[#2E7D32]" />
                  <span>Dihitung berdasarkan nilai pasar portofolio bersih pada saat tutup haul tahunan.</span>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Nisab Evaluation Result Card */}
          <div className={`p-5 rounded-2xl border transition-all ${
            meetsNisab 
              ? 'bg-[#2E7D32]/10 border-[#2E7D32]/30 text-[#2E7D32] dark:text-[#4CAF50]' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  {meetsNisab ? (
                    <CheckCircle2 className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  )}
                  <span className={`font-extrabold text-sm ${meetsNisab ? 'text-[#141A14] dark:text-[#E4E8E4]' : 'text-[#141A14] dark:text-[#E4E8E4]'}`}>
                    {meetsNisab ? 'Wajib Mengeluarkan Zakat (Melebihi Nisab)' : 'Belum Wajib Zakat (Dianjurkan Infaq/Sedekah)'}
                  </span>
                </div>
                <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] mt-1">
                  Nisab Acuan: <strong>Rp {nisabBenchmark.toLocaleString('id-ID')}</strong> | Total Harta Bersih Terhitung: <strong>Rp {totalHarta.toLocaleString('id-ID')}</strong>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] block">Kewajiban Zakat (2,5%):</span>
                <span className="text-xl font-black text-[#2E7D32] dark:text-[#4CAF50] font-mono">
                  Rp {zakatAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Allocation & Amil Selection */}
          <div className="space-y-4 pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Charity Selector */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Lembaga Amil Zakat Resmi:
                </label>
                <select
                  value={selectedCharityId}
                  onChange={(e) => setSelectedCharityId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-semibold text-[#141A14] dark:text-[#E4E8E4]"
                >
                  {OFFICIAL_CHARITIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.accountNumber})
                    </option>
                  ))}
                </select>
              </div>

              {/* 8 Asnaf Selector */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Prioritas Alokasi (8 Asnaf QS At-Taubah: 60):
                </label>
                <select
                  value={selectedAsnaf}
                  onChange={(e) => setSelectedAsnaf(e.target.value as AsnafCategory)}
                  className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-semibold text-[#141A14] dark:text-[#E4E8E4]"
                >
                  <option value="FAKIR">Fakir (Sangat Tidak Berdaya)</option>
                  <option value="MISKIN">Miskin (Kekurangan Kebutuhan)</option>
                  <option value="FISABILILLAH">Fisabilillah (Pejuang Dakwah & Pendidikan)</option>
                  <option value="GHARIM">Gharimin (Terlilit Hutang Demi Kemaslahatan)</option>
                  <option value="MUALAF">Mualaf (Pemberdayaan Akidah)</option>
                  <option value="IBNU_SABIL">Ibnu Sabil (Musafir Kehabisan Bekal)</option>
                  <option value="AMIL">Amil (Operasional Pengelola Resmi)</option>
                  <option value="RIQAB">Riqab (Pembebasan Perbudakan / Pekerja Terjebak)</option>
                </select>
              </div>
            </div>

            {/* Anonymous Toggle & Submit Button */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-[#141A14] dark:text-[#E4E8E4] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
                />
                <span>Hamba Allah (Privasi Donatur Terenkripsi E2EE)</span>
              </label>

              <button
                onClick={handlePayZakatOnChain}
                disabled={zakatAmount <= 0 || isSubmitting}
                className="px-6 py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] disabled:opacity-40 text-white font-extrabold text-xs shadow-lg shadow-[#2E7D32]/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Mencatat di Blockchain...' : 'Tunaikan Zakat & Terbitkan BSZ'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Blockchain Consensus & Node Statistics */}
        <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
            <h3 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
              Status Konsensus L2
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
              <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">BLOK TERBARU (HEIGHT)</span>
              <p className="text-lg font-black text-[#2E7D32] dark:text-[#4CAF50] font-mono">
                #{blockchainBlocks[0]?.blockNumber || 148293}
              </p>
              <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">Block Time: 3.2 detik (Instant Finality)</span>
            </div>

            <div className="p-3 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
              <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">VALIDATOR SYARIAH AKTIF</span>
              <p className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                BAZNAS RI, DSN-MUI, Dompet Dhuafa
              </p>
              <span className="text-[10px] text-[#2E7D32] dark:text-[#4CAF50] font-semibold">100% Syariah Proof-of-Authority</span>
            </div>

            <div className="p-3 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
              <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">KEKUATAN HUKUM PAJAK</span>
              <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] leading-snug">
                Sertifikat BSZ diterbitkan dengan QR Verifikasi Ditjen Pajak & Kemenag (UU RI No. 23/2011).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Public Blockchain Ledger Table */}
      <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 sm:p-8 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
              Buku Besar Zakat Transparan (Live Ledger Explorer)
            </h3>
            <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
              Setiap rupiah tercatat dengan cryptographic hash yang tidak dapat diubah (immutable).
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A665B] dark:text-[#A0A8A0]" />
              <input
                type="text"
                placeholder="Cari TxHash / Donatur..."
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none"
              />
            </div>

            <select
              value={ledgerFilter}
              onChange={(e) => setLedgerFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-semibold text-[#141A14] dark:text-[#E4E8E4]"
            >
              <option value="ALL">Semua Jenis Akad</option>
              <option value="ZAKAT">Zakat Saja</option>
              <option value="INFAQ">Infaq & Sedekah</option>
              <option value="WAKAF">Wakaf Produktif</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EEF3EE] dark:bg-[#242924] text-[#141A14] dark:text-[#E4E8E4] font-bold border-b border-[#D8DFD8] dark:border-[#2D332D]">
              <tr>
                <th className="p-3.5">TxHash & Blok</th>
                <th className="p-3.5">Muzakki / Donatur</th>
                <th className="p-3.5">Akad Syariah</th>
                <th className="p-3.5">Lembaga Amil</th>
                <th className="p-3.5">Nominal (Rp)</th>
                <th className="p-3.5 text-right">Sertifikat BSZ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8DFD8] dark:divide-[#2D332D] text-[#141A14] dark:text-[#E4E8E4]">
              {filteredTxs.map(tx => (
                <tr key={tx.id} className="hover:bg-[#EEF3EE]/60 dark:hover:bg-[#242924]/60 transition-colors">
                  <td className="p-3.5 font-mono">
                    <button
                      onClick={() => setSelectedExplorerData({ tx })}
                      className="text-[#2E7D32] dark:text-[#4CAF50] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>{tx.txHash.substring(0, 12)}...</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block mt-0.5">
                      Blok #{tx.blockNumber} • {new Date(tx.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  <td className="p-3.5 font-semibold">
                    {tx.isAnonymous ? (
                      <span className="text-[#5A665B] dark:text-[#A0A8A0] italic">Hamba Allah (E2EE)</span>
                    ) : (
                      tx.donorName
                    )}
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50]">
                      {tx.type.replace('_', ' ')}
                    </span>
                    {tx.asnafTarget && (
                      <span className="block text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                        Asnaf: {tx.asnafTarget}
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 font-medium">
                    {tx.charityName}
                  </td>

                  <td className="p-3.5 font-mono font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">
                    Rp {tx.amount.toLocaleString('id-ID')}
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedReceiptTx(tx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] hover:text-[#2E7D32] text-xs font-bold transition-colors border border-[#D8DFD8] dark:border-[#2D332D]"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>BSZ</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
