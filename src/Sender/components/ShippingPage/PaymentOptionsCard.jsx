import React from 'react';
import { CreditCard, RefreshCw, DollarSign } from 'lucide-react';
import '../../pages/css/PaymentOptions.css';
import ModernSelect from './ModernSelect';

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
            {(shipmentType === 'exchange') && (
              <div className="payment-direction-options h-100 d-flex flex-column mb-2">
                <label className="form-label mb-2">نوع المعاملة المالية</label>
                <div className="d-flex gap-3 flex-grow-1">
                  {shipmentType === 'exchange' && (
                    <>
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
                      
                      <div 
                        className={`payment-option-card flex-grow-1 ${formData.isRefund ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, isRefund: true }))}
                      >
                        <input 
                          type="radio" 
                          name="paymentDirection" 
                          checked={formData.isRefund} 
                          readOnly 
                        />
                        <label>إرجاع للعميل</label>
                      </div>
                    </>
                  )}
                  
                  {/* For 'return' type, "ارجاع للعميل" option is hidden completely */}
                </div>
              </div>
            )}

            {/* Cash Collection Specific UI */}
            {shipmentType === 'cash_collection' && (
              <div className="payment-direction-options h-100 d-flex flex-column mb-2">
                <label className="form-label mb-2">نوع المعاملة المالية</label>
                <div className="d-flex flex-column gap-3 flex-grow-1">
                  <div 
                    className={`payment-option-card w-100 ${!formData.isRefund ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, isRefund: false }))}
                  >
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <label style={{cursor: 'pointer'}}>تحصيل مبالغ نقدية من العميل</label>
                      <input 
                        type="radio" 
                        name="cashCollectionDirection" 
                        checked={!formData.isRefund} 
                        readOnly 
                      />
                    </div>
                  </div>
                  
                  <div 
                    className={`payment-option-card w-100 ${formData.isRefund ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, isRefund: true }))}
                  >
                   <div className="d-flex align-items-center justify-content-between w-100">
                      <label style={{cursor: 'pointer'}}>اعطاء مبالغ نقدية للعميل</label>
                      <input 
                        type="radio" 
                        name="cashCollectionDirection" 
                        checked={formData.isRefund} 
                        readOnly 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {shipmentType !== 'cash_collection' && (
              <div className="payment-direction-options h-100 d-flex flex-column">
                <label className="form-label">خيارات إضافية</label>
                <div className={`payment-option-card flex-grow-1 ${formData.openPackageOnDeliveryEnabled ? 'selected' : ''}`} onClick={() => setFormData(prev => ({...prev, openPackageOnDeliveryEnabled: !prev.openPackageOnDeliveryEnabled}))}>
                  <div className="d-flex align-items-start gap-2 w-100">
                    <input type="checkbox" checked={formData.openPackageOnDeliveryEnabled} readOnly className="mt-1" />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="mb-0" style={{cursor: 'pointer'}}>السماح للعميل بفتح الشحنة؟</label>
                        <span className="text-muted" title="معلومات إضافية"><RefreshCw size={14} /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

             {/* product-value-section moved to ParcelDetailsCard */}
          </div>
        </div>

        <div className="col-md-6">
          <div className="collection-amount-wrapper h-100 d-flex flex-column">
            <label className="form-label">
              {shipmentType === 'cash_collection' 
                ? (formData.isRefund ? "المبلغ المراد اعطاؤه للعميل" : "المبلغ المراد تحصيله من العميل")
                : (formData.isRefund ? "قيمة المبلغ المسترد للعميل" : "قيمة التحصيل من العميل")
              }
            </label>
            <div className="flex-grow-1 d-flex flex-column justify-content-center">
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
              {errors.collectionAmount && <span className="text-danger small mt-2">{errors.collectionAmount}</span>}
            </div>
          </div>
        </div>

        {/* Moving Delivery Notes here from ReturnLocationCard */}
        <div className="col-md-12">
          <label className="form-label">ملحوظات التوصيل <span className="optional-badge">اختياري</span></label>
          <textarea 
            className="form-control"
            name="deliveryNotes" 
            value={formData.deliveryNotes} 
            onChange={handleChange}
            placeholder="تعليمات للمندوب..."
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentOptionsCard;
