'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, DollarSign, Percent, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function InteractiveCalculator() {
  const [revenue, setRevenue] = useState(150000);
  const [expenses, setExpenses] = useState(65000);
  const [taxRate, setTaxRate] = useState(21);

  const operatingProfit = Math.max(0, revenue - expenses);
  const taxProvision = (operatingProfit * (taxRate / 100));
  const netIncome = operatingProfit - taxProvision;
  const netMargin = revenue > 0 ? ((netIncome / revenue) * 100).toFixed(1) : '0';

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl glass-card border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xl relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Calculator className="w-3.5 h-3.5" />
                Live Fiscal Simulation
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Test Financial Precision
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
                Simulate enterprise revenue vs expense allocations. Calculations adhere strictly to decimal exactitude without floating-point drift.
              </p>
            </div>

            {/* Slider 1: Revenue */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Projected Monthly Revenue</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold text-sm">
                  ${revenue.toLocaleString('en-US')}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="500000"
                step="5000"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Expenses */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Operating Expenses</span>
                <span className="text-rose-600 dark:text-rose-400 font-mono font-bold text-sm">
                  ${expenses.toLocaleString('en-US')}
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max="350000"
                step="5000"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value))}
                className="w-full accent-rose-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: Tax Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Corporate Tax & Audit Reserve</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono font-bold text-sm">
                  {taxRate}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                step="1"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Result Card Column */}
          <div className="lg:col-span-6 bg-card text-foreground rounded-3xl p-6 sm:p-10 border border-border shadow-2xl relative overflow-hidden">
            {/* Inner subtle glow */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between border-b border-border pb-5 relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Real-Time Financial Output
              </span>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                NUMERIC(15,2)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-8 relative z-10">
              <div className="p-5 rounded-2xl bg-background border border-border shadow-sm">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Net Income After Tax</p>
                <p className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-2">
                  ${netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-background border border-border shadow-sm">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Net Margin</p>
                <p className="text-2xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400 mt-2">
                  {netMargin}%
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-background border border-border shadow-sm">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Operating Surplus</p>
                <p className="text-xl font-bold font-mono text-foreground mt-2">
                  ${operatingProfit.toLocaleString('en-US')}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-background border border-border shadow-sm">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tax Provision</p>
                <p className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-2">
                  ${taxProvision.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-indigo-600/30"
            >
              <span>Explore Live Dashboard Analytics</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
