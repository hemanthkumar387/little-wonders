import { useState } from "react";
import "./FloatingSocials.css";

const FloatingSocials = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`floating-socials ${isOpen ? "open" : ""}`}>
      {/* Toggle button */}
      <button
        type="button"
        className="floating-social social-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close social links" : "Open social links"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          // Close / collapse icon
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 14 6-6 6 6" />
          </svg>
        ) : (
          // Social links icon

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 10v11H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3Z" />
            <path d="M7 10 12 3a2 2 0 0 1 2 2v5h5.5a2 2 0 0 1 2 2.4l-1.5 7A2 2 0 0 1 18 21H7" />
          </svg>
        )}
      </button>

      {/* Social links */}
      <div className="social-links">
        {/* Instagram */}
        <a
          href="https://www.instagram.com/littlewonders_04/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our Instagram"
          className="floating-social instagram"
          tabIndex={isOpen ? 0 : -1}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3zm5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm5.5-3a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z" />
          </svg>
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/919398723651?text=Hi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="floating-social whatsapp"
          tabIndex={isOpen ? 0 : -1}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.52 3.48A11.87 11.87 0 0 0 12.08 0C5.5 0 .14 5.35.13 11.93c0 2.1.55 4.15 1.61 5.96L0 24l6.27-1.64a11.94 11.94 0 0 0 5.8 1.48h.01c6.58 0 11.94-5.35 11.94-11.93 0-3.19-1.24-6.19-3.5-8.43zM12.08 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.24-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.45-9.9 9.91-9.9 2.64 0 5.12 1.03 6.98 2.89a9.83 9.83 0 0 1 2.9 6.99c0 5.46-4.45 9.89-9.89 9.89zm5.43-7.41c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
          </svg>
        </a>

        {/* YouTube */}
        <a
          href="https://www.youtube.com/@Hasini29-s9"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our YouTube channel"
          className="floating-social youtube"
          tabIndex={isOpen ? 0 : -1}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.7 15.8V8.2l6.1 3.8-6.1 3.8Z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default FloatingSocials;
