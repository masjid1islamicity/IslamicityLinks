import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  RefreshCw, 
  BookOpen, 
  Calculator, 
  ShieldCheck,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IslamicityLogo } from './IslamicityLogo';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiAssistantDrawer: React.FC = () => {
  const { isAiDrawerOpen, setIsAiDrawerOpen, language, goldPricePerGram, nisabMaalAmount } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Assalamu'alaikum wr wb! Saya **IslamicityLink AI Advisor** (didukung kolaborasi Lynk.id). 
Saya siap membantu Anda menghitung zakat (maal, profesi, emas, saham), konsultasi fikih muamalah, serta panduan wakaf produktif berbasis blockchain.

Ada yang bisa saya bantu hari ini?`,
      timestamp: 'Sekarang',
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Berapa nisab emas 85g hari ini dan rumus zakat maal?",
    "Cara menghitung zakat profesi penghasilan bulanan?",
    "Hukum investasi saham syariah & reksadana halal",
    "Bagaimana smart contract blockchain menjamin zakat aman?",
    "Apa perbedaan wakaf produktif dan infak biasa?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiDrawerOpen) {
      scrollToBottom();
    }
  }, [messages, isAiDrawerOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now().toString(36),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: `Harga emas acuan: Rp ${goldPricePerGram.toLocaleString('id-ID')}/gram. Nisab 85g: Rp ${nisabMaalAmount.toLocaleString('id-ID')}. Platform: IslamicityLink x Lynk.id.`,
          language,
        }),
      });

      const data = await response.json();
      const aiReply: ChatMessage = {
        id: 'ai_' + Date.now().toString(36),
        sender: 'ai',
        text: data.reply || "Mohon maaf, terjadi sedikit kendala. Silakan coba kembali.",
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiReply]);
    } catch (e) {
      const fallbackReply: ChatMessage = {
        id: 'ai_' + Date.now().toString(36),
        sender: 'ai',
        text: `[Mode Mandiri] Untuk perhitungan zakat: Nisab emas saat ini adalah 85 gram (setara Rp ${(goldPricePerGram * 85).toLocaleString('id-ID')}). Jika total harta telah melebihi nisab dan tersimpan 1 haul (1 tahun), kadar zakat yang wajib dikeluarkan adalah 2,5%. Anda dapat menghitungnya secara instan pada tab 'Zakat Blockchain'.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAiDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-[#1A1D1A] h-full shadow-2xl flex flex-col border-l border-[#D8DFD8] dark:border-[#2D332D] animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-[#2D332D] flex items-center justify-between bg-gradient-to-r from-[#1F3D22] to-[#172E19] text-[#E4E8E4]">
          <div className="flex items-center gap-2.5">
            <IslamicityLogo variant="emblem" size="sm" className="rounded-xl shadow-none" />
            <div>
              <h3 className="font-bold text-sm text-white">IslamicityLink AI Advisor</h3>
              <p className="text-[11px] text-[#E4E8E4]/90">
                Konsultasi Syariah & Perhitungan Zakat Instan (Lynk.id Powered)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAiDrawerOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#E4E8E4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Gold Benchmark Ticker */}
        <div className="px-4 py-2 bg-[#EEF3EE] dark:bg-[#242924] border-b border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between text-[11px] text-[#2E7D32] dark:text-[#4CAF50]">
          <div className="flex items-center gap-1.5 font-semibold">
            <Calculator className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
            <span>Nisab Emas 85g: Rp {nisabMaalAmount.toLocaleString('id-ID')}</span>
          </div>
          <span className="font-mono text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
            (Rp {goldPricePerGram.toLocaleString('id-ID')}/g)
          </span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  msg.sender === 'user' 
                    ? 'bg-[#5A665B]' 
                    : 'bg-[#2E7D32] shadow-sm'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#2E7D32] text-white rounded-tr-none'
                    : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#141A14] dark:text-[#E4E8E4] rounded-tl-none border border-[#D8DFD8] dark:border-[#2D332D]'
                }`}
              >
                <div className="whitespace-pre-line text-xs font-normal">
                  {msg.text}
                </div>
                <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-[#E4E8E4]/80' : 'text-[#5A665B] dark:text-[#A0A8A0]'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#2E7D32] flex items-center justify-center text-white shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-[#EEF3EE] dark:bg-[#242924] p-3 rounded-2xl rounded-tl-none text-xs text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2E7D32] dark:text-[#4CAF50]" />
                <span>Menganalisis kaidah fikih & kalkulasi syariah...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-t border-[#D8DFD8] dark:border-[#2D332D] bg-[#F4F6F4] dark:bg-[#121412]">
          <p className="text-[10px] font-bold text-[#5A665B] dark:text-[#A0A8A0] uppercase tracking-wider mb-2 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            <span>Pertanyaan Populer:</span>
          </p>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] text-[11px] text-[#141A14] dark:text-[#E4E8E4] hover:border-[#2E7D32] dark:hover:border-[#4CAF50] hover:text-[#2E7D32] dark:hover:text-[#4CAF50] whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div className="p-3 border-t border-[#D8DFD8] dark:border-[#2D332D] bg-white dark:bg-[#1A1D1A]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Tanyakan fikih, zakat maal, infak, atau wakaf..."
              className="flex-1 px-4 py-2.5 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-2xl text-xs text-[#141A14] dark:text-[#E4E8E4] placeholder:text-[#5A665B] dark:placeholder:text-[#A0A8A0] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="p-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] disabled:opacity-50 text-white shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] text-center mt-2">
            Disajikan sebagai referensi syariah edukatif berdasarkan kaidah fatwa DSN-MUI & Al-Qur'an Sunnah.
          </p>
        </div>
      </div>
    </div>
  );
};
