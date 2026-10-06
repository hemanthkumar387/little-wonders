import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowLeft,
  faHeart,
  faTruck,
  faHandHoldingHeart,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";

import products from "../../data/products";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((item) => item.id === Number(id));

  /* ==========================================
     SELECTED IMAGE
  ========================================== */

  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || product?.image,
  );

  /* ==========================================
     WISHLIST STATE
  ========================================== */

  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem("littleWondersWishlist");

      const wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];

      return wishlistIds.includes(Number(id));
    } catch (error) {
      console.error("Failed to load wishlist:", error);

      return false;
    }
  });

  /* ==========================================
     PRODUCT NOT FOUND
  ========================================== */

  if (!product) {
    return (
      <section className="product-not-found">
        <div className="product-not-found-content">
          <h1>Product Not Found</h1>

          <p>Sorry, we couldn't find the product you're looking for.</p>

          <button
            type="button"
            className="back-products-button"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Products
          </button>
        </div>
      </section>
    );
  }

  /* ==========================================
     PRODUCT IMAGES
  ========================================== */

  const productImages =
    product.images?.length > 0 ? product.images : [product.image];

  /* ==========================================
     TOGGLE WISHLIST
  ========================================== */

  const toggleFavorite = () => {
    try {
      const savedWishlist = localStorage.getItem("littleWondersWishlist");

      const wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];

      let updatedWishlist;

      if (wishlistIds.includes(product.id)) {
        // REMOVE FROM WISHLIST

        updatedWishlist = wishlistIds.filter((itemId) => itemId !== product.id);

        setIsFavorite(false);

        toast(
          <div className="wishlist-toast">
            <span className="wishlist-toast-icon">
              <FontAwesomeIcon icon={faHeart} />
            </span>

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
        // ADD TO WISHLIST

        updatedWishlist = [...wishlistIds, product.id];

        setIsFavorite(true);

        toast(
          <div className="wishlist-toast">
            <span className="wishlist-toast-icon">
              <FontAwesomeIcon icon={faHeart} />
            </span>

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

      localStorage.setItem(
        "littleWondersWishlist",
        JSON.stringify(updatedWishlist),
      );
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  const addToCart = () => {
    try {
      const savedCart = localStorage.getItem("littleWondersCart");

      const cartItems = savedCart ? JSON.parse(savedCart) : [];

      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === product.id,
      );

      let updatedCart;

      if (existingItemIndex !== -1) {
        // Product already exists → increase quantity

        updatedCart = cartItems.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: (item.quantity || 1) + 1,
              }
            : item,
        );
      } else {
        // New product → add to cart

        updatedCart = [
          ...cartItems,
          {
            ...product,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem("littleWondersCart", JSON.stringify(updatedCart));

      // Tell navbar/cart that cart changed
      window.dispatchEvent(new Event("cartUpdated"));

      toast(
        <div className="cart-toast">
          <span className="cart-toast-icon">
            <FontAwesomeIcon icon={faCartShopping} />
          </span>

          <span className="cart-toast-content">
            <strong>{product.name}</strong>
            <small>Added to your cart</small>
          </span>
        </div>,
        {
          className: "cart-toast-wrapper added",
          autoClose: 2200,
          closeButton: true,
        },
      );
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  return (
    <section className="product-details-page">
      <div className="product-details-container">
        {/* ==========================================
            BACK BUTTON
        ========================================== */}

        <button
          type="button"
          className="product-back-link"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Products
        </button>

        <div className="product-details-layout">
          {/* ==========================================
              IMAGE GALLERY
          ========================================== */}

          <div className="product-gallery">
            <div className="product-main-image-wrapper">
              <img
                src={selectedImage}
                alt={product.name}
                className="product-main-image"
              />

              {/* =====================================
                  WISHLIST BUTTON
              ===================================== */}

              <button
                type="button"
                className={`product-details-favorite ${
                  isFavorite ? "active" : ""
                }`}
                onClick={toggleFavorite}
                aria-label={
                  isFavorite
                    ? `Remove ${product.name} from wishlist`
                    : `Add ${product.name} to wishlist`
                }
                title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
            </div>

            {/* ==========================================
                THUMBNAILS
            ========================================== */}

            {productImages.length > 1 && (
              <div className="product-thumbnails">
                {productImages.map((image, index) => (
                  <button
                    type="button"
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

          {/* ==========================================
              PRODUCT INFORMATION
          ========================================== */}

          <div className="product-information">
            <span className="product-tag">{product.tag}</span>

            <h1>{product.name}</h1>

            <div className="product-category">
              Category: <span>{product.category}</span>
            </div>

            <div className="product-divider"></div>

            <p className="product-description">{product.description}</p>

            {/* ==========================================
                HANDMADE INFORMATION
            ========================================== */}

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

            {/* ==========================================
                ADD TO CART
            ========================================== */}

            <button
              type="button"
              className="add-to-cart-button"
              onClick={addToCart}
            >
              <FontAwesomeIcon icon={faCartShopping} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
