'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [landlords, setLandlords] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'landlords' | 'listings'>('landlords');

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.push('/');
        return;
      }
      setAuthorized(true);
      fetchData();
    };
    init();
  }, []);

  const fetchData = async () => {
    const { data: landlordData } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'landlord')
      .order('created_at', { ascending: false });

    const { data: listingData } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    setLandlords(landlordData || []);
    setListings(listingData || []);
    setLoading(false);
  };

 const handleApproveLandlord = async (id: string) => {
  await supabase
    .from('profiles')
    .update({ verification_status: 'approved', verified: true })
    .eq('id', id);
  setLandlords((prev) =>
    prev.map((l) => l.id === id ? { ...l, verification_status: 'approved', verified: true } : l)
  );
};

const handleGrantBadge = async (id: string) => {
  await supabase
    .from('profiles')
    .update({ badge: 'verified' })
    .eq('id', id);
  setLandlords((prev) =>
    prev.map((l) => l.id === id ? { ...l, badge: 'verified' } : l)
  );
};

  const handleRejectLandlord = async (id: string) => {
    await supabase
      .from('profiles')
      .update({ verification_status: 'rejected', verified: false })
      .eq('id', id);
    setLandlords((prev) =>
      prev.map((l) => l.id === id ? { ...l, verification_status: 'rejected' } : l)
    );
  };
const handleApproveListing = async (id: string) => {
  const { error } = await supabase
    .from('listings')
    .update({ status: 'approved' })
    .eq('id', id);
  
  console.log('Approve listing error:', error);
  
  if (!error) {
    setListings((prev) =>
      prev.map((l) => l.id === id ? { ...l, status: 'approved' } : l)
    );
  }
};

  const handleRejectListing = async (id: string) => {
    await supabase
      .from('listings')
      .update({ status: 'rejected' })
      .eq('id', id);
    setListings((prev) =>
      prev.map((l) => l.id === id ? { ...l, status: 'rejected' } : l)
    );
  };

  if (!authorized) return null;

  const statusBadge = (status: string) => ({
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 'bold' as const,
    background: status === 'approved' ? '#f0fdf4' : status === 'rejected' ? '#fef2f2' : '#fefce8',
    color: status === 'approved' ? '#16a34a' : status === 'rejected' ? '#dc2626' : '#ca8a04',
  });

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>🛡 EboHomes Admin</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab('landlords')}
          style={{
            padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: activeTab === 'landlords' ? '#16a34a' : '#f3f4f6',
            color: activeTab === 'landlords' ? '#fff' : '#000',
            fontWeight: 'bold',
          }}
        >
          Landlords ({landlords.length})
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          style={{
            padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: activeTab === 'listings' ? '#16a34a' : '#f3f4f6',
            color: activeTab === 'listings' ? '#fff' : '#000',
            fontWeight: 'bold',
          }}
        >
          Listings ({listings.length})
        </button>
      </div>

      {loading ? <p>Loading...</p> : (
        <>
          {/* Landlords Tab */}
          {activeTab === 'landlords' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {landlords.length === 0 ? <p style={{ color: '#6b7280' }}>No landlords found.</p> : landlords.map((l) => (
                <div key={l.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px' }}>{l.full_name || 'No name'}</h3>
                      <p style={{ margin: '0 0 4px', color: '#6b7280', fontSize: 14 }}>{l.email || l.phone || 'No contact'}</p>
                      <span style={statusBadge(l.verification_status || 'pending')}>
                        {(l.verification_status || 'pending').toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
  {l.ownership_doc_url && (
    <a href={l.ownership_doc_url} target="_blank" rel="noreferrer"
      style={{ padding: '8px 16px', background: '#f3f4f6', borderRadius: 8, textDecoration: 'none', color: '#000', fontSize: 14 }}>
      📄 View Doc
    </a>
  )}
  {l.verification_status !== 'approved' && (
    <button onClick={() => handleApproveLandlord(l.id)}
      style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
      ✅ Approve
    </button>
  )}
  {l.verification_status !== 'rejected' && (
    <button onClick={() => handleRejectLandlord(l.id)}
      style={{ padding: '8px 16px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
      ❌ Reject
    </button>
  )}
  <button
    onClick={() => handleGrantBadge(l.id)}
    style={{
      padding: '8px 16px',
      background: l.badge === 'verified' ? '#1d4ed8' : '#eff6ff',
      color: l.badge === 'verified' ? '#fff' : '#1d4ed8',
      border: '1px solid #1d4ed8',
      borderRadius: 8,
      cursor: 'pointer',
      fontSize: 14,
      fontWeight: 'bold',
    }}>
    {l.badge === 'verified' ? '🔵 Verified' : '🔵 Grant Badge'}
  </button>
</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {listings.length === 0 ? <p style={{ color: '#6b7280' }}>No listings found.</p> : listings.map((l) => (
                <div key={l.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px' }}>{l.title || 'Untitled listing'}</h3>
                      <p style={{ margin: '0 0 4px', color: '#6b7280', fontSize: 14 }}>{l.location_text} · ₦{l.price_monthly?.toLocaleString()}/mo</p>
                      <span style={statusBadge(l.status || 'pending')}>
                        {(l.status || 'pending').toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {l.photos?.[0] && (
                        <a href={l.photos[0]} target="_blank" rel="noreferrer"
                          style={{ padding: '8px 16px', background: '#f3f4f6', borderRadius: 8, textDecoration: 'none', color: '#000', fontSize: 14 }}>
                          🖼 View Photo
                        </a>
                      )}
                      {l.ownership_doc_url && (
                        <a href={l.ownership_doc_url} target="_blank" rel="noreferrer"
                          style={{ padding: '8px 16px', background: '#f3f4f6', borderRadius: 8, textDecoration: 'none', color: '#000', fontSize: 14 }}>
                          📄 View Doc
                        </a>
                      )}
                      {l.status !== 'approved' && (
                        <button onClick={() => handleApproveListing(l.id)}
                          style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
                          ✅ Approve
                        </button>
                      )}
                      {l.status !== 'rejected' && (
                        <button onClick={() => handleRejectListing(l.id)}
                          style={{ padding: '8px 16px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
                          ❌ Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}