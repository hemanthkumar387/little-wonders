
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faCalendar,
  faChevronDown,
  faChevronUp,
  faCircleUser,
  faLocationDot,
  faWallet,
  faCheckCircle,
  faClock,
  faHourglassHalf,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";

import "./ProfilePage.css";

const API_URL = import.meta.env.VITE_API_URL;

const getStoredCustomer = () => {
  try {
    return JSON.parse(localStorage.getItem("littleWondersCustomer")) || null;
  } catch {
    return null;
  }
};

const parseResponse = async (response) => {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid server response. Please try again.");
  }
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatMoney = (amount) => {
  const value = Number(amount);

  return `₹${(Number.isFinite(value) ? value : 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

const getOrderItems = (order) => {
  if (Array.isArray(order.items)) return order.items;
  if (Array.isArray(order.products)) return order.products;
  return [];
};

const getItemName = (item) =>
  item.name ||
  item.productName ||
  item.title ||
  item.product?.name ||
  "Product";

const getItemQuantity = (item) => Number(item.quantity || item.qty || 1);

const getItemPrice = (item) =>
  Number(item.price || item.unitPrice || item.product?.price || 0);

const getOrderTotal = (order) =>
  Number(
    order.totalAmount ??
      order.total ??
      order.grandTotal ??
      order.amount ??
      order.finalAmount ??
      0,
  );

const getPaymentDetails = (order) => {
  const total = getOrderTotal(order);
  const paid = Math.min(total, Math.max(0, Number(order.amountPaid) || 0));

  let status = order.paymentStatus || "Unpaid";

  if (paid <= 0) {
    status = "Unpaid";
  } else if (total > 0 && paid >= total) {
    status = "Paid";
  } else {
    status = "Partially Paid";
  }

  return {
    status,
    paid,
    remaining: Math.max(0, total - paid),
    percentage: total > 0 ? Math.min(100, (paid / total) * 100) : 0,
  };
};

const getPaymentStyle = (status) => {
  switch (status) {
    case "Paid":
      return {
        className: "paid",
        icon: faCheckCircle,
        label: "Paid",
      };

    case "Partially Paid":
      return {
        className: "partial",
        icon: faHourglassHalf,
        label: "Partially Paid",
      };

    default:
      return {
        className: "unpaid",
        icon: faClock,
        label: "Unpaid",
      };
  }
};

const getOrderStatus = (status) => {
  const normalized = String(status || "Pending").toLowerCase();

  if (["completed", "delivered"].includes(normalized)) {
    return "completed";
  }

  if (["cancelled", "canceled"].includes(normalized)) {
    return "cancelled";
  }

  if (["confirmed", "processing", "shipped"].includes(normalized)) {
    return "processing";
  }

  return "pending";
};

const ProfilePage = () => {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(getStoredCustomer);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Cookie-based logout
  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/api/customer/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("littleWondersCustomerToken");
      localStorage.removeItem("littleWondersCustomer");

      setCustomer(null);
      setOrders([]);

      window.dispatchEvent(new Event("customerAuthChanged"));

      toast.info("Please log in to continue.");
      navigate("/login?redirect=%2Fprofile", { replace: true });
    }
  }, [navigate]);

  // Fetch customer orders using the HTTP-only cookie
  const fetchOrders = useCallback(
    async (showLoader = false) => {
      if (showLoader) {
        setRefreshing(true);
      }

      try {
        const response = await fetch(`${API_URL}/api/customer/orders`, {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401) {
          await logout();
          return;
        }

        const result = await parseResponse(response);

        if (!response.ok) {
          throw new Error(result.message || "Unable to load your orders.");
        }

        const customerOrders = Array.isArray(result)
          ? result
          : result.orders || result.data || [];

        setOrders(Array.isArray(customerOrders) ? customerOrders : []);
      } catch (error) {
        console.error("Order refresh error:", error);

        if (showLoader) {
          toast.error(error.message || "Unable to refresh your orders.");
        }
      } finally {
        setRefreshing(false);
      }
    },
    [logout],
  );

  // Restore the customer session using /api/customer/me
  const fetchProfileData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/customer/me`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        localStorage.removeItem("littleWondersCustomer");
        localStorage.removeItem("littleWondersCustomerToken");

        setCustomer(null);
        setOrders([]);

        navigate("/login?redirect=%2Fprofile", { replace: true });
        return;
      }

      const result = await parseResponse(response);

      if (!response.ok) {
        throw new Error(result.message || "Unable to load your profile.");
      }

      const updatedCustomer = result.customer || result.data || result;

      setCustomer(updatedCustomer);

      // Keep this profile cache temporarily for other existing components.
      // It does not contain the authentication token.
      localStorage.setItem(
        "littleWondersCustomer",
        JSON.stringify(updatedCustomer),
      );

      await fetchOrders();
    } catch (error) {
      console.error("Profile loading error:", error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [navigate, fetchOrders]);

  useEffect(() => {
    void fetchProfileData();
  }, [fetchProfileData]);

  // Refresh orders periodically and when the customer returns to the page.
  useEffect(() => {
    const interval = window.setInterval(() => {
      void fetchOrders();
    }, 30000);

    const handleFocus = () => {
      void fetchOrders();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void fetchOrders();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchOrders]);

  const toggleOrder = (orderId) => {
    setExpandedOrder((current) => (current === orderId ? null : orderId));
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loader"></div>
        <p>Preparing your LittleWonders account...</p>
      </div>
    );
  }

  return (
    <section className="profile-page">
      <div className="profile-container">
        <div className="profile-heading">
          <div>
            <span className="profile-eyebrow">LITTLEWONDERS · YOUR SPACE</span>
            <h1>My Account</h1>
            <p>A little place to manage your details and follow your orders.</p>
          </div>

          <div className="profile-heading-decoration">
            <FontAwesomeIcon icon={faCircleUser} />
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-details-card">
            <div className="profile-card-heading">
              <div className="profile-icon">
                <FontAwesomeIcon icon={faCircleUser} />
              </div>

              <div>
                <h2>Personal Details</h2>
                <p>Your account information</p>
              </div>
            </div>

            <div className="profile-information">
              <div className="profile-info-item">
                <span>Full Name</span>
                <strong>{customer?.name || "Not available"}</strong>
              </div>

              <div className="profile-info-item">
                <span>Email Address</span>
                <strong>{customer?.email || "Not available"}</strong>
              </div>

              <div className="profile-info-item">
                <span>Mobile Number</span>
                <strong>{customer?.phone || "Not available"}</strong>
              </div>
            </div>
          </div>

          <div className="profile-orders-section">
            <div className="profile-orders-heading">
              <div>
                <span className="profile-section-eyebrow">YOUR PURCHASES</span>
                <h2>My Orders</h2>
                <p>Every little creation you've ordered, all in one place.</p>
              </div>

              <div className="profile-order-heading-actions">
                <button
                  type="button"
                  className="profile-refresh-button"
                  onClick={() => fetchOrders(true)}
                  disabled={refreshing}
                  aria-label="Refresh orders"
                >
                  <FontAwesomeIcon icon={faRefresh} spin={refreshing} />
                  <span>{refreshing ? "Refreshing" : "Refresh"}</span>
                </button>

                <span className="profile-order-count">
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </span>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="profile-empty-orders">
                <div className="profile-empty-icon">
                  <FontAwesomeIcon icon={faBoxOpen} />
                </div>

                <h3>No orders yet</h3>

                <p>
                  Your handmade favourites are waiting for you. Explore our
                  collection and place your first order!
                </p>

                <Link to="/products" className="profile-shop-button">
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="profile-orders-list">
                {orders.map((order, index) => {
                  const orderId = order._id || order.id || index;
                  const items = getOrderItems(order);
                  const status = getOrderStatus(order.status);
                  const isExpanded = expandedOrder === orderId;
                  const payment = getPaymentDetails(order);
                  const paymentStyle = getPaymentStyle(payment.status);
                  const orderCustomer = order.customer || {};

                  return (
                    <div className="profile-order-card" key={orderId}>
                      <button
                        type="button"
                        className="profile-order-summary"
                        onClick={() => toggleOrder(orderId)}
                        aria-expanded={isExpanded}
                      >
                        <div className="profile-order-main">
                          <div className="profile-order-icon">
                            <FontAwesomeIcon icon={faBoxOpen} />
                          </div>

                          <div className="profile-order-info">
                            <h3>
                              Order #
                              {String(
                                order.orderNumber || order._id || index + 1,
                              )
                                .slice(-8)
                                .toUpperCase()}
                            </h3>

                            <span className="profile-order-date">
                              <FontAwesomeIcon icon={faCalendar} />
                              {formatDate(
                                order.createdAt ||
                                  order.orderDate ||
                                  order.date,
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="profile-order-right">
                          <strong className="profile-order-price">
                            {formatMoney(getOrderTotal(order))}
                          </strong>

                          <div className="profile-order-badges">
                            <span className={`profile-status ${status}`}>
                              {order.status || "Pending"}
                            </span>

                            <span
                              className={`profile-payment-badge ${paymentStyle.className}`}
                            >
                              <FontAwesomeIcon icon={paymentStyle.icon} />
                              {paymentStyle.label}
                            </span>
                          </div>

                          <FontAwesomeIcon
                            className="profile-order-chevron"
                            icon={isExpanded ? faChevronUp : faChevronDown}
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="profile-order-details">
                          <div className="profile-details-title">
                            <h4>Order Items</h4>
                            <span>
                              {items.length}{" "}
                              {items.length === 1 ? "Item" : "Items"}
                            </span>
                          </div>

                          <div className="profile-order-items">
                            {items.length === 0 ? (
                              <p>No item details available.</p>
                            ) : (
                              items.map((item, itemIndex) => (
                                <div
                                  className="profile-order-item"
                                  key={item._id || item.id || itemIndex}
                                >
                                  <div>
                                    <strong>{getItemName(item)}</strong>
                                    <span>Qty: {getItemQuantity(item)}</span>

                                    {item.optionSummary && (
                                      <small>{item.optionSummary}</small>
                                    )}
                                  </div>

                                  <strong>
                                    {formatMoney(
                                      Number(item.subtotal) ||
                                        getItemPrice(item) *
                                          getItemQuantity(item),
                                    )}
                                  </strong>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="profile-payment-card">
                            <div className="profile-payment-heading">
                              <div className="profile-payment-icon">
                                <FontAwesomeIcon icon={faWallet} />
                              </div>

                              <div>
                                <h4>Payment Summary</h4>
                                <p>Your latest payment information</p>
                              </div>

                              <span
                                className={`profile-payment-badge ${paymentStyle.className}`}
                              >
                                <FontAwesomeIcon icon={paymentStyle.icon} />
                                {paymentStyle.label}
                              </span>
                            </div>

                            <div className="profile-payment-progress">
                              <div className="profile-payment-progress-track">
                                <div
                                  className={`profile-payment-progress-fill ${paymentStyle.className}`}
                                  style={{ width: `${payment.percentage}%` }}
                                />
                              </div>

                              <span>
                                {Math.round(payment.percentage)}% paid
                              </span>
                            </div>

                            <div className="profile-payment-amounts">
                              <div>
                                <span>Order Total</span>
                                <strong>
                                  {formatMoney(getOrderTotal(order))}
                                </strong>
                              </div>

                              <div>
                                <span>Amount Paid</span>
                                <strong className="profile-paid-amount">
                                  {formatMoney(payment.paid)}
                                </strong>
                              </div>

                              <div>
                                <span>Remaining</span>
                                <strong className="profile-remaining-amount">
                                  {formatMoney(payment.remaining)}
                                </strong>
                              </div>
                            </div>
                          </div>

                          {orderCustomer.address && (
                            <div className="profile-delivery-address">
                              <h4>
                                <FontAwesomeIcon icon={faLocationDot} />
                                Delivery Address
                              </h4>

                              <p>
                                {[
                                  orderCustomer.address,
                                  orderCustomer.city,
                                  orderCustomer.pincode,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            </div>
                          )}

                          {orderCustomer.notes && (
                            <div className="profile-order-notes">
                              <span>Order Notes</span>
                              <p>{orderCustomer.notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
