export type Language = 'id' | 'en' | 'ar' | 'su' | 'jv' | 'ms';

export type Theme = 'light' | 'dark';

export type TabType = 
  | 'dashboard'
  | 'islamicity-talks'
  | 'zakat-blockchain'
  | 'donations'
  | 'hajj-umrah'
  | 'lynk-hub'
  | 'forum'
  | 'masjid-finder'
  | 'analytics-audit';

export type AsnafCategory = 
  | 'FAKIR' 
  | 'MISKIN' 
  | 'AMIL' 
  | 'MUALAF' 
  | 'RIQAB' 
  | 'GHARIM'
  | 'GHARIMIN'
  | 'FISABILILLAH' 
  | 'IBNU_SABIL';

export interface BlockchainTransaction {
  id: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
  type: 'ZAKAT_MAAL' | 'ZAKAT_FITRAH' | 'ZAKAT_PROFESI' | 'ZAKAT_EMAS' | 'ZAKAT_SAHAM' | 'INFAQ_SEDEKAH' | 'WAKAF_PRODUKTIF' | 'DISTRIBUTION_ASNAF';
  donorName: string;
  isAnonymous: boolean;
  donorAddressEncrypted?: string;
  amount: number;
  currency?: string;
  charityId: string;
  charityName: string;
  asnafTarget?: AsnafCategory;
  recipientHash?: string;
  status: 'CONFIRMED' | 'AUDITED' | 'DISTRIBUTED' | 'PENDING';
  smartContract: string;
  gasFee?: number;
  merkleProof: string;
  taxDeductionEligible?: boolean;
  officialReceiptNumber: string;
}

export interface BlockchainBlock {
  blockNumber: number;
  blockHash: string;
  prevHash: string;
  merkleRoot: string;
  timestamp: string;
  txCount: number;
  totalVolume: number;
  validatorNode: string;
  shariaAuditSignature: string;
}

export interface CharityOrganization {
  id: string;
  name: string;
  legalCode: string;
  licenseNumber: string;
  badge: 'BAZNAS_RESMI' | 'LAZ_NASIONAL' | 'LAZ_PROVINSI' | 'GLOBAL_CHARITY';
  logo: string;
  description: string;
  accountNumber?: string;
  rating?: number;
  verifiedAuditYear?: number;
  transparencyScore?: number;
  totalDistributed?: number;
  activeCampaignsCount?: number;
}

export interface CharityCampaign {
  id: string;
  title: string;
  category: 'Zakat' | 'Kemanusiaan' | 'Pendidikan' | 'Masjid & Qur\'an' | 'Kesehatan' | 'Ekonomi Dhuafa' | 'Bencana Alam' | 'WAKAF' | string;
  charityId: string;
  charityName: string;
  charityBadge?: string;
  coverImage: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  donorCount: number;
  daysLeft?: number;
  daysRemaining?: number;
  asnafCategory?: AsnafCategory;
  isUrgent?: boolean;
  blockchainTrackingEnabled?: boolean;
  verifiedBySharia?: boolean;
  recentDonations: {
    name: string;
    amount: number;
    time: string;
    isAnonymous: boolean;
    txHash: string;
  }[];
}

export interface LynkResource {
  id: string;
  title: string;
  category: 'DAKWAH' | 'PRODUKTIVITAS' | 'BISNIS_HALAL' | 'VIDEO_COURSE' | 'AUDIO_MUROTTAL' | string;
  creatorName: string;
  creatorHandle?: string;
  creatorAvatar: string;
  creatorBadge?: 'Lynk.id Pro' | 'Verified Ustaz' | 'Islamic Creator' | 'Amil Partner' | string;
  lynkUrl: string;
  price: number;
  isFree: boolean;
  priceType?: 'FREE' | 'WAQAF_PAY_WHAT_YOU_WANT' | 'MICRO_GRANT';
  minDonation?: number;
  downloadsCount: number;
  rating: number;
  fileSize?: string;
  description: string;
  tags?: string[];
  coverUrl: string;
  sha256Hash?: string;
  sha256Checksum?: string;
  waqfPercentage?: number;
  verifiedSharia?: boolean;
}

