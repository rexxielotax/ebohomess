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
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0A2E1A] transition-opacity duration-400 relative ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <img
            src="/splash-screen.png"
            alt="EboHomes"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-[110]">
            <div className="w-9 h-9 border-4 border-[#1A3C1A]/20 border-t-[#1A3C1A] rounded-full animate-spin" />
            <p className="text-[#1A3C1A] text-xs font-semibold tracking-widest">LOADING...</p>
          </div>
        </div>
      )}
      {children}
    </>
  )
}

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2E1A] relative">
      <img
        src="/splash-screen.png"
        alt="EboHomes"
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-[60]">
        <div className="w-9 h-9 border-4 border-[#1A3C1A]/20 border-t-[#1A3C1A] rounded-full animate-spin" />
        <p className="text-[#1A3C1A] text-xs font-semibold tracking-widest">LOADING...</p>
      </div>
    </div>
  )
}