import React from 'react';
import './css/AdminNavbar.css';
import { Bell, ChevronDown, Plus, Search } from 'lucide-react';

const AdminNavbar = () => {
const userName = "مرحباً أحمد محمد";
const userLocation = "المعادي 2";
const userAvatar = "https://via.placeholder.com/40";

return (
    <div className="admin-navbar-container">
    <div className="navbar-right-section">
        <div className="search-bar">
        <input type="text" placeholder="البحث في الطلبات, التجار, الموظفين..." className="search-input" />
        <Search className="search-icon" />
        </div>
    </div>


    <div className="navbar-center-section">
        <button className="navbar-icon-btn notification-btn">
        <Bell className="icon" />
        </button>
        <button className="create-btn">
        <Plus />
        <span>اجراء سريع</span>
        </button>
    </div>


    <div className="navbar-left-section">
        <div className="user-profile">
        <img src={userAvatar} alt="User Avatar" className="user-avatar" />
        <div className="user-info">
            <span className="user-greeting">{userName}</span>
            <span className="user-location">{userLocation} <ChevronDown className="dropdown-icon" /></span>
        </div>
        </div>
    </div>
    
    </div>
);
};

export default AdminNavbar;