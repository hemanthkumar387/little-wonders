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
  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem("littleWondersCart");
      if (!savedCart) return [];

      const cartData = JSON.parse(savedCart);

      return cartData
        .map((item) => {
          const product = products.find(
            (productItem) =>
              productItem.id === Number(item.id ?? item.productId),
          );

          if (!product) return null;

          return {
            ...product,
            quantity: Math.max(1, Number(item.quantity) || 1),
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
      productId: item.id,
      quantity: item.quantity,
    }));

    localStorage.setItem("littleWondersCart", JSON.stringify(cartData));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
    );

    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const decreaseQuantity = (productId) => {
    const currentItem = cartItems.find((item) => item.id === productId);

    if (!currentItem) return;

    if (currentItem.quantity <= 1) {
      const updatedCart = cartItems.filter((item) => item.id !== productId);

      setCartItems(updatedCart);
      saveCart(updatedCart);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
    );

    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const removeCartItem = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);

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
                {cartItems.map((product) => (
                  <article className="cart-item" key={product.id}>
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

                        <span className="cart-product-category">
                          {product.tag || product.category || "Handmade"}
                        </span>

                        {/* Mobile amount updates with quantity */}
                        <span className="cart-product-mobile-price">
                          {formatPrice(getItemTotal(product))}
                        </span>
                      </div>
                    </div>

                    <div className="cart-quantity">
                      <button
                        type="button"
                        className="quantity-button"
                        onClick={() => decreaseQuantity(product.id)}
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
                        onClick={() => increaseQuantity(product.id)}
                        aria-label={`Increase quantity of ${product.name}`}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>

                    <span className="cart-product-price">
                      {formatPrice(getItemTotal(product))}
                    </span>

                    <button
                      type="button"
                      className="cart-delete-button"
                      onClick={() => removeCartItem(product.id)}
                      aria-label={`Remove ${product.name} from cart`}
                      title="Remove from cart"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </article>
                ))}
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

                <button type="button" className="checkout-button">
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

                      <span className="saved-badge">
                        <FontAwesomeIcon icon={faHeart} />
                        Saved
                      </span>

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
    </main>
  );
};

export default CartPage;
