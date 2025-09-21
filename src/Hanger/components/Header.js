import React from 'react';
import './css/Header.css';
import { FaCube } from 'react-icons/fa';

const Header = () => {
return (
    <header className="header">
    <div className="header-main">
        <FaCube className="header-icon" />
        <h1 className="header-title">إدارة مهام استلام الطرود من التجار</h1>
        <button className="new-request-btn">+ طلب استلام جديد</button>
    </div>
    <div className="user-profile">
        <div className="user-info">
        <span className="user-name">عبدالله أحمد</span>
        <span className="user-role">مدير</span>
        </div>
        <div className="user-avatar">ع</div>
    </div>
    </header>
);
};

export default Header;
