import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export const GlassButton: React.FC<GlassButtonProps> = ({ 
  children, 
  isLoading, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseClasses = "relative inline-flex items-center justify-center overflow-hidden rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "bg-blue-600 text-white border-blue-500/30 hover:bg-blue-500 hover:border-blue-400/50 hover:shadow-[0_14px_35px_rgba(37,99,235,0.28)] focus:ring-blue-500/50 dark:bg-blue-500 dark:hover:bg-blue-400",
    secondary: "bg-white/70 border-slate-200/80 text-slate-800 hover:bg-white hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.10)] focus:ring-slate-400/40 dark:bg-slate-900/60 dark:border-slate-700/70 dark:text-slate-100 dark:hover:bg-slate-800/80",
    danger: "bg-red-500/10 border-red-500/30 text-red-700 hover:bg-red-500/15 hover:border-red-500/50 focus:ring-red-500/40 dark:text-red-200 dark:bg-red-500/15",
    ghost: "bg-transparent border-transparent text-slate-700 hover:bg-slate-950/5 focus:ring-slate-400/40 dark:text-slate-200 dark:hover:bg-white/10"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} px-6 py-2.5 ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading && (
          <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        )}
        <span className="relative z-10">{children}</span>
      </div>
    </button>
  );
};
