import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  X, 
  Download, 
  Share2, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink,
  Building2,
  FileCheck2
} from 'lucide-react';
import { CharityCampaign, CharityOrganization } from '../../types';
import { generateCampaignQRPayload, generateQRCodeDataUrl } from '../../utils/qrCodeHelper';

interface CampaignQrViewModalProps {
  campaign: CharityCampaign | null;
  charity?: CharityOrganization;
  isOpen: boolean;
  onClose: () => void;
  onScanThisCode?: (payload: string) => void;
}

export const CampaignQrViewModal: React.FC<CampaignQrViewModalProps> = ({
  campaign,
  charity,
  isOpen,
  onClose,
  onScanThisCode
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !campaign) {
      setQrDataUrl('');
      return;
    }

    let isMounted = true;
    const generateQR = async () => {
      const payload = generateCampaignQRPayload(campaign);
      const url = await generateQRCodeDataUrl(payload, 320);
      if (isMounted) {
        setQrDataUrl(url);
      }
    };

    generateQR();
    return () => {
      isMounted = false;
    };
  }, [isOpen, campaign]);

  if (!isOpen || !campaign) return null;

  const handleCopyPayload = () => {
    const payload = generateCampaignQRPayload(campaign);
    navigator.clipboard.writeText(payload);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QRIS-Resmi-${campaign.id}-${campaign.charityId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4] my-auto space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D8DFD8] dark:border-[#2D332D]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2E7D32] dark:text-[#4CAF50] block">
                Kode QR Resmi Terverifikasi
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-[#141A14] dark:text-[#E4E8E4]">
                QRIS & Smart Contract Donasi
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-[#242924] dark:hover:bg-[#2D332D] text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Campaign Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32] dark:text-[#4CAF50]">
            <Building2 className="w-3.5 h-3.5" />
            <span>{campaign.charityName}</span>
            <span className="text-gray-400">•</span>
            <span className="px-2 py-0.2 rounded-full bg-[#2E7D32]/15 text-[10px] font-bold">
              {charity?.licenseNumber || 'SK Kemenag RI'}
            </span>
          </div>
          <h4 className="font-bold text-sm text-[#141A14] dark:text-[#E4E8E4] leading-snug">
            {campaign.title}
          </h4>
        </div>

        {/* QR Display */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-white p-4 rounded-3xl border-2 border-[#2E7D32]/30 shadow-lg relative group">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Code ${campaign.title}`}
                className="w-56 h-56 object-contain"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center bg-gray-50 text-xs text-gray-400">
                Membuat Kode QR...
              </div>
            )}

            {/* Official seal watermark in center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-white shadow-md border-2 border-[#2E7D32] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#2E7D32]" />
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-[#5A665B] dark:text-[#A0A8A0] max-w-xs">
            Pindai dengan aplikasi mobile banking, e-wallet syariah (QRIS), atau kamera IslamicityLink.
          </p>
        </div>

        {/* Security badges */}
        <div className="p-3 bg-[#EEF3EE] dark:bg-[#242924] rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
            <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">Audit Anti-Tamper</span>
          </div>
          <span className="font-mono text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
            ID: {campaign.id}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={handleDownloadQR}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#2E7D32]/25"
          >
            <Download className="w-4 h-4" />
            <span>Unduh QR</span>
          </button>

          <button
            onClick={handleCopyPayload}
            className="px-3 py-2.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#D8DFD8] dark:border-[#2D332D]"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'Tersalin' : 'Salin Kode'}</span>
          </button>

          {onScanThisCode && (
            <button
              onClick={() => {
                onScanThisCode(generateCampaignQRPayload(campaign));
                onClose();
              }}
              className="px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              title="Uji Verifikasi di Scanner"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Verifikasi</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
