import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { API_URL } from "../../api";

function EmailSignup() {
  const navigate = useNavigate();
  const phone = sessionStorage.getItem("signupPhone");
  const verificationToken = sessionStorage.getItem("signupVerificationToken");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { if (!phone || !verificationToken) navigate("/Signup", { replace: true }); }, [phone, verificationToken, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); setMessage("");
    try {
      const response = await fetch(`${API_URL}/signup`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, phone, verificationToken }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to create account");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      document.cookie = `token=${encodeURIComponent(data.token)}; Path=/; SameSite=Lax`;
      sessionStorage.removeItem("signupPhone");
      sessionStorage.removeItem("signupVerificationToken");
      window.dispatchEvent(new Event("authChanged"));
      navigate("/", { replace: true });
    } catch (error) { setMessage(error.message || "Unable to reach the server"); }
    finally { setIsSubmitting(false); }
  };

  return <main className="email-signup-page"><section className="email-signup-card"><p className="email-signup-kicker">Mobile number verified</p><h1>Create your account</h1><p>Use your email to complete your signup.</p><form onSubmit={submit}><input aria-label="Full name" name="name" placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /><input aria-label="Email address" name="email" type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /><input aria-label="Password" name="password" type="password" minLength="6" placeholder="Create a password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /><button disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}</button></form>{message && <p className="signup-error" role="status">{message}</p>}</section></main>;
}

export default EmailSignup;
