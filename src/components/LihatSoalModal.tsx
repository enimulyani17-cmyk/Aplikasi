import React from 'react';
import { X, Check, Brain, Key, Copy, Sparkles, BookOpen } from 'lucide-react';
import { Quiz } from '../types';

interface LihatSoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz | null;
  onCreateTokenForQuiz: (quiz: Quiz) => void;
}

export const LihatSoalModal: React.FC<LihatSoalModalProps> = ({
  isOpen,
  onClose,
  quiz,
  onCreateTokenForQuiz,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !quiz) return null;

  const handleCopyText = () => {
    const text = quiz.questions
      .map(
        (q, idx) =>
          `${idx + 1}. ${q.question}\n` +
          q.options.map((o) => `   ${o.key}. ${o.text}`).join('\n') +
          `\nKunci: ${q.correctAnswer} (${q.cognitiveLevel})\nPembahasan: ${q.explanation}\n`
      )
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {quiz.badge}
              </span>
              <h3 className="text-lg font-bold text-white">{quiz.title}</h3>
            </div>
            <p className="text-xs text-slate-400">
              {quiz.gradeLevel} · {quiz.questions.length} Butir Soal · {quiz.optionsCount} Pilihan Opsi
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Semua'}</span>
            </button>
            <button
              onClick={() => onCreateTokenForQuiz(quiz)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Buat Token</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {quiz.questions.map((q, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    {q.question}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
                  {q.cognitiveLevel}
                </span>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 ml-9">
                {q.options.map((opt) => {
                  const isCorrect = opt.key === q.correctAnswer;
                  return (
                    <div
                      key={opt.key}
                      className={`px-3 py-2 rounded-xl text-xs flex items-center gap-2 border transition ${
                        isCorrect
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-semibold'
                          : 'bg-slate-800/50 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] ${
                          isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {q.explanation && (
                <div className="mt-4 ml-9 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                  <Brain className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-300">Pembahasan: </span>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
