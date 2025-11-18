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
  FaBan
} from 'react-icons/fa';
import useLanguageStore from '../../Store/LanguageStore/languageStore';
import translations from '../../Store/LanguageStore/translations';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../Store/UserStore/userStore';
import { Link } from 'react-router-dom';
import api from '../../utils/Api'
const Home = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang];
  const [ShipmentsStatus, SetShipmentsStatus] = useState(null);
  useEffect(() => {

    const fetchShipmentsStatus = async () => {
      try {
          const response=await api.get('/Shipments/get-shipment-status-statistics')
          const result=response.data.data;
         
          console.log('successful fetching shipments status', result);
          SetShipmentsStatus(result);
        
      } catch (err) {
        const message=err.response?.data.message
        console.log('error in fetching shipments status', err);
        console.log( message);
      } 
    }

    fetchShipmentsStatus();


  }, []);

  // Status configuration with colors, icons and keys
  const statusConfig = {
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
    waitingForPickup: {
      label: t.WaitingforPickup,
      color: 'blue',
      icon: FaClock,
      key: "WatingForPickup"
    },
    pickedUp: {
      label: t.PickedUp,
      color: 'green',
      icon: FaCheckCircle,
      key: "PickedUp"
    },
    inWarehouse: {
      label: t.InWarehouse,
      color: 'purple',
      icon: FaWarehouse,
      key: "InWarehouse"
    },
    onHold: {
      label: t.OnHold,
      color: 'orange',
      icon: FaExclamationCircle,
      key: "OnHold"
    },
    outForDelivery: {
      label: t.OutforDelivery,
      color: 'teal',
      icon: FaTruck,
      key: "OutForDelivery"
    },
    failedDelivery: {
      label: t.FailedDelivery,
      color: 'red',
      icon: FaExclamationTriangle,
      key: "FailedDelivery"
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
    delivered: {
      label: t.Delivered,
      color: 'green',
      icon: FaCheckCircle,
      key: "Delivered"
    },
    returned: {
      label: t.ReturningtoShipper,
      color: 'red',
      icon: FaUndo,
      key: "Returned"
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


  const amountNumber = 15420.5;
  const formattedAmount = new Intl.NumberFormat(
    lang === 'ar' ? 'ar-SA' : 'en-US',
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  ).format(amountNumber);

 
  return (
    <div className="home-container" dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
      {/* <h2 className="page-title">{t.home}</h2> */}

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

      <div className="orders-summary">
        {/* <h4>{t.ordersSummary}</h4> */}
        
        

        <div className="cards ">
          {ShipmentsStatus && Object.keys(statusConfig).map((statusKey) => {
            const config = statusConfig[statusKey];
            const IconComponent = config.icon;
            // Map the simplified key back to the original API response key
            const apiKey = `${statusKey}ShipmentsCount`;
            const count = ShipmentsStatus[apiKey] || 0;
            
            return (
              <Link to={"/shipments"} state={config.key} key={statusKey} className={`summary-card ${config.color}`} style={{textDecoration:'none'}}>
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

      {/* <StatusBarChartECharts onBarClick={handleBarClick} height={520} /> */}
    </div>
  );
};

export default Home;