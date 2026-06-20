import { supabase } from '@/lib/supabase';
import type { Booking, BookingStatus } from '@/types';

export async function createBooking(
  data: Pick<Booking, 'car_id' | 'start_date' | 'end_date' | 'total_days' | 'total_price' | 'notes'> & {
    user_id?: string;
    guest_name?: string;
    guest_phone?: string;
    guest_address?: string;
    guest_location?: string;
  }
): Promise<void> {
  if (data.user_id) {
    await supabase.from('profiles').upsert({ 
      id: data.user_id,
      username: data.guest_name || 'User'
    }, { onConflict: 'id' });
  }

  const { error } = await supabase
    .from('bookings')
    .insert(data);

  if (error) throw error;
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, car:cars(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as Booking[]) || [];
}

export async function getAllBookings(
  status?: BookingStatus | 'all',
  page = 1,
  pageSize = 10
): Promise<{ bookings: Booking[]; total: number }> {
  let query = supabase
    .from('bookings')
    .select('*, car:cars(*), profile:profiles(username)', { count: 'exact' });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { bookings: (data as Booking[]) || [], total: count || 0 };
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function cancelBooking(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getAdminStats() {
  const [
    { count: totalUsers },
    { count: totalCars },
    { count: totalBookings },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('cars').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase
      .from('bookings')
      .select('total_price')
      .in('status', ['confirmed', 'completed']),
  ]);

  const totalRevenue =
    revenueData?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

  return {
    totalUsers: totalUsers || 0,
    totalCars: totalCars || 0,
    totalBookings: totalBookings || 0,
    totalRevenue,
  };
}
