import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import TopBar from "../components/Topbar";
import useShipmentsStore from '../../Store/UserStore/ShipmentsStore';
import { toast } from "sonner";
import useUserStore from "../../Store/UserStore/userStore";
import LoadingOverlay from "../components/LoadingOverlay";
import DeleteModal from "../../Components/DeleteModal";
import EditOrderModal from "../components/OrderEditSidebar";
import ShipmentCancelModal from "../../Components/ShipmentCancelModal";
import "./css/OrderDetails.css";



export const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Shipment,SetShipment]=useState();
  const Shipments = useShipmentsStore((state) => state.shipments);
  const user=useUserStore((state)=>state.user);
  const [showdeleteModal, setShowDeleteModal] = useState(false);
  const [showEditOrder, setShowEditOrder] = useState(false);
  const [showCancelRequest, setshowCancelRequest] = useState(false);
  useEffect(() => {
    const fetchShipmentDetails=async()=>{
      setLoading(true);
      console.log("Fetching details for orderId:",orderId );
        try{
       const res=await fetch(`https://stakeexpress.runasp.net/api/Shipments/getShipmentById/${orderId}`,{
        method:"Get",
        headers:{
          'Content-Type': 'application/json',
          'X-Client-Key': 'web API',
        Authorization: `Bearer ${user?.token}`
        }
      
      });
        if(res.ok===true){

          const data=await res.json();
          console.log("Fetched Shipment Details:",data);
          SetShipment(data.data);
          
        }

        }catch(err){
          console.log("Error fetching shipment details:",err );
        }finally{
          setLoading(false);
        }
      }

   
    
  

    fetchShipmentDetails();
  }, []);




  
  if (loading) {
    return (
      <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />


    );
  }


  if (Shipment===null) {
    return (
      <div className="order-details-container">
        لم يتم العثور على تفاصيل لهذا الطلب.
      </div>
    );
  }



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
const handleSaveOnEdit=async(updatedorder)=>{


try{
  console.log("Saving updated order:",updatedorder );
  setLoading(true);
  const res=await fetch(`https://stakeexpress.runasp.net/api/Shipments/updateShipment/${Shipment.id}`,{
    method:"PUT",
    headers:{
      'Content-Type': 'application/json',
      'X-Client-Key': 'web API',
      Authorization: `Bearer ${user?.token}`
  },
  body:JSON.stringify(updatedorder)
   });
   if(res.ok===true){

    const data=await res.json();

    console.log("Update Response Data:",data);
      SetShipment(data.data);
    toast.success("تم تحديث الطلب بنجاح");
   }
   else if(res.ok===false){
    const errorData=await res.json();
    console.log("Update Error Data:",errorData);
    toast.error("حدث خطأ أثناء تحديث الطلب: " + (errorData.message || "خطأ غير معروف"));
   }

}catch(err){
console.log("Error updating order:",err );
} finally{
  setLoading(false);
}

}

  return (
    <>
    <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />
    <DeleteModal show={showdeleteModal} title="Delete Shipment" message="Are you sure you want to delete this Shipment? This action cannot be undone." 
    onCancel={()=>setShowDeleteModal(false)}
    onConfirm={DeleteShipment}
    loading={loading}
    />
    

      <TopBar />
    
      <EditOrderModal 
      open={showEditOrder}
      onClose={()=>setShowEditOrder(false)}
      order={Shipment}
      onSave={handleSaveOnEdit}
      
      />
    
      <ShipmentCancelModal show={showCancelRequest} onClose={()=>{setshowCancelRequest(false)}}/>
      <div className="order-details-page">
        <div className="order-details-header">
          <h2>تفاصيل الطلب</h2>
          <p>إدارة ومتابعة تفاصيل الطلب #{Shipment.id}</p>
        </div>

        <div className="order-actions-bar">
          <button className="cancel-button"      onClick={()=>setShowDeleteModal((prev)=>!prev)} >
            حذف الطلب
            <i class="fa-solid fa-xmark"></i>
          </button>
          {(Shipment?.shipmentStatuses[0].status==="InWarehouse"||Shipment.shipmentStatuses[0].status==="Delivered")&&(

             <button className="cancel-button"      onClick={()=>{setshowCancelRequest(true)}} >
            طلب الغاء
            <i class="fa-solid fa-xmark"></i>
          </button>
          )}
         



          <button className="edit-button"   onClick={()=>{setShowEditOrder(true);}}>
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
              <div className={`status-badge ${Shipment.status} text-black`}>
                {Shipment.shipmentStatuses[0].status}
              </div>
            </div>
            <div className="info-item2">
              {/* 1 */}
            <div className="order-info">
            <span className="info-label">رقم الطلب</span>
            <div className="order-id-display">
                <i className="fa-regular fa-copy"></i> {orderId}
              </div>
            </div>
            {/* 2 */}
              <div className="barcode-display">
                <span className="info-label">الباركود</span>
                <Barcode
                  value={Shipment?.shipmentTrackingNumber}
                  height={50}
                  width={"1em"}
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
                <i className="fas fa-user"></i> {Shipment.customerName}
              </div>
              <div className="info-item">
                <span className="info-label">رقم الهاتف</span>
                <i className="fas fa-phone"></i> {Shipment.customerPhone}
              </div>
              <div className="info-item">
                <span className="info-label">العنوان الكامل</span>
                <i className="fas fa-map-marker-alt"></i> {
              Shipment.customerAddress.governorate +
              " - " +
              Shipment.customerAddress.city +
              " - " +
              Shipment.customerAddress.street +
              " - " +
              Shipment.customerAddress.details}
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
              <div className="finance-row"><span>قيمة الشحن</span><strong>{Shipment.shippingCost} جنيه</strong></div>
              <div className="finance-row"><span>رسوم اضافيه</span><strong>{Shipment.additionalCost} جنيه</strong></div>
              
              {/* <div className="finance-row"><span>المبالغ الإضافية</span>
                <div>
                  
                    <div  className="extra-item">{"وزن زائد"}: {Shipment.additionalWeightCost} جنيه</div>
                
                </div>
              </div> */}
                                <div className="finance-row"><span>المبلغ الكلي</span><strong>{Shipment?.totalCost} جنيه</strong></div>


              <div className="finance-total">قيمة التوريد: {Shipment?.netPayout} جنيه</div>
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
