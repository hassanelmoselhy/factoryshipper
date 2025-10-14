import React from "react";
import { Search } from "lucide-react";
import "./css/OrdersFilterBar.css";

const OrdersFilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className="orders-filter-bar">
      <div className="filters">
        <select
          value={filters.branch}
          onChange={(e) => onFilterChange("branch", e.target.value)}
        >
          <option value="all">كل الفروع</option>
          <option value="maadi">فرع المعادي</option>
          <option value="nasr">فرع مدينة نصر</option>
          <option value="dokki">فرع الدقي</option>
          <option value="zamalek">فرع الزمالك</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
        >
          <option value="all">كل الحالات</option>
          <option value="pending">قيد الانتظار</option>
          <option value="transit">في مرحلة الانتقال</option>
          <option value="delivered">تم التوصيل</option>
          <option value="canceled">تم الإلغاء</option>
        </select>
      </div>

      <div className="filter-search">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="...بحث عن طلب، تاجر، عميل"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
          <Search size={18} className="search-i" />
        </div>
      </div>
    </div>
  );
};

export default OrdersFilterBar;
