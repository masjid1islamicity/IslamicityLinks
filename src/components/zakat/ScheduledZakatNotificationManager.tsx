import React, { useState } from 'react';
import { 
  Bell, 
  BellRing, 
  BellOff, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Sparkles, 
  Sliders, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw, 
  Coins, 
  FileText, 
  Edit3, 
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  AnnualFinancialData, 
  HaulCycleType, 
  ZakatHaulReminderWindow, 
  ScheduledZakatNotificationSettings 
} from '../../types';
import { isBrowserNotificationSupported } from '../../utils/browserNotification';

interface ScheduledZakatNotificationManagerProps {
  onSyncToCalculator?: (data: AnnualFinancialData) => void;
}

export const ScheduledZakatNotificationManager: React.FC<ScheduledZakatNotificationManagerProps> = ({
  onSyncToCalculator
}) => {
  const { 
    scheduledZakatSettings, 
    updateScheduledZakatSettings, 
    updateAnnualFinancialData,
    browserNotificationPermission,
    requestNotificationPermission,
    triggerZakatHaulCheck,
    annualZakatSummary,
    nisabMaalAmount,
    goldPricePerGram,
    setActiveTab
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTestingNotification, setIsTestingNotification] = useState(false);
  const [testFeedbackMessage, setTestFeedbackMessage] = useState<string | null>(null);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Form states for editing
  const [formData, setFormData] = useState<AnnualFinancialData>(scheduledZakatSettings.financialData);
  const [formHaulDate, setFormHaulDate] = useState<string>(scheduledZakatSettings.haulDate);
  const [formHaulCycle, setFormHaulCycle] = useState<HaulCycleType>(scheduledZakatSettings.haulCycleType);
  const [formReminderWindow, setFormReminderWindow] = useState<ZakatHaulReminderWindow>(scheduledZakatSettings.reminderWindow);
  const [formNotificationTime, setFormNotificationTime] = useState<string>(scheduledZakatSettings.notificationTime);

  const isBrowserSupported = isBrowserNotificationSupported();

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    if (result === 'granted') {
      setTestFeedbackMessage('Izin notifikasi browser berhasil diberikan! Anda akan menerima peringatan otomatis saat haul tiba.');
    } else if (result === 'denied') {
      setTestFeedbackMessage('Izin notifikasi ditolak oleh browser. Anda dapat mengaktifkannya manual pada Pengaturan Situs browser.');
    }
  };

  const handleTestNotification = () => {
    setIsTestingNotification(true);
    setTestFeedbackMessage(null);

    setTimeout(() => {
      const res = triggerZakatHaulCheck(true); // Force send
      setIsTestingNotification(false);
      setTestFeedbackMessage(res.message);
    }, 400);
  };

  const handleOpenEditModal = () => {
    setFormData(scheduledZakatSettings.financialData);
    setFormHaulDate(scheduledZakatSettings.haulDate);
    setFormHaulCycle(scheduledZakatSettings.haulCycleType);
    setFormReminderWindow(scheduledZakatSettings.reminderWindow);
    setFormNotificationTime(scheduledZakatSettings.notificationTime);
    setIsEditModalOpen(true);
  };

  const handleSaveSettings = () => {
    updateScheduledZakatSettings({
      haulDate: formHaulDate,
      haulCycleType: formHaulCycle,
      reminderWindow: formReminderWindow,
      notificationTime: formNotificationTime,
      financialData: formData
    });
    setIsEditModalOpen(false);
    setTestFeedbackMessage('Data keuangan tahunan & jadwal pengingat berhasil diperbarui!');
  };

  const handleSyncToLiveCalculator = () => {
    if (onSyncToCalculator) {
      onSyncToCalculator(scheduledZakatSettings.financialData);
      setTestFeedbackMessage('Data keuangan tahunan berhasil disinkronkan ke Kalkulator Zakat di bawah!');
      
      const calcEl = document.getElementById('zakat-calculator-section');
      if (calcEl) {
        calcEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Helper labels
  const getCycleLabel = (cycle: HaulCycleType) => {
    switch (cycle) {
      case 'HIJRI_RAMADHAN': return 'Bulan Suci Ramadhan (15 Ramadhan)';
      case 'HIJRI_MUHARRAM': return 'Awal Tahun Hijriah (1 Muharram)';
      case 'END_OF_YEAR': return 'Tutup Buku Akhir Tahun (31 Desember)';
      case 'GREGORIAN': return 'Kustom Kalender Masehi';
    }
  };

  const getReminderWindowLabel = (win: ZakatHaulReminderWindow) => {
    switch (win) {
      case 'ON_HAUL': return 'Tepat Pada Hari Haul (H-0)';
      case '7_DAYS_BEFORE': return '7 Hari Sebelum Haul (H-7)';
      case '14_DAYS_BEFORE': return '14 Hari Sebelum Haul (H-14)';
      case '30_DAYS_BEFORE': return '1 Bulan / 30 Hari Sebelum Haul (H-30)';
      case 'QUARTERLY': return 'Evaluasi Kuartalan (Setiap 3 Bulan)';
    }
  };

  return (
    <div id="scheduled-zakat-monitor-card" className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 sm:p-8 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-6">
      
      {/* Header: Title & Push Notification Permission State */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8DFD8] dark:border-[#2D332D]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#2E7D32]/10 dark:bg-[#2E7D32]/20 text-[#2E7D32] dark:text-[#4CAF50]">
              <BellRing className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                  Pengingat Haul & Push Notification Browser
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] border border-[#2E7D32]/30">
                  Web Push API
                </span>
              </div>
              <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                Otomatisasi kalkulasi zakat tahunan berbasis portofolio finansial & pengingat notifikasi browser native.
              </p>
            </div>
          </div>
        </div>

        {/* Browser Permission Pill & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {!isBrowserSupported ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center gap-1.5">
              <BellOff className="w-3.5 h-3.5" />
              <span>Browser Tidak Mendukung Push</span>
            </span>
          ) : browserNotificationPermission === 'granted' ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] border border-[#2E7D32]/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span>Browser Push Aktif</span>
            </span>
          ) : browserNotificationPermission === 'denied' ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>Notifikasi Diblokir</span>
            </span>
          ) : (
            <button
              onClick={handleRequestPermission}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Bell className="w-3.5 h-3.5 animate-bounce" />
              <span>Aktifkan Notifikasi Browser</span>
            </button>
          )}

          <button
            onClick={handleOpenEditModal}
            className="p-2 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] text-[#141A14] dark:text-[#E4E8E4] border border-[#D8DFD8] dark:border-[#2D332D] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] transition-colors"
            title="Ubah Data Keuangan Tahunan & Jadwal Haul"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Status & Financial Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Metric 1: Net Zakatable Wealth */}
        <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <div className="flex items-center justify-between text-[#5A665B] dark:text-[#A0A8A0] text-xs">
            <span className="font-semibold">Total Aset Bersih Tahunan</span>
            <DollarSign className="w-3.5 h-3.5 text-[#2E7D32]" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-[#141A14] dark:text-[#E4E8E4] font-mono">
            Rp {annualZakatSummary.netZakatableWealth.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">
            Bruto: Rp {annualZakatSummary.grossWealth.toLocaleString('id-ID')} - Hutang
          </span>
        </div>

        {/* Metric 2: Nisab Benchmark */}
        <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <div className="flex items-center justify-between text-[#5A665B] dark:text-[#A0A8A0] text-xs">
            <span className="font-semibold">Nisab Acuan (85g Emas)</span>
            <Coins className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-[#141A14] dark:text-[#E4E8E4] font-mono">
            Rp {nisabMaalAmount.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">
            @ Rp {goldPricePerGram.toLocaleString('id-ID')}/gram
          </span>
        </div>

        {/* Metric 3: Estimated Zakat Obligation */}
        <div className="p-4 rounded-2xl bg-[#2E7D32]/10 dark:bg-[#2E7D32]/15 border border-[#2E7D32]/30 space-y-1">
          <div className="flex items-center justify-between text-[#2E7D32] dark:text-[#4CAF50] text-xs font-semibold">
            <span>Estimasi Zakat (2,5%)</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <p className="text-lg sm:text-xl font-black text-[#2E7D32] dark:text-[#4CAF50] font-mono">
            Rp {annualZakatSummary.estimatedZakatPayable.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-[#2E7D32]/80 dark:text-[#4CAF50]/80 block font-semibold">
            {annualZakatSummary.meetsNisab ? 'Wajib Dikeluarkan saat Haul' : 'Belum Wajib Zakat'}
          </span>
        </div>

        {/* Metric 4: Haul Countdown */}
        <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
          <div className="flex items-center justify-between text-[#5A665B] dark:text-[#A0A8A0] text-xs">
            <span className="font-semibold">Target Haul Jatuh Tempo</span>
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-lg sm:text-xl font-extrabold text-[#141A14] dark:text-[#E4E8E4] font-mono">
              {annualZakatSummary.daysUntilHaul <= 0 ? 'Hari H (Jatuh Tempo)' : `${annualZakatSummary.daysUntilHaul} Hari`}
            </p>
          </div>
          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">
            {scheduledZakatSettings.haulDate} ({scheduledZakatSettings.notificationTime} WIB)
          </span>
        </div>
      </div>

      {/* Nisab Progress Bar & Status Visualizer */}
      <div className="p-5 rounded-2xl bg-[#EEF3EE]/60 dark:bg-[#242924]/60 border border-[#D8DFD8] dark:border-[#2D332D] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
              Rasio Kekayaan Bersih terhadap Nisab:
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] text-[#2E7D32] dark:text-[#4CAF50]">
              {annualZakatSummary.nisabCoveragePercentage}%
            </span>
          </div>
          <div className="text-[#5A665B] dark:text-[#A0A8A0] text-[11px]">
            Ambang Wajib Zakat: 100% (Rp {nisabMaalAmount.toLocaleString('id-ID')})
          </div>
        </div>

        {/* Bar */}
        <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, annualZakatSummary.nisabCoveragePercentage)}%` }}
          />
        </div>

        {/* Dynamic Contextual Guidance Note */}
        <div className="flex items-start gap-2 text-xs pt-1">
          <Info className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
          <p className="text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed">
            {annualZakatSummary.recommendationNote}
          </p>
        </div>
      </div>

      {/* Quick Interactive Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Test Push Notification Button */}
          <button
            onClick={handleTestNotification}
            disabled={isTestingNotification}
            className="px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold shadow-sm shadow-[#2E7D32]/20 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
          >
            <Bell className={`w-3.5 h-3.5 ${isTestingNotification ? 'animate-spin' : ''}`} />
            <span>{isTestingNotification ? 'Mengirim Peringatan...' : 'Uji Notifikasi Browser Sekarang'}</span>
          </button>

          {/* Sync to Calculator */}
          {onSyncToCalculator && (
            <button
              onClick={handleSyncToLiveCalculator}
              className="px-4 py-2.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Sinkronkan ke Kalkulator Bawah</span>
            </button>
          )}

          {/* Toggle Detailed Breakdown Accordion */}
          <button
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4] flex items-center gap-1 transition-colors"
          >
            <span>{isDetailsExpanded ? 'Sembunyikan Rincian Aset' : 'Lihat Rincian Data Finansial'}</span>
            {isDetailsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Schedule Timing Badge */}
        <div className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>Pengingat: <strong>{getReminderWindowLabel(scheduledZakatSettings.reminderWindow)}</strong></span>
        </div>
      </div>

      {/* Notification Feedback Toast */}
      {testFeedbackMessage && (
        <div className="p-3.5 rounded-xl bg-[#2E7D32]/10 border border-[#2E7D32]/30 text-xs text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2E7D32]" />
            <span>{testFeedbackMessage}</span>
          </div>
          <button
            onClick={() => setTestFeedbackMessage(null)}
            className="text-[#2E7D32] hover:opacity-70 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Expandable Financial Asset Breakdown */}
      {isDetailsExpanded && (
        <div className="p-5 rounded-2xl bg-[#EEF3EE]/40 dark:bg-[#242924]/40 border border-[#D8DFD8] dark:border-[#2D332D] space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#D8DFD8] dark:border-[#2D332D]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#141A14] dark:text-[#E4E8E4]">
              Rincian Portofolio Keuangan Tahunan (Basis Perhitungan Zakat)
            </h4>
            <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
              Terakhir diperbarui: {scheduledZakatSettings.financialData.lastUpdated}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D]">
              <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">Tabungan / Kas Bank:</span>
              <span className="font-mono font-bold text-[#141A14] dark:text-[#E4E8E4]">
                Rp {scheduledZakatSettings.financialData.cashAndBank.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D]">
              <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">Emas & Logam Mulia:</span>
              <span className="font-mono font-bold text-[#141A14] dark:text-[#E4E8E4]">
                Rp {scheduledZakatSettings.financialData.goldAndSilverValue.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D]">
              <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">Saham & Reksadana:</span>
              <span className="font-mono font-bold text-[#141A14] dark:text-[#E4E8E4]">
                Rp {scheduledZakatSettings.financialData.stocksAndMutualFunds.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D]">
              <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">Aset Bisnis & Piutang:</span>
              <span className="font-mono font-bold text-[#141A14] dark:text-[#E4E8E4]">
                Rp {scheduledZakatSettings.financialData.businessAssetsAndReceivables.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D]">
              <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">Pendapatan Tahunan:</span>
              <span className="font-mono font-bold text-[#141A14] dark:text-[#E4E8E4]">
                Rp {scheduledZakatSettings.financialData.annualIncome.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D]">
              <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">Pengeluaran Tahunan:</span>
              <span className="font-mono font-bold text-[#141A14] dark:text-[#E4E8E4]">
                Rp {scheduledZakatSettings.financialData.annualExpenses.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D]">
              <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block text-rose-500">Hutang Jangka Pendek:</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                - Rp {scheduledZakatSettings.financialData.shortTermDebts.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D]">
              <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">Siklus Haul:</span>
              <span className="font-bold text-[#2E7D32] dark:text-[#4CAF50] truncate block">
                {getCycleLabel(scheduledZakatSettings.haulCycleType)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL DIALOG */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#D8DFD8] dark:border-[#2D332D]">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32]">
                  <Sliders className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                    Konfigurasi Jadwal Haul & Data Finansial
                  </h3>
                  <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                    Perbarui portofolio aset tahunan Anda untuk akurasi perhitungan otomatis.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0]"
              >
                ✕
              </button>
            </div>

            {/* Form Sections */}
            <div className="space-y-5">
              
              {/* Section 1: Haul Schedule Configuration */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#EEF3EE]/50 dark:bg-[#242924]/50 border border-[#D8DFD8] dark:border-[#2D332D]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] dark:text-[#4CAF50] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Jadwal & Preferensi Notifikasi Haul</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#141A14] dark:text-[#E4E8E4]">
                      Tanggal Jatuh Tempo Haul (Tahunan):
                    </label>
                    <input
                      type="date"
                      value={formHaulDate}
                      onChange={(e) => setFormHaulDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-medium text-[#141A14] dark:text-[#E4E8E4]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#141A14] dark:text-[#E4E8E4]">
                      Siklus / Patokan Kalender:
                    </label>
                    <select
                      value={formHaulCycle}
                      onChange={(e) => setFormHaulCycle(e.target.value as HaulCycleType)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-medium text-[#141A14] dark:text-[#E4E8E4]"
                    >
                      <option value="HIJRI_RAMADHAN">Bulan Suci Ramadhan</option>
                      <option value="HIJRI_MUHARRAM">Awal Tahun Hijriah (1 Muharram)</option>
                      <option value="END_OF_YEAR">Tutup Buku Masehi (31 Desember)</option>
                      <option value="GREGORIAN">Kustom Tanggal Masehi</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#141A14] dark:text-[#E4E8E4]">
                      Waktu Pengiriman Notifikasi:
                    </label>
                    <input
                      type="time"
                      value={formNotificationTime}
                      onChange={(e) => setFormNotificationTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-medium text-[#141A14] dark:text-[#E4E8E4]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#141A14] dark:text-[#E4E8E4]">
                      Kapan Peringatan Dikirim:
                    </label>
                    <select
                      value={formReminderWindow}
                      onChange={(e) => setFormReminderWindow(e.target.value as ZakatHaulReminderWindow)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-medium text-[#141A14] dark:text-[#E4E8E4]"
                    >
                      <option value="ON_HAUL">Tepat pada Hari Haul (H-0)</option>
                      <option value="7_DAYS_BEFORE">7 Hari Sebelum Haul (H-7)</option>
                      <option value="14_DAYS_BEFORE">14 Hari Sebelum Haul (H-14)</option>
                      <option value="30_DAYS_BEFORE">30 Hari / 1 Bulan Sebelum Haul (H-30)</option>
                      <option value="QUARTERLY">Setiap Kuartal (3 Bulan Sekali)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Annual Financial Assets Inputs */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#141A14] dark:text-[#E4E8E4]">
                  Nilai Aset Finansial Tahunan (Rupiah):
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-medium text-[#141A14] dark:text-[#E4E8E4]">
                      1. Tabungan, Deposito, Kas Giro:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0]">Rp</span>
                      <input
                        type="number"
                        value={formData.cashAndBank}
                        onChange={(e) => setFormData({ ...formData, cashAndBank: Number(e.target.value) })}
                        className="w-full pl-10 pr-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-[#141A14] dark:text-[#E4E8E4]">
                      2. Nilai Emas, Perak & Logam Mulia:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0]">Rp</span>
                      <input
                        type="number"
                        value={formData.goldAndSilverValue}
                        onChange={(e) => setFormData({ ...formData, goldAndSilverValue: Number(e.target.value) })}
                        className="w-full pl-10 pr-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-[#141A14] dark:text-[#E4E8E4]">
                      3. Portofolio Saham & Reksadana:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0]">Rp</span>
                      <input
                        type="number"
                        value={formData.stocksAndMutualFunds}
                        onChange={(e) => setFormData({ ...formData, stocksAndMutualFunds: Number(e.target.value) })}
                        className="w-full pl-10 pr-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-[#141A14] dark:text-[#E4E8E4]">
                      4. Aset Bisnis & Piutang Lancar:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0]">Rp</span>
                      <input
                        type="number"
                        value={formData.businessAssetsAndReceivables}
                        onChange={(e) => setFormData({ ...formData, businessAssetsAndReceivables: Number(e.target.value) })}
                        className="w-full pl-10 pr-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-[#141A14] dark:text-[#E4E8E4]">
                      5. Pendapatan & Bonus Tahunan:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0]">Rp</span>
                      <input
                        type="number"
                        value={formData.annualIncome}
                        onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                        className="w-full pl-10 pr-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-[#141A14] dark:text-[#E4E8E4]">
                      6. Hutang Jangka Pendek (Pengurang):
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-rose-500">Rp</span>
                      <input
                        type="number"
                        value={formData.shortTermDebts}
                        onChange={(e) => setFormData({ ...formData, shortTermDebts: Number(e.target.value) })}
                        className="w-full pl-10 pr-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D8DFD8] dark:border-[#2D332D]">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]"
              >
                Batal
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-extrabold shadow-md shadow-[#2E7D32]/20 transition-all hover:scale-105"
              >
                Simpan & Perbarui Jadwal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
