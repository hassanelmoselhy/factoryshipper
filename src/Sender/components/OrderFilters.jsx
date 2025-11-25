import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { statusOptions } from "../../Shared/Constants";
import "./css/OrderFilters.css";

/* ---------- searchBy options ---------- */
export const SEARCH_BY_OPTIONS = [
  { value: "Id", label: "معرف الشحنه" },
  { value: "CustomerName", label: "اسم العميل" },
  { value: "CustomerPhone", label: "رقم الهاتف" },
  { value: "ShipmentDescription", label: "محتوى الشحنة" },
];

/* -------------------------
   OrderFilters component (with custom dropdown + internal dropdown search)
   ------------------------- */
const OrderFilters = ({
  searchQuery,
  onSearchChange,
  searchBy,
  onSearchByChange,
  selectedStatuses,
  onStatusToggle,
  codOnly,
  onCodToggle,
  expressOnly,
  onExpressToggle,
  onClearFilters,
  pageSize,
  onPageSizeChange,
}) => {
  const [open, setOpen] = useState(false);
  const activeCount = selectedStatuses.length + (codOnly ? 1 : 0) + (expressOnly ? 1 : 0);

  // dropdown internal state (for custom dropdown)
  const ddRef = useRef(null);
  const [ddOpen, setDdOpen] = useState(false);
  const [ddFilter, setDdFilter] = useState("");

  // close dropdown when clicking outside
  useEffect(() => {
    function onDoc(e) {
      if (!ddRef.current) return;
      if (!ddRef.current.contains(e.target)) setDdOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // filtered options for dropdown
  const filteredSearchByOptions = useMemo(() => {
    const q = ddFilter.trim().toLowerCase();
    if (!q) return SEARCH_BY_OPTIONS;
    return SEARCH_BY_OPTIONS.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
  }, [ddFilter]);

  const currentSearchByLabel = () => {
    const found = SEARCH_BY_OPTIONS.find((o) => o.value === searchBy);
    return found ? found.label : searchBy;
  };

  return (
    <div className="d-flex flex-column gap-2">
      <div className="d-flex gap-2 align-items-center">
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={() => setOpen((p) => !p)}
            type="button"
          >
            <Filter className="me-2" /> فلترة {activeCount > 0 && <span className="badge bg-secondary ms-2">{activeCount}</span>}
          </button>
          {open && (
            <div className="dropdown-menu dropdown-menu-end p-3 show filerList" style={{ minWidth: 220 }}>
              <div className="mb-2">
                <strong>الحالة</strong>
              </div>
              {statusOptions.map((opt) => (
                <div key={opt.value} className="form-check ">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedStatuses.includes(opt.value)}
                    onChange={() => onStatusToggle(opt.value)}
                    id={`st-${opt.value}`}
                  />
                  <label className="form-check-label" htmlFor={`st-${opt.value}`}>
                    {opt.label}
                  </label>
                </div>
              ))}

              <hr />
              <div className="mb-2">
                <strong>خيارات الشحن</strong>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={codOnly} onChange={onCodToggle} id="codOnly" />
                <label className="form-check-label" htmlFor="codOnly">
                  دفع عند الاستلام
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={expressOnly} onChange={onExpressToggle} id="expressOnly" />
                <label className="form-check-label" htmlFor="expressOnly">
                  شحن سريع
                </label>
              </div>

              <div className="mt-3 d-flex justify-content-between">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => { setOpen(false); }}>
                  إغلاق
                </button>
                <button className="btn btn-sm btn-secondary" onClick={() => { onClearFilters(); setOpen(false); }}>
                  مسح الفلاتر
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search by custom dropdown + input */}
        <div className="d-flex flex-grow-1 position-relative">
          <div className="custom-dropdown me-2" ref={ddRef}>
            <button
              type="button"
              className="custom-dropdown-toggle"
              onClick={() => setDdOpen((p) => !p)}
              aria-haspopup="listbox"
              aria-expanded={ddOpen}
            >
              <span className="custom-dropdown-label">{currentSearchByLabel()}</span>
              <ChevronDown className={`custom-dropdown-caret ${ddOpen ? "open" : ""}`} />
            </button>

            <div className={`custom-dropdown-menu ${ddOpen ? "show" : ""}`} role="listbox">
              <div style={{ maxHeight: 200, overflow: "auto", padding: "6px" }}>
                {filteredSearchByOptions.map((opt) => (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={searchBy === opt.value}
                    className={`custom-dropdown-item ${searchBy === opt.value ? "active" : ""}`}
                    onClick={() => {
                      onSearchByChange(opt.value);
                      setDdOpen(false);
                      setDdFilter("");
                    }}
                  >
                    {opt.label}
                  </div>
                ))}

                {filteredSearchByOptions.length === 0 && (
                  <div className="text-muted small p-2">لا توجد نتائج</div>
                )}
              </div>
            </div>
          </div>

          <div className="position-relative flex-grow-1">
            <Search className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="form-control pe-5"
              placeholder="ابحث"
              aria-label="Search value"
            />
          </div>
        </div>

        {/* page size select */}
        <div style={{ minWidth: 120 }}>
          <select className="form-select form-select-sm" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
            <option value={9}>عرض 9</option>
            <option value={18}>عرض 18</option>
            <option value={36}>عرض 36</option>
          </select>
        </div>
      </div>

      {(selectedStatuses.length > 0 || codOnly || expressOnly) && (
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <div className="small text-muted">الفلاتر النشطة:</div>
          {selectedStatuses.map((s) => {
            const label = statusOptions.find((o) => o.value === s)?.label || s;
            return (
              <span key={s} className="badge bg-secondary d-flex align-items-center gap-1">
                {label}
                <X className="ms-1" style={{ cursor: "pointer" }} onClick={() => onStatusToggle(s)} />
              </span>
            );
          })}
          {codOnly && (
            <span className="badge bg-secondary d-flex align-items-center gap-1">
              دفع عند الاستلام <X className="ms-1" style={{ cursor: "pointer" }} onClick={onCodToggle} />
            </span>
          )}
          {expressOnly && (
            <span className="badge bg-secondary d-flex align-items-center gap-1">
              شحن سريع <X className="ms-1" style={{ cursor: "pointer" }} onClick={onExpressToggle} />
            </span>
          )}
          <button className="btn btn-link btn-sm" onClick={onClearFilters}>
            مسح الكل
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderFilters;
