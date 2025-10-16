import React from "react";
import { Search } from "lucide-react";
import './css/BranchesFilterBar.css';

const BranchesFilterBar = ({ filters, onFilterChange }) => {
return (
    <div className="branches-filter-bar">
    <div className="filters">
        <select
        value={filters.branch}
        onChange={(e) => onFilterChange("branch", e.target.value)}
        >
        <option value="all">جميع الانواع</option>
        <option value="main">فروع رئيسية</option>
        <option value="secondary"> مخازن فرعية </option>
        </select>

        <select
        value={filters.status}
        onChange={(e) => onFilterChange("status", e.target.value)}
        >
        <option value="all"> جميع الاحوال</option>
        <option value="active">نشط</option>
        <option value="inactive">معطل</option>
        </select>
    </div>

    <div className="filter-search">
        <div className="search-input-wrapper">
        <input
            type="text"
            placeholder="...بحث  في الفروع والمخازن "
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
        />
        <Search size={18} className="search-i" />
        </div>
    </div>
    </div>
);
};

export default BranchesFilterBar;
