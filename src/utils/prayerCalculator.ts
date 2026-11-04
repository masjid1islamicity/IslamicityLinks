import { PrayerTimeData } from '../types';

// Coordinates of the Holy Kaaba in Makkah
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

/**
 * Calculates accurate astronomical prayer times for given latitude, longitude, and date
 */
export function calculatePrayerTimes(
  lat: number = -6.2088,
  lng: number = 106.8456,
  date: Date = new Date()
): PrayerTimeData {
  const dayOfYear = getDayOfYear(date);
  
  // Declination of Sun
  const d = 23.45 * Math.sin(degToRad((360 / 365) * (dayOfYear - 81)));
  
  // Equation of Time (in minutes)
  const b = (360 / 365) * (dayOfYear - 81);
  const eot = 9.87 * Math.sin(degToRad(2 * b)) - 7.53 * Math.cos(degToRad(b)) - 1.5 * Math.sin(degToRad(b));
  
  // Timezone offset in hours
  const timezone = -date.getTimezoneOffset() / 60;
  
  // Solar Noon in hours
  const solarNoon = 12 + (4 * (timezone * 15 - lng) - eot) / 60;
  
  // Fajr angle (-20 deg for Kemenag RI / standard)
  const fajrAngle = 20;
  const fajrHourAngle = calculateHourAngle(lat, d, -fajrAngle);
  const fajr = solarNoon - fajrHourAngle;
  
  // Sunrise angle (-0.833 deg)
  const sunriseHourAngle = calculateHourAngle(lat, d, -0.833);
  const sunrise = solarNoon - sunriseHourAngle;
  
  // Dhuhr
  const dhuhr = solarNoon + 0.05; // 3 minutes buffer
  
  // Asr (Shafi'i shadow length = 1)
  const asrAlt = radToDeg(Math.atan(1 + Math.tan(degToRad(Math.abs(lat - d)))));
  const asrHourAngle = calculateHourAngle(lat, d, 90 - asrAlt);
  const asr = solarNoon + asrHourAngle;
  
  // Maghrib angle (-0.833 deg + 2 min buffer)
  const maghrib = solarNoon + sunriseHourAngle + 0.035;
  
  // Isha angle (-18 deg for Kemenag RI)
  const ishaAngle = 18;
  const ishaHourAngle = calculateHourAngle(lat, d, -ishaAngle);
  const isha = solarNoon + ishaHourAngle;
  
  // Qiyam (Last third of the night)
  const nightDuration = (24 - maghrib) + fajr;
  const qiyam = (maghrib + nightDuration * 0.67) % 24;

  return {
    fajr: formatHour(fajr),
    sunrise: formatHour(sunrise),
    dhuhr: formatHour(dhuhr),
    asr: formatHour(asr),
    maghrib: formatHour(maghrib),
    isha: formatHour(isha),
    qiyam: formatHour(qiyam),
  };
}

function calculateHourAngle(lat: number, decl: number, alt: number): number {
  const latRad = degToRad(lat);
  const declRad = degToRad(decl);
  const altRad = degToRad(alt);
  
  const cosH = (Math.sin(altRad) - Math.sin(latRad) * Math.sin(declRad)) / 
               (Math.cos(latRad) * Math.cos(declRad));
  
  if (cosH > 1) return 0;
  if (cosH < -1) return 12;
  
  return radToDeg(Math.acos(cosH)) / 15;
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function formatHour(decimalHour: number): string {
  let h = Math.floor(decimalHour);
  let m = Math.floor((decimalHour - h) * 60);
  if (h >= 24) h %= 24;
  if (h < 0) h += 24;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Calculates Qibla direction bearing in degrees from true North
 */
export function calculateQiblaDirection(userLat: number, userLng: number): number {
  const phiK = degToRad(KAABA_LAT);
  const lambdaK = degToRad(KAABA_LNG);
  const phi = degToRad(userLat);
  const lambda = degToRad(userLng);
  
  const deltaLambda = lambdaK - lambda;
  
  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(deltaLambda);
  
  let qibla = radToDeg(Math.atan2(y, x));
  qibla = (qibla + 360) % 360;
  return Math.round(qibla * 10) / 10;
}

/**
 * Calculates distance between two coordinates in Kilometers
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Determines the next prayer time and countdown remaining
 */
export function getNextPrayer(times: PrayerTimeData): { name: string; time: string; diffMinutes: number; diffFormatted: string } {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const prayerList = [
    { name: 'Subuh', time: times.fajr },
    { name: 'Dzuhur', time: times.dhuhr },
    { name: 'Ashar', time: times.asr },
    { name: 'Maghrib', time: times.maghrib },
    { name: 'Isya', time: times.isha },
  ];

  for (const prayer of prayerList) {
    const [h, m] = prayer.time.split(':').map(Number);
    const pMinutes = h * 60 + m;
    if (pMinutes > currentMinutes) {
      const diff = pMinutes - currentMinutes;
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      return {
        name: prayer.name,
        time: prayer.time,
        diffMinutes: diff,
        diffFormatted: hours > 0 ? `${hours}j ${minutes}m` : `${minutes} menit`,
      };
    }
  }

  // If after Isha, next is tomorrow's Subuh
  const [fh, fm] = times.fajr.split(':').map(Number);
  const diff = (24 * 60 - currentMinutes) + (fh * 60 + fm);
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return {
    name: 'Subuh (Besok)',
    time: times.fajr,
    diffMinutes: diff,
    diffFormatted: `${hours}j ${minutes}m`,
  };
}

/**
 * Synthesizes a gentle Adhan chime / tone using the Web Audio API
 */
export function playSyntheticAdhanPreview(): () => void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return () => {};
    
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Play a melodic sequence reminiscent of a prayer call melody (Allahu Akbar tones)
    const notes = [
      { freq: 440, time: 0.0, dur: 0.8 },   // A4
      { freq: 523.25, time: 0.8, dur: 1.2 },// C5
      { freq: 440, time: 2.1, dur: 0.9 },   // A4
      { freq: 392, time: 3.1, dur: 1.4 },   // G4
      { freq: 349.23, time: 4.6, dur: 1.8 } // F4
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.15, now);
    masterGain.connect(ctx.destination);

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, now + note.time);
      
      gain.gain.setValueAtTime(0.001, now + note.time);
      gain.gain.exponentialRampToValueAtTime(0.3, now + note.time + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start(now + note.time);
      osc.stop(now + note.time + note.dur + 0.1);
    });

    return () => {
      try {
        ctx.close();
      } catch (e) {}
    };
  } catch (e) {
    console.warn("Audio playback not allowed or not supported in this frame.");
    return () => {};
  }
}
