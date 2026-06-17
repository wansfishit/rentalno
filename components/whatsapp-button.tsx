'use client';

import { Phone } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/6281378821654"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
      aria-label="Chat WhatsApp"
    >
      <Phone className="w-5 h-5" />
      <span className="text-sm font-medium hidden sm:block">WhatsApp</span>
    </a>
  );
}
