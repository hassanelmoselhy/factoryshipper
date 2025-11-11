import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./css/avatar.css";
import useUserStore from "../Store/UserStore/userStore";

export default function Avatar({ letter = "A", title = "Avatar A" }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const user=useUserStore((state)=>state.user)

 const RevokeToken = async () => {
    const url = "https://stakeexpress.runasp.net/api/Accounts/revokeToken";
      
    try {
   
      const response = await axios.post(
        url,
        {}, 
        {
          headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
            Authorization: `Bearer ${user?.token}`,
          },
          withCredentials:true
        }
      );

      console.log("success", response.data);
      sessionStorage.clear()
      return response.data;
    } catch (err) {
      
      if (err.response) {
       
        console.log("Fail", {
          status: err.response.status,
          data: err.response.data,
        });
      } else {
   
        console.log("Failed", err.message);
      }
 
      throw err;
    }
  };
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
          <Link to="/profile" className="dropdown-link d-flex align-items-center justify-content-between" onClick={() => setOpen(false)}>
            My Profile
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
          <Link to="/change-password" className="dropdown-link d-flex align-items-center justify-content-between" onClick={() => setOpen(false)}>
            Change Password
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </Link>
          <Link to="/" className="dropdown-link d-flex align-items-center justify-content-between" onClick={() => {RevokeToken() ;setOpen(false)}}>
            Logout
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
          </Link>
        </div>
      )}
    </div>
  );
}
