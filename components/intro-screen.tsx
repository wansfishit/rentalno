'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettings } from '@/hooks/use-site-settings';

export default function IntroScreen() {
  const [showIntro, setShowIntro] = useState(true);
  const { settings } = useSiteSettings();
  const siteTitle = settings?.site_title || 'Rentalno';

  useEffect(() => {
    // Hide intro after 2.5 seconds to allow the majestic intro to play
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="intro-screen"
          initial={{ y: 0 }}
          exit={{ 
            y: "-100%", 
            transition: { 
              duration: 1, 
              ease: [0.76, 0, 0.24, 1] 
            } 
          }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Elegant Dark Background */}
          <div className="absolute inset-0 bg-slate-950 z-0">
            {/* Subtle animated gradient glow */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-blue-600/20 rounded-full blur-[100px]"
            />
          </div>

          {/* Intro Text */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 0.5,
              ease: "easeOut"
            }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>
              {siteTitle}
            </h1>
            
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "60px" }}
              transition={{ delay: 1, duration: 0.8, ease: "easeInOut" }}
              className="h-1 bg-white"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
