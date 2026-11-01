'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ShieldCheck, Database, Lock, Code2, Server } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full relative border-t border-blue-500/30 dark:border-orange-500/30 bg-white/60 dark:bg-gradient-to-b dark:from-zinc-950 dark:to-black backdrop-blur-md mt-auto shadow-[0_-5px_30px_rgba(37,99,235,0.05)] dark:shadow-[0_-10px_40px_rgba(249,115,22,0.05)] overflow-hidden group">
      {/* Animated Background Orbs */}
      <div className="absolute top-1/2 -left-24 w-96 h-96 -translate-y-1/2 bg-blue-500/5 dark:bg-orange-500/5 rounded-full blur-3xl group-hover:scale-110 group-hover:bg-blue-500/10 dark:group-hover:bg-orange-500/10 transition-all duration-700 ease-in-out pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 -translate-y-1/2 bg-purple-500/5 dark:bg-amber-500/5 rounded-full blur-3xl group-hover:scale-110 group-hover:bg-purple-500/10 dark:group-hover:bg-amber-500/10 transition-all duration-700 ease-in-out pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand & About */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] dark:bg-gradient-to-br dark:from-orange-400 dark:to-orange-600 flex items-center justify-center text-white dark:shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all">
                <TrendingUp className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>FinCorp<span className="text-blue-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-orange-400 dark:to-orange-600">Data</span></span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-blue-600 text-white shadow-[0_0_5px_rgba(37,99,235,0.4)] dark:bg-orange-600 dark:shadow-[0_0_10px_rgba(234,88,12,0.4)]">
                  PRO
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Enterprise financial data processing platform with high-precision numeric calculations, strict Role-Based Access Control, and automated cloud health monitoring.
            </p>

          </div>

          {/* Core Modules */}
          <div>
            <h4 className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 border border-blue-500/30 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30 mb-4">
              Modules & Views
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li>
                <Link href="/dashboard" className="inline-block hover:text-blue-600 hover:drop-shadow-[0_0_5px_rgba(37,99,235,0.4)] dark:hover:text-orange-400 transition-all duration-300 hover:translate-x-1">
                  Executive Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/records" className="inline-block hover:text-blue-600 hover:drop-shadow-[0_0_5px_rgba(37,99,235,0.4)] dark:hover:text-orange-400 transition-all duration-300 hover:translate-x-1">
                  Transaction Audit Logs
                </Link>
              </li>
              <li>
                <Link href="/dashboard/users" className="inline-block hover:text-blue-600 hover:drop-shadow-[0_0_5px_rgba(37,99,235,0.4)] dark:hover:text-orange-400 transition-all duration-300 hover:translate-x-1">
                  Team & Role Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Architectural Standards */}
          <div>
            <h4 className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 border border-blue-500/30 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30 mb-4">
              Enterprise Standards
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2 group cursor-default">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-orange-500 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.6)] dark:group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] group-hover:scale-110" />
                <span className="transition-colors group-hover:text-blue-600 dark:group-hover:text-orange-200">RBAC Strict Isolation</span>
              </li>
              <li className="flex items-center gap-2 group cursor-default">
                <Lock className="w-3.5 h-3.5 text-blue-500 dark:text-orange-500 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.6)] dark:group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] group-hover:scale-110" />
                <span className="transition-colors group-hover:text-blue-600 dark:group-hover:text-orange-200">Bcrypt + JWT 24h Expiry</span>
              </li>
              <li className="flex items-center gap-2 group cursor-default">
                <Database className="w-3.5 h-3.5 text-blue-500 dark:text-orange-500 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.6)] dark:group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] group-hover:scale-110" />
                <span className="transition-colors group-hover:text-blue-600 dark:group-hover:text-orange-200">NUMERIC(15,2) Precision</span>
              </li>
              <li className="flex items-center gap-2 group cursor-default">
                <Server className="w-3.5 h-3.5 text-blue-500 dark:text-orange-500 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.6)] dark:group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] group-hover:scale-110" />
                <span className="transition-colors group-hover:text-blue-600 dark:group-hover:text-orange-200">Zero Data Loss Soft Deletion</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-blue-500/20 dark:border-orange-500/20 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} FinCorp Data Processing System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              Corporate Edition v1.0
            </span>
            <span>•</span>
            <span>SOC2 Type II Compliant Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
