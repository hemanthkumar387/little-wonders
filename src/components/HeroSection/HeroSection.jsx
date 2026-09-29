import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      {/* Decorative elements */}

      <img
        src="/images/leaf-green.png"
        alt=""
        className="hero-decoration leaf-green"
      />

      <img
        src="/images/leaf-orange.png"
        alt=""
        className="hero-decoration leaf-orange"
      />

      <img
        src="/images/leaf-right.png"
        alt=""
        className="hero-decoration leaf-right"
      />

      <img
        src="/images/heart-top.png"
        alt=""
        className="hero-decoration heart-top"
      />

      <img
        src="/images/heart-left.png"
        alt=""
        className="hero-decoration heart-left"
      />

      <img
        src="/images/heart-bottom.png"
        alt=""
        className="hero-decoration heart-bottom"
      />

      {/* Background */}
      <div className="hero-background"></div>

      <div className="hero-overlay"></div>

      {/* Hero content */}
      <div className="hero-content">
        <p className="hero-eyebrow">HANDMADE COLLECTION</p>

        <h1 className="hero-title">
          Made by Hand.
          <br />
          <span>Made to Be Loved.</span>
        </h1>

        <p className="hero-description">
          Discover unique handmade creations crafted
          <br className="desktop-break" />
          with care, creativity, and a personal touch.
        </p>

        <a href="/products" className="hero-button">
          <span>Explore Our Collection</span>
          <span className="hero-button-arrow">→</span>
        </a>

        <div className="hero-features">
          <div className="hero-feature">
            <div className="feature-icon feature-leaf">♧</div>

            <div className="feature-content">
              <strong>Unique</strong>
              <span>Creations</span>
            </div>
          </div>

          <div className="hero-feature">
            <div className="feature-icon feature-heart">♡</div>

            <div className="feature-content">
              <strong>Handmade</strong>
              <span>with Care</span>
            </div>
          </div>

          <div className="hero-feature">
            <div className="feature-icon feature-flower">✿</div>

            <div className="feature-content">
              <strong>Creative &</strong>
              <span>Meaningful</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
