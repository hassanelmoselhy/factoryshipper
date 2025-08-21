import React from 'react';
import '../css/HangerSignin.css';
import { FaShippingFast } from 'react-icons/fa';

function SignIn() {
return (
    <div className="auth-container" style={{ backgroundImage: `url('/hanger.jpg')` }}>
      {/* Top Banner with Logo */}
    <div className="banner">
        <div className="logo">
        <FaShippingFast className="logo-icon" />
        <h1 className="title">Stake Express</h1>
        </div>
        <p className="slogan">
        Your trusted logistics partner for fast and reliable shipping
        </p>
    </div>

      {/* Main Form Box */}
    <div className="auth-form-wrapper">
        <div className="form-header">
        <h1>Sign In to Your Account</h1>
        <p>Welcome back! Please enter your credentials to continue.</p>
        </div>
        <form className="signin-form">
        <div className="form-group full-width">
            <label htmlFor="email" >Email Address *</label>
            <input type="email" id="email" placeholder="you@gmail.com" required />
        </div>

        <div className="form-group full-width">
            <label htmlFor="password">Password *</label>
            <input type="password" id="password" placeholder="••••••••" required />
        </div>

        <div className="form-options">
            <div className="checkbox-group">
            <input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe">Remember me</label>
            </div>
            <a href="/forgot-password" className="forgot-link">Forgot password?</a>
        </div>

        <button type="submit" className="submit-btn">Sign In & Continue</button>

        <p className='switch-auth-link'>
            Don't have an account? <a href="/hanger/sign-up">Sign up here</a>
        </p>
        </form>
    </div>
    </div>
);
}

export default SignIn;