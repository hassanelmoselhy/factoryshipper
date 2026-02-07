import React, { useState, useEffect } from "react";
import { X, Save, User, Building, MapPin, DollarSign, Package, AlertCircle } from "lucide-react";
import { deliveryZones, egypt_governorates } from "../../Shared/Constants";
import "./css/AddMerchantModal.css";
import { toast } from "sonner";
import Swal from 'sweetalert2';

// Use same gov options as signup or constants
const governorateOptions = egypt_governorates;

const AddMerchantModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    // Company
    companyName: "",
    companyLink: "",
    governorate: "",
    city: "",
    street: "",
    details: "",
    // Production
    typeOfProduction: "",
    // Pricing
    zonePrices: {} 
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize zone prices with default 0 or empty
  useEffect(() => {
    if (isOpen) {
      // Reset form on open
      setFormData(prev => {
        const initialPrices = {};
        deliveryZones.forEach(z => {
            initialPrices[z.value] = ""; // Start empty
        });
        return {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          companyName: "",
          companyLink: "",
          governorate: "",
          city: "",
          street: "",
          details: "",
          typeOfProduction: "",
          zonePrices: initialPrices
        };
      });
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "مطلوب";
    if (!formData.lastName) newErrors.lastName = "مطلوب";
    if (!formData.email) newErrors.email = "مطلوب"; 
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "بريد غير صحيح";
    
    if (!formData.phoneNumber) newErrors.phoneNumber = "مطلوب";
    else if (!/^(010|011|012|015)\d{8}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "رقم غير صحيح";

    if (!formData.password) newErrors.password = "مطلوب";
    else if (formData.password.length < 6) newErrors.password = "على الأقل 6 أحرف";

    if (!formData.companyName) newErrors.companyName = "مطلوب";
    if (!formData.governorate) newErrors.governorate = "مطلوب";
    if (!formData.city) newErrors.city = "مطلوب";
    if (!formData.street) newErrors.street = "مطلوب";
    if (!formData.typeOfProduction) newErrors.typeOfProduction = "مطلوب";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handlePriceChange = (zoneValue, price) => {
    setFormData(prev => ({
      ...prev,
      zonePrices: {
        ...prev.zonePrices,
        [zoneValue]: price
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("يرجى إكمال البيانات المطلوبة");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Submitting New Merchant:", formData);
      setLoading(false);
      onSave(formData);
      onClose();
      Swal.fire({
        icon: 'success',
        title: 'تمت الإضافة',
        text: 'تم إنشاء حساب التاجر بنجاح',
        timer: 1500,
        showConfirmButton: false
      });
    }, 1000);
  };

  return (
    <div className={`add-merchant-modal-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div 
        className="add-merchant-modal-content" 
        onClick={e => e.stopPropagation()} 
        dir="rtl"
      >
        <div className="modal-header-custom ">
          <h2 className="modal-title-custom">
            <User size={24} className="text-primary"/>
            إضافة تاجر جديد
          </h2>

          <button className="close-btn-custom" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body-custom">
          <form id="addMerchantForm" onSubmit={handleSubmit}>
            
            {/* 1. Account Info */}
            <div className="form-section-title d-flex align-items-center gap-2">
              <User size={18} />
              بيانات الحساب
            </div>
            <div className="form-grid">
              <div className="input-group-custom">
                <label className="label-custom">الاسم الأول *</label>
                <input 
                  type="text" 
                  name="firstName" 
                  className={`input-custom ${errors.firstName ? 'input-error' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="مثال: أحمد"
                />
                {errors.firstName && <span className="error-msg">{errors.firstName}</span>}
              </div>

              <div className="input-group-custom">
                <label className="label-custom">الاسم الأخير *</label>
                <input 
                  type="text" 
                  name="lastName" 
                  className={`input-custom ${errors.lastName ? 'input-error' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="مثال: محمد"
                />
                {errors.lastName && <span className="error-msg">{errors.lastName}</span>}
              </div>

              <div className="input-group-custom">
                <label className="label-custom">البريد الإلكتروني *</label>
                <input 
                  type="email" 
                  name="email" 
                  className={`input-custom ${errors.email ? 'input-error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>

              <div className="input-group-custom">
                <label className="label-custom">رقم الهاتف *</label>
                <input 
                  type="text" 
                  name="phoneNumber" 
                  className={`input-custom ${errors.phoneNumber ? 'input-error' : ''}`}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx"
                  maxLength={11}
                />
                {errors.phoneNumber && <span className="error-msg">{errors.phoneNumber}</span>}
              </div>

              <div className="input-group-custom">
                <label className="label-custom">كلمة المرور *</label>
                <input 
                  type="password" 
                  name="password" 
                  className={`input-custom ${errors.password ? 'input-error' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="******"
                />
                {errors.password && <span className="error-msg">{errors.password}</span>}
              </div>
            </div>

            {/* 2. Company Info */}
            <div className="form-section-title d-flex align-items-center gap-2 mt-4">
              <Building size={18} />
              بيانات الشركة
            </div>
            <div className="form-grid">
              <div className="input-group-custom">
                <label className="label-custom">اسم الشركة *</label>
                <input 
                  type="text" 
                  name="companyName" 
                  className={`input-custom ${errors.companyName ? 'input-error' : ''}`}
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="اسم المتجر أو الشركة"
                />
                {errors.companyName && <span className="error-msg">{errors.companyName}</span>}
              </div>

              <div className="input-group-custom">
                <label className="label-custom">رابط الموقع (اختياري)</label>
                <input 
                  type="url" 
                  name="companyLink" 
                  className="input-custom"
                  value={formData.companyLink}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="input-group-custom">
                <label className="label-custom">المحافظة *</label>
                <select 
                  name="governorate" 
                  className={`select-custom ${errors.governorate ? 'input-error' : ''}`}
                  value={formData.governorate}
                  onChange={handleChange}
                >
                  <option value="">اختر المحافظة</option>
                  {governorateOptions.map(g => (
                    <option key={g.id} value={g.name_arabic}>{g.name_arabic}</option>
                  ))}
                </select>
                {errors.governorate && <span className="error-msg">{errors.governorate}</span>}
              </div>

              <div className="input-group-custom">
                <label className="label-custom">المدينة *</label>
                <input 
                  type="text" 
                  name="city" 
                  className={`input-custom ${errors.city ? 'input-error' : ''}`}
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="المدينة / المنطقة"
                />
                {errors.city && <span className="error-msg">{errors.city}</span>}
              </div>

              <div className="input-group-custom">
                <label className="label-custom">العنوان بالتفصيل *</label>
                <input 
                  type="text" 
                  name="street" 
                  className={`input-custom ${errors.street ? 'input-error' : ''}`}
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="رقم الشارع / العلامة المميزة"
                />
                {errors.street && <span className="error-msg">{errors.street}</span>}
              </div>

              <div className="input-group-custom">
                <label className="label-custom">نوع المنتجات *</label>
                <select 
                  name="typeOfProduction"
                  className={`select-custom ${errors.typeOfProduction ? 'input-error' : ''}`}
                  value={formData.typeOfProduction}
                  onChange={handleChange}
                >
                  <option value="">اختر النوع</option>
                  <option value="Electronics">إلكترونيات</option>
                  <option value="Clothing">ملابس</option>
                  <option value="Furniture">أثاث</option>
                  <option value="Food">أغذية</option>
                  <option value="Other">أخرى</option>
                </select>
                {errors.typeOfProduction && <span className="error-msg">{errors.typeOfProduction}</span>}
              </div>
            </div>

            {/* 3. Pricing Zones */}
            <div className="form-section-title d-flex align-items-center gap-2 mt-4">
              <DollarSign size={18} />
              قائمة أسعار التوصيل (مخصص)
            </div>
            
            <div className="alert alert-light border d-flex align-items-center gap-2 text-muted mb-3 p-2 small rounded-3">
              <AlertCircle size={16}/>
              <span>حدد سعر التوصيل لكل منطقة. اترك الحقل فارغاً لاستخدام السعر الافتراضي للنظام.</span>
            </div>

            <div className="price-cards-grid">
              {deliveryZones.map((zone) => (
                <div key={zone.value} className="price-card">
                  <label title={zone.label}>{zone.label}</label>
                  <div className="price-input-wrapper">
                    <input
                      type="number"
                      min="0"
                      placeholder="افتراضي"
                      value={formData.zonePrices[zone.value] || ""}
                      onChange={(e) => handlePriceChange(zone.value, e.target.value)}
                    />
                    <div className="currency-symbol">ج.م</div>
                  </div>
                </div>
              ))}
            </div>

          </form>
        </div>

        <div className="modal-footer-custom">
          <button type="button" className="btn-cancel" onClick={onClose}>
            إلغاء
          </button>
          <button 
            type="submit" 
            form="addMerchantForm" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? (
              <>جاري الحفظ...</>
            ) : (
              <>
                <Save size={18} />
                حفظ التاجر
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMerchantModal;
