import React, { useState } from "react";
import {
  UserCheck,
  TrendingUp,
  Trophy,
  Users,
  Search,
  Download,
  Funnel,
  Plus
} from "lucide-react";
import MerchantsTable from "../components/MerchantsTable";
import DropDownList from "../../Components/DropDownList";
import AddMerchantModal from "../components/AddMerchantModal";
import "./css/merchants.css";
const egypt_governorates = [
     "Cairo", 
     "Alexandria", 
    "Port Said",
     "Suez",
   "Luxor", 
     "Dakahlia", 
    "Sharqia",
     "Qalyubia",
   "Damietta",
     "Beheira",
     "Gharbia",
     "Monufia",
     "Kafr El Sehg",
     "Giza",
     "Faiyum",
     "Beni Suef",
     "Minya", 
     "Asyut", 
     "Sohag", 
     "Qena",
     "Red Sea",
     "New Valley",
     "Matrouh",
     "North Sina" ,
     "South Sina" 
  ];
  const Account_statuses=[
    "نشط",
    "موقوف"
  ]
function Merchants() {
  const [showAddModal, setShowAddModal] = useState(false);
  // Temporary state for demo purposes until API integration
  const [merchantsData, setMerchantsData] = useState(null); 

  const handleSaveMerchant = (newMerchant) => {
    console.log("New Merchant Saved:", newMerchant);
    // In a real app, you would reload the table data here
    // For now we just log it as per plan
    
    // Example of appending to local list if we had one in state
    // setMerchantsData(prev => [newMerchant, ...prev]);
  };

  return (
    <div className="p-5 container merchantscontainer">
      <AddMerchantModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveMerchant}
      />

      {/**Header */}
      <div className="mb-2">
        <h1 className="border-0 fs-3 fw-bold">إدارة التجار</h1>
        <p className="text-mutes">إدارة حسابات التجار والشركات</p>
      </div>

      {/**Cards Container */}
      <div className="row g-3 mb-4" dir="rtl">
        {/* Card 1 */}
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card  border rounded-4">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div className="d-flex flex-column align-items-end">
                <p className="fs-6 text-muted mb-1">مجموع التجار</p>
                <p className="h3 mb-0 text-primary">487</p>
              </div>

              <div
                className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                style={{
                  width: 48,
                  height: 48,
                }}
                aria-hidden="true"
              >
                {/* users icon (from original svg) */}
                <Users size={24} style={{ color: "#0846AA" }} />
              </div>
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card  border rounded-3">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div className="d-flex flex-column align-items-end">
                <p className="fs-6 text-muted mb-1">التجار النشطون</p>
                <p
                  className="h3 mb-0 text-success"
                  style={{ color: "#10B981" }}
                >
                  89
                </p>
              </div>
              <div
                className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "rgba(16,185,129,0.08)",
                  width: 48,
                  height: 48,
                }}
                aria-hidden="true"
              >
                {/* user-check icon */}
                <UserCheck size={24} style={{ color: "#10B981" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card  border rounded-3">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div className="d-flex flex-column align-items-end">
                <p className="fs-6 text-muted mb-1">متوسط المبيعات</p>
                <p
                  className="h3 mb-0"
                  style={{ color: "#F97316", fontWeight: 600 }}
                >
                  ١٥٠٬٦٨٨ ج.م
                </p>
              </div>
              <div
                className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                style={{
                  width: 48,
                  height: 48,
                }}
                aria-hidden="true"
              >
                {/* trending-up icon */}
                <TrendingUp size={24} style={{ color: "#F97316" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card  border rounded-3">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div className="d-flex flex-column align-items-end">
                <p className="fs-6 text-muted mb-1">أعلى تاجر مبيعاً</p>
                <p className="fs-5 mb-0 text-primary colorpurple">
                  أثاث العصر الحديث
                </p>
              </div>
              <div
                className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                style={{
                  width: 48,
                  height: 48,
                }}
                aria-hidden="true"
              >
                {/* trophy icon */}
                <Trophy size={24} style={{ color: "#6D28D9" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column gap-3 mb-4">
        {/**Search bar */}
        <div className="d-flex gap-3 align-items-center">
          <button 
            className="btn btn-primary d-flex gap-2 align-items-center rounded-3 fw-bold px-3"
            onClick={() => setShowAddModal(true)}
          >
            إضافة تاجر
            <Plus size={20} />
          </button>

          <button className="btn  d-flex gap-2 align-items-center border rounded-3 exportbtn">
            تصدير
            <Download size={24} />
          </button>
          <div className="flex-fill position-relative">
           
            <input
              type="text"
              className="form-control text-end"
              placeholder="ابحث باسم التاجر,الأسم التجاري,رقم الهاتف"
            />
             <Search
              size={20}
              className="position-absolute top-50 translate-middle-y  text-muted"
              style={{ left: "0.75rem" }} 
              aria-hidden="true"
            />
          </div>
        </div>

        {/**Filters */}
        <div className="d-flex align-items-center justify-content-end gap-3 flex-wrap">
          <div>
            <DropDownList placeholder={"النشاط التجاري"} />
          </div>

          <div>
            <DropDownList placeholder={"حالة الحساب"} options={Account_statuses}/>
          </div>

          <div>
            <DropDownList placeholder={"المدينة / المحافظة"} options={egypt_governorates}/>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span>:فلترة</span>
            <Funnel size={16} />
          </div>
        </div>

                {/** merchants Table */}
        <MerchantsTable data={merchantsData || undefined} />
      </div>
    </div>
  );
}

export default Merchants;
