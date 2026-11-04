import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Moon, 
  Sun, 
  Bell, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  Search, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  Layers,
  HeartHandshake,
  Coins,
  BookOpen,
  MessageSquare,
  Compass,
  BarChart3,
  Plane,
  Tv,
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language, TabType } from '../types';
import { IslamicityLogo } from './IslamicityLogo';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    language, 
    setLanguage, 
    theme, 
    toggleTheme, 
    t, 
    isOffline, 
    setIsOffline,
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications,
    setIs2FAModalOpen,
    setIsAiDrawerOpen,
    searchQuery,
    setSearchQuery,
    userProfile,
    browserNotificationPermission,
    requestNotificationPermission
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'su', label: 'Basa Sunda', flag: '🇮🇩' },
    { code: 'jv', label: 'Basa Jawa', flag: '🇮🇩' },
    { code: 'ms', label: 'Bahasa Melayu', flag: '🇲🇾' },
  ];

  const navItems: { id: TabType; label: string; icon: any; isFeatured?: boolean }[] = [
    { id: 'dashboard', label: t('nav_dashboard'), icon: Layers },
    { id: 'islamicity-talks', label: 'IslamicityTalks', icon: Radio, isFeatured: true },
    { id: 'zakat-blockchain', label: t('nav_zakat'), icon: Coins },
    { id: 'donations', label: t('nav_donations'), icon: HeartHandshake },
    { id: 'hajj-umrah', label: t('nav_hajj_umrah'), icon: Plane },
    { id: 'lynk-hub', label: t('nav_lynk_hub'), icon: BookOpen },
    { id: 'forum', label: t('nav_forum'), icon: MessageSquare },
    { id: 'masjid-finder', label: t('nav_masjid'), icon: Compass },
    { id: 'analytics-audit', label: t('nav_analytics'), icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#1A1D1A]/95 backdrop-blur-md border-b border-[#D8DFD8] dark:border-[#2D332D] transition-colors">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Lynk.id badge */}
          <div className="flex items-center gap-3">
            <button 
              id="btn-navbar-brand-logo"
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none transition-transform hover:scale-[1.01]"
            >
              <IslamicityLogo 
                variant="full" 
                size="md" 
                showSubtitle={true}
                showLynkBadge={true} 
              />
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A8A0]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] placeholder:text-[#A0A8A0] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/50"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Tools */}
          <div className="flex items-center gap-2">
            {/* Offline Simulation Toggle */}
            <button
              onClick={() => setIsOffline(!isOffline)}
              title={isOffline ? "Klik untuk mensimulasikan Online" : "Klik untuk mensimulasikan Offline"}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                isOffline 
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700' 
                  : 'bg-[#2E7D32]/10 dark:bg-[#2E7D32]/20 text-[#2E7D32] dark:text-[#4CAF50] border-[#2E7D32]/30'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('offline_badge')}</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-[#4CAF50] animate-pulse" />
                  <span className="hidden lg:inline">{t('online_badge')}</span>
                  <span className="lg:hidden">Online</span>
                </>
              )}
            </button>

            {/* AI Assistant Trigger Button */}
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/30 hover:bg-[#256629] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span className="hidden sm:inline">{t('ai_assistant')}</span>
            </button>

            {/* 2FA Security Status */}
            <button
              onClick={() => setIs2FAModalOpen(true)}
              title={t('two_factor_title')}
              className={`p-2 rounded-full border transition-colors ${
                userProfile.is2FAEnabled
                  ? 'bg-[#2E7D32]/10 dark:bg-[#2E7D32]/20 border-[#2E7D32]/30 text-[#2E7D32] dark:text-[#4CAF50]'
                  : 'bg-[#EEF3EE] dark:bg-[#242924] border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Push Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-full bg-[#EEF3EE] dark:bg-[#242924] text-[#141A14] dark:text-[#E4E8E4] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#2E7D32] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#1A1D1A]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-[#D8DFD8] dark:border-[#2D332D]">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
                      <span className="text-sm font-bold text-[#141A14] dark:text-[#E4E8E4]">
                        Pemberitahuan Terkini
                      </span>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-[#A0A8A0] hover:text-[#2E7D32] dark:hover:text-[#4CAF50]"
                      >
                        Bersihkan Semua
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[#D8DFD8] dark:divide-[#2D332D] py-1">
                    {/* Browser Push Permission Alert in Popover */}
                    {browserNotificationPermission !== 'granted' && (
                      <div className="p-2.5 mb-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Bell className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                          <span className="text-[11px] leading-tight">
                            Aktifkan notifikasi browser untuk pengingat Zakat tahunan otomatis.
                          </span>
                        </div>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await requestNotificationPermission();
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold shrink-0"
                        >
                          Izinkan
                        </button>
                      </div>
                    )}

                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-xs text-[#A0A8A0]">
                        Belum ada notifikasi baru.
                      </p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.linkTab) setActiveTab(n.linkTab);
                            setIsNotifOpen(false);
                          }}
                          className={`py-2.5 px-2.5 rounded-xl cursor-pointer transition-colors ${
                            n.type === 'ZAKAT_REMINDER'
                              ? 'bg-[#2E7D32]/15 dark:bg-[#2E7D32]/25 border border-[#2E7D32]/30 hover:bg-[#2E7D32]/20'
                              : n.read 
                              ? 'opacity-70 hover:bg-[#EEF3EE] dark:hover:bg-[#242924]/60' 
                              : 'bg-[#2E7D32]/10 dark:bg-[#2E7D32]/20 hover:bg-[#2E7D32]/15 dark:hover:bg-[#2E7D32]/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              {n.type === 'ZAKAT_REMINDER' && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#2E7D32] text-white">
                                  ZAKAT
                                </span>
                              )}
                              <span className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                                {n.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#A0A8A0] shrink-0">
                              {n.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] mt-1 leading-relaxed">
                            {n.message}
                          </p>
                          {n.type === 'ZAKAT_REMINDER' && (
                            <span className="text-[10px] text-[#2E7D32] dark:text-[#4CAF50] font-bold mt-1.5 flex items-center gap-1">
                              Buka Kalkulator Zakat & Rincian Aset →
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#EEF3EE] dark:bg-[#242924] text-[#141A14] dark:text-[#E4E8E4] text-xs font-semibold hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] transition-colors"
              >
                <span>{languagesList.find(l => l.code === language)?.flag}</span>
                <span className="hidden sm:inline uppercase text-[11px] font-bold">{language}</span>
                <ChevronDown className="w-3 h-3 text-[#A0A8A0]" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] shadow-xl py-1.5 z-50 animate-in fade-in">
                  {languagesList.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                        language === lang.code
                          ? 'bg-[#2E7D32]/10 dark:bg-[#2E7D32]/25 text-[#2E7D32] dark:text-[#4CAF50] font-bold'
                          : 'text-[#141A14] dark:text-[#E4E8E4] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {language === lang.code && <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[#EEF3EE] dark:bg-[#242924] text-[#141A14] dark:text-[#E4E8E4] hover:bg-[#E2E8E2] dark:hover:bg-[#2D332D] transition-colors"
              title={theme === 'dark' ? t('light_mode') : t('dark_mode')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#5A665B]" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 border-t border-[#D8DFD8] dark:border-[#2D332D]">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/25 font-bold'
                    : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#A0A8A0]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
