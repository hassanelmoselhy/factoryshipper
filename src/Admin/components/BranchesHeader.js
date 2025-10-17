import React from 'react';
import './css/BranchesHeader.css';
import { Plus } from 'lucide-react';

const BranchesHeader = ({ onAddClick }) => {
  return (
    <div className="branch-header">
      <div className="branch-title">
        <h1>إدارة الفروع والمخازن</h1>
        <p>إدارة مراكز التوزيع والمخازن الفرعية</p>
      </div>
      <button className="add-branch-btn" onClick={onAddClick}>
        <Plus /> إضافة فرع \ مخزن
      </button>
    </div>
  );
};

export default BranchesHeader;
