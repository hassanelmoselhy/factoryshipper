import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import TopBar from "../components/Topbar";
import { 
  Trash2, 
  Printer, 
  Edit3, 
  ArrowRight, 
  User, 
  Phone, 
  MapPin, 
  Package, 
  Weight, 
  Maximize, 
  Clipboard,
  CheckCircle,
  Truck,
  Box,
  CreditCard,
  DollarSign,
  AlertTriangle,
  History,
  RefreshCw,
  CornerUpLeft,
  Banknote,
  Copy,
  ExternalLink
} from "lucide-react";
import useShipmentsStore from "../../Store/UserStore/ShipmentsStore";
import { toast } from "sonner";
import useUserStore from "../../Store/UserStore/userStore";
import LoadingOverlay from "../components/LoadingOverlay";
import DeleteModal from "../../Components/DeleteModal";
import EditOrderModal from "../components/OrderEditSidebar";
import ShipmentCancelModal from "../../Components/ShipmentCancelModal";
import Swal from "sweetalert2";
import { getOrderDetails, cancelOrder, getOrderImage, updateShipment } from "../Data/OrdersService";

import "./css/OrderDetails.css";

// Authenticated Image Component
const AuthenticatedImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl = null;

    const fetchImage = async () => {
      if (!src) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getOrderImage(src);

        if (!res.Success) throw new Error('Failed to load image');

        objectUrl = URL.createObjectURL(res.Data);
        setImageSrc(objectUrl);
      } catch (err) {
        console.error("Error loading image:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (loading) return (
    <div className={`image-loading-placeholder ${className}`}>
      <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
      <span className="ms-2">جاري التحميل...</span>
    </div>
  );
  
  if (error || !imageSrc) return (
    <div className={`image-error-placeholder ${className}`}>
       <AlertTriangle size={18} />
       <span>فشل التحميل</span>
    </div>
  );

  return (
    <div className={`authenticated-image-container ${className}`} onClick={() => window.open(imageSrc, '_blank')}>
      <img src={imageSrc} alt={alt} className="auth-img-tag" />
      <div className="img-overlay-hint">
        <Maximize size={14} />
        <span>تكبير</span>
      </div>
    </div>
  );
};

