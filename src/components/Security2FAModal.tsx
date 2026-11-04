import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Fingerprint, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Copy, 
  RefreshCw,
  QrCode,
  Smartphone,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Security2FAModal: React.FC = () => {
  const { is2FAModalOpen, setIs2FAModalOpen, userProfile, updateUserProfile, addNotification } = useApp();
  const [totpCode, setTotpCode] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [taxIdInput, setTaxIdInput] = useState(userProfile.taxIdentificationNumber || '92.481.092.3-014.000');
  const [totpSecret] = useState('ISLAMICITY-LYNK-7789-SECURE-KEY');

  if (!is2FAModalOpen) return null;

  const handleToggle2FA = () => {
    const nextState = !userProfile.is2FAEnabled;
    updateUserProfile({ is2FAEnabled: nextState });
    addNotification({
      title: nextState ? '2FA Diaktifkan' : '2FA Dinonaktifkan',
      message: nextState 
        ? 'Verifikasi dua langkah aktif. Transaksi zakat dan pesan Anda terlindungi aman.' 
        : 'Perhatian: Keamanan 2FA dinonaktifkan.',
      type: 'SECURITY',
    });
  };

  const handleSaveTaxId = () => {
    updateUserProfile({ taxIdentificationNumber: taxIdInput });
    addNotification({
      title: 'Data NPWP/NPWZ Disimpan',
      message: 'Bukti setor zakat berikutnya akan otomatis mencantumkan NPWZ untuk pengurang pajak.',
      type: 'SECURITY',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl p-6 max-w-xl w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4] my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D8DFD8] dark:border-[#2D332D]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] border border-[#2E7D32]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#141A14] dark:text-[#E4E8E4]">
                Pusat Keamanan & Verifikasi Dua Langkah (2FA)
              </h3>
              <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                Enkripsi End-to-End & Autentikasi Syariah Terpercaya
              </p>
            </div>
          </div>
          <button
            onClick={() => setIs2FAModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0]"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 text-xs">
          
          {/* Main 2FA Status Toggle */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EEF3EE] to-[#EAEFEA] dark:from-[#242924] dark:to-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1D1A] text-[#2E7D32] dark:text-[#4CAF50] shadow-sm">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#141A14] dark:text-[#E4E8E4]">
                  Status Otentikasi 2-Langkah
                </h4>
                <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                  {userProfile.is2FAEnabled 
                    ? 'Aktif — Memerlukan kode 6 digit TOTP untuk transaksi besar dan akses chat E2EE' 
                    : 'Nonaktif — Sangat disarankan untuk mengaktifkan demi keamanan dana zakat'}
                </p>
              </div>
            </div>

            <button
              onClick={handleToggle2FA}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm ${
                userProfile.is2FAEnabled
                  ? 'bg-[#2E7D32] text-white hover:bg-[#256629]'
                  : 'bg-[#D8DFD8] dark:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] hover:bg-[#C0C8C0]'
              }`}
            >
              {userProfile.is2FAEnabled ? '2FA Aktif ✓' : 'Aktifkan 2FA'}
            </button>
          </div>

          {/* Setup TOTP Authenticator Card */}
          <div className="bg-[#EEF3EE] dark:bg-[#242924] p-4 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] space-y-3">
            <div className="flex items-center gap-2 text-[#141A14] dark:text-[#E4E8E4] font-bold text-sm">
              <Smartphone className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span>Aplikasi Autentikator (Google Auth / Authy / Lynk.id Key)</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
              <div className="w-24 h-24 bg-white dark:bg-[#1A1D1A] p-2 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] flex flex-col items-center justify-center font-mono text-[9px] text-center shadow-inner">
                <QrCode className="w-12 h-12 text-[#2E7D32] dark:text-[#4CAF50]" />
                <span className="text-[8px] text-[#5A665B] dark:text-[#A0A8A0] mt-1">SCAN QR</span>
              </div>

              <div className="flex-1 space-y-1.5 w-full">
                <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                  Kunci Rahasia Setup Manual:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type={showSecret ? "text" : "password"}
                    readOnly
                    value={totpSecret}
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-lg font-mono text-xs text-[#141A14] dark:text-[#E4E8E4]"
                  />
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="p-1.5 rounded-lg bg-[#D8DFD8] dark:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4]"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* E2EE Public Key & Identity Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-[#EEF3EE] dark:bg-[#242924] rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#141A14] dark:text-[#E4E8E4]">
                <KeyRound className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <span>Kunci Publik E2EE</span>
              </div>
              <p className="font-mono text-[10px] text-[#5A665B] dark:text-[#A0A8A0] break-all">
                {userProfile.e2eePublicKey}
              </p>
              <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50]">
                Privasi Terenkripsi di Sisi Klien
              </span>
            </div>

            <div className="p-3 bg-[#EEF3EE] dark:bg-[#242924] rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#141A14] dark:text-[#E4E8E4]">
                <FileCheck className="w-3.5 h-3.5 text-[#4CAF50]" />
                <span>Tingkat Verifikasi (KYC)</span>
              </div>
              <p className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                Tier 2: Muzakki Terverifikasi BAZNAS
              </p>
              <span className="inline-block text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                Limit transaksi Zakat/Wakaf: Tidak Terbatas
              </span>
            </div>
          </div>

          {/* NPWP / NPWZ Tax Setting */}
          <div className="p-3 bg-[#EEF3EE] dark:bg-[#242924] rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] space-y-2">
            <label className="font-bold text-[#141A14] dark:text-[#E4E8E4] block">
              Nomor Pokok Wajib Pajak / Zakat (NPWP / NPWZ):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={taxIdInput}
                onChange={(e) => setTaxIdInput(e.target.value)}
                placeholder="Contoh: 92.481.092.3-014.000"
                className="flex-1 px-3 py-1.5 bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-lg font-mono text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              />
              <button
                onClick={handleSaveTaxId}
                className="px-3 py-1.5 rounded-lg bg-[#2E7D32] text-white font-bold text-xs hover:bg-[#256629]"
              >
                Simpan
              </button>
            </div>
            <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
              Diperlukan agar setiap bukti setor zakat (BSZ) diakui resmi oleh Ditjen Pajak Kemenkeu RI.
            </p>
          </div>

          {/* Done Button */}
          <button
            onClick={() => setIs2FAModalOpen(false)}
            className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs shadow-md transition-colors"
          >
            Selesai & Tutup Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};
