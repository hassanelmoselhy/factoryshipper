import React, { useEffect, useState } from "react";
import "./css/Topbar.css";
import { FaBell, FaPlus, FaTruck, FaUndo } from "react-icons/fa";
import {Calendar1} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import useUserStore from "../../Store/UserStore/userStore";
import useLanguageStore from "../../Store/LanguageStore/languageStore";
import Avatar from "../../Components/Avatar";
import RescheduleModal from "../../Components/RescheduleModal";

const TopBar = () => {
  const user = useUserStore((state) => state.user);
  const Setuser = useUserStore((state) => state.SetUser);
  const [showActions, setShowActions] = useState(false);
  const navigate = useNavigate();
  const { lang, toggleLang } = useLanguageStore();
  const [isRescheduleOpen,SetisRescheduleOpen]=useState(false)
  const handleCreateClick = () => {
    setShowActions((prev) => !prev);
  };

  useEffect(() => {
    console.log('from store',user)
   

  }, [user]);

  const goToPage = (type) => {
    setShowActions(false);
    if (type === "shipping") {
      navigate("/shipping");
    } else if (type === "return") {
      navigate("/return");
    }
  };

  return (
    <>
        <RescheduleModal show={isRescheduleOpen} onClose={()=>SetisRescheduleOpen(false)} />
    <div className="top-bar">
      <div className="left-icons">
        <div className="create-dropdown">
          <button className="icon-button" onClick={handleCreateClick}>
            <FaPlus /> <span>{lang === "ar" ? "إنشاء" : "Create"}</span>
          </button>

          {showActions && (
            <div
              className="dropdown-menu dropdown-menu-end show"
              style={{ position: "absolute" }}
            >
              <button
                type="button"
                className="dropdown-item"
                onClick={() => goToPage("shipping")}
              >
                <FaTruck /> {lang === "ar" ? "طلب إنشاء" : "New Shipping"}
              </button>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => navigate("/return")}
              >
                <FaUndo /> {lang === "ar" ? "طلب استرجاع" : "Return  Request"}
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => SetisRescheduleOpen(true)}
              >
                <Calendar1 />
                 {lang === "ar" ? "طلب جدوله" : "reschedule  Request"}
              </button>
            </div>
          )}
        </div>

        {/* 🔔 زر الإشعارات */}
        <button className="icon-button">
          <FaBell />
        </button>

        {/* 🌐 زر اللغة */}
        <button className="icon-button" onClick={toggleLang}>
          {lang.toUpperCase()}
        </button>
      </div>

      {/* 👤 بيانات المستخدم */}
      <div className="user-info ">
        <div className="d-flex align-items-center gap-2">

        <span className="user-name">{user?.firstName }</span>
        <Avatar letter={user?.firstName[0]}/>
        </div>
        
        
        <div>

        <span className="">{user?.governorate+" "+user?.city }</span>
        </div>
      </div>
    </div>
    </>
  
);
};

export default TopBar;
