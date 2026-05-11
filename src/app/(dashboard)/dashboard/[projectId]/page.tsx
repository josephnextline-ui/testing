import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { SignupChart } from '@/components/dashboard/signup-chart';
import { SubscribersTableWrapper } from './subscribers-wrapper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAppUrl } from '@/lib/utils';
import type { DailySignup } from '@/types';

export default async function ProjectDetailPage({
  params,
}: {
  params: { projectId: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.projectId)
    .eq('user_id', user.id)
    .single();

  if (!project) notFound();

  // Fetch subscribers
  const { data: subscribers } = await supabase
    .from('subscribers')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false });

  const allSubscribers = subscribers || [];

  // Calculate stats
  const total = allSubscribers.length;
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const last7 = allSubscribers.filter(
    (s) => new Date(s.created_at) >= sevenDaysAgo
  ).length;
  const last30 = allSubscribers.filter(
    (s) => new Date(s.created_at) >= thirtyDaysAgo
  ).length;
  const totalReferrals = allSubscribers.reduce(
    (acc, s) => acc + (s.referral_count || 0),
    0
  );

  // Daily signups for chart (last 30 days)
  const dailyMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split('T')[0];
    dailyMap.set(key, 0);
  }
  allSubscribers.forEach((s) => {
    const key = new Date(s.created_at).toISOString().split('T')[0];
    if (dailyMap.has(key)) {
      dailyMap.set(key, (dailyMap.get(key) || 0) + 1);
    }
  });
  const dailySignups: DailySignup[] = Array.from(dailyMap.entries()).map(
    ([date, count]) => ({
      date: date.slice(5), // MM-DD
      count,
    })
  );

  const publicUrl = `${getAppUrl()}/${project.slug}`;

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <Badge
              variant={project.status === 'active' ? 'success' : 'warning'}
            >
              {project.status}
            </Badge>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-600 hover:underline"
            >
              {publicUrl}
            </a>
            <button
              onClick={undefined}
              className="text-xs text-gray-400 hover:text-gray-600"
              title="Copy link"
            >
              Copy
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/${project.id}/edit`}>
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <StatsCards
        stats={[
          { label: 'Total Subscribers', value: total },
          { label: 'Last 7 Days', value: last7 },
          { label: 'Last 30 Days', value: last30 },
          { label: 'Total Referrals', value: totalReferrals },
        ]}
      />

      {/* Chart */}
      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Daily Signups (Last 30 Days)
        </h2>
        <SignupChart data={dailySignups} />
      </div>

      {/* Subscribers Table */}
      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Subscribers
        </h2>
        <SubscribersTableWrapper
          initialSubscribers={allSubscribers}
          projectId={project.id}
        />
      </div>
    </div>
  );
}
