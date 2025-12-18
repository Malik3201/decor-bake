import { useRef, useState, useEffect, memo, useCallback } from 'react';
import { ProductCard } from './ProductCard.jsx';

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

export const ProductSlider = memo(({ title, products, showOffer = false, loading = false }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // Check scroll position to show/hide buttons
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
      
      // Recheck on resize
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [checkScrollPosition, products]);

  const scroll = useCallback((direction) => {
    if (scrollRef.current) {
      // Scroll by card width + gap (accounting for 3 cards visible)
      const containerWidth = scrollRef.current.clientWidth;
      const scrollAmount = containerWidth / 3 + 16; // approx one card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-6">
        {title && <div className="skeleton h-8 w-48 mb-6 rounded-lg"></div>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton-image mb-3"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text w-2/3"></div>
              <div className="skeleton skeleton-text w-1/2 mt-2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section 
      className="py-6 relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
          
          {/* Desktop scroll buttons in header */}
          <div className="hidden md:flex gap-2">
            <ScrollButton
              direction="left"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
            />
            <ScrollButton
              direction="right"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
            />
          </div>
        </div>
      )}

      {/* Slider Container */}
      <div className="relative slider-container">
        {/* Left Fade Gradient */}
        <div className={`slider-fade-left transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}></div>
        
        {/* Right Fade Gradient */}
        <div className={`slider-fade-right transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}></div>

        {/* Products Container - 3 per row on desktop */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 px-1 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.map((product) => (
            <div 
              key={product._id || product.id} 
              className="flex-shrink-0 w-[calc(50%-8px)] md:w-[calc(33.333%-16px)]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ProductCard product={product} showOffer={showOffer} />
            </div>
          ))}
        </div>

        {/* Floating Scroll Buttons (hover effect) */}
        {!title && (
          <>
            <button
              onClick={() => scroll('left')}
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-all duration-300 ${
                canScrollLeft && isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={() => scroll('right')}
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-all duration-300 ${
                canScrollRight && isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRightIcon />
            </button>
          </>
        )}
      </div>
    </section>
  );
});

ProductSlider.displayName = 'ProductSlider';

// Scroll Button Component
const ScrollButton = memo(({ direction, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
      disabled
        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
        : 'bg-pink-100 text-pink-600 hover:bg-pink-200 hover:scale-105 active:scale-95'
    }`}
    aria-label={`Scroll ${direction}`}
  >
    {direction === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
  </button>
));

ScrollButton.displayName = 'ScrollButton';
