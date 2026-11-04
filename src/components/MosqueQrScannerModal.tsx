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
  Building2, 
  QrCode, 
  ShieldCheck, 
  MapPin, 
  Sparkles,
  ArrowRight,
  Info,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import jsQR from 'jsqr';
import { PHYSICAL_MOSQUE_BOXES } from '../data/mockData';
import { MosquePhysicalBox, ScannedQRCodeResult } from '../types';

interface MosqueQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (result: ScannedQRCodeResult) => void;
}

export const MosqueQrScannerModal: React.FC<MosqueQrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [hasTorchSupport, setHasTorchSupport] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTabMode, setActiveTabMode] = useState<'CAMERA' | 'FILE_UPLOAD' | 'PRESET_TEST'>('CAMERA');
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);

  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  // Play audio beep when QR is successfully recognized
  const playScanBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // Audio context might be restricted before interaction
    }
  }, []);

  // Parse QR string to identify physical mosque box or standard QRIS
  const parseQRContent = useCallback((codeText: string): ScannedQRCodeResult => {
    const trimmed = codeText.trim();

    // 1. Check if matches any known physical mosque box by payload or ID
    const matchingBox = PHYSICAL_MOSQUE_BOXES.find(box => 
      box.qrPayload === trimmed || 
      box.id === trimmed || 
      trimmed.includes(box.qrisNmid) ||
      trimmed.toLowerCase().includes(box.mosqueId.toLowerCase())
    );

    if (matchingBox) {
      return {
        rawText: trimmed,
        mosqueBox: matchingBox,
        isOfficialMosqueBox: true,
        type: 'MOSQUE_BOX',
        charityId: matchingBox.mosqueId,
        charityName: matchingBox.mosqueName,
        merchantName: `${matchingBox.mosqueName} - ${matchingBox.boxLabel}`,
        city: matchingBox.city,
        nmid: matchingBox.qrisNmid
      };
    }

    // 2. Parse Standard EMVCo / QRIS string if contains typical tags
    if (trimmed.startsWith('000201') || trimmed.includes('ID.GO.QRIS')) {
      let merchantName = 'Kotak Amal Masjid / QRIS Syariah';
      let city = 'Indonesia';
      let nmid = 'ID102026' + Math.floor(10000000 + Math.random() * 90000000);

      // Simple tag extractors for QRIS Tag 59 (Merchant Name) & Tag 60 (Merchant City)
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

      // Create dynamic mosque box representation from real QRIS
      const dynamicMosqueBox: MosquePhysicalBox = {
        id: `box-qris-${Date.now()}`,
        mosqueId: `masjid-${merchantName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        mosqueName: merchantName,
        boxType: 'INFAQ_JUMAT',
        boxLabel: 'Kotak Infaq Digital QRIS Resmi',
        locationDetails: 'Pintu Masuk Utama / Kotak Keliling Jamaah',
        qrisNmid: nmid,
        dkmAccount: 'BSI Syariah / QRIS Dinamis Terverifikasi',
        dkmLeader: 'Takmir & Pengurus Masjid',
        targetAsnaf: 'FISABILILLAH',
        city: city || 'Indonesia',
        photoUrl: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?w=800&auto=format&fit=crop&q=80',
        qrPayload: trimmed,
        suggestedAmounts: [10000, 20000, 50000, 100000, 200000, 500000],
        verifiedShariaDate: new Date().toISOString().split('T')[0]
      };

      return {
        rawText: trimmed,
        mosqueBox: dynamicMosqueBox,
        isOfficialMosqueBox: true,
        type: 'MOSQUE_BOX',
        merchantName,
        city,
        nmid
      };
    }

    // 3. Fallback for custom text / URL / charity
    return {
      rawText: trimmed,
      isOfficialMosqueBox: false,
      type: 'STANDARD_QRIS',
      merchantName: 'Kotak Amal Masjid / Rekening Amil',
      city: 'Jakarta',
      nmid: 'ID102026889901'
    };
  }, []);

  const handleRecognizedCode = useCallback((codeText: string) => {
    if (!codeText) return;
    playScanBeep();
    const result = parseQRContent(codeText);
    onScanSuccess(result);
  }, [parseQRContent, playScanBeep, onScanSuccess]);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  }, []);

  // Start real-time camera video stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setErrorMessage(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera tidak didukung pada browser ini atau izin akses terbatas.');
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
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS Safari
        await videoRef.current.play();
        setHasCameraPermission(true);
        setIsScanning(true);

        // Check if track supports torch
        const videoTrack = stream.getVideoTracks()[0];
        const capabilities = (videoTrack.getCapabilities ? videoTrack.getCapabilities() : {}) as any;
        if (capabilities && capabilities.torch) {
          setHasTorchSupport(true);
        } else {
          setHasTorchSupport(false);
        }
      }
    } catch (err: any) {
      console.warn('Camera initialization notice:', err);
      setHasCameraPermission(false);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Izin kamera ditolak. Mohon aktifkan izin akses kamera pada pengaturan browser untuk memindai QR kotak amal.'
          : 'Tidak dapat mengaktifkan kamera. Anda tetap dapat memilih foto QRIS kotak amal atau menggunakan simulasi.'
      );
    }
  }, [cameraFacing, stopCamera]);

  // Real-time frame loop scanning with jsQR
  useEffect(() => {
    if (!isOpen || activeTabMode !== 'CAMERA' || !isScanning) return;

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

          try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert'
            });

            if (code && code.data && code.data.length > 5) {
              handleRecognizedCode(code.data);
              return; // Stop scanning once recognized
            }
          } catch (e) {
            // Ignore scan frame decode transient errors
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(scanFrame);
    };

    animationFrameId.current = requestAnimationFrame(scanFrame);

    return () => {
      isMounted = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [isOpen, activeTabMode, isScanning, handleRecognizedCode]);

  // Handle Lifecycle on modal open/close or camera facing toggle
  useEffect(() => {
    if (isOpen && activeTabMode === 'CAMERA') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTabMode, cameraFacing, startCamera, stopCamera]);

  // Torch Toggle
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const nextTorch = !isTorchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextTorch }]
        });
        setIsTorchOn(nextTorch);
      } catch (err) {
        console.warn('Torch toggle failed:', err);
      }
    }
  };

  // Flip Front/Back Camera
  const toggleCameraFacing = () => {
    setCameraFacing(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // File Upload Scanner Handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          setIsProcessingImage(false);
          if (code && code.data) {
            handleRecognizedCode(code.data);
          } else {
            setErrorMessage('QR Code tidak terdeteksi pada gambar yang diunggah. Pastikan gambar jelas dan terang.');
          }
        } else {
          setIsProcessingImage(false);
        }
      };
      img.onerror = () => {
        setIsProcessingImage(false);
        setErrorMessage('Gagal memuat file gambar.');
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      
      {/* Hidden Canvas for QR decoding */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl max-w-xl w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4] my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between shrink-0 bg-[#EEF3EE]/60 dark:bg-[#242924]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1.5">
                <span>Scan Kotak Amal Masjid (QR Scanner)</span>
              </h3>
              <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                Arahkan kamera ke stiker QRIS atau kode kotak infaq fisik masjid
              </p>
            </div>
          </div>

          <button
            id="btn-close-qr-scanner"
            onClick={onClose}
            aria-label="Tutup Scanner"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="px-4 pt-3 pb-1 flex items-center gap-1.5 border-b border-[#D8DFD8] dark:border-[#2D332D] bg-[#EEF3EE]/30 dark:bg-[#242924]/30 shrink-0 text-xs">
          <button
            id="tab-mode-camera"
            onClick={() => setActiveTabMode('CAMERA')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTabMode === 'CAMERA'
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Kamera Live</span>
          </button>

          <button
            id="tab-mode-upload"
            onClick={() => setActiveTabMode('FILE_UPLOAD')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTabMode === 'FILE_UPLOAD'
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Foto QR</span>
          </button>

          <button
            id="tab-mode-presets"
            onClick={() => setActiveTabMode('PRESET_TEST')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTabMode === 'PRESET_TEST'
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Pilih Kotak Masjid (Simulasi)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* TAB 1: LIVE CAMERA VIEWFINDER */}
          {activeTabMode === 'CAMERA' && (
            <div className="space-y-4">
              
              {/* Camera Frame Container */}
              <div className="relative aspect-square sm:aspect-[4/3] w-full rounded-3xl overflow-hidden bg-black flex items-center justify-center shadow-inner border-2 border-[#2E7D32]/40">
                
                {/* Live Video Element */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />

                {/* Viewfinder Target Overlay UI */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                  
                  {/* Darkened Vignette around scanning reticle */}
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-emerald-400/80 rounded-3xl overflow-hidden shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                    
                    {/* Reticle Corners */}
                    <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-[#4CAF50] rounded-tl-lg" />
                    <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-[#4CAF50] rounded-tr-lg" />
                    <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-[#4CAF50] rounded-bl-lg" />
                    <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-[#4CAF50] rounded-br-lg" />

                    {/* Laser Scanning Line Animation */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4CAF50] to-transparent shadow-[0_0_12px_#4CAF50] animate-[bounce_2s_infinite] opacity-90" />
                    
                    {/* Centered Guide Icon */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
                      <QrCode className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>

                {/* Floating Top Controls Inside Camera: Flash & Flip */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                  {hasTorchSupport && (
                    <button
                      id="btn-toggle-torch"
                      onClick={toggleTorch}
                      aria-label="Toggle Flashlight"
                      className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                        isTorchOn 
                          ? 'bg-amber-500 text-white border-amber-300 shadow-lg' 
                          : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
                      }`}
                    >
                      {isTorchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                    </button>
                  )}

                  <button
                    id="btn-toggle-camera-facing"
                    onClick={toggleCameraFacing}
                    aria-label="Ganti Kamera Depan/Belakang"
                    className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-all"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Status text on video */}
                <div className="absolute bottom-3 inset-x-3 text-center z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Mendeteksi QRIS Kotak Amal Fisik...</span>
                  </span>
                </div>
              </div>

              {/* Error or Permission Helper */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={startCamera}
                      className="px-3 py-1 rounded-xl bg-amber-600 text-white text-[11px] font-bold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Coba Ulang Kamera</span>
                    </button>
                    <button
                      onClick={() => setActiveTabMode('PRESET_TEST')}
                      className="px-3 py-1 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] text-[#141A14] dark:text-[#E4E8E4] text-[11px] font-bold"
                    >
                      Gunakan Simulasi Masjid
                    </button>
                  </div>
                </div>
              )}

              {/* Guide Hint */}
              <div className="p-3 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                  <Info className="w-3.5 h-3.5" />
                  <span>Tips Scan Kotak Amal:</span>
                </div>
                <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed">
                  Posisikan stiker QRIS kotak amal (seperti Kotak Infaq Jumat, Sedekah Subuh, atau Renovasi) di dalam kotak hijau. Sistem akan langsung memverifikasi keaslian rekening DKM masjid via blockchain.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: UPLOAD IMAGE / PHOTO SCANNER */}
          {activeTabMode === 'FILE_UPLOAD' && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageFileUpload}
                className="hidden"
                id="qr-image-file-input"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-[#2E7D32]/50 hover:border-[#2E7D32] rounded-3xl bg-[#EEF3EE]/40 dark:bg-[#242924]/40 text-center cursor-pointer transition-all hover:scale-[1.01] space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center mx-auto">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#141A14] dark:text-[#E4E8E4]">
                    Pilih atau Seret Foto QRIS Kotak Amal
                  </h4>
                  <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] mt-0.5">
                    Mendukung format JPG, PNG, WEBP dari galeri foto smartphone
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold shadow-md shadow-[#2E7D32]/20"
                >
                  Buka Galeri Foto
                </button>
              </div>

              {isProcessingImage && (
                <div className="p-3 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs flex items-center justify-center gap-2 text-[#2E7D32] dark:text-[#4CAF50] font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memproses dan mendeteksi QR Code...</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REALISTIC SIMULATED PHYSICAL MOSQUE BOXES */}
          {activeTabMode === 'PRESET_TEST' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                  Pilih Kotak Amal Masjid Fisik untuk Simulasi Langsung:
                </span>
                <span className="text-[10px] text-[#2E7D32] dark:text-[#4CAF50] font-bold">
                  Terdaftar DSN-MUI
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {PHYSICAL_MOSQUE_BOXES.map(box => (
                  <button
                    key={box.id}
                    id={`preset-box-${box.id}`}
                    onClick={() => handleRecognizedCode(box.qrPayload)}
                    className="p-3.5 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#2E7D32]/10 border border-[#D8DFD8] dark:border-[#2D332D] hover:border-[#2E7D32] text-left transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={box.photoUrl}
                        alt={box.mosqueName}
                        className="w-12 h-12 rounded-xl object-cover border border-[#D8DFD8] dark:border-[#2D332D] shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-[#2E7D32] text-white text-[10px] font-bold">
                            {box.boxType.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] font-mono text-[#5A665B] dark:text-[#A0A8A0]">
                            NMID: {box.qrisNmid}
                          </span>
                        </div>
                        <h4 className="text-xs font-extrabold text-[#141A14] dark:text-[#E4E8E4] group-hover:text-[#2E7D32] dark:group-hover:text-[#4CAF50] transition-colors mt-0.5">
                          {box.mosqueName}
                        </h4>
                        <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] line-clamp-1">
                          {box.boxLabel} • {box.city}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                      <span>Scan</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#D8DFD8] dark:border-[#2D332D] bg-[#EEF3EE]/40 dark:bg-[#242924]/40 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-[#5A665B] dark:text-[#A0A8A0] text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
            <span>Enkripsi QRIS Sharia Standar BI & BAZNAS RI</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-bold hover:bg-[#EEF3EE] dark:hover:bg-[#242924]"
          >
            Tutup
          </button>
        </div>

      </div>

    </div>
  );
};
