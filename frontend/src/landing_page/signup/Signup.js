import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { API_URL } from "../../api";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to create account");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      document.cookie = `token=${encodeURIComponent(data.token)}; Path=/; SameSite=Lax`;
      window.dispatchEvent(new Event("authChanged"));
      navigate("/", { replace: true });
    } catch (error) {
      setMessage(error.message || "Unable to reach the server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="signup-page">
      <header className="signup-hero">
        <h1>Open a free demat and trading account online</h1>
        <p>Start investing brokerage free and join a community of 1.6+ crore investors and traders</p>
      </header>

      <section className="email-signup-card" aria-label="Create your account">
        <h2>Signup now</h2>
        <p className="signup-subtitle">Create an account with your email address.</p>
        <form onSubmit={handleSignup}>
          <input aria-label="Full name" name="name" placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <input aria-label="Email address" name="email" type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <input aria-label="Password" name="password" type="password" minLength="6" placeholder="Create a password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}</button>
          </form>
        {message && <p className="signup-error" role="status">{message}</p>}
        <p className="signup-terms">By proceeding, you agree to the Zerodha <a href="https://zerodha.com/terms-and-conditions/" target="_blank" rel="noreferrer">terms</a> &amp; <a href="https://zerodha.com/privacy/" target="_blank" rel="noreferrer">privacy policy</a>.</p>
        <p className="signup-nri">Already have an account? <Link to="/Login">Log in</Link></p>
      </section>
    </main>
  );
}

export default Signup;
