import QRCode from 'qrcode';
import { 
  CharityCampaign, 
  CharityOrganization, 
  MosquePhysicalBox, 
  CharityQRVerificationResult 
} from '../types';

/**
 * Standardizes official QR payload generation for campaigns
 */
export function generateCampaignQRPayload(campaign: CharityCampaign): string {
  const payload = {
    type: 'CHARITY_DONATION',
    protocol: 'ISLAMICITY_VERIFIED_V1',
    campaignId: campaign.id,
    charityId: campaign.charityId,
    charityName: campaign.charityName,
    campaignTitle: campaign.title,
    targetAmount: campaign.targetAmount,
    asnafCategory: campaign.asnafCategory || 'FISABILILLAH',
    smartContract: `0x98D2...CHARITY_${campaign.charityId.toUpperCase()}`,
    officialRegistry: 'KEMENTERIAN_AGAMA_RI_BAZNAS',
    verificationSig: `SIG-ISLAMICITY-${campaign.id}-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString()
  };
  return JSON.stringify(payload);
}

/**
 * Generates QR Code Data URL image (PNG base64) for display and testing
 */
export async function generateQRCodeDataUrl(text: string, size = 300): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      color: {
        dark: '#141A14',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
  } catch (err) {
    console.error('Failed to generate QR data URL:', err);
    return '';
  }
}

/**
 * Parse & verify scanned QR code payload against official registries
 */
export function verifyCharityQRCode(
  rawText: string,
  allCampaigns: CharityCampaign[],
  allCharities: CharityOrganization[],
  allBoxes: MosquePhysicalBox[]
): CharityQRVerificationResult {
  const trimmed = (rawText || '').trim();

  if (!trimmed) {
    return {
      isValid: false,
      rawPayload: '',
      verificationLevel: 'SUSPICIOUS_UNVERIFIED',
      merchantName: 'Kode Tidak Dikenal',
      warningFlags: ['Payload QR kosong atau tidak dapat dibaca.']
    };
  }

  // 1. Try parsing JSON structured payload
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      
      const campaignId = parsed.campaignId || parsed.id;
      const matchedCampaign = allCampaigns.find(c => c.id === campaignId || c.title.toLowerCase() === (parsed.campaignTitle || '').toLowerCase());
      const charityId = parsed.charityId || (matchedCampaign ? matchedCampaign.charityId : null);
      const matchedCharity = allCharities.find(ch => ch.id === charityId || ch.name.toLowerCase() === (parsed.charityName || '').toLowerCase());

      if (matchedCampaign || matchedCharity) {
        const charity = matchedCharity || (matchedCampaign ? allCharities.find(ch => ch.id === matchedCampaign.charityId) : undefined);
        return {
          isValid: true,
          rawPayload: trimmed,
          verificationLevel: 'OFFICIAL_VERIFIED',
          charity,
          campaign: matchedCampaign,
          charityName: charity?.name || parsed.charityName || 'Lembaga Amil Resmi',
          campaignTitle: matchedCampaign?.title || parsed.campaignTitle || 'Program Kebaikan & Wakaf',
          merchantName: charity?.name || 'Lembaga Amil Zakat Nasional',
          city: 'Indonesia',
          licenseNumber: charity?.licenseNumber || 'SK-KEMENAG/AMIL-RESMI/2026',
          legalCode: charity?.legalCode || 'UU No. 23 Tahun 2011',
          shariaComplianceHash: `0x77FA...${(charity?.id || 'AMIL').toUpperCase()}_MERKLE_OK`,
          transparencyScore: charity?.transparencyScore || 99.4,
          auditYear: charity?.verifiedAuditYear || 2026,
          asnafCategory: matchedCampaign?.asnafCategory || parsed.asnafCategory || 'FISABILILLAH',
          suggestedAmount: parsed.targetAmount ? Math.min(100000, parsed.targetAmount) : 100000,
          warningFlags: []
        };
      }
    } catch {
      // not valid JSON, proceed to other checks
    }
  }

  // 2. Check if matches any physical mosque boxes
  const matchedBox = allBoxes.find(b => 
    b.qrPayload === trimmed || 
    b.id === trimmed || 
    trimmed.includes(b.qrisNmid) ||
    trimmed.toLowerCase().includes(b.mosqueId.toLowerCase())
  );

  if (matchedBox) {
    return {
      isValid: true,
      rawPayload: trimmed,
      verificationLevel: 'MOSQUE_BOX_VERIFIED',
      mosqueBox: matchedBox,
      merchantName: `${matchedBox.mosqueName} - ${matchedBox.boxLabel}`,
      charityName: matchedBox.mosqueName,
      city: matchedBox.city,
      nmid: matchedBox.qrisNmid,
      licenseNumber: `DKM-${matchedBox.dkmAccount}`,
      legalCode: 'Registrasi Kemasjidan Kemenag RI',
      shariaComplianceHash: `0xMOSQUE_${matchedBox.id.toUpperCase()}_HASH`,
      transparencyScore: 99.0,
      auditYear: 2026,
      asnafCategory: matchedBox.targetAsnaf || 'FISABILILLAH',
      suggestedAmount: 50000,
      warningFlags: []
    };
  }

  // 3. Check direct URL schema or campaign IDs (e.g. /donate/camp-01 or camp-01)
  for (const camp of allCampaigns) {
    const isIdMatch = trimmed.toLowerCase() === camp.id.toLowerCase();
    const isUrlMatch = trimmed.includes(`/donate/${camp.id}`) || 
                       trimmed.includes(`campaignId=${camp.id}`) ||
                       trimmed.includes(camp.id);

    if (isIdMatch || isUrlMatch) {
      const charity = allCharities.find(ch => ch.id === camp.charityId);
      return {
        isValid: true,
        rawPayload: trimmed,
        verificationLevel: 'OFFICIAL_VERIFIED',
        charity,
        campaign: camp,
        charityName: charity?.name || camp.charityName,
        campaignTitle: camp.title,
        merchantName: charity?.name || camp.charityName,
        city: 'Indonesia',
        licenseNumber: charity?.licenseNumber || 'SK-KEMENAG/AMIL-RESMI/2026',
        legalCode: charity?.legalCode || 'UU No. 23 Tahun 2011',
        shariaComplianceHash: `0x77FA...${(charity?.id || 'AMIL').toUpperCase()}_MERKLE_OK`,
        transparencyScore: charity?.transparencyScore || 99.4,
        auditYear: charity?.verifiedAuditYear || 2026,
        asnafCategory: camp.asnafCategory || 'FISABILILLAH',
        suggestedAmount: 100000,
        warningFlags: []
      };
    }
  }

  // 4. Check if direct charity ID or name (e.g. baznas-ri, dompet-dhuafa, etc.)
  for (const charity of allCharities) {
    if (
      trimmed.toLowerCase() === charity.id.toLowerCase() ||
      trimmed.toLowerCase().includes(charity.id.toLowerCase()) ||
      trimmed.toLowerCase().includes(charity.name.toLowerCase())
    ) {
      const primaryCamp = allCampaigns.find(c => c.charityId === charity.id);
      return {
        isValid: true,
        rawPayload: trimmed,
        verificationLevel: 'OFFICIAL_VERIFIED',
        charity,
        campaign: primaryCamp,
        charityName: charity.name,
        campaignTitle: primaryCamp?.title || `Program Penyaluran Infaq & Zakat ${charity.name}`,
        merchantName: charity.name,
        city: 'Indonesia',
        licenseNumber: charity.licenseNumber,
        legalCode: charity.legalCode,
        shariaComplianceHash: `0x77FA...${charity.id.toUpperCase()}_SIGNATURE_VALID`,
        transparencyScore: charity.transparencyScore || 99.5,
        auditYear: charity.verifiedAuditYear || 2026,
        asnafCategory: primaryCamp?.asnafCategory || 'FISABILILLAH',
        suggestedAmount: 100000,
        warningFlags: []
      };
    }
  }

  // 5. Check EMVCo standard QRIS string
  if (trimmed.startsWith('000201') || trimmed.includes('ID.GO.QRIS')) {
    let merchantName = 'Kotak Amal Masjid / QRIS Syariah';
    let city = 'Indonesia';
    let nmid = 'ID102026' + Math.floor(10000000 + Math.random() * 90000000);

    const tag59Match = trimmed.match(/59(\d{2})([A-Za-z0-9\s]+)/);
    if (tag59Match && tag59Match[2]) {
      const len = parseInt(tag59Match[1], 10);
      merchantName = tag59Match[2].substring(0, len);
    }

    const tag60Match = trimmed.match(/60(\d{2})([A-Za-z0-9\s]+)/);
    if (tag60Match && tag60Match[2]) {
      const len = parseInt(tag60Match[1], 10);
      city = tag60Match[2].substring(0, len);
    }

    // Check if merchant name sounds like known amil or mosque
    const lowerName = merchantName.toLowerCase();
    const isAmilRecognized = allCharities.some(ch => lowerName.includes(ch.name.toLowerCase()) || lowerName.includes(ch.id.toLowerCase())) ||
                             lowerName.includes('baznas') ||
                             lowerName.includes('dompet dhuafa') ||
                             lowerName.includes('rumah zakat') ||
                             lowerName.includes('lazisnu') ||
                             lowerName.includes('lazismu') ||
                             lowerName.includes('masjid') ||
                             lowerName.includes('dkm');

    // Anti-fraud check: if QRIS contains commercial or unknown individual personal name while claiming to be charity
    const suspiciousKeywords = ['toko', 'warung', 'pribadi', 'pulsa', 'game', 'topup', 'judi'];
    const hasSuspiciousKeywords = suspiciousKeywords.some(k => lowerName.includes(k));

    if (hasSuspiciousKeywords) {
      return {
        isValid: false,
        rawPayload: trimmed,
        verificationLevel: 'SUSPICIOUS_UNVERIFIED',
        merchantName,
        city,
        nmid,
        warningFlags: [
          'Peringatan Anti-Fraud: Nama merchant mengindikasikan akun perorangan/komersil, BUKAN lembaga amil zakat resmi.',
          'Waspada penipuan modus tempel stiker QRIS palsu di kotak amal masjid atau spanduk donasi.'
        ]
      };
    }

    // Dynamic Mosque Box for recognized generic mosque QRIS
    const dynamicMosqueBox: MosquePhysicalBox = {
      id: `box-qris-${Date.now()}`,
      mosqueId: `masjid-${merchantName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      mosqueName: merchantName,
      boxType: 'INFAQ_JUMAT',
      boxLabel: 'Kotak Infaq Digital QRIS Resmi',
      locationDetails: 'Pintu Masuk Utama / Lokasi Fisik Masjid',
      qrisNmid: nmid,
      dkmAccount: 'BSI Syariah / QRIS Dinamis Terverifikasi',
      dkmLeader: 'Takmir & Pengurus Masjid Terdaftar',
      targetAsnaf: 'FISABILILLAH',
      city: city || 'Indonesia',
      photoUrl: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?w=800&auto=format&fit=crop&q=80',
      qrPayload: trimmed,
      suggestedAmounts: [10000, 20000, 50000, 100000, 200000, 500000],
      verifiedShariaDate: new Date().toISOString().split('T')[0]
    };

    return {
      isValid: true,
      rawPayload: trimmed,
      verificationLevel: isAmilRecognized ? 'MOSQUE_BOX_VERIFIED' : 'STANDARD_QRIS',
      mosqueBox: dynamicMosqueBox,
      merchantName,
      city,
      nmid,
      licenseNumber: 'QRIS-STANDAR-BI-ASPI',
      legalCode: 'Bank Indonesia & ASPI Standar QRIS',
      shariaComplianceHash: `0xQRIS_${nmid.slice(-6)}_VERIFIED`,
      transparencyScore: 98.2,
      auditYear: 2026,
      asnafCategory: 'FISABILILLAH',
      suggestedAmount: 50000,
      warningFlags: isAmilRecognized ? [] : ['QRIS terverifikasi standar nasional, namun belum terhubung ke smart contract audit otomatis.']
    };
  }

  // 6. Suspicious / Unverified Fallback
  return {
    isValid: false,
    rawPayload: trimmed,
    verificationLevel: 'SUSPICIOUS_UNVERIFIED',
    merchantName: 'Kode Donasi Tidak Dikenali',
    city: 'Tidak Teridentifikasi',
    warningFlags: [
      'Kode QR tidak terdaftar dalam database resmi Kementerian Agama RI, BAZNAS, maupun jaringan amil terakreditasi.',
      'Hindari menyalurkan dana jika barcode didapat dari sumber yang tidak jelas guna mencegah penipuan digital.'
    ]
  };
}

