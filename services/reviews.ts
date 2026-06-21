import { supabase } from '@/lib/supabase';
import type { Review } from '@/types';

export async function getPublicReviews(limit = 6): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching public reviews:', error);
    return [];
  }

  return data as Review[];
}

export async function getAllReviewsAdmin(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all reviews:', error);
    return [];
  }

  return data as Review[];
}

export async function createReview(reviewData: Partial<Review>): Promise<{ success: boolean; error?: any }> {
  const { error } = await supabase
    .from('reviews')
    .insert([reviewData]);

  if (error) {
    console.error('Error creating review:', error);
    return { success: false, error };
  }

  return { success: true };
}

export async function deleteReview(id: string): Promise<{ success: boolean; error?: any }> {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting review:', error);
    return { success: false, error };
  }

  return { success: true };
}
