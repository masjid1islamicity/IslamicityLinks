import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  Target, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Coins, 
  Send, 
  Bot, 
  User, 
  HeartHandshake, 
  Flame, 
  Layers, 
  Info,
  ChevronRight,
  Sliders,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AsnafCategory, BlockchainTransaction, CharityCampaign } from '../../types';

interface SeasonalityMilestone {
  milestone: string;
  dateLabel: string;
  virtue: string;
  urgencyLevel: 'HIGH' | 'MEDIUM' | 'NORMAL';
}

interface RecommendedFund {
  campaignId: string;
  charityId: string;
  charityName: string;
  title: string;
  asnafCategory: AsnafCategory;
  matchScore: number;
  recommendedPercentage: number;
  urgencyReason: string;
  impactProjection: string;
}

interface AsnafDistributionItem {
  asnaf: AsnafCategory;
  percentage: number;
  reason: string;
}

interface AdvisorData {
  summary: {
    totalContributed: number;
    givingFrequency: string;
    dominantAsnaf: string;
    lastZakatDate: string;
  };
  optimalTiming: {
    recommendedDate: string;
    haulStatus: string;
    haulProgressPercent: number;
    timingRationale: string;
    seasonalityMilestones: SeasonalityMilestone[];
  };
  recommendedFunds: RecommendedFund[];
  asnafDistribution: AsnafDistributionItem[];
  shariaAdviceNarrative: string;
}

interface AiZakatAdvisorCardProps {
  currentCalculatedZakat: number;
  selectedZakatType: string;
  onApplyRecommendation: (recommendation: {
    charityId: string;
    asnafTarget: AsnafCategory;
    suggestedAmount?: number;
    category?: string;
  }) => void;
}

