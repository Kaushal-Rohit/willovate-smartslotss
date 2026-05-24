import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AmbientProps {
  active?: boolean;
  mediaSrc?: string;
  className?: string;
}

export const ClinicAmbient: React.FC<AmbientProps> = ({ active = false, mediaSrc, className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden bg-cyan-50 dark:bg-slate-950 ${className}`} aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_26%,rgba(6,182,212,0.20),transparent_34%),radial-gradient(circle_at_78%_72%,rgba(14,165,233,0.16),transparent_36%)] dark:bg-[radial-gradient(circle_at_22%_26%,rgba(103,232,249,0.16),transparent_34%),radial-gradient(circle_at_78%_72%,rgba(125,211,252,0.12),transparent_36%)]" />
    <AnimatePresence>
      {active && mediaSrc && (
        <motion.img
          key={mediaSrc}
          src={mediaSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.16] mix-blend-multiply dark:mix-blend-screen"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.16, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45 }}
        />
      )}
    </AnimatePresence>
    <motion.div
      className="absolute left-10 top-10 h-20 w-20"
      animate={active ? { scale: [1, 1.06, 1], opacity: [0.7, 0.95, 0.7] } : { scale: 1, opacity: 0.7 }}
      transition={{ duration: 3.2, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    >
      <div className="absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 rounded-full bg-cyan-500/18 dark:bg-cyan-200/12" />
      <div className="absolute left-0 top-1/2 h-4 w-full -translate-y-1/2 rounded-full bg-cyan-500/18 dark:bg-cyan-200/12" />
    </motion.div>
    <motion.div
      className="absolute bottom-8 right-8 h-16 w-24 rounded-full border border-sky-400/25 dark:border-sky-200/20"
      animate={active ? { x: [0, -8, 0] } : { x: 0 }}
      transition={{ duration: 4, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    />
  </div>
);
