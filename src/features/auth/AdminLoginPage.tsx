import React, { useState } from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { GlassButton } from '../../components/ui/GlassButton';
import { InputField } from '../../components/ui/InputField';
import { AdminAccount } from '../../types';
import { authenticateAdmin } from '../../services/dataStore';

export const AdminLoginPage: React.FC<{ onLogin?: (account: AdminAccount) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    window.setTimeout(() => {
      const account = authenticateAdmin(email, password);
      setIsLoading(false);

      if (!account) {
        setError('Invalid admin credentials. Please use the assigned business admin email and password.');
        return;
      }

      onLogin?.(account);
    }, 450);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-slate-50 p-4 transition-colors duration-500 dark:bg-slate-950">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.12),transparent_34%),radial-gradient(circle_at_82%_78%,rgba(20,184,166,0.12),transparent_32%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(96,165,250,0.16),transparent_34%),radial-gradient(circle_at_82%_78%,rgba(45,212,191,0.12),transparent_32%)]" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/70 bg-white/75 p-8 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl transition-colors duration-500 dark:border-slate-800/80 dark:bg-slate-900/75 dark:shadow-black/30">
        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sign in with your business admin account to manage only your own offers, slots, categories, and bookings.
          </p>
        </div>

        {error && (
          <div className="mb-5 flex gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <InputField
            label="Admin Email"
            type="email"
            placeholder="admin.gym@smartslot.test"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <InputField
            label="Password"
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <GlassButton type="submit" className="mt-3 w-full py-3 text-base" isLoading={isLoading}>
            Sign In to Dashboard
          </GlassButton>
        </form>
      </div>
    </div>
  );
};
