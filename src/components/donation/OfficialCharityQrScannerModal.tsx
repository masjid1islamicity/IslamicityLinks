import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  FlipHorizontal, 
  Zap, 
  ZapOff, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  Building2, 
  QrCode, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Info,
  RefreshCw,
  Copy,
  Check,
  Search,
  ExternalLink,
  Lock,
  Layers,
  HeartHandshake,
  FileCheck2,
  Share2
} from 'lucide-react';
import jsQR from 'jsqr';
import { 
  CharityCampaign, 
  CharityOrganization, 
  MosquePhysicalBox, 
  CharityQRVerificationResult 
} from '../../types';
import { 
  verifyCharityQRCode, 
  generateQRCodeDataUrl, 
  OFFICIAL_QR_PRESETS, 
  OfficialQRPreset 
} from '../../utils/qrCodeHelper';
import confetti from 'canvas-confetti';

interface OfficialCharityQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: CharityCampaign[];
  charities: CharityOrganization[];
  mosqueBoxes: MosquePhysicalBox[];
  onConfirmDonation: (verification: CharityQRVerificationResult) => void;
}

export const OfficialCharityQrScannerModal: React.FC<OfficialCharityQrScannerModalProps> = ({
  isOpen,
  onClose,
  campaigns,
  charities,
  mosqueBoxes,
  onConfirmDonation
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTabMode, setActiveTabMode] = useState<'CAMERA' | 'FILE_UPLOAD' | 'PRESET_TEST' | 'MANUAL_INPUT'>('CAMERA');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [hasTorchSupport, setHasTorchSupport] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);

  // Manual input state
  const [manualCodeInput, setManualCodeInput] = useState<string>('');

  // Scanned verification result
  const [verificationResult, setVerificationResult] = useState<CharityQRVerificationResult | null>(null);
  const [copiedProof, setCopiedProof] = useState<boolean>(false);

  // Preset QR preview modal/image cache
  const [presetQRImages, setPresetQRImages] = useState<Record<string, string>>({});
  const [previewingPreset, setPreviewingPreset] = useState<OfficialQRPreset | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Play pleasant sound on successful QR scan
  const playScanBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(784, audioCtx.currentTime); // G5 note
      osc.frequency.exponentialRampToValueAtTime(1046.5, audioCtx.currentTime + 0.12); // C6
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch {
      // AudioContext could be silenced before user gesture
    }
  }, []);

  // Pre-generate QR data URLs for presets
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const loadPresetImages = async () => {
      const imageMap: Record<string, string> = {};
      for (const preset of OFFICIAL_QR_PRESETS) {
        try {
          const dataUrl = await generateQRCodeDataUrl(preset.payloadText, 240);
          if (isMounted) {
            imageMap[preset.id] = dataUrl;
          }
        } catch {
          // ignore error
        }
      }
      if (isMounted) {
        setPresetQRImages(imageMap);
      }
    };

    loadPresetImages();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Handle scanned raw QR code text
  const handleProcessRawText = useCallback((rawText: string) => {
    if (!rawText || !rawText.trim()) return;

    playScanBeep();
    const verified = verifyCharityQRCode(rawText, campaigns, charities, mosqueBoxes);
    setVerificationResult(verified);

    if (verified.isValid) {
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#2E7D32', '#4CAF50', '#81C784']
        });
      } catch {}
    }
  }, [playScanBeep, campaigns, charities, mosqueBoxes]);

  // Cleanly stop camera media tracks
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    setIsScanning(false);
  }, []);

  // Initialize camera
  const startCamera = useCallback(async () => {
    stopCamera();
    setErrorMessage(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera tidak didukung pada browser ini atau lingkungan iframe membatasi akses perangkat.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setHasCameraPermission(true);
        setIsScanning(true);

        const videoTrack = stream.getVideoTracks()[0];
        const capabilities = (videoTrack.getCapabilities ? videoTrack.getCapabilities() : {}) as any;
        setHasTorchSupport(Boolean(capabilities && capabilities.torch));
      }
    } catch (err: any) {
      console.warn('Camera stream notice:', err);
      setHasCameraPermission(false);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Izin kamera ditolak. Silakan izinkan akses kamera di peramban, atau gunakan fitur "Unggah Foto QR" & "Contoh Kode QR Resmi".'
          : 'Kamera tidak dapat diakses pada browser ini. Anda dapat mengunggah foto kode QR atau memilih preset contoh resmi.'
      );
    }
  }, [cameraFacing, stopCamera]);

  // Real-time camera scanning loop with jsQR
  useEffect(() => {
    if (!isOpen || activeTabMode !== 'CAMERA' || !isScanning || verificationResult) {
      stopCamera();
      return;
    }

    startCamera();

    let isMounted = true;
    const scanFrame = () => {
      if (!isMounted) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code && code.data) {
            handleProcessRawText(code.data);
            return; // stop scanning once found
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(scanFrame);
    };

    animationFrameId.current = requestAnimationFrame(scanFrame);

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [isOpen, activeTabMode, isScanning, verificationResult, startCamera, stopCamera, handleProcessRawText]);

  // Flip camera between environment (rear) and user (front)
  const toggleCameraFacing = () => {
    setCameraFacing(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Toggle flashlight torch if supported
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        await (track as any).applyConstraints({
          advanced: [{ torch: !isTorchOn }]
        });
        setIsTorchOn(!isTorchOn);
      } catch (err) {
        console.warn('Torch constraint error:', err);
      }
    }
  };

  // Process uploaded image file
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessingImage(false);
          setErrorMessage('Gagal memproses kanvas gambar.');
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth'
        });

        setIsProcessingImage(false);

        if (code && code.data) {
          handleProcessRawText(code.data);
        } else {
          setErrorMessage('Kode QR tidak terdeteksi pada gambar yang diunggah. Pastikan gambar jelas dan tidak buram.');
        }
      };

      img.onerror = () => {
        setIsProcessingImage(false);
        setErrorMessage('Format gambar tidak didukung atau berkas rusak.');
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
    // Reset file input so same file can be uploaded again if needed
    e.target.value = '';
  };

  // Handle manual code submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodeInput.trim()) return;
    handleProcessRawText(manualCodeInput.trim());
  };

  // Reset scanner to scan another code
  const handleScanAnother = () => {
    setVerificationResult(null);
    setErrorMessage(null);
    setManualCodeInput('');
  };

  // Copy cryptographic verification signature
  const handleCopyProof = () => {
    if (!verificationResult) return;
    const proofText = `[VERIFIKASI DONASI ISLAMICITY]
Lembaga: ${verificationResult.charityName || verificationResult.merchantName}
Program: ${verificationResult.campaignTitle || 'Donasi Resmi'}
SK Kemenag / Legalitas: ${verificationResult.licenseNumber || verificationResult.legalCode}
Hash Audit Syariah: ${verificationResult.shariaComplianceHash}
Nilai Transparansi: ${verificationResult.transparencyScore}%
Status: ${verificationResult.isValid ? 'TERAKREDITASI & AMAN' : 'TIDAK TERDAFTAR'}
Waktu: ${new Date().toLocaleString('id-ID')}`;

    navigator.clipboard.writeText(proofText);
    setCopiedProof(true);
    setTimeout(() => setCopiedProof(false), 2500);
  };

  // Confirm donation and proceed to form
  const handleProceedToDonate = () => {
    if (!verificationResult) return;
    onConfirmDonation(verificationResult);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl max-w-xl w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4] my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2E7D32] to-[#1F3D22] text-white flex items-center justify-center shadow-md shadow-[#2E7D32]/25">
              <QrCode className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] border border-[#2E7D32]/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verifikasi Amil & QRIS Resmi</span>
                </span>
              </div>
              <h3 className="font-black text-base sm:text-lg text-[#141A14] dark:text-[#E4E8E4]">
                Pindai Kode QR Donasi
              </h3>
            </div>
          </div>

          <button
            id="btn-close-qr-scanner-modal"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-[#242924] dark:hover:bg-[#2D332D] text-gray-500 dark:text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector (When not viewing a result) */}
        {!verificationResult && (
          <div className="flex items-center gap-1 p-2 bg-[#EEF3EE] dark:bg-[#151815] border-b border-[#D8DFD8] dark:border-[#2D332D] text-xs font-bold overflow-x-auto">
            <button
              id="tab-scanner-camera"
              onClick={() => setActiveTabMode('CAMERA')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                activeTabMode === 'CAMERA'
                  ? 'bg-white dark:bg-[#242924] text-[#2E7D32] dark:text-[#4CAF50] shadow-sm font-extrabold'
                  : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14]'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Kamera Langsung</span>
            </button>

            <button
              id="tab-scanner-upload"
              onClick={() => setActiveTabMode('FILE_UPLOAD')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                activeTabMode === 'FILE_UPLOAD'
                  ? 'bg-white dark:bg-[#242924] text-[#2E7D32] dark:text-[#4CAF50] shadow-sm font-extrabold'
                  : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14]'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Unggah Foto QR</span>
            </button>

            <button
              id="tab-scanner-presets"
              onClick={() => setActiveTabMode('PRESET_TEST')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                activeTabMode === 'PRESET_TEST'
                  ? 'bg-white dark:bg-[#242924] text-[#2E7D32] dark:text-[#4CAF50] shadow-sm font-extrabold'
                  : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Contoh Kode Resmi</span>
            </button>

            <button
              id="tab-scanner-manual"
              onClick={() => setActiveTabMode('MANUAL_INPUT')}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                activeTabMode === 'MANUAL_INPUT'
                  ? 'bg-white dark:bg-[#242924] text-[#2E7D32] dark:text-[#4CAF50] shadow-sm font-extrabold'
                  : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Input Teks</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">

          {/* VIEW 1: VERIFICATION RESULT CARD (When a code is recognized) */}
          {verificationResult ? (
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              
              {/* Status Header Badge */}
              <div className={`p-4 rounded-2xl border ${
                verificationResult.isValid
                  ? verificationResult.verificationLevel === 'MOSQUE_BOX_VERIFIED'
                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-900 dark:text-teal-200'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    verificationResult.isValid
                      ? verificationResult.verificationLevel === 'MOSQUE_BOX_VERIFIED'
                        ? 'bg-teal-600 text-white'
                        : 'bg-[#2E7D32] text-white'
                      : 'bg-rose-600 text-white'
                  }`}>
                    {verificationResult.isValid ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <AlertTriangle className="w-6 h-6" />
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/40">
                        {verificationResult.isValid
                          ? verificationResult.verificationLevel === 'MOSQUE_BOX_VERIFIED'
                            ? 'Kotak Amal Masjid Terverifikasi DKM'
                            : 'Lembaga Amil Zakat Terakreditasi Resmi'
                          : 'Peringatan: Kode Tidak Terakreditasi'}
                      </span>
                      <span className="text-xs font-bold opacity-80">
                        Audit: {verificationResult.auditYear || '2026'}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base sm:text-lg leading-tight">
                      {verificationResult.charityName || verificationResult.merchantName}
                    </h4>

                    <p className="text-xs opacity-90 leading-relaxed">
                      {verificationResult.isValid
                        ? 'Identitas penerima aman syar\'i, terdaftar di Kementerian Agama RI / BAZNAS, dan terlindungi dari manipulasi QRIS.'
                        : 'Kode QR ini tidak ditemukan dalam buku besar lembaga resmi atau terindikasi akun pribadi komersial.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning flags if any */}
              {verificationResult.warningFlags && verificationResult.warningFlags.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Catatan Keamanan & Anti-Fraud:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90">
                    {verificationResult.warningFlags.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Campaign / Organization Details Card */}
              <div className="bg-[#EEF3EE] dark:bg-[#242924] rounded-2xl p-4 border border-[#D8DFD8] dark:border-[#2D332D] space-y-3 text-xs">
                {verificationResult.campaignTitle && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5A665B] dark:text-[#A0A8A0] block">
                      Program Bantuan Terkait:
                    </span>
                    <p className="font-extrabold text-sm text-[#141A14] dark:text-[#E4E8E4]">
                      {verificationResult.campaignTitle}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5A665B] dark:text-[#A0A8A0] block">
                      Izin / Legalitas:
                    </span>
                    <span className="font-semibold text-xs text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1">
                      <FileCheck2 className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
                      <span className="truncate">{verificationResult.licenseNumber || 'SK Kemenag RI'}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5A665B] dark:text-[#A0A8A0] block">
                      Transparansi Audit:
                    </span>
                    <span className="font-bold text-xs text-[#2E7D32] dark:text-[#4CAF50] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{verificationResult.transparencyScore || 99.4}% Skor Akuntabel</span>
                    </span>
                  </div>

                  {verificationResult.asnafCategory && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#5A665B] dark:text-[#A0A8A0] block">
                        Alokasi 8 Asnaf:
                      </span>
                      <span className="font-semibold text-xs text-[#141A14] dark:text-[#E4E8E4]">
                        {verificationResult.asnafCategory}
                      </span>
                    </div>
                  )}

                  {verificationResult.city && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#5A665B] dark:text-[#A0A8A0] block">
                        Wilayah / Domisili:
                      </span>
                      <span className="font-semibold text-xs text-[#141A14] dark:text-[#E4E8E4]">
                        {verificationResult.city}
                      </span>
                    </div>
                  )}
                </div>

                {/* Cryptographic hash proof */}
                {verificationResult.shariaComplianceHash && (
                  <div className="pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between text-[11px]">
                    <div className="space-y-0.5 truncate mr-2">
                      <span className="text-[10px] uppercase font-bold text-[#5A665B] dark:text-[#A0A8A0] block">
                        Kunci Kriptografi Audit:
                      </span>
                      <code className="text-[10px] font-mono text-[#2E7D32] dark:text-[#4CAF50] truncate block">
                        {verificationResult.shariaComplianceHash}
                      </code>
                    </div>

                    <button
                      id="btn-copy-verification-hash"
                      onClick={handleCopyProof}
                      className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] font-bold text-[10px] flex items-center gap-1 shrink-0 hover:bg-[#EEF3EE]"
                    >
                      {copiedProof ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Bukti</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {verificationResult.isValid ? (
                  <button
                    id="btn-confirm-proceed-donation"
                    onClick={handleProceedToDonate}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-black text-sm shadow-xl shadow-[#2E7D32]/30 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
                  >
                    <HeartHandshake className="w-5 h-5" />
                    <span>Lanjutkan Donasi Terverifikasi</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                ) : (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs text-center font-medium">
                    ⚠️ Donasi dibatalkan otomatis untuk perlindungan dana muzakki dari potensi penipuan QRIS ilegal.
                  </div>
                )}

                <button
                  id="btn-scan-another-qr"
                  onClick={handleScanAnother}
                  className="w-full py-3 px-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Pindai Kode QR Lain</span>
                </button>
              </div>

            </div>
          ) : (
            /* VIEW 2: SCANNER TABS */
            <>
              {/* TAB 1: LIVE CAMERA SCANNER */}
              {activeTabMode === 'CAMERA' && (
                <div className="space-y-4">
                  {/* Camera Viewport */}
                  <div className="relative aspect-square max-w-sm mx-auto bg-slate-950 rounded-3xl overflow-hidden border-2 border-[#2E7D32]/40 shadow-inner flex items-center justify-center">
                    
                    {/* Native Video Feed */}
                    <video
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full object-cover"
                      playsInline
                      muted
                    />

                    {/* Hidden canvas for jsQR analysis */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Viewfinder Target Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                      <div className="relative w-full h-full max-w-[240px] max-h-[240px] border-2 border-[#4CAF50]/60 rounded-2xl">
                        
                        {/* 4 Corner Markers */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#4CAF50] rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#4CAF50] rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#4CAF50] rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#4CAF50] rounded-br-lg" />

                        {/* Animated Laser Scanning Line */}
                        <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#4CAF50] to-transparent shadow-[0_0_12px_#4CAF50] animate-[bounce_2.5s_infinite]" />

                        {/* Center Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                          <QrCode className="w-16 h-16 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Camera Control Buttons inside viewport */}
                    <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                      {hasTorchSupport && (
                        <button
                          onClick={toggleTorch}
                          className="p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-all"
                          title="Flashlight"
                        >
                          {isTorchOn ? <Zap className="w-4 h-4 text-amber-400" /> : <ZapOff className="w-4 h-4" />}
                        </button>
                      )}
                      <button
                        onClick={toggleCameraFacing}
                        className="p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-all"
                        title="Ganti Kamera"
                      >
                        <FlipHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom Status bar inside viewport */}
                    <div className="absolute bottom-3 inset-x-3 text-center pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-medium backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Arahkan kamera ke QRIS amil atau kotak amal
                      </span>
                    </div>

                    {/* Error message inside viewport if camera blocked */}
                    {errorMessage && (
                      <div className="absolute inset-4 bg-slate-950/95 rounded-2xl p-4 flex flex-col items-center justify-center text-center text-white space-y-3 z-20">
                        <AlertCircle className="w-10 h-10 text-amber-400" />
                        <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
                          {errorMessage}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={startCamera}
                            className="px-3 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-xs font-bold"
                          >
                            Coba Lagi
                          </button>
                          <button
                            onClick={() => setActiveTabMode('PRESET_TEST')}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300"
                          >
                            Uji Contoh Resmi
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  <p className="text-center text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                    Pindai barcode QRIS resmi BAZNAS, LAZ, atau kotak amal masjid fisik. Sistem otomatis memverifikasi keabsahan izin amil dan anti-penipuan.
                  </p>
                </div>
              )}

              {/* TAB 2: FILE UPLOAD SCANNER */}
              {activeTabMode === 'FILE_UPLOAD' && (
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#2E7D32]/50 hover:border-[#2E7D32] bg-[#EEF3EE] dark:bg-[#242924] rounded-3xl p-8 text-center cursor-pointer transition-all hover:scale-[1.01] flex flex-col items-center justify-center space-y-3"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                      id="input-qr-file-upload"
                    />

                    <div className="w-16 h-16 rounded-2xl bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center">
                      {isProcessingImage ? (
                        <RefreshCw className="w-8 h-8 animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8" />
                      )}
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-[#141A14] dark:text-[#E4E8E4]">
                        {isProcessingImage ? 'Memindai Gambar...' : 'Pilih atau Tarik Foto Kode QR'}
                      </h4>
                      <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] mt-1 max-w-xs">
                        Mendukung tangkapan layar (screenshot) QRIS, selebaran donasi, brosur madrasah, atau foto dokumen JPG/PNG/WebP.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold shadow-md shadow-[#2E7D32]/25"
                    >
                      Pilih Gambar dari Perangkat
                    </button>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Tips:</strong> Pastikan kode QR dalam foto tidak terpotong, beresolusi cukup, dan bebas bayangan tebal agar modul deteksi dapat membaca data seketika.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: CURATED OFFICIAL PRESETS (1-CLICK TEST) */}
              {activeTabMode === 'PRESET_TEST' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#141A14] dark:text-[#E4E8E4]">
                        Contoh Barcode Resmi & Simulasi Verifikasi
                      </h4>
                      <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                        Klik salah satu contoh untuk mensimulasikan hasil pemindaian langsung.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {OFFICIAL_QR_PRESETS.map((preset) => {
                      const qrImg = presetQRImages[preset.id];

                      return (
                        <div
                          key={preset.id}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            preset.isOfficialValid
                              ? 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] hover:border-[#2E7D32]/60'
                              : 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-300/40 dark:border-rose-800/40'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            {/* QR Thumbnail if generated */}
                            {qrImg && (
                              <button
                                onClick={() => setPreviewingPreset(preset)}
                                className="w-14 h-14 bg-white p-1 rounded-xl border border-gray-200 dark:border-gray-700 shrink-0 shadow-sm hover:scale-105 transition-transform"
                                title="Perbesar Kode QR"
                              >
                                <img src={qrImg} alt="QR Code" className="w-full h-full object-contain" />
                              </button>
                            )}

                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                  preset.isOfficialValid
                                    ? 'bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50]'
                                    : 'bg-rose-500/15 text-rose-700 dark:text-rose-400'
                                }`}>
                                  {preset.badge}
                                </span>
                                <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] font-semibold">
                                  {preset.category}
                                </span>
                              </div>

                              <h5 className="font-extrabold text-xs text-[#141A14] dark:text-[#E4E8E4] leading-tight">
                                {preset.title}
                              </h5>

                              <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] line-clamp-1">
                                {preset.notes}
                              </p>
                            </div>

                            <button
                              id={`btn-preset-test-${preset.id}`}
                              onClick={() => handleProcessRawText(preset.payloadText)}
                              className={`px-3 py-2 rounded-xl text-xs font-extrabold shrink-0 flex items-center gap-1 transition-all ${
                                preset.isOfficialValid
                                  ? 'bg-[#2E7D32] hover:bg-[#256629] text-white shadow-sm'
                                  : 'bg-rose-600 hover:bg-rose-700 text-white'
                              }`}
                            >
                              <span>Uji & Verifikasi</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: MANUAL TEXT INPUT */}
              {activeTabMode === 'MANUAL_INPUT' && (
                <form onSubmit={handleManualSubmit} className="space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-[#141A14] dark:text-[#E4E8E4] block">
                      Tempel Kode QRIS / Tautan Donasi / ID Program:
                    </label>
                    <textarea
                      id="input-manual-qr-text"
                      rows={4}
                      value={manualCodeInput}
                      onChange={(e) => setManualCodeInput(e.target.value)}
                      placeholder='Contoh: camp-01, atau format EMVCo "0002010102...", atau JSON payload donasi...'
                      className="w-full p-3 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-2xl text-xs font-mono text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                    />
                  </div>

                  <button
                    type="submit"
                    id="btn-submit-manual-qr"
                    disabled={!manualCodeInput.trim()}
                    className="w-full py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-[#2E7D32]/25 flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Verifikasi Sekarang</span>
                  </button>
                </form>
              )}
            </>
          )}

        </div>

        {/* Footer info banner */}
        {!verificationResult && (
          <div className="p-3 bg-[#EEF3EE] dark:bg-[#151815] border-t border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between text-[11px] text-[#5A665B] dark:text-[#A0A8A0] px-5">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span>Proteksi Anti-Fraud & Audit Syariah Kemenag RI</span>
            </div>
            <span className="font-mono text-[10px]">v1.4.0 Engine</span>
          </div>
        )}

      </div>

      {/* Preset QR Zoom Preview Modal */}
      {previewingPreset && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl border border-gray-200 dark:border-gray-800">
            <h4 className="font-black text-sm text-[#141A14] dark:text-[#E4E8E4]">
              {previewingPreset.title}
            </h4>

            {presetQRImages[previewingPreset.id] && (
              <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 inline-block shadow-md">
                <img
                  src={presetQRImages[previewingPreset.id]}
                  alt={previewingPreset.title}
                  className="w-56 h-56 object-contain"
                />
              </div>
            )}

            <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
              Anda dapat memindai barcode ini menggunakan ponsel lain atau klik tombol di bawah untuk verifikasi instan.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleProcessRawText(previewingPreset.payloadText);
                  setPreviewingPreset(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#2E7D32] text-white font-bold text-xs"
              >
                Verifikasi Kode Ini
              </button>
              <button
                onClick={() => setPreviewingPreset(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
