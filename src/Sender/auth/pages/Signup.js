import React, { useEffect, useState } from 'react';
import { FaShippingFast } from 'react-icons/fa';
import '../css/Signup.css';

const Signup = () => {
  const [shippingType, setShippingType] = useState('');
  const [otherShipping, setOtherShipping] = useState('');

  useEffect(() => {
    document.body.classList.add('signup-page');
    return () => {
      document.body.classList.remove('signup-page');
    };
  }, []);

  return (
    <>
      <div className="signup-banner">
        <div className="signup-logo">
          <FaShippingFast className="signup-icon" />
          <h1 className="signup-title">Stake Express</h1>
        </div>
        <p className="signup-slogan">
          Your trusted logistics partner for fast and reliable shipping
        </p>
      </div>

      <div className="signup-container">
        <div className="signup-form-wrapper">
          <form>
            <h2 className="signup-form-title">Create Your Account</h2>
            <p className="signup-form-subtitle">
              Join thousands of satisfied customers who trust us with their shipping needs
            </p>

            {/* Personal Info */}
            <div className="signup-section">
              <h3 className="signup-section-title">Personal Information</h3>
              <div className="signup-input-group">
                <input type="text" placeholder="First Name *" />
                <input type="text" placeholder="Second Name *" />
                <input type="email" placeholder="Email Address *" />
                <input type="tel" placeholder="Phone Number *" />
              </div>
            </div>

            {/* Password Section */}
            <div className="signup-section">
              <h3 className="signup-section-title">Account Security</h3>
              <div className="signup-input-group">
                <input type="password" placeholder="Password *" />
                <input type="password" placeholder="Confirm Password *" />
              </div>
            </div>

            {/* Company Info */}
            <div className="signup-section">
              <h3 className="signup-section-title">Company Information</h3>
              <div className="signup-input-group">
                <input type="text" placeholder="Company Name *" />
                <input type="text" placeholder="Company Website" />
                <input type="text" placeholder="City *" />
                <input type="text" placeholder="Street Address *" />
              </div>
            </div>

            {/* Shipping Info */}
            <div className="signup-section">
              <h3 className="signup-section-title">Shipping Information</h3>
              <select 
                value={shippingType} 
                onChange={(e) => setShippingType(e.target.value)}
              >
                <option value="" disabled>
                  Select the type of products you typically ship
                </option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Furniture</option>
                <option>Other</option>
              </select>
{shippingType === 'Other' && (
  <input
    type="text"
    className="signup-other-input"
    placeholder="Please specify the product type"
    value={otherShipping}
    onChange={(e) => setOtherShipping(e.target.value)}
  />
)}

            </div>

            <button type="submit" className="signup-button">
              Create Account & Start Shipping
            </button>
          </form>
          <p className="signup-login-text">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
