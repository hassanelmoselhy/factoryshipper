import React, { useEffect, useState } from 'react';
import './css/Home.css';
import { 
  FaWallet, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationCircle,
  FaTimesCircle,
  FaWarehouse,
  FaTruck,
  FaUndo,
  FaExclamationTriangle,
  FaBan,
  FaExchangeAlt,
  FaClipboardList,
  FaBox,
  FaShippingFast,
  FaMoneyBillWave,
  FaHourglassHalf
} from 'react-icons/fa';
import useLanguageStore from '../../Store/LanguageStore/languageStore';
import translations from '../../Store/LanguageStore/translations';
import { Link } from 'react-router-dom';
import api from '../../utils/Api'
import useUserStore from '../../Store/UserStore/userStore'; 
import { GetOrderStatusStatistics } from '../Data/OrdersService';
import DeliveryFailureReasons from '../components/DeliveryFailureReasons';
import SuccessFailureRate from '../components/SuccessFailureRate';

const Home = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang];
  const [ShipmentsStatus, SetShipmentsStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const user = useUserStore((state) => state.User);

  // Dummy data for features not yet connected to API
  const [balanceData] = useState({
    balance: 15420.50,
    successRate: 98,
    inProgressCount: 45,
    totalOrders: 234
  });

  useEffect(() => {
    // Fixed: Removed incorrect early return - fetch data regardless of user state
    const fetchOrderStatus = async () => {
      try {
        setLoading(true);
        console.log("fetching order status...");
        const res = await GetOrderStatusStatistics();
        if (res.Success) {
          console.log('order status statistics fetched successfully', res.Data);
          SetShipmentsStatus(res.Data);
        } else {
          console.log('error in fetching order status statistics', res.Message);
        }
      } catch (error) {
        console.error('Error fetching order status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderStatus();
  }, []);

  const statusConfig = {
    new: {
      label: "جديد",
      labelEn: "New",
      color: 'blue',
      icon: FaBox,
      key: "newOrdersCount",
      navigationKey: "Pending",
      description: lang === 'ar' ? 'شحنات جديدة في انتظار المعالجة' : 'New shipments awaiting processing'
    },
    inProgress: {
      label: "قيد التنفيذ",
      labelEn: "In Progress",
      color: 'orange',
      icon: FaTruck,
      key: "inProgressOrdersCount",
      navigationKey: "OutForDelivery",
      description: lang === 'ar' ? 'شحنات قيد التوصيل حالياً' : 'Shipments currently out for delivery'
    },
    success: {
      label: "تم بنجاح",
      labelEn: "Delivered",
      color: 'green',
      icon: FaCheckCircle,
      key: "completedOrdersCount",
      navigationKey: "Delivered",
      description: lang === 'ar' ? 'شحنات تم توصيلها بنجاح' : 'Successfully delivered shipments'
    },
    unsuccessful: {
      label: "غير ناجح",
      labelEn: "Returned",
      color: 'red',
      icon: FaTimesCircle,
      key: "failedOrdersCount",
      navigationKey: "Returned",
      description: lang === 'ar' ? 'شحنات تم إرجاعها' : 'Returned shipments'
    },
    stopped: {
      label: "المتوقف حاليا",
      labelEn: "On Hold",
      color: 'purple',
      icon: FaBan,
      key: "onHoldOrdersCount",
      navigationKey: "OnHold",
      description: lang === 'ar' ? 'شحنات متوقفة مؤقتاً' : 'Temporarily held shipments'
    }
  };

  // Balance Formatting
  const formattedAmount = new Intl.NumberFormat(
    lang === 'ar' ? 'ar-SA' : 'en-US',
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  ).format(balanceData.balance);

  // Calculate total shipments for percentage
  const totalShipments = ShipmentsStatus 
    ? Object.keys(statusConfig).reduce((sum, key) => {
        const apiKey = statusConfig[key].key;
        return sum + (ShipmentsStatus[apiKey] || 0);
      }, 0)
    : 0;

  return (
    <div className="home-container" dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
      
      {/* Balance Card Section */}
      <div className="balance-card">
        <div className="card-header">
          <p className="account-label">{t.accountBalance}</p>
          <FaWallet className="wallet-icon" />
        </div>
        <p className="sub-label">{t.availableBalance}</p>

        <p className="amount">
          {lang === 'ar' ? `ر.س ${formattedAmount}` : `SAR ${formattedAmount}`}
        </p>

        <div className="stats-row">
          <div className="stat-item">  
            <p>{t.successRate}</p>
            <span>{balanceData.successRate}%</span>
          </div>
          <div className="stat-item">
            <p>{t.inProgress}</p>
            <span>{balanceData.inProgressCount}</span>
          </div>
          <div className="stat-item">
            <p>{t.totalOrders}</p>
            <span>{balanceData.totalOrders}</span>
          </div>
        </div>
      </div>
{/* Orders Summary Grid */}
      <div className="orders-summary">
        <h3 className="summary-title">
          {lang === 'ar' ? 'ملخص الشحنات' : 'Shipment Summary'}
        </h3>
        <div className="cards">
          {loading ? (
            // Loading skeletons
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="summary-card skeleton">
                <div className="skeleton-icon"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-value"></div>
              </div>
            ))
          ) : (
            Object.keys(statusConfig).map((statusKey) => {
              const config = statusConfig[statusKey];
              const IconComponent = config.icon;
              
              const apiKey = config.key;
              const count = (ShipmentsStatus && ShipmentsStatus[apiKey]) || 0;
              const percentage = totalShipments > 0 
                ? Math.round((count / totalShipments) * 100) 
                : 0;
              
              return (
                <Link 
                  to={"/shipments"} 
                  state={config.navigationKey} 
                  key={statusKey} 
                  className={`summary-card ${config.color}`} 
                  style={{textDecoration:'none'}}
                  onMouseEnter={() => setHoveredCard(statusKey)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="card-content">
                    <IconComponent className="summary-icon" />
                    <p className="label">{config.label}</p>
                    <p className="value">{count}</p>
                    {percentage > 0 && (
                      <span className="percentage-badge">{percentage}%</span>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  {hoveredCard === statusKey && (
                    <div className="status-card-tooltip">
                      <p className="tooltip-title">{config.label}</p>
                      <p className="tooltip-description">{config.description}</p>
                      <div className="tooltip-stats">
                        <span>{lang === 'ar' ? 'العدد:' : 'Count:'} {count}</span>
                        <span>{lang === 'ar' ? 'النسبة:' : 'Percentage:'} {percentage}%</span>
                      </div>
                    </div>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </div>
      
      {/* Statistics Section */}
      <div className="statistics-grid">
        <DeliveryFailureReasons lang={lang} />
        <SuccessFailureRate lang={lang} />
      </div>

      
    </div>
  );
};

export default Home;