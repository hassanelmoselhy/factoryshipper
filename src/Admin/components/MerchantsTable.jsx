import React from "react";
import { Phone } from "lucide-react";
import "./css/MerchantsTable.css"; // updated CSS below

// sample data (replace with props or fetch)
const sampleData = [
  {
    merchantNumber: "MER-0001",
    merchantName: "أحمد علي محمد",
    tradeName: "متجر أحمد للرياضة",
    activity: "رياضة ولياقة",
    location: "القاهرة - المعادي",
    phone: "+201123456789",
    totalSales: 125000,
    ordersCount: 124,
    fulfillmentRate: 0.98,
    accountStatus: "نشط",
    joinDate: "2025/05/01",
  },
  {
    merchantNumber: "MER-0002",
    merchantName: "فاطمة حسن",
    tradeName: "بوتيك فاطمة للأزياء",
    activity: "ملابس وأزياء",
    location: "الإسكندرية - سموحة",
    phone: "+201234567890",
    totalSales: 98000,
    ordersCount: 89,
    fulfillmentRate: 0.95,
    accountStatus: "نشط",
    joinDate: "2025/04/15",
  },
  {
    merchantNumber: "MER-0003",
    merchantName: "محمد عبدالله",
    tradeName: "إلكترونيات المستقبل",
    activity: "إلكترونيات",
    location: "الجيزة - المهندسين",
    phone: "+201145678901",
    totalSales: 215000,
    ordersCount: 156,
    fulfillmentRate: 0.97,
    accountStatus: "نشط",
    joinDate: "2025/03/10",
  },
];

function formatCurrency(num) {
  return num.toLocaleString("ar-EG") + " ج.م";
}
function formatPercent(v) {
  return Math.round(v * 100) + "%";
}


export default function MerchantsTable({ data = sampleData, onCopyPhone }) {
  const handleCopy = (text) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
    }
    if (onCopyPhone) onCopyPhone(text);
  };

  return (
    <div className="merchant-table-container" dir="rtl">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="text-nowrap">رقم التاجر</th>
              <th className="text-nowrap">اسم التاجر</th>
              <th className="text-nowrap">الاسم التجاري</th>
              <th className="text-nowrap">النشاط التجاري</th>
              <th className="text-nowrap">الموقع</th>
              <th className="text-nowrap">رقم الهاتف</th>
              <th className="text-nowrap">إجمالي المبيعات</th>
              <th className="text-nowrap">عدد الطلبات</th>
              <th className="text-nowrap">نسبة التسليم</th>
              <th className="text-nowrap">حالة الحساب</th>
              <th className="text-nowrap">تاريخ الانضمام</th>
            </tr>
          </thead>

          <tbody>
            {data.map((m, idx) => (
              <tr key={m.merchantNumber ?? idx}>
                <td className="text-muted small">{m.merchantNumber}</td>

                <td style={{ minWidth: 160 }}>
                  <div className="d-flex align-items-center gap-2">
                    <a href="#" className="merchant-name text-decoration-none text-primary text-truncate">
                      {m.merchantName}
                    </a>
                  </div>
                </td>

                <td style={{ minWidth: 200 }}>
                  <div className="text-truncate">{m.tradeName}</div>
                </td>

                <td>
                  <span className="badge activity-badge border">{m.activity}</span>
                </td>

                <td>
                  <div className="small text-muted">{m.location}</div>
                </td>

                <td>
                  <div className="d-flex align-items-center gap-2">
                    <span className="small text-dark">{m.phone}</span>

                   
                      <Phone size={14} className="phone-icon" />
                    
                  </div>
                </td>

                <td>{formatCurrency(m.totalSales)}</td>

                <td className="fw-semibold">{m.ordersCount}</td>

                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div className="percent-pill">{formatPercent(m.fulfillmentRate)}</div>
                  </div>
                </td>

                <td>
                  <span className={`status-pill ${m.accountStatus === "نشط" ? "status-active" : "status-inactive"}`}>
                    {m.accountStatus}
                  </span>
                </td>

                <td className="small text-muted">{m.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
