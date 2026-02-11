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
        <div className="loginPage-container">
          <div className="login-banner">
            <div className="login-logo">
              <img src={ZoneExpressLogo} alt="Zone Express Logo" className="login-icon" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
              <h1 className="login-title">Zone Express</h1>
            </div>
            <p className="login-slogan">
              شريكك الموثوق في الشحن السريع والآمن
            </p>
          </div>

          <div className="login-container">
            <div className="login-form-wrapper">
              <form onSubmit={handleSubmit}>
                <h2 className="login-form-title">تسجيل الدخول إلى حسابك</h2>
                <p className="login-form-subtitle">
                  مرحباً بعودتك! يرجى إدخال بياناتك للمتابعة
                </p>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <div className="login-input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="البريد الإلكتروني *"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <div className="d-flex align-items-center position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="كلمة المرور *"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-100"
                    ></input>
                    <button
                      type="button"
                      className=" btn-link p-2 text-muted password-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible size={"1.2em"} />
                      ) : (
                        <AiOutlineEye size={"1.2em"} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="login-options">
                  <label>
                    <input type="checkbox" /> تذكرني
                  </label>
                  <a href="/forget-password" className="login-forgot-link">
                    نسيت كلمة المرور؟
                  </a>
                </div>

                <button
                  type="submit"
                  className="login-submit-button"
                  disabled={loading}
                >
                  {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </button>
                <p className="login-footer-text">
                  هل أنت تاجر؟ ليس لديك حساب؟{" "}
                  <a href="/signup">سجل من هنا</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;