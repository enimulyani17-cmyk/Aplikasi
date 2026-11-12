import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
  Lock,
  Maximize2,
  ExternalLink,
  ChevronLeft,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Info,
  RefreshCw,
  Link2,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExamToken, Quiz, LiveStudent, ViolationRecord } from '../types';

interface SecureExamPlayerProps {
  token: ExamToken;
  quiz: Quiz;
  onStudentJoin: (student: LiveStudent) => void;
  onStudentViolation: (violation: ViolationRecord) => void;
  onStudentFinish: (studentId: string, score: number, answers: Record<number, string>) => void;
  onBackToTeacher: () => void;
}

function getGoogleFormEmbedUrl(url?: string): string {
  if (!url) return '';
  if (url.includes('?embedded=true') || url.includes('&embedded=true')) return url;
  if (url.includes('?')) return `${url}&embedded=true`;
  return `${url}?embedded=true`;
}

function extractFormId(url?: string): string {
  if (!url) return '-';
  const matchD = url.match(/\/d\/e\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];
  const matchDirect = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchDirect && matchDirect[1]) return matchDirect[1];
  return url.replace('https://docs.google.com/forms/', '').slice(0, 18);
}

export const SecureExamPlayer: React.FC<SecureExamPlayerProps> = ({
  token,
  quiz,
  onStudentJoin,
  onStudentViolation,
  onStudentFinish,
  onBackToTeacher,
}) => {
  // Setup step: 'registration' | 'waiting' | 'exam' | 'blocked' | 'finished'
  const [stage, setStage] = useState<'registration' | 'waiting' | 'exam' | 'blocked' | 'finished'>('registration');
  const [studentName, setStudentName] = useState('Yan');
  const [classGrade, setClassGrade] = useState('9B');
  const [absentNo, setAbsentNo] = useState('1');
  const [studentId, setStudentId] = useState<string>('');

  // Active exam view mode: 'google-form' (default for created Google Form) | 'interactive-cbt'
  const [viewMode, setViewMode] = useState<'google-form' | 'interactive-cbt'>('google-form');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  // CBT interactive state (as fallback or alternative)
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [violations, setViolations] = useState(0);
  const [penaltyRemaining, setPenaltyRemaining] = useState(0);
  const [penaltyMessage, setPenaltyMessage] = useState('');
  const [score, setScore] = useState<number | null>(null);

  // Target Google Form URL from token or quiz
  const rawFormUrl = token.googleFormUrl || quiz.googleFormUrl || '';
  const formEmbedUrl = getGoogleFormEmbedUrl(rawFormUrl);
  const formId = extractFormId(rawFormUrl);
  const isPlaceholderUrl = rawFormUrl.includes('Example') || rawFormUrl.includes('randomFormHash');

  // Violations & fullscreen detection
  const isExamActive = stage === 'exam';
  const violationsRef = useRef(violations);
  violationsRef.current = violations;

  const triggerViolation = (reason: string) => {
    if (!isExamActive || penaltyRemaining > 0) return;

    const newCount = violationsRef.current + 1;
    setViolations(newCount);

    const isBlocked = newCount > token.limit;

    // Log to teacher live monitoring
    onStudentViolation({
      id: `viol-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID'),
      studentName: studentName || 'Siswa',
      classGrade: classGrade || '-',
      token: token.token,
      reason,
      penaltySeconds: 10,
      isBlocked,
    });

    if (isBlocked) {
      setStage('blocked');
    } else {
      setPenaltyMessage(`Peringatan: Dilarang keluar fullscreen atau berpindah aplikasi! (${reason})`);
      setPenaltyRemaining(10);
    }
  };

  // Penalty countdown
  useEffect(() => {
    if (penaltyRemaining > 0) {
      const t = setTimeout(() => {
        setPenaltyRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [penaltyRemaining]);

  // Anti-cheat listeners during active exam
  useEffect(() => {
    if (!isExamActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('Pindah Tab / Minimize Browser');
      }
    };

    const handleWindowBlur = () => {
      triggerViolation('Kehilangan Fokus Layar / Split Screen');
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        triggerViolation('Keluar dari Mode Fullscreen');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isExamActive]);

  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    const newId = `stud-${Date.now()}`;
    setStudentId(newId);

    // Request fullscreen
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (_) {}

    const newStudent: LiveStudent = {
      id: newId,
      name: studentName.trim(),
      classGrade: classGrade.trim() || 'Umum',
      absentNo: absentNo.trim() || '1',
      token: token.token,
      status: token.waitingRoom && !token.waitingRoomStarted ? 'Terputus' : 'Mengerjakan',
      violations: 0,
      lastViolationReason: '—',
      lastSeen: 'Baru saja',
    };

    onStudentJoin(newStudent);

    if (token.waitingRoom && !token.waitingRoomStarted) {
      setStage('waiting');
    } else {
      setStage('exam');
    }
  };

  const handleSelectAnswer = (questionNumber: number, optionKey: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: optionKey,
    }));
  };

  const handleCompleteExam = () => {
    // Calculate score
    const questions = quiz.questions || [];
    let correctCount = 0;
    if (Object.keys(answers).length > 0) {
      questions.forEach((q) => {
        if (answers[q.number] === q.correctAnswer) {
          correctCount++;
        }
      });
      const calculatedScore = Math.round((correctCount / (questions.length || 1)) * 100);
      setScore(calculatedScore);
      if (studentId) {
        onStudentFinish(studentId, calculatedScore, answers);
      }
    } else {
      // Default completed from Google Form submission
      setScore(100);
      if (studentId) {
        onStudentFinish(studentId, 100, {});
      }
    }

    setStage('finished');
    setConfirmSubmitOpen(false);

    try {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (_) {}

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });
    } catch (_) {}
  };

  // 1. REGISTRATION STAGE
  if (stage === 'registration') {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center p-4 relative select-none">
        <button
          onClick={onBackToTeacher}
          className="absolute top-6 left-6 text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Panel Guru</span>
        </button>

        {/* Outer Card matching Screenshot 6 */}
        <div className="w-full max-w-md bg-[#0d1527] border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
          {/* Green Document Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#090f1d] border border-slate-700/80 flex items-center justify-center mb-5 shadow-inner">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-emerald-400"
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

          <h1 className="text-2xl font-black text-white tracking-tight">
            Secure Exam Player
          </h1>
          <p className="text-xs text-slate-400 mt-1 mb-2">
            Ujian: <strong className="text-white text-sm">{token.quizSubject || quiz.title}</strong>
          </p>

          {/* Connected Google Form indicator */}
          <div className="mb-5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[260px]">
              Google Form: {token.quizTitle}
            </span>
          </div>

          {/* PERATURAN WEB PLAYER BOX */}
          <div className="w-full bg-[#080d1a] border border-slate-800/90 rounded-2xl p-5 mb-6 text-left space-y-3">
            <h4 className="text-[11px] font-black tracking-wider text-slate-300 uppercase">
              PERATURAN WEB PLAYER:
            </h4>

            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <Maximize2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Layar akan masuk ke mode <strong>Fullscreen</strong> otomatis.</span>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Dilarang keluar dari mode Fullscreen atau pindah tab browser.</span>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-rose-400 text-sm leading-none shrink-0 mt-0.5">📱</span>
                <span className="text-rose-300">
                  Dilarang menggunakan Split Screen, Floating Apps, atau Picture-in-Picture.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Setiap pelanggaran memakan waktu penalti 10 detik.</span>
              </div>

              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  Maks. pelanggaran: <strong className="text-rose-400">{token.limit} kali</strong>. Lebih dari itu ujian ditutup permanen.
                </span>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleStartExam} className="w-full space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                NAMA LENGKAP
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Ketik nama Anda..."
                className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  KELAS
                </label>
                <input
                  type="text"
                  required
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                  placeholder="Contoh: XII IPA 1"
                  className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  ABSEN
                </label>
                <input
                  type="text"
                  required
                  value={absentNo}
                  onChange={(e) => setAbsentNo(e.target.value)}
                  placeholder="No"
                  className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_25px_rgba(16,185,129,0.35)] transition cursor-pointer"
              >
                Mulai Ujian Google Form
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. WAITING ROOM STAGE
  if (stage === 'waiting') {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-full max-w-md bg-[#0d1527] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
            <Clock className="w-8 h-8 animate-spin-slow" />
          </div>

          <h2 className="text-xl font-bold text-white">Menunggu di Ruang Tunggu</h2>
          <p className="text-xs text-slate-400">
            Halo <strong>{studentName}</strong> ({classGrade}), ujian belum dimulai oleh guru. Harap tetap berada di halaman ini. Soal Google Form akan otomatis muncul begitu guru menekan tombol mulai.
          </p>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-mono">
            Status: Terkoneksi ke server (Token: {token.token})
          </div>

          <button
            onClick={() => setStage('exam')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold transition cursor-pointer"
          >
            Mulai Manual (Simulasi Guru)
          </button>
        </div>
      </div>
    );
  }

  // 3. BLOCKED STAGE
  if (stage === 'blocked') {
    return (
      <div className="min-h-screen bg-rose-950/90 flex flex-col items-center justify-center p-6 text-center select-none text-white">
        <div className="w-full max-w-md bg-[#0f172a] border border-rose-500 rounded-3xl p-8 shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/30">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-rose-400">UJIAN DIBLOKIR</h2>
          <p className="text-xs text-slate-300">
            Batas pelanggaran maksimum ({token.limit}x) telah tercapai. Anda terdeteksi keluar dari layar ujian.
          </p>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs text-slate-400 space-y-1">
            <p><strong>Nama:</strong> {studentName}</p>
            <p><strong>Kelas:</strong> {classGrade}</p>
            <p><strong>Pelanggaran:</strong> {violations} kali</p>
          </div>

          <p className="text-[11px] text-amber-300">
            Silakan laporkan ke Guru Pengawas untuk membuka kunci melalui menu <strong>Ujian Live → Izinkan Ulang</strong>.
          </p>

          <button
            onClick={onBackToTeacher}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-semibold transition cursor-pointer"
          >
            Buka Panel Pengawas Guru
          </button>
        </div>
      </div>
    );
  }

  // 4. FINISHED STAGE
  if (stage === 'finished') {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-full max-w-md bg-[#0d1527] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-white">Ujian Selesai!</h2>
          <p className="text-xs text-slate-400">
            Terima kasih <strong>{studentName}</strong> ({classGrade}), jawaban Google Form Anda telah berhasil terkirim ke server Guru.
          </p>

          {score !== null && (
            <div className="py-6 bg-[#080d1a] border border-slate-800 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                STATUS KUIS GOOGLE FORM
              </span>
              <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
                TERKIRIM (SUBMITTED)
              </div>
              <p className="text-xs text-slate-400 mt-1">Nilai dapat direkap guru di menu Nilai Siswa</p>
            </div>
          )}

          <button
            onClick={onBackToTeacher}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
          >
            Kembali ke Panel Guru
          </button>
        </div>
      </div>
    );
  }

  // 5. ACTIVE EXAM STAGE: TAMPIL DI SOAL ADALAH GOOGLE FORM YANG DIBUAT
  return (
    <div className="min-h-screen bg-[#090f1e] text-slate-200 flex flex-col select-none relative">
      {/* Penalty Modal Overlay */}
      {penaltyRemaining > 0 && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#1e1b2e] border border-rose-500/40 rounded-3xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-rose-400">PELANGGARAN TERDETEKSI!</h3>
            <p className="text-xs text-slate-300">{penaltyMessage}</p>

            <div className="py-4">
              <span className="text-xs text-slate-400">Penalti Waktu Berhenti</span>
              <div className="text-4xl font-extrabold text-white font-mono mt-1">
                {penaltyRemaining}s
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Pelanggaran Anda: {violations} / {token.limit} batas
            </p>
          </div>
        </div>
      )}

      {/* Confirm Submit Modal */}
      {confirmSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0f172a] border border-slate-700 rounded-3xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Konfirmasi Selesai Ujian</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pastikan Anda sudah menekan tombol <strong>"Kirim" (Submit)</strong> di bagian bawah formulir Google Form sebelum mengakhiri sesi ujian.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setConfirmSubmitOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
              >
                Kembali ke Soal
              </button>
              <button
                onClick={handleCompleteExam}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition"
              >
                Ya, Sudah Kirim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar matching Screenshot 6 & 10 */}
      <header className="px-6 py-3 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            </svg>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              GURU: YANA PERIYANA
            </div>
            <div className="text-sm font-bold text-white leading-tight flex items-center gap-2">
              <span>{token.quizTitle || quiz.title}</span>
            </div>
          </div>

          <span className="ml-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            🔍 100%
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Identity Pill */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px]">Siswa:</span>
            <strong className="text-white">{studentName}</strong>
            <span className="text-slate-500">({classGrade} · #{absentNo})</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Tanpa Batas Waktu</span>
          </div>

          {/* Selesai Button matching Screenshot 10 */}
          <button
            onClick={() => setConfirmSubmitOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span>Selesai</span>
          </button>
        </div>
      </header>

      {/* Sub-toolbar: Mode Google Form vs Tampilan Soal Terintegrasi */}
      <div className="px-6 py-2 bg-[#0a0f1d] border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Google Form Aktif:</span>
          <span className="font-mono text-emerald-400 text-[11px] truncate max-w-[200px] sm:max-w-xs">
            {formId !== '-' ? `ID: ${formId}` : rawFormUrl}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px]">
            <button
              onClick={() => setViewMode('google-form')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'google-form'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3 h-3" />
              <span>Google Form</span>
            </button>
            <button
              onClick={() => setViewMode('interactive-cbt')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'interactive-cbt'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>CBT Soal</span>
            </button>
          </div>

          {rawFormUrl && (
            <a
              href={rawFormUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded-lg hover:text-emerald-400 transition"
              title="Buka Form Asli di Tab Baru (Google Drive)"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Main Examination Body: GOOGLE FORM YANG DIBUAT */}
      <div className="flex-1 flex flex-col bg-[#0b0f19]">
        {viewMode === 'google-form' ? (
          <div className="flex-1 w-full flex flex-col relative min-h-[calc(100vh-105px)]">
            {/* If the Google Form URL is a working URL */}
            {rawFormUrl && !isPlaceholderUrl ? (
              <iframe
                src={formEmbedUrl}
                title={`Google Form: ${token.quizTitle}`}
                className="w-full flex-1 border-0 min-h-[calc(100vh-105px)] bg-white"
                allow="camera; microphone; fullscreen; clipboard-read; clipboard-write"
                onLoad={() => setIframeLoaded(true)}
              />
            ) : (
              /* High-Fidelity Google Form Experience matching Google Form theme with auto-filled identity */
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl w-full mx-auto space-y-4">
                {/* Notice banner */}
                <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Soal ini disinkronkan otomatis dari Google Form: <strong>{token.quizTitle}</strong> (100 Poin).
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    ID-{token.token}
                  </span>
                </div>

                {/* Google Form Header Card */}
                <div className="bg-[#10172a] border-t-8 border-t-indigo-600 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    {token.quizTitle || quiz.title}
                  </h1>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Quiz dibuat oleh <strong>Yana Periyana</strong>. Isi data diri Anda di bagian pertama, lalu kerjakan soal di bagian berikutnya.
                  </p>
                  <div className="mt-3 text-[11px] font-mono text-emerald-400">
                    [Quiz ID: {token.quizId || quiz.id}] · Total Bobot Nilai: 100
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-rose-400 font-semibold">
                    * Menunjukkan pertanyaan yang wajib diisi
                  </div>
                </div>

                {/* Section 1: Data Diri Siswa matching Code.gs */}
                <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
                  <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider pb-2 border-b border-slate-800">
                    Bagian 1: Data Diri Siswa
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full bg-[#0a0f1d] border-b-2 border-slate-700 focus:border-indigo-500 rounded-t-lg px-3 py-2 text-xs text-white focus:outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Nomor Absen <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={absentNo}
                        onChange={(e) => setAbsentNo(e.target.value)}
                        className="w-full bg-[#0a0f1d] border-b-2 border-slate-700 focus:border-indigo-500 rounded-t-lg px-3 py-2 text-xs text-white focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Kelas <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={classGrade}
                        onChange={(e) => setClassGrade(e.target.value)}
                        className="w-full bg-[#0a0f1d] border-b-2 border-slate-700 focus:border-indigo-500 rounded-t-lg px-3 py-2 text-xs text-white focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Soal Ujian (Exact questions created with answer keys & points) */}
                <div className="space-y-4">
                  <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 text-xs">
                    <h4 className="font-bold text-white text-sm">Bagian 2: Soal Ujian</h4>
                    <p className="text-slate-300 text-xs mt-0.5">
                      Kerjakan soal berikut dengan teliti. Pilih satu jawaban yang paling tepat. Total nilai: 100.
                    </p>
                  </div>

                  {quiz.questions.map((q, idx) => {
                    const isAnswered = answers[q.number];
                    const pointsPerItem = Math.floor(100 / (quiz.questions.length || 1));

                    return (
                      <div
                        key={q.number}
                        className="bg-[#10172a] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition hover:border-slate-700"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold text-white leading-relaxed">
                            <span className="font-mono text-indigo-400 mr-2">{q.number}.</span>
                            {q.question} <span className="text-rose-500">*</span>
                          </p>
                          <span className="text-[11px] font-mono text-emerald-400 shrink-0 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold">
                            {pointsPerItem} poin
                          </span>
                        </div>

                        {/* Multiple Choice Options */}
                        <div className="space-y-2.5 pt-1">
                          {q.options.map((opt) => {
                            const selected = isAnswered === opt.key;
                            return (
                              <label
                                key={opt.key}
                                onClick={() => handleSelectAnswer(q.number, opt.key)}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                                  selected
                                    ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-sm'
                                    : 'bg-[#0a0f1d] border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                    selected
                                      ? 'border-indigo-400 bg-indigo-500'
                                      : 'border-slate-600'
                                  }`}
                                >
                                  {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </span>
                                <span className="font-mono font-bold text-slate-400">{opt.key}.</span>
                                <span className="text-sm font-medium">{opt.text}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Submit button at bottom */}
                <div className="py-6 flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-400">
                    Terjawab: <strong className="text-white">{Object.keys(answers).length}</strong> dari {quiz.questions.length} soal
                  </span>

                  <button
                    onClick={() => setConfirmSubmitOpen(true)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-black text-sm text-slate-950 shadow-lg shadow-emerald-500/25 transition cursor-pointer flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Formulir (Submit)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Interactive CBT Mode */
          <div className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 font-bold text-xs flex items-center justify-center font-mono">
                    {quiz.questions[0]?.number || 1}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Soal Ujian {quiz.title} (Total: {quiz.questions.length} Butir)
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Google Form: <strong className="text-emerald-400">{formId}</strong>
                </div>
              </div>

              <div className="space-y-4">
                {quiz.questions.map((q) => (
                  <div key={q.number} className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
                    <p className="text-sm text-white font-medium">
                      {q.number}. {q.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleSelectAnswer(q.number, opt.key)}
                          className={`p-3 rounded-xl text-left text-xs flex items-center gap-2 border transition ${
                            answers[q.number] === opt.key
                              ? 'bg-indigo-600/30 border-indigo-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="font-bold text-indigo-400">{opt.key}.</span>
                          <span>{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 flex justify-end">
              <button
                onClick={() => setConfirmSubmitOpen(true)}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-lg"
              >
                Kirim Jawaban
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
