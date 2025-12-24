import React from 'react'
import { Link } from 'react-router-dom'

export default function RequestDetailsTable({shipments,head}) {
  return (
    <>
        <section className="card orders-list">
          <div className="card-header small">
            <h4>{head}</h4>
          </div>

          <div className="table-responsive">
                  <table className="table orders-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Order No</th>
                        <th>Type</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Location</th>
                        <th>COD</th>
                        <th>Status</th>
                        <th>Attempts</th>
                        <th>Fast shipping</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      
                      { (shipments || []).map((p, idx) => (
                        <tr key={p?.orderNumber || p?.id} >
                          <td >{idx + 1}</td>
                         
                          <td >
                            <Link className="order-link" to={`/order-details/${p.orderNumber || p.id}`} title="Go To Order Details">
                                {p.orderNumber || p.id}
                            </Link>
                          </td>
                          <td >{p.orderType || "-"}</td>
                          <td >{p.customerName}</td>
                          <td >{p.customerPhone}</td>
                          <td >{p.city}{p.city && p.governorate ? " - " : ""}{p.governorate}</td>
                          
                          <td >
                            <span className="pill-badge cod-badge">{p?.collectionCashAmount ?? p?.collectionAmount ?? 0}</span>
                          </td>
                          <td >
                             <span className={`status-badge status-${(p.orderCurrentStatus || "Pending").toLowerCase()}`}>
                                {p.orderCurrentStatus || "Pending"}
                             </span>
                          </td>
                          <td >
                            {p.fulfillmentAttempts ?? 0}/3
                          </td>
                          <td>
                            <span className={`pill-badge ${p.expressDeliveryEnabled ? "status-success" : "status-pending"}`}>
                                {p.expressDeliveryEnabled === true ? "Yes" : "No"}
                            </span>
                          </td>
                          <td  >{p?.createdAt?.split('T')[0] || "-"}</td>

                        </tr>
                      ))}
                    
                    </tbody>
                  </table>
                </div>

        </section>

    </>
  )
}
