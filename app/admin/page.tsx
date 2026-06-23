'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [landlords, setLandlords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.push('/');
        return;
      }
      setAuthorized(true);
      fetchPendingLandlords();
    };
    init();
  }, []);

  const fetchPendingLandlords = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'landlord')
      .order('created_at', { ascending: false });
    setLandlords(data || []);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    await supabase
      .from('profiles')
      .update({ verification_status: 'approved', verified: true })
      .eq('id', id);
    setLandlords((prev) =>
      prev.map((l) => l.id === id ? { ...l, verification_status: 'approved', verified: true } : l)
    );
  };

  const handleReject = async (id: string) => {
    await supabase
      .from('profiles')
      .update({ verification_status: 'rejected', verified: false })
      .eq('id', id);
    setLandlords((prev) =>
      prev.map((l) => l.id === id ? { ...l, verification_status: 'rejected' } : l)
    );
  };

  if (!authorized) return null;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>🛡️ EboHomes Admin</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>Landlord verification requests</p>

      {loading ? (
        <p>Loading...</p>
      ) : landlords.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No landlords found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {landlords.map((landlord) => (
            <div key={landlord.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px' }}>{landlord.full_name || 'No name'}</h3>
                  <p style={{ margin: '0 0 4px', color: '#6b7280', fontSize: 14 }}>{landlord.phone || 'No phone'}</p>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 'bold',
                    background: landlord.verification_status === 'approved' ? '#f0fdf4' :
                      landlord.verification_status === 'rejected' ? '#fef2f2' : '#fefce8',
                    color: landlord.verification_status === 'approved' ? '#16a34a' :
                      landlord.verification_status === 'rejected' ? '#dc2626' : '#ca8a04'
                  }}>
                    {landlord.verification_status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {landlord.ownership_doc_url && (
                    <a
                      href={landlord.ownership_doc_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: '8px 16px', background: '#f3f4f6', borderRadius: 8, textDecoration: 'none', color: '#000', fontSize: 14 }}
                    >
                      📄 View Doc
                    </a>
                  )}
                  {landlord.verification_status !== 'approved' && (
                    <button
                      onClick={() => handleApprove(landlord.id)}
                      style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}
                    >
                      ✅ Approve
                    </button>
                  )}
                  {landlord.verification_status !== 'rejected' && (
                    <button
                      onClick={() => handleReject(landlord.id)}
                      style={{ padding: '8px 16px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}
                    >
                      ❌ Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}