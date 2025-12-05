import React from 'react';
import { RotateCcw, FileText } from 'lucide-react';

const ReturnLocationCard = ({ shipmentType, formData, handleChange, returnLocationOptions }) => {
  return (
    <div className="premium-card">
      {/* Tracking Number for Exchange/Return */}
      {(shipmentType === 'exchange' || shipmentType === 'return') && (
        <div className="mb-4">
          <label className="form-label">رقم تتبع الأوردر المراد إرجاعه <span className="optional-badge">اختياري</span></label>
          <div className="input-group">
            <span className="input-group-text"><FileText size={18} /></span>
            <input 
              type="text" 
              className="form-control"
              name="exchangeOrderReference" 
              value={formData.exchangeOrderReference} 
              onChange={handleChange}
              placeholder="رقم التتبع..."
            />
            <button className="btn btn-outline-secondary" type="button">تطبيق</button>
          </div>
          <div className="form-text text-end">لملء البيانات اوتوماتيكيًا</div>
        </div>
      )}

      <div className="card-title">
        <RotateCcw size={20} />
        <span>موقع الإرجاع</span>
      </div>
      
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">اختر موقع الإرجاع</label>
          <select 
            className="form-select"
            name="returnLocation" 
            value={formData.returnLocation} 
            onChange={handleChange}
          >
            {returnLocationOptions.map(opt => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ""}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">مرجع الطلب <span className="optional-badge">اختياري</span></label>
          <div className="input-group">
            <span className="input-group-text"><FileText size={18} /></span>
            <input 
              type="text" 
              className="form-control"
              name="orderReference" 
              value={formData.orderReference} 
              onChange={handleChange}
              placeholder="#REF-123"
            />
          </div>
        </div>

        <div className="col-md-12">
          <label className="form-label">ملحوظات التوصيل <span className="optional-badge">اختياري</span></label>
          <textarea 
            className="form-control"
            name="deliveryNotes" 
            value={formData.deliveryNotes} 
            onChange={handleChange}
            placeholder="تعليمات للمندوب..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default ReturnLocationCard;
