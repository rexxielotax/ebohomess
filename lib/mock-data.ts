export interface Listing {
  id: string
  image: string
  price_monthly: number
  price_yearly: number
  location: string
  neighborhood: string
  property_type: string
  bedrooms: number
  amenities: string[]
  description: string
  landlord_name: string
  landlord_phone: string
  landlord_verified: boolean
  landlord_reviews: number
  landlord_rating: number | null
  verified: boolean
  featured: boolean
  gallery: string[]
  availability_date: string
  coordinate_lat: number
  coordinate_lng: number
}

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=300&fit=crop',
    price_monthly: 150000,
    price_yearly: 1800000,
    location: 'Abakaliki GRA',
    neighborhood: 'Government Reserved Area',
    property_type: 'Flat',
    bedrooms: 3,
    amenities: ['water', 'generator', 'parking', 'security'],
    description:
      'Spacious 3-bedroom flat in a serene GRA setting. Well-maintained compound with 24-hour security, constant water supply, and backup power. Perfect for families.',
    landlord_name: 'Chukwu Ibrahim',
    landlord_phone: '+234 801 234 5678',
    landlord_verified: true,
    landlord_reviews: 12,
    landlord_rating: 4.8,
    verified: true,
    featured: true,
    gallery: [
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    ],
    availability_date: '2026-01-15',
    coordinate_lat: 6.3262,
    coordinate_lng: 8.115,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop',
    price_monthly: 85000,
    price_yearly: 1020000,
    location: 'Kpirikpiri',
    neighborhood: 'Residential',
    property_type: 'Room',
    bedrooms: 1,
    amenities: ['water', 'parking'],
    description:
      'Cozy self-contained room in a residential area. Close to schools and markets. Quiet neighborhood suitable for students or single professionals.',
    landlord_name: 'Ada Okezie',
    landlord_phone: '+234 803 987 6543',
    landlord_verified: false,
    landlord_reviews: 1,
    landlord_rating: null,
    verified: false,
    featured: false,
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    ],
    availability_date: '2026-02-01',
    coordinate_lat: 6.3156,
    coordinate_lng: 8.0988,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop',
    price_monthly: 200000,
    price_yearly: 2400000,
    location: 'Ebonyi State University Area',
    neighborhood: 'Commercial/Residential',
    property_type: 'Duplex',
    bedrooms: 4,
    amenities: ['water', 'generator', 'parking', 'security', 'internet'],
    description:
      'Modern 4-bedroom duplex near EBSU. Built with quality materials, excellent ventilation, and spacious compound. Ideal for businesses or large families.',
    landlord_name: 'Engr. Eze Madu',
    landlord_phone: '+234 805 123 4567',
    landlord_verified: true,
    landlord_reviews: 8,
    landlord_rating: 4.6,
    verified: true,
    featured: true,
    gallery: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    ],
    availability_date: '2026-01-20',
    coordinate_lat: 6.3226,
    coordinate_lng: 8.1138,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop',
    price_monthly: 120000,
    price_yearly: 1440000,
    location: 'Mile 50',
    neighborhood: 'Suburban',
    property_type: 'Self-Contain',
    bedrooms: 2,
    amenities: ['water', 'parking'],
    description:
      'Clean 2-bedroom self-contained apartment. Well-structured, affordable, and peaceful. Good for couples or small families looking for quiet living.',
    landlord_name: 'Obi Nweke',
    landlord_phone: '+234 807 654 3210',
    landlord_verified: true,
    landlord_reviews: 5,
    landlord_rating: 4.4,
    verified: true,
    featured: false,
    gallery: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    ],
    availability_date: '2026-01-10',
    coordinate_lat: 6.3189,
    coordinate_lng: 8.1098,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop',
    price_monthly: 250000,
    price_yearly: 3000000,
    location: 'Onueke',
    neighborhood: 'Premium Residential',
    property_type: 'Bungalow',
    bedrooms: 5,
    amenities: ['water', 'generator', 'parking', 'security', 'internet', 'garden'],
    description:
      'Magnificent 5-bedroom bungalow with expansive courtyard. Premium finishes, garden space, and backup power. Perfect for executives or families.',
    landlord_name: 'Chief Nwosu',
    landlord_phone: '+234 802 111 2222',
    landlord_verified: true,
    landlord_reviews: 15,
    landlord_rating: 4.9,
    verified: true,
    featured: true,
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    ],
    availability_date: '2026-02-15',
    coordinate_lat: 6.3045,
    coordinate_lng: 8.1203,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1493857672505-493967f7ea8f?w=500&h=300&fit=crop',
    price_monthly: 95000,
    price_yearly: 1140000,
    location: 'Afikpo',
    neighborhood: 'Town Center',
    property_type: 'Room',
    bedrooms: 1,
    amenities: ['water', 'parking'],
    description:
      'Affordable room close to Afikpo town center. Convenient access to shops, hospitals, and public transport. Suitable for business travelers.',
    landlord_name: 'Mrs. Chinwe Ugwu',
    landlord_phone: '+234 809 555 6666',
    landlord_verified: false,
    landlord_reviews: 3,
    landlord_rating: 4.2,
    verified: false,
    featured: false,
    gallery: [
      'https://images.unsplash.com/photo-1493857672505-493967f7ea8f?w=800&h=600&fit=crop',
    ],
    availability_date: '2026-01-25',
    coordinate_lat: 6.3242,
    coordinate_lng: 8.1152,
  },
]

export const PROPERTY_TYPES = ['Room', 'Self-Contain', 'Flat', 'Duplex', 'Bungalow', 'Mansion']

export const AMENITIES = [
  { id: 'water', label: 'Water', icon: 'Droplet' },
  { id: 'generator', label: 'Generator', icon: 'Zap' },
  { id: 'parking', label: 'Parking', icon: 'ParkingCircle' },
  { id: 'security', label: '24hr Security', icon: 'Shield' },
  { id: 'internet', label: 'Internet', icon: 'Wifi' },
  { id: 'garden', label: 'Garden/Yard', icon: 'Leaf' },
]
