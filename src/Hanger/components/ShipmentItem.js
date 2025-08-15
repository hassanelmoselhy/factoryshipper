import React from 'react';
import './css/ShipmentItem.css';

const ShipmentItem = ({ id, details }) => {
return (
    <div className="shipment-item">
    <span className="shipment-id">#{id}</span>
    <span className="shipment-details">{details}</span>
    </div>
);
};

export default ShipmentItem;