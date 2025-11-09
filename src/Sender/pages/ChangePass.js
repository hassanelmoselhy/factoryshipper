import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ChangePass.css";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function ChangePass() {
const [showCurrent, setShowCurrent] = useState(false);
const [showNew, setShowNew] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);

const navigate = useNavigate();

const handleSubmit = (e) => {
e.preventDefault();
    alert("تم تعيين كلمة السر الجديدة");
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
          {/* current password */}
        <label className="change-pass-label">كلمة السر الحالية</label>
        <div className="change-pass-input">
            <input
            type={showCurrent ? "text" : "password"}
            placeholder="أدخل كلمة السر الحالية"
            required
            />
            <span onClick={() => setShowCurrent(!showCurrent)}>
            {showCurrent ? <FaEyeSlash /> : <FaEye />}
            </span>
        </div>

          {/* new password */}
        <label className="change-pass-label">كلمة السر الجديدة</label>
        <div className="change-pass-input">
            <input
            type={showNew ? "text" : "password"}
            placeholder="أدخل كلمة السر الجديدة"
            required
            />
            <span onClick={() => setShowNew(!showNew)}>
            {showNew ? <FaEyeSlash /> : <FaEye />}
            </span>
        </div>

          {/* confirm password */}
        <label className="change-pass-label">تأكيد كلمة السر</label>
        <div className="change-pass-input">
            <input
            type={showConfirm ? "text" : "password"}
            placeholder="أعد إدخال كلمة السر الجديدة"
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
