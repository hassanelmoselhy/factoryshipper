import React from "react";
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
} from "lucide-react";
import "../../Sender/pages/css/Orders2.css"; // adjust path if needed
import { formatCurrency, formatDate } from "../../utils/Helpers"
import StatusBadge from "../../Shared/StatusBadge";
import { toast } from "sonner";

export default function OrderCard({ order, onEdit, onPrint, onDelete, onView }) {
  const navigate = useNavigate();

  const status = (order.latestShipmentStatus || {}).status || "Pending";

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

        <div className="oc-number">
          <div className="oc-number__label">#{order.id}</div>
          <div className="oc-number__name">{order.customerName}</div>
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
        <div className="oc-actions-left">
          <button
            className="oc-icon-btn"
            title="حذف"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(order.id);
            }}
          >
            <Trash2 />
          </button>

          <button
            className="oc-icon-btn"
            title="طباعة"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/print/${order.id}`);
            }}
          >
            <Printer />
          </button>

          <button
            className="oc-icon-btn"
            title="تعديل"
            onClick={(e) => {
              e.stopPropagation();
              // onEdit(order.id);
              toast.info("this feature will be available soon,you can use it in order details page")
            }}
          >
            <Edit />
          </button>
        </div>

        <div className="oc-actions-right">
          <button className="oc-primary" onClick={() => onView(order.id)}>
            <Eye className="me-2" /> عرض التفاصيل
          </button>
        </div>
      </div>
    </article>
  );
}
