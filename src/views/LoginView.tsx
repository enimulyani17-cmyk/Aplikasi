import React, { useState } from 'react';
import {
  ArrowRight,
  GraduationCap,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  KeyRound,
  Check,
  BookOpen,
  Chrome,
  Zap,
  Lock,
  Mail,
  Building2,
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
  onOpenStudentPlayer: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onOpenStudentPlayer,
}) => {
  const [activeTab, setActiveTab] = useState<'guru' | 'siswa'>('guru');
  const [email, setEmail] = useState('enimulyani17@guru.smp.belajar.id');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [studentTokenInput, setStudentTokenInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmitGuru = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!email.trim() || !password.trim()) {
      setLoginError('Email dan password wajib diisi.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email.trim());
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('enimulyani17@guru.smp.belajar.id');
    }, 600);
  };

  const handleStudentTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentTokenInput.trim()) return;

    // Direct student to player
    onOpenStudentPlayer();
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Dynamic Background Lighting Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-sky-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center justify-center shadow-lg">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-emerald-400"
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
          </div>

          <div>
            <h1 className="text-base font-black text-sky-400 tracking-tight flex items-center gap-1.5">
              <span>soalpintar.ai</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Platform Ujian Online Guru Indonesia</p>
          </div>
        </div>

        <button
          onClick={onOpenStudentPlayer}
          className="px-3.5 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 border border-slate-800 text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
        >
          <GraduationCap className="w-4 h-4" />
          <span className="hidden sm:inline">Masuk Mode Siswa (Ujian)</span>
        </button>
      </header>

      {/* Main Login Body */}
      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-6 z-10">
        {/* Left Side: Brand Showcase & Value Props (Desktop) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col space-y-6 pr-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generasi Baru Platform Ujian Cerdas</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Buat Soal & Kelola Ujian Online Dalam <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">Hitungan Detik</span>
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            Terintegrasi otomatis dengan Google Form 100 Poin di Drive Anda, sistem anti-kecurangan Mode Lockdown (Web & Android), serta rekapitulasi nilai siswa secara real-time.
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#0d1527] border border-slate-800/90 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">AI Generator Soal</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Kurikulum Merdeka & K13</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0d1527] border border-slate-800/90 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 fill-emerald-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Google Form Auto</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Otomatis 100 Poin di Drive</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0d1527] border border-slate-800/90 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Lockdown Anti-Cheat</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Deteksi keluar tab & app</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0d1527] border border-slate-800/90 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Akun Belajar.id</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Dukungan Login Guru</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: High-Fidelity Login Card */}
        <div className="lg:col-span-6 max-w-md w-full mx-auto">
          <div className="bg-[#0d1527] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Top Glow bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-teal-500" />

            {/* Role Switcher Tabs */}
            <div className="flex rounded-2xl bg-[#070c18] p-1.5 border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('guru')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'guru'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Portal Guru</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('siswa')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'siswa'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Masuk Ujian Siswa</span>
              </button>
            </div>

            {/* TAB 1: GURU LOGIN */}
            {activeTab === 'guru' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Selamat Datang, Guru!</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Silakan masuk dengan akun guru atau akun <strong className="text-slate-200">@belajar.id</strong> Anda.
                  </p>
                </div>

                {/* Single-Click Google Belajar.id Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2.5 transition cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  <Chrome className="w-4 h-4 text-rose-400" />
                  <span>Lanjutkan dengan Akun Google / Belajar.id</span>
                </button>

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-[#0d1527] px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    atau email & password
                  </span>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-medium">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleSubmitGuru} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Alamat Email Guru</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@guru.smp.belajar.id"
                      className="w-full bg-[#070c18] border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition font-medium"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Password</span>
                      </label>

                      <a
                        href="#lupa-password"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('Untuk mereset password, hubungi Administrator Sekolah atau gunakan fitur reset Google.');
                        }}
                        className="text-[11px] text-indigo-400 hover:underline"
                      >
                        Lupa password?
                      </a>
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-[#070c18] border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition font-medium pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded accent-indigo-500 cursor-pointer"
                      />
                      <span>Ingat sesi saya</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4" />
                        <span>Masuk ke Dashboard Guru</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Demo Login Preset Button */}
                <div className="pt-2 border-t border-slate-800/80 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('enimulyani17@guru.smp.belajar.id');
                      setPassword('password123');
                      onLoginSuccess('enimulyani17@guru.smp.belajar.id');
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 transition"
                  >
                    <span>⚡ Masuk Cepat Demo Guru (Yana Periyana)</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SISWA TOKEN QUICK LOGIN */}
            {activeTab === 'siswa' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Masuk Ujian Siswa</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Masukkan Kode Token 7 Digit yang diberikan oleh Guru Pengawas Anda.
                  </p>
                </div>

                <form onSubmit={handleStudentTokenSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      KODE TOKEN UJIAN
                    </label>
                    <input
                      type="text"
                      required
                      value={studentTokenInput}
                      onChange={(e) => setStudentTokenInput(e.target.value.toUpperCase())}
                      placeholder="Contoh: ZJT0P4M"
                      maxLength={10}
                      className="w-full bg-[#070c18] border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3.5 text-base font-mono font-bold tracking-widest text-emerald-300 uppercase placeholder-slate-600 focus:outline-none transition text-center"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/30"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Mulai Mengerjakan Ujian</span>
                  </button>
                </form>

                <div className="p-3.5 rounded-2xl bg-[#070c18] border border-slate-800 text-xs text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300">💡 Petunjuk Siswa:</p>
                  <p className="text-[11px] leading-relaxed">
                    Setiap token akan membawa Anda langsung ke halaman pengerjaan soal dengan perlindungan anti-kecurangan mode fullscreen.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto text-center text-[11px] text-slate-500 z-10 py-2 border-t border-slate-800/60">
        © 2026 soalpintar.ai — Platform Ujian Cerdas Guru & Sekolah Indonesia.
      </footer>
    </div>
  );
};
