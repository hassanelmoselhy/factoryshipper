import React, { useState } from 'react'; 
import './css/Topbar.css';
import { FaBell, FaPlus, FaTruck, FaUndo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const [showActions, setShowActions] = useState(false);
  const navigate = useNavigate(); // ✅ Hook للتنقل

  const handleCreateClick = () => {
    setShowActions(prev => !prev);
  };

  const goToPage = (type) => {
    setShowActions(false);
    if (type === 'shipping') {
      navigate('/shipping'); // ✅ يوديك لصفحة طلب الإرسال
    } else if (type === 'return') {
      navigate('/return'); // ✅ يوديك لصفحة طلب الاسترجاع
    }
  };

  return (
    <>
      <div className="top-bar">
        <div className="left-icons">
          <div className="create-dropdown">
            <button className="icon-button" onClick={handleCreateClick}>
              <FaPlus /> <span>إنشاء</span>
            </button>

            {showActions && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => goToPage('shipping')}>
                  <FaTruck />طلب انشاء 
                </div>
                <div className="dropdown-item" onClick={() => goToPage('return')}>
                  <FaUndo /> طلب استرجاع
                </div>
              </div>
            )}
          </div>

          <button className="icon-button">
            <FaBell />
          </button>
        </div>

        <div className="user-info">
          <img src="hassan.jpg" alt="User" className="user-img" />
          <span className="user-name">حسن موسى</span>
        </div>
      </div>
    </>
  );
};

export default TopBar;
