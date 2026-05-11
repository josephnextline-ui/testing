'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('free');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profile) {
          setFullName(profile.full_name || '');
          setPlan(profile.plan || 'free');
        }
      }
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      setMessage('Failed to save. Please try again.');
    } else {
      setMessage('Settings saved.');
    }
    setSaving(false);
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="mt-1 text-sm text-gray-500">Manage your account.</p>

      <form onSubmit={handleSave} className="mt-8 space-y-5">
        <Input
          id="fullName"
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <Input
          id="email"
          label="Email"
          value={email}
          disabled
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Plan</label>
          <div className="flex items-center gap-3">
            <Badge variant={plan === 'pro' ? 'success' : 'default'}>
              {plan === 'pro' ? 'Pro' : 'Free'}
            </Badge>
            {plan === 'free' && (
              <button
                type="button"
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                onClick={() => {
                  // Stripe checkout would go here
                  alert('Stripe checkout coming soon. This is a scaffold.');
                }}
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        {message && (
          <p className={`text-sm px-3 py-2 rounded-lg ${
            message.includes('Failed') ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'
          }`}>
            {message}
          </p>
        )}

        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save settings'}
        </Button>
      </form>
    </div>
  );
}
