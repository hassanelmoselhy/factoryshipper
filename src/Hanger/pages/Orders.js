import React, { useState } from "react";
import "./css/Orders.css";
import { FaEdit, FaPrint } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";


const HangerOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: "ORD-000842",
      customer: "أحمد علي",
      city: "القاهرة",
      price: 500,
      status: "جاري الشحن",
      statusClass: "shipping",
      phone: "201123456789",
      address: "شارع النيل، المعادي، القاهرة",
      deliveryDate: "10 أكتوبر، 2023",
      item: "مكواة بخار",
      weight: "1 كيلو",
      dimensions: "40x60 سم",
      deliveryMan: "محمد السيد",
      deliveryDistance: "2.4 كيلومتر",
      generalInfo: {
        totalPrice: "500 جنيه",
        deliveryFee: "100 جنيه",
        packagingFee: "50 جنيه",
        discount: "0 جنيه",
      },
      extraInfo: {
        extraWeight: "30 جنيه",
        percentage: "30 جنيه",
      },
      orderHistory: [
        { date: "٩ أكتوبر ٢٠٢٣", time: "٠٤:٠٠ م", status: "تم استلام الطلب" },
        { date: "١٠ أكتوبر ٢٠٢٣", time: "١٠:٠٠ ص", status: "في الطريق للتسليم" },
      ],
    },
    {
      id: "ORD-000843",
      customer: "فاطمة محمد",
      city: "الجيزة",
      price: 250,
      status: "قيد التنفيذ",
      statusClass: "pending",
      phone: "201098765432",
      address: "شارع الهرم، الجيزة",
      deliveryDate: "12 أكتوبر، 2023",
      item: "خلاط كهربائي",
      weight: "2 كيلو",
      dimensions: "30x50 سم",
      deliveryMan: "محمود خالد",
      deliveryDistance: "5.1 كيلومتر",
      generalInfo: {
        totalPrice: "250 جنيه",
        deliveryFee: "50 جنيه",
        packagingFee: "20 جنيه",
        discount: "10 جنيه",
      },
      extraInfo: {
        extraWeight: "30 جنيه",
        percentage: "30 جنيه",
      },
      orderHistory: [
        { date: "١١ أكتوبر ٢٠٢٣", time: "٠٩:٠٠ ص", status: "تم استلام الطلب" },
        { date: "١١ أكتوبر ٢٠٢٣", time: "٠٢:٠٠ م", status: "قيد التجهيز" },
      ],
    },
    {
      id: "ORD-000844",
      customer: "خالد حسن",
      city: "القاهرة",
      price: 800,
      status: "تم التسليم",
      statusClass: "success",
      phone: "201234567890",
      address: "مدينة نصر، القاهرة",
      deliveryDate: "8 أكتوبر، 2023",
      item: "شاشة تلفزيون",
      weight: "5 كيلو",
      dimensions: "80x120 سم",
      deliveryMan: "أيمن رجب",
      deliveryDistance: "3.8 كيلومتر",
      generalInfo: {
        totalPrice: "800 جنيه",
        deliveryFee: "120 جنيه",
        packagingFee: "80 جنيه",
        discount: "0 جنيه",
      },
      extraInfo: {
        extraWeight: "30 جنيه",
        percentage: "30 جنيه",
      },
      orderHistory: [
        { date: "٧ أكتوبر ٢٠٢٣", time: "٠٦:٠٠ م", status: "تم استلام الطلب" },
        { date: "٨ أكتوبر ٢٠٢٣", time: "٠٩:٠٠ ص", status: "تم التسليم بنجاح" },
      ],
    },
  ];

  const handleOrderClick = (order) => {
    setSelectedOrder(selectedOrder && selectedOrder.id === order.id ? null : order);
  };

  return (
    <div className="dashboard">
      {/* القسم العلوي */}
      <div className="header-box">
        <div className="stats">
          <h3>طلبات الاستلام</h3>
          <h1>1234</h1>
          <p>إجمالي الطرود</p>
          <span className="change">+2.5% التغير اليومي</span>
        </div>
        <div className="extra-stats">
          <p>قيد التوصيل</p>
          <h2>45</h2>
        </div>
        <div className="extra-stats">
          <p>الكل (6)</p>
          <h2>الأسبوع (0)</h2>
        </div>
      </div>

      {/* ملخص الطلبات */}
      <div className="summary">
        <div className="card pending">
          انتظار القرار <span>7</span>
        </div>
        <div className="card success">
          الطلبات الناجحة <span>89</span>
        </div>
        <div className="card ready">
          جاهز للتحصيل <span>15</span>
        </div>
        <div className="card execute">
          قيد التنفيذ <span>23</span>
        </div>
      </div>

      <div className={`orders-page ${selectedOrder ? "sidebar-open" : ""}`}>
        <div className="orders-main-content">
          {/* العنوان */}
          <h3>الطلبات</h3>
          <div className="orders-header">
            <div className="filters">
              <input type="text" placeholder="ابحث برقم الطلب أو رقم التليفون" />
              <select>
                <option value="">جميع الحالات</option>
                <option>تم التسليم</option>
                <option>جارى الشحن</option>
                <option>قيد التنفيذ </option>
                <option>ملغي </option>
                <option>موجود بالفرع</option>
              </select>
            </div>
          </div>
          {/* جدول الطلبات */}
          <div className="orders-list">
            {orders.map((order) => (
              <div
                className={`order-card ${selectedOrder && selectedOrder.id === order.id ? "selected" : ""}`}
                key={order.id}
                onClick={() => handleOrderClick(order)}
              >
                <div className="order-details">
                  <span className="order-id">{order.id}</span>
                  <p>{order.customer}</p>
                </div>

                <div className="order-actions">
                  <div className="order-info">
                    <span className={`status ${order.statusClass}`}>{order.status}</span>
                    <div className="order-location">
                      <span>{order.city}</span>
                      <p>{order.price} جنيه</p>
                    </div>
                  </div>
                  <button>
                    <FaPrint />
                  </button>
                  <button>
                    <FaEdit />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedOrder && (
          <div className="order-sidebar">
            <div className="sidebar-header">
              <span className="sidebar-order-id">{selectedOrder.id}</span>
              <button className="close-sidebar" onClick={() => setSelectedOrder(null)}>
                X
              </button>
            </div>
            <div className="sidebar-details">
              <h4>معلومات العميل</h4>
              <ul>
                <li>
                  <span>اسم العميل:</span> {selectedOrder.customer}
                </li>
                <li>
                  <span>رقم الهاتف:</span> {selectedOrder.phone}
                </li>
                <li>
                  <span>العنوان الكامل:</span> {selectedOrder.address}
                </li>
                <li>
                  <span>محتوى الطلب:</span> {selectedOrder.item}
                </li>
              </ul>

              <h4>الشحن و الجدولة</h4>
              <ul>
                <li>
                  <span>موعد التسليم:</span> {selectedOrder.deliveryDate}
                </li>
                <li>
                  <span>المندوب المعين:</span> {selectedOrder.deliveryMan}
                </li>
                <li>
                  <span>الوزن:</span> {selectedOrder.weight}
                </li>
              </ul>

              <h4>المعلومات المالية</h4>
              <ul>
                <li>
                  <span>قيمة التحصيل:</span> {selectedOrder.generalInfo.totalPrice}
                </li>
                <li>
                  <span>قيمة الشحن</span> {selectedOrder.generalInfo.deliveryFee}
                </li>
                <li>
                  <span>قيمة التوريد:</span> {selectedOrder.generalInfo.packagingFee}
                </li>
              </ul>

              <h4>المبالغ الاضافية</h4>
              <ul>
                <li>
                  <span>وزن زائد:</span> {selectedOrder.extraInfo.extraWeight}
                </li>
                <li>
                  <span> نسبة تحصيل (1%):</span> {selectedOrder.extraInfo.percentage}
                  </li>
              </ul>

              <h4>تاريخ الطلب</h4>
              <ul className="order-history-list">
                {selectedOrder.orderHistory.map((entry, index) => (
                  <li key={index}>
                    <div className="history-dot"></div>
                    <div>
                      <p>{entry.status}</p>
                      <span>{entry.date} - {entry.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sidebar-footer">
              <button className="confirm-order-btn">
                <span className="icon"><FaPrint /></span> طباعة بوليصة الشحن
              </button>
              <button className="edit-order-btn">
                <span className="icon-edit"><FaEdit /></span> تعديل الطلب
              </button>
              <button className="cancel-order-btn">
                <span className="icon"><MdOutlineCancel /></span> إلغاء الطلب
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HangerOrders;
