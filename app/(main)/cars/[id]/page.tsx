import { getAllCarsAdmin } from '@/services/cars';
import CarDetailClient from './client';

export async function generateStaticParams() {
  try {
    const cars = await getAllCarsAdmin();
    return cars.map((car) => ({
      id: String(car.id),
    }));
  } catch (error) {
    console.error('Failed to fetch cars for generateStaticParams:', error);
    return [];
  }
}

export default function CarDetailPage({ params }: { params: { id: string } }) {
  return <CarDetailClient params={params} />;
}
