import React, { useState } from "react";
import "./css/ShippingPage.css";
import useUserStore from "../../Store/UserStore/userStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
    expressDeliveryEnabled: false, // 0=عادي, 1=سريع
    openPackageOnDeliveryEnabled: false,
    cashOnDeliveryEnabled: false,
    collectionAmount: 0,
  });

  const user = useUserStore((state) => state.user);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Handle input change
 const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData((prev) => {
    let newVal;

    if (type === "checkbox") {
      newVal = checked;
    } else if (type === "number") {
      newVal = value === "" ? "" : Number(value);
    } else if (name === "expressDeliveryEnabled") {
      newVal = value === "true"; // ✅ convert string "true"/"false" → real Boolean
    } else {
      newVal = value;
    }

    return { ...prev, [name]: newVal };
  });
};


  // ✅ Validate required fields
  const validate = () => {
    const requiredFields = [
      "receiverName",
      "receiverPhone",
      "receiverEmail",
      "street",
      "addressDetails",
      "city",
      "shipmentDescription",
      "quantity",
      "shipmentWeight",
      "shipmentLength",
      "shipmentWidth",
      "shipmentHeight",
      "expressDeliveryEnabled",
    ];

    const newErrors = {};
    requiredFields.forEach((field) => {
      if (
        formData[field] === "" ||
        formData[field] === null ||
        formData[field] === undefined
      ) {
        newErrors[field] = "هذا الحقل مطلوب";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) {
      toast.error("UnAuthorized, Please log in to create a shipment.");
      return;
    }
console.log(user?.token);
    //if (!validate()) return;

    try {
      setLoading(true);
      console.log("Submitting form data:", formData);
      const response = await fetch(
        "https://stakeexpress.runasp.net/api/Shipments/addShipment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(formData),
        }
      );

          console.log("Status:", response.status);
            const text = await response.text();
            console.log("Response text:", text);

      if (response.ok) {
         
      
    
        toast.success("Shipment created successfully!");
        navigate('/home');
      
      }
      else if(response.status===400){

        toast.error("❌ Failed to create shipment. Please check your data.");
      }

        else if(response.status===401){
          toast.error("❌ Unauthorized. Please log in again.");
        }
        else {
          toast.error("server error");
        }


     } catch (err) {
      console.log(err);
      
      toast.error(`❌ Failed to create shipment. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <p>{formData.shipmentWeight}</p>
        </div>

        <div className="summary-item">
          <span>الأبعاد</span>
          <p>
            {formData.shipmentLength} × {formData.shipmentWidth} ×{" "}
            {formData.shipmentHeight} سم
          </p>
        </div>

        <div className="summary-item">
          <span>أولوية التوصيل</span>
          <p>{formData.expressDeliveryEnabled === true ? "سريع" : "عادي"}</p>
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
        <button className="cancel-btn" type="button">
          إلغاء
        </button>
      </div>

      {/* الفورم */}
      <form className="form-area" onSubmit={handleSubmit}>
        {/* بيانات المستلم */}
        <div className="card">
          <h3>بيانات المستلم</h3>
          <div className="form-group">
            <label>اسم المستلم *</label>
            <input
              type="text"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
            />
            {errors.receiverName && <p className="error">{errors.receiverName}</p>}
          </div>

          <div className="form-group">
            <label>البريد الالكتروني *</label>
            <input
              type="email"
              name="receiverEmail"
              value={formData.receiverEmail}
              onChange={handleChange}
            />
            {errors.receiverEmail && <p className="error">{errors.receiverEmail}</p>}
          </div>

          <div className="form-group">
            <label>رقم الهاتف *</label>
            <input
              type="text"
              name="receiverPhone"
              value={formData.receiverPhone}
              onChange={handleChange}
            />
            {errors.receiverPhone && <p className="error">{errors.receiverPhone}</p>}
          </div>

          <div className="form-group">
            <label>اسم الشارع *</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
            />
            {errors.street && <p className="error">{errors.street}</p>}
          </div>

          <div className="form-group">
            <label>تفاصيل العنوان *</label>
            <input
              type="text"
              name="addressDetails"
              value={formData.addressDetails}
              onChange={handleChange}
            />
            {errors.addressDetails && <p className="error">{errors.addressDetails}</p>}
          </div>

          <div className="form-group">
            <label>المدينة *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            {errors.city && <p className="error">{errors.city}</p>}
          </div>
        
          <div className="form-group">
            <label>البلد *</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
            {errors.country && <p className="error">{errors.country}</p>}
          </div>
        
        
        </div>

        {/* تفاصيل الطرد */}
        <div className="card">
          <h3>تفاصيل الطرد</h3>
          <div className="form-group">
            <label>محتوى الطرد *</label>
            <input
              type="text"
              name="shipmentDescription"
              value={formData.shipmentDescription}
              onChange={handleChange}
            />
            {errors.shipmentDescription && (
              <p className="error">{errors.shipmentDescription}</p>
            )}
          </div>

          <div className="form-group">
            <label>عدد القطع *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
            {errors.quantity && <p className="error">{errors.quantity}</p>}
          </div>

          <div className="form-group">
            <label>وزن الطلب *</label>
            <select
              name="shipmentWeight"
              value={formData.shipmentWeight}
              onChange={handleChange}
            >
              <option value="">اختر الوزن</option>
              <option value={5}>1-5</option>
              <option value={10}>5-10</option>
              <option value={15}>10-15</option>
            </select>
            {errors.shipmentWeight && (
              <p className="error">{errors.shipmentWeight}</p>
            )}
          </div>

          <div className="form-group">
            <label>الطول (سم) *</label>
            <input
              type="number"
              name="shipmentLength"
              value={formData.shipmentLength}
              onChange={handleChange}
            />
            {errors.shipmentLength && <p className="error">{errors.shipmentLength}</p>}
          </div>

          <div className="form-group">
            <label>العرض (سم) *</label>
            <input
              type="number"
              name="shipmentWidth"
              value={formData.shipmentWidth}
              onChange={handleChange}
            />
            {errors.shipmentWidth && <p className="error">{errors.shipmentWidth}</p>}
          </div>

          <div className="form-group">
            <label>الارتفاع (سم) *</label>
            <input
              type="number"
              name="shipmentHeight"
              value={formData.shipmentHeight}
              onChange={handleChange}
            />
            {errors.shipmentHeight && <p className="error">{errors.shipmentHeight}</p>}
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
            <label>قيمه التحصيل *</label>
            <input
              type="number"
              name="collectionAmount"
              value={formData.collectionAmount}
              onChange={handleChange}
            >
              
            </input>
            {errors.collectionAmount && (
              <p className="error">{errors.collectionAmount}</p>
            )}
          </div>
        

          <div className="form-group">
            <label>أولوية التوصيل *</label>
            <select
              name="expressDeliveryEnabled"
              value={formData.expressDeliveryEnabled}
              onChange={handleChange}
            >
              <option value={false}>عادي</option>
              <option value={true}>سريع</option>
            </select>
            {errors.expressDeliveryEnabled && (
              <p className="error">{errors.expressDeliveryEnabled}</p>
            )}
          </div>
        
        
        </div>
      </form>
    </div>
  );
};

export default ShippingPage;
