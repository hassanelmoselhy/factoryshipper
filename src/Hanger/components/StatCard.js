import React from 'react';
import './css/StatCard.css';

const StatCard = ({ title, count, description, color }) => {
return (
    <div className={`stat-card border-${color}`}>
    <h3 className={`title-color-${color}`}>{title}</h3>
    <p className="count">{count}</p>
    <p className="description">{description}</p>
    </div>
);
};

export default StatCard;