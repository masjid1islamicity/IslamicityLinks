import React, { useState } from 'react';
import { 
  Repeat, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  HeartHandshake, 
  Sparkles, 
  Building, 
  CreditCard,
  QrCode,
  Info,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RecurringFrequency, CharityOrganization } from '../types';
import { OFFICIAL_CHARITIES } from '../data/mockData';
import confetti from 'canvas-confetti';

interface RecurringScheduleCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCharityId?: string;
}

export const RecurringScheduleCreateModal: React.FC<RecurringScheduleCreateModalProps> = ({
  isOpen,
  onClose,
  initialCharityId
}) => {
  const { campaigns, addRecurringSchedule, userProfile, setSelectedReceiptTx } = useApp();

  const [selectedCharityId, setSelectedCharityId] = useState<string>(initialCharityId || OFFICIAL_CHARITIES[0].id);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all');
  const [frequency, setFrequency] = useState<RecurringFrequency>('DAILY');
  const [amount, setAmount] = useState<number>(20000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [timingNote, setTimingNote] = useState<string>('Setiap Subuh (04:45 WIB)');
  const [paymentMethod, setPaymentMethod] = useState<'AUTO_DEBIT_BSI' | 'LYNK_WALLET' | 'QRIS_AUTOPAY' | 'MANDIRI_AUTODEBIT'>('AUTO_DEBIT_BSI');
  const [note, setNote] = useState<string>('Sedekah rutin istiqomah untuk keberkahan keluarga.');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentCharity = OFFICIAL_CHARITIES.find(c => c.id === selectedCharityId) || OFFICIAL_CHARITIES[0];
  const charityCampaigns = campaigns.filter(c => c.charityId === selectedCharityId);
  const finalAmount = customAmount ? Number(customAmount) : amount;

  const handleFrequencyChange = (freq: RecurringFrequency) => {
    setFrequency(freq);
    if (freq === 'DAILY') {
      setTimingNote('Setiap Subuh (04:45 WIB)');
      if (!customAmount) setAmount(15000);
    } else if (freq === 'WEEKLY') {
      setTimingNote('Setiap Hari Jumat (08:00 WIB)');
      if (!customAmount) setAmount(50000);
    } else {
      setTimingNote('Setiap Tanggal 25 (Autodebit Gaji 09:00 WIB)');
      if (!customAmount) setAmount(200000);
    }
  };

  const handleCreate = () => {
    if (finalAmount <= 0) return;
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        confetti({
          particleCount: 55,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2E7D32', '#4CAF50', '#81C784', '#FFD54F']
        });
      } catch {}

      const campaignObj = campaigns.find(c => c.id === selectedCampaignId);

      const nextDateStr = frequency === 'DAILY'
        ? 'Besok, 04:45 WIB'
        : frequency === 'WEEKLY'
        ? 'Jumat Depan, 08:00 WIB'
        : 'Tanggal 25 Bulan Depan, 09:00 WIB';

      addRecurringSchedule({
        charityId: currentCharity.id,
        charityName: currentCharity.name,
        campaignId: campaignObj ? campaignObj.id : undefined,
        campaignTitle: campaignObj ? campaignObj.title : 'Program Umum Kemaslahatan Umat & Dhuafa',
        amount: finalAmount,
        frequency,
        timingDetails: timingNote,
        paymentMethod,
        status: 'ACTIVE',
        nextExecutionDate: nextDateStr,
        isAnonymous,
        note,
        asnafCategory: campaignObj?.asnafCategory || 'FISABILILLAH',
      });

      setIsSubmitting(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4] my-auto space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D8DFD8] dark:border-[#2D332D]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center shadow-md">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#2E7D32] dark:text-[#4CAF50] tracking-wider block">
                Autodebit Syariah & Blockchain
              </span>
              <h3 className="font-extrabold text-base text-[#141A14] dark:text-[#E4E8E4]">
                Jadwalkan Sedekah & Infaq Otomatis
              </h3>
            </div>
          </div>

          <button
            id="btn-close-recurring-create-modal"
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Charity Selector */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4] block">
            Pilih Lembaga Amil Terdaftar:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {OFFICIAL_CHARITIES.map(c => (
              <button
                key={c.id}
                id={`btn-select-charity-${c.id}`}
                type="button"
                onClick={() => {
                  setSelectedCharityId(c.id);
                  setSelectedCampaignId('all');
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  selectedCharityId === c.id
                    ? 'bg-[#2E7D32]/10 border-[#2E7D32] text-[#2E7D32] dark:text-[#4CAF50] font-bold shadow-sm'
                    : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4]'
                }`}
              >
                <img
                  src={c.logo}
                  alt={c.name}
                  className="w-8 h-8 rounded-xl object-cover border border-[#D8DFD8] dark:border-[#2D332D] shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold truncate">{c.name}</h4>
                  <span className="text-[10px] opacity-75 block">{c.badge.replace('_', ' ')}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Specific Campaign Selection (Optional) */}
        {charityCampaigns.length > 0 && (
          <div className="space-y-1.5 text-xs">
            <label className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] block">
              Alokasi Program Khusus (Opsional):
            </label>
            <select
              id="select-recurring-campaign"
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-medium text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:border-[#2E7D32]"
            >
              <option value="all">Program Umum Lembaga (Zakat & Infaq Bebas)</option>
              {charityCampaigns.map(camp => (
                <option key={camp.id} value={camp.id}>
                  {camp.title} ({camp.category})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Frequency Tabs (Daily, Weekly, Monthly) */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4] block">
            Pilih Frekuensi Donasi Rutin:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'DAILY', label: 'Harian (Daily)', sub: 'Sedekah Subuh', icon: Clock },
              { id: 'WEEKLY', label: 'Mingguan (Weekly)', sub: 'Jumat Berkah', icon: Calendar },
              { id: 'MONTHLY', label: 'Bulanan (Monthly)', sub: 'Autodebit Gaji', icon: Repeat },
            ].map(tab => {
              const Icon = tab.icon;
              const isSel = frequency === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`btn-freq-${tab.id.toLowerCase()}`}
                  type="button"
                  onClick={() => handleFrequencyChange(tab.id as RecurringFrequency)}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                    isSel
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-md shadow-[#2E7D32]/25 scale-[1.02]'
                      : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] hover:bg-[#EEF3EE]/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSel ? 'text-white' : 'text-[#2E7D32] dark:text-[#4CAF50]'}`} />
                  <span className="text-xs font-extrabold">{tab.label}</span>
                  <span className={`text-[10px] ${isSel ? 'text-white/90' : 'text-[#5A665B] dark:text-[#A0A8A0]'}`}>
                    {tab.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timing Details / Custom Hour */}
        <div className="space-y-1.5 text-xs">
          <label className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] block">
            Waktu & Jadwal Eksekusi:
          </label>
          <input
            type="text"
            id="input-recurring-timing"
            value={timingNote}
            onChange={(e) => setTimingNote(e.target.value)}
            placeholder="Contoh: Setiap Subuh (04:45 WIB)"
            className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-medium text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:border-[#2E7D32]"
          />
        </div>

        {/* Amount Presets */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4] block">
            Nominal Donasi per {frequency === 'DAILY' ? 'Hari' : frequency === 'WEEKLY' ? 'Minggu' : 'Bulan'}:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(frequency === 'DAILY' 
              ? [5000, 10000, 15000, 25000, 50000, 100000]
              : frequency === 'WEEKLY'
              ? [20000, 50000, 100000, 150000, 250000, 500000]
              : [100000, 200000, 250000, 500000, 1000000, 2500000]
            ).map(amt => (
              <button
                key={amt}
                id={`btn-rec-amt-${amt}`}
                type="button"
                onClick={() => {
                  setAmount(amt);
                  setCustomAmount('');
                }}
                className={`py-2 px-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                  amount === amt && !customAmount
                    ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                    : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4]'
                }`}
              >
                Rp {amt.toLocaleString('id-ID')}
              </button>
            ))}
          </div>

          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5A665B] dark:text-[#A0A8A0] text-xs">
              Nominal Bebas: Rp
            </span>
            <input
              type="number"
              id="input-rec-custom-amt"
              placeholder="Contoh: 35000"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full pl-36 pr-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs font-mono font-bold text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:border-[#2E7D32]"
            />
          </div>
        </div>

        {/* Payment Channel Autodebit */}
        <div className="space-y-2 text-xs">
          <label className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] block">
            Metode Autodebit Syariah Terverifikasi:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'AUTO_DEBIT_BSI', label: 'BSI Autodebit Syariah', icon: CreditCard },
              { id: 'LYNK_WALLET', label: 'Lynk.id Wallet Auto-Pay', icon: Sparkles },
              { id: 'MANDIRI_AUTODEBIT', label: 'Mandiri Standing Instruction', icon: Building },
              { id: 'QRIS_AUTOPAY', label: 'QRIS Recurring Mandate', icon: QrCode },
            ].map(p => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  id={`btn-rec-pay-${p.id.toLowerCase()}`}
                  type="button"
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

        {/* Doa / Niat Note */}
        <div className="space-y-1 text-xs">
          <label className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] block">
            Catatan Niat / Doa:
          </label>
          <input
            type="text"
            id="input-rec-prayer-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:border-[#2E7D32]"
          />
        </div>

        {/* Anonymous toggle */}
        <label className="flex items-center gap-2 text-xs font-medium text-[#141A14] dark:text-[#E4E8E4] cursor-pointer">
          <input
            type="checkbox"
            id="check-rec-anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="rounded text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
          />
          <span>Donasikan sebagai <strong>Hamba Allah</strong> (Nama dirahasiakan di mutasi publik)</span>
        </label>

        {/* Information box */}
        <div className="p-3 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-[11px] text-[#5A665B] dark:text-[#A0A8A0] flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50] shrink-0 mt-0.5" />
          <span>
            Setiap pendebetan otomatis dicatat pada smart contract blockchain transparan dan Anda dapat menjeda (pause) atau membatalkan jadwal kapan pun tanpa denda.
          </span>
        </div>

        {/* Submit */}
        <button
          id="btn-submit-create-recurring-schedule"
          type="button"
          onClick={handleCreate}
          disabled={isSubmitting || finalAmount <= 0}
          className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs shadow-lg shadow-[#2E7D32]/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          <Repeat className="w-4 h-4" />
          <span>
            {isSubmitting
              ? 'Mendaftarkan Smart Contract...'
              : `Aktifkan Sedekah ${frequency === 'DAILY' ? 'Harian' : frequency === 'WEEKLY' ? 'Mingguan' : 'Bulanan'} (Rp ${finalAmount.toLocaleString('id-ID')})`
            }
          </span>
        </button>

      </div>
    </div>
  );
};
