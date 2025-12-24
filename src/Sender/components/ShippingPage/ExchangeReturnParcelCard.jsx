import React from 'react';
import { Package, Weight, CloudUpload } from 'lucide-react';

const ExchangeReturnParcelCard = ({ formData, errors, handleChange }) => {
  return (
    <div className="premium-card">
      <div className="card-title">
        <Package size={20} />
        <span>تفاصيل الشحنه المرتجع</span>
      </div>
      
      <div className="row g-3">
        {/* Return Shipment Type Selection */}
        <div className="col-12 mb-3">
          <label className="form-label d-block mb-2">نوع الشحنة المرتجعة</label>
          <div className="d-flex gap-3 flex-wrap">
            {[
              { id: 'parcel', label: 'طرد' },
              { id: 'document', label: 'مستند' },
              { id: 'big_shipment', label: 'شحنة كبيرة', info: '?',description:"الشحنات الكبيرة التي يمكن أن تناسب شاحنة ، مثل الميكروويف ، والمروحة ، والسجاد ، وأكياس القماش ، والطاولات الجانبية ، إلخ" },
              { id: 'large_shipment', label: 'شحنة ضخمة', info: '?',description:"أغراض وأثاث أكبر التي تحتاج إلى شاحنة ، مثل مكيف وثلاجة وغسالة وسرير أريكة وطاولة طعام وغرفة نوم ، إلخ" }
            ].map((type) => (
              <div 
                key={type.id}
                onClick={() => handleChange({ target: { name: 'returnPackageType', value: type.id } })}
                className={`p-3 border rounded cursor-pointer text-center position-relative flex-grow-1 ${formData.returnPackageType === type.id ? 'bg-primary-subtle border-primary text-primary fw-bold' : 'bg-white'}`}
                style={{ minWidth: '120px', transition: 'all 0.2s', cursor: 'pointer' }}
              >
                {type.info && (
                   <span className="position-absolute top-0 start-0 m-2 text-muted small info-tooltip-container">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                     <div className="custom-tooltip">{type.description}</div>
                   </span>
                )}
                {type.label}
              </div>
            ))}
          </div>
          {errors.returnPackageType && <div className="text-danger small mt-1">{errors.returnPackageType}</div>}
        </div>

        <div className="col-md-12">
          <label className="form-label">محتوى الشحنه المرتجع</label>
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

        {/* Product Image Upload for Exchange Return */}
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-2">
               <label className="form-label mb-0">صورة المنتج <span className="text-muted small">اختياري</span></label>
            </div>
            <div className="upload-container text-center p-4 border rounded dashed-border bg-light position-relative">
              <input 
                type="file" 
                id="exchange-return-image-upload" 
                className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                onChange={(e) => handleChange({ target: { name: 'returnShipmentImage', type: 'file', files: e.target.files } })} 
                accept="image/png, image/jpeg"
              />
              <div className="d-flex align-items-center justify-content-center gap-2">
                <span className="text-primary fw-bold text-decoration-underline">اضغط للرفع</span>
                <span className="text-muted">أو اسحب وأرفق أو حمّل .</span>
              </div>
              <div className="text-muted small mt-1">يدعم JPG, PNG - بحد أقصى (800x400px)</div>
              <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                <div className="icon-circle bg-info-subtle text-info rounded-circle p-2">
                  <CloudUpload size={20} />
                </div>
              </div>
              {formData.returnShipmentImage && (
                <div className="mt-2 text-success small">
                  تم اختيار الملف: {formData.returnShipmentImage.name}
                </div>
              )}
            </div>
             <p className="text-muted small mt-1 text-end">هذا سيساعدنا في استلام الشحنة الصحيحة من عميلك.</p>
          </div>
      </div>
    </div>
  );
};

export default ExchangeReturnParcelCard;
