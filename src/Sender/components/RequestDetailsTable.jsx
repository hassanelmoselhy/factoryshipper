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
                        <th>Order ID</th>
                        <th>customer</th>
                        <th>Phone</th>
                        <th>Description</th>
                        <th>governorate</th>
                        {/* <th>Qty</th>
                        <th>Weight</th> */}
                        <th>COD</th>
                        <th>Fast shipping</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      
                      { (shipments || []).map((p, idx) => (
                        <tr key={p?.id} >
                          <td >{idx + 1}</td>
                         
                          <td >
                            <Link className="order-link" to={`/order-details/${p.id}`} title="Go To Order Details">{p.id}</Link>
                          </td>
                          <td >{p.customerName}</td>
                          <td >{p.customerPhone}</td>
                          <td >{p.shipmentDescription}</td>
                          <td >{p.governorate}</td>
                          {/* <td >{p?.quantity||15}</td>
                          <td >{p.shipmentWeight||3}</td> */}
                          
                          <td >
                            <span className="pill-badge cod-badge">{p.collectionAmount}</span>
                          </td>
                          <td className="d-flex align-items-center justify-content-center">
                            <span className="pill-badge status-pending">{p.expressDeliveryEnabled===true?"Yes":"No"}</span>
                          </td>
                          <td  >{p?.createdAt.split('T')[0]}</td>

                        </tr>
                      ))}
                    
                    </tbody>
                  </table>
                </div>

        </section>

    </>
  )
}
