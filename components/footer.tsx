import Link from 'next/link';
import { Car, Instagram, Phone, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg text-white tracking-tight">
                Rent<span className="text-blue-400">Aja</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-slate-500">
              Platform sewa mobil terpercaya dengan armada lengkap dan proses mudah. Perjalanan nyaman dimulai di sini.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/6281378821654"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors group"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </a>
              <a
                href="https://instagram.com/R1STNO"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors group"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </a>
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
                <Phone className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <a href="https://wa.me/6281378821654" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +62 813-7882-1654
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Instagram className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <a href="https://instagram.com/R1STNO" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  @R1STNO
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Jakarta, Indonesia</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>hello@rentaja.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} RentAja. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#" className="text-slate-600 hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="text-slate-600 hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
