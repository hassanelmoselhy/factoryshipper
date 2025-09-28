import React, { useState } from "react";
import "./css/ShippingPage.css";
import useUserStore from "../../Store/UserStore/userStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";
const ShippingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    receiverName: "",
    receiverPhone: "",
    receiverEmail: "",
    street: "",
    addressDetails: "",
    city: "",
    country: "Egypt",
    quantity: "",
    shipmentWeight: "",
    shipmentLength: "",
    shipmentWidth: "",
    shipmentHeight: "",
    shipmentDescription: "",
    shipmentNotes: "",
    expressDeliveryEnabled: false,
    openPackageOnDeliveryEnabled: false,
    cashOnDeliveryEnabled: false,
    collectionAmount: 0,
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
  };

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate a single field (used on change to clear/set specific errors)
  const validateField = (name, value, currentForm = formData) => {
    // We use currentForm to allow cross-field checks if needed
    switch (name) {
      case "receiverName":
      case "street":
      case "addressDetails":
      case "city":
      case "shipmentDescription":
        if (!value || String(value).trim() === "") return messages.required;
        return null;

      case "receiverEmail":
        if (!value || String(value).trim() === "") return messages.required;
        if (!emailRegex.test(String(value))) return messages.invalidEmail;
        return null;

      case "receiverPhone":
        if (!value || String(value).trim() === "") return messages.required;
        return null;

      case "quantity":
        if (value === "" || value === null) return messages.required;
        if (!Number.isInteger(value)) return messages.qtyInteger;
        if (value < LIMITS.qtyMin || value > LIMITS.qtyMax) return messages.qtyRange;
        return null;

      case "shipmentWeight":
        if (value === "" || value === null) return messages.required;
        if (typeof value !== "number" || Number.isNaN(value)) return messages.required;
        if (value < LIMITS.weightMin || value > LIMITS.weightMax) return messages.weightRange;
        return null;

      case "shipmentLength":
      case "shipmentWidth":
      case "shipmentHeight": {
        if (value === "" || value === null) return messages.required;
        if (typeof value !== "number" || Number.isNaN(value)) return messages.required;
        if (value < LIMITS.dimMin || value > LIMITS.dimMax) return messages.dimRange;
        return null;
      }

      case "collectionAmount":
        // only validate strictly when cashOnDeliveryEnabled is true
        if (currentForm.cashOnDeliveryEnabled) {
          if (value === "" || value === null) return messages.collectionRequired;
          if (typeof value !== "number" || Number.isNaN(value) || value <= 0) return messages.collectionRequired;
        }
        return null;

      default:
        return null;
    }
  };

  // Full form validation before submit
  const validateAll = (data) => {
    const newErrors = {};

    // required fields
    [
      "receiverName",
      "receiverEmail",
      "receiverPhone",
      "street",
      
      "city",
      "shipmentDescription",
      "quantity",
      "shipmentWeight",
      "shipmentLength",
      "shipmentWidth",
      "shipmentHeight",
    ].forEach((field) => {
      const err = validateField(field, data[field], data);
      if (err) newErrors[field] = err;
    });

    // collection amount only if COD on
    const colErr = validateField("collectionAmount", data.collectionAmount, data);
    if (colErr) newErrors.collectionAmount = colErr;

    return newErrors;
  };

  // Handle input change 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      let newVal;

      if (type === "checkbox") {
        newVal = checked;
      } else if (type === "number") {
        // keep empty string when input cleared
        newVal = value === "" ? "" : Number(value);
      } else if (name === "expressDeliveryEnabled") {
        // select passes string "true"/"false"
        newVal = value === "true";
      } else {
        newVal = value;
      }

      const updated = { ...prev, [name]: newVal };

      // validate this field and update errors state accordingly
      setErrors((prevErrors) => {
        const fieldError = validateField(name, newVal, updated);
        const copy = { ...prevErrors };
        if (fieldError) copy[name] = fieldError;
        else delete copy[name];

        //  re-validate collectionAmount if toggling cashOnDeliveryEnabled
        if (name === "cashOnDeliveryEnabled") {
          const collErr = validateField("collectionAmount", updated.collectionAmount, updated);
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
    if (!user?.token) {
      toast.error("غير مصرح - الرجاء تسجيل الدخول لإنشاء الشحنة.");
      return;
    }

    // Validate all fields
    const newErrors = validateAll(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("يرجى تصحيح الأخطاء قبل المتابعة.");
      return;
    }

    try {
      setLoading(true);
      
      const payload = { ...formData };
    
      const response = await fetch(
        "https://stakeexpress.runasp.net/api/Shipments/addShipment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const text = await response.text();
      console.log("Status:", response.status, "Response:", text);

      if (response.ok) {
        toast.success("تم إنشاء الشحنة بنجاح!");
        navigate("/home");
      } else if (response.status === 400) {
        toast.error("❌ فشل إنشاء الشحنة. يرجى مراجعة البيانات.");
      } else if (response.status === 401) {
        toast.error("❌ غير مصرح - يرجى تسجيل الدخول مجددًا.");
      } else {
        toast.error("خطأ في الخادم. حاول لاحقًا.");
      }
    } catch (err) {
      console.error(err);
      toast.error(`❌ فشل الإرسال: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />

    <div className="shipping-container">
      {/* ملخص الطلب */}
      <div className="order-summary card">
        <h3>ملخص الطلب</h3>
        <div className="summary-item">
          <strong>المستلم</strong>
          <p>{formData.receiverName}</p>
          <p>{formData.receiverPhone}</p>
          <p>{formData.receiverEmail}</p>
        </div>

        <div className="summary-item">
          <strong>العنوان</strong>
          <p>{formData.street}</p>
          <p>{formData.addressDetails}</p>
          <p>{formData.city}</p>
        </div>

        <div className="summary-item">
          <span>الوزن</span>
          <p>
            {formData.shipmentWeight !== "" ? `${formData.shipmentWeight} كجم` : "-"}
          </p>
        </div>

        <div className="summary-item">
          <span>الأبعاد</span>
          <p>
            {formData.shipmentLength || "-"} × {formData.shipmentWidth || "-"} ×{" "}
            {formData.shipmentHeight || "-"} سم
          </p>
        </div>

        <div className="summary-item">
          <span>أولوية التوصيل</span>
          <p>{formData.expressDeliveryEnabled ? "سريع" : "عادي"}</p>
        </div>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "جاري الإرسال..." : "إنشاء الطلب"}
        </button>
        <button className="save-btn" type="button">
          حفظ كمسودة
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
            <input
              type="text"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
            />
            {errors.receiverName && <p className="text-danger">{errors.receiverName}</p>}
          </div>

          <div className="form-group">
            <label>البريد الالكتروني </label>
            <input
              type="email"
              name="receiverEmail"
              value={formData.receiverEmail}
              onChange={handleChange}
            />
            {errors.receiverEmail && <p className="text-danger">{errors.receiverEmail}</p>}
          </div>

          <div className="form-group">
            <label>رقم الهاتف </label>
            <input
              type="text"
              name="receiverPhone"
              value={formData.receiverPhone}
              onChange={handleChange}
            />
            {errors.receiverPhone && <p className="error">{errors.receiverPhone}</p>}
          </div>

          <div className="form-group">
            <label>اسم الشارع </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
            />
            {errors.street && <p className="text-danger">{errors.street}</p>}
          </div>

          <div className="form-group">
            <label>تفاصيل العنوان </label>
            <input
              type="text"
              name="addressDetails"
              value={formData.addressDetails}
              onChange={handleChange}
            />
            {errors.addressDetails && <p className="text-danger">{errors.addressDetails}</p>}
          </div>

          <div className="form-group">
            <label>المدينة </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            {errors.city && <p className="text-danger">{errors.city}</p>}
          </div>

          <div className="form-group">
            <label>البلد </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
            {errors.country && <p className="text-danger">{errors.country}</p>}
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
            {errors.shipmentDescription && (
              <p className="text-danger">{errors.shipmentDescription}</p>
            )}
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
              step="0.01"
            />
            {errors.shipmentWeight && (
              <p className="text-danger">{errors.shipmentWeight}</p>
            )}
            <small className="hint">الحد المسموح: {LIMITS.weightMin} - {LIMITS.weightMax} كجم</small>
          </div>

          <div className="form-group">
            <label>الطول (سم) </label>
            <input
              type="number"
              name="shipmentLength"
              value={formData.shipmentLength}
              onChange={handleChange}
              min={LIMITS.dimMin}
              max={LIMITS.dimMax}
              step="0.1"
            />
            {errors.shipmentLength && <p className="text-danger">{errors.shipmentLength}</p>}
          </div>

          <div className="form-group">
            <label>العرض (سم) *</label>
            <input
              type="number"
              name="shipmentWidth"
              value={formData.shipmentWidth}
              onChange={handleChange}
              min={LIMITS.dimMin}
              max={LIMITS.dimMax}
              step="0.1"
            />
            {errors.shipmentWidth && <p className="text-danger">{errors.shipmentWidth}</p>}
          </div>

          <div className="form-group">
            <label>الارتفاع (سم) </label>
            <input
              type="number"
              name="shipmentHeight"
              value={formData.shipmentHeight}
              onChange={handleChange}
              min={LIMITS.dimMin}
              max={LIMITS.dimMax}
              step="0.1"
            />
            {errors.shipmentHeight && <p className="text-danger">{errors.shipmentHeight}</p>}
            <small className="hint">الأبعاد يجب أن تكون بين {LIMITS.dimMin} و {LIMITS.dimMax} سم</small>
          </div>

          <div className="form-group">
            <label>ملاحظات خاصة بالشحن</label>
            <textarea
              name="shipmentNotes"
              value={formData.shipmentNotes}
              onChange={handleChange}
            />
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
            {errors.collectionAmount && (
              <p className="text-danger">{errors.collectionAmount}</p>
            )}
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
            {errors.expressDeliveryEnabled && (
              <p className="text-danger">{errors.expressDeliveryEnabled}</p>
            )}
          </div>
        </div>
      </form>
    </div>
    </>
  );
};

export default ShippingPage;