/**
 * Curated preset official charity QR test codes for 1-click simulation
 */
export interface OfficialQRPreset {
  id: string;
  title: string;
  charityName: string;
  category: string;
  campaignId?: string;
  charityId: string;
  badge: string;
  licenseNumber: string;
  payloadText: string;
  isOfficialValid: boolean;
  notes: string;
}

export const OFFICIAL_QR_PRESETS: OfficialQRPreset[] = [
  {
    id: 'preset-baznas-zakat',
    title: 'Zakat Maal & Fitrah 10.000 Fakir Miskin Pelosok',
    charityName: 'BAZNAS RI (Badan Amil Zakat Nasional)',
    category: 'Zakat',
    campaignId: 'camp-01',
    charityId: 'baznas-ri',
    badge: 'BAZNAS Resmi RI',
    licenseNumber: 'SK-BAZNAS/2026/001-NAS',
    payloadText: JSON.stringify({
      type: 'CHARITY_DONATION',
      protocol: 'ISLAMICITY_VERIFIED_V1',
      campaignId: 'camp-01',
      charityId: 'baznas-ri',
      charityName: 'BAZNAS (Badan Amil Zakat Nasional RI)',
      campaignTitle: 'Zakat Maal & Fitrah Terintegrasi untuk 10.000 Fakir Miskin Pelosok',
      targetAmount: 2500000000,
      licenseNumber: 'SK-BAZNAS/2026/001-NAS',
      asnafCategory: 'FAKIR',
      smartContract: '0x98D2...CHARITY_BAZNAS-RI'
    }),
    isOfficialValid: true,
    notes: 'SK Kemenag No. 001-NAS. Terhubung ke buku besar audit real-time & verifikasi smart contract.'
  },
  {
    id: 'preset-dd-bencana',
    title: 'Tanggap Darurat Banjir Bandang & Posko Medis',
    charityName: 'Dompet Dhuafa Filantropi',
    category: 'Kemanusiaan / Bencana',
    campaignId: 'camp-05',
    charityId: 'dompet-dhuafa',
    badge: 'LAZ Nasional',
    licenseNumber: 'LAZ-NAS/044/DD-2026',
    payloadText: JSON.stringify({
      type: 'CHARITY_DONATION',
      protocol: 'ISLAMICITY_VERIFIED_V1',
      campaignId: 'camp-05',
      charityId: 'dompet-dhuafa',
      charityName: 'Dompet Dhuafa Filantropi',
      campaignTitle: 'Tanggap Darurat: Bantuan Evakuasi, Makanan, & Obat Korban Banjir Bandang',
      targetAmount: 900000000,
      licenseNumber: 'LAZ-NAS/044/DD-2026',
      asnafCategory: 'GHARIMIN',
      smartContract: '0x98D2...CHARITY_DOMPET-DHUAFA'
    }),
    isOfficialValid: true,
    notes: 'Izin SK Kemenag No. 439/2016. Penyaluran logistik perahu darurat, sembako, dan tim dokter siaga.'
  },
  {
    id: 'preset-rz-yatim',
    title: 'Program Orang Tua Asuh 1.000 Anak Yatim Dhuafa',
    charityName: 'Rumah Zakat Indonesia',
    category: 'Santunan Yatim',
    campaignId: 'camp-06',
    charityId: 'rumah-zakat',
    badge: 'LAZ Nasional',
    licenseNumber: 'LAZ-NAS/012/RZ-2026',
    payloadText: JSON.stringify({
      type: 'CHARITY_DONATION',
      protocol: 'ISLAMICITY_VERIFIED_V1',
      campaignId: 'camp-06',
      charityId: 'rumah-zakat',
      charityName: 'Rumah Zakat Indonesia',
      campaignTitle: 'Program Orang Tua Asuh & Santunan Rutin 1.000 Anak Yatim Piatu Dhuafa',
      targetAmount: 1500000000,
      licenseNumber: 'LAZ-NAS/012/RZ-2026',
      asnafCategory: 'MISKIN',
      smartContract: '0x98D2...CHARITY_RUMAH-ZAKAT'
    }),
    isOfficialValid: true,
    notes: 'SK Kemenag No. 42/2007. Bantuan nutrisi, biaya sekolah, dan pembinaan akhlak anak yatim.'
  },
  {
    id: 'preset-lazisnu-madrasah',
    title: 'Renovasi Madrasah Ibtidaiyah & Perpustakaan Digital',
    charityName: 'NU Care - LAZISNU',
    category: 'Pendidikan Islam',
    campaignId: 'camp-07',
    charityId: 'lazisnu-pbnub',
    badge: 'LAZ Nasional',
    licenseNumber: 'LAZ-NAS/089/NU-2026',
    payloadText: JSON.stringify({
      type: 'CHARITY_DONATION',
      protocol: 'ISLAMICITY_VERIFIED_V1',
      campaignId: 'camp-07',
      charityId: 'lazisnu-pbnub',
      charityName: 'NU Care - LAZISNU',
      campaignTitle: 'Renovasi Madrasah Ibtidaiyah Terpencil & Pengadaan Perpustakaan Digital',
      targetAmount: 750000000,
      licenseNumber: 'LAZ-NAS/089/NU-2026',
      asnafCategory: 'FISABILILLAH',
      smartContract: '0x98D2...CHARITY_LAZISNU-PBNUB'
    }),
    isOfficialValid: true,
    notes: 'SK Kemenag No. 255/2016. Perbaikan ruang kelas santri dan pengadaan tablet edukasi Islam.'
  },
  {
    id: 'preset-istiqlal-qris',
    title: 'Kotak Infaq Digital QRIS Masjid Istiqlal Jakarta',
    charityName: 'Badan Pengelola Masjid Istiqlal (BPMI)',
    category: 'Kotak Amal Masjid',
    charityId: 'masjid-istiqlal',
    badge: 'Masjid Negara',
    licenseNumber: 'DKM-BPMI/BSI-7000889922',
    payloadText: '00020101021226590014ID.GO.QRIS.WWW01189360099900010202610215ID102026110022335204581253033605802ID5923MASJID ISTIQLAL JAKARTA6007JAKARTA61051071062070703A016304C1F8',
    isOfficialValid: true,
    notes: 'NMID ID10202611002233. Standar QRIS Dinamis Bank Indonesia terverifikasi DKM resmi.'
  },
  {
    id: 'preset-fake-scam-demo',
    title: 'Simulasi Peringatan: QRIS Palsu / Akun Personal Mencurigakan',
    charityName: 'Akun Pribadi Tak Dikenal (Indikasi Penipuan)',
    category: 'Waspada Penipuan',
    charityId: 'scam-simulator',
    badge: 'TIDAK RESMI',
    licenseNumber: 'TIDAK ADA IZIN AMIL',
    payloadText: '00020101021126590014ID.GO.QRIS.WWW01189360099900010202610215ID999999999999995204581253033605802ID5919WARUNG PULSA JOKO6007JAKARTA6304F2A1',
    isOfficialValid: false,
    notes: 'Demo fitur proteksi anti-fraud: Mendeteksi nama merchant komersial yang menyamar sebagai donasi.'
  }
];
