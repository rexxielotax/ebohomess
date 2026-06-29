'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      const { data } = await supabase
        .from('listings')
        .select('id, title, price_monthly, property_type, bedrooms, location_text, availability_date')
        .eq('landlord_id', user.id)
        .order('id', { ascending: false });
      setListings(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    await supabase.from('listings').delete().eq('id', id);
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0 }}>My Dashboard</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0' }}>{user?.email}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/list-property"
            style={{ padding: '10px 20px', background: '#16a34a', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>
            + Add Listing
          </Link>
          <button onClick={handleLogout}
            style={{ padding: '10px 20px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
            Logout
          </button>
        </div>
      </div>

      <h2>My Listings ({listings.length})</h2>

      {listings.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
          <p>You have no listings yet.</p>
          <Link href="/list-property" style={{ color: '#16a34a' }}>Add your first listing →</Link>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {listings.map((listing) => (
          <div key={listing.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: 16 }}>
              <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>{listing.title}</h3>
              <p style={{ margin: '0 0 4px', color: '#6b7280', fontSize: 14 }}>{listing.location_text}</p>
              <p style={{ margin: '0 0 12px', fontWeight: 'bold', color: '#16a34a' }}>₦{listing.price_monthly?.toLocaleString()}/month</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {listing.property_type && <span style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{listing.property_type}</span>}
                {listing.bedrooms && <span style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{listing.bedrooms} bed</span>}
              </div>
           <div style={{ display: 'flex', gap: 8 }}>
                <Link href={'/listing/${listing.id}'}
                  style={{ flex: 1, padding: '8px 0', background: '#f3f4f6', borderRadius: 8, textAlign: 'center', textDecoration: 'none', color: '#000', fontSize: 14 }}>
                  View
                </Link>
                <Link href={'/dashboard/edit/${listing.id}'}
                  style={{ flex: 1, padding: '8px 0', background: '#dbeafe', borderRadius: 8, textAlign: 'center', textDecoration: 'none', color: '#1d4ed8', fontSize: 14 }}>
                  Edit
                </Link>
                <button onClick={() => handleDelete(listing.id)}
                  style={{ flex: 1, padding: '8px 0', background: '#fee2e2', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#dc2626', fontSize: 14 }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}