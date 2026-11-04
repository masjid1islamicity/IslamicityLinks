import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Radio, 
  Filter, 
  Plus, 
  ChevronRight, 
  ExternalLink,
  Flame,
  Search,
  Eye,
  Layers
} from 'lucide-react';
import { CommunityEvent, CommunityEventCategory } from '../../types';

interface CommunityEventsRadarProps {
  events: CommunityEvent[];
  onSelectEvent: (event: CommunityEvent) => void;
  onRsvpEvent: (eventId: string) => void;
  onHoverEvent: (eventId: string | null) => void;
  onOpenAddModal: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  showEventsOnMap: boolean;
  onToggleShowEventsOnMap: () => void;
  hoveredEventId: string | null;
}

export const CommunityEventsRadar: React.FC<CommunityEventsRadarProps> = ({
  events,
  onSelectEvent,
  onRsvpEvent,
  onHoverEvent,
  onOpenAddModal,
  selectedCategory,
  onSelectCategory,
  showEventsOnMap,
  onToggleShowEventsOnMap,
  hoveredEventId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'ALL', label: 'Semua Event', icon: '✨' },
    { id: 'TABLIGH_AKBAR', label: 'Tabligh Akbar', icon: '📢' },
    { id: 'BAZAR_HALAL', label: 'Bazar & Expo Halal', icon: '🎪' },
    { id: 'SUBUH_GABUNGAN', label: 'Subuh Gabungan', icon: '🌅' },
    { id: 'BAKTI_SOSIAL', label: 'Bakti Medis & Sosial', icon: '🩺' },
    { id: 'TAHSIN_QURAN', label: 'Tahsin & Al-Qur\'an', icon: '📖' },
    { id: 'WORKSHOP_EDUKASI', label: 'Workshop Edukasi', icon: '💡' },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchCat = selectedCategory === 'ALL' || ev.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchSearch =
        ev.title.toLowerCase().includes(query) ||
        ev.masjidName.toLowerCase().includes(query) ||
        ev.speakerOrHost.toLowerCase().includes(query) ||
        ev.tags.some(t => t.toLowerCase().includes(query));

      return matchCat && matchSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  const totalAttendees = useMemo(() => {
    return events.reduce((acc, curr) => acc + (curr.attendeesCount || 0), 0);
  }, [events]);

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'TABLIGH_AKBAR':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'BAZAR_HALAL':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'SUBUH_GABUNGAN':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'BAKTI_SOSIAL':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'TAHSIN_QURAN':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border-teal-300 dark:border-teal-800';
      case 'WORKSHOP_EDUKASI':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      default:
        return 'bg-[#EEF3EE] text-[#2E7D32] dark:bg-[#242924] dark:text-[#4CAF50] border-[#D8DFD8] dark:border-[#2D332D]';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 sm:p-8 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D8DFD8] dark:border-[#2D332D]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#2E7D32] dark:text-[#4CAF50] text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>Radar Event & Agenda Komunitas Masjid Terdekat</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#141A14] dark:text-[#E4E8E4]">
            Kegiatan & Syiar Ukhuwah Jamaah
          </h2>
          <p className="text-xs sm:text-sm text-[#5A665B] dark:text-[#A0A8A0]">
            Sorotan interaktif pada peta: Arahkan kursor ke kartu event atau marker peta untuk melihat detail seketika.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Map Layer Toggle Button */}
          <button
            onClick={onToggleShowEventsOnMap}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all shadow-sm ${
              showEventsOnMap
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-[#2E7D32] dark:text-[#4CAF50] border-emerald-300 dark:border-emerald-800'
                : 'bg-[#F4F7F4] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showEventsOnMap ? '✓ Marker Peta Aktif' : 'Marker Peta Nonaktif'}</span>
          </button>

          {/* Add Event Button */}
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Usulkan Acara DKM</span>
          </button>
        </div>
      </div>

      {/* Highlights Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#F4F7F4] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D]">
          <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] font-semibold">Total Acara Terjadwal</span>
          <p className="text-xl font-extrabold text-[#141A14] dark:text-[#E4E8E4] mt-0.5">{events.length} Event</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F4F7F4] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D]">
          <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] font-semibold">Total RSVP Jamaah</span>
          <p className="text-xl font-extrabold text-[#2E7D32] dark:text-[#4CAF50] mt-0.5">
            {totalAttendees.toLocaleString('id-ID')}+
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F4F7F4] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D]">
          <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] font-semibold">Live Streaming Siap</span>
          <p className="text-xl font-extrabold text-red-600 dark:text-red-400 mt-0.5">
            {events.filter(e => e.isLiveStreamed).length} Acara
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F4F7F4] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D]">
          <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] font-semibold">Biaya Masuk</span>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">100% Gratis</p>
        </div>
      </div>

      {/* Filter Category Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#1F3D22] text-white border-[#1F3D22] shadow-sm'
                  : 'bg-[#F4F7F4] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D] hover:bg-[#EEF3EE]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A665B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama event / ustadz..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] bg-[#F4F7F4] dark:bg-[#242924] text-xs focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          />
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-8 text-center bg-[#F4F7F4] dark:bg-[#242924] rounded-2xl border border-dashed border-[#D8DFD8] dark:border-[#2D332D] space-y-2">
          <p className="text-sm font-bold text-[#5A665B] dark:text-[#A0A8A0]">
            Tidak ada event yang sesuai dengan filter atau kata kunci "{searchQuery}".
          </p>
          <button
            onClick={() => { onSelectCategory('ALL'); setSearchQuery(''); }}
            className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] hover:underline"
          >
            Reset Filter Acara
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((ev) => {
            const isHovered = hoveredEventId === ev.id;
            return (
              <div
                key={ev.id}
                onMouseEnter={() => onHoverEvent(ev.id)}
                onMouseLeave={() => onHoverEvent(null)}
                className={`group bg-white dark:bg-[#1A1D1A] rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col justify-between ${
                  isHovered
                    ? 'border-[#2E7D32] ring-2 ring-[#4CAF50]/40 shadow-lg -translate-y-1'
                    : 'border-[#D8DFD8] dark:border-[#2D332D] shadow-sm hover:border-[#2E7D32] hover:shadow-md'
                }`}
              >
                {/* Event Card Image & Badges */}
                <div className="relative h-40 w-full overflow-hidden bg-[#141A14]">
                  <img
                    src={ev.photoUrl}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-sm border ${getCategoryBadgeClass(ev.category)}`}>
                      <span>{ev.categoryIcon}</span>
                      <span>{ev.categoryLabel}</span>
                    </span>

                    {ev.isLiveStreamed && (
                      <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold uppercase flex items-center gap-1 shadow-sm">
                        <Radio className="w-2.5 h-2.5 animate-pulse" /> Live
                      </span>
                    )}
                  </div>

                  {/* Bottom Masjid Name */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-semibold truncate flex items-center gap-1.5 drop-shadow">
                    <MapPin className="w-3.5 h-3.5 text-[#4CAF50] shrink-0" />
                    <span className="truncate">{ev.masjidName}</span>
                  </div>
                </div>

                {/* Event Card Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 
                      onClick={() => onSelectEvent(ev)}
                      className="font-extrabold text-sm text-[#141A14] dark:text-[#E4E8E4] group-hover:text-[#2E7D32] dark:group-hover:text-[#4CAF50] transition-colors line-clamp-2 cursor-pointer"
                    >
                      {ev.title}
                    </h3>

                    <div className="text-xs text-[#5A665B] dark:text-[#A0A8A0] font-medium flex items-center gap-1">
                      <span className="text-[#2E7D32] font-bold">🎙️</span>
                      <span className="truncate">{ev.speakerOrHost}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#D8DFD8] dark:border-[#2D332D] text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                      <div className="flex items-center gap-1 truncate">
                        <Calendar className="w-3 h-3 text-[#2E7D32]" />
                        <span className="truncate">{ev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 truncate">
                        <Clock className="w-3 h-3 text-[#2E7D32]" />
                        <span className="truncate">{ev.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between gap-2">
                    <div className="text-[11px] text-[#2E7D32] dark:text-[#4CAF50] font-bold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{ev.attendeesCount.toLocaleString('id-ID')} Hadir</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectEvent(ev)}
                        className="p-1.5 rounded-xl hover:bg-[#EEF3EE] dark:hover:bg-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] transition-colors"
                        title="Lihat Detail Acara"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onRsvpEvent(ev.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 ${
                          ev.userRsvp
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-[#2E7D32] hover:bg-[#256629] text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{ev.userRsvp ? 'Terdaftar' : 'RSVP'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
