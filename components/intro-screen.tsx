'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroScreen() {
  const [showIntro, setShowIntro] = useState(true);

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
          {/* Majestic Car Background Image */}
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img 
              src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop"
              alt="Luxury Car"
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </motion.div>

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
              Rentalno
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
