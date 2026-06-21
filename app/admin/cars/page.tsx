'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Search, Sparkles, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { getAllCarsAdmin, createCar, updateCar, deleteCar, DUMMY_CARS } from '@/services/cars';
import { formatCurrency } from '@/lib/utils';
import type { Car, CarCategory, Transmission, FuelType } from '@/types';

const EMPTY_FORM = {
  brand: '',
  model: '',
  year: 2023,
  transmission: 'Automatic' as Transmission,
  fuel_type: 'Bensin' as FuelType,
  seats: 5,
  price_per_day: 500000,
  image_urls: [] as string[],
  description: '',
  features: '',
  available: true,
  category: 'MPV' as CarCategory,
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCar, setEditCar] = useState<Car | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [generatingDummies, setGeneratingDummies] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const allCars = await getAllCarsAdmin();
      setCars(allCars);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const openAdd = () => {
    setEditCar(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (car: Car) => {
    setEditCar(car);
    setForm({
      brand: car.brand,
      model: car.model,
      year: car.year,
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      seats: car.seats,
      price_per_day: car.price_per_day,
      image_urls: car.image_urls || (car.image_url ? [car.image_url] : []),
      description: car.description || '',
      features: car.features?.join(', ') || '',
      available: car.available,
      category: car.category,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (form.image_urls.length + files.length > 3) {
      toast.error('Maksimal 3 foto per mobil');
      return;
    }
    
    setSaving(true);
    try {
      const newUrls = [...form.image_urls];
      for (const file of files) {
        const ext = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${ext}`;
        
        const { data, error } = await supabase.storage
          .from('car-images')
          .upload(fileName, file);
          
        if (error) throw error;
        
        const { data: publicUrlData } = supabase.storage
          .from('car-images')
          .getPublicUrl(fileName);
          
        newUrls.push(publicUrlData.publicUrl);
      }
      setForm({ ...form, image_urls: newUrls });
      toast.success('Foto berhasil diunggah');
    } catch (error: any) {
      toast.error('Gagal mengunggah foto: ' + error.message);
    } finally {
      setSaving(false);
      if (e.target) e.target.value = ''; // Reset input
    }
  };

  const handleRemoveImage = (index: number) => {
    const newUrls = [...form.image_urls];
    newUrls.splice(index, 1);
    setForm({ ...form, image_urls: newUrls });
  };

  const handleSave = async () => {
    if (!form.brand || !form.model) {
      toast.error('Merek dan model wajib diisi');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        features: form.features ? form.features.split(',').map((f) => f.trim()).filter(Boolean) : [],
        image_urls: form.image_urls,
        image_url: form.image_urls.length > 0 ? form.image_urls[0] : null,
        description: form.description || null,
      };

      if (editCar) {
        const updated = await updateCar(editCar.id, payload);
        setCars((prev) => prev.map((c) => (c.id === editCar.id ? updated : c)));
        toast.success('Mobil berhasil diperbarui');
      } else {
        const created = await createCar(payload);
        setCars((prev) => [created, ...prev]);
        toast.success('Mobil berhasil ditambahkan');
      }
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCar(id);
      setCars((prev) => prev.filter((c) => c.id !== id));
      toast.success('Mobil dihapus');
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus');
    }
  };

  const handleGenerateDummies = async () => {
    setGeneratingDummies(true);
    let count = 0;
    try {
      for (const dummy of DUMMY_CARS) {
        const created = await createCar(dummy);
        setCars((prev) => [created, ...prev]);
        count++;
      }
      toast.success(`${count} mobil dummy berhasil ditambahkan!`);
    } catch (err: any) {
      toast.error(`Gagal di mobil ke-${count + 1}: ${err.message}`);
    } finally {
      setGeneratingDummies(false);
    }
  };

  const filtered = cars.filter(
    (c) =>
      `${c.brand} ${c.model}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kelola Mobil</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{cars.length} armada terdaftar</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGenerateDummies}
            disabled={generatingDummies}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60 transition-colors"
          >
            {generatingDummies ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Generate 10 Dummy
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Mobil
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari mobil..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Mobil</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden sm:table-cell">Kategori</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden md:table-cell">Transmisi</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Harga/hari</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    {search ? 'Mobil tidak ditemukan' : 'Belum ada data mobil'}
                  </td>
                </tr>
              ) : (
                filtered.map((car) => (
                  <tr key={car.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0">
                          {car.image_urls && car.image_urls.length > 0 ? (
                            <img src={car.image_urls[0]} alt="" className="w-full h-full object-cover" />
                          ) : car.image_url ? (
                            <img src={car.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">🚗</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{car.brand} {car.model}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{car.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{car.category}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{car.transmission}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {formatCurrency(car.price_per_day)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        car.available
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {car.available ? 'Tersedia' : 'Tidak Tersedia'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(car)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {deleteId === car.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(car.id)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteId(null)}
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteId(car.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editCar ? 'Edit Mobil' : 'Tambah Mobil Baru'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Merek *</label>
                  <input
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="Toyota"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Model *</label>
                  <input
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    placeholder="Avanza"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Tahun</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Kursi</label>
                  <input
                    type="number"
                    value={form.seats}
                    onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Harga/hari (Rp)</label>
                  <input
                    type="number"
                    value={form.price_per_day}
                    onChange={(e) => setForm({ ...form, price_per_day: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as CarCategory })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {['MPV', 'SUV', 'Sedan', 'Hatchback', 'Luxury'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Transmisi</label>
                  <select
                    value={form.transmission}
                    onChange={(e) => setForm({ ...form, transmission: e.target.value as Transmission })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Automatic</option>
                    <option>Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Bahan Bakar</label>
                  <select
                    value={form.fuel_type}
                    onChange={(e) => setForm({ ...form, fuel_type: e.target.value as FuelType })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {['Bensin', 'Solar', 'Hybrid', 'Listrik'].map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Foto Mobil (Maks. 3)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={saving || form.image_urls.length >= 3}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <p className="text-[10px] text-slate-500 mt-1">Unggah foto dari galeri (HP/Komputer). Anda dapat memilih lebih dari satu sekaligus.</p>
                
                {form.image_urls.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {form.image_urls.map((url, idx) => (
                      <div key={idx} className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 group">
                        <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-500/90 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm backdrop-blur-sm"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Fitur (pisah dengan koma)
                </label>
                <input
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder="AC, Sunroof, Leather Seat"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, available: !form.available })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    form.available ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    form.available ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {form.available ? 'Tersedia' : 'Tidak Tersedia'}
                </span>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-slate-900 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-colors"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Menyimpan...' : editCar ? 'Perbarui Mobil' : 'Tambah Mobil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
