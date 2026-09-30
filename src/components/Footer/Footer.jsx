import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img
              src="/images/logo.png"
              alt="LittleWonders"
              className="footer-logo-image"
            />

            <div>
              <div className="footer-logo-title">LittleWonders</div>

              <div className="footer-logo-subtitle">
                NURTURE. GROW. INSPIRE.
              </div>
            </div>
          </div>

          <p className="footer-description">
            Handmade pieces made with care
            <br />
            for a warmer, kinder world.
          </p>

          <div className="footer-socials">
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="social-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />

                <circle cx="12" cy="12" r="4" />

                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>

            {/* WhatsApp */}
            <a href="#" aria-label="WhatsApp" className="social-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L4 20l1.2-3.6A8.5 8.5 0 1 1 20.5 11.5Z" />

                <path d="M8.5 8.5c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.2.4-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.5.8-.4.2-1 .3-1.5.1-2.8-.8-5-3-5.8-5.8-.2-.5-.1-1.1.1-1.5Z" />
              </svg>
            </a>

            {/* YouTube */}
            <a href="#" aria-label="YouTube" className="social-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8Z" />

                <path d="M9.7 15.8 15.8 12 9.7 8.2v7.6Z" fill="#fbf4e9" />
              </svg>
            </a>
          </div>
        </div>

        {/* Explore */}
        <div className="footer-column">
          <h3>Explore</h3>

          <a href="/products">All Products</a>
          <a href="/categories">Categories</a>
          <a href="/new-arrivals">New Arrivals</a>
          <a href="/collection">Our Collection</a>
        </div>

        {/* About */}
        <div className="footer-column">
          <h3>About</h3>

          <a href="/about">Our Story</a>
          <a href="/process">Our Process</a>
          <a href="/why-handmade">Why Handmade</a>
          <a href="/contact">Contact</a>
        </div>

        {/* Connect */}
        <div className="footer-column">
          <h3>Connect</h3>

          <a href="#">Instagram</a>
          <a href="#">WhatsApp</a>
          <a href="#">Email</a>
        </div>
      </div>

      {/* Footer Bottom */}

      <div className="footer-bottom">
        <p>© 2026 Handmade. All rights reserved.</p>

        <div className="footer-bottom-icon">♡</div>

        <p>
          Made with <span>♡</span> for craft lovers
        </p>
      </div>
    </footer>
  );
};

export default Footer;
