import React from 'react';
import './css/Sidebar.css'; 
import { FaCube, FaExpand, FaSyncAlt, FaUsers, FaCalendarAlt, FaClock, FaQuestionCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
const menuItems = [
    { icon: <FaCube />, name: 'الرئيسي', URL: '/Hanger/HangerHome' },
    { icon: <FaExpand />, name: 'مسح وتسجيل الطرود',URL: '/Hanger/ScanAndRegister' },
    { icon: <FaSyncAlt />, name: 'تحديث حالة الشحنة', active: true, URL: '/Hanger' },
    { icon: <FaUsers />, name: 'إدارة الموظفين', URL: '/Hanger/ManageEmployees' },
    { icon: <FaCalendarAlt />, name: 'جدولة التوصيل', URL: '/Hanger/ScheduleDelivery' },
    { icon: <FaClock />, name: 'الحضور والانصراف',URL:'/Hanger/Attendance ' },
];

return (
    <aside className="sidebar">
    <div className="sidebar-content">
        <nav className="sidebar-nav">
        <ul>
            {menuItems.map((item) => (
                <Link to={item.URL} key={item.name} style={{ textDecoration: 'none'}}>
                    <li key={item.name} className={item.active ? 'active' : ''}>
                {item.icon}
                <span>{item.name}</span>
            </li>
                </Link>
            
            ))}
        </ul>
        </nav>
    </div>
    <div className="sidebar-footer">
        <FaQuestionCircle />
    </div>
    </aside>
);
};

export default Sidebar;