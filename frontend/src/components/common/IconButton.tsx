import React from 'react';
import { motion } from 'motion/react';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  ariaLabel,
  size = 'md',
  variant = 'default',
  className = '',
  disabled = false,
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 p-1 text-xs rounded-lg',
    md: 'w-9 h-9 p-1.5 text-sm rounded-xl',
    lg: 'w-11 h-11 p-2 text-base rounded-2xl',
  }[size];

  const variantClasses = {
    default:
      'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
    primary:
      'bg-cyan-500 hover:bg-cyan-400 text-white shadow-md shadow-cyan-500/25 border border-cyan-400/40',
    danger:
      'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white border-transparent',
  }[variant];

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.94 }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
    >
      {icon}
    </motion.button>
  );
};
