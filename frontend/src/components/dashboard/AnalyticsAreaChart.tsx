'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MonthlyTrendItem } from '@/types';
import { Calendar, DollarSign, ArrowUpRight } from 'lucide-react';

interface AnalyticsAreaChartProps {
  data: MonthlyTrendItem[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const income = payload.find((p) => p.name === 'Income')?.value || 0;
    const expenses = payload.find((p) => p.name === 'Expenses')?.value || 0;
    const net = income - expenses;

    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-xl text-xs space-y-2 min-w-[200px]">
        <p className="font-bold text-foreground border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-slate-400 font-normal">Monthly Ledger</span>
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Income:
            </span>
            <span className="font-mono">${income.toLocaleString('en-US')}</span>
          </div>
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Expenses:
            </span>
            <span className="font-mono">${expenses.toLocaleString('en-US')}</span>
          </div>
          <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-bold text-foreground">
            <span>Net Operating Margin:</span>
            <span className={net >= 0 ? 'text-blue-600 dark:text-orange-400 font-mono' : 'text-rose-500 font-mono'}>
              ${net.toLocaleString('en-US')}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function AnalyticsAreaChart({ data }: AnalyticsAreaChartProps) {
  const [timeframe, setTimeframe] = useState<'1Y' | '5Y' | '10Y' | 'All'>('1Y');

  // Filter data based on selected timeframe
  const filteredData = React.useMemo(() => {
    if (timeframe === '1Y') return data.slice(-12);
    if (timeframe === '5Y') return data.slice(-60);
    if (timeframe === '10Y') return data.slice(-120);
    return data;
  }, [data, timeframe]);

  return (
    <div className="rounded-2xl glass-card p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] h-full flex flex-col relative overflow-hidden group">
      {/* Animated Background Orbs */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 dark:bg-orange-500/10 rounded-full blur-3xl group-hover:scale-110 group-hover:bg-blue-500/20 dark:group-hover:bg-orange-500/20 transition-all duration-700 ease-in-out pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 dark:bg-amber-500/10 rounded-full blur-3xl group-hover:scale-110 group-hover:bg-purple-500/20 dark:group-hover:bg-amber-500/20 transition-all duration-700 ease-in-out pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">
              Revenue & Expense Trajectory
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Live Aggregation
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Real-time monthly trends computed via PostgreSQL window functions
          </p>
        </div>

        {/* Time Interval Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold self-start sm:self-auto">
          {(['1Y', '5Y', '10Y', 'All'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeframe === t
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-orange-400 shadow-[0_0_8px_rgba(37,99,235,0.15)] dark:shadow-[0_0_8px_rgba(234,88,12,0.15)] font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              dy={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#f43f5e"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorExpenses)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer summary pill */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-blue-500 dark:text-orange-400" />
          <span>FY 2026 Fiscal Analysis</span>
        </span>
      </div>
      </div>
    </div>
  );
}
