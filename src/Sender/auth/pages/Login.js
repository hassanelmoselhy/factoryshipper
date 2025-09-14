import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';
import { FaShippingFast } from 'react-icons/fa';
import useUserStore from '../../../Store/UserStore/userStore';
import {  toast } from "sonner";
const Login = () => {
const SetUser=useUserStore((state)=>state.SetUser)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    if(formData.password.length < 8){

      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'https://stakeexpress.runasp.net/api/Accounts/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Key': 'web API'
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Login successful:', data);

        if (data) {
          sessionStorage.setItem('user', JSON.stringify(data));
          SetUser(data.data);
        toast.success("Login successfuly ");
        }

        navigate('/home');
      } else {
        console.error('🚨 Login error:', data);
        setError(`❌ ${data.message}`);
      }
    } catch (err) {
      setError('❌ خطأ في الاتصال: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-overlay"></div>
      <div className="login-banner">
        <div className="login-logo">
          <FaShippingFast className="login-icon" />
          <h1 className="login-title">Stake Express</h1>
        </div>
        <p className="login-slogan">
          Your trusted logistics partner for fast and reliable shipping
        </p>
      </div>

      <div className="login-container">
        <div className="login-form-wrapper">
          <form onSubmit={handleSubmit}>
            <h2 className="login-form-title">Sign In to Your Account</h2>
            <p className="login-form-subtitle">
              Welcome back! Please enter your credentials to continue
            </p>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="login-input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password *"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="login-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="/" className="login-forgot-link">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In & Continue'}
            </button>
            <p className="login-footer-text">
             Are you shipper?,Don’t have an account? <a href="/signup">Sign up here</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
