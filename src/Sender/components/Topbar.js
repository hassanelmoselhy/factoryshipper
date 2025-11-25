import React, { useEffect, useState } from "react";
import "./css/Topbar.css";
import { FaBell, FaPlus, FaTruck, FaUndo } from "react-icons/fa";
import { Calendar1, Replace } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../Store/UserStore/userStore";
import useLanguageStore from "../../Store/LanguageStore/languageStore";
import Avatar from "../../Components/Avatar";
import ReplaceModal from "../../Components/ReplaceModal";

const TopBar = () => {
  const user = useUserStore((state) => state.user);
  const [showActions, setShowActions] = useState(false);
  const [isRescheduleOpen, SetisRescheduleOpen] = useState(false);
  const [isReplaceOpen, SetisReplaceOpen] = useState(false);
  const navigate = useNavigate();
  const { lang, toggleLang } = useLanguageStore();

  const handleCreateClick = () => {
    setShowActions((prev) => !prev);
  };

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
      {/* مودال جدولة
      <RescheduleModal show={isRescheduleOpen} onClose={() => SetisRescheduleOpen(false)} /> */}

      {/* مودال الاستبدال */}
      <ReplaceModal show={isReplaceOpen} onClose={() => SetisReplaceOpen(false)} />

      <div className="top-bar">
        <div className="left-icons">
          {/* زر إنشاء الطلب */}
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
                  className="dropdown-item d-flex justify-content-between align-items-center"
                  onClick={() => goToPage("shipping")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package-plus-icon lucide-package-plus"><path d="M16 16h6"/><path d="M19 13v6"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>
                  {lang === "ar" ? "طلب إنشاء شحنه" : "New Shipment"}
                </button>

                <button
                  type="button"
                  className="dropdown-item d-flex justify-content-between align-items-center"
                  onClick={() => navigate("/return")}
                >
                  <FaUndo /> {lang === "ar" ? "طلب استرجاع" : "Return Request"}
                </button>


                <button
                  type="button"
                  className="dropdown-item d-flex justify-content-between align-items-center"
                  onClick={() => navigate("/extchange-request")}
                >
                  <Replace />
                  {lang === "ar" ? "طلب استبدال" : "Extchange Request"}
                </button>
                <button
                  type="button"
                  className="dropdown-item d-flex justify-content-between align-items-center"
                  onClick={() => navigate("/Pickuporder")}
                >
                  <FaTruck />
                  {lang === "ar" ? "طلب أستلام شحنه" : "Pickup Request"}
                  
                </button>
              </div>
            )}
          </div>

          {/*  الإشعارات */}
          <button className="icon-button">
            <FaBell />
          </button>

          {/* اللغة */}
          <button className="icon-button" onClick={toggleLang}>
            {lang.toUpperCase()}
          </button>
        </div>

        {/*  بيانات المستخدم */}
        <div className="user-info">
          <div className="d-flex align-items-center gap-2">
            <span className="user-name">{user?.firstName}</span>
            <Avatar letter={user?.firstName?.[0]} />
          </div>
          <div>
            <span>{user?.governorate + " " + user?.city}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBar;
