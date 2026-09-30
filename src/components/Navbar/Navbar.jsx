import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
