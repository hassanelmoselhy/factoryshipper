import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Search, Download } from "lucide-react";

import './css/OrdersPage.css';


export default function OrdersPage() {
  return (
    
    <div className="container py-4" dir="ltr" style={{ fontFamily: 'sans-serif',height:'100%' }}>
      <div className="card rounded-4 border shadow-sm  p-4">
       
        <div className="d-flex align-items-center mb-4 ">
          <div className="d-flex gap-2 align-items-center">
            <button className="btn btn-dark d-flex align-items-center gap-2 px-3 py-2">
              <Download size={16} /> تصدير التقرير
            </button>
          </div>

          <h3 className="mb-0 ms-auto">العمليات</h3>
        </div>

        {/* Filters row  */}
        <div className="row g-3 align-items-center mb-4">
          <div className="col-md-3">
            <select className="form-select rounded-3 text-start">
              <option>جميع العمليات</option>
              <option>استلام</option>
              <option>تعديل</option>
            </select>
          </div>

          <div className="col-md-3">
            <select className="form-select rounded-3 text-start">
              <option>جميع الموظفين</option>
              <option>أحمد محمد</option>
              <option>فاطمة علي</option>
            </select>
          </div>

          <div className="col-md-2">
            <select className="form-select rounded-3 text-start">
              <option>اليوم</option>
              <option>أمس</option>
              <option>هذا الأسبوع</option>
            </select>
          </div>

          <div className="col-md-4">
            <div className="input-group position-relative">
  <span
    className="position-absolute top-50"
    style={{
      transform: 'translateY(-50%)',
      right: '14px',      
      zIndex: 5 ,
    opacity: 0.5,        
    }}
  >
    <Search size={18} />
  </span>

  <input
    type="text"
    className="form-control rounded-3 shadow-none text-start pe-4" 
    placeholder="ابحث برقم الطلب"
   
    // style={{ paddingRight: '40px' }}
  />
</div>
          </div>
        </div>

        {/* Orders list */}
         <div className="d-flex gap-3 flex-column ">
    <div className="p-3 border rounded-lg " style={{maxHeight:'150px'}}>
    
    {/** card */}
        <div className="d-flex justify-content-between align-items-start ">
            <div className="text-muted text-right">١٥ يناير ٢٠٢٥، ٠٣:٤٥ م</div>

                <div className="d-flex flex-column  align-items-end mb-2">
                    <div className="d-flex align-items-center">
                        <span className="status-badge">تعديل</span>
                        <span className="mx-3 fw-bold">ORD-000843</span>
                        <span className="dot" />
                    </div>

                    <div className="">
                        <p className="text-muted mb-1"  >
                            <strong>الموظف:</strong>
                         فاطمة علي
                        </p>
                        <p className="text-muted mb-1">
                            <strong>من:</strong>
                         شارع النيل، المعادي
                        </p>
                        <p className="text-muted mb-1">
                            <strong>الي:</strong>
                         شارع الجامعة، الدقي
                        </p>
                        <p className="text-muted mb-1">
                            <strong>ملاحظه:</strong>
                          تعديل العنوان بناءً على طلب العميل
                        </p>
                    </div>

                </div>
        </div>
        


    </div>
    <div className="p-3 border rounded-lg " style={{maxHeight:'150px'}}>
    
    {/** card */}
        <div className="d-flex justify-content-between align-items-start ">
            <div className="text-muted text-right">١٥ يناير ٢٠٢٥، ٠٣:٤٥ م</div>

                <div className="d-flex flex-column  align-items-end mb-2">
                    <div className="d-flex align-items-center">
                        <span className="status-badge">تعديل</span>
                        <span className="mx-3 fw-bold">ORD-000843</span>
                        <span className="dot" />
                    </div>

                    <div className="">
                        <p className="text-muted mb-1"  >
                            <strong>الموظف:</strong>
                         فاطمة علي
                        </p>
                        <p className="text-muted mb-1">
                            <strong>من:</strong>
                         شارع النيل، المعادي
                        </p>
                        <p className="text-muted mb-1">
                            <strong>الي:</strong>
                         شارع الجامعة، الدقي
                        </p>
                        <p className="text-muted mb-1">
                            <strong>ملاحظه:</strong>
                          تعديل العنوان بناءً على طلب العميل
                        </p>
                    </div>

                </div>
        </div>
        


    </div>
    <div className="p-3 border rounded-lg " style={{maxHeight:'150px'}}>
    
    {/** card */}
        <div className="d-flex justify-content-between align-items-start ">
            <div className="text-muted text-right">١٥ يناير ٢٠٢٥، ٠٣:٤٥ م</div>

                <div className="d-flex flex-column  align-items-end mb-2">
                    <div className="d-flex align-items-center">
                        <span className="status-badge">تعديل</span>
                        <span className="mx-3 fw-bold">ORD-000843</span>
                        <span className="dot" />
                    </div>

                    <div className="">
                        <p className="text-muted mb-1"  >
                            <strong>الموظف:</strong>
                         فاطمة علي
                        </p>
                        <p className="text-muted mb-1">
                            <strong>من:</strong>
                         شارع النيل، المعادي
                        </p>
                        <p className="text-muted mb-1">
                            <strong>الي:</strong>
                         شارع الجامعة، الدقي
                        </p>
                        <p className="text-muted mb-1">
                            <strong>ملاحظه:</strong>
                          تعديل العنوان بناءً على طلب العميل
                        </p>
                    </div>

                </div>
        </div>
        


    </div>
</div>



        {/* stats cards (LTR flow) */}
        <div className="row mt-4 g-3">
          {[
            { num: 23, label: "إجمالي العمليات اليوم" },
            { num: 8, label: "عمليات الاستلام" },
            { num: 12, label: "عمليات الإخراج" },
            { num: 3, label: "عمليات التعديل" },
          ].map((s, i) => (
            <div key={i} className="col-md-3">
              <div className="card rounded-3 border-0 shadow-sm p-4 text-center">
                <div className="h3 mb-2 fw-bold">{s.num}</div>
                <div className="text-muted" dir="rtl">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* small custom styles to better match the design */}
      <style jsx>{`
        .card { background: #fff; }
        .form-select, .form-control { min-height: 44px; }
        .input-group-text { border-radius: 10px 0 0 10px; }
      `}</style>
    </div>
  );
}
