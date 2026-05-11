import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/projects/[projectId]/subscribers
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
    .select('id')
    .eq('id', params.projectId)
    .eq('user_id', user.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('project_id', params.projectId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/projects/[projectId]/subscribers?id=xxx
export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscriberId = request.nextUrl.searchParams.get('id');
  if (!subscriberId) {
    return NextResponse.json({ error: 'Subscriber ID required' }, { status: 400 });
  }

  // Verify ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', params.projectId)
    .eq('user_id', user.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { error } = await supabase
    .from('subscribers')
    .delete()
    .eq('id', subscriberId)
    .eq('project_id', params.projectId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
