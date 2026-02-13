import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css";
import ZoneExpressLogo from "../../../Images/ZoneExpress.jpeg";
import useUserStore from "../../../Store/UserStore/userStore";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { login, RefreshToken } from "../../Data/AuthenticationService";
// Note: RefreshToken is used in shceduleRefreshToken below, not on mount.
// Session restore on mount is handled by SessionRestorer in App.js.

const Login = () => {
  const SetUser = useUserStore((state) => state.SetUser);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const showUnauthorized = location.state?.unauthorized;

  useEffect(() => {
    if (showUnauthorized) {
      // const sound = new Audio(ss);
      // sound.play().catch(() => {  });

      toast.error("غير مصرح، يرجى تسجيل الدخول أولاً");
    }
  }, [showUnauthorized]);

  useEffect(() => {
    document.body.classList.add("login-page");
    document.body.style.backgroundImage = `url(${process.env.PUBLIC_URL}/hanger.webp)`;
    return () => {
      document.body.classList.remove("login-page");
      document.body.style.backgroundImage = "";
    };
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    if (formData.password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setError("");
    setLoading(true);
    const body = JSON.stringify({
      email: formData.email.trim(),
      password: formData.password,
      confirmEmailUrl: window.location.origin + "/confirm-email",
    });

    
      const res = login(body)
      const response=await res

      if(response.Success){

        if (response.Message === "Change Password Required") {
          navigate("/reset-password", {
            state: {
              email: formData.email,
              password: formData.password,
            },
          });
        }
        else{
              console.log("🚀 Login successful:", response.Data);
                  SetUser(response.Data);
                  navigate("/home");
                  shceduleRefreshToken(response.Data.expiresOn);
                  toast.success("مرحباً بعودتك، " + response.Data?.firstName);
        }
      }else{
            
      setError(response.Message);
      console.error("🚨 Login error:", response.Message);

      }
      setLoading(false);
    
  };
  const refreshTokenExpirationhandle = () => {
    navigate("/login");
    SetUser(null);
    sessionStorage.removeItem("user");
    toast.error("انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى");
  };
  const shceduleRefreshToken = (expiresOn, refreshTokenExpiration) => {
    const expirems =
      new Date(expiresOn).getTime() - new Date().getTime() - 1 * 60 * 1000;
    const refreshTokenExpirationms =
      new Date(refreshTokenExpiration).getTime() - new Date().getTime();

    if (refreshTokenExpirationms <= 0) {
      refreshTokenExpirationhandle();
      return;
    } else if (refreshTokenExpirationms > 0) {
      setTimeout(refreshTokenExpirationhandle, refreshTokenExpirationms);
      return;
    }

    console.log("Token expires in ms:", expirems);
    if (expirems === NaN) return;

    if (expirems <= 0) {
      RefreshToken();
      return;
    }

    setTimeout(RefreshToken, expirems);
  };

  return (
    <>
      <div>
      <div className="login-split-screen">
        {/* Left Side: Brand Background Only */}
        <div className="login-brand-side">
           {/* Content removed, just background now */}
        </div>

        {/* Right Side: Form + Brand Header */}
        <div className="login-form-side">
          <div className="form-container">
            <div className="login-header-group">
                {/* Logo removed as per request */}
                <h1 className="form-brand-title">Zone Express</h1>
                <p className="form-brand-slogan">
                  شريكك الموثوق في الشحن السريع والآمن
                </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-header">
                <h2 className="form-title">مرحباً بعودتك 👋</h2>
                <p className="form-subtitle">
                  يرجى تسجيل الدخول للمتابعة إلى لوحة التحكم
                </p>
              </div>

              {error && <div className="error-alert">{error}</div>}

              <div className="input-group">
                <label>البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  dir="ltr"
                />
              </div>

              <div className="input-group">
                <label>كلمة المرور</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-100"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" /> 
                  <span>تذكرني</span>
                </label>
                <a href="/forget-password" className="forgot-link">
                  نسيت كلمة المرور؟
                </a>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "جاري التحميل..." : "تسجيل الدخول"}
              </button>

              <div className="form-footer">
                <p>
                  ليس لديك حساب؟ 
                  <a href="/signup"> إنشاء حساب جديد</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Login;