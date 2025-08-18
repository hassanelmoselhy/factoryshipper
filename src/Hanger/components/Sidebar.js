import React from 'react';
import './css/Sidebar.css'; 
import { NavLink } from 'react-router-dom';
import { FaCube, FaExpand, FaSyncAlt, FaUsers, FaCalendarAlt, FaClock } from 'react-icons/fa';

const Sidebar = () => {
  const menuItems = [
    { icon: <FaCube />, name: 'الرئيسي', path: '/hanger/home' },
    { icon: <FaExpand />, name: 'مسح وتسجيل الطرود', path: '/hanger/scan' },
    { icon: <FaSyncAlt />, name: 'تحديث حالة الشحنة', path: '/hanger/update' },
    { icon: <FaUsers />, name: 'إدارة الموظفين', path: '/hanger/employees' },
    { icon: <FaCalendarAlt />, name: 'جدولة التوصيل', path: '/hanger/schedule' },
    { icon: <FaClock />, name: 'الحضور والانصراف', path: '/hanger/attendance' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
