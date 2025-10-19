import React, { useState } from "react";
import { BiError, BiTimeFive, BiCheckCircle, BiBox } from "react-icons/bi";
import { BsBoxSeam } from "react-icons/bs";
import { HiArrowTrendingUp } from "react-icons/hi2";
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
      phone: "201234567890+",
      address: "شارع النيل، المعادي، القاهرة",
      item: "حذاء رياضي",
      deliveryDate: "16 يناير 2025 م 04:00 م",
      deliveryMan: "محمد أحمد",
      weight: "2.4 كجم",
      generalInfo: {
        totalPrice: "500 جنيه",
        deliveryFee: "100 جنيه",
        packagingFee: "50 جنيه",
      },
      extraInfo: {
        extraWeight: "0 كجم",
        percentage: "5 جنيه",
      },
      orderHistory: [
        {
          status: "تم إنشاء الطلب",
          date: "10 يناير 2025",
          time: "10:00 ص",
        },
        {
          status: "تم تجهيز الطلب",
          date: "11 يناير 2025",
          time: "11:30 ص",
        },
        {
          status: "جاري الشحن",
          date: "12 يناير 2025",
          time: "09:00 ص",
        },
      ],
    },
    {
      id: "ORD-000843",
      customer: "فاطمة محمد",
      city: "الجيزة",
      price: 250,
      status: "قيد التنفيذ",
      statusClass: "pending",
      phone: "201098765432+",
      address: "شارع الهرم، الجيزة",
      item: "فستان سهرة",
      deliveryDate: "18 يناير 2025 م 06:00 م",
      deliveryMan: "سارة محمود",
      weight: "0.8 كجم",
      generalInfo: {
        totalPrice: "250 جنيه",
        deliveryFee: "50 جنيه",
        packagingFee: "20 جنيه",
      },
      extraInfo: {
        extraWeight: "0 كجم",
        percentage: "2.5 جنيه",
      },
      orderHistory: [
        {
          status: "تم إنشاء الطلب",
          date: "12 يناير 2025",
          time: "02:00 م",
        },
        {
          status: "قيد التنفيذ",
          date: "13 يناير 2025",
          time: "03:00 م",
        },
      ],
    },
    {
      id: "ORD-000844",
      customer: "خالد حسن",
      city: "القاهرة",
      price: 800,
      status: "تم التسليم",
      statusClass: "success",
      phone: "201122334455+",
      address: "مدينة نصر، القاهرة",
      item: "مجموعة أدوات منزلية",
      deliveryDate: "15 يناير 2025 م 02:00 م",
      deliveryMan: "أحمد علي",
      weight: "5.0 كجم",
      generalInfo: {
        totalPrice: "800 جنيه",
        deliveryFee: "120 جنيه",
        packagingFee: "70 جنيه",
      },
      extraInfo: {
        extraWeight: "0.5 كجم",
        percentage: "8 جنيه",
      },
      orderHistory: [
        {
          status: "تم إنشاء الطلب",
          date: "08 يناير 2025",
          time: "09:00 ص",
        },
        {
          status: "تم الشحن",
          date: "09 يناير 2025",
          time: "10:00 ص",
        },
        {
          status: "تم التسليم",
          date: "15 يناير 2025",
          time: "02:00 م",
        },
      ],
    },
  ];

  const handleOrderClick = (order) => {
    setSelectedOrder(
      selectedOrder && selectedOrder.id === order.id ? null : order
    );
  };

  return (
    <div className="dashboard container-fluid py-3">
      {/* مؤشرات الأداء */}
      <h4 className="m-3 text-end">مؤشرات الأداء</h4>
      <div className="row g-3 mb-4 dashboard-cards-container ">
        {/* تحتاج متابعة */}
        <div className="col-lg-3 col-md-6 col-12 dashboard-card-wrapper">
          <div className="card performance-card danger border-1 p-3 h-100">
            <div className="d-flex justify-content-between align-items-start">
              <HiArrowTrendingUp className="sparkline-icon" />
              <BiError className="card-icon danger" />
            </div>
            <h2 className="mb-0">7</h2>
            <p className="card-title">تحتاج متابعة</p>
            <p className="card-subtitle">30 من أمس</p>
          </div>
        </div>

        {/* طلب جديد */}
        <div className="col-lg-3 col-md-6 col-12 dashboard-card-wrapper">
          <div className="card performance-card warning p-3 h-100">
            <div className="d-flex justify-content-between align-items-start">
              <HiArrowTrendingUp className="sparkline-icon" />
              <BiTimeFive className="card-icon warning" />
            </div>
            <h2 className="mb-0">23</h2>
            <p className="card-title">طلب جديد</p>
            <p className="card-subtitle">طبيعي</p>
          </div>
        </div>

        {/* طلبات ناجحة */}
        <div className="col-lg-3 col-md-6 col-12 dashboard-card-wrapper">
          <div className="card performance-card success p-3 h-100">
            <div className="d-flex justify-content-between align-items-start">
              <HiArrowTrendingUp className="sparkline-icon" />
              <BiCheckCircle className="card-icon success" />
            </div>
            <h2 className="mb-0">98%</h2>
            <p className="card-title">طلبات ناجحة</p>
            <p className="card-subtitle">+2% من الأسبوع الماضي</p>
          </div>
        </div>

        {/* طلب إجمالي */}
        <div className="col-lg-3 col-md-6 col-12 dashboard-card-wrapper">
          <div className="card performance-card primary p-3 h-100">
            <div className="d-flex justify-content-between align-items-start">
              <HiArrowTrendingUp className="sparkline-icon" />
              <BsBoxSeam className="card-icon primary" />
            </div>
            <h2 className="mb-0">1,234</h2>
            <p className="card-title">طلب إجمالي</p>
            <p className="card-subtitle">+12 من أمس</p>
          </div>
        </div>
      </div>

      {/* حالة الطلبات */}
      <h4 className="mb-3 text-end">حالة الطلبات</h4>
      <div className="row g-3 mb-4 dashboard-cards-container">
        <div className="col-lg-3 col-md-6 col-12 dashboard-card-wrapper">
          <div className="card status-card orange p-3 h-100">
            <div className="d-flex justify-content-between align-items-start">
              <h2 className="mb-0">12</h2>
              <BiTimeFive className="card-icon warning" />
            </div>
            <p className="card-title">قيد المعالجة</p>
            <p className="card-subtitle">قيد التنفيذ</p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-12 dashboard-card-wrapper">
          <div className="card status-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-start">
              <h2 className="mb-0">89</h2>
              <BiCheckCircle className="card-icon success" />
            </div>
            <p className="card-title">اليوم</p>
            <p className="card-subtitle">تم التسليم</p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-12 dashboard-card-wrapper">
          <div className="card status-card purple p-3 h-100">
            <div className="d-flex justify-content-between align-items-start">
              <h2 className="mb-0">34</h2>
              <BsBoxSeam className="card-icon ready" />
            </div>
            <p className="card-title">جاهز للإخراج</p>
            <p className="card-subtitle">موجود بالفرع</p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-12 dashboard-card-wrapper">
          <div className="card status-card blue p-3 h-100">
            <div className="d-flex justify-content-between align-items-start">
              <h2 className="mb-0">15</h2>
              <BsBoxSeam className="card-icon primary" />
            </div>
            <p className="card-title">مع المندوبين</p>
            <p className="card-subtitle">جاري التوصيل</p>
          </div>
        </div>
      </div>

      {/* Orders Section and Sidebar Container */}
      <div className="orders-main-content">
        <div className="orders-section-wrapper">
          <h4 className="mb-3 text-end">الطلبات</h4>
          <div className="orders-list">
            {orders.map((order) => (
              <div
                className={`order-card ${
                  selectedOrder && selectedOrder.id === order.id
                    ? "selected"
                    : ""
                }`}
                key={order.id}
                onClick={() => handleOrderClick(order)}
              >
                <div className="order-actions">
                  <div className="order-info">

                  </div>
                  <button>
                    <FaEdit />
                  </button>
                  <button>
                    <FaPrint />
                  </button>
                      <div className="order-location">
                      <span>{order.city}</span>
                      <p>{order.price} جنيه</p>
                    </div>
                    <span className={`status ${order.statusClass}`}>
                      {order.status}
                    </span>
                </div>
                <div className="order-details">
                  <span className="order-id">{order.id}</span>
                  <p>{order.customer}</p>
                </div>

              </div>
            ))}
          </div>
        </div>

        {selectedOrder && (
          <div className="order-sidebar">
            <div className="sidebar-header">
              <span className="sidebar-order-id">{selectedOrder.id}</span>
              <button
                className="close-sidebar"
                onClick={() => setSelectedOrder(null)}
              >
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
                  <span>رقم الهاتف:</span> {selectedOrder.phone ?? "غير متوفر"}
                </li>
                <li>
                  <span>العنوان الكامل:</span>{" "}
                  {selectedOrder.address ?? "غير متوفر"}
                </li>
                <li>
                  <span>محتوى الطلب:</span> {selectedOrder.item ?? "غير متوفر"}
                </li>
              </ul>

              <h4>الشحن و الجدولة</h4>
              <ul>
                <li>
                  <span>موعد التسليم:</span>{" "}
                  {selectedOrder.deliveryDate ?? "غير محدد"}
                </li>
                <li>
                  <span>المندوب المعين:</span>{" "}
                  {selectedOrder.deliveryMan ?? "غير محدد"}
                </li>
                <li>
                  <span>الوزن:</span> {selectedOrder.weight ?? "غير محدد"}
                </li>
              </ul>

              <h4>المعلومات المالية</h4>
              <ul>
                <li>
                  <span>قيمة التحصيل:</span>{" "}
                  {selectedOrder.generalInfo?.totalPrice ?? "غير متوفر"}
                </li>
                <li>
                  <span>قيمة الشحن:</span>{" "}
                  {selectedOrder.generalInfo?.deliveryFee ?? "غير متوفر"}
                </li>
                <li>
                  <span>قيمة التوريد:</span>{" "}
                  {selectedOrder.generalInfo?.packagingFee ?? "غير متوفر"}
                </li>
              </ul>

              <h4>المبالغ الاضافية</h4>
              <ul>
                <li>
                  <span>وزن زائد:</span>{" "}
                  {selectedOrder.extraInfo?.extraWeight ?? "غير متوفر"}
                </li>
                <li>
                  <span>نسبة تحصيل (1%):</span>{" "}
                  {selectedOrder.extraInfo?.percentage ?? "غير متوفر"}
                </li>
              </ul>

              <h4>تاريخ الطلب</h4>
              <ul className="order-history-list">
                {selectedOrder.orderHistory?.map((entry, index) => (
                  <li key={index}>
                    <div className="history-dot"></div>
                    <div>
                      <p>{entry.status}</p>
                      <span>
                        {entry.date} - {entry.time}
                      </span>
                    </div>
                  </li>
                )) ?? <p>لا يوجد تاريخ للطلب</p>}
              </ul>
            </div>
            <div className="sidebar-footer">
              <button className="confirm-order-btn">
                <span className="icon">
                  <FaPrint />
                </span>{" "}
                طباعة بوليصة الشحن
              </button>
              <button className="edit-order-btn">
                <span className="icon-edit">
                  <FaEdit />
                </span>{" "}
                تعديل الطلب
              </button>
              <button className="cancel-order-btn">
                <span className="icon">
                  <MdOutlineCancel />
                </span>{" "}
                إلغاء الطلب
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HangerOrders;


