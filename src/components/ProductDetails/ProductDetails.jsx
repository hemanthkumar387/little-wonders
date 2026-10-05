import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHeart,
  faTruck,
  faHandHoldingHeart,
} from "@fortawesome/free-solid-svg-icons";

import products from "../../data/products";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((item) => item.id === Number(id));

  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || product?.image,
  );

  const [isFavorite, setIsFavorite] = useState(false);

  // Product not found
  if (!product) {
    return (
      <section className="product-not-found">
        <div className="product-not-found-content">
          <h1>Product Not Found</h1>

          <p>Sorry, we couldn't find the product you're looking for.</p>

          <Link
            to="/products"
            className="back-products-button"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Products
          </Link>
        </div>
      </section>
    );
  }

  const productImages =
    product.images?.length > 0 ? product.images : [product.image];

  return (
    <section className="product-details-page">
      <div className="product-details-container">
        {/* Back Button */}
        <Link to="/products" className="product-back-link"
        onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Products
        </Link>

        <div className="product-details-layout">
          {/* =========================
              IMAGE GALLERY
          ========================== */}
          <div className="product-gallery">
            <div className="product-main-image-wrapper">
              <img
                src={selectedImage}
                alt={product.name}
                className="product-main-image"
              />

              <button
                className={`product-details-favorite ${isFavorite ? "active" : ""}`}
                onClick={() => setIsFavorite((prev) => !prev)}
                aria-label="Add to favorites"
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="product-thumbnails">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`product-thumbnail ${
                      selectedImage === image ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* =========================
              PRODUCT INFORMATION
          ========================== */}
          <div className="product-information">
            <span className="product-tag">{product.tag}</span>

            <h1>{product.name}</h1>

            <div className="product-category">
              Category: <span>{product.category}</span>
            </div>

            <div className="product-divider"></div>

            <p className="product-description">{product.description}</p>

            {/* Handmade information */}
            <div className="product-features">
              <div className="product-feature">
                <div className="product-feature-icon">
                  <FontAwesomeIcon icon={faHandHoldingHeart} />
                </div>

                <div>
                  <strong>Made with Care</strong>
                  <span>Carefully handmade with attention to detail.</span>
                </div>
              </div>

              <div className="product-feature">
                <div className="product-feature-icon">
                  <FontAwesomeIcon icon={faTruck} />
                </div>

                <div>
                  <strong>Ready to Ship</strong>
                  <span>Carefully packed before delivery.</span>
                </div>
              </div>
            </div>

            <button className="add-to-cart-button">Add to Cart</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
