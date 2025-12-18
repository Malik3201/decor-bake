import { useState, useEffect } from 'react';
import { productService } from '../../services/productService.js';
import { categoryService } from '../../services/categoryService.js';
import { adminService } from '../../services/adminService.js';
import { uploadService } from '../../services/uploadService.js';
import { Loading } from '../../components/common/Loading.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    price: '',
    images: [], // gallery images (excluding cover)
    coverImage: '',
    isFeatured: false,
    isActive: true,
  });
  const [coverUrlInput, setCoverUrlInput] = useState('');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({ limit: 100 });
      setProducts(response.data || []);
    } catch (err) {
      showError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct._id, formData);
        success('Product updated');
      } else {
        await adminService.createProduct(formData);
        success('Product created');
      }
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (err) {
      showError('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminService.deleteProduct(id);
      success('Product deleted');
      fetchProducts();
    } catch (err) {
      showError('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      categoryId: '',
      price: '',
      images: [],
      coverImage: '',
      isFeatured: false,
      isActive: true,
    });
    setCoverUrlInput('');
    setGalleryUrlInput('');
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    const allImages = product.images || [];
    setFormData({
      title: product.title,
      description: product.description,
      categoryId: product.categoryId._id || product.categoryId,
      price: product.price,
      images: allImages.slice(1),
      coverImage: allImages[0] || '',
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    });
    setCoverUrlInput('');
    setGalleryUrlInput('');
    setShowModal(true);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadService.uploadSingle(file);
      if (!url) throw new Error('No URL returned');
      setFormData((prev) => ({
        ...prev,
        coverImage: url,
      }));
      success('Cover image uploaded');
    } catch (err) {
      console.error('Failed to upload cover image', err);
      showError('Failed to upload cover image');
    } finally {
      e.target.value = '';
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const urls = await uploadService.uploadMultiple(files);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...urls],
      }));
      success('Images uploaded');
    } catch (err) {
      console.error('Failed to upload images', err);
      showError('Failed to upload images');
    } finally {
      e.target.value = '';
    }
  };

  const handleAddCoverUrl = () => {
    if (!coverUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      coverImage: coverUrlInput.trim(),
    }));
    setCoverUrlInput('');
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), galleryUrlInput.trim()],
    }));
    setGalleryUrlInput('');
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return <Loading size="lg" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setEditingProduct(null);
            setShowModal(true);
          }}
        >
          + Add Product
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{product.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {product.categoryId?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(product)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(product._id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
          resetForm();
        }}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Build final images array with cover image first
            const images = [
              formData.coverImage,
              ...(formData.images || []),
            ].filter(Boolean);

            const payload = {
              title: formData.title,
              description: formData.description,
              categoryId: formData.categoryId,
              price: formData.price,
              images,
              isFeatured: formData.isFeatured,
              isActive: formData.isActive,
            };

            // Reuse existing submit logic with constructed payload
            const fakeEvent = { preventDefault: () => {} };
            // Temporarily call handleSubmit-like behavior inline
            (async () => {
              try {
                if (editingProduct) {
                  await adminService.updateProduct(editingProduct._id, payload);
                  success('Product updated');
                } else {
                  await adminService.createProduct(payload);
                  success('Product created');
                }
                setShowModal(false);
                setEditingProduct(null);
                resetForm();
                fetchProducts();
              } catch (err) {
                console.error('Failed to save product', err);
                showError('Failed to save product');
              }
            })();
          }}
          className="space-y-4"
        >
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              rows="4"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Images section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Cover image */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Cover Image</h3>
              <p className="text-xs text-gray-500 mb-3">
                This image will be used as the main product thumbnail across the site.
              </p>
              {formData.coverImage && (
                <div className="mb-3">
                  <img
                    src={formData.coverImage}
                    alt="Cover"
                    className="w-full h-40 object-cover rounded-lg border border-pink-100"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Upload from device
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="mt-1 block w-full text-xs text-gray-700"
                  />
                </label>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Or paste image URL"
                    value={coverUrlInput}
                    onChange={(e) => setCoverUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={handleAddCoverUrl}>
                    Use URL
                  </Button>
                </div>
              </div>
            </div>

            {/* Gallery images */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">More Images</h3>
              <p className="text-xs text-gray-500 mb-3">
                Add additional angles or detail shots. These appear in the product gallery.
              </p>
              {formData.images?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        alt={`Product ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute -top-1 -right-1 bg-white rounded-full shadow p-0.5 text-xs text-gray-600 hover:bg-pink-50"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Upload from device
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="mt-1 block w-full text-xs text-gray-700"
                  />
                </label>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Add image URL and click Add"
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={handleAddGalleryUrl}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
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
          <div className="flex gap-4 pt-4">
            <Button variant="primary" type="submit" fullWidth>
              {editingProduct ? 'Update' : 'Create'}
            </Button>
            <Button
              variant="outline"
              type="button"
              fullWidth
              onClick={() => {
                setShowModal(false);
                setEditingProduct(null);
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

