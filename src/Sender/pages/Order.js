import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useLanguageStore from "../../Store/LanguageStore/languageStore";
import translations from "../../Store/LanguageStore/translations";
import useUserStore from "../../Store/UserStore/userStore";
import { toast } from "sonner";
import useShipmentsStore from "../../Store/UserStore/ShipmentsStore";
import LoadingOverlay from "../components/LoadingOverlay";
import ShipmentCancelModal from "../../Components/ShipmentCancelModal";
import "./css/Order.css";

//  Status Options
const statusOptions = [
  "All",
  "Pending",
  "Canceled",
  "WatingForPickup",
  "PickedUp",
  "InWarehouse",
  "OnHold",
  "OutForDelivery",
  "FailedDelivery",
  "ReturningToWarehouse",
  "ReturningToShipper",
  "Delivered",
  "Returned",
  "Lost",
  "Damaged"
];

const Order = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang];

  const [orders, setOrders] = useState([]);
  const [Shipments, setShipments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const[opencancelShipment,setopencancelShipment]=useState(false)
  const user = useUserStore((state) => state.user);
  const SetShipmentsStore = useShipmentsStore((state) => state.SetShipments);

  useEffect(() => {
    console.log("User in Orders page ", user);

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

        if (res.ok === true) {
          const data = await res.json();
          console.log(data.data);
          setShipments(data.data);
          SetShipmentsStore(data.data);
        }
      } catch (error) {
        console.log("Using fallback orders due to error:", error.message);
      } finally {
        setLoading(false);
      }

    };

    fetchOrders();
  }, [user]);

  // Helper function to get count for each status
  const getStatusCount = (status) => {
    if (status === "All") return Shipments.length;
    return Shipments.filter(shipment => shipment.latestShipmentStatus?.status === status).length;
  };

  const filteredShipments = useMemo(() => {
    let list = Shipments || [];

    // Filter by selected status
    if (selectedStatus !== "All") {
      list = list.filter((shipment) => {
        const status = shipment.latestShipmentStatus?.status || "";
        return status === selectedStatus;
      });
    }

    // Filter by search term
    const q = searchTerm.trim().toLowerCase();
    if (q !== "") {
      list = list.filter((o) => {
        const idMatch = String(o.id).includes(q);
        const nameMatch = (o.receiverName || "").toLowerCase().includes(q);
        const phoneMatch = (o.receiverPhone || "").toLowerCase().includes(q);
        const priceMatch = String(o.collectionAmount).includes(q);
        return idMatch || nameMatch || phoneMatch || priceMatch;
      });
    }

    return list;
  }, [Shipments, selectedStatus, searchTerm]);

  return (
    <>
      <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />
    
      <ShipmentCancelModal show={opencancelShipment} onClose={()=>{setopencancelShipment(false)}}/>
      <div className="order-page" dir={lang === "ar" ? "rtl" : "ltr"}>
        {/* ✅ Header with Dropdown Filter and Search */}
        <div className="order-header">
          <h2>{t.orders}</h2>
          
          <div className="filter-search-container">
            {/* 🔽 Status Filter Dropdown */}
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="status-filter"
            >
              {statusOptions.map((key) => (
                <option key={key} value={key}>
                  {t[key] || key} ({getStatusCount(key)})
                </option>
              ))}
            </select>

            {/* 🔍 Search Input */}
            <input
              type="text"
              placeholder={t.searchOrder}
              className="order-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* ✅ Orders Count Info */}
        <div className="orders-info">
          <p>
            Showing {filteredShipments.length} of {Shipments.length} orders
            {selectedStatus !== "All" && ` • Filtered by: ${selectedStatus}`}
            {searchTerm && ` • Searching: "${searchTerm}"`}
          </p>
        </div>

        {/* ✅ قائمة الأوردرات */}
        <div className="order-list">
          {filteredShipments.length > 0 ? (
            filteredShipments.map((order) => (
              <Link to={`/order-details/${order.id}`} key={order.id} className="order-card">
                <div className="order-card-header">
                  <span className="order-id">#{order.id}</span>
                  <span className={`status-badge status-${order.latestShipmentStatus?.status?.toLowerCase() || 'default'}`}>
                    {order.latestShipmentStatus?.status}
                  </span>
                  <span className={`type-badge ${order.expressDeliveryEnabled ? 'type-fast' : 'type-normal'}`}>
                    {order.expressDeliveryEnabled ? "Fast" : "Normal"}
                  </span>
                </div>
                <div className="order-info">
                  <p>العميل: {order.customerName}</p>
                  <p>الهاتف: {order.customerPhone}</p>
                  <p>العنوان: {
                    order.customerAddress?.governorate +
                    " - " +
                    order.customerAddress?.city +
                    " - " +
                    order.customerAddress?.street +
                    " - " +
                    order.customerAddress?.details
                  }</p>
                  <p>التاريخ: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="order-footer">
                  <span className="order-price">{order.collectionAmount} ر.س</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-orders">
              <p>{t.noOrders}</p>
              {(selectedStatus !== "All" || searchTerm) && (
                <button 
                  className="clear-filters"
                  onClick={() => {
                    setSelectedStatus("All");
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Order;