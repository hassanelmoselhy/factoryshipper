// src/Sender/pages/Orders2.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus, Download, Search, Filter, X } from "lucide-react";
import { statusOptions, egypt_governorates } from "../../Shared/Constants";
import { toast, Toaster } from "sonner";
import OrderCard from "../components/OrderCard";
import "./css/Orders2.css";
import api from "../../utils/Api";

/**
 * Helpers
 */
const normalizeStatus = (s) => {
  if (!s) return "Pending";
  if (s === "Cancelled") return "Canceled";
  return s;
};

const resolveGovernorateArabic = (rawGov) => {
  if (!rawGov && rawGov !== 0) return "";
  if (typeof rawGov === "number") {
    const found = egypt_governorates.find((g) => g.id === rawGov);
    return found ? found.name_arabic : String(rawGov);
  }
  if (typeof rawGov === "string") {
    const found = egypt_governorates.find((g) => g.name === rawGov || g.name_arabic === rawGov);
    return found ? found.name_arabic : rawGov;
  }
  return String(rawGov);
};

const mapShipmentToOrderShape = (r, idx) => {
  const rawGov = r.governorate ?? r.region ?? r.state ?? "";
  const govName = resolveGovernorateArabic(rawGov);

  return {
    id: r.id ?? r.shipmentId ?? r.code ?? r.orderNumber ?? `SHIP-${idx}`,
    customerName: r.customerName ?? r.recipientName ?? r.name ?? r.contactName ?? "—",
    customerPhone: r.customerPhone ?? r.phone ?? r.recipientPhone ?? r.contactPhone ?? "",
    city: r.city ?? r.town ?? r.location ?? "",
    governorate: govName || "",
    createdAt: r.createdAt ?? r.created_at ?? r.date ?? r.timestamp ?? new Date().toISOString(),
    collectionAmount: r.collectionAmount ?? r.amount ?? r.codAmount ?? r.total ?? 0,
    shipmentDescription: r.shipmentDescription ?? r.description ?? (r.items ? String(r.items) : "") ?? "",
    isCOD: !!(r.isCOD ?? r.cod ?? r.collectOnDelivery),
    isExpress: !!(r.isExpress ?? r.express ?? r.fastDelivery),
    latestShipmentStatus: { status: normalizeStatus((r.latestShipmentStatus && r.latestShipmentStatus.status) ?? r.status ?? r.currentStatus ?? "Pending") },
    __raw: r,
  };
};

/* ---------- searchBy options ---------- */
const SEARCH_BY_OPTIONS = [
  { value: "Id", label: "معرف الشحنه" },
  { value: "CustomerName", label: "اسم العميل" },
  { value: "CustomerPhone", label: "رقم الهاتف" },
  { value: "ShipmentDescription", label: "محتوى الشحنة" },
];

/* -------------------------
   SearchAndFilters component
   ------------------------- */
