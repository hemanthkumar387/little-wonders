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
    name: "Flower Bouquet",
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
  //   {
  //     name: "Wrist Bands",
  //     icon: faPaw,
  //   },
  {
    name: "Wrist Bands",
    icon: faGem,
  },
];

const products = [
  {
    id: 1,
    name: "Crochet Flower Bouquet",
    category: "Flower Bouquet",
    tag: "Flower Bouquet",
    description: "A beautiful handmade flower bouquet.",
    image: "/myimages/flower.jpeg",
  },
  {
    id: 2,
    name: "Handmade Bunny Bag",
    category: "Home Decor",
    tag: "Home Decor",
    description: "Soft and cute handmade bunny bag.",
    image: "/myimages/bag.jpeg",
  },
  {
    id: 3,
    name: "Krishna KeyChain",
    category: "Handmade Keychains",
    tag: "Keychain",
    description: "Cute and colorful keychain.",
    image: "/myimages/keychain1.jpeg",
  },
  {
    id: 4,
    name: "Sunflower KeyChain",
    category: "Handmade Keychains",
    tag: "Keychain",
    description: "Cute and colorful keychain.",
    image: "/myimages/keychain.jpeg",
  },
  {
    id: 5,
    name: "Ribbon KeyChain",
    category: "Handmade Keychains",
    tag: "Keychain",
    description: "Cute and colorful keychains.",
    image: "/myimages/keychain2.jpeg",
  },
  {
    id: 6,
    name: "Star and Moon Keychains",
    category: "Handmade Keychains",
    tag: "Keychain",
    description: "Cute Star and Moon keychains.",
    image: "/myimages/keychain4.jpeg",
  },
  {
    id: 7,
    name: "Bow Keychains",
    category: "Handmade Keychains",
    tag: "Keychain",
    description: "A beautiful piece.",
    image: "/myimages/keychain5.jpeg",
  },
  {
    id: 8,
    name: "Flower Bouquet",
    category: "Flower Bouquet",
    tag: "Flower Bouquet",
    description: "A beautiful handmade flower bouquet.",
    image: "/myimages/flower1.jpeg",
  },
  {
    id: 9,
    name: "Wrist Band",
    category: "Wrist Bands",
    tag: "Bands",
    description: "A perfect little gift.",
    image: "/myimages/wrist_art1.jpeg",
  },
  {
    id: 10,
    name: "Wrist Band",
    category: "Wrist Bands",
    tag: "Bands",
    description: "A perfect little gift.",
    image: "/myimages/wrist_band.jpeg",
  },
];

const ProductCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All Products") {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <main className="products-page">
      {/* =====================================================
          CATEGORY SECTION
      ===================================================== */}

      <section className="product-categories-section">
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
                <div className="product-category-image">
                  {category.image ? (
                    <img src={category.image} alt={category.name} />
                  ) : (
                    <FontAwesomeIcon icon={category.icon} />
                  )}
                </div>

                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          PRODUCTS HEADER
      ===================================================== */}

      <section className="products-grid-section">
        <div className="products-grid-header">
          <p>
            Showing <strong>{filteredProducts.length}</strong> products
          </p>

          <div className="products-sort">
            <span>Sort by:</span>

            <select defaultValue="latest">
              <option value="latest">Latest First</option>

              <option value="name">Name</option>
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
            <h3>No products found</h3>

            <p>We are adding more handmade creations soon.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProductCategory;
