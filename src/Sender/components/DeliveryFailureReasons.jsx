import React from 'react';
import './css/DeliveryFailureReasons.css';

const DeliveryFailureReasons = ({ lang = 'ar' }) => {
  // Dummy data - can be replaced with API data
  const failureReasons = [
    {
      id: 1,
      reason: 'العميل رفض استلام الطلب.',
      percentage: 33.3
    },
    {
      id: 2,
      reason: 'سبب غير واضح',
      percentage: 25
    },
    {
      id: 3,
      reason: 'طلب العميل تأجيل التوصيل ليوم آخر',
      percentage: 8.3
    }
  ];

  return (
    <div className="delivery-failure-reasons-card">
      <div className="card-header ">
        <h3>أسباب عدم اتمام التوصيل</h3>
      </div>
      
      <div className="reasons-table">
        <div className="table-header">
          <div className="header-col number">#</div>
          <div className="header-col reason">السبب</div>
          <div className="header-col percentage">النسبة المئوية</div>
        </div>

        <div className="table-body">
          {failureReasons.map((item) => (
            <div key={item.id} className="table-row">
              <div className="col number">{item.id}</div>
              <div className="col reason">{item.reason}</div>
              <div className="col percentage">
                <div className="percentage-bar-container">
                  <div 
                    className="percentage-bar" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                  <span className="percentage-text">{item.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryFailureReasons;
