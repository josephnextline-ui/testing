import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <Link href="/" className="text-xl font-bold text-white">
              LaunchBoard
            </Link>
            <p className="mt-1 text-sm">
              Waitlist pages that convert.
            </p>
          </div>
          <div className="flex items-center gap-8 text-sm">
            <Link href="#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="hover:text-white transition-colors">
              Sign up
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          &copy; {new Date().getFullYear()} LaunchBoard. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
