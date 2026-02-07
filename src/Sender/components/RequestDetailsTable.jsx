import React from 'react';
import { Link } from 'react-router-dom';
import { Hash, User, Phone, MapPin, DollarSign, Activity, BarChart2, Zap, Calendar, Package } from 'lucide-react';
import styles from './css/RequestDetailsTable.module.css';

export default function RequestDetailsTable({ shipments, head }) {
  return (
    <div className={styles['premium-table-wrapper']}>
      <div className={styles['table-title']}>
        <Package size={20} />
        {head}
      </div>

      <div className="table-responsive" style={{ overflow: 'visible' }}>
        <table className={styles['modern-table']}>
          <thead>
            <tr>
              <th>#</th>
              <th><Hash size={14} className="me-1" /> Order No</th>
              <th><Activity size={14} className="me-1" /> Type</th>
              <th><User size={14} className="me-1" /> Customer</th>
              <th><Phone size={14} className="me-1" /> Phone</th>
              <th><MapPin size={14} className="me-1" /> Location</th>
              <th><DollarSign size={14} className="me-1" /> Amount</th>
              <th><BarChart2 size={14} className="me-1" /> Status</th>
              <th>Attempts</th>
              <th><Zap size={14} className="me-1" /> Express</th>
              <th><Calendar size={14} className="me-1" /> Date</th>
            </tr>
          </thead>
          <tbody>
            {(shipments || []).map((p, idx) => (
              <tr key={p?.orderNumber || p?.id} className={styles['table-row']}>
                <td>{idx + 1}</td>
                <td>
                  <Link className={styles['order-link']} to={`/order-details/${p.orderNumber || p.id}`} title="View Details">
                    {p.orderNumber || p.id}
                  </Link>
                </td>
                <td><span className="text-secondary fw-semibold">{p.orderType || "-"}</span></td>
                <td><span className={styles['customer-name']}>{p.customer?.customerName || p.customerName || "-"}</span></td>
                <td><span className="text-muted fw-medium">{p.customer?.customerPhone || p.customerPhone || "-"}</span></td>
                <td>
                  <div className={styles['location-chip']}>
                    {p.customer?.customerAddress?.city || p.city || "-"}
                    {(p.customer?.customerAddress?.city || p.city) && (p.customer?.customerAddress?.governorate || p.governorate) ? ", " : ""}
                    {p.customer?.customerAddress?.governorate || p.governorate}
                  </div>
                </td>
                <td>
                  <span className={styles['amount-badge']}>
                    {p?.transactionCashAmount ?? p?.collectionCashAmount ?? p?.collectionAmount ?? 0} EGP
                  </span>
                </td>
                <td className={styles['status-badge-container']}>
                  <span className={`${styles['premium-status']} status-${(p.orderCurrentStatus || "Pending").toLowerCase()}`}>
                    {p.orderCurrentStatus || "Pending"}
                  </span>
                </td>
                <td><span className={styles['attempts-text']}>{p.fulfillmentAttempts ?? 0}/3</span></td>
                <td>
                  <span className={`${styles['express-indicator']} ${p.expressDeliveryEnabled ? styles['express-yes'] : styles['express-no']}`}>
                    {p.expressDeliveryEnabled ? <Zap size={12} fill="currentColor" /> : null}
                    {p.expressDeliveryEnabled ? "Yes" : "No"}
                  </span>
                </td>
                <td><span className={styles['date-text']}>{p?.createdAt?.split('T')[0] || "-"}</span></td>
              </tr>
            ))}
            {(shipments || []).length === 0 && (
              <tr>
                <td colSpan="11" className="text-center py-5 text-muted">
                  <div className="d-flex flex-column align-items-center gap-2">
                    <Package size={48} opacity={0.2} />
                    <span>No orders found in this request</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
