import React, { useEffect, useState } from "react";
import "./css/Order.css";
import { Link } from "react-router-dom";
import useLanguageStore from "../../Store/LanguageStore/languageStore";
import translations from "../../Store/LanguageStore/translations";

// 🎨 ألوان الـ Status
const statusColors = {
  delivered: "green",         // تم التوصيل / Delivered
  customerProduct: "blue",    // منتج للعميل / Customer Product
  inProgress: "yellow",       // قيد التنفيذ / In Progress
  waitingDecision: "orange",  // انتظار القرار / Pending Decision
};

// 🎨 ألوان نوع الطلب
const typeColors = {
  fast: "purple", // سريع
  normal: "gray", // عادي
};

// ✅ بيانات احتياطية (مفتاح ثابت بدل النصوص)
const fallbackOrders = [
  {
    id: 842,
    statusKey: "delivered",
    typeKey: "fast",
    name: "أحمد محمد",
    phone: "0551234567",
    address: "الرياض، حي الزهري",
    date: "2024-01-15",
    time: "14:30",
    price: 45,
  },
  {
    id: 841,
    statusKey: "customerProduct",
    typeKey: "normal",
    name: "فاطمة علي",
    phone: "0559876543",
    address: "جدة، حي الأزهراء",
    date: "2024-01-15",
    time: "12:15",
    price: 35,
  },
  {
    id: 840,
    statusKey: "inProgress",
    typeKey: "fast",
    name: "محمد سالم",
    phone: "0551112233",
    address: "الدمام، حي الفيصلية",
    date: "2024-01-15",
    time: "10:45",
    price: 25,
  },
  {
    id: 839,
    statusKey: "waitingDecision",
    typeKey: "normal",
    name: "نورا أحمد",
    phone: "0554445556",
    address: "مكة، حي العزيزية",
    date: "2024-01-14",
    time: "16:20",
    price: 50,
  },
];

// ✅ Tabs الأساسية
const tabKeys = ["all", "delivered", "customerProduct", "inProgress", "waitingDecision"];

const Order = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang];

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://stakeexpress.runasp.net/api/Shipment/GetAllShipments");
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();

        // ⚡ لازم هنا تتأكد إن الـ API بيرجع statusKey / typeKey مش نصوص
        // لو بيرجع نصوص لازم تعمل mapping هنا
        setOrders(data);
      } catch (error) {
        console.warn("Using fallback orders due to error:", error.message);
        setOrders(fallbackOrders);
      }
    };

    fetchOrders();
  }, []);

  // ✅ فلترة الأوردرات
  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.statusKey === activeTab;

    const matchesSearch =
      order.name.includes(searchTerm) ||
      order.phone.includes(searchTerm) ||
      order.id.toString().includes(searchTerm);

    return matchesTab && matchesSearch;
  });

  return (
<div className="order-page" dir={lang === "ar" ? "rtl" : "ltr"}>      {/* ✅ العنوان والبحث */}
      <div className="order-header">
        <h2>{t.orders}</h2>
        <input
          type="text"
          placeholder={t.searchOrder}
          className="order-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ✅ Tabs */}
      <div className="order-tabs">
        {tabKeys.map((key) => (
          <button
            key={key}
            className={`tab ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            {t[key]} (
              {
                orders.filter((o) =>
                  key === "all" ? true : o.statusKey === key
                ).length
              }
            )
          </button>
        ))}
      </div>

      {/* ✅ قائمة الأوردرات */}
      <div className="order-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Link to={`/order-details/${order.id}`} key={order.id} className="order-card">
              <div className="order-card-header">
                <span className="order-id">#{order.id}</span>
                <span
                  className="status-badge"
                  style={{ backgroundColor: statusColors[order.statusKey] }}
                >
                  {t.statusMap[order.statusKey][lang]}
                </span>
                <span
                  className="type-badge"
                  style={{ backgroundColor: typeColors[order.typeKey] }}
                >
                  {t.typeMap[order.typeKey][lang]}
                </span>
              </div>

              <div className="order-info">
                <p>{t.client}: {order.name}</p>
                <p>{t.phone}: {order.phone}</p>
                <p>{t.address}: {order.address}</p>
                <p>{t.date}: {order.date} - {order.time}</p>
              </div>

              <div className="order-footer">
                <span className="order-price">{order.price} ر.س</span>
                <div className="order-options">
                  <span 
                    className="options-btn"
                    onClick={(e) => { e.preventDefault(); setOpenMenuId(openMenuId === order.id ? null : order.id); }}
                  >
                    ⋮
                  </span>
                  {openMenuId === order.id && (
                    <div className="options-menu">
                      <button>{t.postpone}</button>
                      <button>{t.redeliver}</button>
                      <button>{t.editData}</button>
                      <button>{t.printPolicy}</button>
                      <button className="danger">{t.cancel}</button>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "30px", color: "#888" }}>
            {t.noOrders}
          </p>
        )}
      </div>
    </div>
  );
};

export default Order;
