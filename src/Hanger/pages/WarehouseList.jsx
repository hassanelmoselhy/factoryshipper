import React, { useState, useMemo } from "react";
import { User, Search, CheckCircle, Clock, Package, Zap, Truck, Phone, MapPin, Box } from "lucide-react";
import './css/WarehouseList.css';

const shipments = [
  {
    id: 1,
    shipmentId: 'SHP-000842',
    customerName: 'أحمد محمد علي',
    customerPhone: '01012345678',
    governorate: 'القاهرة',
    city: 'المعادي',
    street: 'شارع 9',
    addressDetails: 'عمارة 5، الدور 3، شقة 12',
    content: 'حذاء رياضي',
    deliveryType: 'express',
    status: 'ready',
    arrived: '2025/01/15',
  },
  {
    id: 2,
    shipmentId: 'SHP-000843',
    customerName: 'فاطمة حسن',
    customerPhone: '01198765432',
    governorate: 'الجيزة',
    city: '6 أكتوبر',
    street: 'المحور المركزي',
    addressDetails: 'الحي الأول، فيلا 12',
    content: 'كتب وقرطاسية',
    deliveryType: 'normal',
    status: 'waiting',
    arrived: '2025/01/15',
  },
  {
    id: 3,
    shipmentId: 'SHP-000844',
    customerName: 'محمود سعيد',
    customerPhone: '01234567890',
    governorate: 'الإسكندرية',
    city: 'سموحة',
    street: 'شارع فوزي معاذ',
    addressDetails: 'بجوار كوبري الإبراهيمية',
    content: 'أجهزة إلكترونية',
    deliveryType: 'express',
    status: 'ready',
    arrived: '2025/01/14',
  },
  {
    id: 4,
    shipmentId: 'SHP-000845',
    customerName: 'سارة أحمد',
    customerPhone: '01555555555',
    governorate: 'القاهرة',
    city: 'مدينة نصر',
    street: 'شارع عباس العقاد',
    addressDetails: 'أمام وندر لاند، برج النخيل',
    content: 'ملابس وإكسسوارات',
    deliveryType: 'normal',
    status: 'ready',
    arrived: '2025/01/15',
  },
];

