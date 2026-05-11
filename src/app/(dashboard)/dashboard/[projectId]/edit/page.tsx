'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setName(data.name);
        setTitle(data.title);
        setDescription(data.description || '');
        setLogoUrl(data.logo_url || '');
        setPrimaryColor(data.primary_color);
        setBgColor(data.bg_color);
        setStatus(data.status);
      }
      setLoading(false);
    }
    load();
  }, [projectId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          title,
          description,
          logo_url: logoUrl || null,
          primary_color: primaryColor,
          bg_color: bgColor,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save');
      } else {
        router.push(`/dashboard/${projectId}`);
        router.refresh();
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this waitlist and all its subscribers? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Edit waitlist</h1>

      <form onSubmit={handleSave} className="mt-8 space-y-5">
        <Input
          id="name"
          label="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          id="title"
          label="Page title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="space-y-1.5">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="input-field resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Input
          id="logoUrl"
          label="Logo URL (optional)"
          type="url"
          placeholder="https://example.com/logo.png"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Brand color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-500">{primaryColor}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Background color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-500">{bgColor}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </form>
    </div>
  );
}
