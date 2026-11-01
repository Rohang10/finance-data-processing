'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { RoleType } from '@/types';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Database,
  ExternalLink,
  Sparkles,
  Lock,
} from 'lucide-react';

export function HeroSection() {
  const { user, switchRoleDemo } = useAuth();

  const demoRoles: { role: RoleType; label: string; desc: string; badge: string; color: string }[] = [
    {
      role: 'admin',
      label: 'Admin Profile',
      desc: 'Full CRUD, User Management, Financial Auditing',
      badge: 'Unrestricted',
      color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    {
      role: 'analyst',
      label: 'Analyst Profile',
      desc: 'Add & Edit Records, Access Trend Reports',
      badge: 'Operational',
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      role: 'viewer',
      label: 'Viewer Profile',
      desc: 'Read-only Analytics, Raw Records Restricted',
      badge: 'Audit Only',
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-grid-pattern">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-rose-500/10 dark:bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/80 dark:bg-indigo-950/40 backdrop-blur-md text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>Enterprise Financial Data Processing Platform</span>
            <span className="w-1 h-1 rounded-full bg-indigo-400" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">RBAC Enforced</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-center max-w-4xl mx-auto space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter text-foreground leading-[1.1]">
            Corporate Financial Data With{' '}
            <span className="gradient-text-indigo">Strict Access Control</span> & Precision Analytics
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            Engineered with PostgreSQL <code className="font-mono text-indigo-600 dark:text-indigo-400 text-sm px-1.5 py-0.5 rounded bg-secondary">NUMERIC(15,2)</code> precision, role-based security isolation, and automated cloud health monitoring.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="http://localhost:8000/api-docs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card/50 hover:bg-card/80 text-foreground text-sm font-semibold shadow-sm hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Swagger API Specs</span>
            <ExternalLink className="w-4 h-4 opacity-70" />
          </a>
        </motion.div>

        {/* Interactive 1-Click Role Simulation Bar */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 max-w-5xl mx-auto rounded-3xl glass-card p-8 border border-border shadow-2xl relative z-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                <span>Interactive Role Simulation Playground</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Click any role below to immediately experience the interface permissions and view restrictions
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-secondary text-foreground self-start sm:self-auto border border-border shadow-inner">
              Current: <strong className="capitalize text-indigo-600 dark:text-indigo-400">{user?.role || 'admin'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
            {demoRoles.map((dr) => {
              const isSelected = (user?.role || 'admin') === dr.role;
              return (
                <button
                  key={dr.role}
                  onClick={() => switchRoleDemo(dr.role)}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 relative ${
                    isSelected
                      ? `${dr.color} ring-2 ring-indigo-500/30 shadow-sm`
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider">{dr.label}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/70 dark:bg-black/30 border border-current">
                      {dr.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-snug">
                    {dr.desc}
                  </p>
                  {isSelected && (
                    <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      <span>Active Simulation Mode</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
