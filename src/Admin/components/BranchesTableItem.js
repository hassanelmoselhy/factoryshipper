import React from 'react';
import './css/BranchesTableItem.css';
import { Building2, Eye, MapPin, Phone } from 'lucide-react';

const BranchesTableItem = ({ branch, onViewDetails }) => {
const getStatusClass = (status) => {
  switch (status) {
    case 'نشط':
      return 'نشط'; 
    case 'معطل':
      return 'معطل';
    default:
      return '';
  }
};

  return (
    <div className="table-row">
      <div className="cell-content branch">{branch.branch}</div>

      <div className="cell-content data">
        <div className="data">
          <span>{branch.data.name}</span>
          <span className="data-id">{branch.data.id}</span>
        </div>
      </div>

    <div className="cell-content city">
       <MapPin /><span>{branch.city}</span>
      </div>

      <div className="cell-content customer-name">
        <span>{branch.managerName}</span>
      </div>

      <div className="cell-content customer-phone">
        <Phone /><span>{branch.managerPhone}</span>
      </div>

      <div className="cell-content area">{branch.area}</div>

      <div className="cell-content employees">
      <Building2 />{branch.employees}</div>

      <div className="cell-content status">
        <span className={`status-badge ${getStatusClass(branch.status)}`}>
          {branch.status}
        </span>
      </div>

        <button className="details-btn" onClick={() => onViewDetails(branch)}>
          <Eye  className='icon'/>عرض التفاصيل
        </button>
      </div>
  );
};

export default BranchesTableItem;
