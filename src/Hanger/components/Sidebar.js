import React from 'react';
import './css/Sidebar.css'; 
import { FaCube, FaExpand, FaSyncAlt, FaUsers, FaCalendarAlt, FaClock } from 'react-icons/fa';

const Sidebar = () => {
const menuItems = [
    { icon: <FaCube />, name: 'الرئيسي' },
    { icon: <FaExpand />, name: 'مسح وتسجيل الطرود' },
    { icon: <FaSyncAlt />, name: 'تحديث حالة الشحنة', active: true },
    { icon: <FaUsers />, name: 'إدارة الموظفين' },
    { icon: <FaCalendarAlt />, name: 'جدولة التوصيل' },
    { icon: <FaClock />, name: 'الحضور والانصراف' },
];

return (
    <aside className="sidebar">
    <div className="sidebar-content">
        <nav className="sidebar-nav">
        <ul>
            {menuItems.map((item) => (
            <li key={item.name} className={item.active ? 'active' : ''}>
                {item.icon}
                <span>{item.name}</span>
            </li>
            ))}
        </ul>
        </nav>
    </div>
    </aside>
);
};

export default Sidebar;