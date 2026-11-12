import React from 'react';
import {
  BarChart2,
  HelpCircle,
  FileText,
  KeyRound,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { ActiveTab, Quiz, ExamToken, GoogleFormItem, LiveStudent } from '../types';

interface DashboardViewProps {
  quizzes: Quiz[];
  tokens: ExamToken[];
  forms: GoogleFormItem[];
  students: LiveStudent[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenLihatSoal: (quiz: Quiz) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  quizzes,
  tokens,
  forms,
  students,
  setActiveTab,
  onOpenLihatSoal,
}) => {
  const totalQuestions = quizzes.reduce((acc, q) => acc + q.questionsCount, 0);
  const activeTokensCount = tokens.filter((t) => t.status === 'Aktif').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Quiz */}
        <div className="bg-[#11192e] border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-3">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{quizzes.length}</div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Total Quiz</p>
        </div>

        {/* Total Soal */}
        <div className="bg-[#11192e] border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{totalQuestions}</div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Total Soal</p>
        </div>

        {/* Google Forms */}
        <div className="bg-[#11192e] border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3">
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{forms.length}</div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Google Forms</p>
        </div>

        {/* Token Aktif */}
        <div className="bg-[#11192e] border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center mb-3">
            <KeyRound className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {activeTokensCount}
            <span className="text-sm font-normal text-slate-500">/{tokens.length}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Token Aktif</p>
        </div>
      </div>

      {/* Pelanggaran Ujian Banner */}
      <div className="bg-[#11192e] border border-slate-800/80 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pelanggaran Ujian</h3>
              <p className="text-xs text-slate-400">
                0 pelanggaran hari ini · menampilkan 24 jam terakhir
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('riwayat-pelanggaran')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition cursor-pointer"
          >
            <span>Lihat riwayat lengkap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="py-8 text-center text-slate-400 text-sm">
          Belum ada pelanggaran dalam 24 jam terakhir. 👍
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Aksi Cepat */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-white">Aksi Cepat</h3>

          <div className="space-y-3">
            <button
              onClick={() => setActiveTab('ai-generator')}
              className="w-full bg-[#11192e] hover:bg-slate-800/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between text-left transition group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                    Generate Soal AI
                  </h4>
                  <p className="text-xs text-slate-400">Buat soal otomatis dengan AI</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </button>

            <button
              onClick={() => setActiveTab('bank-soal')}
              className="w-full bg-[#11192e] hover:bg-slate-800/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between text-left transition group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                    Bank Soal
                  </h4>
                  <p className="text-xs text-slate-400">Lihat koleksi soal Anda</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </button>

            <button
              onClick={() => setActiveTab('token-siswa')}
              className="w-full bg-[#11192e] hover:bg-slate-800/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between text-left transition group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                    Token Siswa
                  </h4>
                  <p className="text-xs text-slate-400">Kelola token akses ujian</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </button>

            {/* System Status Card */}
            <div className="bg-[#11192e] border border-emerald-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Status Akses Guru</span>
                  <h5 className="text-sm font-bold text-emerald-400">Akses Penuh Aktif</h5>
                </div>
              </div>
              <p className="text-xs text-emerald-300 font-medium">Siswa ujian bersamaan tanpa batas</p>
              <p className="text-[11px] text-slate-500 mt-1">Siap digunakan untuk seluruh ujian sekolah</p>
            </div>
          </div>
        </div>

        {/* Right: Quiz Terbaru */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Quiz Terbaru</h3>
            <button
              onClick={() => setActiveTab('bank-soal')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                onClick={() => onOpenLihatSoal(quiz)}
                className="bg-[#11192e] hover:bg-slate-800/70 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between transition cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
                    {quiz.badge}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                      {quiz.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {quiz.questionsCount} soal · {quiz.createdAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                    ✓ Form
                  </span>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                    Published
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
