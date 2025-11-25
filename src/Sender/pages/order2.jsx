// src/Sender/pages/Orders2.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Package, Plus, Download } from "lucide-react";
import { egypt_governorates } from "../../Shared/Constants";
import OrderFilters, { SEARCH_BY_OPTIONS } from "../components/OrderFilters";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import OrderCard from "../components/OrderCard";
import OrderCardSkeleton from "../components/OrderCardSkeleton";
import "./css/Orders2.css";
import api from "../../utils/Api";
import DeleteModal from "../../Components/DeleteModal";
import useUserStore from "../../Store/UserStore/userStore";
import Swal from "sweetalert2";

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


/* -------------------------
   Orders2 main component
   ------------------------- */
const Orders2 = ({ initialOrders = [] }) => {
  const navigate = useNavigate();

  // Shipments is single source of truth
  const [Shipments, SetShipments] = useState(initialOrders && initialOrders.length ? initialOrders : []);
  // UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [searchBy, setSearchBy] = useState(SEARCH_BY_OPTIONS[0].value);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [codOnly, setCodOnly] = useState(false);
  const [expressOnly, setExpressOnly] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [totalcount, SetTotalcount] = useState(0);
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  const [showdeleteModal, setShowDeleteModal] = useState(false);
    let statusFromHome = useLocation().state;
  // pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(6);


  // fetch shipments when filters/search/pagination change
  useEffect(() => {
    let mounted = true;

    

    async function fetchshipments() {
      setLoading(true);
      const params = {
        pageNumber,
        pageSize,
      };

      const status = selectedStatuses[0];
      if (status) params.StatusFilter = status;
      if (expressOnly) params.ExpressDeliveryEnabled = true;
      if (codOnly) params.IsCod = true;

      if (debouncedSearchQuery && debouncedSearchQuery.toString().trim() !== "") {
        params.searchBy = searchBy;
        params.searchValue = debouncedSearchQuery.toString().trim();
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
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchshipments();

    return () => {
      mounted = false;
    };
  }, [selectedStatuses, expressOnly, codOnly, searchBy, debouncedSearchQuery, pageNumber, pageSize]);

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

  // DeleteShipment now accepts `id` explicitly
  const DeleteShipment = async (id) => {
    if (!id) {
      toast.error("معرّف الشحنة غير محدد.");
      return;
    }

    try {
      setLoading(true);
      console.log("Deleting Shipment:", id);

      const res = await fetch(
        `https://stakeexpress.runasp.net/api/Shipments/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      console.log("Response Status:", res.status);

      if (res.ok) {
        // Remove locally from the list to update UI immediately
        SetShipments((prev) =>
          prev.filter((s) => {
            const idVal = s.id ?? s.shipmentId ?? s.code ?? s.orderNumber;
            return idVal !== id;
          })
        );

        // update total count if present
        SetTotalcount((prev) => (typeof prev === "number" ? Math.max(0, prev - 1) : prev));

        toast.success("تم إلغاء الطلب بنجاح");
        Swal.fire({
          position: "center-center",
          icon: "success",
          title: "Shipment Deleted Successfully",
          showConfirmButton: false,
          timer: 2000,
        });

        // close modal and clear selected id
        setShowDeleteModal(false);
        setDeleteOrderId(null);
      } else {
        const data = await res.json().catch(() => ({}));
        console.log("data from cancel", data);
        toast.error(data?.message || "فشل إلغاء الشحنة");
      }
    } catch (err) {
      toast.error("حدث خطأ في الخادم أثناء إلغاء الطلب");
      console.log("Server Error", err);
    } finally {
      setLoading(false);
        setShowDeleteModal(false);
    }
  };

  const handlePrintOrder = (orderId) => {
    toast("طباعة الفاتورة", { description: `جاري تحضير فاتورة الطلب #${orderId} للطباعة...` });
  };
  const handleEditOrder = (orderId) => setEditOrderId(orderId);

  // display counts: show current page count and total shipments
  const totalDisplay = totalcount ?? (Array.isArray(Shipments) ? Shipments.length : 0);

  return (
    <>
      {/* Delete modal: onConfirm passes the selected deleteOrderId to DeleteShipment */}
      <DeleteModal
        show={showdeleteModal}
        title="Delete Shipment"
        message="Are you sure you want to delete this Shipment? This action cannot be undone."
        onCancel={() => { setShowDeleteModal(false); setDeleteOrderId(null); }}
        onConfirm={() => DeleteShipment(deleteOrderId)}
      />

      <div className="orders-page min-vh-100 bg-light">
        {/* <Toaster /> */}
        <div className="container py-4">
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap mb-2">
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
            <OrderFilters
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
            عرض {Shipments.length} من أصل {totalDisplay} شحنة
          </div>

          {loading ? (
            
            <div className="orders-grid">
              {Array.from({ length: pageSize }).map((_, idx) => (
                <OrderCardSkeleton key={idx} />
              ))}
            </div>
          ) : Shipments.length > 0 ? (
            <>
              <div className="orders-grid">
                {Shipments.map((order, idx) => (
                  <OrderCard
                    key={order.id ?? order.shipmentId ?? idx}
                    order={order}
                    onEdit={handleEditOrder}
                    onPrint={handlePrintOrder}
                    // when delete clicked on the card: set the id and open modal
                    onDelete={() => {
                      const idVal = order.id ?? order.shipmentId ?? order.code ?? order.orderNumber;
                      setDeleteOrderId(idVal);
                      setShowDeleteModal(true);
                    }}
                    onView={(id) => navigate(`/order-details/${id}`)}
                  />
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
    </>
  );
};

export default Orders2;
