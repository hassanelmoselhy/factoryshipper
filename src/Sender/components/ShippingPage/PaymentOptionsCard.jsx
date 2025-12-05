import React from 'react';
import { CreditCard, RefreshCw, DollarSign } from 'lucide-react';
import '../../pages/css/PaymentOptions.css';

const PaymentOptionsCard = ({ shipmentType, formData, errors, handleChange, setFormData }) => {
  return (
    <div className="premium-card payment-options-enhanced">
      <div className="card-title">
        <CreditCard size={20} />
        <span>الدفع والتسليم</span>
      </div>
      
      <div className="row g-4">
        <div className="col-md-6">
          <div className="d-flex flex-column gap-3">
            {/* Payment Direction Options for Exchange/Return */}
            {(shipmentType === 'exchange' || shipmentType === 'return') && (
              <div className="payment-direction-options mb-2">
                <label className="form-label mb-2">نوع المعاملة المالية</label>
                <div className="d-flex gap-3">
                  {shipmentType === 'exchange' && (
                    <div 
                      className={`payment-option-card flex-grow-1 ${!formData.isRefund ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, isRefund: false }))}
                    >
                      <input 
                        type="radio" 
                        name="paymentDirection" 
                        checked={!formData.isRefund} 
                        readOnly 
                      />
                      <label>تحصيل من العميل</label>
                    </div>
                  )}
                  
                  <div 
                    className={`payment-option-card flex-grow-1 ${formData.isRefund ? 'selected' : ''}`}
                    onClick={() => shipmentType === 'exchange' && setFormData(prev => ({ ...prev, isRefund: true }))}
                    style={shipmentType === 'return' ? { cursor: 'default', opacity: 1 } : {}}
                  >
                    <input 
                      type="radio" 
                      name="paymentDirection" 
                      checked={formData.isRefund} 
                      readOnly 
                    />
                    <label>إرجاع للعميل</label>
                  </div>
                </div>
              </div>
            )}

            <div className={`payment-option-card ${formData.openPackageOnDeliveryEnabled ? 'selected' : ''}`} onClick={() => setFormData(prev => ({...prev, openPackageOnDeliveryEnabled: !prev.openPackageOnDeliveryEnabled}))}>
              <div className="d-flex align-items-start gap-2 w-100">
                <input type="checkbox" checked={formData.openPackageOnDeliveryEnabled} readOnly className="mt-1" />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="mb-0" style={{cursor: 'pointer'}}>السماح للعميل بفتح الشحنة؟</label>
                    <span className="text-muted" title="معلومات إضافية"><RefreshCw size={14} /></span>
                  </div>
                  <small className="text-muted d-block mt-1">سيتم تطبيق رسوم 7 ج.م على عملية التوصيل</small>
                </div>
              </div>
            </div>

            <div className="product-value-section">
              <label className="form-label d-flex justify-content-between">
                <span>قيمة المنتج</span>
                <span className="text-muted" title="معلومات"><RefreshCw size={14} /></span>
              </label>
              <div className="d-flex gap-2">
                <div className="input-group flex-grow-1 enhanced-input-group">
                  <input 
                    type="number" 
                    className="form-control" 
                    name="productValue" 
                    value={formData.productValue} 
                    onChange={handleChange} 
                    placeholder="0"
                  />
                  <span className="input-group-text">ج.م</span>
                </div>
                <div>
                  <input 
                    type="file" 
                    id="proofFile" 
                    name="proofFile" 
                    className="d-none" 
                    onChange={handleChange} 
                  />
                  <label htmlFor="proofFile" className="btn btn-upload-proof d-flex align-items-center gap-2 h-100">
                    <span>رفع الاثبات</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="collection-amount-wrapper mb-3">
            <label className="form-label">
              {formData.isRefund ? "قيمة المبلغ المسترد للعميل" : "قيمة التحصيل من العميل"}
            </label>
            <div className="input-group enhanced-input-group">
              <span className="input-group-text"><DollarSign size={18} /></span>
              <input 
                type="number" 
                className={`form-control ${errors.collectionAmount ? 'is-invalid' : ''}`}
                name="collectionAmount" 
                value={formData.collectionAmount} 
                onChange={handleChange} 
                placeholder="0.00"
              />
              <span className="input-group-text">ج.م</span>
            </div>
            {errors.collectionAmount && <span className="text-danger small">{errors.collectionAmount}</span>}
          </div>

          <div className="mb-3">
            <label className="form-label">أولوية التوصيل</label>
            <select 
              className="form-select delivery-priority-select"
              name="expressDeliveryEnabled" 
              value={String(formData.expressDeliveryEnabled)} 
              onChange={handleChange}
            >
              <option value="false">توصيل عادي (3-5 أيام)</option>
              <option value="true">توصيل سريع (24-48 ساعة)</option>
            </select>
          </div>

          {/* Pricing Summary Section */}
          <div className="pricing-summary-card">
            <div className="pricing-row">
              <span className="pricing-label">سعر الشحن</span>
              <span className="pricing-value">
                <span className="value-number">{formData.expressDeliveryEnabled ? '50' : '35'}</span>
                <span className="value-currency">ج.م</span>
              </span>
            </div>
            
            <div className="pricing-row">
              <span className="pricing-label">ضريبة قيمة مضافة 14%</span>
              <span className="pricing-value">
                <span className="value-number">{((formData.expressDeliveryEnabled ? 50 : 35) * 0.14).toFixed(1)}</span>
                <span className="value-currency">ج.م</span>
              </span>
            </div>
            
            <div className="pricing-row pricing-total">
              <span className="pricing-label-total">الاجمالي</span>
              <span className="pricing-value-total">
                <span className="value-number">{((formData.expressDeliveryEnabled ? 50 : 35) * 1.14).toFixed(1)}</span>
                <span className="value-currency">ج.م</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptionsCard;
