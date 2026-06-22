import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string, locale: string = 'id'): string {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function formatDateShort(dateStr: string, locale: string = 'id'): string {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function calculateDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'confirmed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-slate-100 text-slate-700';
  }
}

export function getStatusLabel(status: string, locale: string = 'id'): string {
  if (locale === 'en') {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }
  switch (status) {
    case 'pending': return 'Menunggu';
    case 'confirmed': return 'Dikonfirmasi';
    case 'completed': return 'Selesai';
    case 'cancelled': return 'Dibatalkan';
    default: return status;
  }
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

export function formatWhatsAppNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  let cleanNum = phone.replace(/[^0-9]/g, '');
  if (cleanNum.startsWith('0')) {
    cleanNum = '62' + cleanNum.slice(1);
  } else if (cleanNum.startsWith('8') && cleanNum.length >= 9 && cleanNum.length <= 13) {
    cleanNum = '62' + cleanNum;
  }
  return cleanNum;
}

export function formatSocialLink(value: string | null | undefined, platform: 'whatsapp' | 'instagram' | 'facebook' | 'tiktok'): string {
  if (!value) return '';
  const val = value.trim();
  if (val.startsWith('http://') || val.startsWith('https://')) {
    return val;
  }
  
  switch (platform) {
    case 'whatsapp': {
      const cleanNum = formatWhatsAppNumber(val);
      return `https://wa.me/${cleanNum}`;
    }
    case 'instagram':
      return `https://instagram.com/${val}`;
    case 'facebook':
      return `https://facebook.com/${val}`;
    case 'tiktok': {
      const cleanUsername = val.startsWith('@') ? val.slice(1) : val;
      return `https://tiktok.com/@${cleanUsername}`;
    }
    default:
      return val;
  }
}
