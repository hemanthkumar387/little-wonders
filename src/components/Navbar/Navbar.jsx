import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const menuToggleRef = useRef(null);

  // Get the total quantity of items in the cart
  const getCartCount = () => {
    try {
      const savedCart = localStorage.getItem("littleWondersCart");

      if (!savedCart) return 0;

      const cartItems = JSON.parse(savedCart);

      if (!Array.isArray(cartItems)) return 0;

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

  // Lock background scrolling while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Update the cart count when cart data changes
  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  // Close the menu and return focus to the hamburger button
  const closeMenu = () => {
    setMenuOpen(false);
    menuToggleRef.current?.focus();
  };

  // Close the menu when Escape is pressed
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // Shared navigation link styling
  const desktopLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const mobileLinkClass = ({ isActive }) =>
    isActive ? "mobile-nav-link active" : "mobile-nav-link";

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
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

        {/* Desktop navigation */}
        <div className="navbar-right">
          <nav className="nav-links" aria-label="Main navigation">
            <NavLink to="/" end className={desktopLinkClass}>
              Home
            </NavLink>

            <NavLink to="/about" className={desktopLinkClass}>
              About Us
            </NavLink>

            <NavLink to="/products" className={desktopLinkClass}>
              Products
            </NavLink>

            <NavLink to="/contact" className={desktopLinkClass}>
              Contact
            </NavLink>
          </nav>
        </div>

        {/* Cart stays beside the hamburger on mobile */}
        <NavLink
          to="/cart"
          className={({ isActive }) => `cart-link ${isActive ? "active" : ""}`}
          aria-label={`Shopping cart with ${cartCount} items`}
        >
          <FontAwesomeIcon icon={faCartShopping} />

          {cartCount > 0 && (
            <span className="cart-count" aria-hidden="true">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </NavLink>

        {/* Mobile hamburger toggle */}
        <button
          ref={menuToggleRef}
          type="button"
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => {
            if (menuOpen) {
              closeMenu();
            } else {
              setMenuOpen(true);
            }
          }}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile navigation */}
      <nav
        ref={mobileMenuRef}
        id="mobile-navigation"
        className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <NavLink to="/" end className={mobileLinkClass} onClick={closeMenu}>
          Home
        </NavLink>

        <NavLink to="/about" className={mobileLinkClass} onClick={closeMenu}>
          About Us
        </NavLink>

        <NavLink to="/products" className={mobileLinkClass} onClick={closeMenu}>
          Products
        </NavLink>

        <NavLink to="/contact" className={mobileLinkClass} onClick={closeMenu}>
          Contact
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
