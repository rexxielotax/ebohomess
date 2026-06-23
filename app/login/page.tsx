'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('tenant');
  const [phone, setPhone] = useState('');
  const [ownershipDoc, setOwnershipDoc] = useState('');
  const [docUploading, setDocUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      { method: 'POST', body: data }
    );
    const json = await res.json();
console.log('Cloudinary response:', json);
if (json.secure_url) setOwnershipDoc(json.secure_url);
    if (json.secure_url) setOwnershipDoc(json.secure_url);
    setDocUploading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } },
      });

      if (error) {
        setMessage(error.message);
      } else if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          role: role,
          phone: phone,
          verified: false,
          verification_status: role === 'landlord' ? 'pending' : 'approved',
          ownership_doc_url: ownershipDoc || null,
        });

        if (role === 'tenant') {
          setMessage('Account created! You can now log in.');
        } else {
          setMessage('Account created! Please log in to complete verification.');
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage(error.message);
      } else {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;

        const { data: profile } = await supabase
          .from('profiles')
          .select('role, verification_status')
          .eq('id', userId)
          .single();

        if (profile?.role === 'tenant') {
          router.push('/');
        } else if (profile?.role === 'landlord') {
          if (profile?.verification_status === 'approved') {
            router.push('/list-property');
          } else {
            router.push('/verification-pending');
          }
        } else {
          router.push('/');
        }
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24, border: '1px solid #e5e7eb', borderRadius: 12 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 8 }}>
        {isSignup ? 'Create Account' : 'Login to EboHomes'}
      </h1>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 24, fontSize: 14 }}>
        Connecting landlords and tenants across Ebonyi State
      </p>

      {isSignup && (
        <>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ccc', boxSizing: 'border-box' }}
          />

          <label style={{ fontWeight: 'bold', fontSize: 14 }}>I am a</label>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => setRole('tenant')}
              style={{
                flex: 1, padding: 14, borderRadius: 8, border: `2px solid ${role === 'tenant' ? '#16a34a' : '#e5e7eb'}`,
                background: role === 'tenant' ? '#f0fdf4' : '#fff',
                color: role === 'tenant' ? '#16a34a' : '#374151',
                fontWeight: 'bold', cursor: 'pointer', fontSize: 14
              }}
            >
              🔍 Tenant
              <p style={{ fontSize: 11, fontWeight: 'normal', margin: '4px 0 0', color: '#6b7280' }}>Looking for a house</p>
            </button>
            <button
              type="button"
              onClick={() => setRole('landlord')}
              style={{
                flex: 1, padding: 14, borderRadius: 8, border: `2px solid ${role === 'landlord' ? '#16a34a' : '#e5e7eb'}`,
                background: role === 'landlord' ? '#f0fdf4' : '#fff',
                color: role === 'landlord' ? '#16a34a' : '#374151',
                fontWeight: 'bold', cursor: 'pointer', fontSize: 14
              }}
            >
              🏠 Landlord
              <p style={{ fontSize: 11, fontWeight: 'normal', margin: '4px 0 0', color: '#6b7280' }}>I have a property</p>
            </button>
          </div>

          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 801 234 5678"
            style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ccc', boxSizing: 'border-box' }}
          />

          {role === 'landlord' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 'bold', fontSize: 14, display: 'block', marginBottom: 6 }}>
                Proof of Ownership Document
              </label>
              <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
                Upload land title, C of O, deed, or tenancy agreement
              </p>
              <label style={{ display: 'block', border: '2px dashed #e5e7eb', borderRadius: 8, padding: 16, textAlign: 'center', cursor: 'pointer' }}>
                {docUploading ? (
                  <span style={{ color: '#16a34a', fontSize: 14 }}>Uploading...</span>
                ) : ownershipDoc ? (
                  <span style={{ color: '#16a34a', fontSize: 14 }}>✅ Document uploaded</span>
                ) : (
                  <span style={{ fontSize: 14 }}>📄 Click to upload ownership document</span>
                )}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleDocUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          )}
        </>
      )}

      <label style={{ fontWeight: 'bold', fontSize: 14 }}>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ccc', boxSizing: 'border-box' }}
      />

      <label style={{ fontWeight: 'bold', fontSize: 14 }}>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        style={{ width: '100%', marginBottom: 20, padding: 10, borderRadius: 8, border: '1px solid #ccc', boxSizing: 'border-box' }}
      />

      {message && (
        <p style={{ color: message.includes('created') ? '#16a34a' : 'red', marginBottom: 12, fontSize: 14 }}>
          {message}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: '100%', padding: 14, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Login'}
      </button>

      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
        {isSignup ? 'Already have an account?' : "Don't have an account?"}
        <button
          style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontWeight: 'bold', marginLeft: 4 }}
          onClick={() => { setIsSignup(!isSignup); setMessage(''); }}
        >
          {isSignup ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}