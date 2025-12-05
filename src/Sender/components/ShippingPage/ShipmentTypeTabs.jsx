import React from 'react';
import { Truck, RefreshCw, RotateCcw } from 'lucide-react';

const ShipmentTypeTabs = ({ shipmentType, setShipmentType, setFormData }) => {
  return (
    <div className="d-flex justify-content-start align-items-center mt-4">
      <div className="shipment-tabs-container">
        <button 
          className={`tab-btn ${shipmentType === 'return' ? 'active' : ''}`}
          onClick={() => {
            setShipmentType('return');
            setFormData(prev => ({ ...prev, isRefund: true }));
          }}
          type="button"
        >
          <RotateCcw size={18} />
          <span>إرجاع شحنة</span>
        </button>

        <button 
          className={`tab-btn ${shipmentType === 'exchange' ? 'active' : ''}`}
          onClick={() => {
            setShipmentType('exchange');
            setFormData(prev => ({ ...prev, isRefund: false }));
          }}
          type="button"
        >
          <RefreshCw size={18} />
          <span>تبديل شحنات</span>
        </button>

        <button 
          className={`tab-btn ${shipmentType === 'delivery' ? 'active' : ''}`}
          onClick={() => {
            setShipmentType('delivery');
            setFormData(prev => ({ ...prev, isRefund: false }));
          }}
          type="button"
        >
          <Truck size={18} />
          <span>توصيل شحنة</span>
        </button>
      </div>
    </div>
  );
};

export default ShipmentTypeTabs;
