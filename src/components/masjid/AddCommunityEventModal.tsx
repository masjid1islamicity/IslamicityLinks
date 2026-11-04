import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Radio, 
  Building2,
  Tag
} from 'lucide-react';
import { CommunityEvent, CommunityEventCategory, MasjidLocation } from '../../types';

interface AddCommunityEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: Omit<CommunityEvent, 'id' | 'attendeesCount' | 'userRsvp'>) => void;
  masjids: MasjidLocation[];
}

export const AddCommunityEventModal: React.FC<AddCommunityEventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
  masjids,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CommunityEventCategory>('TABLIGH_AKBAR');
  const [speakerOrHost, setSpeakerOrHost] = useState('');
  const [selectedMasjidId, setSelectedMasjidId] = useState(masjids[0]?.id || '');
  const [customLocationName, setCustomLocationName] = useState('');
  const [date, setDate] = useState('Ahad, 13 September 2026');
  const [time, setTime] = useState('08:30 - 11:45 WIB');
  const [description, setDescription] = useState('');
  const [isLiveStreamed, setIsLiveStreamed] = useState(false);
  const [priceNote, setPriceNote] = useState('Gratis & Terbuka untuk Umum');
  const [contactPerson, setContactPerson] = useState('0812-3456-7890 (Panitia DKM)');
  const [tagsInput, setTagsInput] = useState('Kajian, Ukhuwah, Tabligh');

  if (!isOpen) return null;

  const categories: { id: CommunityEventCategory; label: string; icon: string }[] = [
    { id: 'TABLIGH_AKBAR', label: 'Tabligh Akbar', icon: '📢' },
    { id: 'BAZAR_HALAL', label: 'Bazar & Expo Halal', icon: '🎪' },
    { id: 'SUBUH_GABUNGAN', label: 'Subuh Gabungan', icon: '🌅' },
    { id: 'BAKTI_SOSIAL', label: 'Bakti Sosial & Medis', icon: '🩺' },
    { id: 'TAHSIN_QURAN', label: 'Tahsin & Al-Qur\'an', icon: '📖' },
    { id: 'WORKSHOP_EDUKASI', label: 'Workshop & Edukasi', icon: '💡' },
    { id: 'DONASI_MASSAL', label: 'Santunan & Donasi Massal', icon: '🤲' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedMasjid = masjids.find(m => m.id === selectedMasjidId) || masjids[0];
    const catObj = categories.find(c => c.id === category) || categories[0];

    const newEvent: Omit<CommunityEvent, 'id' | 'attendeesCount' | 'userRsvp'> = {
      title,
      category,
      categoryLabel: catObj.label,
      categoryIcon: catObj.icon,
      speakerOrHost: speakerOrHost || 'Asatidz & DKM ' + matchedMasjid.name,
      masjidId: matchedMasjid.id,
      masjidName: matchedMasjid.name,
      locationName: customLocationName || matchedMasjid.name,
      address: matchedMasjid.address,
      lat: matchedMasjid.lat + (Math.random() - 0.5) * 0.005, // slightly jitter coordinates if nearby
      lng: matchedMasjid.lng + (Math.random() - 0.5) * 0.005,
      date,
      time,
      description: description || `Acara ${catObj.label} yang diselenggarakan di ${matchedMasjid.name} untuk mempererat tali silaturahmi jamaah.`,
      photoUrl: matchedMasjid.photoUrl || 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?w=800&auto=format&fit=crop&q=80',
      isFree: true,
      priceNote,
      isLiveStreamed,
      isFeatured: false,
      contactPerson,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    };

    onAddEvent(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A1D1A] w-full max-w-lg rounded-3xl overflow-hidden border border-[#D8DFD8] dark:border-[#2D332D] shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#1F3D22] to-[#141A14] text-white flex items-center justify-between border-b border-[#2D332D]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2E7D32] flex items-center justify-center text-sm font-bold">
              🎉
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Usulkan Acara Komunitas / DKM</h3>
              <p className="text-xs text-white/70">Publikasikan acara ke radar peta interaktif jamaah</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-[#141A14] dark:text-[#E4E8E4]">
          
          {/* Title */}
          <div className="space-y-1.5">
            <label className="font-bold flex items-center justify-between">
              <span>Nama Acara / Tabligh / Kegiatan</span>
              <span className="text-[10px] text-red-500 font-semibold">*Wajib</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Tabligh Akbar & Dzikir Bersama Akhir Pekan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] bg-[#F4F7F4] dark:bg-[#242924] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="font-bold">Kategori Acara</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-left font-bold transition-all border flex items-center gap-1.5 ${
                    category === cat.id
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                      : 'bg-[#F4F7F4] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Masjid Location */}
          <div className="space-y-1.5">
            <label className="font-bold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Masjid / Lokasi Tuan Rumah</span>
            </label>
            <select
              value={selectedMasjidId}
              onChange={(e) => setSelectedMasjidId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] bg-[#F4F7F4] dark:bg-[#242924] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            >
              {masjids.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.city || 'Jabodetabek'})
                </option>
              ))}
            </select>
          </div>

          {/* Speaker / Host */}
          <div className="space-y-1.5">
            <label className="font-bold">Penceramah / Pembicara / Pengisi Acara</label>
            <input
              type="text"
              value={speakerOrHost}
              onChange={(e) => setSpeakerOrHost(e.target.value)}
              placeholder="Contoh: Ustaz Adi Hidayat, Lc., M.A."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] bg-[#F4F7F4] dark:bg-[#242924] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Hari & Tanggal</span>
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ahad, 13 September 2026"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] bg-[#F4F7F4] dark:bg-[#242924] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Waktu / Sesi</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="08:30 - 11:45 WIB"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] bg-[#F4F7F4] dark:bg-[#242924] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold">Deskripsi Singkat & Ketentuan Acara</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan susunan acara, tema materi, fasilitas untuk jamaah, dan panduan parkir..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] bg-[#F4F7F4] dark:bg-[#242924] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          {/* Live Streaming Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F7F4] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D]">
            <div className="flex items-center gap-2">
              <Radio className={`w-4 h-4 ${isLiveStreamed ? 'text-red-500 animate-pulse' : 'text-[#5A665B]'}`} />
              <span className="font-bold">Siarkan Secara Live Streaming (YouTube / Zoom)</span>
            </div>
            <input
              type="checkbox"
              checked={isLiveStreamed}
              onChange={(e) => setIsLiveStreamed(e.target.checked)}
              className="w-4 h-4 accent-[#2E7D32] cursor-pointer"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="font-bold flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Tagar (Pisahkan dengan koma)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Tabligh, Kajian, Ukhuwah, DisabilitasRamah"
              className="w-full px-3.5 py-2 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] bg-[#F4F7F4] dark:bg-[#242924] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Terbitkan Acara ke Peta Komunitas</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
