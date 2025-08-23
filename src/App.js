import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Rightsidebar from './Sender/components/Rightsidebar';
import Order from './Sender/pages/Order';
import Actions from './Sender/pages/Actions';
import Wallet from './Sender/pages/Wallet';
import Home from './Sender/pages/Home';
import TopBar from './Sender/components/Topbar';
import Signup from './Sender/auth/pages/Signup';
import Login from './Sender/auth/pages/Login';
import Sidebar from './Hanger/components/Sidebar';
import Header from './Hanger/components/Header';
import ShipmentUpdate from './Hanger/pages/ShipmentUpdate';
import HangerHome from './Hanger/pages/Home';
import EmployeeMang from './Hanger/pages/EmployeeMang';
import Scan from './Hanger/pages/Scan';
import HangerAttendance from './Hanger/pages/HangerAttendance';
import './App.css';
import DeliverySchedule from './Hanger/pages/DeliverySchedule';
import Reciver from './reciver/pages/reciver'; 
import SignUp from './Hanger/auth/pages/HangerSignup';
import SignIn from './Hanger/auth/pages/HangerSignin';

import ShippingPage from './Sender/pages/ShippingPage';

const SelectRole = () => {
  return (
    <div className="select-role-container">
      <h1>اختر نوع المستخدم</h1>
      <div className="role-buttons">
        <a href="/signup" className="role-btn sender-btn">🚚 Sender</a>
        <a href="/hanger/sign-up" className="role-btn hanger-btn">📦 Hanger</a>
        <a href="/reciver" className="role-btn reciver-btn">📬 Reciver</a>
      </div>
    </div>
  );
};

const SenderLayout = () => {
  return (
    <div className="row">
      <div className="col-10">
        <TopBar />
        <Outlet />
      </div>
      <div className="col-2">
        <Rightsidebar />
      </div>
    </div>
  );
};

// Layout للـ Hanger
const HangerLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-layout">
        <Header />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectRole />} />

        {/* Sender Auth */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Hanger Auth */}
        <Route path="/hanger/sign-up" element={<SignUp />} />
        <Route path="/hanger/sign-in" element={<SignIn />} />
          <Route path="/shipping" element={<ShippingPage />} />


        {/* Sender Layout */}
        <Route element={<SenderLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/order" element={<Order />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/wallet" element={<Wallet />} />

          {/* ✅ الصفحات الجديدة */}
        </Route>

        {/* Hanger Layout */}
        <Route path="/hanger" element={<HangerLayout />}>
          <Route path="home" element={<HangerHome />} /> 
          <Route path="update" element={<ShipmentUpdate />} />
          <Route path="employees" element={<EmployeeMang />} />
          <Route path="scan" element={<Scan />} />
          <Route path="attendance" element={<HangerAttendance />} />
          <Route path="schedule" element={<DeliverySchedule />} />
        </Route>

        {/* Reciver */}
        <Route path="/reciver" element={<Reciver />} />
      </Routes>
    </Router>
  );
};

export default App;
