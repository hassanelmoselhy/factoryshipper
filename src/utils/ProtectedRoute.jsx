// ProtectedRoute.jsx
import { Navigate, useLocation, Outlet } from "react-router-dom";
import useUserStore from "../Store/UserStore/userStore";

const ProtectedRoute = ({ children, redirectPath = "/" }) => {
  const user = useUserStore((state) => state.user);
  const location = useLocation();
  const isAuthenticated = !!user?.token;

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace state={{ from: location, unauthorized: true }} />;
  }

  // If the parent passed a layout or children (e.g. <ProtectedRoute><MainLayout/></ProtectedRoute>)
  // render that children (MainLayout should contain an <Outlet/> where nested routes will go).
  // Otherwise, render <Outlet/> directly to render nested route elements.
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
