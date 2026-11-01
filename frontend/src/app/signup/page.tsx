'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Loader2,
  Lock,
  Mail,
  User,
  BadgeCheck,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer'); // Backend enforces non-admin
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password, role);
      // Auto-redirects in AuthContext
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Platform Showcase */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-8 pr-0 lg:pr-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 dark:border-orange-500/30 dark:bg-orange-500/15 text-xs font-semibold text-blue-600 dark:text-orange-400 mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              Role-Based Ledger Access
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Join the <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-orange-400 dark:via-amber-500 dark:to-orange-500 bg-clip-text text-transparent">FinCorp Network</span>
            </h1>
            
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
              Equip your corporate finance department with zero-drift financial analytics, automated invoice classification, and multi-user auditability.
            </p>
          </div>

          {/* Role Access Highlights */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-card/60 dark:bg-card/40 border border-border/70 backdrop-blur-md transition-all hover:border-blue-500/30 dark:hover:border-orange-500/30">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-orange-500/10 dark:text-orange-400 mt-0.5">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Viewer Role</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Instant read-only compliance inspection, real-time dashboard visualization, and audit export capabilities.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-card/60 dark:bg-card/40 border border-border/70 backdrop-blur-md transition-all hover:border-blue-500/30 dark:hover:border-amber-500/30">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-amber-500/10 dark:text-amber-400 mt-0.5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Analyst Role</h4>
                <p className="text-xs text-muted-foreground mt-0.5">High-volume CSV ledger ingestion, transaction categorization, and dynamic forecast adjustments.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Strict zero-knowledge credential hashing using bcrypt (12 rounds)</span>
          </div>
        </div>

        {/* Right Column: Frosted Glass Signup Card */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden">
            
            {/* Ambient Card Accent Bloom */}
            <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-indigo-500/10 dark:bg-orange-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Request Access
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Register your corporate seat
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-500/20 dark:bg-orange-500/15 dark:border-orange-500/30 dark:text-orange-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} suppressHydrationWarning className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      suppressHydrationWarning
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/80 bg-background/70 dark:bg-background/50 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:ring-orange-500/40 dark:focus:border-orange-500 transition-all"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      suppressHydrationWarning
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/80 bg-background/70 dark:bg-background/50 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:ring-orange-500/40 dark:focus:border-orange-500 transition-all"
                      placeholder="jane@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      suppressHydrationWarning
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/80 bg-background/70 dark:bg-background/50 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:ring-orange-500/40 dark:focus:border-orange-500 transition-all"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Requested Role
                  </label>
                  <select
                    value={role}
                    suppressHydrationWarning
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border/80 bg-background/70 dark:bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:ring-orange-500/40 dark:focus:border-orange-500 transition-all cursor-pointer"
                  >
                    <option value="viewer">Viewer (Read-Only Audit & Monitoring)</option>
                    <option value="analyst">Analyst (Data Entry & Pipeline Processing)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    suppressHydrationWarning
                    className="w-full py-3 px-4 flex justify-center items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 dark:bg-orange-600 dark:hover:bg-orange-500 text-white font-semibold text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_4px_28px_rgba(37,99,235,0.5)] dark:shadow-[0_4px_25px_rgba(234,88,12,0.4)] dark:hover:shadow-[0_4px_35px_rgba(234,88,12,0.6)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Provisioning Account...
                      </>
                    ) : (
                      'Request Access'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-border/60 text-center">
                <p className="text-xs text-muted-foreground">
                  Already have access?{' '}
                  <Link href="/login" className="text-blue-600 dark:text-orange-400 font-semibold hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