export default function WarehouseList() {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');

  // Toggle individual item selection
  const toggleSelection = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // Toggle all items selection
  const toggleSelectAll = () => {
    if (selectedItems.size === filteredShipments.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredShipments.map(s => s.id)));
    }
  };

  // Handle shipment click to view details
  const handleShipmentClick = (shipmentId) => {
    console.log('View shipment details:', shipmentId);
    // TODO: Navigate to shipment details or open modal
    // navigate(`/hanger/shipment/${shipmentId}`);
  };

  // Filter shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter(shipment => {
      const matchesSearch = 
        shipment.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.customerName.includes(searchTerm) ||
        shipment.customerPhone.includes(searchTerm) ||
        shipment.content.includes(searchTerm);
      
      const matchesStatus = 
        statusFilter === 'all' || shipment.status === statusFilter;

      const matchesDelivery = 
        deliveryFilter === 'all' || shipment.deliveryType === deliveryFilter;

      return matchesSearch && matchesStatus && matchesDelivery;
    });
  }, [searchTerm, statusFilter, deliveryFilter]);

  // Calculate stats
  const stats = useMemo(() => ({
    total: shipments.length,
    ready: shipments.filter(s => s.status === 'ready').length,
    waiting: shipments.filter(s => s.status === 'waiting').length,
    express: shipments.filter(s => s.deliveryType === 'express').length,
  }), []);

  return (
    <div className="warehouse-wrapper-improved">
      <div className="warehouse-container">
        
        {/* Header */}
        <div className="warehouse-header">
          <div className="header-content">
            <h2 className="page-title">الشحنات</h2>
            <p className="page-subtitle">إدارة ومتابعة الشحنات في المخزن</p>
          </div>
          <button className="btn-assign">
            <User size={18} />
            تعيين لمندوب ({selectedItems.size})
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon-wrapper">
              <Package size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">إجمالي الشحنات</div>
            </div>
          </div>
          
          <div className="stat-card stat-success">
            <div className="stat-icon-wrapper">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.ready}</div>
              <div className="stat-label">جاهز للشحن</div>
            </div>
          </div>
          
          <div className="stat-card stat-warning">
            <div className="stat-icon-wrapper">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.waiting}</div>
              <div className="stat-label">قيد الانتظار</div>
            </div>
          </div>
          
          <div className="stat-card stat-info">
            <div className="stat-icon-wrapper">
              <Zap size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.express}</div>
              <div className="stat-label">توصيل سريع</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              className="search-input" 
              placeholder="ابحث برقم الشحنة، اسم العميل، رقم الهاتف أو المحتوى"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">جميع الحالات</option>
            <option value="ready">جاهز</option>
            <option value="waiting">قيد الانتظار</option>
          </select>

          <select 
            className="filter-select"
            value={deliveryFilter}
            onChange={(e) => setDeliveryFilter(e.target.value)}
          >
            <option value="all">جميع أنواع التوصيل</option>
            <option value="express">توصيل سريع</option>
            <option value="normal">توصيل عادي</option>
          </select>

          {selectedItems.size > 0 && (
            <div className="selection-info">
              تم تحديد {selectedItems.size} شحنة
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedItems.size > 0 && (
          <div className="bulk-actions-bar">
            <span className="bulk-count">تم تحديد {selectedItems.size} من {filteredShipments.length}</span>
            <div className="bulk-actions">
              <button className="bulk-btn bulk-btn-primary">
                <User size={16} />
                تعيين لمندوب
              </button>
              <button className="bulk-btn bulk-btn-secondary">
                <Truck size={16} />
                تغيير نوع التوصيل
              </button>
              <button 
                className="bulk-btn bulk-btn-ghost"
                onClick={() => setSelectedItems(new Set())}
              >
                إلغاء التحديد
              </button>
            </div>
          </div>
        )}

        {/* Shipments Table */}
        <div className="table-container">
          <div className="table-wrapper">
            <table className="shipments-table">
              <thead>
                <tr>
                  <th className="th-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === filteredShipments.length && filteredShipments.length > 0}
                      onChange={toggleSelectAll}
                      className="checkbox-input"
                    />
                  </th>
                  <th className="th-shipment-id">رقم الشحنة</th>
                  <th className="th-customer">اسم العميل</th>
                  <th className="th-phone">رقم الهاتف</th>
                  <th className="th-address">العنوان الكامل</th>
                  <th className="th-content">محتوى الشحنة</th>
                  <th className="th-delivery">نوع التوصيل</th>
                  <th className="th-status">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-row">
                      <div className="empty-state-table">
                        <Package size={48} className="empty-icon" />
                        <p className="empty-title">لا توجد شحنات</p>
                        <p className="empty-subtitle">جرب تغيير معايير البحث أو الفلتر</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map((shipment) => (
                    <tr 
                      key={shipment.id}
                      className={`table-row ${selectedItems.has(shipment.id) ? 'selected' : ''}`}
                    >
                      <td className="td-checkbox" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedItems.has(shipment.id)}
                          onChange={() => toggleSelection(shipment.id)}
                          className="checkbox-input"
                          aria-label={`تحديد ${shipment.shipmentId}`}
                        />
                      </td>
                      <td 
                        className="td-shipment-id"
                        onClick={() => handleShipmentClick(shipment.shipmentId)}
                      >
                        <span className="shipment-id-link">
                          <Box size={16} />
                          {shipment.shipmentId}
                        </span>
                      </td>
                      <td className="td-customer">
                        <div className="customer-info">
                          <span className="customer-name">{shipment.customerName}</span>
                        </div>
                      </td>
                      <td className="td-phone">
                        <div className="phone-info">
                          <Phone size={14} />
                          <span className="phone-number">{shipment.customerPhone}</span>
                        </div>
                      </td>
                      <td className="td-address">
                        <div className="address-info">
                          <MapPin size={14} className="address-icon" />
                          <div className="address-text">
                            <span className="address-main">{shipment.governorate} - {shipment.city}</span>
                            <span className="address-details">{shipment.street}، {shipment.addressDetails}</span>
                          </div>
                        </div>
                      </td>
                      <td className="td-content">
                        <span className="content-text">{shipment.content}</span>
                      </td>
                      <td className="td-delivery">
                        <span className={`delivery-badge delivery-${shipment.deliveryType}`}>
                          {shipment.deliveryType === 'express' ? (
                            <>
                              <Zap size={14} />
                              توصيل سريع
                            </>
                          ) : (
                            <>
                              <Truck size={14} />
                              توصيل عادي
                            </>
                          )}
                        </span>
                      </td>
                      <td className="td-status">
                        <span className={`status-badge status-${shipment.status}`}>
                          {shipment.status === 'ready' ? (
                            <>
                              <CheckCircle size={14} />
                              جاهز
                            </>
                          ) : (
                            <>
                              <Clock size={14} />
                              قيد الانتظار
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        {filteredShipments.length > 0 && (
          <div className="results-summary">
            عرض {filteredShipments.length} من {shipments.length} شحنة
          </div>
        )}
      </div>
    </div>
  );
}

