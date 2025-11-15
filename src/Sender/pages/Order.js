import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useLanguageStore from "../../Store/LanguageStore/languageStore";
import translations from "../../Store/LanguageStore/translations";
import useUserStore from "../../Store/UserStore/userStore";
import { toast } from "sonner";
import useShipmentsStore from "../../Store/UserStore/ShipmentsStore";
import CancelRequestsModal from "../components/CancelRequestsModal";
import { useLocation } from "react-router-dom";
import api from "../../utils/Api";
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

 
  const [Shipments, setShipments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const user = useUserStore((state) => state.user);
  const SetShipmentsStore = useShipmentsStore((state) => state.SetShipments);
  const [iscancelModalOpen,setiscancelModalOpen]=useState(false)
const location = useLocation();
  const { state } = location;

  useEffect(() => {

      console.log('status is',state)
      if(state){
        setSelectedStatus(state)
      }
    if (!user) {
      toast.error("Unauthorized, login first");
      return;
    }

    const fetchOrders = async () => {
      try {

        // const response= await api.get('/Shipments')
        const response=await api.get('/Shipments')
        const result=response.data.data;
        console.log(response.data)
        
          
          console.log('result',result);
          setShipments(result);
          SetShipmentsStore(result);
        
      } catch (error) {
        const message=error.response.data.message||"";
        console.log("Using fallback orders due to error:", message);
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
        const nameMatch = (o.customerName || "").toLowerCase().includes(q);
        const phoneMatch = (o.customerPhone || "").toLowerCase().includes(q);
        const priceMatch = String(o.collectionAmount).includes(q);
        return idMatch || nameMatch || phoneMatch || priceMatch;
      });
    }

    return list;
  }, [Shipments, selectedStatus, searchTerm]);

  return (
    <>
      <CancelRequestsModal show={iscancelModalOpen} onClose={()=>setiscancelModalOpen(false)} />
      {/* <ShipmentCancelModal show={opencancelShipment} onClose={()=>{setopencancelShipment(false)}}/> */}
        
      <div className="order-page" dir={lang === "ar" ? "rtl" : "ltr"}>
        {/*  Header with Dropdown Filter and Search */}
        <div className="order-header">
          <h2>{t.orders}</h2>
          <div className="d-flex justify-content-between w-100 align-items-center">

         

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
          <button className="btn btn-danger" onClick={()=>setiscancelModalOpen(true)} >Cancel Shipments</button>

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
                    order?.governorate 
                  
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