'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, History, Calculator, Server, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function FeaturesSection() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Role-Based Access Control (RBAC)',
      subtitle: 'Strict Least-Privilege Hierarchy',
      desc: 'Enforced at the route and database query level. Admins manage users and records; Analysts submit financial data and run reports; Viewers inspect high-level aggregated insights with raw transaction lockdown.',
      color: 'from-indigo-500/10 to-transparent',
      borderColor: 'hover:border-indigo-500/50',
      iconColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10',
      badge: 'Security',
    },
    {
      icon: History,
      title: 'Soft-Deletion Audit Integrity',
      subtitle: 'Zero Data Loss Compliance',
      desc: 'Financial records are never erased from storage. Deleted transactions receive an ISO-8601 deleted_at timestamp, preserving full accounting compliance and historical audit trails required for SOC2 audits.',
      color: 'from-emerald-500/10 to-transparent',
      borderColor: 'hover:border-emerald-500/50',
      iconColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      badge: 'Audit Trail',
    },
    {
      icon: Calculator,
      title: 'NUMERIC(15,2) Precision Engine',
      subtitle: 'Decimal Exact Floating Safety',
      desc: 'All financial amounts are strictly typed as PostgreSQL NUMERIC(15,2). Prevents catastrophic IEEE-754 binary floating point rounding errors common in standard FLOAT or REAL data types.',
      color: 'from-amber-500/10 to-transparent',
      borderColor: 'hover:border-amber-500/50',
      iconColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
      badge: 'Integrity',
    },
    {
      icon: Server,
      title: 'Automated 24/7 Database Keep-Alive',
      subtitle: 'Never-Pause Supabase Health Monitoring',
      desc: 'Integrated with Windows background scheduled tasks and GitHub Actions cloud cron jobs to automatically ping Supabase every 6 hours, preventing free-tier inactivity pauses permanently.',
      color: 'from-purple-500/10 to-transparent',
      borderColor: 'hover:border-purple-500/50',
      iconColor: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
      badge: 'Availability',
    },
  ];

  return (
    <section className="py-24 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Enterprise Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-3">
            Engineered for Precision, Security & Compliance
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-4 max-w-2xl mx-auto">
            Every architectural decision was built to satisfy stringent corporate financial data governance standards.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-2xl glass-card p-8 border transition-all duration-300 ${f.borderColor} group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${f.iconColor}`}>
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-secondary text-foreground border border-border shadow-sm">
                    {f.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm font-semibold text-muted-foreground mt-1.5">
                  {f.subtitle}
                </p>

                <p className="text-sm text-muted-foreground mt-4 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Role Permission Matrix preview */}
        <div className="mt-16 rounded-3xl glass-card p-8 border border-border shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="text-lg font-bold text-foreground">
                Role Privilege Enforcement Matrix
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Determines endpoint access and UI capabilities in real-time
              </p>
            </div>
            <Link
              href="/dashboard/records"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>Explore in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">View Dashboards</th>
                  <th className="py-2.5 px-3">View Raw Records</th>
                  <th className="py-2.5 px-3">Create/Edit Records</th>
                  <th className="py-2.5 px-3">User Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground font-medium">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">Admin</td>
                  <td className="py-2.5 px-3"><span className="text-emerald-500 font-bold">✓ Full</span></td>
                  <td className="py-2.5 px-3"><span className="text-emerald-500 font-bold">✓ Full</span></td>
                  <td className="py-2.5 px-3"><span className="text-emerald-500 font-bold">✓ Create/Edit/Delete</span></td>
                  <td className="py-2.5 px-3"><span className="text-emerald-500 font-bold">✓ Full Management</span></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">Analyst</td>
                  <td className="py-2.5 px-3"><span className="text-emerald-500 font-bold">✓ Full</span></td>
                  <td className="py-2.5 px-3"><span className="text-emerald-500 font-bold">✓ Full</span></td>
                  <td className="py-2.5 px-3"><span className="text-emerald-500 font-bold">✓ Create/Edit</span></td>
                  <td className="py-2.5 px-3"><span className="text-slate-400">✗ Blocked</span></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-amber-600 dark:text-amber-400">Viewer</td>
                  <td className="py-2.5 px-3"><span className="text-emerald-500 font-bold">✓ Read-Only</span></td>
                  <td className="py-2.5 px-3"><span className="text-slate-400">✗ 403 Forbidden</span></td>
                  <td className="py-2.5 px-3"><span className="text-slate-400">✗ Blocked</span></td>
                  <td className="py-2.5 px-3"><span className="text-slate-400">✗ Blocked</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