export interface ForumTopic {
  id: string;
  name: string;
  icon: string;
  description: string;
  threadCount: number;
}

export interface ForumComment {
  id: string;
  threadId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  timestamp: string;
  upvotes: number;
  isUstazVerified: boolean;
}

export interface CommunityPollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CommunityPollComment {
  id: string;
  pollId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  timestamp: string;
}

export interface CommunityPoll {
  id: string;
  title: string;
  description?: string;
  category: 'Fiqih & Fatwa' | 'Program Masjid' | 'Gaya Hidup Halal' | 'Wakaf & Sosial' | 'Edukasi & Kajian' | string;
  creatorName: string;
  creatorAvatar: string;
  creatorBadge?: string;
  createdAt: string;
  expiresAt?: string;
  isClosed?: boolean;
  totalVotes: number;
  options: CommunityPollOption[];
  userVotedOptionId?: string;
  allowMultiple?: boolean;
  tags?: string[];
  comments?: CommunityPollComment[];
}

export interface ForumThread {
  id: string;
  topicId?: string;
  title: string;
  content: string;
  authorName: string;
  authorHandle?: string;
  authorAvatar: string;
  authorBadge?: string;
  isUstazVerified?: boolean;
  timestamp: string;
  upvotes: number;
  commentsCount: number;
  tags: string[];
  isPinned?: boolean;
  isE2EEProtected?: boolean;
  isE2EEncryptedChannel?: boolean;
  e2eeEncryptedPayload?: string;
  comments?: ForumComment[];
}

export interface KajianEvent {
  id: string;
  title: string;
  speaker: string;
  time: string;
  date: string;
  topic?: string;
  isLiveStreamed?: boolean;
  rsvpCount: number;
}

export type CommunityEventCategory = 
  | 'TABLIGH_AKBAR' 
  | 'BAZAR_HALAL' 
  | 'BAKTI_SOSIAL' 
  | 'WORKSHOP_EDUKASI' 
  | 'TAHSIN_QURAN' 
  | 'SUBUH_GABUNGAN'
  | 'DONASI_MASSAL';

export interface CommunityEvent {
  id: string;
  masjidId?: string;
  masjidName: string;
  title: string;
  category: CommunityEventCategory;
  categoryLabel: string;
  categoryIcon: string;
  speakerOrHost: string;
  date: string;
  time: string;
  locationName: string;
  address: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  photoUrl: string;
  attendeesCount: number;
  capacityLimit?: number;
  isFree: boolean;
  priceNote?: string;
  isLiveStreamed?: boolean;
  isFeatured?: boolean;
  description: string;
  tags: string[];
  contactPerson?: string;
  hasCertificates?: boolean;
  userRsvp?: boolean;
}

export interface MasjidReview {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  timestamp: string;
  cleanlinessScore?: number;
  wudhuComfortScore?: number;
  acAcousticScore?: number;
  verifiedJamaah?: boolean;
}

export interface PrayerCrowdLevel {
  occupancyPercent: number; // 0 to 100
  crowdLevel: 'SEPI_LENGGANG' | 'SEDANG' | 'RAMAI' | 'SANGAT_PADAT';
  estimatedJamaah: number;
  parkingStatus: 'TERSEDIA_LELUASA' | 'TERBATAS' | 'PADAT_PENUH';
  recommendation: string;
}

export type PrayerPeakKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'jumaat';

