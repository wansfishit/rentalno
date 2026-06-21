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
    <Link href={`/cars/${car.id}`} className="group block">
      <div className="bg-white dark:bg-zinc-950 rounded-[24px] border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 group-hover:border-zinc-300 dark:group-hover:border-zinc-700">
        {/* Image */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          {car.image_urls && car.image_urls.length > 0 ? (
            <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {car.image_urls.map((url, i) => (
                <div key={i} className="w-full h-full shrink-0 snap-center relative">
                  <img
                    src={url}
                    alt={`${car.brand} ${car.model} - Foto ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Dots indicator */}
                  {car.image_urls && car.image_urls.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {car.image_urls.map((_, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
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
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-zinc-300 text-4xl">🚗</span>
            </div>
          )}
          
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge
              variant="secondary"
              className={`px-3 py-1 text-xs font-semibold backdrop-blur-md border-0 ${car.available
                ? 'bg-white/90 text-zinc-900 dark:bg-black/90 dark:text-white'
                : 'bg-red-500/90 text-white dark:bg-red-500/90'
              }`}
            >
              {car.available ? 'Tersedia' : 'Disewa'}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold bg-black/40 text-white backdrop-blur-md border-0 hover:bg-black/60">
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
            <h3 className="font-bold text-xl text-zinc-900 dark:text-white tracking-tight group-hover:text-zinc-600 transition-colors">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-zinc-500 font-medium mt-1">{car.year}</p>
          </motion.div>

          {/* Specs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="flex items-center gap-4 mb-6 text-sm text-zinc-600 dark:text-zinc-400"
          >
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-zinc-400" />
              <span>{car.seats}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <div className="flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-zinc-400" />
              <span>{car.transmission === 'Automatic' ? 'Auto' : 'Manual'}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <div className="flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-zinc-400" />
              <span>{car.fuel_type}</span>
            </div>
          </motion.div>

          {/* Price */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="flex items-end justify-between pt-5 border-t border-zinc-100 dark:border-zinc-800/80"
          >
            <div>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold uppercase tracking-widest mb-1">Mulai Dari</p>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-xl sm:text-2xl text-zinc-900 dark:text-white tracking-tight">
                  {formatCurrency(car.price_per_day)}
                </span>
                <span className="text-sm text-zinc-500">/hari</span>
              </div>
            </div>
            
            <div className="w-11 h-11 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300 transform group-hover:rotate-[-45deg]">
              <ArrowRight className="w-5 h-5" />
            </div>
          </motion.div>
        </div>
      </div>
    </Link>
  );
}
