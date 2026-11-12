import React, { useState } from 'react';
import { Award, Download, Search, CheckCircle, Clock } from 'lucide-react';
import { LiveStudent, Quiz } from '../types';

interface NilaiSiswaViewProps {
  students: LiveStudent[];
  quizzes: Quiz[];
}

export const NilaiSiswaView: React.FC<NilaiSiswaViewProps> = ({
  students,
  quizzes,
}) => {
  const [search, setSearch] = useState('');

  const completed = students.filter((s) => s.status === 'Selesai');
  const filtered = completed.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.classGrade.toLowerCase().includes(search.toLowerCase())
  );

  const averageScore =
    completed.length > 0
      ? Math.round(
          completed.reduce((acc, s) => acc + (s.score || 0), 0) / completed.length
        )
      : 0;

  const handleExportCsv = () => {
    const headers = 'Nama,Kelas,Absen,Token,Nilai,Pelanggaran,Waktu Submit\n';
    const rows = completed
      .map(
        (s) =>
          `"${s.name}","${s.classGrade}","${s.absentNo}","${s.token}",${s.score || 0},${
            s.violations
          },"${s.submittedAt || '-'}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nilai-siswa-soalpintar-${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Nilai Siswa</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar hasil pengerjaan ujian siswa dan analisis skor
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-white flex items-center gap-2 transition cursor-pointer shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Export Excel/CSV</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs text-slate-400">Total Siswa Selesai</p>
          <div className="text-3xl font-extrabold text-white mt-1">{completed.length}</div>
        </div>

        <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs text-slate-400">Rata-rata Skor</p>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">{averageScore}</div>
        </div>

        <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs text-slate-400">Nilai Tertinggi</p>
          <div className="text-3xl font-extrabold text-indigo-400 mt-1">
            {completed.length > 0
              ? Math.max(...completed.map((s) => s.score || 0))
              : 0}
          </div>
        </div>
      </div>

      {/* Search & Table */}
      <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari siswa selesai..."
            className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f1d] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-semibold">
              <tr>
                <th className="px-5 py-3.5">NAMA SISWA</th>
                <th className="px-4 py-3.5">KELAS & ABSEN</th>
                <th className="px-4 py-3.5">TOKEN</th>
                <th className="px-4 py-3.5">NILAI</th>
                <th className="px-4 py-3.5">PELANGGARAN</th>
                <th className="px-4 py-3.5">WAKTU SELESAI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((st) => (
                <tr key={st.id} className="hover:bg-slate-800/30">
                  <td className="px-5 py-4 font-bold text-white text-sm">{st.name}</td>
                  <td className="px-4 py-4 text-slate-300">
                    {st.classGrade !== '-' ? `${st.classGrade} (Absen ${st.absentNo})` : '-'}
                  </td>
                  <td className="px-4 py-4 font-mono text-indigo-300">{st.token}</td>
                  <td className="px-4 py-4">
                    <span className="text-base font-extrabold text-emerald-400 font-mono">
                      {st.score ?? 90}
                    </span>
                    <span className="text-slate-500 text-xs">/100</span>
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-300">{st.violations}x</td>
                  <td className="px-4 py-4 text-slate-400 font-mono">
                    {st.submittedAt || st.lastSeen}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                    Belum ada siswa yang menyelesaikan ujian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
