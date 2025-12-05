import React from 'react';
import { Package, Weight } from 'lucide-react';

const ParcelDetailsCard = ({ shipmentType, formData, errors, handleChange }) => {
  return (
    <div className="premium-card">
      <div className="card-title">
        <Package size={20} />
        <span>{shipmentType === 'return' ? "تفاصيل الطرد المرتجع" : "تفاصيل الطرد"}</span>
      </div>
      
      <div className="row g-3">
        <div className="col-md-12">
          <label className="form-label">محتوى الطرد</label>
          <div className="input-group">
            <span className="input-group-text"><Package size={18} /></span>
            <input 
              type="text" 
              className={`form-control ${errors.shipmentDescription ? 'is-invalid' : ''}`}
              name="shipmentDescription" 
              value={formData.shipmentDescription} 
              onChange={handleChange} 
              placeholder="ملابس، إلكترونيات..."
            />
          </div>
          {errors.shipmentDescription && <span className="text-danger small">{errors.shipmentDescription}</span>}
        </div>

        <div className="col-md-6">
          <label className="form-label">عدد القطع</label>
          <input 
            type="number" 
            className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
            name="quantity" 
            value={formData.quantity} 
            onChange={handleChange} 
          />
          {errors.quantity && <span className="text-danger small">{errors.quantity}</span>}
        </div>

        <div className="col-md-6">
          <label className="form-label">الوزن (كجم)</label>
          <div className="input-group">
            <span className="input-group-text"><Weight size={16} /></span>
            <input 
              type="number" 
              className="form-control"
              name="shipmentWeight" 
              value={formData.shipmentWeight} 
              onChange={handleChange} 
              step="0.1" 
            />
          </div>
        </div>

        <div className="col-md-12">
          <label className="form-label">ملاحظات الشحن</label>
          <textarea 
            className="form-control"
            name="shipmentNotes" 
            value={formData.shipmentNotes} 
            onChange={handleChange} 
            rows={3}
            placeholder="قابل للكسر، يحفظ مبرداً..."
          />
        </div>
      </div>
    </div>
  );
};

export default ParcelDetailsCard;
