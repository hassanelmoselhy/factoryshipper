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
  FaclipboardList
} from 'react-icons/fa';
import useLanguageStore from '../../Store/LanguageStore/languageStore';
import translations from '../../Store/LanguageStore/translations';
import { Link } from 'react-router-dom';
import api from '../../utils/Api'

const Home = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang];
  const [ShipmentsStatus, SetShipmentsStatus] = useState(null);

  useEffect(() => {
    const fetchShipmentsStatus = async () => {
      try {
          const response = await api.get('/Shipments/get-shipment-status-statistics');
          const result = response.data.data;
          SetShipmentsStatus(result);
      } catch (err) {
        const message = err.response?.data.message;
        console.log('error in fetching shipments status', err);
        console.log(message);
      } 
    }
    fetchShipmentsStatus();
  }, []);

  const statusConfig = {
    // --- Initial Stages ---
    pending: {
      label: t.Pending,
      color: 'yellow',
      icon: FaClock,
      key: "Pending"
    },
    canceled: {
      label: t.Canceled,
      color: 'red',
      icon: FaTimesCircle,
      key: "Canceled"
    },

    // --- Review Stages (New) ---
    inReviewForPickup: {
      label: t.InReviewForPickup,
      color: 'blue', 
      icon: FaClock,
      key: "InReviewForPickup"
    },
    inReviewForReturn: {
      label: t.InReviewForReturn,
      color: 'blue',
      icon: FaUndo,
      key: "InReviewForReturn"
    },
    inReviewForDelivery: {
      label: t.InReviewForDelivery,
      color: 'blue',
      icon: FaTruck,
      key: "InReviewForDelivery"
    },
    inReviewForCancellation: {
      label: t.InReviewForCancellation,
      color: 'orange', 
      icon: FaExclamationCircle,
      key: "InReviewForCancellation"
    },
    inReviewForExchange: {
      label: t.InReviewForExchange,
      color: 'orange',
      icon: FaExchangeAlt,
      key: "InReviewForExchange"
    },

    // --- Waiting Stages ---
    waitingForPickup: {
      label: t.WaitingforPickup, 
      color: 'teal',
      icon: FaClock,
      key: "WaitingForPickup"
    },
    waitingForReturn: {
      label: t.WaitingForReturn,
      color: 'teal',
      icon: FaClock,
      key: "WaitingForReturn"
    },
    waitingForExchange: {
      label: t.WaitingForExchange,
      color: 'teal',
      icon: FaClock,
      key: "WaitingForExchange"
    },
    waitingForDelivery: {
      label: t.WaitingForDelivery,
      color: 'teal',
      icon: FaClock,
      key: "WaitingForDelivery"
    },

    // --- Active Logistics ---
    pickedUp: {
      label: t.PickedUp,
      color: 'purple',
      icon: FaCheckCircle,
      key: "PickedUp"
    },
    inWarehouse: {
      label: t.InWarehouse,
      color: 'purple',
      icon: FaWarehouse,
      key: "InWarehouse"
    },
    outForDelivery: {
      label: t.OutforDelivery,
      color: 'teal',
      icon: FaTruck,
      key: "OutForDelivery"
    },
    delivered: {
      label: t.Delivered,
      color: 'green',
      icon: FaCheckCircle,
      key: "Delivered"
    },

    // --- Returns & Exchanges ---
    returned: {
      label: t.Returned,
      color: 'red',
      icon: FaUndo,
      key: "Returned"
    },
    exchanged: {
      label: t.Exchanged,
      color: 'green',
      icon: FaExchangeAlt,
      key: "Exchanged"
    },
    returningToWarehouse: {
      label: t.ReturningtoWarehouse,
      color: 'orange',
      icon: FaUndo,
      key: "ReturningToWarehouse"
    },
    returningToShipper: {
      label: t.ReturningtoShipper, 
      color: 'red',
      icon: FaUndo,
      key: "ReturningToShipper"
    },

    // --- Exceptions ---
    onHold: {
      label: t.OnHold,
      color: 'orange',
      icon: FaExclamationCircle,
      key: "OnHold"
    },
    failedDelivery: {
      label: t.FailedDelivery,
      color: 'red',
      icon: FaExclamationTriangle,
      key: "FailedDelivery"
    },
    lost: {
      label: t.Lost,
      color: 'red',
      icon: FaExclamationTriangle,
      key: "Lost"
    },
    damaged: {
      label: t.Damaged,
      color: 'red',
      icon: FaBan,
      key: "Damaged"
    }
  };

  // Balance Formatting
  const amountNumber = 15420.5;
  const formattedAmount = new Intl.NumberFormat(
    lang === 'ar' ? 'ar-SA' : 'en-US',
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  ).format(amountNumber);

 
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
            <span>98%</span>
          </div>
          <div className="stat-item">
            <p>{t.inProgress}</p>
            <span>45</span>
          </div>
          <div className="stat-item">
            <p>{t.totalOrders}</p>
            <span>45</span>
          </div>
        </div>
      </div>

      {/* Orders Summary Grid */}
      <div className="orders-summary">
        <div className="cards">
          {ShipmentsStatus && Object.keys(statusConfig).map((statusKey) => {
            const config = statusConfig[statusKey];
            const IconComponent = config.icon;
            
            const apiKey = `${config.key}ShipmentsCount`;
            const count = ShipmentsStatus[apiKey] || 0;
            
            return (
              <Link 
                to={"/order"} 
                state={config.key} 
                key={statusKey} 
                className={`summary-card ${config.color}`} 
                style={{textDecoration:'none'}}
              >
                <div>
                  <IconComponent className="summary-icon" />
                  <p className="label">{config.label}</p>
                  <p className="value">{count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;