'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SearchPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await supabase
        .from('listings')
        .select('id, title, description, price_monthly, property_type, bedrooms, location_text, photos, amenities')
        .order('id', { ascending: false });
      setListings(data || []);
      setFiltered(data || []);
      setLoading(false);
    };
    fetchListings();
  }, []);

  useEffect(() => {
    let results = listings;
    if (search) results = results.filter((l) => l.title?.toLowerCase().includes(search.toLowerCase()) || l.location_text?.toLowerCase().includes(search.toLowerCase()));
    if (maxPrice) results = results.filter((l) => l.price_monthly <= Number(maxPrice));
    if (propertyType) results = results.filter((l) => l.property_type === propertyType);
    if (bedrooms) results = results.filter((l) => l.bedrooms === Number(bedrooms));
    setFiltered(results);
  }, [search, maxPrice, propertyType, bedrooms, listings]);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Find a Property</h1>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <input
          placeholder="Search by title or area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <input
          placeholder="Max price (₦)"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ width: 150, padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
        >
          <option value="">All Types</option>
          <option value="room">Single Room</option>
          <option value="self-con">Self Contain</option>
          <option value="flat">Flat</option>
          <option value="duplex">Duplex</option>
          <option value="bungalow">Bungalow</option>
        </select>
        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
        >
          <option value="">Any Bedrooms</option>
          <option value="1">1 Bedroom</option>
          <option value="2">2 Bedrooms</option>
          <option value="3">3 Bedrooms</option>
          <option value="4">4+ Bedrooms</option>
        </select>
      </div>

      {loading && <p>Loading listings...</p>}
      {!loading && filtered.length === 0 && <p>No listings found.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {filtered.map((listing) => (
          <Link key={listing.id} href={`/listings/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
              {listing.photos?.[0] ? (
                <img src={listing.photos[0]} alt={listing.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: 180, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>No Photo</div>
              )}
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>{listing.title}</h3>
                <p style={{ margin: '0 0 4px', color: '#6b7280', fontSize: 14 }}>{listing.location_text}</p>
                <p style={{ margin: '0 0 8px', fontWeight: 'bold', color: '#16a34a' }}>₦{listing.price_monthly?.toLocaleString()}/month</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {listing.property_type && <span style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{listing.property_type}</span>}
                  {listing.bedrooms && <span style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{listing.bedrooms} bed</span>}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}