import React, { useEffect, useState  } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import Order from './Sender/pages/Order';
import Actions from './Sender/pages/Actions';
import Wallet from './Sender/pages/Wallet';
import Home from './Sender/pages/Home';
import TopBar from './Sender/components/Topbar';
import Signup from './Sender/auth/pages/Signup';
import Login from './Sender/auth/pages/Login';
import PickupOrder from './Sender/pages/PickupOrder';
import ReturnPage from './Sender/pages/ReturnPage';



// import EmployeeMang from './Hanger/pages/EmployeeMang';
import Scan from './Hanger/pages/Scan';
// import HangerAttendance from './Hanger/pages/HangerAttendance';
// import DeliverySchedule from './Hanger/pages/DeliverySchedule';
import Reciver from './reciver/pages/reciver'; 
import SignUp from './Hanger/auth/pages/HangerSignup';
import SignIn from './Hanger/auth/pages/HangerSignin';

import NewRequestPage from './Sender/pages/NewRequestPage';
import ShippingPage from './Sender/pages/ShippingPage';
import useUserStore from './Store/UserStore/userStore';
import { OrderDetails } from './Sender/pages/OrderDetails';
import { Toaster } from "sonner";

import Print from './Sender/pages/Print'
import { scheduleRefreshToken } from "./utils/auth";
import HangerOrders from './Hanger/pages/Orders';
import PageNotFound from './Components/PageNotFound';
import WarehouseList from './Hanger/pages/WarehouseList';
import OrdersPage from './Hanger/pages/OrdersPage';
import OrderRelease from './Hanger/pages/OrdersRelease';
import Safe from './Hanger/pages/Safe';

// Admin Components

import OrderPage from './Admin/pages/OrderPage';
import BranchesPage from './Admin/pages/BranchesPage';

// Global Components
import Sidebar from './Components/Sidebar';
import {senderSidebarData} from './Sender/components/Rightsidebar';
import { hangerSidebarData } from './Hanger/components/Sidebar';
import { adminSidebarData } from './Admin/components/AdminSidebar';
import './App.css';

// لو عندك فانكشن اسمها shceduleRefreshToken لازم تكون مستوردة
// import { shceduleRefreshToken } from "./utils/auth"; 

const MainLayout = ({ header: HeaderComponent, sidebarData }) => {
  return (
    <div className="layout">
      <Sidebar
        title="Stake Express"
        subtitle="لوحة التحكم"
        menuItems={sidebarData}
      />
      <div className="content">
        {HeaderComponent && <HeaderComponent />}
        <Outlet />
      </div>
    </div>
  );
};


const App = () => {
  const user = useUserStore((state) => state.user);
  
  return (
    <>
      <Toaster position="top-right" richColors />
      <Router>
        <Routes>
          {/* <Route path="/" element={<SelectRole />} /> */}

          {/* Sender Auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />

          {/* Hanger Auth */}
          <Route path="/hanger/sign-up" element={<SignUp />} />
          <Route path="/hanger/sign-in" element={<SignIn />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/new-request" element={<NewRequestPage />} />
          
            <Route path="/Pickuporder" element={<PickupOrder />} />
            <Route path="/return" element={<ReturnPage />} />

             {/* -------- Sender Layout -------- */}
          <Route element={<MainLayout header={TopBar} sidebarData={senderSidebarData} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/order" element={<Order />} />
            <Route path="/actions" element={<Actions />} />
            <Route path="/wallet" element={<Wallet />} />
          </Route>

          <Route path="/order-details/:orderId" element={<OrderDetails />} />
          <Route path="/print/:orderId" element={<Print />} />

     {/* -------- Hanger Layout -------- */}
          <Route path="/hanger" element={<MainLayout header={TopBar} sidebarData={hangerSidebarData} />}>
            <Route path="orders" element={<HangerOrders />} />
            <Route path="scan" element={<Scan />} />
            <Route path="warehouseList" element={<WarehouseList />} />
            <Route path="operations" element={<OrdersPage />} />
            <Route path="release-orders" element={<OrderRelease />} />
            <Route path="safe" element={<Safe />} />
          </Route>



      {/* -------- Admin Layout -------- */}
          <Route path="/admin" element={<MainLayout header={TopBar} sidebarData={adminSidebarData} />}>
            <Route path="orders" element={<OrderPage />} />
            <Route path="branches" element={<BranchesPage />} />
          </Route>


          {/* Reciver */}
        
          <Route path="/reciver" element={<Reciver />} />
          
          
          <Route path="*" element={<PageNotFound />} />
        
        
        </Routes>
      </Router>
    </>
  );
};

export default App;
