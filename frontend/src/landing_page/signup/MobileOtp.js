import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { API_URL } from "../../api";

function MobileOtp() {
  const navigate = useNavigate();
  const phone = sessionStorage.getItem("signupPhone");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [seconds, setSeconds] = useState(20);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!phone) navigate("/Signup", { replace: true });
  }, [phone, navigate]);

  useEffect(() => {
    if (!seconds) return undefined;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const verifyOtp = async (event) => {
    event.preventDefault();
    if (otp.length !== 6) return setMessage("Enter the 6-digit OTP.");
    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not verify the OTP");
      sessionStorage.setItem("signupVerificationToken", data.verificationToken);
      navigate("/Signup/email");
    } catch (error) {
      setMessage(error instanceof TypeError ? "Could not reach the signup API. Start it with npm run dev, or set REACT_APP_API_URL for your deployed API." : error.message || "Unable to reach the server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (seconds) return;
    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/request-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not resend OTP");
      setSeconds(20);
      setMessage("A new OTP has been sent.");
    } catch (error) {
      setMessage(error instanceof TypeError ? "Could not reach the signup API. Start it with npm run dev, or set REACT_APP_API_URL for your deployed API." : error.message || "Unable to reach the server");
    } finally { setIsSubmitting(false); }
  };

  return <main className="otp-page">
    <section className="otp-layout">
      <div className="otp-art" aria-hidden="true"><div className="otp-card"><span>✉</span><i /><i /></div><div className="otp-bubble">••••</div></div>
      <div className="otp-panel">
        <h1>Mobile OTP</h1>
        <p className="otp-sent">Sent to +91 {phone} <Link to="/Signup">(change)</Link></p>
        <form onSubmit={verifyOtp}>
          <label className="otp-field" htmlFor="otp"><span>▯</span><input id="otp" inputMode="numeric" autoComplete="one-time-code" maxLength="6" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="••••••" autoFocus /></label>
          <p className="otp-help">Enter the 6-digit OTP. You can request a new OTP after 20 seconds.</p>
          <button className="otp-verify" type="submit" disabled={isSubmitting}>{isSubmitting ? "Verifying..." : "Verify OTP"}</button>
        </form>
        {message && <p className={message.includes("new OTP") ? "signup-success" : "signup-error"} role="status">{message}</p>}
        <button type="button" className="resend-otp" onClick={resendOtp} disabled={seconds > 0 || isSubmitting}>Resend OTP {seconds ? <>in <b>{seconds}</b> seconds</> : ""}</button>
      </div>
    </section>
  </main>;
}

export default MobileOtp;
