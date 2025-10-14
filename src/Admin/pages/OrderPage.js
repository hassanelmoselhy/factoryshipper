import React, { useState } from 'react';
import OrdersHeader from '../components/OrdersHeader';
import OrderStatusCards from '../components/OrderStatusCards';
import OrdersFilterBar from '../components/OrdersFilterBar';
import OrdersTable from '../components/OrdersTable';
import OrderDetailsModal from '../components/OrderDetailsModal';

import './css/OrderPage.css';

const OrderPage = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2025-001234',
      merchant: { name: 'الكترونيات أحمد', id: 'MER-001' },
      customer: { name: 'سارة أحمد', phone: '201234567890+' },
      route: 'فرع المعادي 2 - فرع مدينة نصر 1',
      status: 'تم التسليم',
      rider: 'محمد علي',
      riderId: 'RID-045',
      codAmount: '1,250',
      eta: 'PM 05:00 10/8/2025',
    },
    {
      id: 'ORD-2025-002135',
      merchant: { name: 'MER-015', id: 'MER-015' },
      customer: { name: 'N/A', phone: '201734567890+' },
      route: 'فرع الدقي -- يحيي ابوبكر الفرعي',
      status: 'في الطريق',
      rider: '',
      riderId: '',
      codAmount: '780',
      eta: 'N/A',
    },
    {
      id: 'ORD-2025-001236',
      merchant: { name: 'Home Decor Plus', id: 'MER-032' },
      customer: { name: 'Nour Mohamed', phone: '20156789012+' },
      route: 'Maadi Branch 2 -- Nasr City Branch 1',
      status: 'تم التسليم',
      rider: 'Khaled Ahmed',
      riderId: 'RID-023',
      codAmount: '2,340',
      eta: 'PM 07:00 10/7/2025',
    },
    {
      id: 'ORD-2025-00237',
      merchant: { name: 'Tech Solutions', id: 'MER-060' },
      customer: { name: 'Amr Yousef', phone: '201567890123+' },
      route: 'Dokki Branch -- Zamalek Sub-Branch',
      status: 'ملغي',
      rider: '',
      riderId: '',
      codAmount: '0',
      eta: 'N/A',
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const openModal = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const handleAssignRider = (orderId, riderName) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, rider: riderName } : order
      )
    );
  };

  // Filters State
  const [filters, setFilters] = useState({
    branches: 'All Branches',
    status: 'All Status',
    search: '',
  });

  // Handle Filter Change
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesBranch =
      filters.branches === 'All Branches' ||
      order.route.includes(filters.branches);

    const matchesStatus =
      filters.status === 'All Status' || order.status === filters.status;

    const matchesSearch =
      !filters.search ||
      Object.values(order).some((value) =>
        String(value).toLowerCase().includes(filters.search.toLowerCase())
      );

    return matchesBranch && matchesStatus && matchesSearch;
  });

  // Status Counts
  const statusCounts = orders.reduce(
    (acc, order) => {
      const status = order.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      acc.total = orders.length;
      return acc;
    },
    { total: 0, ملغي: 0, 'تم التسليم': 0, 'في الطريق': 0 }
  );

  return (
    <div className="orders-page-container">

      {/* 1 HEADER */}
      <OrdersHeader />

      {/* 2️ STATUS CARDS */}
      <OrderStatusCards statusCounts={statusCounts} />

      {/* 3️ FILTER BAR */}
      <OrdersFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        totalOrdersCount={filteredOrders.length}
      />

      {/* 4️⃣ ORDERS TABLE */}
      <OrdersTable orders={filteredOrders}  onViewDetails={openModal} />

      {/* MODAL */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={closeModal}
          onAssignRider={handleAssignRider}
        />
      )}
    </div>
  );
};

export default OrderPage;