export const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Shipment, SetShipment] = useState();
  const user = useUserStore((state) => state.user);
  const [showdeleteModal, setShowDeleteModal] = useState(false);
  const [showEditOrder, setShowEditOrder] = useState(false);
  const [showCancelRequest, setshowCancelRequest] = useState(false);
  const location =useLocation();
  useEffect(() => {
    console.log('s', location.state?.orderType)
    const fetchShipmentDetails = async () => {
      // Fake data logic for testing
      if (orderId && orderId.startsWith("mock")) {
        setLoading(true);
        setTimeout(() => {
          const type = orderId.split("-")[1] || "Delivery";
          const mockData = {
            id: "12345",
            orderNumber: "STK-789-X1",
            orderType: type.charAt(0).toUpperCase() + type.slice(1),
            shipmentTrackingNumber: "STK9876543210",
            customerName: "أحمد محمد علي",
            customerPhone: "01012345678",
            customerAdditionalPhone: "01287654321",
            customerEmail: "ahmed.ali@example.com",
            customerAddress: {
              governorate: "القاهرة",
              city: "مدينة نصر",
              street: "شارع عباس العقاد",
              details: "عمارة 15, الدور الرابع, شقة 8",
              googleMapAddressLink: "https://maps.google.com"
            },
            quantity: 3,
            shipmentWeight: 2.5,
            shipmentLength: 30,
            shipmentWidth: 20,
            shipmentHeight: 15,
            shipmentDescription: "ملابس واكسسوارات رجالي - جودة عالية",
            shipmentNotes: "يرجى الاتصال قبل الوصول بـ 30 دقيقة",
            collectionAmount: 1550,
            shippingCost: 50,
            additionalCost: 15,
            netPayout: 1485,
            expressDeliveryEnabled: true,
            cashOnDeliveryEnabled: true,
            orderHistory: [
              { status: "OnTheWay", timestamp: new Date().toISOString(), notes: "المندوب في طريقه إليك" },
              { status: "InWarehouse", timestamp: new Date(Date.now() - 86400000).toISOString(), notes: "تم استلام الشحنة في مخزن القاهرة" },
              { status: "Pending", timestamp: new Date(Date.now() - 172800000).toISOString(), notes: "تم إنشاء الطلب بنجاح" }
            ],
            returnShipmentDetails: type === 'Exchange' ? {
              Quantity: 1,
              ShipmentWeight: 0.5,
              ShipmentType: "Box",
              ShipmentDescription: "قميص مقاس XL للاستبدال بمقاس L",
              ShipmentNotes: "المنتج بحالته الأصلية"
            } : null
          };
          SetShipment(mockData);
          setLoading(false);
        }, 800);
        return;
      }

      setLoading(true);
      const orderType = location.state?.orderType || "Delivery";
      console.log(`Fetching details for orderId: ${orderId}, type: ${orderType}`);
      try {
        const res = await getOrderDetails(orderType, orderId);
        if (res.Success) {
          console.log("Fetched Shipment Details:", res.Data);
          SetShipment(res.Data);
        } else {
          console.error("Fetch Error:", res.Message);
          setError(res.Message || "فشل جلب تفاصيل الطلب");
        }
      } catch (err) {
        console.log("Error fetching shipment details:", err);
        setError("حدث خطأ في الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    };

    fetchShipmentDetails();

  }, [orderId, location.state?.orderType, user?.token]);

  if (loading) {
    return (
      <LoadingOverlay
        loading={loading}
        message="please wait..."
        color="#fff"
        size={44}
      />
    );
  }

  if (Shipment === null) {
    return (
      <div className="order-details-container">
        لم يتم العثور على تفاصيل لهذا الطلب.
      </div>
    );
  }

  const DeleteShipment = async () => {
    try {
      setLoading(true);
      console.log("Deleting Shipment:", orderId);
      const res = await cancelOrder(orderId);

      if (res.Success) {
        Swal.fire({
          position: "center-center",
          icon: "success",
          title: "تم إلغاء الطلب بنجاح",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate(-1);
      } else {
        toast.error(res.Message);
        navigate(-1);
      }
    } catch (err) {
      toast.error("حدث خطأ في الخادم أثناء إلغاء الطلب");
      console.log("Server Error", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSaveOnEdit = async (updatedorder) => {
    console.log("test", updatedorder);
    const payload = {
      customerName: updatedorder.customerName,
      customerPhone: updatedorder.customerPhone,
      customerAdditionalPhone: updatedorder.customerAdditionalPhone,
      customerEmail: updatedorder.customerEmail,
      customerAddress: {
        street: updatedorder.street,
        city: updatedorder.city,
        governorate: updatedorder.governorate,
        details: updatedorder.addressDetails,
        googleMapAddressLink: updatedorder.googleMapAddressLink,
      },
      shipmentDescription: updatedorder.shipmentDescription,
      shipmentWeight: updatedorder.shipmentWeight,
      shipmentLength: updatedorder.shipmentLength,
      shipmentWidth: updatedorder.shipmentWidth,
      shipmentHeight: updatedorder.shipmentHeight,
      quantity: updatedorder.quantity,
      shipmentDescription: updatedorder.shipmentDescription,
      shipmentNotes: updatedorder.shipmentNotes,
      cashOnDeliveryEnabled: updatedorder.cashOnDeliveryEnabled,
      openPackageOnDeliveryEnabled: updatedorder.openPackageOnDeliveryEnabled,
      expressDeliveryEnabled: updatedorder.expressDeliveryEnabled,
      collectionAmount: updatedorder.collectionAmount,
      // Include return details for Exchange/Return
      returnQuantity: updatedorder.returnQuantity,
      returnShipmentWeight: updatedorder.returnShipmentWeight,
      returnShipmentDescription: updatedorder.returnShipmentDescription,
      returnShipmentNotes: updatedorder.returnShipmentNotes,
    };

    try {
      console.log("Saving updated order:", payload);
      setLoading(true);
      const res = await updateShipment(Shipment?.id, payload);

      if (res.Success) {
        console.log("Update Response Data:", res.Data);
        SetShipment(res.Data);
        toast.success("تم تحديث الطلب بنجاح");
      } else {
        console.log("Update Error:", res.Message);
        toast.error(
          "حدث خطأ أثناء تحديث الطلب: " + (res.Message || "خطأ غير معروف")
        );
      }
    } catch (err) {
      console.log("Error updating order:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = ["NewOrder", "InProgress", "OutForDelivery", "Completed"];
    return steps.indexOf(status) + 1 || 1;
  };

const TYPE_MAPPING = {
    'Delivery': { label: 'توصيل', class: 'type-delivery', icon: <Truck size={14} /> },
    'Return': { label: 'مرتجع', class: 'type-return', icon: <CornerUpLeft size={14} /> },
    'Exchange': { label: 'استبدال', class: 'type-exchange', icon: <RefreshCw size={14} /> },
    'CashCollection': { label: 'تحصيل نقدي', class: 'type-cashcollection', icon: <Banknote size={14} /> }
  };

  const currentStep = getStatusStep(Shipment?.orderCurrentStatus);
  const orderType = Shipment?.orderType || location.state?.orderType || "Delivery";
  const typeInfo = TYPE_MAPPING[orderType] || TYPE_MAPPING['Delivery'];

  // Handle return details which might be nested or flattened depending on API version
  const returnDetails = Shipment?.returnShipmentDetails || {
    Quantity: Shipment?.returnQuantity,
    ShipmentWeight: Shipment?.returnShipmentWeight,
    ShipmentDescription: Shipment?.returnShipmentDescription,
    ShipmentNotes: Shipment?.returnShipmentNotes,
    ShipmentType: Shipment?.returnPackageType
  };


  return (
    <div className="order-details-wrapper">
      <LoadingOverlay
        loading={loading}
        message="يرجى الانتظار..."
        color="#fff"
        size={44}
      />
      
      <DeleteModal
        show={showdeleteModal}
        title="حذف الشحنة"
        message="هل أنت متأكد أنك تريد حذف هذه الشحنة؟ لا يمكن التراجع عن هذا الإجراء."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={DeleteShipment}
        loading={loading}
      />

      <EditOrderModal
        open={showEditOrder}
        onClose={() => setShowEditOrder(false)}
        order={Shipment}
        onSave={handleSaveOnEdit}
      />

      <ShipmentCancelModal
        show={showCancelRequest}
        onClose={() => setshowCancelRequest(false)}
      />

      <div className="order-details-page">
        {/* Header Section */}
        <div className="order-header-dashboard">
          <div className="header-main-content">
            <div className="id-badge">
              <span className="label">رقم الطلب</span>
              <div className="value-row" onClick={() => {
                navigator.clipboard.writeText(orderId);
                toast.success("تم نسخ رقم الطلب");
              }}>
                <Copy size={14} />
                <span className="id-number">#{orderId}</span>
              </div>
            </div>
            <div className="title-section">
              <div className="title-with-badge">
                <h2>تفاصيل الشحنة</h2>
                <div className={`type-tag ${typeInfo.class}`}>
                  {typeInfo.icon}
                  <span>{typeInfo.label}</span>
                </div>
              </div>
              <p>متابعة الحالة والبيانات المالية للطلب</p>
            </div>
          </div>

          <div className="header-actions">
            <button className="btn-action btn-delete" onClick={() => setShowDeleteModal(true)}>
              <Trash2 size={16} />
              حذف
            </button>
            <button className="btn-action btn-edit" onClick={() => setShowEditOrder(true)}>
              <Edit3 size={16} />
              تعديل
            </button>
            {orderType !== 'CashCollection' && orderType !== 'Return' && (
              <button className="btn-action btn-print" onClick={() => navigate(`/print/${orderId}`, { state: { orderType } })}>
                <Printer size={16} />
                طباعه بوليصه
              </button>
            )}
          </div>
        </div>

        {/* Tracking Stepper */}
        <div className="order-details-section stepper-section">
          <div className="stepper-horizontal">
            {[
              { id: 1, label: "تم الطلب", icon: <Clipboard /> },
              { id: 2, label: "في المستودع", icon: <Box /> },
              { id: 3, label: "جارِ التوصيل", icon: <Truck /> },
              { id: 4, label: "تم التسليم", icon: <CheckCircle /> },
            ].map((step) => (
              <div key={step.id} className={`step-item ${currentStep >= step.id ? "active" : ""} ${currentStep === step.id ? "current" : ""}`}>
                <div className="step-icon">
                  {step.icon}
                </div>
                <span className="step-label">{step.label}</span>
                {step.id < 4 && <div className="step-line"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="order-grid-layout">
          {/* Left Column: Essential Info */}
          <div className="grid-col main-info">
            {/* Customer Details Card */}
            <div className="premium-card">
              <div className="card-header">
                <User className="header-icon" />
                <h3>بيانات العميل</h3>
              </div>
              <div className="card-body customer-details">
                <div className="data-row">
                  <div className="data-content">
                    <span className="data-value">{Shipment?.customer?.customerName}</span>
                    <span className="data-label">اسم العميل</span>
                  </div>
                  <User className="row-icon" size={18} />
                </div>
                <div className="data-row">
                  <div className="data-content">
                    <span className="data-value">{Shipment?.customer?.customerPhone}</span>
                    <span className="data-label">رقم الهاتف</span>
                  </div>
                  <Phone className="row-icon" size={18} />
                </div>
                {Shipment?.customer?.customerAdditionalPhone && (
                  <div className="data-row">
                    <div className="data-content">
                      <span className="data-value">{Shipment?.customer?.customerAdditionalPhone}</span>
                      <span className="data-label">رقم إضافي</span>
                    </div>
                    <Phone className="row-icon" size={18} />
                  </div>
                )}
                <div className="data-row address-row">
                  <div className="data-content">
                    <span className="data-value">
                      {`${Shipment?.customer?.customerAddress?.governorate || ""} - ${Shipment?.customer?.customerAddress?.city || ""} - ${Shipment?.customer?.customerAddress?.street || ""}`}
                    </span>
                    <span className="data-label">العنوان</span>
                  </div>
                  <MapPin className="row-icon" size={18} />
                </div>
                {Shipment?.customer?.customerAddress?.additionalDetails && (
                  <div className="data-row sub-row">
                    <div className="data-content">
                      <span className="data-value sub">{Shipment?.customer?.customerAddress?.additionalDetails}</span>
                    </div>
                  </div>
                )}
                {Shipment?.zone && (
                  <div className="data-row">
                    <div className="data-content">
                      <span className="data-value">{typeof Shipment.zone === 'object' ? Shipment.zone.name : Shipment.zone}</span>
                      <span className="data-label">المنطقة</span>
                    </div>
                    <MapPin className="row-icon" size={18} />
                  </div>
                )}
                {Shipment?.customer?.customerAddress?.googleMapAddressLink && (
                  <a href={Shipment?.customer?.customerAddress?.googleMapAddressLink} target="_blank" rel="noreferrer" className="map-action-btn">
                    <ExternalLink size={14} />
                    عرض على خرائط جوجل
                  </a>
                )}
              </div>
            </div>

            {/* Shipment details card */}
            {orderType !== 'CashCollection' && (
            <div className="premium-card">
              <div className="card-header">
                <Package className="header-icon" />
                <h3>مواصفات الشحنة</h3>
              </div>
              <div className="card-body shipment-details">
                <div className="specs-grid">
                  <div className="spec-item">
                    <div className="icon-box"><Package size={20} /></div>
                    <div className="spec-info">
                      <span className="val">{Shipment?.shipment?.quantity || 0} قطع</span>
                      <span className="lbl">الكمية</span>
                    </div>
                  </div>
                  <div className="spec-item">
                    <div className="icon-box"><Weight size={20} /></div>
                    <div className="spec-info">
                      <span className="val">{Shipment?.shipment?.shipmentWeight || 0} كجم</span>
                      <span className="lbl">الوزن</span>
                    </div>
                  </div>
                  <div className="spec-item">
                    <div className="icon-box"><Box size={20} /></div>
                    <div className="spec-info">
                      <span className="val">{Shipment?.shipment?.shipmentType || "غير محدد"}</span>
                      <span className="lbl">نوع الشحنة</span>
                    </div>
                  </div>
                   {Shipment?.shipment?.productPrice > 0 && (
                  <div className="spec-item">
                    <div className="icon-box"><DollarSign size={20} /></div>
                    <div className="spec-info">
                      <span className="val">{Shipment?.shipment?.productPrice} ج.م</span>
                      <span className="lbl">قيمة المنتج</span>
                    </div>
                  </div>
                   )}
                  <div className="spec-item">
                    <div className="icon-box"><Maximize size={20} /></div>
                    <div className="spec-info">
                      <span className="val">{`${Shipment?.shipment?.shipmentLength || 0}x${Shipment?.shipment?.shipmentWidth || 0}x${Shipment?.shipment?.shipmentHeight || 0}`}</span>
                      <span className="lbl">الأبعاد (سم)</span>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="icon-box"><RefreshCw size={20} /></div>
                    <div className="spec-info">
                      <span className="val">{Shipment?.deliveryAttempts || 0}</span>
                      <span className="lbl">محاولات التوصيل</span>
                    </div>
                  </div>
                </div>
                <div className="description-box">
                  <span className="lbl">وصف المحتوى</span>
                  <p>{Shipment?.shipment?.shipmentDescription || "لا يوجد وصف"}</p>
                </div>
                {Shipment?.shipment?.shipmentNotes && (
                  <div className="notes-box">
                    <AlertTriangle size={14} />
                    <span>{Shipment?.shipment?.shipmentNotes}</span>
                  </div>
                )}

                {/* Shipment Attachment Section */}
                {(Shipment?.shipment?.shipmentImagePath || Shipment?.shipment?.productPriceProofImagePath) && (
                  <div className="shipment-attachments-section">
                    <div className="section-divider"></div>
                    <h4 className="attachments-title">المرفقات والصور</h4>
                    <div className="attachments-grid">
                      {Shipment?.shipment?.shipmentImagePath && (
                        <div className="attachment-item">
                           <span className="attachment-label">صورة الشحنة</span>
                           <AuthenticatedImage 
                              src={Shipment.shipment.shipmentImagePath} 
                              alt="صورة الشحنة" 
                           />
                        </div>
                      )}
                      {Shipment?.shipment?.productPriceProofImagePath && (
                        <div className="attachment-item">
                           <span className="attachment-label">إثبات قيمة المنتج</span>
                           <AuthenticatedImage 
                              src={Shipment.shipment.productPriceProofImagePath} 
                              alt="إثبات سعر المنتج" 
                           />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Exchange/Return Section */}
            {(orderType === 'Exchange' || orderType === 'Return') && (
               <div className="premium-card exchange-card">
               <div className="card-header">
                 <RefreshCw className="header-icon" />
                 <h3>تفاصيل الشحنة المرجعة ({orderType === 'Exchange' ? 'استبدال' : 'مرتجع'})</h3>
               </div>
               <div className="card-body">
                 <div className="specs-grid">
                   <div className="spec-item">
                     <div className="icon-box"><Package size={20} /></div>
                     <div className="spec-info">
                       <span className="val">{returnDetails?.Quantity || returnDetails?.quantity || 0} قطع</span>
                       <span className="lbl">الكمية المرتجعة</span>
                     </div>
                   </div>
                   <div className="spec-item">
                     <div className="icon-box"><Weight size={20} /></div>
                     <div className="spec-info">
                       <span className="val">{returnDetails?.ShipmentWeight || returnDetails?.shipmentWeight || 0} كجم</span>
                       <span className="lbl">الوزن المرتجع</span>
                     </div>
                   </div>
                   <div className="spec-item">
                    <div className="icon-box"><Truck size={20} /></div>
                    <div className="spec-info">
                      <span className="val">{returnDetails?.ShipmentType || returnDetails?.shipmentType || "N/A"}</span>
                      <span className="lbl">نوع الطرد</span>
                    </div>
                  </div>
                 </div>
                 <div className="description-box">
                   <span className="lbl">وصف المرتجع</span>
                   <p>{returnDetails?.ShipmentDescription || returnDetails?.shipmentDescription || "لا يوجد وصف"}</p>
                 </div>
               </div>
             </div>
            )}

            {orderType === 'CashCollection' && (
              <div className="premium-card">
                <div className="card-header">
                  <DollarSign className="header-icon" />
                  <h3>تفاصيل التحصيل النقدي</h3>
                </div>
                <div className="card-body">
                   <div className="description-box">
                    <span className="lbl">ملاحظات التحصيل</span>
                    <p>{Shipment?.shipmentDescription || "لا توجد تفاصيل"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Financial & Barcode */}
          <div className="grid-col side-info">
            {/* Financial Card */}
            <div className="premium-card finance-card">
              <div className="card-header">
                <DollarSign className="header-icon" />
                <h3>الملخص المالي</h3>
              </div>
              <div className="card-body">
                <div className="pricing-list">
                  <div className="pricing-item">
                    <span className="price-val">{Shipment?.transactionCashAmount || 0} ج.م</span>
                    <span className="price-label">مبلغ التحصيل</span>
                  </div>
                  <div className="pricing-item">
                    <span className="price-val">{Shipment?.shippingServiceCostDetails?.totalCost || 0} ج.م</span>
                    <span className="price-label">تكلفة الشحن</span>
                  </div>
                  {Shipment?.additionalCost > 0 && (
                    <div className="pricing-item">
                      <span className="price-val">{Shipment?.additionalCost} ج.م</span>
                      <span className="price-label">رسوم إضافية</span>
                    </div>
                  )}
                  <div className="pricing-divider"></div>
                  <div className="payout-box">
                    <div className="payout-content">
                      <span className="payout-amount">{(Shipment?.transactionCashAmount || 0) - (Shipment?.shippingServiceCostDetails?.totalCost || 0)} ج.م</span>
                      <span className="payout-label">صافي الربح المتوقع</span>
                    </div>
                    <div className="payout-icon"><CreditCard /></div>
                  </div>
                </div>
                
                <div className="payment-badges">
                  {Shipment?.transactionType && (
                    <span className="p-badge transaction">
                      <CreditCard size={14} />
                      {Shipment.transactionType === 'CollectFromCustomer' ? 'تحصيل من العميل' : Shipment.transactionType}
                    </span>
                  )}
                  {Shipment?.openPackageOnDeliveryEnabled && (
                    <span className="p-badge open-package">
                      <Box size={14} />
                      مسموح بفتح الشحنة
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* QR Code Card */}
            <div className="premium-card qrcode-card">
              <div className="card-header">
                <Printer className="header-icon" />
                <h3>QR تتبع الشحنة</h3>
              </div>
              <div className="card-body centered">
                <div className="qr-only-container">
                  <div className="qr-wrapper">
                    <QRCodeCanvas 
                      value={`https://stakeexpress.runasp.net/track/${Shipment?.shipmentTrackingNumber}`}
                      size={120}
                      level={"H"}
                      includeMargin={false}
                    />
                  </div>
                </div>
                <p className="tracking-hint">رقم التتبع: {Shipment?.shipmentTrackingNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="order-details-section timeline-card">
          <div className="card-header">
            <History className="header-icon" />
            <h3>سجل الحالات</h3>
          </div>
          <div className="timeline-container">
            {Shipment?.orderHistory && Shipment?.orderHistory.length > 0 ? (
              <div className="timeline-list">
                {Shipment.orderHistory.map((s, index) => (
                  <div key={index} className="timeline-item">
                    <div className="time-marker">
                      <div className="marker-dot"></div>
                      <div className="marker-line"></div>
                    </div>
                    <div className="timeline-content">
                      <div className="time-header">
                        <span className="status-name">{s.status}</span>
                        <span className="status-time">{new Date(s.timestamp).toLocaleString("ar-EG")}</span>
                      </div>
                      <p className="status-notes">{s.notes || "لا توجد ملاحظات لهذه الحالة"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">لا يوجد سجل تاريخي لهذه الشحنة حتى الآن</div>
            )}
          </div>
        </div>

        <div className="footer-actions">
           <button onClick={() => navigate(-1)} className="btn-back">
            <ArrowRight size={18} />
            العودة للطلبات
          </button>
        </div>
      </div>
    </div>
  );
};
