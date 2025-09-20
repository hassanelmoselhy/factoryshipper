import React, { useEffect, useState } from 'react';
import './css/Order.css';
import { Link } from 'react-router-dom';
import useUserStore from '../../Store/UserStore/userStore';
import {  toast } from "sonner";
import useShipmentsStore from '../../Store/UserStore/ShipmentsStore';
import LoadingOverlay from '../components/LoadingOverlay';
const fallbackOrders = [
  {
    id: 842,
    status: 'تم التوصيل',
    type: 'سريع',
    name: 'أحمد محمد',
    phone: '0551234567',
    address: 'الرياض، حي الزهري',
    date: '2024-01-15',
    time: '14:30',
    price: 45,
  },
  {
    id: 841,
    status: 'منتج للعميل',
    type: 'عادي',
    name: 'فاطمة علي',
    phone: '0559876543',
    address: 'جدة، حي الأزهراء',
    date: '2024-01-15',
    time: '12:15',
    price: 35,
  },
  {
    id: 840,
    status: 'قيد التنفيذ',
    type: 'سريع',
    name: 'محمد سالم',
    phone: '0551112233',
    address: 'الدمام، حي الفيصلية',
    date: '2024-01-15',
    time: '10:45',
    price: 25,
  },
  {
    id: 839,
    status: 'انتظار القرار',
    type: 'عادي',
    name: 'نورا أحمد',
    phone: '0554445556',
    address: 'مكة، حي العزيزية',
    date: '2024-01-14',
    time: '16:20',
    price: 50,
  },
];

const tabs = ['الكل', 'تم التوصيل', 'منتج للعميل', 'قيد التنفيذ', 'انتظار القرار'];
/**
 id
 name
 phone
  address
  date
  price
 */
const Order = () => {

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null); 
  const user = useUserStore((state) => state.user);
  const [Shipments, setShipments] = useState([]); // New state for shipments
  const SetShipmentsStore = useShipmentsStore((state) => state.SetShipments);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setOrders(fallbackOrders);
    if (!user) {
  toast.error('Unauthorized,login first');
return;
  }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://stakeexpress.runasp.net/api/Shipments/getShipments',{
          method:'GET',   
            headers:{
            'Content-Type': 'application/json',
            'X-Client-Key': 'web API',
            'Authorization': `Bearer ${user.token}`
        }});
        if(res.status===200){
          const data = await res.json();
          console.log("Fetched orders:", data);
          data.data.forEach(shipment => {
            shipment.receiverAddress=shipment.receiverAddress.country+" - "+shipment.receiverAddress.city+" - "+shipment.receiverAddress.street+" - "+shipment.receiverAddress.details;
            console.log("Shipment add:", shipment.receiverAddress);

          })
          console.log("Processed shipments:", data.data);
          
          setShipments(data.data);
          SetShipmentsStore(data.data);
        }
        // setOrders(data);
      } catch (error) {
        console.log('Using fallback orders due to error:', error.message);
        
      }finally{
        setLoading(false);
      }
    
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'الكل' || order.status === activeTab;
    const matchesSearch =
      order.name.includes(searchTerm) ||
      order.phone.includes(searchTerm) ||
      order.id.toString().includes(searchTerm);

    return matchesTab && matchesSearch;
  });

  const handleMenuToggle = (e, id) => {
    e.preventDefault();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
      <>
      <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />
    <div className="order-page">
      <div className="order-header">
        <h2>الطلبات</h2>
        <input
          type="text"
          placeholder="ابحث برقم الطلب أو اسم العميل..."
          className="order-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="order-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} (
              {
                orders.filter((o) =>
                  tab === 'الكل' ? true : o.status === tab
                ).length
              }
            )
          </button>
        ))}
      </div>

      <div className="order-list">
        {Shipments.length > 0 ? (
          Shipments.map((order) => (
            <Link to={`/order-details/${order.id}`} key={order.id} className="order-card">
              <div className="order-card-header">
                <span className="order-id">#{order.id}</span>
                <span className={`status-badge  Shipmentstatuscolor`}>{order.shipmentStatuses[0].status}</span>
                <span className={`type-badge  Shipmentstatuscolor` }>{order.expressDeliveryEnabled===false? "normal":"Fast"}</span>
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
                    onClick={(e) => handleMenuToggle(e, order.id)}
                  >
                    ⋮
                  </span>
                  {openMenuId === order.id && (
                    <div className="options-menu">
                      <button>تأجيل الأوردر</button>
                      <button>إعادة توصيل الأوردر</button>
                      <button>تعديل البيانات</button>
                      <button>طباعة بوليسة</button>
                      <button className="danger">إلغاء</button>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p style={{ textAlign: 'center', marginTop: '30px', color: '#888' }}>لا توجد طلبات مطابقة</p>
        )}













        {/* {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Link to={`/order-details/${order.id}`} key={order.id} className="order-card">
              <div className="order-card-header">
                <span className="order-id">#{order.id}</span>
                <span className={`status-badge ${order.status}`}>{order.status}</span>
                <span className={`type-badge ${order.type}`}>{order.type}</span>
              </div>
              <div className="order-info">
                <p>العميل: {order.name}</p>
                <p>الهاتف: {order.phone}</p>
                <p>العنوان: {order.address}</p>
                <p>التاريخ: {order.date} - {order.time}</p>
              </div>
              <div className="order-footer">
                <span className="order-price">{order.price} ر.س</span>
                
                <div className="order-options">
                  <span 
                    className="options-btn"
                    onClick={(e) => handleMenuToggle(e, order.id)}
                  >
                    ⋮
                  </span>
                  {openMenuId === order.id && (
                    <div className="options-menu">
                      <button>تأجيل الأوردر</button>
                      <button>إعادة توصيل الأوردر</button>
                      <button>تعديل البيانات</button>
                      <button>طباعة بوليسة</button>
                      <button className="danger">إلغاء</button>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p style={{ textAlign: 'center', marginTop: '30px', color: '#888' }}>لا توجد طلبات مطابقة</p>
        )} */}
      </div>
    </div>
    </>
  );
};

export default Order;
