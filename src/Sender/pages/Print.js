import React from "react";
import { useParams } from "react-router-dom";
import "./css/Print.css";
import { fallbackOrderDetails } from "./OrderDetails"; // لو ملف OrderDetails فيه البيانات

const Print = () => {
  const { orderId } = useParams();
  const order = fallbackOrderDetails[orderId];

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
              <p><span className="bold">العنوان :</span> {order.address}</p>
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
              src={`https://barcodeapi.org/api/128/${order.barcode}`}
              alt="barcode"
            />
            <p className="bold">كود الطرد : {order.barcode}</p>
          </div>
        </div>

        {/* Details */}
        <div className="print-details">
          <div>
            <p><span className="bold">المرسل :</span> urban skate store</p>
            <p><span className="bold">المستلم :</span> {order.name}</p>
          </div>
          <div>
            <p><span className="bold">القيمة :</span> {order.price} جنيه</p>
            <p><span className="bold">الشحن :</span> {order.shipping} جنيه</p>
          </div>
        </div>

        {/* Address & Contact */}
        <div className="print-address">
          <p><span className="bold">العنوان :</span> {order.address}</p>
          <p><span className="bold">محتوي الباكدج :</span> {order.packageContent}</p>
          <p><span className="bold">التليفون :</span> {order.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default Print;
