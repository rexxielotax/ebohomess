'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Sun, Moon, LogOut, LayoutDashboard, Heart, Bell, Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { supabase } from '@/lib/supabase'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)

    const fetchRole = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData?.user?.id
      if (!userId) return

      setLoggedIn(true)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle()
      setRole(profile?.role ?? null)
    }
    fetchRole()
  }, [])

  const toggleDarkMode = () => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark')
    setIsDark(!isDark)
  }

  const handleListClick = async () => {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) {
      router.push('/login')
      return
    }
    router.push('/dashboard')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setRole(null)
    setLoggedIn(false)
    router.push('/')
  }

  const goToHowItWorks = () => {
    if (pathname === '/') {
      const element = document.getElementById('how-it-works')
      if (element) element.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/#how-it-works')
    }
    setMobileMenuOpen(false)
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/search' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <img src="/logo.png" alt="EboHomes" className="h-14 w-auto" />
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-muted rounded" />
              <div className="h-10 w-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logo.png"
              alt="EboHomes"
              className="h-12 md:h-14 w-auto transition-all duration-300 hover:drop-shadow-[0_0_12px_#16a34a]"
              style={{ animation: 'fadeIn 0.8s ease-in' }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={goToHowItWorks}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              How It Works
            </button>

            {loggedIn && role === 'tenant' && (
              <Link
                href="/search"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Search Properties
              </Link>
            )}

            {loggedIn && role === 'landlord' && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Saved / Heart */}
            {loggedIn && (
              <Link
                href="/saved"
                className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground hidden sm:inline-flex"
                aria-label="Saved properties"
              >
                <Heart size={20} />
              </Link>
            )}

            {/* Notifications / Bell */}
            {loggedIn && (
              <Link
                href="/notifications"
                className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground hidden sm:inline-flex"
                aria-label="Notifications"
              >
                <Bell size={20} />
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Not logged in */}
            {!loggedIn && (
              <>
                <Link href="/login">
                  <Button variant="outline" className="hidden sm:inline-flex font-semibold">
                    Login
                  </Button>
                </Link>
                <Link href="/login?mode=signup">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold hidden sm:inline-flex">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {/* Logged in — TENANT */}
            {loggedIn && role === 'tenant' && (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}

            {/* Logged in — LANDLORD */}
            {loggedIn && role === 'landlord' && (
              <>
                <Button
                  onClick={handleListClick}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold hidden sm:inline-flex"
                >
                  + List Property
                </Button>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="lg:hidden flex flex-col gap-1 mt-3 pt-3 border-t border-border">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium py-2 ${
                  pathname === link.href ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={goToHowItWorks}
              className="text-sm font-medium text-foreground hover:text-primary text-left py-2"
            >
              How It Works
            </button>

            {loggedIn && (
              <>
                <Link href="/saved" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-foreground hover:text-primary py-2 flex items-center gap-2">
                  <Heart size={16} /> Saved Properties
                </Link>
                <Link href="/notifications" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-foreground hover:text-primary py-2 flex items-center gap-2">
                  <Bell size={16} /> Notifications
                </Link>
              </>
            )}

            {loggedIn && role === 'tenant' && (
              <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-foreground hover:text-primary py-2">
                Search Properties
              </Link>
            )}
            {loggedIn && role === 'landlord' && (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-foreground hover:text-primary py-2">
                  Dashboard
                </Link>
                <Link href="/list-property" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-primary py-2">
                  + List Property
                </Link>
              </>
            )}

            {!loggedIn && (
              <div className="flex gap-3 pt-2">
                <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full font-semibold">Login</Button>
                </Link>
                <Link href="/login?mode=signup" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">Sign Up</Button>
                </Link>
              </div>
            )}

            {loggedIn && (
              <button
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 py-2 mt-1"
              >
                <LogOut size={16} /> Logout
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}