import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import HomePage from './landing_page/home/HomePage';
import Signup from './landing_page/signup/Signup';
import MobileOtp from './landing_page/signup/MobileOtp';
import EmailSignup from './landing_page/signup/EmailSignup';
import Login from './landing_page/login/Login';
import AboutPage from './landing_page/about/AboutPage';
import ProductsPage from './landing_page/products/ProductsPage';
import PricingPage from './landing_page/pricing/PricingPage';
import SupportPage from './landing_page/support/SupportPage';
import Notfound from './landing_page/Notfound';
import Navbar from './landing_page/Navbar';
import Footer from './landing_page/Footer';
import Profile from './landing_page/profile/Profile';

function AppRoutes() {
  const { pathname } = useLocation();
  const isSignupPage = pathname.toLowerCase().startsWith('/signup');

  return <>
    {!isSignupPage && <Navbar />}
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/Signup" element={<Signup />}></Route>
      <Route path="/Signup/otp" element={<MobileOtp />}></Route>
      <Route path="/Signup/email" element={<EmailSignup />}></Route>
      <Route path="/Login" element={<Login />}></Route>
      <Route path="/Profile" element={<Profile />}></Route>
      <Route path="/About" element={<AboutPage />}></Route>
      <Route path="/Products" element={<ProductsPage />}></Route>
      <Route path="/Pricing" element={<PricingPage />}></Route>
      <Route path="/Support" element={<SupportPage />}></Route>
      <Route path="*" element={<Notfound />}/>
    </Routes>
    {!isSignupPage && <Footer />}
  </>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
