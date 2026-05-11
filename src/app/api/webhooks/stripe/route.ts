import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

// POST /api/webhooks/stripe - Handle Stripe events
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      const customerId = session.customer as string;

      // Upgrade user to pro
      await supabase
        .from('users')
        .update({ plan: 'pro', updated_at: new Date().toISOString() })
        .eq('stripe_customer_id', customerId);

      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any;
      const customerId = subscription.customer as string;

      // Downgrade user to free
      await supabase
        .from('users')
        .update({ plan: 'free', updated_at: new Date().toISOString() })
        .eq('stripe_customer_id', customerId);

      break;
    }
  }

  return NextResponse.json({ received: true });
}
