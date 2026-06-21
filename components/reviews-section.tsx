'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { motion, Variants, Transition } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { getPublicReviews, createReview } from '@/services/reviews';
import type { Review } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';

const gentleSpringTransition: Transition = {
  type: "spring",
  stiffness: 80,
  damping: 20,
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: gentleSpringTransition
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

export default function ReviewsSection() {
  const { user, profile } = useAuth();
  const { settings } = useSiteSettings();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      guest_name: profile?.full_name || '',
      comment: '',
    }
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const fetchReviews = async () => {
    // Increase limit to 20 for a better scrolling experience
    const data = await getPublicReviews(20);
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (loading || reviews.length === 0 || isHovered) return;

    let animationFrameId: number;
    const container = scrollRef.current;

    const scroll = () => {
      if (container) {
        container.scrollTop += 0.5; // Auto scroll speed
        // If reached bottom, loop back to top (optional, or just stop)
        if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
          container.scrollTop = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [loading, reviews, isHovered]);

  const onSubmit = async (data: any) => {
    if (!data.comment.trim()) {
      toast.error('Ulasan tidak boleh kosong');
      return;
    }
    
    setIsSubmitting(true);
    const reviewData = {
      rating,
      comment: data.comment,
      user_id: user ? user.id : null,
      guest_name: user ? (profile?.full_name || user.email?.split('@')[0] || 'Pelanggan') : (data.guest_name || 'Guest'),
    };

    const { success } = await createReview(reviewData);
    if (success) {
      toast.success('Terima kasih atas ulasan Anda!');
      setIsOpen(false);
      reset();
      setRating(5);
      fetchReviews(); // Refresh list
    } else {
      toast.error('Gagal mengirim ulasan');
    }
    setIsSubmitting(false);
  };

  return (
    <section className="py-24 bg-slate-50 dark:bg-black overflow-hidden relative transition-colors duration-300">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-primary/10 dark:bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={staggerContainer}
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
      >
        <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Ulasan Pelanggan</h2>
            <p className="text-slate-600 dark:text-zinc-400 mt-3 font-light">Apa kata mereka yang sudah menggunakan layanan eksklusif kami.</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest rounded-full hover:shadow-[0_0_30px_rgba(214,175,54,0.3)] transition-all duration-300">
                <MessageSquare className="w-4 h-4" />
                Tulis Ulasan
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-slate-900 dark:text-white">Tulis Ulasan Anda</DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-zinc-400">
                  Bagikan pengalaman Anda menyewa mobil di {settings?.site_title || 'RentAja'}.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                
                {/* Rating Stars */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star 
                        className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} 
                      />
                    </button>
                  ))}
                </div>

                {!user && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Nama Anda</label>
                    <input 
                      {...register('guest_name', { required: 'Nama harus diisi' })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary bg-slate-50 dark:bg-black text-slate-900 dark:text-white"
                      placeholder="Contoh: Budi Santoso"
                    />
                    {errors.guest_name && <p className="text-xs text-red-500">{errors.guest_name.message}</p>}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Ulasan</label>
                  <textarea 
                    {...register('comment', { required: 'Ulasan harus diisi' })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary bg-slate-50 dark:bg-black text-slate-900 dark:text-white min-h-[120px] resize-none"
                    placeholder="Ceritakan pengalaman Anda..."
                  />
                  {errors.comment && <p className="text-xs text-red-500">{errors.comment.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(214,175,54,0.3)] disabled:opacity-50 transition-all duration-300"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-slate-200 dark:border-white/5 p-6 shadow-sm animate-pulse">
                <div className="flex gap-1 mb-4 h-4" />
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-full mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-5/6 mb-6" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10" />
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-24" />
                    <div className="h-2 bg-slate-200 dark:bg-white/10 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 font-light">
            Belum ada ulasan. Jadilah yang pertama memberikan ulasan!
          </div>
        ) : (
          <div 
            className="relative bg-transparent rounded-3xl p-2 overflow-hidden"
          >
            <div 
              ref={scrollRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)}
              onTouchEnd={() => setIsHovered(false)}
              className="h-[500px] overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar for cleaner look
            >
              {/* To make scrollbar hidden in webkit: [&::-webkit-scrollbar]:hidden */}
              <style dangerouslySetInnerHTML={{__html: `
                .hide-scroll::-webkit-scrollbar { display: none; }
              `}} />
              <div className="hide-scroll h-full">
                {reviews.map((review) => {
                  const name = review.guest_name || 'Pelanggan';
                  const initial = name.charAt(0).toUpperCase();
                  
                  return (
                    <div key={review.id} className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(214,175,54,0.05)] transition-shadow mb-4">
                      <div className="flex gap-1 mb-4">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                        {[...Array(5 - review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-slate-200 dark:text-white/10" />
                        ))}
                      </div>
                      <p className="text-slate-600 dark:text-zinc-300 mb-6 font-light leading-relaxed">"{review.comment}"</p>
                      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-inner">
                          {initial}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm tracking-wide">{name}</p>
                          <p className="text-xs text-slate-500 dark:text-zinc-500">
                            {new Date(review.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Gradient overlays to make scrolling look seamless */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-slate-50 dark:from-black to-transparent pointer-events-none rounded-t-3xl" />
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 dark:from-black to-transparent pointer-events-none rounded-b-3xl" />
          </div>
        )}
      </motion.div>
    </section>
  );
}
