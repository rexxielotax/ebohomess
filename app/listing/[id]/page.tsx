'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronLeft, Phone, MessageCircle, Share2, MapPin, Bed, Droplet, Zap, ParkingCircle, Shield, Wifi, Leaf, Star, CheckCircle, Copy } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { VerifiedBadge } from '@/components/badges'
import { MapPlaceholder } from '@/components/map-placeholder'
import { MOCK_LISTINGS } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'

const AMENITY_ICONS: Record<string, any> = {
  water: Droplet,
  generator: Zap,
  parking: ParkingCircle,
  security: Shield,
  internet: Wifi,
  garden: Leaf,
}

export default function ListingDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const listing = MOCK_LISTINGS.find((l) => l.id === id)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Listing not found</h1>
            <Link href="/" className="text-primary hover:underline">
              ← Back to search
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.gallery.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.gallery.length) % listing.gallery.length)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasEnoughReviews = listing.landlord_reviews >= 3

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-6">
            <ChevronLeft size={20} />
            Back to search
          </Link>

          {/* Gallery */}
          <div className="relative h-96 md:h-[500px] bg-muted rounded-lg overflow-hidden mb-8 card-shadow border border-border">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${listing.gallery[currentImageIndex]}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Navigation Arrows */}
            {listing.gallery.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                  aria-label="Next image"
                >
                  <ChevronLeft size={24} className="rotate-180" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {listing.gallery.length}
                </div>
              </>
            )}
          </div>

          {/* Price and Title */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{listing.property_type}</h1>
                <p className="text-lg text-primary font-semibold">
                  ₦{listing.price_monthly.toLocaleString()}/month
                </p>
                <p className="text-sm text-muted-foreground">
                  ₦{listing.price_yearly.toLocaleString()}/year
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.share?.({
                      title: listing.property_type,
                      url: window.location.href,
                    })
                  }}
                  className="p-3 hover:bg-secondary rounded-lg transition-colors"
                  aria-label="Share listing"
                >
                  <Share2 size={20} className="text-foreground" />
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin size={20} />
              <span>{listing.location}</span>
            </div>

            {/* Property Details */}
            <div className="flex items-center gap-6 text-foreground">
              <div className="flex items-center gap-2">
                <Bed size={20} />
                <span className="font-medium">{listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
                <p className="text-foreground leading-relaxed">{listing.description}</p>
              </section>

              {/* Amenities */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {listing.amenities.map((amenity) => {
                    const IconComponent = AMENITY_ICONS[amenity] || MapPin
                    return (
                      <div key={amenity} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
                        <IconComponent size={20} className="text-primary flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground capitalize">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Location Map */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Location</h2>
                <div className="rounded-lg overflow-hidden card-shadow border border-border">
                  <MapPlaceholder height="h-80" />
                </div>
              </section>
            </div>

            {/* Right Column - Landlord Info & Contact */}
            <div className="lg:col-span-1 space-y-6">
              {/* Landlord Card */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Landlord</h3>

                {/* Landlord Name */}
                <div className="mb-4 pb-4 border-b border-border">
                  <p className="text-foreground font-semibold">{listing.landlord_name}</p>
                  {listing.landlord_verified && <VerifiedBadge />}
                </div>

                {/* Rating Section */}
                {hasEnoughReviews ? (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < Math.floor(listing.landlord_rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                            }
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-foreground">{listing.landlord_rating?.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{listing.landlord_reviews} review{listing.landlord_reviews !== 1 ? 's' : ''}</p>
                  </div>
                ) : (
                  <div className="mb-6 p-3 bg-secondary rounded-lg">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">New landlord</span> — not enough reviews yet
                    </p>
                  </div>
                )}

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <a
                    href={`tel:${listing.landlord_phone}`}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    <Phone size={18} />
                    Call Landlord
                  </a>
                  <button
                    onClick={() => {
                      // WhatsApp link
                      const message = `Hi, I&apos;m interested in the ${listing.property_type} in ${listing.location}.`
                      const whatsappUrl = `https://wa.me/${listing.landlord_phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
                      window.open(whatsappUrl, '_blank')
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </button>
                </div>
              </div>

              {/* Availability */}
              {listing.availability_date && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2">Availability</h3>
                  <p className="text-foreground">
                    Available from{' '}
                    <span className="font-semibold">
                      {new Date(listing.availability_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </p>
                </div>
              )}

              {/* Share Section */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Share</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const text = `Check out this ${listing.property_type} in ${listing.location} - ₦${listing.price_monthly.toLocaleString()}/month`
                      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`
                      window.open(whatsappUrl, '_blank')
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg transition-colors"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-muted text-foreground font-medium py-2 px-3 rounded-lg transition-colors"
                  >
                    <Copy size={18} />
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Fixed Bottom Contact Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden p-4 flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors">
          <Phone size={18} />
          Call
        </button>
        <button
          onClick={() => {
            const message = `Hi, I&apos;m interested in the ${listing.property_type} in ${listing.location}.`
            const whatsappUrl = `https://wa.me/${listing.landlord_phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
            window.open(whatsappUrl, '_blank')
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          <MessageCircle size={18} />
          Message
        </button>
      </div>
      <div className="md:hidden h-20" />
    </div>
  )
}
