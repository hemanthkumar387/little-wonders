
import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faHeart,
  faQuoteLeft,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "./Review.css";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

const REVIEW_CACHE_KEY = "littleWondersReviews";

const products = [
  "Flower Bouquet",
  "Handmade Bunny Bag",
  "Morpankh Keychain",
  "Sunshine Keychain",
  "Ribbon Bow Keychain",
  "Star & Moon Keychains",
  "Bow Keychain",
  "Flower Bracelet",
  "Heart Bracelet",
  "Strawberry Clips",
  "Cherries Keychain",
  "Cherries Bracelet",
  "Cherries Chain",
  "Coffee Mug Keychain",
  "Hello Kitty Keychain",
  "Doremon Keychain",
  "Other",
];

// Read cached reviews from the current browser tab session.
const getCachedReviews = () => {
  try {
    const cached = sessionStorage.getItem(REVIEW_CACHE_KEY);

    if (!cached) return null;

    const parsed = JSON.parse(cached);

    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.error("Unable to read cached reviews:", error);
    return null;
  }
};

// Save approved reviews to the current browser tab session.
const cacheReviews = (reviews) => {
  try {
    sessionStorage.setItem(
      REVIEW_CACHE_KEY,
      JSON.stringify(reviews),
    );
  } catch (error) {
    console.error("Unable to cache reviews:", error);
  }
};

const StarRating = ({ rating, size = "normal" }) => (
  <div
    className={`review-stars review-stars-${size}`}
    aria-label={`${rating} out of 5 stars`}
  >
    {[1, 2, 3, 4, 5].map((star) => (
      <FontAwesomeIcon
        key={star}
        icon={faStar}
        className={star <= rating ? "star-filled" : "star-empty"}
      />
    ))}
  </div>
);

