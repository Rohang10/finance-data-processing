import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AmbientBackground } from '@/components/ui/AmbientBackground';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FinCorp Data | Enterprise Financial Intelligence & RBAC',
  description: 'High-precision financial data processing, role-based analytics, and real-time ledger intelligence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="darkreader-lock" />
      </head>
      <body suppressHydrationWarning className="relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <AmbientBackground />
            <Navbar />
            <main className="relative z-10 flex-1 w-full">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