export interface MasjidPrayerPeakData {
  currentCrowdPercent: number;
  currentStatus: 'SEPI_LENGGANG' | 'SEDANG' | 'RAMAI' | 'SANGAT_PADAT';
  currentPrayerName: string;
  quietestPrayer: string;
  peakPrayer: string;
  prayerDensity: {
    fajr: PrayerCrowdLevel;
    dhuhr: PrayerCrowdLevel;
    asr: PrayerCrowdLevel;
    maghrib: PrayerCrowdLevel;
    isha: PrayerCrowdLevel;
    jumaat: PrayerCrowdLevel;
  };
  hourlyHeatmap: { hour: number; crowd: number }[];
  femaleAreaCapacity: 'LEGA' | 'SEDANG' | 'PENUH';
  wudhuQueueMinutes: number;
  parkingScore: number;
}

export interface MasjidLocation {
  id: string;
  name: string;
  type?: 'Masjid Raya' | 'Masjid Jami' | 'Pusat Komunitas Islam' | 'Musholla Eksekutif' | string;
  address: string;
  city?: string;
  distanceKm: number;
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  qiblaBearing?: number;
  photoUrl: string;
  image?: string;
  facilities: string[];
  kajianSchedule: KajianEvent[];
  contact?: string;
  contactPhone?: string;
  rating?: number;
  reviewCount?: number;
  ratingsBreakdown?: {
    cleanliness: number;
    wudhuComfort: number;
    acAcoustics: number;
    parkingAccess: number;
  };
  reviews?: MasjidReview[];
  isLiveAdhanAvailable?: boolean;
  prayerPeakData?: MasjidPrayerPeakData;
}

export interface PrayerTimeData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  qiyam: string;
}

export interface UserSecurityProfile {
  name: string;
  email: string;
  avatar: string;
  lynkHandle: string;
  is2FAEnabled: boolean;
  authMethod: 'TOTP_AUTHENTICATOR' | 'SMS_OTP' | 'BIOMETRIC_PASSKEY' | 'NONE';
  kycLevel: 'TIER_1_MUZAKKI_BASIC' | 'TIER_2_VERIFIED_DONOR' | 'TIER_3_AMIL_INSTITUTION' | string;
  e2eePublicKey: string;
  backupPhraseVerified: boolean;
  taxIdentificationNumber?: string;
  autoReceiptEmail: boolean;
}

export interface OfflineQueueItem {
  id: string;
  type: 'PLEDGE_DONATION' | 'ZAKAT_NOTE' | 'SAVED_RESOURCE' | 'FORUM_DRAFT';
  payload: any;
  createdAt: string;
  status: 'PENDING_SYNC' | 'SYNCED' | 'FAILED';
}

export interface DailyDua {
  id: string;
  title: string;
  category: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  benefitFadhilah: string;
  source: string;
  audioUrl?: string;
  repeatCount?: number;
  tags: string[];
}

export interface MosquePhysicalBox {
  id: string;
  mosqueId: string;
  mosqueName: string;
  boxType: 'INFAQ_JUMAT' | 'SEDEKAH_SUBUH' | 'WAKAF_RENOVASI' | 'SANTUNAN_YATIM' | 'OPERASIONAL_MASJID' | 'ZAKAT_FITRAH';
  boxLabel: string;
  locationDetails: string;
  qrisNmid: string;
  dkmAccount: string;
  dkmLeader: string;
  targetAsnaf?: AsnafCategory;
  city: string;
  photoUrl: string;
  qrPayload: string;
  suggestedAmounts: number[];
  verifiedShariaDate: string;
}

export interface ScannedQRCodeResult {
  rawText: string;
  mosqueBox?: MosquePhysicalBox;
  isOfficialMosqueBox: boolean;
  type: 'MOSQUE_BOX' | 'OFFICIAL_CHARITY_CAMPAIGN' | 'STANDARD_QRIS' | 'UNKNOWN';
  campaignId?: string;
  charityId?: string;
  charityName?: string;
  merchantName?: string;
  city?: string;
  nmid?: string;
  amount?: number;
}

