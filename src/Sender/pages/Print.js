import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./css/Print.css";
import useShipmentsStore from "../../Store/UserStore/ShipmentsStore";

const Print = () => {
  const { orderId } = useParams();
  const Shipments = useShipmentsStore((state) => state.shipments);
  const order = Shipments?.find((s) => s.id === parseInt(orderId));

 useEffect(()=>{

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
            <p><span className="bold">المرسل :</span> urban skate store</p>
            <p><span className="bold">المستلم :</span> {order.customerName}</p>
          </div>
          <div>
            <p><span className="bold">القيمة :</span> {order.collectionAmount} جنيه</p>
            <p><span className="bold">الشحن :</span> 10 جنيه</p>
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
