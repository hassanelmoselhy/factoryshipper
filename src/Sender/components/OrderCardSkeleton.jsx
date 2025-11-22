
const OrderCardSkeleton = () => {
  return (
    <article className="order-card-2 h-100 d-flex flex-column">
      {/* Status badge skeleton */}
      <div className="position-absolute" style={{ top: '12px', right: '12px' }}>
        <span className="placeholder col-12" style={{ width: '80px', height: '24px', borderRadius: '12px' }}></span>
      </div>

      <div className="oc-top">
        <div className="oc-icon">
          <div className="oc-icon__bg placeholder-glow">
            <span className="placeholder col-12" style={{ width: '40px', height: '40px', borderRadius: '8px' }}></span>
          </div>
        </div>

        <div className="oc-number">
          <div className="oc-number__label">
            <span className="placeholder col-8 placeholder-glow"></span>
          </div>
          <div className="oc-number__name">
            <span className="placeholder col-10 placeholder-glow"></span>
          </div>
        </div>
      </div>

      <div className="oc-info d-flex flex-column gap-3">
        <div className="oc-row">
          <div className="oc-item">
            <span className="placeholder col-12 placeholder-glow"></span>
          </div>
          <div className="oc-item">
            <span className="placeholder col-12 placeholder-glow"></span>
          </div>
        </div>

        <div className="oc-row">
          <div className="oc-item">
            <span className="placeholder col-12 placeholder-glow"></span>
          </div>
          <div className="oc-item">
            <span className="placeholder col-8 placeholder-glow"></span>
          </div>
        </div>
      </div>

      <hr className="oc-divider border" />

      <div className="oc-desc">
        <p className="oc-desc__text text-center">
          <span className="placeholder col-10 placeholder-glow"></span>
        </p>
      </div>

      <div className="oc-badges">
        <span className="placeholder col-4 placeholder-glow" style={{ height: '28px', borderRadius: '14px' }}></span>
        <span className="placeholder col-4 placeholder-glow" style={{ height: '28px', borderRadius: '14px' }}></span>
      </div>

      <div className="oc-actions mt-auto">
        <div className="oc-actions-left">
          <span className="placeholder col-12 placeholder-glow" style={{ width: '36px', height: '36px', borderRadius: '8px' }}></span>
          <span className="placeholder col-12 placeholder-glow" style={{ width: '36px', height: '36px', borderRadius: '8px' }}></span>
          <span className="placeholder col-12 placeholder-glow" style={{ width: '36px', height: '36px', borderRadius: '8px' }}></span>
        </div>

        <div className="oc-actions-right">
          <span className="placeholder col-12 placeholder-glow" style={{ width: '120px', height: '40px', borderRadius: '8px' }}></span>
        </div>
      </div>
    </article>
  );
};

export default OrderCardSkeleton;
