import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./component/Home";
import AuthPage from "./component/AuthPage";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

const getToken = () =>
  localStorage.getItem("token") ||
  document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("token="))
    ?.split("=")[1];

const ProtectedRoute = ({ children }) =>
  getToken() ? children : <Navigate to="/login" replace />;

const DashboardLogin = () => {
  const [isExchanging, setIsExchanging] = useState(() =>
    Boolean(new URLSearchParams(window.location.search).get("loginCode"))
  );

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("loginCode");
    if (!code) return;

    const exchangeCode = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard-login-code/exchange`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        localStorage.setItem("token", data.token);
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch {
        window.history.replaceState({}, document.title, window.location.pathname);
      } finally {
        setIsExchanging(false);
      }
    };

    exchangeCode();
  }, []);

  if (isExchanging) return <main className="auth-page">Signing you in…</main>;
  return <ProtectedRoute><Home /></ProtectedRoute>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<Navigate to="/login" replace />} />
        <Route path="/*" element={<DashboardLogin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
