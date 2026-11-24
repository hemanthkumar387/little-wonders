import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faCircleUser,
  faChevronDown,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "./Navbar.css";

const API_URL = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const mobileMenuRef = useRef(null);
  const menuToggleRef = useRef(null);
  const accountRef = useRef(null);

  const navigate = useNavigate();

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

  // Verify customer authentication using the HTTP-only cookie
  const checkCustomerSession = async () => {
    try {
      const response = await fetch(`${API_URL}/api/customer/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setIsCustomerLoggedIn(false);
        localStorage.removeItem("littleWondersCustomer");
        return false;
      }

      const data = await response.json();

      const customer = data.customer || data;

      setIsCustomerLoggedIn(true);

      // Store customer details only as cached profile data.
      // Authentication is verified by the backend cookie.
      if (customer && typeof customer === "object") {
        localStorage.setItem("littleWondersCustomer", JSON.stringify(customer));
      }

      return true;
    } catch (error) {
      console.error("Failed to verify customer session:", error);
      setIsCustomerLoggedIn(false);
      return false;
    } finally {
      setAuthChecked(true);
    }
  };

  // Check customer session when Navbar loads
  useEffect(() => {
    checkCustomerSession();
  }, []);

  // Keep login status updated throughout the application
  useEffect(() => {
    const updateAuthStatus = () => {
      checkCustomerSession();
    };

    window.addEventListener("customerAuthChanged", updateAuthStatus);

    return () => {
      window.removeEventListener("customerAuthChanged", updateAuthStatus);
    };
  }, []);

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

  // Lock background scrolling while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Automatically close mobile menu when switching to tablet/desktop
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 769px)");

    const handleViewportChange = (event) => {
      if (event.matches) {
        setMenuOpen(false);
        setAccountOpen(false);
        document.body.style.overflow = "";
      }
    };

    if (mediaQuery.matches) {
      setMenuOpen(false);
      setAccountOpen(false);
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleViewportChange);
    } else {
      mediaQuery.addListener(handleViewportChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleViewportChange);
      } else {
        mediaQuery.removeListener(handleViewportChange);
      }

      document.body.style.overflow = "";
    };
  }, []);

  // Close the mobile menu
  const closeMenu = () => {
    setMenuOpen(false);
    menuToggleRef.current?.focus();
  };

  // Logout customer using the HTTP-only cookie
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/customer/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setIsCustomerLoggedIn(false);
      setAccountOpen(false);
      setMenuOpen(false);

      // Remove cached profile information.
      // The authentication cookie is cleared by the backend.
      localStorage.removeItem("littleWondersCustomer");
      localStorage.removeItem("littleWondersCustomerToken");

      window.dispatchEvent(new Event("customerAuthChanged"));

      toast.success("You have been logged out successfully.");
      navigate("/");
    } catch (error) {
      console.error("Customer logout error:", error);
      toast.error("Unable to log out. Please try again.");
    }
  };

  // Close account dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Close menus when Escape is pressed
  useEffect(() => {
    if (!menuOpen && !accountOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setAccountOpen(false);

        if (menuOpen) {
          closeMenu();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, accountOpen]);

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

            <NavLink to="/reviews" className={desktopLinkClass}>
              Reviews
            </NavLink>

            <NavLink to="/contact" className={desktopLinkClass}>
              Contact
            </NavLink>
          </nav>
        </div>

        {/* Customer login / account */}
        <div className="navbar-account" ref={accountRef}>
          {!isCustomerLoggedIn ? (
            <Link to="/login" className="navbar-login">
              <FontAwesomeIcon icon={faCircleUser} />
              <span>Login</span>
            </Link>
          ) : (
            <div className="account-dropdown-wrapper">
              <button
                type="button"
                className={`navbar-account-button ${
                  accountOpen ? "account-button-open" : ""
                }`}
                onClick={() => setAccountOpen((previous) => !previous)}
                aria-expanded={accountOpen}
                aria-haspopup="true"
              >
                <FontAwesomeIcon icon={faCircleUser} />
                <span>My Account</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`account-chevron ${
                    accountOpen ? "account-chevron-open" : ""
                  }`}
                />
              </button>

              {accountOpen && (
                <div className="account-dropdown">
                  <Link
                    to="/profile"
                    className="account-dropdown-link"
                    onClick={() => setAccountOpen(false)}
                  >
                    <FontAwesomeIcon icon={faCircleUser} />
                    <span>My Profile / Orders</span>
                  </Link>

                  <button
                    type="button"
                    className="account-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Shopping cart */}
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
              setAccountOpen(false);
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

        <NavLink to="/reviews" className={mobileLinkClass} onClick={closeMenu}>
          Reviews
        </NavLink>

        <NavLink to="/contact" className={mobileLinkClass} onClick={closeMenu}>
          Contact
        </NavLink>

        {isCustomerLoggedIn ? (
          <>
            <NavLink
              to="/profile"
              className={mobileLinkClass}
              onClick={closeMenu}
            >
              My Profile / Orders
            </NavLink>

            <button
              type="button"
              className="mobile-logout-button"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className={`${mobileLinkClass} mobile-login-link`}
            onClick={closeMenu}
          >
            <FontAwesomeIcon icon={faCircleUser} />
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
