'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/logo';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { useLanguage } from '@/hooks/use-language';

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { settings } = useSiteSettings();
  const { locale, t } = useLanguage();
  const siteTitle = settings?.site_title || 'RentAja';
  const router = useRouter();

  const schema = useMemo(() => z.object({
    full_name: z.string().min(2, t('auth.name_min')),
    email: z.string().email(t('auth.invalid_email')),
    password: z.string().min(6, t('auth.password_min')),
    confirm_password: z.string(),
  }).refine((d) => d.password === d.confirm_password, {
    message: t('auth.password_mismatch'),
    path: ['confirm_password'],
  }), [t]);

  type FormData = z.infer<typeof schema>;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error(locale === 'id' ? 'Email sudah terdaftar. Silakan masuk.' : 'Email is already registered. Please login.');
      } else {
        toast.error(error.message);
      }
      setLoading(false);
      return;
    }

    toast.success(locale === 'id' ? 'Akun berhasil dibuat!' : 'Account successfully created!');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=85"
          alt="Car"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-slate-900/20" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-white text-xl font-semibold mb-2">
            "{locale === 'id' ? 'Sewa mobil jadi lebih mudah dan transparan. Pilihan armada terbaik.' : 'Car rental made easier and transparent. Best fleet options.'}"
          </p>
          <p className="text-white/80 text-sm">
            {locale === 'id' ? `Bergabunglah dengan ribuan pelanggan puas ${siteTitle}.` : `Join thousands of satisfied ${siteTitle} customers.`}
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-slate-950">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <Link href="/">
              <Logo size="lg" />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1.5">{t('auth.create_account')}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('auth.free_no_card')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('auth.full_name')}
              </label>
              <input
                {...register('full_name')}
                type="text"
                placeholder={locale === 'id' ? 'Nama Anda' : 'Your Name'}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {errors.full_name && (
                <p className="mt-1 text-xs text-red-500">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('auth.email')}
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="nama@email.com"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder={locale === 'id' ? 'Minimal 6 karakter' : 'At least 6 characters'}
                  className="w-full px-4 py-2.5 pr-11 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('auth.confirm_password')}
              </label>
              <input
                {...register('confirm_password')}
                type="password"
                placeholder={t('auth.repeat_password')}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {errors.confirm_password && (
                <p className="mt-1 text-xs text-red-500">{errors.confirm_password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? t('auth.creating_account') : t('auth.register_now')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {t('auth.have_account')}{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
