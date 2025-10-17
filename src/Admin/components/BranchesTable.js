import React from 'react';
import './css/BranchesTable.css';
import BranchesTableItem from './BranchesTableItem';

const BranchesTable = ({ branches, onViewDetails }) => {
  return (
    <div className="branches-table-wrapper">
      <div className="branches-table-container card-base">
        <div className='table-title'> 
            <h4>قائمة الفروع والمخازن (3)</h4>
            <p>إدارة جميع مراكز التوزيع والمخازن الفرعية</p>
        </div>
        <div className="table-header">
          <div className="header-item branch">النوع</div>
          <div className="header-item data">الاسم</div>
          <div className="header-item city"> المدينة</div>
          <div className="header-item manager-name">اسم المسئول</div>
          <div className="header-item manager-phone">رقم الهاتف</div>
          <div className="header-item area">المساحة</div>
          <div className="header-item employees">الموظفين</div>
          <div className="header-item status">الحالة</div>
          <div className="header-item status">الاجراءات</div>
        </div>

        <div className="table-body">
          {branches.length > 0 ? (
            branches.map((branch, index) => (
              <BranchesTableItem
                key={index} 
                branch={branch}
                onViewDetails={onViewDetails}
              />
            ))
          ) : (
            <div className="no-branches">لا توجد فروع بنفس التصنيف</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchesTable;
