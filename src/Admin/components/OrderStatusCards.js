import React from 'react';
import {
  XCircle,
  CheckCircle,
  Truck,
  Hourglass,
  Package,
} from 'lucide-react';
import './css/OrderStatusCards.css';

const OrderStatusCard = ({ icon: Icon, label, count, color }) => (
  <div className="status-card" style={{ '--card-color': color }}>
    <div className="card-content">
      <span className="card-label">{label}</span>
      <span className="card-count" style={{ color: color }}>{count}</span>
    </div>
    <div className="card-icon-wrapper">
      <Icon size={24} className="card-icon" style={{ color: color }} />
    </div>
  </div>
);

const OrderStatusCards = ({ statusCounts }) => {
  const cardsData = [
    {
      icon: Package,
      label: 'إجمالي الطلبات',
      count: statusCounts.total,
      color: '#6b7280', 
    },
      {
      icon: Hourglass,
      label: 'قيد الانتظار',
      count: statusCounts.pending,
      color: '#f97316', 
    },
    {
      icon: Truck,
      label: 'في مرحلة انتقالية',
      count: statusCounts.intransit,
      color: '#3b82f6',
    },
    {
      icon: CheckCircle,
      label: 'تم التوصيل',
      count: statusCounts.delivered,
      color: '#22c55e', 

    },
    {
      icon: XCircle,
      label: 'تم الإلغاء',
      count: statusCounts.canceled,
      color: '#ef4444', 
    },
  ];

  return (
    <div className="order-status-cards-container">
      {cardsData.map((card) => (
        <OrderStatusCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default OrderStatusCards;