export interface CharityQRVerificationResult {
  isValid: boolean;
  rawPayload: string;
  verificationLevel: 'OFFICIAL_VERIFIED' | 'SUSPICIOUS_UNVERIFIED' | 'MOSQUE_BOX_VERIFIED' | 'STANDARD_QRIS';
  charity?: CharityOrganization;
  campaign?: CharityCampaign;
  mosqueBox?: MosquePhysicalBox;
  merchantName: string;
  charityName?: string;
  campaignTitle?: string;
  city?: string;
  nmid?: string;
  licenseNumber?: string;
  legalCode?: string;
  shariaComplianceHash?: string;
  transparencyScore?: number;
  auditYear?: number;
  warningFlags?: string[];
  suggestedAmount?: number;
  asnafCategory?: AsnafCategory;
}

export interface PushNotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'PRAYER_ALERT' | 'DONATION_UPDATE' | 'BLOCKCHAIN_CONFIRM' | 'FORUM_REPLY' | 'SECURITY' | 'ZAKAT_REMINDER';
  timestamp: string;
  read: boolean;
  linkTab?: TabType;
  metadata?: any;
}

export interface AnnualFinancialData {
  cashAndBank: number;
  goldAndSilverValue: number;
  stocksAndMutualFunds: number;
  businessAssetsAndReceivables: number;
  annualIncome: number;
  annualExpenses: number;
  shortTermDebts: number;
  lastUpdated: string;
  notes?: string;
}

export type ZakatHaulReminderWindow = 'ON_HAUL' | '7_DAYS_BEFORE' | '14_DAYS_BEFORE' | '30_DAYS_BEFORE' | 'QUARTERLY';

export type HaulCycleType = 'GREGORIAN' | 'HIJRI_RAMADHAN' | 'HIJRI_MUHARRAM' | 'END_OF_YEAR';

export interface ScheduledZakatNotificationSettings {
  isEnabled: boolean;
  browserPushEnabled: boolean;
  haulDate: string; // ISO date format YYYY-MM-DD
  haulCycleType: HaulCycleType;
  reminderWindow: ZakatHaulReminderWindow;
  autoSyncWithNisab: boolean;
  notificationTime: string; // e.g. "09:00"
  lastNotifiedDate?: string;
  financialData: AnnualFinancialData;
}

export interface AnnualZakatCalculationSummary {
  grossWealth: number;
  totalDeductions: number;
  netZakatableWealth: number;
  nisabThreshold: number;
  meetsNisab: boolean;
  surplusAboveNisab: number;
  nisabCoveragePercentage: number;
  estimatedZakatPayable: number;
  daysUntilHaul: number;
  haulStatus: 'DUE_NOW' | 'UPCOMING' | 'REMINDER_ACTIVE' | 'NOT_MET';
  recommendationNote: string;
}

export type RecurringFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface RecurringDonationSchedule {
  id: string;
  charityId: string;
  charityName: string;
  campaignId?: string;
  campaignTitle?: string;
  amount: number;
  frequency: RecurringFrequency;
  timingDetails: string; // e.g., 'Setiap Subuh (04:45 WIB)' or 'Setiap Hari Jumat (09:00 WIB)' or 'Setiap Tanggal 25'
  paymentMethod: 'AUTO_DEBIT_BSI' | 'LYNK_WALLET' | 'QRIS_AUTOPAY' | 'MANDIRI_AUTODEBIT';
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  nextExecutionDate: string;
  totalExecutedCount: number;
  totalAmountDonated: number;
  isAnonymous: boolean;
  smartContract: string;
  createdAt: string;
  note?: string;
  asnafCategory?: AsnafCategory;
}

export type HajjChecklistCategory = 
  | 'DOCUMENTS'
  | 'IBADAH_MANASIK'
  | 'EQUIPMENT_CLOTHING'
  | 'HEALTH_MEDICINE'
  | 'FINANCIAL_DIGITAL';

export interface HajjChecklistItem {
  id: string;
  title: string;
  category: HajjChecklistCategory;
  description: string;
  isCompleted: boolean;
  isMandatory: boolean;
  tips?: string;
  targetTripType?: 'ALL' | 'HAJJ' | 'UMRAH';
}

