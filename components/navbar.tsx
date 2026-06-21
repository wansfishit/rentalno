'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, Settings, ChevronDown, Sun, Moon } from 'lucide-react';
import Logo from '@/components/logo';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Berhasil keluar');
    router.push('/');
  };

  const navLinks = [
    { href: '/cars', label: 'Armada' },
    { href: '/#how-it-works', label: 'Cara Kerja' },
    { href: '/#faq', label: 'FAQ' },
  ];

  const isHome = pathname === '/';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || !isHome
          ? 'bg-white/80 dark:bg-black/60 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 shadow-lg'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Logo 
              size="sm" 
              variant="blue" 
              textClassName={cn(
                'transition-colors duration-300',
                scrolled || !isHome ? 'text-slate-900 dark:text-white' : 'text-white'
              )} 
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-all duration-300 hover:text-primary tracking-wide uppercase',
                  scrolled || !isHome
                    ? 'text-slate-600 dark:text-zinc-300'
                    : 'text-white/90',
                  pathname === link.href && (scrolled || !isHome) && 'text-primary dark:text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle isTransparentContext={!scrolled && isHome} />

            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors border border-transparent',
                    scrolled || !isHome
                      ? 'text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 border-slate-200 dark:border-white/10'
                      : 'text-white/90 hover:bg-white/10 border-white/20'
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-[0_0_15px_rgba(214,175,54,0.3)]">
                    {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate tracking-wide">{profile?.full_name || user.email?.split('@')[0]}</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-48 bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl py-2 z-50">
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 dark:text-zinc-300 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <Settings className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link href="/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 dark:text-zinc-300 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <User className="w-4 h-4" />
                      Profil Saya
                    </Link>
                    <div className="border-t border-slate-100 dark:border-white/10 my-2" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className={cn(
                    'text-sm font-medium transition-colors tracking-wide uppercase',
                    scrolled || !isHome
                      ? 'text-slate-600 dark:text-zinc-300 hover:text-primary'
                      : 'text-white/90 hover:text-primary'
                  )}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-full hover:shadow-[0_0_20px_rgba(214,175,54,0.4)] transition-all uppercase tracking-wide"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'md:hidden p-2 rounded-lg transition-colors',
                scrolled || !isHome
                  ? 'text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                  : 'text-white hover:bg-white/10'
              )}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 shadow-2xl absolute w-full">
          <div className="container mx-auto px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors tracking-wide uppercase"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-slate-100 dark:border-white/10 pt-4 mt-4 space-y-3">
              {user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary uppercase tracking-wide">
                      <Settings className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary uppercase tracking-wide">
                    <User className="w-4 h-4" />
                    Profil Saya
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 uppercase tracking-wide"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link href="/login" className="block px-4 py-3 rounded-full border border-slate-200 dark:border-white/20 text-sm font-bold text-center text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 uppercase tracking-wide">
                    Masuk
                  </Link>
                  <Link href="/register" className="block px-4 py-3 rounded-full text-sm font-bold bg-primary text-primary-foreground text-center shadow-[0_0_15px_rgba(214,175,54,0.3)] uppercase tracking-wide">
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
