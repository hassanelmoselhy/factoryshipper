import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// icons
import { FaTimesCircle, FaEdit, FaInfoCircle } from "react-icons/fa";
import { MoreVertical } from "lucide-react";

import "./css/ActionsList.css"; 
import "bootstrap/dist/js/bootstrap.bundle"; 

const ActionsList = ({ handleopenSchedule }) => {
  return (
    <div className="dropdown">
     
      <button
        className="btn btn-outline-primary btn-sm ts-toggle"
        type="button"
        id="actionsDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="More actions"
      >
        <MoreVertical size={18} />
      </button>

      <ul
        className="dropdown-menu dropdown-menu-end ts-menu"
        aria-labelledby="actionsDropdown"
      >
        <li>
          <button
            type="button"
            className="dropdown-item d-flex align-items-center gap-2 ts-item text-danger"
          >
            <FaTimesCircle className="ts-item-icon" />
            <span>Cancel</span>
          </button>
        </li>

        <li>
          <button
            type="button"
            className="dropdown-item d-flex align-items-center gap-2 ts-item"
            onClick={handleopenSchedule}
          >
            <FaEdit className="ts-item-icon" />
            <span>Edit Schedule</span>
          </button>
        </li>

        <li>
          <button
            type="button"
            className="dropdown-item d-flex align-items-center gap-2 ts-item"
          >
            <FaInfoCircle className="ts-item-icon text-muted" />
            <span>Details</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ActionsList;
