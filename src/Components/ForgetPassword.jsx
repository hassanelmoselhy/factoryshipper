import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Sender/pages/css/ChangePass.css";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import useUserStore from "../Store/UserStore/userStore";
import Swal from "sweetalert2";

export default function ForgetPassword() {
 const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [res, Setres] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    resetPasswordUrl: "http://localhost:3000",
  });

  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const token = user?.token || localStorage.getItem("token");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await fetch(
        "https://stakeexpress.runasp.net/api/Accounts/forget-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API"
            
          },
          body: JSON.stringify({
            email: formData.email,
            resetPasswordUrl: formData.resetPasswordUrl
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log('email send success',data)
        Setres(data?.message)

      } else {
        console.error("error in sending email", data);
         Setres(data?.message)

      }
    } catch (err) {
      toast.error("⚠️ خطأ في الاتصال بالخادم: " + err.message);
      console.error("Error:", err);
    }
  };

    return (
    <div className="change-pass-page">
          <div className="change-pass-card">
            <div className="lock-icon">
              <FaLock />
            </div>
            <h2 className="change-pass-title">تغيير كلمة السر</h2>
            <p className="change-pass-subtitle">
              قم بإدخال البريد الالكتروني الحالي
            </p>

            <p>{res}</p>

            <form className="change-pass-form" onSubmit={handleSubmit}>
              <label className="change-pass-label">البريد الألكتروني الحالي</label>
              <div className="change-pass-input">
                <input
                  type="email"
                  name="email"
                  placeholder="أدخل البريد الألكتروني الحالي"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                
              </div>
   
    
              <div className="change-pass-buttons">
                <button type="submit" className="save-btn">
                  ارسال
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
  )
}
