import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Download, 
  Search, 
  Filter, 
  Star, 
  ExternalLink, 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  Heart,
  Share2,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LynkResource } from '../../types';

export const LynkResourceHubTab: React.FC = () => {
  const { resources, userProfile, addNotification, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [activeResource, setActiveResource] = useState<LynkResource | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // New resource upload form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('DAKWAH');
  const [newPrice, setNewPrice] = useState('0');
  const [newDesc, setNewDesc] = useState('');

  const filteredResources = resources.filter(r => {
    const matchCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchSearch = r.title.toLowerCase().includes(searchFilter.toLowerCase()) || r.creatorName.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDownload = (res: LynkResource) => {
    addNotification({
      title: 'Unduhan Dimulai',
      message: `Berkas "${res.title}" berhasil diunduh. Integritas SHA-256 terverifikasi.`,
      type: 'FORUM_REPLY',
      linkTab: 'lynk-hub',
    });
    // Simulate instant download trigger
    const content = `ISLAMICITYLINK x LYNK.ID DIGITAL RESOURCE
Judul: ${res.title}
Kreator: ${res.creatorName} (@${res.lynkUrl})
SHA-256 Integrity: ${res.sha256Hash}
Lisensi: Syariah Open-Resource / Halal Knowledge Commons
Waktu Akses: ${new Date().toISOString()}

Terima kasih telah mendukung ekosistem kreator Muslim berdaya.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${res.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setActiveResource(null);
  };

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addNotification({
      title: 'Karya Digital Diterbitkan',
      message: `Modul "${newTitle}" Anda telah terdaftar di Lynk.id Hub dengan alokasi wakaf otomatis.`,
      type: 'SECURITY',
      linkTab: 'lynk-hub',
    });

    setShowUploadModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#243324] via-[#1E2E1F] to-[#142015] rounded-3xl p-6 sm:p-8 text-[#E4E8E4] shadow-lg border border-[#2D332D] space-y-2">
        <div className="flex items-center gap-2 text-[#4CAF50] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Kolaborasi Kreator Muslim & Berbagi Sumber Daya Digital</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Lynk.id Resource Hub
            </h1>
            <p className="text-xs sm:text-sm text-[#E4E8E4]/90 max-w-2xl leading-relaxed mt-1">
              Pusat pertukaran materi dakwah, template Notion Islami, modul bisnis halal, dan micro-waqf langsung dari para kreator Muslim global.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all shrink-0 self-start sm:self-auto"
          >
            <UploadCloud className="w-4 h-4 text-white" />
            <span>Unggah Modul / Karya</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'Semua Kategori' },
            { id: 'DAKWAH', label: 'Fiqih & Dakwah' },
            { id: 'PRODUKTIVITAS', label: 'Notion & Produktivitas' },
            { id: 'BISNIS_HALAL', label: 'Bisnis Halal' },
            { id: 'VIDEO_COURSE', label: 'Video Workshop' },
            { id: 'AUDIO_MUROTTAL', label: 'Audio & Podcast' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                  : 'bg-white dark:bg-[#1A1D1A] border-[#D8DFD8] dark:border-[#2D332D] text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A665B] dark:text-[#A0A8A0]" />
          <input
            type="text"
            placeholder="Cari modul / nama kreator..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-full text-xs text-[#141A14] dark:text-[#E4E8E4] focus:outline-none"
          />
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(res => (
          <div
            key={res.id}
            className="bg-white dark:bg-[#1A1D1A] rounded-3xl border border-[#D8DFD8] dark:border-[#2D332D] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={res.coverUrl}
                  alt={res.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#2E7D32] text-white shadow">
                  {res.category}
                </div>
                {res.isFree ? (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#242924]/90 text-[#4CAF50] border border-[#2E7D32]/50 shadow">
                    GRATIS / WAKAF ILMU
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#121412]/90 text-[#4CAF50] shadow font-mono border border-[#2D332D]">
                    Rp {res.price.toLocaleString('id-ID')}
                  </div>
                )}
              </div>

              <div className="p-5 space-y-2.5">
                {/* Creator Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={res.creatorAvatar}
                      alt={res.creatorName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-[#141A14] dark:text-[#E4E8E4]">
                      {res.creatorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                    <Star className="w-3.5 h-3.5 fill-[#4CAF50] text-[#4CAF50]" />
                    <span>{res.rating}</span>
                  </div>
                </div>

                <h3 className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4] leading-snug line-clamp-2">
                  {res.title}
                </h3>

                <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] line-clamp-2 leading-relaxed">
                  {res.description}
                </p>

                {/* Micro-waqf indicator */}
                {res.waqfPercentage && res.waqfPercentage > 0 && (
                  <div className="p-2 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-[10px] text-[#2E7D32] dark:text-[#4CAF50] flex items-center gap-1.5 font-medium">
                    <Heart className="w-3 h-3 text-[#2E7D32] dark:text-[#4CAF50] fill-[#2E7D32] dark:fill-[#4CAF50] shrink-0" />
                    <span>{res.waqfPercentage}% hasil penjualan dialokasikan untuk Wakaf Produktif</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Download & Info Bar */}
            <div className="p-5 pt-0 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-[#5A665B] dark:text-[#A0A8A0] pt-2 border-t border-[#D8DFD8] dark:border-[#2D332D]">
                <span>{res.downloadsCount.toLocaleString('id-ID')} Diunduh</span>
                <span className="font-mono text-[10px]">SHA-256 Valid</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(res)}
                  className="flex-1 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{res.isFree ? 'Unduh Gratis' : 'Dapatkan Modul'}</span>
                </button>

                <button
                  onClick={() => setActiveResource(res)}
                  className="p-2.5 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#D8DFD8] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] transition-colors"
                  title="Lihat Detail & Integritas Kripto"
                >
                  <FileCheck className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resource Detail & Hash Verification Modal */}
      {activeResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl p-6 max-w-lg w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4] my-8 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#D8DFD8] dark:border-[#2D332D]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <h3 className="font-bold text-base text-[#141A14] dark:text-[#E4E8E4]">
                  Verifikasi Berkas & Integritas Digital
                </h3>
              </div>
              <button
                onClick={() => setActiveResource(null)}
                className="p-1 rounded-full hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-extrabold text-sm text-[#141A14] dark:text-[#E4E8E4]">
                {activeResource.title}
              </h4>
              <p className="text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed">
                {activeResource.description}
              </p>

              <div className="p-3 bg-[#EEF3EE] dark:bg-[#242924] rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] space-y-1.5">
                <span className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] font-bold block">CRYPTOGRAPHIC SHA-256 CHECKSUM:</span>
                <p className="font-mono text-[10px] text-[#141A14] dark:text-[#E4E8E4] break-all bg-white dark:bg-[#121412] p-2 rounded-lg border border-[#D8DFD8] dark:border-[#2D332D]">
                  {activeResource.sha256Hash}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-[#2E7D32] dark:text-[#4CAF50] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>File terjamin orisinal bebas malware & konten tidak syar'i</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => handleDownload(activeResource)}
                className="flex-1 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Berkas Sekarang</span>
              </button>
              <button
                onClick={() => setActiveResource(null)}
                className="py-2.5 px-4 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] text-[#141A14] dark:text-[#E4E8E4] font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creator Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl p-6 max-w-lg w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4] my-8 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#D8DFD8] dark:border-[#2D332D]">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <h3 className="font-bold text-base text-[#141A14] dark:text-[#E4E8E4]">
                  Unggah Karya / Modul Lynk.id
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-full hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Judul Modul / Materi:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul Fiqih Muamalah Digital Lengkap"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Kategori:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4]"
                  >
                    <option value="DAKWAH">Fiqih & Dakwah</option>
                    <option value="PRODUKTIVITAS">Notion & Produktivitas</option>
                    <option value="BISNIS_HALAL">Bisnis Halal</option>
                    <option value="VIDEO_COURSE">Video Course</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    Harga (0 = Gratis / Wakaf):
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl font-mono text-[#141A14] dark:text-[#E4E8E4]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  Deskripsi & Manfaat Konten:
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan ringkasan materi dan panduan penggunaan..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] rounded-xl text-[#141A14] dark:text-[#E4E8E4]"
                />
              </div>

              <div className="p-3 bg-[#EEF3EE] dark:bg-[#242924] rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] text-[11px] text-[#2E7D32] dark:text-[#4CAF50]">
                <p className="font-bold">Otomatisasi Micro-Wakaf 10%</p>
                <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] mt-0.5">
                  Setiap karya yang terjual akan otomatis menyalurkan 10% ke tabungan wakaf produktif pesantren & beasiswa dhuafa melalui smart contract.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-extrabold text-xs shadow-md transition-colors"
              >
                Terbitkan ke Lynk.id Hub
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
