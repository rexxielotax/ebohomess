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
  const [role, setRole] = useState('landlord');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
      } else {
        setMessage('Account created! Check your email to confirm, then log in.');
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
          router.push('/list-property');
        } else {
          router.push('/dashboard');
        }
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24, border: '1px solid #e5e7eb', borderRadius: 12 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>
        {isSignup ? 'Create Account' : 'Login to EboHomes'}
      </h1>

      {isSignup && (
        <>
          <label>Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <label>I am a</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
          >
            <option value="landlord">Landlord</option>
            <option value="tenant">Tenant</option>
          </select>
        </>
      )}

      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        style={{ width: '100%', marginBottom: 20, padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
      />

      {message && (
        <p style={{ color: message.includes('created') ? '#16a34a' : 'red', marginBottom: 12, fontSize: 14 }}>
          {message}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: '100%', padding: 14, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}
      >
        {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Login'}
      </button>

      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
        {isSignup ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={() => { setIsSignup(!isSignup); setMessage(''); }}
          style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontWeight: 'bold', marginLeft: 4 }}
        >
          {isSignup ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}