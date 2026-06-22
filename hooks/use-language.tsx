'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSiteSettings } from './use-site-settings';
import { translations } from '@/lib/translations';

type Locale = 'id' | 'en';

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: 'id',
  setLocale: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { settings, loading } = useSiteSettings();
  const [locale, setLocaleState] = useState<Locale>('id');

  // Load from localStorage or database settings on mount/settings change
  useEffect(() => {
    if (!loading) {
      const savedLocale = localStorage.getItem('site_locale') as Locale | null;
      if (savedLocale === 'id' || savedLocale === 'en') {
        setLocaleState(savedLocale);
      } else if (settings?.default_locale === 'id' || settings?.default_locale === 'en') {
        setLocaleState(settings.default_locale);
      }
    }
  }, [loading, settings]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('site_locale', newLocale);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let translation: any = translations[locale];
    
    for (const k of keys) {
      if (translation && translation[k] !== undefined) {
        translation = translation[k];
      } else {
        // Fallback to ID if translation not found in current locale
        let fallback: any = translations['id'];
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            fallback = key;
          }
        }
        return typeof fallback === 'string' ? fallback : key;
      }
    }
    
    return typeof translation === 'string' ? translation : key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
