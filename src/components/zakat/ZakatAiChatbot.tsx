import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Coins, 
  Calculator, 
  ShieldCheck, 
  RefreshCw, 
  Copy, 
  Check, 
  Globe, 
  FileText, 
  ArrowRight, 
  HeartHandshake, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Trash2,
  Download,
  Info,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AsnafCategory } from '../../types';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  goldPricePerGram: number; // in that currency
  nisab85g: number;
  rateToIdr: number;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  IDR: {
    code: 'IDR',
    symbol: 'Rp',
    name: 'Rupiah Indonesia',
    flag: '🇮🇩',
    goldPricePerGram: 1450000,
    nisab85g: 123250000,
    rateToIdr: 1,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    goldPricePerGram: 85,
    nisab85g: 7225,
    rateToIdr: 16200,
  },
  MYR: {
    code: 'MYR',
    symbol: 'RM',
    name: 'Malaysian Ringgit',
    flag: '🇲🇾',
    goldPricePerGram: 390,
    nisab85g: 33150,
    rateToIdr: 3650,
  },
  SAR: {
    code: 'SAR',
    symbol: 'SAR',
    name: 'Saudi Riyal',
    flag: '🇸🇦',
    goldPricePerGram: 320,
    nisab85g: 27200,
    rateToIdr: 4320,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    goldPricePerGram: 78,
    nisab85g: 6630,
    rateToIdr: 17600,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    flag: '🇸🇬',
    goldPricePerGram: 114,
    nisab85g: 9690,
    rateToIdr: 12200,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    goldPricePerGram: 68,
    nisab85g: 5780,
    rateToIdr: 20800,
  }
};

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  topic?: 'ELIGIBILITY' | 'NISAB' | 'CHARITY_FUNDS' | 'GENERAL';
  suggestedAction?: {
    type: 'CALCULATE' | 'SELECT_ASNAF' | 'EXPLORE_LEDGER';
    label: string;
    payload?: any;
  };
}

interface ZakatAiChatbotProps {
  onApplyCalculatedValues?: (values: {
    calcType: 'MAAL' | 'PROFESI' | 'EMAS' | 'SAHAM';
    amount: number;
    asnafTarget?: AsnafCategory;
  }) => void;
}

