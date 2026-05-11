'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Subscriber } from '@/types';

interface SubscribersTableProps {
  subscribers: Subscriber[];
  projectId: string;
  onDelete?: (id: string) => void;
}

export function SubscribersTable({
  subscribers,
  projectId,
  onDelete,
}: SubscribersTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Remove this subscriber?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/projects/${projectId}/subscribers?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok && onDelete) {
        onDelete(id);
      }
    } finally {
      setDeleting(null);
    }
  }

  async function handleExport() {
    window.open(`/api/projects/${projectId}/export`, '_blank');
  }

  if (subscribers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">No subscribers yet. Share your waitlist link to start collecting emails.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
        </p>
        <Button variant="secondary" size="sm" onClick={handleExport}>
          Export CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Referral Code</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Referrals</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Joined</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscribers.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">{sub.email}</td>
                <td className="py-3 px-4 text-gray-500 font-mono text-xs">
                  {sub.referral_code}
                </td>
                <td className="py-3 px-4 text-gray-500">{sub.referral_count}</td>
                <td className="py-3 px-4 text-gray-500">
                  {formatDate(sub.created_at)}
                </td>
                <td className="py-3 px-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(sub.id)}
                    disabled={deleting === sub.id}
                  >
                    {deleting === sub.id ? '...' : 'Remove'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
