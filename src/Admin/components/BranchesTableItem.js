import React from 'react';
import './css/BranchesTableItem.css';
import { Building2, Eye, MapPin, Phone, Users, Square, ChevronLeft } from 'lucide-react';

const BranchesTableItem = ({ branch, onViewDetails }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'نشط':
        return 'active';
      case 'معطل':
        return 'inactive';
      default:
        return '';
    }
  };

  const getBranchTypeClass = (type) => {
    return type.includes('رئيسي') ? 'type-main' : 'type-secondary';
  };

  return (
    <div className="table-row">
      <div className="cell-content branch">
        <span className={`type-badge ${getBranchTypeClass(branch.branch)}`}>
          {branch.branch}
        </span>
      </div>
      
      <div className="cell-content data">
        <div className="name-wrapper">
          <span className="hub-name">{branch.data.name}</span>
          <span className="hub-id">#{branch.data.id}</span>
        </div>
      </div>

      <div className="cell-content manager-name">
        <div className="manager-info">
          <span>{branch.managerName.trim() ? branch.managerName.trim() : "لم يحدد بعد"}</span>
        </div>
      </div>

      <div className="cell-content manager-phone">
        <div className="phone-wrapper">
          <Phone size={14} className="cell-icon" />
          <span>{branch.managerPhone || '—'}</span>
        </div>
      </div>

      <div className="cell-content area">
        <div className="area-wrapper">
          <Square size={14} className="cell-icon" />
          <span>{branch.area}</span>
        </div>
      </div>

      <div className="cell-content employees">
        <div className="employees-wrapper">
          <Users size={14} className="cell-icon" />
          <span>{branch.employees} موظف</span>
        </div>
      </div>

      <div className="cell-content status">
        <span className={`status-badge ${getStatusClass(branch.status)}`}>
          <span className="dot"></span>
          {branch.status}
        </span>
      </div>

      <div className="cell-content actions">
        <button className="details-btn" onClick={() => onViewDetails(branch)}>
          <span>التفاصيل</span>
          <ChevronLeft size={16} />
        </button>
      </div>
    </div>
  );
};

export default BranchesTableItem;