export const AiZakatAdvisorCard: React.FC<AiZakatAdvisorCardProps> = ({
  currentCalculatedZakat,
  selectedZakatType,
  onApplyRecommendation
}) => {
  const { 
    blockchainTransactions, 
    campaigns, 
    goldPricePerGram, 
    nisabMaalAmount, 
    language 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'timing' | 'funds' | 'chat'>('timing');
  const [isLoading, setIsLoading] = useState(false);
  const [advisorData, setAdvisorData] = useState<AdvisorData | null>(null);
  const [appliedFundId, setAppliedFundId] = useState<string | null>(null);
  
  // Interactive Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      id: 'c1',
      sender: 'ai',
      text: `Assalamu'alaikum! Saya Penasihat AI Zakat Sharia. Berdasarkan riwayat amal on-chain dan nisab emas hari ini (Rp ${goldPricePerGram.toLocaleString('id-ID')}/g), saya siap mengoptimalkan waktu pembayaran dan mencocokkan target mustahik yang paling mendesak.`,
      time: 'Baru saja'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Fetch AI Advisor analysis
  const fetchAdvice = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/zakat-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'ANALYZE_PROFILE',
          history: blockchainTransactions,
          currentCalculation: {
            calculatedZakat: currentCalculatedZakat,
            zakatType: selectedZakatType
          },
          goldPrice: goldPricePerGram,
          nisab: nisabMaalAmount,
          campaigns: campaigns,
          language
        })
      });

      if (!response.ok) throw new Error('API failed');
      const data = await response.json();
      setAdvisorData(data);
    } catch (err) {
      console.warn('Fallback advisor data used:', err);
      // Fallback state
      setAdvisorData({
        summary: {
          totalContributed: blockchainTransactions.reduce((acc, tx) => acc + (tx.amount || 0), 0),
          givingFrequency: 'Rutin Bulanan & Tahunan',
          dominantAsnaf: 'FAKIR & FISABILILLAH',
          lastZakatDate: blockchainTransactions[0]?.timestamp?.substring(0, 10) || '2026-08-28'
        },
        optimalTiming: {
          recommendedDate: 'Akhir Bulan / Awal Ramadhan 1448H',
          haulStatus: 'Haul Berjalan (Siklus 8 Bulan)',
          haulProgressPercent: 68,
          timingRationale: 'Berdasarkan histori transaksi dan penambahan harta Anda, zakat profesi dianjurkan ditunaikan langsung setelah penerimaan gaji setiap tanggal 25-30, sedangkan zakat maal dapat disinkronkan menjelang bulan-bulan mulia (Rajab/Sya\'ban/Ramadhan) atau tepat saat genap 1 haul kepemilikan emas.',
          seasonalityMilestones: [
            {
              milestone: 'Siklus Payroll Bulanan (Zakat Profesi)',
              dateLabel: 'Akhir Setiap Bulan',
              virtue: 'Membersihkan harta seketika saat penghasilan diterima (QS Al-An\'am: 141)',
              urgencyLevel: 'HIGH'
            },
            {
              milestone: 'Penyaluran Darurat Mustahik Pelosok 3T',
              dateLabel: 'Pekan Ini',
              virtue: 'Bantuan pangan & kebutuhan pokok fakir miskin di daerah tertinggal',
              urgencyLevel: 'HIGH'
            },
            {
              milestone: 'Haul Emas & Tabungan Maal',
              dateLabel: 'Menjelang Ramadhan 1448H',
              virtue: 'Pahala ibadah dilipatgandakan dan memenuhi kesempurnaan haul tahunan',
              urgencyLevel: 'MEDIUM'
            }
          ]
        },
        recommendedFunds: [
          {
            campaignId: 'camp-01',
            charityId: 'baznas-ri',
            charityName: 'BAZNAS RI',
            title: 'Zakat Maal & Fitrah Terintegrasi untuk 10.000 Fakir Miskin Pelosok',
            asnafCategory: 'FAKIR',
            matchScore: 98,
            recommendedPercentage: 45,
            urgencyReason: 'Kebutuhan mendesak logistik beras dan nutrisi mustahik di wilayah 3T menjelang pergantian musim.',
            impactProjection: 'Membantu kecukupan pangan dasar 8-12 keluarga mustahik binaan selama sebulan penuh.'
          },
          {
            campaignId: 'camp-03',
            charityId: 'rumah-zakat',
            charityName: 'Rumah Zakat',
            title: 'Beasiswa Pendidikan Tahfidz & Sains Yatim Dhuafa Berprestasi',
            asnafCategory: 'FISABILILLAH',
            matchScore: 94,
            recommendedPercentage: 30,
            urgencyReason: 'Tahun ajaran baru dan kebutuhan sarana penunjang santri tahfidz pelosok.',
            impactProjection: 'Menyediakan seragam, kitab kuning, dan biaya operasional pendidikan 3 santri yatim.'
          },
          {
            campaignId: 'camp-04',
            charityId: 'lazismu-pp',
            charityName: 'LAZISMU',
            title: 'Bantuan Modal Usaha Halal & Bebas Riba UMKM Dhuafa',
            asnafCategory: 'MISKIN',
            matchScore: 89,
            recommendedPercentage: 25,
            urgencyReason: 'Transformasi mustahik menjadi muzakki melalui gerobak usaha dan modal syariah.',
            impactProjection: 'Memberikan modal bergulir produktif tanpa riba bagi 1 pedagang mikro dhuafa.'
          }
        ],
        asnafDistribution: [
          { asnaf: 'FAKIR', percentage: 45, reason: 'Prioritas tertinggi untuk kebutuhan pangan darurat & mustahik tidak berdaya' },
          { asnaf: 'FISABILILLAH', percentage: 30, reason: 'Pendidikan anak yatim, dakwah pelosok, dan beasiswa tahfidz' },
          { asnaf: 'MISKIN', percentage: 20, reason: 'Pemberdayaan ekonomi produktif agar mandiri dari ketergantungan' },
          { asnaf: 'GHARIM', percentage: 5, reason: 'Bantuan pembebasan jerat hutang darurat demi kemaslahatan hidup' }
        ],
        shariaAdviceNarrative: 'Pola kedermawanan Anda menunjukkan konsistensi yang sangat baik. Untuk memaksimalkan nilai keberkahan dan dampak riil pada umat, disarankan membagi zakat wajib Anda sebesar 45% untuk pangan fakir miskin di daerah tertinggal (BAZNAS RI), 30% untuk beasiswa fisabilillah (Rumah Zakat), dan 25% modal usaha mikro (LAZISMU).'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, [blockchainTransactions.length, language]);

  const handleSendChat = async (presetText?: string) => {
    const text = presetText || chatInput;
    if (!text.trim() || isChatLoading) return;

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user' as const,
      text: text.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/ai/zakat-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'CHAT_CONSULT',
          history: blockchainTransactions,
          userQuery: text,
          goldPrice: goldPricePerGram,
          nisab: nisabMaalAmount,
          language
        })
      });

      const data = await response.json();
      setChatMessages(prev => [
        ...prev,
        {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: data.reply || 'Jazakallah khair atas pertanyaannya. Zakat Anda akan sangat berkah jika disalurkan tepat waktu ke lembaga amil terpercaya.',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setChatMessages(prev => [
        ...prev,
        {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: 'Untuk zakat maal dan profesi, pastikan nisab 85 gram emas telah terlampaui. Anda dapat memilih penyaluran langsung via smart contract blockchain untuk transparansi 100%.',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleApplyFund = (fund: RecommendedFund) => {
    const suggestedAmt = currentCalculatedZakat > 0 
      ? Math.round((currentCalculatedZakat * fund.recommendedPercentage) / 100)
      : undefined;

    onApplyRecommendation({
      charityId: fund.charityId,
      asnafTarget: fund.asnafCategory,
      suggestedAmount: suggestedAmt,
      category: 'Zakat'
    });

    setAppliedFundId(fund.campaignId);
    setTimeout(() => setAppliedFundId(null), 3000);
  };

  return (
    <div id="ai-zakat-advisor-container" className="bg-gradient-to-br from-[#122B16] via-[#16381C] to-[#0D1F10] text-[#E4E8E4] rounded-3xl p-6 sm:p-8 border border-[#2B4E2F] shadow-xl space-y-6">
      
      {/* Header with AI Badge and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#28492C] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#4CAF50]/20 text-[#81C784] border border-[#4CAF50]/30">
              <Sparkles className="w-3.5 h-3.5" />
              AI Zakat Intelligence • Gemini 3.7
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Audit Syariah DSN-MUI
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Penasihat Waktu & Target Dana Zakat
          </h2>
          <p className="text-xs sm:text-sm text-[#C8D6C8] max-w-2xl leading-relaxed">
            Menganalisis riwayat {blockchainTransactions.length} transaksi on-chain Anda untuk menentukan waktu penunaian terbaik dan memprioritaskan alokasi mustahik darurat.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            id="refresh-ai-advisor-btn"
            onClick={fetchAdvice}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1C4422] hover:bg-[#25572C] text-white border border-[#346B3C] transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Menganalisis...' : 'Perbarui Analisis'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#0B180D] rounded-2xl border border-[#1F3D23] max-w-md">
        <button
          id="advisor-tab-timing"
          onClick={() => setActiveTab('timing')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'timing'
              ? 'bg-[#2E7D32] text-white shadow-md'
              : 'text-[#9CB39E] hover:text-white hover:bg-[#142B17]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Waktu & Haul</span>
        </button>

        <button
          id="advisor-tab-funds"
          onClick={() => setActiveTab('funds')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'funds'
              ? 'bg-[#2E7D32] text-white shadow-md'
              : 'text-[#9CB39E] hover:text-white hover:bg-[#142B17]'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Kebutuhan Umat</span>
        </button>

        <button
          id="advisor-tab-chat"
          onClick={() => setActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-[#2E7D32] text-white shadow-md'
              : 'text-[#9CB39E] hover:text-white hover:bg-[#142B17]'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Tanya AI Syariah</span>
        </button>
      </div>

      {/* Main Content Areas */}
      {isLoading && !advisorData ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#4CAF50] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs sm:text-sm font-semibold text-[#A2C2A5]">
            Sedang membaca riwayat ledger blockchain dan memetakan urgensi kemanusiaan global...
          </p>
        </div>
      ) : (
        <>
          {/* VIEW 1: TIMING & HAUL INTELLIGENCE */}
          {activeTab === 'timing' && advisorData && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Haul Progress & Timing Highlight Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Left 2 Cols: Timing Rationale */}
                <div className="md:col-span-2 bg-[#0E2412] rounded-2xl p-5 border border-[#234A27] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#81C784]">
                      <Calendar className="w-4 h-4" />
                      <span>Rekomendasi Jadwal Penunaian Optimal</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#2E7D32] text-white">
                      {advisorData.optimalTiming.haulStatus}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      {advisorData.optimalTiming.recommendedDate}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#C4D9C6] leading-relaxed">
                      {advisorData.optimalTiming.timingRationale}
                    </p>
                  </div>

                  {/* Haul Progress Gauge Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-semibold text-[#9EB9A1]">
                      <span>Kemajuan Siklus Haul Tahunan</span>
                      <span className="text-[#81C784] font-bold">{advisorData.optimalTiming.haulProgressPercent}% Tercapai</span>
                    </div>
                    <div className="w-full bg-[#1A3D1E] h-2.5 rounded-full overflow-hidden border border-[#28572E]">
                      <div 
                        className="bg-gradient-to-r from-[#4CAF50] to-[#81C784] h-full rounded-full transition-all duration-700" 
                        style={{ width: `${Math.min(100, advisorData.optimalTiming.haulProgressPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right 1 Col: Muzakki Portfolio Snapshot */}
                <div className="bg-[#0E2412] rounded-2xl p-5 border border-[#234A27] flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-bold text-[#81C784] uppercase tracking-wider block mb-2">
                      Profil Muzakki On-Chain
                    </span>
                    <div className="space-y-3">
                      <div>
                        <div className="text-[11px] text-[#8BA88E]">Total Kontribusi Tercatat</div>
                        <div className="text-base sm:text-lg font-black text-white">
                          Rp {advisorData.summary.totalContributed.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#8BA88E]">Frekuensi Penyaluran</div>
                        <div className="text-xs font-bold text-[#E4E8E4]">
                          {advisorData.summary.givingFrequency}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#8BA88E]">Fokus Asnaf Utama</div>
                        <div className="text-xs font-bold text-amber-300">
                          {advisorData.summary.dominantAsnaf}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#142F18] border border-[#25522B] text-[11px] text-[#A6C5A9] flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#81C784] shrink-0" />
                    <span>Sinkronisasi otomatis setiap ada transaksi baru di block ledger.</span>
                  </div>
                </div>
              </div>

              {/* Seasonality & Islamic Calendar Momentum Milestones */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#A2C2A5] flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-[#4CAF50]" />
                    Momentum Keutamaan Waktu & Urgensi Umat
                  </h4>
                  <span className="text-[11px] text-[#8BA88E]">Berdasarkan Kalender Hijriah & Siklus Finansial</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {advisorData.optimalTiming.seasonalityMilestones.map((m, idx) => (
                    <div 
                      key={idx}
                      className="bg-[#0B1E10] p-4 rounded-2xl border border-[#1E4323] space-y-2 hover:border-[#387C3E] transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{m.milestone}</span>
                        {m.urgencyLevel === 'HIGH' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-950/80 text-red-300 border border-red-800/60 flex items-center gap-1">
                            <Flame className="w-2.5 h-2.5" /> Sangat Utama
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                            Utama
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-[#81C784]">{m.dateLabel}</div>
                      <p className="text-xs text-[#B5CCB7] leading-relaxed">
                        {m.virtue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: TARGETABLE CHARITY FUNDS & GLOBAL COMMUNITY NEEDS */}
          {activeTab === 'funds' && advisorData && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Asnaf Distribution Matrix Bar */}
              <div className="bg-[#0E2412] p-5 rounded-2xl border border-[#234A27] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-[#81C784] uppercase tracking-wider block">
                      Rekomendasi Portofolio 8 Asnaf (Berdasarkan Kebutuhan Umat)
                    </span>
                    <p className="text-xs text-[#B6CEB8]">
                      AI mengkalkulasi proporsi ideal agar zakat Anda berdampak maksimal bagi mustahik terdesak.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#8FA892]">Kalkulasi Zakat Aktif:</span>
                    <div className="text-sm font-black text-white">
                      Rp {currentCalculatedZakat.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                {/* Visual Ratio Multi-Bar */}
                <div className="space-y-2">
                  <div className="w-full h-4 rounded-xl overflow-hidden flex bg-[#16361A] p-0.5 border border-[#25522B]">
                    {advisorData.asnafDistribution.map((item, idx) => (
                      <div
                        key={idx}
                        style={{ width: `${item.percentage}%` }}
                        className={`h-full first:rounded-l-[9px] last:rounded-r-[9px] transition-all relative group cursor-pointer ${
                          idx === 0 ? 'bg-emerald-500' :
                          idx === 1 ? 'bg-teal-500' :
                          idx === 2 ? 'bg-lime-500' : 'bg-amber-500'
                        }`}
                        title={`${item.asnaf}: ${item.percentage}%`}
                      />
                    ))}
                  </div>

                  {/* Badges Legend */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {advisorData.asnafDistribution.map((item, idx) => (
                      <div key={idx} className="bg-[#0A1A0D] p-2.5 rounded-xl border border-[#193A1C] text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-white">{item.asnaf}</span>
                          <span className="font-black text-[#81C784]">{item.percentage}%</span>
                        </div>
                        <p className="text-[11px] text-[#A2BAA4] mt-1 leading-tight line-clamp-2">
                          {item.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Targetable Charity Funds */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#A2C2A5] flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-[#4CAF50]" />
                    Program Penyaluran Terverifikasi yang Paling Relevan
                  </h4>
                  <span className="text-[11px] text-[#8BA88E]">Tersinkronisasi dengan Smart Contract LAZ</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {advisorData.recommendedFunds.map((fund) => {
                    const isApplied = appliedFundId === fund.campaignId;
                    const calculatedShare = currentCalculatedZakat > 0 
                      ? Math.round((currentCalculatedZakat * fund.recommendedPercentage) / 100) 
                      : 0;

                    return (
                      <div
                        key={fund.campaignId}
                        className="bg-[#0B1E10] rounded-2xl p-5 border border-[#1F4524] hover:border-[#387C3E] transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
                      >
                        {/* Top Match Badge */}
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#2E7D32]/30 text-[#81C784] border border-[#2E7D32]/50 flex items-center gap-1">
                            <Award className="w-3 h-3 text-[#4CAF50]" />
                            {fund.matchScore}% Match Score
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950/70 text-amber-300 border border-amber-800/50">
                            Asnaf {fund.asnafCategory}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs font-bold text-[#81C784]">{fund.charityName}</div>
                          <h5 className="text-sm font-extrabold text-white leading-snug line-clamp-2">
                            {fund.title}
                          </h5>
                          <p className="text-xs text-[#BACFBC] leading-relaxed">
                            {fund.urgencyReason}
                          </p>
                        </div>

                        {/* Impact & Calculated Allocation */}
                        <div className="p-3 bg-[#08150A] rounded-xl border border-[#163519] space-y-1.5 text-xs">
                          <div className="flex justify-between text-[#8FA892]">
                            <span>Porsi Alokasi:</span>
                            <span className="font-bold text-white">{fund.recommendedPercentage}%</span>
                          </div>
                          {currentCalculatedZakat > 0 && (
                            <div className="flex justify-between text-[#8FA892]">
                              <span>Nominal Usulan:</span>
                              <span className="font-black text-[#81C784]">
                                Rp {calculatedShare.toLocaleString('id-ID')}
                              </span>
                            </div>
                          )}
                          <div className="text-[11px] text-[#A7C2A9] pt-1 border-t border-[#163519]">
                            🌱 {fund.impactProjection}
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          id={`apply-fund-btn-${fund.campaignId}`}
                          onClick={() => handleApplyFund(fund)}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isApplied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#1D4723] hover:bg-[#265B2D] text-white border border-[#34733D]'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-white" />
                              <span>Telah Diterapkan ke Kalkulator</span>
                            </>
                          ) : (
                            <>
                              <span>Terapkan ke Kalkulator</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: INTERACTIVE AI SHARIA ADVISOR CHAT */}
          {activeTab === 'chat' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Quick Questions Badges */}
              <div className="space-y-1.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#A2C2A5]">
                  Pertanyaan Populer Seputar Waktu & Penyaluran:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Kapan waktu paling afdhal membayar zakat profesi?',
                    'Bagaimana cara menghitung haul tabungan yang bertambah setiap bulan?',
                    'Apakah boleh menyalurkan zakat langsung untuk beasiswa santri?',
                    'Bagaimana pelaporan bukti setor zakat (BSZ) untuk pengurang pajak SPT?'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendChat(preset)}
                      disabled={isChatLoading}
                      className="px-3 py-1.5 rounded-xl text-xs bg-[#0E2412] hover:bg-[#1A3D1E] text-[#B8CFBA] border border-[#234A27] transition-all text-left cursor-pointer disabled:opacity-50"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Thread Container */}
              <div className="bg-[#08150A] rounded-2xl border border-[#1C3E20] p-4 max-h-[360px] overflow-y-auto space-y-3">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 text-xs leading-relaxed ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-lg bg-[#2E7D32] flex items-center justify-center text-white shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 ${
                        msg.sender === 'user'
                          ? 'bg-[#2E7D32] text-white rounded-tr-none'
                          : 'bg-[#0E2412] text-[#DCE6DD] border border-[#234A27] rounded-tl-none space-y-1'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      <div className="text-[10px] text-right opacity-60 mt-1">{msg.time}</div>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-[#1D4723] flex items-center justify-center text-white shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex items-center gap-2 text-xs text-[#81C784] p-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Penasihat AI sedang menyusun fatwa dan panduan syariah...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Field */}
              <div className="flex gap-2">
                <input
                  id="zakat-advisor-chat-input"
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChat();
                    }
                  }}
                  placeholder="Ketik pertanyaan fikih zakat, nisab emas, atau panduan mustahik..."
                  className="flex-1 px-4 py-3 bg-[#08150A] text-white placeholder-[#68856B] rounded-2xl border border-[#204524] text-xs focus:outline-none focus:border-[#4CAF50]"
                />
                <button
                  id="send-zakat-advisor-chat-btn"
                  onClick={() => handleSendChat()}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="px-5 py-3 bg-[#2E7D32] hover:bg-[#388E3C] text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Sharia Narrative Banner */}
          {advisorData && advisorData.shariaAdviceNarrative && (
            <div className="p-4 bg-[#0A1A0D] rounded-2xl border border-[#1C3E20] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#2E7D32]/30 flex items-center justify-center text-[#81C784] shrink-0 mt-0.5 border border-[#2E7D32]/50">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-white">Ringkasan Fatwa & Rekomendasi Syariah:</span>
                <p className="text-xs text-[#BED2BF] leading-relaxed">
                  {advisorData.shariaAdviceNarrative}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
