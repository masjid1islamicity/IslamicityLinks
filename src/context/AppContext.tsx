import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Language, 
  Theme, 
  TabType, 
  BlockchainTransaction, 
  BlockchainBlock, 
  CharityCampaign, 
  LynkResource, 
  ForumThread, 
  MasjidLocation, 
  MasjidReview,
  UserSecurityProfile, 
  PushNotificationItem,
  OfflineQueueItem,
  RecurringDonationSchedule,
  CommunityEvent,
  AnnualFinancialData,
  ScheduledZakatNotificationSettings,
  AnnualZakatCalculationSummary,
  ImpactMatchingProject,
  CoFinancePledge
} from '../types';
import { translations } from '../translations';
import { 
  INITIAL_CAMPAIGNS, 
  INITIAL_LYNK_RESOURCES, 
  INITIAL_THREADS, 
  INITIAL_MASJIDS, 
  INITIAL_BLOCKS, 
  INITIAL_TRANSACTIONS,
  INITIAL_RECURRING_SCHEDULES,
  INITIAL_COMMUNITY_EVENTS
} from '../data/mockData';
import { INITIAL_IMPACT_MATCHING_PROJECTS } from '../data/impactMatchingData';
import { E2EESecurity, OfflineStorage, generateSHA256Hash } from '../utils/cryptoSim';
import {
  BrowserNotificationPermission,
  isBrowserNotificationSupported,
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
  dispatchBrowserPushNotification,
  computeAnnualZakatSummary,
  ZakatScheduleStorage
} from '../utils/browserNotification';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: (key: string) => string;
  
  // Offline
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  offlineQueue: OfflineQueueItem[];
  triggerManualSync: () => void;
  
  // Data State
  blockchainTransactions: BlockchainTransaction[];
  blockchainBlocks: BlockchainBlock[];
  campaigns: CharityCampaign[];
  resources: LynkResource[];
  forumThreads: ForumThread[];
  masjids: MasjidLocation[];
  communityEvents: CommunityEvent[];
  
  // Gold Price & Nisab
  goldPricePerGram: number;
  nisabMaalAmount: number;
  
  // User & Security
  userProfile: UserSecurityProfile;
  updateUserProfile: (profile: Partial<UserSecurityProfile>) => void;
  is2FAModalOpen: boolean;
  setIs2FAModalOpen: (open: boolean) => void;
  
  // Modals & Drawers
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  selectedReceiptTx: BlockchainTransaction | null;
  setSelectedReceiptTx: (tx: BlockchainTransaction | null) => void;
  selectedExplorerData: { tx?: BlockchainTransaction; block?: BlockchainBlock } | null;
  setSelectedExplorerData: (data: { tx?: BlockchainTransaction; block?: BlockchainBlock } | null) => void;
  
  // Recurring Donations
  recurringSchedules: RecurringDonationSchedule[];
  addRecurringSchedule: (schedule: Omit<RecurringDonationSchedule, 'id' | 'createdAt' | 'totalExecutedCount' | 'totalAmountDonated' | 'smartContract'>) => RecurringDonationSchedule;
  toggleRecurringScheduleStatus: (id: string) => void;
  deleteRecurringSchedule: (id: string) => void;
  executeRecurringNow: (id: string) => BlockchainTransaction | undefined;

  // Actions
  addNewTransaction: (tx: Omit<BlockchainTransaction, 'id' | 'txHash' | 'blockNumber' | 'timestamp' | 'merkleProof' | 'officialReceiptNumber'>) => BlockchainTransaction;
  addForumThread: (thread: Omit<ForumThread, 'id' | 'timestamp' | 'upvotes' | 'commentsCount'>) => void;
  addForumComment: (threadId: string, content: string) => void;
  toggleThreadUpvote: (threadId: string) => void;
  rsvpKajian: (masjidId: string, kajianId: string) => void;
  addMasjidReview: (masjidId: string, review: MasjidReview) => void;
  rsvpCommunityEvent: (eventId: string) => void;
  addCommunityEvent: (event: Omit<CommunityEvent, 'id' | 'attendeesCount' | 'userRsvp'>) => void;
  
  // Notifications
  notifications: PushNotificationItem[];
  addNotification: (item: Omit<PushNotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Scheduled Zakat & Annual Financial Notifications
  scheduledZakatSettings: ScheduledZakatNotificationSettings;
  updateScheduledZakatSettings: (settings: Partial<ScheduledZakatNotificationSettings>) => void;
  updateAnnualFinancialData: (financial: Partial<AnnualFinancialData>) => void;
  browserNotificationPermission: BrowserNotificationPermission;
  requestNotificationPermission: () => Promise<BrowserNotificationPermission>;
  triggerZakatHaulCheck: (forceAlert?: boolean) => { alertSent: boolean; message: string; summary: AnnualZakatCalculationSummary };
  annualZakatSummary: AnnualZakatCalculationSummary;

  // Community Impact Matching (Co-Financing Local Charity Projects)
  impactMatchingProjects: ImpactMatchingProject[];
  coFinanceProject: (pledge: CoFinancePledge) => BlockchainTransaction;
  proposeImpactMatchingProject: (project: Omit<ImpactMatchingProject, 'id' | 'communityCollectedAmount' | 'matchedAmount' | 'coFinancierCount' | 'smartContractAddress' | 'recentCoFinanciers' | 'isVerified'>) => void;
  sponsorMatchingPool: (projectId: string, additionalPoolAmount: number, sponsorName: string) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [language, setLanguage] = useState<Language>('id');
  const [theme, setTheme] = useState<Theme>('light');
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>(OfflineStorage.getQueue());
  
  const [blockchainTransactions, setBlockchainTransactions] = useState<BlockchainTransaction[]>(INITIAL_TRANSACTIONS);
  const [blockchainBlocks, setBlockchainBlocks] = useState<BlockchainBlock[]>(INITIAL_BLOCKS);
  const [campaigns, setCampaigns] = useState<CharityCampaign[]>(INITIAL_CAMPAIGNS);
  const [resources, setResources] = useState<LynkResource[]>(INITIAL_LYNK_RESOURCES);
  const [forumThreads, setForumThreads] = useState<ForumThread[]>(INITIAL_THREADS);
  const [masjids, setMasjids] = useState<MasjidLocation[]>(INITIAL_MASJIDS);
  const [communityEvents, setCommunityEvents] = useState<CommunityEvent[]>(INITIAL_COMMUNITY_EVENTS);
  const [recurringSchedules, setRecurringSchedules] = useState<RecurringDonationSchedule[]>(INITIAL_RECURRING_SCHEDULES);
  const [impactMatchingProjects, setImpactMatchingProjects] = useState<ImpactMatchingProject[]>(INITIAL_IMPACT_MATCHING_PROJECTS);
  
  const goldPricePerGram = 1450000; // Rp 1.450.000 / gram emas murni
  const nisabMaalAmount = goldPricePerGram * 85; // Rp 123.250.000

  const [userProfile, setUserProfile] = useState<UserSecurityProfile>(() => {
    const keyPair = E2EESecurity.generateKeyPair();
    return {
      name: 'Dr. Ahmad Fauzan, S.E.I.',
      email: 'masjid1.islamicity@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      lynkHandle: 'ahmadfauzan',
      is2FAEnabled: true,
      authMethod: 'TOTP_AUTHENTICATOR',
      kycLevel: 'TIER_2_VERIFIED_DONOR',
      e2eePublicKey: keyPair.publicKey,
      backupPhraseVerified: true,
      taxIdentificationNumber: '92.481.092.3-014.000',
      autoReceiptEmail: true,
    };
  });

  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<BlockchainTransaction | null>(null);
  const [selectedExplorerData, setSelectedExplorerData] = useState<{ tx?: BlockchainTransaction; block?: BlockchainBlock } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [notifications, setNotifications] = useState<PushNotificationItem[]>([
    {
      id: 'notif-01',
      title: 'Audit Zakat Terverifikasi',
      message: 'Zakat Maal Rp 2.500.000 Anda telah diverifikasi pada Blok #148293 oleh BAZNAS RI.',
      type: 'BLOCKCHAIN_CONFIRM',
      timestamp: '10 menit lalu',
      read: false,
      linkTab: 'zakat-blockchain',
    },
    {
      id: 'notif-02',
      title: 'Pemberitahuan Waktu Salat',
      message: 'Waktu Subuh wilayah Jakarta & sekitarnya dalam 30 menit ke depan.',
      type: 'PRAYER_ALERT',
      timestamp: '25 menit lalu',
      read: false,
      linkTab: 'masjid-finder',
    },
    {
      id: 'notif-03',
      title: 'Kajian Baru Terkonfirmasi',
      message: 'RSVP Kajian Akbar Tafsir Ibnu Katsir di Masjid Istiqlal berhasil dicatat.',
      type: 'FORUM_REPLY',
      timestamp: '1 jam lalu',
      read: true,
      linkTab: 'masjid-finder',
    }
  ]);

  // Scheduled Zakat Notification Settings & State
  const [scheduledZakatSettings, setScheduledZakatSettings] = useState<ScheduledZakatNotificationSettings>(() => {
    return ZakatScheduleStorage.getSettings();
  });

  const [browserNotificationPermission, setBrowserNotificationPermission] = useState<BrowserNotificationPermission>(() => {
    return getBrowserNotificationPermission();
  });

  // Calculate annual Zakat summary whenever financial data, haul date, or nisab changes
  const annualZakatSummary = useMemo<AnnualZakatCalculationSummary>(() => {
    return computeAnnualZakatSummary(
      scheduledZakatSettings.financialData,
      nisabMaalAmount,
      scheduledZakatSettings.haulDate,
      scheduledZakatSettings.reminderWindow
    );
  }, [scheduledZakatSettings.financialData, scheduledZakatSettings.haulDate, scheduledZakatSettings.reminderWindow, nisabMaalAmount]);

  const updateScheduledZakatSettings = useCallback((newSettings: Partial<ScheduledZakatNotificationSettings>) => {
    setScheduledZakatSettings(prev => {
      const updated = {
        ...prev,
        ...newSettings,
        financialData: newSettings.financialData ? { ...prev.financialData, ...newSettings.financialData } : prev.financialData
      };
      ZakatScheduleStorage.saveSettings(updated);
      return updated;
    });
  }, []);

  const updateAnnualFinancialData = useCallback((financial: Partial<AnnualFinancialData>) => {
    setScheduledZakatSettings(prev => {
      const updated = {
        ...prev,
        financialData: {
          ...prev.financialData,
          ...financial,
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      };
      ZakatScheduleStorage.saveSettings(updated);
      return updated;
    });
  }, []);

  const requestNotificationPermission = useCallback(async (): Promise<BrowserNotificationPermission> => {
    const permission = await requestBrowserNotificationPermission();
    setBrowserNotificationPermission(permission);
    if (permission === 'granted') {
      updateScheduledZakatSettings({ browserPushEnabled: true });
    }
    return permission;
  }, [updateScheduledZakatSettings]);

  // Trigger evaluation of Zakat Haul & dispatch Browser and In-App Notifications
  const triggerZakatHaulCheck = useCallback((forceAlert = false): {
    alertSent: boolean;
    message: string;
    summary: AnnualZakatCalculationSummary;
  } => {
    const summary = computeAnnualZakatSummary(
      scheduledZakatSettings.financialData,
      nisabMaalAmount,
      scheduledZakatSettings.haulDate,
      scheduledZakatSettings.reminderWindow
    );

    const isDue = summary.haulStatus === 'DUE_NOW' || summary.haulStatus === 'REMINDER_ACTIVE';
    
    if (forceAlert || (scheduledZakatSettings.isEnabled && isDue)) {
      const title = summary.haulStatus === 'DUE_NOW'
        ? '⚠️ Haul Zakat Maal Tahunan Telah Jatuh Tempo!'
        : `🔔 Pengingat Haul Zakat (${summary.daysUntilHaul} Hari Lagi)`;

      const body = summary.meetsNisab
        ? `Berdasarkan data keuangan tahunan Anda, aset bersih Rp ${summary.netZakatableWealth.toLocaleString('id-ID')} wajib zakat Rp ${summary.estimatedZakatPayable.toLocaleString('id-ID')} (2,5%). Ketuk untuk kalkulasi & tunaikan on-chain.`
        : `Data keuangan Anda tercatat Rp ${summary.netZakatableWealth.toLocaleString('id-ID')} (belum mencapai batas nisab Rp ${nisabMaalAmount.toLocaleString('id-ID')}).`;

      // 1. Dispatch Native Browser Push Notification if permission granted and enabled
      if (scheduledZakatSettings.browserPushEnabled && isBrowserNotificationSupported()) {
        dispatchBrowserPushNotification(title, {
          body,
          tag: 'islamicity-zakat-haul-alert',
          onClickCallback: () => {
            setActiveTab('zakat-blockchain');
            const targetEl = document.getElementById('scheduled-zakat-monitor-card') || document.getElementById('zakat-calculator-section');
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      }

      // 2. Dispatch In-App Notification Feed
      addNotification({
        title,
        message: body,
        type: 'ZAKAT_REMINDER',
        linkTab: 'zakat-blockchain',
        metadata: {
          summary,
          financialData: scheduledZakatSettings.financialData
        }
      });

      // Update last notified date
      updateScheduledZakatSettings({
        lastNotifiedDate: new Date().toISOString().split('T')[0]
      });

      return {
        alertSent: true,
        message: `Notifikasi pengingat Zakat (${summary.haulStatus}) berhasil disalurkan melalui Browser API & sistem notifikasi aplikasi.`,
        summary
      };
    }

    return {
      alertSent: false,
      message: `Haul belum jatuh tempo (${summary.daysUntilHaul} hari tersisa). Belum melewati ambang jadwal (${scheduledZakatSettings.reminderWindow}).`,
      summary
    };
  }, [scheduledZakatSettings, nisabMaalAmount, setActiveTab, updateScheduledZakatSettings]);

  // Periodic and on-mount evaluation of Zakat Haul schedule
  useEffect(() => {
    // Initial check after 2 seconds
    const timer = setTimeout(() => {
      if (scheduledZakatSettings.isEnabled) {
        const todayStr = new Date().toISOString().split('T')[0];
        if (scheduledZakatSettings.lastNotifiedDate !== todayStr) {
          triggerZakatHaulCheck(false);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Update browser permission state if user changes in browser settings
  useEffect(() => {
    if (isBrowserNotificationSupported()) {
      setBrowserNotificationPermission(Notification.permission as BrowserNotificationPermission);
    }
  }, []);

  // Handle Online/Offline window events
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      triggerManualSync();
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync theme to root html document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['id']?.[key] || key;
  };

  const addNotification = (item: Omit<PushNotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newItem: PushNotificationItem = {
      ...item,
      id: 'notif_' + Date.now().toString(36),
      timestamp: 'Baru saja',
      read: false,
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateUserProfile = (profile: Partial<UserSecurityProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  const triggerManualSync = () => {
    const queue = OfflineStorage.getQueue();
    if (queue.length === 0) return;

    // Process queued offline pledges or items
    queue.forEach(item => {
      if (item.type === 'PLEDGE_DONATION') {
        addNewTransaction(item.payload);
      }
      OfflineStorage.markSynced(item.id);
    });

    setOfflineQueue([]);
    OfflineStorage.clearQueue();
    addNotification({
      title: 'Sinkronisasi Offline Berhasil',
      message: `${queue.length} transaksi/data tertunda telah berhasil dicatat pada blockchain.`,
      type: 'BLOCKCHAIN_CONFIRM',
      linkTab: 'zakat-blockchain',
    });
  };

  const addNewTransaction = (
    txData: Omit<BlockchainTransaction, 'id' | 'txHash' | 'blockNumber' | 'timestamp' | 'merkleProof' | 'officialReceiptNumber'>
  ): BlockchainTransaction => {
    const latestBlockNum = (blockchainBlocks[0]?.blockNumber || 148293) + 1;
    const txHash = generateSHA256Hash(JSON.stringify(txData) + Date.now());
    const receiptNum = `BSZ-${txData.charityId.toUpperCase().replace('-', '')}/2026/${Math.floor(10000 + Math.random() * 90000)}`;

    const newTx: BlockchainTransaction = {
      ...txData,
      id: 'tx_' + Date.now().toString(36),
      txHash,
      blockNumber: latestBlockNum,
      timestamp: new Date().toISOString(),
      merkleProof: '0x' + generateSHA256Hash(txHash + latestBlockNum).substring(2, 34),
      officialReceiptNumber: receiptNum,
    };

    // Create a new block if block has filled
    const newBlock: BlockchainBlock = {
      blockNumber: latestBlockNum,
      blockHash: generateSHA256Hash(newTx.txHash + latestBlockNum),
      prevHash: blockchainBlocks[0]?.blockHash || '0x00000000',
      merkleRoot: generateSHA256Hash(newTx.merkleProof),
      timestamp: new Date().toISOString(),
      txCount: 1,
      totalVolume: newTx.amount,
      validatorNode: 'BAZNAS-SHARIA-VALIDATOR-01',
      shariaAuditSignature: 'ECDSA-SECP256K1-VERIFIED-SYARIAH-COUNCIL',
    };

    setBlockchainTransactions(prev => [newTx, ...prev]);
    setBlockchainBlocks(prev => [newBlock, ...prev]);

    // Update campaign collection if matches
    setCampaigns(prev => prev.map(c => {
      if (c.charityId === newTx.charityId || c.title.toLowerCase().includes(newTx.type.toLowerCase())) {
        return {
          ...c,
          collectedAmount: c.collectedAmount + newTx.amount,
          donorCount: c.donorCount + 1,
          recentDonations: [
            {
              name: newTx.isAnonymous ? 'Hamba Allah' : newTx.donorName,
              amount: newTx.amount,
              time: 'Baru saja',
              isAnonymous: newTx.isAnonymous,
              txHash: newTx.txHash.substring(0, 10) + '...',
            },
            ...c.recentDonations.slice(0, 3),
          ]
        };
      }
      return c;
    }));

    addNotification({
      title: 'Zakat & Donasi Berhasil',
      message: `${newTx.type.replace('_', ' ')} sebesar Rp ${newTx.amount.toLocaleString('id-ID')} telah tercatat di Blok #${latestBlockNum}.`,
      type: 'BLOCKCHAIN_CONFIRM',
      linkTab: 'zakat-blockchain',
    });

    return newTx;
  };

  const addForumThread = (thread: Omit<ForumThread, 'id' | 'timestamp' | 'upvotes' | 'commentsCount'>) => {
    const newThread: ForumThread = {
      ...thread,
      id: 'thread_' + Date.now().toString(36),
      timestamp: 'Baru saja',
      upvotes: 1,
      commentsCount: 0,
      comments: [],
    };
    setForumThreads(prev => [newThread, ...prev]);
    addNotification({
      title: 'Diskusi Baru Diterbitkan',
      message: `Topik Anda "${thread.title.substring(0, 40)}..." telah aktif di Forum Silaturahmi.`,
      type: 'FORUM_REPLY',
      linkTab: 'forum',
    });
  };

  const addForumComment = (threadId: string, content: string) => {
    setForumThreads(prev => prev.map(th => {
      if (th.id === threadId) {
        const newComment = {
          id: 'c_' + Date.now().toString(36),
          threadId,
          authorName: userProfile.name,
          authorAvatar: userProfile.avatar,
          authorBadge: 'Muzakki Terverifikasi',
          content,
          timestamp: 'Baru saja',
          upvotes: 0,
          isUstazVerified: false,
        };
        return {
          ...th,
          commentsCount: th.commentsCount + 1,
          comments: [...(th.comments || []), newComment],
        };
      }
      return th;
    }));
  };

  const toggleThreadUpvote = (threadId: string) => {
    setForumThreads(prev => prev.map(th => {
      if (th.id === threadId) {
        return { ...th, upvotes: th.upvotes + 1 };
      }
      return th;
    }));
  };

  const rsvpKajian = (masjidId: string, kajianId: string) => {
    setMasjids(prev => prev.map(m => {
      if (m.id === masjidId) {
        return {
          ...m,
          kajianSchedule: m.kajianSchedule.map(k => {
            if (k.id === kajianId) {
              return { ...k, rsvpCount: k.rsvpCount + 1 };
            }
            return k;
          })
        };
      }
      return m;
    }));

    addNotification({
      title: 'RSVP Kajian Terkonfirmasi',
      message: 'Kehadiran Anda pada kajian ilmu telah tercatat. Semoga berkah dan bermanfaat.',
      type: 'FORUM_REPLY',
      linkTab: 'masjid-finder',
    });
  };

  const addMasjidReview = (masjidId: string, review: MasjidReview) => {
    setMasjids(prev => prev.map(m => {
      if (m.id === masjidId) {
        const existingReviews = m.reviews || [];
        const updatedReviews = [review, ...existingReviews];
        const newCount = (m.reviewCount || 100) + 1;
        const totalRating = (m.rating || 4.9) * (m.reviewCount || 100) + review.rating;
        const newAvgRating = parseFloat((totalRating / newCount).toFixed(2));

        return {
          ...m,
          rating: newAvgRating,
          reviewCount: newCount,
          reviews: updatedReviews,
        };
      }
      return m;
    }));

    addNotification({
      title: 'Ulasan Jamaah Diterbitkan',
      message: `Ulasan Anda (${review.rating} Bintang) berhasil ditambahkan untuk membantu jamaah lain.`,
      type: 'FORUM_REPLY',
      linkTab: 'masjid-finder',
    });
  };

  const rsvpCommunityEvent = (eventId: string) => {
    let isNowGoing = false;
    let targetEventTitle = '';

    setCommunityEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        isNowGoing = !ev.userRsvp;
        targetEventTitle = ev.title;
        return {
          ...ev,
          userRsvp: isNowGoing,
          attendeesCount: isNowGoing ? ev.attendeesCount + 1 : Math.max(0, ev.attendeesCount - 1),
        };
      }
      return ev;
    }));

    if (isNowGoing) {
      addNotification({
        title: 'RSVP Event Komunitas Berhasil!',
        message: `Kehadiran Anda di "${targetEventTitle}" telah tercatat. Simpan ke kalender Anda.`,
        type: 'FORUM_REPLY',
        linkTab: 'masjid-finder',
      });
    } else {
      addNotification({
        title: 'RSVP Dibatalkan',
        message: `RSVP Anda untuk "${targetEventTitle}" telah dibatalkan.`,
        type: 'FORUM_REPLY',
        linkTab: 'masjid-finder',
      });
    }
  };

  const addCommunityEvent = (eventData: Omit<CommunityEvent, 'id' | 'attendeesCount' | 'userRsvp'>) => {
    const newEvent: CommunityEvent = {
      ...eventData,
      id: 'ev_' + Date.now().toString(36),
      attendeesCount: 1,
      userRsvp: true,
    };

    setCommunityEvents(prev => [newEvent, ...prev]);

    addNotification({
      title: 'Acara Komunitas Berhasil Diterbitkan!',
      message: `Acara "${newEvent.title}" kini telah disematkan pada radar peta jamaah sekitarnya.`,
      type: 'FORUM_REPLY',
      linkTab: 'masjid-finder',
    });
  };

  const addRecurringSchedule = (
    scheduleData: Omit<RecurringDonationSchedule, 'id' | 'createdAt' | 'totalExecutedCount' | 'totalAmountDonated' | 'smartContract'>
  ): RecurringDonationSchedule => {
    const contractCode = '0xAuto_' + scheduleData.charityId.toUpperCase().replace(/[^A-Z0-9]/g, '') + '_' + Date.now().toString(36).toUpperCase();
    const newSchedule: RecurringDonationSchedule = {
      ...scheduleData,
      id: 'rec_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      totalExecutedCount: 1, // First execution happens immediately upon creation
      totalAmountDonated: scheduleData.amount,
      smartContract: contractCode,
    };

    setRecurringSchedules(prev => [newSchedule, ...prev]);

    // Record initial blockchain transaction
    addNewTransaction({
      charityId: scheduleData.charityId,
      charityName: scheduleData.charityName + ' (Autodebit Berkala)',
      donorName: scheduleData.isAnonymous ? 'Hamba Allah' : userProfile.name,
      amount: scheduleData.amount,
      type: 'INFAQ_SEDEKAH',
      isAnonymous: scheduleData.isAnonymous,
      smartContract: contractCode,
      status: 'CONFIRMED',
      asnafTarget: scheduleData.asnafCategory || 'FISABILILLAH',
    });

    addNotification({
      title: 'Jadwal Sedekah Otomatis Aktif',
      message: `Donasi ${scheduleData.frequency === 'DAILY' ? 'Harian' : scheduleData.frequency === 'WEEKLY' ? 'Mingguan' : 'Bulanan'} Rp ${scheduleData.amount.toLocaleString('id-ID')} ke ${scheduleData.charityName} telah dijadwalkan secara otomatis.`,
      type: 'DONATION_UPDATE',
      linkTab: 'donations',
    });

    return newSchedule;
  };

  const toggleRecurringScheduleStatus = (id: string) => {
    setRecurringSchedules(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        addNotification({
          title: nextStatus === 'ACTIVE' ? 'Jadwal Donasi Diaktifkan' : 'Jadwal Donasi Dijeda',
          message: `Sedekah otomatis ke ${s.charityName} sekarang berstatus ${nextStatus === 'ACTIVE' ? 'Aktif' : 'Dijeda (Paused)'}.`,
          type: 'DONATION_UPDATE',
          linkTab: 'donations',
        });
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const deleteRecurringSchedule = (id: string) => {
    setRecurringSchedules(prev => prev.filter(s => s.id !== id));
    addNotification({
      title: 'Jadwal Donasi Dibatalkan',
      message: 'Jadwal autodebit donasi berkala telah dinonaktifkan.',
      type: 'DONATION_UPDATE',
      linkTab: 'donations',
    });
  };

  const executeRecurringNow = (id: string): BlockchainTransaction | undefined => {
    const targetSchedule = recurringSchedules.find(s => s.id === id);
    if (!targetSchedule) return undefined;

    const newTx = addNewTransaction({
      charityId: targetSchedule.charityId,
      charityName: targetSchedule.charityName + ' (Eksekusi Rutin Manual)',
      donorName: targetSchedule.isAnonymous ? 'Hamba Allah' : userProfile.name,
      amount: targetSchedule.amount,
      type: 'INFAQ_SEDEKAH',
      isAnonymous: targetSchedule.isAnonymous,
      smartContract: targetSchedule.smartContract,
      status: 'CONFIRMED',
      asnafTarget: targetSchedule.asnafCategory || 'FISABILILLAH',
    });

    setRecurringSchedules(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          totalExecutedCount: s.totalExecutedCount + 1,
          totalAmountDonated: s.totalAmountDonated + s.amount,
        };
      }
      return s;
    }));

    return newTx;
  };

  // Co-Finance a Community Impact Matching Project
  const coFinanceProject = (pledge: CoFinancePledge): BlockchainTransaction => {
    const project = impactMatchingProjects.find(p => p.id === pledge.projectId);
    const projTitle = project ? project.title : 'Proyek Komunitas';
    const sponsorName = project ? project.matchingSponsorName : 'Matching Partner';
    const contractAddr = project ? project.smartContractAddress : '0xCommunityMatch_' + Date.now().toString(36);
    const asnafTarget = project ? project.asnafCategory : 'FISABILILLAH';

    // 1. Record on-chain transaction
    const newTx = addNewTransaction({
      charityId: 'impact-match-' + (project?.id || 'gen'),
      charityName: `${projTitle} (Co-Financed 1:${project?.matchingRatio || 1} with ${sponsorName})`,
      donorName: pledge.donorName,
      amount: pledge.amount,
      type: (pledge.zakatType === 'ZAKAT_MAAL' 
        ? 'ZAKAT_MAAL' 
        : pledge.zakatType === 'WAKAF_TUNAI' 
        ? 'WAKAF_PRODUKTIF' 
        : pledge.zakatType === 'ZAKAT_FITRAH'
        ? 'ZAKAT_FITRAH'
        : 'INFAQ_SEDEKAH'),
      isAnonymous: pledge.isAnonymous,
      smartContract: contractAddr,
      status: 'CONFIRMED',
      asnafTarget: asnafTarget,
    });

    // 2. Update the project metrics
    setImpactMatchingProjects(prev => prev.map(p => {
      if (p.id === pledge.projectId) {
        const remainingPool = p.matchingPoolRemaining;
        const potentialMatch = Math.round(pledge.amount * p.matchingRatio);
        const actualMatch = Math.min(remainingPool, potentialMatch);

        return {
          ...p,
          communityCollectedAmount: p.communityCollectedAmount + pledge.amount,
          matchedAmount: p.matchedAmount + actualMatch,
          matchingPoolRemaining: Math.max(0, p.matchingPoolRemaining - actualMatch),
          coFinancierCount: p.coFinancierCount + 1,
          recentCoFinanciers: [
            {
              donorName: pledge.isAnonymous ? 'Hamba Allah' : pledge.donorName,
              donorAmount: pledge.amount,
              matchedContribution: actualMatch,
              timeAgo: 'Baru saja',
              isAnonymous: pledge.isAnonymous,
              txHash: newTx.txHash.substring(0, 10) + '...',
            },
            ...(p.recentCoFinanciers || []).slice(0, 5),
          ]
        };
      }
      return p;
    }));

    // 3. Dispatch in-app notification
    addNotification({
      title: 'Co-Financing Proyek Komunitas Sukses!',
      message: `Alhamdulillah! Donasi Rp ${pledge.amount.toLocaleString('id-ID')} Anda digandakan oleh ${sponsorName} (+Rp ${pledge.matchedAmount.toLocaleString('id-ID')}) menjadi Total Dampak Nyata Rp ${pledge.totalImpactAmount.toLocaleString('id-ID')} untuk "${projTitle}".`,
      type: 'BLOCKCHAIN_CONFIRM',
      linkTab: 'donations',
    });

    return newTx;
  };

  // Propose a new grassroots project for Community Impact Matching
  const proposeImpactMatchingProject = (
    projectData: Omit<ImpactMatchingProject, 'id' | 'communityCollectedAmount' | 'matchedAmount' | 'coFinancierCount' | 'smartContractAddress' | 'recentCoFinanciers' | 'isVerified'>
  ) => {
    const newProjId = 'match-proj-' + Date.now().toString(36);
    const newProject: ImpactMatchingProject = {
      ...projectData,
      id: newProjId,
      communityCollectedAmount: 0,
      matchedAmount: 0,
      coFinancierCount: 0,
      smartContractAddress: '0x' + generateSHA256Hash(newProjId).substring(0, 16).toUpperCase(),
      recentCoFinanciers: [],
      isVerified: true, // Auto-verified in prototype with standard amil audit
    };

    setImpactMatchingProjects(prev => [newProject, ...prev]);

    addNotification({
      title: 'Inisiatif Amal Komunitas Diterbitkan!',
      message: `Proyek "${newProject.title}" berhasil diajukan dengan Matching Grant "${newProject.matchingSponsorName}". Donatur lain kini dapat ikut co-financing.`,
      type: 'FORUM_REPLY',
      linkTab: 'donations',
    });
  };

  // Sponsor/Top-up matching grant pool
  const sponsorMatchingPool = (projectId: string, additionalPoolAmount: number, sponsorName: string) => {
    setImpactMatchingProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          matchingPoolTotal: p.matchingPoolTotal + additionalPoolAmount,
          matchingPoolRemaining: p.matchingPoolRemaining + additionalPoolAmount,
          matchingSponsorName: p.matchingSponsorName.includes(sponsorName) ? p.matchingSponsorName : `${p.matchingSponsorName} & ${sponsorName}`
        };
      }
      return p;
    }));

    addNotification({
      title: 'Matching Grant Sponsor Ditambahkan!',
      message: `Terima kasih! Komitmen dana matching sebesar Rp ${additionalPoolAmount.toLocaleString('id-ID')} telah dikunci di Smart Contract untuk melipatgandakan donasi umat.`,
      type: 'BLOCKCHAIN_CONFIRM',
      linkTab: 'donations',
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
        t,
        isOffline,
        setIsOffline,
        offlineQueue,
        triggerManualSync,
        blockchainTransactions,
        blockchainBlocks,
        campaigns,
        resources,
        forumThreads,
        masjids,
        goldPricePerGram,
        nisabMaalAmount,
        userProfile,
        updateUserProfile,
        is2FAModalOpen,
        setIs2FAModalOpen,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        selectedReceiptTx,
        setSelectedReceiptTx,
        selectedExplorerData,
        setSelectedExplorerData,
        recurringSchedules,
        addRecurringSchedule,
        toggleRecurringScheduleStatus,
        deleteRecurringSchedule,
        executeRecurringNow,
        addNewTransaction,
        addForumThread,
        addForumComment,
        toggleThreadUpvote,
        rsvpKajian,
        addMasjidReview,
        communityEvents,
        rsvpCommunityEvent,
        addCommunityEvent,
        notifications,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications,
        scheduledZakatSettings,
        updateScheduledZakatSettings,
        updateAnnualFinancialData,
        browserNotificationPermission,
        requestNotificationPermission,
        triggerZakatHaulCheck,
        annualZakatSummary,
        impactMatchingProjects,
        coFinanceProject,
        proposeImpactMatchingProject,
        sponsorMatchingPool,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
