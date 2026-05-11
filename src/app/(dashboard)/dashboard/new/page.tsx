'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateSlug } from '@/lib/utils';

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          title: title || name,
          description,
          primary_color: primaryColor,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      router.push(`/dashboard/${data.id}`);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Create a waitlist</h1>
      <p className="mt-1 text-sm text-gray-500">
        Set up your waitlist page in seconds.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input
          id="name"
          label="Project name"
          placeholder="My Awesome Product"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
        />

        <Input
          id="slug"
          label="URL slug"
          placeholder="my-awesome-product"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
          required
        />
        <p className="text-xs text-gray-400 -mt-3">
          Your page will be at: launchboard.app/{slug || 'your-slug'}
        </p>

        <Input
          id="title"
          label="Page title"
          placeholder="Something amazing is coming"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="space-y-1.5">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="input-field resize-none"
            placeholder="Tell visitors what you're building..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Brand color
          </label>
          <div className="flex items-center gap-3">
            <input
              id="color"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
            <span className="text-sm text-gray-500">{primaryColor}</span>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create waitlist'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
