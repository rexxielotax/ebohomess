'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Map } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ListingCard } from '@/components/listing-card'
import { FilterPanel, Filters } from '@/components/filter-panel'
import dynamic from 'next/dynamic'

const MapPlaceholder = dynamic(
  () => import('@/components/map-placeholder').then(mod => ({ default: mod.MapPlaceholder })),
  { ssr: false }
)
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [listings, setListings] = useState<any[]>([])
const [allListings, setAllListings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 300000,
    propertyType: [],
    bedrooms: [],
    amenities: [],
  })
  const [activeFilterCount, setActiveFilterCount] = useState(0)
  const [highlightedListingId, setHighlightedListingId] = useState<string>()
  const listingsRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  const fetchListings = async () => {
    setIsLoading(true)
 const { data } = await supabase
  .from('listings')
  .select('*')
  .eq('status', 'approved')
      .order('created_at', { ascending: false })
    setAllListings(data || [])
    setListings(data || [])
    setIsLoading(false)
  }
  fetchListings()
}, [])

const handleSearch = (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setTimeout(() => {
    const filtered = allListings.filter((listing) =>
      listing.location_text?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setListings(filtered)
    setIsLoading(false)
  }, 300)
}

  const handleApplyFilters = (filters: Filters) => {
  setActiveFilters(filters)
  setIsLoading(true)

  setTimeout(() => {
    let filtered = allListings

      // Apply search term
     if (searchTerm) {
        filtered = filtered.filter(
          (listing) =>
            listing.location_text?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      // Apply price filter
      filtered = filtered.filter(
        (listing) => listing.price_monthly >= filters.minPrice && listing.price_monthly <= filters.maxPrice
      )

      // Apply property type filter
      if (filters.propertyType.length > 0) {
        filtered = filtered.filter((listing) => filters.propertyType.includes(listing.property_type))
      }

      // Apply bedroom filter
      if (filters.bedrooms.length > 0) {
        filtered = filtered.filter((listing) => filters.bedrooms.includes(listing.bedrooms))
      }

      // Apply amenities filter
      if (filters.amenities.length > 0) {
        filtered = filtered.filter((listing) =>
          filters.amenities.some((amenity) => listing.amenities.includes(amenity))
        )
      }

      setListings(filtered)
      setIsLoading(false)
    }, 300)

    // Count active filters
    let count = 0
    if (filters.minPrice > 0 || filters.maxPrice < 300000) count++
    if (filters.propertyType.length > 0) count++
    if (filters.bedrooms.length > 0) count++
    if (filters.amenities.length > 0) count++
    setActiveFilterCount(count)
  }

  const handleMapPinClick = (id: string) => {
    setHighlightedListingId(id)
    // Scroll to the highlighted listing card
    if (listingsRef.current) {
      const card = listingsRef.current.querySelector(`[data-listing-id="${id}"]`)
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }

  const handleListingHover = (id: string) => {
    setHighlightedListingId(id)
  }

  const hasNoResults = !isLoading && listings.length === 0

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
    {/* Hero Section */}
<section
  className="relative py-40 md:py-56 border-b border-border"
  style={{
    backgroundImage: "url('/hero.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <div className="absolute inset-0 bg-black/55" />
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
   <h1 
  className="text-4xl md:text-6xl font-extrabold mb-4 text-balance leading-tight"
  style={{
    animation: 'slideUp 0.8s ease-out forwards',
    background: 'linear-gradient(135deg, #ffffff 0%, #4ade80 50%, #16a34a 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: 'none',
  }}
>
BEST PLACE TO FIND YOUR HOME IN EBONYI STATE
</h1>
<p 
  className="text-lg md:text-xl max-w-2xl text-white/90 text-balance font-medium"
  style={{
    animation: 'slideUpDelay 1.2s ease-out forwards',
  }}
>
  Connect directly with property owners, no agent commission no, no stress !!
</p>
  </div>
</section>
        {/* Search Section */}
        <div className="bg-card border-b border-border sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search by neighborhood or area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
              >
                Search
              </Button>
            </form>

            {/* Filter Bar */}
            <div className="flex items-center gap-3 flex-wrap">
              <FilterPanel onApply={handleApplyFilters} activeFilterCount={activeFilterCount} />

              {/* Map Toggle (Mobile) */}
              <button
                onClick={() => setShowMap(!showMap)}
                className="md:hidden flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 text-foreground hover:bg-secondary transition-colors font-medium"
              >
                <Map size={18} />
                {showMap ? 'List' : 'Map'}
              </button>

              {/* Sort Control */}
              <select className="bg-card border border-border rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Inquired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">          {/* Desktop: Split View */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Listings */}
            <div className="lg:col-span-2">
              {isLoading ? (
                // Loading Skeleton
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card rounded-lg overflow-hidden card-shadow border border-border animate-pulse h-64" />
                  ))}
                </div>
              ) : hasNoResults ? (
                // Empty State
                <div className="bg-card rounded-lg p-12 text-center border border-border">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No properties found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try widening your search or adjusting your filters
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm('')
                      setActiveFilters({
                        minPrice: 0,
                        maxPrice: 300000,
                        propertyType: [],
                        bedrooms: [],
                        amenities: [],
                      })
                      setActiveFilterCount(0)
                      setListings(allListings)
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                // Listings Grid
                <div ref={listingsRef} className="space-y-4">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      data-listing-id={listing.id}
                      onMouseEnter={() => handleListingHover(listing.id)}
                      onMouseLeave={() => setHighlightedListingId(undefined)}
                    >
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
            </div>

            {/* Right: Map */}
            <div className="lg:col-span-1 sticky top-40">
              <div className="rounded-lg overflow-hidden card-shadow border border-border">
                <MapPlaceholder
                  height="h-full min-h-96"
                  highlightedPin={highlightedListingId}
                  onPinClick={handleMapPinClick}
                />
              </div>
            </div>
          </div>

          {/* Mobile: Single View */}
          <div className="md:hidden">
            {showMap ? (
              // Mobile Map View
              <div className="rounded-lg overflow-hidden card-shadow border border-border">
                <MapPlaceholder
                  height="h-96"
                  highlightedPin={highlightedListingId}
                  onPinClick={handleMapPinClick}
                />
              </div>
            ) : (
              // Mobile List View
              <>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-card rounded-lg overflow-hidden card-shadow border border-border animate-pulse h-64"
                      />
                    ))}
                  </div>
                ) : hasNoResults ? (
                  <div className="bg-card rounded-lg p-12 text-center border border-border">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No properties found</h3>
                    <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                    <Button
                      onClick={() => {
                        setSearchTerm('')
                        setActiveFilters({
                          minPrice: 0,
                          maxPrice: 300000,
                          propertyType: [],
                          bedrooms: [],
                          amenities: [],
                        })
                        setActiveFilterCount(0)
                        setListings(allListings)
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div ref={listingsRef} className="space-y-4">
                    {listings.map((listing) => (
                      <div key={listing.id} data-listing-id={listing.id}>
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
              </>
            )}
          </div>
        </div>

        {/* How It Works Section */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-card border border-border rounded-lg p-8 text-center card-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">List Your Property</h3>
              <p className="text-muted-foreground">
                Upload photos, set your rent, and add property details. It&apos;s free and takes just a few minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-card border border-border rounded-lg p-8 text-center card-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Tenants Search</h3>
              <p className="text-muted-foreground">
                Qualified tenants search and filter properties based on location, price, and amenities.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-card border border-border rounded-lg p-8 text-center card-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Connect Directly</h3>
              <p className="text-muted-foreground">
                Message tenants directly, schedule viewings, and manage applications—no middleman needed.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-secondary border-y border-border py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-8">About EboHomes</h2>
            <p className="text-lg text-muted-foreground text-center leading-relaxed">
              EboHomes is on a mission to transform the rental market in Ebonyi State by connecting landlords and tenants
              directly. We believe in transparency, trust, and fair pricing. By removing unnecessary intermediaries, we help
              landlords reach more tenants and give tenants access to better rental options at lower costs. Whether you&apos;re
              looking to list a property or find your next home, EboHomes makes it simple, secure, and straightforward.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
