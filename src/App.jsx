import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./Pages/HomePage/HomePage";
import ProductsPage from "./Pages/ProductsPage/ProductsPage";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Footer from "./components/Footer/Footer";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <div className="app">

        <Navbar />

        <main>
          <Routes>

            {/* HOME */}
            <Route
              path="/"
              element={<HomePage />}
            />

            {/* PRODUCTS */}
            <Route
              path="/products"
              element={<ProductsPage />}
            />

          </Routes>
        </main>

        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;
