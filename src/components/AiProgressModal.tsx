import React, { useEffect, useState } from 'react';
import { Check, Loader2, Sparkles } from 'lucide-react';

interface AiProgressModalProps {
  isOpen: boolean;
  topic: string;
  gradeLevel: string;
  count: number;
  currentStep: number; // 1 to 5
  elapsedSeconds: number;
}

const STEPS = [
  'Membaca topik, jenjang',
  'Menyusun pertanyaan sesuai tingkat kognitif',
  'Membuat pilihan jawaban & kunci',
  'Memeriksa kualitas & menghindari soal ganda',
  'Menyimpan ke Bank Soal',
];

export const AiProgressModal: React.FC<AiProgressModalProps> = ({
  isOpen,
  topic,
  gradeLevel,
  count,
  currentStep,
  elapsedSeconds,
}) => {
  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.max(10, (currentStep / 5) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-indigo-500/30 rounded-3xl p-8 shadow-2xl overflow-hidden">
        {/* Glow backdrop behind card */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center">
          {/* Animated Neon Circle */}
          <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-[3px] animate-spin-slow">
              <div className="w-full h-full bg-[#0f172a] rounded-full" />
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-7 h-7 text-white animate-pulse" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            AI sedang menyusun {count} soal
          </h3>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            {topic} · {gradeLevel}
          </p>

          {/* Current action label & timer */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mt-6 mb-2 font-mono">
            <span>{STEPS[Math.min(currentStep - 1, STEPS.length - 1)]}...</span>
            <span>{elapsedSeconds} dtk</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Step list */}
          <div className="w-full space-y-3.5 text-left mb-6">
            {STEPS.map((stepLabel, idx) => {
              const stepNumber = idx + 1;
              const isCompleted = currentStep > stepNumber;
              const isCurrent = currentStep === stepNumber;

              return (
                <div key={idx} className="flex items-center gap-3">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-500 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center shrink-0 text-slate-600 text-[10px]" />
                  )}

                  <span
                    className={`text-xs ${
                      isCompleted
                        ? 'text-slate-300 font-medium'
                        : isCurrent
                        ? 'text-white font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    {stepLabel}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Tip */}
          <div className="w-full bg-indigo-950/30 border border-indigo-900/40 rounded-xl p-3 text-[11px] text-indigo-300/90 mb-4">
            Tips: isi Indikator Pembelajaran agar soal lebih tepat sasaran.
          </div>

          <p className="text-[11px] text-slate-500">
            Jangan tutup atau muat ulang halaman ini.
          </p>
        </div>
      </div>
    </div>
  );
};
