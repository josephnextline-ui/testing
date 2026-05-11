import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProjectCard } from '@/components/dashboard/project-card';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch projects with subscriber counts
  const { data: projects } = await supabase
    .from('projects')
    .select('*, subscribers(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const projectsWithCounts = (projects || []).map((p: any) => ({
    ...p,
    subscriber_count: p.subscribers?.[0]?.count ?? 0,
  }));

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Waitlists</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage your waitlist pages
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button>New waitlist</Button>
        </Link>
      </div>

      {projectsWithCounts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
          <svg
            className="w-12 h-12 mx-auto text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No waitlists yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Create your first waitlist to start collecting emails.
          </p>
          <Link href="/dashboard/new" className="mt-6 inline-block">
            <Button>Create waitlist</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectsWithCounts.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
