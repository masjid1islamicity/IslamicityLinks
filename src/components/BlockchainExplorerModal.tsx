import React from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle, 
  Cpu, 
  Layers, 
  FileText, 
  Hash, 
  Copy, 
  Lock,
  Boxes
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IslamicityLogo } from './IslamicityLogo';

export const BlockchainExplorerModal: React.FC = () => {
  const { selectedExplorerData, setSelectedExplorerData, setSelectedReceiptTx } = useApp();

  if (!selectedExplorerData) return null;

  const { tx, block } = selectedExplorerData;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] rounded-3xl p-6 max-w-2xl w-full shadow-2xl text-[#141A14] dark:text-[#E4E8E4] my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D8DFD8] dark:border-[#2D332D]">
          <div className="flex items-center gap-2.5">
            <IslamicityLogo variant="emblem" size="sm" className="rounded-xl shadow-none" />
            <div>
              <h3 className="font-bold text-base text-[#141A14] dark:text-[#E4E8E4]">
                {tx ? "Audit Transaksi Zakat Kriptografi" : "Detail Blok Penjelajah Blockchain"}
              </h3>
              <p className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
                Islamicity-Audit-Chain (L2 Subnet Syariah Nasional)
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedExplorerData(null)}
            className="p-1.5 rounded-full hover:bg-[#EEF3EE] dark:hover:bg-[#242924] text-[#5A665B] dark:text-[#A0A8A0]"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4 text-xs">
          
          {/* Status Banner */}
          <div className="p-3 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#2E7D32] dark:text-[#4CAF50] font-semibold">
              <CheckCircle className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span>Status Konsensus: IMMUTABLE & VERIFIED 100% SYARIAH</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#2E7D32] text-white">
              PO-AUTHORITY AMIL
            </span>
          </div>

          {/* If inspecting a Transaction */}
          {tx && (
            <div className="space-y-3">
              <div className="bg-[#EEF3EE] dark:bg-[#242924] p-3.5 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">TxHash (SHA-256):</span>
                  <button 
                    onClick={() => copyToClipboard(tx.txHash)}
                    className="flex items-center gap-1 text-[11px] text-[#2E7D32] dark:text-[#4CAF50] font-mono hover:underline"
                  >
                    <span>{tx.txHash.substring(0, 16)}...{tx.txHash.substring(48)}</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">Nomor Blok:</span>
                  <span className="font-mono font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    #{tx.blockNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">Waktu Transaksi (Timestamp):</span>
                  <span className="text-[#141A14] dark:text-[#E4E8E4]">
                    {new Date(tx.timestamp).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">Jenis Akad:</span>
                  <span className="px-2 py-0.5 rounded bg-[#2E7D32]/15 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-[10px]">
                    {tx.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">Donatur / Muzakki:</span>
                  <span className="font-semibold text-[#141A14] dark:text-[#E4E8E4]">
                    {tx.isAnonymous ? "Hamba Allah (Privasi E2EE Dilindungi)" : tx.donorName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">Jumlah Dana Zakat / Infaq:</span>
                  <span className="text-sm font-extrabold text-[#2E7D32] dark:text-[#4CAF50] font-mono">
                    Rp {tx.amount.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">Lembaga Amil Penerima:</span>
                  <span className="font-semibold text-[#141A14] dark:text-[#E4E8E4]">
                    {tx.charityName}
                  </span>
                </div>

                {tx.asnafTarget && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">Target Alokasi 8 Asnaf:</span>
                    <span className="font-semibold text-[#2E7D32] dark:text-[#4CAF50] uppercase text-[10px]">
                      Golongan {tx.asnafTarget}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">Smart Contract Syariah:</span>
                  <span className="font-mono text-[#5A665B] dark:text-[#A0A8A0] text-[11px]">
                    {tx.smartContract}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">Gas Fee (Beban Transaksi):</span>
                  <span className="font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                    Rp 0 (Subsidi Penuh Ekosistem)
                  </span>
                </div>
              </div>

              {/* Merkle Proof Card */}
              <div className="p-3 bg-[#EEF3EE] dark:bg-[#242924] rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] text-[11px] text-[#141A14] dark:text-[#E4E8E4] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Kriptografi Merkle Tree & Akuntabilitas Pajak</span>
                </div>
                <p className="font-mono text-[10px] text-[#5A665B] dark:text-[#A0A8A0] break-all">
                  Proof Root: {tx.merkleProof}
                </p>
                <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0]">
                  Nomor Bukti Setor Zakat Resmi: <strong>{tx.officialReceiptNumber}</strong> (Sesuai UU RI No. 23/2011 dapat mengurangi Penghasilan Kena Pajak).
                </p>
              </div>
            </div>
          )}

          {/* If inspecting a Block */}
          {block && !tx && (
            <div className="bg-[#EEF3EE] dark:bg-[#242924] p-3.5 rounded-xl border border-[#D8DFD8] dark:border-[#2D332D] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">Tinggi Blok:</span>
                <span className="font-mono font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                  #{block.blockNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">Hash Blok:</span>
                <span className="font-mono text-[11px] text-[#141A14] dark:text-[#E4E8E4]">
                  {block.blockHash.substring(0, 18)}...
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">Merkle Root:</span>
                <span className="font-mono text-[11px] text-[#141A14] dark:text-[#E4E8E4]">
                  {block.merkleRoot.substring(0, 18)}...
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">Jumlah Transaksi:</span>
                <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                  {block.txCount} Transaksi Zakat/Infaq
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">Total Volume Blok:</span>
                <span className="font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                  Rp {block.totalVolume.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5A665B] dark:text-[#A0A8A0] font-medium">Node Validator:</span>
                <span className="font-semibold text-[#141A14] dark:text-[#E4E8E4]">
                  {block.validatorNode}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            {tx && (
              <button
                onClick={() => {
                  setSelectedReceiptTx(tx);
                  setSelectedExplorerData(null);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Lihat Sertifikat Bukti Setor Zakat (BSZ)</span>
              </button>
            )}
            <button
              onClick={() => setSelectedExplorerData(null)}
              className="py-2.5 px-4 rounded-xl bg-[#EEF3EE] dark:bg-[#242924] hover:bg-[#D8DFD8] dark:hover:bg-[#2D332D] text-[#141A14] dark:text-[#E4E8E4] font-bold text-xs transition-colors"
            >
              Tutup Penjelajah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
