import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaCube } from "react-icons/fa";
import axios from "axios";
import useUserStore from "../Store/UserStore/userStore";
import "./css/Sidebar.css";
import api from "../utils/Api";

const Sidebar = ({ title, subtitle, menuItems }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleSidebar = () => setIsActive(!isActive);
  const closeSidebar = () => setIsActive(false);
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

  const lg = (item) => {
    if (item?.path === "/") {
      RevokeToken();
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
              <li key={item.path ?? item.id ?? index}>
                <NavLink
                  to={item.path}
                  onClick={() => lg(item)}
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

      {/* Overlay */}
      {isActive && <div className="overlay" onClick={closeSidebar}></div>}
    </>
  );
};

export default Sidebar;
