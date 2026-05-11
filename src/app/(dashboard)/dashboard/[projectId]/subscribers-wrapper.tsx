'use client';

import { useState } from 'react';
import { SubscribersTable } from '@/components/dashboard/subscribers-table';
import type { Subscriber } from '@/types';

interface Props {
  initialSubscribers: Subscriber[];
  projectId: string;
}

export function SubscribersTableWrapper({ initialSubscribers, projectId }: Props) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);

  function handleDelete(id: string) {
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <SubscribersTable
      subscribers={subscribers}
      projectId={projectId}
      onDelete={handleDelete}
    />
  );
}
