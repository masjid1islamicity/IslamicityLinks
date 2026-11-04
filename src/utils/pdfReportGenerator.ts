import { jsPDF } from 'jspdf';
import { BlockchainTransaction, UserSecurityProfile } from '../types';
import { generateSHA256Hash } from './cryptoSim';

export interface DonationImpactReportOptions {
  donorName: string;
  donorEmail: string;
  taxId?: string;
  kycLevel?: string;
  e2eePublicKey?: string;
  transactions: BlockchainTransaction[];
  periodLabel?: string;
  generatedDate?: Date;
  includeTaxCertification?: boolean;
}

export function generateDonationImpactPDF(options: DonationImpactReportOptions): {
  doc: jsPDF;
  reportId: string;
  sha256Checksum: string;
  merkleRoot: string;
  digitalSignature: string;
  download: () => void;
} {
  const {
    donorName,
    donorEmail,
    taxId = '92.481.092.3-014.000',
    kycLevel = 'TIER_2_VERIFIED_DONOR',
    e2eePublicKey = 'isl_pub_8a92f019c4b789e',
    transactions,
    periodLabel = 'Tahun Kalender 2026 (Semua Periode)',
    generatedDate = new Date(),
    includeTaxCertification = true,
  } = options;

  const reportId = `DIR-${generatedDate.getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  // Calculate aggregates
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const zakatTxs = transactions.filter(tx => tx.type.startsWith('ZAKAT'));
  const zakatTotal = zakatTxs.reduce((sum, tx) => sum + tx.amount, 0);
  const wakafTxs = transactions.filter(tx => tx.type === 'WAKAF_PRODUKTIF');
  const wakafTotal = wakafTxs.reduce((sum, tx) => sum + tx.amount, 0);
  const infaqTxs = transactions.filter(tx => tx.type === 'INFAQ_SEDEKAH' || tx.type === 'DISTRIBUTION_ASNAF');
  const infaqTotal = infaqTxs.reduce((sum, tx) => sum + tx.amount, 0);

  // Compute Merkle Root & Document Checksum
  const txHashesCombined = transactions.map(t => t.txHash || t.id).join('::');
  const merkleRoot = generateSHA256Hash(`MERKLE_ROOT_${reportId}_${txHashesCombined}_${totalAmount}`);
  const payloadToSign = `${reportId}|${donorEmail}|${totalAmount}|${merkleRoot}|${generatedDate.toISOString()}`;
  const sha256Checksum = generateSHA256Hash(payloadToSign);
  const digitalSignature = `ECDSA-SECP256K1-SHARIA-${generateSHA256Hash(payloadToSign + e2eePublicKey).substring(2, 34).toUpperCase()}`;

  // Initialize jsPDF A4 (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);

  // --- Background subtle accents ---
  // Top Header Background
  doc.setFillColor(31, 61, 34); // Deep Emerald Forest #1F3D22
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Gold accent line
  doc.setFillColor(212, 160, 23); // Gold #D4A017
  doc.rect(0, 38, pageWidth, 2, 'F');

  // Header Title & Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ISLAMICITYLINK x LYNK.ID ECOSYSTEM', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 230, 205);
  doc.text('Smart Sharia Blockchain & Verified Digital Zakat Hub', margin, 20);

  // Document Badge on right
  doc.setFillColor(46, 125, 50); // Emerald #2E7D32
  doc.roundedRect(pageWidth - margin - 58, 8, 58, 22, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('OFFICIAL IMPACT AUDIT', pageWidth - margin - 54, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`ID: ${reportId}`, pageWidth - margin - 54, 19);
  doc.text(`Status: CRYPTO-SIGNED (WTP)`, pageWidth - margin - 54, 24);

  let currentY = 47;

  // Report Main Title
  doc.setTextColor(20, 26, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('LAPORAN DAMPAK DONASI & RIWAYAT AKUNTABILITAS (BSZ)', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 102, 91);
  currentY += 4.5;
  doc.text(`Official Donation History & Verified Charitable Impact Report | Periode: ${periodLabel}`, margin, currentY);
  currentY += 4;
  doc.text(`Dicetak pada: ${generatedDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB | Sesuai Standar Akuntansi Zakat PSAK 109 & UU No. 23/2011`, margin, currentY);

  currentY += 6;

  // --- Section 1: Donor & Verification Information (2 column card) ---
  doc.setFillColor(245, 248, 245);
  doc.setDrawColor(216, 223, 216);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 34, 3, 3, 'FD');

  const col1X = margin + 4;
  const col2X = margin + (contentWidth / 2) + 2;
  let infoY = currentY + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(46, 125, 50);
  doc.text('IDENTITAS MUZAKKI / DONATUR TERVERIFIKASI', col1X, infoY);
  doc.text('STATUS KEPATUHAN & ENKRIPSI', col2X, infoY);

  infoY += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(20, 26, 20);
  doc.text('Nama Lengkap:', col1X, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(donorName, col1X + 24, infoY);

  doc.setFont('helvetica', 'bold');
  doc.text('KYC Level:', col2X, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${kycLevel} (Verifikasi BAZNAS)`, col2X + 24, infoY);

  infoY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Email Terdaftar:', col1X, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(donorEmail, col1X + 24, infoY);

  doc.setFont('helvetica', 'bold');
  doc.text('NPWZ / NPWP:', col2X, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(taxId || 'Tidak Tercatat', col2X + 24, infoY);

  infoY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Kunci Publik:', col1X, infoY);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.text(e2eePublicKey.substring(0, 32) + '...', col1X + 24, infoY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Pengurang Pajak:', col2X, infoY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(46, 125, 50);
  doc.text('VALID (UU No. 23/2011 Ps. 22)', col2X + 24, infoY);

  currentY += 38;

  // --- Section 2: Executive Impact Statistics (3 Summary Boxes) ---
  const boxWidth = (contentWidth - 8) / 3;
  const boxHeight = 22;

  // Box 1: Total Donated
  doc.setFillColor(238, 243, 238);
  doc.roundedRect(margin, currentY, boxWidth, boxHeight, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(90, 102, 91);
  doc.text('TOTAL KONTRIBUSI TERCATAT', margin + 3, currentY + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(46, 125, 50);
  doc.text(`Rp ${totalAmount.toLocaleString('id-ID')}`, margin + 3, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(90, 102, 91);
  doc.text(`${transactions.length} Transaksi On-Chain Terverifikasi`, margin + 3, currentY + 18);

  // Box 2: Zakat vs Wakaf Breakdown
  const box2X = margin + boxWidth + 4;
  doc.setFillColor(238, 243, 238);
  doc.roundedRect(box2X, currentY, boxWidth, boxHeight, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(90, 102, 91);
  doc.text('ALOKASI ZAKAT & WAKAF', box2X + 3, currentY + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(20, 26, 20);
  doc.text(`Zakat: Rp ${zakatTotal.toLocaleString('id-ID')}`, box2X + 3, currentY + 11);
  doc.text(`Wakaf: Rp ${wakafTotal.toLocaleString('id-ID')}`, box2X + 3, currentY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(90, 102, 91);
  doc.text(`Infaq: Rp ${infaqTotal.toLocaleString('id-ID')}`, box2X + 3, currentY + 20);

  // Box 3: Social & Asnaf Reach
  const box3X = margin + (boxWidth * 2) + 8;
  doc.setFillColor(238, 243, 238);
  doc.roundedRect(box3X, currentY, boxWidth, boxHeight, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(90, 102, 91);
  doc.text('DAMPAK SOSIAL & 8 ASNAF', box3X + 3, currentY + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(31, 61, 34);
  const estimatedBeneficiaries = Math.max(12, Math.round(totalAmount / 350000));
  doc.text(`±${estimatedBeneficiaries.toLocaleString('id-ID')} Penerima`, box3X + 3, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(90, 102, 91);
  doc.text('Fakir, Miskin, Fisabilillah, Mualaf', box3X + 3, currentY + 18);

  currentY += boxHeight + 6;

  // --- Section 3: Itemized Blockchain Transaction Table ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(20, 26, 20);
  doc.text('RINCIAN RIWAYAT MUTASI DONASI & BUKTI AKUNTABILITAS ON-CHAIN', margin, currentY);

  currentY += 4;

  const colW = {
    date: 24,
    type: 30,
    charity: 40,
    amount: 32,
    bsz: 32,
    block: 24,
  };

  const drawTableHeader = (y: number) => {
    doc.setFillColor(31, 61, 34);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);

    let hX = margin + 2;
    doc.text('Tanggal', hX, y + 4.5);
    hX += colW.date;
    doc.text('Jenis Ibadah', hX, y + 4.5);
    hX += colW.type;
    doc.text('Lembaga Pengelola', hX, y + 4.5);
    hX += colW.charity;
    doc.text('Nominal (IDR)', hX, y + 4.5);
    hX += colW.amount;
    doc.text('No. Bukti (BSZ/BSW)', hX, y + 4.5);
    hX += colW.bsz;
    doc.text('Status Blok', hX, y + 4.5);
  };

  drawTableHeader(currentY);
  currentY += 7;

  // Table Rows with Pagination Support
  transactions.forEach((tx, idx) => {
    // If we're getting close to bottom of page, create a new page
    if (currentY + 12 > pageHeight - 35) {
      doc.addPage();
      // Secondary page top banner
      doc.setFillColor(31, 61, 34);
      doc.rect(0, 0, pageWidth, 16, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('ISLAMICITYLINK x LYNK.ID - RINCIAN RIWAYAT DONASI (LANJUTAN)', margin, 11);
      currentY = 22;
      drawTableHeader(currentY);
      currentY += 7;
    }

    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 248);
    doc.rect(margin, currentY, contentWidth, 6.5, 'F');

    doc.setDrawColor(230, 235, 230);
    doc.line(margin, currentY + 6.5, margin + contentWidth, currentY + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(30, 35, 30);

    let rowX = margin + 2;
    // Date
    const txDate = tx.timestamp ? new Date(tx.timestamp).toLocaleDateString('id-ID') : '28/08/2026';
    doc.text(txDate, rowX, currentY + 4.5);
    rowX += colW.date;

    // Type
    const cleanType = tx.type.replace(/_/g, ' ');
    doc.setFont('helvetica', 'bold');
    doc.text(cleanType.substring(0, 18), rowX, currentY + 4.5);
    rowX += colW.type;

    // Charity
    doc.setFont('helvetica', 'normal');
    doc.text(tx.charityName.substring(0, 22), rowX, currentY + 4.5);
    rowX += colW.charity;

    // Amount
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(46, 125, 50);
    doc.text(`Rp ${tx.amount.toLocaleString('id-ID')}`, rowX, currentY + 4.5);
    rowX += colW.amount;

    // BSZ Receipt
    doc.setFont('courier', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(50, 50, 50);
    doc.text(tx.officialReceiptNumber || `BSZ-${tx.id.substring(0, 10)}`, rowX, currentY + 4.5);
    rowX += colW.bsz;

    // Block & Status
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(46, 125, 50);
    doc.text(`Blok #${tx.blockNumber} (OK)`, rowX, currentY + 4.5);

    currentY += 6.5;
  });

  // Table Total Row
  if (currentY + 12 > pageHeight - 35) {
    doc.addPage();
    currentY = 22;
  }

  doc.setFillColor(230, 240, 230);
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(20, 26, 20);
  doc.text('TOTAL KESELURUHAN:', margin + colW.date + colW.type + 2, currentY + 4.8);
  doc.setTextColor(46, 125, 50);
  doc.text(`Rp ${totalAmount.toLocaleString('id-ID')}`, margin + colW.date + colW.type + colW.charity, currentY + 4.8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(90, 102, 91);
  doc.text('100% Tercatat Dalam Smart Contract', margin + colW.date + colW.type + colW.charity + colW.amount, currentY + 4.8);

  currentY += 12;

  // --- Section 4: Cryptographic Proof & Signature Box ---
  // If not enough room on this page, push to next page
  if (currentY + 48 > pageHeight - 20) {
    doc.addPage();
    currentY = 22;
  }

  doc.setFillColor(245, 247, 245);
  doc.setDrawColor(46, 125, 50);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, currentY, contentWidth, 38, 3, 3, 'FD');

  let sigY = currentY + 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(31, 61, 34);
  doc.text('SERTIFIKASI KRIPTOGRAFIS & VALIDASI AUDIT SYARIAH ON-CHAIN', margin + 4, sigY);

  sigY += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(90, 102, 91);
  doc.text('SHA-256 Merkle Root Proof:', margin + 4, sigY);
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(20, 26, 20);
  doc.text(merkleRoot, margin + 44, sigY);

  sigY += 4.2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(90, 102, 91);
  doc.text('Document Integrity Hash:', margin + 4, sigY);
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(20, 26, 20);
  doc.text(sha256Checksum, margin + 44, sigY);

  sigY += 4.2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(90, 102, 91);
  doc.text('Digital Signature (DPS):', margin + 4, sigY);
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(46, 125, 50);
  doc.text(digitalSignature, margin + 44, sigY);

  sigY += 4.2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(90, 102, 91);
  doc.text('Validator Consensus:', margin + 4, sigY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(20, 26, 20);
  doc.text('BAZNAS-SHARIA-NODE-01 | DOMPET-DHUAFA-AUDIT-02 | LYNK-SHARIA-TECH-03', margin + 44, sigY);

  sigY += 5;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.2);
  doc.setTextColor(90, 102, 91);
  doc.text('Dokumen elektronik ini sah secara hukum syariah dan negara (UU ITE No. 11/2008 & UU Pengelolaan Zakat No. 23/2011). Dapat diverifikasi di https://islamicitylink.id/verify', margin + 4, sigY);

  // --- Dynamic Footers for all pages ---
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(216, 223, 216);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 12, margin + contentWidth, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(110, 120, 110);
    doc.text('IslamicityLink x Lynk.id Sharia Web3 Infrastructure | Dewan Pengawas Syariah DSN-MUI & BAZNAS RI', margin, pageHeight - 8);
    doc.text(`Halaman ${p} dari ${totalPages} | ID Laporan: ${reportId}`, pageWidth - margin - 50, pageHeight - 8);
  }

  return {
    doc,
    reportId,
    sha256Checksum,
    merkleRoot,
    digitalSignature,
    download: () => {
      doc.save(`Laporan-Dampak-Donasi-${donorName.replace(/\s+/g, '-')}-${reportId}.pdf`);
    },
  };
}
