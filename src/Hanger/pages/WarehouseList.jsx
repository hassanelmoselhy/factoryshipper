import React from "react";
import { User,SquarePen,MapPin,Search   } from "lucide-react";
import './css/WarehouseList.css';

// Sample component that reproduces the provided design (RTL / Arabic)
// Requirements:
// 1) Install: npm i react-icons bootstrap
// 2) Import bootstrap in your index.js or index.html: import 'bootstrap/dist/css/bootstrap.min.css'
// 3) Create the accompanying CSS file `Warehouse.css` (content below) next to this component.

const orders = [
  {
    id: 1,
    orderNumber: 'ORD-000842',
    status: 'ready',
    product: 'حذاء رياضي',
    weight: '2.4 كجم',
    sku: 'MERCH-001',
    location: 'A-12',
    arrived: '2025/01/15',
  },
  {
    id: 2,
    orderNumber: 'ORD-000843',
    status: 'waiting',
    product: 'كتب وقرطاسية',
    weight: '1.2 كجم',
    sku: 'MERCH-002',
    location: 'B-05',
    arrived: '2025/01/15',
  },
];

export default function WarehouseList() {
  return (
    <div className="warehouse-wrapper p-4" >
      <div className="warehouse-card p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="m-0">المخزون</h4>
          <button className="assign-btn btn btn-secondary d-flex align-items-center gap-2">
            <User className="h-4 w-4 ml-2" aria-hidden="true"/>   تعيين لمندوب (0)
          </button>
        </div>

        <div className="filters d-flex align-items-center gap-3 mb-4 flex-column flex-md-row">
          
          

          <div className="search-wrapper flex-grow-1 position-relative">
            <input className="form-control search-input" placeholder="ابحث بالباركود أو رقم الطلب أو المحتوى" />
            <Search className="search-icon" />
          </div>
          
          <select className="form-select w-auto">
            <option>جميع الحالات</option>
            <option>جاهز</option>
            <option>قيد الانتظار</option>
          </select>
        </div>

        <div className="orders-list">
          {orders.map((o) => (
            <div key={o.id} className="order-item d-flex flex-column flex-md-row justify-content-between align-items-center p-3 mb-3 rounded rounded-md-lg">
              

              <div className="order-right d-flex align-items-center justify-content-between p-3 w-100 w-md-60">
                <div className="actions d-flex align-items-center gap-3">
                  
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="product-info text-end">
                  <div className="d-flex align-items-center gap-2">
                    <span className={`status-badge ${o.status === 'ready' ? 'badge-ready' : 'badge-waiting'}`}>{o.status === 'ready' ? 'جاهز' : 'قيد الانتظار'}</span>
                    <strong className="order-number">{o.orderNumber}</strong>
                  </div>
                  <div className="product-name text-muted mt-2">{o.product} • {o.weight}</div>
                  <div className="sku text-muted small mt-1">{o.sku}</div>
                </div>

               
                
              </div>

              <div className="order-left d-flex flex-column align-items-end p-3 me-md-3 w-100 w-md-40">
                <div className="location d-flex align-items-center mb-2">
                  <MapPin className="me-2 text-muted"/>  الموقع :{o.location}
                </div>
                <div className="arrived text-muted">وصل: {o.arrived}</div>
                <div className="mt-3">
                  <button className="btn  p-2 d-inline-flex align-items-center edit-btn"><SquarePen  className="ms-2" /> تعديل</button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

