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
import { useSiteSettings } from '@/hooks/use-site-settings';

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
  const { settings } = useSiteSettings();
  
  const heroTitle = settings?.hero_title || 'Sewa Mobil Premium,\nBebas Ribet';
  const heroSubtitle = settings?.hero_subtitle || 'Pilihan armada terbaik dengan harga transparan dan asuransi penuh untuk perjalanan Anda yang tak terlupakan.';
  const phone = settings?.contact_phone?.replace(/[^0-9]/g, '') || '6281378821654';

  useEffect(() => {
    getPopularCars(6)
      .then(setCars)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white dark:bg-black min-h-screen text-slate-900 dark:text-white selection:bg-primary/30 transition-colors duration-300">
      <IntroScreen />
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-24 bg-[#050505] border-b border-zinc-900 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <motion.div 
              className="max-w-2xl"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 variants={fadeUpVariants} className="text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8 whitespace-pre-line">
                {heroTitle}
              </motion.h1>
              
              <motion.p variants={fadeUpVariants} className="text-lg text-zinc-400 leading-relaxed mb-10 max-w-lg font-light tracking-wide whitespace-pre-line">
                {heroSubtitle}
              </motion.p>

              <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/cars" passHref legacyBehavior>
                  <motion.a
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest rounded-full hover:shadow-[0_0_30px_rgba(214,175,54,0.4)] transition-all duration-300"
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
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-white/5 text-white font-bold uppercase tracking-widest rounded-full border border-white/20 transition-all duration-300"
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-amber-500 dark:text-white"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
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
              className="hidden lg:flex items-center justify-center relative"
            >
              {/* Abstract Glowing Elements */}
              <div className="relative w-[400px] h-[400px]">
                <motion.div 
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 30, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute inset-0 rounded-full border border-primary/20 border-t-primary/50"
                />
                <motion.div 
                  animate={{ 
                    rotate: -360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 25, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute inset-8 rounded-full border border-primary/10 border-b-primary/40"
                />
                
                {/* Center Glow */}
                <motion.div 
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute inset-20 bg-primary/20 blur-[60px] rounded-full"
                />

                {/* Floating Glass Element */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col shadow-[0_0_30px_rgba(214,175,54,0.15)]"
                >
                  <div className="flex flex-col gap-1 mb-4">
                    <div className="text-white font-bold tracking-wide">Member VIP</div>
                    <Link href="/register" className="text-primary text-xs font-semibold uppercase tracking-widest hover:text-primary/80 transition-colors">Daftar Sekarang &rarr;</Link>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Sering booking? Gabung member untuk menikmati <span className="text-white font-semibold">harga spesial</span> dan prioritas layanan!
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="bg-white dark:bg-[#0A0A0A] py-16 border-b border-slate-200 dark:border-white/5 overflow-hidden transition-colors duration-300">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
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
              <motion.div key={item.title} variants={fadeUpVariants} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-white/5">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-6 shadow-lg dark:shadow-[0_0_20px_rgba(214,175,54,0.3)]">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 tracking-wide">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* POPULAR CARS */}
      <section className="py-24 bg-slate-50 dark:bg-black overflow-hidden relative transition-colors duration-300">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/10 dark:bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
          >
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">Koleksi Terbatas</h2>
              <p className="text-slate-600 dark:text-zinc-400 mt-4 text-lg font-light">Pilihan armada eksklusif yang paling sering disewa oleh klien VIP kami.</p>
            </div>
            <Link href="/cars" passHref legacyBehavior>
              <motion.a 
                whileHover={{ x: 5 }}
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 dark:hover:text-white transition-colors uppercase tracking-widest"
              >
                Katalog Lengkap
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [...Array(6)].map((_, i) => <CarCardSkeleton key={i} />)
              : cars.map((car, index) => (
                  <motion.div 
                    key={car.id} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
                  >
                    <CarCard car={car} />
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-[#0A0A0A] border-y border-slate-200 dark:border-white/5 overflow-hidden transition-colors duration-300">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={staggerContainer}
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
        >
          <motion.div variants={fadeUpVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Cara Memesan</h2>
            <p className="text-slate-600 dark:text-zinc-400 mt-4 max-w-xl mx-auto font-light text-lg">
              Proses penyewaan eksklusif yang cepat dan tanpa hambatan. Pesan dari kenyamanan rumah Anda.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <motion.div key={item.step} variants={fadeUpVariants} className="bg-slate-50 dark:bg-black rounded-2xl p-8 border border-slate-200 dark:border-white/5 text-center hover:bg-white dark:hover:bg-white/5 hover:border-primary/50 dark:hover:border-primary/50 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_0_30px_rgba(214,175,54,0.1)] transition-all duration-500 group">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={springTransition}
                  className="w-16 h-16 bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 group-hover:border-primary dark:group-hover:border-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-md dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors duration-300"
                >
                  <span className="text-xl font-bold group-hover:text-primary transition-colors">{item.step}</span>
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-wide">{item.title}</h3>
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* REVIEWS */}
      <ReviewsSection />

      {/* FAQ */}
      <section id="faq" className="py-24 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-white/5 overflow-hidden transition-colors duration-300">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={staggerContainer}
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl"
        >
          <motion.div variants={fadeUpVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Pertanyaan Teratas</h2>
          </motion.div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <motion.div
                key={idx}
                variants={fadeUpVariants}
                className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none"
              >
                <motion.button
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-slate-900 dark:text-white tracking-wide">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={springTransition}
                  >
                    <ChevronDown className="w-5 h-5 text-primary" />
                  </motion.div>
                </motion.button>
                {openFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={springTransition}
                    className="px-6 pb-6 text-slate-600 dark:text-zinc-400 pt-2 border-t border-slate-100 dark:border-white/5 font-light"
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
      <section className="py-24 bg-black dark:bg-[#050505] overflow-hidden relative transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 dark:from-primary/10 via-black to-black opacity-50" />
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={fadeUpVariants}
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center relative z-10"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            Mulai Perjalanan Eksklusif Anda.
          </h2>
          <p className="text-zinc-300 dark:text-zinc-400 text-lg lg:text-xl mb-12 font-light max-w-2xl mx-auto">
            Jangan kompromi untuk kenyamanan. Pesan sekarang dan nikmati standar layanan kelas atas kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cars" passHref legacyBehavior>
              <motion.a
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                transition={springTransition}
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest rounded-full hover:shadow-[0_0_30px_rgba(214,175,54,0.4)] transition-all duration-300"
              >
                Lihat Katalog
              </motion.a>
            </Link>
            <motion.a
              href={`https://wa.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={springTransition}
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent hover:bg-white/5 text-white font-bold uppercase tracking-widest rounded-full border border-white/20 transition-all duration-300"
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
