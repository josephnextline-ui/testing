import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/projects/[projectId]/export - CSV export
export async function GET(
  _request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', params.projectId)
    .eq('user_id', user.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('project_id', params.projectId)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Build CSV
  const headers = ['email', 'referral_code', 'referred_by', 'referral_count', 'signed_up_at'];
  const rows = (subscribers || []).map((s) => [
    s.email,
    s.referral_code,
    s.referred_by || '',
    s.referral_count.toString(),
    new Date(s.created_at).toISOString(),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const filename = `${project.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-subscribers.csv`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
