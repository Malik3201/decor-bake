import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ProtectedRoute } from './components/common/ProtectedRoute.jsx';
import { Loading } from './components/common/Loading.jsx';

// Dynamic Imports for Code Splitting
const AdminLayout = lazy(() => import('./components/admin/AdminLayout.jsx').then(module => ({ default: module.AdminLayout })));
const HeaderWithCart = lazy(() => import('./components/layout/HeaderWithCart.jsx').then(module => ({ default: module.HeaderWithCart })));
const Footer = lazy(() => import('./components/layout/Footer.jsx').then(module => ({ default: module.Footer })));
const AnnouncementBar = lazy(() => import('./components/layout/AnnouncementBar.jsx').then(module => ({ default: module.AnnouncementBar })));
const Home = lazy(() => import('./pages/Home.jsx').then(module => ({ default: module.Home })));
const Products = lazy(() => import('./pages/Products.jsx').then(module => ({ default: module.Products })));
const Categories = lazy(() => import('./pages/Categories.jsx').then(module => ({ default: module.Categories })));
const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx').then(module => ({ default: module.ProductDetail })));
const Cart = lazy(() => import('./pages/Cart.jsx').then(module => ({ default: module.Cart })));
const Checkout = lazy(() => import('./pages/Checkout.jsx').then(module => ({ default: module.Checkout })));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation.jsx').then(module => ({ default: module.OrderConfirmation })));
const Login = lazy(() => import('./pages/Login.jsx').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Register.jsx').then(module => ({ default: module.Register })));
const Profile = lazy(() => import('./pages/Profile.jsx').then(module => ({ default: module.Profile })));
const OfferDetail = lazy(() => import('./pages/OfferDetail.jsx').then(module => ({ default: module.OfferDetail })));
const UserOrders = lazy(() => import('./pages/UserOrders.jsx').then(module => ({ default: module.UserOrders })));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard.jsx').then(module => ({ default: module.AdminDashboard })));
const AdminOrders = lazy(() => import('./pages/admin/Orders.jsx').then(module => ({ default: module.AdminOrders })));
const AdminProducts = lazy(() => import('./pages/admin/Products.jsx').then(module => ({ default: module.AdminProducts })));
const AdminCategories = lazy(() => import('./pages/admin/Categories.jsx').then(module => ({ default: module.AdminCategories })));
const AdminOffers = lazy(() => import('./pages/admin/Offers.jsx').then(module => ({ default: module.AdminOffers })));
const AdminPromos = lazy(() => import('./pages/admin/Promos.jsx').then(module => ({ default: module.AdminPromos })));
const AdminSettings = lazy(() => import('./pages/admin/Settings.jsx').then(module => ({ default: module.AdminSettings })));

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SfgdhFntOzIYzXA7DXaf9IQaDd0t4VDmuc0QosautNo4dzIJLbl9N9ySfvz1zRUenK3Wkcqw2K4GT39N5lO9P2R00RK0ESJmx');

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <Elements stripe={stripePromise}>
              <Suspense fallback={<Loading fullScreen />}>
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
              </Suspense>
            </Elements>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
