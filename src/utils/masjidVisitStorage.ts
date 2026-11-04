import { MasjidVisitRecord, MasjidVisitPrayer, MasjidVisitPurpose } from '../types';

export const MASJID_VISIT_STORAGE_KEY = 'islamicity_masjid_visit_history';

// Default initial visit records if user has none saved yet
export const INITIAL_DEFAULT_VISITS: MasjidVisitRecord[] = [
  {
    id: 'visit-01',
    masjidId: 'm1',
    masjidName: 'Masjid Istiqlal',
    masjidAddress: 'Jl. Taman Wijaya Kusuma, Ps. Baru, Sawah Besar, Jakarta Pusat',
    masjidCity: 'Jakarta Pusat',
    masjidPhotoUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&auto=format&fit=crop&q=80',
    visitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 2 days ago
    prayerTime: 'JUMAAT',
    prayerLabel: 'Shalat Jumat Berjamaah',
    purpose: 'SHALAT_JUMAT',
    purposeLabel: 'Ibadah Jumat & Khutbah',
    notes: 'Khatib mengulas tema persatuan umat dan zakat. Suasana shaf utama sangat khusyuk dan sejuk.',
    personalRating: 5,
    withCongregation: true,
    shafPosition: 'DEPAN',
    cleanlinessSatisfaction: 'SANGAT_BERSIH',
    gpsVerified: true,
    userCoordsAtVisit: { lat: -6.1702, lng: 106.8314 },
    distanceAtVisitKm: 0.8,
    tags: ['Khutbah Jumat', 'Shaf Utama', 'Adem']
  },
  {
    id: 'visit-02',
    masjidId: 'm2',
    masjidName: 'Masjid Agung Sunda Kelapa',
    masjidAddress: 'Jl. Taman Sunda Kelapa No.16, Menteng, Jakarta Pusat',
    masjidCity: 'Jakarta Pusat',
    masjidPhotoUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&auto=format&fit=crop&q=80',
    visitedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString(), // 5 days ago
    prayerTime: 'MAGHRIB',
    prayerLabel: 'Shalat Maghrib & Isya',
    purpose: 'KAJIAN_ILMU',
    purposeLabel: 'Kajian Rutin Ba\'da Maghrib',
    notes: 'Mengikuti kajian kitab Riyadhus Shalihin. Tempat wudhu mengalir bersih, parkir teratur.',
    personalRating: 5,
    withCongregation: true,
    shafPosition: 'TENGAH',
    cleanlinessSatisfaction: 'SANGAT_BERSIH',
    gpsVerified: true,
    userCoordsAtVisit: { lat: -6.2008, lng: 106.8329 },
    distanceAtVisitKm: 2.3,
    tags: ['Kajian Kitab', 'Wudhu Bersih']
  },
  {
    id: 'visit-03',
    masjidId: 'm3',
    masjidName: 'Masjid Agung Al-Azhar',
    masjidAddress: 'Jl. Sisingamangaraja No.1, Kebayoran Baru, Jakarta Selatan',
    masjidCity: 'Jakarta Selatan',
    masjidPhotoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    visitedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), // 11 days ago
    prayerTime: 'FAJR',
    prayerLabel: 'Shalat Subuh Gabungan',
    purpose: 'SHALAT_FARDHU',
    purposeLabel: 'Subuh Berjamaah & Zikir',
    notes: 'Subuh gabungan jamaah se-Jakarta Selatan. Disediakan sarapan bubur berkah ba\'da shalat.',
    personalRating: 5,
    withCongregation: true,
    shafPosition: 'DEPAN',
    cleanlinessSatisfaction: 'SANGAT_BERSIH',
    gpsVerified: true,
    userCoordsAtVisit: { lat: -6.2355, lng: 106.7995 },
    distanceAtVisitKm: 6.8,
    tags: ['Subuh Gabungan', 'Sarapan Berkah']
  }
];

export const PRAYER_OPTIONS: { id: MasjidVisitPrayer; label: string; icon: string }[] = [
  { id: 'FAJR', label: 'Subuh', icon: '🌅' },
  { id: 'DHUHA', label: 'Dhuha', icon: '☀️' },
  { id: 'DHUHR', label: 'Dzuhur', icon: '☀️' },
  { id: 'ASR', label: 'Ashar', icon: '🌤️' },
  { id: 'MAGHRIB', label: 'Maghrib', icon: '🌇' },
  { id: 'ISHA', label: 'Isya', icon: '🌙' },
  { id: 'JUMAAT', label: 'Shalat Jumat', icon: '🕌' },
  { id: 'TAHAJJUD', label: 'Qiyamul Lail / Tahajjud', icon: '✨' },
  { id: 'KAJIAN_EVENT', label: 'Kajian / Tabligh', icon: '📖' },
  { id: 'OTHER', label: 'Waktu Lainnya', icon: '⏱️' }
];

