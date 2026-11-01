'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUsersApi } from '@/lib/api';
import { User, RoleType } from '@/types';
import { Users, Shield, ShieldAlert, CheckCircle2, XCircle, ArrowRight, UserPlus, Lock } from 'lucide-react';
import Link from 'next/link';

export default function UsersPage() {
  const { user, switchRoleDemo, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && user && user.role === 'admin') {
      getUsersApi().then((data) => {
        setUsers(data);
        setLoading(false);
      }).catch(console.error);
    }
  }, [user, isLoading]);

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="rounded-3xl glass-card border border-rose-200 dark:border-rose-900/60 p-8 sm:p-12 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            403 Forbidden: Administrator Privilege Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
            The User Management module is strictly restricted to members of the <strong>Admin</strong> role. Your current simulation role is <strong className="capitalize text-blue-600 dark:text-orange-400">{user?.role}</strong>.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => switchRoleDemo('admin')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 dark:bg-orange-600 dark:hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 dark:shadow-[0_4px_16px_rgba(234,88,12,0.4)] transition-all"
            >
              Switch to Admin Simulation
            </button>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const roleStyles: Record<RoleType, { badge: string; text: string }> = {
    admin: { badge: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:bg-orange-500/10 dark:border-orange-500/30 dark:text-orange-400', text: 'Admin (Full)' },
    analyst: { badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400', text: 'Analyst' },
    viewer: { badge: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400', text: 'Viewer (Read-Only)' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>Corporate Team & Access Governance</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 border border-blue-500/30 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/40 dark:shadow-[0_0_12px_rgba(249,115,22,0.25)]">
              Admin Exclusive
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage user accounts, assign cryptographic RBAC privileges, and toggle active status.
          </p>
        </div>

        <button
          onClick={() => alert('New corporate member invitation modal')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 dark:bg-orange-600 dark:hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 dark:shadow-[0_4px_20px_rgba(234,88,12,0.4)] transition-all hover:-translate-y-0.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Enrolled Date</th>
                <th className="py-3 px-4 text-center">Privileges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {users.map((u) => {
                const isActive = u.status !== 'inactive';
                const style = roleStyles[u.role] || roleStyles.viewer;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-orange-500/10 dark:text-orange-400 flex items-center justify-center font-bold text-xs uppercase">
                        {u.name.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {u.email}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] border ${style.badge}`}>
                        {style.text}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isActive ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {u.created_at || '2026-09-01'}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-orange-400">
                        {u.role === 'admin' ? 'Superadmin' : u.role === 'analyst' ? 'Write Ledger' : 'Read Analytics'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
