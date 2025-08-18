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
import EmployeeMang from './Hanger/EmployeeMang';

import './App.css';

const SelectRole = () => {
  return (
    <div className="select-role-container">
      <h1>اختر نوع المستخدم</h1>
      <div className="role-buttons">
        <a href="/signup" className="role-btn sender-btn">🚚 Sender</a>
        <a href="/hanger" className="role-btn hanger-btn">📦 Hanger</a>
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

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route element={<SenderLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/order" element={<Order />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/wallet" element={<Wallet />} />
        </Route>

        <Route path="/hanger" element={<HangerLayout />}>
  <Route index path="home" element={<HangerHome />} /> 
  <Route path="update" element={<ShipmentUpdate />} />
  <Route path="employees" element={<EmployeeMang />} />
</Route>

      </Routes>
    </Router>
  );
};

export default App;