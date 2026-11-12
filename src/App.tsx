/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  Quiz,
  ExamToken,
  LiveStudent,
  ViolationRecord,
  GoogleFormItem,
  TransactionItem,
} from './types';
import {
  INITIAL_QUIZZES,
  INITIAL_TOKENS,
  INITIAL_STUDENTS,
  INITIAL_GOOGLE_FORMS,
  INITIAL_TRANSACTIONS,
} from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { AiGeneratorView } from './views/AiGeneratorView';
import { BankSoalView } from './views/BankSoalView';
import { GoogleFormsView } from './views/GoogleFormsView';
import { TokenSiswaView } from './views/TokenSiswaView';
import { UjianLiveView } from './views/UjianLiveView';
import { NilaiSiswaView } from './views/NilaiSiswaView';
import { RiwayatPelanggaranView } from './views/RiwayatPelanggaranView';
import { DownloadAplikasiView } from './views/DownloadAplikasiView';
import { StatusPaketView } from './views/StatusPaketView';
import { SettingsView } from './views/SettingsView';
import { LoginView } from './views/LoginView';
import { SecureExamPlayer } from './views/SecureExamPlayer';
import { LayarQrModal } from './components/LayarQrModal';
import { LihatSoalModal } from './components/LihatSoalModal';
import { PanduanModal } from './components/PanduanModal';
import { LogoutModal } from './components/LogoutModal';

function extractFormId(url?: string): string {
  if (!url) return '-';
  const matchD = url.match(/\/d\/e\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];
  const matchDirect = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchDirect && matchDirect[1]) return matchDirect[1];
  return url.replace('https://docs.google.com/forms/', '').slice(0, 18);
}

