'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Search, MoreVertical, Eye, MessageSquare, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

const TABS = ['All', 'Published', 'Pending', 'Draft', 'Expired']

export default function MyListingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      const { data } = await supabase
        .from('listings')
        .select('*')
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false })
      setListings(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this listing?')) return
    await supabase.from('listings').update({ status: 'deactivated' }).eq('id', id)
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'deactivated' } : l)))
    setOpenMenu(null)
  }

  const filtered = listings.filter((l) => {
    const matchesSearch = l.title?.toLowerCase().includes(search.toLowerCase())
    const matchesTab =
      activeTab === 'All'
        ? true
        : activeTab === 'Published'
        ? l.status === 'approved'
        : activeTab === 'Pending'
        ? l.status === 'pending'
        : activeTab === 'Draft'
        ? l.status === 'draft'
        : l.status === 'expired'
    return matchesSearch && matchesTab
  })

  const counts = {
    All: listings.length,
    Published: listings.filter((l) => l.status === 'approved').length,
    Pending: listings.filter((l) => l.status === 'pending').length,
    Draft: listings.filter((l) => l.status === 'draft').length,
    Expired: listings.filter((l) => l.status === 'expired').length,
  }

  const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0)

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      approved: 'bg-primary/10 text-primary',
      pending: 'bg-featured/10 text-featured',
      draft: 'bg-secondary text-muted-foreground',
      expired: 'bg-destructive/10 text-destructive',
    }
    const label: Record<string, string> = {
      approved: 'Published',
      pending: 'Pending Review',
      draft: 'Draft',
      expired: 'Expired',
    }
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || 'bg-secondary text-muted-foreground'}`}>
        {label[status] || status}
      </span>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Listings</h1>
          <p className="text-sm text-muted-foreground">Manage, edit and track the performance of your properties.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Link href="/list-property">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-1.5">
              <Plus size={16} /> Add New Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab} ({counts[tab as keyof typeof counts]})
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total Listings', value: counts.All, sub: 'All your properties' },
          { label: 'Published', value: counts.Published, sub: 'Live on platform' },
          { label: 'Pending', value: counts.Pending, sub: 'Awaiting review' },
          { label: 'Draft', value: counts.Draft, sub: 'Not published' },
          { label: 'Total Views', value: totalViews.toLocaleString(), sub: 'This month' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs font-medium text-foreground">{stat.label}</p>
            <p className="text-[11px] text-muted-foreground">{stat.sub}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg h-40 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground mb-4">
            {listings.length === 0 ? 'You have no listings yet.' : 'No listings match your filters.'}
          </p>
          <Link href="/list-property" className="text-primary font-semibold hover:underline">
            Add your first listing →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((listing) => (
            <div key={listing.id} className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4">
              <img
                src={listing.photos?.[0] || ''}
                alt={listing.title}
                className="w-full sm:w-40 h-32 object-cover rounded-lg bg-secondary shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  {statusBadge(listing.status)}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === listing.id ? null : listing.id)}
                      className="p-1 rounded hover:bg-secondary text-muted-foreground"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openMenu === listing.id && (
                      <div className="absolute right-0 top-8 z-10 bg-card border border-border rounded-lg shadow-lg py-1 w-40">
                        <Link href={`/listing/${listing.id}`} className="block px-3 py-2 text-sm text-foreground hover:bg-secondary">
                          View Listing
                        </Link>
                        <Link href={`/dashboard/edit/${listing.id}`} className="block px-3 py-2 text-sm text-foreground hover:bg-secondary">
                          Edit Listing
                        </Link>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="block w-full text-left px-3 py-2 text-sm text-destructive hover:bg-secondary"
                        >
                          Deactivate
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-foreground truncate">{listing.title}</h3>
                <p className="text-xs text-muted-foreground mb-1">{listing.location_text}</p>
                <p className="text-primary font-bold text-sm mb-2">₦{listing.price_monthly?.toLocaleString()} / month</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye size={13} /> {listing.views || 0} Views</span>
                  <span className="flex items-center gap-1"><MessageSquare size={13} /> {listing.inquiries || 0} Inquiries</span>
                  <span className="flex items-center gap-1"><Calendar size={13} /> {listing.bookings || 0} Bookings</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}