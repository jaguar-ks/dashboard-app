"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({
  theme: 'light',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as Theme
    if (stored) {
      setTheme(stored)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    // Add transitioning class for animation
    root.classList.add('transitioning')
    
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    localStorage.setItem('theme', theme)
    
    // Remove transitioning class after animation
    const timer = setTimeout(() => {
      root.classList.remove('transitioning')
    }, 300)
    
    return () => clearTimeout(timer)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }

  // Prevent hydration mismatch by not rendering until mounted, 
  // BUT for the theme provider context, we might want to render children 
  // to avoid layout shift, just not the theme-dependent parts if any.
  // However, the original code returned <>{children}</> if not mounted, 
  // which is fine as it renders children without context. 
  // But to fix the flash, we rely on the script in layout.tsx for initial state,
  // and this provider takes over.
  
  if (!mounted) return <>{children}</>

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
