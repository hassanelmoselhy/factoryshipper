import React, { useState, useEffect } from "react";
import "./css/Scan.css"; 

const Scan = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("parcels")) || [];
    setParcels(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("parcels", JSON.stringify(parcels));
  }, [parcels]);

  const handleRegister = () => {
    const trimmed = trackingNumber.trim();
    if (trimmed === "") return;

    if (parcels.includes(trimmed)) {
      alert("هذا الطرد مسجل بالفعل ❌");
    } else {
      setParcels([...parcels, trimmed]);
    }
    setTrackingNumber("");
  };

  const handleDelete = (parcel) => {
    setParcels(parcels.filter((p) => p !== parcel));
  };

  return (
    <div className="scan-page">
      <div className="scan-container">
        <div className="scan-card">
          <div className="scan-header">
            <span>مسح وتسجيل الطرود</span>
          </div>

          <div className="scan-box">
            <div className="scan-area">📷</div>
            <p className="scan-text">امسح الرمز الشريطي أو أدخل رقم البوليصة</p>
            <input
              type="text"
              placeholder="أدخل رقم البوليصة..."
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="scan-input"
            />
            <button onClick={handleRegister} className="scan-button">
              تسجيل الطرد
            </button>
          </div>

          <hr className="scan-divider" />

          <div>
            <h4 className="scan-subtitle">
              الطرود المسجلة اليوم ({parcels.length})
            </h4>
            <div>
              {parcels.map((parcel, index) => (
                <div key={index} className="parcel-row">
                  <span>#{parcel}</span>
                  <span className="status">مسجل</span>
                  <button
                    onClick={() => handleDelete(parcel)}
                    className="delete-btn"
                  >
                    ❌
                  </button>
                </div>
              ))}
              {parcels.length === 0 && (
                <p className="empty-list">لا يوجد طرود مسجلة بعد</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;
