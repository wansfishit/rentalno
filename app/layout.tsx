import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/hooks/use-auth';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'RentAja — Sewa Mobil Online Terpercaya',
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
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
