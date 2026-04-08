import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        {
          "border-transparent bg-indigo-600 text-white shadow hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700": variant === "default",
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80": variant === "secondary",
          "border-transparent bg-red-500 text-white shadow hover:bg-red-600 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-900/80": variant === "destructive",
          "text-slate-950 dark:text-slate-50 border-slate-200 dark:border-slate-800": variant === "outline",
          "border-transparent bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400": variant === "success",
          "border-transparent bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400": variant === "warning",
        },
        className
      )}
      {...props}
    />
  );
}
