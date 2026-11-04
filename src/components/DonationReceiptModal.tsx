import React from 'react';
import { 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Award, 
  FileCheck2,
  Building,
  Hash
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IslamicityLogo } from './IslamicityLogo';

export const DonationReceiptModal: React.FC = () => {
  const { selectedReceiptTx, setSelectedReceiptTx, userProfile } = useApp();

  if (!selectedReceiptTx) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate simulated download alert / action
    const receiptText = `BUKTI SETOR ZAKAT (BSZ) ELEKTRONIK RESMI
Nomor: ${selectedReceiptTx.officialReceiptNumber}
Lembaga: ${selectedReceiptTx.charityName}
Muzakki: ${selectedReceiptTx.isAnonymous ? 'Hamba Allah' : selectedReceiptTx.donorName}
NPWZ / NPWP: ${userProfile.taxIdentificationNumber || '92.481.092.3-014.000'}
Akad: ${selectedReceiptTx.type}
Nominal: Rp ${selectedReceiptTx.amount.toLocaleString('id-ID')}
TxHash: ${selectedReceiptTx.txHash}
Blok: #${selectedReceiptTx.blockNumber}
Status: VERIFIED 100% SYARIAH (Dapat Mengurangi Penghasilan Kena Pajak Sesuai UU No. 23/2011)
Waktu: ${new Date(selectedReceiptTx.timestamp).toLocaleString('id-ID')}`;

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BSZ-${selectedReceiptTx.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl p-6 max-w-2xl w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4] my-8">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D8DFD8] dark:border-[#2D332D]">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
            <h3 className="font-bold text-sm text-[#141A14] dark:text-[#E4E8E4]">
              Bukti Setor Zakat (BSZ) & Laporan Audit Pajak
            </h3>
          </div>
          <button
            onClick={() => setSelectedReceiptTx(null)}
            className="p-1 rounded-full hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0]"
          >
            ✕
          </button>
        </div>

        {/* Certificate Paper Container */}
        <div className="my-4 p-6 bg-gradient-to-b from-[#EEF3EE]/60 via-white to-[#EAEFEA]/40 dark:from-[#242924] dark:via-[#1A1D1A] dark:to-[#121412] rounded-2xl border-2 border-dashed border-[#2E7D32]/40 dark:border-[#4CAF50]/40 shadow-md relative overflow-hidden">
          
          {/* Watermark Logo */}
          <div className="absolute right-4 bottom-4 opacity-5 dark:opacity-10 select-none pointer-events-none w-64 h-64">
            <IslamicityLogo variant="emblem" size="custom" className="w-full h-full opacity-20" />
          </div>

          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#D8DFD8] dark:border-[#2D332D] text-center sm:text-left">
            <div className="flex items-center gap-3">
              <IslamicityLogo variant="emblem" size="md" />
              <div>
                <span className="text-[10px] font-bold text-[#2E7D32] dark:text-[#4CAF50] tracking-wider uppercase">
                  REPUBLIK INDONESIA — BADAN AMIL ZAKAT NASIONAL x ISLAMICITY
                </span>
                <h2 className="text-lg font-extrabold text-[#141A14] dark:text-[#E4E8E4] tracking-tight mt-0.5">
                  BUKTI SETOR ZAKAT (BSZ) DIGITAL
                </h2>
                <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                  Terdaftar Resmi pada Sistem Informasi Zakat Nasional (SIMZAT) & Blockchain L2
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-block px-2.5 py-1 rounded bg-[#2E7D32] text-white font-mono font-bold text-[11px] shadow-sm">
                {selectedReceiptTx.officialReceiptNumber}
              </span>
            </div>
          </div>

          {/* Body Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 text-xs">
            <div className="space-y-1">
              <span className="text-[#5A665B] dark:text-[#A0A8A0] text-[10px] block">NAMA MUZAKKI / DONATUR</span>
              <p className="font-bold text-sm text-[#141A14] dark:text-[#E4E8E4]">
                {selectedReceiptTx.isAnonymous ? 'Hamba Allah (Privasi E2E Terjaga)' : selectedReceiptTx.donorName}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[#5A665B] dark:text-[#A0A8A0] text-[10px] block">NOMOR POKOK WAJIB ZAKAT / PAJAK (NPWZ/NPWP)</span>
              <p className="font-mono font-semibold text-[#141A14] dark:text-[#E4E8E4]">
                {userProfile.taxIdentificationNumber || '92.481.092.3-014.000'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[#5A665B] dark:text-[#A0A8A0] text-[10px] block">JENIS PENERIMAAN / AKAD</span>
              <p className="font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                {selectedReceiptTx.type.replace('_', ' ')}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[#5A665B] dark:text-[#A0A8A0] text-[10px] block">LEMBAGA PENGELOLA AMIL</span>
              <p className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                {selectedReceiptTx.charityName}
              </p>
            </div>

            <div className="sm:col-span-2 pt-2 pb-1 border-y border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between">
              <span className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">JUMLAH SETORAN ZAKAT/INFAK:</span>
              <span className="text-base font-extrabold text-[#2E7D32] dark:text-[#4CAF50] font-mono">
                Rp {selectedReceiptTx.amount.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <span className="text-[#5A665B] dark:text-[#A0A8A0] text-[10px] block">BUKTI HASH KRIPTOGRAFI BLOCKCHAIN</span>
              <p className="font-mono text-[10px] text-[#5A665B] dark:text-[#A0A8A0] break-all bg-[#EEF3EE] dark:bg-[#242924] p-2 rounded-lg border border-[#D8DFD8] dark:border-[#2D332D]">
                {selectedReceiptTx.txHash} (Blok #{selectedReceiptTx.blockNumber})
              </p>
            </div>
          </div>

          {/* Legal Exemption Footer & QR Verification */}
          <div className="mt-2 pt-3 border-t border-[#D8DFD8] dark:border-[#2D332D] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-[#141A14] text-white rounded-lg p-1 flex items-center justify-center font-mono text-[8px] text-center border border-[#2D332D]">
                [QR VALID]
                <br />
                KEMENAG
              </div>
              <div className="text-left text-[#5A665B] dark:text-[#A0A8A0]">
                <p className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Kekuatan Hukum Pengurang Pajak
                </p>
                <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                  Sesuai UU No. 23 Tahun 2011 Pasal 22 & PP No. 60/2010, zakat yang dibayarkan melalui lembaga resmi dapat menjadi pengurang Penghasilan Kena Pajak (PKP) pada SPT Tahunan.
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <span>Sah & Terverifikasi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Berkas BSZ (PDF/TXT)</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="py-2.5 px-4 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#D8DFD8] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Sertifikat</span>
          </button>

          <button
            onClick={() => setSelectedReceiptTx(null)}
            className="py-2.5 px-4 rounded-xl bg-[#D8DFD8] dark:bg-[#2D332D] hover:bg-[#C0C8C0] dark:hover:bg-[#384038] text-[#141A14] dark:text-[#E4E8E4] font-bold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
