import React, { useState } from "react";
import "./css/ShippingPage.css";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { egypt_governorates } from '../../Shared/Constants';
import { createShipment } from '../Data/ShipmentsService';

// Import components
import ShipmentTypeTabs from '../components/ShippingPage/ShipmentTypeTabs';
import CustomerDataCard from '../components/ShippingPage/CustomerDataCard';
import ParcelDetailsCard from '../components/ShippingPage/ParcelDetailsCard';
import ExchangeReturnParcelCard from '../components/ShippingPage/ExchangeReturnParcelCard';
import PaymentOptionsCard from '../components/ShippingPage/PaymentOptionsCard';
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
    shipmentPrice: 35,
    additionalWeightFees: 0,
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
    deliveryZone: "",
    productValue: "",
    proofFile: null,
    packageType: "",
    returnPackageType: "" // New field for exchange return parcel
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
    if (last === "packageType" && !value) return messages.required;
    if (last === "collectionAmount" && (value <= 0)) return messages.collectionRequired;

    // Validation for exchange/return specific fields
    if (shipmentType === 'exchange') {
      if (last === "returnQuantity" && (value < 1 || !Number.isInteger(Number(value)))) return messages.qtyInteger;
      if (last === "returnShipmentDescription" && !value) return messages.required;
      if (last === "returnPackageType" && !value) return messages.required;
    }
    
    // For cash_collection, we DO validate shipmentDescription, but NOT packageType or quantity
    if (shipmentType === 'cash_collection') {
       if (last === "packageType") return null;
       if (last === "quantity") return null;
    }

    return null;
  };

  // Helper function to map shipment type
  const mapShipmentType = (type) => {
    const typeMap = {
      'delivery': 'Delivery',
      'exchange': 'Exchange',
      'return': 'Return',
      'cash_collection': 'Cash Collection'
    };
    return typeMap[type] || 'Delivery';
  };

  // Helper function to map package type
  const mapPackageType = (packageType) => {
    const packageMap = {
      'parcel': 'Parcel',
      'largeshipment': 'LargeShipment',
      'document': 'Document',
      'OversizedShipment':'OversizedShipment'
    };
    return packageMap[packageType] || 'Parcel';
  };

  // Helper function to map transaction type
  const mapTransactionType = (formData, shipmentType) => {
    if (shipmentType === 'cash_collection') {
      return formData.isRefund ? 'RefundToCustomer' : 'CollectFromCustomer';
    }
    if (formData.isRefund) {
      return 'RefundToCustomer';
    }
    if (formData.collectionAmount > 0) {
      return 'CollectFromCustomer';
    }
    return 'None';
  };

  const validateAll = (data) => {
    const newErrors = {};
    let fields = ["customerName", "customerPhone", "customerAddress.street", "customerAddress.city", "customerAddress.governorate", "quantity", "shipmentDescription", "packageType"];
    
    
    if (shipmentType === 'cash_collection') {
      // Just check strictly required fields for cash collection
      // Parcel Details card is visible but only Description is required. Check logic below.
      fields = ["customerName", "customerPhone", "customerAddress.street", "customerAddress.city", "customerAddress.governorate", "collectionAmount"];
    }
    fields.forEach(f => {
      const val = getByPath(data, f);
      const err = validateField(f, val, data);
      if (err) newErrors[f] = err;
    });

    if (shipmentType === 'exchange') {
      const exchangeFields = ["returnQuantity", "returnShipmentDescription", "returnPackageType"];
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
    
    // Map the form data to the new API schema
    let payload = {
      CustomerInfo: {
        CustomerName: formData.customerName || "",
        CustomerPhone: formData.customerPhone || "",
        CustomerAdditionalPhone: formData.customerAdditionalPhone || "",
        CustomerEmail: formData.customerEmail || "",
        CustomerAddress: {
          Street: formData.customerAddress.street || "",
          City: formData.customerAddress.city || "",
          Governorate: formData.customerAddress.governorate || "",
          AdditionalDetails: formData.customerAddress.details || "",
          GoogleMapAddressLink: formData.customerAddress.googleMapAddressLink || ""
        }
      },
      DeliveryNotes: `[منطقة التوصيل: ${formData.deliveryZone}] ${formData.deliveryNotes || ""}`.trim()
    };

    if (shipmentType === 'delivery') {
      // New structure for delivery as requested
      payload.ShipmentDetails = {
        ShipmentType: mapPackageType(formData.packageType),
        ShipmentDescription: formData.shipmentDescription || "",
        ShipmentWeight: formData.shipmentWeight ? Number(formData.shipmentWeight) : 0,
        Quantity: formData.quantity ? Number(formData.quantity) : 0,
        ShipmentNotes: formData.shipmentNotes || "",
        ShipmentImage: formData.proofFile || "",
        ProductPrice: formData.productValue ? Number(formData.productValue) : 0,
        ProductPriceProofImage: formData.proofFile || ""
      };
      payload.CollectionCashAmount = formData.collectionAmount ? Number(formData.collectionAmount) : 0;
      payload.OpenPackageOnDeliveryEnabled = formData.openPackageOnDeliveryEnabled || false;
    } else if (shipmentType === 'return') {
      // New structure for return as requested
      payload.ShipmentDetails = {
        ShipmentType: mapPackageType(formData.packageType),
        ShipmentDescription: formData.shipmentDescription || "",
        ShipmentWeight: formData.shipmentWeight ? Number(formData.shipmentWeight) : 0,
        Quantity: formData.quantity ? Number(formData.quantity) : 0,
        ShipmentNotes: formData.shipmentNotes || "",
        ShipmentImage: formData.proofFile || "",
        ProductPrice: formData.productValue ? Number(formData.productValue) : 0,
        ProductPriceProofImage: formData.proofFile || ""
      };
      payload.RefundCashAmount = formData.collectionAmount ? Number(formData.collectionAmount) : 0;
      payload.OpenPackageOnDeliveryEnabled = formData.openPackageOnDeliveryEnabled || false;
    } else {
      // Existing logic for exchange, return, cash_collection
      if (shipmentType === 'cash_collection') {
        payload.TransactionType = mapTransactionType(formData, shipmentType);
        payload.TransactionCashAmount = formData.collectionAmount ? Number(formData.collectionAmount) : 0;
      } else {
        payload.DeliveryShipmentDetails = {}; 
        payload.PaymentAndDeliveryOptionsDto = {
          TransactionType: mapTransactionType(formData, shipmentType),
          TransactionCashAmount: formData.collectionAmount ? Number(formData.collectionAmount) : 0,
          ProductPrice: formData.productValue ? Number(formData.productValue) : 0,
          ProductPriceProofImage: formData.proofFile || "", // File or empty string
          OpenPackageOnDeliveryEnabled: formData.openPackageOnDeliveryEnabled || false,
          ShipmentPrice: formData.shipmentPrice ? Number(formData.shipmentPrice) : 0,
          AdditionalWeightPrice: formData.additionalWeightFees ? Number(formData.additionalWeightFees) : 0
        };
      }

      // Add delivery shipment details only if not cash collection
      if (shipmentType !== 'cash_collection') {
        payload.DeliveryShipmentDetails = {
          ShipmentType: mapPackageType(formData.packageType),
          ShipmentDescription: formData.shipmentDescription || "",
          ShipmentWeight: formData.shipmentWeight ? Number(formData.shipmentWeight) : 0,
          Quantity: formData.quantity ? Number(formData.quantity) : 0,
          ShipmentNotes: formData.shipmentNotes || "",
          ShipmentImage: formData.proofFile || ""
        };
      }

      // Add ReturnShipmentDetails if exchange type
      if (shipmentType === 'exchange') {
        payload.ReturnShipmentDetails = {
          ShipmentType: mapPackageType(formData.returnPackageType),
          ShipmentDescription: formData.returnShipmentDescription || "",
          ShipmentWeight: formData.returnShipmentWeight ? Number(formData.returnShipmentWeight) : 0,
          Quantity: formData.returnQuantity ? Number(formData.returnQuantity) : 0,
          ShipmentNotes: formData.returnShipmentNotes || "",
          ShipmentImage: formData.returnProofFile || ""
        };
      }

      // Add ReturnLocation (Always required by API structure)
      if (shipmentType === 'cash_collection') {
         // logic for cash collection (if any special logic needed, otherwise it sends fields as needed)
      } else {
         // For delivery, exchange, return
         payload.ReturnLocation = {
          Street: formData.returnLocation || "string", // Provide default string if empty to match curl
          City: "string", // Default string as per curl
          Governorate: "string", // Default string as per curl
          AdditionalDetails: "string",
          GoogleMapAddressLink: "string"
        };
      }
    }

    console.log('Mapped Payload:', payload);

    try {
      const result = await createShipment(payload, shipmentType);
      if (result.Success) {
        Swal.fire({ icon: "success", title: "تم إنشاء الأوردر بنجاح", timer: 2000, showConfirmButton: false });
        navigate("/orders");
      } else {
        toast.error(result.Message || "حدث خطأ ما");
      }
    } catch (err) {
      console.error('Submit error:', err);
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

              {shipmentType !== 'cash_collection' && (
              <ParcelDetailsCard 
                shipmentType={shipmentType}
                formData={formData}
                errors={errors}
                handleChange={handleChange}
              />
              )}

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


            </div>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="col-lg-4">
            <OrderSummaryCard 
              formData={formData}
              loading={loading}
              handleSubmit={handleSubmit}
              navigate={navigate}
              shipmentType={shipmentType}
            />
          </div>

        </div>
      </form>
    </div>
  );
};

export default ShippingPage;