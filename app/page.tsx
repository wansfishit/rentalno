'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Clock, ChevronDown, Car, Check } from 'lucide-react';
import { motion, Variants, Transition } from 'framer-motion';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import WhatsAppButton from '@/components/whatsapp-button';
import CarCard from '@/components/car-card';
import IntroScreen from '@/components/intro-screen';
import ReviewsSection from '@/components/reviews-section';
import { CarCardSkeleton } from '@/components/skeletons';
import { getPopularCars } from '@/services/cars';
import type { Car as CarType } from '@/types';

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Pilih Mobil',
    desc: 'Cari mobil yang sesuai dengan kebutuhan Anda. Filter berdasarkan jenis, harga, dan transmisi.',
    icon: Car,
  },
  {
    step: '2',
    title: 'Tentukan Tanggal',
    desc: 'Pilih tanggal mulai dan selesai sewa. Harga dihitung secara otomatis dan transparan.',
    icon: Clock,
  },
  {
    step: '3',
    title: 'Konfirmasi',
    desc: 'Lakukan pembayaran dan mobil siap digunakan pada waktu yang telah ditentukan.',
    icon: Check,
  },
];

const FAQS = [
  {
    q: 'Berapa minimal durasi sewa?',
    a: 'Minimal sewa adalah 1 hari (24 jam). Tidak ada batasan maksimal, Anda bisa menyewa untuk mingguan atau bulanan dengan harga lebih murah.',
  },
  {
    q: 'Apakah harga sudah termasuk bahan bakar?',
    a: 'Harga sewa belum termasuk bahan bakar (BBM). Pelanggan diharapkan mengisi BBM sesuai dengan penggunaan selama masa sewa.',
  },
  {
    q: 'Bagaimana jika terjadi kendala di jalan?',
    a: 'Semua armada kami dilindungi oleh asuransi. Hubungi customer service kami yang siap membantu 24 jam.',
  },
  {
    q: 'Apakah perlu deposit awal?',
    a: 'Ya, kami membutuhkan deposit sebagai jaminan yang akan dikembalikan 100% setelah masa sewa selesai tanpa masalah.',
  },
  {
    q: 'Bisa sewa lepas kunci?',
    a: 'Ya, kami menyediakan opsi sewa lepas kunci (tanpa supir) maupun dengan supir sesuai kebutuhan Anda.',
  },
];

// iOS Spring Configurations
const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

const gentleSpringTransition: Transition = {
  type: "spring",
  stiffness: 80,
  damping: 20,
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: gentleSpringTransition
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

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
    <div className="bg-slate-50 min-h-screen text-slate-900">
      <IntroScreen />
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-24 bg-black border-b border-zinc-900 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <motion.div 
              className="max-w-2xl"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 variants={fadeUpVariants} className="text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
                Eksplorasi <br/>
                <span className="text-zinc-500">Tanpa Batas.</span>
              </motion.h1>
              
              <motion.p variants={fadeUpVariants} className="text-lg text-zinc-400 leading-relaxed mb-10 max-w-lg font-light tracking-wide">
                Armada eksklusif dengan pelayanan kelas satu. Pesan langsung dari mana saja, kapan saja.
              </motion.p>

              <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/cars" passHref legacyBehavior>
                  <motion.a
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors"
                  >
                    Pilih Mobil Anda
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </motion.a>
                </Link>
                <Link href="/#how-it-works" passHref legacyBehavior>
                  <motion.a
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-white hover:text-black text-white font-medium rounded-full border border-zinc-700 transition-all duration-300"
                  >
                    Lihat Cara Kerja
                  </motion.a>
                </Link>
              </motion.div>

              <motion.div variants={fadeUpVariants} className="flex items-center gap-8 pt-8 border-t border-zinc-800">
                <div>
                  <p className="text-3xl font-light text-white">500+</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Klien Eksklusif</p>
                </div>
                <div className="w-px h-12 bg-zinc-800" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-light text-white">4.9</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-white"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Rating Kepuasan</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-3xl overflow-hidden shadow-2xl bg-black aspect-[4/3] relative"
              >
                <img 
                  src="https://images.unsplash.com/photo-1503376760367-1234c9c7f66a?q=80&w=1200&auto=format&fit=crop" 
                  alt="Luxury Car Rental" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="bg-white py-12 border-b border-slate-200 overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Proteksi Penuh', desc: 'Asuransi komprehensif' },
              { icon: Clock, title: 'Layanan VIP', desc: 'Bantuan 24/7 di mana saja' },
              { icon: Check, title: 'Kondisi Prima', desc: 'Standar perawatan tertinggi' },
              { icon: Car, title: 'Koleksi Eksklusif', desc: 'Hanya kendaraan terbaik' },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUpVariants} className="flex flex-col items-center text-center p-4">
                <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center mb-5 shadow-lg">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* POPULAR CARS */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
        >
          <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Mobil Terpopuler</h2>
              <p className="text-slate-600 mt-2">Pilihan armada yang paling sering disewa oleh pelanggan.</p>
            </div>
            <Link href="/cars" passHref legacyBehavior>
              <motion.a 
                whileHover={{ x: 5 }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:opacity-70 transition-opacity uppercase tracking-widest"
              >
                Katalog Lengkap
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [...Array(6)].map((_, i) => <CarCardSkeleton key={i} />)
              : cars.map((car) => (
                  <motion.div key={car.id} variants={fadeUpVariants} whileHover={{ y: -5 }} transition={springTransition}>
                    <CarCard car={car} />
                  </motion.div>
                ))}
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200 overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
        >
          <motion.div variants={fadeUpVariants} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Cara Memesan</h2>
            <p className="text-slate-600 mt-3 max-w-xl mx-auto">
              Proses penyewaan yang cepat dan tidak ribet. Mulai dari memilih mobil hingga konfirmasi hanya dalam beberapa menit.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <motion.div key={item.step} variants={fadeUpVariants} className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100 text-center hover:bg-white hover:shadow-xl transition-all duration-300">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={springTransition}
                  className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md"
                >
                  <span className="text-xl font-bold">{item.step}</span>
                </motion.div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* REVIEWS */}
      <ReviewsSection />

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white border-t border-slate-200 overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl"
        >
          <motion.div variants={fadeUpVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Pertanyaan yang Sering Diajukan</h2>
          </motion.div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <motion.div
                key={idx}
                variants={fadeUpVariants}
                className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden"
              >
                <motion.button
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-100 transition-colors"
                >
                  <span className="font-medium text-slate-900">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={springTransition}
                  >
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  </motion.div>
                </motion.button>
                {openFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={springTransition}
                    className="px-5 pb-5 text-slate-600 pt-2 border-t border-slate-200"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24 bg-zinc-950 overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={fadeUpVariants}
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            Mulai Perjalanan Anda.
          </h2>
          <p className="text-zinc-400 text-lg lg:text-xl mb-10 font-light max-w-2xl mx-auto">
            Jangan kompromi untuk kenyamanan. Pesan sekarang dan nikmati standar layanan tertinggi kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cars" passHref legacyBehavior>
              <motion.a
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                transition={springTransition}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors"
              >
                Lihat Katalog
              </motion.a>
            </Link>
            <motion.a
              href="https://wa.me/6281378821654"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={springTransition}
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border border-zinc-700 font-medium rounded-full hover:bg-white hover:text-black transition-colors"
            >
              Hubungi Admin
            </motion.a>
          </div>
        </motion.div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
