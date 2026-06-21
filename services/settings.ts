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
      site_title: 'RentAja',
      site_logo_url: null,
      hero_title: 'Sewa Mobil Premium, Bebas Ribet',
      hero_subtitle: 'Pilihan armada terbaik dengan harga transparan dan asuransi penuh untuk perjalanan Anda yang tak terlupakan.',
      social_facebook: null,
      social_instagram: null,
      social_tiktok: null,
      social_whatsapp: null,
      contact_phone: '+62 813-7882-1654',
      contact_email: 'hello@rentaja.com',
      contact_location: 'Jakarta, Indonesia',
      faqs: [
        {
          q: 'Berapa minimal durasi sewa?',
          a: 'Minimal sewa adalah 1 hari (24 jam). Tidak ada batasan maksimal, Anda bisa menyewa untuk mingguan atau bulanan dengan harga lebih murah.',
        },
        {
          q: 'Apakah harga sudah termasuk bahan bakar?',
          a: 'Harga sewa belum termasuk bahan bakar (BBM). Pelanggan diharapkan mengisi BBM sesuai dengan penggunaan selama masa sewa.',
        },
        {
          q: 'Bagaimana jika terjadi kendala di jalan?',
          a: 'Semua armada kami dilindungi oleh asuransi. Hubungi customer service kami yang siap membantu 24 jam.',
        },
        {
          q: 'Apakah perlu deposit awal?',
          a: 'Ya, kami membutuhkan deposit sebagai jaminan yang akan dikembalikan 100% setelah masa sewa selesai tanpa masalah.',
        },
        {
          q: 'Bisa sewa lepas kunci?',
          a: 'Ya, kami menyediakan opsi sewa lepas kunci (tanpa supir) maupun dengan supir sesuai kebutuhan Anda.',
        },
      ],
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
