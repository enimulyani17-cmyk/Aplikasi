import React, { useState } from 'react';
import {
  AlertTriangle,
  Radio,
  KeyRound,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Smartphone,
  Pause,
  Play,
  Trash2,
  Share2,
  FileSpreadsheet,
  Link2,
  Pencil,
  ShieldAlert,
  X,
  Info,
} from 'lucide-react';
import { ExamToken, GoogleFormItem, Quiz } from '../types';

interface TokenSiswaViewProps {
  tokens: ExamToken[];
  forms: GoogleFormItem[];
  quizzes: Quiz[];
  activeExamStudentsCount: number;
  onCreateToken: (newToken: ExamToken) => void;
  onUpdateToken: (tokenString: string, updated: Partial<ExamToken>) => void;
  onDeleteToken: (tokenString: string) => void;
  onToggleTokenStatus: (tokenString: string) => void;
  onOpenLayarQr: (token: ExamToken) => void;
  onOpenPanduan: () => void;
  onOpenUjianLive: (tokenString?: string) => void;
  onOpenStudentWebVersion: (tokenString?: string) => void;
}

function extractFormId(url?: string, explicitId?: string): string {
  if (explicitId) return explicitId;
  if (!url) return '-';
  const matchD = url.match(/\/d\/e\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];
  const matchDirect = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchDirect && matchDirect[1]) return matchDirect[1];
  return url.replace('https://docs.google.com/forms/', '').slice(0, 18);
}

