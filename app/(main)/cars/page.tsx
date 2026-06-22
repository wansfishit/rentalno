'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import CarCard from '@/components/car-card';
import { CarCardSkeleton } from '@/components/skeletons';
import { getCars } from '@/services/cars';
import type { Car, CarFilters, PaginationMeta, CarCategory, Transmission } from '@/types';
import { useLanguage } from '@/hooks/use-language';

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale } = useLanguage();

  const [cars, setCars] = useState<Car[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, pageSize: 9, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState<CarCategory | 'all'>((searchParams.get('category') as CarCategory) || 'all');
  const [transmission, setTransmission] = useState<Transmission | 'all'>((searchParams.get('transmission') as Transmission) || 'all');
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const page = parseInt(searchParams.get('page') || '1', 10);

  const categories = [
    { value: 'all' as const, label: locale === 'id' ? 'Semua' : 'All' },
    { value: 'MPV' as const, label: 'MPV' },
    { value: 'SUV' as const, label: 'SUV' },
    { value: 'Sedan' as const, label: 'Sedan' },
    { value: 'Hatchback' as const, label: 'Hatchback' },
    { value: 'Luxury' as const, label: locale === 'id' ? 'Mewah' : 'Luxury' },
  ];

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const filters: CarFilters = {
        search: search || undefined,
        category: category !== 'all' ? category : undefined,
        transmission: transmission !== 'all' ? transmission : undefined,
        maxPrice: maxPrice < 2000000 ? maxPrice : undefined,
      };
      const result = await getCars(filters, page);
      setCars(result.cars);
      setMeta(result.meta);
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, transmission, maxPrice, page]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v && v !== 'all') {
        params.set(k, v);
      } else {
        params.delete(k);
      }
    });
    params.delete('page');
    router.push(`/cars?${params.toString()}`);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    updateParams({ search: val });
  };

  const handleCategoryChange = (val: CarCategory | 'all') => {
    setCategory(val);
    updateParams({ category: val });
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setTransmission('all');
    setMaxPrice(2000000);
    router.push('/cars');
  };

  const hasActiveFilters = search || category !== 'all' || transmission !== 'all' || maxPrice < 2000000;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
          {locale === 'id' ? 'Katalog Mobil' : 'Car Catalog'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {meta.total > 0 
            ? (locale === 'id' ? `${meta.total} armada tersedia` : `${meta.total} vehicles available`) 
            : (locale === 'id' ? 'Temukan mobil yang sempurna' : 'Find the perfect car')}
        </p>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={locale === 'id' ? 'Cari merek atau model...' : 'Search brand or model...'}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {locale === 'id' ? 'Filter' : 'Filters'}
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
              category === cat.value
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {locale === 'id' ? 'Transmisi' : 'Transmission'}
              </label>
              <div className="flex gap-2">
                {(['all', 'Automatic', 'Manual'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTransmission(t);
                      updateParams({ transmission: t });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      transmission === t
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {t === 'all' 
                      ? (locale === 'id' ? 'Semua' : 'All') 
                      : (t === 'Automatic' && locale === 'en' ? 'Automatic' : t === 'Automatic' && locale === 'id' ? 'Otomatis' : t)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {locale === 'id' ? 'Harga Maks' : 'Max Price'}:{' '}
                <span className="text-blue-600">
                  {locale === 'id' 
                    ? `Rp ${(maxPrice / 1000).toFixed(0)}rb/hari` 
                    : `IDR ${(maxPrice / 1000).toFixed(0)}k/day`}
                </span>
              </label>
              <input
                type="range"
                min={200000}
                max={2000000}
                step={100000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{locale === 'id' ? 'Rp 200rb' : 'IDR 200k'}</span>
                <span>{locale === 'id' ? 'Rp 2jt' : 'IDR 2m'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {[...Array(9)].map((_, i) => <CarCardSkeleton key={i} />)}
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {locale === 'id' ? 'Tidak ada mobil ditemukan' : 'No cars found'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {locale === 'id' ? 'Coba ubah filter pencarian Anda' : 'Try changing your search filters'}
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {locale === 'id' ? 'Reset Filter' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {cars.map((car) => <CarCard key={car.id} car={car} />)}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            disabled={page <= 1}
            onClick={() => router.push(`/cars?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: String(page - 1) }).toString()}`)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[...Array(meta.totalPages)].map((_, i) => {
            const p = i + 1;
            const isActive = p === page;
            if (Math.abs(p - page) > 2 && p !== 1 && p !== meta.totalPages) {
              if (p === 2 || p === meta.totalPages - 1) return <span key={p} className="text-slate-400">...</span>;
              return null;
            }
            return (
              <button
                key={p}
                onClick={() => router.push(`/cars?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: String(p) }).toString()}`)}
                className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            disabled={page >= meta.totalPages}
            onClick={() => router.push(`/cars?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: String(page + 1) }).toString()}`)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {meta.total > 0 && (
        <p className="text-center text-sm text-slate-400 mt-4">
          {locale === 'id' 
            ? `Menampilkan ${(page - 1) * meta.pageSize + 1}–${Math.min(page * meta.pageSize, meta.total)} dari ${meta.total} mobil`
            : `Showing ${(page - 1) * meta.pageSize + 1}–${Math.min(page * meta.pageSize, meta.total)} of ${meta.total} cars`}
        </p>
      )}
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-8">
          {[...Array(9)].map((_, i) => <CarCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
