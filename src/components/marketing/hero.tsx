import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-purple-50" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium text-brand-700 bg-brand-100 rounded-full">
          Launch your waitlist in under 2 minutes
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
          Build waitlists that
          <span className="block text-brand-600">convert visitors into fans</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
          Create beautiful coming soon pages, collect emails, track referrals,
          and understand your audience — all without writing a single line of code.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">
            Get started free
          </Link>
          <Link
            href="#features"
            className="btn-secondary text-base px-8 py-3"
          >
            See how it works
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Free forever for up to 3 waitlists. No credit card required.
        </p>
      </div>
    </section>
  );
}
