import { useState, useEffect } from 'react';
import { offerService } from '../../services/offerService.js';
import { adminService } from '../../services/adminService.js';
import { productService } from '../../services/productService.js';
import { Loading } from '../../components/common/Loading.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    productIds: [],
    discountPercentage: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchOffers();
    fetchProducts();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await offerService.getOffers({ limit: 100 });
      setOffers(response.data || []);
    } catch (err) {
      showError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts({ limit: 100 });
      setProducts(response.data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        await adminService.updateOffer(editingOffer._id, formData);
        success('Offer updated');
      } else {
        await adminService.createOffer(formData);
        success('Offer created');
      }
      setShowModal(false);
      setEditingOffer(null);
      resetForm();
      fetchOffers();
    } catch (err) {
      showError('Failed to save offer');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      await adminService.deleteOffer(id);
      success('Offer deleted');
      fetchOffers();
    } catch (err) {
      showError('Failed to delete offer');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      productIds: [],
      discountPercentage: '',
      startDate: '',
      endDate: '',
      isActive: true,
    });
  };

  if (loading) {
    return <Loading size="lg" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Offers Management</h1>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setEditingOffer(null);
            setShowModal(true);
          }}
        >
          + Add Offer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div key={offer._id} className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-pink-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {offer.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-2xl font-bold text-pink-600 mb-2">-{offer.discountPercentage}% OFF</p>
            <p className="text-sm text-gray-600 mb-4">
              {offer.productIds?.length || 0} products
            </p>
            <p className="text-xs text-gray-500 mb-4">
              {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" fullWidth onClick={() => {
                setEditingOffer(offer);
                setFormData({
                  title: offer.title,
                  productIds: offer.productIds.map(p => p._id || p),
                  discountPercentage: offer.discountPercentage,
                  startDate: new Date(offer.startDate).toISOString().split('T')[0],
                  endDate: new Date(offer.endDate).toISOString().split('T')[0],
                  isActive: offer.isActive,
                });
                setShowModal(true);
              }}>
                Edit
              </Button>
              <Button variant="danger" size="sm" fullWidth onClick={() => handleDelete(offer._id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingOffer(null);
          resetForm();
        }}
        title={editingOffer ? 'Edit Offer' : 'Add Offer'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Products</label>
            <select
              multiple
              required
              value={formData.productIds}
              onChange={(e) => setFormData({ ...formData, productIds: Array.from(e.target.selectedOptions, option => option.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 h-32"
            >
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.title} - ${product.price}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount %</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="datetime-local"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="datetime-local"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="primary" type="submit" fullWidth>
              {editingOffer ? 'Update' : 'Create'}
            </Button>
            <Button
              variant="outline"
              type="button"
              fullWidth
              onClick={() => {
                setShowModal(false);
                setEditingOffer(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

