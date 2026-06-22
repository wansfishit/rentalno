'use client';

import { useState, useEffect, useRef } from 'react';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { updateSiteSettings } from '@/services/settings';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Save, Upload, Image as ImageIcon, Loader2, Plus, Trash2 } from 'lucide-react';
import type { SiteSettings } from '@/types';

export default function AdminSettingsPage() {
  const { settings, refreshSettings } = useSiteSettings();
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateSiteSettings(formData);
      await refreshSettings();
      toast.success('Pengaturan berhasil disimpan');
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Math.random()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('car-images').getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, site_logo_url: data.publicUrl }));
      toast.success('Logo berhasil diunggah');
    } catch (error) {
      toast.error('Gagal mengunggah logo');
    } finally {
      setUploading(false);
    }
  };

  const handleFaqChange = (index: number, key: 'q' | 'a', value: string) => {
    const newFaqs = [...(formData.faqs || [])];
    newFaqs[index] = { ...newFaqs[index], [key]: value };
    setFormData((prev) => ({ ...prev, faqs: newFaqs }));
  };

  const handleAddFaq = () => {
    const newFaqs = [...(formData.faqs || [])];
    newFaqs.push({ q: '', a: '' });
    setFormData((prev) => ({ ...prev, faqs: newFaqs }));
  };

  const handleRemoveFaq = (index: number) => {
    const newFaqs = (formData.faqs || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, faqs: newFaqs }));
  };

  if (!settings) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengaturan Website</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Kelola identitas, teks, dan tautan sosial media website Anda.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-8">
        
        {/* Identitas Website */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Identitas Dasar</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Judul Website</label>
              <input
                type="text"
                value={formData.site_title || ''}
                onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Nama ini akan muncul di pojok kiri atas dan teks di berbagai halaman.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bahasa Utama Website (Default Language)</label>
              <select
                value={formData.default_locale || 'id'}
                onChange={(e) => setFormData({ ...formData, default_locale: e.target.value as 'id' | 'en' })}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="id">Bahasa Indonesia (ID)</option>
                <option value="en">English (EN)</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">Bahasa utama yang otomatis aktif saat pertama kali pengunjung membuka website.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Logo Website</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                  {formData.site_logo_url ? (
                    <img src={formData.site_logo_url} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex flex-col items-start gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {formData.site_logo_url ? 'Ganti Logo' : 'Unggah Logo'}
                  </button>
                  {formData.site_logo_url && (
                    <button
                      onClick={() => setFormData({ ...formData, site_logo_url: null })}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Hapus Logo (Gunakan Ikon)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Hero Section Texts */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Teks Halaman Utama (Hero)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Judul Utama (Besar)</label>
              <textarea
                value={formData.hero_title || ''}
                onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sub-judul (Deskripsi)</label>
              <textarea
                value={formData.hero_subtitle || ''}
                onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Social Links */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Media Sosial</h2>
          <p className="text-sm text-slate-500 mb-4">Masukkan nomor WhatsApp dan username media sosial Anda (cukup nama akun saja, tanpa menuliskan alamat link website lengkap).</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nomor WhatsApp</label>
              <input
                type="text"
                placeholder="Contoh: 6281378821654"
                value={formData.social_whatsapp || ''}
                onChange={(e) => setFormData({ ...formData, social_whatsapp: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username Instagram</label>
              <input
                type="text"
                placeholder="Contoh: rentalno.id"
                value={formData.social_instagram || ''}
                onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username Facebook</label>
              <input
                type="text"
                placeholder="Contoh: rentalno"
                value={formData.social_facebook || ''}
                onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username TikTok</label>
              <input
                type="text"
                placeholder="Contoh: rentalno (atau @rentalno)"
                value={formData.social_tiktok || ''}
                onChange={(e) => setFormData({ ...formData, social_tiktok: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Contact Info */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Informasi Kontak</h2>
          <p className="text-sm text-slate-500 mb-4">Ditampilkan di bagian Footer dan halaman Kontak.</p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nomor Telepon</label>
                <input
                  type="text"
                  placeholder="+62 813-..."
                  value={formData.contact_phone || ''}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alamat Email</label>
                <input
                  type="email"
                  placeholder="hello@..."
                  value={formData.contact_email || ''}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alamat Lengkap (Lokasi)</label>
              <textarea
                value={formData.contact_location || ''}
                onChange={(e) => setFormData({ ...formData, contact_location: e.target.value })}
                rows={2}
                placeholder="Jl. Sudirman No. 1..."
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Pertanyaan Teratas (FAQ) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Pertanyaan Teratas (FAQ)</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Kelola daftar pertanyaan yang sering diajukan di halaman utama website.</p>
            </div>
            <button
              type="button"
              onClick={handleAddFaq}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              Tambah FAQ
            </button>
          </div>

          <div className="space-y-4">
            {(!formData.faqs || formData.faqs.length === 0) ? (
              <div className="text-center py-6 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                Belum ada FAQ. Ketuk "Tambah FAQ" untuk memulai.
              </div>
            ) : (
              formData.faqs.map((faq, index) => (
                <div key={index} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/60 relative group">
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Pertanyaan #{index + 1}</label>
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => handleFaqChange(index, 'q', e.target.value)}
                        placeholder="Contoh: Berapa minimal durasi sewa?"
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Jawaban</label>
                      <textarea
                        value={faq.a}
                        onChange={(e) => handleFaqChange(index, 'a', e.target.value)}
                        rows={2}
                        placeholder="Masukkan jawaban..."
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-start pt-6">
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(index)}
                      className="p-2.5 text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20 rounded-xl transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-950/50"
                      title="Hapus FAQ"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}
