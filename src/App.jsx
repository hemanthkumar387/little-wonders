import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./Pages/HomePage/HomePage";
import ProductsPage from "./Pages/ProductsPage/ProductsPage";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import AboutPage from "./components/AboutPage/AboutPage";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import CartPage from "./components/Cart/Cart";
import ContactPage from "./components/ContactPage/ContactPage";
import FloatingSocials from "./components/FloatingSocials/FloatingSocials";
import Footer from "./components/Footer/Footer";

import SignupPage from "./Pages/Auth/SignupPage";
import LoginPage from "./Pages/Auth/LoginPage";
import ProfilePage from "./Pages/Profile/ProfilePage";
// import AdminDashboard from "./admin/AdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

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
          <Routes>
            {/* HOME */}
            <Route path="/" element={<HomePage />} />

            {/* PRODUCTS */}
            <Route path="/products" element={<ProductsPage />} />

            <Route path="/products/:id" element={<ProductDetails />} />

            <Route path="/about" element={<AboutPage />} />

            <Route path="/cart" element={<CartPage />} />

            <Route path="/contact" element={<ContactPage />} />

            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          </Routes>
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
