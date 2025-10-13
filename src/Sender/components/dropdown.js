import React, { useState } from "react";
import { FaTimesCircle, FaEdit, FaInfoCircle } from "react-icons/fa";
import './css/dropdown.css';


const ActionsDropdown = ({ taskId,handleopenSchedule }) => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
    console.log("Toggle menu for:", taskId);
  };

  return (
    <div className={`actions-btns ${open ? "open" : ""}`}>
      <button className="dropdown-toggle" onClick={toggleMenu}>
        Actions 
      </button>

      <ul className="dropdown-menu" onClick={toggleMenu}>
        <li className="cancel-item">
          <FaTimesCircle /> Cancel
        </li>
        <li onClick={handleopenSchedule}>
          <FaEdit /> Edit Schedule
        </li>
        <li>
          <FaInfoCircle /> Details
        </li>
      </ul>
    </div>
  );
};

export default ActionsDropdown;
