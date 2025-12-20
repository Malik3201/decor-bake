import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { ProductSlider } from '../components/ui/ProductSlider.jsx';
import { CategorySlider } from '../components/ui/CategorySlider.jsx';
import { TrustSection } from '../components/ui/TrustBadge.jsx';
import { GiftOffersSection } from '../components/ui/GiftOfferCard.jsx';
import { Loading } from '../components/common/Loading.jsx';
import { categoryService } from '../services/categoryService.js';
import { productService } from '../services/productService.js';
import { offerService } from '../services/offerService.js';

// SVG Icons
const ArrowRightIcon = () => (
  <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CakeIcon = () => (
  <svg className="w-6 h-6 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const GiftIcon = () => (
  <svg className="w-6 h-6 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const HandPickedIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

// Hero Section Component
const HeroSection = memo(() => {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900 py-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.ibb.co/ns81v0my/image.png"
          alt="Baking Background" 
          className="w-full h-full object-cover opacity-50 scale-105"
          fetchPriority="high"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto w-full flex flex-col items-center">
        <div className="animate-fade-in-up">
          {/* Badge */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-500/20 backdrop-blur-md rounded-full text-sm font-bold text-pink-300 border border-pink-500/30">
              <span className="animate-pulse w-2.5 h-2.5 bg-pink-400 rounded-full"></span>
              Premium Baking Supplies
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] text-white">
            Elevate Your <span className="text-pink-400">Sweet</span> 
            <br />
            Masterpieces
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover a curated collection of professional-grade decorations and baking essentials. 
            Crafted for those who believe every cake tells a story.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/products" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full px-12 py-6 text-xl shadow-2xl shadow-pink-500/30 hover:scale-105 transition-all rounded-2xl">
                Shop Collection
                <ArrowRightIcon />
              </Button>
            </Link>
            <Link to="/categories" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full px-12 py-6 text-xl border-white/30 text-white hover:bg-white/10 transition-all backdrop-blur-sm rounded-2xl">
                Explore Categories
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="mt-20 flex flex-wrap justify-center gap-12 md:gap-24 border-t border-white/10 pt-10">
            <StatItem value="10K+" label="Happy Bakers" light />
            <StatItem value="500+" label="Premium Products" light />
            <StatItem value="4.9" label="Avg. Rating" showStar light />
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce-slow text-white/30">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black">Scroll Down</span>
        <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent"></div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

// Stat Item Component
const StatItem = memo(({ value, label, showStar = false, light = false }) => (
  <div className="text-center group">
    <div className="flex items-center justify-center gap-1.5 mb-2">
      {showStar && <StarIcon />}
      <span className={`text-3xl md:text-4xl font-black ${light ? 'text-white' : 'text-gray-900'} group-hover:text-pink-400 transition-colors`}>{value}</span>
    </div>
    <span className={`text-xs md:text-sm font-bold ${light ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-[0.15em]`}>{label}</span>
  </div>
));

StatItem.displayName = 'StatItem';

// Netflix-style Category Row Component
const CategoryProductRow = memo(({ category, products }) => {
  if (!products || products.length === 0) return null;
  
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{category.name}</h2>
            <span className="px-2 py-0.5 bg-pink-100 text-pink-600 text-sm font-medium rounded-full">
              {products.length}
            </span>
          </div>
          <Link to={`/products?categoryId=${category._id}`}>
            <Button variant="ghost" size="sm" className="group">
              View All
              <ChevronRightIcon />
            </Button>
          </Link>
        </div>
        <ProductSlider
          title=""
          products={products}
          showOffer={true}
        />
      </div>
    </section>
  );
});

CategoryProductRow.displayName = 'CategoryProductRow';

// Featured Products Section
const FeaturedSection = memo(({ products }) => {
  if (!products || products.length === 0) return null;
  
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold mb-4">
            <HandPickedIcon />
            Handpicked for You
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Featured Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our most popular items, loved by thousands of customers
          </p>
        </div>
        <ProductSlider
          title=""
          products={products}
          showOffer={true}
        />
      </div>
    </section>
  );
});

FeaturedSection.displayName = 'FeaturedSection';

// Loading Skeleton
const HomeSkeleton = () => (
  <div className="min-h-screen">
    {/* Hero Skeleton */}
    <div className="h-[85vh] bg-gradient-to-br from-pink-50 to-white flex items-center justify-center">
      <div className="text-center px-4 max-w-3xl mx-auto">
        <div className="skeleton h-8 w-48 mx-auto mb-6 rounded-full"></div>
        <div className="skeleton h-16 w-full mb-4"></div>
        <div className="skeleton h-16 w-3/4 mx-auto mb-6"></div>
        <div className="skeleton h-6 w-2/3 mx-auto mb-8"></div>
        <div className="flex justify-center gap-4">
          <div className="skeleton h-14 w-40 rounded-lg"></div>
          <div className="skeleton h-14 w-44 rounded-lg"></div>
        </div>
      </div>
    </div>
    
    {/* Content Skeleton */}
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-24 rounded-lg"></div>
        ))}
      </div>
      <div className="skeleton h-8 w-48 mb-6"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-72 rounded-xl"></div>
        ))}
      </div>
    </div>
  </div>
);

