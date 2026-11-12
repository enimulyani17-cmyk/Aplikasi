import React, { useState } from 'react';
import {
  Eye,
  ExternalLink,
  Trash2,
  Sparkles,
  Key,
  Search,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  FolderOpen,
  X,
  Shuffle,
  AlertTriangle,
  Link2,
  Settings,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Quiz } from '../types';
import { GAS_SCRIPT_CODE } from '../data/initialData';

interface BankSoalViewProps {
  quizzes: Quiz[];
  gasUrl: string;
  onDeleteQuiz: (quizId: string) => void;
  onOpenLihatSoal: (quiz: Quiz) => void;
  onNavigateToGenerator: () => void;
  onNavigateToSettings?: () => void;
  onCreateToken: (quiz: Quiz) => void;
  onFormCreated: (quizId: string, formUrl: string, formName: string) => void;
}

export const BankSoalView: React.FC<BankSoalViewProps> = ({
  quizzes,
  gasUrl,
  onDeleteQuiz,
  onOpenLihatSoal,
  onNavigateToGenerator,
  onNavigateToSettings,
  onCreateToken,
  onFormCreated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for "Buat Google Form Otomatis"
  const [activeQuizForForm, setActiveQuizForForm] = useState<Quiz | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'auto' | 'manual'>('auto');
  const [manualFormUrl, setManualFormUrl] = useState('');
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProgressStep, setCurrentProgressStep] = useState(0);
  const [creationError, setCreationError] = useState<string | null>(null);
  const [generatedFormResult, setGeneratedFormResult] = useState<{
    formUrl: string;
    editUrl: string;
    formId: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const filtered = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isValidRealFormUrl = (url?: string) => {
    if (!url) return false;
    if (url.includes('Example') || url.includes('randomFormHash') || url.includes('published_id')) {
      return false;
    }
    return url.startsWith('https://docs.google.com/forms/');
  };

  const handleOpenFormModal = (quiz: Quiz) => {
    setActiveQuizForForm(quiz);
    setManualFormUrl('');
    setModalTab('auto');
    setCreationError(null);
    setGeneratedFormResult(
      isValidRealFormUrl(quiz.googleFormUrl)
        ? {
            formUrl: quiz.googleFormUrl!,
            editUrl: quiz.googleFormUrl!.replace('/viewform', '/edit'),
            formId: 'form-' + quiz.id,
          }
        : null
    );
    setIsProcessing(false);
    setCurrentProgressStep(0);
    setIsModalOpen(true);
  };

  const handleExecuteCreateForm = async () => {
    if (!activeQuizForForm) return;

    setCreationError(null);

    // Validate that gasUrl is provided and properly formatted
    const isInvalidGasUrl =
      !gasUrl ||
      !gasUrl.includes('/exec') ||
      gasUrl.includes('AKfycbyYXlFiIMF6bHPzgRTeFPfw_1qCcLQtCQy7A9f9XVYEAPcAyshLc0HIVYrJ2g9wB9Q8s');

    if (isInvalidGasUrl) {
      setCreationError(
        'URL Google Apps Script belum dikonfigurasi di menu Settings. Untuk membuat Google Form asli di Google Drive Anda, ikuti panduan setup 1x berikut.'
      );
      return;
    }

    setIsProcessing(true);
    setCurrentProgressStep(1);

    // Prepare payload in exact schema expected by Code.gs v3.2
    const formattedQuestions = activeQuizForForm.questions.map((q) => {
      const optionsArray = q.options.map((o) => `${o.key}. ${o.text}`);
      const answerIndex = q.options.findIndex((o) => o.key === q.correctAnswer);
      return {
        number: q.number,
        question: q.question,
        options: optionsArray,
        answer: answerIndex >= 0 ? answerIndex : 0,
        type: 'multiple_choice',
      };
    });

    const payload = {
      quiz_id: activeQuizForForm.id,
      title: activeQuizForForm.title,
      guru_name: 'Yana Periyana',
      folder_name: 'Yana Periyana',
      questions: formattedQuestions,
      shuffle_questions: shuffleQuestions,
      shuffle_options: shuffleOptions,
    };

    // Step 2: Preparing Drive Folder
    await new Promise((r) => setTimeout(r, 600));
    setCurrentProgressStep(2);

    // Step 3: Creating Questions and 100 points
    await new Promise((r) => setTimeout(r, 700));
    setCurrentProgressStep(3);

    let formPublishedUrl = '';
    let formEditUrl = '';
    let formId = '';

    try {
      const res = await fetch(gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData.status === 'success' && resData.form_url) {
          formPublishedUrl = resData.form_url;
          formEditUrl = resData.edit_url || resData.form_url.replace('/viewform', '/edit');
          formId = resData.form_id || `gform-${Date.now()}`;
        } else if (resData.message) {
          setCreationError(`Google Apps Script: ${resData.message}`);
          setIsProcessing(false);
          return;
        }
      } else {
        setCreationError(`Server Google Drive Apps Script mengembalikan status HTTP ${res.status}.`);
        setIsProcessing(false);
        return;
      }
    } catch (err) {
      console.warn('Apps Script execution error:', err);
      setCreationError(
        'Gagal menghubungi Google Apps Script Web App. Pastikan Web App di-deploy dengan opsi "Who has access: Anyone" (Siapa saja) dan URL di Settings sudah benar.'
      );
      setIsProcessing(false);
      return;
    }

    if (!formPublishedUrl) {
      setCreationError(
        'Web App tidak mengembalikan link Google Form. Pastikan izin akses Google Drive dan Google Forms sudah disetujui saat deployment script.'
      );
      setIsProcessing(false);
      return;
    }

    // Step 4: Finalizing
    await new Promise((r) => setTimeout(r, 500));
    setCurrentProgressStep(4);
    await new Promise((r) => setTimeout(r, 300));

    setIsProcessing(false);
    setGeneratedFormResult({
      formUrl: formPublishedUrl,
      editUrl: formEditUrl,
      formId,
    });

    // Notify parent to store in quiz and GoogleForms list
    onFormCreated(activeQuizForForm.id, formPublishedUrl, activeQuizForForm.title);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (_) {}
  };

  const handleSaveManualForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuizForForm || !manualFormUrl.trim()) return;

    const trimmedUrl = manualFormUrl.trim();
    if (!trimmedUrl.startsWith('https://docs.google.com/forms/')) {
      alert('Format URL tidak valid. URL harus dimulai dengan https://docs.google.com/forms/...');
      return;
    }

    const editUrl = trimmedUrl.includes('/viewform')
      ? trimmedUrl.replace('/viewform', '/edit')
      : trimmedUrl;

    setGeneratedFormResult({
      formUrl: trimmedUrl,
      editUrl,
      formId: `form-${Date.now()}`,
    });

    onFormCreated(activeQuizForForm.id, trimmedUrl, activeQuizForForm.title);
    setModalTab('auto');

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (_) {}
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyScriptCode = () => {
    navigator.clipboard.writeText(GAS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Bank Soal</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola kumpulan paket soal hasil generate AI dan buat Google Form otomatis di Google Drive
          </p>
        </div>

        <button
          onClick={onNavigateToGenerator}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Soal Baru</span>
        </button>
      </div>

      {/* Search filter bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari judul soal atau jenjang..."
          className="w-full bg-[#11192e] border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
        />
      </div>

      {/* List of quiz cards */}
      <div className="space-y-4">
        {filtered.map((quiz) => {
          const hasValidForm = isValidRealFormUrl(quiz.googleFormUrl);

          return (
            <div
              key={quiz.id}
              className="bg-[#10172a] border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 transition shadow-sm"
            >
              <div className="flex items-start gap-4">
                {/* Badge */}
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-300 shrink-0">
                  {quiz.badge}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-base font-bold text-white tracking-tight">{quiz.title}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      {quiz.status}
                    </span>
                    {hasValidForm ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Form Google Drive Siap</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        Belum Ada Google Form
                      </span>
                    )}
                  </div>

                  {/* Sub-badge Jenjang */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-900/50 text-[11px] font-medium text-indigo-300 mb-3">
                    <span className="text-xs">🎓</span>
                    <span>{quiz.gradeLevel}</span>
                  </div>

                  {/* Details */}
                  <p className="text-xs text-slate-400 font-medium mb-4">
                    {quiz.questionsCount} soal · {quiz.optionsCount} opsi · Batch {quiz.batchId} · {quiz.createdAt}
                  </p>

                  {/* Actions row */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => onOpenLihatSoal(quiz)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Lihat Soal</span>
                    </button>

                    {/* "Buat Google Form Otomatis" Button */}
                    <button
                      onClick={() => handleOpenFormModal(quiz)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/40 text-xs font-bold text-white flex items-center gap-2 transition shadow-md shadow-emerald-500/15 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-200 fill-emerald-200" />
                      <span>{hasValidForm ? 'Lihat / Buat Ulang Google Form' : 'Buat Google Form Otomatis'}</span>
                    </button>

                    <button
                      onClick={() => onCreateToken(quiz)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-xs font-semibold text-white flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Buat Token Siswa</span>
                    </button>

                    {/* Link to Real Google Form (Only rendered if URL is valid) */}
                    {hasValidForm && quiz.googleFormUrl && (
                      <a
                        href={quiz.googleFormUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-xs text-slate-300 hover:text-emerald-400 transition"
                        title="Buka Link Google Form di Tab Baru"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => onDeleteQuiz(quiz.id)}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold text-rose-400 flex items-center gap-1.5 transition cursor-pointer ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-[#10172a] border border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm">Tidak ada soal yang cocok dengan pencarian.</p>
          </div>
        )}
      </div>

      {/* Modal: Buat Google Form Otomatis */}
      {isModalOpen && activeQuizForForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0f172a] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-5 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Zap className="w-4 h-4 fill-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Buat Google Form Otomatis</h3>
                  <p className="text-xs text-slate-400">{activeQuizForForm.title}</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Tabs */}
            {!generatedFormResult && !isProcessing && !creationError && (
              <div className="flex rounded-xl bg-[#0a0f1d] p-1 border border-slate-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setModalTab('auto')}
                  className={`flex-1 py-2 rounded-lg transition ${
                    modalTab === 'auto'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Buat Otomatis via Drive
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('manual')}
                  className={`flex-1 py-2 rounded-lg transition ${
                    modalTab === 'manual'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Hubungkan Form Manual
                </button>
              </div>
            )}

            {/* Quiz Info Summary */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Judul Quiz:</span>
                <span className="font-bold text-white">{activeQuizForForm.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Jenjang:</span>
                <span className="font-medium text-indigo-300">{activeQuizForForm.gradeLevel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Soal:</span>
                <span className="font-bold text-emerald-400">
                  {activeQuizForForm.questions.length} Butir Soal (Otomatis 100 Poin)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Google Apps Script:</span>
                <span className="font-mono text-[11px] text-slate-300 truncate max-w-[200px]">
                  {gasUrl && gasUrl.includes('/exec') ? 'Terkonfigurasi' : 'Belum di-setup di Settings'}
                </span>
              </div>
            </div>

            {/* TAB MANUAL: Tempel link form Google Drive yang sudah ada */}
            {modalTab === 'manual' && !generatedFormResult && (
              <form onSubmit={handleSaveManualForm} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    URL Google Form Anda di Google Drive:
                  </label>
                  <input
                    type="url"
                    required
                    value={manualFormUrl}
                    onChange={(e) => setManualFormUrl(e.target.value)}
                    placeholder="https://docs.google.com/forms/d/e/.../viewform"
                    className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    Tempelkan tautan Google Form resmi yang sudah Anda buat di akun Google Drive Anda.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModalTab('auto')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <Link2 className="w-4 h-4" />
                    <span>Hubungkan Form Ini</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB AUTO: Opsi Pengacakan Soal & Pilihan Jawaban */}
            {modalTab === 'auto' && !generatedFormResult && !isProcessing && !creationError && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Pengaturan Kuis Google Form:</span>
                </label>

                <div className="space-y-2 bg-[#0a0f1d] border border-slate-800/80 rounded-xl p-3 text-xs">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shuffleQuestions}
                      onChange={(e) => setShuffleQuestions(e.target.checked)}
                      className="rounded accent-emerald-500 cursor-pointer"
                    />
                    <span>Acak urutan soal (shuffle questions)</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shuffleOptions}
                      onChange={(e) => setShuffleOptions(e.target.checked)}
                      className="rounded accent-emerald-500 cursor-pointer"
                    />
                    <span>Acak urutan opsi jawaban (shuffle choices A, B, C...)</span>
                  </label>
                </div>

                {(!gasUrl || !gasUrl.includes('/exec')) && (
                  <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">URL Apps Script Belum Diatur:</strong>
                        <p className="text-[11px] text-amber-300/90 mt-0.5">
                          Form baru hanya bisa dibuat langsung di Drive Anda jika Apps Script Web App sudah di-deploy.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleCopyScriptCode}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript ? 'Script Tersalin' : 'Salin Code.gs v3.2'}</span>
                      </button>

                      <a
                        href="https://script.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>script.google.com</span>
                      </a>

                      {onNavigateToSettings && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsModalOpen(false);
                            onNavigateToSettings();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Settings className="w-3 h-3" />
                          <span>Buka Settings</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* In-progress display */}
            {isProcessing && (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">
                    {currentProgressStep === 1 && 'Menghubungi Google Apps Script...'}
                    {currentProgressStep === 2 && 'Menyiapkan Folder di Google Drive...'}
                    {currentProgressStep === 3 && 'Menyusun Soal, Kunci Jawaban & Bobot 100 Poin...'}
                    {currentProgressStep === 4 && 'Menerapkan Konfigurasi Kuis & Finalisasi...'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Mohon tunggu beberapa detik, file form dibuat langsung di akun Google Drive Anda.
                  </p>
                </div>
              </div>
            )}

            {/* Error Recovery Display: NEVER generate broken 404 URLs! */}
            {creationError && !isProcessing && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        Google Form Belum Dapat Dibuat Otomatis
                      </h4>
                      <p className="text-[11px] text-rose-300/90 mt-1 leading-relaxed">
                        {creationError}
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 pt-2 border-t border-rose-900/50">
                    Sistem tidak membuat tautan palsu agar Anda tidak menemui layar <em>"Sorry, the file you have requested does not exist"</em> di Google Drive.
                  </p>
                </div>

                {/* Clear action options */}
                <div className="space-y-2 text-xs">
                  <p className="font-semibold text-slate-300">Pilihan Solusi Cepat:</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleCopyScriptCode}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-2 cursor-pointer transition text-center"
                    >
                      {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedScript ? 'Kode Disalin!' : 'Salin Script Code.gs'}</span>
                    </button>

                    <a
                      href="https://script.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-indigo-300 font-semibold flex items-center justify-center gap-2 cursor-pointer transition text-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka script.google.com</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {onNavigateToSettings && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          onNavigateToSettings();
                        }}
                        className="py-2.5 px-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 font-semibold flex items-center justify-center gap-2 cursor-pointer transition text-center"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Buka Menu Settings</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setCreationError(null);
                        setModalTab('manual');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 border border-teal-500/40 text-teal-300 font-semibold flex items-center justify-center gap-2 cursor-pointer transition text-center"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Hubungkan Form Manual</span>
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        onCreateToken(activeQuizForForm);
                      }}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-emerald-600/20"
                    >
                      <Key className="w-4 h-4" />
                      <span>Tetap Buat Token Siswa (Mulai Ujian Langsung)</span>
                    </button>
                    <p className="text-[10px] text-center text-slate-500 mt-1.5">
                      Siswa dapat langsung mengerjakan 10 butir soal ini di Secure Exam Player lengkap dengan anti-cheat & rekap nilai.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Result State (Success) */}
            {generatedFormResult && !isProcessing && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Google Form Berhasil Dibuat!</h4>
                    <p className="text-[11px] text-emerald-300/90 mt-0.5">
                      Tersimpan di Google Drive Anda. Kuis sudah otomatis aktif (100 poin).
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#0a0f1d] border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono text-slate-300">
                  <span className="truncate max-w-[280px]">{generatedFormResult.formUrl}</span>
                  <button
                    onClick={() => handleCopyLink(generatedFormResult.formUrl)}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-sans font-semibold text-xs ml-2 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Tersalin' : 'Salin Link'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={generatedFormResult.formUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-emerald-600/20 text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka Form Siswa</span>
                  </a>

                  <a
                    href={generatedFormResult.editUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer text-center"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Buka Editor Drive</span>
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      onCreateToken(activeQuizForForm);
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Lanjutkan: Buat Token Ujian untuk Form Ini</span>
                  </button>
                </div>
              </div>
            )}

            {/* Action footer when not completed and no error */}
            {!generatedFormResult && !isProcessing && !creationError && modalTab === 'auto' && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteCreateForm}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buat Form Sekarang</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
