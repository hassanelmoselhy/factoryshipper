import React from "react";

/**
 * Status badge component
 * accepts `status` string (as returned by API)
 * outputs an element with class oc-status oc-status--{slug}
 */

const statusMap = {
  NewShipment: { label: "شحنه جديده", slug: "new-shipment" },
  InTransit: { label: "قيد التوصيل", slug: "in-transit" },
  Delivered: { label: "تم التوصيل", slug: "delivered" },
  Cancelled: { label: "ملغي", slug: "cancelled" },
  Canceled: { label: "ملغي", slug: "canceled" }, // handle both spellings
  Returned: { label: "تم الإرجاع", slug: "returned" },
  Exchanged: { label: "تم الاستبدال", slug: "exchanged" },
  InWarehouse: { label: "في المخزن", slug: "in-warehouse" },
  PickedUp: { label: "تم الالتقاط", slug: "picked-up" },

  InReviewForPickup: { label: "قيد المراجعة للالتقاط", slug: "in-review-pickup" },
  InReviewForReturn: { label: "قيد المراجعة للإرجاع", slug: "in-review-return" },
  InReviewForDelivery: { label: "قيد المراجعة للتوصيل", slug: "in-review-delivery" },
  InReviewForCancellation: { label: "قيد المراجعة للإلغاء", slug: "in-review-cancel" },
  InReviewForExchange: { label: "قيد المراجعة للاستبدال", slug: "in-review-exchange" },

  WaitingForPickup: { label: "بانتظار الالتقاط", slug: "waiting-pickup" },
  WaitingForReturn: { label: "بانتظار الإرجاع", slug: "waiting-return" },
  WaitingForExchange: { label: "بانتظار الاستبدال", slug: "waiting-exchange" },
  WaitingForDelivery: { label: "بانتظار التوصيل", slug: "waiting-delivery" },

  OutForDelivery: { label: "خارج للتسليم", slug: "out-for-delivery" },
  ReturningToWarehouse: { label: "في الطريق للعودة للمخزن", slug: "returning-warehouse" },
  ReturningToShipper: { label: "في الطريق للعودة للمرسل", slug: "returning-shipper" },

  OnHold: { label: "معلق", slug: "on-hold" },
  FailedDelivery: { label: "فشل التوصيل", slug: "failed-delivery" },
  Lost: { label: "ضائع", slug: "lost" },
  Damaged: { label: "تالف", slug: "damaged" },
};

const toSlug = (s) =>
  s
    ? s
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-zA-Z0-9\-]/g, "")
        .toLowerCase()
    : "unknown";

export default function StatusBadge({ status }) {
  const info = statusMap[status] || { label: status || "غير معروف", slug: toSlug(status) || "unknown" };
  return <div className={`oc-status oc-status--${info.slug}`}>{info.label}</div>;
}
