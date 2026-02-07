import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./css/Print.css";
import useUserStore from "../../Store/UserStore/userStore";
import LoadingOverlay from "../components/LoadingOverlay";
import { getOrderDetails } from "../Data/OrdersService";
import { 
  User, 
  Phone, 
  MapPin, 
  Package, 
  Truck, 
  DollarSign, 
  Calendar, 
  Hash,
  Box
} from "lucide-react";
const Print = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, SetOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchShipmentDetails = async () => {
      setLoading(true);
      const orderType = location.state?.orderType || "Delivery";
      console.log(`Fetching details for Waybill - OrderId: ${orderId}, type: ${orderType}`);
      try {
        const res = await getOrderDetails(orderType, orderId);
        if (res.Success) {
          console.log("Fetched Waybill Details:", res.Data);
          SetOrder(res.Data);

          // Trigger print after data is loaded and rendered
          setTimeout(() => {
            window.print();
          }, 1500);
        }
      } catch (err) {
        console.log("Error fetching shipment details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShipmentDetails();
  }, [orderId, location.state?.orderType]);




  if (!loading && !order) {
    return (
      <div className="print-error">
        <h2>خطأ</h2>
        <p>لم يتم العثور على بيانات الطرد: {orderId}</p>
      </div>
    );
  }

  const creationDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-EG') : '';
  const creationTime = order?.createdAt ? new Date(order.createdAt).toLocaleTimeString('ar-EG') : '';

  return (
    <>
      <LoadingOverlay loading={loading} message="جاري تجهيز البوليصة..." color="#fff" size={44} />
      
      {!loading && order && (
        <div className="waybill-page">
          <div className="bosta-waybill-container">
            {/* Top Section */}
            <div className="waybill-top-grid">
              <div className="top-left-brand">
                <img src="https://i.ibb.co/NjjJXJr/turbo-logo.png" alt="Logo" className="bosta-logo" />
                <div className="order-type-badge">
                  {order.orderType === 'Delivery' ? 'توصيل' : order.orderType}
                </div>
                <div className="hub-code-badge">N-02</div>
              </div>
              
              <div className="top-center-barcode">
                <img
                  src={`https://barcodeapi.org/api/128/${order.orderNumber}`}
                  alt="Barcode"
                  className="bosta-barcode"
                />
                <div className="barcode-numbers">
                  {order.orderNumber?.split('').join(' ')}
                </div>
                <div className="hub-name">
                  {order.zone?.name || order.customer?.customerAddress?.governorate} HUB ({order.zone?.code || "MK"}-D - 1)
                </div>
              </div>

              <div className="top-right-qr">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://stakeexpress.runasp.net/track/${order.orderNumber}`}
                  alt="QR"
                  className="bosta-qr"
                />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="waybill-main-grid">
              {/* Wide Column (Left) */}
              <div className="main-left-col">
                <div className="grid-row region-row">
                  <span className="row-label">المنطقة | </span>
                  <span className="row-value">{order.customer?.customerAddress?.governorate}</span>
                </div>
                
                <div className="grid-row address-details-row">
                  <div className="address-big-text">
                    {order.customer?.customerAddress?.city} - {order.customer?.customerAddress?.street}
                    <br />
                    {order.customer?.customerAddress?.additionalDetails}
                  </div>
                </div>

                <div className="grid-row landmark-row">
                  <span className="row-label">علامة مميزة | </span>
                  <span className="row-value">{order.customer?.customerAddress?.details || "-"}</span>
                </div>

                <div className="grid-row description-row">
                  <span className="row-label">وصف الشحنة | </span>
                  <span className="row-value">{order.shipment?.shipmentDescription || order.shipment?.quantity + " قطع"}</span>
                </div>
              </div>

              {/* Narrow Column (Right) */}
              <div className="main-right-col">
                <div className="side-row collection-row">
                  <span className="side-label">مبلغ التحصيل:</span>
                  <span className="side-value highlight">{order.transactionCashAmount} ج.م</span>
                </div>

                <div className="side-row deliver-to-row">
                  <span className="side-label">توصيل إلى:</span>
                  <div className="side-value-stack">
                    <span className="customer-name-text">{order.customer?.customerName}</span>
                    <span className="customer-phone-text">{order.customer?.customerPhone}</span>
                  </div>
                </div>

                <div className="side-row merchant-row">
                  <span className="side-label">التاجر:</span>
                  <span className="side-value">{user?.companyName}</span>
                </div>

                <div className="side-actions-row">
                  <div className="action-box">
                    <span>فتح الشحنة : {order.openPackageOnDeliveryEnabled ? 'نعم' : 'لا'}</span>
                  </div>
                  <div className="action-box">
                    <span>{order.shipment?.quantity || 0} قطع</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Print;
