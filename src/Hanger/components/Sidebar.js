// // import React from 'react';
// // import './css/Sidebar.css'; 
// // import { NavLink } from 'react-router-dom';
// // import { FaCube, FaExpand, FaSyncAlt, FaUsers, FaCalendarAlt, FaClock, FaSignOutAlt } from 'react-icons/fa';

// // const Sidebar = () => {
// //   const menuItems = [
// //     { icon: <FaCube />, name: 'الرئيسي', path: '/hanger/home' },
// //     { icon: <FaExpand />, name: 'مسح وتسجيل الطرود', path: '/hanger/scan' },
// //     { icon: <FaSyncAlt />, name: 'تحديث حالة الشحنة', path: '/hanger/update' },
// //     { icon: <FaUsers />, name: 'إدارة الموظفين', path: '/hanger/employees' },
// //     { icon: <FaCalendarAlt />, name: 'جدولة التوصيل', path: '/hanger/schedule' },
// //     { icon: <FaClock />, name: 'الحضور والانصراف', path: '/hanger/attendance' },
// //     { icon: <FaSignOutAlt />, name: 'تسجيل الخروج', path: '/hanger/sign-in' },
// //   ];

// //   return (
// //     <aside className="sidebar">
// //       <div className="sidebar-content">
// //         <nav className="sidebar-nav">
// //           <ul>
// //             {menuItems.map((item) => (
// //               <li key={item.name}>
// //                 <NavLink 
// //                   to={item.path} 
// //                   className={({ isActive }) => isActive ? 'active' : ''}
// //                 >
// //                   {item.icon}
// //                   <span>{item.name}</span>
// //                 </NavLink>
// //               </li>
// //             ))}
// //           </ul>
// //         </nav>
// //       </div>
// //     </aside>
// //   );
// // };

// // export default Sidebar;

import { NavLink } from "react-router-dom";
import {
  FaClipboardList,
  FaWarehouse,
  FaHistory,
  FaDollarSign,
  FaCube,
  FaSignOutAlt,
} from "react-icons/fa";
import "./css/Sidebar.css";

const Sidebar = () => {
  const menuItems = [
    { icon: <FaClipboardList />, name: "الطلبات", path: "/hanger/orders" },
    { icon: <FaCube />, name: "استلام الطلبات", path: "/hanger/scan" },
    { icon: <FaCube />, name: "إخراج الطلبات", path: "/hanger/release-orders" },
    { icon: <FaWarehouse />, name: "المخزون", path: "/hanger/inventory" },
    { icon: <FaHistory />, name: "العمليات", path: "/hanger/operations" },
    { icon: <FaDollarSign />, name: "الخزنة", path: "/hanger/treasury" },
    { icon: <FaSignOutAlt />, name: 'تسجيل الخروج', path: '/hanger/sign-in' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <FaCube className="logo-icon" />
        <div>
          <h2>Stake Express</h2>
          <p>لوحة المتحكم</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                <span>{item.name}</span>
                {item.icon}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
