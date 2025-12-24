import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './css/SuccessFailureRate.css';

const SuccessFailureRate = ({ lang = 'ar' }) => {
  // Dummy data - can be replaced with API data
  const successfulOrders = 71;
  const unsuccessfulOrders = 11;
  const totalOrders = successfulOrders + unsuccessfulOrders;
  const successRate = ((successfulOrders / totalOrders) * 100).toFixed(1);

  const data = [
    { name: 'successful', value: successfulOrders },
    { name: 'unsuccessful', value: unsuccessfulOrders }
  ];

  const COLORS = ['#17a2b8', '#dc3545'];

  return (
    <div className="success-failure-rate-card">
      <div className="card-header">
        <h3>نسبة نجاح وفشل الاوردرات</h3>
      </div>
      
      <div className="chart-content">
        <div className="donut-chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-center">
            <div className="success-percentage">{successRate}%</div>
          </div>
        </div>

        <div className="stats-legend">
          <div className="legend-item successful">
            <div className="legend-indicator"></div>
            <div className="legend-content">
              <span className="legend-label">الطلبات الناجحة</span>
              <div className="legend-stats">
                <span className="legend-count">{successfulOrders}</span>
                <span className="legend-percentage">{Math.round((successfulOrders / totalOrders) * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="legend-item unsuccessful">
            <div className="legend-indicator"></div>
            <div className="legend-content">
              <span className="legend-label">الطلبات غير الناجحة</span>
              <div className="legend-stats">
                <span className="legend-count">{unsuccessfulOrders}</span>
                <span className="legend-percentage">{Math.round((unsuccessfulOrders / totalOrders) * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="legend-item total">
            <span className="legend-label">الإجمالي</span>
            <span className="legend-count">{totalOrders}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessFailureRate;
