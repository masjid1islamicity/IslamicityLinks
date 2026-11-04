import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MasjidLocation, CommunityEvent } from '../types';
import { 
  Crosshair, 
  Layers, 
  Maximize2, 
  MapPin, 
  Navigation, 
  Star, 
  ZoomIn, 
  ZoomOut,
  Sparkles,
  Volume2,
  Calendar,
  Clock,
  Users,
  Flame,
  Radio,
  CheckCircle2,
  ExternalLink,
  Car,
  Footprints,
  Bike,
  Route,
  X,
  ArrowRight,
  LocateFixed,
  Compass,
  CornerUpRight,
  ShieldCheck
} from 'lucide-react';

interface MasjidInteractiveMapProps {
  masjids: MasjidLocation[];
  activeMasjid: MasjidLocation | null;
  onSelectMasjid: (masjid: MasjidLocation) => void;
  communityEvents?: CommunityEvent[];
  activeEvent?: CommunityEvent | null;
  onSelectEvent?: (event: CommunityEvent) => void;
  onRsvpEvent?: (eventId: string) => void;
  highlightedEventId?: string | null;
  userCoords: { lat: number; lng: number } | null;
  onRecenterUser: () => void;
  theme: 'light' | 'dark';
  showEventsLayer?: boolean;
  onToggleEventsLayer?: () => void;
  showMasjidsLayer?: boolean;
  onToggleMasjidsLayer?: () => void;
  selectedEventCategory?: string;
  showHeatmapLayer?: boolean;
  onToggleHeatmapLayer?: () => void;
  selectedHeatmapPrayer?: 'current' | 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'jumaat';
  onSelectHeatmapPrayer?: (prayer: 'current' | 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'jumaat') => void;
}

