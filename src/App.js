import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";

// --- STORES & SERVICES ---
import UseLoadingStore from "./Store/LoadingController/Loadingstore";
import useUserStore from "./Store/UserStore/userStore";
import { RefreshToken } from "./Sender/Data/AuthenticationService";

// --- COMPONENTS ---
import LoadingOverlay from "./Components/LoadingOverlay";
import { senderSidebarData } from "./Sender/components/Rightsidebar";
import { hangerSidebarData } from "./Hanger/components/Sidebar";
import { adminSidebarData } from "./Admin/components/AdminSidebar";
import "./App.css";

// --- LAZY IMPORTS ---
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
const OrderDetails = lazy(() => import("./Sender/pages/OrderDetails").then((mod) => ({ default: mod.OrderDetails })));
const ChangePass = lazy(() => import("./Sender/pages/ChangePass"));
const Print = lazy(() => import("./Sender/pages/Print"));
const HangerOrders = lazy(() => import("./Hanger/pages/Orders"));
const PageNotFound = lazy(() => import("./Components/PageNotFound"));
const WarehouseList = lazy(() => import("./Hanger/pages/WarehouseList"));
const OrderRelease = lazy(() => import("./Hanger/pages/OrdersRelease"));
const RequestsReview = lazy(() => import("./Hanger/pages/RequestsReview"));
const HangerRequestDetails = lazy(() => import("./Hanger/pages/HangerRequestDetails"));
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
const ShipperProfile = lazy(() => import("./Sender/pages/ShipperProfile"));
const ConfirmChangedEmail = lazy(() => import("./Sender/pages/ConfirmChangedEmail"));
const OrdersPage = lazy(() => import("./Sender/pages/OrdersPage"));
const PickupRequestDetailsPage = lazy(() => import("./Sender/pages/PickupRequestDetailsPage"));

const MainLayout = ({ header: HeaderComponent, sidebarData }) => {
  return (
    <div className="layout">
      <Sidebar title="Stake Express" subtitle="لوحة التحكم" menuItems={sidebarData} />
      <div className="content">
        {HeaderComponent && <HeaderComponent />}
        <Outlet />
      </div>
    </div>
  );
};

const SessionRestorer = () => {
  const user = useUserStore((state) => state.User);
  const SetUser = useUserStore((state) => state.SetUser);
  const navigate = useNavigate();

  useEffect(() => {
    const restoreSession = async () => {
      // Check if user manually logged out
      const hasLoggedOut = sessionStorage.getItem('sessionRestoreAttempted');
      
      if (!user && !hasLoggedOut) {
        try {
          const response = await RefreshToken();
          if (response.Success && response.Data) {
            console.log("Session restored successfully");
            SetUser(response.Data);
            if (window.location.pathname === "/") {
              navigate("/home");
            }
          }
        } catch (error) {
          console.log("Failed to restore session", error);
        }
      }
    };

    restoreSession();
  }, []);

  return null;
};

const App = () => {
  // 1. Get Control Functions
  const { Show, Hide } = UseLoadingStore();

  // 2. Test Function
  const handleTest = () => {
    Show(); 
    setTimeout(() => {
      Hide();
    }, 3000);
  };
  
  return (
    <>
      {/* --- GLOBAL OVERLAYS --- */}
      <Toaster position="top-center" richColors closeButton duration={1500} theme="light"/>
      <LoadingOverlay />


      {/* --- ROUTER & APP CONTENT --- */}
      <Router>
        <SessionRestorer />
        <Suspense fallback={<LoadingOverlay isActive={true} />}>
          <Routes>
            {/* Public Auth */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Login />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Hanger Auth */}
            <Route path="/hanger/sign-up" element={<SignUp />} />
            <Route path="/hanger/sign-in" element={<SignIn />} />
            <Route path="/new-request" element={<NewRequestPage />} />
            <Route path="/Pickuporder" element={<PickupOrder />} />
            <Route path="/return" element={<ReturnPage />} />

            {/* Sender Layout */}
            <Route element={<MainLayout header={TopBar} sidebarData={senderSidebarData} />}>
              <Route path="/home" element={<Home />} />
              <Route path="/order" element={<Order />} />
              <Route path="/actions" element={<Actions />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/shipments" element={<Orders2 />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/profile" element={<ShipperProfile />} />
               <Route path="/order-details/:orderId" element={<OrderDetails />} />
            </Route>

            {/* Misc sender routes */}
            <Route>
             
              <Route path="/print/:orderId" element={<Print />} />
              <Route path="/request/:requestype/:id" element={<Request />} />
              <Route path="/change-password" element={<ChangePass />} />
              <Route path="/extchange-request" element={<ExtchangePage />} />
              <Route path="/pickuprequest/:id" element={<PickupRequestDetailsPage />} />
            </Route>

            <Route path="/confirm-email" element={<ConfirmEmailPage />} />
            <Route path="/confirm-changed-email" element={<ConfirmChangedEmail />} />
            
            {/* Hanger Layout */}
            <Route path="/hanger" element={<MainLayout header={TopBar} sidebarData={hangerSidebarData} />}>
              <Route path="orders" element={<HangerOrders />} />
              <Route path="scan" element={<Scan />} />
              <Route path="warehouseList" element={<WarehouseList />} />
              <Route path="operations" element={<OrdersPage />} />
              <Route path="release-orders" element={<OrderRelease />} />
              <Route path="requests-review" element={<RequestsReview />} />
              <Route path="request/:id" element={<HangerRequestDetails />} />
              <Route path="safe" element={<Safe />} />
            </Route>

            {/* Admin Layout */}
            <Route path="/admin" element={<MainLayout header={TopBar} sidebarData={adminSidebarData} />}>
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