'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sun, Moon } from 'lucide-react'
import { Button } from './ui/button'
import { supabase } from '@/lib/supabase'

export function Header() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)

    const fetchRole = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData?.user?.id
      if (!userId) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      setRole(profile?.role ?? null)
    }
    fetchRole()
  }, [])

  const toggleDarkMode = () => {
    if (!mounted) return
    const html = document.documentElement
    html.classList.toggle('dark')
    setIsDark(!isDark)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
<img 
  src="/logo.png" 
  alt="EboHomes" 
  className="h-20 w-auto transition-all duration-300 hover:drop-shadow-[0_0_12px_#16a34a]"
  style={{
    animation: 'fadeIn 0.8s ease-in, glowPulse 3s ease-in-out infinite'
  }}
/>            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-muted rounded"></div>
              <div className="h-10 w-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2">
<img 
  src="/logo.png" 
  alt="EboHomes" 
  className="h-20 w-auto transition-all duration-300 hover:drop-shadow-[0_0_12px_#16a34a]"
  style={{
    animation: 'fadeIn 0.8s ease-in, glowPulse 3s ease-in-out infinite'
  }}
/>          </Link>

          {/* Middle Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              About
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* List Your Property Button */}
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold hidden sm:inline-flex"
            >
              <Link href="/list-property">List Your Property</Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold sm:hidden h-9 px-3 text-sm"
            >
              <Link href="/list-property">List</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden flex items-center gap-4 mt-3 pt-3 border-t border-border">
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            About
          </button>
        </nav>
      </div>
    </header>
  )
}
