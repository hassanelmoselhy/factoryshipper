import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaClipboardList,
  FaWarehouse,
  FaHistory,
  FaDollarSign,
  FaCube,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import "./css/Sidebar.css";

const Sidebar = () => {
  const menuItems = [
    { icon: <FaClipboardList />, name: "الطلبات", path: "/hanger/orders" },
    { icon: <FaCube />, name: "استلام الطلبات", path: "/hanger/scan" },
    { icon: <FaCube />, name: "إخراج الطلبات", path: "/hanger/release-orders" },
    { icon: <FaWarehouse />, name: "المخزون", path: "/hanger/warehouseList" },
    { icon: <FaHistory />, name: "العمليات", path: "/hanger/operations" },
    { icon: <FaDollarSign />, name: "الخزنة", path: "/hanger/treasury" },
    { icon: <FaSignOutAlt />, name: "تسجيل الخروج", path: "/" },
  ];

  const [isActive, setIsActive] = useState(false);

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  const closeSidebar = () => {
    setIsActive(false);
  };

  return (
    <>
      {/*Toggle btn*/}
      <button onClick={toggleSidebar} className="toggle-btn">
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isActive ? "active" : ""}`}>
        <div className="sidebar-header">
          <div>
            <h2>Stake Express</h2>
            <p>لوحة المتحكم</p>
          </div>
          <FaCube className="logo-icon" />
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
                  onClick={closeSidebar} 
                >
                  <span>{item.name}</span>
                  {item.icon}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay */}
      {isActive && <div className="overlay" onClick={closeSidebar}></div>}
    </>
  );
};

export default Sidebar;
