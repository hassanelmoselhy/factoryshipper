import React from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import './css/BranchesFilterBar.css';

const BranchesFilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className="branches-filter-bar">
      <div className="filters-group">
        <div className="select-wrapper">
          <Filter size={16} className="filter-icon" />
          <select
            value={filters.branch}
            onChange={(e) => onFilterChange("branch", e.target.value)}
          >
            <option value="all">جميع أنواع الفروع</option>
            <option value="main">فروع رئيسية</option>
            <option value="secondary">مخازن فرعية</option>
          </select>
          <ChevronDown size={16} className="chevron-icon" />
        </div>

        <div className="select-wrapper">
          <div className={`status-dot ${filters.status}`}></div>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
          >
            <option value="all">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">معطل</option>
          </select>
          <ChevronDown size={16} className="chevron-icon" />
        </div>
      </div>

      <div className="search-group">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="البحث عن طريق الاسم، المسئول أو رقم الهاتف..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BranchesFilterBar;
