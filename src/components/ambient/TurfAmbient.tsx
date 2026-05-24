import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AmbientProps {
  active?: boolean;
  mediaSrc?: string;
  className?: string;
}

export const TurfAmbient: React.FC<AmbientProps> = ({ active = false, mediaSrc, className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden bg-emerald-50 dark:bg-emerald-950 ${className}`} aria-hidden="true">
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,185,129,0.10)_50%,rgba(34,197,94,0.16)_50%)] bg-[size:48px_100%] dark:bg-[linear-gradient(90deg,rgba(52,211,153,0.10)_50%,rgba(74,222,128,0.08)_50%)]" />
    <div className="absolute inset-5 rounded-2xl border border-emerald-600/20 dark:border-emerald-200/20" />
    <AnimatePresence>
      {active && mediaSrc && (
        <motion.img
          key={mediaSrc}
          src={mediaSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.17] mix-blend-multiply dark:mix-blend-screen"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 0.17, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45 }}
        />
      )}
    </AnimatePresence>
    <motion.div
      className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-700/20 dark:border-emerald-100/20"
      animate={active ? { scale: [1, 1.08, 1], opacity: [0.65, 0.95, 0.65] } : { scale: 1, opacity: 0.65 }}
      transition={{ duration: 3.2, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute bottom-8 right-9 h-8 w-8 rounded-full bg-white/35 shadow-sm dark:bg-white/12"
      animate={active ? { x: [0, -14, 0], y: [0, 5, 0] } : { x: 0, y: 0 }}
      transition={{ duration: 4, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    />
  </div>
);
