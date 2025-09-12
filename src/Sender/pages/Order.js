import React, { useEffect, useState } from 'react';
import './css/Order.css';
import { Link } from 'react-router-dom';

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

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null); 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('https://stakeexpress.runasp.net/api/Shipment/GetAllShipments');
        if (!res.ok) throw new Error('Request failed');
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.warn('Using fallback orders due to error:', error.message);
        setOrders(fallbackOrders);
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
        {filteredOrders.length > 0 ? (
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
        )}
      </div>
    </div>
  );
};

export default Order;
