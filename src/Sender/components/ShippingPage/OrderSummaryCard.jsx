import React from 'react';
import { ClipboardList } from 'lucide-react';

const OrderSummaryCard = ({ formData, loading, handleSubmit, navigate }) => {
  return (
    <div className="sticky-sidebar">
      <div className="summary-card">
        <div className="summary-header">
          <ClipboardList size={22} className="text-primary" />
          <span>ملخص الطلب</span>
        </div>

        <div className="summary-content">
          <div className="summary-row">
            <span className="summary-label">العميل</span>
            <span className="summary-value">{formData.customerName || "---"}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">المحافظة</span>
            <span className="summary-value">{formData.customerAddress.governorate || "---"}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">المدينة</span>
            <span className="summary-value">{formData.customerAddress.city || "---"}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">عدد القطع</span>
            <span className="summary-value">{formData.quantity || "0"}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">نوع التوصيل</span>
            <span className="summary-value">{formData.expressDeliveryEnabled ? "سريع" : "عادي"}</span>
          </div>

          <div className="summary-row total">
            <span className="summary-label">
              {formData.isRefund ? "المبلغ المسترد" : "قيمة التحصيل"}
            </span>
            <span className="summary-value text-primary">{formData.collectionAmount ? `${formData.collectionAmount} ج.م` : "0"}</span>
          </div>

          <button type="submit" className="btn-primary-custom" disabled={loading}>
            {loading ? "جاري التنفيذ..." : "تأكيد وإنشاء الشحنة"}
          </button>

          <button type="button" className="btn-outline-custom" onClick={() => navigate(-1)}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
