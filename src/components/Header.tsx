import React, { useState } from 'react';
import { ExternalLink, LogOut, User, ShieldCheck, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenStudentMode: () => void;
  onOpenLogoutModal?: () => void;
  userName?: string;
  userEmail?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenStudentMode,
  onOpenLogoutModal,
  userName = 'Yana Periyana',
  userEmail = 'enimulyani17@guru.smp.belajar.id',
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="px-6 sm:px-8 py-4 border-b border-slate-800/80 bg-[#0c1222]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20 select-none">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Player Button */}
        <button
          onClick={onOpenStudentMode}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
          <span>Buka Player Siswa</span>
        </button>

        {/* Guru Active Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span>Guru Aktif</span>
        </div>

        {/* User Account & Logout Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition cursor-pointer"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
              {userName.charAt(0)}
            </div>
            <span className="font-semibold hidden lg:inline max-w-[120px] truncate">{userName}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0d1527] border border-slate-800 rounded-2xl p-2 shadow-2xl z-30 animate-fade-in space-y-1">
              <div className="px-3 py-2 border-b border-slate-800/80">
                <p className="text-xs font-bold text-white truncate">{userName}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{userEmail}</p>
              </div>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onOpenStudentMode();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                <span>Buka Player Siswa</span>
              </button>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  if (onOpenLogoutModal) onOpenLogoutModal();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-medium transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Akun (Logout)</span>
              </button>
            </div>
          )}
        </div>

        {/* Direct Logout Icon Button */}
        {onOpenLogoutModal && (
          <button
            onClick={onOpenLogoutModal}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 transition cursor-pointer"
            title="Keluar Akun (Logout)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
