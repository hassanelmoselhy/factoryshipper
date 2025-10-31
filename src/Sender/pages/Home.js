import React, { useEffect, useState } from 'react';
import './css/Home.css';
import { 
  FaWallet, 
  FaCheckCircle, 
  FaClock, 
  FaGift, 
  FaExclamationCircle,
  FaShippingFast,
  FaTimesCircle,
  FaWarehouse,
  FaTruck,
  FaUndo,
  FaBoxOpen,
  FaExclamationTriangle,
  FaBan
} from 'react-icons/fa';
import useLanguageStore from '../../Store/LanguageStore/languageStore';
import translations from '../../Store/LanguageStore/translations';
import soundUrl from "../../Sounds/videoplayback.mp3"; 

import useUserStore from '../../Store/UserStore/userStore';

const Home = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang];
  const [loading, Setloading] = useState(false);
  const user = useUserStore((state) => state.user);
  const [ShipmentsStatus, SetShipmentsStatus] = useState(null);

  useEffect(() => {
    const fetchShipmentsStatus = async () => {
      try {
        Setloading(true);
        const res = await fetch('https://stakeexpress.runasp.net/api/Shipments/get-shipment-status-statistics', {
          headers: {
            'X-Client-Key': 'web api',
            Authorization: `Bearer ${user?.token}`,
          }
        });
        const data = await res.json();
        if (res.ok) {
          console.log('successful fetching shipments status', data);
          SetShipmentsStatus(data.data);
        } else {
          console.log('error in fetching shipments status', data);
        }
      } catch (err) {
        console.log('error in fetching shipments status', err);
      } finally {
        Setloading(false);
      }
    }

    fetchShipmentsStatus();
  }, []);

  // Status configuration with colors and icons 
  const statusConfig = {
    pendingShipmentsCount: {
      label: t.Pending ,
      color: 'yellow',
      icon: FaClock
    },
    canceledShipmentsCount: {
      label: t.Canceled ,
      color: 'red',
      icon: FaTimesCircle
    },
    waitingForPickupShipmentsCount: {
      label: t.WaitingforPickup,
      color: 'blue',
      icon: FaClock
    },
    pickedUpShipmentsCount: {
      label: t.PickedUp ,
      color: 'green',
      icon: FaCheckCircle
    },
    inWarehouseShipmentsCount: {
      label: t.InWarehouse,
      color: 'purple',
      icon: FaWarehouse
    },
    onHoldShipmentsCount: {
      label: t.OnHold,
      color: 'orange',
      icon: FaExclamationCircle
    },
    outForDeliveryShipmentsCount: {
      label: t.OutforDelivery,
      color: 'teal',
      icon: FaTruck
    },
    failedDeliveryShipmentsCount: {
      label: t.FailedDelivery ,
      color: 'red',
      icon: FaExclamationTriangle
    },
    returningToWarehouseShipmentsCount: {
      label: t.ReturningtoWarehouse,
      color: 'orange',
      icon: FaUndo
    },
    returningToShipperShipmentsCount: {
      label: t.ReturningtoShipper ,
      color: 'red',
      icon: FaUndo
    },
    deliveredShipmentsCount: {
      label: t.Delivered ,
      color: 'green',
      icon: FaCheckCircle
    },
    returnedShipmentsCount: {
      label: t.ReturningtoShipper ,
      color: 'red',
      icon: FaUndo
    },
    lostShipmentsCount: {
      label: t.Lost ,
      color: 'red',
      icon: FaExclamationTriangle
    },
    damagedShipmentsCount: {
      label: t.Damaged ,
      color: 'red',
      icon: FaBan
    }
  };


  const amountNumber = 15420.5;
  const formattedAmount = new Intl.NumberFormat(
    lang === 'ar' ? 'ar-SA' : 'en-US',
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  ).format(amountNumber);

 
  return (
    <div className="home-container" dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
      <h2 className="page-title">{t.home}</h2>

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
        <h4>{t.ordersSummary}</h4>
        <div className="tabs">
          <button className="tab active">{t.today}</button>
          <button className="tab">{t.week}</button>
          <button className="tab">{t.month}</button>
        </div>

        <div className="cards">
          {ShipmentsStatus && Object.keys(statusConfig).map((statusKey) => {
            const config = statusConfig[statusKey];
            const IconComponent = config.icon;
            const count = ShipmentsStatus[statusKey] || 0;
            
            return (
              <div key={statusKey} className={`summary-card ${config.color}`}>
                <IconComponent className="summary-icon" />
                <p className="label">{config.label}</p>
                <p className="value">{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* <StatusBarChartECharts onBarClick={handleBarClick} height={520} /> */}
    </div>
  );
};

export default Home;