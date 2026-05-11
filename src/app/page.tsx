import Link from 'next/link';
import { Hero } from '@/components/marketing/hero';
import { Features } from '@/components/marketing/features';
import { Pricing } from '@/components/marketing/pricing';
import { Footer } from '@/components/marketing/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            LaunchBoard
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="#features"
              className="hidden sm:block text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="hidden sm:block text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Log in
            </Link>
            <Link href="/signup" className="btn-primary text-sm">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}
