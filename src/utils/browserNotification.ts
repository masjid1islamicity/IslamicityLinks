import { 
  AnnualFinancialData, 
  ScheduledZakatNotificationSettings, 
  AnnualZakatCalculationSummary,
  ZakatHaulReminderWindow
} from '../types';

export type BrowserNotificationPermission = 'default' | 'granted' | 'denied' | 'unsupported';

const ZAKAT_SCHEDULE_STORAGE_KEY = 'islamicity_zakat_scheduled_settings_v1';

export const DEFAULT_ANNUAL_FINANCIAL_DATA: AnnualFinancialData = {
  cashAndBank: 165000000,
  goldAndSilverValue: 35000000,
  stocksAndMutualFunds: 85000000,
  businessAssetsAndReceivables: 45000000,
  annualIncome: 180000000,
  annualExpenses: 72000000,
  shortTermDebts: 15000000,
  lastUpdated: new Date().toISOString().split('T')[0],
  notes: 'Portofolio aset likuid & investasi syariah tahun buku 2025/2026'
};

// Calculate default haul date: approximately 15 days from now for preview/testing
const getDefaultHaulDate = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 7); // 7 days from now (within reminder window)
  return d.toISOString().split('T')[0];
};

export const DEFAULT_SCHEDULED_ZAKAT_SETTINGS: ScheduledZakatNotificationSettings = {
  isEnabled: true,
  browserPushEnabled: true,
  haulDate: getDefaultHaulDate(),
  haulCycleType: 'HIJRI_RAMADHAN',
  reminderWindow: '7_DAYS_BEFORE',
  autoSyncWithNisab: true,
  notificationTime: '09:00',
  financialData: DEFAULT_ANNUAL_FINANCIAL_DATA
};

/**
 * Check if the browser supports the Notification API
 */
export function isBrowserNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current browser notification permission state
 */
export function getBrowserNotificationPermission(): BrowserNotificationPermission {
  if (!isBrowserNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission as BrowserNotificationPermission;
}

/**
 * Request notification permission from the user
 */
export async function requestBrowserNotificationPermission(): Promise<BrowserNotificationPermission> {
  if (!isBrowserNotificationSupported()) {
    return 'unsupported';
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission as BrowserNotificationPermission;
  } catch (err) {
    console.warn('Error requesting browser notification permission:', err);
    return Notification.permission as BrowserNotificationPermission;
  }
}

export interface BrowserPushOptions {
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
  onClickUrl?: string;
  onClickCallback?: () => void;
}

/**
 * Dispatch a native Browser Push Notification
 */
export function dispatchBrowserPushNotification(
  title: string, 
  options: BrowserPushOptions
): Notification | null {
  if (!isBrowserNotificationSupported()) {
    console.info('Browser Notification API not supported in this environment');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.info('Browser Notification permission is not granted (current: ' + Notification.permission + ')');
    return null;
  }

  try {
    const defaultIcon = 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?w=128&auto=format&fit=crop&q=80';
    
    const notification = new Notification(title, {
      body: options.body,
      icon: options.icon || defaultIcon,
      badge: options.badge || defaultIcon,
      tag: options.tag || 'islamicity-zakat-alert',
      data: options.data,
      requireInteraction: options.requireInteraction ?? true,
      silent: options.silent ?? false,
    });

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      if (options.onClickCallback) {
        options.onClickCallback();
      }
      notification.close();
    };

    return notification;
  } catch (error) {
    console.warn('Failed to dispatch native browser notification:', error);
    return null;
  }
}

/**
 * Compute the Annual Zakat summary from annual financial data
 */