export const PURPOSE_OPTIONS: { id: MasjidVisitPurpose; label: string; icon: string }[] = [
  { id: 'SHALAT_FARDHU', label: 'Shalat Fardhu Berjamaah', icon: '🤲' },
  { id: 'SHALAT_JUMAT', label: 'Shalat Jumat & Khutbah', icon: '🕌' },
  { id: 'KAJIAN_ILMU', label: 'Menuntut Ilmu / Kajian', icon: '📚' },
  { id: 'ITIKAF', label: 'I\'tikaf & Qiyamul Lail', icon: '🕯️' },
  { id: 'TARAWIH', label: 'Shalat Tarawih & Witir', icon: '🌙' },
  { id: 'TAHSIN_QURAN', label: 'Halaqah Tahsin & Tilawah', icon: '📖' },
  { id: 'WISATA_ZIARAH', label: 'Wisata Religi & Ziarah', icon: '🏛️' },
  { id: 'TRANSIT_ISTIRAHAT', label: 'Transit Shalat Safar / Istirahat', icon: '🚗' },
  { id: 'OTHER', label: 'Hajat / Kegiatan Lainnya', icon: '✨' }
];

export class MasjidVisitStorage {
  /**
   * Fetch all visits from local storage.
   */
  static getVisits(): MasjidVisitRecord[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return INITIAL_DEFAULT_VISITS;
    }

    try {
      const raw = localStorage.getItem(MASJID_VISIT_STORAGE_KEY);
      if (!raw) {
        // Initialize with default records
        this.saveVisits(INITIAL_DEFAULT_VISITS);
        return INITIAL_DEFAULT_VISITS;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return INITIAL_DEFAULT_VISITS;
    } catch (e) {
      console.warn('Failed to parse masjid visit records from localStorage:', e);
      return INITIAL_DEFAULT_VISITS;
    }
  }

  /**
   * Save array of visit records to local storage.
   */
  static saveVisits(visits: MasjidVisitRecord[]): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(MASJID_VISIT_STORAGE_KEY, JSON.stringify(visits));
    } catch (e) {
      console.error('Failed to write masjid visit history to localStorage:', e);
    }
  }

  /**
   * Add a new visit record.
   */
  static addVisit(record: Omit<MasjidVisitRecord, 'id'>): MasjidVisitRecord {
    const visits = this.getVisits();
    const newRecord: MasjidVisitRecord = {
      ...record,
      id: `visit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    };
    const updated = [newRecord, ...visits];
    this.saveVisits(updated);
    return newRecord;
  }

  /**
   * Update an existing visit record.
   */
  static updateVisit(id: string, updates: Partial<MasjidVisitRecord>): MasjidVisitRecord[] {
    const visits = this.getVisits();
    const updated = visits.map((v) => (v.id === id ? { ...v, ...updates } : v));
    this.saveVisits(updated);
    return updated;
  }

  /**
   * Delete a visit record.
   */
  static deleteVisit(id: string): MasjidVisitRecord[] {
    const visits = this.getVisits();
    const updated = visits.filter((v) => v.id !== id);
    this.saveVisits(updated);
    return updated;
  }

  /**
   * Reset visit history to default mock data.
   */
  static resetToDefault(): MasjidVisitRecord[] {
    this.saveVisits(INITIAL_DEFAULT_VISITS);
    return INITIAL_DEFAULT_VISITS;
  }

  /**
   * Clear all visits entirely.
   */
  static clearAll(): MasjidVisitRecord[] {
    this.saveVisits([]);
    return [];
  }

  /**
   * Check if user has visited a specific masjid before, and how many times.
   */
  static getMasjidVisitSummary(masjidId: string): { visited: boolean; count: number; lastVisited?: string } {
    const visits = this.getVisits();
    const matches = visits.filter((v) => v.masjidId === masjidId);
    if (matches.length === 0) {
      return { visited: false, count: 0 };
    }
    // Sort latest first
    const sorted = [...matches].sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime());
    return {
      visited: true,
      count: matches.length,
      lastVisited: sorted[0].visitedAt
    };
  }

  /**
   * Calculate visit metrics and statistics for gamification and tracking.
   */
  static calculateStats(visits: MasjidVisitRecord[]) {
    const totalCheckIns = visits.length;
    const uniqueMasjids = new Set(visits.map((v) => v.masjidId || v.masjidName)).size;
    const congregationCount = visits.filter((v) => v.withCongregation).length;
    const jumaatCount = visits.filter((v) => v.prayerTime === 'JUMAAT').length;
    const fajrCount = visits.filter((v) => v.prayerTime === 'FAJR').length;

    // Masjid with most visits
    const countsByMasjid: Record<string, { name: string; count: number }> = {};
    visits.forEach((v) => {
      const key = v.masjidName;
      if (!countsByMasjid[key]) {
        countsByMasjid[key] = { name: v.masjidName, count: 0 };
      }
      countsByMasjid[key].count++;
    });

    const mostVisited = Object.values(countsByMasjid).sort((a, b) => b.count - a.count)[0] || null;

    // Milestone Badge calculation
    let explorerTier = 'Pecinta Masjid Pemula';
    let explorerIcon = '🌱';
    if (uniqueMasjids >= 10) {
      explorerTier = 'Duta Penjelajah Masjid Emas';
      explorerIcon = '👑';
    } else if (uniqueMasjids >= 5) {
      explorerTier = 'Musafir Rumah Allah Perak';
      explorerIcon = '⭐';
    } else if (uniqueMasjids >= 2) {
      explorerTier = 'Pecinta Shaf Berjamaah Perunggu';
      explorerIcon = '🕌';
    }

    return {
      totalCheckIns,
      uniqueMasjids,
      congregationRate: totalCheckIns > 0 ? Math.round((congregationCount / totalCheckIns) * 100) : 0,
      jumaatCount,
      fajrCount,
      mostVisited,
      explorerTier,
      explorerIcon
    };
  }
}
