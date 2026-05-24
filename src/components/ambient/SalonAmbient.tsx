import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AmbientProps {
  active?: boolean;
  mediaSrc?: string;
  className?: string;
}

export const SalonAmbient: React.FC<AmbientProps> = ({ active = false, mediaSrc, className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden bg-rose-50 dark:bg-zinc-950 ${className}`} aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_24%,rgba(236,72,153,0.20),transparent_34%),radial-gradient(circle_at_82%_70%,rgba(168,85,247,0.18),transparent_36%)] dark:bg-[radial-gradient(circle_at_24%_24%,rgba(244,114,182,0.18),transparent_34%),radial-gradient(circle_at_82%_70%,rgba(196,181,253,0.13),transparent_36%)]" />
    <AnimatePresence>
      {active && mediaSrc && (
        <motion.img
          key={mediaSrc}
          src={mediaSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.18] mix-blend-multiply dark:mix-blend-screen"
          initial={{ opacity: 0, scale: 1.07 }}
          animate={{ opacity: 0.18, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45 }}
        />
      )}
    </AnimatePresence>
    <motion.div
      className="absolute -left-8 top-8 h-32 w-32 rounded-full border border-pink-400/25 dark:border-pink-200/20"
      animate={active ? { x: [0, 10, 0], rotate: [0, 8, 0] } : { x: 0, rotate: 0 }}
      transition={{ duration: 5, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute bottom-8 right-9 h-3 w-28 rounded-full bg-fuchsia-400/20 dark:bg-fuchsia-200/10"
      animate={active ? { width: ['7rem', '8.4rem', '7rem'], opacity: [0.55, 0.85, 0.55] } : { width: '7rem', opacity: 0.55 }}
      transition={{ duration: 3.4, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    />
  </div>
);
