import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./AuthPages.css";

const API_URL = import.meta.env.VITE_API_URL;

function getRedirectPath(searchParams) {
  const redirect = searchParams.get("redirect");

  return redirect && redirect.startsWith("/") && !redirect.startsWith("//")
    ? redirect
    : "/cart";
}

const getErrorMessage = (status, serverMessage) => {
  const messages = {
    400: serverMessage || "Please check the information you entered.",
    401: "Incorrect email/mobile number or password.",
    403: "You don't have permission to access this account.",
    404: "Account not found. Please check your details or sign up.",
    408: "The request timed out. Please try again.",
    409: serverMessage || "An account with these details already exists.",
    422: serverMessage || "Please check your entered information.",
    429: "Too many login attempts. Please try again later.",
    500: "Something went wrong on our side. Please try again shortly.",
    502: "The server is temporarily unavailable. Please try again.",
    503: "LittleWonders is temporarily unavailable. Please try again later.",
    504: "The server took too long to respond. Please try again.",
  };

  return (
    messages[status] || serverMessage || "Unable to log in. Please try again."
  );
};

const parseResponse = async (response) => {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      "We couldn't process the server response. Please try again.",
    );
  }
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const identifier = form.identifier.trim();
    const password = form.password;

    if (!identifier) {
      toast.error("Please enter your email address or mobile number.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    if (!API_URL) {
      toast.error("Login is temporarily unavailable. Please try again later.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/customer/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const result = await parseResponse(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(response.status, result.message));
      }

      // The backend now sets the authentication token as an HTTP-only cookie.
      // The token is not returned in JSON or stored in localStorage.

      if (!result.success || !result.customer) {
        throw new Error(
          result.message || "We couldn't log you in. Please try again.",
        );
      }

      // Keep customer profile information for the existing UI.
      // This is not the authentication token.
      // localStorage.setItem(
      //   "littleWondersCustomer",
      //   JSON.stringify(result.customer),
      // );

      window.dispatchEvent(new Event("customerAuthChanged"));

      toast.success("Welcome back to LittleWonders!");

      navigate(getRedirectPath(searchParams), {
        replace: true,
      });
    } catch (error) {
      console.error("Customer login error:", error);

      if (error instanceof TypeError) {
        toast.error(
          "Unable to connect to LittleWonders. Please check your internet connection and try again.",
        );
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="lw-auth-page">
      <div
        className="lw-auth-decoration lw-auth-decoration-one"
        aria-hidden="true"
      />

      <div
        className="lw-auth-decoration lw-auth-decoration-two"
        aria-hidden="true"
      />

      <div className="lw-auth-card lw-auth-card-login">
        <div className="lw-auth-heading">
          <p className="lw-auth-eyebrow">WELCOME BACK</p>
          <h1>Good to see you again</h1>
          <p>Log in to continue your LittleWonders journey.</p>
        </div>

        <form className="lw-auth-form" onSubmit={handleSubmit}>
          <label className="lw-auth-field">
            <span>Email address or mobile number</span>

            <input
              type="text"
              name="identifier"
              placeholder="Enter email or mobile number"
              value={form.identifier}
              onChange={handleChange}
              autoComplete="username"
              maxLength={254}
              required
            />
          </label>

          <label className="lw-auth-field">
            <span>Password</span>

            <div className="lw-auth-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="lw-auth-show-password"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button className="lw-auth-submit" type="submit" disabled={loading}>
            {loading ? (
              "Logging you in..."
            ) : (
              <>
                Log in
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <p className="lw-auth-switch">
          New to LittleWonders?{" "}
          <Link
            to={`/signup${
              searchParams.get("redirect")
                ? `?redirect=${encodeURIComponent(
                    searchParams.get("redirect"),
                  )}`
                : ""
            }`}
          >
            Create an account
          </Link>
        </p>

        <p className="lw-auth-note">
          Your next handmade favourite is just around the corner.
        </p>
      </div>
    </section>
  );
}
