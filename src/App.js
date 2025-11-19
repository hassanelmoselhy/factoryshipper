// App.jsx
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

// Sidebar data can stay normal imports (they're small plain objects)
import { senderSidebarData } from "./Sender/components/Rightsidebar";
import { hangerSidebarData } from "./Hanger/components/Sidebar";
import { adminSidebarData } from "./Admin/components/AdminSidebar";

import { Toaster } from "sonner";
import LoadingOverlay from "./Sender/components/LoadingOverlay";
import UseLoadingStore from "./Store/LoadingController/Loadingstore";
import useUserStore from "./Store/UserStore/userStore";
import "./App.css";

// Lazy imports (pages & big components)
const Order = lazy(() => import("./Sender/pages/Order"));
const Actions = lazy(() => import("./Sender/pages/Actions"));
const Wallet = lazy(() => import("./Sender/pages/Wallet"));
const Home = lazy(() => import("./Sender/pages/Home"));
const TopBar = lazy(() => import("./Sender/components/Topbar"));
const Signup = lazy(() => import("./Sender/auth/pages/Signup"));
const Login = lazy(() => import("./Sender/auth/pages/Login"));
const PickupOrder = lazy(() => import("./Sender/pages/PickupOrder"));
const ReturnPage = lazy(() => import("./Sender/pages/ReturnPage"));
const Request = lazy(() => import("./Sender/pages/Request"));
const ExtchangePage = lazy(() => import("./Sender/pages/ExtchangePage"));
const ConfirmEmailPage = lazy(() => import("./Sender/pages/ConfirmEmailPage"));
const Scan = lazy(() => import("./Hanger/pages/Scan"));
const Reciver = lazy(() => import("./reciver/pages/reciver"));
const SignUp = lazy(() => import("./Hanger/auth/pages/HangerSignup"));
const SignIn = lazy(() => import("./Hanger/auth/pages/HangerSignin"));
const NewRequestPage = lazy(() => import("./Sender/pages/NewRequestPage"));
const ShippingPage = lazy(() => import("./Sender/pages/ShippingPage"));
const OrderDetails = lazy(() =>
  import("./Sender/pages/OrderDetails").then((mod) => ({ default: mod.OrderDetails }))
);
const ChangePass = lazy(() => import("./Sender/pages/ChangePass"));
const Print = lazy(() => import("./Sender/pages/Print"));
const HangerOrders = lazy(() => import("./Hanger/pages/Orders"));
const PageNotFound = lazy(() => import("./Components/PageNotFound"));
const WarehouseList = lazy(() => import("./Hanger/pages/WarehouseList"));
const OrdersPage = lazy(() => import("./Hanger/pages/OrdersPage"));
const OrderRelease = lazy(() => import("./Hanger/pages/OrdersRelease"));
const Safe = lazy(() => import("./Hanger/pages/Safe"));
const ForgetPassword = lazy(() => import("./Components/ForgetPassword"));
const ResetPassword = lazy(() => import("./Components/ResetPassword"));
const OrderPage = lazy(() => import("./Admin/pages/OrderPage"));
const BranchesPage = lazy(() => import("./Admin/pages/BranchesPage"));
const Merchants = lazy(() => import("./Admin/pages/merchants"));
const EmployeesRoles = lazy(() => import("./Admin/pages/EmployeesRoles"));
const ShippingPricing = lazy(() => import("./Admin/pages/ShippingPricing"));
const Settings = lazy(() => import("./Admin/pages/SettingsPage"));
const Sidebar = lazy(() => import("./Components/Sidebar"));
const Orders2 = lazy(() => import("./Sender/pages/order2"));
const ShipperProfile=lazy(()=>import("./Sender/pages/ShipperProfile"))
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
  const SetUser = useUserStore((state) => state.Setuser);
  const loading = UseLoadingStore((state) => state.Loading);

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <LoadingOverlay
        loading={loading}
        message="please wait..."
        color="#fff"
        size={44}
      />

      <Router>
        {/* ضع Suspense حول Routes أو حول أجزاء معينة لتتحكم بالـ fallback */}
        <Suspense >
          <Routes>
            {/* Public Auth */}
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

            {/* Sender Layout */}
            <Route
              element={
                <MainLayout header={TopBar} sidebarData={senderSidebarData} />
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/order" element={<Order />} />
              <Route path="/actions" element={<Actions />} />
              <Route path="/shipments" element={<Orders2 />} />
              <Route path="/wallet" element={<Wallet />} />
               <Route path="/profile" element={<ShipperProfile />} />
            </Route>

            {/* Misc sender routes */}
            <Route>
              <Route path="/order-details/:orderId" element={<OrderDetails />} />
              <Route path="/print/:orderId" element={<Print />} />
              <Route path="/request/:requestype/:id" element={<Request />} />
              <Route path="/change-password" element={<ChangePass />} />
              <Route path="/extchange-request" element={<ExtchangePage />} />
            </Route>

            <Route path="/confirm-email" element={<ConfirmEmailPage />} />

            {/* Hanger Layout */}
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

            {/* Admin Layout */}
            <Route
              path="/admin"
              element={
                <MainLayout header={TopBar} sidebarData={adminSidebarData} />
              }
            >
              <Route path="orders" element={<OrderPage />} />
              <Route path="branches" element={<BranchesPage />} />
              <Route path="shipping-pricing" element={<ShippingPricing />} />
              <Route path="merchants" element={<Merchants />} />
              <Route path="employees-roles" element={<EmployeesRoles />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Reciver */}
            <Route path="/reciver" element={<Reciver />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
};

export default App;
