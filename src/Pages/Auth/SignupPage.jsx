import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./AuthPages.css";

const API_URL = import.meta.env.VITE_API_URL;

function getRedirectPath(searchParams) {
  const redirect = searchParams.get("redirect");
  return redirect && redirect.startsWith("/") && !redirect.startsWith("//")
    ? redirect
    : "/cart";
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();

    if (!name || !email || !phone || !form.password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/customer/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password: form.password }),
      });
      const result = await response.json();

      if (!response.ok || !result.success || !result.token || !result.customer) {
        throw new Error(result.message || "Unable to create your account. Please try again.");
      }

      localStorage.setItem("littleWondersCustomerToken", result.token);
      localStorage.setItem("littleWondersCustomer", JSON.stringify(result.customer));
      window.dispatchEvent(new Event("customerAuthChanged"));
      toast.success("Your LittleWonders account is ready!");
      navigate(getRedirectPath(searchParams), { replace: true });
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="lw-auth-page">
      <div className="lw-auth-decoration lw-auth-decoration-one" aria-hidden="true" />
      <div className="lw-auth-decoration lw-auth-decoration-two" aria-hidden="true" />

      <div className="lw-auth-card lw-auth-card-signup">
        <div className="lw-auth-brand">
          <span className="lw-auth-brand-mark">✿</span>
          <span className="lw-auth-brand-name">LittleWonders</span>
          <span className="lw-auth-brand-tagline">CREATE WITH LOVE</span>
        </div>

        <div className="lw-auth-heading">
          <p className="lw-auth-eyebrow">A LITTLE HELLO, A LOT OF LOVE</p>
          <h1>Create your account</h1>
          <p>Join our little community and make every order special.</p>
        </div>

        <form className="lw-auth-form" onSubmit={handleSubmit}>
          <label className="lw-auth-field">
            <span>Full name</span>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              maxLength={100}
              required
            />
          </label>

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
            <span>Mobile number</span>
            <input
              type="tel"
              name="phone"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
              inputMode="numeric"
              maxLength={10}
              required
            />
          </label>

          <label className="lw-auth-field">
            <span>Password</span>
            <div className="lw-auth-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />
              <button type="button" className="lw-auth-show-password" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <label className="lw-auth-field">
            <span>Confirm password</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Enter your password again"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </label>

          <button className="lw-auth-submit" type="submit" disabled={loading}>
            {loading ? "Creating your account..." : "Create account"}
            {!loading && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <p className="lw-auth-switch">
          Already part of LittleWonders? <Link to={`/login${searchParams.get("redirect") ? `?redirect=${encodeURIComponent(searchParams.get("redirect"))}` : ""}`}>Log in</Link>
        </p>
        <p className="lw-auth-note">Made with care, just like everything at LittleWonders.</p>
      </div>
    </section>
  );
}
