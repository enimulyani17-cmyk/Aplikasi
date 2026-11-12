import React, { useState } from 'react';
import {
  ArrowLeft,
  QrCode,
  Radio,
  ShieldAlert,
  Search,
  RotateCcw,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { ExamToken, LiveStudent } from '../types';

interface UjianLiveViewProps {
  tokens: ExamToken[];
  selectedTokenCode?: string | null;
  students: LiveStudent[];
  onOpenLayarQr: (token: ExamToken) => void;
  onNavigateToViolations: () => void;
  onResetStudentStatus: (studentId: string) => void;
  onSelectToken: (tokenCode: string | null) => void;
  onBackToTokens: () => void;
  onNavigateToTokenSiswa?: () => void;
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
  onNavigateToTokenSiswa,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [internalSelectedToken, setInternalSelectedToken] = useState<string | null>(
    selectedTokenCode ?? null
  );

  // Sync if prop changes externally
  React.useEffect(() => {
    setInternalSelectedToken(selectedTokenCode ?? null);
  }, [selectedTokenCode]);

  const activeTokenCode = internalSelectedToken;
  const activeToken = tokens.find((t) => t.token === activeTokenCode);

  // Total students actively taking exam across all tokens
  const totalActiveStudents = students.filter((s) => s.status === 'Mengerjakan').length;

  const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // =========================================================================
  // VIEW 1: TOKEN SELECTION GRID (MATCHING USER SCREENSHOT EXACTLY)
  // =========================================================================
  if (!activeToken) {
    return (
      <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
        {/* Top Banner: Siswa sedang ujian di akun Anda: 0 / 999 */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-2xl p-5 flex items-center gap-3.5 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <p className="text-sm text-slate-300">
            Siswa sedang ujian di akun Anda:{' '}
            <strong className="text-white font-bold">{totalActiveStudents} / 999</strong>
          </p>
        </div>

        {/* Tokens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tokens.map((token) => {
            const tokenStudentsActive = students.filter(
              (s) => s.token === token.token && s.status === 'Mengerjakan'
            ).length;

            return (
              <div
                key={token.token}
                className="bg-[#0e1628] border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm transition"
              >
                <div>
                  {/* Badge Token Code */}
                  <span className="inline-block px-3 py-1 rounded-lg bg-[#182038] text-indigo-300 font-mono font-bold text-xs tracking-wider border border-indigo-500/25 mb-4">
                    {token.token}
                  </span>

                  {/* Title & Subject */}
                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                    {token.label}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 mb-5 font-medium">
                    {token.quizSubject || token.quizTitle}
                  </p>

                  {/* Status Text: 0 mengerjakan · tanpa batas waktu */}
                  <p className="text-xs text-slate-400 mb-6">
                    <strong className="text-white font-bold">{tokenStudentsActive}</strong> mengerjakan
                    {' · '}
                    {token.expiresAt ? `kedaluwarsa ${token.expiresAt}` : 'tanpa batas waktu'}
                  </p>
                </div>

                {/* Action Buttons: Layar QR & Pantau */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/50">
                  <button
                    onClick={() => onOpenLayarQr(token)}
                    className="py-2.5 px-3 rounded-xl bg-[#182038] hover:bg-[#202b48] border border-indigo-900/40 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                  >
                    <QrCode className="w-4 h-4 text-slate-300" />
                    <span>Layar QR</span>
                  </button>

                  <button
                    onClick={() => {
                      setInternalSelectedToken(token.token);
                      onSelectToken(token.token);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-[#0f2a28] hover:bg-[#143936] border border-emerald-800/40 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                  >
                    <Radio className="w-4 h-4 text-emerald-400" />
                    <span>Pantau</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {tokens.length === 0 && (
          <div className="p-12 text-center bg-[#0e1628] border border-slate-800 rounded-2xl space-y-3">
            <KeyRound className="w-10 h-10 text-slate-600 mx-auto stroke-[1.5]" />
            <p className="text-sm font-bold text-slate-300">Belum ada token ujian yang dibuat</p>
            <p className="text-xs text-slate-500">
              Buat token ujian baru di menu Token Siswa untuk memulai sesi ujian live.
            </p>
            {onNavigateToTokenSiswa && (
              <button
                onClick={onNavigateToTokenSiswa}
                className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer inline-flex items-center gap-2"
              >
                <span>Buka Menu Token Siswa</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: LIVE MONITORING DETAIL FOR SELECTED TOKEN
  // =========================================================================
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

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Title & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => {
              setInternalSelectedToken(null);
              onSelectToken(null);
              onBackToTokens();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition cursor-pointer mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Semua token</span>
          </button>

          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Ujian Live · {activeToken.token}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeToken.label} · {activeToken.quizSubject || activeToken.quizTitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Diperbarui {currentTime}</span>
          </span>

          <button
            onClick={() => onOpenLayarQr(activeToken)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-400" />
            <span>Layar QR</span>
          </button>

          <button
            onClick={onNavigateToViolations}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-rose-400 flex items-center gap-1.5 transition cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Pelanggaran</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Mengerjakan */}
        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-400">Mengerjakan</p>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1 tracking-tight">
            {countMengerjakan}
          </div>
        </div>

        {/* Diblokir */}
        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-400">Diblokir</p>
          <div className="text-3xl font-extrabold text-rose-500 mt-1 tracking-tight">
            {countDiblokir}
          </div>
        </div>

        {/* Terputus */}
        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-400">Terputus</p>
          <div className="text-3xl font-extrabold text-amber-400 mt-1 tracking-tight">
            {countTerputus}
          </div>
        </div>

        {/* Selesai */}
        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-400">Selesai</p>
          <div className="text-3xl font-extrabold text-sky-400 mt-1 tracking-tight">
            {countSelesai}
          </div>
        </div>
      </div>

      {/* Student List Container */}
      <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 space-y-4">
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
