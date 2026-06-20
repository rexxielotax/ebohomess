'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      const { data } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();
      setListing(data);
      setLoading(false);
    };
    if (id) fetchListing();
  }, [id]);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!listing) return <div style={{ padding: 40 }}>Listing not found.</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <a href="/search" style={{ color: '#16a34a', textDecoration: 'none', fontSize: 14 }}>← Back to Search</a>

      {listing.photos?.length > 0 ? (
        <div style={{ marginTop: 16 }}>
          <img src={listing.photos[currentPhoto]} alt="photo" style={{ width: '100%', height: 380, objectFit: 'cover', borderRadius: 12 }} />
          {listing.photos.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8, overflowX: 'auto' }}>
              {listing.photos.map((url: string, i: number) => (
                <img key={i} src={url} alt="thumb" onClick={() => setCurrentPhoto(i)}
                  style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: i === currentPhoto ? '2px solid #16a34a' : 'none' }} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ width: '100%', height: 380, background: '#f3f4f6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', marginTop: 16 }}>No Photos</div>
      )}

      <div style={{ marginTop: 24 }}>
        <h1 style={{ margin: '0 0 8px' }}>{listing.title}</h1>
        <p style={{ color: '#6b7280', margin: '0 0 8px' }}>📍 {listing.location_text}</p>
        <p style={{ fontSize: 24, fontWeight: 'bold', color: '#16a34a', margin: '0 0 16px' }}>₦{listing.price_monthly?.toLocaleString()}/month</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          {listing.property_type && <span style={{ background: '#f3f4f6', padding: '4px 12px', borderRadius: 20, fontSize: 14 }}>{listing.property_type}</span>}
          {listing.bedrooms && <span style={{ background: '#f3f4f6', padding: '4px 12px', borderRadius: 20, fontSize: 14 }}>{listing.bedrooms} Bedrooms</span>}
          {listing.availability_date && <span style={{ background: '#dcfce7', padding: '4px 12px', borderRadius: 20, fontSize: 14 }}>Available: {listing.availability_date}</span>}
        </div>

        {listing.description && (
          <div style={{ marginBottom: 16 }}>
            <h3>Description</h3>
            <p style={{ color: '#374151', lineHeight: 1.6 }}>{listing.description}</p>
          </div>
        )}

        {listing.amenities?.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3>Amenities</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {listing.amenities.map((a: string) => (
                <span key={a} style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: 20, fontSize: 14 }}>✓ {a}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ background: '#f9fafb', borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 12px' }}>Contact Landlord</h3>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 16px' }}>Interested in this property? Contact the landlord directly.</p>
          <a href={`tel:${listing.contact_phone}`}
            style={{ display: 'block', width: '100%', padding: 14, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}>
            📞 Call Landlord
          </a>
          <button
            onClick={() => {
              const text = `Hi, I found your listing on EboHomes: ${listing.title} in ${listing.location_text}. Is it still available?`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
            }}
            style={{ display: 'block', width: '100%', padding: 14, background: '#25d366', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', marginTop: 8 }}>
            💬 WhatsApp Landlord
          </button>
        </div>
      </div>
    </div>
  );
}