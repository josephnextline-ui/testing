'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface WaitlistFormProps {
  projectId: string;
  primaryColor: string;
  appUrl: string;
  slug: string;
}

function WaitlistFormInner({
  projectId,
  primaryColor,
  appUrl,
  slug,
}: WaitlistFormProps) {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [referralCode, setReferralCode] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          email,
          referredBy: ref || null,
        }),
      });

      const data = await res.json();

      if (!res.ok && !data.already_subscribed) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
        return;
      }

      setStatus('success');
      setMessage(data.message);
      setReferralCode(data.referral_code || '');
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  const referralLink = referralCode
    ? `${appUrl}/${slug}?ref=${referralCode}`
    : '';

  if (status === 'success') {
    return (
      <div className="text-center space-y-4">
        <div
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
          style={{ backgroundColor: primaryColor + '20' }}
        >
          <svg
            className="w-8 h-8"
            style={{ color: primaryColor }}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-900">{message}</p>
        {referralLink && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">
              Share your referral link to move up the list:
            </p>
            <div className="flex items-center gap-2 max-w-md mx-auto">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(referralLink);
                }}
                className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-3 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
        style={{ backgroundColor: primaryColor }}
      >
        {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-red-600 sm:col-span-2">{message}</p>
      )}
    </form>
  );
}

export function WaitlistForm(props: WaitlistFormProps) {
  return (
    <Suspense fallback={<div className="h-12" />}>
      <WaitlistFormInner {...props} />
    </Suspense>
  );
}
