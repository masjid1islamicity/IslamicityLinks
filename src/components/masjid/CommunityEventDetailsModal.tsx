import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  X, 
  Award, 
  Radio, 
  Heart, 
  Compass, 
  Copy,
  CalendarPlus,
  Phone,
  Bookmark
} from 'lucide-react';
import { CommunityEvent } from '../../types';

interface CommunityEventDetailsModalProps {
  event: CommunityEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onRsvp: (eventId: string) => void;
}

export const CommunityEventDetailsModal: React.FC<CommunityEventDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
  onRsvp,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const handleShare = () => {
    const text = `Hadirilah: ${event.title} di ${event.locationName} (${event.date} - ${event.time}). Info & RSVP: ${window.location.origin}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Generate Google Calendar URL
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(
      `${event.description}\n\nPenceramah/Host: ${event.speakerOrHost}\nLokasi: ${event.locationName} (${event.address})\nKontak: ${event.contactPerson || '-'}`
    );
    const location = encodeURIComponent(`${event.locationName}, ${event.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'TABLIGH_AKBAR':
        return 'bg-emerald-600 text-white border-emerald-500';
      case 'BAZAR_HALAL':
        return 'bg-amber-600 text-white border-amber-500';
      case 'SUBUH_GABUNGAN':
        return 'bg-blue-600 text-white border-blue-500';
      case 'BAKTI_SOSIAL':
        return 'bg-rose-600 text-white border-rose-500';
      case 'TAHSIN_QURAN':
        return 'bg-teal-600 text-white border-teal-500';
      case 'WORKSHOP_EDUKASI':
        return 'bg-purple-600 text-white border-purple-500';
      default:
        return 'bg-[#2E7D32] text-white border-[#4CAF50]';
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A1D1A] w-full max-w-2xl rounded-3xl overflow-hidden border border-[#D8DFD8] dark:border-[#2D332D] shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header Cover */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-[#141A14]">
          <img 
            src={event.photoUrl} 
            alt={event.title} 
            className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Top Floating Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-md border ${getCategoryColor(event.category)}`}>
              <span>{event.categoryIcon}</span>
              <span>{event.categoryLabel}</span>
            </span>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Banner Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              {event.isLiveStreamed && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-extrabold uppercase flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" /> Live Streaming
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-medium">
                {event.priceNote || (event.isFree ? 'Gratis Masuk' : 'Berbayar')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[#141A14] dark:text-[#E4E8E4]">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#F4F7F4] dark:bg-[#242924] p-3 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] space-y-0.5">
              <div className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <span>Tanggal</span>
              </div>
              <p className="font-extrabold text-xs">{event.date}</p>
            </div>

            <div className="bg-[#F4F7F4] dark:bg-[#242924] p-3 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] space-y-0.5">
              <div className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <span>Waktu</span>
              </div>
              <p className="font-extrabold text-xs">{event.time}</p>
            </div>

            <div className="bg-[#F4F7F4] dark:bg-[#242924] p-3 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] space-y-0.5">
              <div className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <span>Pendaftar</span>
              </div>
              <p className="font-extrabold text-xs text-[#2E7D32] dark:text-[#4CAF50]">
                {event.attendeesCount.toLocaleString('id-ID')} Jamaah
              </p>
            </div>

            <div className="bg-[#F4F7F4] dark:bg-[#242924] p-3 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] space-y-0.5">
              <div className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] font-medium flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <span>Jarak GPS</span>
              </div>
              <p className="font-extrabold text-xs">{event.distanceKm ? `${event.distanceKm} km` : 'Terdekat'}</p>
            </div>
          </div>

          {/* Speaker / Host Information */}
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
            <div className="w-11 h-11 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              🎙️
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#2E7D32] dark:text-[#4CAF50] tracking-wider">
                Penceramah / Penyelenggara
              </span>
              <h4 className="font-bold text-sm text-[#141A14] dark:text-[#E4E8E4]">
                {event.speakerOrHost}
              </h4>
              <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                Bekerjasama dengan DKM {event.masjidName}
              </p>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[#141A14] dark:text-[#E4E8E4]">
              Tentang Acara & Agenda
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-[#5A665B] dark:text-[#A0A8A0]">
              {event.description}
            </p>
          </div>

          {/* Location & Directions */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span>Lokasi Pelaksanaan</span>
            </h3>
            <div className="p-3.5 rounded-2xl bg-[#F4F7F4] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-xs">{event.locationName}</h4>
                  <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] mt-0.5">{event.address}</p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A1D1A] hover:bg-[#EEF3EE] dark:hover:bg-[#2D332D] text-[#2E7D32] dark:text-[#4CAF50] text-xs font-bold border border-[#D8DFD8] dark:border-[#2D332D] flex items-center gap-1 shadow-sm shrink-0"
                >
                  <span>Buka GPS Peta</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {event.contactPerson && (
                <div className="pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] flex items-center gap-2 text-xs text-[#5A665B] dark:text-[#A0A8A0]">
                  <Phone className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Kontak Panitia: <strong className="text-[#141A14] dark:text-[#E4E8E4]">{event.contactPerson}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {event.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-1 rounded-lg bg-[#EEF3EE] dark:bg-[#242924] text-[11px] font-medium text-[#2E7D32] dark:text-[#4CAF50] border border-[#D8DFD8] dark:border-[#2D332D]"
              >
                #{tag}
              </span>
            ))}
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#F4F7F4] dark:bg-[#242924] border-t border-[#D8DFD8] dark:border-[#2D332D] flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-2xl bg-white dark:bg-[#1A1D1A] hover:bg-[#EEF3EE] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] text-xs font-bold border border-[#D8DFD8] dark:border-[#2D332D] flex items-center gap-1.5 shadow-sm transition-all"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
            </button>

            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-2xl bg-white dark:bg-[#1A1D1A] hover:bg-[#EEF3EE] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] text-xs font-bold border border-[#D8DFD8] dark:border-[#2D332D] flex items-center gap-1.5 shadow-sm transition-all"
            >
              <CalendarPlus className="w-4 h-4 text-blue-600" />
              <span>Simpan ke Kalender</span>
            </a>
          </div>

          <button
            onClick={() => onRsvp(event.id)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all ${
              event.userRsvp
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-[#2E7D32] hover:bg-[#256629] text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{event.userRsvp ? '✓ Anda Terdaftar (Batalkan)' : 'Konfirmasi Hadir (RSVP)'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
