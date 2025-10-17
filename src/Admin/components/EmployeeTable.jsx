import React from "react";
import {
  Mail,
  Phone,
  MoreVertical,
  CheckCircle,
  XCircle,
  Building2,
  User,
} from "lucide-react";
import "./css/EmployeeTable.css";

/** small helper formatters */
const sampleData = [
  {
    id: "EMP-001",
    name: "محمد أحمد",
    email: "m.ahmed@stakeexpress.com",
    phone: "201123456789+",
    roles: ["مدير هب", "مشاهد مالية"],
    units: [{ label: "هب", count: 1 }],
    lastLogin: "2025/07/01",
    status: "active",
  },
  {
    id: "EMP-002",
    name: "فاطمة محمود",
    email: "f.mahmoud@stakeexpress.com",
    phone: "201234567890+",
    roles: ["مدير النظام"],
    units: [{ label: "هيئات", count: 2 }],
    lastLogin: "2025/07/01",
    status: "active",
  },
  {
    id: "EMP-003",
    name: "أحمد سالم",
    email: "a.salem@stakeexpress.com",
    phone: "201345678901+",
    roles: ["موظف مخزن"],
    units: [{ label: "هب", count: 1 }],
    lastLogin: "2025/05/01",
    status: "inactive",
  },
];

export default function EmployeeTable({ data = sampleData }) {
  const copyToClipboard = async (text) => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        /* ignore */
      }
    }
  };

  return (
    <div
      className="employee-table-container"
      role="region"
      aria-label="قائمة الموظفين"
    >
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="col-actions">الإجراءات</th>
              <th className="col-status">الحالة</th>
              <th className="col-lastlogin">آخر دخول</th>
              <th className="col-units">الهئات المخصصة</th>
              <th className="col-roles">الأدوار</th>
              <th className="col-phone">الهاتف</th>
              <th className="col-email">البريد الإلكتروني</th>
              <th className="col-employee">الموظف</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                {/* actions */}
                <td className="text-nowrap">
                  <button
                    className="btn btn-sm btn-light action-btn"
                    aria-label="more actions"
                    title="المزيد"
                    onClick={() => {}}
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>

                {/* status */}
                <td>
                  {row.status === "active" ? (
                    <span className="status-pill status-active">
                      <CheckCircle size={12} className="me-1 status-icon" />
                      نشط
                    </span>
                  ) : (
                    <span className="status-pill status-inactive">
                      <XCircle size={4} className="me-1 status-icon" />
                      معطل
                    </span>
                  )}
                </td>

                {/* last login */}
                <td className="small text-muted">{row.lastLogin}</td>

                {/* units */}
                <td>
                  <div className="d-flex align-items-center gap-2">
                    {row.units?.map((u, i) => (
                      <div
                        key={i}
                        className="unit-pill d-flex align-items-center gap-1"
                      >
                        <span className="unit-text">
                          {u.count} {u.label}
                        </span>
                        <Building2 size={14} />
                      </div>
                    ))}
                  </div>
                </td>

                {/* roles */}
                <td>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {row.roles?.map((r, i) => (
                      <span key={i} className="role-badge">
                        {r}
                      </span>
                    ))}
                  </div>
                </td>

                {/* phone */}
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <span className="small phone-text">{row.phone}</span>

                    <Phone size={14} />
                  </div>
                </td>

                {/* email */}
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <a
                      href={`mailto:${row.email}`}
                      className="email-link text-truncate"
                    >
                      {row.email}
                    </a>
                    <Mail size={14} className="text-muted" />
                  </div>
                </td>

                {/* employee */}
                <td>
                  <div className="d-flex align-items-center gap-1">
                    <div className="employee-meta">
                      <div className="employee-name">{row.name}</div>
                      <div className="employee-id small text-muted">
                        {row.id}
                      </div>
                    </div>
                    <div className="avatar">
                      <User size={18} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
