import { CheckCircle } from 'lucide-react'

export function VerifiedBadge() {
  return (
    <div className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
      <CheckCircle size={14} />
      Verified
    </div>
  )
}

export function FeaturedBadge() {
  return (
    <div
      style={{
        backgroundColor: 'var(--featured)',
        color: 'white',
      }}
      className="px-3 py-1 rounded-full text-xs font-semibold"
    >
      Featured
    </div>
  )
}
