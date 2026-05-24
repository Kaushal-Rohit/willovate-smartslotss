import React, { useState } from 'react';
import { AlertCircle, UserRound } from 'lucide-react';
import { GlassButton } from '../../components/ui/GlassButton';
import { InputField } from '../../components/ui/InputField';
import { CustomerAccount } from '../../types';
import { authenticateCustomer } from '../../services/dataStore';

export const CustomerRegistrationPage: React.FC<{ onLogin?: (account: CustomerAccount) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    window.setTimeout(() => {
      const account = authenticateCustomer(email, password);
      setIsLoading(false);

      if (!account) {
        setError('Invalid customer credentials. Please use the fixed customer email and password.');
        return;
      }

      onLogin?.(account);
    }, 450);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-slate-50 p-4 transition-colors duration-500 dark:bg-slate-950">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_25%,rgba(14,165,233,0.12),transparent_34%),radial-gradient(circle_at_82%_78%,rgba(99,102,241,0.12),transparent_32%)] dark:bg-[radial-gradient(circle_at_18%_25%,rgba(56,189,248,0.14),transparent_34%),radial-gradient(circle_at_82%_78%,rgba(129,140,248,0.12),transparent_32%)]" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/70 bg-white/75 p-8 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl transition-colors duration-500 dark:border-slate-800/80 dark:bg-slate-900/75 dark:shadow-black/30">
        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20 dark:bg-white dark:text-slate-950">
            <UserRound className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
            Customer Login
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sign in to book offers with the approved customer account.
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
            label="Customer Email"
            type="email"
            placeholder="customer@smartslot.test"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <InputField
            label="Password"
            type="password"
            placeholder="Enter customer password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <GlassButton type="submit" className="mt-3 w-full py-3 text-base" isLoading={isLoading}>
            Sign In and Continue
          </GlassButton>
        </form>
      </div>
    </div>
  );
};
