import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom"; // ✅ استيراد Link
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/avatar.css";

export default function Avatar({ letter = "A", title = "Avatar A" }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="avatar-container" ref={menuRef}>
      <div className="avatar-wrapper" onClick={() => setOpen(!open)}>
        <span
          className="avatar-bootstrap avatar-gradient-blue-cyan"
          role="img"
          aria-label={title}
          title={title}
        >
          {letter}
        </span>
        <span className={`arrow ${open ? "open" : ""}`}>&#9662;</span>
      </div>

      {open && (
        <div className="dropdown-menu-avatar">
          <Link to="/profile" className="dropdown-link" onClick={() => setOpen(false)}>
            My Profile
          </Link>
          <Link to="/change-password" className="dropdown-link" onClick={() => setOpen(false)}>
            Change Password
          </Link>
          <Link to="/" className="dropdown-link" onClick={() => setOpen(false)}>
            Logout
          </Link>
        </div>
      )}
    </div>
  );
}
