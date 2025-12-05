import React from "react";
import UseLoadingStore from "../Store/LoadingController/Loadingstore";
import "./css/LoadingOverlay.css";

const LoadingOverlay = () => {
  // Connect to the store
  const { Loading } = UseLoadingStore();

  return (
    <div className={`loading-overlay ${Loading ? "active" : ""}`}>
      <div className="loading-content">
        {/* Logo with enhanced animations */}
        <div className="loading-logo-wrapper">
          <img
            src="/favicon.png"
            alt="Stake Express Logo"
            className="loading-logo"
          />
          {/* Circular spinner behind logo */}
          <div className="loading-spinner"></div>
        </div>

        {/* Animated "Stake Express" text */}
        <div className="loading-text-wrapper">
          <h1 className="loading-brand-name">
            {"Stake Express".split("").map((char, index) => (
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
