'use client';

import { useState, useEffect } from 'react';
import { Trash2, Star, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getAllReviewsAdmin, deleteReview } from '@/services/reviews';
import type { Review } from '@/types';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchReviews = async () => {
    const data = await getAllReviewsAdmin();
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) return;
    
    const { success } = await deleteReview(id);
    if (success) {
      toast.success('Ulasan berhasil dihapus');
      setReviews(reviews.filter(r => r.id !== id));
    } else {
      toast.error('Gagal menghapus ulasan');
    }
  };

  const filteredReviews = reviews.filter(r => {
    const name = r.guest_name || '';
    return name.toLowerCase().includes(search.toLowerCase()) || 
           r.comment.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ulasan Pelanggan</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola ulasan yang ditampilkan di halaman utama.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau isi ulasan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400 text-sm">Pengulas</th>
                <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400 text-sm">Rating</th>
                <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400 text-sm">Ulasan</th>
                <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400 text-sm">Tanggal</th>
                <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400 text-sm text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" /></td>
                    <td className="py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" /></td>
                    <td className="py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48" /></td>
                    <td className="py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" /></td>
                    <td className="py-4 text-right"><div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded inline-block" /></td>
                  </tr>
                ))
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Tidak ada ulasan ditemukan
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => {
                  const name = review.guest_name || 'Guest';
                  return (
                    <tr key={review.id} className="group">
                      <td className="py-4 text-sm font-medium text-slate-900 dark:text-white">
                        {name}
                        {!review.user_id && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-normal">
                            Guest
                          </span>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="flex gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </td>
                      <td className="py-4 text-sm text-slate-600 dark:text-slate-400 max-w-md truncate">
                        {review.comment}
                      </td>
                      <td className="py-4 text-sm text-slate-500">
                        {new Date(review.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Hapus Ulasan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
