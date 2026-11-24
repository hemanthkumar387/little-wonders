
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

import PrivacyPolicyPage from "../../Pages/Policy/PrivacyPolicyPage";
import TermsConditionsPage from "../../Pages/Policy/TermsConditionsPage";

const Footer = () => {
  const [activePolicy, setActivePolicy] = useState(null);

  const closePolicy = () => setActivePolicy(null);

  useEffect(() => {
    if (!activePolicy) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closePolicy();
      }
    };

    document.addEventListener("keydown", handleEscape);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [activePolicy]);

  return (
    <>
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
          </div>

          {/* Explore */}
          <div className="footer-column footer-explore">
            <h3>Explore</h3>

            <Link to="/products">All Products</Link>
            <Link to="/products?category=Flower%20Bouquets">
              Flower Bouquets
            </Link>
            <Link to="/products?category=Fashion%20Accessories">
              Fashion Accessories
            </Link>
            <Link to="/products?category=Keychains">Keychains</Link>
            <Link to="/products?category=Wrist%20Bracelets">
              Bracelets
            </Link>
            <Link to="/products?category=Hair%20Accessories">
              Hair Accessories
            </Link>
          </div>

          {/* About Us */}
          <div className="footer-column footer-about">
            <h3>About Us</h3>

            <Link to="/about">Our Story</Link>
            <Link to="/about#why-us">Why Us</Link>
            <Link to="/about#our-mission">Our Mission</Link>
          </div>

          {/* Connect */}
          <div className="footer-column footer-connect">
            <h3>Connect</h3>

            <a
              href="https://ig.me/m/littlewonders_04"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>

            <a
              href="https://wa.me/919398723651?text=Hi"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>

            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=littlewonders0426@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Email
            </a>
          </div>

          {/* Customer Support */}
          <div className="footer-column footer-support">
            <h3>Customer Support</h3>

            <Link to="/reviews">Customer Reviews</Link>

            <button
              type="button"
              className="footer-policy-link"
              onClick={() => setActivePolicy("privacy")}
            >
              Privacy Policy
            </button>

            <button
              type="button"
              className="footer-policy-link"
              onClick={() => setActivePolicy("terms")}
            >
              Terms & Conditions
            </button>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© 2026 LittleWonders. All rights reserved.</p>

          <div className="footer-bottom-icon">♡</div>

          <p>
            Made with <span>♡</span> for craft lovers
          </p>
        </div>
      </footer>

      {/* Policy Popup */}
      {activePolicy && (
        <div
          className="footer-policy-overlay"
          onClick={closePolicy}
          role="presentation"
        >
          <div
            className="footer-policy-modal"
            role="dialog"
            aria-modal="true"
            aria-label={
              activePolicy === "privacy"
                ? "Privacy Policy"
                : "Terms and Conditions"
            }
            onClick={(event) => event.stopPropagation()}
          >
            <div className="footer-policy-modal-header">
              <span>
                {activePolicy === "privacy"
                  ? "Privacy Policy"
                  : "Terms & Conditions"}
              </span>

              <button
                type="button"
                className="footer-policy-close"
                onClick={closePolicy}
                aria-label="Close policy"
              >
                ×
              </button>
            </div>

            <div className="footer-policy-modal-content">
              {activePolicy === "privacy" ? (
                <PrivacyPolicyPage />
              ) : (
                <TermsConditionsPage />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
