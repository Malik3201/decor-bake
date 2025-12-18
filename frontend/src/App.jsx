import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ProtectedRoute } from './components/common/ProtectedRoute.jsx';
import { AdminLayout } from './components/admin/AdminLayout.jsx';
import { HeaderWithCart } from './components/layout/HeaderWithCart.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { AnnouncementBar } from './components/layout/AnnouncementBar.jsx';
import { Home } from './pages/Home.jsx';
import { Products } from './pages/Products.jsx';
import { Categories } from './pages/Categories.jsx';
import { ProductDetail } from './pages/ProductDetail.jsx';
import { Cart } from './pages/Cart.jsx';
import { Checkout } from './pages/Checkout.jsx';
import { OrderConfirmation } from './pages/OrderConfirmation.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Profile } from './pages/Profile.jsx';
import { OfferDetail } from './pages/OfferDetail.jsx';
import { UserOrders } from './pages/UserOrders.jsx';
import { AdminDashboard } from './pages/admin/Dashboard.jsx';
import { AdminOrders } from './pages/admin/Orders.jsx';
import { AdminProducts } from './pages/admin/Products.jsx';
import { AdminCategories } from './pages/admin/Categories.jsx';
import { AdminOffers } from './pages/admin/Offers.jsx';
import { AdminPromos } from './pages/admin/Promos.jsx';
import { AdminSettings } from './pages/admin/Settings.jsx';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SfgdhFntOzIYzXA7DXaf9IQaDd0t4VDmuc0QosautNo4dzIJLbl9N9ySfvz1zRUenK3Wkcqw2K4GT39N5lO9P2R00RK0ESJmx');

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <Elements stripe={stripePromise}>
              <Routes>
              {/* Auth Routes - No Header/Footer */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Public Routes with Layout */}
              <Route
                element={
                  <div className="min-h-screen flex flex-col">
                    <AnnouncementBar />
                    <HeaderWithCart />
                    <main className="flex-grow">
                      <Outlet />
                    </main>
                    <Footer />
                  </div>
                }
              >
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/offers/:id" element={<OfferDetail />} />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-confirmation/:orderNumber"
                  element={
                    <ProtectedRoute>
                      <OrderConfirmation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <UserOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminLayout>
                      <Outlet />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="offers" element={<AdminOffers />} />
                <Route path="promos" element={<AdminPromos />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              </Routes>
            </Elements>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
