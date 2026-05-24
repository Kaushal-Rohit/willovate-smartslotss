import React, { forwardRef } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700 transition-colors dark:text-slate-200">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-xl border bg-white/70 dark:bg-slate-950/50 backdrop-blur-sm
            text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500
            focus:outline-none focus:ring-2 transition-all duration-200
            ${error 
              ? 'border-red-400 focus:ring-red-400/50 dark:border-red-500/50' 
              : 'border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/50'
            }
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
