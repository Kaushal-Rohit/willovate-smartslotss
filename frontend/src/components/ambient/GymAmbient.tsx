import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AmbientProps {
  active?: boolean;
  mediaSrc?: string;
  className?: string;
}

export const GymAmbient: React.FC<AmbientProps> = ({ active = false, mediaSrc, className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden bg-slate-100 dark:bg-slate-950 ${className}`} aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(37,99,235,0.24),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(16,185,129,0.18),transparent_36%)] dark:bg-[radial-gradient(circle_at_22%_20%,rgba(96,165,250,0.22),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(52,211,153,0.16),transparent_36%)]" />
    <AnimatePresence>
      {active && mediaSrc && (
        <motion.img
          key={mediaSrc}
          src={mediaSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply dark:mix-blend-screen"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 0.2, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45 }}
        />
      )}
    </AnimatePresence>
    <motion.div
      className="absolute left-8 top-8 h-28 w-3 rounded-full bg-slate-900/10 shadow-[40px_0_0_rgba(15,23,42,0.10),80px_0_0_rgba(15,23,42,0.08)] dark:bg-white/10 dark:shadow-[40px_0_0_rgba(255,255,255,0.10),80px_0_0_rgba(255,255,255,0.08)]"
      animate={active ? { y: [0, -7, 0], rotate: [-6, -2, -6] } : { y: 0, rotate: -6 }}
      transition={{ duration: 3.6, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute bottom-7 right-7 h-16 w-16 rounded-full border border-blue-500/20 bg-white/20 dark:border-blue-300/20 dark:bg-white/5"
      animate={active ? { scale: [1, 1.08, 1], opacity: [0.65, 0.9, 0.65] } : { scale: 1, opacity: 0.65 }}
      transition={{ duration: 3, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    />
  </div>
);
