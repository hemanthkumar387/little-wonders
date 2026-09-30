import "./ProductsHero.css";

const ProductsHero = () => {
  return (
    <section className="product-hero-section">
      {/* Decorative elements */}

      <img
        src="/images/leaf-green.png"
        alt=""
        className="product-hero-decoration product-leaf-green"
      />

      <img
        src="/images/leaf-orange.png"
        alt=""
        className="product-hero-decoration product-leaf-orange"
      />

      <img
        src="/images/leaf-right.png"
        alt=""
        className="product-hero-decoration product-leaf-right"
      />

      <img
        src="/images/heart-top.png"
        alt=""
        className="product-hero-decoration product-heart-top"
      />

      <img
        src="/images/heart-left.png"
        alt=""
        className="product-hero-decoration product-heart-left"
      />

      <img
        src="/images/heart-bottom.png"
        alt=""
        className="product-hero-decoration product-heart-bottom"
      />

      {/* Background */}
      <div className="product-hero-background"></div>

      <div className="product-hero-overlay"></div>

      {/* Hero content */}
      <div className="product-hero-content">
        <p className="product-hero-eyebrow">Our Collection</p>

        <h1 className="product-hero-title">
          Handmade
          <br />
          <span>Products</span>
        </h1>

        <p className="product-hero-description">
           Explore a beautiful range of handcrafted pieces
          <br className="product-mobile-break" />
          made with care, creativity, and love.
        </p>
      </div>
    </section>
  );
};

export default ProductsHero;
