import { useNavigate } from "react-router-dom";
import { MoreVertical, XCircle, Info } from "lucide-react";
import { Dropdown } from "react-bootstrap";
import styles from './css/ActionsList.module.css';

const ActionsList = ({ id, requestype, showModal }) => {
  const navigate = useNavigate();

  const goToDetails = () => {
    console.log("Navigating to details for request:", requestype, id);
    if (requestype === "PickupRequest") {
      navigate(`/pickuprequest/${id}`);
    } else {
      navigate(`/request/${requestype}/${id}`);
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="outline-primary"
        size="sm"
        className={styles['ts-toggle']}
      >
        <MoreVertical size={18} />
      </Dropdown.Toggle>

      <Dropdown.Menu align="end" className="ts-menu">
        <Dropdown.Item
          onClick={showModal}
          className="d-flex align-items-center gap-2 ts-item"
        >
          <XCircle size={18} className="ts-item-icon" />
          <span>Cancel</span>
        </Dropdown.Item>

        <Dropdown.Item
          onClick={goToDetails}
          className="d-flex align-items-center gap-2 ts-item"
        >
          <Info size={18} className="ts-item-icon text-muted" />
          <span>Details</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ActionsList;
