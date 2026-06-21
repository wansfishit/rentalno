'use client';

import Link from 'next/link';
import { Instagram, Phone, MapPin, Mail, Facebook } from 'lucide-react';
import Logo from '@/components/logo';
import { useSiteSettings } from '@/hooks/use-site-settings';

export default function Footer() {
  const { settings } = useSiteSettings();
  
  const fbLink = settings?.social_facebook;
  const igLink = settings?.social_instagram;
  const tiktokLink = settings?.social_tiktok;
  const waLink = settings?.social_whatsapp;

  const phone = settings?.contact_phone || '+62 813-7882-1654';
  const email = settings?.contact_email || 'hello@rentalno.com';
  const location = settings?.contact_location || 'Jakarta, Indonesia';
  return (
    <footer className="bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-white/5 text-slate-600 dark:text-zinc-400 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <Logo size="sm" variant="blue" textClassName="text-slate-900 dark:text-white" />
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-slate-500 dark:text-zinc-500 font-light">
              Platform sewa mobil eksklusif dengan armada terbaik dan proses instan. Perjalanan mewah Anda dimulai di sini.
            </p>
            <div className="flex items-center gap-3">
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white dark:bg-white/5 hover:bg-primary dark:hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 group border border-slate-200 dark:border-white/10 hover:border-primary dark:hover:border-primary"
                  aria-label="WhatsApp"
                >
                  <Phone className="w-4 h-4 text-slate-500 dark:text-zinc-400 group-hover:text-primary-foreground" />
                </a>
              )}
              {igLink && (
                <a
                  href={igLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white dark:bg-white/5 hover:bg-primary dark:hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 group border border-slate-200 dark:border-white/10 hover:border-primary dark:hover:border-primary"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-slate-500 dark:text-zinc-400 group-hover:text-primary-foreground" />
                </a>
              )}
              {fbLink && (
                <a
                  href={fbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white dark:bg-white/5 hover:bg-primary dark:hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 group border border-slate-200 dark:border-white/10 hover:border-primary dark:hover:border-primary"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-slate-500 dark:text-zinc-400 group-hover:text-primary-foreground" />
                </a>
              )}
              {tiktokLink && (
                <a
                  href={tiktokLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white dark:bg-white/5 hover:bg-primary dark:hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 group border border-slate-200 dark:border-white/10 hover:border-primary dark:hover:border-primary"
                  aria-label="TikTok"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-500 dark:text-zinc-400 group-hover:text-primary-foreground">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Layanan</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/cars', label: 'Katalog Mobil' },
                { href: '/cars?category=MPV', label: 'MPV Family' },
                { href: '/cars?category=SUV', label: 'SUV & Offroad' },
                { href: '/cars?category=Luxury', label: 'Mobil Mewah' },
                { href: '/cars?category=Sedan', label: 'Sedan' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary dark:hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Perusahaan</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/#how-it-works', label: 'Cara Kerja' },
                { href: '/#faq', label: 'FAQ' },
                { href: '/login', label: 'Masuk' },
                { href: '/register', label: 'Daftar Gratis' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary dark:hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm">
              {phone && (
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                  <a href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-white transition-colors">
                    {phone}
                  </a>
                </li>
              )}
              {igLink && (
                <li className="flex items-start gap-3">
                  <Instagram className="w-4 h-4 text-slate-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                  <a href={igLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-white transition-colors">
                    {igLink.split('/').pop() || 'Instagram'}
                  </a>
                </li>
              )}
              {location && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                  <span>{location}</span>
                </li>
              )}
              {email && (
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-primary dark:hover:text-white transition-colors">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} {settings?.site_title || 'Rentalno'}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#" className="text-slate-500 dark:text-zinc-500 hover:text-primary transition-colors tracking-wide">Kebijakan Privasi</Link>
            <Link href="#" className="text-slate-500 dark:text-zinc-500 hover:text-primary transition-colors tracking-wide">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