export type PilgrimageType = 'UMRAH_REGULER' | 'UMRAH_VIP' | 'UMRAH_RAMADHAN' | 'HAJJ_REGULER' | 'HAJJ_KHUSUS' | 'HAJJ_FURODA' | 'CUSTOM';

export interface PilgrimageSavingsPlan {
  pilgrimageType: PilgrimageType;
  targetDepartureYear: number;
  totalTargetCost: number;
  initialSavings: number;
  savingsDurationMonths: number;
  savingFrequency: 'MONTHLY' | 'WEEKLY' | 'DAILY';
  goldConversionEstimatedGrams: number;
  monthlyAmountNeeded: number;
  dailyAmountNeeded: number;
  strategy: 'SYARIAH_SAVINGS' | 'GOLD_HEDGE' | 'SUKUK_MUTUAL_FUND';
}

export interface PilgrimageGuideStep {
  id: string;
  stepNumber: number;
  title: string;
  titleArabic?: string;
  phase: 'PREPARATION' | 'IHRAM' | 'TAWAF' | 'SAI' | 'TAHALLUL' | 'ARAFAT_MINA' | 'TASYRIK' | 'WADA';
  description: string;
  rulings: string[];
  commonMistakes?: string[];
  sunnahPractices?: string[];
  duaTextArabic?: string;
  duaTextLatin?: string;
  duaTranslation?: string;
  tripType: 'HAJJ' | 'UMRAH' | 'BOTH';
}

export type ImpactMatchingCategory = 
  | 'ALL'
  | 'AIR_BERSIH' 
  | 'MODAL_DHUAFA' 
  | 'PENDIDIKAN_MADRASAH' 
  | 'KESEHATAN_LANSIA' 
  | 'PANGAN_DARURAT' 
  | 'WAKAF_ENERGI';

export interface ImpactMatchingProject {
  id: string;
  title: string;
  category: ImpactMatchingCategory;
  categoryLabel: string;
  initiatorName: string;
  initiatorAvatar: string;
  initiatorRole: string;
  initiatorContact?: string;
  location: string;
  province: string;
  verifiedBy: string;
  isVerified: boolean;
  coverImage: string;
  description: string;
  problemStatement: string;
  expectedBeneficiaries: string; // e.g. "150 Kepala Keluarga (600 Jiwa)"
  targetAmount: number;
  communityCollectedAmount: number;
  matchedAmount: number;
  matchingRatio: number; // e.g. 1.0 = 1:1 match, 1.5 = 1.5x match, 2.0 = 2x match
  matchingRatioLabel: string; // e.g. "1:1 Match (Donasi Berlipat Ganda)"
  matchingSponsorName: string;
  matchingSponsorBadge?: string;
  matchingPoolTotal: number;
  matchingPoolRemaining: number;
  coFinancierCount: number;
  daysRemaining: number;
  asnafCategory: AsnafCategory;
  smartContractAddress: string;
  recentCoFinanciers: {
    donorName: string;
    donorAmount: number;
    matchedContribution: number;
    timeAgo: string;
    isAnonymous: boolean;
    txHash?: string;
  }[];
}

export interface CoFinancePledge {
  projectId: string;
  donorName: string;
  isAnonymous: boolean;
  amount: number;
  matchedAmount: number;
  totalImpactAmount: number;
  paymentMethod: 'QRIS' | 'VA_BSI' | 'VA_MANDIRI' | 'LYNK_PAY' | 'CRYPTO_USDT';
  doaNote: string;
  zakatType: 'ZAKAT_MAAL' | 'INFAQ_SEDEKAH' | 'WAKAF_TUNAI' | 'ZAKAT_FITRAH';
}

// ==================== ISLAMICITY TALKS & PUSAT DAKWAH TYPES ====================

export interface TalkSpeaker {
  name: string;
  role: string;
  avatar: string;
  organization: string;
  isVerified: boolean;
  specialization: string;
}

