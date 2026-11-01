'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Database, Lock, CheckCircle2 } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-14 border border-indigo-500/30 shadow-2xl">
        
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5" />
            Production Ready Architecture
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Ready to Experience High-Precision Financial Data Processing?
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Audit-grade reporting, automated cloud database health monitoring, and role-based isolation ready for corporate workloads.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Pre-seeded Roles (Admin, Analyst, Viewer)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Live Supabase Pooler
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Interactive Swagger API
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-indigo-950 hover:bg-slate-100 text-sm font-bold shadow-lg shadow-black/20 hover:scale-105 transition-all duration-200"
            >
              <span>Access Enterprise Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 hover:bg-white/10 text-white text-sm font-semibold transition-all duration-200"
            >
              <span>Switch Accounts / Login</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
