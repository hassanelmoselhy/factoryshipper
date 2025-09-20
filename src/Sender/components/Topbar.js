import React, { useEffect, useState } from 'react';
import './css/Topbar.css';
import { FaBell, FaPlus, FaTruck, FaUndo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../Store/UserStore/userStore';
import useLanguageStore from '../../Store/LanguageStore/languageStore';

const TopBar = () => {
  const user = useUserStore((state) => state.user);
  const [showActions, setShowActions] = useState(false);
  const navigate = useNavigate();
  const { lang, toggleLang } = useLanguageStore(); // ✅ هنا كل حاجة

  const handleCreateClick = () => {
    setShowActions((prev) => !prev);
  };

  useEffect(() => {
    if (user) {
      console.log('user info =', user);
    } else console.log('no user info');
  }, [user]);

  const goToPage = (type) => {
    setShowActions(false);
    if (type === 'shipping') {
      navigate('/shipping');
    } else if (type === 'return') {
      navigate('/return');
    }
  };

  return (
    <div className="top-bar">
      <div className="left-icons">
        <div className="create-dropdown">
          <button className="icon-button" onClick={handleCreateClick}>
            <FaPlus /> <span>{lang === 'ar' ? 'إنشاء' : 'Create'}</span>
          </button>

          {showActions && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => goToPage('shipping')}>
                <FaTruck /> {lang === 'ar' ? 'طلب إنشاء' : 'New Shipping'}
              </div>
              <div className="dropdown-item" onClick={() => goToPage('return')}>
                <FaUndo /> {lang === 'ar' ? 'طلب استرجاع' : 'Return Request'}
              </div>
            </div>
          )}
        </div>

        <button className="icon-button">
          <FaBell />
        </button>

        {/* ✅ زر اللغة */}
        <button className="icon-button" onClick={toggleLang}>
          {lang.toUpperCase()}
        </button>
      </div>

      <div className="user-info">
        <img src="hassan.jpg" alt="User" className="user-img" />
        <span className="user-name">{user?.userName}</span>
      </div>
    </div>
  );
};

export default TopBar;
