import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/types';

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Error fetching site settings:', error);
    // Return default fallback
    return {
      id: 1,
      site_title: 'Rentalno',
      site_logo_url: null,
      hero_title: 'Sewa Mobil Premium, Bebas Ribet',
      hero_subtitle: 'Pilihan armada terbaik dengan harga transparan dan asuransi penuh untuk perjalanan Anda yang tak terlupakan.',
      social_facebook: null,
      social_instagram: null,
      social_tiktok: null,
      social_whatsapp: null,
      contact_phone: '+62 813-7882-1654',
      contact_email: 'hello@rentalno.com',
      contact_location: 'Jakarta, Indonesia',
      updated_at: new Date().toISOString(),
    };
  }
  
  return data as SiteSettings;
}

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<void> {
  const { error } = await supabase
    .from('site_settings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', 1);

  if (error) throw error;
}
