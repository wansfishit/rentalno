import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/hooks/use-auth';
import { SettingsProvider } from '@/hooks/use-site-settings';
import { LanguageProvider } from '@/hooks/use-language';
import LiquidTabBar from '@/components/liquid-tab-bar';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export const metadata: Metadata = {
  title: {
    default: 'RentAja — Sewa Mobil Eksklusif',
    template: '%s | RentAja',
  },
  description:
    'Sewa mobil online dengan harga terbaik. Pilihan armada lengkap, proses mudah, dan layanan 24 jam. Toyota, Honda, BMW, Mercedes dan lainnya.',
  keywords: ['rental mobil', 'sewa mobil', 'car rental', 'mobil murah', 'sewa mobil online'],
  authors: [{ name: 'RentAja' }],
  openGraph: {
    title: 'RentAja — Sewa Mobil Online Terpercaya',
    description: 'Sewa mobil online dengan harga terbaik.',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RentAja — Sewa Mobil Online Terpercaya',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SettingsProvider>
            <LanguageProvider>
              <AuthProvider>
                <div className="pb-24 min-h-screen flex flex-col">
                  {children}
                </div>
                <LiquidTabBar />
                <Toaster position="top-right" richColors closeButton />
              </AuthProvider>
            </LanguageProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
