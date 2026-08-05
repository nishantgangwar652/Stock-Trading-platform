import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../signup/Signup.css";
import { API_URL } from "../../api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to log in");

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
      <section className="signup-card">
        <h1>Welcome back</h1>
        <p>Log in to access your profile and dashboard.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Logging in..." : "Log in"}</button>
        </form>
        {message && <p className="signup-error">{message}</p>}
        <p className="signup-login-link">New to Zerodha Clone? <Link to="/Signup">Create an account</Link></p>
      </section>
    </main>
  );
}

export default Login;
