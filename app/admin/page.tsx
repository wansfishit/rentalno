'use client';

import { useState, useEffect } from 'react';
import { Users, Car, ListOrdered, DollarSign, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getAdminStats, getAdminRecentActivities, RecentActivityItem } from '@/services/bookings';
import { formatCurrency } from '@/lib/utils';
import { StatCardSkeleton } from '@/components/skeletons';

interface Stats {
  totalUsers: number;
  totalCars: number;
  totalBookings: number;
  totalRevenue: number;
}

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) {
    return 'Baru saja';
  } else if (diffMin < 60) {
    return `${diffMin} menit lalu`;
  } else if (diffHr < 24) {
    return `${diffHr} jam lalu`;
  } else if (diffDay < 30) {
    return `${diffDay} hari lalu`;
  } else {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminStats().then(setStats),
      getAdminRecentActivities().then(setActivities)
    ]).finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats
    ? [
        {
          label: 'Total Pengguna',
          value: stats.totalUsers.toLocaleString(),
          icon: Users,
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-900/30',
          trend: '+12% bulan ini',
        },
        {
          label: 'Armada Aktif',
          value: stats.totalCars.toLocaleString(),
          icon: Car,
          color: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-emerald-50 dark:bg-emerald-900/30',
          trend: '10 unit tersedia',
        },
        {
          label: 'Total Booking',
          value: stats.totalBookings.toLocaleString(),
          icon: ListOrdered,
          color: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-50 dark:bg-amber-900/30',
          trend: '+8% minggu ini',
        },
        {
          label: 'Total Pendapatan',
          value: formatCurrency(stats.totalRevenue),
          icon: DollarSign,
          color: 'text-violet-600 dark:text-violet-400',
          bg: 'bg-violet-50 dark:bg-violet-900/30',
          trend: 'Dikonfirmasi + Selesai',
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Selamat datang kembali. Berikut ringkasan hari ini.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {loading
          ? [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
          : STAT_CARDS.map((card) => (
              <div
                key={card.label}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="w-3 h-3" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {card.value}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{card.trend}</p>
              </div>
            ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-5">Aksi Cepat</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/admin/cars', label: 'Tambah Mobil', icon: Car, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
              { href: '/admin/bookings', label: 'Kelola Booking', icon: ListOrdered, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
              { href: '/admin/users', label: 'Lihat Users', icon: Users, color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
              { href: '/cars', label: 'Lihat Frontend', icon: TrendingUp, color: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className={`flex items-center gap-3 p-3.5 rounded-xl ${action.color} hover:opacity-80 transition-opacity`}
              >
                <action.icon className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">{action.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-5">Aktivitas Terkini</h2>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada aktivitas terbaru.</p>
            ) : (
              activities.map((activity, i) => {
                const Icon = activity.type === 'booking' ? Clock
                  : activity.type === 'confirm' ? CheckCircle
                  : activity.type === 'cancel' ? XCircle
                  : activity.type === 'user' ? Users
                  : CheckCircle;

                const iconColor = activity.type === 'cancel' ? 'text-red-500' : activity.type === 'complete' ? 'text-emerald-500' : 'text-blue-500';

                return (
                  <div key={i} className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{activity.action}</p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{formatRelativeTime(activity.created_at)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
