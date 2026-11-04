import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  CheckCircle2, 
  Bell, 
  Download, 
  Radio, 
  Search, 
  Filter, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { TalkSession } from '../../types';
import { useApp } from '../../context/AppContext';

interface TalksScheduleGridProps {
  sessions: TalkSession[];
  onSelectSession: (session: TalkSession) => void;
  onInfaqClick: () => void;
}

export const TalksScheduleGrid: React.FC<TalksScheduleGridProps> = ({
  sessions,
  onSelectSession,
  onInfaqClick
}) => {
  const { addNotification } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'UPCOMING' | 'RECORDED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rsvpSuccessMap, setRsvpSuccessMap] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'ALL', label: 'Semua Topik' },
    { id: 'FIQIH_MUAMALAH', label: 'Fiqih & Fintech' },
    { id: 'HAJJ_PREP', label: 'Haji & Umrah Mabrur' },
    { id: 'FAMILY', label: 'Parenting & Keluarga' },
    { id: 'ZAKAT_EKONOMI', label: 'Zakat & Filantropi' }
  ];

  const filteredSessions = sessions.filter(session => {
    // Exclude the live session if viewing schedule list, or include based on filter
    if (session.status === 'LIVE' && selectedStatus !== 'ALL') return false;
    if (selectedCategory !== 'ALL' && session.category !== selectedCategory) return false;
    if (selectedStatus !== 'ALL' && session.status !== selectedStatus) return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = session.title.toLowerCase().includes(q);
      const matchSpeaker = session.speaker.name.toLowerCase().includes(q);
      const matchDesc = session.description.toLowerCase().includes(q);
      if (!matchTitle && !matchSpeaker && !matchDesc) return false;
    }
    return true;
  });

  const handleRSVP = (session: TalkSession) => {
    setRsvpSuccessMap(prev => ({ ...prev, [session.id]: true }));
    addNotification({
      title: 'Pendaftaran Webinar Berhasil',
      message: `Anda telah terdaftar pada sesi "${session.title}". Tautan pengingat dikirim ke aplikasi.`,
      type: 'VERIFICATION'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Section Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#141A14] dark:text-[#E4E8E4] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Jadwal Webinar, Pelatihan, & Arsip Kajian</span>
          </h3>
          <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] mt-0.5">
            Daftarkan diri Anda pada webinar mendatang atau tonton ulang rekaman kajian berkualitas tinggi.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A8A0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tema atau nama ustadz..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1.5 shrink-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'bg-white dark:bg-[#1A1D1A] text-[#5A665B] dark:text-[#A0A8A0] border border-[#D8DFD8] dark:border-[#2D332D] hover:bg-[#EEF3EE]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Toggle (Upcoming vs Recorded) */}
        <div className="flex items-center gap-1 bg-[#EEF3EE] dark:bg-[#242924] p-1 rounded-xl shrink-0">
          <button
            onClick={() => setSelectedStatus('ALL')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
              selectedStatus === 'ALL'
                ? 'bg-white dark:bg-[#1A1D1A] text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-[#5A665B] dark:text-[#A0A8A0]'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setSelectedStatus('UPCOMING')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
              selectedStatus === 'UPCOMING'
                ? 'bg-white dark:bg-[#1A1D1A] text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-[#5A665B] dark:text-[#A0A8A0]'
            }`}
          >
            Akan Datang
          </button>
          <button
            onClick={() => setSelectedStatus('RECORDED')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
              selectedStatus === 'RECORDED'
                ? 'bg-white dark:bg-[#1A1D1A] text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-[#5A665B] dark:text-[#A0A8A0]'
            }`}
          >
            Rekaman HD
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSessions.map((session) => {
          const isRsvpDone = rsvpSuccessMap[session.id] || session.isUserRegistered;
          const isUpcoming = session.status === 'UPCOMING';
          const isLive = session.status === 'LIVE';

          return (
            <div
              key={session.id}
              className="bg-white dark:bg-[#1A1D1A] rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Cover Image & Badges */}
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-black">
                  <img
                    src={session.coverImage}
                    alt={session.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {isLive && (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px] uppercase flex items-center gap-1 animate-pulse shadow-md">
                        <Radio className="w-3 h-3" />
                        <span>LIVE</span>
                      </span>
                    )}
                    {isUpcoming && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] uppercase shadow-md flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>AKAN DATANG</span>
                      </span>
                    )}
                    {session.status === 'RECORDED' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] uppercase shadow-md flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        <span>REKAMAN HD</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-emerald-300 border border-white/10">
                    {session.categoryLabel}
                  </div>

                  {/* Date & Time Lower Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{session.date} • {session.time}</span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <h4 className="font-bold text-sm text-[#141A14] dark:text-[#E4E8E4] leading-snug line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {session.title}
                  </h4>

                  <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] line-clamp-2 leading-relaxed">
                    {session.description}
                  </p>

                  {/* Speaker Info Card */}
                  <div className="p-2.5 rounded-2xl bg-[#F8FAF8] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] flex items-center gap-2.5">
                    <img
                      src={session.speaker.avatar}
                      alt={session.speaker.name}
                      className="w-9 h-9 rounded-xl object-cover border border-emerald-500 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-[#141A14] dark:text-[#E4E8E4] truncate">
                          {session.speaker.name}
                        </span>
                        <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                      </div>
                      <div className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] truncate">
                        {session.speaker.role}
                      </div>
                    </div>
                  </div>

                  {/* Metrics Footer */}
                  <div className="flex items-center justify-between text-[11px] text-[#5A665B] dark:text-[#A0A8A0] pt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{session.registeredCount.toLocaleString('id-ID')} Terdaftar</span>
                    </span>
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md font-semibold">
                      Gratis + Sertifikat
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0">
                {isLive ? (
                  <button
                    onClick={() => onSelectSession(session)}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                  >
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>Masuk Siaran Live Sekarang</span>
                  </button>
                ) : isUpcoming ? (
                  <button
                    onClick={() => handleRSVP(session)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isRsvpDone
                        ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                    }`}
                  >
                    {isRsvpDone ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Sudah Terdaftar (Notifikasi Aktif)</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        <span>Daftar Hadir Gratis (RSVP)</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectSession(session)}
                    className="w-full py-2.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-emerald-600 hover:text-white text-[#141A14] dark:text-[#E4E8E4] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Tonton Rekaman Kajian (HD)</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
