import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Printer,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import "../../Sender/pages/css/Orders2.css"; // adjust path if needed
import { formatCurrency, formatDate } from "../../utils/Helpers"
import StatusBadge from "../../Shared/StatusBadge";
import { toast } from "sonner";

export default function OrderCard({ order, onEdit, onPrint, onDelete, onView }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const status = (order.latestShipmentStatus || {}).status || "Pending";

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownAction = (e, action) => {
    e.stopPropagation();
    setDropdownOpen(false);
    action();
  };

  return (
    <article className="order-card-2 h-100 d-flex flex-column">
      {/* status pill */}
      <StatusBadge status={status} />

      <div className="oc-top">
        <div className="oc-icon">
          <div className="oc-icon__bg">
            <Package />
          </div>
        </div>

          <div className="d-flex justify-content-between w-100">
            
         
        <div className="oc-number">
          <div className="oc-number__label">#{order.id}</div>
          <div className="oc-number__name">{order.customerName}</div>
        </div>

        {/* Dropdown Menu */}
        <div className="oc-dropdown-wrapper">
          <button
            className="oc-dropdown-trigger"
            onClick={toggleDropdown}
            title="المزيد من الخيارات"
          >
            <MoreHorizontal />
          </button>

          {dropdownOpen && (
            <>
              <div className="oc-dropdown-backdrop" onClick={() => setDropdownOpen(false)} />
              <div className="oc-dropdown-menu">
                <button
                  className="oc-dropdown-item"
                  onClick={(e) => handleDropdownAction(e, () => {
                    toast.info("this feature will be available soon, you can use it in order details page");
                  })}
                >
                  <Edit size={16} />
                  <span>تعديل</span>
                </button>
                <button
                  className="oc-dropdown-item"
                  onClick={(e) => handleDropdownAction(e, () => navigate(`/print/${order.id}`))}
                >
                  <Printer size={16} />
                  <span>طباعة</span>
                </button>
                <button
                  className="oc-dropdown-item oc-dropdown-item--danger"
                  onClick={(e) => handleDropdownAction(e, () => onDelete(order.id))}
                >
                  <Trash2 size={16} />
                  <span>حذف</span>
                </button>
              </div>
            </>
          )}
        </div>
      
       </div>
      </div>

      <div className="oc-info d-flex flex-column gap-3">
        <div className="oc-row">
          <div className="oc-item">
            <Phone className="oc-item-icon" />
            <div className="oc-item-text">{order.customerPhone}</div>
          </div>
          <div className="oc-item">
            <MapPin className="oc-item-icon" />
            <div className="oc-item-text">{order.city}{order.governorate ? `, ${order.governorate}` : ""}</div>
          </div>
        </div>

        <div className="oc-row">
          <div className="oc-item">
            <Calendar className="oc-item-icon" />
            <div className="oc-item-text">{formatDate(order.createdAt)}</div>
          </div>
          <div className="oc-item gap-3">
            <div className="oc-item-text oc-amount">{formatCurrency(order.collectionAmount)}</div>
          </div>
        </div>
      </div>

      <hr className="oc-divider border" />

      <div className="oc-desc">
        <p className="oc-desc__text text-center fw-bold">{order.shipmentDescription}</p>
      </div>

      {/* Badges: COD / Express */}
      <div className="oc-badges">
        {order.collectionAmount ? (
          <span className="oc-badge oc-badge--cod" title="دفع عند الاستلام">
            دفع عند الاستلام
          </span>
        ) : null}
        {order.expressDeliveryEnabled !== null && order.expressDeliveryEnabled !== undefined ? (
          order.expressDeliveryEnabled ? (
            <span className="oc-badge oc-badge--express" title="توصيل سريع">
              شحن سريع
            </span>
          ) : (
            <span className="oc-badge oc-badge--express" title="توصيل عادي">
              شحن عادي
            </span>
          )
        ) : null}
      </div>

      <div className="oc-actions mt-auto">
        <button className="oc-primary w-100" onClick={() => onView(order.id)}>
          <Eye className="me-2" /> عرض التفاصيل
        </button>
      </div>
    </article>
  );
}
