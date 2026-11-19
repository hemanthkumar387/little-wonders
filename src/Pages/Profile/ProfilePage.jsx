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
  faRightFromBracket,
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

// Safely parse API responses
const parseResponse = async (response) => {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      "Invalid server response. Please check your backend API and try again."
    );
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

  return `₹${(
    Number.isFinite(value) ? value : 0
  ).toLocaleString("en-IN")}`;
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

const getItemQuantity = (item) =>
  Number(item.quantity || item.qty || 1);

const getItemPrice = (item) =>
  Number(item.price || item.unitPrice || item.product?.price || 0);

const getOrderTotal = (order) =>
  order.totalAmount ??
  order.total ??
  order.grandTotal ??
  order.amount ??
  order.finalAmount ??
  0;

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
  const [expandedOrder, setExpandedOrder] = useState(null);

  const token = localStorage.getItem("littleWondersCustomerToken");

  const logout = useCallback(() => {
    localStorage.removeItem("littleWondersCustomerToken");
    localStorage.removeItem("littleWondersCustomer");

    window.dispatchEvent(new Event("customerAuthChanged"));

    toast.success("You have been logged out.");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/login?redirect=%2Fprofile", { replace: true });
      return;
    }

    const fetchProfileData = async () => {
      setLoading(true);

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [profileResponse, ordersResponse] = await Promise.all([
          fetch(`${API_URL}/api/customer/me`, { headers }),
          fetch(`${API_URL}/api/customer/orders`, { headers }),
        ]);

        if (
          profileResponse.status === 401 ||
          ordersResponse.status === 401
        ) {
          logout();
          return;
        }

        const [profileResult, ordersResult] = await Promise.all([
          parseResponse(profileResponse),
          parseResponse(ordersResponse),
        ]);

        if (!profileResponse.ok) {
          throw new Error(
            profileResult.message || "Unable to load your profile."
          );
        }

        if (!ordersResponse.ok) {
          throw new Error(
            ordersResult.message || "Unable to load your orders."
          );
        }

        const updatedCustomer =
          profileResult.customer ||
          profileResult.data ||
          profileResult;

        setCustomer(updatedCustomer);

        localStorage.setItem(
          "littleWondersCustomer",
          JSON.stringify(updatedCustomer)
        );

        const customerOrders = Array.isArray(ordersResult)
          ? ordersResult
          : ordersResult.orders || ordersResult.data || [];

        setOrders(
          Array.isArray(customerOrders) ? customerOrders : []
        );
      } catch (error) {
        console.error("Profile loading error:", error);
        toast.error(error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token, navigate, logout]);

  const toggleOrder = (orderId) => {
    setExpandedOrder((current) =>
      current === orderId ? null : orderId
    );
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loader"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <section className="profile-page">
      <div className="profile-container">
        <div className="profile-heading">
          <div>
            <span className="profile-eyebrow">LITTLEWONDERS</span>
            <h1>My Account</h1>
            <p>
              Manage your details and keep track of your orders.
            </p>
          </div>

          <button
            type="button"
            className="profile-logout-button"
            onClick={logout}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </button>
        </div>

        <div className="profile-content">
          {/* Customer details */}
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
                <strong>
                  {customer?.name || "Not available"}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>Email Address</span>
                <strong>
                  {customer?.email || "Not available"}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>Mobile Number</span>
                <strong>
                  {customer?.phone || "Not available"}
                </strong>
              </div>
            </div>
          </div>

          {/* Order history */}
          <div className="profile-orders-section">
            <div className="profile-orders-heading">
              <div>
                <h2>My Orders</h2>
                <p>
                  All your LittleWonders purchases in one place.
                </p>
              </div>

              <span className="profile-order-count">
                {orders.length}{" "}
                {orders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="profile-empty-orders">
                <div className="profile-empty-icon">
                  <FontAwesomeIcon icon={faBoxOpen} />
                </div>

                <h3>No orders yet</h3>

                <p>
                  Your handmade favourites are waiting for you.
                  Explore our collection and place your first order!
                </p>

                <Link
                  to="/products"
                  className="profile-shop-button"
                >
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

                  // Your backend stores address and notes inside customer
                  const orderCustomer = order.customer || {};

                  return (
                    <div
                      className="profile-order-card"
                      key={orderId}
                    >
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
                                order.orderNumber ||
                                  order._id ||
                                  index + 1
                              ).slice(-8)}
                            </h3>

                            <span className="profile-order-date">
                              <FontAwesomeIcon icon={faCalendar} />
                              {formatDate(
                                order.createdAt ||
                                  order.orderDate ||
                                  order.date
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="profile-order-right">
                          <strong>
                            {formatMoney(getOrderTotal(order))}
                          </strong>

                          <span className={`profile-status ${status}`}>
                            {order.status || "Pending"}
                          </span>

                          <FontAwesomeIcon
                            className="profile-order-chevron"
                            icon={
                              isExpanded
                                ? faChevronUp
                                : faChevronDown
                            }
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="profile-order-details">
                          <h4>Order Items</h4>

                          <div className="profile-order-items">
                            {items.length === 0 ? (
                              <p>No item details available.</p>
                            ) : (
                              items.map((item, itemIndex) => (
                                <div
                                  className="profile-order-item"
                                  key={
                                    item._id ||
                                    item.id ||
                                    itemIndex
                                  }
                                >
                                  <div>
                                    <strong>
                                      {getItemName(item)}
                                    </strong>

                                    <span>
                                      Qty: {getItemQuantity(item)}
                                    </span>
                                  </div>

                                  <strong>
                                    {formatMoney(
                                      getItemPrice(item) *
                                        getItemQuantity(item)
                                    )}
                                  </strong>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="profile-order-total">
                            <span>Total Amount</span>

                            <strong>
                              {formatMoney(getOrderTotal(order))}
                            </strong>
                          </div>

                          {orderCustomer.address && (
                            <div className="profile-delivery-address">
                              <h4>
                                <FontAwesomeIcon
                                  icon={faLocationDot}
                                />
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