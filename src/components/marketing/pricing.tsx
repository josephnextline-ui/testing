import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for testing your idea',
    features: [
      'Up to 3 waitlists',
      '500 subscribers per waitlist',
      'Basic analytics',
      'CSV export',
      'Custom branding',
    ],
    cta: 'Get started',
    href: '/signup',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For serious launches',
    features: [
      'Unlimited waitlists',
      'Unlimited subscribers',
      'Advanced analytics',
      'CSV export',
      'Custom branding',
      'Custom domain (coming soon)',
      'Priority support',
    ],
    cta: 'Start free trial',
    href: '/signup',
    featured: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Start free. Upgrade when you need more.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-8 border-2 ${
                plan.featured
                  ? 'border-brand-600 bg-brand-50/30 shadow-lg'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.featured && (
                <span className="inline-block px-3 py-1 text-xs font-semibold text-brand-700 bg-brand-100 rounded-full mb-4">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <svg
                      className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 block text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${
                  plan.featured
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
