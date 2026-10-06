import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  /* ==========================================
     LOAD CART COUNT
  ========================================== */

  const getCartCount = () => {
    try {
      const savedCart = localStorage.getItem("littleWondersCart");

      if (!savedCart) {
        return 0;
      }

      const cartItems = JSON.parse(savedCart);

      return cartItems.reduce(
        (total, item) => total + (Number(item.quantity) || 1),
        0,
      );
    } catch (error) {
      console.error("Failed to load cart count:", error);

      return 0;
    }
  };

  const [cartCount, setCartCount] = useState(getCartCount);

  /* ==========================================
     MOBILE MENU SCROLL LOCK
  ========================================== */

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* ==========================================
     UPDATE CART COUNT
  ========================================== */

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartCount());
    };

    /*
      Same tab:
      Product Details / Cart dispatches cartUpdated.

      Other tab:
      Browser fires storage event.
    */

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  /* ==========================================
     CLOSE MOBILE MENU
  ========================================== */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* ==========================================
            LOGO
        ========================================== */}

        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img
            src="/images/logo.png"
            alt="LittleWonders"
            className="logo-image"
          />

          <div className="logo-text">
            <span className="logo-title">LittleWonders</span>

            <span className="logo-subtitle">NURTURE. GROW. INSPIRE.</span>
          </div>
        </Link>

        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <div className="navbar-right">
          {/* ==========================================
              DESKTOP NAVIGATION
          ========================================== */}

          <nav className="nav-links">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              About Us
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* ==========================================
              CART
          ========================================== */}

          <div className="navbar-cart">
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `cart-link ${isActive ? "active" : ""}`
              }
              aria-label={`Shopping cart with ${cartCount} items`}
              onClick={closeMenu}
            >
              <FontAwesomeIcon icon={faCartShopping} />

              {cartCount > 0 && (
                <span className="cart-count">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>

        {/* ==========================================
            MOBILE TOGGLE
        ========================================== */}

        <button
          type="button"
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* ==========================================
          MOBILE NAVIGATION
      ========================================== */}

      <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}>
        <NavLink
          to="/"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          }
        >
          About Us
        </NavLink>

        <NavLink
          to="/products"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/contact"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          }
        >
          Contact
        </NavLink>

        {/* MOBILE CART */}

        <NavLink
          to="/cart"
          onClick={closeMenu}
          className={({ isActive }) =>
            `mobile-cart-link ${isActive ? "active" : ""}`
          }
        >
          <span className="mobile-cart-icon">
            <FontAwesomeIcon icon={faCartShopping} />
          </span>

          <span>Cart</span>

          {cartCount > 0 && (
            <span className="mobile-cart-count">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </NavLink>
      </div>
    </header>
  );
};

export default Navbar;
