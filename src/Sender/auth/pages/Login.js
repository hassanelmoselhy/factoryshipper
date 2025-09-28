import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';
import { FaShippingFast } from 'react-icons/fa';
import useUserStore from '../../../Store/UserStore/userStore';
import {  toast } from "sonner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import LoadingOverlay from '../../components/LoadingOverlay';
const Login = () => {
const SetUser=useUserStore((state)=>state.SetUser)
const user=useUserStore((state)=>state.user)
const [showPassword, setShowPassword] = useState(false);
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


  async function RefreshToken() {

  try{

  const response=await fetch('https://stakeexpress.runasp.net/api/Accounts/refreshToken',{
    method:'GET',
    headers:{
      'Content-Type': 'application/json',
      'X-Client-Key': 'web API',
     
    },
    credentials: 'include'

  })
  const data = await response.json();
  if(response.status===200){
    SetUser(data.data);
      console.log("Token refreshed:", data);
       
        console.log("token data = ", data.data.expiresOn);
      shceduleRefreshToken(data.data.expiresOn);

  }
  console.log("Token ", data);
    
}catch(error){
console.log("Error refreshing token:", error);

}
}

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
          }),
          credentials:'include'
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Login successful:', data);

        if (data) {
          sessionStorage.setItem('user', JSON.stringify(data.data));
          SetUser(data.data);
          shceduleRefreshToken(data.data.expiresOn);
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
const refreshTokenExpirationhandle=()=>{

navigate('/login');
SetUser(null);
sessionStorage.removeItem('user');
toast.error("Session expired, please login again");

}
  const shceduleRefreshToken=(expiresOn,refreshTokenExpiration)=>{
const expirems=new Date(expiresOn).getTime()-new Date().getTime()-(1*60*1000);
const refreshTokenExpirationms=new Date(refreshTokenExpiration).getTime()-new Date().getTime();

if(refreshTokenExpirationms<=0){
refreshTokenExpirationhandle();
return;
}
else if(refreshTokenExpirationms>0 ){
  setTimeout(refreshTokenExpirationhandle,refreshTokenExpirationms );
return;
}

console.log("Token expires in ms:",expirems);
if(expirems === NaN) return;

if(expirems<=0){
RefreshToken();
return;
}

setTimeout(RefreshToken,expirems);
}
  return (
    <>
      <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />

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
              <div className='d-flex align-items-center position-relative'>
              <input
                type={showPassword?"text":"password"}
                name="password"
                placeholder="Password *"
                value={formData.password}
                onChange={handleChange}
                className='w-100'
                >
                </input>
                <button
                type='button'
                className=' btn-link p-2 text-muted password-toggle'
                onClick={()=>setShowPassword((prev)=>!prev)}
                >

                {showPassword? <AiOutlineEyeInvisible  size={"1.2em"} />:<AiOutlineEye size={"1.2em"} />}
                </button>
                </div>
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
