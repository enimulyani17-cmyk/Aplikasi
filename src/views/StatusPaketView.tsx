import React from 'react';
import { Crown, CheckCircle2, Calendar, CreditCard, Sparkles } from 'lucide-react';
import { TransactionItem } from '../types';

interface StatusPaketViewProps {
  transactions: TransactionItem[];
  onOpenUpgradeModal: () => void;
}

export const StatusPaketView: React.FC<StatusPaketViewProps> = ({
  transactions,
  onOpenUpgradeModal,
}) => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Status Paket & Riwayat</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Lihat status langganan dan riwayat transaksi Anda.
        </p>
      </div>

      {/* Two Column Package Details matching Screenshot 4 & 16 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Paket Saat Ini */}
        <div className="lg:col-span-8 bg-[#10172a] border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Crown className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Paket Saat Ini</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AKTIF
            </span>
          </div>

          <div className="space-y-3.5 divide-y divide-slate-800/60 text-xs">
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400 font-medium">Tipe Paket</span>
              <span className="text-emerald-400 font-bold">Paket Basic</span>
            </div>

            <div className="flex items-center justify-between pt-3.5">
              <span className="text-slate-400 font-medium">Masa Aktif Hingga</span>
              <span className="text-white font-bold font-mono">07 Sep 2027</span>
            </div>

            <div className="flex items-center justify-between pt-3.5">
              <span className="text-slate-400 font-medium">Sisa Waktu</span>
              <span className="text-emerald-400 font-bold font-mono">318 hari lagi</span>
            </div>

            <div className="flex items-center justify-between pt-3.5">
              <span className="text-slate-400 font-medium">Status Akun</span>
              <span className="text-emerald-400 font-bold">Active</span>
            </div>
          </div>
        </div>

        {/* Right Card: Paket Aktif & Perpanjang */}
        <div className="lg:col-span-4 bg-[#10172a] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-white">Paket Aktif</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Selamat! Anda memiliki akses penuh ke semua fitur premium.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={onOpenUpgradeModal}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Perpanjang Lebih Awal</span>
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-2">
              Sisa masa aktif tidak hangus
            </p>
          </div>
        </div>
      </div>

      {/* Riwayat Transaksi */}
      <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-4">
          <CreditCard className="w-4 h-4" />
          <h3 className="text-sm font-bold text-white">Riwayat Transaksi</h3>
        </div>

        <div className="space-y-3">
          {transactions.map((trx) => (
            <div
              key={trx.id}
              className="bg-[#0a0f1d] border border-slate-800 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{trx.packageName}</h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{trx.date}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-teal-400 font-mono">{trx.amount}</div>
                <span className="text-[10px] font-bold text-emerald-400 tracking-wider">
                  {trx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
