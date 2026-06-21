'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Fuel, Settings, ArrowRight } from 'lucide-react';
import type { Car } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <Link href={`/cars/detail?id=${car.id}`} className="group block">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-[24px] overflow-hidden shadow-sm dark:shadow-none hover:shadow-2xl dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-500 border border-slate-200 dark:border-white/5 group-hover:border-primary/30 dark:group-hover:border-primary/30">
        {/* Image */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-black">
          {car.image_urls && car.image_urls.length > 0 ? (
            <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {car.image_urls.map((url, i) => (
                <div key={i} className="w-full h-full shrink-0 snap-center relative">
                  <img
                    src={url}
                    alt={`${car.brand} ${car.model} - Foto ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  />
                  {/* Dots indicator */}
                  {car.image_urls && car.image_urls.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {car.image_urls.map((_, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${i === idx ? 'bg-primary' : 'bg-white/50 dark:bg-white/30'}`} />
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
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-slate-300 dark:text-white/20 text-4xl">🚗</span>
            </div>
          )}
          
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge
              variant="secondary"
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-xl border border-slate-200/50 dark:border-white/10 ${car.available
                ? 'bg-white/80 dark:bg-black/50 text-slate-900 dark:text-white'
                : 'bg-red-50 dark:bg-red-900/80 text-red-600 dark:text-white'
              }`}
            >
              {car.available ? 'Tersedia' : 'Disewa'}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-white/80 dark:bg-black/50 text-primary backdrop-blur-xl border border-slate-200/50 dark:border-white/10">
              {car.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-4"
          >
            <h3 className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium mt-1">{car.year}</p>
          </motion.div>

          {/* Specs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="flex items-center gap-4 mb-8 text-sm text-slate-600 dark:text-zinc-400 font-medium"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>{car.seats}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-white/20" />
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              <span>{car.transmission === 'Automatic' ? 'Auto' : 'Manual'}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-white/20" />
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-primary" />
              <span>{car.fuel_type}</span>
            </div>
          </motion.div>

          {/* Price */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="flex items-end justify-between pt-6 border-t border-slate-100 dark:border-white/5"
          >
            <div>
              <p className="text-[10px] sm:text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">Mulai Dari</p>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tighter">
                  {formatCurrency(car.price_per_day)}
                </span>
                <span className="text-sm text-slate-500 dark:text-zinc-500 font-medium">/hari</span>
              </div>
            </div>
            
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white group-hover:bg-primary dark:group-hover:bg-primary group-hover:text-primary-foreground dark:group-hover:text-primary-foreground group-hover:shadow-[0_0_20px_rgba(214,175,54,0.3)] dark:group-hover:shadow-[0_0_20px_rgba(214,175,54,0.5)] transition-all duration-500 transform group-hover:rotate-[-45deg] group-hover:scale-110">
              <ArrowRight className="w-5 h-5" />
            </div>
          </motion.div>
        </div>
      </div>
    </Link>
  );
}
