'use client';

import { Phone } from 'lucide-react';
import { useSiteSettings } from '@/hooks/use-site-settings';

export default function WhatsAppButton() {
  const { settings } = useSiteSettings();
  const phone = settings?.contact_phone?.replace(/[^0-9]/g, '') || '6281378821654';

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 sm:bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-colors"
      aria-label="Chat WhatsApp"
    >
      <Phone className="w-5 h-5" />
      <span className="text-sm font-medium hidden sm:block">WhatsApp</span>
    </a>
  );
}
