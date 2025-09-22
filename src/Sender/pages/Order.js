import React, { useEffect, useState, useRef } from "react";
import "./css/Order.css";
import { Link } from "react-router-dom";
import useLanguageStore from "../../Store/LanguageStore/languageStore";
import translations from "../../Store/LanguageStore/translations";
import useUserStore from "../../Store/UserStore/userStore";
import { toast } from "sonner";
import useShipmentsStore from "../../Store/UserStore/ShipmentsStore";
import LoadingOverlay from "../components/LoadingOverlay";

const Order = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang];

  const [orders, setOrders] = useState([]);
  const [Shipments, setShipments] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menuPosition, setMenuPosition] = useState("bottom");

  const menuRef = useRef(null);

  const user = useUserStore((state) => state.user);
  const SetShipmentsStore = useShipmentsStore((state) => state.SetShipments);

  // ✅ حساب وضع المنيو (Top/Bottom)
  const toggleMenu = (id, e) => {
    e.preventDefault();
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 200) {
        setMenuPosition("top");
      } else {
        setMenuPosition("bottom");
      }
      setOpenMenuId(id);
    }
  };

  // 🎨 ألوان الـ Status (fallback فقط)
  const statusColors = {
    delivered: "green",
    customerProduct: "blue",
    inProgress: "yellow",
    waitingDecision: "orange",
  };

  // 🎨 ألوان نوع الطلب (fallback فقط)
  const typeColors = {
    fast: "purple",
    normal: "gray",
  };

  // ✅ بيانات احتياطية (fallback لو API فشل)
  const fallbackOrders = [
    { id: 842, statusKey: "delivered", typeKey: "fast", name: "أحمد محمد", phone: "0551234567", address: "الرياض، حي الزهري", date: "2024-01-15", time: "14:30", price: 45 },
    { id: 841, statusKey: "customerProduct", typeKey: "normal", name: "فاطمة علي", phone: "0559876543", address: "جدة، حي الأزهراء", date: "2024-01-15", time: "12:15", price: 35 },
    { id: 840, statusKey: "inProgress", typeKey: "fast", name: "محمد سالم", phone: "0551112233", address: "الدمام، حي الفيصلية", date: "2024-01-15", time: "10:45", price: 25 },
    { id: 839, statusKey: "waitingDecision", typeKey: "normal", name: "نورا أحمد", phone: "0554445556", address: "مكة، حي العزيزية", date: "2024-01-14", time: "16:20", price: 50 },
  ];

  const tabKeys = ["all", "delivered", "customerProduct", "inProgress", "waitingDecision"];

  useEffect(() => {
    setOrders(fallbackOrders);

    if (!user) {
      toast.error("Unauthorized, login first");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://stakeexpress.runasp.net/api/Shipments/getShipments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (res.status === 200) {
          const data = await res.json();
          data.data.forEach((shipment) => {
            shipment.receiverAddress =
              shipment.receiverAddress.country +
              " - " +
              shipment.receiverAddress.city +
              " - " +
              shipment.receiverAddress.street +
              " - " +
              shipment.receiverAddress.details;
          });

          setShipments(data.data);
          SetShipmentsStore(data.data);
        }
      } catch (error) {
        console.warn("Using fallback orders due to error:", error.message);
        setOrders(fallbackOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, SetShipmentsStore]);

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.statusKey === activeTab;
    const matchesSearch =
      order.name.includes(searchTerm) ||
      order.phone.includes(searchTerm) ||
      order.id.toString().includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  return (
    <>
      <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />
      <div className="order-page" dir={lang === "ar" ? "rtl" : "ltr"}>
        {/* العنوان والبحث */}
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

        {/* Tabs */}
        <div className="order-tabs">
          {tabKeys.map((key) => (
            <button
              key={key}
              className={`tab ${activeTab === key ? "active" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              {t[key]} (
                {orders.filter((o) => (key === "all" ? true : o.statusKey === key)).length}
              )
            </button>
          ))}
        </div>

        {/* قائمة الأوردرات */}
        <div className="order-list">
          {Shipments.length > 0 ? (
            Shipments.map((order) => (
              <Link to={`/order-details/${order.id}`} key={order.id} className="order-card">
                <div className="order-card-header">
                  <span className="order-id">#{order.id}</span>
                  <span className={`status-badge Shipmentstatuscolor`}>
                    {order.shipmentStatuses[0].status}
                  </span>
                  <span className={`type-badge Shipmentstatuscolor`}>
                    {order.expressDeliveryEnabled === false ? "Normal" : "Fast"}
                  </span>
                </div>
                <div className="order-info">
                  <p>العميل: {order.receiverName}</p>
                  <p>الهاتف: {order.receiverPhone}</p>
                  <p>العنوان: {order.receiverAddress}</p>
                  <p>التاريخ: {order.createdAt}</p>
                </div>
                <div className="order-footer">
                  <span className="order-price">{order.collectionAmount} ر.س</span>

                  <div className="order-options">
                    <span
                      className="options-btn"
                      onClick={(e) => toggleMenu(order.id, e)}
                    >
                      ⋮
                    </span>
                    {openMenuId === order.id && (
                      <div className={`options-menu ${menuPosition}`} ref={menuRef}>
                        <button
                          className="options-arrow left"
                          onClick={() => menuRef.current.scrollBy({ left: -100, behavior: "smooth" })}
                        >
                          ‹
                        </button>

                        <button>{t.deferOrder}</button>
                        <button>{t.redeliverOrder}</button>
                        <button>{t.editOrder}</button>
                        <button>{t.printPolicy}</button>
                        <button className="danger">{t.cancelOrder}</button>

                        <button
                          className="options-arrow right"
                          onClick={() => menuRef.current.scrollBy({ left: 100, behavior: "smooth" })}
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : filteredOrders.length > 0 ? (
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
    </>
  );
};

export default Order;
