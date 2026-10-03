import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBorderAll,
  faSeedling,
  faHouse,
  faGift,
  faGem,
  faHeart,
  faArrowRight,
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
    name: "Home Decor",
    icon: faHouse,
  },
  {
    name: "Handmade Keychains",
    icon: faGift,
  },
  {
    name: "Wrist Bands",
    icon: faGem,
  },
];

const products = [
  {
    id: 1,
    name: "Crochet Flower Bouquet",
    category: "Flower Bouquets",
    tag: "Flower Bouquet",
    description: "A beautiful handmade flower bouquet.",
    image: "/myimages/flower.jpeg",
  },
  {
    id: 2,
    name: "Handmade Bunny Bag",
    category: "Home Decor",
    tag: "Home Decor",
    description: "A soft and beautifully crafted handmade bag.",
    image: "/myimages/bag.jpeg",
  },
  {
    id: 3,
    name: "Krishna Keychain",
    category: "Handmade Keychains",
    tag: "Keychain",
    description: "A colorful handmade Krishna keychain.",
    image: "/myimages/keychain1.jpeg",
  },
  {
    id: 4,
    name: "Sunflower Keychain",
    category: "Handmade Keychains",
    tag: "Keychain",
    description: "A cheerful handmade sunflower keychain.",
    image: "/myimages/keychain.jpeg",
  },
  {
    id: 5,
    name: "Ribbon Keychain",
    category: "Handmade Keychains",
    tag: "Keychain",
    description: "A cute handmade ribbon keychain.",
    image: "/myimages/keychain2.jpeg",
  },
  {
    id: 6,
    name: "Star & Moon Keychains",
    category: "Handmade Keychains",
    tag: "Keychain",
    description: "Beautiful handmade star and moon charms.",
    image: "/myimages/keychain4.jpeg",
  },
  {
    id: 7,
    name: "Bow Keychain",
    category: "Handmade Keychains",
    tag: "Keychain",
    description: "A delicate handmade bow keychain.",
    image: "/myimages/keychain5.jpeg",
  },
  {
    id: 8,
    name: "Handmade Flower Bouquet",
    category: "Flower Bouquets",
    tag: "Flower Bouquet",
    description: "A colorful bouquet made with care.",
    image: "/myimages/flower1.jpeg",
  },
  {
    id: 9,
    name: "Handmade Wrist Band",
    category: "Wrist Bands",
    tag: "Wrist Band",
    description: "A simple handmade band for everyday wear.",
    image: "/myimages/wrist_art1.jpeg",
  },
  {
    id: 10,
    name: "Crochet Wrist Band",
    category: "Wrist Bands",
    tag: "Wrist Band",
    description: "A comfortable handmade wrist band.",
    image: "/myimages/wrist_band.jpeg",
  },
];

const ProductCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  // Sort option
  const [sortOption, setSortOption] = useState("latest");

  const filteredProducts = useMemo(() => {
    // Filter products by category
    let result =
      selectedCategory === "All Products"
        ? [...products]
        : products.filter((product) => product.category === selectedCategory);

    // Sort products
    if (sortOption === "az") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortOption === "za") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    // latest = original product order
    return result;
  }, [selectedCategory, sortOption]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <main className="products-page">
      {/* Decorative background elements */}

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

      <section className="product-categories-section">
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

        <div className="product-categories-scroll">
          {categories.map((category) => {
            const isActive = selectedCategory === category.name;

            return (
              <button
                type="button"
                key={category.name}
                className={`product-category-card ${isActive ? "active" : ""}`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="product-category-icon">
                  <FontAwesomeIcon icon={category.icon} />
                </div>

                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="products-grid-section">
        <div className="products-grid-header">
          <div>
            <p className="products-showing">
              Showing <strong>{filteredProducts.length}</strong>{" "}
              {filteredProducts.length === 1 ? "creation" : "creations"}
            </p>

            <p className="products-selected-category">{selectedCategory}</p>
          </div>

          {/* SORT */}

          <div className="products-sort">
            <span>Sort by:</span>

            <select value={sortOption} onChange={handleSortChange}>
              <option value="latest">Latest First</option>

              <option value="az">A - Z</option>

              <option value="za">Z - A</option>
            </select>
          </div>
        </div>

        {/* =====================================================
            PRODUCT CARDS
        ===================================================== */}

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              {/* IMAGE */}

              <div className="product-card-image">
                <img src={product.image} alt={product.name} />

                <button
                  type="button"
                  className="product-favorite"
                  aria-label={`Add ${product.name} to favorites`}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
              </div>

              {/* CONTENT */}

              <div className="product-card-content">
                <span className="product-card-tag">{product.tag}</span>

                <h3>{product.name}</h3>

                <p>{product.description}</p>

                <Link
                  to={`/products/${product.id}`}
                  className="product-details-button"
                >
                  <span>View Details</span>

                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* NO PRODUCTS */}

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
