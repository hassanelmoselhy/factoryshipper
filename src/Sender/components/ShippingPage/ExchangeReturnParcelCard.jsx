import React from 'react';
import { Package, Weight } from 'lucide-react';

const ExchangeReturnParcelCard = ({ formData, errors, handleChange }) => {
  return (
    <div className="premium-card">
      <div className="card-title">
        <Package size={20} />
        <span>تفاصيل الطرد المرتجع</span>
      </div>
      
      <div className="row g-3">
        <div className="col-md-12">
          <label className="form-label">محتوى الطرد المرتجع</label>
          <div className="input-group">
            <span className="input-group-text"><Package size={18} /></span>
            <input 
              type="text" 
              className={`form-control ${errors.returnShipmentDescription ? 'is-invalid' : ''}`}
              name="returnShipmentDescription" 
              value={formData.returnShipmentDescription} 
              onChange={handleChange} 
              placeholder="ملابس، إلكترونيات..."
            />
          </div>
          {errors.returnShipmentDescription && <span className="text-danger small">{errors.returnShipmentDescription}</span>}
        </div>

        <div className="col-md-6">
          <label className="form-label">عدد القطع</label>
          <input 
            type="number" 
            className={`form-control ${errors.returnQuantity ? 'is-invalid' : ''}`}
            name="returnQuantity" 
            value={formData.returnQuantity} 
            onChange={handleChange} 
          />
          {errors.returnQuantity && <span className="text-danger small">{errors.returnQuantity}</span>}
        </div>

        <div className="col-md-6">
          <label className="form-label">الوزن (كجم)</label>
          <div className="input-group">
            <span className="input-group-text"><Weight size={16} /></span>
            <input 
              type="number" 
              className="form-control"
              name="returnShipmentWeight" 
              value={formData.returnShipmentWeight} 
              onChange={handleChange} 
              step="0.1" 
            />
          </div>
        </div>

        <div className="col-md-12">
          <label className="form-label">ملاحظات الشحن</label>
          <textarea 
            className="form-control"
            name="returnShipmentNotes" 
            value={formData.returnShipmentNotes} 
            onChange={handleChange} 
            rows={3}
            placeholder="قابل للكسر، يحفظ مبرداً..."
          />
        </div>
      </div>
    </div>
  );
};

export default ExchangeReturnParcelCard;
