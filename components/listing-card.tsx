import Link from 'next/link'
import { MapPin, Bed, Home } from 'lucide-react'
import { VerifiedBadge, FeaturedBadge } from './badges'

interface ListingCardProps {
  id: string
  image: string
  price_monthly: number
  price_yearly: number
  location: string
  property_type: string
  bedrooms: number
  verified?: boolean
  featured?: boolean
}

export function ListingCard({
  id,
  image,
  price_monthly,
  price_yearly,
  location,
  property_type,
  bedrooms,
  verified = false,
  featured = false,
}: ListingCardProps) {
  return (
    <Link href={`/listing/${id}`}>
      <div className="bg-card rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer card-shadow border border-border">
        {/* Image Container */}
        <div className="relative">
          <div
            className="h-40 bg-muted overflow-hidden"
            style={{
              backgroundImage: `url('${image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Badge Container */}
          <div className="absolute top-3 left-3 flex gap-2">
            {featured && <FeaturedBadge />}
            {verified && <VerifiedBadge />}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="mb-2">
            <p className="text-lg font-bold text-primary">
              ₦{price_monthly.toLocaleString()}/month
            </p>
            <p className="text-xs text-muted-foreground">
              ₦{price_yearly.toLocaleString()}/year
            </p>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 mb-3">
            <MapPin size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">{location}</p>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Home size={16} />
              {property_type}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Bed size={16} />
              {bedrooms} bed{bedrooms !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Contact Button */}
          <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
            Contact Landlord
          </button>
        </div>
      </div>
    </Link>
  )
}
