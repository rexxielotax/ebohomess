'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  ShieldCheck,
  Home as HomeIcon,
  Lock,
  MessageCircle,
  Tag,
  MapPin,
  ChevronDown,
  ClipboardCheck,
  Key,
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ListingCard } from '@/components/listing-card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const router = useRouter()
  const [listingMode] = useState<'rent' | 'sale'>('rent')
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const [featured, setFeatured] = useState<any[]>([])
  const [recent, setRecent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const searchCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchHomeListings = async () => {
      setLoading(true)

      const { data: featuredData } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'approved')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(4)

      const { data: recentData } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(4)

      setFeatured(featuredData || [])
      setRecent(recentData || [])
      setLoading(false)
    }
    fetchHomeListings()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (propertyType) params.set('type', propertyType)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    params.set('mode', listingMode)
    router.push(`/search?${params.toString()}`)
  }

  const scrollToSearch = () => {
    searchCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const trustPoints = [
    { icon: ShieldCheck, title: 'Verified & Trusted', desc: 'Every landlord and property is verified' },
    { icon: MessageCircle, title: 'Direct Communication', desc: 'Chat or call landlords directly' },
    { icon: Lock, title: 'Secure & Safe', desc: 'No scams. We prioritize your safety' },
    { icon: Tag, title: 'No Hidden Fees', desc: 'No agent commission. No hidden charges' },
  ]

  const steps = [
    { n: 1, icon: Search, title: 'Search', desc: 'Find properties that fit your needs' },
    { n: 2, icon: MessageCircle, title: 'Contact', desc: 'Message or call landlords directly' },
    { n: 3, icon: ClipboardCheck, title: 'Inspect', desc: 'Schedule viewing and inspect' },
    { n: 4, icon: Key, title: 'Move In', desc: 'Sign agreement and move in' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative">
          <div
            className="relative py-16 md:py-24"
            style={{
              backgroundImage: "url('/hero.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-14 md:pb-20">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <ShieldCheck size={16} className="text-primary" />
                Verified Rentals. Trusted People.
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-white leading-tight text-balance">
                Find Verified Homes in <span className="text-primary">Ebonyi State</span>
              </h1>
              <p className="text-base md:text-lg text-white/90 max-w-xl mx-auto mb-7 text-balance">
                The safest way to rent genuine properties from verified landlords. No scams. No stress.
              </p>
              <Button
                type="button"
                onClick={scrollToSearch}
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <Search size={18} className="mr-2" />
                Search Homes
              </Button>
            </div>
          </div>

          {/* Overlapping Search Card */}
          <div
            ref={searchCardRef}
            className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-14 relative z-20"
          >
            <form
              onSubmit={handleSearch}
              className="bg-card rounded-2xl shadow-xl border border-border p-5 md:p-6 space-y-4"
            >
              {/* Location */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-1.5">
                  <MapPin size={15} className="text-primary" />
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Where are you looking?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-3 pr-9 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-1.5">
                  <HomeIcon size={15} className="text-primary" />
                  Property Type
                </label>
                <div className="relative">
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full appearance-none pl-3 pr-9 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Any Type</option>
                    <option value="flat">Flat / Apartment</option>
                    <option value="bungalow">Bungalow</option>
                    <option value="duplex">Duplex</option>
                    <option value="self-contain">Self Contain</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-1.5">
                  <Tag size={15} className="text-primary" />
                  Budget
                </label>
                <div className="flex items-center gap-2 px-3 py-1 bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full py-1.5 bg-transparent text-foreground text-sm focus:outline-none"
                  />
                  <span className="text-muted-foreground text-sm">–</span>
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full py-1.5 bg-transparent text-foreground text-sm focus:outline-none"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5">
                <Search size={18} className="mr-2" />
                Search Homes
              </Button>
            </form>
          </div>
        </section>

        {/* Trust Points */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4 grid grid-cols-2 gap-4">
          {trustPoints.map((item) => (
            <div key={item.title} className="flex items-start gap-3 bg-secondary/60 rounded-xl p-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm leading-tight">{item.title}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Featured Properties */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl md:text-3xl font-bold text-foreground">Featured Properties</h2>
            <button onClick={() => router.push('/search')} className="text-primary text-sm font-semibold hover:underline whitespace-nowrap">
              View all →
            </button>
          </div>
          {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden border border-border animate-pulse h-64 w-[85%] sm:w-auto shrink-0" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible">
              {featured.map((listing) => (
                <div key={listing.id} className="snap-start shrink-0 w-[85%] sm:w-auto">
                  <ListingCard
                    id={listing.id}
                    image={listing.photos?.[0] ?? ''}
                    price_monthly={listing.price_monthly}
                    price_yearly={listing.price_yearly}
                    location={listing.location_text}
                    property_type={listing.property_type}
                    bedrooms={listing.bedrooms}
                    verified={listing.verified}
                    featured={listing.featured}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recently Added */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl md:text-3xl font-bold text-foreground">Recently Added</h2>
            <button onClick={() => router.push('/search')} className="text-primary text-sm font-semibold hover:underline whitespace-nowrap">
              View all →
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden border border-border animate-pulse h-56" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {recent.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  image={listing.photos?.[0] ?? ''}
                  price_monthly={listing.price_monthly}
                  price_yearly={listing.price_yearly}
                  location={listing.location_text}
                  property_type={listing.property_type}
                  bedrooms={listing.bedrooms}
                  verified={listing.verified}
                  featured={listing.featured}
                />
              ))}
            </div>
          )}
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-xl md:text-3xl font-bold text-foreground text-center mb-10">How It Works</h2>

          {/* Desktop: with connecting lines */}
          <div className="hidden lg:flex items-start">
            {steps.map((step, i) => (
              <div key={step.n} className="flex items-start flex-1">
                <div className="flex flex-col items-center text-center w-full">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3">
                    <step.icon size={24} className="text-primary" />
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {step.n}
                    </span>
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">{step.title}</p>
                  <p className="text-muted-foreground text-xs px-2">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 border-t-2 border-dashed border-primary/30 mt-8 mx-1" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile / tablet: simple grid */}
          <div className="grid grid-cols-2 lg:hidden gap-6">
            {steps.map((step) => (
              <div key={step.n} className="text-center">
                <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
                  <step.icon size={20} className="text-primary" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {step.n}
                  </span>
                </div>
                <p className="font-semibold text-foreground text-sm mb-1">{step.title}</p>
                <p className="text-muted-foreground text-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}