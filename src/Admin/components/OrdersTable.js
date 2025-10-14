import React from 'react';
import OrdersTableItem from './OrdersTableItem';
import './css/OrdersTable.css';

const OrdersTable = ({ orders, onViewDetails }) => {
  return (
    <div className="orders-table-wrapper">
      <div className="orders-table-container card-base">
        <div className="table-header">
          <div className="header-item order-id">رقم الطلب</div>
          <div className="header-item merchant">التاجر</div>
          <div className="header-item customer-name">اسم العميل</div>
          <div className="header-item customer-phone">رقم الهاتف</div>
          <div className="header-item route">العنوان</div>
          <div className="header-item status">الحالة</div>
          <div className="header-item rider">المندوب</div>
          <div className="header-item cod-amount">المبلغ</div>
          <div className="header-item eta">وقت التسليم</div>
          <div className="header-item actions">اجراءات</div>
        </div>

        <div className="table-body">
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrdersTableItem
                key={order.id}
                order={order}
                onViewDetails={onViewDetails} // <---- مرّرنا الدالة هنا
              />
            ))
          ) : (
            <div className="no-orders">لا توجد طلبات بنفس التصنيف</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
