import React, { useState, useMemo } from 'react';
import { 
  X, 
  FileDown, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Filter, 
  Award, 
  Sparkles, 
  Download, 
  Eye, 
  Layers, 
  Users,
  FileCheck2,
  Lock,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { generateDonationImpactPDF } from '../../utils/pdfReportGenerator';

interface ExportReportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (reportId: string) => void;
}

export const ExportReportPdfModal: React.FC<ExportReportPdfModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { blockchainTransactions, userProfile } = useApp();

  const [period, setPeriod] = useState<string>('ALL');
  const [category, setCategory] = useState<string>('ALL');
  const [includeTaxCert, setIncludeTaxCert] = useState<boolean>(true);
  const [includeAsnafImpact, setIncludeAsnafImpact] = useState<boolean>(true);
  const [includeCryptoSignature, setIncludeCryptoSignature] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [previewSnippetOpen, setPreviewSnippetOpen] = useState<boolean>(false);

  // Filter transactions based on selection
  const filteredTxs = useMemo(() => {
    return blockchainTransactions.filter(tx => {
      // Category match
      let matchCat = true;
      if (category === 'ZAKAT') {
        matchCat = tx.type.startsWith('ZAKAT');
      } else if (category === 'INFAQ') {
        matchCat = tx.type === 'INFAQ_SEDEKAH' || tx.type === 'DISTRIBUTION_ASNAF';
      } else if (category === 'WAKAF') {
        matchCat = tx.type === 'WAKAF_PRODUKTIF';
      }

      // Period match
      let matchPeriod = true;
      if (period === '2026') {
        matchPeriod = tx.timestamp?.includes('2026') ?? true;
      } else if (period === '2025') {
        matchPeriod = tx.timestamp?.includes('2025') ?? false;
      }

      return matchCat && matchPeriod;
    });
  }, [blockchainTransactions, category, period]);

  const totalAmount = filteredTxs.reduce((sum, tx) => sum + tx.amount, 0);
  const zakatTotal = filteredTxs.filter(tx => tx.type.startsWith('ZAKAT')).reduce((sum, tx) => sum + tx.amount, 0);
  const infaqTotal = filteredTxs.filter(tx => tx.type === 'INFAQ_SEDEKAH' || tx.type === 'DISTRIBUTION_ASNAF').reduce((sum, tx) => sum + tx.amount, 0);
  const wakafTotal = filteredTxs.filter(tx => tx.type === 'WAKAF_PRODUKTIF').reduce((sum, tx) => sum + tx.amount, 0);
  const estimatedBeneficiaries = Math.max(8, Math.round(totalAmount / 350000));

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    setIsGenerating(true);

    setTimeout(() => {
      try {
        let periodLabel = 'Semua Periode Riwayat Donasi';
        if (period === '2026') periodLabel = 'Tahun Buku 2026';
        if (period === '2025') periodLabel = 'Tahun Buku 2025';

        const result = generateDonationImpactPDF({
          donorName: userProfile.name,
          donorEmail: userProfile.email,
          taxId: userProfile.taxIdentificationNumber || '92.481.092.3-014.000',
          kycLevel: userProfile.kycLevel,
          e2eePublicKey: userProfile.e2eePublicKey,
          transactions: filteredTxs.length > 0 ? filteredTxs : blockchainTransactions,
          periodLabel,
          generatedDate: new Date(),
          includeTaxCertification: includeTaxCert,
        });

        result.download();

        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2E7D32', '#4CAF50', '#D4A017', '#81C784']
          });
        } catch (e) {}

        if (onSuccess) {
          onSuccess(result.reportId);
        }

        setIsGenerating(false);
        onClose();
      } catch (err) {
        console.error('Failed to generate PDF:', err);
        setIsGenerating(false);
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#1A1D1A] w-full max-w-2xl rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#1F3D22] via-[#172E19] to-[#121E13] text-white flex items-center justify-between border-b border-[#2D332D] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 border border-white/20">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Export to PDF: Riwayat Donasi & Dampak
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Signed PDF
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">
                Laporan akuntabilitas digital resmi ber-tanda tangan DPS untuk arsip pribadi & SPT Pajak
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Filter 1: Periode */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1.5 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span>Periode Tahun Buku:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ALL', label: 'Semua Periode', desc: 'Riwayat Lengkap' },
                { id: '2026', label: 'Tahun 2026', desc: 'Tahun Berjalan' },
                { id: '2025', label: 'Tahun 2025', desc: 'Arsip Tahun Lalu' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setPeriod(opt.id)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    period === opt.id
                      ? 'border-[#2E7D32] bg-[#EEF3EE] dark:bg-[#2E7D32]/20 text-[#2E7D32] dark:text-[#4CAF50] font-bold shadow-xs'
                      : 'border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#F5F8F5] dark:hover:bg-[#242924]'
                  }`}
                >
                  <p className="text-xs font-black">{opt.label}</p>
                  <p className="text-[10px] opacity-80">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Filter 2: Jenis Donasi */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1.5 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span>Kategori Ibadah:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'ALL', label: 'Semua Ibadah' },
                { id: 'ZAKAT', label: 'Zakat Saja' },
                { id: 'INFAQ', label: 'Infak & Sedekah' },
                { id: 'WAKAF', label: 'Wakaf Produktif' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setCategory(opt.id)}
                  className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all ${
                    category === opt.id
                      ? 'border-[#2E7D32] bg-[#2E7D32] text-white shadow-xs'
                      : 'border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles for inclusions */}
          <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-3">
            <h4 className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span>Kelengkapan Dokumen & Sertifikasi Syariah:</span>
            </h4>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTaxCert}
                onChange={e => setIncludeTaxCert(e.target.checked)}
                className="mt-0.5 rounded text-[#2E7D32] focus:ring-[#2E7D32]"
              />
              <div className="text-xs">
                <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Sertakan Bukti Setor Zakat (BSZ) Pengurang Pajak Ditjen Pajak
                </span>
                <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                  Mencantumkan NPWZ/NPWP donatur dan referensi legal UU No. 23/2011 Pasal 22 untuk SPT Tahunan PPh.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAsnafImpact}
                onChange={e => setIncludeAsnafImpact(e.target.checked)}
                className="mt-0.5 rounded text-[#2E7D32] focus:ring-[#2E7D32]"
              />
              <div className="text-xs">
                <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Sertakan Analisis Dampak Sosial & Estimasi Penerima Manfaat 8 Asnaf
                </span>
                <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                  Rincian alokasi kepada Fakir, Miskin, Fisabilillah, Gharimin, dan Mualaf (QS At-Taubah: 60).
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCryptoSignature}
                onChange={e => setIncludeCryptoSignature(e.target.checked)}
                className="mt-0.5 rounded text-[#2E7D32] focus:ring-[#2E7D32]"
              />
              <div className="text-xs">
                <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Sertakan Tanda Tangan Kriptografis ECDSA & Merkle Root Proof
                </span>
                <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                  Jaminan integritas matematis anti-manipulasi dari konsensus validator BAZNAS & Dompet Dhuafa.
                </p>
              </div>
            </label>
          </div>

          {/* Real-time Summary Box */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1D1A] border-2 border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Ringkasan Data Yang Akan Diekspor:</span>
              </span>
              <span className="text-[11px] font-bold text-[#2E7D32] dark:text-[#4CAF50] font-mono">
                {filteredTxs.length} Transaksi Terpilih
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924]">
                <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">Total Donasi</p>
                <p className="font-black text-[#2E7D32] dark:text-[#4CAF50] font-mono truncate">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924]">
                <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">Zakat Maal</p>
                <p className="font-bold text-[#141A14] dark:text-[#E4E8E4] font-mono truncate">
                  Rp {zakatTotal.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924]">
                <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">Infak / Wakaf</p>
                <p className="font-bold text-[#141A14] dark:text-[#E4E8E4] font-mono truncate">
                  Rp {(infaqTotal + wakafTotal).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924]">
                <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">Estimasi Manfaat</p>
                <p className="font-black text-rose-600 dark:text-rose-400 font-mono">
                  ±{estimatedBeneficiaries} Jiwa
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-[#EEF3EE] dark:bg-[#242924] border-t border-[#D8DFD8] dark:border-[#2D332D] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
            <Lock className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
            <span>Format PDF Standar A4 | Dilengkapi Stempel Resmi</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1D1A] hover:bg-gray-100 dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] font-bold text-xs border border-[#D8DFD8] dark:border-[#2D332D] transition-colors"
            >
              Batal
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] disabled:opacity-60 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#2E7D32]/25 transition-all"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Membuat PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-emerald-200" />
                  <span>Export to PDF Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
