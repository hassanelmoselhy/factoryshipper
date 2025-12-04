import React, { useState } from "react";
import "./css/ShippingPage.css";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { egypt_governorates } from '../../Shared/Constants';
import { CreateShipment } from '../Data/ShipmentsService';
import { 
  Truck, 
  RefreshCw, 
  RotateCcw, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Weight, 
  FileText, 
  CreditCard, 
  DollarSign, 
  ClipboardList 
} from 'lucide-react';

const ShippingPage = () => {
  const navigate = useNavigate();
  const [shipmentType, setShipmentType] = useState('delivery'); // 'delivery', 'exchange', 'return'
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerAdditionalPhone: "",
    customerEmail: "",
    customerAddress: {
      street: "",
      city: "",
      governorate: "",
      details: "",
      googleMapAddressLink: ""
    },
    quantity: "",
    shipmentWeight: "",
    shipmentDescription: "",
    shipmentNotes: "",
    returnLocation: "",
    orderReference: "",
    deliveryNotes: "",
    expressDeliveryEnabled: false,
    openPackageOnDeliveryEnabled: false,
    cashOnDeliveryEnabled: false,
    collectionAmount: 0,
    isDelivered: false,
    // New fields for exchange/return
    returnShipmentDescription: "",
    returnQuantity: "",
    returnShipmentWeight: "",
    returnShipmentNotes: "",
    exchangeOrderReference: "",
    isRefund: false,
    productValue: "",
    proofFile: null
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const messages = {
    required: "هذا الحقل مطلوب",
    qtyInteger: "عدد صحيح فقط",
    invalidPhone: "رقم غير صحيح",
    collectionRequired: "مطلوب"
  };

  const egyptPhoneRegex = /^(010|011|012|015)\d{8}$/;

  // Return location options
  const returnLocationOptions = [
    { value: "", label: "اختر موقع الإرجاع" },
    { value: "مصنع الاستاد حسن هيبة الجزرة العزبة", label: "مصنع الاستاد حسن هيبة الجزرة العزبة" }
  ];

  // Governorate options
  const governorateOptions = [
    { value: "", label: "اختر المحافظة" },
    ...egypt_governorates.map(gov => ({ 
      value: gov.name_arabic, 
      label: gov.name_arabic 
    }))
  ];

  const getByPath = (obj, path) => path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  
  const setByPath = (obj, path, value) => {
    const parts = path.split(".");
    const copy = { ...obj };
    let cur = copy;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (i === parts.length - 1) cur[p] = value;
      else { cur[p] = { ...(cur[p] || {}) }; cur = cur[p]; }
    }
    return copy;
  };

  const validateField = (name, value, currentForm) => {
    const last = name.includes(".") ? name.split(".").slice(-1)[0] : name;
    if (last === "customerName" && !value) return messages.required;
    if (last === "customerPhone" && !egyptPhoneRegex.test(String(value))) return messages.invalidPhone;
    if (last === "street" || last === "city" || last === "governorate") if (!value) return messages.required;
    if (last === "quantity" && (value < 1 || !Number.isInteger(Number(value)))) return messages.qtyInteger;
    if (last === "shipmentDescription" && !value) return messages.required;

    // Validation for exchange/return specific fields
    if (shipmentType === 'exchange') {
      if (last === "returnQuantity" && (value < 1 || !Number.isInteger(Number(value)))) return messages.qtyInteger;
      if (last === "returnShipmentDescription" && !value) return messages.required;
    }
    
    if (last === "collectionAmount" && currentForm.cashOnDeliveryEnabled) {
      if (!value || value <= 0) return messages.collectionRequired;
    }
    return null;
  };

  const validateAll = (data) => {
    const newErrors = {};
    const fields = ["customerName", "customerPhone", "customerAddress.street", "customerAddress.city", "customerAddress.governorate", "quantity", "shipmentDescription"];
    fields.forEach(f => {
      const val = getByPath(data, f);
      const err = validateField(f, val, data);
      if (err) newErrors[f] = err;
    });

    if (shipmentType === 'exchange') {
      const exchangeFields = ["returnQuantity", "returnShipmentDescription"];
      exchangeFields.forEach(f => {
        const val = getByPath(data, f);
        const err = validateField(f, val, data);
        if (err) newErrors[f] = err;
      });
    }

    if(data.cashOnDeliveryEnabled && (!data.collectionAmount || data.collectionAmount <= 0)) {
      newErrors.collectionAmount = messages.collectionRequired;
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => {
      let newVal = type === "checkbox" ? checked : value;
      if (type === "file") newVal = files[0];
      if (type === "number") newVal = value === "" ? "" : Number(value);
      if (value === "true") newVal = true;
      if (value === "false") newVal = false;

      if (name === "customerPhone" || name === "customerAdditionalPhone") {
         newVal = String(newVal).replace(/\D/g, "");
      }

      const updated = name.includes(".") ? setByPath(prev, name, newVal) : { ...prev, [name]: newVal };
      
      setErrors(prevErr => {
        const err = validateField(name, newVal, updated);
        const copy = { ...prevErr };
        if(err) copy[name] = err; else delete copy[name];
        return copy;
      });
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateAll(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("يرجى تصحيح الأخطاء");
      return;
    }

    setLoading(true);
    const payload = { ...formData, shipmentType }; // Include shipmentType in payload
    if(payload.shipmentWeight === "") delete payload.shipmentWeight;
    if(payload.customerAddress.googleMapAddressLink === "") delete payload.customerAddress.googleMapAddressLink;
    if(payload.orderReference === "") delete payload.orderReference;
    if(payload.deliveryNotes === "") delete payload.deliveryNotes;
    
    // Conditionally remove new empty fields
    if(payload.returnShipmentWeight === "") delete payload.returnShipmentWeight;
    if(payload.returnShipmentNotes === "") delete payload.returnShipmentNotes;
    if(payload.exchangeOrderReference === "") delete payload.exchangeOrderReference;
    
    // Remove return-specific fields if not exchange/return
    if (shipmentType !== 'exchange') {
      delete payload.returnShipmentDescription;
      delete payload.returnQuantity;
      delete payload.returnShipmentWeight;
      delete payload.returnShipmentNotes;
    }
    if (shipmentType === 'delivery') {
      delete payload.exchangeOrderReference;
    }


    try {
      const result = await CreateShipment(payload);
      if (result.Success) {
        Swal.fire({ icon: "success", title: "تم إنشاء الشحنة بنجاح", timer: 2000, showConfirmButton: false });
        navigate("/shipments");
      } else {
        toast.error(result.Message || "حدث خطأ ما");
      }
    } catch (err) {
      toast.error("خطأ في الاتصال");
    }
    setLoading(false);
  };

  return (
    <div className="shipping-page-wrapper container-fluid">
      
      {/* --- Header & Tabs --- */}
      <div className="d-flex justify-content-center align-items-center  mt-4">
        <div className="shipment-tabs-container">
          <button 
            className={`tab-btn ${shipmentType === 'return' ? 'active' : ''}`}
            onClick={() => {
              setShipmentType('return');
              setFormData(prev => ({ ...prev, isRefund: true }));
            }}
            type="button"
          >
            <RotateCcw size={18} />
            <span>إرجاع شحنة</span>
          </button>

          <button 
            className={`tab-btn ${shipmentType === 'exchange' ? 'active' : ''}`}
            onClick={() => {
              setShipmentType('exchange');
              setFormData(prev => ({ ...prev, isRefund: false }));
            }}
            type="button"
          >
            <RefreshCw size={18} />
            <span>تبديل شحنات</span>
          </button>

          <button 
            className={`tab-btn ${shipmentType === 'delivery' ? 'active' : ''}`}
            onClick={() => {
              setShipmentType('delivery');
              setFormData(prev => ({ ...prev, isRefund: false }));
            }}
            type="button"
          >
            <Truck size={18} />
            <span>توصيل شحنة</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          
          {/* --- Left Column: Forms (66%) --- */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-4">

              {/* 1. Customer Data */}
              <div className="premium-card">
                <div className="card-title">
                  <User size={20} />
                  <span>بيانات العميل</span>
                </div>
                
                <div className="row g-3">
                  {/* Name */}
                  <div className="col-md-6">
                    <label className="form-label">اسم العميل</label>
                    <div className="input-group">
                      <span className="input-group-text"><User size={18} /></span>
                      <input 
                        type="text" 
                        className={`form-control ${errors.customerName ? 'is-invalid' : ''}`}
                        name="customerName" 
                        value={formData.customerName} 
                        onChange={handleChange} 
                        placeholder="الاسم بالكامل"
                      />
                    </div>
                    {errors.customerName && <span className="text-danger small">{errors.customerName}</span>}
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label">البريد الإلكتروني <span className="optional-badge">اختياري</span></label>
                    <div className="input-group">
                      <span className="input-group-text"><Mail size={18} /></span>
                      <input 
                        type="email" 
                        className="form-control" 
                        name="customerEmail" 
                        value={formData.customerEmail} 
                        onChange={handleChange} 
                        placeholder="example@mail.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label className="form-label">رقم الهاتف</label>
                    <div className="input-group">
                      <span className="input-group-text"><Phone size={18} /></span>
                      <input 
                        type="text" 
                        className={`form-control ${errors.customerPhone ? 'is-invalid' : ''}`}
                        name="customerPhone" 
                        value={formData.customerPhone} 
                        onChange={handleChange} 
                        maxLength={11}
                        placeholder="01xxxxxxxxx"
                      />
                    </div>
                    {errors.customerPhone && <span className="text-danger small">{errors.customerPhone}</span>}
                  </div>

                  {/* Additional Phone */}
                  <div className="col-md-6">
                    <label className="form-label">رقم هاتف احتياطي <span className="optional-badge">اختياري</span></label>
                    <div className="input-group">
                      <span className="input-group-text"><Phone size={18} /></span>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="customerAdditionalPhone" 
                        value={formData.customerAdditionalPhone} 
                        onChange={handleChange} 
                        maxLength={11}
                        placeholder="01xxxxxxxxx"
                      />
                    </div>
                  </div>

                  {/* Governorate */}
                  <div className="col-md-4">
                    <label className="form-label">المحافظة</label>
                    <div className="input-group">
                      <span className="input-group-text"><MapPin size={18} /></span>
                      <select 
                        className={`form-select ${errors["customerAddress.governorate"] ? 'is-invalid' : ''}`}
                        name="customerAddress.governorate" 
                        value={formData.customerAddress.governorate} 
                        onChange={handleChange}
                      >
                        {governorateOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    {errors["customerAddress.governorate"] && <span className="text-danger small">{errors["customerAddress.governorate"]}</span>}
                  </div>

                  {/* City */}
                  <div className="col-md-4">
                    <label className="form-label">المدينة</label>
                    <input 
                      type="text" 
                      className={`form-control ${errors["customerAddress.city"] ? 'is-invalid' : ''}`}
                      name="customerAddress.city" 
                      value={formData.customerAddress.city} 
                      onChange={handleChange} 
                      placeholder="المدينة / المنطقة"
                    />
                    {errors["customerAddress.city"] && <span className="text-danger small">{errors["customerAddress.city"]}</span>}
                  </div>

                  {/* Street */}
                  <div className="col-md-4">
                    <label className="form-label">اسم الشارع</label>
                    <input 
                      type="text" 
                      className={`form-control ${errors["customerAddress.street"] ? 'is-invalid' : ''}`}
                      name="customerAddress.street" 
                      value={formData.customerAddress.street} 
                      onChange={handleChange} 
                      placeholder="اسم الشارع / رقم العقار"
                    />
                    {errors["customerAddress.street"] && <span className="text-danger small">{errors["customerAddress.street"]}</span>}
                  </div>

                  {/* Details */}
                  <div className="col-md-8">
                    <label className="form-label">تفاصيل العنوان <span className="optional-badge">اختياري</span></label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="customerAddress.details" 
                      value={formData.customerAddress.details} 
                      onChange={handleChange} 
                      placeholder="علامة مميزة، رقم الشقة، الدور..."
                    />
                  </div>

                  {/* Google Maps Link */}
                  <div className="col-md-4">
                    <label className="form-label">رابط الموقع (Google Maps) <span className="optional-badge">اختياري</span></label>
                    <div className="input-group">
                      <span className="input-group-text"><MapPin size={18} /></span>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="customerAddress.googleMapAddressLink" 
                        value={formData.customerAddress.googleMapAddressLink} 
                        onChange={handleChange} 
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* 2. Parcel Details */}
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

              {/* 2.1 Exchange Return Parcel Details (Only for Exchange) */}
              {shipmentType === 'exchange' && (
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
              )}

              {/* 3. Payment Options */}
              <div className="premium-card">
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

                      <div className={`payment-option-card ${formData.cashOnDeliveryEnabled ? 'selected' : ''}`} onClick={() => setFormData(prev => ({...prev, cashOnDeliveryEnabled: !prev.cashOnDeliveryEnabled}))}>
                        <input type="checkbox" checked={formData.cashOnDeliveryEnabled} readOnly />
                        <label>التحصيل من العميل</label>
                      </div>

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

                      <div className="mt-3">
                        <label className="form-label d-flex justify-content-between">
                          <span>قيمة المنتج</span>
                          <span className="text-muted" title="معلومات"><RefreshCw size={14} /></span>
                        </label>
                        <div className="d-flex gap-2">
                          <div className="input-group flex-grow-1">
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
                            <label htmlFor="proofFile" className="btn btn-outline-secondary d-flex align-items-center gap-2 h-100">
                              <span>رفع الاثبات</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        {formData.isRefund ? "قيمة المبلغ المسترد للعميل" : "قيمة التحصيل من العميل"}
                      </label>
                      <div className="input-group">
                        <span className="input-group-text"><DollarSign size={18} /></span>
                        <input 
                          type="number" 
                          className={`form-control ${errors.collectionAmount ? 'is-invalid' : ''}`}
                          name="collectionAmount" 
                          value={formData.collectionAmount} 
                          onChange={handleChange} 
                          disabled={!formData.cashOnDeliveryEnabled}
                          placeholder="0.00"
                        />
                        <span className="input-group-text">ج.م</span>
                      </div>
                      {errors.collectionAmount && <span className="text-danger small">{errors.collectionAmount}</span>}
                    </div>

                    <div className="mb-0">
                      <label className="form-label">أولوية التوصيل</label>
                      <select 
                        className="form-select"
                        name="expressDeliveryEnabled" 
                        value={String(formData.expressDeliveryEnabled)} 
                        onChange={handleChange}
                      >
                        <option value="false">توصيل عادي (3-5 أيام)</option>
                        <option value="true">توصيل سريع (24-48 ساعة)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Return Location */}
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

            </div>
          </div>

          {/* --- Right Column: Sticky Summary (33%) --- */}
          <div className="col-lg-4">
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
          </div>

        </div>
      </form>
    </div>
  );
};

export default ShippingPage;