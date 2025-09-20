import { ClipLoader } from "react-spinners";
import "./css/LoadingOverlay.css";

const LoadingOverlay = ({
  loading = false,
  message = "please wait",
  color = "#ffffff",
  size = 48,
  ariaLabel = "Loading"
}) => {
  if (!loading) return null;

  return (
    <div
      className="global-loading-overlay"
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      aria-busy="true"
    >
      <div className="global-loading-content">
        <ClipLoader color={color} size={size} />
        <div className="global-loading-text">{message}</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
