import { memo } from 'react';

// SVG Icons
const TruckIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const HeadphonesIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ArrowReturnIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>
);

const badgeConfig = {
  shipping: {
    icon: TruckIcon,
    title: 'Free Shipping',
    subtitle: 'On orders over $50',
    colorClass: 'text-blue-600',
    bgLight: 'bg-blue-50',
  },
  secure: {
    icon: ShieldIcon,
    title: 'Secure Payment',
    subtitle: '100% Protected',
    colorClass: 'text-green-600',
    bgLight: 'bg-green-50',
  },
  support: {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    subtitle: 'Dedicated help',
    colorClass: 'text-purple-600',
    bgLight: 'bg-purple-50',
  },
  returns: {
    icon: ArrowReturnIcon,
    title: 'Easy Returns',
    subtitle: '30-day guarantee',
    colorClass: 'text-orange-600',
    bgLight: 'bg-orange-50',
  },
};

export const TrustBadge = memo(({ type }) => {
  const config = badgeConfig[type];
  if (!config) return null;

  const IconComponent = config.icon;

  return (
    <div className="group flex items-center gap-4 p-4 bg-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-pink-200">
      <div className={`w-14 h-14 ${config.bgLight} ${config.colorClass} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <IconComponent />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
          {config.title}
        </h3>
        <p className="text-sm text-gray-500">{config.subtitle}</p>
      </div>
    </div>
  );
});

TrustBadge.displayName = 'TrustBadge';

// Trust Section Component
export const TrustSection = memo(({ badges = ['shipping', 'secure', 'support', 'returns'] }) => {
  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <div
              key={badge}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TrustBadge type={badge} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

TrustSection.displayName = 'TrustSection';
