'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Car, Globe, User, Phone, Instagram, Facebook } from 'lucide-react';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { cn, formatSocialLink } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';

export default function LiquidTabBar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('home');
  const [showSocials, setShowSocials] = useState(false);
  const { settings } = useSiteSettings();
  const { locale, t } = useLanguage();
  
  const phone = settings?.contact_phone || '6281378821654';
  const waLink = settings?.social_whatsapp || phone;
  const igLink = settings?.social_instagram || 'rentalno.id';
  const fbLink = settings?.social_facebook || 'rentalno';
  const tiktokLink = settings?.social_tiktok || 'rentalno';

  const tabs = [
    { id: 'home', href: '/', icon: Home, label: locale === 'id' ? 'Beranda' : 'Home' },
    { id: 'cars', href: '/cars', icon: Car, label: t('navbar.cars') },
    { id: 'contact', href: '#contact', icon: Globe, label: locale === 'id' ? 'Sosial' : 'Social' },
    { id: 'profile', href: '/profile', icon: User, label: locale === 'id' ? 'Profil' : 'Profile' },
  ];

  useEffect(() => {
    if (showSocials) {
      setActiveTab('contact');
    } else {
      if (pathname === '/cars') setActiveTab('cars');
      else if (pathname.startsWith('/profile')) setActiveTab('profile');
      else if (pathname === '/') setActiveTab('home');
      else setActiveTab('');
    }
  }, [pathname, showSocials]);

  return (
    <>
      {/* SVG Filter for the Gooey Liquid effect */}
      <svg className="hidden" width="0" height="0">
        <filter id="gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix 
            in="blur" 
            mode="matrix" 
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" 
            result="gooey" 
          />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>
      </svg>

      {/* Overlay Backdrop to close popup */}
      <AnimatePresence>
        {showSocials && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[98] bg-black/20 dark:bg-black/50 backdrop-blur-sm pointer-events-auto"
            onClick={() => setShowSocials(false)}
          />
        )}
      </AnimatePresence>

      {/* Social Media Popup Menu */}
      <AnimatePresence>
        {showSocials && (
          <motion.div
            initial={{ opacity: 0, y: 15, x: '-50%', scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: 15, x: '-50%', scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-24 left-1/2 z-[99] pointer-events-auto flex items-center gap-3.5 px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/20 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          >
            {/* WA */}
            {waLink && (
              <a
                href={formatSocialLink(waLink, 'whatsapp')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center bg-[#25D366] text-white hover:scale-110 active:scale-95 transition-transform shadow-[0_4px_12px_rgba(37,211,102,0.3)]"
                title="WhatsApp"
                onClick={() => setShowSocials(false)}
              >
                <Phone className="w-5 h-5 fill-white text-[#25D366]" />
              </a>
            )}
            
            {/* IG */}
            {igLink && (
              <a
                href={formatSocialLink(igLink, 'instagram')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white hover:scale-110 active:scale-95 transition-transform shadow-[0_4px_12px_rgba(238,42,123,0.3)]"
                title="Instagram"
                onClick={() => setShowSocials(false)}
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            
            {/* FB */}
            {fbLink && (
              <a
                href={formatSocialLink(fbLink, 'facebook')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center bg-[#1877F2] text-white hover:scale-110 active:scale-95 transition-transform shadow-[0_4px_12px_rgba(24,119,242,0.3)]"
                title="Facebook"
                onClick={() => setShowSocials(false)}
              >
                <Facebook className="w-5 h-5 fill-white text-[#1877F2]" />
              </a>
            )}

            {/* TikTok */}
            {tiktokLink && (
              <a
                href={formatSocialLink(tiktokLink, 'tiktok')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center bg-black text-white hover:scale-110 active:scale-95 transition-transform shadow-[0_4px_12px_rgba(0,0,0,0.3)] border border-white/10"
                title="TikTok"
                onClick={() => setShowSocials(false)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 left-0 right-0 z-[100] px-4 flex justify-center pointer-events-none">
        {/* Floating Container */}
        <div 
          className={cn(
            "pointer-events-auto flex items-center relative overflow-hidden",
            "bg-white/40 dark:bg-black/40 backdrop-blur-[40px] saturate-[1.8]",
            "rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
            "border border-white/40 dark:border-white/10",
            "p-1.5"
          )}
          style={{
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 1px rgba(0,0,0,0.1)',
          }}
        >
          {/* Gooey Layer Container */}
          <div 
            className="absolute inset-0 z-0 opacity-80"
            style={{ filter: 'url(#gooey)' }}
          >
            {tabs.map((tab) => (
              tab.id === activeTab && (
                <motion.div
                  key="active-blob"
                  layoutId="liquid-blob"
                  className="absolute bg-white dark:bg-zinc-800 rounded-full"
                  style={{
                    width: 'calc(100% / 4 - 8px)',
                    height: 'calc(100% - 12px)',
                    top: '6px',
                    left: `calc((100% / 4) * ${tabs.findIndex(t => t.id === tab.id)} + 4px)`
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    mass: 0.8
                  }}
                />
              )
            ))}
          </div>

          {/* Icons / Interaction Layer */}
          <div className="relative z-10 flex items-center w-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              
              const Inner = (
                <div className="flex flex-col items-center justify-center w-16 h-12 relative">
                  <motion.div
                    animate={{ 
                      scale: isActive ? 1.15 : 1,
                      y: isActive ? -2 : 0
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <tab.icon 
                      className={cn(
                        "w-5 h-5 transition-colors duration-300",
                        isActive 
                          ? "text-black dark:text-white" 
                          : "text-slate-500 dark:text-zinc-400"
                      )} 
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </motion.div>
                  <span className="sr-only">{tab.label}</span>
                </div>
              );

              if (tab.id === 'contact') {
                return (
                  <button 
                    key={tab.id} 
                    onClick={() => setShowSocials(!showSocials)}
                    className="relative cursor-pointer focus:outline-none"
                    aria-label={tab.label}
                  >
                    {Inner}
                  </button>
                );
              }

              return (
                <Link 
                  key={tab.id} 
                  href={tab.href}
                  className="relative cursor-pointer"
                  onClick={() => setShowSocials(false)}
                  aria-label={tab.label}
                >
                  {Inner}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
