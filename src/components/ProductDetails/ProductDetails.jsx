import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHeart,
  faTruck,
  faHandHoldingHeart,
  faCartShopping,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import products from "../../data/products";
import "./ProductDetails.css";

const formatPrice = (price) => `₹${Number(price || 0).toLocaleString("en-IN")}`;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((item) => item.id === Number(id));

  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || product?.image,
  );
  const [quantity, setQuantity] = useState(1);

  const [selectedOptions, setSelectedOptions] = useState(() => {
    if (!product?.options) return {};
    return product.options.reduce((result, option) => {
      result[option.id] = option.choices?.[0]?.value ?? "";
      return result;
    }, {});
  });

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

  const productImages =
    product?.images?.length > 0
      ? product.images
      : [product?.image].filter(Boolean);

  const selectedOptionDetails = useMemo(() => {
    if (!product?.options) return [];
    return product.options.map((option) => {
      const choice = option.choices.find(
        (item) => item.value === selectedOptions[option.id],
      );
      return {
        id: option.id,
        label: option.label,
        value: choice?.value ?? "",
        choiceLabel: choice?.label ?? "",
        price: Number(choice?.price) || 0,
      };
    });
  }, [product, selectedOptions]);

  // Each option contributes its configured price. Size options use the full
  // size price; add-on options should use 0 or the additional charge.
  const currentPrice = useMemo(() => {
    if (!product) return 0;
    if (!product.options?.length) return Number(product.price) || 0;

    const sizeOption = product.options.find((option) =>
      ["size", "size", "pack", "set", "ribbon"].includes(option.id),
    );

    if (sizeOption) {
      const selectedSizeChoice = sizeOption.choices.find(
        (choice) => choice.value === selectedOptions[sizeOption.id],
      );
      const base = Number(selectedSizeChoice?.price ?? product.price) || 0;
      const addOns = product.options
        .filter((option) => option.id !== sizeOption.id)
        .reduce((sum, option) => {
          const choice = option.choices.find(
            (item) => item.value === selectedOptions[option.id],
          );
          return sum + (Number(choice?.price) || 0);
        }, 0);
      return base + addOns;
    }

    // Products without a size/pack/set option use product.price as their
    // base price; every selected option price is an additional charge.
    return (
      (Number(product.price) || 0) +
      selectedOptionDetails.reduce((sum, option) => sum + option.price, 0)
    );
  }, [product, selectedOptions, selectedOptionDetails]);

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

  const toggleFavorite = () => {
    try {
      const savedWishlist = localStorage.getItem("littleWondersWishlist");
      const wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];
      const updatedWishlist = wishlistIds.includes(product.id)
        ? wishlistIds.filter((itemId) => itemId !== product.id)
        : [...wishlistIds, product.id];

      localStorage.setItem(
        "littleWondersWishlist",
        JSON.stringify(updatedWishlist),
      );
      setIsFavorite(updatedWishlist.includes(product.id));

      toast(
        <div className="wishlist-toast">
          <span className="wishlist-toast-icon">
            <FontAwesomeIcon icon={faHeart} />
          </span>
          <span>
            <strong>{product.name}</strong>
            <small>
              {updatedWishlist.includes(product.id)
                ? "Added to the wishlist"
                : "Removed from the wishlist"}
            </small>
          </span>
        </div>,
        {
          className: `wishlist-toast-wrapper ${
            updatedWishlist.includes(product.id)
              ? "wishlist-added"
              : "wishlist-removed"
          }`,
          autoClose: 2200,
          closeButton: true,
        },
      );
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  const addToCart = () => {
    try {
      const savedCart = localStorage.getItem("littleWondersCart");
      const cartItems = savedCart ? JSON.parse(savedCart) : [];

      const optionSummary = selectedOptionDetails
        .map((option) => `${option.label}: ${option.choiceLabel}`)
        .filter((item) => item.split(": ")[1])
        .join(" | ");

      // A selected variant is a separate cart line. Same product with
      // different size/options should not overwrite or merge into another.
      const variantKey = `${product.id}::${JSON.stringify(selectedOptions)}`;
      const existingIndex = cartItems.findIndex(
        (item) => item.variantKey === variantKey,
      );

      const cartProduct = {
        ...product,
        productId: product.id,
        variantKey,
        quantity,
        price: currentPrice,
        basePrice: product.price,
        selectedOptions: { ...selectedOptions },
        optionSummary,
        variantLabel: optionSummary || "Standard",
      };

      let updatedCart;
      if (existingIndex >= 0) {
        updatedCart = cartItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: (Number(item.quantity) || 1) + quantity }
            : item,
        );
      } else {
        updatedCart = [...cartItems, cartProduct];
      }

      localStorage.setItem("littleWondersCart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));

      toast(
        <div className="cart-toast">
          <span className="cart-toast-icon">
            <FontAwesomeIcon icon={faCartShopping} />
          </span>
          <span className="cart-toast-content">
            <strong>{product.name}</strong>
            <small>
              {quantity} {quantity === 1 ? "item" : "items"} added ·{" "}
              {formatPrice(currentPrice)} each
            </small>
          </span>
        </div>,
        {
          className: "cart-toast-wrapper cart-added",
          autoClose: 2200,
          closeButton: true,
        },
      );
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      toast.error("Unable to add this product to your cart.");
    }
  };

  return (
    <section className="product-details-page">
      <div className="product-details-container">
        <button
          type="button"
          className="product-back-link"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Products
        </button>

        <div className="product-details-layout">
          <div className="product-gallery">
            <div className="product-main-image-wrapper">
              <img
                src={selectedImage}
                alt={product.name}
                className="product-main-image"
              />
              <button
                type="button"
                className={`product-details-favorite ${isFavorite ? "active" : ""}`}
                onClick={toggleFavorite}
                aria-label={
                  isFavorite ? "Remove from wishlist" : "Add to wishlist"
                }
                title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
            </div>

            {productImages.length > 1 && (
              <div className="product-thumbnails">
                {productImages.map((image, index) => (
                  <button
                    type="button"
                    key={image}
                    className={`product-thumbnail ${selectedImage === image ? "active" : ""}`}
                    onClick={() => setSelectedImage(image)}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-information">
            <span className="product-tag">{product.tag}</span>
            <h1>{product.name}</h1>
            <div className="product-category">
              Category: <span>{product.category}</span>
            </div>

            {product.options?.length > 0 && (
              <section
                className="product-customization"
                aria-label="Customize product"
              >
                <div className="customization-heading">
                  <div>
                    <span className="customization-kicker">MAKE IT YOURS</span>
                    <h2>Customize your piece</h2>
                  </div>
                  <span className="customization-check">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                </div>

                {product.options.map((option) => {
                  const optionName =
                    `${option.id} ${option.label}`.toLowerCase();
                  const isSizeOption = /size|pack|set|ribbon/.test(optionName);
                  const isColorOption = /color|colour|yarn/.test(optionName);
                  const colorForChoice = (choice) => {
                    const text =
                      `${choice.label} ${choice.value}`.toLowerCase();
                    if (/pink|strawberry/.test(text)) return "#df9a9b";
                    if (/yellow|sunshine/.test(text)) return "#f4df9b";
                    if (/sage|green|morpankh/.test(text)) return "#65998d";
                    if (/cream|white|classic|mixed/.test(text))
                      return "#f4e4a8";
                    if (/blue/.test(text)) return "#729bc4";
                    if (/purple|lavender/.test(text)) return "#ad94c8";
                    if (/custom/.test(text))
                      return "conic-gradient(#e8a0a0, #f3d982, #70a99a, #b49ad3, #e8a0a0)";
                    return "#77716d";
                  };

                  return (
                    <div
                      className={`custom-option ${isSizeOption ? "custom-option-size" : ""} ${isColorOption ? "custom-option-color" : ""}`}
                      key={option.id}
                    >
                      <label id={`option-label-${option.id}`}>
                        {option.label}
                        {option.required && (
                          <span className="required-mark"> *</span>
                        )}
                      </label>

                      {isSizeOption ? (
                        <div
                          className="size-choice-list"
                          role="group"
                          aria-labelledby={`option-label-${option.id}`}
                        >
                          {option.choices.map((choice) => {
                            const isSelected =
                              selectedOptions[option.id] === choice.value;
                            return (
                              <button
                                type="button"
                                key={choice.value}
                                className={`size-choice ${isSelected ? "selected" : ""}`}
                                aria-pressed={isSelected}
                                onClick={() =>
                                  setSelectedOptions((previous) => ({
                                    ...previous,
                                    [option.id]: choice.value,
                                  }))
                                }
                              >
                                <span>{choice.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : isColorOption ? (
                        <div
                          className="color-choice-list"
                          role="group"
                          aria-labelledby={`option-label-${option.id}`}
                        >
                          {option.choices.map((choice) => {
                            const isSelected =
                              selectedOptions[option.id] === choice.value;
                            return (
                              <button
                                type="button"
                                key={choice.value}
                                className={`color-choice ${isSelected ? "selected" : ""}`}
                                aria-label={choice.label}
                                aria-pressed={isSelected}
                                title={choice.label}
                                onClick={() =>
                                  setSelectedOptions((previous) => ({
                                    ...previous,
                                    [option.id]: choice.value,
                                  }))
                                }
                              >
                                <span
                                  className="color-swatch"
                                  style={{ background: colorForChoice(choice) }}
                                />
                                <span className="color-choice-name">
                                  {choice.label}
                                </span>
                                {isSelected && (
                                  <span className="color-selected-check">
                                    <FontAwesomeIcon icon={faCheck} />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : option.choices.length <= 3 ? (
                        <div
                          className="feature-choice-list"
                          role="group"
                          aria-labelledby={`option-label-${option.id}`}
                        >
                          {option.choices.map((choice) => {
                            const isSelected =
                              selectedOptions[option.id] === choice.value;
                            return (
                              <button
                                type="button"
                                key={choice.value}
                                className={`feature-choice ${isSelected ? "selected" : ""}`}
                                aria-pressed={isSelected}
                                onClick={() =>
                                  setSelectedOptions((previous) => ({
                                    ...previous,
                                    [option.id]: choice.value,
                                  }))
                                }
                              >
                                <span>{choice.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="custom-select-wrap">
                          <select
                            id={`option-${option.id}`}
                            value={selectedOptions[option.id] ?? ""}
                            onChange={(event) =>
                              setSelectedOptions((previous) => ({
                                ...previous,
                                [option.id]: event.target.value,
                              }))
                            }
                          >
                            {option.choices.map((choice) => (
                              <option key={choice.value} value={choice.value}>
                                {choice.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            )}

            <div className="product-quantity-section">
              <span className="quantity-label">Quantity</span>
              <div className="products-quantity-control">
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() =>
                    setQuantity((previous) => Math.max(1, previous - 1))
                  }
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() =>
                    setQuantity((previous) => Math.min(99, previous + 1))
                  }
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="product-price">{formatPrice(currentPrice)}</div>
            <p className="variant-price-note">
              Price updates based on your selections.
            </p>
            <div className="product-divider" />
            <p className="product-description">{product.description}</p>

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

            <div className="product-total-row">
              <span>
                Item total ({quantity} {quantity === 1 ? "item" : "items"})
              </span>
              <strong>{formatPrice(currentPrice * quantity)}</strong>
            </div>

            <button
              type="button"
              className="add-to-cart-button"
              onClick={addToCart}
            >
              <FontAwesomeIcon icon={faCartShopping} />
              <span>Add to Cart</span>
              {/* <strong>{formatPrice(currentPrice)}</strong> */}
            </button>
            <p className="product-order-note">
              No online payment here. We'll confirm your order details after you
              submit checkout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
