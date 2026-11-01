'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryBreakdownItem } from '@/types';
import { PieChart as PieIcon, Layers } from 'lucide-react';

interface CategoryDonutChartProps {
  data: CategoryBreakdownItem[];
}

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4'];

export function CategoryDonutChart({ data }: CategoryDonutChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="rounded-2xl glass-card p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] h-full flex flex-col relative overflow-hidden group">
      {/* Animated Background Orbs */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 dark:bg-orange-500/10 rounded-full blur-3xl group-hover:scale-110 group-hover:bg-blue-500/20 dark:group-hover:bg-orange-500/20 transition-all duration-700 ease-in-out pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/10 dark:bg-amber-500/10 rounded-full blur-3xl group-hover:scale-110 group-hover:bg-emerald-500/20 dark:group-hover:bg-amber-500/20 transition-all duration-700 ease-in-out pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header */}
        <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Expense Allocation
            </h3>
            <span className="p-1 rounded-md bg-blue-500/10 text-blue-500 drop-shadow-[0_0_5px_rgba(37,99,235,0.3)] dark:drop-shadow-none dark:bg-orange-500/10 dark:text-orange-400">
              <PieIcon className="w-3.5 h-3.5" />
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })} Total
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
          Operating breakdown across enterprise cost centers
        </p>
      </div>

      {/* Donut Canvas */}
      <div className="relative w-full h-56 my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value: any, name: any) => [
                `$${Number(value).toLocaleString()}`,
                name,
              ]}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#fff',
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              dataKey="total"
              nameKey="category"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Total Spend</span>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
            ${(total / 1000).toFixed(1)}k
          </span>
        </div>
      </div>

      <div className="space-y-2 mt-2">
        {data.slice(0, 4).map((item, idx) => {
          const pct = total > 0 ? Math.round((item.total / total) * 100) : 0;
          const color = COLORS[idx % COLORS.length];
          return (
            <div key={`${item.category}-${item.type}-${idx}`} className="text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2 truncate max-w-[190px]">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="truncate">{item.category}</span>
                </span>
                <span className="font-semibold font-mono">{pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
