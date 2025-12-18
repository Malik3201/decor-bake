import { Link } from 'react-router-dom';
import { useRef, memo, useCallback, useState, useEffect } from 'react';

// SVG Icons
const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Category placeholder icon
const CategoryPlaceholderIcon = () => (
  <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

export const CategorySlider = memo(({ categories }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();
      return () => scrollContainer.removeEventListener('scroll', checkScrollPosition);
    }
  }, [checkScrollPosition, categories]);

  const scroll = useCallback((direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="relative group">
      {/* Categories Grid/Scroll Container */}
      <div
        ref={scrollRef}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto lg:overflow-visible scrollbar-hide scroll-smooth py-4 px-2"
      >
        {categories.slice(0, 8).map((category, index) => (
          <Link
            key={category._id}
            to={`/products?categoryId=${category._id}`}
            className="flex-shrink-0 lg:flex-shrink group/card animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative w-full text-center">
              {/* Category Circle */}
              <div className="relative mx-auto w-20 h-20 md:w-24 md:h-24 mb-3">
                {/* Animated Border Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                
                {/* Inner Circle */}
                <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-pink-50 to-white overflow-hidden shadow-soft group-hover/card:shadow-pink-glow transition-all duration-300">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200">
                      <CategoryPlaceholderIcon />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Category Name */}
              <span className="block text-sm font-medium text-gray-700 group-hover/card:text-pink-600 transition-colors line-clamp-2">
                {category.name}
              </span>
              
              {/* Product Count Badge */}
              {category.productCount && (
                <span className="mt-1 inline-block text-xs text-gray-400">
                  {category.productCount} items
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Scroll Buttons */}
      <button
        onClick={() => scroll('left')}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-all duration-300 ${
          canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } hidden md:flex`}
        aria-label="Scroll left"
      >
        <ChevronLeftIcon />
      </button>
      <button
        onClick={() => scroll('right')}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-all duration-300 ${
          canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } hidden md:flex`}
        aria-label="Scroll right"
      >
        <ChevronRightIcon />
      </button>
      <style>{`
        .countdown-box {
          @apply rounded-lg shadow-sm border border-gray-100 flex items-center justify-center min-w-[45px] py-1.5;
        }
        .countdown-value {
          @apply text-lg font-bold text-pink-600;
        }
      `}</style>
    </div>
  );
});

CategorySlider.displayName = 'CategorySlider';
