import React from 'react';
import './css/OrdersTableItem.css';
import { Eye } from 'lucide-react';

const OrdersTableItem = ({ order, onViewDetails }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'ملغي':
        return 'ملغي';
      case 'في الانتظار':
        return 'في-الانتظار';
      case 'في الطريق':
        return 'في-الطريق';
      case 'تم التسليم':
        return 'تم-التسليم';
      default:
        return '';
    }
  };

  const getRiderContent = (order) => {
    if (!order.rider) {
      return <span className="no-rider">لا يوجد</span>;
    } else {
      return (
        <div className="rider-info">
          <span>{order.rider}</span>
          {order.riderId && <span className="rider-id">{order.riderId}</span>}
        </div>
      );
    }
  };

  return (
    <div className="table-row">
      <div className="cell-content order-id">{order.id}</div>

      <div className="cell-content merchant">
        <div className="merchant-info">
          <span>{order.merchant.name}</span>
          <span className="merchant-id">{order.merchant.id}</span>
        </div>
      </div>

      <div className="cell-content customer-name">
        <span>{order.customer.name}</span>
      </div>

      <div className="cell-content customer-phone">
        <span>{order.customer.phone}</span>
      </div>

      <div className="cell-content route">{order.route}</div>

      <div className="cell-content status">
        <span className={`status-badge ${getStatusClass(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="cell-content rider">
        {getRiderContent(order)}
      </div>

      <div className="cell-content cod-amount">
        {order.codAmount === '0' || order.codAmount === 'N/A' ? 'N/A' : `EGP ${order.codAmount}`}
      </div>

      <div className="cell-content eta">{order.eta}</div>

      <div className="cell-content actions">
        <button className="details-btn" onClick={() => onViewDetails(order)}>
          <Eye  className='icon'/>عرض التفاصيل
        </button>
      </div>
    </div>
  );
};

export default OrdersTableItem;
