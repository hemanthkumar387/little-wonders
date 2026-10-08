import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import products from "../../data/products";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBorderAll,
  faKey,
  faSeedling,
  faWandMagicSparkles,
  faGem,
  faHeart,
  faArrowRight,
  faBagShopping,
  faTag,
  // faPlus,
} from "@fortawesome/free-solid-svg-icons";

import "./ProductCategories.css";

const categories = [
  {
    name: "All Products",
    icon: faBorderAll,
  },
  {
    name: "Flower Bouquets",
    icon: faSeedling,
  },
  {
    name: "Fashion Accessories",
    icon: faWandMagicSparkles,
  },
  {
    name: "Keychains",
    icon: faKey,
  },
  {
    name: "Wrist Bracelets",
    icon: faGem,
  },
];

const ProductCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const [sortOption, setSortOption] = useState("latest");

  const filteredProducts = useMemo(() => {
    let result =
      selectedCategory === "All Products"
        ? [...products]
        : products.filter((product) => product.category === selectedCategory);

    if (sortOption === "az") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [selectedCategory, sortOption]);

  return (
    <main className="products-page">
      {/* =====================================================
          BACKGROUND DECORATIONS
      ===================================================== */}

      <div className="products-bg-circle products-bg-circle-one"></div>

      <div className="products-bg-circle products-bg-circle-two"></div>

      <span className="products-bg-heart products-bg-heart-one">♡</span>

      <span className="products-bg-heart products-bg-heart-two">♡</span>

      <div className="products-bg-leaf products-bg-leaf-one">
        <FontAwesomeIcon icon={faSeedling} />
      </div>

      {/* =====================================================
          CATEGORY SECTION
      ===================================================== */}

      <section id="products" className="product-categories-section">
        <div className="product-section-heading">
          <p>EXPLORE OUR COLLECTION</p>

          <h2>
            Find Something
            <span> Handmade & Special</span>
          </h2>

          <div className="product-heading-line">
            <span></span>

            <FontAwesomeIcon icon={faHeart} />

            <span></span>
          </div>
        </div>

        {/* PRICE NOTE */}

        <div className="price-note">
          <FontAwesomeIcon icon={faTag} />

          <p>
            Please note:{" "}
            <strong>
              Prices may vary depending on the size and design of the product.
            </strong>
          </p>
        </div>

        {/* CATEGORY FILTER */}

        <div className="product-categories-scroll">
          {categories.map((category) => {
            const isActive = selectedCategory === category.name;

            return (
              <button
                type="button"
                key={category.name}
                className={`product-category-card ${isActive ? "active" : ""}`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="product-category-icon">
                  <FontAwesomeIcon icon={category.icon} />
                </div>

                <span>{category.name}</span>

                {isActive && <span className="category-active-dot"></span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="products-grid-section">
        {/* =================================================
            PRODUCTS HEADER
        ================================================= */}

        <div className="products-grid-header">
          <div className="products-heading-info">
            <div className="products-count-row">
              <span className="products-bag-icon">
                <FontAwesomeIcon icon={faBagShopping} />
              </span>

              <p className="products-showing">
                <strong>{filteredProducts.length}</strong>{" "}
                {filteredProducts.length === 1 ? "creation" : "creations"}
              </p>
            </div>

            <p className="products-selected-category">{selectedCategory}</p>
          </div>

          {/* SORT */}

          <div className="products-sort">
            <span>Sort by</span>

            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              aria-label="Sort products"
            >
              <option value="latest">Latest First</option>

              <option value="az">A - Z</option>
            </select>
          </div>
        </div>

        {/* =================================================
            PRODUCT CARDS
        ================================================= */}

        {filteredProducts.length > 0 && (
          <div className="products-grid">
            {filteredProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="product-card-link"
                style={{
                  "--card-index": index,
                }}
              >
                <article className="product-card">
                  {/* PRODUCT IMAGE */}

                  <div className="product-card-image">
                    <div className="product-image-frame">
                      <img src={product.image} alt={product.name} />
                    </div>
                  </div>

                  {/* PRODUCT DETAILS */}

                  <div className="product-card-content">
                    <h3>{product.name}</h3>

                    <p className="product-card-category">
                      {product.tag || product.category}
                    </p>

                    <div className="product-card-bottom">
                      <div className="product-card-price">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </div>

                      {/* ADD BUTTON */}

                      <span
                        className="product-add-button"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <FontAwesomeIcon icon={faArrowRight} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <div className="no-products-icon">
              <FontAwesomeIcon icon={faSeedling} />
            </div>

            <h3>No creations found</h3>

            <p>More handmade creations are coming soon.</p>

            <button
              type="button"
              onClick={() => setSelectedCategory("All Products")}
            >
              View All Products
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProductCategory;
