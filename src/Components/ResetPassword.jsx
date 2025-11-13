import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Sender/pages/css/ChangePass.css";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import Swal from "sweetalert2";
import LoadingOverlay from "../Sender/components/LoadingOverlay";
export default function ResetPassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,setloading]=useState(false)
  const location=useLocation()
  const [formData, setFormData] = useState({
    email:"",
    token:"",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
function getRawQueryParam(name) {
  const href = window.location.href;
  const qIndex = href.indexOf('?');
  if (qIndex === -1) return null;

  // query string without the leading '?', and ignore hash fragment
  const query = href.slice(qIndex + 1).split('#')[0];
  if (!query) return null;

  const parts = query.split('&');
  for (const p of parts) {
    const eq = p.indexOf('=');
    if (eq === -1) continue;
    const key = p.slice(0, eq);
    if (key === name) {
      // return value exactly as in URL, including %XX sequences
      return p.slice(eq + 1);
    }
  }
  return null;
}


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

          const email = getRawQueryParam("email");
          const token = getRawQueryParam('token');


    if (formData.newPassword.length < 8) {
      toast.error("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }

    const resetShipper=async()=>{
      setloading(true)

      try {
        const response = await fetch(
          "https://stakeexpress.runasp.net/api/Accounts/reset-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Client-Key": "web API",
              
            },
            body: JSON.stringify({
              token:encodeURIComponent(token),
              email:email,
              newPassword: formData.newPassword,
              confirmPassword: formData.confirmPassword,
            }),
          }
        );
  
        const data = await response.json();
  
        if (response.ok) {
          Swal.fire({
              position: "center-center",
              icon: "success",
              title: "Password Reset Successfull",
              showConfirmButton: false,
              timer: 2000
                });
  
          navigate("/");
        } else {
          console.error("❌ Reset password error:", data);
          toast.error(
            data?.message ||
              data?.errors?.NewPassword?.[0] ||
              "فشل في تغيير كلمة المرور"
          );
        }
      } catch (err) {
        toast.error("⚠️ خطأ في الاتصال بالخادم: " + err.message);
        console.error("Error:", err);
      }finally{setloading(false)}
    
    }

    
    const resetEmp=async()=>{

  try {
            const { email, password } = location.state ?? {}; // may be undefined if user refreshed/landed directly

          console.log('emp email',email,password)
          
        const response = await fetch(
          "https://stakeexpress.runasp.net/api/Accounts/first-login-change-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Client-Key": "web API",
              
            },
            body: JSON.stringify({
              
              email:email,
              currentPassword:password,
              newPassword: formData.newPassword,
              confirmPassword: formData.confirmPassword,
            }),
          }
        );
  
        const data = await response.json();
  
        if (response.ok) {
          Swal.fire({
              position: "center-center",
              icon: "success",
              title: "Password Reset Successfull",
              showConfirmButton: false,
              timer: 2000
                });
  
          navigate("/hanger/orders");
        } else {
          console.error("❌ Reset password error:", data);
          toast.error(
            data?.message ||
              data?.errors?.NewPassword?.[0] ||
              "فشل في تغيير كلمة المرور"
          );
        }
      } catch (err) {
        toast.error("⚠️ خطأ في الاتصال بالخادم: " + err.message);
        console.error("Error:", err);
      }finally{setloading(false)}
    

    }
    
      if(email&&token)
     resetShipper()

    else  resetEmp()
  };

    return (
   <>
  <LoadingOverlay
        loading={loading}
        message="please wait..."
        color="#fff"
        size={44}
      />   
   <div className="change-pass-page">
          <div className="change-pass-card">
            <div className="lock-icon">
              <FaLock />
            </div>
            <h2 className="change-pass-title">تغيير كلمة السر</h2>
            
            <p className="change-pass-subtitle">
              قم بإدخال كلمة  السر الجديدة
            </p>
    
            <form className="change-pass-form" onSubmit={handleSubmit}>
              
    
              <label className="change-pass-label">كلمة السر الجديدة</label>
              <div className="change-pass-input">
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  placeholder="أدخل كلمة السر الجديدة"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <span onClick={() => setShowNew(!showNew)}>
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
    
              <label className="change-pass-label">تأكيد كلمة السر</label>
              <div className="change-pass-input">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="أعد إدخال كلمة السر الجديدة"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
    
              <div className="change-pass-buttons">
                <button type="submit" className="save-btn">
                  حفظ التغييرات
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/")}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
   </>
  
)
}
