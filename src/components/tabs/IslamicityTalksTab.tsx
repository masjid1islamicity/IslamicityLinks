import React, { useState, useRef } from 'react';
import { TalksHeroBanner } from '../talks/TalksHeroBanner';
import { LiveWebinarStreamCard } from '../talks/LiveWebinarStreamCard';
import { TalksScheduleGrid } from '../talks/TalksScheduleGrid';
import { CuratedPlaylistsSection } from '../talks/CuratedPlaylistsSection';
import { DakwahMateriReader } from '../talks/DakwahMateriReader';
import { TanyaJawabKonsultasi } from '../talks/TanyaJawabKonsultasi';
import { DakwahCharityBanner } from '../talks/DakwahCharityBanner';
import { LuckyWheelBerkahModal } from '../talks/LuckyWheelBerkahModal';
import { 
  INITIAL_TALK_SESSIONS, 
  INITIAL_DAKWAH_ARTICLES, 
  INITIAL_TANYA_JAWAB 
} from '../../data/talksData';
import { TalkSession } from '../../types';
import { useApp } from '../../context/AppContext';

export const IslamicityTalksTab: React.FC = () => {
  const { setActiveTab } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'webinars' | 'playlists' | 'materi' | 'konsultasi' | 'amal'>('webinars');
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState<boolean>(false);
  const [sessions, setSessions] = useState<TalkSession[]>(INITIAL_TALK_SESSIONS);
  const [currentSelectedSession, setCurrentSelectedSession] = useState<TalkSession>(INITIAL_TALK_SESSIONS[0]);
  
  const liveSectionRef = useRef<HTMLDivElement>(null);
  const charitySectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToLive = () => {
    setActiveSubTab('webinars');
    setTimeout(() => {
      liveSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleScrollToCharity = () => {
    setActiveSubTab('amal');
    setTimeout(() => {
      charitySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSelectSession = (session: TalkSession) => {
    setCurrentSelectedSession(session);
    handleScrollToLive();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Hero Banner */}
      <TalksHeroBanner
        onOpenLuckyWheel={() => setIsLuckyWheelOpen(true)}
        onScrollToLive={handleScrollToLive}
        onTabChange={(tab) => setActiveSubTab(tab)}
        activeSubTab={activeSubTab}
      />

      {/* 2. Sub-Tab Dynamic Content */}
      {activeSubTab === 'webinars' && (
        <div className="space-y-8">
          {/* Main Featured / Live Session */}
          <div ref={liveSectionRef}>
            <LiveWebinarStreamCard
              session={currentSelectedSession}
              onInfaqClick={handleScrollToCharity}
            />
          </div>

          {/* Schedule & Catalog Grid */}
          <TalksScheduleGrid
            sessions={sessions}
            onSelectSession={handleSelectSession}
            onInfaqClick={handleScrollToCharity}
          />
        </div>
      )}

      {activeSubTab === 'playlists' && (
        <CuratedPlaylistsSection
          onScrollToLive={handleScrollToLive}
        />
      )}

      {activeSubTab === 'materi' && (
        <DakwahMateriReader
          articles={INITIAL_DAKWAH_ARTICLES}
        />
      )}

      {activeSubTab === 'konsultasi' && (
        <TanyaJawabKonsultasi
          items={INITIAL_TANYA_JAWAB}
        />
      )}

      {activeSubTab === 'amal' && (
        <div ref={charitySectionRef} className="space-y-8">
          <DakwahCharityBanner />
          
          {/* Also show webinars schedule as support */}
          <TalksScheduleGrid
            sessions={sessions}
            onSelectSession={handleSelectSession}
            onInfaqClick={handleScrollToCharity}
          />
        </div>
      )}

      {/* Bottom Sticky Promotion Bar for Lucky Wheel */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎁</span>
          <div>
            <div className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
              Program Hadiah Berkah Dakwah Islamicity
            </div>
            <div className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
              Dapatkan voucher potongan paket Umrah & Haji hingga Rp 5.000.000 untuk jamaah setia.
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsLuckyWheelOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs shadow-md transition-transform hover:scale-105 shrink-0"
        >
          Putar Roda Berkah Sekarang
        </button>
      </div>

      {/* Lucky Wheel Modal */}
      <LuckyWheelBerkahModal
        isOpen={isLuckyWheelOpen}
        onClose={() => setIsLuckyWheelOpen(false)}
        onNavigateToHajj={() => setActiveTab('hajj-umrah')}
      />

    </div>
  );
};
