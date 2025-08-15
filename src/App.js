import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Rightsidebar from './Sender/components/Rightsidebar';
import Order from './Sender/pages/Order';
import Actions from './Sender/pages/Actions';
import Wallet from './Sender/pages/Wallet';
import Home from './Sender/pages/Home';
import TopBar from './Sender/components/Topbar';
import Signup from './Sender/auth/pages/Signup' ; 
import Login from './Sender/auth/pages/Login';
import Sidebar from './Hanger/components/Sidebar';
import Header from './Hanger/components/Header';
import ShipmentUpdate from './Hanger/pages/ShipmentUpdate';
import './App.css';





const Layout = () => {
  const location = useLocation();
const isAuthPage = location.pathname === '/' || location.pathname === '/signup' || location.pathname === '/login';

  return (
    <div className='row'>
      <div className='col-10'>
        {!isAuthPage && <TopBar />}
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/login' element={<Login/>}></Route>
          <Route path="/home" element={<Home />} />
          <Route path="/order" element={<Order />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/shipment-update" element={<ShipmentUpdate />} />
          <Route path="/hanger" element={<HangerLayout />}>
          <Route index element={<ShipmentUpdate />} />

        </Route>
        </Routes>
      </div>
      {!isAuthPage && (
        <div className='col-2'>
          <Rightsidebar />
        </div>
      )}
    </div>
  );
};

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
}

const App = () => {
  return (
    <Router>
      <Layout />
      <Routes>
        <Route path="/hanger" element={<HangerLayout />} />
      </Routes>
    </Router>
  );
};

export default App;

