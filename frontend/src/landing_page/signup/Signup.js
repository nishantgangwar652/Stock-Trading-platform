import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { API_URL } from "../../api";

function Signup() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneSubmit = async (event) => {
    event.preventDefault();
    const number = phoneNumber.replace(/\D/g, "");
    if (number.length !== 10) {
      setMessage("Enter a valid 10-digit mobile number.");
      return;
    }

    setMessage("");
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: number }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to send OTP");
      sessionStorage.setItem("signupPhone", number);
      navigate("/Signup/otp");
    } catch (error) {
      setMessage(error instanceof TypeError ? "Could not reach the signup API. Start it with npm run dev, or set REACT_APP_API_URL for your deployed API." : error.message || "Unable to reach the server");
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

      <section className="signup-content" aria-label="Create your account">
        <div className="signup-artwork">
          <img src="/images/signup.png" alt="A preview of Zerodha's investing platforms" />
        </div>

        <div className="signup-form-panel">
          <h2>Signup now</h2>
          <p className="signup-subtitle">Or track your existing application</p>
          <form onSubmit={handlePhoneSubmit} noValidate>
            <label className="phone-field" htmlFor="mobile-number">
              <span className="country-code" aria-hidden="true"><span className="india-flag">🇮🇳</span> +91</span>
              <input
                id="mobile-number"
                name="mobile-number"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Enter your mobile number"
                aria-describedby={message ? "signup-message" : undefined}
              />
            </label>
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending OTP..." : "Get OTP"}</button>
          </form>
          {message && <p id="signup-message" className={message.startsWith("OTP") ? "signup-success" : "signup-error"} role="status">{message}</p>}
          <p className="signup-terms">By proceeding, you agree to the Zerodha <a href="https://zerodha.com/terms-and-conditions/" target="_blank" rel="noreferrer">terms</a> &amp; <a href="https://zerodha.com/privacy/" target="_blank" rel="noreferrer">privacy policy</a></p>
          <p className="signup-nri">Looking to open NRI account? <Link to="/Support">Click here</Link></p>
        </div>
      </section>
    </main>
  );
}

export default Signup;
