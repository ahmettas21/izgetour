import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'outline';
type Size = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const variantClasses: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-[#0066CC] to-[#0088FF] text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0',
  secondary: 'bg-gradient-to-r from-[#FF6B35] to-[#FF8F5E] text-white shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0',
  outline: 'border-2 border-[#0066CC] text-[#0066CC] bg-white/50 backdrop-blur-sm hover:bg-gradient-to-r hover:from-[#0066CC] hover:to-[#0088FF] hover:text-white hover:shadow-md hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
