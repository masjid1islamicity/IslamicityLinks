import { 
  CuratedPlaylist, 
  UserTalkPreferenceProfile, 
  TalkSession, 
  RecommendationAlgorithmExplanation,
  CuratedPlaylistEpisode
} from '../types';

export const STORAGE_KEY_TALKS_PREFERENCES = 'islamicity_talks_user_preferences_v1';

export const ALL_AVAILABLE_TOPICS = [
  'Fiqih Muamalah & Fintech',
  'Zakat & Filantropi Syariah',
  'Manasik Haji & Umrah Mabrur',
  'Parenting Islami & Generasi Qurani',
  'Akidah & Tauhid Kontemporer',
  'Tafsir & Tadabbur Al-Quran',
  'Etika Bisnis & Kejujuran Niaga',
  'Tazkiyatun Nafs & Ketenangan Hati',
  'Sirah Nabawiyah & Sejarah Islam'
];

export const ALL_AVAILABLE_SCHOLARS = [
  'Benn Al Islamicity',
  'Dr. KH. M. Cholil Nafis, Lc., MA',
  'dr. Aisah Dahlan, CM.NLP',
  'Ustadz Dr. H. Das\'ad Latif, Ph.D',
  'Prof. Dr. KH. Noor Achmad, MA',
  'Ustadz Adi Hidayat, Lc., MA',
  'Buya Yahya (Al-Bahjah)',
  'Dewan Pakar Muamalah DSN-MUI'
];

export const DEFAULT_USER_TALK_PREFERENCES: UserTalkPreferenceProfile = {
  selectedTopics: [
    'Fiqih Muamalah & Fintech',
    'Zakat & Filantropi Syariah',
    'Manasik Haji & Umrah Mabrur'
  ],
  preferredScholars: [
    'Benn Al Islamicity',
    'Dr. KH. M. Cholil Nafis, Lc., MA',
    'dr. Aisah Dahlan, CM.NLP'
  ],
  watchedTalkIds: ['talk-session-live-1', 'talk-session-recorded-4'],
  completedTalkIds: ['talk-session-recorded-4'],
  bookmarkedTalkIds: ['talk-session-upcoming-2', 'talk-session-upcoming-3'],
  savedPlaylistIds: ['playlist-fiqih-fintech-1', 'playlist-hajj-mabrur-2'],
  primaryGoal: 'FINANCE_HALAL',
  learningPace: 'IN_DEPTH_SERIES',
  preferredDifficulty: 'SEMUA_LEVEL',
  topicWeights: {
    'Fiqih Muamalah & Fintech': 9.5,
    'Zakat & Filantropi Syariah': 9.0,
    'Manasik Haji & Umrah Mabrur': 8.5,
    'Parenting Islami & Generasi Qurani': 7.0,
    'Akidah & Tauhid Kontemporer': 6.5,
    'Etika Bisnis & Kejujuran Niaga': 8.0,
    'Tafsir & Tadabbur Al-Quran': 6.0,
    'Tazkiyatun Nafs & Ketenangan Hati': 7.5,
    'Sirah Nabawiyah & Sejarah Islam': 5.5
  },
  scholarWeights: {
    'Benn Al Islamicity': 10.0,
    'Dr. KH. M. Cholil Nafis, Lc., MA': 9.0,
    'dr. Aisah Dahlan, CM.NLP': 8.5,
    'Ustadz Dr. H. Das\'ad Latif, Ph.D': 8.0,
    'Prof. Dr. KH. Noor Achmad, MA': 8.0,
    'Ustadz Adi Hidayat, Lc., MA': 7.5,
    'Buya Yahya (Al-Bahjah)': 7.0,
    'Dewan Pakar Muamalah DSN-MUI': 8.5
  }
};

export const loadUserTalkPreferences = (): UserTalkPreferenceProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TALKS_PREFERENCES);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_USER_TALK_PREFERENCES,
        ...parsed,
        topicWeights: { ...DEFAULT_USER_TALK_PREFERENCES.topicWeights, ...(parsed.topicWeights || {}) },
        scholarWeights: { ...DEFAULT_USER_TALK_PREFERENCES.scholarWeights, ...(parsed.scholarWeights || {}) }
      };
    }
  } catch (e) {
    console.error('Failed to load user talk preferences:', e);
  }
  return DEFAULT_USER_TALK_PREFERENCES;
};

