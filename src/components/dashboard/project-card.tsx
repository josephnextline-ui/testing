import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/dashboard/${project.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-brand-200 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {project.logo_url ? (
            <img
              src={project.logo_url}
              alt={project.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: project.primary_color }}
            >
              {project.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-500">/{project.slug}</p>
          </div>
        </div>
        <Badge variant={project.status === 'active' ? 'success' : 'warning'}>
          {project.status}
        </Badge>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <span>{project.subscriber_count ?? 0} subscribers</span>
        </div>
        <span className="text-xs text-gray-400">
          {formatDate(project.created_at)}
        </span>
      </div>
    </Link>
  );
}
