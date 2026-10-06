import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import products from "../../data/products";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBorderAll,
  faKey,
  faSeedling,
  // faHouse,
  faWandMagicSparkles,
  // faGift,
  faGem,
  faHeart,
  faArrowRight,
  faBagShopping,
  faTag,
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
    name: "Hair Accessories",
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

  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem("littleWondersWishlist");
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("littleWondersWishlist", JSON.stringify(favorites));
  }, [favorites]);

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

  const toggleFavorite = (productId) => {
    const product = products.find((item) => item.id === productId);

    const isAlreadyFavorite = favorites.includes(productId);

    setFavorites((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }

      return [...current, productId];
    });

    if (isAlreadyFavorite) {
      toast(
        <div className="wishlist-toast">
          <span className="wishlist-toast-icon">♡</span>

          <span>
            <strong>{product.name}</strong>
            <small>Removed from the wishlist</small>
          </span>
        </div>,
        {
          className: "wishlist-toast-wrapper removed",
          autoClose: 2200,
          closeButton: true,
        },
      );
    } else {
      toast(
        <div className="wishlist-toast">
          <span className="wishlist-toast-icon">♥</span>

          <span>
            <strong>{product.name}</strong>
            <small>Added to the wishlist</small>
          </span>
        </div>,
        {
          className: "wishlist-toast-wrapper added",
          autoClose: 2200,
          closeButton: true,
        },
      );
    }
  };

  return (
    <main className="products-page">
      {/* Background Decorations */}

      <div className="products-bg-circle products-bg-circle-one"></div>

      <div className="products-bg-circle products-bg-circle-two"></div>

      <span className="products-bg-heart products-bg-heart-one">♡</span>

      <span className="products-bg-heart products-bg-heart-two">♡</span>

      <div className="products-bg-leaf products-bg-leaf-one">
        <FontAwesomeIcon icon={faSeedling} />
      </div>

      {/* ==========================================
          CATEGORY SECTION
      ========================================== */}

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

        <div className="price-note">
          <FontAwesomeIcon icon={faTag} />

          <p>
            Please note:{" "}
            <strong>
              Prices may vary depending on the size and design of the product.
            </strong>
          </p>
        </div>

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

      {/* ==========================================
          PRODUCTS SECTION
      ========================================== */}

      <section className="products-grid-section">
        {/* HEADER */}

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
            >
              <option value="latest">Latest First</option>

              <option value="az">A - Z</option>
            </select>
          </div>
        </div>

        {/* PRODUCT GRID */}

        <div className="products-grid">
          {filteredProducts.map((product, index) => {
            const isFavorite = favorites.includes(product.id);

            return (
              <article
                className="product-card"
                key={product.id}
                style={{
                  "--card-index": index,
                }}
              >
                {/* IMAGE */}

                <div className="product-card-image">
                  <img src={product.image} alt={product.name} />

                  <span className="product-image-shine"></span>

                  <button
                    type="button"
                    className={`product-favorite ${
                      isFavorite ? "favorite-active" : ""
                    }`}
                    aria-label={
                      isFavorite
                        ? `Remove ${product.name} from wishlist`
                        : `Add ${product.name} to wishlist`
                    }
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                </div>

                {/* CONTENT */}

                <div className="product-card-content">
                  <span className="product-card-tag">{product.tag}</span>

                  <h3>{product.name}</h3>

                  {/* <p>{product.description}</p> */}

                  <Link
                    to={`/products/${product.id}`}
                    className="product-details-button"
                  >
                    <span>View Details</span>

                    <span className="product-button-icon">
                      <FontAwesomeIcon icon={faArrowRight} />
                    </span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* EMPTY STATE */}

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <FontAwesomeIcon icon={faSeedling} />

            <h3>No creations found</h3>

            <p>More handmade creations are coming soon.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProductCategory;
