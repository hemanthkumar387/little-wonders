import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
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

        <div className="navbar-right">
          {/* Desktop Navigation */}
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

          <div className="navbar-cart">
            <NavLink
              to="/cart"
              className="cart-link"
              aria-label="Shopping cart"
              onClick={closeMenu}
            >
              <FontAwesomeIcon icon={faCartShopping} />

              <span className="cart-count">0</span>
            </NavLink>
          </div>
        </div>

        {/* Mobile Toggle */}
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

      {/* Mobile Navigation */}
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
      </div>
    </header>
  );
};

export default Navbar;
