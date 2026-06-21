'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Users, Fuel, Settings, Star, Check, ArrowLeft, Loader2, Calendar, MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { getCarById } from '@/services/cars';
import { createBooking } from '@/services/bookings';
import { useAuth } from '@/hooks/use-auth';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Car } from '@/types';

export default function CarDetailClient() {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestLocation, setGuestLocation] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    if (!id) return;
    getCarById(id)
      .then(setCar)
      .catch(() => toast.error('Mobil tidak ditemukan'))
      .finally(() => setLoading(false));
  }, [id]);

  const today = new Date().toISOString().split('T')[0];

  const totalDays =
    startDate && endDate
      ? Math.max(
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ),
          0
        )
      : 0;

  let basePrice = car ? totalDays * car.price_per_day : 0;
  // Apply 10% discount if user is logged in
  const isMember = !!user;
  const discountAmount = isMember ? basePrice * 0.10 : 0;
  const totalPrice = basePrice - discountAmount;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Browser Anda tidak mendukung fitur lokasi');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGuestLocation(`https://maps.google.com/?q=${latitude},${longitude}`);
        setIsGettingLocation(false);
        toast.success('Lokasi otomatis berhasil didapatkan!');
      },
      (error) => {
        setIsGettingLocation(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error('Gagal mendapat lokasi otomatis. Silakan izinkan akses GPS di pengaturan browser/HP Anda lalu ketuk tombol lokasi secara manual.');
        } else {
          toast.error('Gagal mendapatkan lokasi. Pastikan GPS Anda aktif.');
        }
      },
      { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
    );
  };

  // Automatically request GPS location on mount if user is a guest
  useEffect(() => {
    // Only attempt if we have loaded the auth state and user is not a member
    if (!user && !guestLocation && !isGettingLocation) {
      handleGetLocation();
    }
  }, [user]);

  const handleBook = async () => {
    if (!startDate || !endDate) {
      toast.error('Pilih tanggal sewa terlebih dahulu');
      return;
    }
    if (totalDays <= 0) {
      toast.error('Tanggal selesai harus setelah tanggal mulai');
      return;
    }
    if (!car?.available) {
      toast.error('Mobil tidak tersedia saat ini');
      return;
    }
    if (!isMember && (!guestName || !guestPhone)) {
      toast.error('Mohon lengkapi data diri dasar (Nama & WA) untuk melanjutkan');
      return;
    }

    setBookingLoading(true);
    try {
      await createBooking({
        car_id: id as string,
        user_id: user?.id,
        start_date: startDate,
        end_date: endDate,
        total_days: totalDays,
        total_price: totalPrice,
        notes: notes || null,
        guest_name: isMember ? user?.user_metadata?.full_name : guestName,
        guest_phone: guestPhone,
        guest_address: '-', // Set to dash since address is removed
        guest_location: guestLocation,
      });
      
      toast.success('Booking berhasil! Mengalihkan ke WhatsApp...');
      
      // Build WhatsApp Message
      const adminPhone = '6281378821654'; // User's WhatsApp number
      const customerName = isMember ? user?.user_metadata?.full_name : guestName;
      const waMessage = `Halo Rentalno, saya ingin menyewa mobil:
      
*Detail Mobil:*
- Mobil: ${car?.brand} ${car?.model}
- Tanggal Sewa: ${formatDate(startDate)} s/d ${formatDate(endDate)} (${totalDays} hari)
- Total Harga: ${formatCurrency(totalPrice)}

*Data Pemesan:*
- Nama: ${customerName}
- No. WA: ${guestPhone}
${guestLocation ? `- Lokasi Jemput/Antar: ${guestLocation}` : ''}
${notes ? `- Catatan: ${notes}` : ''}

Mohon konfirmasinya. Terima kasih!`;

      const encodedMessage = encodeURIComponent(waMessage);
      const waUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
      
      // Redirect to WhatsApp
      window.location.href = waUrl;
      
    } catch (err: any) {
      toast.error(err.message || 'Gagal membuat booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-[16/9] bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 animate-pulse" />
          </div>
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 max-w-7xl py-20 text-center">
        <p className="text-xl text-slate-500">Mobil tidak ditemukan</p>
        <Link href="/cars" className="mt-4 inline-block text-blue-600 hover:underline">
          Kembali ke katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
      {/* Back */}
      <Link
        href="/cars"
        className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke katalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Car Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
            {car.image_urls && car.image_urls.length > 0 ? (
              <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                {car.image_urls.map((url, i) => (
                  <div key={i} className="w-full h-full shrink-0 snap-center relative">
                    <img
                      src={url}
                      alt={`${car.brand} ${car.model} - foto ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* CSS-only active dot indicator trick */}
                    {car.image_urls && car.image_urls.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {car.image_urls.map((_, idx) => (
                          <div key={idx} className={`w-2 h-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : car.image_url ? (
              <img
                src={car.image_url}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🚗</div>
            )}
          </div>

          {/* Title + Status */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  car.available
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {car.available ? 'Tersedia' : 'Tidak Tersedia'}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {car.category}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {car.brand} {car.model}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">{car.year}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(car.price_per_day)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">per hari</p>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Users, label: 'Kapasitas', value: `${car.seats} Kursi` },
              { icon: Settings, label: 'Transmisi', value: car.transmission },
              { icon: Fuel, label: 'Bahan Bakar', value: car.fuel_type },
              { icon: Star, label: 'Rating', value: '4.9 / 5' },
            ].map((spec) => (
              <div key={spec.label} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <spec.icon className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1.5" />
                <p className="text-xs text-slate-500 dark:text-slate-400">{spec.label}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{spec.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {car.description && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Deskripsi</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{car.description}</p>
            </div>
          )}

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Fitur Unggulan</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {car.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right - Booking Card */}
        <div>
          <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">
              Buat Pemesanan
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Tanggal Mulai
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (endDate && e.target.value >= endDate) setEndDate('');
                    }}
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Tanggal Selesai
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    min={startDate || today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Catatan (opsional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Permintaan khusus..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Data Diri (Guest or Optional override for Member) */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4 space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Data Diri & Pengiriman</h3>
                
                {!isMember && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs p-3 rounded-lg border border-blue-200 dark:border-blue-800/30">
                    <p className="font-semibold mb-1">Anda booking sebagai Guest.</p>
                    <p>Daftar/Login sekarang untuk mendapatkan <strong>Diskon 10%</strong> otomatis di setiap booking!</p>
                  </div>
                )}

                {!isMember && (
                  <>
                    <div>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Nama Lengkap"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <input
                    type="text"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="Nomor WhatsApp"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={guestLocation}
                      onChange={(e) => setGuestLocation(e.target.value)}
                      placeholder="Koordinat Titik Lokasi (Opsional)"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isGettingLocation}
                      className="shrink-0 px-4 flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                      title="Ambil Lokasi Saat Ini (GPS)"
                    >
                      {isGettingLocation ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      ) : (
                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 ml-1">Ketuk ikon di sebelah kanan untuk mendeteksi lokasi otomatis via GPS.</p>
                </div>
              </div>

              {/* Price breakdown */}
              {totalDays > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                     <span className="text-slate-600 dark:text-slate-400">
                       {formatCurrency(car.price_per_day)} × {totalDays} hari
                     </span>
                     <span className="text-slate-900 dark:text-white font-medium">
                       {formatCurrency(basePrice)}
                     </span>
                  </div>
                  
                  {isMember && (
                    <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg -mx-2 px-2">
                      <span>Promo Member (10%)</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between">
                     <span className="font-semibold text-slate-900 dark:text-white">Total</span>
                     <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                       {formatCurrency(totalPrice)}
                     </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBook}
                disabled={bookingLoading || !car.available}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white disabled:text-slate-400 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {bookingLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {!car.available
                  ? 'Tidak Tersedia'
                  : bookingLoading
                  ? 'Memproses...'
                  : 'Pesan Sekarang'}
              </button>

              <p className="text-xs text-slate-400 text-center">
                Konfirmasi dikirim dalam 1×24 jam. Tidak ada pembayaran di muka.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