export function computeAnnualZakatSummary(
  financial: AnnualFinancialData,
  nisabMaalAmount: number,
  haulDateStr: string,
  reminderWindow: ZakatHaulReminderWindow
): AnnualZakatCalculationSummary {
  // Gross wealth from liquid assets
  const grossWealth = 
    (financial.cashAndBank || 0) + 
    (financial.goldAndSilverValue || 0) + 
    (financial.stocksAndMutualFunds || 0) + 
    (financial.businessAssetsAndReceivables || 0);

  // Short term deductible obligations
  const totalDeductions = financial.shortTermDebts || 0;

  // Net zakatable wealth
  const netZakatableWealth = Math.max(0, grossWealth - totalDeductions);

  const meetsNisab = netZakatableWealth >= nisabMaalAmount;
  const surplusAboveNisab = Math.max(0, netZakatableWealth - nisabMaalAmount);
  const nisabCoveragePercentage = Math.round((netZakatableWealth / (nisabMaalAmount || 1)) * 100);
  const estimatedZakatPayable = meetsNisab ? Math.round(netZakatableWealth * 0.025) : 0;

  // Calculate days remaining to haul date
  let daysUntilHaul = 0;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetHaul = new Date(haulDateStr);
    targetHaul.setHours(0, 0, 0, 0);
    const diffTime = targetHaul.getTime() - today.getTime();
    daysUntilHaul = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (e) {
    daysUntilHaul = 0;
  }

  // Determine reminder window threshold days
  let reminderThresholdDays = 0;
  switch (reminderWindow) {
    case 'ON_HAUL': reminderThresholdDays = 0; break;
    case '7_DAYS_BEFORE': reminderThresholdDays = 7; break;
    case '14_DAYS_BEFORE': reminderThresholdDays = 14; break;
    case '30_DAYS_BEFORE': reminderThresholdDays = 30; break;
    case 'QUARTERLY': reminderThresholdDays = 90; break;
  }

  let haulStatus: 'DUE_NOW' | 'UPCOMING' | 'REMINDER_ACTIVE' | 'NOT_MET' = 'UPCOMING';

  if (!meetsNisab) {
    haulStatus = 'NOT_MET';
  } else if (daysUntilHaul <= 0) {
    haulStatus = 'DUE_NOW';
  } else if (daysUntilHaul <= reminderThresholdDays) {
    haulStatus = 'REMINDER_ACTIVE';
  } else {
    haulStatus = 'UPCOMING';
  }

  let recommendationNote = '';
  if (!meetsNisab) {
    recommendationNote = `Total aset bersih Anda (Rp ${netZakatableWealth.toLocaleString('id-ID')}) belum mencapai batas nisab (Rp ${nisabMaalAmount.toLocaleString('id-ID')}). Anda dianjurkan memperbanyak infaq dan sedekah sukarela.`;
  } else if (daysUntilHaul <= 0) {
    recommendationNote = `Haul tahunan telah jatuh tempo! Kewajiban Zakat Maal Anda adalah Rp ${estimatedZakatPayable.toLocaleString('id-ID')} (2,5%). Segera tunaikan kepada mustahik melalui amil resmi.`;
  } else if (daysUntilHaul <= reminderThresholdDays) {
    recommendationNote = `Peringatan Haul: Tersisa ${daysUntilHaul} hari menuju haul tahunan Anda (${haulDateStr}). Estimasi zakat terhitung Rp ${estimatedZakatPayable.toLocaleString('id-ID')}.`;
  } else {
    recommendationNote = `Aset telah memenuhi nisab (${nisabCoveragePercentage}% dari nisab). Haul tahunan berikutnya jatuh pada ${haulDateStr} (${daysUntilHaul} hari lagi).`;
  }

  return {
    grossWealth,
    totalDeductions,
    netZakatableWealth,
    nisabThreshold: nisabMaalAmount,
    meetsNisab,
    surplusAboveNisab,
    nisabCoveragePercentage,
    estimatedZakatPayable,
    daysUntilHaul,
    haulStatus,
    recommendationNote
  };
}

/**
 * Storage helpers for Scheduled Zakat Settings
 */
export const ZakatScheduleStorage = {
  getSettings(): ScheduledZakatNotificationSettings {
    if (typeof window === 'undefined') return DEFAULT_SCHEDULED_ZAKAT_SETTINGS;
    try {
      const data = localStorage.getItem(ZAKAT_SCHEDULE_STORAGE_KEY);
      if (!data) return DEFAULT_SCHEDULED_ZAKAT_SETTINGS;
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_SCHEDULED_ZAKAT_SETTINGS,
        ...parsed,
        financialData: {
          ...DEFAULT_ANNUAL_FINANCIAL_DATA,
          ...(parsed.financialData || {})
        }
      };
    } catch (e) {
      console.warn('Failed to parse zakat schedule settings from localStorage:', e);
      return DEFAULT_SCHEDULED_ZAKAT_SETTINGS;
    }
  },

  saveSettings(settings: ScheduledZakatNotificationSettings): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ZAKAT_SCHEDULE_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save zakat schedule settings to localStorage:', e);
    }
  }
};
