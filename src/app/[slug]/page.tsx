import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { WaitlistForm } from '@/components/waitlist/waitlist-form';
import { getAppUrl } from '@/lib/utils';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createAdminClient();
  const { data: project } = await supabase
    .from('projects')
    .select('title, description')
    .eq('slug', params.slug)
    .eq('status', 'active')
    .single();

  if (!project) return { title: 'Not Found' };

  return {
    title: project.title,
    description: project.description || `Join the waitlist for ${project.title}`,
  };
}

export default async function WaitlistPage({ params }: Props) {
  const supabase = createAdminClient();

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'active')
    .single();

  if (!project) notFound();

  // Get subscriber count for social proof
  const { count } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', project.id);

  const subscriberCount = count || 0;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ backgroundColor: project.bg_color }}
    >
      <div className="w-full max-w-lg text-center space-y-8">
        {/* Logo */}
        {project.logo_url ? (
          <img
            src={project.logo_url}
            alt={project.name}
            className="w-16 h-16 mx-auto rounded-xl object-cover"
          />
        ) : (
          <div
            className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center text-white font-bold text-2xl"
            style={{ backgroundColor: project.primary_color }}
          >
            {project.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Title & Description */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {project.title}
          </h1>
          {project.description && (
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Signup Form */}
        <WaitlistForm
          projectId={project.id}
          primaryColor={project.primary_color}
          appUrl={getAppUrl()}
          slug={project.slug}
        />

        {/* Social Proof */}
        {subscriberCount > 0 && (
          <p className="text-sm text-gray-400">
            {subscriberCount.toLocaleString()} {subscriberCount === 1 ? 'person has' : 'people have'} already joined
          </p>
        )}

        {/* Powered By */}
        <p className="text-xs text-gray-300">
          Powered by{' '}
          <a
            href={getAppUrl()}
            className="underline hover:text-gray-400 transition-colors"
          >
            LaunchBoard
          </a>
        </p>
      </div>
    </div>
  );
}
