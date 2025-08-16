import React from 'react';
import './css/ShipmentUpdate.css';
import StatCard from '../components/StatCard';
import ShipmentItem from '../components/ShipmentItem';
import { FaSyncAlt } from 'react-icons/fa';

const ShipmentUpdate = () => {
  return (
    <div className="shipment-update-container">
      <div className="page-header">
      <FaSyncAlt className="refresh-icon" />
        <h2>تحديث حالة الشحنة</h2>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="قيد التخزين" 
          count="89" 
          description="طرد في المستودع" 
          color="orange" 
        />
        <StatCard 
          title="تعذر التوصيل" 
          count="12" 
          description="طرد فشل توصيله" 
          color="red" 
        />
        <StatCard 
          title="مرتجع" 
          count="7" 
          description="طرد مرتجع" 
          color="gray" 
        />
      </div>
      
      <div className="controls-container">
        <div className="search-bar">
          <input type="text" placeholder="...بحث برقم الطرد" />
          <button className="search-btn">بحث</button>
        </div>
        
        <div className='shipment-status'>
            <div className="shipments-list">
        <ShipmentItem id="SP001234" details="محمد أحمد - الرياض" />
      </div>
        <div className="filter-tabs">
          <button className="filter-btn active">قيد التخزين</button>
          <button className="filter-btn">تعذر التوصيل</button>
          <button className="filter-btn">مرتجع</button>
  
        </div>
      </div>
      

        </div>

    </div>
  );
};

export default ShipmentUpdate;