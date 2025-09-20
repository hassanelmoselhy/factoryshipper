import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import "./css/OrderDetails.css";
import TopBar from "../components/Topbar";
import useShipmentsStore from '../../Store/UserStore/ShipmentsStore';
import { toast } from "sonner";
import useUserStore from "../../Store/UserStore/userStore";
import LoadingOverlay from "../components/LoadingOverlay";
export const fallbackOrderDetails = {
  2: {
    id: 842,
    status: "تم التوصيل",
    type: "سريع",
    name: "أحمد محمد علي",
    phone: "+201234567890",
    address: "الرياض، حي الزهري",
    date: "2024-01-15",
    time: "14:30",
    price: 45,
    packageContent: "ملابس: 3 قطع، إكسسوارات",
    barcode: "1234567890123",
    shipping: 10,
extras: [
    { label: "تغليف إضافي", value: 5 },
    { label: "خدمة سريعة", value: 2 }
  ],
  tracking: [
    { status: "تم استلام الطلب", location: "الرياض", date: "2024-01-14", time: "10:00" },
    { status: "جاري التوصيل", location: "الطريق السريع", date: "2024-01-15", time: "12:00" },
    { status: "تم التوصيل", location: "الرياض، حي الزهري", date: "2024-01-15", time: "14:30" }
  ]
  },
  841: {
    id: 841,
    status: "منتج للعميل",
    type: "عادي",
    name: "فاطمة علي",
    phone: "0559876543",
    address: "جدة، حي الأزهراء",
    date: "2024-01-15",
    time: "12:15",
    price: 35,
    packageContent: "كتب: 2، أقلام: 5",
    barcode: "4567890123456",
    shipping: 10,
  extras: [
    { label: "تغليف إضافي", value: 5 },
    { label: "خدمة سريعة", value: 2 }
  ],
  tracking: [
    { status: "تم استلام الطلب", location: "الرياض", date: "2024-01-14", time: "10:00" },
    { status: "جاري التوصيل", location: "الطريق السريع", date: "2024-01-15", time: "12:00" },
    { status: "تم التوصيل", location: "الرياض، حي الزهري", date: "2024-01-15", time: "14:30" }
  ]
  },
  840: {
    id: 840,
    status: "قيد التنفيذ",
    type: "سريع",
    name: "محمد سالم",
    phone: "0551112233",
    address: "الدمام، حي الفيصلية",
    date: "2024-01-15",
    time: "10:45",
    price: 25,
    packageContent: "إلكترونيات: 1، شاحن: 1",
    barcode: "7890123456789",
    shipping: 10,
  extras: [
    { label: "تغليف إضافي", value: 5 },
    { label: "خدمة سريعة", value: 2 }
  ],
  tracking: [
    { status: "تم استلام الطلب", location: "الرياض", date: "2024-01-14", time: "10:00" },
    { status: "جاري التوصيل", location: "الطريق السريع", date: "2024-01-15", time: "12:00" },
    { status: "تم التوصيل", location: "الرياض، حي الزهري", date: "2024-01-15", time: "14:30" }
  ]
  },
  839: {
    id: 839,
    status: "انتظار القرار",
    type: "عادي",
    name: "نورا أحمد",
    phone: "0554445556",
    address: "مكة، حي العزيزية",
    date: "2024-01-14",
    time: "16:20",
    price: 50,
    packageContent: "مستحضرات تجميل: 4",
    barcode: "0123456789012",
    shipping: 10,
  extras: [
    { label: "تغليف إضافي", value: 5 },
    { label: "خدمة سريعة", value: 2 }
  ],
  tracking: [
    { status: "تم استلام الطلب", location: "الرياض", date: "2024-01-14", time: "10:00" },
    { status: "جاري التوصيل", location: "الطريق السريع", date: "2024-01-15", time: "12:00" },
    { status: "تم التوصيل", location: "الرياض، حي الزهري", date: "2024-01-15", time: "14:30" }
  ]
  },
};

