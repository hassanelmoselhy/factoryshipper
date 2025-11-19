import React, { useState } from "react";
import "./css/ShippingPage.css"; // Ensure this matches your CSS file name
import useUserStore from "../../Store/UserStore/userStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { egypt_governorates } from '../../Shared/Constants'
import { CreateShipment } from '../Data/ShipmentsService'

const ShippingPage = () => {
  const navigate = useNavigate();
  
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
    shipmentLength: "", 
    shipmentWidth: "", 
    shipmentHeight: "", 
    expressDeliveryEnabled: false,
    openPackageOnDeliveryEnabled: false,
    cashOnDeliveryEnabled: false,
    collectionAmount: 0,
    isDelivered: false
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
    if(data.cashOnDeliveryEnabled && (!data.collectionAmount || data.collectionAmount <= 0)) {
      newErrors.collectionAmount = messages.collectionRequired;
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      let newVal = type === "checkbox" ? checked : value;
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
    const payload = { ...formData };
    if(payload.shipmentWeight === "") delete payload.shipmentWeight;

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
    <div className="shipping-page-wrapper">
      
      <form onSubmit={handleSubmit}>
        
        {/* The .cards-container handles the vertical/horizontal layout via CSS */}
        <div className="cards-container">
          
          {/* --- Recipient Data --- */}
          <div className="design-card">
            <h3>بيانات المستلم</h3>
            <div className="recipient-grid">
              
              <div className="form-group">
                <label>اسم المستلم</label>
                <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} />
                {errors.customerName && <span className="text-danger">{errors.customerName}</span>}
              </div>
              <div className="form-group">
                <label>البريد الإلكتروني</label>
                <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>رقم الهاتف</label>
                <input type="text" name="customerPhone" value={formData.customerPhone} onChange={handleChange} maxLength={11} />
                {errors.customerPhone && <span className="text-danger">{errors.customerPhone}</span>}
              </div>
              <div className="form-group">
                <label>رقم الهاتف الاحتياطي</label>
                <input type="text" name="customerAdditionalPhone" value={formData.customerAdditionalPhone} onChange={handleChange} maxLength={11} />
              </div>

              <div className="form-group full-width">
                <label>اسم الشارع</label>
                <input type="text" name="customerAddress.street" value={formData.customerAddress.street} onChange={handleChange} />
                {errors["customerAddress.street"] && <span className="text-danger">{errors["customerAddress.street"]}</span>}
              </div>

              <div className="form-group full-width">
                <label>تفاصيل العنوان</label>
                <input type="text" name="customerAddress.details" value={formData.customerAddress.details} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>المدينة</label>
                <input type="text" name="customerAddress.city" value={formData.customerAddress.city} onChange={handleChange} />
                {errors["customerAddress.city"] && <span className="text-danger">{errors["customerAddress.city"]}</span>}
              </div>
              <div className="form-group">
                <label>المحافظة</label>
                <select name="customerAddress.governorate" value={formData.customerAddress.governorate} onChange={handleChange}>
                  <option value="">اختر</option>
                  {egypt_governorates && egypt_governorates.map((gov) => (
                    <option key={gov.id} value={gov.name_arabic}>{gov.name_arabic}</option>
                  ))}
                </select>
                {errors["customerAddress.governorate"] && <span className="text-danger">{errors["customerAddress.governorate"]}</span>}
              </div>

              <div className="form-group full-width">
                <label>رابط العنوان (Google Maps)</label>
                <input type="text" name="customerAddress.googleMapAddressLink" value={formData.customerAddress.googleMapAddressLink} onChange={handleChange} />
              </div>

            </div>
          </div>

          {/* --- Parcel Details --- */}
          <div className="design-card">
            <h3>تفاصيل الطرد</h3>
            
            <div className="form-group">
              <label>محتوى الطرد</label>
              <input type="text" name="shipmentDescription" value={formData.shipmentDescription} onChange={handleChange} />
              {errors.shipmentDescription && <span className="text-danger">{errors.shipmentDescription}</span>}
            </div>

            <div className="form-group">
              <label>عدد القطع</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
              {errors.quantity && <span className="text-danger">{errors.quantity}</span>}
            </div>

            <div className="form-group">
              <label>وزن الطلب (كجم)</label>
              <input type="number" name="shipmentWeight" value={formData.shipmentWeight} onChange={handleChange} step="0.1" />
              <small className="hint">الحد الأدنى: 0.01 - 75.0 كجم</small>
            </div>

            <label style={{fontSize:'13px', fontWeight:'600', color:'#4b5563'}}>الأبعاد (سم)</label>
            <div className="dimensions-row">
              <div className="form-group">
                <input type="number" name="shipmentLength" placeholder="الطول" value={formData.shipmentLength} onChange={handleChange} />
              </div>
              <div className="form-group">
                <input type="number" name="shipmentWidth" placeholder="العرض" value={formData.shipmentWidth} onChange={handleChange} />
              </div>
              <div className="form-group">
                <input type="number" name="shipmentHeight" placeholder="الارتفاع" value={formData.shipmentHeight} onChange={handleChange} />
              </div>
            </div>
            <small className="hint" style={{textAlign: 'center'}}>إلى حد أدنى 1 سم إلى 200 و 3 سم</small>

            <div className="form-group">
              <label>ملاحظات خاصة بالشحن</label>
              <textarea name="shipmentNotes" value={formData.shipmentNotes} onChange={handleChange} style={{height:'80px'}} />
            </div>
          </div>

          {/* --- Payment Options --- */}
          <div className="design-card">
            <h3>خيارات الدفع والتسليم</h3>
            
            <div className="payment-options">
              <label className="radio-label">
                <input type="checkbox" name="cashOnDeliveryEnabled" checked={formData.cashOnDeliveryEnabled} onChange={handleChange} />
                الدفع عند الاستلام
              </label>
              <label className="radio-label">
                <input type="checkbox" name="openPackageOnDeliveryEnabled" checked={formData.openPackageOnDeliveryEnabled} onChange={handleChange} />
                السماح بفتح الطرد
              </label>

            </div>

            <div className="form-group">
              <label>قيمة التحصيل</label>
              <input 
                type="number" 
                name="collectionAmount" 
                value={formData.collectionAmount} 
                onChange={handleChange} 
                disabled={!formData.cashOnDeliveryEnabled}
              />
              {errors.collectionAmount && <span className="text-danger">{errors.collectionAmount}</span>}
            </div>

            <div className="form-group">
              <label>أولوية التوصيل *</label>
              <select name="expressDeliveryEnabled" value={String(formData.expressDeliveryEnabled)} onChange={handleChange}>
                <option value="false">عادي</option>
                <option value="true">سريع</option>
              </select>
            </div>
          </div>

        </div>

        {/* --- Static Order Summary --- */}
        <div className="static-summary">
          <div className="summary-header">
            <h4>ملخص الطلب</h4>
          </div>
          <div className="summary-content">
            
            <div className="summary-item">
              <label>المستلم</label>
              <span>{formData.customerName || "---"}</span>
            </div>

            <div className="summary-item">
              <label>رقم الهاتف</label>
              <span>{formData.customerPhone || "---"}</span>
            </div>

            <div className="summary-item">
              <label>المحافظة</label>
              <span>{formData.customerAddress.governorate || "---"}</span>
            </div>

            <div className="summary-item">
              <label>المدينة</label>
              <span>{formData.customerAddress.city || "---"}</span>
            </div>

            <div className="summary-item">
              <label>قيمة التحصيل</label>
              <span>{formData.collectionAmount ? `${formData.collectionAmount} ج.م` : "0"}</span>
            </div>

            <div className="summary-item">
              <label>أولوية التوصيل</label>
              <span>{formData.expressDeliveryEnabled ? "سريع" : "عادي"}</span>
            </div>

            <div className="summary-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>إلغاء</button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "جاري..." : "إتمام الطلب"}
              </button>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};

export default ShippingPage;