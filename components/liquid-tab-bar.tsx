'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Car, Phone, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'home', href: '/', icon: Home, label: 'Beranda' },
  { id: 'cars', href: '/cars', icon: Car, label: 'Armada' },
  { id: 'contact', href: 'https://wa.me/6281378821654', icon: Phone, label: 'Kontak' },
  { id: 'profile', href: '/profile', icon: User, label: 'Profil' },
];

export default function LiquidTabBar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (pathname === '/cars') setActiveTab('cars');
    else if (pathname.startsWith('/profile')) setActiveTab('profile');
    else if (pathname === '/') setActiveTab('home');
    else setActiveTab('');
  }, [pathname]);

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
            // Chromatic dispersion pseudo-glow via box-shadow
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 1px rgba(0,0,0,0.1)',
          }}
        >
          {/* Gooey Layer Container */}
          <div 
            className="absolute inset-0 z-0 opacity-80"
            style={{ filter: 'url(#gooey)' }}
          >
            {TABS.map((tab) => (
              tab.id === activeTab && (
                <motion.div
                  key="active-blob"
                  layoutId="liquid-blob"
                  className="absolute bg-white dark:bg-zinc-800 rounded-full"
                  style={{
                    width: 'calc(100% / 4 - 8px)',
                    height: 'calc(100% - 12px)',
                    top: '6px',
                    left: `calc((100% / 4) * ${TABS.findIndex(t => t.id === tab.id)} + 4px)`
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
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const isExternal = tab.href.startsWith('http');
              
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
                </div>
              );

              return isExternal ? (
                <a 
                  key={tab.id} 
                  href={tab.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative cursor-pointer"
                >
                  {Inner}
                </a>
              ) : (
                <Link 
                  key={tab.id} 
                  href={tab.href}
                  className="relative cursor-pointer"
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