export const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Shipment,SetShipment]=useState();
  const Shipments = useShipmentsStore((state) => state.shipments);
  const user=useUserStore((state)=>state.user);
  useEffect(() => {
    setLoading(true);
    const findShipment=Shipments?.find(s=>s.id===parseInt(orderId));
    
    if(findShipment){   
    SetShipment(findShipment);
    setLoading(false);
    }
    console.log("Found Shipment:",orderId );

  setLoading(false);

  }, [orderId]);

  if (loading) {
    return (
      <div className="order-details-container">جاري تحميل تفاصيل الطلب...</div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="order-details-container" style={{ color: "red" }}>
  //       خطأ: {error}
  //     </div>
  //   );
  // }

  if (Shipment===null) {
    return (
      <div className="order-details-container">
        لم يتم العثور على تفاصيل لهذا الطلب.
      </div>
    );
  }

// const totalExtras = orderDetails.extras.reduce((acc, e) => acc + e.value, 0);
const supplyValue = Shipment.collectionAmount ;



  const DeleteShipment= async ()=>{
    try{
  setLoading(true);
console.log("Deleting Shipment:",orderId );
  const res=await fetch("https://stakeexpress.runasp.net/api/Shipments/deleteShipment/"+orderId,{

    method:"DELETE",
    headers:{
      'Content-Type': 'application/json',
      'X-Client-Key': 'web API',
      'Authorization': `Bearer ${user?.token}`
    },
    

  });
  console.log("Response Status:",res.status);
  if(res.ok===true){
  
    toast.success("تم إلغاء الطلب بنجاح");
    navigate(-1);
  }
  else {

   
    toast.error("حدث خطأ أثناء إلغاء الطلب");
  }

}catch(err){
    toast.error("حدث خطأ في الخادم أثناء إلغاء الطلب");
    console.log('Server Error',err);

  }finally{
    setLoading(false);
  }
}

  return (
    <>
    <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />
      <TopBar />
      <div className="order-details-page">
        <div className="order-details-header">
          <h2>تفاصيل الطلب</h2>
          <p>إدارة ومتابعة تفاصيل الطلب #{Shipment.id}</p>
        </div>

        <div className="order-actions-bar">
          <button className="cancel-button"      onClick={DeleteShipment} >
            إلغاء الطلب
            <i class="fa-solid fa-xmark"></i>
          </button>
          <button className="edit-button">
            تعديل الطلب
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
         <button
  className="print-button primary"
  onClick={() => navigate(`/print/${Shipment.id}`)}
>
  طباعة بوليصة الشحن
  <i className="fa-solid fa-print"></i>
</button>

        </div>

        <div className="order-details-section">
          <h3>تفاصيل الطلب والعميل</h3>


          <div className="order-info-grid">
            <div className="info-item1">
              <span className="info-label">حالة الطلب</span>
              <div className={`status-badge ${Shipment.status}`}>
                {Shipment.status}
              </div>
            </div>
            <div className="info-item2">
              {/* 1 */}
            <div className="order-info">
            <span className="info-label">رقم الطلب</span>
            <div className="order-id-display">
                <i className="fa-regular fa-copy"></i> {Shipment.id}
              </div>
            </div>
            {/* 2 */}
              <div className="barcode-display">
                <span className="info-label">الباركود</span>
                <Barcode
                  value={123}
                  height={60}
                  displayValue={true}
                />
              </div>
            </div>
          </div>

          <div className="customer-info-section">
            <h3>معلومات العميل</h3>
            <div className="customer-info-grid">
              <div className="info-item">
                <span className="info-label">اسم العميل</span>
                <i className="fas fa-user"></i> {Shipment.receiverName}
              </div>
              <div className="info-item">
                <span className="info-label">رقم الهاتف</span>
                <i className="fas fa-phone"></i> {Shipment.receiverPhone}
              </div>
              <div className="info-item">
                <span className="info-label">العنوان الكامل</span>
                <i className="fas fa-map-marker-alt"></i> {Shipment.receiverAddress}
              </div>
              <div className="info-item">
                <span className="info-label">محتوى الطرد</span>
                <i className="fas fa-box"></i> {Shipment.shipmentDescription}
              </div>
            </div>
          </div>

<div className="order-extra-sections">
          <div className="finance-section">
            <h3>المعلومات المالية</h3>
            <div className="finance-box">
              <div className="finance-row"><span>قيمة التحصيل</span><strong>{Shipment.collectionAmount} جنيه</strong></div>
              <div className="finance-row"><span>قيمة الشحن</span><strong>{10} جنيه</strong></div>
              <div className="finance-row"><span>المبالغ الإضافية</span>
                <div>
                  
                    <div  className="extra-item">{"وزن زائد"}: {15} جنيه</div>
                
                </div>
              </div>
              <div className="finance-total">قيمة التوريد: {supplyValue} جنيه</div>
            </div>
          </div>


    {/* <div className="tracking-section">
            <h3>تتبع مسار الطلب</h3>
            <ul className="tracking-list">
              {orderDetails.tracking.map((t, i) => (
                <li key={i} className={`tracking-item ${i === orderDetails.tracking.length - 1 ? "pending" : "done"}`}>
                  <div className="status">{t.status}</div>
                  <div className="location">{t.location}</div>
                  <div className="time">{t.date} - {t.time}</div>
                </li>
              ))}
            </ul>
          </div> */}
        </div>


          <button onClick={() => navigate(-1)} className="back-button">
            العودة للطلبات
          </button>
        </div>
      </div>
    </>
  );



};
