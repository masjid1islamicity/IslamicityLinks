import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OfflineIndicator: React.FC = () => {
  const { isOffline, offlineQueue, triggerManualSync, t } = useApp();

  if (!isOffline && offlineQueue.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full animate-in slide-in-from-bottom-3">
      <div className="p-3.5 rounded-2xl bg-amber-500 text-slate-950 shadow-xl border border-amber-400 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-950 text-amber-400 shrink-0 font-bold">
            <WifiOff className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-extrabold leading-tight">
              {isOffline ? t('offline_badge') : 'Data Tertunda Menunggu Sinkronisasi'}
            </p>
            <p className="text-[11px] text-slate-900/80 mt-0.5">
              {offlineQueue.length > 0
                ? `${offlineQueue.length} antrean data offline siap di-upload ke blockchain.`
                : t('offline_msg')}
            </p>
          </div>
        </div>

        {offlineQueue.length > 0 && !isOffline && (
          <button
            onClick={triggerManualSync}
            className="px-3 py-1.5 rounded-xl bg-slate-950 text-amber-300 hover:bg-slate-900 font-bold text-xs shrink-0 flex items-center gap-1 shadow-md transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sinkron</span>
          </button>
        )}
      </div>
    </div>
  );
};
