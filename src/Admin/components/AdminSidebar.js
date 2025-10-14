import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/AdminSidebar.css';
import { Building2, Calculator, DollarSign, FileText, LayoutDashboard, LineSquiggle, Package, Settings, ShieldCheck, Users } from 'lucide-react';
import { FaChevronLeft, FaChevronRight, FaCube } from 'react-icons/fa';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
return (
    <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'} rtl`}>
    <div className="sidebar-header">
        <button onClick={toggleSidebar} className="toggle-btn">
        {isOpen ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        {isOpen && (
        <div className="logo-container">
            <FaCube className="logo-icon" />
            <h3>Stake Express</h3>
        </div>
        )}
    </div>
    <ul className="sidebar-menu">
        <li>
        <Link to="/admin/dashboard" 
        className={`sidebar-item ${location.pathname === '/admin' ? 'active' : ''}`}>
            <LayoutDashboard  className="icon" />
            {isOpen && <span>لوحة التحكم</span>}
        </Link>
        </li>
        <li>
        <Link to="/admin/orders" className={`sidebar-item ${location.pathname === '/admin/orders' ? 'active' : ''}`}>
            <Package className="icon" />
            {isOpen && <span>الطلبات</span>}
        </Link>
        </li>
        <li>
        <Link to="/admin/merchants" className={`sidebar-item ${location.pathname === '/admin/merchants' ? 'active' : ''}`}>
            <Users className="icon" />
            {isOpen && <span>التجار</span>}
        </Link>
        </li>
        <li>
        <Link to="/admin/branches" className={`sidebar-item ${location.pathname === '/admin/branches' ? 'active' : ''}`}>
            <Building2 className="icon" />
            {isOpen && <span>الفروع</span>}
        </Link>
        </li>
        <li>
        <Link to="/admin/tracking-paths" className={`sidebar-item ${location.pathname === '/admin/tracking-paths' ? 'active' : ''}`}>
            <LineSquiggle className="icon" />
            {isOpen && <span>المسارات والتتبع</span>}
        </Link>
        </li>
        <li>
        <Link to="/admin/employees-roles" className={`sidebar-item ${location.pathname === '/admin/employees-roles' ? 'active' : ''}`}>
            <ShieldCheck className="icon" />
            {isOpen && <span>الموظفون والأدوار</span>}
        </Link>
        </li>
        <li>
        <Link to="/admin/finance" className={`sidebar-item ${location.pathname === '/admin/finance' ? 'active' : ''}`}>
            <DollarSign className="icon" />
            {isOpen && <span>الشؤون المالية</span>}
        </Link>
        </li>
        <li>
        <Link to="/admin/shipping-pricing" className={`sidebar-item ${location.pathname === '/admin/shipping-pricing' ? 'active' : ''}`}>
            <Calculator className="icon" />
            {isOpen && <span>تسعيرة الشحن</span>}
        </Link>
        </li>
        <li>
        <Link to="/admin/history-logs" className={`sidebar-item ${location.pathname === '/admin/history-logs' ? 'active' : ''}`}>
            <FileText className="icon" /> 
            {isOpen && <span>السجلات والتاريخ</span>}
        </Link>
        </li>
        <li>
        <Link to="/admin/settings" className={`sidebar-item ${location.pathname === '/admin/settings' ? 'active' : ''}`}>
            <Settings className="icon" />
            {isOpen && <span>الإعدادات</span>}
        </Link>
        </li>
    </ul>
    </div>
);
};

export default AdminSidebar;