import React from 'react';
import './css/Rightsidebar.css';
import { NavLink } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaTasks, FaWallet, FaSignOutAlt } from 'react-icons/fa';

const Rightsidebar = () => {

  return (
    <>
      <div className='top'>
        <h1>StakeExpress</h1>
        <p>لوحة المرسل</p>
      </div>

      <div className='bottom'>
        <ul>
          <li>
            <NavLink to="/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="icon"><FaHome /></span>
              <span className="text">الرئيسية</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/order" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="icon"><FaShoppingCart /></span>
              <span className="text">الطلبات</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/actions" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="icon  icon2"><FaTasks /></span>
              <span className="text">المهام</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/wallet" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="icon  icon3"><FaWallet /></span>
              <span className="text">المحفظة</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="icon "><FaSignOutAlt /></span>
              <span className="text">تسجيل الخروج</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Rightsidebar;