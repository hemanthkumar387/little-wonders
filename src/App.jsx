import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { lazy, Suspense } from "react";

import Navbar from "./components/Navbar/Navbar";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import FloatingSocials from "./components/FloatingSocials/FloatingSocials";
import Footer from "./components/Footer/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

// Lazy-loaded pages and components
const HomePage = lazy(() => import("./Pages/HomePage/HomePage"));
const ProductsPage = lazy(() => import("./Pages/ProductsPage/ProductsPage"));
const ProductDetails = lazy(
  () => import("./components/ProductDetails/ProductDetails"),
);
const AboutPage = lazy(() => import("./components/AboutPage/AboutPage"));
const CartPage = lazy(() => import("./components/Cart/Cart"));
const ContactPage = lazy(() => import("./components/ContactPage/ContactPage"));
const Review = lazy(() => import("./components/Review/Review"));
const SignupPage = lazy(() => import("./Pages/Auth/SignupPage"));
const LoginPage = lazy(() => import("./Pages/Auth/LoginPage"));
const ProfilePage = lazy(() => import("./Pages/Profile/ProfilePage"));
const NotFound = lazy(() => import("./Pages/NotFound/NotFound"));

// Loading component
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-spinner"></div>
      <p>Loading LittleWonders...</p>
    </div>
  );
}

function AppLayout() {
  const location = useLocation();

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2200}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      <ScrollToTop />

      <div className="app">
        {!isAuthPage && <Navbar />}

        <main>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* HOME */}
              <Route path="/" element={<HomePage />} />

              {/* PRODUCTS */}
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetails />} />

              {/* OTHER PAGES */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/reviews" element={<Review />} />

              {/* AUTH */}
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              {/* 404 - PAGE NOT FOUND */}
              <Route path="*" element={<NotFound />} />

              {/* ADMIN */}
              {/* <Route path="/admin" element={<AdminDashboard />} /> */}
            </Routes>
          </Suspense>
        </main>

        {!isAuthPage && <Footer />}
        {!isAuthPage && <FloatingSocials />}
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
