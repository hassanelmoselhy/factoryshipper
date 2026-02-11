import React from 'react';
import './css/BranchesHeader.css';
import { Plus, Building2 } from 'lucide-react';

const BranchesHeader = ({ onAddClick }) => {
  return (
    <div className="branch-header">
      <div className="branch-title">
        <div className="title-with-icon">
          <Building2 size={28} className="header-icon" />
          <h1>إدارة الفروع والمخازن</h1>
        </div>
        <p>إدارة مراكز التوزيع والمخازن الفرعية لتسهيل العمليات اللوجستية</p>
      </div>
      <button className="add-branch-btn" onClick={onAddClick}>
        <Plus size={20} />
        <span>إضافة فرع أو مخزن جديد</span>
      </button>
    </div>
  );
};

export default BranchesHeader;
