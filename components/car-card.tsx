import Link from 'next/link';
import { Users, Fuel, Settings, MapPin } from 'lucide-react';
import type { Car } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <Link href={`/cars/${car.id}`} className="group block">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200">
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
          {car.image_url ? (
            <img
              src={car.image_url}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-slate-400 text-4xl">🚗</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className={`text-xs font-medium ${car.available
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
              }`}
            >
              {car.available ? 'Tersedia' : 'Tidak Tersedia'}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="text-xs bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300">
              {car.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{car.year}</p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-600 dark:text-slate-400">{car.seats} Kursi</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-600 dark:text-slate-400">{car.transmission === 'Automatic' ? 'Auto' : 'Manual'}</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-600 dark:text-slate-400">{car.fuel_type}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                {formatCurrency(car.price_per_day)}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400"> /hari</span>
            </div>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
              Lihat Detail →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
