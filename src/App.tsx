import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { PrayerTimeBar } from './components/PrayerTimeBar';
import { DashboardTab } from './components/tabs/DashboardTab';
import { ZakatBlockchainTab } from './components/tabs/ZakatBlockchainTab';
import { DonationTab } from './components/tabs/DonationTab';
import { LynkResourceHubTab } from './components/tabs/LynkResourceHubTab';
import { ForumCommunityTab } from './components/tabs/ForumCommunityTab';
import { MasjidFinderTab } from './components/tabs/MasjidFinderTab';
import { AnalyticsAuditTab } from './components/tabs/AnalyticsAuditTab';
import { HajjUmrahTab } from './components/tabs/HajjUmrahTab';
import { IslamicityTalksTab } from './components/tabs/IslamicityTalksTab';
import { BlockchainExplorerModal } from './components/BlockchainExplorerModal';
import { DonationReceiptModal } from './components/DonationReceiptModal';
import { Security2FAModal } from './components/Security2FAModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { IslamicityLogo } from './components/IslamicityLogo';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Coins, 
  BookOpen, 
  MessageSquare, 
  Compass, 
  Layers, 
  BarChart3,
  ExternalLink
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  return (
    <div className="min-h-screen bg-[#F4F6F4] dark:bg-[#121412] text-[#141A14] dark:text-[#E4E8E4] flex flex-col justify-between font-sans transition-colors">
      
      {/* Top Fixed Area */}
      <div>
        <Navbar />
        <PrayerTimeBar />

        {/* Main Body Dynamic Tab View */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'zakat-blockchain' && <ZakatBlockchainTab />}
          {activeTab === 'donations' && <DonationTab />}
          {activeTab === 'islamicity-talks' && <IslamicityTalksTab />}
          {activeTab === 'hajj-umrah' && <HajjUmrahTab />}
          {activeTab === 'lynk-hub' && <LynkResourceHubTab />}
          {activeTab === 'forum' && <ForumCommunityTab />}
          {activeTab === 'masjid-finder' && <MasjidFinderTab />}
          {activeTab === 'analytics-audit' && <AnalyticsAuditTab />}
        </main>
      </div>

      {/* Global Modals, Drawers & Indicators */}
      <BlockchainExplorerModal />
      <DonationReceiptModal />
      <Security2FAModal />
      <AiAssistantDrawer />
      <OfflineIndicator />

      {/* Footer */}
      <footer className="mt-16 bg-white dark:bg-[#1A1D1A] border-t border-[#D8DFD8] dark:border-[#2D332D] text-xs text-[#5A665B] dark:text-[#A0A8A0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Col */}
            <div className="space-y-3 md:col-span-2">
              <IslamicityLogo 
                variant="full" 
                size="md" 
                showSubtitle={false} 
                showLynkBadge={true} 
              />
              <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed max-w-md">
                Infrastruktur Cerdas Terdesentralisasi Penghubung Komunitas Muslim Global. Menggabungkan transparansi Zakat Blockchain L2, kolaborasi kreator Lynk.id, forum silaturahmi E2EE, dan radar kegiatan masjid.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2E7D32]/10 dark:bg-[#2E7D32]/20 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-[10px] border border-[#2E7D32]/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Audit Syariah BAZNAS RI & DSN-MUI</span>
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#141A14] dark:text-[#E4E8E4] text-xs uppercase tracking-wider">
                Modul Utama
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setActiveTab('zakat-blockchain')} className="hover:text-[#2E7D32] dark:hover:text-[#4CAF50] transition-colors">
                    Kalkulator Zakat & Nisab Emas
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('donations')} className="hover:text-[#2E7D32] dark:hover:text-[#4CAF50] transition-colors">
                    Penyaluran Infaq Lembaga Resmi
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('islamicity-talks')} className="hover:text-[#2E7D32] dark:hover:text-[#4CAF50] transition-colors">
                    IslamicityTalks & Pusat Dakwah TV
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('hajj-umrah')} className="hover:text-[#2E7D32] dark:hover:text-[#4CAF50] transition-colors">
                    Panduan & Tabungan Haji Umrah
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('lynk-hub')} className="hover:text-[#2E7D32] dark:hover:text-[#4CAF50] transition-colors">
                    Lynk.id Kreator & Modul Digital
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('masjid-finder')} className="hover:text-[#2E7D32] dark:hover:text-[#4CAF50] transition-colors">
                    Jadwal Salat & Radar Masjid GPS
                  </button>
                </li>
              </ul>
            </div>

            {/* Compliance & Security */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#141A14] dark:text-[#E4E8E4] text-xs uppercase tracking-wider">
                Regulasi & Keamanan
              </h4>
              <ul className="space-y-1.5 text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                <li>UU RI No. 23 Tahun 2011 (Pengelolaan Zakat)</li>
                <li>PP No. 60 Tahun 2010 (Zakat Pengurang Pajak)</li>
                <li>Fatwa DSN-MUI No. 116/DSN-MUI/IX/2017</li>
                <li>Enkripsi Klien End-to-End (E2EE)</li>
                <li>Zero Gas-Fee Sharia Blockchain L2</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#D8DFD8] dark:border-[#2D332D] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
            <p>© {new Date().getFullYear()} IslamicityLink x Lynk.id. Hak Cipta Dilindungi Undang-Undang.</p>
            <p className="font-mono text-[10px] text-[#2E7D32] dark:text-[#4CAF50]">L2 Block Height #{148293} • Status Konsensus Aktif</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
