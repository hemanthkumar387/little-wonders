import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faEnvelope,
  faGaugeHigh,
  faMagnifyingGlass,
  faArrowRightFromBracket,
  faBars,
  faXmark,
  faRotate,
  faClock,
  faIndianRupeeSign,
  faEye,
  faEyeSlash,
  faLeaf,
  faHeart,
  faPhone,
  faUser,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import "./AdminDashboard.css";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const ORDER_STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];

const MESSAGE_STATUSES = ["Unread", "Read", "Replied"];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getErrorMessage = async (response) => {
  try {
    const result = await response.json();
    return result.message || "Something went wrong.";
  } catch {
    return "Something went wrong. Please try again.";
  }
};

// Avoid showing the same product options multiple times.
const getProductOptions = (item) => {
  if (item.optionSummary) return item.optionSummary;
  if (item.variantLabel) return item.variantLabel;

  if (item.selectedOptions && typeof item.selectedOptions === "object") {
    return Object.entries(item.selectedOptions)
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      )
      .map(([key, value]) => {
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (letter) => letter.toUpperCase());

        const displayValue =
          typeof value === "object" ? JSON.stringify(value) : String(value);

        return `${label}: ${displayValue}`;
      })
      .join(" | ");
  }

  return "";
};

const AdminDashboard = () => {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("littlewonders_admin_token") || "",
  );

  const [username, setUsername] = useState(
    () => sessionStorage.getItem("littlewonders_admin_username") || "",
  );

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [updatingItems, setUpdatingItems] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const logout = useCallback(() => {
    sessionStorage.removeItem("littlewonders_admin_token");
    sessionStorage.removeItem("littlewonders_admin_username");

    setToken("");
    setUsername("");
    setOrders([]);
    setMessages([]);
    setSelectedOrder(null);
    setSelectedMessage(null);
    setLoginForm({ username: "", password: "" });
    setPageError("");
    setActiveTab("overview");
  }, []);

  const apiRequest = useCallback(
    async (endpoint, options = {}) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error("Your admin session has expired. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      return response.json();
    },
    [token, logout],
  );

  const loadDashboard = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setPageError("");

    try {
      const [orderResult, messageResult] = await Promise.all([
        apiRequest("/api/admin/orders"),
        apiRequest("/api/admin/messages"),
      ]);

      setOrders(Array.isArray(orderResult.orders) ? orderResult.orders : []);

      setMessages(
        Array.isArray(messageResult.messages) ? messageResult.messages : [],
      );
    } catch (error) {
      setPageError(error.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [token, apiRequest]);

  // Schedule the request after the effect runs to avoid synchronous
  // state updates inside the effect.
  useEffect(() => {
    if (!token) return undefined;

    let cancelled = false;

    Promise.resolve().then(() => {
      if (!cancelled) {
        void loadDashboard();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [token, loadDashboard]);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (loginLoading) return;

    setLoginError("");

    if (!loginForm.username.trim() || !loginForm.password) {
      setLoginError("Enter your admin username and password.");
      return;
    }

    setLoginLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginForm.username.trim(),
          password: loginForm.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.token) {
        throw new Error(result.message || "Unable to log in.");
      }

      const loggedInUsername = result.username || loginForm.username.trim();

      sessionStorage.setItem("littlewonders_admin_token", result.token);
      sessionStorage.setItem("littlewonders_admin_username", loggedInUsername);

      setToken(result.token);
      setUsername(loggedInUsername);
      setLoginForm({ username: "", password: "" });
    } catch (error) {
      setLoginError(
        error.message || "Login failed. Please check your connection.",
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const updateStatus = async (type, id, status) => {
    const key = `${type}-${id}`;

    setUpdatingItems((previous) => ({
      ...previous,
      [key]: true,
    }));

    setPageError("");

    try {
      if (type === "order") {
        await apiRequest(`/api/admin/orders/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        });

        setOrders((previous) =>
          previous.map((order) =>
            order._id === id ? { ...order, status } : order,
          ),
        );

        setSelectedOrder((previous) =>
          previous?._id === id ? { ...previous, status } : previous,
        );
      } else {
        await apiRequest(`/api/admin/messages/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        });

        setMessages((previous) =>
          previous.map((message) =>
            message._id === id ? { ...message, status } : message,
          ),
        );

        setSelectedMessage((previous) =>
          previous?._id === id ? { ...previous, status } : previous,
        );
      }
    } catch (error) {
      setPageError(error.message || "Unable to update status.");
    } finally {
      setUpdatingItems((previous) => ({
        ...previous,
        [key]: false,
      }));
    }
  };

  const stats = useMemo(() => {
    const revenue = orders
      .filter((order) => order.status !== "Cancelled")
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter((order) => order.status === "Pending")
        .length,
      unreadMessages: messages.filter((message) => message.status === "Unread")
        .length,
      revenue,
    };
  }, [orders, messages]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const customer = order.customer || {};

      const values = [
        order._id,
        customer.name,
        customer.phone,
        customer.email,
        customer.city,
        customer.pincode,
        ...(order.items || []).map((item) => item.name),
      ];

      const matchesSearch =
        !query ||
        values
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      return (
        matchesSearch &&
        (statusFilter === "All" || order.status === statusFilter)
      );
    });
  }, [orders, search, statusFilter]);

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return messages.filter((message) => {
      const values = [
        message.name,
        message.phone,
        message.email,
        message.subject,
        message.message,
      ];

      const matchesSearch =
        !query ||
        values
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      return (
        matchesSearch &&
        (statusFilter === "All" || message.status === statusFilter)
      );
    });
  }, [messages, search, statusFilter]);

  const navigateTo = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setStatusFilter("All");
    setMobileMenuOpen(false);
    setSelectedOrder(null);
    setSelectedMessage(null);
    setPageError("");
  };

  const renderStatus = (status) => (
    <span
      className={`admin-status admin-status-${String(status || "pending")
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      <span className="admin-status-dot" />
      {status || "Pending"}
    </span>
  );

  const renderStatusSelect = (type, item) => {
    const statuses = type === "order" ? ORDER_STATUSES : MESSAGE_STATUSES;
    const key = `${type}-${item._id}`;

    return (
      <div className="admin-status-select-wrap">
        <select
          className="admin-status-select"
          value={item.status || statuses[0]}
          disabled={Boolean(updatingItems[key])}
          onChange={(event) => updateStatus(type, item._id, event.target.value)}
          aria-label={`Update ${type} status`}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <FontAwesomeIcon
          className="admin-select-chevron"
          icon={faChevronDown}
        />
      </div>
    );
  };

  const renderRefreshButton = () => (
    <button
      type="button"
      className="admin-refresh-button"
      onClick={loadDashboard}
      disabled={loading}
    >
      <FontAwesomeIcon icon={faRotate} spin={loading} />
      {loading ? "Refreshing..." : "Refresh"}
    </button>
  );

  const renderOrderDetailsButton = (order) => (
    <button
      type="button"
      className="admin-icon-button"
      onClick={() => setSelectedOrder(order)}
      aria-label="View order details"
    >
      <FontAwesomeIcon icon={faEye} />
    </button>
  );

  if (!token) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-decoration admin-login-decoration-one">
          ✿
        </div>

        <div className="admin-login-decoration admin-login-decoration-two">
          ♡
        </div>

        <form className="admin-login-card" onSubmit={handleLogin}>
          <div className="admin-login-logo">
            <FontAwesomeIcon icon={faLeaf} />
          </div>

          <span className="admin-eyebrow">LITTLEWONDERS MANAGEMENT</span>

          <h1>
            Welcome <span>back.</span>
          </h1>

          <p className="admin-login-description">
            Your little corner to manage orders and customer messages.
          </p>

          {loginError && (
            <div className="admin-alert admin-alert-error" role="alert">
              {loginError}
            </div>
          )}

          <label htmlFor="admin-username">Username</label>
          <input
            id="admin-username"
            type="text"
            autoComplete="username"
            placeholder="Enter admin username"
            value={loginForm.username}
            onChange={(event) =>
              setLoginForm((previous) => ({
                ...previous,
                username: event.target.value,
              }))
            }
            required
          />

          <label htmlFor="admin-password">Password</label>

          <div className="admin-password-field">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((previous) => ({
                  ...previous,
                  password: event.target.value,
                }))
              }
              required
            />

            <button
              type="button"
              className="admin-password-toggle"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loginLoading}
          >
            {loginLoading ? "Signing in..." : "Sign in to dashboard"}
          </button>

          <p className="admin-login-footer">
            <FontAwesomeIcon icon={faHeart} /> Made with care at LittleWonders
          </p>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      {mobileMenuOpen && (
        <button
          type="button"
          className="admin-mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar ${
          mobileMenuOpen ? "admin-sidebar-open" : ""
        }`}
      >
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <FontAwesomeIcon icon={faLeaf} />
          </div>

          <div>
            <h2>LittleWonders</h2>
            <span>Admin studio</span>
          </div>

          <button
            type="button"
            className="admin-mobile-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <span className="admin-nav-label">WORKSPACE</span>

        <nav className="admin-nav">
          <button
            type="button"
            className={`admin-nav-item ${
              activeTab === "overview" ? "active" : ""
            }`}
            onClick={() => navigateTo("overview")}
          >
            <FontAwesomeIcon icon={faGaugeHigh} />
            <span>Overview</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${
              activeTab === "orders" ? "active" : ""
            }`}
            onClick={() => navigateTo("orders")}
          >
            <FontAwesomeIcon icon={faBox} />
            <span>Orders</span>
            {stats.pendingOrders > 0 && (
              <span className="admin-nav-count">{stats.pendingOrders}</span>
            )}
          </button>

          <button
            type="button"
            className={`admin-nav-item ${
              activeTab === "messages" ? "active" : ""
            }`}
            onClick={() => navigateTo("messages")}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Contact messages</span>
            {stats.unreadMessages > 0 && (
              <span className="admin-nav-count">{stats.unreadMessages}</span>
            )}
          </button>
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-note">
            <FontAwesomeIcon icon={faHeart} />
            <p>Little things, lovingly managed.</p>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={logout}
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            Sign out
          </button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-menu-toggle"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          <div className="admin-topbar-heading">
            <span>YOUR LITTLEWONDERS STORE</span>
            <h1>
              {activeTab === "overview"
                ? "Good things at a glance"
                : activeTab === "orders"
                  ? "Order management"
                  : "Customer messages"}
            </h1>
          </div>

          <div className="admin-profile">
            <div className="admin-profile-avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div>
              <strong>{username || "Administrator"}</strong>
              <span>Store admin</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {pageError && (
            <div className="admin-alert admin-alert-error" role="alert">
              <span>{pageError}</span>
              <button
                type="button"
                onClick={() => setPageError("")}
                aria-label="Dismiss error"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          )}

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <>
              <div className="admin-page-intro admin-overview-intro">
                <div>
                  <span className="admin-eyebrow">YOUR STORE AT A GLANCE</span>
                  <h2>Welcome to your little studio</h2>
                  <p>Here's what's happening with your store today.</p>
                </div>

                {/* Refresh button on the main admin page */}
                {renderRefreshButton()}
              </div>

              <div className="admin-welcome-banner">
                <div>
                  <span className="admin-banner-kicker">
                    A LITTLE STORE WITH A LOT OF HEART
                  </span>
                  <h2>Every order tells a story.</h2>
                  <p>
                    Keep track of your creations, customers, and the little
                    details that make your store special.
                  </p>
                </div>

                <div className="admin-banner-decoration" aria-hidden="true">
                  ♡
                </div>
              </div>

              <div className="admin-stats-grid">
                <article className="admin-stat-card">
                  <div className="admin-stat-icon sage">
                    <FontAwesomeIcon icon={faBox} />
                  </div>
                  <span>Total orders</span>
                  <strong>{stats.totalOrders}</strong>
                  <small>All recorded orders</small>
                </article>

                <article className="admin-stat-card">
                  <div className="admin-stat-icon peach">
                    <FontAwesomeIcon icon={faClock} />
                  </div>
                  <span>Pending orders</span>
                  <strong>{stats.pendingOrders}</strong>
                  <small>Waiting for confirmation</small>
                </article>

                <article className="admin-stat-card">
                  <div className="admin-stat-icon lavender">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <span>Unread messages</span>
                  <strong>{stats.unreadMessages}</strong>
                  <small>Customer enquiries</small>
                </article>

                <article className="admin-stat-card">
                  <div className="admin-stat-icon gold">
                    <FontAwesomeIcon icon={faIndianRupeeSign} />
                  </div>
                  <span>Order value</span>
                  <strong>{formatCurrency(stats.revenue)}</strong>
                  <small>Excludes cancelled orders</small>
                </article>
              </div>

              <div className="admin-section-heading">
                <div>
                  <span className="admin-eyebrow">THE LATEST</span>
                  <h2>Recent orders</h2>
                </div>

                <button
                  type="button"
                  className="admin-text-button"
                  onClick={() => navigateTo("orders")}
                >
                  View all
                </button>
              </div>

              <div className="admin-table-card">
                {loading ? (
                  <div className="admin-empty-state">
                    <FontAwesomeIcon icon={faRotate} spin />
                    <p>Loading your store data...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="admin-empty-state">
                    <FontAwesomeIcon icon={faBox} />
                    <h3>Your first order is on its way</h3>
                    <p>Orders will appear here after customers check out.</p>
                  </div>
                ) : (
                  <div className="admin-table-scroll">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order._id}>
                            <td>
                              <span className="admin-order-id">
                                #{String(order._id).slice(-8).toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <strong>
                                {order.customer?.name || "Customer"}
                              </strong>
                              <small>{order.customer?.phone || "—"}</small>
                            </td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td className="admin-money">
                              {formatCurrency(order.total)}
                            </td>
                            <td>{renderStatus(order.status)}</td>
                            <td>{renderOrderDetailsButton(order)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="admin-section-heading admin-message-heading">
                <div>
                  <span className="admin-eyebrow">FROM YOUR CUSTOMERS</span>
                  <h2>Latest messages</h2>
                </div>

                <button
                  type="button"
                  className="admin-text-button"
                  onClick={() => navigateTo("messages")}
                >
                  View all
                </button>
              </div>

              <div className="admin-message-grid">
                {messages.length === 0 ? (
                  <div className="admin-empty-state admin-empty-card">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <p>No customer messages yet.</p>
                  </div>
                ) : (
                  messages.slice(0, 3).map((message) => (
                    <button
                      type="button"
                      className="admin-message-card"
                      key={message._id}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="admin-message-card-top">
                        <span className="admin-message-avatar">
                          {(message.name || "C").charAt(0).toUpperCase()}
                        </span>
                        {renderStatus(message.status)}
                      </div>
                      <strong>{message.name}</strong>
                      <span className="admin-message-subject">
                        {message.subject}
                      </span>
                      <p>{message.message}</p>
                      <small>{formatDate(message.createdAt)}</small>
                    </button>
                  ))
                )}
              </div>
            </>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <>
              <div className="admin-page-intro">
                <div>
                  <span className="admin-eyebrow">EVERY ORDER MATTERS</span>
                  <h2>All orders</h2>
                  <p>Review purchases and keep customers updated.</p>
                </div>
                {renderRefreshButton()}
              </div>

              <div className="admin-toolbar">
                <div className="admin-search">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                  <input
                    type="search"
                    placeholder="Search name, phone, product or order ID..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                <select
                  className="admin-filter"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter orders by status"
                >
                  <option value="All">All statuses</option>
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-results-count">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>

              <div className="admin-table-card">
                {loading ? (
                  <div className="admin-empty-state">
                    <FontAwesomeIcon icon={faRotate} spin />
                    <p>Loading orders...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="admin-empty-state">
                    <FontAwesomeIcon icon={faBox} />
                    <h3>No matching orders</h3>
                    <p>Try a different search or status filter.</p>
                  </div>
                ) : (
                  <div className="admin-table-scroll">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Customer</th>
                          <th>Products</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Update</th>
                          <th>View</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order._id}>
                            <td>
                              <span className="admin-order-id">
                                #{String(order._id).slice(-8).toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <strong>
                                {order.customer?.name || "Customer"}
                              </strong>
                              <small>{order.customer?.phone || "—"}</small>
                            </td>
                            <td>
                              <strong>
                                {order.items?.length || 0} item types
                              </strong>
                              <small>
                                {(order.items || [])
                                  .slice(0, 2)
                                  .map((item) => item.name)
                                  .join(", ")}
                              </small>
                            </td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td className="admin-money">
                              {formatCurrency(order.total)}
                            </td>
                            <td>{renderStatus(order.status)}</td>
                            <td>{renderStatusSelect("order", order)}</td>
                            <td>{renderOrderDetailsButton(order)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* CONTACT MESSAGES */}
          {activeTab === "messages" && (
            <>
              <div className="admin-page-intro">
                <div>
                  <span className="admin-eyebrow">A NOTE FROM SOMEONE</span>
                  <h2>Contact messages</h2>
                  <p>Read enquiries and follow up with your customers.</p>
                </div>
                {renderRefreshButton()}
              </div>

              <div className="admin-toolbar">
                <div className="admin-search">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                  <input
                    type="search"
                    placeholder="Search name, phone, email or message..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                <select
                  className="admin-filter"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter messages by status"
                >
                  <option value="All">All statuses</option>
                  {MESSAGE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-results-count">
                Showing {filteredMessages.length} of {messages.length} messages
              </div>

              {loading ? (
                <div className="admin-empty-state admin-table-card">
                  <FontAwesomeIcon icon={faRotate} spin />
                  <p>Loading messages...</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="admin-empty-state admin-table-card">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <h3>No matching messages</h3>
                  <p>Try a different search or status filter.</p>
                </div>
              ) : (
                <div className="admin-messages-list">
                  {filteredMessages.map((message) => (
                    <article className="admin-inbox-card" key={message._id}>
                      <div className="admin-inbox-avatar">
                        {(message.name || "C").charAt(0).toUpperCase()}
                      </div>

                      <div className="admin-inbox-content">
                        <div className="admin-inbox-top">
                          <div>
                            <h3>{message.name}</h3>
                            <span>{message.subject}</span>
                          </div>
                          {renderStatus(message.status)}
                        </div>

                        <p className="admin-inbox-message">{message.message}</p>

                        <div className="admin-inbox-meta">
                          <span>
                            <FontAwesomeIcon icon={faPhone} />
                            {message.phone || "No phone recorded"}
                          </span>
                          <span>
                            <FontAwesomeIcon icon={faEnvelope} />
                            {message.email || "No email provided"}
                          </span>
                          <span>{formatDate(message.createdAt)}</span>
                        </div>
                      </div>

                      <div className="admin-inbox-actions">
                        {renderStatusSelect("message", message)}
                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={() => setSelectedMessage(message)}
                        >
                          View message
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          <footer className="admin-footer">
            <span>
              <FontAwesomeIcon icon={faHeart} /> LittleWonders, made with care.
            </span>
            <span>Store administration</span>
          </footer>
        </div>
      </section>

      {/* ORDER DETAILS */}
      {selectedOrder && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <section
            className="admin-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-order-modal-title"
          >
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">ORDER DETAILS</span>
                <h2 id="admin-order-modal-title">
                  #{String(selectedOrder._id).slice(-8).toUpperCase()}
                </h2>
              </div>
              <button
                type="button"
                className="admin-icon-button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-detail-section">
                <h3>
                  <FontAwesomeIcon icon={faUser} /> Customer information
                </h3>
                <p>
                  <strong>Name:</strong> {selectedOrder.customer?.name || "—"}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedOrder.customer?.phone || "—"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {selectedOrder.customer?.email || "Not provided"}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {[
                    selectedOrder.customer?.address,
                    selectedOrder.customer?.city,
                    selectedOrder.customer?.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </p>
                {selectedOrder.customer?.notes && (
                  <p>
                    <strong>Notes:</strong> {selectedOrder.customer.notes}
                  </p>
                )}
              </div>

              <div className="admin-detail-section">
                <h3>
                  <FontAwesomeIcon icon={faBox} /> Ordered products
                </h3>

                {(selectedOrder.items || []).map((item, index) => {
                  const options = getProductOptions(item);
                  const quantity = Number(item.quantity) || 0;
                  const price = Number(item.price) || 0;
                  const subtotal = item.subtotal ?? quantity * price;

                  return (
                    <div
                      className="admin-order-product"
                      key={`${item.productId || item.name}-${index}`}
                    >
                      <div>
                        <strong>{item.name || "Product"}</strong>

                        {options && <small>{options}</small>}

                        <small>
                          {quantity} × {formatCurrency(price)}
                        </small>
                      </div>

                      <strong>{formatCurrency(subtotal)}</strong>
                    </div>
                  );
                })}

                <div className="admin-order-total">
                  <span>Order total</span>
                  <strong>{formatCurrency(selectedOrder.total)}</strong>
                </div>
              </div>

              <div className="admin-detail-section">
                <h3>Order status</h3>
                {renderStatusSelect("order", selectedOrder)}
                <p className="admin-detail-date">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* CONTACT MESSAGE DETAILS */}
      {selectedMessage && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMessage(null);
            }
          }}
        >
          <section
            className="admin-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-message-modal-title"
          >
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">CUSTOMER ENQUIRY</span>
                <h2 id="admin-message-modal-title">A little note</h2>
              </div>
              <button
                type="button"
                className="admin-icon-button"
                onClick={() => setSelectedMessage(null)}
                aria-label="Close message details"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-detail-section">
                <h3>{selectedMessage.name}</h3>
                <p>
                  <strong>Phone:</strong>{" "}
                  {selectedMessage.phone || "No phone recorded"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {selectedMessage.email || "Not provided"}
                </p>
                <p>
                  <strong>Subject:</strong> {selectedMessage.subject || "—"}
                </p>
                <p>
                  <strong>Received:</strong>{" "}
                  {formatDate(selectedMessage.createdAt)}
                </p>
              </div>

              <div className="admin-message-full">
                <span>MESSAGE</span>
                <p>{selectedMessage.message}</p>
              </div>

              <div className="admin-detail-section">
                <h3>Message status</h3>
                {renderStatusSelect("message", selectedMessage)}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default AdminDashboard;