const formatReviewDate = (date) => {
  if (!date) return "Recently";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Recently";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const isApproved = (review) =>
  String(review.status || "").toLowerCase() === "approved";

const ReviewPageLoader = () => (
  <div className="lw-review-page-loader">
    <div className="lw-review-loader-spinner"></div>
    <h3>Loading LittleWonders...</h3>
    <p>Gathering lovely customer experiences for you.</p>
  </div>
);

export default function Review() {
  // Read the cache only once when the component is first mounted.
  const [cachedReviews] = useState(() => getCachedReviews());

  const [reviews, setReviews] = useState(
    () => cachedReviews || [],
  );

  const [activeFilter, setActiveFilter] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Show the loader only when there is no cached data.
  const [loadingReviews, setLoadingReviews] = useState(
    () => cachedReviews === null,
  );

  const [form, setForm] = useState({
    name: "",
    product: "",
    message: "",
  });

  // Fetch reviews from backend.
  // Cached reviews remain visible while fresh data is fetched.
  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      if (!API_URL) {
        console.error("VITE_API_URL is not configured.");

        if (isMounted) {
          if (!getCachedReviews()) {
            toast.error("Backend API URL is not configured.");
          }

          setLoadingReviews(false);
        }

        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/reviews`);

        if (!response.ok) {
          throw new Error("Failed to fetch reviews.");
        }

        const data = await response.json();

        const fetchedReviews = Array.isArray(data)
          ? data
          : data.reviews || data.data || [];

        if (!Array.isArray(fetchedReviews)) {
          throw new Error("Invalid reviews response from server.");
        }

        const approved = fetchedReviews
          .filter(isApproved)
          .map((review) => ({
            ...review,
            id: review.id || review._id,
            date: formatReviewDate(
              review.date || review.createdAt,
            ),
          }));

        if (!isMounted) return;

        setReviews(approved);
        cacheReviews(approved);
      } catch (error) {
        console.error("Error fetching reviews:", error);

        if (isMounted && !getCachedReviews()) {
          toast.error("Unable to load customer reviews.");
        }
      } finally {
        if (isMounted) {
          setLoadingReviews(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  // Only approved reviews are used throughout the public page.
  const approvedReviews = useMemo(
    () => reviews.filter(isApproved),
    [reviews],
  );

  const totalReviews = approvedReviews.length;

  const averageRating = totalReviews
    ? (
        approvedReviews.reduce(
          (sum, review) => sum + Number(review.rating || 0),
          0,
        ) / totalReviews
      ).toFixed(1)
    : null;

  const ratingCounts = useMemo(() => {
    return [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: approvedReviews.filter(
        (review) => Number(review.rating) === rating,
      ).length,
    }));
  }, [approvedReviews]);

  const filteredReviews =
    activeFilter === 0
      ? approvedReviews
      : approvedReviews.filter(
          (review) => Number(review.rating) === activeFilter,
        );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Submit a new review to the backend.
  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const message = form.message.trim();

    if (!name || !form.product || !message || !selectedRating) {
      toast.error(
        "Please complete all review fields and select a rating.",
      );
      return;
    }

    if (name.length > 100) {
      toast.error("Name must be 100 characters or fewer.");
      return;
    }

    if (message.length < 10) {
      toast.error(
        "Please write at least 10 characters in your review.",
      );
      return;
    }

    if (message.length > 1000) {
      toast.error("Your review cannot exceed 1000 characters.");
      return;
    }

    if (!API_URL) {
      toast.error("Backend API URL is not configured.");
      return;
    }

    setSubmitting(true);

    try {
      const reviewPayload = {
        name,
        product: form.product,
        rating: selectedRating,
        message,
      };

      const response = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewPayload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to submit your review.",
        );
      }

      const savedReview =
        result.review || result.data?.review || result.data || {};

      const newReview = {
        ...reviewPayload,
        ...savedReview,
        id: savedReview.id || savedReview._id || Date.now(),
        date: formatReviewDate(
          savedReview.date || savedReview.createdAt || new Date(),
        ),
      };

      // Add immediately only if the backend explicitly marks it Approved.
      // Normally, new reviews should have Pending status.
      if (isApproved(newReview)) {
        setReviews((current) => {
          const updatedReviews = [newReview, ...current];

          cacheReviews(updatedReviews);

          return updatedReviews;
        });
      }

      setForm({
        name: "",
        product: "",
        message: "",
      });

      setSelectedRating(0);
      setHoverRating(0);
      setActiveFilter(0);

      toast.success(
        result.message ||
          "Thank you! Your review has been submitted for approval.",
      );
    } catch (error) {
      console.error("Review submission error:", error);

      toast.error(
        error.message || "Unable to submit your review.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Show the full-page loader only on the first visit without cached reviews.
  if (loadingReviews) {
    return <ReviewPageLoader />;
  }

  return (
    <main className="lw-review-page">
      {/* Page heading */}
      <section className="lw-review-intro">
        <span className="lw-review-eyebrow">
          <FontAwesomeIcon icon={faHeart} />
          CUSTOMER LOVE
        </span>

        <h1>
          Made with love,
          <span> loved by you.</span>
        </h1>

        <p>
          Every little creation has a story. Discover what our lovely
          customers have to say about their LittleWonders experience.
        </p>

        <div className="lw-review-heading-decoration">
          <span />
          <FontAwesomeIcon icon={faHeart} />
          <span />
        </div>
      </section>

      {/* Rating summary */}
      <section className="lw-review-summary">
        <div className="lw-review-summary-main">
          <div className="lw-review-summary-title">
            <span className="lw-review-section-label">
              THE LOVE WE RECEIVE
            </span>

            <h2>Customer happiness</h2>
          </div>

          <div className="lw-review-average">
            {totalReviews > 0 ? (
              <>
                <strong>{averageRating}</strong>

                <div>
                  <StarRating
                    rating={Math.round(Number(averageRating))}
                  />

                  <span>
                    Out of 5 based on {totalReviews} reviews
                  </span>
                </div>
              </>
            ) : (
              <div className="lw-review-no-rating">
                <strong>—</strong>
                <span>No ratings yet</span>
              </div>
            )}
          </div>
        </div>

        <div className="lw-review-summary-divider" />

        <div className="lw-review-rating-breakdown">
          {ratingCounts.map(({ rating, count }) => {
            const percentage = totalReviews
              ? (count / totalReviews) * 100
              : 0;

            return (
              <div className="lw-rating-row" key={rating}>
                <span className="lw-rating-number">{rating}</span>

                <FontAwesomeIcon icon={faStar} />

                <div className="lw-rating-track">
                  <div
                    className="lw-rating-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="lw-rating-count">{count}</span>
              </div>
            );
          })}
        </div>

        <div className="lw-review-summary-total">
          <strong>{totalReviews}</strong>
          <span>Customer stories shared</span>
        </div>
      </section>

      {/* Customer reviews */}
      <section className="lw-review-list-section">
        <div className="lw-review-list-heading">
          <div>
            <span className="lw-review-section-label">
              KIND WORDS, HAPPY HEARTS
            </span>

            <h2>Words from our customers</h2>

            <p>
              Little moments of happiness shared by our community.
            </p>
          </div>

          <div className="lw-review-list-count">
            {totalReviews} reviews
          </div>
        </div>

        {/* Review filters */}
        <div className="lw-review-filters">
          {[0, 5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              type="button"
              className={activeFilter === rating ? "active" : ""}
              onClick={() => setActiveFilter(rating)}
            >
              {rating === 0 ? (
                "All reviews"
              ) : (
                <>
                  {rating}
                  <FontAwesomeIcon icon={faStar} />
                </>
              )}
            </button>
          ))}
        </div>

        {/* Approved review cards only */}
        {filteredReviews.length > 0 ? (
          <div className="lw-review-grid">
            {filteredReviews.map((review) => (
              <article className="lw-review-card" key={review.id}>
                <div className="lw-review-card-top">
                  <div className="lw-review-avatar">
                    {review.name?.charAt(0).toUpperCase() || "C"}
                  </div>

                  <div className="lw-review-customer">
                    <h3>{review.name}</h3>
                    <span>{review.date}</span>
                  </div>

                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="lw-review-quote"
                  />
                </div>

                <StarRating rating={Number(review.rating)} />

                <p className="lw-review-message">
                  {review.message}
                </p>

                <div className="lw-review-product">
                  <span>PRODUCT</span>
                  <strong>{review.product}</strong>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="lw-review-empty">
            <FontAwesomeIcon icon={faStar} />

            <h3>
              {totalReviews === 0
                ? "Be the first to share your experience!"
                : "No reviews found"}
            </h3>

            <p>
              {totalReviews === 0
                ? "Once customer reviews are approved, they will appear here."
                : "There are no approved reviews with this rating yet."}
            </p>

            {activeFilter !== 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter(0)}
              >
                View all reviews
              </button>
            )}
          </div>
        )}
      </section>

      {/* Review form */}
      <section
        className="lw-review-form-section"
        id="write-review"
      >
        <div className="lw-review-form-intro">
          <span className="lw-review-section-label">
            YOUR WORDS MATTER
          </span>

          <h2>Share your experience</h2>

          <p>
            Have you received something from LittleWonders? We'd love
            to know what you think. Your feedback helps our little
            business grow.
          </p>

          <div className="lw-review-form-note">
            <FontAwesomeIcon icon={faHeart} />

            <span>
              Thank you for supporting handmade creations.
            </span>
          </div>
        </div>

        <form
          className="lw-review-form"
          onSubmit={handleSubmit}
        >
          <div className="lw-review-form-title">
            <h3>Write a review</h3>
            <span>Fields marked * are required</span>
          </div>

          {/* Star rating */}
          <div className="lw-review-form-rating">
            <label>
              Your rating <span>*</span>
            </label>

            <div
              className="lw-review-select-stars"
              onMouseLeave={() => setHoverRating(0)}
              role="radiogroup"
              aria-label="Select your rating"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  role="radio"
                  aria-checked={selectedRating === rating}
                  aria-label={`${rating} stars`}
                  onMouseEnter={() => setHoverRating(rating)}
                  onFocus={() => setHoverRating(rating)}
                  onBlur={() => setHoverRating(0)}
                  onClick={() => setSelectedRating(rating)}
                >
                  <FontAwesomeIcon
                    icon={faStar}
                    className={
                      rating <= (hoverRating || selectedRating)
                        ? "selected"
                        : ""
                    }
                  />
                </button>
              ))}
            </div>

            <span className="lw-review-rating-hint">
              {selectedRating
                ? `${selectedRating} out of 5 stars selected`
                : "Select your experience"}
            </span>
          </div>

          <div className="lw-review-form-row">
            <label className="lw-review-input-group">
              <span>
                Your name <span>*</span>
              </span>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                maxLength={100}
                autoComplete="name"
                required
              />
            </label>

            <label className="lw-review-input-group">
              <span>
                Product purchased <span>*</span>
              </span>

              <select
                name="product"
                value={form.product}
                onChange={handleChange}
                required
              >
                <option value="">Select a product</option>

                {products.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="lw-review-input-group">
            <span>
              Your review <span>*</span>
            </span>

            <textarea
              name="message"
              placeholder="Tell us about your LittleWonders experience..."
              value={form.message}
              onChange={handleChange}
              rows={5}
              maxLength={1000}
              required
            />

            <small>{form.message.length}/1000 characters</small>
          </label>

          <button
            type="submit"
            className="lw-review-submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit your review"}
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>

          <p className="lw-review-privacy-note">
            Your review will be checked by our team before appearing
            publicly.
          </p>
        </form>
      </section>

      {/* Bottom message */}
      <section className="lw-review-footer">
        <FontAwesomeIcon icon={faHeart} />

        <h2>Thank you for being part of our story.</h2>

        <p>LittleWonders — Nurture. Grow. Inspire.</p>
      </section>
    </main>
  );
}
