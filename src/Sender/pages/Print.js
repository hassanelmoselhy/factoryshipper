import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./css/Print.css";
import useShipmentsStore from "../../Store/UserStore/ShipmentsStore";
import useUserStore from "../../Store/UserStore/userStore";
const Print = () => {
  const { orderId } = useParams();
  const [order,SetOrder] = useState();
  const [loading, setLoading] = useState(true);
  const user=useUserStore((state)=>state.user);
 useEffect(()=>{
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
          SetOrder(data.data);
          
        }

        }catch(err){
          console.log("Error fetching shipment details:",err );
        }finally{
          setLoading(false);
        }
      }
fetchShipmentDetails();
window.print();

},[])

  if (!order) {
    return <div>لم يتم العثور على بيانات الطرد</div>;
  }

  return (
    <div className="print-page">
      <div className="print-container">
        {/* Header */}
        <div className="print-header">
          <span>{order.time} {order.date}</span>
          <h2>stakeexpress</h2>
        </div>

        {/* Barcode + Logo */}
        <div className="print-box">
          <div className="print-box-top">
            <div className="print-location">
              <p className="d-flex"><span className="bold" >العنوان :</span> {
              
              order.customerAddress.city +
              " - " +
              order.customerAddress.street +
             
              order.customerAddress.details
              }</p>
            </div>
            <div className="print-logo">
              <img
                src="https://i.ibb.co/NjjJXJr/turbo-logo.png"
                alt="Turbo Logo"
              />
              <p>
                ادعم اقتصادنا في غزة بالشراء من خلال
                <br />
                مؤسسة مرسال الموثوقة عن طريق الخط الساخن 19340
              </p>
            </div>
          </div>

          <div className="print-barcode">
            <img
              src={`https://barcodeapi.org/api/128/${order?.shipmentTrackingNumber}`}
              alt="barcode"
            />
            {/* <p className="bold">كود الطرد : {order?.shipmentTrackingNumber}</p> */}
          </div>
        </div>

        {/* Details */}
        <div className="print-details">
          <div>
            <p className="d-flex justify-content-between"><span className="bold">المرسل :</span> {user?.firstName+" "+user?.lastName}</p>
            <p className="d-flex justify-content-between"><span className="bold">المستلم :</span> {order.customerName}</p>
          </div>
          <div>
              
              <div className="d-flex justify-content-between">
                <strong>{order.collectionAmount} جنيه</strong>
                <span>قيمة التحصيل</span>
                </div>
           
              <div className="finance-row d-flex justify-content-between">
                
                <strong>{order.shippingCost} جنيه</strong>
                <span>قيمة الشحن</span>
                </div>
              
              <div className="finance-row d-flex justify-content-between">
                <strong>{order.additionalCost} جنيه</strong>
                <span>رسوم اضافيه</span>
                </div>
              
              {/* <div className="finance-row"><span>المبالغ الإضافية</span>
                <div>
                  
                    <div  className="extra-item">{"وزن زائد"}: {Shipment.additionalWeightCost} جنيه</div>
                
                </div>
              </div> */}
             <div className="finance-row d-flex justify-content-between">
              <strong>{order?.totalCost} جنيه</strong>
              <span>المبلغ الكلي</span>
              
              
              </div>


              <div className="finance-total">قيمة التوريد: {order?.netPayout} جنيه</div>
          </div>
        </div>

        {/* Address & Contact */}
        <div className="print-address">
          <p><span className="bold">العنوان :</span> {

                  
              
              order.customerAddress.city +
              " - " +
              order.customerAddress.street +
             
              order.customerAddress.details
              }</p>
          <p><span className="bold">محتوي الطرد :</span> {order.shipmentDescription}</p>
          <p><span className="bold">التليفون :</span> {order.customerPhone
}</p>
        </div>
      </div>
    </div>
  );
};

export default Print;
