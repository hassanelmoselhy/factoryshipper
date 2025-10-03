import React, { useEffect } from 'react';
import './css/Home.css';
import { FaWallet, FaCheckCircle, FaClock, FaGift, FaExclamationCircle } from 'react-icons/fa';
import useLanguageStore from '../../Store/LanguageStore/languageStore';
import translations from '../../Store/LanguageStore/translations';
import soundUrl from "../../Sounds/videoplayback.mp3"; 

const Home = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang];



useEffect(()=>{

  const audio = new Audio(soundUrl).play();
},[])

  // تنسيق الأرقام حسب اللغة (اختياري لكن جميل)
  const amountNumber = 15420.5;
  const formattedAmount = new Intl.NumberFormat(
    lang === 'ar' ? 'ar-SA' : 'en-US',
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  ).format(amountNumber);

  return (
    // نحدد dir و lang هنا حتى العناصر الداخلية تتصرف تلقائياً
    <div className="home-container" dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
      <h2 className="page-title">{t.home}</h2>

      <div className="balance-card">
        <div className="card-header">
          <p className="account-label">{t.accountBalance}</p>
          <FaWallet className="wallet-icon" />
        </div>
        <p className="sub-label">{t.availableBalance}</p>

        {/* نعرض العملة بشكل مناسب حسب اللغة */}
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
          <div className="summary-card yellow">
            <FaClock className="summary-icon" />
            <p className="label">{t.inProgress}</p>
            <p className="value">33</p>
          </div>

          <div className="summary-card blue">
            <FaGift className="summary-icon" />
            <p className="label">{t.grant}</p>
            <p className="value">10</p>
          </div>

          <div className="summary-card green">
            <FaCheckCircle className="summary-icon" />
            <p className="label">{t.successOrders}</p>
            <p className="value">89</p>
          </div>

          <div className="summary-card red">
            <FaExclamationCircle className="summary-icon" />
            <p className="label">{t.pendingDecision}</p>
            <p className="value">7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
