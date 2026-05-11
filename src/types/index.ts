export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  stripe_customer_id: string | null;
  plan: 'free' | 'pro';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  logo_url: string | null;
  primary_color: string;
  bg_color: string;
  status: 'active' | 'paused';
  created_at: string;
  updated_at: string;
  subscriber_count?: number;
}

export interface Subscriber {
  id: string;
  project_id: string;
  email: string;
  referral_code: string;
  referred_by: string | null;
  referral_count: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DailySignup {
  date: string;
  count: number;
}
