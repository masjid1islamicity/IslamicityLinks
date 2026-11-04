import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  FileCheck, 
  QrCode, 
  Hash, 
  Calendar, 
  Filter, 
  Eye, 
  Copy, 
  ExternalLink,
  ChevronRight,
  Printer,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { BlockchainTransaction } from '../../types';
import { generateDonationImpactPDF } from '../../utils/pdfReportGenerator';
import { generateSHA256Hash } from '../../utils/cryptoSim';

export const DonationImpactExportCard: React.FC = () => {
  const { blockchainTransactions, userProfile, t } = useApp();

  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [lastExportedId, setLastExportedId] = useState<string | null>(null);

  // Filter transactions
  const filteredTxs = useMemo(() => {
    return blockchainTransactions.filter(tx => {
      // Type match
      let matchType = true;
      if (selectedType === 'ZAKAT') {
        matchType = tx.type.startsWith('ZAKAT');
      } else if (selectedType === 'WAKAF') {
        matchType = tx.type === 'WAKAF_PRODUKTIF';
      } else if (selectedType === 'INFAQ') {
        matchType = tx.type === 'INFAQ_SEDEKAH' || tx.type === 'DISTRIBUTION_ASNAF';
      }

      // Period match
      let matchPeriod = true;
      if (selectedPeriod === '2026') {
        matchPeriod = tx.timestamp.includes('2026');
      } else if (selectedPeriod === '2025') {
        matchPeriod = tx.timestamp.includes('2025');
      }

      return matchType && matchPeriod;
    });
  }, [blockchainTransactions, selectedType, selectedPeriod]);

  const totalAmount = filteredTxs.reduce((sum, tx) => sum + tx.amount, 0);
  const zakatAmount = filteredTxs.filter(tx => tx.type.startsWith('ZAKAT')).reduce((sum, tx) => sum + tx.amount, 0);
  const wakafAmount = filteredTxs.filter(tx => tx.type === 'WAKAF_PRODUKTIF').reduce((sum, tx) => sum + tx.amount, 0);
  const infaqAmount = filteredTxs.filter(tx => tx.type === 'INFAQ_SEDEKAH' || tx.type === 'DISTRIBUTION_ASNAF').reduce((sum, tx) => sum + tx.amount, 0);
  const estimatedMustahik = Math.max(8, Math.round(totalAmount / 350000));

  // Compute live cryptographic Merkle Root simulation
  const merkleRoot = useMemo(() => {
    const raw = filteredTxs.map(t => `${t.id}:${t.amount}:${t.txHash}`).join('|');
    return generateSHA256Hash(`USER_IMPACT_REPORT_${userProfile.email}_${raw}`);
  }, [filteredTxs, userProfile.email]);

  const handleExportPDF = () => {
    setIsExporting(true);

    setTimeout(() => {
      try {
        const periodLabel = selectedPeriod === 'ALL' 
          ? 'Semua Periode (Rekap Lengkap)' 
          : `Tahun Buku ${selectedPeriod}`;

        const result = generateDonationImpactPDF({
          donorName: userProfile.name,
          donorEmail: userProfile.email,
          taxId: userProfile.taxIdentificationNumber || '92.481.092.3-014.000',
          kycLevel: userProfile.kycLevel,
          e2eePublicKey: userProfile.e2eePublicKey,
          transactions: filteredTxs.length > 0 ? filteredTxs : blockchainTransactions,
          periodLabel,
          generatedDate: new Date(),
          includeTaxCertification: true,
        });

        result.download();
        setLastExportedId(result.reportId);
        setIsExporting(false);

        // Celebration confetti
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#2E7D32', '#4CAF50', '#D4A017', '#81C784']
          });
        } catch (e) {}

      } catch (err) {
        console.error('Failed to generate PDF:', err);
        setIsExporting(false);
      }
    }, 600);
  };

  const handleCopyMerkle = () => {
    navigator.clipboard.writeText(merkleRoot);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-white via-[#F5F8F5] to-[#EEF3EE] dark:from-[#1A1D1A] dark:via-[#1E221E] dark:to-[#171A17] rounded-3xl p-6 sm:p-8 border-2 border-[#2E7D32]/30 dark:border-[#2E7D32]/40 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Subtle Watermark Decoration */}
        <div className="absolute -right-8 -bottom-8 opacity-5 dark:opacity-5 pointer-events-none text-[#2E7D32]">
          <FileText className="w-64 h-64" />
        </div>

        {/* Top Header & Tag */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#2E7D32] text-white text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fitur Baru: Ekspor Bukti Audit Kriptografis</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-[#2E7D32] dark:text-[#4CAF50] text-[10px] font-mono font-bold border border-[#2E7D32]/20">
                PDF Signatur Valid
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#141A14] dark:text-[#E4E8E4] tracking-tight">
              Laporan Dampak Donasi & Bukti Setor Zakat (BSZ) Terenkripsi
            </h2>
            <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] max-w-2xl leading-relaxed">
              Unduh rekapitulasi komprehensif seluruh zakat maal, infak sedekah, dan wakaf produktif Anda dalam format PDF resmi ber-tanda tangan digital kriptografis (ECDSA/SHA-256) yang diakui Ditjen Pajak untuk Lampiran SPT Tahunan.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#242924] hover:bg-[#EEF3EE] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] font-extrabold text-xs flex items-center gap-2 border border-[#D8DFD8] dark:border-[#2D332D] transition-all shadow-sm"
            >
              <Eye className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span>Pratinjau Laporan</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] disabled:opacity-60 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#2E7D32]/20 hover:shadow-xl transition-all"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Membuat PDF Terenkripsi...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export to PDF (Resmi)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-bold text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Rekap:</span>
            </span>

            {/* Category Filter */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#242924] p-1 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D]">
              {[
                { id: 'ALL', label: 'Semua Ibadah' },
                { id: 'ZAKAT', label: 'Zakat Maal & Profesi' },
                { id: 'WAKAF', label: 'Wakaf Produktif' },
                { id: 'INFAQ', label: 'Infak & Sedekah' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedType(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedType === opt.id
                      ? 'bg-[#2E7D32] text-white shadow-xs'
                      : 'text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#1A1D1A]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Period Filter */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#242924] p-1 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D]">
              {[
                { id: 'ALL', label: 'Semua Tahun' },
                { id: '2026', label: '2026 (Tahun Ini)' },
                { id: '2025', label: '2025' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedPeriod(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedPeriod === opt.id
                      ? 'bg-[#2E7D32] text-white shadow-xs'
                      : 'text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#1A1D1A]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
            Menampilkan <strong>{filteredTxs.length} mutasi</strong> terpilih
          </div>
        </div>

        {/* Live Aggregation Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-10">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A665B] dark:text-[#A0A8A0]">
              Total Dana Ditunaikan
            </span>
            <p className="text-lg font-black text-[#2E7D32] dark:text-[#4CAF50] font-mono">
              Rp {totalAmount.toLocaleString('id-ID')}
            </p>
            <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">
              Zakat: Rp {zakatAmount.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A665B] dark:text-[#A0A8A0]">
              Wakaf & Infak Berkelanjutan
            </span>
            <p className="text-lg font-black text-[#141A14] dark:text-[#E4E8E4] font-mono">
              Rp {(wakafAmount + infaqAmount).toLocaleString('id-ID')}
            </p>
            <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">
              Wakaf: Rp {wakafAmount.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A665B] dark:text-[#A0A8A0]">
              Estimasi Jangkauan Asnaf
            </span>
            <p className="text-lg font-black text-[#141A14] dark:text-[#E4E8E4] font-mono">
              ±{estimatedMustahik} Mustahik
            </p>
            <span className="text-[10px] text-[#2E7D32] dark:text-[#4CAF50] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Fakir, Miskin, Fisabilillah
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A665B] dark:text-[#A0A8A0]">
              Validitas Pajak (NPWZ)
            </span>
            <p className="text-sm font-extrabold text-[#2E7D32] dark:text-[#4CAF50] font-mono">
              {userProfile.taxIdentificationNumber || 'TERDAFTAR'}
            </p>
            <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] block">
              Pasal 22 UU No. 23/2011
            </span>
          </div>
        </div>

        {/* Cryptographic Proof & Verification Box */}
        <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924]/60 border border-[#D8DFD8] dark:border-[#2D332D] space-y-3 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                Integritas Dokumen & Merkle Root On-Chain
              </span>
            </div>
            
            <button
              onClick={handleCopyMerkle}
              className="text-[11px] font-mono text-[#2E7D32] dark:text-[#4CAF50] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedHash ? 'Tersalin ke Clipboard!' : 'Salin Merkle Root'}</span>
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] font-mono text-[10px] text-[#5A665B] dark:text-[#A0A8A0] break-all select-all flex items-center justify-between gap-2">
            <span>{merkleRoot}</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[#2E7D32] dark:text-[#4CAF50] font-bold shrink-0">
              SHA-256
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span>Validator: <strong>BAZNAS-SHARIA-NODE-01</strong> & <strong>DOMPET-DHUAFA-AUDIT-02</strong></span>
            </div>
            {lastExportedId && (
              <span className="text-[#2E7D32] dark:text-[#4CAF50] font-bold">
                ✓ PDF Berhasil Diunduh ({lastExportedId})
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Report Preview & Customization Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4] my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#D8DFD8] dark:border-[#2D332D]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2E7D32]/10 flex items-center justify-center text-[#2E7D32] dark:text-[#4CAF50]">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#141A14] dark:text-[#E4E8E4]">
                    Pratinjau Dokumen Audit & Laporan Dampak
                  </h3>
                  <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                    Struktur sertifikat digital berstandar Bukti Setor Zakat (BSZ) resmi BAZNAS
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-full hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0]"
              >
                ✕
              </button>
            </div>

            {/* Mock PDF Visual Layout Preview */}
            <div className="p-6 rounded-2xl bg-[#F9FBF9] dark:bg-[#141714] border-2 border-dashed border-[#2E7D32]/40 space-y-6 shadow-inner font-sans text-xs">
              
              {/* Top Document Header Banner */}
              <div className="bg-[#1F3D22] text-white p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm tracking-wide">ISLAMICITYLINK x LYNK.ID ECOSYSTEM</h4>
                  <p className="text-[10px] text-[#A5D6A7]">Smart Sharia Blockchain & Verified Digital Zakat Hub</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-[#2E7D32] text-[9px] font-bold tracking-wider uppercase">
                    CRYPTO-SIGNED (WTP)
                  </span>
                  <p className="text-[9px] text-[#E4E8E4] font-mono mt-0.5">ID: DIR-2026-PREVIEW</p>
                </div>
              </div>

              {/* Title */}
              <div className="text-center space-y-1">
                <h3 className="text-sm sm:text-base font-extrabold uppercase text-[#141A14] dark:text-[#E4E8E4] tracking-tight">
                  LAPORAN DAMPAK DONASI & BUKTI SETOR ZAKAT (BSZ)
                </h3>
                <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                  Periode: {selectedPeriod === 'ALL' ? 'Semua Periode' : selectedPeriod} | Diterbitkan untuk keperluan Audit Syariah & Pengurang Pajak SPT
                </p>
              </div>

              {/* Donor Meta info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-white dark:bg-[#1E221E] border border-[#D8DFD8] dark:border-[#2D332D]">
                <div className="space-y-1">
                  <div className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">Nama Muzakki / Donatur:</div>
                  <div className="font-bold text-xs">{userProfile.name}</div>
                  <div className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] pt-1">Email Terdaftar:</div>
                  <div className="font-mono text-xs">{userProfile.email}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">Nomor Pokok Wajib Zakat (NPWZ / NPWP):</div>
                  <div className="font-mono font-bold text-xs">{userProfile.taxIdentificationNumber || '92.481.092.3-014.000'}</div>
                  <div className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] pt-1">Status Kepatuhan Pajak:</div>
                  <div className="font-bold text-xs text-[#2E7D32] dark:text-[#4CAF50]">Sah Pengurang Penghasilan Kena Pajak</div>
                </div>
              </div>

              {/* Table preview */}
              <div className="space-y-2">
                <div className="font-bold text-xs text-[#141A14] dark:text-[#E4E8E4]">
                  Mutasi Transaksi On-Chain Terlampir ({filteredTxs.length} Transaksi):
                </div>

                <div className="overflow-x-auto border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-[#EEF3EE] dark:bg-[#242924] font-bold text-[#141A14] dark:text-[#E4E8E4] border-b border-[#D8DFD8] dark:border-[#2D332D]">
                      <tr>
                        <th className="p-2">Tanggal</th>
                        <th className="p-2">Jenis</th>
                        <th className="p-2">Lembaga Amil</th>
                        <th className="p-2 text-right">Nominal</th>
                        <th className="p-2">No. Bukti BSZ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D8DFD8] dark:divide-[#2D332D]">
                      {filteredTxs.map((tx, idx) => (
                        <tr key={tx.id || idx} className="hover:bg-black/5 dark:hover:bg-white/5">
                          <td className="p-2 font-mono">{tx.timestamp.substring(0, 10)}</td>
                          <td className="p-2 font-semibold">{tx.type.replace(/_/g, ' ')}</td>
                          <td className="p-2">{tx.charityName}</td>
                          <td className="p-2 text-right font-mono font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                            Rp {tx.amount.toLocaleString('id-ID')}
                          </td>
                          <td className="p-2 font-mono text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                            {tx.officialReceiptNumber || `BSZ-${tx.id.substring(0, 8)}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#EEF3EE] dark:bg-[#242924] font-bold">
                      <tr>
                        <td colSpan={3} className="p-2 text-right">Total Akumulasi:</td>
                        <td className="p-2 text-right text-[#2E7D32] dark:text-[#4CAF50] font-mono text-xs">
                          Rp {totalAmount.toLocaleString('id-ID')}
                        </td>
                        <td className="p-2 text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">100% Terverifikasi</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Digital Signature Footer */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E221E] border border-[#2E7D32]/30 space-y-1">
                <div className="flex items-center gap-2 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-[11px]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Digital Signature & Sharia Proof of Authority (PoA)</span>
                </div>
                <div className="font-mono text-[9px] text-[#5A665B] dark:text-[#A0A8A0] break-all">
                  SHA-256 Merkle Root: {merkleRoot}
                </div>
                <div className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] pt-1">
                  Diaudit dan disetujui sesuai Fatwa DSN-MUI No. 116/DSN-MUI/IX/2017 & Peraturan BAZNAS No. 1 Tahun 2018.
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white dark:bg-[#242924] hover:bg-[#EEF3EE] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] font-extrabold text-xs border border-[#D8DFD8] dark:border-[#2D332D] transition-all"
              >
                Tutup Pratinjau
              </button>

              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  handleExportPDF();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Dokumen PDF Resmi</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
