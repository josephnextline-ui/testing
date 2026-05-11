import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// POST /api/subscribe - Public endpoint for email signup
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { projectId, email, referredBy } = body;

  if (!projectId || !email) {
    return NextResponse.json(
      { error: 'Project ID and email are required' },
      { status: 400 }
    );
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Verify project exists and is active
  const { data: project } = await supabase
    .from('projects')
    .select('id, status')
    .eq('id', projectId)
    .single();

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  if (project.status !== 'active') {
    return NextResponse.json(
      { error: 'This waitlist is currently paused' },
      { status: 403 }
    );
  }

  // Insert subscriber
  const { data: subscriber, error } = await supabase
    .from('subscribers')
    .insert({
      project_id: projectId,
      email: email.toLowerCase().trim(),
      referred_by: referredBy || null,
    })
    .select('referral_code')
    .single();

  if (error) {
    // Duplicate email
    if (error.code === '23505') {
      // Return existing referral code
      const { data: existing } = await supabase
        .from('subscribers')
        .select('referral_code')
        .eq('project_id', projectId)
        .eq('email', email.toLowerCase().trim())
        .single();

      return NextResponse.json({
        message: 'You are already on the waitlist!',
        referral_code: existing?.referral_code,
        already_subscribed: true,
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Increment referrer's count if applicable
  if (referredBy) {
    await supabase.rpc('increment_referral_count', { ref_code: referredBy });
  }

  return NextResponse.json(
    {
      message: 'You are on the waitlist!',
      referral_code: subscriber.referral_code,
      already_subscribed: false,
    },
    { status: 201 }
  );
}
