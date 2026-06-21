import { Suspense } from 'react';
import CarDetailClient from './client';

export default function CarDetailPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center"><p className="text-xl text-slate-500">Memuat data mobil...</p></div>}>
      <CarDetailClient />
    </Suspense>
  );
}
