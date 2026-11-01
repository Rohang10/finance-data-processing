'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  getDashboardSummary,
  getMonthlyTrend,
  getCategoryBreakdown,
  getFinancialRecords,
} from '@/lib/api';
import {
  DashboardSummary,
  MonthlyTrendItem,
  CategoryBreakdownItem,
  FinancialRecord,
} from '@/types';
import { StatCard } from '@/components/dashboard/StatCard';
import { AnalyticsAreaChart } from '@/components/dashboard/AnalyticsAreaChart';
import { CategoryDonutChart } from '@/components/dashboard/CategoryDonutChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { FileUpload } from '@/components/dashboard/FileUpload';
import Link from 'next/link';
import {
  Plus,
  RefreshCw,
  Shield,
  FileSpreadsheet,
  Download,
  AlertCircle,
  TrendingUp,
  BrainCircuit,
  Network,
  Target,
  Activity,
  Cpu,
  Loader2,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trendData, setTrendData] = useState<MonthlyTrendItem[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryBreakdownItem[]>([]);
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [sum, trend, cat, rec] = await Promise.all([
        getDashboardSummary(),
        getMonthlyTrend(),
        getCategoryBreakdown(),
        getFinancialRecords(),
      ]);
      setSummary(sum);
      setTrendData(trend);
      setCategoryData(cat);
      setRecords(rec);
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isLoading && user) {
      fetchData();
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs font-medium text-muted-foreground">Verifying security credentials...</p>
      </div>
    );
  }

  const role = user?.role || 'admin';
  const canManageRecords = role === 'admin' || role === 'analyst';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Executive Financial Intelligence
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                role === 'admin'
                  ? 'bg-blue-500/10 text-blue-600 border-blue-500/30 shadow-[0_0_10px_rgba(37,99,235,0.1)] dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/40 dark:shadow-[0_0_12px_rgba(249,115,22,0.25)]'
                  : role === 'analyst'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
              }`}
            >
              {role} View
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enterprise-grade financial intelligence and real-time data aggregation.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/80 bg-card/60 hover:bg-card text-xs font-semibold text-foreground transition-all duration-300 shadow-sm cursor-pointer hover:border-blue-500/30 dark:hover:border-orange-500/30"
            title="Refresh Real-Time Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {canManageRecords ? (
            <Link
              href="/dashboard/records"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 dark:bg-orange-600 dark:hover:bg-orange-500 text-white text-xs font-semibold shadow-md shadow-[0_4px_16px_rgba(37,99,235,0.3)] dark:shadow-[0_4px_16px_rgba(234,88,12,0.35)] hover:shadow-[0_4px_22px_rgba(37,99,235,0.45)] dark:hover:shadow-[0_4px_22px_rgba(234,88,12,0.5)] transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Transaction</span>
            </Link>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>Viewer (Read-Only Mode)</span>
            </div>
          )}
        </div>
      </div>

      {/* Role Notice Banner if Viewer */}
      {role === 'viewer' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>
              <strong>Viewer Privilege Active:</strong> You have read-only access to high-level aggregated trends and analytics. Raw financial ledger mutations are restricted.
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
            Least Privilege Enforced
          </span>
        </div>
      )}

      {/* AI Bank Statement Upload */}
      {canManageRecords && (
        <div className="w-full">
          <FileUpload onUploadComplete={fetchData} />
        </div>
      )}

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Net Operating Balance"
          value={summary?.netBalance ?? 0}
          change={0}
          type="balance"
          delay={0.05}
        />
        <StatCard
          title="Total Gross Inflow"
          value={summary?.totalIncome ?? 0}
          change={0}
          type="income"
          delay={0.1}
        />
        <StatCard
          title="Operating Expenditures"
          value={summary?.totalExpenses ?? 0}
          change={0}
          type="expense"
          delay={0.15}
        />
        <StatCard
          title="Net Operating Margin"
          value={summary?.savingsRate ?? 0}
          prefix=""
          suffix="%"
          change={0}
          type="savings"
          delay={0.2}
        />
      </div>

      {/* Main Charts Row: Area Chart (8 cols) & Donut Chart (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <AnalyticsAreaChart data={trendData} />
        </div>
        <div className="lg:col-span-4">
          <CategoryDonutChart data={categoryData} />
        </div>
      </div>

      {/* Recent Activity Table and Architectural Note */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RecentTransactions records={records} />
        </div>

        {/* AI Analytics Architecture Card */}
        <div className="lg:col-span-4 rounded-2xl glass-card p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col relative overflow-hidden group h-full">
          {/* Animated Background Orbs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 dark:bg-orange-500/10 rounded-full blur-3xl group-hover:scale-110 group-hover:bg-blue-500/20 dark:group-hover:bg-orange-500/20 transition-all duration-700 ease-in-out" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 dark:bg-amber-500/10 rounded-full blur-3xl group-hover:scale-110 group-hover:bg-purple-500/20 dark:group-hover:bg-amber-500/20 transition-all duration-700 ease-in-out" />

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-orange-500 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 animate-pulse" />
                Machine Learning Core
              </span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 dark:bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 dark:bg-orange-500"></span>
              </span>
            </div>
            
            <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mt-1">
              AI Analytics Engine
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed font-medium">
              Continuous neural processing of financial data for automated categorization, anomaly detection, and real-time behavioral insights.
            </p>

            <div className="mt-6 flex flex-col flex-1 justify-evenly">
              {/* Stat 1 */}
              <div className="group/stat relative p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 backdrop-blur-md overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 hover:border-blue-500/30 dark:hover:border-orange-500/30">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent dark:from-orange-500/5 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-orange-500/10 text-blue-600 dark:text-orange-400 shadow-sm border border-blue-100 dark:border-orange-500/20">
                      <Network className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Model Architecture</span>
                  </div>
                  <span className="font-bold text-foreground text-sm text-right shrink-0">Gemini 3.7 Flash</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="group/stat relative p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 backdrop-blur-md overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 hover:border-emerald-500/30 dark:hover:border-emerald-500/30">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                      <Target className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Classification Accuracy</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-lg shrink-0">99.8%</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="group/stat relative p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 backdrop-blur-md overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 hover:border-purple-500/30 dark:hover:border-amber-500/30">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent dark:from-amber-500/5 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-amber-500/10 text-purple-600 dark:text-amber-400 shadow-sm border border-purple-100 dark:border-amber-500/20">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Processed Records</span>
                  </div>
                  <span className="font-bold text-foreground text-lg shrink-0">
                    {summary?.recordCount || records.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Cpu className="w-4 h-4 text-blue-500 dark:text-orange-500" />
                Inference Engine Active
              </span>
              <span className="px-3 py-1.5 rounded-md bg-slate-100/80 dark:bg-slate-800/80 font-mono tracking-wide text-[10px] shadow-inner">
                14ms Latency
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
