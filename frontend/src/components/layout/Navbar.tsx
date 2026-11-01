'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import {
  TrendingUp,
  LayoutDashboard,
  ReceiptText,
  Users,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', href: '/', icon: TrendingUp },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', href: '/dashboard/records', icon: ReceiptText },
    ...(user?.role === 'admin'
      ? [{ label: 'Team', href: '/dashboard/users', icon: Users }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full nav-blur border-b border-border/80 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-orange-500 dark:to-amber-600 text-white rounded-lg shadow-md transition-all duration-300 group-hover:scale-105">
                <TrendingUp className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-foreground flex items-center gap-1.5">
                  FinCorp<span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-orange-400 dark:to-amber-500 bg-clip-text text-transparent">Data</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-600 dark:bg-orange-600 text-white shadow-sm">
                    PRO
                  </span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-500/10 dark:bg-orange-500/15 text-blue-600 dark:text-orange-400 font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Area: Session & Actions */}
          <div className="flex items-center gap-4">
            
            {user && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-50/10 text-blue-600 shadow-[0_0_5px_rgba(37,99,235,0.1)] dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400 dark:shadow-[0_0_10px_rgba(234,88,12,0.15)]">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-orange-400" />
                <span className="text-xs font-bold capitalize">
                  {user.role}
                </span>
              </div>
            )}

            <ThemeToggle />

            {/* User Session Button */}
            {user ? (
              <button
                onClick={logout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-1.5 rounded-md border border-border text-foreground hover:bg-secondary text-xs font-bold transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 dark:bg-orange-600 dark:hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-foreground hover:bg-secondary"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 group">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-transparent text-blue-600 drop-shadow-[0_0_5px_rgba(37,99,235,0.3)] dark:text-orange-500 dark:drop-shadow-[0_0_5px_rgba(234,88,12,0.3)] group-hover:text-zinc-500 dark:group-hover:text-zinc-500 group-hover:drop-shadow-none hover:!text-blue-600 dark:hover:!text-orange-500 hover:!drop-shadow-[0_0_5px_rgba(37,99,235,0.3)] dark:hover:!drop-shadow-[0_0_5px_rgba(234,88,12,0.3)]'
                    : 'bg-transparent text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-500 dark:group-hover:text-zinc-500 hover:!text-blue-600 dark:hover:!text-orange-500 hover:!drop-shadow-[0_0_5px_rgba(37,99,235,0.3)] dark:hover:!drop-shadow-[0_0_5px_rgba(234,88,12,0.3)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          
          <div className="h-px bg-border my-2" />
          
          {!user ? (
            <div className="flex flex-col gap-2 px-1">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 rounded-md border border-border text-foreground text-sm font-bold"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 dark:bg-orange-600 dark:hover:bg-orange-500 text-white text-sm font-bold shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-blue-500/30 text-blue-600 hover:bg-blue-50/50 hover:shadow-[0_0_8px_rgba(37,99,235,0.15)] dark:border-orange-500/30 dark:text-orange-400 dark:hover:bg-orange-500/10 dark:hover:shadow-[0_0_10px_rgba(234,88,12,0.2)] text-sm font-bold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
