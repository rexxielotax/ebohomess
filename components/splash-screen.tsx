'use client'

import { useState, useEffect } from 'react'

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1400)
    const removeTimer = setTimeout(() => setLoading(false), 1800)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  return (
    <>
      {loading && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0A2E1A] transition-opacity duration-400 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <img
            src="/splash-screen.png"
            alt="EboHomes"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {children}
    </>
  )
}