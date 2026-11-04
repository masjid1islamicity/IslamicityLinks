import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Compass, 
  MapPin, 
  Clock, 
  Sun, 
  Moon, 
  Sunset, 
  Sunrise, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  calculatePrayerTimes, 
  getNextPrayer, 
  calculateQiblaDirection, 
  playSyntheticAdhanPreview 
} from '../utils/prayerCalculator';

export const PrayerTimeBar: React.FC = () => {
  const { t } = useApp();
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [stopAudioFn, setStopAudioFn] = useState<(() => void) | null>(null);
  const [showQiblaModal, setShowQiblaModal] = useState(false);
  const [currentCity, setCurrentCity] = useState('Jakarta (WIB)');
  const [coords, setCoords] = useState({ lat: -6.2088, lng: 106.8456 });

  const times = calculatePrayerTimes(coords.lat, coords.lng, new Date());
  const nextPrayer = getNextPrayer(times);
  const qiblaBearing = calculateQiblaDirection(coords.lat, coords.lng);

  const prayerSchedule = [
    { key: 'fajr', label: t('prayer_fajr'), time: times.fajr, icon: Sunrise },
    { key: 'sunrise', label: t('prayer_sunrise'), time: times.sunrise, icon: Sun },
    { key: 'dhuhr', label: t('prayer_dhuhr'), time: times.dhuhr, icon: Sun },
    { key: 'asr', label: t('prayer_asr'), time: times.asr, icon: Sun },
    { key: 'maghrib', label: t('prayer_maghrib'), time: times.maghrib, icon: Sunset },
    { key: 'isha', label: t('prayer_isha'), time: times.isha, icon: Moon },
  ];

  const handleToggleAdhan = () => {
    if (isPlayingAdhan) {
      if (stopAudioFn) stopAudioFn();
      setIsPlayingAdhan(false);
      setStopAudioFn(null);
    } else {
      const stop = playSyntheticAdhanPreview();
      setStopAudioFn(() => stop);
      setIsPlayingAdhan(true);
      // Auto reset after audio completes (6 seconds preview)
      setTimeout(() => {
        setIsPlayingAdhan(false);
      }, 6500);
    }
  };

  const cities = [
    { name: 'Jakarta (WIB)', lat: -6.2088, lng: 106.8456 },
    { name: 'Bandung (WIB)', lat: -6.9175, lng: 107.6191 },
    { name: 'Surabaya (WIB)', lat: -7.2575, lng: 112.7521 },
    { name: 'Medan (WIB)', lat: 3.5952, lng: 98.6722 },
    { name: 'Makassar (WITA)', lat: -5.1477, lng: 119.4327 },
    { name: 'Kuala Lumpur (MYT)', lat: 3.1390, lng: 101.6869 },
    { name: 'Makkah Al-Mukarramah', lat: 21.4225, lng: 39.8262 },
  ];

  return (
    <div className="bg-[#1A1D1A] text-[#E4E8E4] border-b border-[#2D332D] shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          
          {/* Location & Next Prayer Countdown */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#242924] border border-[#2D332D] text-[#E4E8E4] font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={currentCity}
                onChange={(e) => {
                  const selected = cities.find(c => c.name === e.target.value);
                  if (selected) {
                    setCurrentCity(selected.name);
                    setCoords({ lat: selected.lat, lng: selected.lng });
                  }
                }}
                className="bg-transparent text-[#E4E8E4] font-semibold focus:outline-none cursor-pointer text-xs"
              >
                {cities.map(c => (
                  <option key={c.name} value={c.name} className="bg-[#1A1D1A] text-[#E4E8E4]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Next Prayer Chip */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2E7D32]/20 text-[#4CAF50] border border-[#2E7D32]/40 font-bold">
              <Clock className="w-3.5 h-3.5 text-[#4CAF50] animate-pulse" />
              <span>{t('next_prayer_in')} <strong className="text-white">{nextPrayer.name} ({nextPrayer.time})</strong>: {nextPrayer.diffFormatted}</span>
            </div>

            <button
              onClick={() => setShowQiblaModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#242924] hover:bg-[#2D332D] text-[#A0A8A0] hover:text-[#E4E8E4] border border-[#2D332D] transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-[#4CAF50]" />
              <span>Kiblat {qiblaBearing}°</span>
            </button>
          </div>

          {/* 5 Daily Prayer Times & Audio Synthesizer */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2">
              {prayerSchedule.map(p => {
                const Icon = p.icon;
                const isNext = p.label.toLowerCase() === nextPrayer.name.toLowerCase();
                return (
                  <div
                    key={p.key}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg transition-all ${
                      isNext
                        ? 'bg-[#2E7D32] text-white font-bold shadow-sm'
                        : 'text-[#A0A8A0] hover:text-[#E4E8E4]'
                    }`}
                  >
                    <Icon className={`w-3 h-3 ${isNext ? 'text-white' : 'text-[#4CAF50]'}`} />
                    <span>{p.label}</span>
                    <span className="text-[11px] font-mono opacity-90">{p.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Adhan Synthesizer Preview Button */}
            <button
              onClick={handleToggleAdhan}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                isPlayingAdhan
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse font-bold'
                  : 'bg-[#242924] hover:bg-[#2D332D] text-[#E4E8E4] border-[#2D332D]'
              }`}
              title="Putar nada pengingat azan sintesis Web Audio"
            >
              {isPlayingAdhan ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Memutar...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#4CAF50]" />
                  <span>{t('adhan_preview')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Qibla Direction Compass Modal */}
      {showQiblaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl p-6 max-w-sm w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8DFD8] dark:border-[#2D332D]">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <h3 className="font-bold text-base">Arah Kiblat Ka'bah</h3>
              </div>
              <button
                onClick={() => setShowQiblaModal(false)}
                className="p-1 rounded-full hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#A0A8A0]"
              >
                ✕
              </button>
            </div>

            <div className="py-6 flex flex-col items-center justify-center">
              {/* Compass Graphic */}
              <div className="relative w-48 h-48 rounded-full border-4 border-dashed border-[#2E7D32]/40 flex items-center justify-center bg-[#EEF3EE] dark:bg-[#242924] shadow-inner">
                {/* Cardinal Points */}
                <span className="absolute top-2 text-[11px] font-bold text-[#A0A8A0]">N (Utara)</span>
                <span className="absolute right-2 text-[11px] font-bold text-[#A0A8A0]">E</span>
                <span className="absolute bottom-2 text-[11px] font-bold text-[#A0A8A0]">S</span>
                <span className="absolute left-2 text-[11px] font-bold text-[#A0A8A0]">W (Barat)</span>

                {/* Rotating Needle towards Kaaba */}
                <div 
                  className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
                  style={{ transform: `rotate(${qiblaBearing}deg)` }}
                >
                  <div className="w-1.5 h-20 bg-gradient-to-t from-transparent via-[#2E7D32] to-amber-500 rounded-full relative -top-6 flex items-start justify-center">
                    <div className="w-4 h-4 bg-amber-500 rounded-full shadow-md -mt-1 flex items-center justify-center text-[8px] text-white font-bold">
                      🕋
                    </div>
                  </div>
                </div>

                <div className="absolute w-8 h-8 rounded-full bg-white dark:bg-[#1A1D1A] border-2 border-[#2E7D32] flex items-center justify-center shadow-md text-[10px] font-bold">
                  {Math.round(qiblaBearing)}°
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  {currentCity}
                </p>
                <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] mt-1">
                  Sudut Kiblat: <strong className="text-[#2E7D32] dark:text-[#4CAF50]">{qiblaBearing}° Barat Laut (NW)</strong> dari arah Utara sejati.
                </p>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#2E7D32] dark:text-[#4CAF50] bg-[#2E7D32]/10 dark:bg-[#2E7D32]/20 px-3 py-1 rounded-full border border-[#2E7D32]/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Kalkulasi Geodesik Akurat Koordinat Ka'bah</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowQiblaModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs shadow-md transition-colors"
            >
              Tutup Penunjuk Kiblat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