export interface TalkDownloadable {
  title: string;
  type: 'PDF' | 'SLIDE' | 'EBOOK' | 'AUDIO_MP3';
  size: string;
  downloadsCount: number;
  url?: string;
}

export interface TalkQuestion {
  id: string;
  userName: string;
  userAvatar?: string;
  isAnonymous: boolean;
  question: string;
  upvotes: number;
  hasUpvoted?: boolean;
  timestamp: string;
  answered: boolean;
  answerText?: string;
  answeredBy?: string;
}

export interface TalkPollOption {
  id: string;
  text: string;
  votes: number;
}

export interface TalkPoll {
  id: string;
  question: string;
  options: TalkPollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface TalkSession {
  id: string;
  title: string;
  category: 'AKIDAH' | 'FIQIH_MUAMALAH' | 'FAMILY' | 'ZAKAT_EKONOMI' | 'SPIRITUAL' | 'HAJJ_PREP';
  categoryLabel: string;
  tagline: string;
  speaker: TalkSpeaker;
  coSpeakers?: TalkSpeaker[];
  date: string; // e.g. "Minggu, 6 September 2026"
  time: string; // e.g. "09.00 - 11.30 WIB"
  status: 'LIVE' | 'UPCOMING' | 'RECORDED';
  liveViewerCount?: number;
  streamUrl?: string;
  coverImage: string;
  registeredCount: number;
  maxCapacity?: number;
  isUserRegistered: boolean;
  description: string;
  keyTakeaways: string[];
  agenda: { time: string; topic: string; presenter: string }[];
  downloadables: TalkDownloadable[];
  questions: TalkQuestion[];
  polls: TalkPoll[];
  certificatesIssuedCount: number;
  infaqRaisedAmount?: number;
}

export interface DakwahArticle {
  id: string;
  title: string;
  category: 'AKIDAH' | 'FIQIH' | 'MUAMALAH' | 'FAMILY' | 'SIRAH' | 'SAINS';
  categoryLabel: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  readTimeMinutes: number;
  date: string;
  excerpt: string;
  content: string;
  coverImage: string;
  audioDuration?: string;
  likesCount: number;
  hasLiked?: boolean;
  sharesCount: number;
  tags: string[];
  keyVerses?: { arabic: string; latin: string; translation: string; surah: string }[];
}

export interface TanyaJawabItem {
  id: string;
  questionerName: string;
  isAnonymous: boolean;
  city?: string;
  title: string;
  question: string;
  category: 'FIQIH_IBADAH' | 'MUAMALAH_FINANCE' | 'KELUARGA' | 'AKIDAH_KONTEMPORER' | 'ZAKAT_HUKUM';
  categoryLabel: string;
  answer: string;
  ustadzName: string;
  ustadzTitle: string;
  ustadzAvatar: string;
  dalilRef: string[];
  date: string;
  viewsCount: number;
  likesCount: number;
  hasLiked?: boolean;
  isResolved: boolean;
}

export interface LuckyWheelVoucher {
  id: string;
  name: string;
  category: 'HAJJ' | 'UMRAH' | 'BOOK' | 'INFAQ' | 'TALKS_VIP' | 'DOA';
  code: string;
  discountValue: string;
  description: string;
  terms: string;
  expiryDate: string;
  color: string;
  isClaimed: boolean;
  claimedAt?: string;
}

export type TalkTopicCategory = 
  | 'FIQIH_MUAMALAH' 
  | 'ZAKAT_EKONOMI' 
  | 'HAJJ_PREP' 
  | 'FAMILY' 
  | 'AKIDAH' 
  | 'SPIRITUAL' 
  | 'TAFSIR_QURAN'
  | 'BISNIS_SYARIAH'
  | 'SIRAH_NABAWIAH';

export interface UserTalkPreferenceProfile {
  selectedTopics: string[];
  preferredScholars: string[];
  watchedTalkIds: string[];
  completedTalkIds: string[];
  bookmarkedTalkIds: string[];
  savedPlaylistIds: string[];
  primaryGoal: 'ALL' | 'HAJJ_PREP' | 'FINANCE_HALAL' | 'FAMILY_HARMONY' | 'SPIRITUAL_GROWTH' | 'ZAKAT_IMPACT';
  learningPace: 'QUICK_SUMMARY' | 'IN_DEPTH_SERIES' | 'MASTERCLASS';
  preferredDifficulty: 'SEMUA_LEVEL' | 'PEMULA' | 'MENENGAH' | 'LANJUTAN';
  topicWeights: Record<string, number>; // 1 - 10 scale
  scholarWeights: Record<string, number>; // 1 - 10 scale
}

export interface CuratedPlaylistEpisode {
  episodeNumber: number;
  talkId: string;
  customTitle?: string;
  durationMinutes: number;
  keyFocus: string;
  isCompleted?: boolean;
  talkSession: TalkSession;
}

export interface CuratedPlaylist {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  categoryCode: TalkTopicCategory;
  badge: 'ALGORITHM_RECOMMENDED' | 'POPULAR_SERIES' | 'SCHOLAR_COLLECTION' | 'LEARNING_PATH' | 'NEW_RELEASE' | 'USER_CUSTOM';
  badgeLabel: string;
  coverImage: string;
  scholars: TalkSpeaker[];
  primaryTopics: string[];
  difficulty: 'PEMULA' | 'MENENGAH' | 'LANJUTAN';
  totalDurationMinutes: number;
  totalEpisodes: number;
  episodes: CuratedPlaylistEpisode[];
  targetGoal?: string;
  matchScore?: number; // 0 to 100 calculated dynamically
  matchReasons?: string[];
  matchBreakdown?: {
    topicScore: number;
    scholarScore: number;
    goalScore: number;
    levelScore: number;
  };
  isSaved?: boolean;
  completedEpisodesCount?: number;
  likesCount: number;
  hasLiked?: boolean;
  sharesCount: number;
  isOfficialCuratorVerified: boolean;
  curatorName: string;
}

export interface RecommendationAlgorithmExplanation {
  overallScore: number;
  topicAffinityPercent: number;
  scholarAffinityPercent: number;
  goalAffinityPercent: number;
  reasons: string[];
  matchedKeywords: string[];
}

export type MasjidVisitPrayer = 'FAJR' | 'DHUHR' | 'ASR' | 'MAGHRIB' | 'ISHA' | 'JUMAAT' | 'TAHAJJUD' | 'DHUHA' | 'KAJIAN_EVENT' | 'OTHER';

export type MasjidVisitPurpose = 
  | 'SHALAT_FARDHU' 
  | 'SHALAT_JUMAT' 
  | 'KAJIAN_ILMU' 
  | 'ITIKAF' 
  | 'TARAWIH' 
  | 'TAHSIN_QURAN'
  | 'WISATA_ZIARAH' 
  | 'TRANSIT_ISTIRAHAT' 
  | 'OTHER';

export interface MasjidVisitRecord {
  id: string;
  masjidId: string;
  masjidName: string;
  masjidAddress: string;
  masjidCity?: string;
  masjidPhotoUrl?: string;
  visitedAt: string;
  prayerTime: MasjidVisitPrayer;
  prayerLabel: string;
  purpose: MasjidVisitPurpose;
  purposeLabel: string;
  notes?: string;
  personalRating?: number;
  withCongregation: boolean;
  shafPosition?: 'DEPAN' | 'TENGAH' | 'BELAKANG' | 'MEZZANINE';
  cleanlinessSatisfaction?: 'SANGAT_BERSIH' | 'BERSIH' | 'CUKUP';
  gpsVerified?: boolean;
  userCoordsAtVisit?: { lat: number; lng: number };
  distanceAtVisitKm?: number;
  tags?: string[];
}



