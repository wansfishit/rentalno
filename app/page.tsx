'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Clock, ChevronDown, Car, Check } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import WhatsAppButton from '@/components/whatsapp-button';
import CarCard from '@/components/car-card';
import { CarCardSkeleton } from '@/components/skeletons';
import { getPopularCars } from '@/services/cars';
import type { Car as CarType } from '@/types';

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Pilih Mobil',
    desc: 'Browse katalog lengkap kami. Filter berdasarkan jenis, transmisi, dan harga sesuai kebutuhan.',
    icon: Car,
  },
  {
    step: '02',
    title: 'Isi Tanggal Sewa',
    desc: 'Tentukan tanggal mulai dan selesai. Harga dihitung otomatis dan transparan tanpa biaya tersembunyi.',
    icon: Clock,
  },
  {
    step: '03',
    title: 'Konfirmasi & Pergi',
    desc: 'Booking dikonfirmasi dalam 1x24 jam. Mobil siap di lokasi yang disepakati.',
    icon: Check,
  },
];

const FAQS = [
  {
    q: 'Berapa minimal durasi sewa?',
    a: 'Minimal sewa adalah 1 hari. Tidak ada batasan maksimal — bisa sewa mingguan atau bulanan dengan harga lebih hemat.',
  },
  {
    q: 'Apakah harga sudah termasuk BBM?',
    a: 'Harga yang tertera belum termasuk bahan bakar. Pelanggan bertanggung jawab atas pengisian BBM selama masa sewa.',
  },
  {
    q: 'Bagaimana jika terjadi kecelakaan?',
    a: 'Semua armada dilengkapi asuransi komprehensif. Hubungi tim kami segera dan kami akan bantu proses klaimnya.',
  },
  {
    q: 'Apakah ada deposit yang diperlukan?',
    a: 'Ya, deposit awal diperlukan sebagai jaminan. Besaran deposit bervariasi sesuai jenis kendaraan dan akan dikembalikan setelah masa sewa selesai.',
  },
  {
    q: 'Bisa sewa dengan atau tanpa supir?',
    a: 'Tersedia opsi lepas kunci (tanpa supir) maupun dengan supir berpengalaman dengan biaya tambahan.',
  },
];

export default function HomePage() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    getPopularCars(6)
      .then(setCars)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/30" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24 pb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              10+ Armada Premium Tersedia
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Sewa Mobil{' '}
              <span className="text-blue-400">Mudah</span>
              <br />& Terpercaya
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
              Pilihan armada lengkap dari city car hingga luxury sedan. Proses booking online, harga transparan, dan layanan 24/7.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 mb-10">
              {[
                { value: '500+', label: 'Pelanggan Puas' },
                { value: '10+', label: 'Armada Pilihan' },
                { value: '4.9', label: 'Rating Rata-rata', icon: <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <div>
                    <div className="flex items-center gap-1">
                      {stat.icon}
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/cars"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-600/30"
              >
                Sewa Mobil Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl backdrop-blur-sm border border-white/10 transition-colors"
              >
                Cara Kerja
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 animate-bounce">
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Asuransi Lengkap', desc: 'Semua armada diasuransikan' },
              { icon: Clock, title: 'Layanan 24/7', desc: 'Siap membantu kapanpun' },
              { icon: Star, title: 'Rating 4.9/5', desc: 'Dari 500+ ulasan pengguna' },
              { icon: Car, title: 'Armada Terawat', desc: 'Perawatan berkala terjadwal' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR CARS */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">Armada Pilihan</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Mobil Populer</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Pilihan terbaik dari pelanggan kami</p>
            </div>
            <Link
              href="/cars"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Lihat semua mobil
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [...Array(6)].map((_, i) => <CarCardSkeleton key={i} />)
              : cars.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-14">
            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">Mudah & Cepat</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Cara Kerja RentAja</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-lg mx-auto">
              Tiga langkah sederhana untuk memulai perjalananmu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, idx) => (
              <div key={item.step} className="relative">
                {idx < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-800 z-0" />
                )}
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
                  <span className="text-5xl font-black text-slate-100 dark:text-slate-800 absolute top-4 right-5 select-none">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Mulai Sewa Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">Testimoni</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Kata Mereka</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Budi Santoso',
                role: 'Marketing Manager',
                text: 'Proses booking sangat mudah, mobil datang tepat waktu dan bersih. Pasti akan sewa lagi untuk trip keluarga berikutnya.',
                rating: 5,
                avatar: 'B',
              },
              {
                name: 'Sari Dewi',
                role: 'Freelancer',
                text: 'Harga sangat kompetitif dibanding tempat lain. Innova Reborn yang saya sewa kondisinya prima. Customer service responsif banget.',
                rating: 5,
                avatar: 'S',
              },
              {
                name: 'Dimas Pratama',
                role: 'Software Engineer',
                text: 'Sewa BMW 320i untuk meeting klien penting. Sangat memuaskan, kondisi mobil sempurna. Worth every rupiah!',
                rating: 5,
                avatar: 'D',
              },
            ].map((review) => (
              <div key={review.name} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-5">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{review.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">Pertanyaan Umum</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">FAQ</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-slate-900 dark:text-white text-sm">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ml-4 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Siap Memulai Perjalanan?
            </h2>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto">
              Bergabung dengan 500+ pelanggan puas yang sudah mempercayakan perjalanan mereka pada RentAja.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/cars"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Lihat Katalog Mobil
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/6281378821654"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-500/30 text-white border border-white/20 font-medium rounded-xl hover:bg-blue-500/40 transition-colors"
              >
                Hubungi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
