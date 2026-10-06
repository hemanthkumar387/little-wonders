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
  /* ==========================================
     LOAD CART
  ========================================== */

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem("littleWondersCart");

      if (!savedCart) {
        return [];
      }

      const cartData = JSON.parse(savedCart);

      /*
        Supports BOTH formats:

        New format:
        {
          ...product,
          quantity: 1
        }

        Old format:
        {
          productId: 1,
          quantity: 1
        }
      */

      return cartData
        .map((item) => {
          let product;

          // New format
          if (item.id) {
            product = products.find(
              (productItem) => productItem.id === Number(item.id),
            );
          }

          // Old format
          if (!product && item.productId) {
            product = products.find(
              (productItem) => productItem.id === Number(item.productId),
            );
          }

          if (!product) {
            return null;
          }

          return {
            ...product,
            quantity: Number(item.quantity) || 1,
          };
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  };

  /* ==========================================
     LOAD WISHLIST
  ========================================== */

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

  /* ==========================================
     STATE
  ========================================== */

  const [cartItems, setCartItems] = useState(loadCart);
  const [wishlist, setWishlist] = useState(loadWishlist);

  /* ==========================================
     SYNC CART + WISHLIST
  ========================================== */

  useEffect(() => {
    const syncCartAndWishlist = () => {
      setCartItems(loadCart());
      setWishlist(loadWishlist());
    };

    /*
      storage:
      Handles changes from another browser tab.

      cartUpdated:
      Handles changes made inside the same tab,
      such as Product Details -> Add to Cart.
    */

    window.addEventListener("storage", syncCartAndWishlist);
    window.addEventListener("cartUpdated", syncCartAndWishlist);
    window.addEventListener("wishlistUpdated", syncCartAndWishlist);

    return () => {
      window.removeEventListener("storage", syncCartAndWishlist);
      window.removeEventListener("cartUpdated", syncCartAndWishlist);
      window.removeEventListener("wishlistUpdated", syncCartAndWishlist);
    };
  }, []);

  /* ==========================================
     SAVE CART
  ========================================== */

  const saveCart = (items) => {
    const cartData = items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    localStorage.setItem("littleWondersCart", JSON.stringify(cartData));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  /* ==========================================
     INCREASE QUANTITY
  ========================================== */

  const increaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item,
    );

    setCartItems(updatedCart);
    saveCart(updatedCart);
  };
  /* ==========================================
     DECREASE QUANTITY
  ========================================== */

  const decreaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId
        ? {
            ...item,
            quantity: Math.max(1, item.quantity - 1),
          }
        : item,
    );

    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  /* ==========================================
     REMOVE CART ITEM
  ========================================== */

  const removeCartItem = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);

    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  /* ==========================================
     REMOVE WISHLIST ITEM
  ========================================== */

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

  /* ==========================================
     CART TOTAL
  ========================================== */

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + (Number(item.price) || 0) * item.quantity,
    0,
  );

  const hasCartItems = cartItems.length > 0;
  const hasWishlistItems = wishlist.length > 0;

  /* ==========================================
     RENDER
  ========================================== */

  return (
    <main className="cart-page">
      <section className="cart-main-section">
        <div className="cart-container">
          {/* ==========================================
              PAGE HEADER
          ========================================== */}

          <div className="cart-page-header">
            <div className="cart-page-title">
              <span className="cart-page-label">Shopping</span>

              <h1>Shopping Cart</h1>

              <p>Review your selected items before placing your order.</p>
            </div>

            <Link to="/products" className="continue-shopping-link">
              <FontAwesomeIcon icon={faArrowLeft} />

              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* ==========================================
              CART SECTION
          ========================================== */}

          <section className="cart-section">
            {/* ==========================================
                CART HAS ITEMS
            ========================================== */}

            {hasCartItems ? (
              <>
                <div className="section-heading-row">
                  <div>
                    <h2>Cart Items</h2>

                    <p>Your selected handmade products</p>
                  </div>

                  <span className="item-count">
                    {totalItems} {totalItems === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {/* CART ITEMS */}

                <div className="cart-items-list">
                  {cartItems.map((product) => (
                    <article className="cart-item" key={product.id}>
                      {/* IMAGE */}

                      <div className="cart-item-image">
                        <img src={product.image} alt={product.name} />
                      </div>

                      {/* PRODUCT INFORMATION */}

                      <div className="cart-item-content">
                        <span className="cart-item-category">
                          {product.tag}
                        </span>

                        <h3>{product.name}</h3>

                        {product.description && <p>{product.description}</p>}

                        {product.price != null && (
                          <span className="cart-item-price">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      {/* ACTIONS */}

                      <div className="cart-item-actions">
                        {/* QUANTITY */}

                        <div className="quantity-control">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(product.id)}
                            aria-label="Decrease quantity"
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </button>

                          <span>{product.quantity}</span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(product.id)}
                            aria-label="Increase quantity"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>

                        {/* TOTAL */}

                        {product.price != null && (
                          <strong className="cart-item-total">
                            ₹
                            {(
                              Number(product.price) * product.quantity
                            ).toLocaleString("en-IN")}
                          </strong>
                        )}

                        {/* DELETE */}

                        <button
                          type="button"
                          className="cart-remove-button"
                          onClick={() => removeCartItem(product.id)}
                          aria-label={`Remove ${product.name} from cart`}
                          title="Remove from cart"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                {/* ==========================================
                    CART SUMMARY
                ========================================== */}

                <div className="cart-summary">
                  <div className="cart-summary-info">
                    <span>Subtotal</span>

                    <strong>₹{cartTotal.toLocaleString("en-IN")}</strong>
                  </div>

                  <p>
                    Final pricing may vary depending on the size and design of
                    your handmade products.
                  </p>

                  <button type="button" className="proceed-button">
                    <span>Proceed to Order</span>

                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              </>
            ) : hasWishlistItems ? (
              /* ==========================================
                 CART EMPTY + WISHLIST EXISTS
              ========================================== */

              <>
                <div className="section-heading-row">
                  <div>
                    <div className="wishlist-title-row">
                      <h2>Your Wishlist</h2>

                      <span className="wishlist-heart">
                        <FontAwesomeIcon icon={faHeart} />
                      </span>
                    </div>

                    <p>Your saved handmade products</p>
                  </div>

                  <span className="item-count">
                    {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
                  </span>
                </div>

                <div className="wishlist-grid main-wishlist-grid">
                  {wishlist.map((product) => (
                    <article className="wishlist-card" key={product.id}>
                      <div className="wishlist-card-image">
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
                          title="Remove from wishlist"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>

                      <div className="wishlist-card-content">
                        <span className="wishlist-product-category">
                          {product.tag}
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
              </>
            ) : (
              /* ==========================================
                 CART EMPTY + WISHLIST EMPTY
              ========================================== */

              <>
                <div className="section-heading-row">
                  <div>
                    <h2>Cart Items</h2>

                    <p>Your selected handmade products</p>
                  </div>

                  <span className="item-count">0 Items</span>
                </div>

                <div className="empty-cart-box">
                  <div className="empty-cart-pattern empty-pattern-one">✦</div>

                  <div className="empty-cart-pattern empty-pattern-two">♡</div>

                  <div className="empty-cart-icon">
                    <FontAwesomeIcon icon={faBagShopping} />
                  </div>

                  <h3>Your cart is empty</h3>

                  <p>
                    Looks like you haven't added anything to your cart yet.
                    Explore our handmade collection and find something you love.
                  </p>

                  <Link to="/products" className="shop-now-button">
                    <span>Shop Our Collection</span>

                    <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                </div>
              </>
            )}
          </section>

          {/* ==========================================
              BOTTOM WISHLIST

              ONLY WHEN BOTH CART + WISHLIST EXIST
          ========================================== */}

          {hasCartItems && hasWishlistItems && (
            <section className="wishlist-section">
              <div className="section-heading-row wishlist-heading">
                <div>
                  <div className="wishlist-title-row">
                    <h2>Your Wishlist</h2>

                    <span className="wishlist-heart">
                      <FontAwesomeIcon icon={faHeart} />
                    </span>
                  </div>

                  <p>Products you've saved for later</p>
                </div>

                <span className="item-count wishlist-count">
                  {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
                </span>
              </div>

              <div className="wishlist-grid">
                {wishlist.map((product) => (
                  <article className="wishlist-card" key={product.id}>
                    <div className="wishlist-card-image">
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
                        title="Remove from wishlist"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>

                    <div className="wishlist-card-content">
                      <span className="wishlist-product-category">
                        {product.tag}
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
