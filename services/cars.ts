import { supabase } from '@/lib/supabase';
import type { Car, CarFilters, PaginationMeta } from '@/types';

const PAGE_SIZE = 9;

export async function getCars(
  filters: CarFilters = {},
  page = 1
): Promise<{ cars: Car[]; meta: PaginationMeta }> {
  let query = supabase.from('cars').select('*', { count: 'exact' });

  if (filters.search) {
    query = query.or(
      `brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%`
    );
  }
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters.transmission && filters.transmission !== 'all') {
    query = query.eq('transmission', filters.transmission);
  }
  if (filters.minPrice !== undefined) {
    query = query.gte('price_per_day', filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price_per_day', filters.maxPrice);
  }
  if (filters.available !== undefined) {
    query = query.eq('available', filters.available);
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    cars: (data as Car[]) || [],
    meta: {
      page,
      pageSize: PAGE_SIZE,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / PAGE_SIZE),
    },
  };
}

export async function getCarById(id: string): Promise<Car | null> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Car | null;
}

export async function createCar(car: Omit<Car, 'id' | 'created_at' | 'updated_at'>): Promise<Car> {
  const { data, error } = await supabase
    .from('cars')
    .insert(car)
    .select()
    .single();

  if (error) throw error;
  return data as Car;
}

export async function updateCar(id: string, updates: Partial<Car>): Promise<Car> {
  const { data, error } = await supabase
    .from('cars')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Car;
}

export async function deleteCar(id: string): Promise<void> {
  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) throw error;
}

export async function getPopularCars(limit = 6): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as Car[]) || [];
}

export async function getAllCarsAdmin(): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as Car[]) || [];
}

export const DUMMY_CARS: Omit<Car, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    brand: 'Toyota',
    model: 'Avanza',
    year: 2023,
    transmission: 'Manual',
    fuel_type: 'Bensin',
    seats: 7,
    price_per_day: 350000,
    image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80',
    description: 'Toyota Avanza adalah MPV keluarga yang nyaman dan efisien. Cocok untuk perjalanan keluarga maupun bisnis.',
    features: ['AC', 'Audio System', 'Power Steering', 'Power Window', 'Central Lock'],
    available: true,
    category: 'MPV',
  },
  {
    brand: 'Honda',
    model: 'Brio',
    year: 2022,
    transmission: 'Automatic',
    fuel_type: 'Bensin',
    seats: 5,
    price_per_day: 250000,
    image_url: 'https://images.unsplash.com/photo-1541443131876-44b03de101c3?w=800&q=80',
    description: 'Honda Brio adalah city car yang lincah dan irit bahan bakar. Ideal untuk mobilitas di kota.',
    features: ['AC', 'Audio System', 'Power Steering', 'Airbag', 'USB Charging'],
    available: true,
    category: 'Hatchback',
  },
  {
    brand: 'Suzuki',
    model: 'Ertiga',
    year: 2023,
    transmission: 'Automatic',
    fuel_type: 'Bensin',
    seats: 7,
    price_per_day: 380000,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    description: 'Suzuki Ertiga MPV keluarga yang stylish dengan kabin lega dan teknologi modern.',
    features: ['AC Double Blower', 'Audio Touch Screen', 'Keyless Entry', 'Rear Camera', 'ESP'],
    available: true,
    category: 'MPV',
  },
  {
    brand: 'Mitsubishi',
    model: 'Xpander',
    year: 2023,
    transmission: 'Automatic',
    fuel_type: 'Bensin',
    seats: 7,
    price_per_day: 450000,
    image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
    description: 'Mitsubishi Xpander hadir dengan desain modern dan performa tangguh untuk berbagai medan.',
    features: ['AC Double Blower', 'Android Auto', 'Apple CarPlay', 'Rear Camera', 'Hill Start Assist'],
    available: true,
    category: 'MPV',
  },
  {
    brand: 'Toyota',
    model: 'Innova Reborn',
    year: 2022,
    transmission: 'Automatic',
    fuel_type: 'Solar',
    seats: 8,
    price_per_day: 650000,
    image_url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
    description: 'Toyota Innova Reborn diesel premium dengan kenyamanan berkelas untuk perjalanan jauh.',
    features: ['AC Triple Zone', 'Touch Screen', 'Rear Entertainment', 'Leather Seat', 'Sunroof'],
    available: true,
    category: 'MPV',
  },
  {
    brand: 'Honda',
    model: 'Civic Turbo',
    year: 2022,
    transmission: 'Automatic',
    fuel_type: 'Bensin',
    seats: 5,
    price_per_day: 750000,
    image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    description: 'Honda Civic Turbo sedan sporty dengan performa turbo yang mengagumkan dan teknologi canggih.',
    features: ['Honda Sensing', 'Turbo Engine', 'Sunroof', 'Leather Seat', 'Wireless Charging'],
    available: true,
    category: 'Sedan',
  },
  {
    brand: 'Daihatsu',
    model: 'Terios',
    year: 2023,
    transmission: 'Manual',
    fuel_type: 'Bensin',
    seats: 7,
    price_per_day: 320000,
    image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    description: 'Daihatsu Terios SUV tangguh dengan ground clearance tinggi, cocok untuk medan off-road.',
    features: ['4WD', 'AC', 'Audio System', 'Power Window', 'Fog Lamp'],
    available: true,
    category: 'SUV',
  },
  {
    brand: 'BMW',
    model: '320i',
    year: 2022,
    transmission: 'Automatic',
    fuel_type: 'Bensin',
    seats: 5,
    price_per_day: 1500000,
    image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    description: 'BMW 320i luxury sedan dengan teknologi iDrive terbaru dan performa mesin yang responsif.',
    features: ['iDrive 8', 'Sunroof', 'Harman Kardon', 'Leather Seat', 'Parking Assist', 'Lane Assist'],
    available: true,
    category: 'Luxury',
  },
  {
    brand: 'Mercedes Benz',
    model: 'C200',
    year: 2023,
    transmission: 'Automatic',
    fuel_type: 'Bensin',
    seats: 5,
    price_per_day: 2000000,
    image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
    description: 'Mercedes Benz C200 flagship luxury sedan dengan kemewahan tak tertandingi dan teknologi MBUX.',
    features: ['MBUX System', 'Burmester Audio', 'Panoramic Sunroof', 'Massage Seat', 'Night Package', 'AMG Line'],
    available: true,
    category: 'Luxury',
  },
  {
    brand: 'Toyota',
    model: 'Fortuner',
    year: 2023,
    transmission: 'Automatic',
    fuel_type: 'Solar',
    seats: 7,
    price_per_day: 850000,
    image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    description: 'Toyota Fortuner SUV premium diesel yang gagah dan tangguh untuk semua medan.',
    features: ['4WD', 'Touch Screen', 'Rear Camera', 'Leather Seat', 'Hill Descent Control', 'Downhill Assist'],
    available: true,
    category: 'SUV',
  },
];
