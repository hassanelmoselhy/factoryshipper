import React from 'react';
import {Lock,MoreHorizontal} from 'lucide-react'
import './css/PricingRulesTable.css';

export default function PricingRulesTable() {
  const rows = [
    {
      city: 'القاهرة',
      area: 'القاهرة الكبرى',
      weightRange: '0-5 كجم',
      group: 'عادي',
      basePrice: '50 ج.م',
      extraWeightFee: '10 ج./م/كجم',
      cashOnDeliveryFee: '1% (فوق 3,000 ج.م)',
      status: 'نشط',
    },
    {
      city: 'الجيزة',
      area: 'الجيزة',
      weightRange: '0-5 كجم',
      group: 'عادي',
      basePrice: '45 ج.م',
      extraWeightFee: '8 ج./م/كجم',
      cashOnDeliveryFee: '1.5% (فوق 2,500 ج.م)',
      status: 'نشط',
    },
    {
      city: 'الإسكندرية',
      area: 'الإسكندرية',
      weightRange: '5-10 كجم',
      group: 'عادي',
      basePrice: '75 ج.م',
      extraWeightFee: '12 ج./م/كجم',
      cashOnDeliveryFee: '1% (فوق 3,000 ج.م)',
      status: 'نشط',
    },
    {
      city: 'القاهرة',
      area: 'القاهرة الكبرى',
      weightRange: '0-5 كجم',
      group: 'VIP',
      basePrice: '35 ج.م',
      extraWeightFee: '8 ج./م/كجم',
      cashOnDeliveryFee: '0.5% (فوق 5,000 ج.م)',
      status: 'نشط',
    },
  ];

  return (
    <div dir="rtl" >
  
      

      <div className="pricing-card">
        <div className="rules-header mb-3">
          <div>
            <div className="rules-title">قواعد التسعير <span style={{color:'#94a3b8',fontWeight:500}}> (4)</span></div>
            <div className="rules-sub">إدارة جميع قواعد التسعير في النظام</div>
          </div>
          <div className="text-end" style={{minWidth:220}}>
            {/* Right header area intentionally left simple to match screenshot */}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th className="text-start">المدينة/المنطقة</th>
                <th className="text-center">نطاق الوزن</th>
                <th className="text-center">مجموعة التاجر</th>
                <th className="text-center">السعر الأساسي</th>
                <th className="text-center">رسوم الوزن الزائد</th>
                <th className="text-center">رسوم الدفع عند الاستلام</th>
                <th className="text-center">الحالة</th>
                <th className="text-end">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="city-cell">
                      <div style={{display:'flex',flexDirection:'column'}}>
                        <div className="city-name">{r.city}</div>
                        <div className="area-muted">{r.area}</div>
                      </div>
                    </div>
                  </td>

                  <td className="text-center">
                    <span className="badge-range">
                      {r.weightRange} <Lock size={14} />
                    </span>
                  </td>

                  <td className="text-center">
                    <span className={"badge-group"} style={{background: r.group === 'VIP' ? '#0b64d6' : '#f1f5f9', color: r.group === 'VIP' ? '#fff' : '#111827'}}>
                      {r.group}
                    </span>
                  </td>

                  <td className="text-center price-cell">{r.basePrice}</td>

                  <td className="text-center muted-small">{r.extraWeightFee}</td>

                  <td className="text-center muted-small">{r.cashOnDeliveryFee}</td>

                  <td className="text-center">
                    <span className="status-pill">{r.status}</span>
                  </td>

                  <td className="text-end">
                    <div className="d-flex align-items-center justify-content-center">
                      
                      <button className="actions-btn" aria-label="more">
                        <MoreHorizontal />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
