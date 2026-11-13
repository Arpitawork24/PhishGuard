import React from 'react';
import { useMagnetic } from '../../hooks/useMagnetic';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  magnetic?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  magnetic = false,
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const { ref, position } = useMagnetic({ strength: 0.22, threshold: 50 });

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs font-medium rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm font-semibold rounded-xl gap-2',
    lg: 'px-7 py-3.5 text-base font-semibold rounded-2xl gap-3 tracking-wide',
  }[size];

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:brightness-110 active:scale-[0.98] border border-cyan-400/30',
    secondary:
      'bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300/90 shadow-sm dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:text-slate-200 dark:border-slate-700/70 active:scale-[0.98]',
    ghost:
      'text-stone-700 hover:text-stone-950 hover:bg-stone-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/50 active:scale-[0.98]',
    danger:
      'bg-rose-600/90 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 border border-rose-400/40 active:scale-[0.98]',
    outline:
      'border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 active:scale-[0.98]',
  }[variant];

  const magneticStyle = magnetic
    ? {
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 && position.y === 0 ? 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'transform 0.08s ease-out',
      }
    : undefined;

  return (
    <button
      ref={magnetic ? (ref as React.RefObject<HTMLButtonElement>) : undefined}
      style={magneticStyle}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center select-none font-sans cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
};
