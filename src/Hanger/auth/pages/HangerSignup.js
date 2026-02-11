import React from 'react';
import '../css/HangerSignup.css';
import ZoneExpressLogo from '../../../Images/ZoneExpress.jpeg';


function SignUp() {
  return (
    <>
    <div className="signup-contain" style={{ backgroundImage: `url('/hanger.jpg')` }}>
              <div className="banner">
            <div className="logo">
              <img src={ZoneExpressLogo} alt="Zone Express Logo" className="signup-icon" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
              <h1 className="title">Zone Express</h1>
            </div>
            <p className="slogan">
              Your trusted logistics partner for fast and reliable shipping
            </p>
          </div>
      <div className="signup-form-wrapper">
        <div className="form-header">
          <h1>Create Your Hanger Account</h1>
          <p>Join our network and manage your storage with ease.</p>
        </div>
        <form className="signup-form">
          <div className="form-group full-width">
            <label htmlFor="hangerName">Hanger Name / Code *</label>
            <input type="text" id="hangerName" placeholder="Enter Hanger Name or Code" required />
          </div>

          <div className="form-group full-width">
            <label htmlFor="email">Email Address *</label>
            <input type="email" id="email" placeholder="you@gmail.com" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input type="password" id="password" placeholder="••••••••" required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input type="password" id="confirmPassword" placeholder="••••••••" required />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input type="text" id="address" placeholder="123 example, st" required />
            </div>
            <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input type="tel" id="phoneNumber" placeholder="(123) 456-7890" required />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Storage Capacity *</label>
            <div className="radio-group">
              <div className="radio-option">
                <input type="radio" id="capacityFull" name="storageCapacity" value="Full" defaultChecked />
                <label htmlFor="capacityFull">Full</label>
              </div>
              <div className="radio-option">
                <input type="radio" id="capacityEmpty" name="storageCapacity" value="Empty" />
                <label htmlFor="capacityEmpty">Empty</label>
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn">Create Account</button>
          <p className='have-acc'>
            Already have an account? <a href="/hanger/sign-in">Login here</a>
          </p>
        </form>
      </div>
    </div>
    </>
  );
}

export default SignUp;