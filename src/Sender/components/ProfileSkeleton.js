import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="shipper-profile">
      {/* Header Skeleton */}
      <div className="profile-header">
        <div className="header-left-section">
          <div className="avatar-circle placeholder-glow" style={{ border: 'none' }}>
            <span className="placeholder col-12" style={{ height: '100%', width: '100%', borderRadius: '50%', display: 'block' }}></span>
          </div>
          <div className="header-text w-100">
            <div className="name-id placeholder-glow">
              <h1 className="placeholder col-6 rounded"></h1>
              <div className="shipper-id-badge placeholder-glow border-0 p-0">
                <span className="placeholder col-12 rounded" style={{ width: '100px', height: '24px', display: 'block' }}></span>
              </div>
            </div>
            <p className="sub-title placeholder-glow">
              <span className="placeholder col-3 rounded"></span>
            </p>
          </div>
        </div>
      </div>

      <div className="cards-grid">
        {/* Personal Info Skeleton */}
        <div className="profile-card">
          <div className="card-header placeholder-glow">
            <h3 className="placeholder col-6 rounded"></h3>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div className="isolated-field" key={i}>
              <div className="field-content w-100">
                <div className="icon placeholder-glow" style={{ width: 24, height: 24, border: 'none' }}>
                  <span className="placeholder col-12 h-100 rounded-circle"></span>
                </div>
                <div className="field-info w-100 placeholder-glow">
                  <strong className="placeholder col-4 rounded mb-1 d-block"></strong>
                  <p className="placeholder col-8 rounded m-0"></p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Addresses Skeleton */}
        <div className="profile-card">
          <div className="card-header placeholder-glow d-flex justify-content-between align-items-center">
            <h3 className="placeholder col-4 rounded m-0"></h3>
            <span className="placeholder col-2 rounded" style={{ height: '36px', width: '80px' }}></span>
          </div>
          <div className="addresses-container">
            <div className="address-box placeholder-glow">
              <div className="address-header mb-2">
                <strong className="placeholder col-5 rounded"></strong>
              </div>
              <p className="placeholder col-12 rounded mb-1"></p>
              <p className="placeholder col-8 rounded mb-1"></p>
              <p className="placeholder col-6 rounded"></p>
            </div>
          </div>
        </div>

        {/* Company Info Skeleton */}
        <div className="profile-card">
          <div className="card-header placeholder-glow">
            <h3 className="placeholder col-6 rounded"></h3>
          </div>
          <div className="card-body placeholder-glow">
            <p className="placeholder col-12 rounded mb-2"></p>
            <p className="placeholder col-10 rounded mb-2"></p>
            <p className="placeholder col-8 rounded"></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
