import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/categoryService.js';
import { productService } from '../services/productService.js';
import { ProductSlider } from '../components/ui/ProductSlider.jsx';
import { Loading } from '../components/common/Loading.jsx';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories(true);
      const categoriesData = response.data || [];
      setCategories(categoriesData);

      // Fetch products for each category
      const productsMap = {};
      for (const category of categoriesData) {
        try {
          const productsRes = await productService.getProductsByCategory(category._id, 8);
          productsMap[category._id] = productsRes.data || [];
        } catch (error) {
          console.error(`Error fetching products for category ${category._id}:`, error);
          productsMap[category._id] = [];
        }
      }
      setCategoryProducts(productsMap);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h1>

        {categories.length === 0 ? (
          <div className="bg-white rounded-xl shadow-soft p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No categories found</h2>
            <p className="text-gray-600">Categories will appear here once added</p>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => {
              const products = categoryProducts[category._id] || [];
              if (products.length === 0) return null;

              return (
                <section key={category._id} className="bg-white rounded-xl shadow-soft p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center text-3xl">
                          📦
                        </div>
                      )}
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                        <p className="text-sm text-gray-600">{products.length} products</p>
                      </div>
                    </div>
                    <Link to={`/products?categoryId=${category._id}`}>
                      <button className="text-pink-600 hover:text-pink-700 font-medium">
                        View All →
                      </button>
                    </Link>
                  </div>
                  <ProductSlider
                    title=""
                    products={products}
                    showOffer={true}
                  />
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

