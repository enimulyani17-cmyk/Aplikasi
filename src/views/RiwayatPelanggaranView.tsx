import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Filter, Search } from 'lucide-react';
import { ViolationRecord, ExamToken } from '../types';

interface RiwayatPelanggaranViewProps {
  violations: ViolationRecord[];
  tokens: ExamToken[];
}

export const RiwayatPelanggaranView: React.FC<RiwayatPelanggaranViewProps> = ({
  violations,
  tokens,
}) => {
  const [period, setPeriod] = useState('Hari ini');
  const [selectedToken, setSelectedToken] = useState('all');
  const [search, setSearch] = useState('');
  const [onlyBlocked, setOnlyBlocked] = useState(false);

  const filtered = violations.filter((v) => {
    if (selectedToken !== 'all' && v.token !== selectedToken) return false;
    if (onlyBlocked && !v.isBlocked) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!v.studentName.toLowerCase().includes(q) && !v.classGrade.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const totalViolations = filtered.length;
  const involvedStudents = new Set(filtered.map((v) => v.studentName)).size;
  const blockedCount = filtered.filter((v) => v.isBlocked).length;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Riwayat Pelanggaran</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Setiap peringatan & blokir siswa saat ujian, lengkap dengan penyebabnya
        </p>
      </div>

      {/* Filter Bar matching Screenshot 6 */}
      <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
          {/* Periode */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Periode</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Hari ini">Hari ini</option>
              <option value="7 hari terakhir">7 hari terakhir</option>
              <option value="30 hari terakhir">30 hari terakhir</option>
            </select>
          </div>

          {/* Token */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Token</label>
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Semua token</option>
              {tokens.map((t) => (
                <option key={t.token} value={t.token}>
                  {t.token} ({t.label})
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="lg:col-span-4">
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Cari siswa / kelas
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nama atau kelas"
              className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Checkbox */}
          <div className="lg:col-span-2 flex items-center h-9">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyBlocked}
                onChange={(e) => setOnlyBlocked(e.target.checked)}
                className="rounded accent-indigo-500 cursor-pointer"
              />
              <span>Hanya yang diblokir</span>
            </label>
          </div>

          {/* Button */}
          <div className="lg:col-span-2">
            <button
              type="button"
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow-sm"
            >
              Terapkan
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Boxes matching Screenshot 6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pelanggaran */}
        <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-400">Total pelanggaran</p>
          <div className="text-3xl font-extrabold text-rose-500 mt-1">{totalViolations}</div>
        </div>

        {/* Perangkat / siswa terlibat */}
        <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-400">Perangkat / siswa terlibat</p>
          <div className="text-3xl font-extrabold text-white mt-1">{involvedStudents}</div>
        </div>

        {/* Diblokir (batas tercapai) */}
        <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-400">Diblokir (batas tercapai)</p>
          <div className="text-3xl font-extrabold text-rose-500 mt-1">{blockedCount}</div>
        </div>

        {/* Penyebab Terbanyak */}
        <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Penyebab terbanyak</p>
            <div className="text-base font-bold text-white mt-1 font-mono">—</div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
            Siswa yang diblokir bisa dibuka lagi dari menu Token Siswa → Kelola Perangkat.
          </p>
        </div>
      </div>

      {/* Main Content Box: Empty State or Table */}
      {filtered.length === 0 ? (
        <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 mb-3">
            <ShieldCheck className="w-7 h-7 stroke-[1.5]" />
          </div>
          <p className="text-sm font-semibold text-slate-300">
            Tidak ada pelanggaran pada filter ini.
          </p>
        </div>
      ) : (
        <div className="bg-[#10172a] border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f1d] text-slate-400 uppercase text-[10px] border-b border-slate-800 font-semibold">
              <tr>
                <th className="px-5 py-3">WAKTU</th>
                <th className="px-5 py-3">SISWA</th>
                <th className="px-5 py-3">TOKEN</th>
                <th className="px-5 py-3">PENYEBAB</th>
                <th className="px-5 py-3">PENALTI</th>
                <th className="px-5 py-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-800/30">
                  <td className="px-5 py-3.5 text-slate-400 font-mono">{v.timestamp}</td>
                  <td className="px-5 py-3.5 font-bold text-white">
                    {v.studentName}{' '}
                    <span className="text-slate-400 font-normal">({v.classGrade})</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-indigo-300">{v.token}</td>
                  <td className="px-5 py-3.5 text-rose-400 font-medium">{v.reason}</td>
                  <td className="px-5 py-3.5 text-amber-400 font-mono">+{v.penaltySeconds}s</td>
                  <td className="px-5 py-3.5">
                    {v.isBlocked ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-semibold text-[10px]">
                        Diblokir
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold text-[10px]">
                        Peringatan
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
