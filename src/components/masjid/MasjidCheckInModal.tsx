import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Star,
  Users,
  Compass,
  FileText,
  Tag,
  ShieldCheck,
  Award,
  ChevronDown
} from 'lucide-react';
import {
  MasjidLocation,
  MasjidVisitRecord,
  MasjidVisitPrayer,
  MasjidVisitPurpose
} from '../../types';
import {
  PRAYER_OPTIONS,
  PURPOSE_OPTIONS,
  MasjidVisitStorage
} from '../../utils/masjidVisitStorage';

interface MasjidCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  masjids: MasjidLocation[];
  initialMasjid?: MasjidLocation | null;
  userCoords?: { lat: number; lng: number };
  onVisitSaved: (savedRecord: MasjidVisitRecord) => void;
}

export const MasjidCheckInModal: React.FC<MasjidCheckInModalProps> = ({
  isOpen,
  onClose,
  masjids,
  initialMasjid,
  userCoords,
  onVisitSaved,
}) => {
  const [selectedMasjidId, setSelectedMasjidId] = useState<string>(
    initialMasjid?.id || (masjids[0]?.id || '')
  );

  // Form State
  const [visitDate, setVisitDate] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  });
  const [visitTime, setVisitTime] = useState<string>(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });

  const [prayerTime, setPrayerTime] = useState<MasjidVisitPrayer>('DHUHR');
  const [purpose, setPurpose] = useState<MasjidVisitPurpose>('SHALAT_FARDHU');
  const [withCongregation, setWithCongregation] = useState<boolean>(true);
  const [shafPosition, setShafPosition] = useState<'DEPAN' | 'TENGAH' | 'BELAKANG' | 'MEZZANINE'>('DEPAN');
  const [cleanliness, setCleanliness] = useState<'SANGAT_BERSIH' | 'BERSIH' | 'CUKUP'>('SANGAT_BERSIH');
  const [personalRating, setPersonalRating] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [customTagInput, setCustomTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync when initialMasjid changes
  useEffect(() => {
    if (initialMasjid) {
      setSelectedMasjidId(initialMasjid.id);
    }
  }, [initialMasjid]);

  // Selected masjid object
  const activeMasjid = masjids.find((m) => m.id === selectedMasjidId) || masjids[0];

  // Calculate distance if GPS available
  const distanceKm = activeMasjid?.distanceKm || 0.5;

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (customTagInput.trim() && !tags.includes(customTagInput.trim())) {
      setTags([...tags, customTagInput.trim()]);
      setCustomTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSetCurrentTime = () => {
    const now = new Date();
    setVisitDate(now.toISOString().slice(0, 10));
    setVisitTime(now.toTimeString().slice(0, 5));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMasjid) return;

    setIsSubmitting(true);

    const prayerObj = PRAYER_OPTIONS.find((p) => p.id === prayerTime);
    const purposeObj = PURPOSE_OPTIONS.find((p) => p.id === purpose);

    const combinedDateTime = new Date(`${visitDate}T${visitTime}:00`);

    const newRecord = MasjidVisitStorage.addVisit({
      masjidId: activeMasjid.id,
      masjidName: activeMasjid.name,
      masjidAddress: activeMasjid.address,
      masjidCity: activeMasjid.city || 'Jakarta',
      masjidPhotoUrl: activeMasjid.photoUrl,
      visitedAt: combinedDateTime.toISOString(),
      prayerTime,
      prayerLabel: prayerObj ? `${prayerObj.icon} ${prayerObj.label}` : 'Shalat Fardhu',
      purpose,
      purposeLabel: purposeObj ? `${purposeObj.icon} ${purposeObj.label}` : 'Ibadah',
      notes: notes.trim() || undefined,
      personalRating,
      withCongregation,
      shafPosition,
      cleanlinessSatisfaction: cleanliness,
      gpsVerified: !!userCoords,
      userCoordsAtVisit: userCoords,
      distanceAtVisitKm: distanceKm,
      tags: tags.length > 0 ? tags : undefined,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onVisitSaved(newRecord);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col border border-[#D8DFD8] dark:border-[#2D332D] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#D8DFD8] dark:border-[#2D332D] bg-[#EEF3EE]/60 dark:bg-[#242924]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center border border-[#2E7D32]/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#141A14] dark:text-[#E4E8E4]">
                Catat Kunjungan Masjid (Check-In)
              </h2>
              <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                Simpan jejak perjalanan ibadah Anda ke dalam Riwayat Kunjungan Lokal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#D8DFD8] dark:hover:bg-[#2D332D] flex items-center justify-center text-[#5A665B] dark:text-[#A0A8A0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 no-scrollbar text-xs">
          
          {/* Masjid Selector */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Pilih Masjid yang Dikunjungi:</span>
            </label>
            <div className="relative">
              <select
                value={selectedMasjidId}
                onChange={(e) => setSelectedMasjidId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-2xl font-bold text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              >
                {masjids.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.city || m.address.substring(0, 35)}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Masjid Preview Mini Banner */}
            {activeMasjid && (
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#EEF3EE]/40 dark:bg-[#242924]/40 border border-[#D8DFD8] dark:border-[#2D332D]">
                <img
                  src={activeMasjid.photoUrl}
                  alt={activeMasjid.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-[#141A14] dark:text-[#E4E8E4] truncate">
                    {activeMasjid.name}
                  </div>
                  <div className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] truncate">
                    {activeMasjid.address}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#2E7D32] dark:text-[#4CAF50] font-bold mt-0.5">
                    <span>📍 Jarak: ~{activeMasjid.distanceKm || 0.8} km</span>
                    <span>•</span>
                    <span>⭐ {activeMasjid.rating || 4.9}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date & Time Picker */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Waktu Kunjungan:</span>
              </label>
              <button
                type="button"
                onClick={handleSetCurrentTime}
                className="text-[11px] font-bold text-[#2E7D32] dark:text-[#4CAF50] hover:underline flex items-center gap-1"
              >
                <Clock className="w-3 h-3" /> Set Waktu Sekarang
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
                className="px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-bold text-xs text-[#141A14] dark:text-[#E4E8E4] focus:ring-1 focus:ring-[#2E7D32]"
              />
              <input
                type="time"
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                required
                className="px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-bold text-xs text-[#141A14] dark:text-[#E4E8E4] focus:ring-1 focus:ring-[#2E7D32]"
              />
            </div>
          </div>

          {/* Prayer Time Selection */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Waktu Shalat / Sesi Ibadah:</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {PRAYER_OPTIONS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPrayerTime(p.id)}
                  className={`p-2 rounded-xl text-center font-bold text-[11px] transition-all border ${
                    prayerTime === p.id
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-xs'
                      : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D] hover:border-[#2E7D32]'
                  }`}
                >
                  <span className="block text-sm">{p.icon}</span>
                  <span className="truncate block mt-0.5">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Purpose of Visit */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Tujuan / Keperluan Utama:</span>
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as MasjidVisitPurpose)}
              className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-bold text-xs text-[#141A14] dark:text-[#E4E8E4]"
            >
              {PURPOSE_OPTIONS.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.icon} {po.label}
                </option>
              ))}
            </select>
          </div>

          {/* Congregation & Shaf Position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#EEF3EE]/50 dark:bg-[#242924]/50 border border-[#D8DFD8] dark:border-[#2D332D]">
            <div className="space-y-1.5">
              <span className="font-bold text-[#5A665B] dark:text-[#A0A8A0] block">
                Pelaksanaan Ibadah:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWithCongregation(true)}
                  className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] border transition-all ${
                    withCongregation
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                      : 'bg-white dark:bg-[#151715] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D]'
                  }`}
                >
                  👥 Berjamaah
                </button>
                <button
                  type="button"
                  onClick={() => setWithCongregation(false)}
                  className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] border transition-all ${
                    !withCongregation
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                      : 'bg-white dark:bg-[#151715] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D]'
                  }`}
                >
                  👤 Munfarid (Sendiri)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-[#5A665B] dark:text-[#A0A8A0] block">
                Posisi Shaf:
              </span>
              <select
                value={shafPosition}
                onChange={(e) => setShafPosition(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-[#151715] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-bold text-[11px] text-[#141A14] dark:text-[#E4E8E4]"
              >
                <option value="DEPAN">Shaf Depan / Utama</option>
                <option value="TENGAH">Shaf Tengah</option>
                <option value="BELAKANG">Shaf Belakang</option>
                <option value="MEZZANINE">Lantai Mezzanine / Atas</option>
              </select>
            </div>
          </div>

          {/* Personal Star Rating & Cleanliness Satisfaction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center justify-between">
                <span>Rating Pengalaman:</span>
                <span className="text-amber-500 font-bold">⭐ {personalRating}/5</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setPersonalRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= personalRating ? 'fill-amber-400 text-amber-400' : 'text-[#D8DFD8] dark:text-[#444]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                Kenyamanan & Kebersihan:
              </label>
              <select
                value={cleanliness}
                onChange={(e) => setCleanliness(e.target.value as any)}
                className="w-full px-2.5 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-bold text-xs text-[#141A14] dark:text-[#E4E8E4]"
              >
                <option value="SANGAT_BERSIH">✨ Sangat Bersih & Nyaman</option>
                <option value="BERSIH">👍 Bersih & Rapi</option>
                <option value="CUKUP">👌 Cukup Memadai</option>
              </select>
            </div>
          </div>

          {/* Personal Notes / Reflection */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Catatan Pengalaman / Refleksi Pribadi (Opsional):</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Mengikuti kajian Ustadz Abdul Somad, wudhu mengalir jernih, shaf pertama sangat tenang..."
              className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-2xl text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          {/* Custom Tags */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Label / Tagar Khusus:</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Tambahkan tag (misal: Kajian Subuh, Transit Mudik, Khutbah Jumat)..."
                className="flex-1 px-3 py-1.5 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-xs text-[#141A14] dark:text-[#E4E8E4]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-xl bg-[#2E7D32] text-white font-bold text-xs"
              >
                + Tambah
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-[11px]"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-rose-500 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* GPS Verification Badge */}
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Verifikasi Koordinat Perangkat Tersedia</span>
            </span>
            <span className="font-mono font-bold">~{distanceKm} km dari lokasi</span>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-[#D8DFD8] dark:border-[#2D332D] flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#D8DFD8] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] font-bold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-black text-xs shadow-md shadow-[#2E7D32]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              {isSubmitting ? (
                <span>Menyimpan...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Kunjungan ke Log</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
