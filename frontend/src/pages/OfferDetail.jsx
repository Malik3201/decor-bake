import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { offerService } from '../services/offerService.js';
import { Loading } from '../components/common/Loading.jsx';
import { CountdownTimer } from '../components/common/CountdownTimer.jsx';
import { ProductCard } from '../components/ui/ProductCard.jsx';

export const OfferDetail = () => {
  const { id } = useParams();
  const [offerData, setOfferData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const response = await offerService.getOfferProducts(id);
        setOfferData(response.data);
      } catch (error) {
        console.error('Error fetching offer:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOffer();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!offerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Offer not found</h2>
          <Link to="/">
            <button className="text-pink-600 hover:text-pink-700">Go Home</button>
          </Link>
        </div>
      </div>
    );
  }

  const { offer, products } = offerData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Offer Header */}
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-soft p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-4">{offer.title}</h1>
          <div className="flex items-center gap-6">
            <div className="bg-white/20 rounded-lg px-6 py-3">
              <p className="text-sm opacity-90">Discount</p>
              <p className="text-3xl font-bold">-{offer.discountPercentage}% OFF</p>
            </div>
            {offer.isActive && offer.remainingTime > 0 && (
              <div>
                <p className="text-sm opacity-90 mb-2">Time Remaining</p>
                <CountdownTimer
                  endDate={offer.endDate}
                  onComplete={() => console.log('Offer expired')}
                />
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Products on Offer ({products.length})
          </h2>
          {products.length === 0 ? (
            <div className="bg-white rounded-xl shadow-soft p-12 text-center">
              <p className="text-gray-600">No products in this offer</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={{
                    ...product,
                    discountPrice: product.discountedPrice,
                    discountPercentage: offer.discountPercentage,
                  }}
                  showOffer={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

