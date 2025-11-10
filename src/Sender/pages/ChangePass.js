import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ChangePass.css";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import useUserStore from "../../Store/UserStore/userStore";
import Swal from "sweetalert2";

export default function ChangePass() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const token = user?.token || localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("المستخدم غير مسجّل الدخول");
      navigate("/login"); 
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 8) {
      toast.error("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }

    if (!token) {
      toast.error("المستخدم غير مسجّل الدخول");
      return;
    }

    try {
      const response = await fetch(
        "https://stakeexpress.runasp.net/api/Accounts/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
            Authorization: `Bearer ${token}`, 
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
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
            title: "Password Created Successfully",
            showConfirmButton: false,
            timer: 2000
              });
        navigate("/home");
      } else {
        console.error("❌ Change password error:", data);
        toast.error(
          data?.message ||
            data?.errors?.NewPassword?.[0] ||
            "فشل في تغيير كلمة المرور"
        );
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
          قم بإدخال كلمة السر الحالية وكلمة السر الجديدة
        </p>

        <form className="change-pass-form" onSubmit={handleSubmit}>
          <label className="change-pass-label">كلمة السر الحالية</label>
          <div className="change-pass-input">
            <input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              placeholder="أدخل كلمة السر الحالية"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowCurrent(!showCurrent)}>
              {showCurrent ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

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
              onClick={() => navigate("/home")}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
