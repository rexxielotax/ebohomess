'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Dynamically import lottie-react to avoid SSR issues
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

import workerAnimation from '@/public/lottie/walking_office_man.json';
import studentAnimation from '@/public/lottie/man_walking.json';
import houseAnimation from '@/public/lottie/house.json';

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
  const [showPassword, setShowPassword] = useState(false);
  const houseLottieRef = useRef<any>(null);

  // Animation states
  const [phase, setPhase] = useState<'walking' | 'arrived' | 'form'>('walking');
  useEffect(() => {
  if (phase !== 'walking' && houseLottieRef.current) {
    houseLottieRef.current.play();
  }
}, ['phase']);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Characters walk for 2.5s, then arrive, then form pops
    const arriveTimer = setTimeout(() => setPhase('arrived'), 2500);
    const formTimer = setTimeout(() => setPhase('form'), 3300);
    return () => {
      clearTimeout(arriveTimer);
      clearTimeout(formTimer);
    };
  }, []);

  if (!mounted) return null;

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
          role,
          phone,
          verified: false,
          verification_status: role === 'landlord' ? 'pending' : 'approved',
          ownership_doc_url: ownershipDoc || null,
        });
        setMessage(
          role === 'tenant'
            ? 'Account created! You can now log in.'
            : 'Account created! Please log in to complete verification.'
        );
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        const { data: userData } = await supabase.auth.getUser();
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, verification_status')
          .eq('id', userData?.user?.id)
          .single();

        if (profile?.role === 'tenant') {
          router.push('/');
        } else if (profile?.role === 'landlord') {
          router.push(
            profile?.verification_status === 'approved' ? '/dashboard' : '/verification-pending'
          );
        } else {
          router.push('/');
        }
      }
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background circles */}
      <div style={{ position: 'absolute', top: '8%', left: '4%', width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      <div style={{ position: 'absolute', bottom: '12%', right: '6%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ position: 'absolute', top: '40%', right: '3%', width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

      {/* ── SCENE: two characters + house ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 700,
          marginBottom: phase === 'form' ? 8 : 0,
          position: 'relative',
          height: 200,
        }}
      >
        {/* STUDENT — walks in from the LEFT */}
        <div
          style={{
            position: 'absolute',
            left: phase === 'walking' ? '-10%' : '22%',
            bottom: 0,
            width: 140,
            transition: 'left 2.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: 'scaleX(1)', // faces right naturally
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
           zIndex: 5,
          }}
        >
          <Lottie
            animationData={studentAnimation}
            loop={phase === 'walking'}
            autoplay
            style={{ width: 140, height: 140 }}
          />
          <p style={{ textAlign: 'center', color: '#eef1f0', fontSize: 20, fontWeight: 1000, marginTop: -10, position: 'relative', zIndex: 6 }}>
            🎓 students
          </p>
        </div>

      {/* HOUSE — center */}
<div
  style={{
    position: 'relative',
    zIndex: 2,
    opacity: phase === 'walking' ? 0.6 : 1,
    transform: phase === 'arrived' ? 'scale(1.06)' : phase === 'form' ? 'scale(1)' : 'scale(0.95)',
    transition: 'all 0.6s ease',
    filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.25))',
  }}
>
  <Lottie
    lottieRef={houseLottieRef}
    animationData={houseAnimation}
    loop={true}
    autoplay={true}
    style={{ width: 180, height: 180, display: 'block' }}
  />
  <p style={{ textAlign: 'center', color: 'white', fontSize: 13, fontWeight: 900, marginTop: -16, letterSpacing: '-0.3px' }}>
    EboHomes
  </p>
</div>
        {/* OFFICE WORKER — walks in from the RIGHT, flipped to face left */}
        <div
          style={{
            position: 'absolute',
            right: phase === 'walking' ? '-10%' : '22%',
            bottom: 0,
            width: 140,
            transition: 'right 2.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: 'scaleX(-1)', // flip so he faces left (toward house)
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          }}
        >
          <Lottie
            animationData={workerAnimation}
            loop={phase === 'walking'}
            autoplay
            style={{ width: 140, height: 140 }}
          />
          {/* Label is also flipped back so text reads correctly */}
          <p style={{ textAlign: 'center', color: '#eef1f0', fontSize: 20, fontWeight: 1000, marginTop: -10, transform: 'scaleX(-1)', position: 'relative', zIndex: 6 }}>
            workers
          </p>
        </div>
      </div>

      {/* ── FORM — pops up once characters arrive ── */}
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          opacity: phase === 'form' ? 1 : 0,
          transform: phase === 'form' ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.96)',
          transition: 'all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
          background: 'white',
          borderRadius: 20,
          padding: '28px 24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          pointerEvents: phase === 'form' ? 'auto' : 'none',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: 4, fontSize: 20, fontWeight: 800, color: '#15803d' }}>
          {isSignup ? '👋 Create Account' : '🏠 Login to EboHomes'}
        </h1>
        <p style={{ textAlign: 'center', color: '#1d1f24', marginBottom: 20, fontSize: 12 }}>
         your trusted market place to discover to discover,rent and manage properties in ebonyi state
        </p>

        {isSignup && (
          <>
            <label style={labelStyle}>Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" style={inputStyle} />

            <label style={labelStyle}>I am a</label>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {['tenant', 'landlord'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{
                    flex: 1, padding: '10px 8px', borderRadius: 10,
                    border: `2px solid ${role === r ? '#16a34a' : '#e5e7eb'}`,
                    background: role === r ? '#f0fdf4' : '#fff',
                    color: role === r ? '#16a34a' : '#374151',
                    fontWeight: 700, cursor: 'pointer', fontSize: 13,
                    transition: 'all 0.2s',
                  }}
                >
                  {r === 'tenant' ? '🔍search for a house' : '🏠list your property'}
                  <p style={{ fontSize: 10, fontWeight: 400, margin: '2px 0 0', color: '#9ca3af' }}>
                    {r === 'tenant' ? 'in search for a property' : 'own a property to list for rent'}
                  </p>
                </button>
              ))}
            </div>

            <label style={labelStyle}>Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 801 234 5678" style={inputStyle} />

            {role === 'property owner' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ ...labelStyle, display: 'block', marginBottom: 6 }}>Proof of Ownership</label>
                <label style={{ display: 'block', border: '2px dashed #16a34a', borderRadius: 10, padding: 12, textAlign: 'center', cursor: 'pointer', background: ownershipDoc ? '#f0fdf4' : '#fafafa' }}>
                  {docUploading ? (
                    <span style={{ color: '#16a34a', fontSize: 13 }}>Uploading...</span>
                  ) : ownershipDoc ? (
                    <span style={{ color: '#16a34a', fontSize: 13 }}>✅ Document uploaded</span>
                  ) : (
                    <span style={{ fontSize: 13, color: '#6b7280' }}>📄 upload ownership/authorization document</span>
                  )}
                  <input type="file" accept="image/*,application/pdf" onChange={handleDocUpload} style={{ display: 'none' }} />
                </label>
              </div>
            )}
          </>
        )}

        <label style={labelStyle}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />

        <label style={labelStyle}>Password</label>
        <div style={{ position: 'relative', marginBottom: 18 }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ ...inputStyle, marginBottom: 0, paddingRight: 44 }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#6b7280', padding: 0 }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {message && (
          <p style={{ color: message.includes('created') ? '#16a34a' : '#dc2626', marginBottom: 12, fontSize: 13, textAlign: 'center' }}>
            {message}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: 13,
            background: loading ? '#86efac' : 'linear-gradient(135deg, #16a34a, #15803d)',
            color: '#fff', border: 'none', borderRadius: 10,
            fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 15px rgba(22,163,74,0.4)',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Login'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: '#6b7280' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button
            style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontWeight: 700, marginLeft: 4, fontSize: 13 }}
            onClick={() => { setIsSignup(!isSignup); setMessage(''); }}
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 13,
  color: '#374151',
  display: 'block',
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  marginBottom: 12,
  padding: '11px 14px',
  borderRadius: 10,
  border: '1.5px solid #e5e7eb',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
};
