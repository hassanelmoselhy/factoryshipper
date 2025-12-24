import React from 'react';
import { ClipboardList } from 'lucide-react';

const OrderSummaryCard = ({ formData, loading, handleSubmit, navigate, shipmentType }) => {
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

          {shipmentType !== 'cash_collection' && (
          <div className="summary-row">
            <span className="summary-label">عدد القطع</span>
            <span className="summary-value">{formData.quantity || "0"}</span>
          </div>
          )}

          {/* Pricing Breakdown */}
          <div className="summary-divider"></div>
          
          <div className="summary-row">
            <span className="summary-label">سعر الشحن</span>
            <span className="summary-value">{formData.shipmentPrice || 0} ج.م</span>
          </div>
          
          <div className="summary-row">
            <span className="summary-label">رسوم وزن إضافي</span>
            <span className="summary-value">{formData.additionalWeightFees || 0} ج.م</span>
          </div>
          
          <div className="summary-row">
            <span className="summary-label fw-bold">إجمالي رسوم الشحن</span>
            <span className="summary-value fw-bold">{(Number(formData.shipmentPrice || 0) + Number(formData.additionalWeightFees || 0)).toFixed(1)} ج.م</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row total">
            <span className="summary-label">
              {formData.isRefund ? "المبلغ المسترد" : "قيمة التحصيل"}
            </span>
            <span className="summary-value text-primary">{formData.collectionAmount ? `${formData.collectionAmount} ج.م` : "0"}</span>
          </div>

          <button type="submit" className="btn-primary-custom" disabled={loading}>
            {loading ? "جاري التنفيذ..." : "تأكيد وإنشاء الأوردر"}
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
