
import React from 'react';
import './css/Safe.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  TrendingDown,
  TrendingUp,
  DollarSign,
  Plus,
  Download ,
  FileText,
} from 'lucide-react';

function Safe() {
  return (
    <div className="mt-4 w-100" >
      
      <div className="row g-3 justify-content-end" style={{ width: '100%' }}>
        {/* Card 1 */}
        <div className="col-12 col-md-3">
          <div className="border p-4 rounded-4 h-100 position-relative stat-card">
            <div className="d-flex justify-content-end align-items-center mb-2">
              <TrendingDown size={20} strokeWidth={2} color="red" />
            </div>
            <div className="fs-4 fw-bold">١٥٠ جنيه</div>
            <div className="text-muted small">مصاريف تشغيل</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-12 col-md-3">
          <div className="border p-4 rounded-4 h-100 position-relative stat-card">
            <div className="d-flex justify-content-end align-items-center mb-2">
              <TrendingDown size={20} strokeWidth={2} color="blue" />
            </div>
            <div className="fs-4 fw-bold">٢٬٠٠٠ جنيه</div>
            <div className="text-muted small">المبالغ المُحوَّلة للمقر</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col-12 col-md-3">
          <div className="border p-4 rounded-4 h-100 position-relative stat-card">
            <div className="d-flex justify-content-end align-items-center mb-2">
              <TrendingUp size={20} strokeWidth={2} color="green" />
            </div>
            <div className="fs-4 fw-bold">٥٠٠ جنيه</div>
            <div className="text-muted small">إجمالي التحصيلات اليوم</div>
          </div>
        </div>

        {/* Card 4 (dollar card) */}
        <div className="col-12 col-md-3">
          <div
            className="border p-4 rounded-4 h-100 position-relative dollarcard"
            style={{
              background:
                'linear-gradient(90deg,#0ea55a,#0a7f3d)',
              color: '#fff',
              borderColor: 'transparent',
            }}
          >
            <div className="d-flex justify-content-end align-items-center mb-2">
              <DollarSign size={22} strokeWidth={1.6} color="rgba(255,255,255,0.95)" />
            </div>
            <div className="fs-4 fw-bold">١٥٬٤٢٠٫٥ جنيه</div>
            <div className="text-muted small" style={{ opacity: 0.9, color: 'rgba(255,255,255,0.95)' }}>
              الرصيد الحالي
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions card (appended) */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="border rounded-4 p-4 actions-card">
            <h5 className="mb-3  fw-bold">إجراءات سريعة</h5>

            <div className="d-flex flex-wrap  justify-content-end  align-items-center gap-2">
             

              

              <button className="btn btn-outline-secondary btn-pill d-flex align-items-center gap-2">
                تسوية يومية
              </button>
              <button className="btn btn-outline-secondary btn-pill d-flex align-items-center gap-2">
                مصروف تشغيل
                <FileText size={14} />
              </button>
              
              <button className="btn btn-outline-secondary btn-pill d-flex align-items-center gap-2">
                تسجيل سحب
               <TrendingDown size={14} strokeWidth={2}  />
              </button>

             <button className="btn  d-flex align-items-center gap-2  importantbtn">
                <Plus size={16} />
                تسجيل إيداع
              </button>

            </div>
          </div>
        </div>
      </div>

      <div className='mt-4 rounded-4 border '>
        <div className='p-4 d-flex flex-column gap-4' >
          <div className='d-flex justify-content-between items-center'>
                <button
      type="button"
      className="btn export-btn d-flex align-items-center gap-4 flex-row-reverse"
      
      aria-label="تصدير التقرير"
      title="تصدير التقرير"
    >
      <Download size={24} strokeWidth={1.8} />
      <span className="fs-5">تصدير التقرير</span>
    </button>

            <h3 className='fs-5 border-0' style={{fontWeight:500}}>المعاملات المالية</h3>
          </div>
          <div className="d-flex w-100 safefilterbar border p-2 gap-2 rounded-pill" >
  <button
    type="button"
    className="btn  flex-fill d-flex justify-content-center align-items-center filterbtn  fs-5 fw-bold"
  >
    اليوم
  </button>

  <button
    type="button"
    className="btn  flex-fill d-flex justify-content-center align-items-center filterbtn  fs-5 fw-bold"
  >
    هذا الأسبوع
  </button>

  <button
    type="button"
    className="btn  flex-fill d-flex justify-content-center align-items-center filterbtn  fs-5 fw-bold"
  >
    هذا الشهر
  </button>
              
              
              </div>

        </div>

{/**card container */}
      <div className='p-3 d-flex flex-column gap-3 '>

              {/**Card 1 */}
              <div className='p-3 d-flex align-items-center justify-content-between border rounded-4'>

                <div className='d-flex align-items-center gap-4'>
                <TrendingUp size={20} strokeWidth={2} color="green" />
                <div>
                  <div className='d-flex align-items-center gap-2 '>
                    <span className='fw-bold'>TX-20250115-01</span>
                    <span className='border px-2 rounded-pill'>تحصيل نقدي</span>
                  </div>

                <div className='mt-1 text-secondry fs-6'>
                <p>الموظف: employee-45</p>
                <p>الطلبات: ORD-000842</p>
                <p>تحصيل نقدي من مندوب</p>
                </div>

                </div>
                </div>

                <div >
                  <p style={{fontWeight:600,color:'#00a63e',fontSize:'1.125rem '}}>+٥٠٠ جنيه</p>
                  <p className='text-secondry fs-6'>١٥ يناير، ٠٣:٠٠ م</p>

                </div>


              </div>
      
              {/**Card 2*/}
              <div className='p-3 d-flex align-items-center justify-content-between border rounded-4'>

                <div className='d-flex align-items-center gap-4'>
                <TrendingDown size={20} strokeWidth={2} color="blue" />
                <div>
                  <div className='d-flex align-items-center gap-2 '>
                    <span className='fw-bold'>TX-20250115-01</span>
                    <span className='border px-2 rounded-pill'>تحصيل نقدي</span>
                  </div>

                <div className='mt-1 text-secondry fs-6'>
                <p>الموظف: employee-45</p>
                <p>الطلبات: ORD-000842</p>
                <p>تحصيل نقدي من مندوب</p>
                </div>

                </div>
                </div>

                <div >
                  <p style={{fontWeight:600,color:'red',fontSize:'1.125rem '}}>-٥٠٠ جنيه</p>
                  <p className='text-secondry fs-6'>١٥ يناير، ٠٣:٠٠ م</p>

                </div>


              </div>
              {/**Card 3*/}
              <div className='p-3 d-flex align-items-center justify-content-between border rounded-4'>

                <div className='d-flex align-items-center gap-4'>
                <TrendingDown size={20} strokeWidth={2} color="red" />
                <div>
                  <div className='d-flex align-items-center gap-2 '>
                    <span className='fw-bold'>TX-20250115-01</span>
                    <span className='border px-2 rounded-pill'>تحصيل نقدي</span>
                  </div>

                <div className='mt-1 text-secondry fs-6'>
                <p>الموظف: employee-45</p>
                <p>الطلبات: ORD-000842</p>
                <p>تحصيل نقدي من مندوب</p>
                </div>

                </div>
                </div>

                <div >
                  <p style={{fontWeight:600,color:'red',fontSize:'1.125rem '}}>-٢٬٠٠٠ جنيه</p>
                  <p className='text-secondry fs-6'>١٥ يناير، ٠٣:٠٠ م</p>

                </div>


              </div>
      
      
      
      </div>





      </div>
      


      <div className='p-5 border rounded-4 mt-4 h-100'>
            <h3 className='mb-4 fw-bold fs-5 border-0'>تسوية نهاية اليوم</h3>
              <div className='d-flex gap-3'>
              
              
              <div className='col-12 col-md-6'>
                <h4 className='border-0  fs-6 ' style={{fontWeight:500}}>إجراءات التسوية</h4>

    <div className='d-flex flex-column gap-3' dir='rtl' style={{ maxWidth: 700 }}>
                  
      <div className="mb-3">
        <label className="form-label fs-6 fw-medium">الرصيد الفعلي في الخزنة</label>
        <input
          type="text"
          className="form-control custom-input"
          placeholder="أدخل الرصيد الفعلي"
          aria-label="الرصيد الفعلي في الخزنة"
        />
      </div>

      <div className="mb-4">
        <label className="form-label fs-6 fw-medium">ملاحظات التسوية</label>
        <textarea
          className="form-control custom-textarea"
          placeholder="أي ملاحظات على التسوية"
          rows={4}
          aria-label="ملاحظات التسوية"
        />
      </div>

      <button
        type="button"
        className="btn primary-dark-btn w-100"
        
      >
        إتمام تسوية نهاية اليوم
      </button>
    </div>


                </div>




              <div className='col-12 col-md-6'>
              <h4 className='border-0  fs-6'  style={{fontWeight:500}}>ملخص اليوم</h4>
                <div className='d-flex flex-column gap-2'>

                <div className='d-flex justify-content-between'>
                  <span>١٣٬٢٧٠٫٥ جنيه</span>
                  <span className='text-secondry text-muted'>:الرصيد في بداية اليوم</span>
                </div>
                <div className='d-flex justify-content-between'>
                  <span className='text-success'>+٥٠٠  جنيه</span>
                  <span className='text-secondry text-muted'>:إجمالي التحصيلات</span>
                </div>
                <div className='d-flex justify-content-between'>
                  <span className='text-danger'>-٢٬٠٠٠ جنيه</span>
                  <span className='text-secondry text-muted'>:إجمالي التحويلات</span>
                </div>
                <div className='d-flex justify-content-between'>
                  <span className='text-danger'>-١٥٠ جنيه</span>
                  <span className='text-secondry text-muted'>:إجمالي المصروفات</span>
                </div>
                <hr className='my-2'/>
                  <div className='d-flex justify-content-between'>
                  <span>١٥٬٤٢٠٫٥ جنيه</span>
                  <span className='text-secondry text-muted ' style={{fontWeight:800}}>:الرصيد المتوقع</span>
                </div>
                </div>
              </div>

              </div>
              </div>
      </div>
      
  
  );
}

export default Safe;
