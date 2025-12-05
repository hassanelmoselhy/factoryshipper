import React, { useState } from "react";
import "./css/ShippingPage.css";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { egypt_governorates } from '../../Shared/Constants';
import { CreateShipment } from '../Data/ShipmentsService';

// Import components
import ShipmentTypeTabs from '../components/ShippingPage/ShipmentTypeTabs';
import CustomerDataCard from '../components/ShippingPage/CustomerDataCard';
import ParcelDetailsCard from '../components/ShippingPage/ParcelDetailsCard';
import ExchangeReturnParcelCard from '../components/ShippingPage/ExchangeReturnParcelCard';
import PaymentOptionsCard from '../components/ShippingPage/PaymentOptionsCard';
import ReturnLocationCard from '../components/ShippingPage/ReturnLocationCard';
import OrderSummaryCard from '../components/ShippingPage/OrderSummaryCard';

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
      
      {/* Header & Tabs */}
      <ShipmentTypeTabs 
        shipmentType={shipmentType}
        setShipmentType={setShipmentType}
        setFormData={setFormData}
      />

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          
          {/* Left Column: Forms */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-4">

              <CustomerDataCard 
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                governorateOptions={governorateOptions}
              />

              <ParcelDetailsCard 
                shipmentType={shipmentType}
                formData={formData}
                errors={errors}
                handleChange={handleChange}
              />

              {shipmentType === 'exchange' && (
                <ExchangeReturnParcelCard 
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                />
              )}

              <PaymentOptionsCard 
                shipmentType={shipmentType}
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                setFormData={setFormData}
              />

              <ReturnLocationCard 
                shipmentType={shipmentType}
                formData={formData}
                handleChange={handleChange}
                returnLocationOptions={returnLocationOptions}
              />

            </div>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="col-lg-4">
            <OrderSummaryCard 
              formData={formData}
              loading={loading}
              handleSubmit={handleSubmit}
              navigate={navigate}
            />
          </div>

        </div>
      </form>
    </div>
  );
};

export default ShippingPage;