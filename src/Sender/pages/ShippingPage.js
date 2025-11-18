import React, { useState } from "react";
import "./css/ShippingPage.css";
import useUserStore from "../../Store/UserStore/userStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";
import Swal from 'sweetalert2'
import {egypt_governorates} from '../../Shared/Constants'
import {CreateShipment}  from '../Data/ShipmentsService'
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
      details: ""// Correctly nested here
    },
    quantity: "",
    shipmentWeight: 0.1,

    
    shipmentDescription: "",
    shipmentNotes: "",
    expressDeliveryEnabled: false,
    openPackageOnDeliveryEnabled: false,
    cashOnDeliveryEnabled: false,
    collectionAmount: 0,
    isDelivered:false
  });

  const user = useUserStore((state) => state.user);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);



  // Validation rules constants
  const LIMITS = {
    dimMin: 1,
    dimMax: 200,
    weightMin: 0.01,
    weightMax: 70,
    qtyMin: 1,
    qtyMax: 1000,
  };

  // Helper: Arabic error messages
  const messages = {
    required: "هذا الحقل مطلوب.",
    dimRange: `القيمة يجب أن تكون بين ${LIMITS.dimMin} و ${LIMITS.dimMax} سم.`,
    weightRange: `الوزن يجب أن يكون بين ${LIMITS.weightMin} و ${LIMITS.weightMax} كجم.`,
    qtyRange: `العدد يجب أن يكون بين ${LIMITS.qtyMin} و ${LIMITS.qtyMax}.`,
    qtyInteger: "العدد يجب أن يكون عددًا صحيحًا.",
    collectionRequired: "ادخل قيمة تحصيل صحيحة (أكبر من 0) عند تفعيل الدفع عند الاستلام.",
    invalidEmail: "البريد الإلكتروني غير صالح.",
    invalidUrl: "الرجاء إدخال رابط صالح (مثال: https://example.com).",
    optional: "", // For fields that are optional but might have format validation
  };

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;


  // helpers to get/set nested path values like "customerAddress.street"
  const getByPath = (obj, path) => {
    if (!path) return undefined;
    return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  };

  const setByPath = (obj, path, value) => {
    const parts = path.split(".");
    const copy = { ...obj };
    let cur = copy;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (i === parts.length - 1) {
        cur[p] = value;
      } else {
        cur[p] = { ...(cur[p] || {}) };
        cur = cur[p];
      }
    }
    return copy;
  };

  // Validate a single field (used on change to clear/set specific errors)
  const validateField = (name, value, currentForm = formData) => {
    // normalize: if name is dotted take last part for field rules
    const last = name.includes(".") ? name.split(".").slice(-1)[0] : name;

    switch (last) {
      case "customerName":
      case "street":
      case "city":
      case "shipmentDescription":
        if (!value || String(value).trim() === "") return messages.required;
        return null;

      case "customerEmail":
        if (!value || String(value).trim() === "") return messages.required;
        if (!emailRegex.test(String(value))) return messages.invalidEmail;
        return null;

      case "customerPhone":
        if (!value || String(value).trim() === "") return messages.required;
        return null;

      case "customerAdditionalPhone":
        // This field is optional, no specific validation if empty
        return null;

      case "googleMapAddressLink":
        if (!value || String(value).trim() === "") return null; // Optional, so no error if empty

        // Check if it's a valid URL. If not, try prepending https://
        if (!urlRegex.test(value)) {
          const autoFixed = `https://${value}`;
          if (urlRegex.test(autoFixed)) {
            // It's fixable, so not an error here, but you might want to auto-correct in handleChange
            return null;
          }
          return messages.invalidUrl;
        }
        return null;

      case "quantity":
        if (value === "" || value === null) return messages.required;
        if (!Number.isInteger(value)) return messages.qtyInteger;
        if (value < LIMITS.qtyMin || value > LIMITS.qtyMax) return messages.qtyRange;
        return null;

      case "shipmentWeight":
        if (value === "" || value === null) return null;
       
        return null;

     

      case "collectionAmount":
        // only validate strictly when cashOnDeliveryEnabled is true
        if (currentForm.cashOnDeliveryEnabled) {
          if (value === "" || value === null) return messages.collectionRequired;
          if (typeof value !== "number" || Number.isNaN(value) || value <= 0) return messages.collectionRequired;
        }
        return null;

      case "governorate":
        if (!value || String(value).trim() === "") return messages.required;
        return null;

      default:
        return null;
    }
  };

  // Full form validation before submit
  const validateAll = (data) => {
    const newErrors = {};

    // list of fields to validate (top-level and nested with dot paths)
    const fieldsToCheck = [
      "customerName",
      "customerEmail",
      "customerPhone",
      // "customerAdditionalPhone", // Optional, so not strictly required

      "customerAddress.street",
      "customerAddress.city",
      "customerAddress.governorate",
      // "customerAddress.googleMapAddressLink", // <--- Updated path for full validation

      "shipmentDescription",
      "quantity",
     
   
    ];

    fieldsToCheck.forEach((field) => {
      const val = getByPath(data, field);
      const err = validateField(field, val, data);
      if (err) newErrors[field] = err;
    });

    // collection amount only if COD on
    const colVal = getByPath(data, "collectionAmount");
    const colErr = validateField("collectionAmount", colVal, data);
    if (colErr) newErrors.collectionAmount = colErr;

    return newErrors;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value: rawValue, type, checked } = e.target;

    setFormData((prev) => {
      let newVal;

      if (type === "checkbox") {
        newVal = checked;
      } else if (type === "number") {
        // keep empty string when input cleared
        newVal = rawValue === "" ? "" : Number(rawValue);
      } else {
        // for selects with boolean-like strings, keep them as boolean if they represent true/false
        if (rawValue === "true") newVal = true;
        else if (rawValue === "false") newVal = false;
        else newVal = rawValue;
      }

      // Special handling for googleMapAddressLink to prepend https:// if missing and valid
      if (name === "customerAddress.googleMapAddressLink" && newVal && typeof newVal === 'string' && !urlRegex.test(newVal)) {
        const autoFixed = `https://${newVal}`;
        if (urlRegex.test(autoFixed)) {
          newVal = autoFixed;
        }
      }


      // If the name contains ".", update nested path immutably
      const updated = name.includes(".") ? setByPath(prev, name, newVal) : { ...prev, [name]: newVal };

      // update errors for this field (use dotted key for errors)
      setErrors((prevErrors) => {
        const fieldError = validateField(name, newVal, updated);
        const copy = { ...prevErrors };
        if (fieldError) copy[name] = fieldError;
        else delete copy[name];

        // re-validate collectionAmount if toggling cashOnDeliveryEnabled
        if (name === "cashOnDeliveryEnabled") {
          const collVal = getByPath(updated, "collectionAmount");
          const collErr = validateField("collectionAmount", collVal, updated);
          if (collErr) copy.collectionAmount = collErr;
          else delete copy.collectionAmount;
        }

        return copy;
      });

      return updated;
    });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();


    // Validate all fields
    const newErrors = validateAll(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("يرجى تصحيح الأخطاء قبل المتابعة.");
      return;
    }
      const payload = { ...formData };
     if (payload.shipmentWeight === "") {
  delete payload.shipmentWeight;
}
      console.log("from payload", payload);


       setLoading(true)
      const response = CreateShipment(payload)
      const  result=await response;
      console.log('ressss',result)
      if ( result.Success) {
            Swal.fire({
      position: "center-center",
      icon: "success",
      title: "Shipment Created Successfully",
      showConfirmButton: false,
      timer: 2000

        });

        navigate("/order");
      }
      else{

      if (result.StatusCode === 400) {
              toast.error(result.Message||"one or more validation error");
            } 
            else if (response.status === 401) {
              toast.error(result.Message||"one or more validation error");
            }
             else {
              toast.error("خطأ في الخادم. حاول لاحقًا.");
            }
      }