// Main Home Component
export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeOffers, setActiveOffers] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [offerProducts, setOfferProducts] = useState({});
  const [loading, setLoading] = useState(true);

  // Memoized fetch function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel for better performance
      const [categoriesRes, featuredRes, offersRes] = await Promise.all([
        categoryService.getCategories(true),
        productService.getFeaturedProducts(12),
        offerService.getActiveOffers(),
      ]);

      const categoriesData = categoriesRes.data || [];
      const offersData = offersRes.data || [];

      setCategories(categoriesData);
      setFeaturedProducts(featuredRes.data || []);
      setActiveOffers(offersData);
      
      // Set loading to false once the visible areas (Hero, Featured) have data
      setLoading(false);

      // Fetch products for each category progressively
      // Use chunks to avoid slamming the server with too many concurrent requests
      const validCategories = categoriesData.slice(0, 10);
      const chunkSize = 3;
      
      for (let i = 0; i < validCategories.length; i += chunkSize) {
        const chunk = validCategories.slice(i, i + chunkSize);
        const chunkResults = await Promise.all(
          chunk.map(async (category) => {
            try {
              const productsRes = await productService.getProductsByCategory(category._id, 12);
              return { categoryId: category._id, products: productsRes.data || [] };
            } catch (error) {
              console.error(`Error fetching products for category ${category._id}:`, error);
              return { categoryId: category._id, products: [] };
            }
          })
        );

        setCategoryProducts(prev => {
          const next = { ...prev };
          chunkResults.forEach(({ categoryId, products }) => {
            next[categoryId] = products;
          });
          return next;
        });
      }

      // Fetch products for each offer progressively
      const offerProductsResults = await Promise.all(
        offersData.slice(0, 3).map(async (offer) => {
          try {
            const productsRes = await offerService.getOfferProducts(offer._id);
            return { offerId: offer._id, products: productsRes.data?.products || [] };
          } catch (error) {
            console.error(`Error fetching products for offer ${offer._id}:`, error);
            return { offerId: offer._id, products: [] };
          }
        })
      );

      setOfferProducts(prev => {
        const next = { ...prev };
        offerProductsResults.forEach(({ offerId, products }) => {
          next[offerId] = products;
        });
        return next;
      });
    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize category sections to prevent unnecessary re-renders
  const categorySections = useMemo(() => {
    // Collect all categories that have products
    const validCategories = categories.filter(cat => (categoryProducts[cat._id]?.length || 0) > 0);
    
    // Take the first 5 (minimum) or more if available
    return validCategories.slice(0, Math.max(5, validCategories.length)).map((category) => {
      const products = categoryProducts[category._id];
      return (
        <CategoryProductRow
          key={category._id}
          category={category}
          products={products}
        />
      );
    });
  }, [categories, categoryProducts]);

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Trust Badges */}
      <TrustSection badges={['shipping', 'secure', 'support', 'returns']} />
      
      {/* Categories Slider */}
      {categories.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
              <Link to="/categories">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <CategorySlider categories={categories.slice(0, 4)} />
          </div>
        </section>
      )}
      
      {/* Gift-style Offers Section */}
      {activeOffers.length > 0 && (
        <GiftOffersSection offers={activeOffers} offerProducts={offerProducts} />
      )}
      
      {/* Featured Products */}
      <FeaturedSection products={featuredProducts} />
      
      {/* Category Product Rows (Netflix-style) */}
      <div className="bg-gray-50/50">
        {categorySections}
      </div>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-br from-pink-500 to-pink-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-4 border-white rounded-full"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated with Sweet Deals
          </h2>
          <p className="text-pink-100 mb-8 text-lg">
            Subscribe to our newsletter and get exclusive offers, new arrivals, and baking tips!
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/70 focus:bg-white/30 focus:outline-none focus:border-white transition-all"
            />
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="px-8 whitespace-nowrap bg-white text-pink-600 hover:bg-pink-50"
            >
              Subscribe
            </Button>
          </form>
          <p className="text-pink-200 text-sm mt-4">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
};
