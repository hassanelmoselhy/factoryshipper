import React from "react";
import UseLoadingStore from "../Store/LoadingController/Loadingstore";
import "./css/LoadingOverlay.css";
import ZoneExpressLogo from "../Images/ZoneExpress.jpeg";

const LoadingOverlay = ({ isActive }) => {
  // Connect to the store
  const { Loading } = UseLoadingStore();

  const isVisible = isActive !== undefined ? isActive : Loading;

  return (
    <div className={`loading-overlay ${isVisible ? "active" : ""}`}>
      <div className="loading-content">
        {/* Logo with enhanced animations */}
        <div className="loading-logo-wrapper">
          <img
            src={ZoneExpressLogo}
            alt="Zone Express Logo"
            className="loading-logo"
          />
          {/* Circular spinner behind logo */}
        </div>

        {/* Animated "Zone Express" text */}
        <div className="loading-text-wrapper">
          <h1 className="loading-brand-name">
            {"Zone Express".split("").map((char, index) => (
              <span 
                key={index} 
                className="loading-letter"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          
          {/* Animated loading dots */}
          <span className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </span>
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className="loading-progress-bar">
        <div className="loading-progress-fill"></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
