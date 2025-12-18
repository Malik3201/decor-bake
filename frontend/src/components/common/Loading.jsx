import { memo } from 'react';

export const Loading = memo(({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const spinner = (
    <div className="relative">
      {/* Outer Ring */}
      <div className={`${sizeClasses[size]} rounded-full border-4 border-pink-100 animate-pulse`}></div>
      
      {/* Spinning Part */}
      <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-4 border-transparent border-t-pink-500 animate-spin`}></div>
      
      {/* Inner Dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'} bg-pink-500 rounded-full animate-pulse`}></div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          {spinner}
          <p className="mt-4 text-sm text-gray-500 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {spinner}
    </div>
  );
});

Loading.displayName = 'Loading';

// Skeleton Components
export const Skeleton = memo(({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    circle: 'rounded-full aspect-square',
    rectangular: 'rounded-lg',
    card: 'rounded-xl h-64',
  };

  return (
    <div className={`skeleton animate-shimmer ${variants[variant]} ${className}`}></div>
  );
});

Skeleton.displayName = 'Skeleton';

// Product Card Skeleton
export const ProductCardSkeleton = memo(() => (
  <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
    <div className="skeleton skeleton-image"></div>
    <div className="p-4 space-y-2">
      <div className="skeleton h-4 w-full rounded"></div>
      <div className="skeleton h-4 w-2/3 rounded"></div>
      <div className="skeleton h-6 w-1/2 rounded mt-2"></div>
    </div>
  </div>
));

ProductCardSkeleton.displayName = 'ProductCardSkeleton';
