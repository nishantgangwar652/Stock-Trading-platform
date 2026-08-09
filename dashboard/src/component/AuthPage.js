import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000";

const AuthPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/login`, form);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to reach the server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Welcome back</h1>
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" minLength="6" placeholder="Password (at least 6 characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="auth-error">{error}</p>}
        <button disabled={isSubmitting}>{isSubmitting ? "Please wait..." : "Log in"}</button>
        <p>New here? <a href={`${FRONTEND_URL}/Signup`}>Create an account</a></p>
      </form>
    </main>
  );
};

export default AuthPage;
