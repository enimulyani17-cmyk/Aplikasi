import React from 'react';
import { X, BookOpen, Sparkles, Key, Radio, ShieldCheck } from 'lucide-react';

interface PanduanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PanduanModal: React.FC<PanduanModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Panduan Penggunaan soalpintar.ai</h3>
              <p className="text-xs text-slate-400">Langkah mudah mengelola ujian online di kelas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Step 1 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Generate Soal Otomatis dengan AI</span>
              </h4>
              <p className="text-slate-400">
                Pilih menu <strong>AI Generator</strong>, masukkan topik pelajaran (misal: "Kerucut", "Fotosintesis"), pilih jenjang kelas, jumlah opsi (A-D atau A-E), dan taksonomi Bloom (LOTS/MOTS/HOTS). Klik Generate, AI akan menyusun soal lengkap beserta kunci dan pembahasannya.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5 mb-1">
                <Key className="w-4 h-4 text-indigo-400" />
                <span>Buat Token Akses Siswa</span>
              </h4>
              <p className="text-slate-400">
                Buka menu <strong>Token Siswa</strong>. Tentukan batas pelanggaran (misal 1 kali keluar ujian), opsi ruang tunggu, lalu klik Buat Token. Token 7 karakter unik (seperti <code>ZJT0P4M</code>) akan langsung dibuat.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5 mb-1">
                <Radio className="w-4 h-4 text-amber-400" />
                <span>Tampilkan Layar QR di Proyektor</span>
              </h4>
              <p className="text-slate-400">
                Klik tombol <strong>Layar QR</strong> dan proyeksikan ke layar proyektor kelas. Siswa cukup scan QR code atau membuka link web ujian lalu mengetikkan nama, kelas, dan absen.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Pantau Ujian Live & Buka Blokir Siswa</span>
              </h4>
              <p className="text-slate-400">
                Di menu <strong>Ujian Live</strong>, Anda dapat melihat siapa saja siswa yang sedang mengerjakan, terputus, atau selesai. Jika ada siswa yang tidak sengaja terblokir karena menyentuh notifikasi atau keluar layar, guru dapat menekan tombol <strong>"Izinkan ulang"</strong> seketika!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