setLoading(false)
    
      
       
  
  };

  return (
    <>

      <div className="shipping-container">
        {/* ملخص الطلب */}
        <div className="order-summary card">
          <h3>ملخص الطلب</h3>
          <div className="summary-item">
            <strong>المستلم</strong>
            <p>{formData.customerName || "-"}</p>
            <p>{formData.customerPhone || "-"}</p>
            <p>{formData.customerAdditionalPhone || "-"}</p>
            <p>{formData.customerEmail || "-"}</p>
          </div>

          <div className="summary-item">
            <strong>العنوان</strong>
            <p>{formData.customerAddress.street || "-"}</p>
            <p>{formData.customerAddress.details || "-"}</p>
            <p>{formData.customerAddress.city || "-"}</p>
            <p>{formData.customerAddress.governorate || "-"}</p>
            <p>
              {formData.customerAddress.googleMapAddressLink ? (
                <a href={formData.customerAddress.googleMapAddressLink} target="_blank" rel="noopener noreferrer">
                  رابط الخريطة
                </a>
              ) : "-"}
            </p>
          </div>

          <div className="summary-item">
            <span>الوزن</span>
            <p>{formData.shipmentWeight !== "" ? `${formData.shipmentWeight} كجم` : "-"}</p>
          </div>

          <div className="summary-item">
            <span>الأبعاد</span>
            <p>
              {formData.shipmentLength || "-"} × {formData.shipmentWidth || "-"} × {formData.shipmentHeight || "-"} سم
            </p>
          </div>

          <div className="summary-item">
            <span>أولوية التوصيل</span>
            <p>{formData.expressDeliveryEnabled ? "سريع" : "عادي"}</p>
          </div>

          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "جاري الإرسال..." : "إنشاء الطلب"}
          </button>
          <button className="cancel-btn" type="button" onClick={() => navigate(-1)}>
            إلغاء
          </button>
        </div>

        {/* الفورم */}
        <form className="form-area" onSubmit={handleSubmit}>
          {/* بيانات المستلم */}
          <div className="card">
            <h3>بيانات المستلم</h3>
            <div className="form-group">
              <label>اسم المستلم </label>
              <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} />
              {errors.customerName && <p className="text-danger">{errors.customerName}</p>}
            </div>

            <div className="form-group">
              <label>البريد الالكتروني </label>
              <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} />
              {errors.customerEmail && <p className="text-danger">{errors.customerEmail}</p>}
            </div>

            <div className="form-group">
              <label>رقم الهاتف </label>
              <input type="text" name="customerPhone" value={formData.customerPhone} onChange={handleChange} />
              {errors.customerPhone && <p className="text-danger">{errors.customerPhone}</p>}
            </div>

            <div className="form-group">
              <label>رقم الهاتف الاضافي </label>
              <input
                type="text"
                name="customerAdditionalPhone"
                value={formData.customerAdditionalPhone}
                onChange={handleChange}
              />
              {errors.customerAdditionalPhone && <p className="text-danger">{errors.customerAdditionalPhone}</p>}
            </div>

            <div className="form-group">
              <label>اسم الشارع </label>
              <input
                type="text"
                name="customerAddress.street"
                value={formData.customerAddress.street}
                onChange={handleChange}
              />
              {errors["customerAddress.street"] && <p className="text-danger">{errors["customerAddress.street"]}</p>}
            </div>

            <div className="form-group">
              <label>تفاصيل العنوان </label>
              <input
                type="text"
                name="customerAddress.details"
                value={formData.customerAddress.details}
                onChange={handleChange}
              />
              {errors["customerAddress.details"] && <p className="text-danger">{errors["customerAddress.details"]}</p>}
            </div>

            <div className="form-group">
              <label>المدينة </label>
              <input
                type="text"
                name="customerAddress.city"
                value={formData.customerAddress.city}
                onChange={handleChange}
              />
              {errors["customerAddress.city"] && <p className="text-danger">{errors["customerAddress.city"]}</p>}
            </div>

            <div className="form-group">
              <label>المحافظه </label>
              <select
                name="customerAddress.governorate"
                className="form-control"
                value={formData.customerAddress.governorate}
                onChange={handleChange}
              >
                <option value={""} disabled>
                  اختر المحافظه
                </option>
                {egypt_governorates.map((gov) => (
                  <option key={gov.id} value={gov.name_arabic}>
                    {gov.name_arabic}
                  </option>
                ))}
              </select>

              {errors["customerAddress.governorate"] && (
                <p className="text-danger">{errors["customerAddress.governorate"]}</p>
              )}
            </div>

            <div className="form-group">
              <label>رابط العنوان</label>
              <input
                type="text"
                name="customerAddress.googleMapAddressLink" 
                value={formData.customerAddress.googleMapAddressLink}
                onChange={handleChange}
              />
              {errors["customerAddress.googleMapAddressLink"] && <p className="text-danger">{errors["customerAddress.googleMapAddressLink"]}</p>}
            </div>
          </div>

          {/* تفاصيل الطرد */}
          <div className="card">
            <h3>تفاصيل الطرد</h3>
            <div className="form-group">
              <label>محتوى الطرد </label>
              <input
                type="text"
                name="shipmentDescription"
                value={formData.shipmentDescription}
                onChange={handleChange}
              />
              {errors.shipmentDescription && <p className="text-danger">{errors.shipmentDescription}</p>}
            </div>

            <div className="form-group">
              <label>عدد القطع </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min={LIMITS.qtyMin}
                max={LIMITS.qtyMax}
                step={1}
              />
              {errors.quantity && <p className="text-danger">{errors.quantity}</p>}
            </div>

            <div className="form-group">
              <label>وزن الطلب (كجم) </label>
              <input
                type="number"
                name="shipmentWeight"
                value={formData.shipmentWeight}
                onChange={handleChange}
                min={LIMITS.weightMin}
                max={LIMITS.weightMax}
                step="0.5"
              />
              {errors.shipmentWeight && <p className="text-danger">{errors.shipmentWeight}</p>}
              <small className="hint">
                الحد المسموح: {LIMITS.weightMin} - {LIMITS.weightMax} كجم
              </small>
            </div>


        

            <div className="form-group">
              <label>ملاحظات خاصة بالشحن</label>
              <textarea name="shipmentNotes" value={formData.shipmentNotes} onChange={handleChange} />
            </div>
          </div>

          {/* الدفع والتسليم */}
          <div className="card">
            <h3>خيارات الدفع والتسليم</h3>
            <div className="form-group checkbox-group d-flex flex-row gap-3 align-items-center">
              
              <label>
                <input
                  type="checkbox"
                  name="cashOnDeliveryEnabled"
                  checked={formData.cashOnDeliveryEnabled}
                  onChange={handleChange}
                />
                الدفع عند الاستلام
              </label>
              <label>
                <input
                  type="checkbox"
                  name="openPackageOnDeliveryEnabled"
                  checked={formData.openPackageOnDeliveryEnabled}
                  onChange={handleChange}
                />
                فتح الطرد عند الاستلام
              </label>
              <label>
                <input
                  type="checkbox"
                  name="isDelivered"
                  checked={formData.isDelivered}
                  onChange={handleChange}
                />
               هل تم التوصيل
              </label>
            </div>

            <div className="form-group">
              <label>قيمة التحصيل</label>
              <input
                type="number"
                name="collectionAmount"
                value={formData.collectionAmount}
                onChange={handleChange}
                min={0}
              />
              {errors.collectionAmount && <p className="text-danger">{errors.collectionAmount}</p>}
            </div>

            <div className="form-group">
              <label>أولوية التوصيل *</label>
              <select
                name="expressDeliveryEnabled"
                value={String(formData.expressDeliveryEnabled)}
                onChange={handleChange}
              >
                <option value={false}>عادي</option>
                <option value={true}>سريع</option>
              </select>
              {errors.expressDeliveryEnabled && <p className="text-danger">{errors.expressDeliveryEnabled}</p>}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ShippingPage;