import React, { useEffect, useState,useMemo } from "react";
import "./css/Order.css";
import { Link } from "react-router-dom";
import useLanguageStore from "../../Store/LanguageStore/languageStore";
import translations from "../../Store/LanguageStore/translations";
import useUserStore from "../../Store/UserStore/userStore";
import { toast } from "sonner";
import useShipmentsStore from "../../Store/UserStore/ShipmentsStore";
import LoadingOverlay from "../components/LoadingOverlay";

// 🎨 ألوان الـ Status (للـ fallback فقط)
const statusColors = {
  delivered: "green",
  customerProduct: "blue",
  inProgress: "yellow",
  waitingDecision: "orange",
};

// 🎨 ألوان نوع الطلب (للـ fallback فقط)
const typeColors = {
  fast: "purple",
  normal: "gray",
};

// ✅ Tabs الأساسية (للـ fallback)
const tabKeys = ["all", "delivered", "customerProduct", "inProgress", "waitingDecision"];

const Order = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang];

  const [orders, setOrders] = useState([]);
  const [Shipments, setShipments] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useUserStore((state) => state.user);
  const SetShipmentsStore = useShipmentsStore((state) => state.SetShipments);

  useEffect(() => {
  

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

        if (res.ok===true ) {
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
        
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

    const filteredShipments = useMemo(() => {
    let list = Shipments || [];


    
    const q = searchTerm.trim().toLowerCase();
    if (q !== "") {
      list = list.filter((o) => {
        const idMatch = String(o.id).includes(q); 
        const nameMatch = (o.receiverName || "").toLowerCase().includes(q);
        const phoneMatch = (o.receiverPhone || "").toLowerCase().includes(q);
        const addressMatch = (o.receiverAddress || "").toLowerCase().includes(q);
        const priceMatch = String(o.collectionAmount).includes(q);
        return idMatch || nameMatch || phoneMatch || addressMatch|| priceMatch;
      });
    }

    return list;
  }, [Shipments, searchTerm]);

  return (
    <>
      <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />
      <div className="order-page" dir={lang === "ar" ? "rtl" : "ltr"}>
        {/* ✅ العنوان والبحث */}
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
                {orders.filter((o) => (key === "all" ? true : o.statusKey === key)).length}
              )
            </button>
          ))}
        </div>

        {/* ✅ قائمة الأوردرات */}
        <div className="order-list">
          {filteredShipments.length > 0 ? (
            filteredShipments.map((order) => (
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

                 
                </div>
              </Link>
            ))
          ) 
           : (
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
