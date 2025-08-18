import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AiOutlineCalendar } from "react-icons/ai";
import "./css/DeliverySchedule.css"; 

const samplePeriods = [
  { id: 1, title: "الفترة الصباحية", time: "08:00 - 12:00", scheduled: 15, status: "مجدول" },
  { id: 2, title: "فترة الظهيرة", time: "12:00 - 16:00", scheduled: 23, status: "جاري التنفيذ" },
  { id: 3, title: "الفترة المسائية", time: "16:00 - 20:00", scheduled: 8, status: "لم يبدأ" },
];

export default function DeliverySchedule() {
  const [date, setDate] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [selectedPeriod, setSelectedPeriod] = useState(samplePeriods[0].id);

  return (
    
      <div className="container">
        <div className="card shadow-sm rounded-3">
          <div className="card-body">
        
            <div className="d-flex align-items-center justify-content-start mb-3">
              <AiOutlineCalendar size={22} />
              
                <h5 className="m-1 fw-bold  fs-6">جدولة خروج الشحنات للتوصيل</h5>
              
            </div>

    
            <div className="row g-3 align-items-end mb-4">
 
              <div className="col-md-5">
                <label className="form-label fw-semibold">تاريخ التوصيل</label>
                <div className="input-group">
                  <input
                    type="date"
                    className="form-control py-3"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  {/* <span className="input-group-text bg-white border-start-0">
                    <AiOutlineCalendar />
                  </span> */}
                </div>
              </div>
              <div className="col-md-7">
                <label className="form-label fw-semibold">فترة التوصيل</label>
                <div className="position-relative delivery-period-select">
                  <select
                    className="form-select py-3 pe-4"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                  >
                    {samplePeriods.map((p) => (
                      <option key={p.id} value={p.id} style={{direction: "ltr"}}>
                        ({p.time}) {p.title} 
                      </option>
                    ))}
                  </select>
                </div>
                
              </div>

            </div>


            <div className="mb-2">
              <div className=" p-3 bg-light border rounded-2 mb-3">
                <div className="fw-bold">جدولة اليوم</div>
              </div>

              <div >
                {samplePeriods.map((p) => {
                  const selected = p.id === selectedPeriod;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`list-group-item list-group-item-action d-flex align-items-center gap-3 mb-3 rounded-3 border ${selected ? "period-selected" : ""}`}
                      onClick={() => setSelectedPeriod(p.id)}
                    >

                      <div className="flex-grow-1 text-end">
                        <div className="fw-bold fs-6">{p.title}</div>
                        <div className="text-muted small mt-1">
                          <span>{p.time}</span>
                          <span className="mx-2">|</span>
                          <span>{p.scheduled} طرد مجدول</span>
                        </div>
                      </div>

                      <div style={{ minWidth: 110 }}>
                        <span className={`badge rounded-pill border status-badge status-${p.status.replace(/\s+/g, "-")}`}>
                          {p.status}
                        </span>
                      </div>

                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          
        </div>
      </div>
    
  );
}