export const saveUserTalkPreferences = (prefs: UserTalkPreferenceProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEY_TALKS_PREFERENCES, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save user talk preferences:', e);
  }
};

/**
 * Core Multi-Factor Recommendation Algorithm
 * 
 * Mathematical Weights:
 * - Topic Affinity (40%): Overlap between playlist topics and user's weighted topics
 * - Scholar Affinity (30%): Overlap between playlist speakers and user's preferred scholars
 * - Goal Alignment (15%): Match between playlist category/targetGoal and user's primary spiritual goal
 * - Difficulty & Level (10%): Match with user's preferred depth and pace
 * - Freshness / Progress (5%): Uncompleted vs In-progress engagement
 */
export function calculatePlaylistMatch(
  playlist: CuratedPlaylist,
  userProfile: UserTalkPreferenceProfile
): {
  matchScore: number;
  matchReasons: string[];
  explanation: RecommendationAlgorithmExplanation;
  breakdown: {
    topicScore: number;
    scholarScore: number;
    goalScore: number;
    levelScore: number;
  };
} {
  // 1. TOPIC AFFINITY SCORE (0 - 40 pts)
  let rawTopicWeightSum = 0;
  let matchedTopicNames: string[] = [];

  playlist.primaryTopics.forEach(topic => {
    // Check direct or partial match in user weights
    let maxFound = 0;
    let bestMatchedTopic = '';

    Object.entries(userProfile.topicWeights).forEach(([userTopic, weight]) => {
      const uLower = userTopic.toLowerCase();
      const pLower = topic.toLowerCase();
      if (pLower.includes(uLower) || uLower.includes(pLower)) {
        if (weight > maxFound) {
          maxFound = weight;
          bestMatchedTopic = userTopic;
        }
      }
    });

    if (maxFound > 0) {
      rawTopicWeightSum += maxFound;
      if (bestMatchedTopic && !matchedTopicNames.includes(bestMatchedTopic)) {
        matchedTopicNames.push(bestMatchedTopic);
      }
    } else if (userProfile.selectedTopics.some(t => topic.toLowerCase().includes(t.toLowerCase()))) {
      rawTopicWeightSum += 8;
      matchedTopicNames.push(topic);
    }
  });

  const topicScoreMax = Math.max(1, playlist.primaryTopics.length * 10);
  const normalizedTopicRatio = Math.min(1, rawTopicWeightSum / topicScoreMax);
  const topicScore = normalizedTopicRatio * 40;

  // 2. SCHOLAR AFFINITY SCORE (0 - 30 pts)
  let rawScholarWeightSum = 0;
  let matchedScholarNames: string[] = [];

  playlist.scholars.forEach(speaker => {
    let maxFound = 0;
    let bestMatchedScholar = '';

    Object.entries(userProfile.scholarWeights).forEach(([userScholar, weight]) => {
      const uLower = userScholar.toLowerCase();
      const sLower = speaker.name.toLowerCase();
      if (sLower.includes(uLower) || uLower.includes(sLower)) {
        if (weight > maxFound) {
          maxFound = weight;
          bestMatchedScholar = userScholar;
        }
      }
    });

    if (maxFound > 0) {
      rawScholarWeightSum += maxFound;
      if (bestMatchedScholar && !matchedScholarNames.includes(bestMatchedScholar)) {
        matchedScholarNames.push(bestMatchedScholar);
      }
    } else if (userProfile.preferredScholars.some(s => speaker.name.toLowerCase().includes(s.toLowerCase()))) {
      rawScholarWeightSum += 8.5;
      matchedScholarNames.push(speaker.name);
    }
  });

  const scholarScoreMax = Math.max(1, playlist.scholars.length * 10);
  const normalizedScholarRatio = Math.min(1, rawScholarWeightSum / scholarScoreMax);
  const scholarScore = normalizedScholarRatio * 30;

  // 3. GOAL ALIGNMENT SCORE (0 - 15 pts)
  let goalScore = 5; // Base neutrality
  if (userProfile.primaryGoal === 'ALL') {
    goalScore = 12;
  } else if (
    (userProfile.primaryGoal === 'FINANCE_HALAL' && (playlist.categoryCode === 'FIQIH_MUAMALAH' || playlist.categoryCode === 'ZAKAT_EKONOMI' || playlist.categoryCode === 'BISNIS_SYARIAH')) ||
    (userProfile.primaryGoal === 'HAJJ_PREP' && playlist.categoryCode === 'HAJJ_PREP') ||
    (userProfile.primaryGoal === 'FAMILY_HARMONY' && playlist.categoryCode === 'FAMILY') ||
    (userProfile.primaryGoal === 'SPIRITUAL_GROWTH' && (playlist.categoryCode === 'AKIDAH' || playlist.categoryCode === 'SPIRITUAL' || playlist.categoryCode === 'TAFSIR_QURAN')) ||
    (userProfile.primaryGoal === 'ZAKAT_IMPACT' && playlist.categoryCode === 'ZAKAT_EKONOMI')
  ) {
    goalScore = 15;
  }

  // 4. DIFFICULTY & PACE MATCH (0 - 10 pts)
  let levelScore = 7;
  if (userProfile.preferredDifficulty === 'SEMUA_LEVEL' || userProfile.preferredDifficulty === playlist.difficulty) {
    levelScore = 10;
  } else {
    levelScore = 5;
  }

  // 5. BONUS/PENALTY (Freshness & Bookmarks) (0 - 5 pts)
  let bonusScore = 0;
  if (userProfile.savedPlaylistIds.includes(playlist.id)) {
    bonusScore += 3;
  }
  // Check if user has watched some episodes
  const hasWatchedAny = playlist.episodes.some(ep => userProfile.watchedTalkIds.includes(ep.talkId));
  if (hasWatchedAny) {
    bonusScore += 2;
  }

  const rawTotal = topicScore + scholarScore + goalScore + levelScore + bonusScore;
  const matchScore = Math.min(99, Math.max(52, Math.round(rawTotal)));

  // Generate dynamic human-readable match explanations
  const matchReasons: string[] = [];

  if (matchedTopicNames.length > 0) {
    matchReasons.push(`Sesuai minat topik Anda: ${matchedTopicNames.slice(0, 2).join(' & ')}`);
  }

  if (matchedScholarNames.length > 0) {
    matchReasons.push(`Menampilkan Asatidz favorit: ${matchedScholarNames.slice(0, 2).join(', ')}`);
  }

  if (goalScore >= 14) {
    matchReasons.push(`Selaras dengan target belajar aktif: ${formatGoalLabel(userProfile.primaryGoal)}`);
  }

  if (userProfile.savedPlaylistIds.includes(playlist.id)) {
    matchReasons.push(`Tersimpan dalam daftar putar pribadi Anda`);
  }

  if (matchReasons.length === 0) {
    matchReasons.push(`Direkomendasikan oleh kurator dakwah Islamicity untuk pengayaan wawasan syariah`);
  }

  const explanation: RecommendationAlgorithmExplanation = {
    overallScore: matchScore,
    topicAffinityPercent: Math.round((topicScore / 40) * 100),
    scholarAffinityPercent: Math.round((scholarScore / 30) * 100),
    goalAffinityPercent: Math.round((goalScore / 15) * 100),
    reasons: matchReasons,
    matchedKeywords: [...matchedTopicNames, ...matchedScholarNames]
  };

  return {
    matchScore,
    matchReasons,
    explanation,
    breakdown: {
      topicScore: Math.round(topicScore),
      scholarScore: Math.round(scholarScore),
      goalScore: Math.round(goalScore),
      levelScore: Math.round(levelScore)
    }
  };
}

