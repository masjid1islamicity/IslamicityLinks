import React, { useState, useMemo, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  Clock, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Search, 
  Filter, 
  Volume2, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  Star,
  Map as MapIcon,
  List,
  SlidersHorizontal,
  LocateFixed,
  Car,
  Footprints,
  Bike,
  MessageSquarePlus,
  Radio,
  Share2,
  ChevronRight,
  Info,
  Flame,
  Plus,
  History,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MasjidLocation, MasjidReview, CommunityEvent, MasjidVisitRecord } from '../../types';
import { MasjidInteractiveMap } from '../MasjidInteractiveMap';
import { MasjidReviewModal } from '../MasjidReviewModal';
import { CommunityEventsRadar } from '../masjid/CommunityEventsRadar';
import { CommunityEventDetailsModal } from '../masjid/CommunityEventDetailsModal';
import { AddCommunityEventModal } from '../masjid/AddCommunityEventModal';
import { MasjidCheckInModal } from '../masjid/MasjidCheckInModal';
import { MasjidVisitHistoryView } from '../masjid/MasjidVisitHistoryView';
import { MasjidVisitStorage } from '../../utils/masjidVisitStorage';

export const MasjidFinderTab: React.FC = () => {
  const { 
    masjids, 
    communityEvents,
    rsvpCommunityEvent,
    addCommunityEvent,
    rsvpKajian, 
    addMasjidReview, 
    theme, 
    t, 
    addNotification 
  } = useApp();
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFacility, setSelectedFacility] = useState<string>('ALL');
  const [selectedRadius, setSelectedRadius] = useState<number>(0); // 0 = all
  const [minRating, setMinRating] = useState<number>(0); // 0 = all
  const [crowdFilter, setCrowdFilter] = useState<'ALL' | 'QUIET' | 'MODERATE' | 'PEAK'>('ALL');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'capacity' | 'crowd'>('distance');
  const [viewMode, setViewMode] = useState<'split' | 'map-full' | 'list' | 'visit-history'>('split');
  
  // Visit History State (persisted via Local Storage)
  const [visitHistory, setVisitHistory] = useState<MasjidVisitRecord[]>(() => {
    return MasjidVisitStorage.getVisits();
  });
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState<boolean>(false);
  const [checkInTargetMasjid, setCheckInTargetMasjid] = useState<MasjidLocation | null>(null);

  // Community Events State
  const [selectedCommunityEvent, setSelectedCommunityEvent] = useState<CommunityEvent | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState<boolean>(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState<boolean>(false);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [selectedEventCategory, setSelectedEventCategory] = useState<string>('ALL');
  const [showEventsLayer, setShowEventsLayer] = useState<boolean>(true);
  const [showMasjidsLayer, setShowMasjidsLayer] = useState<boolean>(true);
  const [showHeatmapLayer, setShowHeatmapLayer] = useState<boolean>(true);
  const [selectedHeatmapPrayer, setSelectedHeatmapPrayer] = useState<'current' | 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'jumaat'>('current');

  // User GPS Coordinates (Default: Jakarta Pusat / Monas)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: -6.1754,
    lng: 106.8272,
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('Lokasi: Jakarta Pusat (Default)');

  // Selected Masjid for Details / Map Popup
  const [activeMasjid, setActiveMasjid] = useState<MasjidLocation | null>(masjids[0] || null);

  // Review Modal State
  const [reviewModalMasjid, setReviewModalMasjid] = useState<MasjidLocation | null>(null);

  // Facility filter buttons
  const facilityList = [
    { id: 'ALL', label: 'Semua Fasilitas' },
    { id: 'Ramah Disabilitas', label: '♿ Ramah Disabilitas' },
    { id: 'Kajian Rutin', label: '📖 Kajian Rutin' },
    { id: 'Parkir Luas', label: '🚗 Parkir Luas' },
    { id: 'Ruang VIP / Transit', label: '🏛️ Ruang Transit' },
    { id: 'AC Sejuk', label: '❄️ AC Sejuk' },
  ];

  // Calculate real distance using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  // Trigger GPS Geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolokasi tidak didukung oleh browser Anda.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Mencari sinyal GPS...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserCoords(coords);
        setIsLocating(false);
        setLocationStatus(`GPS Terkalibrasi (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
        
        addNotification({
          title: 'Lokasi GPS Berhasil Diperbarui',
          message: `Jarak seluruh masjid dan event komunitas telah disinkronkan berdasarkan posisi koordinat terkini Anda.`,
          type: 'SECURITY',
        });
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setIsLocating(false);
        setLocationStatus('GPS Ditolak, menggunakan koordinat default.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Process and sort masjids with live distances
  const processedMasjids = useMemo(() => {
    return masjids.map((m) => {
      const realDistance = calculateDistance(userCoords.lat, userCoords.lng, m.lat, m.lng);
      return {
        ...m,
        distanceKm: realDistance,
      };
    });
  }, [masjids, userCoords]);

  // Process community events with live distances
  const processedEvents = useMemo(() => {
    return (communityEvents || []).map((ev) => {
      const realDistance = calculateDistance(userCoords.lat, userCoords.lng, ev.lat, ev.lng);
      return {
        ...ev,
        distanceKm: realDistance,
      };
    });
  }, [communityEvents, userCoords]);

  // Filtered & Sorted Masjids
  const filteredMasjids = useMemo(() => {
    return processedMasjids
      .filter((m) => {
        const query = searchQuery.toLowerCase();
        const matchSearch =
          m.name.toLowerCase().includes(query) ||
          m.address.toLowerCase().includes(query) ||
          (m.city && m.city.toLowerCase().includes(query)) ||
          m.kajianSchedule?.some(k => k.speaker.toLowerCase().includes(query) || k.title.toLowerCase().includes(query));

        const matchFacility =
          selectedFacility === 'ALL' ||
          m.facilities.some((f) => f.toLowerCase().includes(selectedFacility.toLowerCase()));

        const matchRadius = selectedRadius === 0 || (m.distanceKm && m.distanceKm <= selectedRadius);
        const matchRating = minRating === 0 || ((m.rating || 4.9) >= minRating);

        const occupancy = m.prayerPeakData?.currentCrowdPercent ?? 45;
        const matchCrowd =
          crowdFilter === 'ALL' ||
          (crowdFilter === 'QUIET' && occupancy < 45) ||
          (crowdFilter === 'MODERATE' && occupancy >= 45 && occupancy <= 75) ||
          (crowdFilter === 'PEAK' && occupancy > 75);

        return matchSearch && matchFacility && matchRadius && matchRating && matchCrowd;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          return (a.distanceKm || 0) - (b.distanceKm || 0);
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'capacity') {
          return (b.capacity || 0) - (a.capacity || 0);
        }
        if (sortBy === 'crowd') {
          const occA = a.prayerPeakData?.currentCrowdPercent ?? 50;
          const occB = b.prayerPeakData?.currentCrowdPercent ?? 50;
          return occA - occB; // quietest first
        }
        return 0;
      });
  }, [processedMasjids, searchQuery, selectedFacility, selectedRadius, minRating, crowdFilter, sortBy]);

  // Estimated Travel Time helper
  const getTravelTime = (distanceKm?: number) => {
    if (!distanceKm) return { car: '~5 mnt', motor: '~3 mnt', walk: '~12 mnt' };
    const carMins = Math.round((distanceKm / 30) * 60) + 2;
    const motorMins = Math.round((distanceKm / 40) * 60) + 1;
    const walkMins = Math.round((distanceKm / 4.5) * 60);
    return {
      car: `${carMins} mnt`,
      motor: `${motorMins} mnt`,
      walk: walkMins > 60 ? `${(walkMins / 60).toFixed(1)} jam` : `${walkMins} mnt`,
    };
  };

  const handleOpenEventDetails = (event: CommunityEvent) => {
    setSelectedCommunityEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleOpenCheckIn = (masjid?: MasjidLocation) => {
    setCheckInTargetMasjid(masjid || activeMasjid || masjids[0] || null);
    setIsCheckInModalOpen(true);
  };

  const handleVisitSaved = (newRecord: MasjidVisitRecord) => {
    setVisitHistory(MasjidVisitStorage.getVisits());
    addNotification({
      id: `notif-${Date.now()}`,
      title: 'Check-In Kunjungan Tercatat',
      message: `Alhamdulillah! Kunjungan Anda ke ${newRecord.masjidName} (${newRecord.prayerLabel}) berhasil dicatat ke jurnal ibadah lokal.`,
      type: 'PRAYER_ALERT',
      timestamp: 'Baru saja',
      read: false,
      linkTab: 'masjid-finder'
    });
  };

  const handleDeleteVisit = (id: string) => {
    const updated = MasjidVisitStorage.deleteVisit(id);
    setVisitHistory(updated);
  };

  const handleResetDefaultVisits = () => {
    const reset = MasjidVisitStorage.resetToDefault();
    setVisitHistory(reset);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#1F3D22] via-[#2E7D32] to-[#141A14] rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#4CAF50]/30 text-[#A5D6A7] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#4CAF50]/40">
              <Compass className="w-3.5 h-3.5" />
              <span>Geolokasi Satelit & Radar Komunitas</span>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleOpenCheckIn()}
              className="px-3.5 py-1.5 rounded-full bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-[#2E7D32]/30 active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>+ Check-In Kunjungan</span>
            </button>

            <button
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-sm border border-white/20"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Mencari GPS...' : 'Lokasi GPS'}</span>
            </button>

            <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-medium border border-white/10 hidden md:inline">
              {locationStatus}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Peta Navigasi Masjid, Radar Event & Riwayat Kunjungan
          </h1>
          <p className="text-xs sm:text-sm text-[#E4E8E4]/90 max-w-3xl leading-relaxed">
            Pantau lokasi masjid terdekat melalui peta interaktif dinamis, temukan highlight event ukhuwah (Tabligh Akbar, Bazar Halal, Subuh Gabungan), cek ulasan jamaah sahih, serta catat riwayat kunjungan ibadah pribadi Anda.
          </p>
        </div>
      </div>

      {/* Control Bar: View Switcher, Search, and Quick Filters */}
      <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-4 sm:p-5 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-4">
        
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A665B] dark:text-[#A0A8A0]" />
            <input
              type="text"
              placeholder="Cari nama masjid, event tabligh, penceramah kajian, kota, atau alamat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-2xl text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          {/* View Mode Toggle & Sort Options */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Modes */}
            <div className="flex items-center p-1 bg-[#EEF3EE] dark:bg-[#242924] rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D]">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'split'
                    ? 'bg-[#2E7D32] text-white shadow-sm'
                    : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Peta & Radar</span>
              </button>

              <button
                onClick={() => setViewMode('map-full')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'map-full'
                    ? 'bg-[#2E7D32] text-white shadow-sm'
                    : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Peta Penuh</span>
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#2E7D32] text-white shadow-sm'
                    : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Daftar</span>
              </button>

              <button
                onClick={() => setViewMode('visit-history')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'visit-history'
                    ? 'bg-[#2E7D32] text-white shadow-sm'
                    : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span className="flex items-center gap-1">
                  Riwayat
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    viewMode === 'visit-history' ? 'bg-white/20 text-white' : 'bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50]'
                  }`}>
                    {visitHistory.length}
                  </span>
                </span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] focus:outline-none"
            >
              <option value="distance">📍 Jarak Terdekat</option>
              <option value="crowd">🔥 Paling Sepi / Lenggang</option>
              <option value="rating">⭐ Rating Tertinggi</option>
              <option value="capacity">👥 Kapasitas Jamaah</option>
            </select>
          </div>
        </div>

        {/* Facility & Peak Prayer Times Crowd Filter Pills */}
        <div className="space-y-2 pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D]">
          {/* Crowd Level Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] font-extrabold text-[#5A665B] dark:text-[#A0A8A0] uppercase tracking-wider flex items-center gap-1 pr-1 shrink-0">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Filter Kepadatan:</span>
            </span>
            {[
              { id: 'ALL', label: 'Semua Kepadatan' },
              { id: 'QUIET', label: '🟢 Lenggang / Sepi (<45%)' },
              { id: 'MODERATE', label: '🟡 Sedang (45-75%)' },
              { id: 'PEAK', label: '🔴 Jam Puncak (>75%)' },
            ].map((cf) => (
              <button
                key={cf.id}
                onClick={() => setCrowdFilter(cf.id as any)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
                  crowdFilter === cf.id
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D] hover:bg-[#D8DFD8]'
                }`}
              >
                {cf.label}
              </button>
            ))}
          </div>

          {/* Facility Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {facilityList.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFacility(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedFacility === f.id
                    ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                    : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D] hover:bg-[#D8DFD8]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Radius Filter */}
              <select
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(Number(e.target.value))}
                className="px-2.5 py-1 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs text-[#141A14] dark:text-[#E4E8E4]"
              >
                <option value={0}>Radius: Semua Jarak</option>
                <option value={3}>Maksimal 3 km</option>
                <option value={5}>Maksimal 5 km</option>
                <option value={10}>Maksimal 10 km</option>
                <option value={20}>Maksimal 20 km</option>
              </select>

              {/* Minimum Rating Filter */}
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="px-2.5 py-1 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-xs text-[#141A14] dark:text-[#E4E8E4]"
              >
                <option value={0}>Rating: Semua</option>
                <option value={4.5}>⭐ 4.5+ Bintang</option>
                <option value={4.8}>⭐ 4.8+ Istimewa</option>
                <option value={4.9}>⭐ 4.9+ Mumtaz</option>
              </select>
            </div>

            <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
              Ditemukan: <strong>{filteredMasjids.length}</strong> masjid • <strong>{processedEvents.length}</strong> event
            </span>
          </div>
        </div>
      </div>

      {/* Main Dynamic Layout depending on View Mode */}
      {viewMode === 'map-full' && (
        <div className="space-y-4">
          <MasjidInteractiveMap
            masjids={filteredMasjids}
            activeMasjid={activeMasjid}
            onSelectMasjid={(m) => setActiveMasjid(m)}
            communityEvents={processedEvents}
            activeEvent={selectedCommunityEvent}
            onSelectEvent={handleOpenEventDetails}
            onRsvpEvent={rsvpCommunityEvent}
            highlightedEventId={hoveredEventId}
            userCoords={userCoords}
            onRecenterUser={handleGetCurrentLocation}
            theme={theme}
            showEventsLayer={showEventsLayer}
            onToggleEventsLayer={() => setShowEventsLayer(!showEventsLayer)}
            showMasjidsLayer={showMasjidsLayer}
            onToggleMasjidsLayer={() => setShowMasjidsLayer(!showMasjidsLayer)}
            selectedEventCategory={selectedEventCategory}
            showHeatmapLayer={showHeatmapLayer}
            onToggleHeatmapLayer={() => setShowHeatmapLayer(!showHeatmapLayer)}
            selectedHeatmapPrayer={selectedHeatmapPrayer}
            onSelectHeatmapPrayer={setSelectedHeatmapPrayer}
          />

          {/* Floating Horizontal Carousel of Mosques below full map */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar">
            {filteredMasjids.map((masjid) => {
              const isSelected = activeMasjid?.id === masjid.id;
              const crowd = masjid.prayerPeakData;
              const occupancy = crowd?.currentCrowdPercent || 45;
              const isQuiet = occupancy < 45;
              const isModerate = occupancy >= 45 && occupancy <= 75;
              const visitSummary = MasjidVisitStorage.getMasjidVisitSummary(masjid.id);

              return (
                <div
                  key={masjid.id}
                  onClick={() => setActiveMasjid(masjid)}
                  className={`min-w-[320px] max-w-[340px] p-4 rounded-3xl border transition-all cursor-pointer bg-white dark:bg-[#1A1D1A] shrink-0 flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-md'
                      : 'border-[#D8DFD8] dark:border-[#2D332D] hover:border-[#2E7D32]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={masjid.photoUrl}
                      alt={masjid.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-extrabold text-xs text-[#141A14] dark:text-[#E4E8E4] truncate">
                          {masjid.name}
                        </h4>
                        {visitSummary.visited && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold shrink-0">
                            ✓ {visitSummary.count}x
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#2E7D32] dark:text-[#4CAF50] font-bold">
                        <span>⭐ {masjid.rating || 4.9}</span>
                        <span>•</span>
                        <span>📍 {masjid.distanceKm} km</span>
                      </div>
                      {/* Crowd Status Pill */}
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 ${
                          isQuiet
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : isModerate
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        }`}>
                          <Flame className="w-2.5 h-2.5 fill-current" />
                          <span>{occupancy}% {isQuiet ? 'Sepi' : isModerate ? 'Sedang' : 'Padat'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 border-t border-[#D8DFD8] dark:border-[#2D332D]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCheckIn(masjid);
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-[#2E7D32]/10 hover:bg-[#2E7D32]/20 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Check-In</span>
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${masjid.lat},${masjid.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#D8DFD8] text-[#141A14] dark:text-[#E4E8E4] font-bold text-[11px] flex items-center justify-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Rute</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Interactive Map & Masjid Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Interactive Leaflet Map with Community Event Markers */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
                  <span>Peta Geospasial, Highlight Event & Heat Map Kepadatan Shalat</span>
                </span>
                <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                  Arahkan kursor ke marker untuk preview popup
                </span>
              </div>

              <MasjidInteractiveMap
                masjids={filteredMasjids}
                activeMasjid={activeMasjid}
                onSelectMasjid={(m) => setActiveMasjid(m)}
                communityEvents={processedEvents}
                activeEvent={selectedCommunityEvent}
                onSelectEvent={handleOpenEventDetails}
                onRsvpEvent={rsvpCommunityEvent}
                highlightedEventId={hoveredEventId}
                userCoords={userCoords}
                onRecenterUser={handleGetCurrentLocation}
                theme={theme}
                showEventsLayer={showEventsLayer}
                onToggleEventsLayer={() => setShowEventsLayer(!showEventsLayer)}
                showMasjidsLayer={showMasjidsLayer}
                onToggleMasjidsLayer={() => setShowMasjidsLayer(!showMasjidsLayer)}
                selectedEventCategory={selectedEventCategory}
                showHeatmapLayer={showHeatmapLayer}
                onToggleHeatmapLayer={() => setShowHeatmapLayer(!showHeatmapLayer)}
                selectedHeatmapPrayer={selectedHeatmapPrayer}
                onSelectHeatmapPrayer={setSelectedHeatmapPrayer}
              />
            </div>

            {/* List of Mosque Cards */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-[#141A14] dark:text-[#E4E8E4] px-1">
                Daftar Masjid Terdekat ({filteredMasjids.length})
              </h3>

              {filteredMasjids.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-[#1A1D1A] rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] text-xs">
                  Tidak ditemukan masjid yang sesuai dengan kata kunci atau filter radius.
                </div>
              ) : (
                filteredMasjids.map((masjid) => {
                  const isSelected = activeMasjid?.id === masjid.id;
                  const travel = getTravelTime(masjid.distanceKm);
                  const crowd = masjid.prayerPeakData;
                  const occupancy = crowd?.currentCrowdPercent || 45;
                  const isQuiet = occupancy < 45;
                  const isModerate = occupancy >= 45 && occupancy <= 75;
                  const visitSummary = MasjidVisitStorage.getMasjidVisitSummary(masjid.id);

                  return (
                    <div
                      key={masjid.id}
                      onClick={() => setActiveMasjid(masjid)}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col sm:flex-row gap-4 ${
                        isSelected
                          ? 'bg-[#2E7D32]/5 border-[#2E7D32] ring-1 ring-[#2E7D32] shadow-md'
                          : 'bg-white dark:bg-[#1A1D1A] border-[#D8DFD8] dark:border-[#2D332D] hover:border-[#2E7D32]/50 shadow-sm'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={masjid.photoUrl}
                          alt={masjid.name}
                          className="w-full sm:w-36 h-32 rounded-2xl object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-[10px] font-bold">
                          {masjid.type || 'Masjid Jami'}
                        </div>
                        {visitSummary.visited && (
                          <div className="absolute bottom-2 left-2 bg-emerald-700/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-black flex items-center gap-1 shadow">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{visitSummary.count}x Kunjungan</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-2.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-sm text-[#141A14] dark:text-[#E4E8E4]">
                                  {masjid.name}
                                </h4>
                              </div>
                              <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] mt-0.5 line-clamp-1">
                                {masjid.address}
                              </p>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-xs font-black text-[#2E7D32] dark:text-[#4CAF50] block">
                                {masjid.distanceKm} km
                              </span>
                              <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                                dari Anda
                              </span>
                            </div>
                          </div>

                          {/* Live Rating & Reviews & Crowd Status */}
                          <div className="flex items-center flex-wrap gap-2 mt-2">
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span>{masjid.rating || 4.9}</span>
                            </div>
                            <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                              ({masjid.reviewCount || 120} ulasan)
                            </span>
                            <span className="text-[#5A665B]">•</span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                              isQuiet
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                : isModerate
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                            }`}>
                              <Flame className="w-3 h-3 fill-current" />
                              <span>{occupancy}% Kapasitas ({isQuiet ? 'Sepi / Nyaman' : isModerate ? 'Sedang' : 'Padat'})</span>
                            </span>
                          </div>
                        </div>

                        {/* Estimated Travel Time Badges & Actions */}
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#D8DFD8]/60 dark:border-[#2D332D]/60 flex-wrap">
                          <div className="flex items-center gap-1.5 text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                            <span className="flex items-center gap-1 bg-[#EEF3EE] dark:bg-[#242924] px-2 py-0.5 rounded-md">
                              <Car className="w-3 h-3 text-[#2E7D32]" /> {travel.car}
                            </span>
                            <span className="flex items-center gap-1 bg-[#EEF3EE] dark:bg-[#242924] px-2 py-0.5 rounded-md">
                              <Bike className="w-3 h-3 text-[#2E7D32]" /> {travel.motor}
                            </span>
                            <span className="flex items-center gap-1 bg-[#EEF3EE] dark:bg-[#242924] px-2 py-0.5 rounded-md">
                              <Footprints className="w-3 h-3 text-[#2E7D32]" /> {travel.walk}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenCheckIn(masjid);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-[#2E7D32]/10 hover:bg-[#2E7D32]/20 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Check-In</span>
                          </button>
                        </div>

                        {/* Facilities tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {masjid.facilities.slice(0, 4).map((fac, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-[#EEF3EE] dark:bg-[#242924] text-[10px] text-[#141A14] dark:text-[#E4E8E4] border border-[#D8DFD8] dark:border-[#2D332D]"
                            >
                              {fac}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Mosque Deep Dive & Reviews (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {activeMasjid ? (
              <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-6 sticky top-24">
                
                {/* Header Image */}
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <img
                    src={activeMasjid.photoUrl}
                    alt={activeMasjid.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="px-2 py-0.5 rounded-md bg-[#2E7D32] text-[10px] font-bold">
                      {activeMasjid.type || 'Masjid Jami'}
                    </span>
                    <h3 className="font-extrabold text-base sm:text-lg leading-tight mt-1">
                      {activeMasjid.name}
                    </h3>
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-4 text-xs">
                  
                  {/* Address & GPS */}
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#141A14] dark:text-[#E4E8E4]">{activeMasjid.address}</p>
                      <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] mt-0.5">
                        Jarak dari titik GPS Anda: <strong>{activeMasjid.distanceKm} km</strong>
                      </p>
                    </div>
                  </div>

                  {/* Peak Prayer Times Heatmap & Crowd Breakdown Card */}
                  {activeMasjid.prayerPeakData && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#EEF3EE] to-[#E2EBE2] dark:from-[#242924] dark:to-[#1C201C] border border-[#D8DFD8] dark:border-[#2D332D] space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-xl ${
                            activeMasjid.prayerPeakData.currentCrowdPercent < 45
                              ? 'bg-emerald-500 text-white'
                              : activeMasjid.prayerPeakData.currentCrowdPercent <= 75
                              ? 'bg-amber-500 text-white'
                              : 'bg-rose-500 text-white'
                          }`}>
                            <Flame className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-extrabold text-xs text-[#141A14] dark:text-[#E4E8E4] block">
                              Kepadatan Waktu Shalat Real-Time
                            </span>
                            <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                              Live sensor occupancy & historis jamaah
                            </span>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-black shadow-sm ${
                          activeMasjid.prayerPeakData.currentCrowdPercent < 45
                            ? 'bg-emerald-500 text-white'
                            : activeMasjid.prayerPeakData.currentCrowdPercent <= 75
                            ? 'bg-amber-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}>
                          {activeMasjid.prayerPeakData.currentCrowdPercent}% Terisi
                        </span>
                      </div>

                      {/* Real-Time Occupancy Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#5A665B] dark:text-[#A0A8A0]">Status Saat Ini:</span>
                          <strong className="text-[#141A14] dark:text-[#E4E8E4]">
                            {activeMasjid.prayerPeakData.currentCrowdLevel === 'SEPI_LELUASA'
                              ? '🟢 Lenggang & Sangat Nyaman'
                              : activeMasjid.prayerPeakData.currentCrowdLevel === 'SEDANG'
                              ? '🟡 Kepadatan Normal / Sedang'
                              : '🔴 Padat / Jam Puncak Jamaah'}
                          </strong>
                        </div>
                        <div className="w-full h-2.5 bg-gray-200 dark:bg-[#141A14] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              activeMasjid.prayerPeakData.currentCrowdPercent < 45
                                ? 'bg-emerald-500'
                                : activeMasjid.prayerPeakData.currentCrowdPercent <= 75
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${activeMasjid.prayerPeakData.currentCrowdPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Hourly Density Histogram (04:00 to 21:00) */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                          <span className="font-bold">Grafik Estimasi Kepadatan Jam Shalat:</span>
                          <span>04:00 - 21:00</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1.5 h-16 items-end pt-1">
                          {activeMasjid.prayerPeakData.hourlyHeatmap.map((item, idx) => {
                            const isPeakHour = item.densityPercent > 70;
                            const isQuietHour = item.densityPercent < 40;
                            return (
                              <div key={idx} className="flex flex-col items-center gap-1 group relative">
                                <div
                                  className={`w-full rounded-t transition-all ${
                                    isQuietHour
                                      ? 'bg-emerald-400 group-hover:bg-emerald-500'
                                      : isPeakHour
                                      ? 'bg-rose-500 group-hover:bg-rose-600'
                                      : 'bg-amber-400 group-hover:bg-amber-500'
                                  }`}
                                  style={{ height: `${Math.max(12, (item.densityPercent / 100) * 44)}px` }}
                                />
                                <span className="text-[8px] font-bold text-[#5A665B] dark:text-[#A0A8A0]">
                                  {item.hour.split(':')[0]}h
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Prayer Breakdown Summary */}
                      <div className="pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase text-[#5A665B] dark:text-[#A0A8A0] block">
                          Detail Per Waktu Shalat:
                        </span>
                        <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                          {[
                            { name: 'Subuh', data: activeMasjid.prayerPeakData.prayerDensity.fajr },
                            { name: 'Dzuhur', data: activeMasjid.prayerPeakData.prayerDensity.dhuhr },
                            { name: 'Ashar', data: activeMasjid.prayerPeakData.prayerDensity.asr },
                            { name: 'Maghrib', data: activeMasjid.prayerPeakData.prayerDensity.maghrib },
                            { name: 'Isya', data: activeMasjid.prayerPeakData.prayerDensity.isha },
                            { name: 'Jum\'at', data: activeMasjid.prayerPeakData.prayerDensity.jumaat },
                          ].map((p, pIdx) => (
                            <div
                              key={pIdx}
                              className="p-1.5 rounded-xl bg-white/70 dark:bg-[#1A1D1A]/70 border border-[#D8DFD8] dark:border-[#2D332D] flex flex-col justify-between"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">{p.name}</span>
                                <span className={`text-[9px] font-extrabold ${
                                  p.data.crowdLevel === 'SEPI_LELUASA'
                                    ? 'text-emerald-600'
                                    : p.data.crowdLevel === 'SEDANG'
                                    ? 'text-amber-600'
                                    : 'text-rose-600'
                                }`}>
                                  {p.data.crowdPercent}%
                                </span>
                              </div>
                              <span className="text-[9px] text-[#5A665B] dark:text-[#A0A8A0] mt-0.5">
                                Antrean: ~{p.data.estimatedWudhuWaitMinutes} mnt
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Smart Advice */}
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-900 dark:text-emerald-200 space-y-0.5">
                        <div className="flex items-center gap-1 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>Waktu Terbaik untuk Shalat Khusyuk:</span>
                        </div>
                        <p className="pl-4.5">
                          {activeMasjid.prayerPeakData.bestTimeToVisit} (Kapasitas Muslimah: {activeMasjid.prayerPeakData.prayerDensity.fajr.femaleAreaStatus})
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Rating Breakdown & Reviews Trigger */}
                  <div className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                          {activeMasjid.rating || 4.9}
                        </div>
                        <div>
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                          <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                            {activeMasjid.reviewCount || 120} Ulasan Jamaah Komunitas
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setReviewModalMasjid(activeMasjid)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] hover:border-[#2E7D32] text-[#2E7D32] dark:text-[#4CAF50] font-bold text-[11px] shadow-sm transition-all flex items-center gap-1"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                        <span>Buka Ulasan</span>
                      </button>
                    </div>

                    {/* Breakdown pill tags */}
                    {activeMasjid.ratingsBreakdown && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D] text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-[#5A665B] dark:text-[#A0A8A0]">Kebersihan Wudhu:</span>
                          <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">{activeMasjid.ratingsBreakdown.cleanliness}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5A665B] dark:text-[#A0A8A0]">Kejernihan Suara:</span>
                          <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">{activeMasjid.ratingsBreakdown.acAcoustics}/5</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Personal Visit History & Check-In Action for Active Mosque */}
                  {(() => {
                    const visitSummary = MasjidVisitStorage.getMasjidVisitSummary(activeMasjid.id);
                    return (
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2.5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                              <History className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="font-extrabold text-xs text-[#141A14] dark:text-[#E4E8E4]">
                                Jurnal Kunjungan Anda
                              </h5>
                              <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                                {visitSummary.visited 
                                  ? `Sudah ${visitSummary.count}x dikunjungi • Terakhir: ${visitSummary.lastVisited ? new Date(visitSummary.lastVisited).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}` 
                                  : 'Belum ada catatan kunjungan ke masjid ini'}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleOpenCheckIn(activeMasjid)}
                            className="px-3 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-[11px] flex items-center gap-1 shadow-sm transition-all active:scale-95 shrink-0"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>+ Check-In</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Navigation GPS Button */}
                  <div className="flex gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${activeMasjid.lat},${activeMasjid.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Buka Petunjuk Arah GPS ({activeMasjid.distanceKm} km)</span>
                    </a>
                  </div>

                  {/* Upcoming Kajian Schedule & RSVP */}
                  <div className="space-y-3 pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D]">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#141A14] dark:text-[#E4E8E4] uppercase text-[11px] block">
                        Jadwal Kajian Ilmu & Majelis Taklim:
                      </span>
                      <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                        {activeMasjid.kajianSchedule?.length || 0} Agenda
                      </span>
                    </div>

                    {activeMasjid.kajianSchedule && activeMasjid.kajianSchedule.length > 0 ? (
                      activeMasjid.kajianSchedule.map((k) => (
                        <div
                          key={k.id}
                          className="p-3.5 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-2.5"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-[#2E7D32] dark:text-[#4CAF50] block">
                                📅 {k.date} • {k.time}
                              </span>
                              {k.isLiveStreamed && (
                                <span className="px-1.5 py-0.5 rounded bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] text-[9px] font-bold">
                                  Live Stream
                                </span>
                              )}
                            </div>
                            <h5 className="font-extrabold text-xs text-[#141A14] dark:text-[#E4E8E4] mt-0.5">
                              {k.title}
                            </h5>
                            <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                              Pemateri: <strong className="text-[#141A14] dark:text-[#E4E8E4]">{k.speaker}</strong>
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-[#D8DFD8] dark:border-[#2D332D]">
                            <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{k.attendeesCount} Jamaah RSVP</span>
                            </span>

                            <button
                              onClick={() => rsvpKajian(activeMasjid.id, k.id)}
                              className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 ${
                                k.userRsvp
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-[#2E7D32] hover:bg-[#256629] text-white'
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{k.userRsvp ? 'Terdaftar' : 'RSVP Hadir'}</span>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] italic">
                        Belum ada jadwal kajian terbaru yang dirilis DKM.
                      </p>
                    )}
                  </div>

                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white dark:bg-[#1A1D1A] rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] text-xs">
                Pilih salah satu masjid di peta atau daftar untuk melihat profil lengkap.
              </div>
            )}
          </div>

        </div>
      )}

      {/* List-Only View */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMasjids.map((masjid) => {
            const travel = getTravelTime(masjid.distanceKm);
            const crowd = masjid.prayerPeakData;
            const occupancy = crowd?.currentCrowdPercent || 45;
            const isQuiet = occupancy < 45;
            const isModerate = occupancy >= 45 && occupancy <= 75;
            const visitSummary = MasjidVisitStorage.getMasjidVisitSummary(masjid.id);

            return (
              <div
                key={masjid.id}
                className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-5 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm hover:border-[#2E7D32] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative h-44 rounded-2xl overflow-hidden">
                    <img
                      src={masjid.photoUrl}
                      alt={masjid.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-lg text-xs font-bold">
                      {masjid.type || 'Masjid Jami'}
                    </div>
                    {visitSummary.visited && (
                      <div className="absolute bottom-2 left-2 bg-emerald-700/90 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-lg text-xs font-black flex items-center gap-1 shadow">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{visitSummary.count}x Kunjungan</span>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-[#1A1D1A]/90 text-[#2E7D32] dark:text-[#4CAF50] px-2.5 py-0.5 rounded-lg text-xs font-black shadow">
                      📍 {masjid.distanceKm} km
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold backdrop-blur-md shadow flex items-center gap-1 ${
                        isQuiet
                          ? 'bg-emerald-600/90 text-white'
                          : isModerate
                          ? 'bg-amber-600/90 text-white'
                          : 'bg-rose-600/90 text-white'
                      }`}>
                        <Flame className="w-3 h-3 fill-current" />
                        <span>{occupancy}% {isQuiet ? 'Sepi' : isModerate ? 'Sedang' : 'Padat'}</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-[#141A14] dark:text-[#E4E8E4]">
                      {masjid.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{masjid.rating || 4.9}</span>
                      </div>
                      <span className="text-[#5A665B] dark:text-[#A0A8A0] text-[11px]">
                        ({masjid.reviewCount || 120} ulasan)
                      </span>
                    </div>
                    <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] mt-1 line-clamp-2">
                      {masjid.address}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {masjid.facilities.slice(0, 3).map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#EEF3EE] dark:bg-[#242924] text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D8DFD8] dark:border-[#2D332D] flex gap-2">
                  <button
                    onClick={() => handleOpenCheckIn(masjid)}
                    className="px-3 py-2 rounded-xl bg-[#2E7D32]/10 hover:bg-[#2E7D32]/20 text-[#2E7D32] dark:text-[#4CAF50] font-extrabold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Check-In</span>
                  </button>
                  <button
                    onClick={() => setReviewModalMasjid(masjid)}
                    className="flex-1 py-2 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#D8DFD8] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] font-bold text-xs transition-colors"
                  >
                    Ulasan
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${masjid.lat},${masjid.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>GPS</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Visit History Log View */}
      {viewMode === 'visit-history' && (
        <MasjidVisitHistoryView
          visits={visitHistory}
          onOpenCheckInModal={() => handleOpenCheckIn()}
          onDeleteVisit={handleDeleteVisit}
          onResetDefault={handleResetDefaultVisits}
          onSelectMasjidOnMap={(masjidId) => {
            const target = masjids.find(m => m.id === masjidId);
            if (target) {
              setActiveMasjid(target);
              setViewMode('split');
            }
          }}
        />
      )}

      {/* Interactive Community Events Radar Section (when not purely browsing history) */}
      {viewMode !== 'visit-history' && (
        <CommunityEventsRadar
          events={processedEvents}
          onSelectEvent={handleOpenEventDetails}
          onRsvpEvent={rsvpCommunityEvent}
          onHoverEvent={(id) => setHoveredEventId(id)}
          onOpenAddModal={() => setIsAddEventOpen(true)}
          selectedCategory={selectedEventCategory}
          onSelectCategory={setSelectedEventCategory}
          showEventsOnMap={showEventsLayer}
          onToggleShowEventsOnMap={() => setShowEventsLayer(!showEventsLayer)}
          hoveredEventId={hoveredEventId}
        />
      )}

      {/* Community Event Details Modal */}
      {isEventDetailsOpen && selectedCommunityEvent && (
        <CommunityEventDetailsModal
          event={selectedCommunityEvent}
          isOpen={isEventDetailsOpen}
          onClose={() => setIsEventDetailsOpen(false)}
          onRsvp={(id) => {
            rsvpCommunityEvent(id);
            setSelectedCommunityEvent(prev => prev && prev.id === id ? {
              ...prev,
              userRsvp: !prev.userRsvp,
              attendeesCount: !prev.userRsvp ? prev.attendeesCount + 1 : Math.max(0, prev.attendeesCount - 1)
            } : prev);
          }}
        />
      )}

      {/* Add Community Event Modal */}
      {isAddEventOpen && (
        <AddCommunityEventModal
          isOpen={isAddEventOpen}
          onClose={() => setIsAddEventOpen(false)}
          onAddEvent={addCommunityEvent}
          masjids={masjids}
        />
      )}

      {/* Community Review Modal */}
      {reviewModalMasjid && (
        <MasjidReviewModal
          masjid={reviewModalMasjid}
          isOpen={!!reviewModalMasjid}
          onClose={() => setReviewModalMasjid(null)}
          onAddReview={(masjidId, review) => addMasjidReview(masjidId, review)}
        />
      )}

      {/* Masjid Check-In Log Modal */}
      {isCheckInModalOpen && (
        <MasjidCheckInModal
          isOpen={isCheckInModalOpen}
          onClose={() => setIsCheckInModalOpen(false)}
          masjids={masjids}
          initialMasjid={checkInTargetMasjid}
          userCoords={userCoords}
          onVisitSaved={handleVisitSaved}
        />
      )}

    </div>
  );
};
