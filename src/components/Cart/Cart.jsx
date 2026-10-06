import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faTrash,
  faArrowRight,
  faBagShopping,
} from "@fortawesome/free-solid-svg-icons";

import products from "../../data/products";
import "./Cart.css";

const CartPage = () => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem("littleWondersWishlist");

        const wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];

        const wishlistProducts = products.filter((product) =>
          wishlistIds.includes(product.id),
        );

        setWishlist(wishlistProducts);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
        setWishlist([]);
      }
    };

    loadWishlist();
  }, []);

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
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
  };

  return (
    <main className="cart-page">
      {/* =========================
          CART SECTION
      ========================= */}
      <section className="cart-main-section">
        <div className="cart-container">
          <div className="cart-section-heading">
            <div className="cart-heading-content">
              <span className="section-small-title">Ready When You Are</span>

              <h2>A Little Something for You</h2>

              <p>Your handmade picks will find their place here.</p>
            </div>

            <span className="heading-decor">✿</span>
          </div>

          <div className="empty-cart-box">
            <div className="empty-cart-decoration empty-cart-decoration-one">
              ♡
            </div>

            <div className="empty-cart-decoration empty-cart-decoration-two">
              ✿
            </div>

            <div className="empty-cart-icon">
              <FontAwesomeIcon icon={faBagShopping} />
            </div>

            <span className="empty-cart-label">Nothing here... yet</span>

            <h3>Maybe your next little favorite is waiting to be found.</h3>

            <p>
              Take a little stroll through our handmade collection and see what
              catches your eye.
            </p>

            <Link to="/products" className="continue-shopping-button">
              <span>Explore Handmade Pieces</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>

          {/* =========================
              WISHLIST
          ========================= */}
          <div className="wishlist-section">
            <div className="wishlist-heading">
              <div className="wishlist-heading-content">
                <span className="section-small-title">Saved With Love</span>

                <h2>Things You Fell in Love With</h2>

                <p>A little collection of pieces that caught your heart.</p>
              </div>

              <div className="wishlist-count">
                <FontAwesomeIcon icon={faHeart} />
                <span>{wishlist.length}</span>
              </div>
            </div>

            {wishlist.length === 0 ? (
              <div className="empty-wishlist">
                <div className="empty-wishlist-heart">
                  <FontAwesomeIcon icon={faHeart} />
                </div>

                <h3>Your wishlist is empty</h3>

                <p>
                  Save the handmade pieces you love and they'll appear here.
                </p>

                <Link to="/products" className="wishlist-explore-button">
                  Explore Our Collection
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            ) : (
              <div className="wishlist-grid">
                {wishlist.map((product) => (
                  <article className="wishlist-card" key={product.id}>
                    <div className="wishlist-card-image">
                      <img src={product.image} alt={product.name} />

                      <button
                        type="button"
                        className="wishlist-remove"
                        onClick={() => removeFromWishlist(product.id)}
                        aria-label={`Remove ${product.name} from wishlist`}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>

                    <div className="wishlist-card-content">
                      <span className="wishlist-card-tag">{product.tag}</span>

                      <h3>{product.name}</h3>

                      <p>{product.description}</p>

                      <Link
                        to={`/products/${product.id}`}
                        className="wishlist-view-button"
                      >
                        <span>View Details</span>

                        <span className="wishlist-arrow">
                          <FontAwesomeIcon icon={faArrowRight} />
                        </span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CartPage;
