import React, { useState } from 'react';
import { Plus, Save, ExternalLink, Trash2, Key, Check } from 'lucide-react';
import { GoogleFormItem } from '../types';

interface GoogleFormsViewProps {
  forms: GoogleFormItem[];
  onAddForm: (name: string, url: string) => void;
  onDeleteForm: (id: string) => void;
  onPurgeUncreatedData?: () => void;
  onNavigateToToken: (formName: string) => void;
}

export const GoogleFormsView: React.FC<GoogleFormsViewProps> = ({
  forms,
  onAddForm,
  onDeleteForm,
  onPurgeUncreatedData,
  onNavigateToToken,
}) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    onAddForm(name.trim(), url.trim());
    setName('');
    setUrl('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Google Forms</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar Google Form yang sudah di-generate dari Bank Soal atau ditambahkan manual
          </p>
        </div>

        {onPurgeUncreatedData && forms.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Hapus histori Google Form yang tidak ada di Bank Soal?')) {
                onPurgeUncreatedData();
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan Histori Form Tidak Valid</span>
          </button>
        )}
      </div>

      {/* Tambahkan Form Manual Card matching Screenshot 1 & 10 */}
      <div className="bg-[#10172a] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-4">
          <div className="w-4 h-4 rounded-full border border-indigo-400 flex items-center justify-center text-[10px]">
            +
          </div>
          <span>Tambahkan Form Manual</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                URL Google Form
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://docs.google.com/forms/..."
                className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Label / Nama Form
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: UTS Biologi Kelompok 1"
                className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Simpan</span>
              </button>
            </div>
          </div>

          {savedSuccess && (
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 animate-fade-in font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>Google Form berhasil ditambahkan ke daftar!</span>
            </p>
          )}
        </form>
      </div>

      {/* Forms List Table */}
      <div className="bg-[#10172a] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Formulir Terhubung ({forms.length})</h3>
        </div>

        <div className="divide-y divide-slate-800/80">
          {forms.map((item) => (
            <div
              key={item.id}
              className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition"
            >
              <div>
                <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                <p className="text-xs text-slate-400 font-mono truncate max-w-md mt-0.5">
                  {item.url}
                </p>
                <span className="text-[10px] text-slate-500">Ditambahkan {item.createdAt}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateToToken(item.name)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 hover:bg-indigo-600/50 text-indigo-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Buat Token Ujian</span>
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Form</span>
                </a>

                <button
                  onClick={() => onDeleteForm(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {forms.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              Belum ada Google Form yang tersimpan. Gunakan form di atas untuk menambahkan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
