"use client"
import React from 'react'
import { ThemeProvider } from './ThemeProvider'
import Navigation from './Navigation'

function MinimalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-zinc-50 dark:bg-black transition-colors duration-500">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.4] pointer-events-none" />

      {/* Subtle Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-zinc-200/50 to-transparent dark:from-zinc-900/50 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <main className="min-h-[calc(100vh-80px)] p-5 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MinimalLayout>
        {children}
      </MinimalLayout>
    </ThemeProvider>
  )
}

