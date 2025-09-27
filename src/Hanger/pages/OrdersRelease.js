import React from "react";
import { BsPrinter, BsBoxSeam, BsFillPersonFill , BsTruck  } from "react-icons/bs";
import "./css/OrdersRelease.css";

const OrderRelease = () => {
return (
    <div className="order-release">
    <div className="order-container">

        {/* Header Section */}
        <div className="header-container">
        <div className="header-actions">
            <button className="btn1">
            طباعة بوليصات
            <BsPrinter className="icon" />
            </button>
            <button className="btn2">
            معالجة الإخراج (0)
            <BsBoxSeam className="icon" />
            </button>
        </div>
        <h1 className="title">إخراج الأوردرات</h1>
        </div>

        {/* Orders Selection Section */}
        <div className="orders-section">
        <div className="checkbox">
            <label htmlFor="selectAllOrders">تحديد الكل (1 طلب)</label>
            <input type="checkbox" id="selectAllOrders" />
        </div>

        <div className="orders-card">
            <div className="order-info">
            <h5>كتب وقرطاسية</h5>
            <p>1.2 كجم . 250 جنيه</p>
            </div>
            <div className="order-data">
            <span className="badge">قيد التنفيذ</span>
            <div className="order-meta">
            <span className="order-id">ORD-000843</span>
            <span className="customer">فاطمة محمد • الجيزة</span>
            </div>
            <div className="actions">
            <input type="checkbox" id="selectOrder" />
            </div>

            </div>
        </div>
        </div>

    </div>

        {/* Latest Release Activity Section */}
        <div className="activity">
        <h2>نشاط الإخراج الأخير</h2>

        <div className="activity-card">
            <p className="date">١٥/٠٤/٢٠٢٣ ٠٤:٣٠:٠٠ م</p>
            <div className="activity-info">
            <div className="activity-details">
            <span className="batch">BATCH-001</span>
            <span className="desc">5 طلب إلى محمد أحمد (مندوب)</span>
            </div>
            <BsFillPersonFill  className="icon primary" />
            </div>
        </div>

        <div className="activity-card">
            <p className="date">١٥/٠٤/٢٠٢٣ ٠٣:٠٠:٠٠ م</p>
            <div className="activity-info">
            <div className="activity-details">
            <span className="batch">BATCH-002</span>
            <span className="desc">12 طلب إلى المقر الرئيسي</span>
            </div>
            <BsTruck  className="icon success" />
            </div>
        </div>
        </div>
    </div>
);
};

export default OrderRelease;
