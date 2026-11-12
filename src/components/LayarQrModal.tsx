import React, { useState } from 'react';
import {
  X,
  Play,
  Copy,
  Check,
  Users,
  ExternalLink,
  QrCode,
  Share2,
  FileSpreadsheet,
} from 'lucide-react';
import { ExamToken, LiveStudent } from '../types';

interface LayarQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: ExamToken;
  students: LiveStudent[];
  onStartExam: () => void;
  onLaunchStudentView: () => void;
}

function extractFormId(url?: string, explicitId?: string): string {
  if (explicitId) return explicitId;
  if (!url) return '-';
  const matchD = url.match(/\/d\/e\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];
  const matchDirect = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchDirect && matchDirect[1]) return matchDirect[1];
  return url.slice(0, 20);
}

export const LayarQrModal: React.FC<LayarQrModalProps> = ({
  isOpen,
  onClose,
  token,
  students,
  onStartExam,
  onLaunchStudentView,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [copiedFormId, setCopiedFormId] = useState(false);
  const [copiedQuizId, setCopiedQuizId] = useState(false);
  const [qrType, setQrType] = useState<'student' | 'gform'>('student');

  if (!isOpen) return null;

  const connectedCount = students.filter((s) => s.token === token.token).length;
  const examUrl = `${window.location.origin}?token=${token.token}`;
  const formId = extractFormId(token.googleFormUrl, token.googleFormId);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(examUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyTemplate = () => {
    const message = `Halo Siswa! Silakan bergabung ke Ujian:\n📚 Mata Pelajaran / Materi: ${
      token.label
    } - ${token.quizSubject || token.quizTitle}\n🔑 Kode Token: ${token.token}\n🔗 Link Ujian: ${examUrl}`;
    navigator.clipboard.writeText(message);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleCopyFormId = () => {
    navigator.clipboard.writeText(formId);
    setCopiedFormId(true);
    setTimeout(() => setCopiedFormId(false), 2000);
  };

  const handleCopyQuizId = () => {
    navigator.clipboard.writeText(token.quizId);
    setCopiedQuizId(true);
    setTimeout(() => setCopiedQuizId(false), 2000);
  };

  const currentQrData =
    qrType === 'gform' && token.googleFormUrl ? token.googleFormUrl : examUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0d1527] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center my-auto">
        {/* Top controls */}
        <div className="w-full flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5 text-left">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>QR Quiz & Layar Ujian Siswa</span>
              </h3>
              <p className="text-xs text-slate-400">
                {token.label} · {token.quizSubject || token.quizTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Selector Tab (Student Player vs Google Form) */}
        <div className="flex items-center gap-2 mb-4 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setQrType('student')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              qrType === 'student'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Quiz Siswa (Secure Player)</span>
          </button>
          {token.googleFormUrl && (
            <button
              onClick={() => setQrType('gform')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                qrType === 'gform'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>QR Langsung Google Form</span>
            </button>
          )}
        </div>

        {/* Big Token Display */}
        <div className="mb-3">
          <span className="text-[11px] uppercase tracking-widest text-indigo-400 font-bold">
            KODE TOKEN UJIAN SISWA
          </span>
          <div className="text-5xl font-black tracking-widest text-white font-mono mt-0.5 drop-shadow-md">
            {token.token}
          </div>
        </div>

        {/* QR Code Canvas */}
        <div className="p-4 bg-white rounded-2xl shadow-xl shadow-indigo-500/10 mb-4 inline-block">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
              currentQrData
            )}`}
            alt="QR Code Quiz Siswa"
            className="w-44 h-44 sm:w-48 sm:h-48 block"
          />
        </div>

        <p className="text-xs text-slate-300 max-w-sm mb-4">
          Arahkan siswa memindai QR di atas menggunakan kamera HP, atau bagikan link ujian di bawah ke WhatsApp kelas.
        </p>

        {/* ID yang ada di Google Form & Quiz ID Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mb-4 text-left">
          {/* ID Google Form */}
          <div className="bg-[#080d1a] border border-slate-800 p-3 rounded-2xl">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
              ID yang ada di Google Form
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-emerald-400 truncate">
                {formId}
              </span>
              <button
                onClick={handleCopyFormId}
                className="text-slate-400 hover:text-emerald-400 transition cursor-pointer shrink-0"
                title="Salin ID Google Form"
              >
                {copiedFormId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {token.googleFormUrl && (
              <a
                href={token.googleFormUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 mt-1.5"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Buka Form di Google</span>
              </a>
            )}
          </div>

          {/* Quiz ID */}
          <div className="bg-[#080d1a] border border-slate-800 p-3 rounded-2xl">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
              Quiz ID (soalpintar.ai)
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-indigo-300 truncate">
                {token.quizId}
              </span>
              <button
                onClick={handleCopyQuizId}
                className="text-slate-400 hover:text-indigo-400 transition cursor-pointer shrink-0"
                title="Salin Quiz ID"
              >
                {copiedQuizId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className="text-[11px] text-slate-500 mt-1.5 block">
              Materi: {token.quizTitle}
            </span>
          </div>
        </div>

        {/* Broadcast WA Template */}
        <div className="w-full max-w-lg mb-5">
          <button
            onClick={handleCopyTemplate}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            title="Salin pesan broadcast WhatsApp untuk siswa"
          >
            {copiedTemplate ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-emerald-400" />}
            <span>{copiedTemplate ? 'Pesan WA Tersalin!' : 'Salin Pesan Broadcast WA Kelas'}</span>
          </button>
        </div>

        {/* Waiting Room & Start Controls */}
        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {connectedCount} Siswa Terhubung
              </p>
              <p className="text-xs text-slate-400">
                {token.waitingRoom
                  ? token.waitingRoomStarted
                    ? 'Ujian sudah dimulai'
                    : 'Menunggu di ruang tunggu'
                  : 'Mode langsung aktif'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLaunchStudentView}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              Buka Player
            </button>

            {token.waitingRoom && !token.waitingRoomStarted ? (
              <button
                onClick={onStartExam}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Mulai Mengerjakan Soal</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Ujian Aktif</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
