import React from "react";
import UseLoadingStore from "../Store/LoadingController/Loadingstore";
import "./css/LoadingOverlay.css";

const LoadingOverlay = () => {
  // Connect to the store
  const { Loading } = UseLoadingStore();

  return (
    <div className={`loading-overlay ${Loading ? "active" : ""}`}>
      <div className="loading-content">
        {/* Favicon Logo */}
        <img
          src="/favicon.png"
          alt="StakeExpress Logo"
          className="loading-logo"
        />

        {/* Text */}
        <span className="loading-text">StakeExpress</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
