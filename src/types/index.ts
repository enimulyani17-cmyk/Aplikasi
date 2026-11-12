export interface QuestionOption {
  key: string;
  text: string;
}

export interface QuestionItem {
  number: number;
  question: string;
  options: QuestionOption[];
  correctAnswer: string;
  cognitiveLevel: string; // C1 - C6
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  badge: 'SMP' | 'SMA' | 'SD' | 'UMUM';
  questionsCount: number;
  optionsCount: number;
  batchId: string;
  createdAt: string;
  status: 'Terbit' | 'Draft';
  googleFormUrl?: string;
  questions: QuestionItem[];
}

export interface ExamToken {
  token: string;
  label: string;
  quizId: string;
  quizTitle: string;
  quizSubject: string;
  limit: number;
  status: 'Aktif' | 'Nonaktif';
  expiresAt: string | null;
  waitingRoom: boolean;
  waitingRoomStarted: boolean;
  createdAt: string;
  googleFormUrl?: string;
  googleFormId?: string;
}

export interface LiveStudent {
  id: string;
  name: string;
  classGrade: string;
  absentNo: string;
  token: string;
  status: 'Mengerjakan' | 'Terputus' | 'Selesai' | 'Diblokir';
  violations: number;
  lastViolationReason: string;
  lastSeen: string;
  score?: number;
  submittedAt?: string;
  answers?: Record<number, string>;
}

export interface ViolationRecord {
  id: string;
  timestamp: string;
  studentName: string;
  classGrade: string;
  token: string;
  reason: string;
  penaltySeconds: number;
  isBlocked: boolean;
}

export interface GoogleFormItem {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  synced: boolean;
}

export type ActiveTab =
  | 'dashboard'
  | 'ai-generator'
  | 'bank-soal'
  | 'google-forms'
  | 'token-siswa'
  | 'ujian-live'
  | 'nilai-siswa'
  | 'riwayat-pelanggaran'
  | 'download-aplikasi'
  | 'panduan'
  | 'settings';
