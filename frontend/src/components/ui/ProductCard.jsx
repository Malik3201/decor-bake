import { Link } from 'react-router-dom';
import { useState, memo, useCallback } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

// SVG Icons
const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const FeaturedIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const CakeIcon = () => (
  <svg className="w-8 h-8 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
  </svg>
);

export const ProductCard = memo(({ product, showOffer = false }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { success, error } = useToast();

  const mainImage = product.images?.[0] || '/placeholder-product.jpg';
  const secondaryImage = product.images?.[1] || mainImage;

  const originalPrice = product.price || 0;
  const discountPrice = product.discountPrice || originalPrice;
  const discountPercentage = product.discountPercentage || 0;
  const hasDiscount = discountPrice < originalPrice;

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAdding) return;
    
    setIsAdding(true);
    try {
      const result = await addToCart(product._id || product.id, 1);
      if (result.success) {
        success('Added to cart!');
      }
    } catch (err) {
      error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  }, [addToCart, product._id, product.id, success, error, isAdding]);

  return (
    <Link
      to={`/products/${product._id || product.id}`}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-2 border border-gray-100/50">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {/* Shimmer Loading */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 skeleton-image"></div>
          )}
          
          {!imageError ? (
            <img
              src={isHovered && secondaryImage !== mainImage ? secondaryImage : mainImage}
              alt={product.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-gray-100">
              <CakeIcon />
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && showOffer && (
            <div className="product-card-badge badge-discount animate-pulse-slow">
              <span className="flex items-center gap-1">
                <TagIcon />
                {discountPercentage}% OFF
              </span>
            </div>
          )}

          {/* Featured Badge */}
          {product.isFeatured && (
            <div className="product-card-badge badge-featured flex items-center gap-1">
              <FeaturedIcon />
              Featured
            </div>
          )}

          {/* Quick Add Button Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center pb-4 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`flex items-center gap-2 px-6 py-2.5 bg-white text-pink-600 rounded-full font-semibold text-sm shadow-lg transform transition-all duration-300 hover:bg-pink-50 hover:scale-105 ${
                isHovered ? 'translate-y-0' : 'translate-y-4'
              } ${isAdding ? 'opacity-70' : ''}`}
            >
              {isAdding ? (
                <>
                  <LoadingSpinner />
                  Adding...
                </>
              ) : (
                <>
                  <PlusIcon />
                  Quick Add
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors text-sm md:text-base leading-snug min-h-[2.5rem]">
            {product.title}
          </h3>

          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-2">
            {hasDiscount ? (
              <>
                <span className="text-lg md:text-xl font-bold text-pink-600">
                  ${discountPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                  Save ${(originalPrice - discountPrice).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg md:text-xl font-bold text-gray-900">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating Stars */}
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} />
              ))}
            </div>
            <span className="text-xs text-gray-400">(4.9)</span>
            <span className="text-xs text-gray-300">•</span>
            <span className="text-xs text-gray-400">50+ sold</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';
