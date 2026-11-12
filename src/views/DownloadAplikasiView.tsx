import React from 'react';
import { Smartphone, Shield, Download, Check, AlertCircle } from 'lucide-react';

export const DownloadAplikasiView: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Download Aplikasi Android</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Aplikasi Ujian Aman (Lockdown Browser) untuk smartphone siswa Android
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Download & QR */}
        <div className="md:col-span-5 bg-[#10172a] border border-slate-800 rounded-3xl p-6 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
            <Smartphone className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white">SoalPintar Exam Lockdown</h3>
            <p className="text-xs text-slate-400 mt-1">Versi 2.4.1 (Android 8.0+)</p>
          </div>

          {/* QR Code */}
          <div className="p-3 bg-white rounded-2xl inline-block shadow-lg">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://soalpintar.ai/download-app"
              alt="Scan QR Download APK"
              className="w-40 h-40"
            />
          </div>

          <p className="text-[11px] text-slate-400">
            Scan QR menggunakan kamera smartphone siswa untuk langsung mengunduh APK.
          </p>

          <a
            href="#download"
            onClick={(e) => {
              e.preventDefault();
              alert('File installer SoalPintar-Lockdown-v2.4.1.apk siap diinstal.');
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download APK Langsung (14 MB)</span>
          </a>
        </div>

        {/* Right Column: Features & Guide */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Proteksi Mode Lockdown</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white">Anti-Keluar & Kunci Tombol Navigasi:</strong> Siswa tidak dapat menekan tombol Home, Recent Apps, atau tombol Back selama ujian.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white">Blokir Notifikasi & Split Screen:</strong> Notifikasi WhatsApp, panggilan masuk di latar belakang, dan multi-window ditolak otomatis.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white">Sinkronisasi Real-Time:</strong> Status online, pelanggaran, dan progres jawaban langsung tercatat di layar Guru Ujian Live.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#10172a] border border-amber-500/30 rounded-2xl p-6">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>Opsi Alternatif Siswa Tanpa Instalasi Aplikasi</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Jika ada siswa yang menggunakan iPhone/iPad, laptop, atau HP yang memorinya penuh, siswa cukup membuka browser Chrome/Safari dan mengakses{' '}
              <span className="text-indigo-400 font-bold font-mono">Secure Web Player</span> dengan token yang Anda bagikan. Web player dilengkapi pengawas fullscreen dan pendeteksi tab switch otomatis!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
