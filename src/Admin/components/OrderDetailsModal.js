import React, { useState } from "react";
import "./css/OrderDetailsModal.css";

const OrderDetailsModal = ({ order, onClose, onAssignRider }) => {
  const [showAssignInput, setShowAssignInput] = useState(false);
  const [riderName, setRiderName] = useState("");

  if (!order) return null;

  const handleAccept = () => {
    alert("تم قبول الطلب");
  };

  const handleReject = () => {
    alert("تم رفض الطلب");
  };

  const handleAssignRider = () => {
    setShowAssignInput(true);
  };

  const handleSaveRider = () => {
    if (riderName.trim() === "") {
      alert("من فضلك أدخل اسم المندوب");
      return;
    }

    onAssignRider(order.id, riderName);
    alert(`تم تعيين المندوب: ${riderName}`);
    onClose(); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>تفاصيل الطلب</h2>

        <div className="order-details-list">
          <p>
            <strong>رقم الطلب:</strong> {order.id}
          </p>
          <p>
            <strong>اسم التاجر:</strong> {order.merchant.name}
          </p>
          <p>
            <strong>رقم التاجر:</strong> {order.merchant.id}
          </p>
          <p>
            <strong>اسم العميل:</strong> {order.customer.name}
          </p>
          <p>
            <strong>رقم العميل:</strong> {order.customer.phone}
          </p>
          <p>
            <strong>العنوان:</strong> {order.route}
          </p>
          <p>
            <strong>الحالة:</strong> {order.status}
          </p>
          <p>
            <strong>المندوب:</strong> {order.rider ? order.rider : "لا يوجد"}
          </p>
          <p>
            <strong>المبلغ:</strong> {order.codAmount}
          </p>
          <p>
            <strong>وقت التسليم:</strong> {order.eta}
          </p>
        </div>

        <div className="modal-actions">
          {!order.rider && !showAssignInput && (
            <button className="btn-assign" onClick={handleAssignRider}>
              تعيين مندوب
            </button>
          )}
          <button className="btn-accept" onClick={handleAccept}>
            قبول
          </button>
          <button className="btn-reject" onClick={handleReject}>
            رفض
          </button>
          <button className="btn-close" onClick={onClose}>
            إغلاق
          </button>
        </div>

        {showAssignInput && (
          <div className="assign-section">
            <input
              type="text"
              placeholder="أدخل اسم المندوب"
              value={riderName}
              onChange={(e) => setRiderName(e.target.value)}
            />
            <button className="btn-save" onClick={handleSaveRider}>
              حفظ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsModal;
