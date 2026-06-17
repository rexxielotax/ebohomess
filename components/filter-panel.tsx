'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { PROPERTY_TYPES, AMENITIES } from '@/lib/mock-data'
import { Button } from './ui/button'

export interface Filters {
  minPrice: number
  maxPrice: number
  propertyType: string[]
  bedrooms: number[]
  amenities: string[]
}

interface FilterPanelProps {
  onApply: (filters: Filters) => void
  activeFilterCount?: number
}

export function FilterPanel({ onApply, activeFilterCount = 0 }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 300000,
    propertyType: [],
    bedrooms: [],
    amenities: [],
  })

  const handleApply = () => {
    onApply(filters)
    setIsOpen(false)
  }

  const handleReset = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 300000,
      propertyType: [],
      bedrooms: [],
      amenities: [],
    })
    onApply({
      minPrice: 0,
      maxPrice: 300000,
      propertyType: [],
      bedrooms: [],
      amenities: [],
    })
    setIsOpen(false)
  }

  const togglePropertyType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      propertyType: prev.propertyType.includes(type)
        ? prev.propertyType.filter((t) => t !== type)
        : [...prev.propertyType, type],
    }))
  }

  const toggleBedroom = (count: number) => {
    setFilters((prev) => ({
      ...prev,
      bedrooms: prev.bedrooms.includes(count)
        ? prev.bedrooms.filter((b) => b !== count)
        : [...prev.bedrooms, count],
    }))
  }

  const toggleAmenity = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id],
    }))
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 text-foreground hover:bg-secondary transition-colors font-medium"
      >
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full ml-2">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-6 w-80 z-50">
          {/* Price Range */}
          <div className="mb-6">
            <label className="block font-semibold text-foreground mb-3">Price Range (₦/month)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) }))}
                placeholder="Min"
                className="flex-1 bg-input border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground"
              />
              <span className="text-muted-foreground">to</span>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                placeholder="Max"
                className="flex-1 bg-input border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="mb-6">
            <label className="block font-semibold text-foreground mb-3">Property Type</label>
            <select
              value={filters.propertyType[0] || ''}
              onChange={(e) => {
                if (e.target.value) {
                  setFilters((prev) => ({
                    ...prev,
                    propertyType: [e.target.value],
                  }))
                }
              }}
              className="w-full bg-input border border-border rounded px-3 py-2 text-sm text-foreground"
            >
              <option value="">All types</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div className="mb-6">
            <label className="block font-semibold text-foreground mb-3">Bedrooms</label>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5].map((count) => (
                <button
                  key={count}
                  onClick={() => toggleBedroom(count)}
                  className={`px-3 py-1.5 rounded border text-sm font-medium transition-colors ${
                    filters.bedrooms.includes(count)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border text-foreground hover:border-primary'
                  }`}
                >
                  {count}{count === 5 ? '+' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <label className="block font-semibold text-foreground mb-3">Amenities</label>
            <div className="space-y-2">
              {AMENITIES.map((amenity) => (
                <label key={amenity.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm text-foreground">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-secondary"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