export const MasjidInteractiveMap: React.FC<MasjidInteractiveMapProps> = ({
  masjids,
  activeMasjid,
  onSelectMasjid,
  communityEvents = [],
  activeEvent = null,
  onSelectEvent,
  onRsvpEvent,
  highlightedEventId = null,
  userCoords,
  onRecenterUser,
  theme,
  showEventsLayer = true,
  onToggleEventsLayer,
  showMasjidsLayer = true,
  onToggleMasjidsLayer,
  selectedEventCategory = 'ALL',
  showHeatmapLayer,
  onToggleHeatmapLayer,
  selectedHeatmapPrayer,
  onSelectHeatmapPrayer,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const eventMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userRadiusCircleRef = useRef<L.Circle | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const [mapTileStyle, setMapTileStyle] = useState<'voyager' | 'dark' | 'osm'>('voyager');
  const [showRadiusRange, setShowRadiusRange] = useState<boolean>(true);
  const [showLayersDropdown, setShowLayersDropdown] = useState<boolean>(false);
  const eventMarkerMapRef = useRef<{ [id: string]: L.Marker }>({});

  // Internal heatmap state fallback if not controlled from parent
  const [internalShowHeatmap, setInternalShowHeatmap] = useState<boolean>(true);
  const [internalHeatmapPrayer, setInternalHeatmapPrayer] = useState<'current' | 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'jumaat'>('current');

  const isHeatmapActive = showHeatmapLayer !== undefined ? showHeatmapLayer : internalShowHeatmap;
  const activeHeatmapPrayer = selectedHeatmapPrayer !== undefined ? selectedHeatmapPrayer : internalHeatmapPrayer;

  const handleToggleHeatmap = () => {
    if (onToggleHeatmapLayer) {
      onToggleHeatmapLayer();
    } else {
      setInternalShowHeatmap(!internalShowHeatmap);
    }
  };

  const handleSelectPrayer = (prayer: 'current' | 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'jumaat') => {
    if (onSelectHeatmapPrayer) {
      onSelectHeatmapPrayer(prayer);
    } else {
      setInternalHeatmapPrayer(prayer);
    }
  };

  // Helper to compute crowd info for any mosque for a given prayer time
  const getCrowdInfoForPrayer = (
    masjid: MasjidLocation,
    prayer: 'current' | 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'jumaat'
  ) => {
    const peak = masjid.prayerPeakData;
    if (!peak) {
      return {
        occupancy: 40,
        label: 'Sepi & Leluasa',
        color: '#10B981',
        bgLight: '#ECFDF5',
        badgeColor: '#059669',
        estimatedJamaah: Math.round((masjid.capacity || 2000) * 0.4),
        parkingStatus: 'TERSEDIA_LELUASA',
        recommendation: 'Kondisi masjid sangat lapang dan kondusif untuk ibadah khusyuk.'
      };
    }

    let occupancy = peak.currentCrowdPercent;
    let recommendation = 'Waktu ideal untuk ibadah tenang tanpa antrean wudhu.';
    let estimatedJamaah = Math.round((masjid.capacity || 2000) * (occupancy / 100));
    let parkingStatus = 'TERSEDIA_LELUASA';

    if (prayer !== 'current' && peak.prayerDensity && peak.prayerDensity[prayer]) {
      const pData = peak.prayerDensity[prayer];
      occupancy = pData.occupancyPercent;
      recommendation = pData.recommendation;
      estimatedJamaah = pData.estimatedJamaah;
      parkingStatus = pData.parkingStatus;
    }

    let label = 'Sepi & Leluasa';
    let color = '#10B981'; // Emerald Green
    let bgLight = '#ECFDF5';
    let badgeColor = '#059669';

    if (occupancy >= 75) {
      label = 'Sangat Padat (Puncak)';
      color = '#EF4444'; // Rose Red
      bgLight = '#FEF2F2';
      badgeColor = '#DC2626';
    } else if (occupancy >= 45) {
      label = 'Kepadatan Sedang';
      color = '#F59E0B'; // Amber Orange
      bgLight = '#FFFBEB';
      badgeColor = '#D97706';
    }

    return {
      occupancy,
      label,
      color,
      bgLight,
      badgeColor,
      estimatedJamaah,
      parkingStatus,
      recommendation
    };
  };

  // Active Navigation Route State
  const [activeRouteTarget, setActiveRouteTarget] = useState<{
    type: 'masjid' | 'event';
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    photoUrl: string;
  } | null>(null);

  const [travelMode, setTravelMode] = useState<'driving' | 'motor' | 'walking'>('driving');

  // Calculate Geodesic Haversine Distance (km)
  const calculateHaversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Helper for computing travel estimates
  const getTravelEstimates = (targetLat: number, targetLng: number) => {
    const userLat = userCoords?.lat || -6.1754;
    const userLng = userCoords?.lng || 106.8272;
    const rawDistance = calculateHaversine(userLat, userLng, targetLat, targetLng);

    // Driving urban road factor ~1.25x
    const drivingDistanceKm = parseFloat((Math.max(0.1, rawDistance * 1.25)).toFixed(1));
    const drivingMins = Math.max(1, Math.round((drivingDistanceKm / 30) * 60) + 2);

    // Motor urban road factor ~1.20x
    const motorDistanceKm = parseFloat((Math.max(0.1, rawDistance * 1.20)).toFixed(1));
    const motorMins = Math.max(1, Math.round((motorDistanceKm / 40) * 60) + 1);

    // Walking urban pathway factor ~1.15x
    const walkingDistanceKm = parseFloat((Math.max(0.1, rawDistance * 1.15)).toFixed(1));
    const walkingMins = Math.max(1, Math.round((walkingDistanceKm / 4.5) * 60));
    const walkingCalories = Math.round(walkingDistanceKm * 65); // ~65 kcal per km

    // Formatted Estimated Time of Arrival (ETA)
    const getEta = (mins: number) => {
      const d = new Date();
      d.setMinutes(d.getMinutes() + mins);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} WIB`;
    };

    return {
      rawDistance: parseFloat(rawDistance.toFixed(1)),
      driving: {
        distanceKm: drivingDistanceKm,
        durationMins: drivingMins,
        durationText: drivingMins > 60 ? `${(drivingMins / 60).toFixed(1)} jam` : `${drivingMins} mnt`,
        eta: getEta(drivingMins),
      },
      motor: {
        distanceKm: motorDistanceKm,
        durationMins: motorMins,
        durationText: motorMins > 60 ? `${(motorMins / 60).toFixed(1)} jam` : `${motorMins} mnt`,
        eta: getEta(motorMins),
      },
      walking: {
        distanceKm: walkingDistanceKm,
        durationMins: walkingMins,
        durationText: walkingMins > 60 ? `${(walkingMins / 60).toFixed(1)} jam` : `${walkingMins} mnt`,
        eta: getEta(walkingMins),
        calories: walkingCalories,
      }
    };
  };

  // Trigger Navigation Route on Map
  const handleStartNavigation = (target: {
    type: 'masjid' | 'event';
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    photoUrl: string;
  }, preferredMode: 'driving' | 'motor' | 'walking' = 'driving') => {
    setActiveRouteTarget(target);
    setTravelMode(preferredMode);

    const map = mapInstanceRef.current;
    if (!map) return;

    const userLat = userCoords?.lat || -6.1754;
    const userLng = userCoords?.lng || 106.8272;

    // Fit map bounds to show full route from user to destination
    const bounds = L.latLngBounds([
      [userLat, userLng],
      [target.lat, target.lng]
    ]);
    map.fitBounds(bounds, { padding: [70, 70], maxZoom: 16 });
  };

  // Close Navigation Route
  const handleCloseNavigation = () => {
    setActiveRouteTarget(null);
    if (routeLineRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = userCoords?.lat || -6.1754;
    const initialLng = userCoords?.lng || 106.8272;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;
    heatmapLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);
    eventMarkersLayerRef.current = L.layerGroup().addTo(map);

    // Default tile layer
    updateTileLayer(map, theme === 'dark' ? 'dark' : 'voyager');

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer based on theme or style
  const updateTileLayer = (map: L.Map, style: 'voyager' | 'dark' | 'osm') => {
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = '';
    let attribution = '';

    if (style === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attribution = '&copy; OpenStreetMap &copy; CARTO';
    } else if (style === 'voyager') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attribution = '&copy; OpenStreetMap &copy; CARTO';
    } else {
      tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap contributors';
    }

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution,
    }).addTo(map);
  };

  // Sync tiles when theme or style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const activeStyle = theme === 'dark' ? 'dark' : mapTileStyle;
    updateTileLayer(mapInstanceRef.current, activeStyle);
  }, [theme, mapTileStyle]);

  // Helper for category theme colors
  const getEventBadgeColor = (cat: string) => {
    switch (cat) {
      case 'TABLIGH_AKBAR':
        return '#059669'; // emerald-600
      case 'BAZAR_HALAL':
        return '#D97706'; // amber-600
      case 'SUBUH_GABUNGAN':
        return '#2563EB'; // blue-600
      case 'BAKTI_SOSIAL':
        return '#E11D48'; // rose-600
      case 'TAHSIN_QURAN':
        return '#0D9488'; // teal-600
      case 'WORKSHOP_EDUKASI':
        return '#7C3AED'; // purple-600
      default:
        return '#2E7D32';
    }
  };

  // Render Peak Prayer Times Heat Map Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    const heatmapLayer = heatmapLayerRef.current;
    if (!map || !heatmapLayer) return;

    heatmapLayer.clearLayers();

    if (!isHeatmapActive) return;

    masjids.forEach((m) => {
      const crowd = getCrowdInfoForPrayer(m, activeHeatmapPrayer);
      const isSelected = activeMasjid?.id === m.id;

      // Base radius calculation dynamically adapted to mosque capacity and prayer crowd
      const rawBase = Math.sqrt(m.capacity || 4000) * 14 * (crowd.occupancy / 50);
      const baseRadius = Math.min(1350, Math.max(380, rawBase));

      // 1. Outermost ambient glow aura
      const outerAura = L.circle([m.lat, m.lng], {
        radius: baseRadius,
        color: crowd.color,
        fillColor: crowd.color,
        fillOpacity: 0.12,
        weight: isSelected ? 2 : 1,
        dashArray: isSelected ? '4, 4' : undefined,
      });

      // 2. Mid intense heat dispersion ring
      const midAura = L.circle([m.lat, m.lng], {
        radius: baseRadius * 0.58,
        color: crowd.color,
        fillColor: crowd.color,
        fillOpacity: 0.24,
        weight: 1,
      });

      // 3. Core density focus circle
      const coreAura = L.circle([m.lat, m.lng], {
        radius: baseRadius * 0.28,
        color: crowd.color,
        fillColor: crowd.color,
        fillOpacity: 0.42,
        weight: 0,
      });

      // Interactive Heatmap Tooltip
      const prayerNameDisplay = activeHeatmapPrayer === 'current' 
        ? 'Waktu Terkini' 
        : activeHeatmapPrayer === 'fajr' ? 'Shalat Subuh'
        : activeHeatmapPrayer === 'dhuhr' ? 'Shalat Dzuhur'
        : activeHeatmapPrayer === 'asr' ? 'Shalat Ashar'
        : activeHeatmapPrayer === 'maghrib' ? 'Shalat Maghrib'
        : activeHeatmapPrayer === 'isha' ? 'Shalat Isya' : 'Shalat Jum\'at';

      const tooltipContent = `
        <div style="font-family: sans-serif; font-size: 11px; padding: 5px 7px; line-height: 1.35; max-width: 230px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 2px;">
            <span style="font-weight: 800; color: ${crowd.color}; font-size: 11.5px;">🔥 ${crowd.occupancy}% Kapasitas</span>
            <span style="font-size: 9px; font-weight: bold; background: ${crowd.bgLight}; color: ${crowd.badgeColor}; padding: 1px 5px; border-radius: 4px; border: 1px solid ${crowd.color}40;">${crowd.label}</span>
          </div>
          <div style="font-weight: 800; color: #141A14; font-size: 12px; margin-top: 2px;">${m.name}</div>
          <div style="font-size: 10px; color: #5A665B; margin-top: 2px;">
            <span>⏱️ ${prayerNameDisplay}</span> • <span>👥 ~${crowd.estimatedJamaah.toLocaleString('id-ID')} Jamaah</span>
          </div>
          <div style="font-size: 9.5px; color: #2E7D32; font-weight: 600; margin-top: 4px; background: #F4F7F4; padding: 3px 6px; border-radius: 5px; border: 1px solid #D8DFD8;">
            💡 ${crowd.recommendation}
          </div>
        </div>
      `;

      outerAura.bindTooltip(tooltipContent, {
        sticky: true,
        direction: 'top',
        opacity: 0.98,
      });

      outerAura.on('click', () => {
        onSelectMasjid(m);
      });

      heatmapLayer.addLayer(outerAura);
      heatmapLayer.addLayer(midAura);
      heatmapLayer.addLayer(coreAura);
    });
  }, [masjids, isHeatmapActive, activeHeatmapPrayer, activeMasjid]);

  // Update Mosque Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    if (!showMasjidsLayer) return;

    // Add Mosque Markers
    masjids.forEach((m) => {
      const isSelected = activeMasjid?.id === m.id;
      const crowd = getCrowdInfoForPrayer(m, activeHeatmapPrayer);
      
      const customIcon = L.divIcon({
        className: 'custom-masjid-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s;">
            <div style="
              width: ${isSelected ? '44px' : '36px'};
              height: ${isSelected ? '44px' : '36px'};
              background: ${isSelected ? '#1F3D22' : '#2E7D32'};
              border: ${isSelected ? '3px solid #4CAF50' : '2px solid #FFFFFF'};
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
            ">
              <span style="transform: rotate(45deg); font-size: ${isSelected ? '18px' : '14px'}; font-weight: bold;">🕌</span>
            </div>
            
            ${isHeatmapActive ? `
              <div style="
                background: ${crowd.color};
                color: #FFFFFF;
                padding: 1px 6px;
                border-radius: 10px;
                font-size: 9px;
                font-weight: 800;
                margin-top: 3px;
                white-space: nowrap;
                box-shadow: 0 2px 6px rgba(0,0,0,0.25);
                border: 1.5px solid #FFFFFF;
                display: flex;
                align-items: center;
                gap: 2px;
                letter-spacing: 0.2px;
              ">
                <span>🔥 ${crowd.occupancy}%</span>
              </div>
            ` : `
              <div style="
                background: ${isSelected ? '#141A14' : '#FFFFFF'};
                color: ${isSelected ? '#4CAF50' : '#141A14'};
                padding: 2px 6px;
                border-radius: 8px;
                font-size: 10px;
                font-weight: 800;
                margin-top: 4px;
                white-space: nowrap;
                box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                border: 1px solid ${isSelected ? '#4CAF50' : '#D8DFD8'};
                display: flex;
                align-items: center;
                gap: 3px;
              ">
                <span>★ ${m.rating || 4.9}</span>
                <span style="opacity: 0.5;">•</span>
                <span>${m.distanceKm} km</span>
              </div>
            `}
          </div>
        `,
        iconSize: [44, 64],
        iconAnchor: [22, 56],
        popupAnchor: [0, -52],
      });

      const marker = L.marker([m.lat, m.lng], { icon: customIcon });

      // Build Rich HTML Popup with Geolocation Distance, Peak Prayer Times Crowd Breakdown & Get Directions
      const estimates = getTravelEstimates(m.lat, m.lng);
      const prayerCrowd = getCrowdInfoForPrayer(m, activeHeatmapPrayer);
      const peakData = m.prayerPeakData;

      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 text-xs space-y-2.5 max-w-[290px]';
      popupContent.innerHTML = `
        <div style="position: relative; height: 95px; border-radius: 12px; overflow: hidden; margin-bottom: 6px;">
          <img src="${m.photoUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${m.name}" />
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.85), transparent); padding: 4px 8px; color: white; display: flex; justify-content: space-between; align-items: flex-end;">
            <span style="font-size: 9px; font-weight: bold; background: #2E7D32; padding: 2px 6px; border-radius: 4px;">${m.type || 'Masjid Jami'}</span>
            <span style="font-size: 9px; font-weight: 800; background: ${prayerCrowd.color}; color: white; padding: 2px 6px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.3);">🔥 ${prayerCrowd.occupancy}% Kapasitas</span>
          </div>
        </div>

        <div>
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 4px;">
            <h4 style="font-weight: 800; font-size: 13px; line-height: 1.25; margin: 0; color: #141A14;">${m.name}</h4>
          </div>
          <div style="display: flex; align-items: center; gap: 4px; margin-top: 3px; font-size: 10px; color: #2E7D32; font-weight: bold;">
            <span>⭐ ${m.rating || 4.9} (${m.reviewCount || 100}+ jamaah)</span>
            <span>•</span>
            <span>📍 ${m.distanceKm} km</span>
          </div>
          <p style="font-size: 10px; color: #5A665B; margin-top: 3px; line-height: 1.3;">${m.address.substring(0, 65)}...</p>
        </div>

        <!-- Visual Heatmap & Peak Prayer Times Crowd Level Widget in Popup -->
        <div style="background: ${prayerCrowd.bgLight}; border-radius: 10px; padding: 7px 9px; border: 1px solid ${prayerCrowd.color}40; margin-top: 6px;">
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; font-weight: 800; color: ${prayerCrowd.badgeColor}; margin-bottom: 4px;">
            <span style="display: flex; align-items: center; gap: 3px;">
              <span>🔥 Tingkat Kepadatan Shalat</span>
            </span>
            <span style="background: ${prayerCrowd.color}; color: white; font-size: 9px; padding: 1px 5px; border-radius: 4px;">
              ${prayerCrowd.label}
            </span>
          </div>

          <div style="width: 100%; height: 6px; background: #E2E8E2; border-radius: 99px; overflow: hidden; margin-bottom: 5px;">
            <div style="height: 100%; width: ${prayerCrowd.occupancy}%; background: ${prayerCrowd.color}; border-radius: 99px;"></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 9px; color: #5A665B;">
            <div>
              <span style="font-weight: bold; color: #10B981;">🟢 Paling Sepi:</span>
              <span style="display: block; color: #141A14; font-weight: 600;">${peakData?.quietestPrayer || 'Subuh & Ashar'}</span>
            </div>
            <div>
              <span style="font-weight: bold; color: #EF4444;">🔴 Jam Puncak:</span>
              <span style="display: block; color: #141A14; font-weight: 600;">${peakData?.peakPrayer || 'Jum\'at & Maghrib'}</span>
            </div>
          </div>

          <div style="font-size: 9px; color: #2E7D32; font-weight: 600; margin-top: 5px; padding-top: 4px; border-top: 1px dashed ${prayerCrowd.color}30;">
            💡 ${prayerCrowd.recommendation}
          </div>
        </div>

        <!-- Calculated Distance & Geolocation Breakdown -->
        <div style="background: #F4F7F4; border-radius: 10px; padding: 7px 9px; border: 1px solid #D8DFD8; margin-top: 6px;">
          <div style="font-size: 9px; font-weight: 800; color: #5A665B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
            <span>Estimasi Rute dari Lokasi Anda</span>
            <span style="color: #2E7D32; font-weight: 800;">GPS Aktif</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 10px;">
            <div style="background: #FFFFFF; padding: 4px 6px; border-radius: 6px; border: 1px solid #E2E8E2;">
              <span style="color: #2E7D32; font-weight: 800; display: flex; align-items: center; gap: 3px;">
                🚗 ${estimates.driving.distanceKm} km
              </span>
              <span style="color: #687368; font-size: 9px; display: block;">~${estimates.driving.durationText} berkendara</span>
            </div>
            <div style="background: #FFFFFF; padding: 4px 6px; border-radius: 6px; border: 1px solid #E2E8E2;">
              <span style="color: #0D9488; font-weight: 800; display: flex; align-items: center; gap: 3px;">
                🚶 ${estimates.walking.distanceKm} km
              </span>
              <span style="color: #687368; font-size: 9px; display: block;">~${estimates.walking.durationText} jalan kaki</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; flex-direction: column; gap: 5px; padding-top: 4px;">
          <button id="popup-directions-${m.id}" style="
            width: 100%;
            padding: 7px 10px;
            background: #2E7D32;
            color: white;
            border-radius: 9px;
            font-size: 11px;
            font-weight: 800;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            box-shadow: 0 2px 6px rgba(46, 125, 50, 0.3);
          ">
            <span>🧭</span>
            <span>Get Directions (Petunjuk Arah)</span>
          </button>

          <div style="display: flex; gap: 4px;">
            <button id="popup-select-${m.id}" style="
              flex: 1;
              padding: 6px 8px;
              background: #EEF3EE;
              color: #141A14;
              border-radius: 8px;
              font-size: 10px;
              font-weight: bold;
              border: 1px solid #D8DFD8;
              cursor: pointer;
            ">
              Lihat Kepadatan & Detail
            </button>

            <a href="https://www.google.com/maps/dir/?api=1&origin=${userCoords?.lat || ''},${userCoords?.lng || ''}&destination=${m.lat},${m.lng}&travelmode=driving" target="_blank" rel="noreferrer" title="Buka Turn-by-Turn Google Maps" style="
              padding: 6px 10px;
              background: #EEF3EE;
              color: #2E7D32;
              border-radius: 8px;
              font-size: 10px;
              font-weight: 800;
              text-decoration: none;
              border: 1px solid #D8DFD8;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 3px;
            ">
              <span>Maps ↗</span>
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onSelectMasjid(m);
      });

      marker.on('popupopen', () => {
        const dirBtn = document.getElementById(`popup-directions-${m.id}`);
        if (dirBtn) {
          dirBtn.onclick = (e) => {
            e.stopPropagation();
            handleStartNavigation({
              type: 'masjid',
              id: m.id,
              name: m.name,
              address: m.address,
              lat: m.lat,
              lng: m.lng,
              photoUrl: m.photoUrl,
            }, 'driving');
            marker.closePopup();
          };
        }

        const selectBtn = document.getElementById(`popup-select-${m.id}`);
        if (selectBtn) {
          selectBtn.onclick = (e) => {
            e.stopPropagation();
            onSelectMasjid(m);
          };
        }
      });

      markersLayer.addLayer(marker);
    });

    // Draw route polyline from user to selected mosque if no specific nav route is active
    if (userCoords && activeMasjid && showMasjidsLayer && !activeRouteTarget) {
      if (routeLineRef.current) {
        map.removeLayer(routeLineRef.current);
      }
      routeLineRef.current = L.polyline(
        [
          [userCoords.lat, userCoords.lng],
          [activeMasjid.lat, activeMasjid.lng]
        ],
        {
          color: '#2E7D32',
          weight: 3,
          dashArray: '6, 8',
          opacity: 0.8,
        }
      ).addTo(map);
    }
  }, [masjids, activeMasjid, userCoords, showMasjidsLayer, activeRouteTarget]);

  // Update Community Events Markers with Interactive Hover Tooltips & Popups
  useEffect(() => {
    const map = mapInstanceRef.current;
    const eventLayer = eventMarkersLayerRef.current;
    if (!map || !eventLayer) return;

    eventLayer.clearLayers();
    eventMarkerMapRef.current = {};

    if (!showEventsLayer || communityEvents.length === 0) return;

    const filteredEvents = communityEvents.filter(
      ev => selectedEventCategory === 'ALL' || ev.category === selectedEventCategory
    );

    filteredEvents.forEach((ev) => {
      const isHighlighted = highlightedEventId === ev.id || activeEvent?.id === ev.id;
      const themeColor = getEventBadgeColor(ev.category);

      const customEventIcon = L.divIcon({
        className: `custom-community-event-marker event-marker-${ev.id}`,
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: ${isHighlighted ? 'scale(1.18)' : 'scale(1)'}; transition: all 0.25s ease;">
            
            <!-- Pulsing Beacon Effect for Active/Hovered Events -->
            <div style="
              position: absolute;
              top: -6px;
              left: 50%;
              transform: translateX(-50%);
              width: ${isHighlighted ? '54px' : '44px'};
              height: ${isHighlighted ? '54px' : '44px'};
              border-radius: 9999px;
              background: ${themeColor};
              opacity: 0.35;
              animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
              pointer-events: none;
            "></div>

            <!-- Main Marker Pin -->
            <div style="
              position: relative;
              width: ${isHighlighted ? '46px' : '38px'};
              height: ${isHighlighted ? '46px' : '38px'};
              background: linear-gradient(135deg, ${themeColor}, #121E13);
              border: ${isHighlighted ? '3px solid #FFFFFF' : '2.5px solid #FFFFFF'};
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 6px 16px rgba(0,0,0,0.45);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              z-index: 10;
            ">
              <span style="transform: rotate(45deg); font-size: ${isHighlighted ? '20px' : '16px'};">
                ${ev.categoryIcon}
              </span>
            </div>

            <!-- Bottom Floating Pill with Event Tag & Date -->
            <div style="
              background: #141A14;
              color: #FFFFFF;
              padding: 2.5px 8px;
              border-radius: 9999px;
              font-size: 9.5px;
              font-weight: 800;
              margin-top: 5px;
              white-space: nowrap;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              border: 1.5px solid ${themeColor};
              display: flex;
              align-items: center;
              gap: 4px;
              z-index: 10;
            ">
              <span style="display: inline-block; width: 6px; height: 6px; border-radius: 9999px; background: ${themeColor};"></span>
              <span style="color: ${themeColor}; font-weight: 900;">EVENT</span>
              <span style="opacity: 0.4;">•</span>
              <span style="max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${ev.date.split(',')[0] || 'Ahad'}</span>
            </div>
          </div>
        `,
        iconSize: [50, 68],
        iconAnchor: [25, 60],
        popupAnchor: [0, -56],
      });

      const marker = L.marker([ev.lat, ev.lng], { icon: customEventIcon });
      eventMarkerMapRef.current[ev.id] = marker;

      // Rich Interactive Hover Popup / Tooltip Content
      const evEstimates = getTravelEstimates(ev.lat, ev.lng);

      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 text-xs space-y-2.5 max-w-[280px] select-none';
      popupContent.innerHTML = `
        <div style="position: relative; height: 95px; border-radius: 12px; overflow: hidden; margin-bottom: 6px;">
          <img src="${ev.photoUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${ev.title}" />
          <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);"></div>
          
          <div style="position: absolute; top: 6px; left: 6px; display: flex; gap: 4px; align-items: center;">
            <span style="font-size: 9px; font-weight: 800; background: ${themeColor}; color: white; padding: 2px 6px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              ${ev.categoryIcon} ${ev.categoryLabel}
            </span>
            ${ev.isLiveStreamed ? '<span style="font-size: 8.5px; font-weight: 800; background: #DC2626; color: white; padding: 2px 5px; border-radius: 6px;">● LIVE</span>' : ''}
          </div>

          <div style="position: absolute; bottom: 6px; left: 8px; right: 8px; color: white;">
            <div style="font-size: 9px; font-weight: 600; opacity: 0.9; display: flex; align-items: center; gap: 3px;">
              <span>🕌 ${ev.masjidName}</span>
            </div>
          </div>
        </div>

        <div style="space-y: 2px;">
          <h4 style="font-weight: 900; font-size: 13px; line-height: 1.25; margin: 0; color: #141A14;">
            ${ev.title}
          </h4>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 10.5px; color: #059669; font-weight: 700; margin-top: 4px;">
            <span>🎙️ ${ev.speakerOrHost}</span>
          </div>
        </div>

        <div style="background: #F4F7F4; border-radius: 10px; padding: 6px 8px; border: 1px solid #D8DFD8; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 10px; color: #404B40;">
          <div>
            <span style="color: #718071; display: block; font-size: 8.5px;">WAKTU</span>
            <strong style="color: #141A14;">${ev.date}</strong>
          </div>
          <div>
            <span style="color: #718071; display: block; font-size: 8.5px;">JARAK (GPS)</span>
            <strong style="color: #059669;">🚗 ${evEstimates.driving.distanceKm} km</strong>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 4px; padding-top: 2px;">
          <button id="hover-directions-btn-${ev.id}" style="
            width: 100%;
            padding: 6px 10px;
            background: #059669;
            color: white;
            border-radius: 9px;
            font-size: 10.5px;
            font-weight: 800;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            box-shadow: 0 2px 5px rgba(5, 150, 105, 0.25);
          ">
            <span>🧭</span>
            <span>Get Directions (${evEstimates.driving.distanceKm} km • ${evEstimates.driving.durationText})</span>
          </button>

          <div style="display: flex; gap: 4px;">
            <button id="hover-rsvp-btn-${ev.id}" style="
              flex: 1;
              padding: 6px 8px;
              background: ${ev.userRsvp ? '#D97706' : '#2E7D32'};
              color: white;
              border-radius: 9px;
              font-size: 10px;
              font-weight: 800;
              border: none;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 3px;
            ">
              <span>${ev.userRsvp ? '✓ Terdaftar' : 'RSVP'}</span>
            </button>

            <button id="hover-detail-btn-${ev.id}" style="
              padding: 6px 10px;
              background: #EEF3EE;
              color: #141A14;
              border-radius: 9px;
              font-size: 10px;
              font-weight: 700;
              border: 1px solid #D8DFD8;
              cursor: pointer;
            ">
              Detail 🔍
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: true,
        autoClose: false,
        className: 'custom-leaflet-event-popup'
      });

      // Hover Interaction: Open popup on mouseover
      let hoverTimeout: any = null;
      marker.on('mouseover', () => {
        clearTimeout(hoverTimeout);
        marker.openPopup();
      });

      marker.on('mouseout', () => {
        // slight grace period before closing so user can click buttons inside popup
        hoverTimeout = setTimeout(() => {
          if (activeEvent?.id !== ev.id && highlightedEventId !== ev.id) {
            marker.closePopup();
          }
        }, 1200);
      });

      // Click Interaction: Open full details modal & center map
      marker.on('click', () => {
        if (onSelectEvent) {
          onSelectEvent(ev);
        }
        marker.openPopup();
      });

      // Wire interactive buttons inside the Leaflet popup
      marker.on('popupopen', () => {
        const dirBtn = document.getElementById(`hover-directions-btn-${ev.id}`);
        if (dirBtn) {
          dirBtn.onclick = (e) => {
            e.stopPropagation();
            handleStartNavigation({
              type: 'event',
              id: ev.id,
              name: `${ev.title} (${ev.masjidName})`,
              address: ev.masjidName,
              lat: ev.lat,
              lng: ev.lng,
              photoUrl: ev.photoUrl,
            }, 'driving');
            marker.closePopup();
          };
        }

        const rsvpBtn = document.getElementById(`hover-rsvp-btn-${ev.id}`);
        if (rsvpBtn) {
          rsvpBtn.onclick = (e) => {
            e.stopPropagation();
            if (onRsvpEvent) {
              onRsvpEvent(ev.id);
            }
          };
        }

        const detailBtn = document.getElementById(`hover-detail-btn-${ev.id}`);
        if (detailBtn) {
          detailBtn.onclick = (e) => {
            e.stopPropagation();
            if (onSelectEvent) {
              onSelectEvent(ev);
            }
          };
        }
      });

      eventLayer.addLayer(marker);

      // If this event is highlighted by list hover or selection, open its popup automatically!
      if (isHighlighted) {
        marker.openPopup();
      }
    });

  }, [communityEvents, activeEvent, highlightedEventId, showEventsLayer, selectedEventCategory]);

  // Update User Location Marker & Accuracy Radar Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }
    if (userRadiusCircleRef.current) {
      map.removeLayer(userRadiusCircleRef.current);
    }

    // Custom Live User Pulse Marker
    const userIcon = L.divIcon({
      className: 'custom-user-gps-marker',
      html: `
        <div style="position: relative; width: 24px; height: 24px;">
          <div class="radar-pulse-ring" style="
            position: absolute;
            inset: -8px;
            border-radius: 9999px;
            background: rgba(46, 125, 50, 0.35);
          "></div>
          <div style="
            width: 20px;
            height: 20px;
            border-radius: 9999px;
            background: #2E7D32;
            border: 3px solid #FFFFFF;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 6px; height: 6px; border-radius: 9999px; background: #FFFFFF;"></div>
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    userMarkerRef.current.bindTooltip('Posisi Anda Sekarang (GPS Terkalibrasi)', {
      permanent: false,
      direction: 'top',
      offset: [0, -12],
      className: 'text-xs font-bold'
    });

    if (showRadiusRange) {
      userRadiusCircleRef.current = L.circle([userCoords.lat, userCoords.lng], {
        radius: 3000, // 3km radius
        color: '#2E7D32',
        fillColor: '#4CAF50',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 6',
      }).addTo(map);
    }
  }, [userCoords, showRadiusRange]);

  // Update Dedicated Navigation Route Polyline with Driving/Motor/Walking Styling
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    const destination = activeRouteTarget || (activeMasjid ? {
      lat: activeMasjid.lat,
      lng: activeMasjid.lng,
    } : null);

    if (userCoords && destination) {
      const isWalking = travelMode === 'walking';
      const isMotor = travelMode === 'motor';

      routeLineRef.current = L.polyline(
        [
          [userCoords.lat, userCoords.lng],
          [destination.lat, destination.lng]
        ],
        {
          color: isWalking ? '#0D9488' : isMotor ? '#D97706' : '#2E7D32',
          weight: isWalking ? 4 : 5,
          dashArray: isWalking ? '6, 8' : undefined,
          opacity: 0.85,
        }
      ).addTo(map);
    }
  }, [userCoords, activeRouteTarget, activeMasjid, travelMode]);

  // Center on active masjid or active event
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (activeEvent) {
      map.flyTo([activeEvent.lat, activeEvent.lng], 15.5, {
        duration: 0.8,
        easeLinearity: 0.25,
      });
      // Open marker popup if found
      const marker = eventMarkerMapRef.current[activeEvent.id];
      if (marker) {
        marker.openPopup();
      }
    } else if (activeMasjid) {
      map.flyTo([activeMasjid.lat, activeMasjid.lng], 15, {
        duration: 0.8,
        easeLinearity: 0.25,
      });
    }
  }, [activeMasjid, activeEvent]);

  // Sync highlighted event from hover
  useEffect(() => {
    if (!highlightedEventId) return;
    const marker = eventMarkerMapRef.current[highlightedEventId];
    if (marker) {
      marker.openPopup();
    }
  }, [highlightedEventId]);

  // Fit all markers in view (both mosques and events)
  const handleFitBounds = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const points: [number, number][] = [];
    if (showMasjidsLayer) {
      masjids.forEach(m => points.push([m.lat, m.lng]));
    }
    if (showEventsLayer) {
      communityEvents.forEach(e => points.push([e.lat, e.lng]));
    }
    if (userCoords) {
      points.push([userCoords.lat, userCoords.lng]);
    }

    if (points.length === 0) return;

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  // Travel estimates for currently active route target
  const activeEstimates = activeRouteTarget ? getTravelEstimates(activeRouteTarget.lat, activeRouteTarget.lng) : null;
  const currentModeStats = activeEstimates ? activeEstimates[travelMode] : null;

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[540px] rounded-3xl overflow-hidden border border-[#D8DFD8] dark:border-[#2D332D] shadow-md">
      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Top Left Info & Active Layer Ticker */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-[400] flex flex-wrap items-center gap-2 bg-white/95 dark:bg-[#1A1D1A]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-lg text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-ping" />
          <span className="font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
            {masjids.length} Masjid
          </span>
          <span className="text-[#5A665B] dark:text-[#A0A8A0]">•</span>
          <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <span>🎉</span>
            <span>{communityEvents.length} Event Komunitas</span>
          </span>
        </div>
        <span className="text-[#5A665B] dark:text-[#A0A8A0] text-[11px] hidden md:inline">
          (Arahkan kursor ke marker untuk melihat detail acara)
        </span>
      </div>

      {/* Floating Interactive Directions / Navigation HUD Card */}
      {activeRouteTarget && activeEstimates && currentModeStats && (
        <div className="absolute top-14 left-3 right-3 sm:right-auto sm:w-[360px] z-[450] bg-white/95 dark:bg-[#141A14]/95 backdrop-blur-md rounded-2xl border-2 border-[#2E7D32] shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* HUD Header */}
          <div className="flex items-start justify-between gap-2 border-b border-[#D8DFD8] dark:border-[#2D332D] pb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#2E7D32] text-white uppercase tracking-wider">
                    {activeRouteTarget.type === 'masjid' ? 'Masjid' : 'Event'}
                  </span>
                  <span className="text-[11px] font-semibold text-[#5A665B] dark:text-[#A0A8A0]">
                    Petunjuk Arah Real-Time
                  </span>
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-[#141A14] dark:text-[#E4E8E4] truncate mt-0.5">
                  {activeRouteTarget.name}
                </h4>
              </div>
            </div>

            <button
              onClick={handleCloseNavigation}
              title="Tutup Navigasi"
              className="p-1.5 rounded-xl hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Travel Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 bg-[#EEF3EE] dark:bg-[#1E241E] p-1 rounded-xl">
            <button
              onClick={() => setTravelMode('driving')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold flex flex-col items-center gap-0.5 transition-all ${
                travelMode === 'driving'
                  ? 'bg-white dark:bg-[#2E7D32] text-[#2E7D32] dark:text-white shadow-sm'
                  : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5" />
                <span>Mobil</span>
              </div>
              <span className="text-[10px] opacity-85 font-medium">{activeEstimates.driving.durationText}</span>
            </button>

            <button
              onClick={() => setTravelMode('motor')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold flex flex-col items-center gap-0.5 transition-all ${
                travelMode === 'motor'
                  ? 'bg-white dark:bg-[#2E7D32] text-[#2E7D32] dark:text-white shadow-sm'
                  : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1">
                <Bike className="w-3.5 h-3.5" />
                <span>Motor</span>
              </div>
              <span className="text-[10px] opacity-85 font-medium">{activeEstimates.motor.durationText}</span>
            </button>

            <button
              onClick={() => setTravelMode('walking')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold flex flex-col items-center gap-0.5 transition-all ${
                travelMode === 'walking'
                  ? 'bg-white dark:bg-[#0D9488] text-[#0D9488] dark:text-white shadow-sm'
                  : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5" />
                <span>Jalan</span>
              </div>
              <span className="text-[10px] opacity-85 font-medium">{activeEstimates.walking.durationText}</span>
            </button>
          </div>

          {/* Real-Time Distance & ETA Metrics Card */}
          <div className="bg-[#F4F7F4] dark:bg-[#1E241E] rounded-xl p-2.5 border border-[#D8DFD8] dark:border-[#2D332D] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#5A665B] dark:text-[#A0A8A0] uppercase tracking-wider block">
                  Jarak Tempuh
                </span>
                <span className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
                  {currentModeStats.distanceKm} km
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#5A665B] dark:text-[#A0A8A0] uppercase tracking-wider block">
                  Estimasi Tiba (ETA)
                </span>
                <span className="text-base font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">
                  {currentModeStats.eta}
                </span>
              </div>
            </div>

            {travelMode === 'walking' && 'calories' in currentModeStats && (
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#D8DFD8] dark:border-[#2D332D] text-[#0D9488] font-bold">
                <span>🔥 Kalori Terbakar: ~{currentModeStats.calories} kkal</span>
                <span>🌿 Nol Emisi Karbon</span>
              </div>
            )}
          </div>

          {/* Quick Launch Direct External Navigation Apps */}
          <div className="flex gap-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${userCoords?.lat || ''},${userCoords?.lng || ''}&destination=${activeRouteTarget.lat},${activeRouteTarget.lng}&travelmode=${travelMode === 'walking' ? 'walking' : 'driving'}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <span>Mulai di Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://waze.com/ul?ll=${activeRouteTarget.lat},${activeRouteTarget.lng}&navigate=yes`}
              target="_blank"
              rel="noreferrer"
              title="Buka di Waze"
              className="py-2 px-3 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#D8DFD8] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] text-xs font-bold flex items-center justify-center gap-1 transition-all border border-[#D8DFD8] dark:border-[#2D332D]"
            >
              <span>Waze ↗</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Top Right Layer Selector & Heat Map Quick Controls */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-2">
        {/* Quick Heatmap Toggle Pill */}
        <button
          onClick={handleToggleHeatmap}
          className={`px-3 py-2 rounded-2xl backdrop-blur-md border shadow-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
            isHeatmapActive
              ? 'bg-amber-500 text-white border-amber-400 ring-2 ring-amber-400/30'
              : 'bg-white/95 dark:bg-[#1A1D1A]/95 text-[#141A14] dark:text-[#E4E8E4] border-[#D8DFD8] dark:border-[#2D332D] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
          }`}
          title="Toggle Heat Map Kepadatan Waktu Shalat"
        >
          <Flame className={`w-3.5 h-3.5 ${isHeatmapActive ? 'fill-current animate-pulse' : 'text-amber-500'}`} />
          <span className="hidden sm:inline">Heat Map Kepadatan</span>
          <span className="sm:hidden">Heat Map</span>
          {isHeatmapActive && (
            <span className="w-2 h-2 rounded-full bg-white animate-ping ml-0.5" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowLayersDropdown(!showLayersDropdown)}
            className="px-3 py-2 rounded-2xl bg-white/95 dark:bg-[#1A1D1A]/95 backdrop-blur-md text-[#141A14] dark:text-[#E4E8E4] border border-[#D8DFD8] dark:border-[#2D332D] shadow-lg hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span className="hidden md:inline">Filter Layer</span>
          </button>

          {showLayersDropdown && (
            <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#1A1D1A] rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-2xl p-3 space-y-2.5 text-xs text-[#141A14] dark:text-[#E4E8E4] animate-in fade-in zoom-in-95">
              <span className="text-[10px] font-bold text-[#5A665B] dark:text-[#A0A8A0] uppercase tracking-wider block">
                Lapisan Peta (Layers)
              </span>

              <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#EEF3EE] dark:hover:bg-[#242924] cursor-pointer">
                <span className="flex items-center gap-2 font-semibold">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Heat Map Kepadatan</span>
                </span>
                <input
                  type="checkbox"
                  checked={isHeatmapActive}
                  onChange={handleToggleHeatmap}
                  className="w-4 h-4 accent-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#EEF3EE] dark:hover:bg-[#242924] cursor-pointer">
                <span className="flex items-center gap-2 font-semibold">
                  <span>🕌</span> Marker Masjid
                </span>
                <input
                  type="checkbox"
                  checked={showMasjidsLayer}
                  onChange={onToggleMasjidsLayer}
                  className="w-4 h-4 accent-[#2E7D32]"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#EEF3EE] dark:hover:bg-[#242924] cursor-pointer">
                <span className="flex items-center gap-2 font-semibold">
                  <span>🎉</span> Marker Event Komunitas
                </span>
                <input
                  type="checkbox"
                  checked={showEventsLayer}
                  onChange={onToggleEventsLayer}
                  className="w-4 h-4 accent-[#2E7D32]"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#EEF3EE] dark:hover:bg-[#242924] cursor-pointer">
                <span className="flex items-center gap-2 font-semibold">
                  <span>📡</span> Lingkaran Radar GPS
                </span>
                <input
                  type="checkbox"
                  checked={showRadiusRange}
                  onChange={(e) => setShowRadiusRange(e.target.checked)}
                  className="w-4 h-4 accent-[#2E7D32]"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Center/Left Prayer Selector Bar when Heatmap is Active */}
      {isHeatmapActive && (
        <div className="absolute top-14 left-3 right-3 sm:right-auto z-[400] bg-white/95 dark:bg-[#1A1D1A]/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-amber-400/50 shadow-xl space-y-1.5 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3 fill-current" />
              <span>Simulasi Waktu Shalat:</span>
            </span>
            <span className="text-[9px] text-[#5A665B] dark:text-[#A0A8A0]">
              Pilih waktu untuk cek kepadatan
            </span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
            {[
              { id: 'current', label: 'Terkini' },
              { id: 'fajr', label: 'Subuh' },
              { id: 'dhuhr', label: 'Dzuhur' },
              { id: 'asr', label: 'Ashar' },
              { id: 'maghrib', label: 'Maghrib' },
              { id: 'isha', label: 'Isya' },
              { id: 'jumaat', label: 'Jum\'at' },
            ].map((p) => {
              const isSelected = activeHeatmapPrayer === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPrayer(p.id as any)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-sm ring-1 ring-amber-400'
                      : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Bottom Right Map Action Controls */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2">
        {/* Recenter to User GPS */}
        <button
          onClick={onRecenterUser}
          title="Pusatkan ke Lokasi Saya"
          className="p-2.5 rounded-2xl bg-white dark:bg-[#1A1D1A] text-[#2E7D32] dark:text-[#4CAF50] border border-[#D8DFD8] dark:border-[#2D332D] shadow-lg hover:bg-[#EEF3EE] dark:hover:bg-[#242924] transition-all"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Fit All Mosques & Events */}
        <button
          onClick={handleFitBounds}
          title="Tampilkan Semua Lokasi & Event"
          className="p-2.5 rounded-2xl bg-white dark:bg-[#1A1D1A] text-[#141A14] dark:text-[#E4E8E4] border border-[#D8DFD8] dark:border-[#2D332D] shadow-lg hover:bg-[#EEF3EE] dark:hover:bg-[#242924] transition-all"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Zoom In & Out */}
        <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-2xl shadow-lg flex flex-col overflow-hidden">
          <button
            onClick={handleZoomIn}
            title="Perbesar Peta"
            className="p-2.5 hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#141A14] dark:text-[#E4E8E4] transition-colors border-b border-[#D8DFD8] dark:border-[#2D332D]"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Perkecil Peta"
            className="p-2.5 hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#141A14] dark:text-[#E4E8E4] transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Bottom Left Interactive Heat Map & Marker Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 dark:bg-[#1A1D1A]/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-lg text-[10px] text-[#5A665B] dark:text-[#A0A8A0] hidden sm:flex flex-col gap-1.5 max-w-xs">
        {isHeatmapActive ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between font-bold text-[#141A14] dark:text-[#E4E8E4] text-[10px]">
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Flame className="w-3 h-3 fill-current" />
                <span>Legenda Heat Map Kepadatan:</span>
              </span>
            </div>
            <div className="flex items-center gap-2 pt-0.5 text-[9.5px]">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold">&lt;45% Sepi</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="text-amber-700 dark:text-amber-300 font-semibold">45-75% Sedang</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="text-rose-700 dark:text-rose-300 font-semibold">&gt;75% Padat</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
              <span className="font-medium text-[#141A14] dark:text-[#E4E8E4]">Lokasi Anda</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🕌</span>
              <span>Masjid</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="font-bold text-amber-700 dark:text-amber-300">Event Komunitas</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
