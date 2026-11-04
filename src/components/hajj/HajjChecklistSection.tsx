import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Printer, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  FileText, 
  ShieldCheck, 
  Heart, 
  Luggage, 
  CreditCard,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { HajjChecklistItem, HajjChecklistCategory } from '../../types';
import { INITIAL_HAJJ_CHECKLIST } from '../../data/hajjData';

const STORAGE_KEY = 'islamicity_hajj_checklist_v1';

export const HajjChecklistSection: React.FC = () => {
  const [checklist, setChecklist] = useState<HajjChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load hajj checklist from storage', e);
    }
    return INITIAL_HAJJ_CHECKLIST;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [tripFilter, setTripFilter] = useState<'ALL' | 'HAJJ' | 'UMRAH'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'DONE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom item form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<HajjChecklistCategory>('EQUIPMENT_CLOTHING');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemTips, setNewItemTips] = useState('');
  const [newItemMandatory, setNewItemMandatory] = useState(false);

  // Tips expanded map
  const [expandedTips, setExpandedTips] = useState<Record<string, boolean>>({});

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checklist));
    } catch (e) {
      console.error('Failed to save hajj checklist', e);
    }
  }, [checklist]);

  const toggleItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)
    );
  };

  const deleteItem = (id: string) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
  };

  const resetToDefault = () => {
    if (window.confirm('Reset daftar checklist persiapan haji & umrah ke susunan standar resmi?')) {
      setChecklist(INITIAL_HAJJ_CHECKLIST);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem: HajjChecklistItem = {
      id: `custom-chk-${Date.now()}`,
      title: newItemTitle.trim(),
      category: newItemCategory,
      description: newItemDesc.trim() || 'Perlengkapan kustom tambahan pribadi.',
      isCompleted: false,
      isMandatory: newItemMandatory,
      tips: newItemTips.trim() || undefined,
      targetTripType: 'ALL'
    };

    setChecklist(prev => [newItem, ...prev]);
    setNewItemTitle('');
    setNewItemDesc('');
    setNewItemTips('');
    setNewItemMandatory(false);
    setIsAddModalOpen(false);
  };

  const toggleTip = (id: string) => {
    setExpandedTips(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered items
  const filteredItems = checklist.filter(item => {
    // Trip Filter
    if (tripFilter !== 'ALL') {
      if (item.targetTripType && item.targetTripType !== 'ALL' && item.targetTripType !== tripFilter) {
        return false;
      }
    }
    // Category Filter
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
      return false;
    }
    // Status Filter
    if (statusFilter === 'DONE' && !item.isCompleted) return false;
    if (statusFilter === 'PENDING' && item.isCompleted) return false;
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTips = item.tips?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTips) return false;
    }
    return true;
  });

  // Calculate Progress Stats
  const totalRelevant = checklist.filter(item => {
    if (tripFilter === 'ALL') return true;
    return !item.targetTripType || item.targetTripType === 'ALL' || item.targetTripType === tripFilter;
  });
  const totalCount = totalRelevant.length;
  const completedCount = totalRelevant.filter(i => i.isCompleted).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const mandatoryPending = totalRelevant.filter(i => i.isMandatory && !i.isCompleted).length;

  const getCategoryMeta = (cat: HajjChecklistCategory) => {
    switch (cat) {
      case 'DOCUMENTS':
        return { label: 'Dokumen & Visa', icon: FileText, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' };
      case 'IBADAH_MANASIK':
        return { label: 'Ibadah & Manasik', icon: ShieldCheck, color: 'text-[#2E7D32] dark:text-[#4CAF50] bg-[#2E7D32]/10 border-[#2E7D32]/30' };
      case 'EQUIPMENT_CLOTHING':
        return { label: 'Pakaian & Koper', icon: Luggage, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
      case 'HEALTH_MEDICINE':
        return { label: 'Kesehatan & P3K', icon: Heart, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' };
      case 'FINANCIAL_DIGITAL':
        return { label: 'Finansial & Aplikasi', icon: CreditCard, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800' };
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="hajj-checklist-section" className="space-y-6">
      
      {/* Progress & Motivation Card */}
      <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-white via-[#F7FAF7] to-[#EEF5EE] dark:from-[#1A1D1A] dark:via-[#1E231E] dark:to-[#172018] border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] border border-[#2E7D32]/20">
                Kesiapan Menuju Baitullah
              </span>
              {mandatoryPending === 0 && completedCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3" />
                  Semua Syarat Wajib Terpenuhi!
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#141A14] dark:text-[#E4E8E4] tracking-tight">
              Checklist Perlengkapan & Manasik Safar Suci
            </h2>
            <p className="text-xs sm:text-sm text-[#5A665B] dark:text-[#A0A8A0]">
              Pastikan seluruh berkas administrasi, vaksinasi, kain ihram, obat-obatan, dan aplikasi Nusuk siap sebelum bertolak ke Tanah Suci.
            </p>
          </div>

          {/* Stat Pill */}
          <div className="shrink-0 flex items-center gap-4 bg-white dark:bg-[#242924] px-4 py-3 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-inner">
            <div className="text-right">
              <span className="text-2xl font-black text-[#2E7D32] dark:text-[#4CAF50]">
                {percentage}%
              </span>
              <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0] font-medium">
                {completedCount} dari {totalCount} Selesai
              </p>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#D8DFD8] dark:text-[#2D332D]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#2E7D32] dark:text-[#4CAF50] transition-all duration-500 ease-out"
                  strokeDasharray={`${percentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-[#141A14] dark:text-[#E4E8E4]">
                🕋
              </span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="mt-4 w-full bg-[#E2E8E2] dark:bg-[#242924] h-2.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {mandatoryPending > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Masih ada <strong>{mandatoryPending} berkas/item wajib</strong> yang belum dicentang.</span>
          </div>
        )}
      </div>

      {/* Control Bar: Filters & Actions */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white dark:bg-[#1A1D1A] p-3 rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D]">
        
        {/* Trip Type Selector */}
        <div className="flex items-center gap-1 bg-[#EEF3EE] dark:bg-[#242924] p-1 rounded-xl">
          <button
            onClick={() => setTripFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              tripFilter === 'ALL'
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
            }`}
          >
            Semua Perjalanan
          </button>
          <button
            onClick={() => setTripFilter('HAJJ')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              tripFilter === 'HAJJ'
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
            }`}
          >
            Ibadah Haji 🕌
          </button>
          <button
            onClick={() => setTripFilter('UMRAH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              tripFilter === 'UMRAH'
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]'
            }`}
          >
            Ibadah Umrah ✈️
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium border ${
              statusFilter === 'ALL'
                ? 'bg-[#141A14] text-white dark:bg-white dark:text-[#141A14] border-transparent'
                : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D]'
            }`}
          >
            Semua ({checklist.length})
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium border ${
              statusFilter === 'PENDING'
                ? 'bg-amber-600 text-white border-transparent'
                : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D]'
            }`}
          >
            Belum ({checklist.filter(i => !i.isCompleted).length})
          </button>
          <button
            onClick={() => setStatusFilter('DONE')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium border ${
              statusFilter === 'DONE'
                ? 'bg-[#2E7D32] text-white border-transparent'
                : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D]'
            }`}
          >
            Selesai ({checklist.filter(i => i.isCompleted).length})
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2E7D32] text-white text-xs font-bold shadow-sm shadow-[#2E7D32]/30 hover:bg-[#256629] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Item</span>
          </button>

          <button
            onClick={handlePrint}
            title="Cetak checklist"
            className="p-1.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4] border border-[#D8DFD8] dark:border-[#2D332D]"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={resetToDefault}
            title="Reset ke checklist bawaan standar"
            className="p-1.5 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0] hover:text-red-500 border border-[#D8DFD8] dark:border-[#2D332D]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            selectedCategory === 'ALL'
              ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
              : 'bg-white dark:bg-[#1A1D1A] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Semua Kategori</span>
        </button>

        {(['DOCUMENTS', 'IBADAH_MANASIK', 'EQUIPMENT_CLOTHING', 'HEALTH_MEDICINE', 'FINANCIAL_DIGITAL'] as HajjChecklistCategory[]).map(cat => {
          const meta = getCategoryMeta(cat);
          const Icon = meta.icon;
          const count = checklist.filter(i => i.category === cat).length;
          const isSelected = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                  : 'bg-white dark:bg-[#1A1D1A] text-[#5A665B] dark:text-[#A0A8A0] border-[#D8DFD8] dark:border-[#2D332D] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{meta.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isSelected ? 'bg-white/20 text-white' : 'bg-[#EEF3EE] dark:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Checklist List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#1A1D1A] rounded-2xl border border-dashed border-[#D8DFD8] dark:border-[#2D332D]">
            <CheckCircle2 className="w-12 h-12 text-[#A0A8A0] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#141A14] dark:text-[#E4E8E4]">
              Tidak Ada Item Checklist
            </h3>
            <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] mt-1 max-w-sm mx-auto">
              Tidak ada item yang cocok dengan filter atau pencarian saat ini. Anda dapat menambahkan item baru melalui tombol "Tambah Item".
            </p>
          </div>
        ) : (
          filteredItems.map(item => {
            const meta = getCategoryMeta(item.category);
            const isTipOpen = !!expandedTips[item.id];

            return (
              <div
                key={item.id}
                className={`rounded-2xl transition-all border p-4 ${
                  item.isCompleted
                    ? 'bg-[#F4F8F4] dark:bg-[#161D16] border-[#2E7D32]/30 opacity-90'
                    : 'bg-white dark:bg-[#1A1D1A] border-[#D8DFD8] dark:border-[#2D332D] shadow-sm hover:border-[#2E7D32]/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Custom Checkbox */}
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="mt-0.5 shrink-0 focus:outline-none transition-transform active:scale-95"
                    aria-label={item.isCompleted ? "Tandai belum selesai" : "Tandai selesai"}
                  >
                    {item.isCompleted ? (
                      <div className="w-6 h-6 rounded-lg bg-[#2E7D32] flex items-center justify-center text-white shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-lg border-2 border-[#A0A8A0] dark:border-[#4B554B] hover:border-[#2E7D32] bg-white dark:bg-[#242924] transition-colors" />
                    )}
                  </button>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${meta.color}`}>
                        {meta.label}
                      </span>

                      {item.isMandatory && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                          Syarat Wajib
                        </span>
                      )}

                      {item.targetTripType === 'HAJJ' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300">
                          Khusus Haji 🕌
                        </span>
                      )}
                      {item.targetTripType === 'UMRAH' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                          Khusus Umrah ✈️
                        </span>
                      )}
                    </div>

                    <h4 
                      onClick={() => toggleItem(item.id)}
                      className={`text-sm font-bold cursor-pointer select-none transition-colors ${
                        item.isCompleted 
                          ? 'text-[#5A665B] dark:text-[#A0A8A0] line-through' 
                          : 'text-[#141A14] dark:text-[#E4E8E4]'
                      }`}
                    >
                      {item.title}
                    </h4>

                    <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Expandable Tips */}
                    {item.tips && (
                      <div className="mt-2.5">
                        <button
                          onClick={() => toggleTip(item.id)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2E7D32] dark:text-[#4CAF50] hover:underline"
                        >
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>{isTipOpen ? 'Sembunyikan Tips Penting' : 'Lihat Tips & Rekomendasi Lapangan'}</span>
                          {isTipOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        {isTipOpen && (
                          <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 leading-relaxed animate-in fade-in">
                            💡 <strong>Tips Pembimbing:</strong> {item.tips}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Delete button if custom */}
                  {item.id.startsWith('custom-chk') && (
                    <button
                      onClick={() => deleteItem(item.id)}
                      title="Hapus item kustom"
                      className="text-[#A0A8A0] hover:text-red-500 p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1D1A] w-full max-w-md rounded-2xl border border-[#D8DFD8] dark:border-[#2D332D] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between bg-[#EEF3EE]/50 dark:bg-[#242924]/50">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <h3 className="font-bold text-sm text-[#141A14] dark:text-[#E4E8E4]">
                  Tambah Perlengkapan Kustom
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs text-[#A0A8A0] hover:text-[#141A14] dark:hover:text-[#E4E8E4]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] mb-1">
                  Nama Perlengkapan / Tugas *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bawa kacamata baca cadangan, Sajadah lipat tipis"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] mb-1">
                  Kategori
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as HajjChecklistCategory)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] focus:outline-none"
                >
                  <option value="DOCUMENTS">Dokumen & Visa</option>
                  <option value="IBADAH_MANASIK">Ibadah & Manasik</option>
                  <option value="EQUIPMENT_CLOTHING">Pakaian & Koper</option>
                  <option value="HEALTH_MEDICINE">Kesehatan & P3K</option>
                  <option value="FINANCIAL_DIGITAL">Finansial & Aplikasi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] mb-1">
                  Keterangan Singkat
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan detail ukuran, jumlah pcs, atau lokasi penyimpanan..."
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141A14] dark:text-[#E4E8E4] mb-1">
                  Tips Pribadi (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Masukkan ke tas ransel kecil kabin"
                  value={newItemTips}
                  onChange={(e) => setNewItemTips(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chk-mandatory-box"
                  checked={newItemMandatory}
                  onChange={(e) => setNewItemMandatory(e.target.checked)}
                  className="rounded text-[#2E7D32] focus:ring-[#2E7D32]"
                />
                <label htmlFor="chk-mandatory-box" className="text-xs text-[#141A14] dark:text-[#E4E8E4] cursor-pointer">
                  Tandai sebagai <strong>Syarat Wajib</strong>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#5A665B] dark:text-[#A0A8A0] hover:bg-[#EEF3EE] dark:hover:bg-[#242924]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold shadow-md shadow-[#2E7D32]/25 hover:bg-[#256629]"
                >
                  Simpan ke Checklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