export const TokenSiswaView: React.FC<TokenSiswaViewProps> = ({
  tokens,
  forms,
  quizzes,
  activeExamStudentsCount,
  onCreateToken,
  onUpdateToken,
  onDeleteToken,
  onToggleTokenStatus,
  onOpenLayarQr,
  onOpenPanduan,
  onOpenUjianLive,
  onOpenStudentWebVersion,
}) => {
  const [selectedForm, setSelectedForm] = useState(forms[0]?.name || 'Segitiga (SMP)');
  const [label, setLabel] = useState('Ulangan');
  const [limit, setLimit] = useState(1);
  const [expiresAt, setExpiresAt] = useState('');
  const [waitingRoom, setWaitingRoom] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(
    tokens.length > 0 ? `Token ${tokens[0].token} berhasil dibuat dan otomatis disinkronkan ke Cloudflare! ✓` : null
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Edit Token Modal State
  const [editingToken, setEditingToken] = useState<ExamToken | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editLimit, setEditLimit] = useState(1);
  const [editGoogleFormUrl, setEditGoogleFormUrl] = useState('');

  // Form Warning Modal State (when opening placeholder URLs)
  const [warningFormItem, setWarningFormItem] = useState<{ url: string; token: string } | null>(null);

  const handleGenerateRandomToken = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < 7; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  const handleCreateTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tokenCode = handleGenerateRandomToken();

    const matchedQuiz =
      quizzes.find((q) => q.title.toLowerCase().includes(selectedForm.toLowerCase())) ||
      quizzes[0];

    const matchedFormObj = forms.find((f) => f.name === selectedForm);
    const formUrl = matchedFormObj?.url || matchedQuiz?.googleFormUrl;
    const formId = extractFormId(formUrl);

    const newToken: ExamToken = {
      token: tokenCode,
      label: label.trim() || 'Ulangan',
      quizId: matchedQuiz ? matchedQuiz.id : 'quiz-1',
      quizTitle: matchedQuiz ? matchedQuiz.title : selectedForm,
      quizSubject: matchedQuiz ? matchedQuiz.subject : 'IPA',
      limit: Number(limit) || 1,
      status: 'Aktif',
      expiresAt: expiresAt || null,
      waitingRoom,
      waitingRoomStarted: false,
      createdAt: 'Baru saja',
      googleFormUrl: formUrl,
      googleFormId: formId !== '-' ? formId : undefined,
    };

    onCreateToken(newToken);
    setToastMessage(`Token ${tokenCode} berhasil dibuat dan otomatis disinkronkan ke Cloudflare! ✓`);
  };

  const copyToClipboard = (text: string, keyIdentifier: string, feedbackLabel?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyIdentifier);
    if (feedbackLabel) {
      setToastMessage(feedbackLabel);
    }
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleOpenEditModal = (tok: ExamToken) => {
    setEditingToken(tok);
    setEditLabel(tok.label);
    setEditLimit(tok.limit);
    setEditGoogleFormUrl(tok.googleFormUrl || '');
  };

  const handleSaveEditToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingToken) return;

    onUpdateToken(editingToken.token, {
      label: editLabel.trim(),
      limit: Number(editLimit) || 1,
      googleFormUrl: editGoogleFormUrl.trim(),
      googleFormId: extractFormId(editGoogleFormUrl.trim()),
    });

    setToastMessage(`Token ${editingToken.token} berhasil diperbarui! ✓`);
    setEditingToken(null);
  };

  const handleOpenGoogleFormSafely = (url: string, tokenCode: string) => {
    if (url.includes('Example') || url.includes('randomFormHash')) {
      setWarningFormItem({ url, token: tokenCode });
    } else {
      window.open(url, '_blank', 'noreferrer');
    }
  };

  const selectedFormObject = forms.find((f) => f.name === selectedForm);
  const currentFormIdPreview = extractFormId(selectedFormObject?.url);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Token Siswa</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Buat dan kelola token akses ujian untuk siswa
        </p>
      </div>

      {/* Cloudflare sync success toast banner matching Screenshot 4 */}
      {toastMessage && (
        <div className="px-4 py-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              ✓
            </span>
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-400 hover:text-white text-xs cursor-pointer ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Panduan Penggunaan Box matching Screenshot 4 */}
      <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Panduan Penggunaan & Alternatif Kendala Perangkat
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Ujian mendukung "Aplikasi Android" (Mode Lockdown) dan "Web Browser" (Alternatif Cepat).
              Baca petunjuk penyelesaian masalah spesifikasi HP/browser siswa di sini.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPanduan}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 shrink-0 transition cursor-pointer shadow-sm"
        >
          <span>📖</span>
          <span>Lihat Panduan Ujian</span>
        </button>
      </div>

      {/* Siswa Sedang Ujian Bar matching Screenshot 4 */}
      <div className="bg-[#10172a] border border-slate-800 rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Siswa sedang ujian: {activeExamStudentsCount}
            </h4>
            <p className="text-xs text-slate-400">
              Paket Anda tidak membatasi jumlah siswa ujian bersamaan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onOpenUjianLive()}
            className="px-4 py-2 rounded-xl bg-[#1e293b] hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ujian Live & Layar QR</span>
          </button>
        </div>
      </div>

      {/* Form Buat Token Baru matching Screenshot 4 & 8 */}
      <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
            <span className="w-4 h-4 rounded-full border border-indigo-400 flex items-center justify-center text-[10px]">
              +
            </span>
            <span>Buat Token Baru</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenStudentWebVersion(tokens[0]?.token)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition cursor-pointer border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span>Masukkan Token Versi Web</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleCreateTokenSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Google Form */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Google Form
              </label>
              <select
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              >
                {forms.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
                {forms.length === 0 && <option value="Segitiga (SMP)">Segitiga (SMP)</option>}
              </select>

              {/* Show ID Google Form under dropdown */}
              {currentFormIdPreview !== '-' && (
                <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400 font-mono truncate">
                  <span className="text-emerald-400 font-semibold">ID Form:</span>
                  <span className="truncate">{currentFormIdPreview}</span>
                </div>
              )}
            </div>

            {/* Label */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Contoh: Kelas 9A - UTS Biologi"
                className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Batas Pelanggaran */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Batas Pelanggaran Keluar App/Fullscreen
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 1)}
                className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Kedaluwarsa */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Kedaluwarsa (opsional)
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Checkbox Ruang Tunggu */}
          <div className="bg-[#0a0f1d] border border-slate-800/80 rounded-xl p-3 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="waitingRoomCheck"
              checked={waitingRoom}
              onChange={(e) => setWaitingRoom(e.target.checked)}
              className="mt-0.5 rounded accent-indigo-500 cursor-pointer"
            />
            <label htmlFor="waitingRoomCheck" className="text-xs text-slate-300 cursor-pointer">
              <span className="font-bold text-white">Ruang tunggu:</span> siswa menunggu dan baru
              mulai serentak saat saya klik{' '}
              <span className="font-semibold text-emerald-400">"Mulai Mengerjakan Soal"</span>.
              <p className="text-[11px] text-slate-500 mt-0.5">
                Berlaku untuk web dan aplikasi Android. Tombol mulai ada di menu Ujian Live → Layar QR.
              </p>
            </label>
          </div>

          <button
            type="submit"
            className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span>Buat Token</span>
          </button>
        </form>
      </div>

      {/* Table of Tokens matching Screenshot 4 */}
      <div className="bg-[#10172a] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f1d] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-semibold">
              <tr>
                <th className="px-6 py-3.5">TOKEN</th>
                <th className="px-4 py-3.5">LABEL</th>
                <th className="px-4 py-3.5">QUIZ</th>
                <th className="px-4 py-3.5">LIMIT</th>
                <th className="px-4 py-3.5">STATUS</th>
                <th className="px-4 py-3.5">KEDALUWARSA</th>
                <th className="px-6 py-3.5 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {tokens.map((item) => {
                const formId = extractFormId(item.googleFormUrl, item.googleFormId);
                const examUrl = `${window.location.origin}?token=${item.token}`;

                return (
                  <tr key={item.token} className="hover:bg-slate-800/40 transition">
                    {/* TOKEN */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-300 bg-indigo-950/50 border border-indigo-900 px-2 py-1 rounded text-xs tracking-wider">
                          {item.token}
                        </span>
                        <button
                          onClick={() => copyToClipboard(item.token, item.token, `Token ${item.token} tersalin!`)}
                          className="text-slate-500 hover:text-slate-200 cursor-pointer p-1 rounded hover:bg-slate-800"
                          title="Salin Kode Token Saja"
                        >
                          {copiedKey === item.token ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* LABEL */}
                    <td className="px-4 py-4 font-semibold text-white">{item.label}</td>

                    {/* QUIZ (with ID yang ada di Google Form & Quiz ID) */}
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-slate-200 font-bold text-xs flex items-center gap-1.5">
                          <span>{item.quizSubject || item.quizTitle}</span>
                        </div>

                        {/* ID yang ada di Google Form */}
                        <div className="mt-1 flex flex-col gap-0.5">
                          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                            <span className="text-slate-500 font-sans font-normal text-[10px]">ID Form:</span>
                            <span className="font-semibold truncate max-w-[130px]">{formId}</span>
                            {formId !== '-' && (
                              <button
                                onClick={() => copyToClipboard(formId, `fid-${item.token}`, `ID Google Form (${formId}) tersalin!`)}
                                className="text-slate-500 hover:text-emerald-400 cursor-pointer"
                                title="Salin ID Google Form"
                              >
                                {copiedKey === `fid-${item.token}` ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-[10px] font-mono text-indigo-400">
                            <span className="text-slate-500 font-sans font-normal">Quiz ID:</span>
                            <span>{item.quizId}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* LIMIT */}
                    <td className="px-4 py-4 font-mono font-bold text-rose-400">{item.limit}x</td>

                    {/* STATUS */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          item.status === 'Aktif'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{item.status}</span>
                      </span>
                    </td>

                    {/* KEDALUWARSA */}
                    <td className="px-4 py-4 text-slate-400 font-mono">
                      {item.expiresAt || '—'}
                    </td>

                    {/* AKSI matching Screenshot 4 */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        {/* 1. QR Quiz Icon Button */}
                        <button
                          onClick={() => onOpenLayarQr(item)}
                          className="p-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800 text-indigo-400 hover:text-white transition cursor-pointer shadow-sm"
                          title="QR Quiz (Tampilkan di Layar / Proyektor)"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {/* 2. Salin Link Siswa Button */}
                        <button
                          onClick={() => {
                            copyToClipboard(
                              examUrl,
                              `link-${item.token}`,
                              `Link Siswa (${item.token}) berhasil disalin!`
                            );
                          }}
                          className="p-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/60 text-indigo-300 hover:text-white transition cursor-pointer shadow-sm"
                          title="Salin Link Siswa"
                        >
                          {copiedKey === `link-${item.token}` ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Link2 className="w-4 h-4 text-indigo-400" />
                          )}
                        </button>

                        {/* 3. Lockdown / Anti-Cheat Icon */}
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg bg-amber-950/30 hover:bg-amber-900/50 border border-amber-800/40 text-amber-400 transition cursor-pointer"
                          title="Pengaturan Anti-Cheat & Batas Pelanggaran"
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </button>

                        {/* 4. Player Siswa / Android Icon */}
                        <button
                          onClick={() => onOpenStudentWebVersion(item.token)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition cursor-pointer"
                          title="Buka Player Siswa (Web / Android)"
                        >
                          <Smartphone className="w-4 h-4" />
                        </button>

                        {/* 5. Edit Token Icon */}
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 text-purple-300 transition cursor-pointer"
                          title="Edit Token"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* 6. Jeda / Aktifkan Icon */}
                        <button
                          onClick={() => onToggleTokenStatus(item.token)}
                          className="p-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50 text-amber-400 transition cursor-pointer"
                          title={item.status === 'Aktif' ? 'Jeda Token' : 'Aktifkan Token'}
                        >
                          {item.status === 'Aktif' ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>

                        {/* 7. Hapus Icon */}
                        <button
                          onClick={() => onDeleteToken(item.token)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-400 transition cursor-pointer"
                          title="Hapus Token"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {tokens.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <KeyRound className="w-10 h-10 text-slate-600 mb-3 stroke-[1.2]" />
                      <p className="text-base font-bold text-slate-300">Belum ada token</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Gunakan form di atas untuk membuat token pertama
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Token Modal */}
      {editingToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Edit Token {editingToken.token}</h3>
              </div>
              <button
                onClick={() => setEditingToken(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditToken} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Label Ujian</label>
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  Batas Pelanggaran Fullscreen/Pindah Tab
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={editLimit}
                  onChange={(e) => setEditLimit(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  URL Google Form Terhubung
                </label>
                <input
                  type="text"
                  value={editGoogleFormUrl}
                  onChange={(e) => setEditGoogleFormUrl(e.target.value)}
                  placeholder="https://docs.google.com/forms/d/..."
                  className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-[11px]"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  ID Form akan otomatis diekstrak dari URL di atas.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingToken(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Warning Modal for Placeholder Google Form URLs */}
      {warningFormItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0f172a] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Informasi Google Form</h3>
                <p className="text-[11px] text-slate-400">Token: {warningFormItem.token}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-slate-800 text-xs text-slate-300 space-y-2">
              <p>
                Link formulir saat ini menggunakan template/placeholder. Di Google Drive resmi, form hanya akan tersedia jika telah dibuat melalui menu <strong>Bank Soal → Buat Google Form Otomatis</strong> dengan Apps Script Anda.
              </p>
              <div className="font-mono text-[11px] text-amber-300/80 bg-slate-900/90 p-2 rounded-lg truncate">
                {warningFormItem.url}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 text-xs">
              <button
                onClick={() => {
                  setWarningFormItem(null);
                  onOpenStudentWebVersion(warningFormItem.token);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition cursor-pointer"
              >
                Gunakan Secure Exam Player (Soal Otomatis Muncul)
              </button>

              <button
                onClick={() => {
                  const targetUrl = warningFormItem.url;
                  setWarningFormItem(null);
                  window.open(targetUrl, '_blank', 'noreferrer');
                }}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition cursor-pointer"
              >
                Tetap Buka di Google Drive
              </button>

              <button
                onClick={() => setWarningFormItem(null)}
                className="text-center text-slate-500 hover:text-slate-300 py-1"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
