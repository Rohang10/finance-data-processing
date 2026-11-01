'use client';

import React from 'react';
import Link from 'next/link';
import { FinancialRecord } from '@/types';
import { ArrowUpRight, ArrowDownRight, Clock, ChevronRight, ShieldCheck } from 'lucide-react';

interface RecentTransactionsProps {
  records: FinancialRecord[];
}

export function RecentTransactions({ records }: RecentTransactionsProps) {
  return (
    <div className="rounded-2xl glass-card p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] h-full flex flex-col relative overflow-hidden group">
      {/* Animated Background Orbs */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 dark:bg-orange-500/10 rounded-full blur-3xl group-hover:scale-110 group-hover:bg-blue-500/20 dark:group-hover:bg-orange-500/20 transition-all duration-700 ease-in-out pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-110 group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-500/20 transition-all duration-700 ease-in-out pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span>Recent Ledger Activity</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/30 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30">
              Audit Stream
            </span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            Immutable financial records stored with high-precision decimals
          </p>
        </div>

        <Link
          href="/dashboard/records"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-orange-400 hover:text-blue-700 hover:drop-shadow-[0_0_5px_rgba(37,99,235,0.4)] dark:hover:text-orange-300 transition-all duration-300"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex flex-col gap-2 flex-1 justify-start mt-2">
        {records.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">No recent transactions found.</p>
        ) : (
          records.slice(0, 7).map((rec) => {
            const isIncome = rec.type === 'income';
            const amount = typeof rec.amount === 'number' ? rec.amount : parseFloat(rec.amount);

            return (
              <div
                key={rec.id}
                className="group/tx relative p-3.5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-transparent hover:border-blue-500/30 dark:hover:border-orange-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent dark:from-orange-500/5 opacity-0 group-hover/tx:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 shrink min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground leading-tight">
                      {rec.category}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(rec.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })}
                      </span>
                      {rec.notes && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[150px] sm:max-w-[200px] text-slate-600 dark:text-slate-300">
                            {rec.notes}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`text-xs font-bold font-mono ${
                      isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-500'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] font-medium text-slate-400 capitalize">
                    {rec.creator_name || 'System User'}
                  </span>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>
      </div>
    </div>
  );
}
