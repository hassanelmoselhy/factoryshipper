import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaCube, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import useUserStore from "../Store/UserStore/userStore";
import api from "../utils/Api";
import "./css/Sidebar.css";

const Sidebar = ({ title, subtitle, menuItems }) => {
  const [isActive, setIsActive] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const toggleSidebar = () => setIsActive(!isActive);
  const closeSidebar = () => setIsActive(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const user = useUserStore((state) => state.user);
  const RevokeToken = async () => {
    const url = "https://stakeexpress.runasp.net/api/Accounts/revokeToken";

    try {
      const response = await api.post(
        url,
        {},
        {
          withCredentials: true,
        }
      );

      console.log("success", response.data);
      sessionStorage.clear();
      // Prevent session restore after logout
      sessionStorage.setItem('sessionRestoreAttempted', 'true');
      return response.data;
    } catch (err) {
      if (err.response) {
        console.log("Fail", {
          status: err.response.status,
          data: err.response.data,
        });
      } else {
        console.log("Failed", err.message);
      }

      throw err;
    }
  };

  const lg = async (e, item) => {
    if (item?.path === "/") {
      e.preventDefault(); 
      try {
        await RevokeToken(); 
        navigate("/"); 
      } catch (error) {
        console.error("Logout failed:", error);
        navigate("/"); 
      }
    }
    closeSidebar();
  };

  return (
    <>
      {/* Toggle button for Mobile */}
      <button onClick={toggleSidebar} className="toggle-btn">
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isActive ? "active" : ""} ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {/* Collapse Button */}
          <button className="collapse-btn" onClick={toggleCollapse} title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
            {isCollapsed ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
          </button>
          
          <div className={`header-content ${isCollapsed ? "collapsed-header" : ""}`}>
            {!isCollapsed && (
              <>
                <h2>{title}</h2>
                <p>{subtitle}</p>
              </>
            )}
          </div>
          <FaCube className="logo-icon" />
          
        </div>

        <nav className="sidebar-nav">
          <ul className="d-flex flex-column align-items-start">
            {menuItems?.map((item, index) => (
              <li key={item.path ?? item.id ?? index}>
                <NavLink
                  to={item.path}
                  onClick={(e) => lg(e, item)}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  title={item.name}
                >
                  {!isCollapsed && <span>{item.name}</span>}
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
