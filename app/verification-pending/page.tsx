'use client';
import Link from 'next/link';

export default function VerificationPendingPage() {
  return (
    <div style={{ maxWidth: 500, margin: '80px auto', padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>⏳</div>
      <h1 style={{ marginBottom: 8 }}>Verification Pending</h1>
      <p style={{ color: '#6b7280', marginBottom: 8 }}>
        Your ownership document has been submitted and is currently under review.
      </p>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        This usually takes up to <strong>2 business days</strong>. You will receive an email once your account is approved.
      </p>
      <Link href="/" style={{ color: '#16a34a', fontWeight: 'bold' }}>
        Browse listings while you wait →
      </Link>
    </div>
  );
}