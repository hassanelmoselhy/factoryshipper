import React, { useEffect, useState  } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Rightsidebar from './Sender/components/Rightsidebar';
import Order from './Sender/pages/Order';
import Actions from './Sender/pages/Actions';
import Wallet from './Sender/pages/Wallet';
import Home from './Sender/pages/Home';
import TopBar from './Sender/components/Topbar';
import Signup from './Sender/auth/pages/Signup';
import Login from './Sender/auth/pages/Login';
import PickupOrder from './Sender/pages/PickupOrder';

import Sidebar from './Hanger/components/Sidebar';
import Header from './Hanger/components/Header';
import ShipmentUpdate from './Hanger/pages/ShipmentUpdate';
// import EmployeeMang from './Hanger/pages/EmployeeMang';
import Scan from './Hanger/pages/Scan';
// import HangerAttendance from './Hanger/pages/HangerAttendance';
import './App.css';
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
import ReturnPage from './Sender/pages/ReturnPage';

// Admin Components
import AdminSidebar from './Admin/components/AdminSidebar';
import AdminNavbar from './Admin/components/AdminNavbar'; 
import OrderPage from './Admin/pages/OrderPage';


// لو عندك فانكشن اسمها shceduleRefreshToken لازم تكون مستوردة
// import { shceduleRefreshToken } from "./utils/auth"; 

const SenderLayout = () => {
  return (
    <div className="row ">
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
    <div className="row p-0 m-0">
      <div className="col-10 m-0">
        <Header />
        <Outlet />
        </div>
        <div className="col-2">
        <Sidebar />
        </div>
      </div>
  );
};

// Admin Layout
const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const toggleAdminSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
//   return (
//     <div className="row p-0 m-0">
//       <div className="col-10 m-0">
//         <AdminNavbar />
//         <Outlet />
//         </div>
//         <div className="col-2">
//         <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleAdminSidebar} />
//         <div className={`${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//         </div>
//         </div>
//       </div>
//   );
// };
  return (
    <div className="row ">
      <div className="col-10">
        <AdminNavbar />
        <Outlet />
      </div>
      <div className="col-2">
        <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleAdminSidebar} className={`${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}/>
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

          {/* Sender Layout */}
          <Route element={<SenderLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/order" element={<Order />} />
            <Route path="/actions" element={<Actions />} />
            <Route path="/wallet" element={<Wallet />} />
          </Route>

          <Route path="/order-details/:orderId" element={<OrderDetails />} />
          <Route path="/print/:orderId" element={<Print />} />

          {/* Hanger Layout */}
          <Route path="/hanger" element={<HangerLayout />}>
            <Route path="orders" element={<HangerOrders />} /> 
            <Route path="update" element={<ShipmentUpdate />} />
            {/* <Route path="employees" element={<EmployeeMang />} /> */}
            <Route path="scan" element={<Scan />} />
            {/* <Route path="attendance" element={<HangerAttendance />} /> */}
            {/* <Route path="schedule" element={<DeliverySchedule />} /> */}
            <Route path="warehouseList" element={<WarehouseList />} />
            <Route path="operations" element={<OrdersPage />} />
            <Route path="Safe" element={<Safe />} />


            {/* <Route path="attendance" element={<HangerAttendance />} />
            <Route path="schedule" element={<DeliverySchedule />} /> */}
            <Route path="release-orders" element={<OrderRelease />} />
          </Route>

          {/* Admin Layout */}
          <Route path="/admin" element={<AdminLayout />}>
          <Route path="orders" element={<OrderPage />} />
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
