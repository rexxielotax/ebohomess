'use client'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Upload, Check, MapPin } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MapPlaceholder } from '@/components/map-placeholder'
import { PROPERTY_TYPES, AMENITIES } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'

export default function ListPropertyPage() {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [photos, setPhotos] = useState<string[]>([])
  const [formData, setFormData] = useState({
    monthlyRent: '',
    annualRent: '',
    location: '',
    propertyType: '',
    bedrooms: '',
    amenities: [] as string[],
    phoneNumber: '',
    availabilityDate: '',
  })
  const [showMapModal, setShowMapModal] = useState(false)

const [uploading, setUploading] = useState(false)
const [ownershipDoc, setOwnershipDoc] = useState('')
const [docUploading, setDocUploading] = useState(false)
const [docName, setDocName] = useState('')

const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  setDocUploading(true)
  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
  console.log('Cloud name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
  console.log('Upload preset:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
    { method: 'POST', body: data }
  )
  const json = await res.json()
  
  console.log('Cloudinary doc response:', json)
  if (json.secure_url) {
    setOwnershipDoc(json.secure_url)
    setDocName(file.name)
  }
  setDocUploading(false)
}

const removeDoc = () => {
  setOwnershipDoc('')
  setDocName('')
}

const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files
  if (!files) return

  setUploading(true)
  const filesToUpload = Array.from(files).slice(0, 10 - photos.length)

  const uploadedUrls: string[] = []

  for (const file of filesToUpload) {
    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
const res = await fetch(
  `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
  { method: 'POST', body: data }
)
    const json = await res.json()
    if (json.secure_url) {
      uploadedUrls.push(json.secure_url)
    }
  }

  setPhotos([...photos, ...uploadedUrls])
  setUploading(false)
}

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const handleAmenityToggle = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }))
  }

  const handleMonthlyRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const monthly = e.target.value
    setFormData((prev) => ({
      ...prev,
      monthlyRent: monthly,
      annualRent: monthly ? String(Number(monthly) * 12) : '',
    }))
  }
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  console.log('Current user:', userData?.user)
  console.log('User error:', userError)

  if (!userData?.user) {
    alert('You must be logged in to submit a listing. Please log in and try again.')
    return
  }

  const { error } = await supabase.from('listings').insert({
    landlord_id: userData.user.id,
    title: `${formData.bedrooms} bed ${formData.propertyType} in ${formData.location}`,
    price_monthly: Number(formData.monthlyRent),
    location_text: formData.location,
    property_type: formData.propertyType,
    bedrooms: Number(formData.bedrooms),
    amenities: formData.amenities,
    photos: photos,
    ownership_doc_url: ownershipDoc || null,
    contact_info: formData.phoneNumber,
    availability_date: formData.availabilityDate || null,
  })

  if (error) {
    console.error('Listing error:', error)
    alert('Failed to submit listing: ' + error.message)
    return
  }

  setStep('success')
}
  if (step === 'success') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center card-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-primary" />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">Listing Submitted!</h1>

            <p className="text-foreground mb-2">We&apos;ve received your listing.</p>
            <p className="text-muted-foreground mb-8">
              Our team will review it and publish it within 24 hours. You&apos;ll receive a confirmation email shortly.
            </p>

            <Link href="/" className="inline-block">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold w-full">
                Back to Search
              </Button>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-6">
            <ChevronLeft size={20} />
            Back
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">List Your Property</h1>
            <p className="text-muted-foreground">Fill in the details below to get started. It only takes a few minutes.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
                 {/* Ownership Verification Section */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-red-600">Proof of Ownership</h2>
              <p className="text-sm text-muted-foreground">
                Upload a document showing you own or manage this property (land title, C of O, deed, or tenancy agreement). This helps us verify listings and keep EboHomes scam-free.
              </p>

              {ownershipDoc ? (
                <div className="flex items-center justify-between border-2 border-border rounded-lg p-4 bg-secondary">
                  <a
                    href={ownershipDoc}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-foreground truncate flex items-center gap-2"
                  >
                    ✅ {docName || 'Document uploaded'}
                  </a>
                  <button
                    type="button"
                    onClick={removeDoc}
                    className="text-destructive font-bold px-3 py-1 hover:bg-destructive/10 rounded"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-secondary transition-colors">
                  {docUploading ? (
                    <p className="text-sm text-primary">Uploading document...</p>
                  ) : (
                    <p className="font-semibold text-foreground">📄 Click to upload ownership document</p>
                  )}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleDocUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Photos Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Property Photos (up to 10)</h2>

              {/* Upload Area */}
        {photos.length < 10 && (
  <label className="block border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-secondary transition-colors mb-4">
    <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
    <p className="font-semibold text-foreground">Click to upload photos</p>
    <p className="text-sm text-muted-foreground">or drag and drop</p>
    {uploading && <p className="text-sm text-primary mt-2">Uploading photos...</p>}
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handlePhotoUpload}
      className="hidden"
    />
  </label>
)}

              {/* Photo Thumbnails */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                   <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-muted-foreground mt-4">
                {photos.length}/10 photos uploaded
              </p>
            </div>

            {/* Rent Section */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-foreground">Rent Amount</h2>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Monthly Rent (₦) *</label>
                <input
                  type="number"
                  required
                  value={formData.monthlyRent}
                  onChange={handleMonthlyRentChange}
                  placeholder="e.g., 150000"
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Annual Rent (₦) (Optional)</label>
                <input
                  type="number"
                  value={formData.annualRent}
                  onChange={(e) => setFormData((prev) => ({ ...prev, annualRent: e.target.value }))}
                  placeholder="Auto-calculated as monthly × 12"
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-foreground">Location</h2>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Neighborhood/Area *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Abakaliki GRA"
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowMapModal(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-4 text-primary hover:bg-secondary transition-colors font-medium"
              >
                <MapPin size={20} />
                Drop a pin on map
              </button>
            </div>

            {/* Property Details Section */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-foreground">Property Details</h2>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Property Type *</label>
                <select
                  required
                  value={formData.propertyType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, propertyType: e.target.value }))}
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select type</option>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Number of Bedrooms *</label>
                <select
                  required
                  value={formData.bedrooms}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bedrooms: e.target.value }))}
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select bedrooms</option>
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'bedroom' : 'bedrooms'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMENITIES.map((amenity) => (
                  <label key={amenity.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity.id)}
                      onChange={() => handleAmenityToggle(amenity.id)}
                      className="w-4 h-4 rounded border-border accent-primary"
                    />
                    <span className="text-sm font-medium text-foreground">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>

       
            {/* Contact Section */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-foreground">Contact Information</h2>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone Number (Nigerian) *</label>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+234 801 234 5678"
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Availability Date (Optional)</label>
                <input
                  type="date"
                  value={formData.availabilityDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, availabilityDate: e.target.value }))}
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Footer Note */}
            <div className="bg-secondary border border-border rounded-lg p-4">
              <p className="text-sm text-foreground text-center">
                Your listing is <span className="font-semibold">free</span> and will be reviewed before going live.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 text-lg rounded-lg"
            >
              Submit Listing
            </Button>
          </form>
        </div>
      </main>

      <Footer />

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-96 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Drop a pin on map</h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
          <MapPlaceholder
  height="h-80"
  onLocationSelect={(lat, lng) => {
    setFormData((prev) => ({ ...prev, lat, lng }))
  }}
/>
            <div className="p-4 border-t border-border flex gap-3">
              <Button
                onClick={() => setShowMapModal(false)}
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowMapModal(false)}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Confirm Location
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
