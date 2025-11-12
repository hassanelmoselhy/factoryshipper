import  { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Order from "./Sender/pages/Order";
import Actions from "./Sender/pages/Actions";
import Wallet from "./Sender/pages/Wallet";
import Home from "./Sender/pages/Home";
import TopBar from "./Sender/components/Topbar";
import Signup from "./Sender/auth/pages/Signup";
import Login from "./Sender/auth/pages/Login";
import PickupOrder from "./Sender/pages/PickupOrder";
import ReturnPage from "./Sender/pages/ReturnPage";
import Request from "./Sender/pages/Request";
import ExtchangePage from "./Sender/pages/ExtchangePage";
import ConfirmEmailPage from "./Sender/pages/ConfirmEmailPage";

import Scan from "./Hanger/pages/Scan";

import Reciver from "./reciver/pages/reciver";
import SignUp from "./Hanger/auth/pages/HangerSignup";
import SignIn from "./Hanger/auth/pages/HangerSignin";

import NewRequestPage from "./Sender/pages/NewRequestPage";
import ShippingPage from "./Sender/pages/ShippingPage";
import useUserStore from "./Store/UserStore/userStore";
import { OrderDetails } from "./Sender/pages/OrderDetails";
import { Toaster } from "sonner";

import ChangePass from "./Sender/pages/ChangePass";
import Print from "./Sender/pages/Print";
import HangerOrders from "./Hanger/pages/Orders";
import PageNotFound from "./Components/PageNotFound";
import WarehouseList from "./Hanger/pages/WarehouseList";
import OrdersPage from "./Hanger/pages/OrdersPage";
import OrderRelease from "./Hanger/pages/OrdersRelease";
import Safe from "./Hanger/pages/Safe";
import ForgetPassword from "./Components/ForgetPassword";
import ResetPassword from "./Components/ResetPassword";
// Admin Components

import OrderPage from "./Admin/pages/OrderPage";
import BranchesPage from "./Admin/pages/BranchesPage";
import Merchants from "./Admin/pages/merchants";
import EmployeesRoles from "./Admin/pages/EmployeesRoles";
import ShippingPricing from "./Admin/pages/ShippingPricing";
import Settings from "./Admin/pages/SettingsPage";

// Global Components
import Sidebar from "./Components/Sidebar";
import { senderSidebarData } from "./Sender/components/Rightsidebar";
import { hangerSidebarData } from "./Hanger/components/Sidebar";
import { adminSidebarData } from "./Admin/components/AdminSidebar";
import "./App.css";

import ProtectedRoute from "./utils/ProtectedRoute";


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
  const SetUser=useUserStore((state)=>state.Setuser)


  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Router>
        <Routes>
          {/* <Route path="/" element={<SelectRole />} /> */}

          {/* Sender Auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Hanger Auth */}
          <Route path="/hanger/sign-up" element={<SignUp />} />
          <Route path="/hanger/sign-in" element={<SignIn />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/new-request" element={<NewRequestPage />} />

          <Route path="/Pickuporder" element={<PickupOrder />} />
          <Route path="/return" element={<ReturnPage />} />

          {/* -------- Sender Layout -------- */}
       {/* parent route */}
          <Route
            element={
              
                <MainLayout header={TopBar} sidebarData={senderSidebarData} />
            
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/order" element={<Order />} />
            <Route path="/actions" element={<Actions />} />
            <Route path="/wallet" element={<Wallet />} />
          </Route>
 {/* parent route */}
            <Route  > 

          <Route path="/order-details/:orderId" element={<OrderDetails />} />
          <Route path="/print/:orderId" element={<Print />} />
          <Route path="/request/:requestype/:id" element={<Request />} />
          <Route path="/change-password" element={<ChangePass />} />
          <Route path="/extchange-request" element={<ExtchangePage />} />
            </Route>
          <Route path="/confirm-email" element={<ConfirmEmailPage />} />

          {/* -------- Hanger Layout -------- */}
          <Route
            path="/hanger"
            element={
              <MainLayout header={TopBar} sidebarData={hangerSidebarData} />
            }
          >
            <Route path="orders" element={<HangerOrders />} />
            <Route path="scan" element={<Scan />} />
            <Route path="warehouseList" element={<WarehouseList />} />
            <Route path="operations" element={<OrdersPage />} />
            <Route path="release-orders" element={<OrderRelease />} />
            <Route path="safe" element={<Safe />} />
          </Route>

          {/* -------- Admin Layout -------- */}
          <Route
            path="/admin"
            element={
              <MainLayout header={TopBar} sidebarData={adminSidebarData} />
            }
          >
            <Route path="orders" element={<OrderPage />} />
            <Route path="branches" element={<BranchesPage />} />

            <Route path="shipping-pricing" element={<ShippingPricing />} />
            {/* <Route path="merchants" element={<TestP />} /> */}
            <Route path="merchants" element={<Merchants />} />
            <Route path="employees-roles" element={<EmployeesRoles />} />
            {/* <Route path="merchants" element={<TestP />} /> */}
            <Route path="settings" element={<Settings />} />
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