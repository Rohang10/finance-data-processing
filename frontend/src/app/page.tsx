'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Database, CodeXml, Layers, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center">
      
      {/* HERO SECTION */}
      <section className="w-full max-w-[1200px] px-6 pt-28 pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-400 mb-8 backdrop-blur-md shadow-sm"
        >
          <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)] dark:shadow-[0_0_8px_rgba(234,88,12,0.8)]" />
          FinCorp Platform is Live &bull; v2.0
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-foreground leading-[1.02] max-w-4xl"
        >
          The financial engine for{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-orange-400 dark:via-amber-500 dark:to-orange-500 bg-clip-text text-transparent">
            modern enterprise.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl font-normal leading-relaxed"
        >
          Absolute decimal precision. Immutable audit logs. Strict RBAC isolation. Built specifically for MNC scaling, automated ledger pipelines, and compliance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/dashboard"
            className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 dark:bg-orange-600 dark:hover:bg-orange-500 text-white flex items-center gap-2.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_25px_rgba(37,99,235,0.4)] hover:shadow-[0_4px_35px_rgba(37,99,235,0.6)] dark:shadow-[0_4px_25px_rgba(234,88,12,0.4)] dark:hover:shadow-[0_4px_35px_rgba(234,88,12,0.6)]"
          >
            Open Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="h-12 px-8 rounded-xl glass-card text-foreground hover:text-blue-600 dark:hover:text-orange-400 flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
          >
            Sign In
          </Link>
        </motion.div>
      </section>

      {/* MINIMAL BENTO GRID */}
      <section className="w-full max-w-[1200px] px-6 py-16">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-orange-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Core Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Engineered for zero tolerance.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1 */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between min-h-[280px] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-orange-500/10 dark:text-orange-400 flex items-center justify-center mb-6 border border-blue-500/20 dark:border-orange-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Strict Access Control</h3>
              <p className="mt-3 text-muted-foreground text-sm font-normal leading-relaxed">
                Cryptographically signed JWTs instantly restrict database mutations and UI capabilities. Admin, Analyst, and Viewer roles pre-configured.
              </p>
            </div>
            <div className="relative z-10 pt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-orange-400">
              Role isolation active &rarr;
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between min-h-[280px] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-amber-500/10 dark:text-amber-400 flex items-center justify-center mb-6 border border-indigo-500/20 dark:border-amber-500/20">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">NUMERIC(15,2) Exactness</h3>
              <p className="mt-3 text-muted-foreground text-sm font-normal leading-relaxed">
                Zero floating point drift. All financial data is structurally enforced at the database level using strict decimal precision scaling.
              </p>
            </div>
            <div className="relative z-10 pt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-orange-400">
              Hardware decimal parity &rarr;
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between min-h-[280px] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 dark:bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:bg-orange-500/10 dark:text-orange-400 flex items-center justify-center mb-6 border border-purple-500/20 dark:border-orange-500/20">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Immutable Retention</h3>
              <p className="mt-3 text-muted-foreground text-sm font-normal leading-relaxed">
                Compliance by default. Data is soft-deleted and structurally retained indefinitely for SOC2 and internal corporate auditing requirements.
              </p>
            </div>
            <div className="relative z-10 pt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-orange-400">
              Irreversible audit trail &rarr;
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between min-h-[280px] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 dark:bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:bg-amber-500/10 dark:text-amber-400 flex items-center justify-center mb-6 border border-sky-500/20 dark:border-amber-500/20">
                <CodeXml className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Swagger & REST Contracts</h3>
              <p className="mt-3 text-muted-foreground text-sm font-normal leading-relaxed">
                Fully documented OpenAPI specifications. Endpoints are strictly typed, auto-generated, and ready for internal corporate pipeline integration.
              </p>
            </div>
            <div className="relative z-10 pt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-orange-400">
              Auto-generated OpenAPI &rarr;
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="w-full max-w-[1200px] px-6 my-16">
        <div className="glass-card rounded-3xl p-12 sm:p-16 text-center flex flex-col items-center relative overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/15 dark:bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/15 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4 relative z-10">
            Ready to streamline your financial pipeline?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mb-8 relative z-10">
            Deploy in minutes with pre-seeded test data, automated 24/7 database keep-alive, and sub-millisecond query responses.
          </p>
          <Link
            href="/dashboard"
            className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 dark:bg-orange-600 dark:hover:bg-orange-500 text-white flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_25px_rgba(37,99,235,0.4)] dark:shadow-[0_4px_25px_rgba(234,88,12,0.4)] relative z-10"
          >
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
