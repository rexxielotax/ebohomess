'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ShieldCheck, Home as HomeIcon, Lock, MessageCircle, Tag } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ListingCard } from '@/components/listing-card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const router = useRouter()
  const [listingMode, setListingMode] = useState<'rent' | 'sale'>('rent')
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const [featured, setFeatured] = useState<any[]>([])
  const [recent, setRecent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section
          className="relative py-28 md:py-36 border-b border-border"
          style={{
            backgroundImage: "url('/hero.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <ShieldCheck size={16} className="text-primary" />
              Verified Rentals. Trusted People.
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white leading-tight text-balance">
              Find Verified Homes in <span className="text-primary">Ebonyi State</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 text-balance">
              The safest way to rent genuine properties from verified landlords. No scams. No stress.
            </p>

            {/* Search Card */}
            <div className="bg-card rounded-xl shadow-lg p-4 md:p-6 max-w-3xl mx-auto text-left">
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setListingMode('rent')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    listingMode === 'rent'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  }`}
                >
                  For Rent
                </button>
                <button
                  type="button"
                  onClick={() => setListingMode('sale')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    listingMode === 'sale'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  }`}
                >
                  For Sale
                </button>
              </div>

              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
                  <input
                    type="text"
                    placeholder="Where are you looking?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Any Type</option>
                    <option value="flat">Flat / Apartment</option>
                    <option value="bungalow">Bungalow</option>
                    <option value="duplex">Duplex</option>
                    <option value="self-contain">Self Contain</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Min Price</label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Max Price</label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-5">
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5">
                    <Search size={18} className="mr-2" />
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, title: 'Verified Landlords', desc: 'All landlords are verified' },
            { icon: HomeIcon, title: 'Real Properties', desc: 'Every listing is reviewed' },
            { icon: Lock, title: 'Secure & Scam-Free', desc: 'We protect you always' },
            { icon: MessageCircle, title: 'Direct Communication', desc: 'Chat or call landlords' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{item.title}</p>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Featured Properties */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Properties</h2>
            <button onClick={() => router.push('/search')} className="text-primary text-sm font-semibold hover:underline">
              View all properties →
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden border border-border animate-pulse h-64" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((listing) => (
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

        {/* Why Choose EboHomes */}
        <section className="bg-secondary border-y border-border py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">Why Choose EboHomes?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: ShieldCheck, title: 'Verified & Trusted', desc: 'Every landlord and property is verified' },
                { icon: Lock, title: 'Secure & Safe', desc: 'No scams. We prioritize your safety' },
                { icon: MessageCircle, title: 'Direct Communication', desc: 'Chat or call landlords directly' },
                { icon: Tag, title: 'No Hidden Fees', desc: 'No agent commission. No hidden charges' },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <item.icon size={22} className="text-primary" />
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">{item.title}</p>
                  <p className="text-muted-foreground text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recently Added */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Recently Added</h2>
            <button onClick={() => router.push('/search')} className="text-primary text-sm font-semibold hover:underline">
              View all →
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden border border-border animate-pulse h-64" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: 1, title: 'Search', desc: 'Find properties that fit your needs' },
              { n: 2, title: 'Contact', desc: 'Message or call landlords directly' },
              { n: 3, title: 'Inspect', desc: 'Schedule viewing and inspect' },
              { n: 4, title: 'Move In', desc: 'Sign agreement and move in' },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-primary">{step.n}</span>
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