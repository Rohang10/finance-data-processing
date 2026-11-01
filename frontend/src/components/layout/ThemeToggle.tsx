'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-16 h-8 rounded-full border border-blue-500/30 dark:border-orange-500/30 bg-white/50 dark:bg-black/20" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex items-center w-16 h-8 p-1 rounded-full cursor-pointer transition-colors duration-500 ease-in-out backdrop-blur-xl border border-white/60 dark:border-white/10 bg-white/30 dark:bg-black/20 hover:bg-white/50 dark:hover:bg-black/40 shadow-[0_4px_16px_rgba(37,99,235,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 dark:focus-visible:ring-orange-500/30 overflow-hidden"
      aria-label="Toggle theme"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Background Tints */}
      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isDark ? 'bg-gradient-to-r from-orange-500/10 to-transparent opacity-100' : 'opacity-0'}`} />
      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${!isDark ? 'bg-gradient-to-r from-transparent to-blue-500/10 opacity-100' : 'opacity-0'}`} />

      <div className="relative flex items-center w-full h-full">
        {/* Background Track Icons */}
        <div className="absolute w-full flex justify-between px-1.5 z-0 pointer-events-none">
          <Sun className={`w-3.5 h-3.5 transition-all duration-500 ${isDark ? 'text-orange-400/80 scale-100 drop-shadow-[0_0_2px_rgba(234,88,12,0.3)]' : 'text-blue-500/0 scale-50 -translate-x-2'}`} />
          <Moon className={`w-3.5 h-3.5 transition-all duration-500 ${!isDark ? 'text-blue-500/80 scale-100 drop-shadow-[0_0_2px_rgba(37,99,235,0.3)]' : 'text-orange-400/0 scale-50 translate-x-2'}`} />
        </div>

        {/* Sliding Knob */}
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25
          }}
          className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-[#1a1a1a] border border-white/80 dark:border-white/5 ${
            isDark ? 'shadow-[0_2px_8px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'shadow-[0_2px_8px_rgba(37,99,235,0.15),inset_0_-1px_1px_rgba(0,0,0,0.05)]'
          }`}
          style={{
            marginLeft: isDark ? 'auto' : '0'
          }}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDark ? 360 : 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
          >
            {isDark ? (
              <Moon className="w-3.5 h-3.5 text-orange-500" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-blue-600" />
            )}
          </motion.div>
        </motion.div>
      </div>
    </button>
  );
}
