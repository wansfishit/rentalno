'use client';

import Link from 'next/link';
import { Instagram, Phone, MapPin, Mail, Facebook } from 'lucide-react';
import Logo from '@/components/logo';
import { useSiteSettings } from '@/hooks/use-site-settings';

export default function Footer() {
  const { settings } = useSiteSettings();
  
  const fbLink = settings?.social_facebook;
  const igLink = settings?.social_instagram || 'https://instagram.com/R1STNO';
  const tiktokLink = settings?.social_tiktok;
  const waLink = settings?.social_whatsapp || 'https://wa.me/6281378821654';
  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <Logo size="sm" variant="blue" textClassName="text-white" />
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-zinc-500 font-light">
              Platform sewa mobil eksklusif dengan armada terbaik dan proses instan. Perjalanan mewah Anda dimulai di sini.
            </p>
            <div className="flex items-center gap-3">
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-900 hover:bg-white rounded-full flex items-center justify-center transition-colors group"
                  aria-label="WhatsApp"
                >
                  <Phone className="w-4 h-4 text-zinc-400 group-hover:text-black" />
                </a>
              )}
              {igLink && (
                <a
                  href={igLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-900 hover:bg-white rounded-full flex items-center justify-center transition-colors group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-zinc-400 group-hover:text-black" />
                </a>
              )}
              {fbLink && (
                <a
                  href={fbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-900 hover:bg-white rounded-full flex items-center justify-center transition-colors group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-zinc-400 group-hover:text-black" />
                </a>
              )}
              {tiktokLink && (
                <a
                  href={tiktokLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-900 hover:bg-white rounded-full flex items-center justify-center transition-colors group"
                  aria-label="TikTok"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-zinc-400 group-hover:text-black">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Layanan</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/cars', label: 'Katalog Mobil' },
                { href: '/cars?category=MPV', label: 'MPV Family' },
                { href: '/cars?category=SUV', label: 'SUV & Offroad' },
                { href: '/cars?category=Luxury', label: 'Mobil Mewah' },
                { href: '/cars?category=Sedan', label: 'Sedan' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Perusahaan</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/#how-it-works', label: 'Cara Kerja' },
                { href: '/#faq', label: 'FAQ' },
                { href: '/login', label: 'Masuk' },
                { href: '/register', label: 'Daftar Gratis' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                <a href="https://wa.me/6281378821654" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +62 813-7882-1654
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Instagram className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                <a href="https://instagram.com/R1STNO" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  @R1STNO
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                <span>Jakarta, Indonesia</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                <span>hello@rentalno.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} {settings?.site_title || 'Rentalno'}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#" className="text-zinc-600 hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="text-zinc-600 hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
