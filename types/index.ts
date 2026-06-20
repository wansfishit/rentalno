export type UserRole = 'user' | 'admin';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type Transmission = 'Manual' | 'Automatic';
export type FuelType = 'Bensin' | 'Solar' | 'Hybrid' | 'Listrik';
export type CarCategory = 'MPV' | 'SUV' | 'Sedan' | 'Hatchback' | 'Luxury';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  transmission: Transmission;
  fuel_type: FuelType;
  seats: number;
  price_per_day: number;
  image_url: string | null;
  description: string | null;
  features: string[];
  available: boolean;
  category: CarCategory;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  car_id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  total_price: number;
  status: BookingStatus;
  notes: string | null;
  guest_name?: string | null;
  guest_phone?: string | null;
  guest_address?: string | null;
  guest_location?: string | null;
  created_at: string;
  updated_at: string;
  car?: Car;
  profile?: Profile;
}

export interface Review {
  id: string;
  user_id: string;
  car_id: string;
  booking_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  profile?: Profile;
}

export interface CarFilters {
  search?: string;
  category?: CarCategory | 'all';
  transmission?: Transmission | 'all';
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
