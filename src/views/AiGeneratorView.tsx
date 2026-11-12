import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  HelpCircle,
  Brain,
  ListOrdered,
  Target,
  FileUp,
  FileText,
  UploadCloud,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Quiz } from '../types';
import { generateQuestionsApi } from '../services/geminiService';
import { AiProgressModal } from '../components/AiProgressModal';

interface AiGeneratorViewProps {
  onQuizGenerated: (newQuiz: Quiz) => void;
  onOpenBankSoal: () => void;
}

export const AiGeneratorView: React.FC<AiGeneratorViewProps> = ({
  onQuizGenerated,
  onOpenBankSoal,
}) => {
  const [topic, setTopic] = useState('Kerucut');
  const [gradeLevel, setGradeLevel] = useState('SMP Kelas 9');
  const [questionType, setQuestionType] = useState<'Pilihan Ganda' | 'Esai / Uraian'>('Pilihan Ganda');
  const [cognitiveLevel, setCognitiveLevel] = useState('Campuran'); // Campuran, LOTS, MOTS, HOTS
  const [optionsCount, setOptionsCount] = useState<number>(4);
  const [indicator, setIndicator] = useState('');
  const [referenceTab, setReferenceTab] = useState<'none' | 'upload' | 'paste' | 'bank'>('none');
  const [referenceText, setReferenceText] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(10);

  // Modal generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const handleStartGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setCurrentStep(1);
    setElapsedSeconds(0);

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // Simulate progressive UX stages matching screenshot
    const s1 = setTimeout(() => setCurrentStep(2), 1500);
    const s2 = setTimeout(() => setCurrentStep(3), 3200);
    const s3 = setTimeout(() => setCurrentStep(4), 5000);

    try {
      const cognitiveFull =
        cognitiveLevel === 'Campuran'
          ? 'Campuran C1-C6'
          : cognitiveLevel === 'LOTS'
          ? 'LOTS C1-C2'
          : cognitiveLevel === 'MOTS'
          ? 'MOTS C3'
          : 'HOTS C4-C6';

      const result = await generateQuestionsApi({
        topic,
        gradeLevel,
        questionType,
        cognitiveLevel: cognitiveFull,
        optionsCount,
        indicator,
        referenceText: referenceTab === 'paste' || referenceTab === 'upload' ? referenceText : '',
        count: questionCount,
      });

      setCurrentStep(5);
      await new Promise((resolve) => setTimeout(resolve, 800));

      clearInterval(timer);
      clearTimeout(s1);
      clearTimeout(s2);
      clearTimeout(s3);
      setIsGenerating(false);

      // Determine badge
      let badge: 'SMP' | 'SMA' | 'SD' | 'UMUM' = 'SMP';
      const gLower = gradeLevel.toLowerCase();
      if (gLower.includes('sma') || gLower.includes('smk') || gLower.includes('10') || gLower.includes('11') || gLower.includes('12')) {
        badge = 'SMA';
      } else if (gLower.includes('sd') || gLower.includes('kelas 1') || gLower.includes('kelas 2') || gLower.includes('kelas 3') || gLower.includes('kelas 4') || gLower.includes('kelas 5') || gLower.includes('kelas 6')) {
        badge = 'SD';
      } else if (gLower.includes('smp') || gLower.includes('kelas 7') || gLower.includes('kelas 8') || gLower.includes('kelas 9')) {
        badge = 'SMP';
      } else {
        badge = 'UMUM';
      }

      const randomBatchId = 'UKIN' + Math.random().toString(36).substring(2, 5).toUpperCase() + '07';

      const newQuiz: Quiz = {
        id: `quiz-${Date.now()}`,
        title: topic,
        subject: 'Materi Ujian',
        gradeLevel: gradeLevel || 'Umum',
        badge,
        questionsCount: result.questions.length,
        optionsCount,
        batchId: randomBatchId,
        createdAt: 'Baru saja',
        status: 'Terbit',
        questions: result.questions,
      };

      onQuizGenerated(newQuiz);

      // Celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (_) {}
    } catch (err) {
      clearInterval(timer);
      clearTimeout(s1);
      clearTimeout(s2);
      clearTimeout(s3);
      setIsGenerating(false);
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Container card matching Screenshot 3 */}
      <div className="bg-[#10172a] border border-slate-800 rounded-3xl p-8 shadow-xl">
        {/* Title Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Generate Soal dengan AI</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Masukkan topik dan level, AI akan buatkan soal untuk Anda
            </p>
          </div>
        </div>

        <form onSubmit={handleStartGeneration} className="space-y-6">
          {/* Topik / Materi */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Topik / Materi</span>
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Fotosintesis, Perang Diponegoro, Persamaan Kuadrat..."
              className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Jenjang & Kelas */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
              <GraduationCap className="w-4 h-4 text-slate-400" />
              <span>Jenjang & Kelas</span>
            </label>
            <input
              type="text"
              required
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              placeholder="Contoh: SMA Kelas 11, SD Kelas 6, Universitas..."
              className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Tipe Soal */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Tipe Soal</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setQuestionType('Pilihan Ganda')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  questionType === 'Pilihan Ganda'
                    ? 'bg-indigo-950/40 border-indigo-500/80 text-white shadow-sm'
                    : 'bg-[#0a0f1d] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Pilihan Ganda
              </button>
              <button
                type="button"
                onClick={() => setQuestionType('Esai / Uraian')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  questionType === 'Esai / Uraian'
                    ? 'bg-indigo-950/40 border-indigo-500/80 text-white shadow-sm'
                    : 'bg-[#0a0f1d] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Esai / Uraian
              </button>
            </div>
          </div>

          {/* Tingkat Kognitif (Taksonomi Bloom) */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
              <Brain className="w-4 h-4 text-slate-400" />
              <span>Tingkat Kognitif (Taksonomi Bloom)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'Campuran', label: 'Campuran', sub: 'C1-C6' },
                { id: 'LOTS', label: 'LOTS', sub: 'C1-C2' },
                { id: 'MOTS', label: 'MOTS', sub: 'C3' },
                { id: 'HOTS', label: 'HOTS', sub: 'C4-C6' },
              ].map((item) => {
                const isSelected = cognitiveLevel === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCognitiveLevel(item.id)}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      isSelected
                        ? 'border-amber-500/80 bg-amber-500/10 text-white shadow-sm ring-1 ring-amber-500/30'
                        : 'bg-[#0a0f1d] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Jumlah Opsi Jawaban (A, B, C...) */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
              <ListOrdered className="w-4 h-4 text-slate-400" />
              <span>Jumlah Opsi Jawaban (A, B, C...)</span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { count: 2, sub: 'A, B' },
                { count: 3, sub: 'A, B, C' },
                { count: 4, sub: 'A-D' },
                { count: 5, sub: 'A-E' },
              ].map((item) => {
                const isSelected = optionsCount === item.count;
                return (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => setOptionsCount(item.count)}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500/80 bg-emerald-500/10 text-white shadow-sm ring-1 ring-emerald-500/30'
                        : 'bg-[#0a0f1d] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-sm font-bold">{item.count}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Indikator Pembelajaran (Opsional) */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
              <Target className="w-4 h-4 text-slate-400" />
              <span>Indikator Pembelajaran <span className="text-slate-500 font-normal">(Opsional)</span></span>
            </label>
            <textarea
              rows={2}
              value={indicator}
              onChange={(e) => setIndicator(e.target.value)}
              placeholder="Contoh: Siswa dapat menganalisis dampak hilangnya stomata terhadap fotosintesis..."
              className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition resize-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Isi agar AI membuat soal yang jauh lebih relevan dan spesifik.
            </p>
          </div>

          {/* Materi Referensi (Opsional) */}
          <div className="bg-[#0b1020] border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-200">
                  Materi Referensi <span className="text-slate-500 font-normal">(Opsional)</span>
                </span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                BARU
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              AI membuat soal dari materi Anda sendiri (modul, buku, slide). Teks dibaca di server; hanya bagian yang relevan (±6.000 token) yang dikirim ke AI.
            </p>

            {/* Reference Tabs */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { id: 'none', label: 'Tanpa materi' },
                { id: 'upload', label: 'Upload file' },
                { id: 'paste', label: 'Tempel teks' },
                { id: 'bank', label: 'Bank Materi (0)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setReferenceTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    referenceTab === tab.id
                      ? 'bg-indigo-900/60 border border-indigo-500/50 text-indigo-200 font-semibold'
                      : 'bg-[#11192e] border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {referenceTab === 'paste' && (
              <textarea
                rows={3}
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value)}
                placeholder="Tempelkan ringkasan materi, kutipan bab buku, atau catatan guru di sini..."
                className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
              />
            )}

            {referenceTab === 'upload' && (
              <div className="border border-dashed border-slate-700 rounded-xl p-4 text-center bg-[#070b14]">
                <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-300">Pilih file PDF, Word (docx), atau teks</p>
                <input
                  type="file"
                  className="hidden"
                  id="doc-upload"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setReferenceText(`Konten dari ${e.target.files[0].name}`);
                    }
                  }}
                />
                <label
                  htmlFor="doc-upload"
                  className="mt-2 inline-block px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg cursor-pointer transition"
                >
                  Pilih Dokumen
                </label>
              </div>
            )}
          </div>

          {/* Slider Jumlah Soal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300"># Jumlah Soal</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  Max 50 Soal
                </span>
              </div>
              <div className="w-10 h-8 rounded-lg bg-[#0a0f1d] border border-slate-800 flex items-center justify-center font-bold text-sm text-white font-mono">
                {questionCount}
              </div>
            </div>

            <input
              type="range"
              min={1}
              max={50}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {questionCount} soal akan di-generate
            </p>
          </div>

          {/* Big Gradient Action Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 transition cursor-pointer group"
          >
            <Sparkles className="w-5 h-5 text-emerald-200" />
            <div className="text-left">
              <div className="text-base font-extrabold tracking-wide">
                Generate {questionCount} Soal dengan AI
              </div>
              <div className="text-[11px] font-normal text-emerald-100/90">
                Perkiraan ± 20 detik - soal tersimpan otomatis di Bank Soal
              </div>
            </div>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition" />
          </button>
        </form>
      </div>

      {/* Progress Modal */}
      <AiProgressModal
        isOpen={isGenerating}
        topic={topic}
        gradeLevel={gradeLevel}
        count={questionCount}
        currentStep={currentStep}
        elapsedSeconds={elapsedSeconds}
      />
    </div>
  );
};
