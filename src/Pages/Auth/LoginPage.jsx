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

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = form.email.trim().toLowerCase();
    if (!email || !form.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/customer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: form.password }),
      });
      const result = await response.json();

      if (
        !response.ok ||
        !result.success ||
        !result.token ||
        !result.customer
      ) {
        throw new Error(result.message || "Invalid email or password.");
      }

      localStorage.setItem("littleWondersCustomerToken", result.token);
      localStorage.setItem(
        "littleWondersCustomer",
        JSON.stringify(result.customer),
      );
      window.dispatchEvent(new Event("customerAuthChanged"));
      toast.success("Welcome back to LittleWonders!");
      navigate(getRedirectPath(searchParams), { replace: true });
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
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
            <span>Email address</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
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
            to={`/signup${searchParams.get("redirect") ? `?redirect=${encodeURIComponent(searchParams.get("redirect"))}` : ""}`}
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