export const ZakatAiChatbot: React.FC<ZakatAiChatbotProps> = ({ onApplyCalculatedValues }) => {
  const { goldPricePerGram: appGoldPrice, nisabMaalAmount: appNisab, userProfile, language } = useApp();

  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('IDR');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'ALL' | 'ELIGIBILITY' | 'NISAB' | 'FUNDS'>('ALL');
  
  // Interactive Quick Calculator Mini-Tool
  const [showQuickChecker, setShowQuickChecker] = useState<boolean>(false);
  const [quickAssetAmount, setQuickAssetAmount] = useState<number>(150000000);
  const [quickAssetType, setQuickAssetType] = useState<'MAAL' | 'PROFESI'>('MAAL');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const currentCurrency = SUPPORTED_CURRENCIES[selectedCurrencyCode] || SUPPORTED_CURRENCIES.IDR;

  // Initialize with comprehensive introductory Sharia AI guidance
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: ChatMessage = {
        id: 'msg-welcome',
        sender: 'assistant',
        content: `Assalamu'alaikum **${userProfile?.name || 'Sahabat Muzakki'}**! 👋

Saya adalah **AI Sharia & Zakat Scholar Bot** IslamicityLink. Saya siap membantu Anda secara interaktif mengenai:

1. ⚖️ **Kelayakan Zakat (Eligibility)**: Analisis apakah harta, tabungan, aset bisnis, emas, saham, kripto, atau gaji Anda telah wajib dizakati.
2. 🪙 **Kaidah Nisab Mata Uang Lokal (${currentCurrency.code})**: Aturan nisab 85g emas (${currentCurrency.symbol}${currentCurrency.nisab85g.toLocaleString('id-ID')}) dan zakat pertanian (5 wasaq).
3. 🏛️ **Ketentuan Khusus 8 Asnaf & Dana Amal**: Syarat penerima mustahik (QS. At-Taubah: 60), alokasi darurat kemanusiaan, wakaf produktif, serta klaim pengurangan pajak SPT dengan Bukti Setor Zakat (BSZ) on-chain.

*Silakan ketik pertanyaan Anda atau klik topik rekomendasi di bawah ini.*`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        topic: 'GENERAL'
      };
      setMessages([initialMessage]);
    }
  }, [userProfile, currentCurrency.code]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Preset Prompts categorized
  const PRESET_TOPICS = [
    {
      category: 'ELIGIBILITY',
      label: 'Cek Kelayakan Zakat Saya',
      icon: Scale,
      query: `Bagaimana cara mengetahui apakah saya sudah tergolong muzakki yang wajib zakat harta (maal) dan zakat profesi? Apa saja syarat mutlak kepemilikan harta dan pengurangannya?`
    },
    {
      category: 'NISAB',
      label: `Aturan Nisab ${currentCurrency.code}`,
      icon: Coins,
      query: `Jelaskan secara lengkap aturan nisab zakat emas, perak, dan mata uang ${currentCurrency.code} (${currentCurrency.name}). Berapa ambang batas minimum dan cara perhitungannya?`
    },
    {
      category: 'FUNDS',
      label: 'Syarat 8 Asnaf & Dana Kemanusiaan',
      icon: HeartHandshake,
      query: `Sebutkan kriteria syariah 8 golongan asnaf penerima zakat menurut QS At-Taubah ayat 60. Apakah dana zakat boleh disalurkan untuk bantuan darurat kemanusiaan (seperti Gaza) atau beasiswa?`
    },
    {
      category: 'ELIGIBILITY',
      label: 'Hukum Zakat Saham & Kripto',
      icon: Sparkles,
      query: `Bagaimana ketentuan fikih dan perhitungan zakat untuk portofolio saham syariah, reksadana, dan aset kripto (cryptocurrency)? Kapan haulnya dihitung?`
    },
    {
      category: 'FUNDS',
      label: 'Bukti Setor Zakat & Pajak SPT',
      icon: FileText,
      query: `Bagaimana mekanisme Bukti Setor Zakat (BSZ) resmi ber-QR blockchain di platform ini dapat digunakan sebagai pengurang Penghasilan Kena Pajak (PKP) pada SPT Tahunan sesuai UU No. 23/2011?`
    },
    {
      category: 'NISAB',
      label: 'Zakat Pertanian (5 Wasaq)',
      icon: Calculator,
      query: `Berapa nisab zakat pertanian dan perkebunan? Bagaimana perbedaan kadar zakat 5% (dengan irigasi/biaya) vs 10% (tadah hujan)?`
    }
  ];

  const handleSendMessage = async (customQuery?: string) => {
    const queryToSend = (customQuery || inputQuery).trim();
    if (!queryToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: queryToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/zakat-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
          currency: currentCurrency.code,
          goldPrice: currentCurrency.goldPricePerGram,
          nisab: currentCurrency.nisab85g,
          language: language || 'id',
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi AI Server');
      }

      const data = await response.json();
      const botReply = data.reply || 'Mohon maaf, tidak ada respon dari sistem.';

      const botMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: botReply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        topic: queryToSend.toLowerCase().includes('nisab') ? 'NISAB' : queryToSend.toLowerCase().includes('asnaf') ? 'CHARITY_FUNDS' : 'ELIGIBILITY'
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('Fallback to local intelligent Sharia generation:', err);
      // Construct rich local response
      let localFallback = '';
      const lower = queryToSend.toLowerCase();

      if (lower.includes('nisab') || lower.includes('emas') || lower.includes('kurs')) {
        localFallback = `### 🪙 Kaidah Nisab Berdasarkan Mata Uang ${currentCurrency.code} (${currentCurrency.flag} ${currentCurrency.name})

1. **Patokan Utama Fikih Emas**: Setara dengan **85 gram emas murni 24 karat** (*Jumhur Ulama & DSN-MUI*).
2. **Harga Acuan Emas Terkini**: **${currentCurrency.symbol}${currentCurrency.goldPricePerGram.toLocaleString('id-ID')}/gram**.
3. **Ambang Batas Nisab Tahunan**: **${currentCurrency.symbol}${currentCurrency.nisab85g.toLocaleString('id-ID')}**.
4. **Nisab Bulanan (Zakat Profesi)**: **${currentCurrency.symbol}${Math.round(currentCurrency.nisab85g / 12).toLocaleString('id-ID')}/bulan**.
5. **Kadar Wajib Zakat**: **2.5% (seperempat puluh)** dari total harta setelah dikurangi kebutuhan pokok dan hutang jatuh tempo.

*Contoh Perhitungan:* Jika simpanan bersih Anda sebesar ${currentCurrency.symbol}${(currentCurrency.nisab85g * 1.2).toLocaleString('id-ID')}, maka zakat yang wajib dikeluarkan adalah **${currentCurrency.symbol}${Math.round(currentCurrency.nisab85g * 1.2 * 0.025).toLocaleString('id-ID')}**.`;
      } else if (lower.includes('asnaf') || lower.includes('syarat') || lower.includes('gaza') || lower.includes('dana')) {
        localFallback = `### 🤝 Ketentuan Syariah Penyaluran Dana Zakat (8 Asnaf QS At-Taubah: 60)

Dana Zakat memiliki ketentuan khusus yang **wajib disalurkan hanya kepada 8 asnaf**:
1. **Fakir**: Tidak memiliki harta/penghasilan atau kurang dari 50% kebutuhan pokok.
2. **Miskin**: Memiliki penghasilan namun hanya mencukupi 50%-80% kebutuhan pokok.
3. **Amil**: Pengelola resmi berizin yang menghimpun dan mendistribusikan zakat.
4. **Mualaf**: Orang yang baru masuk Islam untuk penguatan iman dan sosial ekonomi.
5. **Riqab**: Pembebasan perbudakan modern / buruh migran yang tertindas.
6. **Gharimin**: Orang yang berhutang untuk kemaslahatan umum atau kebutuhan darurat hidup.
7. **Fisabilillah**: Pejuang kemanusiaan, dakwah, beasiswa pendidikan santri, dan bantuan darurat (misal: Bantuan Pangan Gaza/Palestina).
8. **Ibnu Sabil**: Musafir yang kehabisan bekal dalam perjalanan ketaatan.

*Perbedaan dengan Infaq/Wakaf:* Infaq bebas disalurkan untuk sarana umum tanpa syarat asnaf, sedangkan Wakaf adalah penahanan pokok aset produktif.`;
      } else {
        localFallback = `### ⚖️ Syarat Kelayakan Muzakki (Wajib Zakat)

Seseorang wajib mengeluarkan zakat apabila memenuhi syarat:
- **Muslim & Merdeka**.
- **Milik Sempurna (*Al-Milkut Taam*)**: Harta berada dalam kekuasaan penuh dan tidak bersengketa.
- **Mencapai Nisab**: Minimal bernilai **${currentCurrency.symbol}${currentCurrency.nisab85g.toLocaleString('id-ID')}** (setara 85g emas).
- **Mencapai Haul**: Telah berlalu 1 tahun Hijriah kepemilikan (khusus zakat tabungan, emas, perniagaan, saham). Untuk Zakat Profesi, dikeluarkan saat gajian tanpa menunggu 1 tahun (*QS Al-An'am: 141*).
- **Melebihi Kebutuhan Pokok (*Hajah Ashliyyah*) & Bersih dari Hutang Jatuh Tempo**.`;
      }

      const botFallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: localFallback,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        topic: 'GENERAL'
      };

      setMessages(prev => [...prev, botFallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleExportChat = () => {
    const textContent = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.content}\n\n`).join('------------------------------------\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IslamicityLink-Zakat-AI-Consultation-${selectedCurrencyCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Quick Eligibility Simulation evaluation
  const quickNisab = quickAssetType === 'MAAL' ? currentCurrency.nisab85g : Math.round(currentCurrency.nisab85g / 12);
  const quickMeetsNisab = quickAssetAmount >= quickNisab;
  const quickCalculatedZakat = quickMeetsNisab ? Math.round(quickAssetAmount * 0.025) : 0;

  const handleApplyQuickToCalculator = () => {
    if (onApplyCalculatedValues) {
      onApplyCalculatedValues({
        calcType: quickAssetType,
        amount: quickAssetAmount,
        asnafTarget: 'FAKIR'
      });
    }
    const targetElement = document.getElementById('zakat-calculator-section');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredPresets = PRESET_TOPICS.filter(p => {
    if (activeCategoryFilter === 'ALL') return true;
    return p.category === activeCategoryFilter;
  });

  return (
    <div id="ai-zakat-conversational-chatbot" className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 sm:p-8 border border-[#D8DFD8] dark:border-[#2D332D] shadow-md space-y-6 relative overflow-hidden">
      
      {/* Decorative Glow Background */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#2E7D32]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar with Currency Selector & Quick Tools */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D8DFD8] dark:border-[#2D332D] relative z-10">
        
        {/* Title and Badge */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white flex items-center justify-center shadow-md shadow-[#2E7D32]/20">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                  AI Zakat & Sharia Scholar Bot
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] flex items-center gap-1 border border-[#2E7D32]/30">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  Gemini 3.7 Pro Intel
                </span>
              </div>
              <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                Tanyakan syarat kelayakan, aturan nisab emas multi-valuta, & ketentuan 8 asnaf
              </p>
            </div>
          </div>
        </div>

        {/* Currency & Actions Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Local Currency Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF3EE] dark:bg-[#242924] rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D]">
            <Globe className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
            <span className="text-[11px] font-bold text-[#5A665B] dark:text-[#A0A8A0]">Mata Uang:</span>
            <select
              value={selectedCurrencyCode}
              onChange={(e) => setSelectedCurrencyCode(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] focus:outline-none cursor-pointer"
            >
              {Object.values(SUPPORTED_CURRENCIES).map(curr => (
                <option key={curr.code} value={curr.code} className="bg-white dark:bg-[#1A1D1A] text-[#141A14] dark:text-[#E4E8E4]">
                  {curr.flag} {curr.code} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Calculator Toggle */}
          <button
            onClick={() => setShowQuickChecker(!showQuickChecker)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              showQuickChecker 
                ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm' 
                : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#141A14] dark:text-[#E4E8E4] border-[#D8DFD8] dark:border-[#2D332D] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D]'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulasi Nisab</span>
            {showQuickChecker ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Export Transcript */}
          <button
            onClick={handleExportChat}
            title="Download Ringkasan Konsultasi"
            className="p-2 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4] border border-[#D8DFD8] dark:border-[#2D332D] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Clear Messages */}
          <button
            onClick={handleClearChat}
            title="Bersihkan Percakapan"
            className="p-2 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-rose-500/10 text-[#5A665B] dark:text-[#A0A8A0] hover:text-rose-600 border border-[#D8DFD8] dark:border-[#2D332D] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Nisab Reference Strip in Selected Currency */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#EEF3EE]/80 dark:bg-[#242924]/80 border border-[#D8DFD8] dark:border-[#2D332D] text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">Harga Emas ({currentCurrency.code})</span>
            <span className="font-mono font-bold text-[#141A14] dark:text-[#E4E8E4]">
              {currentCurrency.symbol}{currentCurrency.goldPricePerGram.toLocaleString('id-ID')} / gram
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#2E7D32]/20 text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">Nisab 85g Emas (Tahunan)</span>
            <span className="font-mono font-bold text-[#2E7D32] dark:text-[#4CAF50]">
              {currentCurrency.symbol}{currentCurrency.nisab85g.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">Kadar Wajib Zakat</span>
            <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
              2.5% (Seperempat Puluh)
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Quick Nisab & Eligibility Simulator Tool (Expandable) */}
      {showQuickChecker && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#2E7D32]/10 via-[#2E7D32]/5 to-transparent border border-[#2E7D32]/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                Simulasi Hitung Cepat Kelayakan Zakat ({currentCurrency.code})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setQuickAssetType('MAAL')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold ${
                  quickAssetType === 'MAAL'
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-white dark:bg-[#1A1D1A] text-[#5A665B] dark:text-[#A0A8A0]'
                }`}
              >
                Harta/Tabungan
              </button>
              <button
                onClick={() => setQuickAssetType('PROFESI')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold ${
                  quickAssetType === 'PROFESI'
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-white dark:bg-[#1A1D1A] text-[#5A665B] dark:text-[#A0A8A0]'
                }`}
              >
                Gaji/Profesi (Bulan)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                Estimasi Aset Bersih ({currentCurrency.symbol}):
              </label>
              <input
                type="number"
                value={quickAssetAmount}
                onChange={(e) => setQuickAssetAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-[#121412] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                Ambang Nisab Acuan:
              </label>
              <div className="px-3 py-2 bg-white/70 dark:bg-[#121412]/70 border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                {currentCurrency.symbol}{quickNisab.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                Estimasi Kewajiban Zakat (2.5%):
              </label>
              <div className="px-3 py-2 bg-white/70 dark:bg-[#121412]/70 border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-xs font-black text-[#2E7D32] dark:text-[#4CAF50]">
                {currentCurrency.symbol}{quickCalculatedZakat.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#2E7D32]/20">
            <div className="flex items-center gap-1.5 text-xs">
              {quickMeetsNisab ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
                  <span className="font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                    Telah Memenuhi Nisab (Wajib Dikeluarkan)
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-bold text-amber-700 dark:text-amber-400">
                    Belum Mencapai Nisab (Dianjurkan Infaq/Sedekah)
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const askText = `Saya memiliki estimasi harta/penghasilan bersih sebesar ${currentCurrency.symbol}${quickAssetAmount.toLocaleString('id-ID')} (${quickAssetType === 'MAAL' ? 'Harta Simpanan/Maal' : 'Penghasilan Profesi per Bulan'}). Apakah ini sudah wajib zakat menurut nisab ${currentCurrency.code} dan bagaimana rincian fikihnya?`;
                  handleSendMessage(askText);
                }}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] cursor-pointer"
              >
                Tanyakan Rincian ke AI
              </button>

              {quickMeetsNisab && (
                <button
                  onClick={handleApplyQuickToCalculator}
                  className="px-3 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <span>Terapkan ke Kalkulator</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preset Topics Filters & Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#2E7D32]" />
            Topik Diskusi Cepat:
          </span>

          <div className="flex items-center gap-1">
            {[
              { id: 'ALL', label: 'Semua' },
              { id: 'ELIGIBILITY', label: 'Kelayakan' },
              { id: 'NISAB', label: 'Nisab' },
              { id: 'FUNDS', label: '8 Asnaf & Dana' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id as any)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                  activeCategoryFilter === cat.id
                    ? 'bg-[#2E7D32] text-white shadow-xs'
                    : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Prompt Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredPresets.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset.query)}
                disabled={isLoading}
                className="p-3 rounded-2xl bg-[#EEF3EE]/90 dark:bg-[#242924]/90 hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] border border-[#D8DFD8] dark:border-[#2D332D] text-left transition-all hover:scale-[1.01] hover:border-[#2E7D32]/50 group cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white dark:bg-[#1A1D1A] flex items-center justify-center text-[#2E7D32] dark:text-[#4CAF50] shrink-0 border border-[#D8DFD8] dark:border-[#2D332D] group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] line-clamp-1">
                    {preset.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversational Message Thread */}
      <div 
        ref={chatContainerRef}
        className="bg-[#F8FAF8] dark:bg-[#121412] rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] p-4 sm:p-5 max-h-[440px] overflow-y-auto space-y-4 shadow-inner"
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs leading-relaxed ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#2E7D32]/20 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 space-y-2 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#2E7D32] text-white rounded-tr-none'
                  : 'bg-white dark:bg-[#1A1D1A] text-[#141A14] dark:text-[#E4E8E4] border border-[#D8DFD8] dark:border-[#2D332D] rounded-tl-none'
              }`}
            >
              {/* Message Header if Assistant */}
              {msg.sender === 'assistant' && (
                <div className="flex items-center justify-between pb-2 border-b border-[#D8DFD8]/60 dark:border-[#2D332D]/60 text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                  <span className="font-bold text-[#2E7D32] dark:text-[#4CAF50] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Penjelasan Syariah & Fikih Zakat
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="p-1 rounded hover:bg-[#EEF3EE] dark:hover:bg-[#242924] transition-colors cursor-pointer"
                      title="Salin Teks"
                    >
                      {copiedMessageId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#5A665B] dark:text-[#A0A8A0]" />
                      )}
                    </button>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              )}

              {/* Message Body with Markdown formatting support */}
              <div className="whitespace-pre-wrap text-xs sm:text-[13px] leading-relaxed space-y-2">
                {msg.content.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h4 key={pIdx} className="font-extrabold text-sm sm:text-base text-[#2E7D32] dark:text-[#4CAF50] pt-1">
                        {paragraph.replace('### ', '')}
                      </h4>
                    );
                  }
                  return (
                    <p key={pIdx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Timestamp for user messages */}
              {msg.sender === 'user' && (
                <div className="text-[10px] text-white/75 text-right pt-1">
                  {msg.timestamp}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-[#1D4723] text-white flex items-center justify-center shrink-0 shadow-md mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-center text-xs text-[#2E7D32] dark:text-[#4CAF50] p-3 bg-white dark:bg-[#1A1D1A] rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] max-w-md">
            <div className="w-7 h-7 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-[#2E7D32]" />
              <span className="font-medium">AI sedang menganalisis fatwa & menghitung nisab {currentCurrency.code}...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Field & Send Button */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            id="zakat-conversational-ai-input"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`Tanyakan syarat kelayakan zakat, nisab ${currentCurrency.code}, 8 asnaf, atau masukkan nominal gaji/harta Anda...`}
            className="flex-1 px-4 py-3 bg-[#EEF3EE] dark:bg-[#242924] text-[#141A14] dark:text-[#E4E8E4] placeholder-[#5A665B] dark:placeholder-[#A0A8A0] rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] text-xs sm:text-sm focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
          />

          <button
            id="btn-send-zakat-conversational-ai"
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputQuery.trim()}
            className="px-6 py-3 bg-[#2E7D32] hover:bg-[#256629] disabled:opacity-40 text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md shadow-[#2E7D32]/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Kirim</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#5A665B] dark:text-[#A0A8A0] px-1">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-[#2E7D32]" />
            Didukung Fatwa DSN-MUI, BAZNAS RI, & Kaidah Fikih 4 Mazhab
          </span>
          <span>Nisab Emas 85g = {currentCurrency.symbol}{currentCurrency.nisab85g.toLocaleString('id-ID')}</span>
        </div>
      </div>

    </div>
  );
};
