import { Link } from 'react-router-dom';
import { memo } from 'react';
import { CountdownTimer } from '../common/CountdownTimer.jsx';

// SVG Icons
const GiftIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const SparkleIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

export const GiftOfferCard = memo(({ offer, products = [] }) => {
  if (!offer) return null;

  const displayProducts = products.slice(0, 4);
  
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-pink-100">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-pink-50/50 opacity-60"></div>
      
      {/* Decorative Corner Shapes */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-200/30 to-transparent rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100/40 to-transparent rounded-tr-full"></div>
      
      {/* Discount Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg flex items-center gap-2">
            <TagIcon />
            <span>-{offer.discountPercentage}%</span>
          </div>
          {/* Animated Sparkle */}
          <div className="absolute -top-1 -right-1 text-yellow-400 animate-pulse">
            <SparkleIcon />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-200 flex-shrink-0">
            <GiftIcon />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight pr-12 group-hover:text-pink-600 transition-colors">
              {offer.title}
            </h3>
            {offer.description && (
              <p className="text-sm text-gray-500 line-clamp-2">
                {offer.description}
              </p>
            )}
          </div>
        </div>
        
        {/* Timer Section */}
        <div className="bg-gradient-to-r from-gray-50 to-pink-50/50 rounded-xl p-4 mb-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Ends in:</span>
            </div>
            <CountdownTimer endDate={offer.endDate} compact />
          </div>
        </div>
        
        {/* Products Preview */}
        {displayProducts.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-gray-700">Featured Products</span>
              <span className="bg-pink-100 text-pink-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {products.length}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {displayProducts.map((product, index) => (
                <div
                  key={product._id || index}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-white shadow-sm group-hover:shadow-md transition-shadow"
                >
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-50">
                      <svg className="w-6 h-6 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            <span className="font-semibold text-pink-600">{products.length}</span> products on sale
          </span>
          <Link
            to={`/offers/${offer._id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-pink-600 hover:to-pink-700 transition-all group-hover:scale-105"
          >
            Shop Now
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </div>
  );
});

GiftOfferCard.displayName = 'GiftOfferCard';

// Gift Offers Section Component
export const GiftOffersSection = memo(({ offers, offerProducts = {} }) => {
  if (!offers || offers.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white via-pink-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full text-pink-600 font-semibold text-sm mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            Special Offers
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Exclusive Deals Just for You
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these limited-time offers. Grab your favorites before they're gone!
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.slice(0, 3).map((offer, index) => (
            <div
              key={offer._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <GiftOfferCard
                offer={offer}
                products={offerProducts[offer._id] || []}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

GiftOffersSection.displayName = 'GiftOffersSection';
