import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  BarChart2,
  FileText,
  KeyRound,
  Radio,
  ClipboardCheck,
  ShieldAlert,
  Smartphone,
  BookOpen,
  Settings,
  Moon,
  Sun,
  UserCheck,
  GraduationCap,
  LogOut,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenStudentMode: () => void;
  onOpenLogoutModal?: () => void;
  userName?: string;
  userEmail?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenStudentMode,
  onOpenLogoutModal,
  userName = 'Yana Periyana',
  userEmail = 'enimulyani17@guru.smp.belajar.id',
}) => {
  const [isDark, setIsDark] = React.useState(true);

  const navItem = (
    id: ActiveTab,
    label: string,
    IconComponent: React.ComponentType<{ className?: string }>,
    badge?: { text: string; color: string }
  ) => {
    const isActive = activeTab === id;
    return (
      <button
        key={id}
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group cursor-pointer ${
          isActive
            ? 'bg-[#1e293b]/90 text-white shadow-sm border border-indigo-500/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
        }`}
      >
        <div className="flex items-center gap-3">
          <IconComponent
            className={`w-4 h-4 transition-colors ${
              isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
            }`}
          />
          <span className="truncate">{label}</span>
        </div>
        {badge && (
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${badge.color}`}
          >
            {badge.text}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-64 min-w-[16rem] bg-[#0c1222] border-r border-slate-800/80 flex flex-col h-screen select-none">
      {/* Brand & Theme Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          {/* Logo icon */}
          <div className="w-9 h-9 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center shadow-inner">
            <svg
              className="w-5 h-5 text-[#10b981]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              soalpintar.ai
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Guru Panel</p>
          </div>
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          title="Toggle Theme"
          className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/60 transition"
        >
          {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Dashboard */}
        <div className="space-y-1">
          {navItem('dashboard', 'Dashboard', LayoutDashboard)}
        </div>

        {/* Section: SOAL */}
        <div>
          <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            SOAL
          </p>
          <div className="space-y-1">
            {navItem('ai-generator', 'AI Generator', Sparkles, {
              text: 'AI',
              color: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
            })}
            {navItem('bank-soal', 'Bank Soal', BarChart2)}
          </div>
        </div>

        {/* Section: DISTRIBUSI */}
        <div>
          <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            DISTRIBUSI
          </p>
          <div className="space-y-1">
            {navItem('google-forms', 'Google Forms', FileText)}
            {navItem('token-siswa', 'Token Siswa', KeyRound)}
            {navItem('ujian-live', 'Ujian Live', Radio)}
            {navItem('nilai-siswa', 'Nilai Siswa', ClipboardCheck)}
            {navItem('riwayat-pelanggaran', 'Riwayat Pelanggaran', ShieldAlert)}
            {navItem('download-aplikasi', 'Download Aplikasi', Smartphone)}
          </div>
        </div>

        {/* Section: BANTUAN */}
        <div>
          <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            BANTUAN
          </p>
          <div className="space-y-1">
            {navItem('panduan', 'Panduan', BookOpen)}
            {navItem('settings', 'Settings', Settings)}
          </div>
        </div>
      </div>

      {/* Student Mode Launcher Quick CTA */}
      <div className="p-3 border-t border-slate-800/60 bg-slate-900/40">
        <button
          onClick={onOpenStudentMode}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Mode Siswa (Ujian)</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300 font-mono">
            Buka
          </span>
        </button>

        {/* Logged in Teacher Footer with Logout Option */}
        <div className="mt-3 pt-3 border-t border-slate-800/40 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-7.5 h-7.5 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-inner">
              {userName.charAt(0)}
            </div>
            <div className="truncate min-w-0">
              <p className="text-slate-200 font-semibold truncate leading-tight">{userName}</p>
              <p className="text-[10px] text-slate-400 truncate">{userEmail}</p>
            </div>
          </div>

          {onOpenLogoutModal && (
            <button
              onClick={onOpenLogoutModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer shrink-0 ml-1"
              title="Keluar Akun (Log Out)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
