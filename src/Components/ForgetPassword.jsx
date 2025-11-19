import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Sender/pages/css/ChangePass.css";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import useUserStore from "../Store/UserStore/userStore";
import LoadingOverlay from "../Sender/components/LoadingOverlay";
import { forgetpassword } from "../Sender/Data/AuthenticationService";
export default function ForgetPassword() {
  const [res, Setres] = useState(false);
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    resetPasswordUrl: window.location.origin,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setloading(true);
    const payload = {
      email: formData.email,
      resetPasswordUrl: formData.resetPasswordUrl,
    };

    const response = await forgetpassword(payload);
    const result = await response;
    if (result.Success) {
      Setres(result.Message);
    } else {
      Setres(result.Message);
    }
    setloading(false);
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
            قم بإدخال البريد الالكتروني الحالي
          </p>

          <p className="text-success fw-boler fs-5">{res}</p>

          <form className="change-pass-form" onSubmit={handleSubmit}>
            <label className="change-pass-label">
              البريد الألكتروني الحالي
            </label>
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
    </>
  );
}