const SearchAndFilters = ({
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

        {/* Search by select + input */}
        <div className="d-flex flex-grow-1 position-relative">
          <div className="search-select-wrapper me-2">
            <select value={searchBy} onChange={(e) => onSearchByChange(e.target.value)} className="search-select" aria-label="Search by">
              {SEARCH_BY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
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

/* -------------------------
   Orders2 main component
   ------------------------- */
const Orders2 = ({ initialOrders = [] }) => {
  const navigate = useNavigate();

  // Shipments is single source of truth
  const [Shipments, SetShipments] = useState(initialOrders && initialOrders.length ? initialOrders : []);
  // UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState(SEARCH_BY_OPTIONS[0].value);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [codOnly, setCodOnly] = useState(false);
  const [expressOnly, setExpressOnly] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [totalcount, SetTotalcount] = useState(0);

  // pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // normalized list (optional)
  const ordersList = useMemo(() => {
    if (!Array.isArray(Shipments)) return [];
    return Shipments.map((s, idx) => mapShipmentToOrderShape(s, idx));
  }, [Shipments]);

  // fetch shipments when filters/search/pagination change
  useEffect(() => {
    let mounted = true;

    async function fetchshipments() {
      const params = {
        pageNumber,
        pageSize:pageSize,
      };

      const status = selectedStatuses[0];
      if (status) params.StatusFilter = status;
      if (expressOnly) params.ExpressDeliveryEnabled = true;
      if (codOnly) params.IsCod = true;

      if (searchQuery && searchQuery.toString().trim() !== "") {
        params.searchBy = searchBy;
        params.searchValue = searchQuery.toString().trim();
      }

      try {
        const response = await api.get("/Shipments", { params });
        const result = response?.data?.data;

        if (!mounted) return;
        SetShipments(result?.shipments ?? result ?? []);
        SetTotalcount(result?.totalCount ?? (Array.isArray(result) ? result.length : 0));
      } catch (error) {
        const message = error?.response?.data?.message || error.message || "";
        console.error("fetchshipments error:", message);
      }
    }

    fetchshipments();

    return () => {
      mounted = false;
    };
  }, [selectedStatuses, expressOnly, codOnly, searchBy, searchQuery, pageNumber, pageSize]);

  // change handlers that reset pageNumber
  const handleStatusToggle = (status) => {
    setSelectedStatuses((prev) => {
      const newVal = prev.length === 1 && prev[0] === status ? [] : [status];
      setPageNumber(1);
      return newVal;
    });
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setPageNumber(1);
  };

  const handleSearchByChange = (value) => {
    setSearchBy(value);
    setPageNumber(1);
  };

  const handleCodToggle = () => {
    setCodOnly((p) => !p);
    setPageNumber(1);
  };

  const handleExpressToggle = () => {
    setExpressOnly((p) => !p);
    setPageNumber(1);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPageNumber(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatuses([]);
    setCodOnly(false);
    setExpressOnly(false);
    setSearchBy(SEARCH_BY_OPTIONS[0].value);
    setPageNumber(1);
  };

  const handleDeleteOrder = () => {
    if (!deleteOrderId) return;
    SetShipments((prev) =>
      prev.filter((s) => {
        const id = s.id ?? s.shipmentId ?? s.code ?? s.orderNumber;
        return id !== deleteOrderId && s.id !== deleteOrderId;
      })
    );
    toast.success("تم الحذف بنجاح", { description: `تم حذف الطلب #${deleteOrderId}` });
    setDeleteOrderId(null);
  };

  const handlePrintOrder = (orderId) => {
    toast("طباعة الفاتورة", { description: `جاري تحضير فاتورة الطلب #${orderId} للطباعة...` });
  };
  const handleEditOrder = (orderId) => setEditOrderId(orderId);

  // pagination helpers
  const totalPages = Math.max(1, Math.ceil((totalcount || 0) / pageSize));

  const getVisiblePages = () => {
    const maxShow = 5;
    const pages = [];
    let start = Math.max(1, pageNumber - 2);
    let end = Math.min(totalPages, pageNumber + 2);

    if (end - start + 1 < maxShow) {
      // expand range
      const needed = maxShow - (end - start + 1);
      start = Math.max(1, start - needed);
      end = Math.min(totalPages, end + needed);
    }

    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  };

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPageNumber(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="orders-page min-vh-100 bg-light">
     
      <div className="container py-4">
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <div className="icon-wrap p-2 rounded-lg">
                <Package className="icon-package" />
              </div>
              <h1 className="mb-0 pageheader">الطلبات</h1>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => toast.info("this feature will be available soon")}>
                <Download />تصدير
              </button>
              <button className="btn btn-dark d-flex align-items-center" onClick={() => navigate("/shipping")}>
                <Plus className="me-2" /> شحنة جديدة
              </button>
            </div>
          </div>
          <p className="text-muted mb-0">إدارة ومتابعة جميع الطلبات والشحنات</p>
        </div>

        <div className="mb-3">
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            searchBy={searchBy}
            onSearchByChange={handleSearchByChange}
            selectedStatuses={selectedStatuses}
            onStatusToggle={handleStatusToggle}
            codOnly={codOnly}
            onCodToggle={handleCodToggle}
            expressOnly={expressOnly}
            onExpressToggle={handleExpressToggle}
            onClearFilters={handleClearFilters}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>

        <div className="mb-3 small text-muted">
          عرض {Math.min(totalcount, pageSize * pageNumber)} من أصل {totalcount} طلب
        </div>

        {Shipments.length > 0 ? (
          <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
              {Shipments.map((order, idx) => (
                <div key={order.id ?? order.shipmentId ?? idx} className="col d-flex">
                  <OrderCard order={order} onEdit={handleEditOrder} onPrint={handlePrintOrder} onDelete={setDeleteOrderId} onView={(id) => navigate(`/order-details/${id}`)} />
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            <div className="pagination-controls d-flex justify-content-center align-items-center mt-4">
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => goToPage(pageNumber - 1)} disabled={pageNumber <= 1}>
                  السابق
                </button>

                {getVisiblePages().map((p) => (
                  <button
                    key={p}
                    className={`btn btn-sm ${p === pageNumber ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </button>
                ))}

                <button className="btn btn-sm btn-outline-secondary" onClick={() => goToPage(pageNumber + 1)} disabled={pageNumber >= totalPages}>
                  التالي
                </button>
              </div>

             
            </div>
          </>
        ) : (
          <div className="no-results p-4 text-center">
            <Package className="no-results-icon mb-3" />
            <h3 className="h5">لا توجد نتائج</h3>
            <p className="text-muted">لم يتم العثور على طلبات تطابق معايير البحث</p>
            {(searchQuery || selectedStatuses.length > 0 || codOnly || expressOnly) && <button className="btn btn-link" onClick={handleClearFilters}>مسح جميع الفلاتر</button>}
          </div>
        )}

       

       
      </div>
    </div>
  );
};

export default Orders2;
