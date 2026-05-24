import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AmbientProps {
  active?: boolean;
  mediaSrc?: string;
  className?: string;
}

export const CoachingAmbient: React.FC<AmbientProps> = ({ active = false, mediaSrc, className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden bg-indigo-50 dark:bg-slate-950 ${className}`} aria-hidden="true">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.10)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(rgba(129,140,248,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(129,140,248,0.10)_1px,transparent_1px)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_28%,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_82%_72%,rgba(20,184,166,0.14),transparent_36%)]" />
    <AnimatePresence>
      {active && mediaSrc && (
        <motion.img
          key={mediaSrc}
          src={mediaSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.16] mix-blend-multiply dark:mix-blend-screen"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 0.16, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45 }}
        />
      )}
    </AnimatePresence>
    <motion.div
      className="absolute left-8 top-8 rounded-lg border border-indigo-500/20 bg-white/25 px-8 py-5 dark:border-indigo-200/20 dark:bg-white/5"
      animate={active ? { y: [0, -6, 0], rotate: [-2, 1, -2] } : { y: 0, rotate: -2 }}
      transition={{ duration: 4.2, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute bottom-9 right-9 h-2 w-24 rounded-full bg-teal-400/25 dark:bg-teal-200/12"
      animate={active ? { scaleX: [1, 1.25, 1] } : { scaleX: 1 }}
      transition={{ duration: 3, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    />
  </div>
);
