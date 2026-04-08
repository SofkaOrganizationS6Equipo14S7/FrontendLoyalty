import { Zap } from 'lucide-react';

export function LoginBranding() {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center mb-3">
        <Zap className="h-6 w-6 text-white" />
      </div>
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        LoyaltyEngine
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Discount Engine Platform
      </p>
    </div>
  );
}
