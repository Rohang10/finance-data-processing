'use client';

import React from 'react';

/**
 * AmbientBackground Component
 * 
 * Generates an ethereal, multi-layered diffuse aurora background effect
 * inspired by bevoice.online and modern high-prestige SaaS applications.
 * 
 * Works seamlessly across both Light (soft pastel aurora) and Dark (obsidian neon) modes.
 * Highly optimized with CSS GPU acceleration and zero layout shift.
 */
export function AmbientBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Precision Micro-Grid with Radial Falloff Mask */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-90 dark:opacity-90"
        style={{
          maskImage: 'radial-gradient(ellipse 85% 75% at 50% 40%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 40%, black 40%, transparent 100%)',
        }}
      />

      {/* 2. Top-Left Primary Aurora Bloom (Rose / Coral / Pink in both Light & Dark) */}
      <div
        className="absolute -top-[12%] -left-[10%] w-[58vw] h-[58vw] max-w-[850px] max-h-[850px] rounded-full blur-[110px] md:blur-[140px] transition-all duration-1000 ease-out transform-gpu will-change-transform
          bg-gradient-to-br from-rose-400/25 via-pink-300/15 to-transparent
          dark:from-rose-500/30 dark:via-pink-500/20 dark:to-transparent dark:mix-blend-screen"
      />

      {/* 3. Top-Right Secondary Bloom (Sky Blue / Cyan / Indigo in both Light & Dark) */}
      <div
        className="absolute -top-[8%] -right-[12%] w-[52vw] h-[52vw] max-w-[780px] max-h-[780px] rounded-full blur-[120px] md:blur-[150px] transition-all duration-1000 ease-out transform-gpu will-change-transform
          bg-gradient-to-bl from-sky-400/22 via-indigo-300/15 to-transparent
          dark:from-sky-400/30 dark:via-indigo-500/20 dark:to-transparent dark:mix-blend-screen"
      />

      {/* 4. Bottom Center Horizon Bloom (Violet / Purple / Rose in both Light & Dark) */}
      <div
        className="absolute -bottom-[20%] left-[15%] w-[65vw] h-[55vw] max-w-[950px] max-h-[750px] rounded-full blur-[130px] md:blur-[160px] transition-all duration-1000 ease-out transform-gpu will-change-transform
          bg-gradient-to-t from-violet-300/15 via-rose-200/12 to-transparent
          dark:from-violet-500/30 dark:via-purple-600/20 dark:to-transparent dark:mix-blend-screen"
      />

      {/* 5. Center-Right Ambient Warm Ember Accent (Amber / Peach in both Light & Dark) */}
      <div
        className="absolute top-[35%] right-[10%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full blur-[130px] transition-all duration-1000 ease-out transform-gpu will-change-transform
          bg-gradient-to-br from-amber-300/15 to-transparent
          dark:from-amber-400/25 dark:via-orange-500/15 dark:to-transparent dark:mix-blend-screen"
      />

      {/* 6. Edge Vignette for depth framing */}
      <div className="absolute inset-0 bg-radial-vignette opacity-20 dark:opacity-30" />
    </div>
  );
}
