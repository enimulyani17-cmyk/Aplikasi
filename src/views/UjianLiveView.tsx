import React, { useState } from 'react';
import {
  ArrowLeft,
  QrCode,
  ShieldAlert,
  Search,
  RotateCcw,
  UserX,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ExamToken, LiveStudent } from '../types';

interface UjianLiveViewProps {
  tokens: ExamToken[];
  selectedTokenCode?: string;
  students: LiveStudent[];
  onOpenLayarQr: (token: ExamToken) => void;
  onNavigateToViolations: () => void;
  onResetStudentStatus: (studentId: string) => void;
  onSelectToken: (tokenCode: string) => void;
  onBackToTokens: () => void;
}

export const UjianLiveView: React.FC<UjianLiveViewProps> = ({
  tokens,
  selectedTokenCode,
  students,
  onOpenLayarQr,
  onNavigateToViolations,
  onResetStudentStatus,
  onSelectToken,
  onBackToTokens,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const activeToken =
    tokens.find((t) => t.token === selectedTokenCode) || tokens[0] || {
      token: 'ZJT0P4M',
      label: 'Ulangan',
      quizTitle: 'Kerucut',
      quizSubject: 'IPA',
      limit: 1,
      status: 'Aktif',
      expiresAt: null,
      waitingRoom: false,
      waitingRoomStarted: false,
      createdAt: 'Baru saja',
    };

  const filteredStudents = students
    .filter((s) => s.token === activeToken.token)
    .filter((s) => {
      const matchQuery =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.classGrade.toLowerCase().includes(search.toLowerCase());
      if (!matchQuery) return false;
      if (filterStatus === 'all') return true;
      return s.status === filterStatus;
    });

  const countMengerjakan = students.filter(
    (s) => s.token === activeToken.token && s.status === 'Mengerjakan'
  ).length;
  const countDiblokir = students.filter(
    (s) => s.token === activeToken.token && s.status === 'Diblokir'
  ).length;
  const countTerputus = students.filter(
    (s) => s.token === activeToken.token && s.status === 'Terputus'
  ).length;
  const countSelesai = students.filter(
    (s) => s.token === activeToken.token && s.status === 'Selesai'
  ).length;

  const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Title & Top Bar matching Screenshot 2 & 18 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Ujian Live · {activeToken.token}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeToken.label} · {activeToken.quizSubject || activeToken.quizTitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToTokens}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Semua token</span>
          </button>

          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Diperbarui {currentTime}</span>
          </span>

          <button
            onClick={() => onOpenLayarQr(activeToken)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-400" />
            <span>Layar QR</span>
          </button>

          <button
            onClick={onNavigateToViolations}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-rose-400 flex items-center gap-1.5 transition cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Pelanggaran</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Mengerjakan */}
        <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-400">Mengerjakan</p>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1 tracking-tight">
            {countMengerjakan}
          </div>
        </div>

        {/* Diblokir */}
        <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-400">Diblokir</p>
          <div className="text-3xl font-extrabold text-rose-500 mt-1 tracking-tight">
            {countDiblokir}
          </div>
        </div>

        {/* Terputus */}
        <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-400">Terputus</p>
          <div className="text-3xl font-extrabold text-amber-400 mt-1 tracking-tight">
            {countTerputus}
          </div>
        </div>

        {/* Selesai */}
        <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-400">Selesai</p>
          <div className="text-3xl font-extrabold text-sky-400 mt-1 tracking-tight">
            {countSelesai}
          </div>
        </div>
      </div>

      {/* Student List Container */}
      <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-6 space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama / kelas..."
              className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFilterStatus('all');
                setSearch('');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 cursor-pointer"
            >
              Tampilkan semua
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f1d] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-semibold">
              <tr>
                <th className="px-4 py-3.5">SISWA</th>
                <th className="px-4 py-3.5">STATUS</th>
                <th className="px-4 py-3.5">PELANGGARAN</th>
                <th className="px-4 py-3.5">PENYEBAB TERAKHIR</th>
                <th className="px-4 py-3.5">TERAKHIR TERLIHAT</th>
                <th className="px-4 py-3.5 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-bold text-white text-sm">{st.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {st.classGrade !== '-' ? `${st.classGrade} · absen ${st.absentNo}` : '-'}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {st.status === 'Terputus' && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-semibold text-[11px]">
                        Terputus
                      </span>
                    )}
                    {st.status === 'Selesai' && (
                      <span className="px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 font-semibold text-[11px]">
                        Selesai
                      </span>
                    )}
                    {st.status === 'Mengerjakan' && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px] animate-pulse">
                        Mengerjakan
                      </span>
                    )}
                    {st.status === 'Diblokir' && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-semibold text-[11px]">
                        Diblokir
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 font-mono font-bold text-slate-300">
                    {st.violations}
                  </td>

                  <td className="px-4 py-4 text-slate-400 font-mono">
                    {st.lastViolationReason}
                  </td>

                  <td className="px-4 py-4 text-slate-400 font-mono text-xs">
                    {st.lastSeen}
                  </td>

                  <td className="px-4 py-4 text-right">
                    {st.status === 'Selesai' || st.status === 'Diblokir' || st.status === 'Terputus' ? (
                      <button
                        onClick={() => onResetStudentStatus(st.id)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/50 text-indigo-300 hover:text-white font-semibold text-xs transition cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Izinkan ulang</span>
                      </button>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                    Belum ada siswa yang masuk dengan token ini.
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
