'use client';

import { useState, useEffect } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { getAllBookings, updateBookingStatus } from '@/services/bookings';
import { formatCurrency, formatDateShort, getStatusColor, getStatusLabel } from '@/lib/utils';
import type { Booking, BookingStatus } from '@/types';

const STATUS_TABS: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'confirmed', label: 'Dikonfirmasi' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const result = await getAllBookings(statusFilter, page, PAGE_SIZE);
      setBookings(result.bookings);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, page]);

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      toast.success('Status booking diperbarui');
    } catch {
      toast.error('Gagal memperbarui status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manajemen Booking</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{total} total booking</p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
              statusFilter === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            </div>
          ))
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            Tidak ada booking ditemukan
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {booking.guest_name || booking.profile?.username || 'Guest'}
                    {!booking.user_id && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
                        GUEST
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    WA: {booking.guest_phone || '—'}
                  </p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                  {getStatusLabel(booking.status)}
                </span>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-sm">
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  {booking.car?.brand} {booking.car?.model}
                </p>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-xs">
                  <span>{formatDateShort(booking.start_date)} - {formatDateShort(booking.end_date)}</span>
                  <span>{booking.total_days} hari</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(booking.total_price)}
                </span>
                <select
                  value={booking.status}
                  onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                  className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="pending">Menunggu</option>
                  <option value="confirmed">Konfirmasi</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Batalkan</option>
                </select>
              </div>
              
              {(booking.guest_address || booking.guest_location) && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                  {booking.guest_address && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      📍 {booking.guest_address}
                    </p>
                  )}
                  {booking.guest_location && (
                    <a href={booking.guest_location} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      🔗 Buka ShareLoc
                    </a>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {['Pengguna & Kontak', 'Mobil', 'Tanggal', 'Total', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
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
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    Tidak ada booking ditemukan
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {booking.guest_name || booking.profile?.username || 'Guest'}
                          </p>
                          {!booking.user_id && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
                              GUEST
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          WA: {booking.guest_phone || '—'}
                        </p>
                        {booking.guest_address && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px] truncate" title={booking.guest_address}>
                            📍 {booking.guest_address}
                          </p>
                        )}
                        {booking.guest_location && (
                          <a href={booking.guest_location} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                            🔗 Buka ShareLoc
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-900 dark:text-white">
                        {booking.car?.brand} {booking.car?.model}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {booking.total_days} hari
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {formatDateShort(booking.start_date)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        s/d {formatDateShort(booking.end_date)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {formatCurrency(booking.total_price)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                        className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="pending">Menunggu</option>
                        <option value="confirmed">Konfirmasi</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Batalkan</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Halaman {page} dari {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