export function rankPlaylistsWithAlgorithm(
  playlists: CuratedPlaylist[],
  userProfile: UserTalkPreferenceProfile
): CuratedPlaylist[] {
  const scored = playlists.map(pl => {
    const { matchScore, matchReasons, breakdown } = calculatePlaylistMatch(pl, userProfile);
    
    // Count completed episodes
    const completedCount = pl.episodes.filter(ep => 
      userProfile.completedTalkIds.includes(ep.talkId) || ep.isCompleted
    ).length;

    const isSaved = userProfile.savedPlaylistIds.includes(pl.id);

    return {
      ...pl,
      matchScore,
      matchReasons,
      matchBreakdown: breakdown,
      completedEpisodesCount: completedCount,
      isSaved
    };
  });

  // Sort descending by match score
  return scored.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}

export function formatGoalLabel(goal: UserTalkPreferenceProfile['primaryGoal']): string {
  switch (goal) {
    case 'FINANCE_HALAL':
      return 'Literasi Fikih Finansial & Investasi Halal';
    case 'HAJJ_PREP':
      return 'Bimbingan Manasik Haji & Umrah Mabrur';
    case 'FAMILY_HARMONY':
      return 'Ketahanan Keluarga & Parenting Sakinah';
    case 'SPIRITUAL_GROWTH':
      return 'Tazkiyatun Nafs & Penguatan Akidah';
    case 'ZAKAT_IMPACT':
      return 'Pemberdayaan Zakat & Filantropi Umat';
    default:
      return 'Eksplorasi Wawasan Islam Holistik';
  }
}

