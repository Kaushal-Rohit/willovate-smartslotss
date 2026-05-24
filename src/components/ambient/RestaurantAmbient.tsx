import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AmbientProps {
  active?: boolean;
  mediaSrc?: string;
  className?: string;
}

export const RestaurantAmbient: React.FC<AmbientProps> = ({ active = false, mediaSrc, className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden bg-stone-50 dark:bg-stone-950 ${className}`} aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(244,63,94,0.20),transparent_36%),radial-gradient(circle_at_80%_72%,rgba(245,158,11,0.20),transparent_34%)] dark:bg-[radial-gradient(circle_at_25%_25%,rgba(251,113,133,0.16),transparent_36%),radial-gradient(circle_at_80%_72%,rgba(251,191,36,0.14),transparent_34%)]" />
    <AnimatePresence>
      {active && mediaSrc && (
        <motion.img
          key={mediaSrc}
          src={mediaSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.18] mix-blend-multiply dark:mix-blend-screen"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 0.18, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45 }}
        />
      )}
    </AnimatePresence>
    <motion.div
      className="absolute left-8 top-9 h-20 w-20 rounded-full border border-rose-400/25 bg-white/25 shadow-inner dark:border-rose-200/20 dark:bg-white/5"
      animate={active ? { rotate: [0, 4, 0], scale: [1, 1.04, 1] } : { rotate: 0, scale: 1 }}
      transition={{ duration: 4.2, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute right-12 top-8 h-28 w-1.5 rounded-full bg-amber-700/20 shadow-[14px_0_0_rgba(180,83,9,0.16)] dark:bg-amber-100/14 dark:shadow-[14px_0_0_rgba(254,243,199,0.12)]"
      animate={active ? { y: [0, 6, 0] } : { y: 0 }}
      transition={{ duration: 3.5, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    />
  </div>
);
