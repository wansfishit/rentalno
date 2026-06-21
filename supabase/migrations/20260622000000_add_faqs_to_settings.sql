-- Add faqs jsonb column to site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]'::jsonb;

-- Populate default FAQs if the column is currently empty
UPDATE site_settings
SET faqs = '[
  {
    "q": "Berapa minimal durasi sewa?",
    "a": "Minimal sewa adalah 1 hari (24 jam). Tidak ada batasan maksimal, Anda bisa menyewa untuk mingguan atau bulanan dengan harga lebih murah."
  },
  {
    "q": "Apakah harga sudah termasuk bahan bakar?",
    "a": "Harga sewa belum termasuk bahan bakar (BBM). Pelanggan diharapkan mengisi BBM sesuai dengan penggunaan selama masa sewa."
  },
  {
    "q": "Bagaimana jika terjadi kendala di jalan?",
    "a": "Semua armada kami dilindungi oleh asuransi. Hubungi customer service kami yang siap membantu 24 jam."
  },
  {
    "q": "Apakah perlu deposit awal?",
    "a": "Ya, kami membutuhkan deposit sebagai jaminan yang akan dikembalikan 100% setelah masa sewa selesai tanpa masalah."
  },
  {
    "q": "Bisa sewa lepas kunci?",
    "a": "Ya, kami menyediakan opsi sewa lepas kunci (tanpa supir) maupun dengan supir sesuai kebutuhan Anda."
  }
]'::jsonb
WHERE id = 1 AND (faqs IS NULL OR faqs = '[]'::jsonb);
