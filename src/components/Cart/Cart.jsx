import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faHeart,
  faTrash,
  faArrowRight,
  faBagShopping,
  faArrowLeft,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import products from "../../data/products";

import "./Cart.css";

const CartPage = () => {
  const getCartItemKey = (item) =>
    item.variantKey ||
    `${item.id ?? item.productId}-${JSON.stringify(item.selectedOptions || {})}`;

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem("littleWondersCart");

      if (!savedCart) return [];

      const cartData = JSON.parse(savedCart);

      return cartData

        .map((item) => {
          const productId = Number(item.id ?? item.productId);

          const product = products.find(
            (productItem) => productItem.id === productId,
          );

          if (!product) return null;

          return {
            ...product,

            ...item,

            id: product.id,

            productId: product.id,

            price: Number(item.price ?? product.price),

            quantity: Math.max(1, Number(item.quantity) || 1),

            selectedOptions: item.selectedOptions || {},

            variantLabel: item.variantLabel || "",

            optionSummary: item.optionSummary || "",

            variantKey:
              item.variantKey ||
              `${product.id}-${JSON.stringify(item.selectedOptions || {})}`,
          };
        })

        .filter(Boolean);
    } catch (error) {
      console.error("Failed to load cart:", error);

      return [];
    }
  };

  const loadWishlist = () => {
    try {
      const savedWishlist = localStorage.getItem("littleWondersWishlist");

      const wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];

      return products.filter((product) => wishlistIds.includes(product.id));
    } catch (error) {
      console.error("Failed to load wishlist:", error);

      return [];
    }
  };

  const [cartItems, setCartItems] = useState(loadCart);

  const [wishlist, setWishlist] = useState(loadWishlist);

  const [showCheckout, setShowCheckout] = useState(false);

  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const [orderStatus, setOrderStatus] = useState({
    type: "",

    message: "",
  });

  const [checkoutForm, setCheckoutForm] = useState({
    name: "",

    phone: "",

    email: "",

    address: "",

    city: "",

    pincode: "",

    notes: "",
  });

  const handleCheckoutChange = (event) => {
    const { name, value } = event.target;

    setCheckoutForm((previous) => ({
      ...previous,

      [name]: value,
    }));
  };

  const handleCheckoutSubmit = async (event) => {
    event.preventDefault();

    if (isSubmittingOrder) return;

    if (!cartItems.length) {
      setOrderStatus({
        type: "error",

        message: "Your cart is empty. Please add a product first.",
      });

      return;
    }

    const { name, phone, email, address, city, pincode, notes } = checkoutForm;

    if (
      !name.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !pincode.trim()
    ) {
      setOrderStatus({
        type: "error",

        message: "Please complete all required fields.",
      });

      return;
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      setOrderStatus({
        type: "error",

        message: "Please enter a valid 10-digit phone number.",
      });

      return;
    }

    if (!/^[0-9]{6}$/.test(pincode.trim())) {
      setOrderStatus({
        type: "error",

        message: "Please enter a valid 6-digit PIN code.",
      });

      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setOrderStatus({
        type: "error",

        message: "Please enter a valid email address.",
      });

      return;
    }

    const orderItems = cartItems.map((item) => ({
      productId: item.id,

      name: item.name,

      quantity: item.quantity,

      price: Number(item.price) || 0,

      subtotal: (Number(item.price) || 0) * item.quantity,

      variantKey: getCartItemKey(item),

      variantLabel: item.variantLabel || "",

      optionSummary: item.optionSummary || "",

      selectedOptions: item.selectedOptions || {},
    }));

    setIsSubmittingOrder(true);
    setCountdown(30);
    setOrderStatus({ type: "", message: "" });

    const controller = new AbortController();
    const requestTimeout = window.setTimeout(() => controller.abort(), 30000);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, "");

      const response = await fetch(`${apiBaseUrl}/api/checkout`, {
        method: "POST",
        signal: controller.signal,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          customer: {
            name: name.trim(),

            phone: phone.trim(),

            email: email.trim(),

            address: address.trim(),

            city: city.trim(),

            pincode: pincode.trim(),

            notes: notes.trim(),
          },

          items: orderItems,

          total: totalAmount,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to submit your request. Please try again.",
        );
      }

      // Keep a snapshot for the confirmation screen before clearing the cart/form.
      setSubmittedOrder({
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          notes: notes.trim(),
        },
        items: orderItems,
        total: totalAmount,
        totalItems: orderItems.reduce((sum, item) => sum + item.quantity, 0),
        submittedAt: new Date(),
      });

      setOrderStatus({
        type: "success",
        message:
          "Thank you for choosing LittleWonders! We've received your order request. Our team will contact you shortly to confirm availability, delivery details, and the final order amount.",
      });

      // Clear the cart only after the server confirms the request was sent.

      localStorage.removeItem("littleWondersCart");

      setCartItems([]);

      window.dispatchEvent(new Event("cartUpdated"));

      setCheckoutForm({
        name: "",

        phone: "",

        email: "",

        address: "",

        city: "",

        pincode: "",

        notes: "",
      });
    } catch (error) {
      console.error("Checkout submission failed:", error);

      setOrderStatus({
        type: "error",
        message:
          error.name === "AbortError"
            ? "We couldn’t complete your request within 30 seconds. Please check your connection and try again."
            : error.message || "Something went wrong. Please try again in a moment.",
      });
    } finally {
      window.clearTimeout(requestTimeout);
      setIsSubmittingOrder(false);
    }
  };

  useEffect(() => {
    if (!isSubmittingOrder) return;

    const intervalId = window.setInterval(() => {
      setCountdown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isSubmittingOrder]);

  useEffect(() => {
    const syncCartAndWishlist = () => {
      setCartItems(loadCart());

      setWishlist(loadWishlist());
    };

    window.addEventListener("storage", syncCartAndWishlist);

    window.addEventListener("cartUpdated", syncCartAndWishlist);

    window.addEventListener("wishlistUpdated", syncCartAndWishlist);

    return () => {
      window.removeEventListener("storage", syncCartAndWishlist);

      window.removeEventListener("cartUpdated", syncCartAndWishlist);

      window.removeEventListener("wishlistUpdated", syncCartAndWishlist);
    };
  }, []);

  const saveCart = (items) => {
    const cartData = items.map((item) => ({
      ...item,

      productId: item.id,

      variantKey: getCartItemKey(item),

      quantity: item.quantity,

      price: Number(item.price) || 0,

      selectedOptions: item.selectedOptions || {},

      variantLabel: item.variantLabel || "",

      optionSummary: item.optionSummary || "",
    }));

    localStorage.setItem("littleWondersCart", JSON.stringify(cartData));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQuantity = (variantKey) => {
    const updatedCart = cartItems.map((item) =>
      getCartItemKey(item) === variantKey
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    );

    setCartItems(updatedCart);

    saveCart(updatedCart);
  };

  const decreaseQuantity = (variantKey) => {
    const currentItem = cartItems.find(
      (item) => getCartItemKey(item) === variantKey,
    );

    if (!currentItem) return;

    let updatedCart;

    if (currentItem.quantity <= 1) {
      updatedCart = cartItems.filter(
        (item) => getCartItemKey(item) !== variantKey,
      );
    } else {
      updatedCart = cartItems.map((item) =>
        getCartItemKey(item) === variantKey
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
    }

    setCartItems(updatedCart);

    saveCart(updatedCart);
  };

  const removeCartItem = (variantKey) => {
    const updatedCart = cartItems.filter(
      (item) => getCartItemKey(item) !== variantKey,
    );

    setCartItems(updatedCart);

    saveCart(updatedCart);
  };

  const removeFromWishlist = (productId) => {
    try {
      const savedWishlist = localStorage.getItem("littleWondersWishlist");

      const wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];

      const updatedWishlist = wishlistIds.filter((id) => id !== productId);

      localStorage.setItem(
        "littleWondersWishlist",

        JSON.stringify(updatedWishlist),
      );

      setWishlist((current) =>
        current.filter((product) => product.id !== productId),
      );

      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Failed to remove wishlist item:", error);
    }
  };

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,

    0,
  );

  const totalAmount = cartItems.reduce(
    (total, item) => total + (Number(item.price) || 0) * item.quantity,

    0,
  );

  const hasCartItems = cartItems.length > 0;

  const hasWishlistItems = wishlist.length > 0;

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const getItemTotal = (product) =>
    (Number(product.price) || 0) * product.quantity;

  useEffect(() => {
    if (!showCheckout) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showCheckout]);

  return (
    <main className="cart-page">
      <section className="cart-main-section">
        <div className="cart-container">
          <header className="cart-page-header">
            <div className="cart-heading-left">
              {/* <span className="cart-page-label">LITTLEWONDERS</span> */}

              <h1>My Shopping Cart</h1>

              <p>Review your handmade favourites before checking out.</p>
            </div>

            <Link to="/products" className="continue-shopping-link">
              <FontAwesomeIcon icon={faArrowLeft} />

              <span>Back to Shop</span>
            </Link>
          </header>

          {hasCartItems ? (
            <section className="cart-content">
              <div className="cart-items-header">
                <div className="cart-items-title">
                  <span className="cart-bag-icon">
                    <FontAwesomeIcon icon={faBagShopping} />
                  </span>

                  <h2>Your Items</h2>
                </div>

                <span className="cart-items-count">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="cart-table-header">
                <span className="cart-column-product">Product</span>

                <span className="cart-column-quantity">Quantity</span>

                <span className="cart-column-price">Price</span>

                <span className="cart-column-remove" aria-hidden="true" />
              </div>

              <div className="cart-items-list">
                {cartItems.map((product) => {
                  const itemKey = getCartItemKey(product);

                  return (
                    <article className="cart-item" key={itemKey}>
                      <div className="cart-product-info">
                        <Link
                          to={`/products/${product.id}`}
                          className="cart-product-image"
                          aria-label={`View ${product.name}`}
                        >
                          <img src={product.image} alt={product.name} />
                        </Link>

                        <div className="cart-product-details">
                          <Link
                            to={`/products/${product.id}`}
                            className="cart-product-name"
                          >
                            {product.name}
                          </Link>

                          <div className="cart-variant-details">
                            {/* <span className="cart-variant-heading">

                              Your selection

                            </span> */}

                            <div className="cart-variant-chips">
                              {product.variantLabel
                                ? product.variantLabel

                                    .split(" | ")

                                    .map((option, index) => {
                                      const value = option

                                        .split(":")

                                        .slice(1)

                                        .join(":")

                                        .trim();

                                      return (
                                        <span
                                          className="cart-variant-chip"
                                          key={index}
                                        >
                                          {value || option.trim()}
                                        </span>
                                      );
                                    })
                                : product.optionSummary

                                    ?.split(" | ")

                                    .map((option, index) => (
                                      <span
                                        className="cart-variant-chip"
                                        key={index}
                                      >
                                        {option.trim()}
                                      </span>
                                    ))}
                            </div>
                          </div>

                          <span className="cart-product-category">
                            Category :{" "}
                            {product.tag || product.category || "Handmade"}
                          </span>
                        </div>
                      </div>

                      <div className="cart-item-bottom">
                        <div className="cart-quantity">
                          <button
                            type="button"
                            className="quantity-button"
                            onClick={() => decreaseQuantity(itemKey)}
                            aria-label={`Decrease quantity of ${product.name}`}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </button>

                          <span className="quantity-number">
                            {String(product.quantity).padStart(2, "0")}
                          </span>

                          <button
                            type="button"
                            className="quantity-button"
                            onClick={() => increaseQuantity(itemKey)}
                            aria-label={`Increase quantity of ${product.name}`}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>

                        <span className="cart-product-price">
                          {formatPrice(getItemTotal(product))}

                          <span className="cart-item-price-label">
                            Item total
                          </span>
                        </span>
                      </div>

                      <button
                        type="button"
                        className="cart-delete-button"
                        onClick={() => removeCartItem(itemKey)}
                        aria-label={`Remove ${product.name} from cart`}
                        title="Remove from cart"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </article>
                  );
                })}
              </div>

              {/* Only the total summary remains */}

              <section className="cart-summary">
                <div className="summary-card summary-total-card">
                  <div className="summary-row">
                    <span>Total Items</span>

                    <strong>{totalItems}</strong>
                  </div>

                  <div className="summary-total-row">
                    <span>Total Amount</span>

                    <strong>{formatPrice(totalAmount)}</strong>
                  </div>
                </div>
              </section>

              <div className="cart-actions">
                <Link to="/products" className="cart-back-button">
                  <FontAwesomeIcon icon={faArrowLeft} />

                  <span>Back to Shop</span>
                </Link>

                <button
                  type="button"
                  className="checkout-button"
                  onClick={() => {
                    setOrderStatus({ type: "", message: "" });

                    setShowCheckout(true);
                  }}
                >
                  <span>Checkout</span>

                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </section>
          ) : (
            <section className="empty-cart-section">
              <div className="empty-cart-decoration empty-decoration-one">
                ✦
              </div>

              <div className="empty-cart-decoration empty-decoration-two">
                ♡
              </div>

              <div className="empty-cart-icon">
                <FontAwesomeIcon icon={faBagShopping} />
              </div>

              <h2>Your cart is empty</h2>

              <p>
                Looks like you haven't added anything yet. Explore our handmade
                collection and find something you love.
              </p>

              <Link to="/products" className="shop-now-button">
                <span>Shop Our Collection</span>

                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </section>
          )}

          {hasWishlistItems && (
            <section className="wishlist-section">
              <div className="wishlist-heading">
                <div>
                  <div className="wishlist-title">
                    <span className="wishlist-icon">
                      <FontAwesomeIcon icon={faHeart} />
                    </span>

                    <h2>Your Wishlist</h2>
                  </div>

                  <p>Products you've saved for later</p>
                </div>

                <span className="wishlist-count">
                  {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="wishlist-grid">
                {wishlist.map((product) => (
                  <article className="wishlist-card" key={product.id}>
                    <div className="wishlist-image">
                      <img src={product.image} alt={product.name} />

                      {/* <span className="saved-badge">

                        <FontAwesomeIcon icon={faHeart} />

                        Saved

                      </span> */}

                      <button
                        type="button"
                        className="wishlist-remove"
                        onClick={() => removeFromWishlist(product.id)}
                        aria-label={`Remove ${product.name} from wishlist`}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>

                    <div className="wishlist-content">
                      <span className="wishlist-category">
                        {product.tag || product.category}
                      </span>

                      <h3>{product.name}</h3>

                      {product.description && <p>{product.description}</p>}

                      <Link
                        to={`/products/${product.id}`}
                        className="view-product-button"
                      >
                        <span>View Product</span>

                        <span className="view-product-arrow">
                          <FontAwesomeIcon icon={faArrowRight} />
                        </span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

      {showCheckout && (
        <div
          className="checkout-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSubmittingOrder) {
              setShowCheckout(false);
            }
          }}
        >
          <section
            className="checkout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-modal-title"
          >
            <div className="checkout-modal-header">
              <div>
                <span className="checkout-eyebrow">LITTLEWONDERS</span>
              </div>

              <button
                type="button"
                className="checkout-close-button"
                onClick={() => setShowCheckout(false)}
                disabled={isSubmittingOrder}
                aria-label="Close checkout"
              >
                ×
              </button>
            </div>

            {orderStatus.type === "success" ? (
              <div className="checkout-success checkout-order-confirmation">
                <div className="checkout-success-icon">
                  <FontAwesomeIcon icon={faHeart} />
                </div>

                <span className="order-confirmation-eyebrow">LITTLEWONDERS</span>
                <h3>Thank you, {submittedOrder?.customer.name || "for your order"}!</h3>
                <p className="order-confirmation-message">
                  Your order request has been received successfully. We’ll contact you shortly
                  to confirm product availability, delivery details, and the final amount.
                </p>

                {submittedOrder && (
                  <div className="order-confirmation-details">
                    <div className="order-confirmation-heading">
                      <h4>Your order summary</h4>
                      <span>{submittedOrder.totalItems} {submittedOrder.totalItems === 1 ? "item" : "items"}</span>
                    </div>

                    <div className="order-confirmation-items">
                      {submittedOrder.items.map((item, index) => (
                        <div className="order-confirmation-item" key={`${item.productId}-${item.variantKey}-${index}`}>
                          <div className="order-confirmation-item-info">
                            <strong>{item.name}</strong>
                            {(item.variantLabel || item.optionSummary) && (
                              <span>{item.variantLabel || item.optionSummary}</span>
                            )}
                            <small>Qty: {item.quantity}</small>
                          </div>
                          <strong>{formatPrice(item.subtotal)}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="order-confirmation-total">
                      <span>Order total</span>
                      <strong>{formatPrice(submittedOrder.total)}</strong>
                    </div>
                  </div>
                )}

                <p className="order-confirmation-followup">
                  <strong>What happens next?</strong> Our team will get in touch with you soon.
                  Your order is not confirmed until we contact you.
                </p>

                <button
                  type="button"
                  className="checkout-submit-button"
                  onClick={() => {
                    setShowCheckout(false);
                    setOrderStatus({ type: "", message: "" });
                    setSubmittedOrder(null);
                  }}
                >
                  Continue shopping
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            ) : (
              <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
                <div className="checkout-form-section-title">
                  <span>01</span>
                  Your contact details
                </div>

                <div className="checkout-form-grid">
                  <div className="checkout-field">
                    <label htmlFor="checkout-name">Full name *</label>

                    <input
                      id="checkout-name"
                      name="name"
                      value={checkoutForm.name}
                      onChange={handleCheckoutChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="checkout-phone">Phone number *</label>

                    <input
                      id="checkout-phone"
                      name="phone"
                      type="tel"
                      value={checkoutForm.phone}
                      onChange={handleCheckoutChange}
                      placeholder="10-digit mobile number"
                      autoComplete="tel"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="checkout-field checkout-field-full">
                    <label htmlFor="checkout-email">
                      Email address <span>(optional)</span>
                    </label>

                    <input
                      id="checkout-email"
                      name="email"
                      type="email"
                      value={checkoutForm.email}
                      onChange={handleCheckoutChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      maxLength={254}
                    />
                  </div>
                </div>

                <div className="checkout-form-section-title">
                  <span>02</span>
                  Delivery address
                </div>

                <div className="checkout-form-grid">
                  <div className="checkout-field checkout-field-full">
                    <label htmlFor="checkout-address">
                      House / flat number and street address *
                    </label>

                    <textarea
                      id="checkout-address"
                      name="address"
                      value={checkoutForm.address}
                      onChange={handleCheckoutChange}
                      placeholder="House number, street, area, landmark..."
                      rows={3}
                      autoComplete="street-address"
                      maxLength={500}
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="checkout-city">City / town *</label>

                    <input
                      id="checkout-city"
                      name="city"
                      value={checkoutForm.city}
                      onChange={handleCheckoutChange}
                      placeholder="Your city or town"
                      autoComplete="address-level2"
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="checkout-pincode">PIN code *</label>

                    <input
                      id="checkout-pincode"
                      name="pincode"
                      value={checkoutForm.pincode}
                      onChange={handleCheckoutChange}
                      placeholder="6-digit PIN code"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      autoComplete="postal-code"
                      required
                    />
                  </div>

                  <div className="checkout-field checkout-field-full">
                    <label htmlFor="checkout-notes">
                      Additional instructions <span>(optional)</span>
                    </label>

                    <textarea
                      id="checkout-notes"
                      name="notes"
                      value={checkoutForm.notes}
                      onChange={handleCheckoutChange}
                      placeholder="Gift message, preferred time, or anything else..."
                      rows={2}
                      maxLength={500}
                    />
                  </div>
                </div>

                <div className="checkout-order-preview">
                  <div className="checkout-order-preview-heading">
                    <h3>Your selected items</h3>

                    <span>
                      {totalItems} {totalItems === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <div className="checkout-order-items">
                    {cartItems.map((item) => (
                      <div
                        className="checkout-order-item"
                        key={getCartItemKey(item)}
                      >
                        <div>
                          <span className="checkout-order-item-name">
                            {item.name}
                          </span>

                          {item.variantLabel && (
                            <span className="cart-product-variant">
                              {item.variantLabel}
                            </span>
                          )}

                          <span className="checkout-order-item-quantity">
                            Qty: {item.quantity}
                          </span>
                        </div>

                        <strong>
                          {formatPrice(
                            (Number(item.price) || 0) * item.quantity,
                          )}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-order-total">
                    <span>Total</span>

                    <strong>{formatPrice(totalAmount)}</strong>
                  </div>

                  <p className="checkout-total-note">
                    Note: Your order request does not require payment at this
                    stage. We’ll contact you to confirm product availability,
                    delivery details, and the amount before proceeding.
                  </p>
                </div>

                {orderStatus.message && !isSubmittingOrder && (
                  <div
                    className={`checkout-status ${orderStatus.type}`}
                    role="status"
                    aria-live="polite"
                  >
                    {orderStatus.message}
                  </div>
                )}

                <div className="checkout-form-actions">
                  <button
                    type="button"
                    className="checkout-cancel-button"
                    onClick={() => setShowCheckout(false)}
                    disabled={isSubmittingOrder}
                  >
                    Back to cart
                  </button>

                  <button
                    type="submit"
                    className="checkout-submit-button"
                    disabled={isSubmittingOrder || cartItems.length === 0}
                  >
                    Submit order request

                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}

      {isSubmittingOrder && (
        <div className="checkout-processing-backdrop" role="presentation">
          <section
            className="checkout-processing-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-processing-title"
            aria-live="polite"
          >
            <div className="checkout-processing-spinner" aria-hidden="true" />
            <span className="checkout-processing-eyebrow">LITTLEWONDERS</span>
            <h2 id="checkout-processing-title">Please wait a moment...</h2>
            <p>We're processing your order request. Please don't close this window.</p>
            <div className="checkout-processing-timer">
              <strong>{String(countdown).padStart(2, "0")}</strong>
              <span>SECONDS REMAINING</span>
            </div>
            <div className="checkout-processing-track">
              <div
                className="checkout-processing-progress"
                style={{ width: `${((30 - countdown) / 30) * 100}%` }}
              />
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default CartPage;
