import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <a href="/" className="navbar-logo">
          <div className="logo-icon">
            ♡
          </div>

          <div className="logo-text">
            <span className="logo-title">LittleWonders</span>
            <span className="logo-subtitle">CREATE WITH LOVE</span>
          </div>
        </a>

        {/* Navigation */}
        <nav className="nav-links">
          <a href="/" className="nav-link active">
            Home
          </a>

          <a href="/products" className="nav-link">
            Products
          </a>

          <a href="/contact" className="nav-link">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;