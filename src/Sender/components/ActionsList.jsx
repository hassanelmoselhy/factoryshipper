import { useNavigate } from "react-router-dom";
import { MoreVertical } from "react-feather";
import { FaTimesCircle, FaInfoCircle } from "react-icons/fa";

const ActionsList = ({  id,requestype }) => {
  const navigate = useNavigate();

  const goToDetails = () => {
    console.log("Navigating to details for request:", requestype, id);
    navigate(`/request/${requestype}/${id}`);
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-primary btn-sm ts-toggle"
        data-bs-toggle="dropdown"
      >
        <MoreVertical size={18} />
      </button>

      <ul className="dropdown-menu dropdown-menu-end ts-menu">
        <li>
          <button className="dropdown-item d-flex align-items-center gap-2 ts-item">
            <FaTimesCircle className="ts-item-icon" />
            <span>Cancel</span>
          </button>
        </li>

        
        <li>
          <button
            className="dropdown-item d-flex align-items-center gap-2 ts-item"
            onClick={goToDetails}
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