export default function App() {
  // App Mode: 'teacher' | 'student' | 'login'
  const [appMode, setAppMode] = useState<'teacher' | 'student' | 'login'>('teacher');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeStudentToken, setActiveStudentToken] = useState<ExamToken | null>(null);

  // Stored state with local storage fallback
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('sp_quizzes');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [tokens, setTokens] = useState<ExamToken[]>(() => {
    const saved = localStorage.getItem('sp_tokens');
    return saved ? JSON.parse(saved) : INITIAL_TOKENS;
  });

  const [students, setStudents] = useState<LiveStudent[]>(() => {
    const saved = localStorage.getItem('sp_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [violations, setViolations] = useState<ViolationRecord[]>(() => {
    const saved = localStorage.getItem('sp_violations');
    return saved ? JSON.parse(saved) : [];
  });

  const [forms, setForms] = useState<GoogleFormItem[]>(() => {
    const saved = localStorage.getItem('sp_forms');
    return saved ? JSON.parse(saved) : INITIAL_GOOGLE_FORMS;
  });

  const [transactions, setTransactions] = useState<TransactionItem[]>(() => {
    const saved = localStorage.getItem('sp_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [gasUrl, setGasUrl] = useState<string>(() => {
    const saved = localStorage.getItem('sp_gas_url');
    if (
      saved &&
      !saved.includes('AKfycbyYXlFiIMF6bHPzgRTeFPfw_1qCcLQtCQy7A9f9XVYEAPcAyshLc0HIVYrJ2g9wB9Q8s')
    ) {
      return saved;
    }
    return '';
  });

  // Modal states
  const [isLayarQrOpen, setIsLayarQrOpen] = useState(false);
  const [selectedTokenForQr, setSelectedTokenForQr] = useState<ExamToken>(tokens[0]);
  const [isLihatSoalOpen, setIsLihatSoalOpen] = useState(false);
  const [selectedQuizForPreview, setSelectedQuizForPreview] = useState<Quiz | null>(null);
  const [isPanduanOpen, setIsPanduanOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Active Logged-in Teacher User
  const [teacherUser, setTeacherUser] = useState<{ name: string; email: string }>(() => {
    const savedEmail = localStorage.getItem('sp_teacher_email');
    return {
      name: 'Yana Periyana',
      email: savedEmail || 'enimulyani17@guru.smp.belajar.id',
    };
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sp_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('sp_tokens', JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem('sp_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('sp_violations', JSON.stringify(violations));
  }, [violations]);

  useEffect(() => {
    localStorage.setItem('sp_forms', JSON.stringify(forms));
  }, [forms]);

  useEffect(() => {
    if (gasUrl) {
      localStorage.setItem('sp_gas_url', gasUrl);
    } else {
      localStorage.removeItem('sp_gas_url');
    }
  }, [gasUrl]);

  // Auto-sanitizer for invalid or fake uncreated form URLs in state / localStorage
  useEffect(() => {
    const savedGas = localStorage.getItem('sp_gas_url');
    if (
      savedGas &&
      savedGas.includes('AKfycbyYXlFiIMF6bHPzgRTeFPfw_1qCcLQtCQy7A9f9XVYEAPcAyshLc0HIVYrJ2g9wB9Q8s')
    ) {
      localStorage.removeItem('sp_gas_url');
      setGasUrl('');
    }

    const isFakeFormUrl = (url?: string) =>
      !url ||
      url.includes('Example') ||
      url.includes('randomFormHash') ||
      url.includes('published_id') ||
      url.includes('1FAIpQLSc');

    setForms((prevForms) => prevForms.filter((f) => !isFakeFormUrl(f.url)));

    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((q) =>
        isFakeFormUrl(q.googleFormUrl) ? { ...q, googleFormUrl: undefined } : q
      )
    );

    setTokens((prevTokens) =>
      prevTokens.map((t) =>
        isFakeFormUrl(t.googleFormUrl)
          ? { ...t, googleFormUrl: undefined, googleFormId: undefined }
          : t
      )
    );
  }, []);

  const handlePurgeUncreatedData = () => {
    setForms([]);
    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((q) => ({ ...q, googleFormUrl: undefined }))
    );
    setTokens((prevTokens) =>
      prevTokens.map((t) => ({ ...t, googleFormUrl: undefined, googleFormId: undefined }))
    );
    localStorage.removeItem('sp_forms');
  };

  // Check URL query parameters for direct student exam token (?token=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get('token');
      if (tokenParam) {
        const found = tokens.find((t) => t.token.toUpperCase() === tokenParam.toUpperCase());
        if (found) {
          setActiveStudentToken(found);
          setAppMode('student');
        } else {
          // Create temporary student token so student can begin immediately
          const tempToken: ExamToken = {
            token: tokenParam.toUpperCase(),
            label: 'Ulangan Siswa',
            quizId: quizzes[0]?.id || 'quiz-1',
            quizTitle: quizzes[0]?.title || 'Ujian Penilaian',
            quizSubject: quizzes[0]?.subject || 'IPA',
            limit: 1,
            status: 'Aktif',
            expiresAt: null,
            waitingRoom: false,
            waitingRoomStarted: true,
            createdAt: 'Baru saja',
          };
          setActiveStudentToken(tempToken);
          setAppMode('student');
        }
      }
    } catch (_) {}
  }, [tokens, quizzes]);

  // Synchronize browser address bar with student token when entering/leaving Buka Player mode
  useEffect(() => {
    try {
      if (appMode === 'student') {
        const currentToken = activeStudentToken?.token || tokens[0]?.token;
        if (currentToken) {
          const newUrl = `${window.location.pathname}?token=${currentToken}`;
          window.history.replaceState({ mode: 'student', token: currentToken }, '', newUrl);
        }
      } else if (appMode === 'teacher') {
        if (window.location.search.includes('token=')) {
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    } catch (_) {}
  }, [appMode, activeStudentToken, tokens]);

  // Handlers
  const handleQuizGenerated = (newQuiz: Quiz) => {
    setQuizzes((prev) => [newQuiz, ...prev]);
    setSelectedQuizForPreview(newQuiz);
    setIsLihatSoalOpen(true);
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
  };

  const handleCreateToken = (newToken: ExamToken) => {
    setTokens((prev) => [newToken, ...prev]);
  };

  const handleUpdateToken = (tokenCode: string, updated: Partial<ExamToken>) => {
    setTokens((prev) =>
      prev.map((t) => (t.token === tokenCode ? { ...t, ...updated } : t))
    );
  };

  const handleDeleteToken = (tokenCode: string) => {
    setTokens((prev) => prev.filter((t) => t.token !== tokenCode));
  };

  const handleToggleTokenStatus = (tokenCode: string) => {
    setTokens((prev) =>
      prev.map((t) =>
        t.token === tokenCode
          ? { ...t, status: t.status === 'Aktif' ? 'Nonaktif' : 'Aktif' }
          : t
      )
    );
  };

  const handleAddForm = (name: string, url: string) => {
    const newForm: GoogleFormItem = {
      id: `gf-${Date.now()}`,
      name,
      url,
      createdAt: 'Baru saja',
      synced: true,
    };
    setForms((prev) => [newForm, ...prev]);
  };

  const handleDeleteForm = (id: string) => {
    setForms((prev) => prev.filter((f) => f.id !== id));
  };

  const handleOpenLayarQr = (token: ExamToken) => {
    setSelectedTokenForQr(token);
    setIsLayarQrOpen(true);
  };

  const handleStartExamFromLayar = () => {
    if (selectedTokenForQr) {
      setTokens((prev) =>
        prev.map((t) =>
          t.token === selectedTokenForQr.token ? { ...t, waitingRoomStarted: true } : t
        )
      );
      setSelectedTokenForQr((prev) => ({ ...prev, waitingRoomStarted: true }));
    }
  };

  const handleResetStudentStatus = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: 'Mengerjakan',
              violations: 0,
              lastViolationReason: '—',
              lastSeen: 'Baru saja (Diizinkan ulang)',
            }
          : s
      )
    );
  };

  const handleStudentJoin = (newStudent: LiveStudent) => {
    setStudents((prev) => {
      const exists = prev.find((s) => s.id === newStudent.id || s.name === newStudent.name);
      if (exists) {
        return prev.map((s) => (s.id === exists.id ? { ...newStudent, id: exists.id } : s));
      }
      return [newStudent, ...prev];
    });
  };

  const handleStudentViolation = (newViolation: ViolationRecord) => {
    setViolations((prev) => [newViolation, ...prev]);
    setStudents((prev) =>
      prev.map((s) => {
        if (s.name === newViolation.studentName && s.token === newViolation.token) {
          return {
            ...s,
            violations: s.violations + 1,
            lastViolationReason: newViolation.reason,
            status: newViolation.isBlocked ? 'Diblokir' : s.status,
            lastSeen: 'Baru saja',
          };
        }
        return s;
      })
    );
  };

  const handleStudentFinish = (
    studentId: string,
    score: number,
    answers: Record<number, string>
  ) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: 'Selesai',
              score,
              answers,
              submittedAt: 'Baru saja',
              lastSeen: 'Baru saja',
            }
          : s
      )
    );
  };

  const handleLoginSuccess = (userEmail: string) => {
    setTeacherUser((prev) => ({
      ...prev,
      email: userEmail || 'enimulyani17@guru.smp.belajar.id',
    }));
    localStorage.setItem('sp_teacher_email', userEmail);
    setAppMode('teacher');
    setActiveTab('dashboard');
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setAppMode('login');
  };

  // If student player mode is active
  if (appMode === 'student') {
    const targetToken = activeStudentToken || tokens[0] || INITIAL_TOKENS[0];
    const targetQuiz =
      quizzes.find((q) => q.id === targetToken.quizId) || quizzes[0] || INITIAL_QUIZZES[0];

    return (
      <SecureExamPlayer
        token={targetToken}
        quiz={targetQuiz}
        onStudentJoin={handleStudentJoin}
        onStudentViolation={handleStudentViolation}
        onStudentFinish={handleStudentFinish}
        onBackToTeacher={() => setAppMode('teacher')}
      />
    );
  }

  // If login view is active
  if (appMode === 'login') {
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        onOpenStudentPlayer={() => setAppMode('student')}
      />
    );
  }

  // Teacher Panel Mode
  const activeExamStudentsCount = students.filter((s) => s.status === 'Mengerjakan').length;

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Dashboard',
          subtitle: `Selamat datang, ${teacherUser.name}!`,
        };
      case 'ai-generator':
        return {
          title: 'AI Generator Soal',
          subtitle: 'Buat paket soal cerdas kurikulum sekolah dengan bantuan AI',
        };
      case 'bank-soal':
        return {
          title: 'Bank Soal',
          subtitle: 'Kelola koleksi soal ujian Anda',
        };
      case 'google-forms':
        return {
          title: 'Google Forms',
          subtitle: 'Daftar Google Form yang sudah di-generate',
        };
      case 'token-siswa':
        return {
          title: 'Token Siswa',
          subtitle: 'Buat dan kelola token akses ujian untuk siswa',
        };
      case 'ujian-live':
        return {
          title: `Ujian Live · ${tokens[0]?.token || 'ZJT0P4M'}`,
          subtitle: `${tokens[0]?.label || 'Ulangan'} · ${tokens[0]?.quizSubject || 'IPA'}`,
        };
      case 'nilai-siswa':
        return {
          title: 'Nilai Siswa',
          subtitle: 'Rekapitulasi skor dan analisis jawaban',
        };
      case 'riwayat-pelanggaran':
        return {
          title: 'Riwayat Pelanggaran',
          subtitle: 'Setiap peringatan & blokir siswa saat ujian, lengkap dengan penyebabnya',
        };
      case 'download-aplikasi':
        return {
          title: 'Download Aplikasi',
          subtitle: 'Aplikasi Android mode lockdown untuk ujian',
        };
      case 'status-paket':
      case 'yang-baru':
      case 'perpanjang-paket':
        return {
          title: 'Status Paket & Riwayat',
          subtitle: 'Lihat status langganan dan riwayat transaksi Anda.',
        };
      case 'panduan':
        return {
          title: 'Panduan Penggunaan',
          subtitle: 'Petunjuk lengkap operasional platform',
        };
      case 'settings':
        return {
          title: 'Settings',
          subtitle: 'Konfigurasi Google Apps Script untuk membuat Google Form',
        };
      default:
        return { title: 'soalpintar.ai', subtitle: 'Guru Panel' };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex h-screen w-full bg-[#0b0f19] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenStudentMode={() => setAppMode('student')}
        onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
        userName={teacherUser.name}
        userEmail={teacherUser.email}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          onOpenStudentMode={() => setAppMode('student')}
          onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
          userName={teacherUser.name}
          userEmail={teacherUser.email}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              quizzes={quizzes}
              tokens={tokens}
              forms={forms}
              students={students}
              setActiveTab={setActiveTab}
              onOpenLihatSoal={(q) => {
                setSelectedQuizForPreview(q);
                setIsLihatSoalOpen(true);
              }}
            />
          )}

          {activeTab === 'ai-generator' && (
            <AiGeneratorView
              onQuizGenerated={handleQuizGenerated}
              onOpenBankSoal={() => setActiveTab('bank-soal')}
            />
          )}

          {activeTab === 'bank-soal' && (
            <BankSoalView
              quizzes={quizzes}
              gasUrl={gasUrl}
              onDeleteQuiz={handleDeleteQuiz}
              onOpenLihatSoal={(q) => {
                setSelectedQuizForPreview(q);
                setIsLihatSoalOpen(true);
              }}
              onNavigateToGenerator={() => setActiveTab('ai-generator')}
              onNavigateToSettings={() => setActiveTab('settings')}
              onCreateToken={(q) => {
                const tokenCode = 'ZJT' + Math.random().toString(36).substring(2, 6).toUpperCase();
                const newToken: ExamToken = {
                  token: tokenCode,
                  label: `Ulangan ${q.title}`,
                  quizId: q.id,
                  quizTitle: q.title,
                  quizSubject: q.subject,
                  limit: 1,
                  status: 'Aktif',
                  expiresAt: null,
                  waitingRoom: false,
                  waitingRoomStarted: false,
                  createdAt: 'Baru saja',
                  googleFormUrl: q.googleFormUrl,
                  googleFormId: extractFormId(q.googleFormUrl),
                };
                handleCreateToken(newToken);
                setActiveTab('token-siswa');
              }}
              onFormCreated={(quizId, formUrl, formName) => {
                setQuizzes((prev) =>
                  prev.map((q) => (q.id === quizId ? { ...q, googleFormUrl: formUrl } : q))
                );
                // Also update existing tokens for this quiz so they immediately link to the created Google Form
                setTokens((prev) =>
                  prev.map((t) =>
                    t.quizId === quizId
                      ? {
                          ...t,
                          googleFormUrl: formUrl,
                          googleFormId: extractFormId(formUrl),
                        }
                      : t
                  )
                );
                // Also add to Google Forms list if not already there
                setForms((prev) => {
                  const exists = prev.some((f) => f.name === formName || f.url === formUrl);
                  if (exists) return prev;
                  return [
                    {
                      id: `gf-${Date.now()}`,
                      name: formName,
                      url: formUrl,
                      createdAt: 'Baru saja',
                      synced: true,
                    },
                    ...prev,
                  ];
                });
              }}
            />
          )}

          {activeTab === 'google-forms' && (
            <GoogleFormsView
              forms={forms}
              onAddForm={handleAddForm}
              onDeleteForm={handleDeleteForm}
              onPurgeUncreatedData={handlePurgeUncreatedData}
              onNavigateToToken={(formName) => {
                setActiveTab('token-siswa');
              }}
            />
          )}

          {activeTab === 'token-siswa' && (
            <TokenSiswaView
              tokens={tokens}
              forms={forms}
              quizzes={quizzes}
              activeExamStudentsCount={activeExamStudentsCount}
              onCreateToken={handleCreateToken}
              onUpdateToken={handleUpdateToken}
              onDeleteToken={handleDeleteToken}
              onToggleTokenStatus={handleToggleTokenStatus}
              onOpenLayarQr={handleOpenLayarQr}
              onOpenPanduan={() => setIsPanduanOpen(true)}
              onOpenUjianLive={(tok) => {
                setActiveTab('ujian-live');
              }}
              onOpenStudentWebVersion={(tokenCode) => {
                if (tokenCode) {
                  const matched = tokens.find((t) => t.token === tokenCode);
                  if (matched) setActiveStudentToken(matched);
                } else if (tokens[0]) {
                  setActiveStudentToken(tokens[0]);
                }
                setAppMode('student');
              }}
            />
          )}

          {activeTab === 'ujian-live' && (
            <UjianLiveView
              tokens={tokens}
              selectedTokenCode={tokens[0]?.token}
              students={students}
              onOpenLayarQr={handleOpenLayarQr}
              onNavigateToViolations={() => setActiveTab('riwayat-pelanggaran')}
              onResetStudentStatus={handleResetStudentStatus}
              onSelectToken={(code) => {}}
              onBackToTokens={() => setActiveTab('token-siswa')}
            />
          )}

          {activeTab === 'nilai-siswa' && (
            <NilaiSiswaView students={students} quizzes={quizzes} />
          )}

          {activeTab === 'riwayat-pelanggaran' && (
            <RiwayatPelanggaranView violations={violations} tokens={tokens} />
          )}

          {activeTab === 'download-aplikasi' && <DownloadAplikasiView />}

          {(activeTab === 'status-paket' ||
            activeTab === 'yang-baru' ||
            activeTab === 'perpanjang-paket') && (
            <StatusPaketView
              transactions={transactions}
              onOpenUpgradeModal={() => {
                alert('Paket Anda aktif s/d 07 Sep 2027. Opsi perpanjangan sekolah siap diproses.');
              }}
            />
          )}

          {activeTab === 'panduan' && (
            <div className="p-8 max-w-4xl mx-auto">
              <button
                onClick={() => setIsPanduanOpen(true)}
                className="px-4 py-2 bg-indigo-600 rounded-xl text-white font-bold text-xs"
              >
                Buka Panduan Interaktif
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsView
              gasUrl={gasUrl}
              onSaveGasUrl={setGasUrl}
              onOpenPanduan={() => setIsPanduanOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Layar QR Modal */}
      <LayarQrModal
        isOpen={isLayarQrOpen}
        onClose={() => setIsLayarQrOpen(false)}
        token={selectedTokenForQr || tokens[0]}
        students={students}
        onStartExam={handleStartExamFromLayar}
        onLaunchStudentView={() => {
          setIsLayarQrOpen(false);
          setActiveStudentToken(selectedTokenForQr || tokens[0]);
          setAppMode('student');
        }}
      />

      {/* Lihat Soal Modal */}
      <LihatSoalModal
        isOpen={isLihatSoalOpen}
        onClose={() => setIsLihatSoalOpen(false)}
        quiz={selectedQuizForPreview}
        onCreateTokenForQuiz={(q) => {
          setIsLihatSoalOpen(false);
          const tokenCode = 'ZJT' + Math.random().toString(36).substring(2, 6).toUpperCase();
          const newToken: ExamToken = {
            token: tokenCode,
            label: `Ulangan ${q.title}`,
            quizId: q.id,
            quizTitle: q.title,
            quizSubject: q.subject,
            limit: 1,
            status: 'Aktif',
            expiresAt: null,
            waitingRoom: false,
            waitingRoomStarted: false,
            createdAt: 'Baru saja',
            googleFormUrl: q.googleFormUrl,
            googleFormId: extractFormId(q.googleFormUrl),
          };
          handleCreateToken(newToken);
          setActiveTab('token-siswa');
        }}
      />

      {/* Panduan Modal */}
      <PanduanModal isOpen={isPanduanOpen} onClose={() => setIsPanduanOpen(false)} />

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={handleConfirmLogout}
        userName={teacherUser.name}
        userEmail={teacherUser.email}
      />
    </div>
  );
}
