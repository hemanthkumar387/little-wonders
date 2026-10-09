import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./Pages/HomePage/HomePage";
import ProductsPage from "./Pages/ProductsPage/ProductsPage";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import AboutPage from "./components/AboutPage/AboutPage";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import CartPage from "./components/Cart/Cart";
import ContactPage from "./components/ContactPage/ContactPage";
import Footer from "./components/Footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
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
        <Navbar />

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
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
