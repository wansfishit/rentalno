'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Loader2, Car, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { updateProfile } from '@/services/profiles';
import { getUserBookings, cancelBooking } from '@/services/bookings';
import { formatCurrency, formatDateShort, getStatusColor, getStatusLabel } from '@/lib/utils';
import type { Booking } from '@/types';
import { useLanguage } from '@/hooks/use-language';

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const { locale, t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile'>('bookings');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.username || '');
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      getUserBookings(user.id)
        .then(setBookings)
        .finally(() => setBookingsLoading(false));
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user.id, { username: fullName });
      await refreshProfile();
      toast.success(locale === 'id' ? 'Profil berhasil diperbarui' : 'Profile updated successfully');
    } catch {
      toast.error(locale === 'id' ? 'Gagal memperbarui profil' : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!user) return;
    try {
      await cancelBooking(bookingId, user.id);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
      toast.success(locale === 'id' ? 'Booking dibatalkan' : 'Booking cancelled');
    } catch {
      toast.error(locale === 'id' ? 'Gagal membatalkan booking' : 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const totalSpend = bookings
    .filter((b) => ['confirmed', 'completed'].includes(b.status))
    .reduce((s, b) => s + b.total_price, 0);

  const stats = [
    { 
      icon: Car, 
      label: locale === 'id' ? 'Total Booking' : 'Total Bookings', 
      value: bookings.length 
    },
    { 
      icon: Calendar, 
      label: locale === 'id' ? 'Aktif' : 'Active', 
      value: bookings.filter((b) => b.status === 'confirmed').length 
    },
    { 
      icon: TrendingUp, 
      label: locale === 'id' ? 'Total Pengeluaran' : 'Total Spend', 
      value: formatCurrency(totalSpend) 
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
          {(profile?.username || user?.email || 'U')[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {profile?.username || (locale === 'id' ? 'Pengguna' : 'User')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
            <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {(['bookings', 'profile'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab === 'bookings' 
              ? (locale === 'id' ? 'Riwayat Booking' : 'Booking History') 
              : (locale === 'id' ? 'Edit Profil' : 'Edit Profile')}
          </button>
        ))}
      </div>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          {bookingsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Car className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {locale === 'id' ? 'Belum ada booking' : 'No bookings yet'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
                {locale === 'id' ? 'Mulai sewa mobil impianmu sekarang' : 'Start renting your dream car now'}
              </p>
              <a
                href="/cars"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {locale === 'id' ? 'Lihat Katalog' : 'View Catalog'}
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Car image */}
                    <div className="w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                      {booking.car?.image_url ? (
                        <img
                          src={booking.car.image_url}
                          alt={`${booking.car?.brand} ${booking.car?.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🚗</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {booking.car?.brand} {booking.car?.model}
                        </h3>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status, locale)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                        <span>{formatDateShort(booking.start_date, locale)} — {formatDateShort(booking.end_date, locale)}</span>
                        <span>{booking.total_days} {locale === 'id' ? 'hari' : 'days'}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(booking.total_price)}
                        </span>
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-xs text-red-500 hover:text-red-700 hover:underline"
                          >
                            {locale === 'id' ? 'Batalkan' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('auth.full_name')}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">
                {locale === 'id' ? 'Email tidak dapat diubah' : 'Email cannot be changed'}
              </p>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving 
                ? (locale === 'id' ? 'Menyimpan...' : 'Saving...') 
                : (locale === 'id' ? 'Simpan Perubahan' : 'Save Changes')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
