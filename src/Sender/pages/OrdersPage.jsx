import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Truck, 
  ChevronDown, 
  Printer, 
  Edit3, 
  Download, 
  Filter, 
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  RefreshCw,
  CornerUpLeft,
  Banknote
} from "lucide-react";
import { GetAllOrders } from "../Data/ShipmentsService";
import { toast } from "sonner";
import "./css/OrdersPage.css";

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("الكل");
  const [searchType, setSearchType] = useState("رقم التتبع");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchOptions = [
    { label: "رقم التتبع", value: "tracking" },
    { label: "رقم التيليفون", value: "phone" },
    { label: "مرجع الطلب", value: "reference" }
  ];
  
  const dropdownRef = useRef(null);
  const actionsMenuRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
        setShowActionsMenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  


  
  const tabs = [
      
    "الكل",
    "جديد",
    "قيد التنفيذ",
    // "متجه للعميل",
    // "في انتظار متابعتك",
    "تم بنجاح",
    "غير ناجح",
    // "مرتجعات مرفوضة",
    // "تم تخزينه"
  "متوقف حاليا"
  ];

  const TYPE_MAPPING = {
    'Delivery': { label: 'توصيل', class: 'type-delivery', icon: <Truck size={12} /> },
    'Return': { label: 'مرتجع', class: 'type-return', icon: <CornerUpLeft size={12} /> },
    'Exchange': { label: 'استبدال', class: 'type-exchange', icon: <RefreshCw size={12} /> },
    'CashCollection': { label: 'تحصيل نقدي', class: 'type-cashcollection', icon: <Banknote size={12} /> }
  };

  const TAB_STATUS_MAPPING = {
    "جديد": "NewOrder",
    "قيد التنفيذ": "InProgress",
    "تم بنجاح": "Completed",
    "غير ناجح": "Failed",
    "متوقف حاليا": "OnHold"
  };

  const SEARCH_BY_MAPPING = {
    "رقم التتبع": "OrderNumber",
    "رقم التيليفون": "CustomerPhone",
    "مرجع الطلب": "OrderNumber" // Mapping reference to OrderNumber as well for now, or you can adjust if there is a specific field
  };

  const STATUS_MAPPING = {
    'NewOrder': { label: 'جديد', class: 'status-neworder' },
    'WaitingForPickup': { label: 'في انتظار الاستلام', class: 'status-waitingforpickup' },
    'PickedUp': { label: 'تم الاستلام', class: 'status-pickedup' },
    'InWarehouse': { label: 'في المخزن', class: 'status-inwarehouse' },
    'InProgress': { label: 'قيد التنفيذ', class: 'status-inprogress' },
    'OutForDelivery': { label: 'خرج للتوصيل', class: 'status-outfordelivery' },
    'ReturningToShipper': { label: 'في طريق العودة للراسل', class: 'status-returningtoshipper' },
    'WaitingForShipperDecision': { label: 'في انتظار قرار الراسل', class: 'status-waitingforshipperdecision' },
    'RejectedReturns': { label: 'مرتجعات مرفوضة', class: 'status-rejectedreturns' },
    'Completed': { label: 'تم بنجاح', class: 'status-completed', icon: <CheckCircle2 size={12} /> },
    'Returned': { label: 'مرتجع', class: 'status-returned' },
    'Failed': { label: 'فشل', class: 'status-failed', icon: <XCircle size={12} /> },
    'Archived': { label: 'مؤرشف', class: 'status-archived' },
    'Canceled': { label: 'ملغي', class: 'status-canceled' }
  };


  // Debounce search value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const payload = {};
      
      if (activeTab !== "الكل" && TAB_STATUS_MAPPING[activeTab]) {
        payload.StatusFilter = TAB_STATUS_MAPPING[activeTab];
      }

      if (debouncedSearchValue.trim() !== "") {
        payload.SearchBy = SEARCH_BY_MAPPING[searchType] || "OrderNumber";
        payload.SearchValue = debouncedSearchValue.trim();
      }
      
      try {
        const response = await GetAllOrders(payload);
        if (response.Success) {
          console.log(response.Data);
          setOrders(response.Data);
        } else {
          console.log(response);
          toast.error(response.Message);
        }
      } catch (error) {
        console.error(error);
        toast.error("حدث خطأ أثناء جلب البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab, searchType, debouncedSearchValue]);

  const downloadCSV = () => {
    if (orders.length === 0) {
      toast.error("لا توجد بيانات لتحميلها");
      return;
    }else toast.info("جار تجهيز الملف");

    const headers = [
      "رقم التتبع",
      "النوع",
      "العميل",
      "الهاتف",
      "المحافظة",
      "المدينة",
      "مبلغ التحصيل",
      "الحالة",
      "تاريخ الإنشاء"
    ];

    const csvRows = [
      headers.join(","),
      ...orders.map(order => [
        `"${order.orderNumber || ''}"`,
        `"${order.orderType || ''}"`,
        `"${order.customerName || ''}"`,
        `"${order.customerPhone || ''}"`,
        `"${order.governorate || ''}"`,
        `"${order.city || ''}"`,
        `"${order.collectionCashAmount || 0}"`,
        `"${order.orderCurrentStatus || ''}"`,
        `"${new Date(order.createdAt).toLocaleDateString('ar-EG')}"`
      ].join(","))
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob(["\ufeff" + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Card Wrapper */}
        <div className="orders-card">
        {/* Tabs */}
        <div className="orders-tabs">
          {tabs.map((tab) => (
            <div 
              key={tab} 
              className={`tab-item ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Header Section */}
        <div className="orders-header">
          <div className="header-right">
            <h1 className="orders-title">
              <Truck size={24} />
              أوردرات
              <span className="orders-count">{orders.length}</span>
            </h1>
            <div className="search-container" ref={dropdownRef}>
              <div 
                className="search-dropdown-part" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="search-select-label">{searchType}</span>
                <ChevronDown size={14} color="#6c757d" />
                {showDropdown && (
                  <div className="dropdown-menu-custom">
                    {searchOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`dropdown-item-custom ${
                          searchType === option.label ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchType(option.label);
                          setShowDropdown(false);
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="search-divider"></div>
              <div className="search-input-part">
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="بحث" 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <Search size={18} color="#adb5bd" />
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button className="btn-order-action">
              <Filter size={18} />
              تصنيف
            </button>
            <button className="btn-order-action" onClick={downloadCSV}>
              <Download size={18} />
              تحميل
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>رقم التتبع</th>
                <th>النوع</th>
                <th>العميل</th>
                <th>المنطقة</th>
                <th>مبلغ التحصيل</th>
                <th>الحالة</th>
                <th>تاريخ الإنشاء</th>
                <th>تاريخ آخر تحديث</th>
                <th>وقت التوصيل المتوقع</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton Loader Rows
                [...Array(5)].map((_, index) => (
                  <tr key={`skeleton-${index}`} className="skeleton-row">
                    <td><div className="skeleton-item checkbox-skeleton placeholder-glow"><span className="placeholder col-12"></span></div></td>
                    <td><div className="skeleton-item placeholder-glow"><span className="placeholder col-8"></span></div></td>
                    <td><div className="skeleton-item placeholder-glow"><span className="placeholder col-6"></span></div></td>
                    <td>
                      <div className="skeleton-item placeholder-glow">
                        <span className="placeholder col-10 mb-1"></span>
                        <span className="placeholder col-7"></span>
                      </div>
                    </td>
                    <td>
                      <div className="skeleton-item placeholder-glow">
                        <span className="placeholder col-9 mb-1"></span>
                        <span className="placeholder col-6"></span>
                      </div>
                    </td>
                    <td><div className="skeleton-item placeholder-glow"><span className="placeholder col-5"></span></div></td>
                    <td><div className="skeleton-item placeholder-glow"><span className="placeholder col-7"></span></div></td>
                    <td>
                      <div className="skeleton-item placeholder-glow">
                        <span className="placeholder col-8 mb-1"></span>
                        <span className="placeholder col-6"></span>
                      </div>
                    </td>
                    <td><div className="skeleton-item placeholder-glow"><span className="placeholder col-6"></span></div></td>
                    <td><div className="skeleton-item placeholder-glow"><span className="placeholder col-4"></span></div></td>
                    <td><div className="skeleton-item placeholder-glow"><span className="placeholder col-2"></span></div></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center", padding: "40px", color: "#6c757d" }}>
                    لا يوجد نتائج
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderNumber || order.id} className="order-row">
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <span className="order-id">{order.orderNumber}</span>
                    </td>
                    <td>
                      {order.orderType && TYPE_MAPPING[order.orderType] ? (
                        <span className={`status-badge ${TYPE_MAPPING[order.orderType].class}`}>
                          {TYPE_MAPPING[order.orderType].icon}
                          {TYPE_MAPPING[order.orderType].label}
                        </span>
                      ) : (
                        <span className="status-badge type-delivery">
                          <Truck size={12} />
                          {order.orderType || "توصيل"}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="customer-info">
                        <span className="customer-name">{order.customerName}</span>
                        <span className="customer-phone">{order.customerPhone}</span>
                      </div>
                    </td>
                    <td>
                      <div className="location-info">
                        <span className="location-main">{order.governorate}</span>
                        <span className="location-sub">{order.city}</span>
                      </div>
                    </td>
                    <td>
                      <div className="amount-info">
                        <div>{order.collectionCashAmount} ج.م</div>
                        <div className="small text-muted">{order.paymentMethod || "الدفع عند الاستلام"}</div>
                      </div>
                    </td>
                    <td>
                      {order.orderCurrentStatus && STATUS_MAPPING[order.orderCurrentStatus] ? (
                        <span className={`status-badge ${STATUS_MAPPING[order.orderCurrentStatus].class}`}>
                          {STATUS_MAPPING[order.orderCurrentStatus].icon}
                          {STATUS_MAPPING[order.orderCurrentStatus].label}
                        </span>
                      ) : (
                        <span className={`status-badge status-${(order.orderCurrentStatus || "pending").toLowerCase()}`}>
                          {order.orderCurrentStatus === 'Success' && <CheckCircle2 size={12} />}
                          {order.orderCurrentStatus === 'Failed' && <XCircle size={12} />}
                          {order.orderCurrentStatus || "قيد التنفيذ"}
                        </span>
                      )}
                    </td>
                    
                    <td>
                      <div className="date-info">
                        <div>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</div>
                        <div className="small text-muted">{new Date(order.createdAt).toLocaleTimeString('ar-EG')}</div>
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <div>{order.updatedAt ? new Date(order.updatedAt).toLocaleDateString('ar-EG') : "-"}</div>
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <div>-</div>
                      </div>
                    </td>
                    <td className="actions-cell">
                      <div 
                        className="actions-menu-wrapper"
                        ref={actionsMenuRef}
                      >
                        <button 
                          className="action-btn-trigger" 
                          title="المزيد"
                          onClick={() => setShowActionsMenu(showActionsMenu === order.orderNumber ? null : order.orderNumber)}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        {showActionsMenu === order.orderNumber && (
                          <div className="actions-menu-dropdown">
                            <button className="action-menu-item" title="تعديل">
                              <Edit3 size={16} />
                              <span>تعديل</span>
                            </button>
                            <button className="action-menu-item" title="طباعة">
                              <Printer size={16} />
                              <span>طباعة</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
        {/* End Card Wrapper */}
      </div>
    </div>
  );
};

export default OrdersPage;