/**
 * AI-powered Custom Playlist Generator
 * Assembles a bespoke curriculum from available talks based on custom topic query or goal
 */
export function generateSmartCustomPlaylist(
  queryOrTopic: string,
  allTalks: TalkSession[],
  userProfile: UserTalkPreferenceProfile
): CuratedPlaylist {
  const queryLower = queryOrTopic.toLowerCase();

  // Score each talk session
  const scoredTalks = allTalks.map(talk => {
    let score = 0;
    const titleLower = talk.title.toLowerCase();
    const descLower = talk.description.toLowerCase();
    const tagLower = talk.tagline.toLowerCase();
    const speakerLower = talk.speaker.name.toLowerCase();

    if (titleLower.includes(queryLower)) score += 50;
    if (descLower.includes(queryLower)) score += 30;
    if (tagLower.includes(queryLower)) score += 20;

    // Check user topic affinity
    Object.entries(userProfile.topicWeights).forEach(([t, weight]) => {
      if (titleLower.includes(t.toLowerCase()) || descLower.includes(t.toLowerCase())) {
        score += weight * 2;
      }
    });

    // Check speaker affinity
    Object.entries(userProfile.scholarWeights).forEach(([s, weight]) => {
      if (speakerLower.includes(s.toLowerCase())) {
        score += weight * 3;
      }
    });

    return { talk, score };
  });

  scoredTalks.sort((a, b) => b.score - a.score);
  const selectedTalks = scoredTalks.slice(0, 3).map(item => item.talk);

  // If not enough talks, fallback
  const finalTalks = selectedTalks.length >= 2 ? selectedTalks : allTalks.slice(0, 3);

  const episodes: CuratedPlaylistEpisode[] = finalTalks.map((t, idx) => ({
    episodeNumber: idx + 1,
    talkId: t.id,
    customTitle: `Modul ${idx + 1}: ${t.title}`,
    durationMinutes: 45 + idx * 15,
    keyFocus: t.keyTakeaways[0] || 'Kajian komprehensif bersama pemateri.',
    talkSession: t
  }));

  const distinctScholars = Array.from(
    new Map(finalTalks.map(t => [t.speaker.name, t.speaker])).values()
  );

  const playlistId = `custom-ai-playlist-${Date.now()}`;
  const totalDuration = episodes.reduce((acc, ep) => acc + ep.durationMinutes, 0);

  const customPlaylist: CuratedPlaylist = {
    id: playlistId,
    title: `Kurikulum Khusus: ${queryOrTopic.length > 40 ? queryOrTopic.substring(0, 37) + '...' : queryOrTopic}`,
    subtitle: `Disusun otomatis oleh Smart Recommendation Engine sesuai profil minat Anda.`,
    description: `Rangkaian pembelajaran tematik terfokus yang memadukan dalil syariah, studi kasus kontemporer, dan bimbingan langsung para pakar.`,
    category: 'Kurasi Cerdas AI',
    categoryCode: finalTalks[0]?.category || 'FIQIH_MUAMALAH',
    badge: 'ALGORITHM_RECOMMENDED',
    badgeLabel: '✨ Rekomendasi Cerdas Algoritma',
    coverImage: finalTalks[0]?.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    scholars: distinctScholars,
    primaryTopics: [queryOrTopic, finalTalks[0]?.categoryLabel || 'Kajian Tematik'],
    difficulty: 'MENENGAH',
    totalDurationMinutes: totalDuration,
    totalEpisodes: episodes.length,
    episodes: episodes,
    matchScore: 99,
    matchReasons: [
      `Dibuat khusus menjawab pertanyaan Anda: "${queryOrTopic}"`,
      `Menghadirkan pemateri utama: ${distinctScholars.map(s => s.name).join(' & ')}`,
      `Disusun berurutan dari pengantar konsep hingga studi kasus`
    ],
    likesCount: 1,
    sharesCount: 0,
    isOfficialCuratorVerified: true,
    curatorName: 'Islamicity Smart Dakwah Algorithm'
  };

  return customPlaylist;
}
