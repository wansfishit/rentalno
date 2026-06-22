'use client';

import Link from 'next/link';
import { Instagram, Phone, MapPin, Mail, Facebook } from 'lucide-react';
import Logo from '@/components/logo';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { formatSocialLink, formatWhatsAppNumber } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';

export default function Footer() {
  const { settings } = useSiteSettings();
  const { locale, t } = useLanguage();
  
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-8">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <Logo size="sm" variant="blue" textClassName="text-slate-900 dark:text-white" />
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-slate-500 dark:text-zinc-500 font-light">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-3">
              {waLink && (
                <a
                  href={formatSocialLink(waLink, 'whatsapp')}
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
                  href={formatSocialLink(igLink, 'instagram')}
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
                  href={formatSocialLink(fbLink, 'facebook')}
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
                  href={formatSocialLink(tiktokLink, 'tiktok')}
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
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/cars', label: locale === 'id' ? 'Katalog Mobil' : 'Car Catalog' },
                { href: '/cars?category=MPV', label: locale === 'id' ? 'MPV Family' : 'Family MPV' },
                { href: '/cars?category=SUV', label: 'SUV & Offroad' },
                { href: '/cars?category=Luxury', label: locale === 'id' ? 'Mobil Mewah' : 'Luxury Cars' },
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
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/#how-it-works', label: t('navbar.how_it_works') },
                { href: '/#faq', label: t('navbar.faq') },
                { href: '/login', label: t('navbar.login') },
                { href: '/register', label: locale === 'id' ? 'Daftar Gratis' : 'Register Free' },
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
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-sm min-w-0">
              {phone && (
                <li className="flex items-start gap-3 min-w-0">
                  <Phone className="w-4 h-4 text-slate-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                  <a href={`https://wa.me/${formatWhatsAppNumber(phone)}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-white transition-colors break-all min-w-0">
                    {phone}
                  </a>
                </li>
              )}
              {igLink && (
                <li className="flex items-start gap-3 min-w-0">
                  <Instagram className="w-4 h-4 text-slate-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                  <a href={formatSocialLink(igLink, 'instagram')} target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-white transition-colors break-all min-w-0">
                    {igLink}
                  </a>
                </li>
              )}
              {location && (
                <li className="flex items-start gap-3 min-w-0">
                  <MapPin className="w-4 h-4 text-slate-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                  <span className="break-words min-w-0">{location}</span>
                </li>
              )}
              {email && (
                <li className="flex items-start gap-3 min-w-0">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-primary dark:hover:text-white transition-colors break-all min-w-0">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
 
        <div className="border-t border-slate-200 dark:border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} {settings?.site_title || 'RentAja'}. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#" className="text-slate-500 dark:text-zinc-500 hover:text-primary transition-colors tracking-wide">{t('footer.privacy')}</Link>
            <Link href="#" className="text-slate-500 dark:text-zinc-500 hover:text-primary transition-colors tracking-wide">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
