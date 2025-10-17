import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaCube } from "react-icons/fa";
import './css/Sidebar.css';

const Sidebar = ({ title, subtitle, menuItems }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleSidebar = () => setIsActive(!isActive);
  const closeSidebar = () => setIsActive(false);

  return (
    <>
      {/* Toggle button for Mobile */}
      <button onClick={toggleSidebar} className="toggle-btn">
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isActive ? "active" : ""}`}>
        <div className="sidebar-header">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <FaCube className="logo-icon" />
        </div>

        <nav className="sidebar-nav">
          <ul>
            {menuItems?.map((item, index) => (
              <li key={index}>
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
