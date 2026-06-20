import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'blue';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
}

export default function Logo({ 
  className, 
  variant = 'blue',
  size = 'md',
  showText = true,
  textClassName
}: LogoProps) {
  
  const sizeMap = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl md:text-7xl',
  };

  const textVariantMap = {
    dark: 'text-slate-900',
    light: 'text-white',
    blue: 'text-slate-900',
  };

  const dotVariantMap = {
    dark: 'text-slate-900',
    light: 'text-white',
    blue: 'text-blue-600',
  };

  return (
    <div className={cn("flex items-center", className)}>
      <span 
        className={cn(
          "font-bold tracking-tight",
          sizeMap[size],
          textVariantMap[variant],
          textClassName
        )} 
        style={{ fontFamily: 'var(--font-jakarta)' }}
      >
        Rentalno<span className={dotVariantMap[variant]}>.</span>
      </span>
    </div>
  );
}
