import React, { useEffect, useState } from "react";
import "./css/Topbar.css";
import { FaBell, FaPlus, FaTruck, FaUndo } from "react-icons/fa";
import { Calendar1, Replace } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../Store/UserStore/userStore";
import useLanguageStore from "../../Store/LanguageStore/languageStore";
import Avatar from "../../Components/Avatar";
import RescheduleModal from "../../Components/RescheduleModal";
import ReplaceModal from "../../Components/ReplaceModal";

const TopBar = () => {
  const user = useUserStore((state) => state.user);
  const Setuser = useUserStore((state) => state.SetUser);
  const [showActions, setShowActions] = useState(false);
  const [isRescheduleOpen, SetisRescheduleOpen] = useState(false);
  const [isReplaceOpen, SetisReplaceOpen] = useState(false);
  const navigate = useNavigate();
  const { lang, toggleLang } = useLanguageStore();

  const handleCreateClick = () => {
    setShowActions((prev) => !prev);
  };

  useEffect(() => {
    console.log("from store", user);
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
      {/* مودال جدولة */}
      <RescheduleModal show={isRescheduleOpen} onClose={() => SetisRescheduleOpen(false)} />

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
                  <FaUndo /> {lang === "ar" ? "طلب استرجاع" : "Return Request"}
                </button>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => SetisRescheduleOpen(true)}
                >
                  <Calendar1 />
                  {lang === "ar" ? "طلب جدولة" : "Reschedule Request"}
                </button>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => SetisReplaceOpen(true)}
                >
                  <Replace />
                  {lang === "ar" ? "طلب استبدال" : "Replace Request"}
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
