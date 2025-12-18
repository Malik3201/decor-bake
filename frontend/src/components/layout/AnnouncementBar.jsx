import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { offerService } from '../../services/offerService.js';

export const AnnouncementBar = memo(() => {
  const [announcements, setAnnouncements] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchActiveOffers = async () => {
      try {
        const response = await offerService.getActiveOffers();
        if (response.data && response.data.length > 0) {
          const offers = response.data.map(offer => ({
            id: offer._id,
            text: `★ ${offer.title} - Up to ${offer.discountPercentage}% OFF!`,
            link: `/offers/${offer._id}`,
          }));
          
          // Add a default one if only one exists to keep the marquee smooth
          if (offers.length === 1) {
            offers.push({
              id: 'default',
              text: '✓ Free shipping on orders over $50! Shop now and save.',
              link: '/products',
            });
          }
          
          setAnnouncements(offers);
        } else {
          setAnnouncements([{
            id: 'default',
            text: '✓ Free shipping on orders over $50! Shop now and save.',
            link: '/products',
          }]);
        }
      } catch (error) {
        setAnnouncements([{
          id: 'default',
          text: '✓ Free shipping on orders over $50! Shop now and save.',
          link: '/products',
        }]);
      }
    };

    fetchActiveOffers();
  }, []);

  if (!isVisible || announcements.length === 0) return null;

  return (
    <div 
      className="bg-gradient-to-r from-pink-600 via-pink-500 to-pink-600 text-white text-sm py-2.5 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-4 -left-4 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 border-2 border-white rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center">
          {/* Scrolling Text Container */}
          <div className="overflow-hidden flex-1 relative h-5">
            <div className={`flex absolute whitespace-nowrap will-change-transform ${!isPaused ? 'animate-marquee-infinite' : ''}`}>
              {/* First set of announcements */}
              {announcements.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center">
                  <Link 
                    to={item.link} 
                    className="px-8 hover:underline font-medium transition-colors"
                  >
                    {item.text}
                  </Link>
                  <span className="opacity-50 text-xs text-pink-200">✦</span>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {announcements.map((item, index) => (
                <div key={`${item.id}-dup-${index}`} className="flex items-center">
                  <Link 
                    to={item.link} 
                    className="px-8 hover:underline font-medium transition-colors"
                  >
                    {item.text}
                  </Link>
                  <span className="opacity-50 text-xs text-pink-200">✦</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 hover:bg-white/20 rounded-full p-1 transition-colors flex-shrink-0 relative z-10"
            aria-label="Close announcement"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes marquee-infinite {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-infinite {
          animation: marquee-infinite 30s linear infinite;
        }
      `}</style>
    </div>
  );
});

AnnouncementBar.displayName = 'AnnouncementBar';
