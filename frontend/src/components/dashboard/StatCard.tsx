'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number;
  period?: string;
  type: 'balance' | 'income' | 'expense' | 'savings';
  delay?: number;
}

export function StatCard({
  title,
  value,
  prefix = '$',
  suffix = '',
  change = 12.5,
  period = 'vs last month',
  type,
  delay = 0,
}: StatCardProps) {
  const configs = {
    balance: {
      icon: Wallet,
      gradient: 'from-blue-500/10 via-blue-500/5 to-transparent dark:from-orange-500/15 dark:via-orange-500/5 dark:to-transparent',
      border: 'hover:border-blue-500/40 dark:hover:border-orange-500/40',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:bg-orange-500/15 dark:text-orange-400',
      textAccent: 'text-blue-600 dark:text-orange-400',
    },
    income: {
      icon: TrendingUp,
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      textAccent: 'text-emerald-600 dark:text-emerald-400',
    },
    expense: {
      icon: TrendingDown,
      gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
      border: 'hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      textAccent: 'text-rose-600 dark:text-rose-400',
    },
    savings: {
      icon: Layers,
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      textAccent: 'text-amber-600 dark:text-amber-400',
    },
  };

  const current = configs[type];
  const Icon = current.icon;
  const isPositive = change >= 0;

  const formattedValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: type === 'savings' ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl glass-card p-6 border transition-all duration-300 ${current.border} shadow-sm group`}
    >
      {/* Background radial gradient accent */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${current.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-500 dark:text-slate-400">{prefix}</span>
            <span className="text-2xl lg:text-3xl font-extrabold tracking-tight font-mono text-foreground">
              {formattedValue}
            </span>
            {suffix && <span className="text-lg font-bold text-slate-500">{suffix}</span>}
          </div>
        </div>

        <div className={`p-3 rounded-xl border border-slate-200/50 dark:border-white/5 ${current.iconBg} shadow-xs`}>
          <Icon className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded-md font-semibold text-[11px] ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
            )}
            {Math.abs(change)}%
          </span>
          <span className="text-slate-600 dark:text-slate-300">{period}</span>
        </div>

        <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300">NUMERIC(15,2)</span>
      </div>
    </motion.div>
  );
}
