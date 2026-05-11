import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/projects - List user's projects
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*, subscribers(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const projects = (data || []).map((p: any) => ({
    ...p,
    subscriber_count: p.subscribers?.[0]?.count ?? 0,
  }));

  return NextResponse.json(projects);
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, title, description, primary_color } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { error: 'Name and slug are required' },
      { status: 400 }
    );
  }

  // Validate slug format
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug) && slug.length > 1) {
    return NextResponse.json(
      { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
      { status: 400 }
    );
  }

  // Check reserved slugs
  const reserved = ['dashboard', 'login', 'signup', 'api', 'settings', 'admin'];
  if (reserved.includes(slug)) {
    return NextResponse.json(
      { error: 'This slug is reserved. Please choose another.' },
      { status: 400 }
    );
  }

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: 'This slug is already taken. Please choose another.' },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name,
      slug,
      title: title || name,
      description: description || '',
      primary_color: primary_color || '#6366f1',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
